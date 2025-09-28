export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head' | 'connect' | 'trace';

export type FileExt = 'ts' | 'js' | 'mjs' | 'mts';

export type CodeSnippetFn = (config: { spreadParams: string[], slugParams: string[], allParams: string[] }) => string;
export type RouteGenIfEmpty = Boolean | ({ codeSnippet?: string, codeSnippetFn?: CodeSnippetFn }) | undefined