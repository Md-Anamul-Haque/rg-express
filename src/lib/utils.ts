export function createValidVariableName(name: string): string {
    // Suggest a valid variable name by removing invalid characters
    // For example, if the name contains spaces, special characters, etc.
    // Replace invalid characters with underscores (_) or remove them
    const validName = name.replace(/[^a-zA-Z0-9_$]/g, '_');
    return validName;
}
export function createRoutePath({ name, startDirName }: { name: string, startDirName: string }, lang: 'ts' | 'js'): string {
    let route = name;
    const regexpRouteFileName = new RegExp(`/?route.${lang}$`)
    const RegexpStartDirName = new RegExp(`^/?${startDirName}/?`)

    route = route.replace(startDirName, '').replace(RegexpStartDirName, '').replace(regexpRouteFileName, '') || '/';
    route = route.replace(/\[(\w+)\]/g, ':$1');
    route = route.replace(/\[\.\.\.(\w+)\]/g, '*');
    return route
}

export const httpMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD']

export function filterHttpMethods(inputArray: string[]): string[] {
    return inputArray.filter(method => httpMethods.includes(method));
}