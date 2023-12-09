import { Router } from 'express';
import { processConsole } from './lib/processConsole';
import { readFiles } from "./lib/readFiles";
import { createRoutePath, filterAndLowercaseHttpMethods } from "./lib/utils";
import { writeToFileSyncStartupCode } from './lib/writeToFileSyncStartupCode';
export type routesProps = (string | { baseDir: string; });
export const routes = (config: routesProps) => {
    // const fileExtension = new Error().stack?.split("\n")[2].match(/\/([^\/]+)$/)?.[1]?.split('.').pop()?.split(':')?.[0];

   // resolve missing to fine js
    const fileExtension = new Error().stack?.split("\n")[2].match(/\((.*?\.([a-zA-Z]+)):\d+:\d+\)/)?.[2];

    console.log({ fileExtension })
    if (!(fileExtension == 'ts' || fileExtension == 'js')) {
        throw new Error('file extension must be .ts or .js');
    }
    const plog = new processConsole();
    plog.start('routes processing...');
    let startDir = `${typeof config == 'string' ? config : config?.baseDir}/routes`//normalizePath(config?.startDir || 'src');
    // ...\..\\.. --> .../..//..
    startDir = startDir.replace(/\\/g, '/');
    const router = Router();
    const lang = fileExtension;
    const fileList: string[] = readFiles(startDir, lang);
    if (fileList && fileList.length) {
        fileList.forEach(filename => {
            writeToFileSyncStartupCode(filename);
            let apiUrl = createRoutePath({ name: filename, startDir: startDir }, lang)
            const exportFunctions = require(filename);
            const filteredHttpMethods = filterAndLowercaseHttpMethods(Object.keys(exportFunctions));// 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head' | 'connect' | 'trace' | 'copy' | 'lock' | 'move' | 'unlock' | 'propfind' | 'proppatch' | 'mkcol' | 'checkout' | 'search'
            filteredHttpMethods.forEach(method => {
                router[method](apiUrl, exportFunctions[method.toUpperCase()])
            });
        });
    }
    plog.complete('routes processing complete');
    return router;
};

