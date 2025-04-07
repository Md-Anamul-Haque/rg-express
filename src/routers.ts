import express, { Express, RequestHandler, Router } from 'express';
import { ProcessConsole } from './lib/processConsole';
import { FileReader } from './lib/readFiles';
import { createRoutePath, determineFileExtension, filterAndLowercaseHttpMethods, isTypeScriptProject } from './lib/utils';
import { writeToFileSyncStartupCode } from './lib/writeToFileSyncStartupCode';
import { FileExt, HttpMethod } from './types';
/**
 * Configuration options for setting up application routes.
 *
 * @property baseDir - The base directory where route files are located.
 * @property routeGenIfEmpty - Automatically sets up startup code if the file is empty.
 * @deprecated This property is deprecated and may be removed in future versions. Use routeGenIfEmpty instead.
 * @property app - An optional Express application instance to use for routing.
 */
// routeGenIfEmpty
interface RouteConfig {
    baseDir: string;
    routeGenIfEmpty?: boolean;
    /**
     * @deprecated Use `routeGenIfEmpty` instead.
     */
    autoSetup?: boolean;
    app?: Express;
}
export type RoutesProps = string | RouteConfig;

const consoleP = new ProcessConsole();
const consoleP2 = new ProcessConsole();

export const routes = (config: RoutesProps): Router => {
    const normalizedConfig: RouteConfig = typeof config === 'string'
        ? { baseDir: config, autoSetup: false, routeGenIfEmpty: false }
        : config;
    // Log a deprecation warning if 'autoSetup' is used
    if (normalizedConfig.autoSetup) {
        console.warn('[DEPRECATED] "autoSetup" is deprecated. Please use "routeGenIfEmpty" instead.');
    }


    console.time('✓ Ready in');

    const fileExtension = determineFileExtension();
    validateFileExtension(fileExtension);

    consoleP2.complete(`${isTypeScriptProject() ? 'TypeScript' : fileExtension}`);
    const startDir = `${normalizedConfig.baseDir}/routes`.replace(/\\/g, '/');
    const isTsProject = isTypeScriptProject();
    const canAutoSetup = isTsProject ? fileExtension === 'ts' : true;
    const shouldAutoSetup = canAutoSetup && (!!normalizedConfig.routeGenIfEmpty || !!normalizedConfig.autoSetup);

    if (normalizedConfig.routeGenIfEmpty || normalizedConfig.autoSetup) {
        shouldAutoSetup
            ? consoleP2.complete(`Auto setup starter Code_ifEmptyFile with ${fileExtension}`)
            : consoleP2.fail(`AutoSetup: Project is '${isTsProject ? 'TypeScript' : fileExtension}', but running file is '${fileExtension}'`);
    }

    consoleP.start('Route processing');

    const router = normalizedConfig.app || express.Router()
        ;
    const fileList = FileReader.readFiles(startDir, fileExtension as FileExt);
    if (fileList.length) {
        processRoutes(fileList, startDir, router, shouldAutoSetup, fileExtension);
    }

    consoleP.complete('Route processing complete');
    console.timeEnd('✓ Ready in');

    return normalizedConfig.app || router;
};


function validateFileExtension(ext: string): asserts ext is 'ts' | 'js' | 'mjs' | 'mts' {
    if (!['ts', 'js', 'mjs', 'mts'].includes(ext)) {
        throw new Error('Invalid file extension detected');
    }
}

function processRoutes(fileList: string[], startDir: string, router: Router, autoSetup: boolean, lang: string) {

    const routeDefinitions = fileList.map(filePath => {
        const { route: expressRoutePath } = createRoutePath({ name: filePath, startDir }, lang);
        const exportedHandlers = require(filePath);
        const supportedMethods = filterAndLowercaseHttpMethods(Object.keys(exportedHandlers));

        const methodHandlers: {
            method: HttpMethod;
            handler: RequestHandler;
        }[] = supportedMethods.map(httpMethod => {
            return {
                method: httpMethod,
                handler: exportedHandlers[httpMethod.toUpperCase()]
            };
        });

        return {
            route: expressRoutePath,
            supportedMethods,
            filePath,
            methodHandlers
        };
    });
    routeDefinitions.forEach(({ filePath, methodHandlers, route }) => {
        if (autoSetup) {
            writeToFileSyncStartupCode(startDir, filePath);
        }
        methodHandlers.forEach(({ method, handler }) => {
            router[method](route, handler);
        })

    });
}