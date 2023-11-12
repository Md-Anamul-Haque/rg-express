import * as fs from 'fs';
export function writeToFileSyncStartupCode(filename: string) {
    const startupTsContent = `
import { type Request, type Response } from 'express'

const getRequest = async (req: Request, res: Response) => {
  res.send('hello')
}

export const GET = getRequest
`;
    const startupJsContent = `const getRequest = async (req, res) => {
    res.send('hello');
  };
  
  module.exports = {
    GET: getRequest,
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