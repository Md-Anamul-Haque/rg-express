import * as path from 'path';
import { createRoutePath, createValidVariableName } from "./lib/utils";
type getSourceCodeType = (urlAndmethods: {
    filename: string;
    exportFunctions: string[];
}[], startDir: string, lang: 'ts' | 'js') => Promise<string>;

export const getSourceCode: getSourceCodeType = async (urlAndmethods, startDir, lang) => {
    let newCode1 = urlAndmethods.map(({ filename }) => {
        const regexpdottsjs = new RegExp(`.${lang}$`)

        const formUrl = filename.replace(path.join(startDir).replace(/^\/|\/$/g, ''), '.').replace(regexpdottsjs, '');
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
        let apiUrl = createRoutePath({ name: filename, startDir: startDir }, lang)
        exportFunctions.forEach(method => {
            newCode2.push(`router.${method.toLowerCase()}('${apiUrl}', ${inputVarialbeName}.${method});`)
        })
    });
    return ([...newCode1, '\n\n', ...newCode2].join('\n'))
}