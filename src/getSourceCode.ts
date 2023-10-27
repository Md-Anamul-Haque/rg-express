import * as path from 'path';
import { createRoutePath, createValidVariableName } from "./lib/utils";
type getSourceCodeType = (urlAndmethods: {
    filename: string;
    exportFunctions: string[];
}[], startDirName: string, lang: 'ts' | 'js') => Promise<string>;

export const getSourceCode: getSourceCodeType = async (urlAndmethods, startDirName, lang) => {
    let newCode1 = urlAndmethods.map(({ filename }) => {
        const regexpdottsjs = new RegExp(`.${lang}$`)

        const formUrl = filename.replace(path.join(startDirName).replace(/^\/|\/$/g, ''), '.').replace(regexpdottsjs, '');
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
    return ([...newCode1, '\n\n', ...newCode2].join('\n'))
}