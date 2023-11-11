import express, { Request, Response } from 'express';
import { getUrlAndmethods } from "../lib/getUrlAndmethods";
import { readFiles } from "../lib/readFiles";
import { createRoutePath } from "../lib/utils";
import { handleStudio_ApiList } from './apis/handleStudio_ApiList';
import { handleViewStudio } from './handleViewStudio';
const expressApp = express()

export async function studio(app: typeof expressApp, startDir: string, lang: 'ts', fileList: string[] = []) {
  fileList = fileList.length ? fileList : readFiles('./' + startDir, lang);
  const urlAndmethods = await getUrlAndmethods(fileList) as { filename: string; exportFunctions: string[] }[] || ['']

  let apiUrls: string[] = [];
  urlAndmethods.forEach(({ filename, exportFunctions }) => {
    let apiUrl = createRoutePath({ name: filename, startDir: startDir }, lang)
    exportFunctions.forEach(method => {
      apiUrls.push(`${method.toLowerCase()}:${apiUrl}`)
    })
  });
  app.get('/_rg/studio', async (_req: Request, _res: Response) => {
    // @ts-ignore
    return _res?.status(200)?.send(handleViewStudio());
  });
  app.get('/_rg/studio/apis', async (_req: Request, _res: Response) => {
    const resData = await handleStudio_ApiList({
      apiUrls
    });

    // @ts-ignore
    return _res?.status(200)?.send(resData);
  });

}
