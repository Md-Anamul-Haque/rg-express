import * as fs from 'fs';
import * as path from 'path';
import { getSourceCode } from './getSourceCode';
import { getUrlAndmethods } from './lib/getUrlAndmethods';
import { readFiles } from "./lib/readFiles";
import { routerGenerator_ConfigProps } from './types';



const makeCode = async ({ startDirName }: routerGenerator_ConfigProps, lang: 'ts' | 'js') => {
    // return new Promise(async (resolve) => {
    if (!fs.existsSync(startDirName)) {
        fs.mkdirSync(path.join(startDirName), { recursive: true });
    }
    const fileList: string[] = readFiles('./' + startDirName, lang);
    let codes: string[] = [
        `//rg-express\n import { Router } from 'express'; \n const router = Router()
            
            `
    ];
    const urlAndmethods = await getUrlAndmethods(fileList) as { filename: string; exportFunctions: string[] }[] || ['']
    const sourceCode = await getSourceCode(urlAndmethods, startDirName, lang)
    codes.push(sourceCode);
    if (lang == 'ts') {
        codes.push('\n\nexport default router')
    } else {
        codes.push('\n\nexports.default = router;')
    }
    return ({ codes, fileList })
    // });
}
export default makeCode;