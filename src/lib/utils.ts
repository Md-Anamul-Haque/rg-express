import fs from "fs";


export function createRoutePath({ name, startDir }: { name: string, startDir: string }, file_extension:string): [string, (string | null)] {
    let route = name;
    const regexpRouteFileName = new RegExp(`/?route\.${file_extension}$`)
    const RegexpStartDir = new RegExp(`^/?${startDir}/?`)

    route = route.replace(startDir, '').replace(RegexpStartDir, '').replace(regexpRouteFileName, '') || '/';
    // [slug] --> slug
    route = route.replace(/\[(\w+)\]/g, ':$1');


    // [...slugs] --> * start hear 
    const match = route.match(/\[\.\.\.(\w+)\]/);
    let paramsName: (string | null) = null;
    if (match) {
        paramsName = match[1]
    }
    route = route.replace(/\[\.\.\.(\w+)\]/g, '*');
    // [...slugs] --> * end hear


    // ...\..\\.. --> .../..//..
    route = route.replace(/\\/g, '/');

    return [route, paramsName]
}
export const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD', 'CONNECT', 'TRACE', 'COPY', 'LOCK', 'MOVE', 'UNLOCK', 'PROPFIND', 'PROPPATCH', 'MKCOL', 'CHECKOUT', 'SEARCH']

export function filterHttpMethods(inputArray: string[]): string[] {
    return inputArray.filter(method => httpMethods.includes(method));
}
type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head' | 'connect' | 'trace' | 'copy' | 'lock' | 'move' | 'unlock' | 'propfind' | 'proppatch' | 'mkcol' | 'checkout' | 'search';

export function filterAndLowercaseHttpMethods(inputArray: string[]): HttpMethod[] {
    return inputArray.filter(method => httpMethods.includes(method))
        .map(method => method.toLowerCase()) as HttpMethod[];
}

// export function normalizePath(url: string): string {
//     // Remove leading and trailing slashes

//     // /.../..../ --> .../....
//     url = url.replace(/^\/|\/$/g, '');
//     // ...\..\\.. --> .../..//..
//     url = url.replace(/\\/g, '/');

//     // Replace consecutive slashes with a single slash

//     // ...//.../ --> .../.../
//     url = url.replace(/\/+/g, '/');
//     // Check if the path starts with './' or '/'
//     if (url.startsWith('./')) {
//         return url.substring(2);
//     } else if (url.startsWith('/')) {
//         return url.substring(1);
//     } else {
//         return url;
//     }
// }


export function getFileExtension(): void {
    const fileName = new Error().stack?.split("\n")[2].match(/\/([^\/]+)$/)?.[1];
    const fileExtension = fileName?.split('.').pop();
    console.log(fileExtension);
}



export function isTypeScriptProject(): boolean {
    // Check for TypeScript file extensions
try {
        // Check for TypeScript file extensions
        const tsFilesExist = fs.readdirSync(process.cwd()).some(file => file.endsWith('.ts') || file.endsWith('.tsx'));

        // Check for tsconfig.json file
        const tsConfigExists = fs.existsSync('tsconfig.json');
        // console.log({tsConfigExists})
        // Check for TypeScript dependencies
        return tsFilesExist || tsConfigExists;
    
} catch (error) {
    return(false)
}}
