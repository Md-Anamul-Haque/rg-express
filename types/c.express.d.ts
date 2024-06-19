import 'express-serve-static-core';

declare module 'express-serve-static-core' {
    interface Request {
        '*-params'?: {
            [key: string]: string[];
        };
    }
}
declare global {
    namespace Express {
        interface Request {
            '*-params'?: {
                [key: string]: string[];
            };
        }
    }
}