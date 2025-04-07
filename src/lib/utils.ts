import fs from 'fs';
import { HttpMethod } from '../types';

export const httpMethods = [
    'GET',
    'POST',
    'PUT',
    'DELETE',
    'PATCH',
    'OPTIONS',
    'HEAD',
    'CONNECT',
    'TRACE'
] as const;
export function getStarParamsByRoute(route: string): string[] {
    const matches = route.match(/\[\.\.\.([a-zA-Z0-9_]+)\]/g) || [];
    return matches.map(match => match.match(/\w+/)?.[0]).filter(Boolean) as string[];
}

export function getSlugParamsByRoute(route: string): string[] {
    const matches = route.match(/\[(?!\.\.\.)([a-zA-Z0-9_]+)\]/g) || [];
    return matches.map(match => match.match(/\w+/)?.[0]).filter(Boolean) as string[];
}
export function getAllRouteParams(route: string): string[] {
    const matches = [...route.matchAll(/\[(\.\.\.)?([a-zA-Z0-9_]+)\]/g)];
    return matches.map(([, , param]) => param);
}
export function checkForDuplicateParams(route: string): void {
    const matches = [...route.matchAll(/\[(\.\.\.)?([a-zA-Z0-9_]+)\]/g)];
    const params = matches.map(([, , param]) => param);

    // Using a Set to check for duplicates
    const uniqueParams = new Set(params);

    if (uniqueParams.size !== params.length) {
        throw new Error(`Duplicate parameter(s) detected in route: ${params.filter((param, index, self) => self.indexOf(param) !== index).join(', ')}`);
    }
}

export function createRoutePath({ name, startDir }: { name: string; startDir: string }, fileExtension: string): { route: string; } {
    let route = name
        .replace(new RegExp(`^${startDir}/?`), '')
        .replace(new RegExp(`/?route\.${fileExtension}$`), '') || '/';

    route = route.replace(/\[(\w+)\]/g, ':$1');
    route = route.replace(/\[\.\.\.(\w+)\]/g, "{*$1}").replace(/\\/g, '/');
    // if route is not start with / then add /
    if (!route.startsWith('/')) {
        route = '/' + route;
    }
    route = route.replace(/\/+/g, '/'); // Remove duplicate slashes
    return { route };
}

export function filterAndLowercaseHttpMethods(methods: string[]): HttpMethod[] {
    return methods
        .filter(method => httpMethods.includes(method.toUpperCase() as (typeof httpMethods)[number]))
        .map(method => method.toLowerCase() as HttpMethod);
}

export function isTypeScriptProject(): boolean {
    try {
        // const files = fs.readdirSync(process.cwd());
        // return files.some(file => file.endsWith('.ts') || file.endsWith('.mts')) || fs.existsSync('tsconfig.json');
        return fs.existsSync('tsconfig.json');
    } catch {
        return false;
    }
}

/**
 * Determines the file extension of the current executing file (e.g., .ts, .js, .mjs, etc.)
 * by inspecting the call stack.
 * 
 * @returns {string} The file extension (e.g., 'ts', 'js', 'mjs', etc.)
 */
export function determineFileExtension(): string {
    const stack = new Error().stack?.split('\n')[3]; // Get the stack trace and grab the 3rd line (caller location)
    const match = stack?.match(/\((.*?\.([a-zA-Z]+)):\d+:\d+\)/); // Match file extension pattern
    return match ? match[2] : ''; // Return the file extension (e.g., 'ts', 'js', etc.)
}
