import * as fs from 'fs';
import { FileExt } from '../types';
import { getSlugParamsByRoute, getStarParamsByRoute } from './utils';

function getValidFunctionName(input: string): string {
    return input
        .replace(/[\[\]\/]+/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_+|_+$/g, '')
        .replace(/\.\.\.\w+/g, '');
}
/**
 * Helper function to create the type definition for request parameters.
 */
function createRequestType(slugParams: string[], starParams: string[]): string {
    const slugParamTypes = slugParams.map(p_name => `${p_name}: string;`).join(' ');
    const starParamTypes = starParams.map(p_name => `${p_name}: string[];`).join(' ');

    return `type Request = ExpressRequest<{ ${slugParamTypes} ${starParamTypes} }>;`;
}
export const supportedFileExtensions = ['ts', 'js', 'mjs', 'mts'] as const;
/**
 * Generates the content for the route file based on the parameters and language.
 */
function generateContent(
    fileExtension: FileExt,
    allParams: string[],
    slugParams: string[],
    starParams: string[],
    funcName: string,
    message: string
): string {
    switch (fileExtension) {
        case 'ts':
        case 'mts':
            return allParams.length
                ? `import { Request as ExpressRequest, Response } from 'express';
${createRequestType(slugParams, starParams)}

export const GET = async (req: Request, res: Response) => {
    const { ${allParams.join(', ')} } = req.params;
    res.send({ ${allParams.join(', ')} });
};`
                : `import { Request, Response } from 'express';

export const GET = async (req: Request, res: Response) => {
    res.send('${message}');
};`;

        case 'js':
            return allParams.length
                ? `const ${funcName} = async (req, res) => {
    const { ${starParams.join(', ')} } = req.params;
    res.send({ ${starParams.join(', ')} });
};
module.exports = { GET: ${funcName} };`
                : `const ${funcName} = async (req, res) => {
    res.send('${message}');
};
module.exports = { GET: ${funcName} };`;

        case 'mjs':
            return allParams.length
                ? `export const GET = async (req, res) => {
    const { ${starParams.join(', ')} } = req.params;
    res.send({ ${starParams.join(', ')} });
};`
                : `export const GET = async (req, res) => {
    res.send('${message}');
};`;

        default:
            throw new Error('Unsupported file extension');
    }
}

/**
 * Writes the startup code to a file if it does not exist or if it is empty.
 */
export function writeToFileSyncStartupCode(startDir: string, filename: string, codeSnippet_content?: string): void {
    const starParams = getStarParamsByRoute(filename); // [...slug]
    const slugParams = getSlugParamsByRoute(filename); // [userId]
    const allParams = [...slugParams, ...starParams]; // Combined

    const relativePath = filename.substring(startDir.length + 1, filename.lastIndexOf('/'));
    const funcName = relativePath
        ? getValidFunctionName(`handleGet${relativePath.replace(/^\w/, c => c.toUpperCase()).replace(/-(\w)/g, (_, g) => g.toUpperCase())}`)
        : 'handleGetRequest';
    const message = relativePath || 'hello';
    const ext = filename.split('.').pop() as FileExt;
    const content = codeSnippet_content || generateContent(ext, allParams, slugParams, starParams, funcName, message);

    try {
        // Check if the file exists and if its content is empty
        if (!fs.existsSync(filename) || !fs.readFileSync(filename, 'utf8').trim()) {
            fs.writeFileSync(filename, content);
        }
    } catch (error) {
        console.error('Error writing startup code:', error);
    }
}