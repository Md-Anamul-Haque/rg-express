export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head' | 'connect' | 'trace';

export type FileExt = 'ts' | 'js' | 'mjs' | 'mts';

export type RouteGenIfEmpty = Boolean | ({ codeSnippet: string }) | undefined