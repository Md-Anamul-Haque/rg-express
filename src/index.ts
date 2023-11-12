import express from 'express';
import { createFile } from './lib/createFile';
import { processConsole } from './lib/processConsole';
import { normalizePath } from './lib/utils';
import makeCode from './makeCode';
import { routes } from './routers';
import { studio } from './studio';
import { routerGenerator_ConfigProps } from './types';
const expressApp = express()

type Application = typeof expressApp;






const routerGenerator = async (lang: 'ts' | 'js', config: routerGenerator_ConfigProps) => {
  let startDir = config.startDir;
  const { codes, fileList } = await makeCode({ startDir }, lang);
  // Call the function
  const _routerFileNameAndPath = `${startDir}/_router.${lang}`;
  // console.log({ _routerFileNameAndPath })
  if (codes && Array.isArray(codes)) {
    createFile(_routerFileNameAndPath, codes.join('\n'));
  } else {
    console.log('\x1b[33m%s\x1b[0m', { codes: typeof codes });  // Yellow text
  }

  return ({ fileList, _routerFileNameAndPath: _routerFileNameAndPath })
}

export class rg {
  private config: { startDir: string; };
  private startDir: string;
  private lang: 'ts';
  private fileList?: string[];
  constructor(config?: { startDir?: string; lang?: 'ts' }) {
    this.config = { startDir: normalizePath(config?.startDir || 'src') };
    this.startDir = normalizePath(config?.startDir || 'src');
    this.lang = config?.lang || 'ts';
  }


  runDevBuilder() {
    const devBuildProcessConsole = new processConsole()
    return new Promise(async (resolve) => {
      devBuildProcessConsole.start('building..');
      const { _routerFileNameAndPath, fileList } = await routerGenerator(this.lang, this.config);
      this.fileList = fileList;
      devBuildProcessConsole.complete('build successfully')
      resolve(_routerFileNameAndPath);
    });
  };
  init(app: Application) {
    return new Promise(async (resolve, reject) => {
      const initProcessConsole = new processConsole()
      try {
        initProcessConsole.start('app initalizing...');
        const router = await import(`${this.startDir}/_router`)
        if (router) {
          app?.use(router.default)
          initProcessConsole.complete('app initialized');
        } else {
          initProcessConsole.error('app initalizing stop')
          reject('app initalizing stop');
        }
        resolve(app)
      } catch (error) {
        initProcessConsole.error((error as any)?.message || 'error init')
      }
    })
  };
  runStudio(app: Application) {
    const studioProcessConsole = new processConsole();
    return new Promise(async (resolve, reject) => {
      try {
        studioProcessConsole.start('studio is running...');
        await studio(app, this.startDir, this.lang, this.fileList);
        studioProcessConsole.complete(`studio run at "[::1]:[PORT]/_rg/studio"`);
        resolve('/_rg/studio');
      } catch (error) {
        studioProcessConsole.error((error as any)?.message || 'error init')
        reject(error)
      }
    })
  };
}


export * from './routers';
export default Object.assign(rg, {
  routes: routes
});