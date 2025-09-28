import express, { Express, RequestHandler, Router } from 'express';
import { ProcessConsole } from './lib/processConsole';
import { FileReader } from './lib/readFiles';
import { createRoutePath, determineFileExtension, filterAndLowercaseHttpMethods, isTypeScriptProject } from './lib/utils';
import { writeToFileSyncStartupCode } from './lib/writeToFileSyncStartupCode';
import { CodeSnippetFn, FileExt, HttpMethod, RouteGenIfEmpty } from './types';
/**
 * Configuration options for setting up application routes.
 *
 * @property baseDir - The base directory where route files are located.
 * @property routeGenIfEmpty - Automatically sets up startup code if the file is empty.
 * @property app - An optional Express application instance to use for routing.
 */
// routeGenIfEmpty

// type PropsWithApp = { app: string; [key: string]: any };
// type PropsWithoutApp = { app?: undefined | null; [key: string]: any };

// // Overload signatures
// function handleApp(props: PropsWithApp): void;
// function handleApp(props: PropsWithoutApp): "hello";

// // Implementation
// function handleApp(props: { app?: string | null; [key: string]: any }): void | "hello" {
//   if (props.app != null) {
//     return;
//   } else {
//     return "hello";
//   }
// }
// const a = handleApp({ app: "hello" }); // type of `a` is `void`
// const b = handleApp({});               // type of `b` is `"hello"`

interface RouteConfigWithApp {
    baseDir: string;
    routeGenIfEmpty?: RouteGenIfEmpty;
    /**
     * @deprecated Use `routeGenIfEmpty` instead.
     */
    autoSetup?: boolean;
    /**
     * @deprecated skip to pass app.
     */
    app: Express;
}
type RouteConfigWithoutApp = string | {
    baseDir: string;
    routeGenIfEmpty?: RouteGenIfEmpty;
    /**
     * @deprecated Use `routeGenIfEmpty` instead.
     */
    autoSetup?: boolean;
    app?: undefined;
}

interface RouteConfig {
    baseDir: string;
    routeGenIfEmpty?: RouteGenIfEmpty;
    /**
     * @deprecated Use `routeGenIfEmpty` instead.
     */
    autoSetup?: boolean;
    /**
     * @deprecated skip to pass app.
     */
    app?: Express;
}


export type RoutesProps = string | RouteConfig;

const consoleP = new ProcessConsole();
const consoleP2 = new ProcessConsole();


export function routes(config: RouteConfigWithoutApp): Router;
export function routes(config: string): Router;
export function routes(config: RouteConfigWithApp): void;

export function routes(config: RoutesProps): (Router | void) {
    const normalizedConfig: RouteConfig = typeof config === 'string'
        ? { baseDir: config, autoSetup: false, routeGenIfEmpty: false }
        : config;
    // Log a deprecation warning if 'autoSetup' is used
    if (normalizedConfig.autoSetup) {
        console.warn('[DEPRECATED] "autoSetup" is deprecated. Please use "routeGenIfEmpty" instead.');
    }


    console.time('✓ Ready in');
    const codeSnippet = typeof normalizedConfig.routeGenIfEmpty === 'object' && 'codeSnippet' in normalizedConfig.routeGenIfEmpty ? normalizedConfig.routeGenIfEmpty.codeSnippet : undefined;
    const codeSnippetFn = typeof normalizedConfig.routeGenIfEmpty === 'object' && 'codeSnippetFn' in normalizedConfig.routeGenIfEmpty ? normalizedConfig.routeGenIfEmpty.codeSnippetFn : undefined;
    const isRouteGenWIthObject = codeSnippet !== undefined || codeSnippetFn !== undefined;
    const isRouteGenWithBoolean = typeof normalizedConfig.routeGenIfEmpty === 'boolean' && normalizedConfig.routeGenIfEmpty === true;
    const isRouteGenIfEmpty = Boolean(isRouteGenWIthObject || isRouteGenWithBoolean || normalizedConfig.autoSetup);
    const fileExtension = determineFileExtension();
    validateFileExtension(fileExtension);

    consoleP2.complete(`${isTypeScriptProject() ? 'TypeScript' : fileExtension}`);
    const startDir = `${normalizedConfig.baseDir}/routes`.replace(/\\/g, '/');
    const isTsProject = isTypeScriptProject();
    const canAutoSetup = isTsProject ? fileExtension === 'ts' : true;
    const shouldAutoSetup = canAutoSetup && isRouteGenIfEmpty;

    if (isRouteGenIfEmpty) {
        shouldAutoSetup
            ? consoleP2.complete(`Auto setup starter Code_ifEmptyFile with ${fileExtension}`)
            : consoleP2.fail(`AutoSetup: Project is '${isTsProject ? 'TypeScript' : fileExtension}', but running file is '${fileExtension}'`);
    }

    consoleP.start('Route processing');

    const router = normalizedConfig.app || express.Router();
    const fileList = FileReader.readFiles(startDir, fileExtension as FileExt);
    if (fileList.length) {
        processRoutes(fileList, startDir, router, shouldAutoSetup, fileExtension, { codeSnippet, codeSnippetFn });
    }

    consoleP.complete('Route processing complete');
    console.timeEnd('✓ Ready in');

    if (!normalizedConfig.app) {
        return router;
    }
};


function validateFileExtension(ext: string): asserts ext is 'ts' | 'js' | 'mjs' | 'mts' {
    if (!['ts', 'js', 'mjs', 'mts'].includes(ext)) {
        throw new Error('Invalid file extension detected');
    }
}

function processRoutes(fileList: string[], startDir: string, router: Router, autoSetup: boolean, lang: string, { codeSnippet, codeSnippetFn }: { codeSnippet?: string, codeSnippetFn?: CodeSnippetFn }) {
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
            writeToFileSyncStartupCode(startDir, filePath, { codeSnippet, codeSnippetFn });
        }
        methodHandlers.forEach(({ method, handler }) => {
            if (typeof handler !== 'function') {
                consoleP.fail(`Handler for ${method.toUpperCase()} ${route} in ${filePath} is not a function.`);
                return;
            }
            router[method](route, handler);
        })

    });
}
