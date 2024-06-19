

import * as fs from 'fs';
import * as path from 'path';
function getPathParsePowers(path: string) {
    const pathSplit = path.split('/');
    // const slugPattern = /\[\w+\]/g; // Regular expression slugPattern to match '[<any>]'
    // const spreadPattern = /\[\.\.\.\w+\]/g; // Regular expression spreadPattern to match '[...<any>]'
    const pathSplitLength = pathSplit.length;
    // const slugMatches = path.match(slugPattern);
    // const slugMatchesLength = slugMatches ? slugMatches.length : 0;
    // const spreadMatches = path.match(spreadPattern);
    // const spreadMatchesLength = spreadMatches ? spreadMatches.length : 0;
    // return ({
    //     slugs: slugMatchesLength,
    //     spreads: spreadMatchesLength,
    //     splits: pathSplitLength,
    //     sum: pathSplitLength + spreadMatchesLength + slugMatchesLength
    // })
    let slugsStartAt = 0;
    let slugStartAt = 0;
    let slugsPower = 0;
    let slugPower = 0;

    pathSplit.forEach((m, i) => {
        if (m.match(/\[\w+\]/)) {
            slugPower += pathSplitLength - i
            slugStartAt = slugStartAt ? slugStartAt : i + 1;
        } else if (m.match(/\[\.\.\.\w+\]/)) {
            slugsPower += pathSplitLength - i
            slugsStartAt = slugsStartAt ? slugsStartAt : i + 1;
        }
    });
    return ({
        slugPower, slugsPower, pathSplitLength, slugsStartAt, slugStartAt
    })
}
function getSlugsLength(path: string) {
    const pattern = /\[\w+\]/g; // Regular expression pattern to match '[<any>]'
    const matches = path.match(pattern);
    return matches ? matches.length : 0;
}
function customSortSpread(a: string, b: string) {
    if (a === b) {
        return 0;
    }
    const { slugPower: slugPowerA, slugsPower: slugsPowerA, pathSplitLength: pathSplitLengthA, slugStartAt: slugStartAtA, slugsStartAt: slugsStartAtA } = getPathParsePowers(a)
    const { slugPower: slugPowerB, slugsPower: slugsPowerB, pathSplitLength: pathSplitLengthB, slugStartAt: slugStartAtB, slugsStartAt: slugsStartAtB } = getPathParsePowers(b)

    if (slugsStartAtA > slugsStartAtB) {
        return -1;
    } else if (slugsStartAtA < slugsStartAtB) {
        return 1
    } else {
        if (slugsPowerA > slugsPowerB) {
            return -1;
        } else if (slugsPowerA < slugsPowerB) {
            return 1;
        } else {
            if (slugStartAtA > slugStartAtB) {
                return -1
            } else if (slugStartAtA < slugStartAtB) {
                return 1
            } else {
                if (slugPowerA > slugPowerB) {
                    return -1
                } else if (slugPowerA < slugPowerB) {
                    return 1
                } else {
                    if (pathSplitLengthA > pathSplitLengthB) {
                        return (-1)
                    } else if (pathSplitLengthA < pathSplitLengthB) {
                        return (1)
                    } else {
                        return a.localeCompare(b);
                    }
                }
            }
        }
    }
}
function customSort(a: string, b: string): number {
    if (a === b) {
        return 0;
    }

    const hasBracketA = a.includes('[');
    const hasBracketB = b.includes('[');

    if (hasBracketA && !hasBracketB) {
        return 1;
    } else if (!hasBracketA && hasBracketB) {
        return -1;
    } else if (hasBracketA && hasBracketB) {
        const slugsALength = getSlugsLength(a)
        const slugsBLength = getSlugsLength(b)
        if (slugsALength === slugsBLength) {
            return (a.length > b.length ? -1 : 1)
        } else {
            return (slugsALength > slugsBLength ? -1 : 1)
        }
    }

    return a.localeCompare(b);
}

const sortNowAsMyG = (fl: string[]): string[] => {
    let fl1 = fl.filter(l => !l.includes('[...'))
    let fl2 = fl.filter(l => l.includes('[...'))
    const result = [...fl1.sort(customSort), ...fl2.sort(customSortSpread)]
    return (result)
}

export function readFiles(directoryPath: string, file_extension: string): string[] {
    try {
        const files: string[] = fs.readdirSync(directoryPath);
        const fileList: string[] = [];
        // ...\..\\.. --> .../..//..
        directoryPath = directoryPath.replace(/\\/g, '/');

        files.forEach((file: string) => {
            let filePath: string = path.join(directoryPath, file);

            // ...\..\\.. --> .../..//..
            filePath = filePath.replace(/\\/g, '/');

            const stats: fs.Stats = fs.statSync(filePath);
            if (stats.isDirectory()) {
                // If it's a directory, recursively read files inside it
                const subFiles: string[] = readFiles(filePath, file_extension);

                fileList.push(...subFiles);
            } else {
                let fname = filePath.split('/').at(-1) || '';
                // ...\..\\.. --> .../..//..
                fname = fname.replace(/\\/g, '/');
                const file_regex = new RegExp(`^route\.${file_extension}$`)
                // if (lang == 'ts') {
                if (file_regex.test(fname)) {
                    fileList.push(filePath);
                }
            }
        });
        let endFileList: string[] = []
        fileList.forEach(file => {
            file = file.replace(/\\/g, '/');
            if (file_extension == 'ts') {
                if (/route\.ts$/.test(file)) {
                    endFileList.push(file)
                }
            } else if (file_extension == 'js') {
                if (/route\.js$/.test(file)) {
                    endFileList.push(file)
                }
            }
        });
        return sortNowAsMyG(endFileList);
    } catch (error) {
        console.error(error)
        return ([])
    }
}