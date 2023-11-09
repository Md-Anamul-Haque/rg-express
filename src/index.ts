import express from 'express';
import { createFile } from './lib/createFile';
import makeCode from './makeCode';
import { studio } from './studio';
import { routerGenerator_ConfigProps } from './types';
const expressApp = express()

type Application = typeof expressApp;






const routerGenerator = async (lang: 'ts' | 'js', config?: routerGenerator_ConfigProps) => {
  let startDirName = config?.startDirName || 'src';
  const RegexpStartDirName = new RegExp(`^/?${startDirName}/?`)
  startDirName = startDirName.replace(/^\/src/, 'src').replace(/\/$/, '');
  startDirName = startDirName.startsWith('src') ? startDirName : 'src/' + startDirName;
  const { codes, fileList } = await makeCode({ startDirName }, lang);
  // Call the function
  const _routerFileNameAndPath = `${startDirName}/_router.${lang}`
  if (codes && Array.isArray(codes)) {
    createFile(_routerFileNameAndPath, codes.join('\n'));
  } else {
    console.log('\x1b[33m%s\x1b[0m', { codes: typeof codes });  // Yellow text
  }

  return ({ fileList, _routerFileNameAndPath: _routerFileNameAndPath.replace(RegexpStartDirName, '@') })
}


export class rg {
  private app: Application;
  private config?: { startDirName: string; };
  private startDir: string;
  private lang: 'ts' | 'js';
  private fileList?: string[];
  constructor(app: Application, config?: { startDirName?: string; lang?: 'ts' | 'js' }) {
    this.app = app;
    this.config = { startDirName: config?.startDirName || 'src' };
    this.startDir = config?.startDirName || 'src';
    this.lang = config?.lang || 'ts';
  }


  runDevBuilder() {
    return new Promise(async (resolve) => {
      const { _routerFileNameAndPath, fileList } = await routerGenerator(this.lang, this.config);
      this.fileList = fileList;
      resolve(_routerFileNameAndPath);
    })
  };
  init() {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('\x1b[34m%s\x1b[0m', 'Compiling..'); // Blue text
        const router = await import(`${this.startDir}/_router`)
        if (router) {
          this.app?.use(router.default)
          console.log('\x1b[32m%s\x1b[0m', 'Compiled successfully'); // Green text
        } else {
          console.log('\x1b[33m%s\x1b[0m', 'Compiling stop');  // Yellow text
          reject('Compiling stop');
        }
        resolve(this.app)
      } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', error); // Red text
      }
    })
  };
  runStudio() {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('\x1b[34m%s\x1b[0m', 'studio is running...'); // Blue text
        await studio(this.app, this.startDir, this.lang, this.fileList)
        console.log('\x1b[32m%s\x1b[0m', `studio run at "[::1]:[PORT]/_rg/studio"`); // Green text
        resolve('/_rg/studio')
      } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', error); // Red text
        reject(error)
      }
    })
  };
}



