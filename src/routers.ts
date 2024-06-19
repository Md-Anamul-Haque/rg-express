
import express, { Express, NextFunction, Request, Response } from 'express';
import { ProcessConsole } from './lib/processConsole';
import { readFiles } from "./lib/readFiles";
import { createRoutePath, filterAndLowercaseHttpMethods, isTypeScriptProject } from "./lib/utils";
import { writeToFileSyncStartupCode } from './lib/writeToFileSyncStartupCode';
export type routesProps = (string | { baseDir: string; autoSetup?: boolean, app?: Express });
const consoleP = new ProcessConsole();
const consoleP2 = new ProcessConsole();

export const routes = (config: routesProps) => {
    config = typeof config == 'string' ? {
        baseDir: config,
        autoSetup: false,
    } : config
    console.time('✓ Ready in ')
    // const fileExtension = new Error().stack?.split("\n")[2].match(/\/([^\/]+)$/)?.[1]?.split('.').pop()?.split(':')?.[0];
    const isThis_TS_project = isTypeScriptProject()
    // resolve missing to fine js
    const fileExtension = new Error().stack?.split("\n")[2].match(/\((.*?\.([a-zA-Z]+)):\d+:\d+\)/)?.[2];

    // if (!(fileExtension == 'ts' || fileExtension == 'js'|| fileExtension == 'mjs'|| fileExtension == 'mts')) {
    //     throw new Error('file extension is not valid');
    // }
    if (!fileExtension) {
        throw new Error('file extension is not valid');
    }
    consoleP2.complete(`${isThis_TS_project ? 'TypeScript' : fileExtension}`)
    let startDir = `${config?.baseDir}/routes`//normalizePath(config?.startDir || 'src');
    // ...\..\\.. --> .../..//..
    startDir = startDir.replace(/\\/g, '/');

    // let autoSetup: boolean = typeof config == 'string' ? false : config?.autoSetup || false;
    const isCanAutoSetup = (isThis_TS_project ? fileExtension.endsWith('ts') : true);
    const isAutoSetup = isCanAutoSetup && config.autoSetup
    if (config?.autoSetup) {
        isAutoSetup ? consoleP2.complete(`AutoSetup with ${fileExtension}`) : consoleP2.false(`AutoSetup : The project is built on '${isThis_TS_project ? 'TypeScript' : fileExtension}', but the running file is '${fileExtension}'. Don't worry, this is perfectly fine.`);
    }

    consoleP.start('Route processing');

    const routerApp = config.app ? config.app : express();
    const lang = fileExtension;
    const fileList: string[] = readFiles(startDir, lang);
    console.log({ fileList })
    if (fileList && fileList.length) {
        fileList.forEach(filename => {
            // ---------------
            if (isAutoSetup) { writeToFileSyncStartupCode(startDir, filename); }
            // ------------------
            let { route, paramsNames } = createRoutePath({ name: filename, startDir: startDir }, lang)
            const exportFunctions = require(filename);
            const filteredHttpMethods = filterAndLowercaseHttpMethods(Object.keys(exportFunctions));
            filteredHttpMethods.forEach(method => {

                if (paramsNames.length) {
                    routerApp[method](route, (req: Request, _res: Response, next: NextFunction) => {
                        paramsNames.forEach((paramsName, i) => {
                            // @ts-ignore
                            req['*-params'] = { ...req['*-params'] = {}, [paramsName]: req?.params?.[i]?.split('/') };
                            // @ts-ignore 
                            req.params[paramsName] = req?.params?.[i]?.split('/');
                        })
                        next()
                    }, exportFunctions[method.toUpperCase()])
                } else {

                    routerApp[method](route, exportFunctions[method.toUpperCase()])
                }

            });
        });
    }
    consoleP.complete('Route processing complete.');
    console.timeEnd('✓ Ready in ')
    if (!(typeof config == 'object' && config.app)) {
        return routerApp;
    } else {
        return;
    }
};

