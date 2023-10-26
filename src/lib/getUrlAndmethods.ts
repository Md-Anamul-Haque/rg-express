import { filterHttpMethods } from "./utils";
import { writeToFileSyncStartupCode } from "./writeToFileSyncStartupCode";

export const getUrlAndmethods: (fileList: string[]) => Promise<unknown> = (fileList) => {
    return new Promise((resolve) => {
        let urlAndmethods: { filename: string; exportFunctions: string[] }[] = [];
        let pandingTask = fileList.length || 0;
        fileList.forEach(filename => {
            return (async () => {
                console.log({ filename })
                writeToFileSyncStartupCode(filename);
                const exportFunctions = await import(filename)
                urlAndmethods.push({
                    filename: filename,
                    exportFunctions: filterHttpMethods(Object.keys(exportFunctions))
                });
                pandingTask--;
                if (pandingTask == 0) {
                    resolve(urlAndmethods)
                } else {
                    console.log({ pandingTask })
                }
            })()
        })
        console.log('getUrlAndmethods')

    })


}