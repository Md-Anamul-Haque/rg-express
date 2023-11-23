

import * as fs from 'fs';
import * as path from 'path';



export function readFiles(directoryPath: string, lang: 'ts' | 'js'): string[] {
    const files: string[] = fs.readdirSync(directoryPath);
    const fileList: string[] = [];

    files.forEach((file: string) => {
        const filePath: string = path.join(directoryPath, file);
        const stats: fs.Stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            // If it's a directory, recursively read files inside it
            const subFiles: string[] = readFiles(filePath, lang);
            fileList.push(...subFiles);
        } else {
            const fname = filePath.split('/').at(-1) || '';
            // if (lang == '(ts|js)') {
            //     if (/^route\.(ts|js)$/.test(fname)) {
            //         fileList.push(filePath);
            //     }
            // } else
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
        file = file.replace(/\\/g, '/')
        // if (lang == '(ts|js)') {
        //     if (/route\.(ts|js)$/.test(file)) {
        //         endFileList.push(file)
        //     }
        // } else 
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
    return endFileList;
}