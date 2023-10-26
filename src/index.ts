// export const sum = (a: number, b: number) => {
//   if ('development' === process.env.NODE_ENV) {
//     console.log('boop');
//   }
//   return a + b;
// };
import express from 'express';
import { createFile } from './lib/createFile';
import makeCode, { nnProps } from './makeCode';
import { studio } from './studio';
const expressApp = express()

const routerGenerator = async (lang: 'ts' | 'js', config?: nnProps) => {
  let startDirName = config?.startDirName || 'src';
  const RegexpStartDirName = new RegExp(`^/?${startDirName}/?`)
  console.log({ RegexpStartDirName })
  startDirName = startDirName.replace(/^\/src/, 'src').replace(/\/$/, '');
  startDirName = startDirName.startsWith('src') ? startDirName : 'src/' + startDirName;
  const codes = await makeCode({ startDirName }, lang);
  // Call the function
  console.log({ codes })
  const _routerFileNameAndPath = `${startDirName}/_router.${lang}`
  if (codes && Array.isArray(codes)) {
    createFile(_routerFileNameAndPath, codes.join('\n'));
  } else {
    console.warn({ codes: typeof codes })
  }
  console.log(codes)

  return _routerFileNameAndPath.replace(RegexpStartDirName, '@')
}


export class rg {
  private app: typeof expressApp;
  private config?: { startDirName: string; };
  private startDir: string;
  private lang: 'ts' | 'js';
  constructor(app: typeof expressApp, config?: { startDirName?: string; lang?: 'ts' | 'js' }) {
    this.app = app;
    this.config = { startDirName: config?.startDirName || 'src' };
    this.startDir = config?.startDirName || 'src';
    this.lang = config?.lang || 'ts';
  }


  runDevBuilder() {
    return routerGenerator(this.lang, this.config);
  };
  init() {
    const handleInit = async () => {
      try {
        console.log('Compiling..')
        const router = await import(`${this.startDir}/_router`)
        if (router) {
          this.app.use(router.default)
          console.log('Compiled successfully')
        } else {
          console.log('Compiling stop')
        }
      } catch (error) {
        console.log('Compiling error...')
        console.log(error)
      }
    };
    setTimeout(handleInit, 100)
  };
  async runStudio() {
    await studio(this.app, this.startDir, this.lang)
    const handleInit = async () => {
      try {
        const router = await require(`${this.startDir}/_rg.studio`)
        if (router) {
          this.app.use(router.default)
          console.log('studio is running on like this hostname/_rg/studio/apis')
        }
      } catch (error) {
        console.log(error)
      }
    };
    setTimeout(handleInit, 100)
  };
}



