import * as fs from 'fs';
import { getStarParamsByRoute } from './utils';
function getValidFunctionName(input: string): string {
    // Replace invalid characters with underscores
    const cleanName = input.replace(/[\[\]\/]+/g, '_');

    // Replace underscores, if there are multiple underscores together, with a single underscore
    const singleUnderscoreName = cleanName.replace(/_+/g, '_');

    // Remove leading and trailing underscores
    const validName = singleUnderscoreName.replace(/^_+|_+$/g, '').replace(/\.\.\.(\w+)/g, '').replace(/^\_/, '').replace(/$\_/, '');

    return validName;
}
export function writeToFileSyncStartupCode(startDir: string, filename: string) {
    // -----------start of make function name----------
    // start to process
    const starParams = getStarParamsByRoute(filename)

    // end to process
    const filePath = filename;
    const ignorePath = startDir;
    let sendMessage = 'hello';
    let FunctionName_for_get = 'haneleGetRequest';
    // Check if filePath starts with ignorePath and ends with a directory separator
    if (filePath.startsWith(ignorePath) && filePath[ignorePath.length] === '/') {
        const remainingPath = filePath.substring(ignorePath.length + 1);

        // Find the index of the second-to-last directory separator
        const lastIndex = remainingPath.lastIndexOf('/');

        if (lastIndex !== -1) {
            const ffg_name = remainingPath.substring(0, lastIndex).replace(/^\w/, (match) => match.toUpperCase()).replace(/-([a-z])/g, (_match, group) => group.toUpperCase());
            // const ffg_name = remainingPath.substring(0, lastIndex).replace(/^\w/, (match) => match.toUpperCase());
            FunctionName_for_get = getValidFunctionName('haneleGet' + (ffg_name || 'haneleGetRequest'));
            sendMessage = ffg_name || sendMessage;
        }
    }
    // -----------end of make function name----------
    const startupTsContent = starParams.length ?
        `import { type Request as ExpressRequest, type Response } from 'express';
type Request = ExpressRequest & {
    ${starParams.map(p => `${p}: string[];`).join('\n\t')}
};\n
export const GET = async (req: Request, res: Response) => {
    const { ${starParams.map(param => param).join(', ')} } = req.params;\n
    res.send({ ${starParams.map(param => param).join(', ')} })
};
    `
        : `import { type Request, type Response } from 'express';

export const GET = async (req: Request, res: Response) => {
    res.send('${sendMessage}')
};`;


    const startupMjsContent = starParams.length ?
        `export const GET = async (req, res) => {
      const { ${starParams.map(param => param).join(', ')} } = req.params;\n
    res.send({ ${starParams.map(param => param).join(', ')} })
};
    `
        : `export const GET = async (req, res) => {
  res.send('${sendMessage}')
};`;

    const startupJsContent = starParams.length ?
        `const ${FunctionName_for_get} = async (req, res) => {
        const { ${starParams.map(param => param).join(', ')} } = req.params;\n
        res.send({ ${starParams.map(param => param).join(', ')} })
      };
      
      module.exports = {
        GET: ${FunctionName_for_get},
      };`
        : `const ${FunctionName_for_get} = async (req, res) => {
    res.send('${sendMessage}');
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
            if (filename.split('.').at(-1) === 'ts' || filename.split('.').at(-1) === 'mts') {
                fs.writeFileSync(filename, startupTsContent);
            } else if (filename.split('.').at(-1) === 'js') {
                fs.writeFileSync(filename, startupJsContent);
            } else if (filename.split('.').at(-1) === 'mjs') {
                fs.writeFileSync(filename, startupMjsContent);
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