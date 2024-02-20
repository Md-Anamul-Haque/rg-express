

import * as fs from 'fs';
import * as path from 'path';
function getSpradesLength(path:string) {
    const pattern = /\[\.\.\.\w+\]/g; // Regular expression pattern to match '[...<any>]'
    const matches = path.match(pattern);
    return matches ? matches.length : 0;
}
function getSlugsLength(path:string) {
    const pattern = /\[\w+\]/g; // Regular expression pattern to match '[<any>]'
    const matches = path.match(pattern);
    return matches ? matches.length : 0;
}
function customSortSprades(a:string, b:string) {
    if (a === b) {
        return 0;
    }
  
    const indexOfA = a.indexOf('[...');
    const indexOfB = b.indexOf('[...');
  
    if (indexOfA>indexOfB) {
        return -1;
    } else if (indexOfA<indexOfB) {
        return 1;
    }else if(indexOfA == indexOfB){
        const slengthA=getSpradesLength(a)
        const slengthB=getSpradesLength(b)
        if (slengthA==slengthB) {
            return(a.length > b.length?-1:1)
        } else {
            return(slengthA > slengthB?-1:1)
        }
    }
  
    return a.localeCompare(b);
  }
function customSort(a: string, b: string): number {
    if (a === b) {
        return 0;
    }

    const hasBracketA = a.includes('[');
    const hasBracketB = b.includes('[');
    // const hasEllipsisA = a.includes('[...');
    // const hasEllipsisB = b.includes('[...');

    // if (hasEllipsisA && !hasEllipsisB) {
    //     return 1;
    // } else if (!hasEllipsisA && hasEllipsisB) {
    //     return -1;
    // }

    if (hasBracketA && !hasBracketB) {
        return 1;
    } else if (!hasBracketA && hasBracketB) {
        return -1;
    }else if(hasBracketA==hasBracketB){
        const slugsA_is=getSlugsLength(a)
        const slugsB_is=getSlugsLength(b)
        if (slugsA_is==slugsB_is) {
            return(a.length > b.length?-1:1)
        } else {
            return(slugsA_is > slugsB_is?-1:1)
        }
    }

    return a.localeCompare(b);
}

const sortNowAsMyG=(fl:string[]):string[]=>{
    let fl1=fl.filter(l=>!l.includes('[...'))
    let fl2=fl.filter(l=>l.includes('[...'))
    const result=[...fl1.sort(customSort),...fl2.sort(customSortSprades)]
    return(result)
}

export function readFiles(directoryPath: string, lang: 'ts' | 'js'): string[] {
    try {
        const files: string[] = fs.readdirSync(directoryPath);
    const fileList: string[] = [];
    // ...\..\\.. --> .../..//..
    directoryPath = directoryPath.replace(/\\/g, '/');

    files.forEach((file: string) => {
        let filePath: string = path.join(directoryPath, file);

        // ...\..\\.. --> .../..//..
        filePath = filePath.replace(/\\/g, '/');

        const stats: fs.Stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            // If it's a directory, recursively read files inside it
            const subFiles: string[] = readFiles(filePath, lang);

            fileList.push(...subFiles);
        } else {
            let fname = filePath.split('/').at(-1) || '';
            // ...\..\\.. --> .../..//..
            fname = fname.replace(/\\/g, '/');
            if (lang == 'ts') {
                if (/^route\.ts$/.test(fname)) {
                    fileList.push(filePath);
                }
            } else if (lang == 'js') {
                if (/^route\.js$/.test(fname)) {
                    fileList.push(filePath);
                }
            }
        }
    });
    let endFileList: string[] = []
    fileList.forEach(file => {
        file = file.replace(/\\/g, '/');
        if (lang == 'ts') {
            if (/route\.ts$/.test(file)) {
                endFileList.push(file)
            }
        } else if (lang == 'js') {
            if (/route\.js$/.test(file)) {
                endFileList.push(file)
            }
        }
    });
    return sortNowAsMyG(endFileList);
    } catch (error) {
        console.error(error)
        return([])
    }
}