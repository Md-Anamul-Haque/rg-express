// readFiles.ts
import * as fs from 'fs';
import * as path from 'path';
import { FileExt } from '../types';
import { checkForDuplicateParams } from './utils';

interface PathPower {
    slugPower: number;
    slugsPower: number;
    pathSplitLength: number;
    slugStartAt: number;
    slugsStartAt: number;
}
class PathParser {
    private static readonly SLUG_PATTERN = /\[\w+\]/g;
    private static readonly SPREAD_PATTERN = /\[\.\.\.\w+\]/g;

    static getPathPowers(filePath: string): PathPower {
        const segments = filePath.split('/');
        const pathSplitLength = segments.length;
        let slugPower = 0;
        let slugsPower = 0;
        let slugStartAt = 0;
        let slugsStartAt = 0;

        segments.forEach((segment, index) => {
            if (segment.match(this.SLUG_PATTERN)) {
                slugPower += pathSplitLength - index;
                slugStartAt = slugStartAt || index + 1;
            } else if (segment.match(this.SPREAD_PATTERN)) {
                slugsPower += pathSplitLength - index;
                slugsStartAt = slugsStartAt || index + 1;
            }
        });

        return { slugPower, slugsPower, pathSplitLength, slugStartAt, slugsStartAt };
    }

    static getSlugsCount(filePath: string): number {
        const matches = filePath.match(this.SLUG_PATTERN);
        return matches?.length || 0;
    }
}

class PathSorter {
    static sortSpread(a: string, b: string): number {
        if (a === b) return 0;

        const aPowers = PathParser.getPathPowers(a);
        const bPowers = PathParser.getPathPowers(b);

        return (
            bPowers.slugsStartAt - aPowers.slugsStartAt ||
            bPowers.slugsPower - aPowers.slugsPower ||
            bPowers.slugStartAt - aPowers.slugStartAt ||
            bPowers.slugPower - aPowers.slugPower ||
            bPowers.pathSplitLength - aPowers.pathSplitLength ||
            a.localeCompare(b)
        );
    }

    static sortBasic(a: string, b: string): number {
        if (a === b) return 0;

        const hasBracketA = a.includes('[');
        const hasBracketB = b.includes('[');

        if (hasBracketA !== hasBracketB) {
            return hasBracketA ? 1 : -1;
        }

        if (hasBracketA && hasBracketB) {
            const slugsDiff = PathParser.getSlugsCount(b) - PathParser.getSlugsCount(a);
            return slugsDiff !== 0 ? slugsDiff : b.length - a.length;
        }

        return a.localeCompare(b);
    }

    static sortFiles(fileList: string[]): string[] {
        const basicFiles = fileList.filter(f => !f.includes('[...'));
        const spreadFiles = fileList.filter(f => f.includes('[...'));

        return [
            ...basicFiles.sort(this.sortBasic),
            ...spreadFiles.sort(this.sortSpread)
        ];
    }
}

export class FileReader {
    private static normalizePath(filePath: string): string {
        return filePath.replace(/\\/g, '/');
    }

    private static isRouteFile(fileName: string, extension: string): boolean {
        return new RegExp(`^route\.${extension}$`).test(fileName);
    }

    static readFiles(directoryPath: string, fileExtension: FileExt): string[] {
        try {
            const normalizedDir = this.normalizePath(directoryPath);
            const files = fs.readdirSync(normalizedDir);
            const fileList: string[] = [];

            for (const file of files) {
                const filePath = this.normalizePath(path.join(normalizedDir, file));
                const stats = fs.statSync(filePath);

                if (stats.isDirectory()) {
                    fileList.push(...this.readFiles(filePath, fileExtension));
                } else {
                    const fileName = path.basename(filePath);
                    if (this.isRouteFile(fileName, fileExtension)) {
                        // checkForDuplicateParams if dublicate params then throw error
                        checkForDuplicateParams(filePath);
                        fileList.push(filePath);
                    }
                }
            }

            return PathSorter.sortFiles(fileList);
        } catch (error) {
            console.error('Error reading files:', error);
            return [];
        }
    }
}