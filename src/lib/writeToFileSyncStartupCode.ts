import * as fs from 'fs';
export function writeToFileSyncStartupCode(startDir:string,filename: string) {
// -----------start of make function name----------
    const filePath = filename;
const ignorePath =startDir;
let FunctionName_for_get='getRequest';
// Check if filePath starts with ignorePath and ends with a directory separator
if (filePath.startsWith(ignorePath) && filePath[ignorePath.length] === '/') {
    const remainingPath = filePath.substring(ignorePath.length + 1);
    
    // Find the index of the second-to-last directory separator
    const lastIndex = remainingPath.lastIndexOf('/');
    
    if (lastIndex !== -1) {
        FunctionName_for_get = remainingPath.substring(0, lastIndex).replace(/^\w/, (match) => match.toUpperCase())||'getRequest';
    }
}
// -----------end of make function name----------
    const startupTsContent = `
import { type Request, type Response } from 'express'

const getRequest = async (req: Request, res: Response) => {
  res.send('hello')
}

export const GET = ${FunctionName_for_get}
`;
    const startupJsContent = `const getRequest = async (req, res) => {
    res.send('hello');
  };
  
  module.exports = {
    GET: ${FunctionName_for_get},
  };`
    try {
        // Read existing content from the file, if the file exists
        let existingContent = '';
        if (fs.existsSync(filename)) {
            existingContent = fs.readFileSync(filename, 'utf8').trim();
        }

        // Check if the file is empty or existing content is different from new content
        if (!existingContent) {
            // Write new content to the file
            if (filename.split('.').at(-1) === 'ts') {
                fs.writeFileSync(filename, startupTsContent);
            } else if (filename.split('.').at(-1) === 'js') {
                fs.writeFileSync(filename, startupJsContent);
            }
            // 'New content written to the file.'
        } else {
            // 'File already contains the specified content. Skipping write operation.'
        }
    } catch (error) {
        // Handle errors
        console.error('Error:', error);
    }
}