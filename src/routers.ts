
import express,{ NextFunction, Request, Response,Express } from 'express';
import { ProcessConsole } from './lib/processConsole';
import { readFiles } from "./lib/readFiles";
import { createRoutePath, filterAndLowercaseHttpMethods, isTypeScriptProject } from "./lib/utils";
import { writeToFileSyncStartupCode } from './lib/writeToFileSyncStartupCode';
export type routesProps = (string | { baseDir: string;autoSetup?:boolean,app?:Express });
const consoleP = new ProcessConsole();
const consoleP2 = new ProcessConsole();

export const routes = (config: routesProps) => {
    console.time('✓ Ready in ')
    // const fileExtension = new Error().stack?.split("\n")[2].match(/\/([^\/]+)$/)?.[1]?.split('.').pop()?.split(':')?.[0];
    const isThis_TS_project =isTypeScriptProject()
    // resolve missing to fine js
    const fileExtension = new Error().stack?.split("\n")[2].match(/\((.*?\.([a-zA-Z]+)):\d+:\d+\)/)?.[2];

    // if (!(fileExtension == 'ts' || fileExtension == 'js'|| fileExtension == 'mjs'|| fileExtension == 'mts')) {
    //     throw new Error('file extension is not valid');
    // }
    if (!fileExtension) {
        throw new Error('file extension is not valid');
    }
    consoleP2.complete(`${isThis_TS_project?'TypeScript + ':''}${fileExtension}`)

    let startDir = `${typeof config == 'string' ? config : config?.baseDir}/routes`//normalizePath(config?.startDir || 'src');
    let autoSetup:boolean = typeof config == 'string' ? false : config?.autoSetup||false;
    const isCanAutoSetup=(isThis_TS_project?fileExtension.endsWith('ts'):true);
   if(autoSetup){
       isCanAutoSetup?consoleP2.complete(`AutoSetup.:.${fileExtension}`):consoleP2.false(`AutoSetup : The project is built on '${isThis_TS_project?'TypeScript':fileExtension}', but the running file is '${fileExtension}'. Don't worry, this is perfectly fine.`);
   } 
    // ...\..\\.. --> .../..//..
    startDir = startDir.replace(/\\/g, '/');
    
    consoleP.start('Route processing');

    const routerApp = (typeof config=='object'&& config.app)?config.app: express();
    const lang = fileExtension;
    const fileList: string[] = readFiles(startDir, lang);
    if (fileList && fileList.length) {
        fileList.forEach(filename => {
            // ---------------
           if(autoSetup && isCanAutoSetup){writeToFileSyncStartupCode(startDir, filename);}
            // ------------------
            let [apiUrl, nameOfParamsMatch] = createRoutePath({ name: filename, startDir: startDir }, lang)
            const exportFunctions = require(filename);
            const filteredHttpMethods = filterAndLowercaseHttpMethods(Object.keys(exportFunctions));// 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head' | 'connect' | 'trace' | 'copy' | 'lock' | 'move' | 'unlock' | 'propfind' | 'proppatch' | 'mkcol' | 'checkout' | 'search'
            filteredHttpMethods.forEach(method => {

                if (nameOfParamsMatch && typeof nameOfParamsMatch == 'string') {
                    routerApp[method](apiUrl, (req: Request, _res: Response, next: NextFunction) => {
                        // @ts-ignore
                        req.params[nameOfParamsMatch] = req?.params?.[0]?.split('/');
                        next()
                    }, exportFunctions[method.toUpperCase()])
                } else {
                    routerApp[method](apiUrl, exportFunctions[method.toUpperCase()])
                }

            });
        });
    }
    consoleP.complete('Route processing complete.');
    console.timeEnd('✓ Ready in ')
    if(!(typeof config=='object'&& config.app)){
        return routerApp;
    }else{
        return ;
    }
};

