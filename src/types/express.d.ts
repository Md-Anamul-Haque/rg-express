import 'express';

declare module 'express-serve-static-core' {
    interface ParamsDictionary {
        [key: string]: string | string[];
    }
}
