import { Router } from 'express';
import { processConsole } from './lib/processConsole';
import { readFiles } from "./lib/readFiles";
import { createRoutePath, filterHttpMethods } from "./lib/utils";
import { writeToFileSyncStartupCode } from './lib/writeToFileSyncStartupCode';
export type routesProps = (string | { baseDir: string; });
export const routes = (config: routesProps) => {
    const plog = new processConsole();
    plog.start('routes processing...');
    const startDir = `${typeof config == 'string' ? config : config?.baseDir}/routes`//normalizePath(config?.startDir || 'src');
    const router = Router();
    const lang = '(ts|js)';
    const fileList: string[] = readFiles(startDir, lang);
    if (fileList && fileList.length) {
        fileList.forEach(filename => {
            writeToFileSyncStartupCode(filename);
            let apiUrl = createRoutePath({ name: filename, startDir: startDir }, lang)
            const exportFunctions = require(filename);
            const filteredHttpMethods = filterHttpMethods(Object.keys(exportFunctions));// 'GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'
            filteredHttpMethods.forEach(method => {
                // @ts-ignore
                router[method.toLowerCase()](apiUrl, exportFunctions[method])
            });
        });
    }
    plog.complete('routes processing complete');
    return router;
};

