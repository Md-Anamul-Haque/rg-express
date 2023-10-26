

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
            // If it's a file, add its path to the list
            // console.log({ filePath })
            // const regexp = new RegExp(`route.${lang}$`)
            // console.log({ regexp })
            const fname = filePath.split('/').at(-1) || '';

            console.log(/^route\.(ts|js)$/.test(fname))
            if (/^route\.(ts|js)$/.test(fname)) {
                console.log({ filePath })
                fileList.push(filePath);
            }
        }
    });
    let endFileList: string[] = []
    fileList.forEach(file => {
        file = file.replace(/\\/g, '/')
        if (/route\.(ts|js)$/.test(file)) {
            console.log({ file })
            endFileList.push(file)
        }
    });
    console.log({ endFileList })
    return endFileList;
}