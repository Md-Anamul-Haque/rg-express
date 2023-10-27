import * as fs from 'fs';
import * as path from 'path';

export function createFile(filePath: string, fileContent: string) {
    filePath = filePath.replace(/\/\//g, '/').replace(/\/\/\//g, '/').replace(/\/\/\/\//g, '/')
    const directoryPath: string = path.dirname(filePath);
    // Ensure the directory exists, if not, create it
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(path.join(directoryPath), { recursive: true });
    }

    // delete this file
    if (fs.existsSync(filePath)) {
        const existingContent = fs.readFileSync(filePath, 'utf8').trim();
        const isSameCode = (JSON.stringify(existingContent) === JSON.stringify(fileContent.trim()))
        if (isSameCode) {
            // console.log('Content already exists in the file. Skipping write operation.');
            return filePath
        }// else {
        //     fs.unlinkSync(filePath);
        // }
    }

    fs.writeFile(filePath, fileContent, (err) => {
        if (err) {
            throw err;
        }
    });
    return filePath
}
