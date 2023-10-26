import express from 'express';
import { createFile } from '../lib/createFile';
import { getUrlAndmethods } from "../lib/getUrlAndmethods";
import { readFiles } from "../lib/readFiles";
import { createRoutePath } from "../lib/utils";
const expressApp = express()

export async function studio(_app: typeof expressApp, startDirName: string, lang: 'ts' | 'js') {
  const fileList: string[] = readFiles('./' + startDirName, lang);
  const urlAndmethods = await getUrlAndmethods(fileList) as { filename: string; exportFunctions: string[] }[] || ['']
  let apiUrls: string[] = []
  urlAndmethods.forEach(({ filename, exportFunctions }) => {
    let apiUrl = createRoutePath({ name: filename, startDirName: startDirName }, lang)
    exportFunctions.forEach(method => {
      apiUrls.push(`${method.toLowerCase()}:${apiUrl}`)
    })
  });
  const studioApiRouteName = '_rg/studio/apis';
  let codes = [`//rg-express==>(nocrashsoft)\n${lang == 'ts' && "import { Request, Response, Router } from 'express';"} \nconst router = Router(); `];
  if (lang == 'ts') {
    codes.push(`let apiUrls: string[] = ["${apiUrls.join('","')}"]`)
    codes.push(`router.get('/${studioApiRouteName}', (_req: Request, res: Response) => {`)
  } else {
    codes.push(`let apiUrls = ["${apiUrls.join('","')}"]`)
    codes.push(`router.get('/${studioApiRouteName}', (_req, res) => {`)
  }
  codes.push(`
  const listItems = apiUrls.map(item =>{
    if(/get/i.test(item.split(':')[0])){
      return  \`<li> <a href="\${item.split(':').slice(1).join('/')}">\${item}</a></li>\`
    }else{
      return \`<li> \${item}</li>\`
    }
  }).join('');
  `)
  codes.push(`
    const htmlResponse = \`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </head>
      <body>
        <h1>API List</h1>
        <ul>
          \${listItems}
        </ul>
      </body>
    </html>
     \`
    `)
  codes.push("    res.send(htmlResponse);\n});\n")
  // init alother route for accept all id

  // if (lang == 'ts') {
  //   codes.push(`\nrouter.get('/${studioApiRouteName}/:method', (req: Request, res: Response) => {`);
  // } else {
  //   codes.push(`\nrouter.get('/${studioApiRouteName}/:method', (req, res) => {`);

  // } codes.push(`const {query}=req;`);
  // codes.push(`const reqMethod=req.params.method`)
  // codes.push(`const html =\`<!DOCTYPE html>
  //   <html lang="en">
  //     <head>
  //       <meta charset="UTF-8" />
  //       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  //       <title>Document</title>
  //     </head>
  //     <body>
  //       <div id="json-container">\${query?.url?'Loading...':'this is not a valid url'}</div>
  //       <script>
  //         const fetchDataAndShow = async () => {
  //               const jsonContainer = document.getElementById('json-container');

  //           try {
  //             const res = await fetch('\${query?.url}',{method:'\${reqMethod||'get'}'});
  //             if (!res.ok) {
  //               jsonContainer.textContent="Network response was not ok";
  //             } else {
  //               const data = await res.json();
  //               jsonContainer.textContent=JSON.stringify(data, null, 2);
  //             }
  //           } catch (error) {
  //             jsonContainer.textContent=error.message;
  //           }
  //         };
  //         fetchDataAndShow()
  //       </script>
  //     </body>
  //   </html>
  //   \``);
  // codes.push(`res.send(html)`);
  // codes.push('});');
  if (lang == 'ts') {
    codes.push('\n\n\nexport default router')
  } else {
    codes.push('\n\n\nexports.default = router;')
  }
  createFile(`${startDirName}/_rg.studio.${lang}`, codes.join('\n'));
}
