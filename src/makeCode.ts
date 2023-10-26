import * as fs from 'fs';
import { getUrlAndmethods } from './lib/getUrlAndmethods';
import { readFiles } from "./lib/readFiles";
import { createRoutePath, createValidVariableName } from "./lib/utils";


export type nnProps = {
    startDirName: string;
}
type getSourceCodeType = (urlAndmethods: {
    filename: string;
    exportFunctions: string[];
}[], startDirName: string, lang: 'ts' | 'js') => Promise<string>;
const getSourceCode: getSourceCodeType = async (urlAndmethods, startDirName, lang) => {
    let newCode1 = urlAndmethods.map(({ filename }) => {
        const regexpdottsjs = new RegExp(`.${lang}$`)

        const formUrl = filename.replace(/^src/, '.').replace(regexpdottsjs, '');
        const inputVarialbeName = createValidVariableName(filename);
        if (lang == 'ts') {
            return (`import * as ${inputVarialbeName} from '${formUrl}';`)
        } else {
            return (`const * as ${inputVarialbeName} =require('${formUrl}');`)
        }
    });
    let newCode2: string[] = []
    urlAndmethods.forEach(({ filename, exportFunctions }) => {
        const inputVarialbeName = createValidVariableName(filename);
        let apiUrl = createRoutePath({ name: filename, startDirName: startDirName }, lang)
        exportFunctions.forEach(method => {
            newCode2.push(`router.${method.toLowerCase()}('${apiUrl}', ${inputVarialbeName}.${method});`)
        })
    });
    return ([...newCode1, '\n\n\n', ...newCode2].join('\n '))
}


const makeCode = ({ startDirName }: nnProps, lang: 'ts' | 'js') => {
    return new Promise(async (resolve) => {
        if (!fs.existsSync(startDirName)) {
            fs.mkdirSync(startDirName, { recursive: true });
        }
        const fileList: string[] = readFiles('./' + startDirName, lang);
        let codes: string[] = [
            `//rg-express==>(nocrashsoft)\n import express, { Router } from 'express'; \n const router = Router()
            
            `
        ];
        const urlAndmethods = await getUrlAndmethods(fileList) as { filename: string; exportFunctions: string[] }[] || ['']
        const sourceCode = await getSourceCode(urlAndmethods, startDirName, lang)
        codes.push(sourceCode);
        if (lang == 'ts') {
            codes.push('\n\n\nexport default router')
        } else {
            codes.push('\n\n\nexports.default = router;')
        }
        resolve(codes)
    });
}
export default makeCode;