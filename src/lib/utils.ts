export function createValidVariableName(name: string): string {
    // Suggest a valid variable name by removing invalid characters
    // For example, if the name contains spaces, special characters, etc.
    // Replace invalid characters with underscores (_) or remove them
    const validName = name.replace(/[^a-zA-Z0-9_$]/g, '_');
    return validName;
}
export function createRoutePath({ name, startDir }: { name: string, startDir: string }, lang: 'ts' | 'js' | '(ts|js)'): string {
    let route = name;
    const regexpRouteFileName = new RegExp(`/?route.${lang}$`)
    const RegexpStartDir = new RegExp(`^/?${startDir}/?`)

    route = route.replace(startDir, '').replace(RegexpStartDir, '').replace(regexpRouteFileName, '') || '/';
    route = route.replace(/\[(\w+)\]/g, ':$1');
    route = route.replace(/\[\.\.\.(\w+)\]/g, '*');
    return route
}

export const httpMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD']

export function filterHttpMethods(inputArray: string[]): string[] {
    return inputArray.filter(method => httpMethods.includes(method));
}

export function normalizePath(url: string): string {
    // Remove leading and trailing slashes
    url = url.replace(/^\/|\/$/g, '');

    // Replace consecutive slashes with a single slash
    url = url.replace(/\/+/g, '/');
    // Check if the path starts with './' or '/'
    if (url.startsWith('./')) {
        return url.substring(2);
    } else if (url.startsWith('/')) {
        return url.substring(1);
    } else {
        return url;
    }
}
