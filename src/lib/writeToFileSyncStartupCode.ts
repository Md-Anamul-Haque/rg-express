import * as fs from 'fs';
import { CodeSnippetFn, FileExt } from '../types';
import { getSlugParamsByRoute, getSpreadParamsByRoute } from './utils';

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
function createRequestType(slugParams: string[], spreadParams: string[]): string {
    const slugParamTypes = slugParams.map(p_name => `${p_name}: string;`).join(' ');
    const spreadParamTypes = spreadParams.map(p_name => `${p_name}: string[];`).join(' ');

    return `type Request = ExpressRequest<{ ${slugParamTypes} ${spreadParamTypes} }>;`;
}
export const supportedFileExtensions = ['ts', 'js', 'mjs', 'mts'] as const;
/**
 * Generates the content for the route file based on the parameters and language.
 */
function generateContent(
    fileExtension: FileExt,
    allParams: string[],
    slugParams: string[],
    spreadParams: string[],
    funcName: string,
    message: string
): string {
    switch (fileExtension) {
        case 'ts':
        case 'mts':
            return allParams.length
                ? `import { Request as ExpressRequest, Response } from 'express';
${createRequestType(slugParams, spreadParams)}

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
    const { ${spreadParams.join(', ')} } = req.params;
    res.send({ ${spreadParams.join(', ')} });
};
module.exports = { GET: ${funcName} };`
                : `const ${funcName} = async (req, res) => {
    res.send('${message}');
};
module.exports = { GET: ${funcName} };`;

        case 'mjs':
            return allParams.length
                ? `export const GET = async (req, res) => {
    const { ${spreadParams.join(', ')} } = req.params;
    res.send({ ${spreadParams.join(', ')} });
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
export function writeToFileSyncStartupCode(startDir: string, filename: string, { codeSnippet, codeSnippetFn }: { codeSnippet?: string, codeSnippetFn?: CodeSnippetFn }): void {
    const spreadParams = getSpreadParamsByRoute(filename); // [...slug]
    const slugParams = getSlugParamsByRoute(filename); // [userId]
    const allParams = [...slugParams, ...spreadParams]; // Combined

    const relativePath = filename.substring(startDir.length + 1, filename.lastIndexOf('/'));
    const funcName = relativePath
        ? getValidFunctionName(`handleGet${relativePath.replace(/^\w/, c => c.toUpperCase()).replace(/-(\w)/g, (_, g) => g.toUpperCase())}`)
        : 'handleGetRequest';
    const message = relativePath || 'hello';
    const ext = filename.split('.').pop() as FileExt;
    const content = (codeSnippetFn && codeSnippetFn({ allParams, slugParams, spreadParams })) || codeSnippet || generateContent(ext, allParams, slugParams, spreadParams, funcName, message);

    try {
        // Check if the file exists and if its content is empty
        if (!fs.existsSync(filename) || !fs.readFileSync(filename, 'utf8').trim()) {
            fs.writeFileSync(filename, content);
        }
    } catch (error) {
        console.error('Error writing startup code:', error);
    }
}