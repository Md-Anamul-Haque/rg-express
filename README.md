# rg-express(route generator express) user guide

> "This library is crafted with inspiration from Next.js and Express, seamlessly blending the efficient file system reading and API route creation of Next.js with the intuitive routing and middleware support of Express."

> "এই লাইব্রেরিটি next.js এবং express থেকে অনুপ্রেরণা নিয়ে তৈরি করা হয়েছে, এক্সপ্রেসের স্বজ্ঞাত রাউটিং এবং মিডলওয়্যার সমর্থনের সাথে নেক্সট.js দক্ষ ফাইল সিস্টেম রিডিং এবং এপিআই রুট তৈরির সাথে নির্বিঘ্নে মিশ্রিত করা হয়েছে।

Congrats! You just saved yourself hours of work by bootstrapping this project with rg-express. Let’s get you oriented with what’s here and how to use it.

> This rg-express setup is meant for developing libraries (not apps!) that can be published to NPM. If you’re looking to build a Node app, you could use `ts-node-dev`, plain `ts-node`, or simple `tsc`.

> If you’re new to TypeScript, checkout [this handy cheatsheet](https://devhints.io/typescript)

## project setup

```
project-directory
├── .vscode
│   └── settings.json
├── .eslintrc.json
├── tsconfig.json
├── package.json
├── src
│   ├──hello
│   │   ├── route.ts
│   │   └── ...
│   ├──product
│   │   ├── route.ts
│   │   └── ...
│   ├──<any-api-name>
│   │   ├── route.ts
│   │   └── ...
│   ├──main.ts
│   └── ..
│
└── ...

```

### package.json config

```json
// package.json
...,
  "scripts": {
    "dev": "NODE_ENV=development nodemon --watch 'src/**/*.ts' --exec 'ts-node -r tsconfig-paths/register' src/main.ts",
    "start": "ts-node src/main.ts",
  },
    "nodemonConfig": {
    "ignore": [
      "src/**/_router.ts"
    ]
  },
```

### tsconfig.json

```json
// tsconfig.json
{
  "compilerOptions": {
    "incremental": true /* Enable incremental compilation */,
    "target": "es2016" /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */,
    "module": "commonjs" /* Specify what module code is generated. */,
    "rootDir": "./src" /* Specify the root folder within your source files. */,
    "outDir": "./dist",
    "moduleResolution": "node" /* Specify how TypeScript looks up a file from a given module specifier. */,
    "baseUrl": "." /* Specify the base directory to resolve non-relative module names. */,
    "resolveJsonModule": true /* Enable importing .json files */,
    "allowJs": true /* Allow JavaScript files to be a part of your program. Use the `checkJS` option to get errors from these files. */,
    "noEmit": true /* default Disable emitting files from a compilation. */,
    "isolatedModules": true /* Ensure that each file can be safely transpiled without relying on other imports. */,
    "esModuleInterop": true /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables `allowSyntheticDefaultImports` for type compatibility. */,
    "forceConsistentCasingInFileNames": true /* Ensure that casing is correct in imports. */,
    "strict": true /* Enable all strict type-checking options. */,
    "skipLibCheck": true /* Skip type checking all .d.ts files. */,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules"]
}
```

### .eslintrc.json

```josn
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": "standard-with-typescript",
  "overrides": [],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "@typescript-eslint/explicit-function-return-type": "off"
  }
}


```

### .vscode/settings.json

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[typescript]": {
    "editor.formatOnSave": false
  },
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  },
  "eslint.enable": true,
  "eslint.alwaysShowStatus": true,
  "eslint.validate": ["typescript", "javascript"]
}
```

## Commands

rg-express scaffolds your new library inside `/src`.

To run rg-express, use:

```bash
git clone this repo
cd this-repo
# for install all depandances
yarn
# and
yarn dev

```

## use tips

```ts
// /abc/[slug]/route.ts
//  as like as /abc/:slug
const slugValue = req.params.slug;
res.send(slugValue)
http://localhost:3000/abc/muhammad

// output: muhammad

```

```ts
// /abc/[..slug] / route.ts;
//  as like as /abc/:slug
import { type Request, type Response } from 'express'

const getRequest = async (req: Request, res: Response) => {
    const slugs = req.params[0].split('/');
    res.send(`Product Parameters: ${slugs}`);

}
export const GET = getRequest

// http://localhost:3000/abc/n/o/c/r/a/s/h/s/o/f/t

// output: Captured slugs: n,o,c,r,a,s,h,s,o,f,t
```

this <mark>middleware</mark> as like as <mark>express middleware</mark>

### use middlewares

```ts
export const GET = [auth, authIsAdmin, getRequest]; // if you want to use middlewares

// to

// app.[method](pathname,auth, authIsAdmin, getRequest)
```

## setup <i><u>main.ts<u></i>

```ts
// main.ts
import { routerGenerators } from 'rg-express';
if ('development' === process.env.NODE_ENV) {
  routerGenerators();
}
```

> `this is default props routerGenerators([{startWiths:'src'}])`

```ts
// main.ts
// ...*/**

import { rg } from 'rg-express';

const routerGenerators = new rg(app);
if ('development' === process.env.NODE_ENV) {
  routerGenerators.runDevBuilder();
}
routerGenerators.init();
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
```

## and you can access file system routeing like nextjs
