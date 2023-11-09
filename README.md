# rg-express(route generator in express) user guide

> এই লাইব্রেরিটি next.js এবং express থেকে অনুপ্রেরণা নিয়ে তৈরি করা হয়েছে ৷

> This library is inspired by next.js and express.

```bash
npm i rg-express
# or
yarn add rg-express
```

## project setup

```
project-directory
├── .eslintignore
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
│   ├──_router.ts
│   └── ..
│
└── ...

```

> This(\_router.ts ) file can be automatically created at startDirName such as src or any, but the default is src

### how to setup on typescript

## setup <i><u>main.ts<u></i>

> only development

```typescript
// main.ts
// only development
import express from 'express';
import { rg } from 'rg-express';
const app = express();
const routerGenerators = new rg(app);
const appInit = async () => {
  if ('development' === process.env.NODE_ENV) {
    await routerGenerators.runDevBuilder();
    await routerGenerators.init();
  }
  // ... other code
};
appInit();
```

> only production

```typescript
// main.ts
// only production
import express from 'express';
const app = express();
import router from './_router';
app.use(router);
// ... other code
```

> both (development | production)

But in this case the first thing to do is turn on the development mode recommended.

It is just for the first time to launch so that you get a clear idea.

But when you start your work follow the setup below.

```typescript
// main.ts
// both (development | production)
import express from 'express';
import { rg } from 'rg-express';
import router from './_router';

const app = express();
const routerGenerators = new rg(app);
const appInit = async () => {
  if ('development' === process.env.NODE_ENV) {
    await routerGenerators.runDevBuilder();
    await routerGenerators.init();
  } else {
    app.use(router);
  }
  // ... other code
};
appInit();
// ... other code
```

#### if you want better feel with development and production follow this

```ts
import { rg } from 'rg-express';
const app = express();

const routerGenerators = new rg(app, {
  startDirName: '[your api folder path]',
});
const appInit = async () => {
  if ('development' === process.env.NODE_ENV) {
    await routerGenerators.runDevBuilder();
    await routerGenerators.init();
    await routerGenerators.runStudio();
  } else {
    const router = await import('[your path]/_router'); // make sure this file name
    app.use(router.default);
  }

  // app.[your some options with app]

  //--------------- app route not found error-----------------------
  app.use((req: Request, res: Response, next: NextFunction) => {
    return res.send('route not found');
  });
  //-----------------app server error----------------------
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    return res.send('APP INTERNAL SERVER ERROR');
  });
};
appInit();
```

> <code><pre>if you get any error in \_router.ts then delete this \_router.ts
> don't wary this file created automatically after run 'routerGenerators.runDevBuilder();' <pre>... error in \_router.ts/js </code>

## .eslintignore

```eslintignore
*_router.ts

```

## api router handler

```typescript
// src/hello/route.ts
import { type Request, type Response } from 'express'
const getRequest = async (req: Request, res: Response) => {
  res.send('hello')
}
export const GET = getRequest
// as like as you can export 'GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'

```

GET:http://localhost:4000/hello

```typescript
// src/user/[person]/route.ts
import { type Request, type Response } from 'express'
const authUser =(req: Request, res: Response,next:NextFunction)=>{
  if(isvalid){
    next()
  }else{
    res.send('user not a valid');
  }
}
const userName=req.params.person
const getUser = async (req: Request, res: Response) => {
  res.send(userName)
}
export const GET = [authUser,getUser]

```

GET:http://localhost:4000/user/muhammad

```typescript
// /abc/[..slugs] / route.ts;
import { type Request, type Response } from 'express'

const getRequest = async (req: Request, res: Response) => {
    const slugs = req.params[0].split('/');
    res.send(`Product Parameters: ${slugs}`);

}
export const GET = getRequest


// output: Captured slugs: n,o,c,r,a,s,h,s,o,f,t
```

GET:http://localhost:3000/abc/n/o/c/r/a/s/h/s/o/f/t

### use middlewares

```typescript
// route.ts
export const GET = [auth, getUser]; // if you want to use middlewares
export const POST = [auth, authIsAdmin, newUser]; // if you want to use middlewares
export const PUT = [auth, authIsAdmin, updateUser]; // if you want to use middlewares
export const DELETE = [auth, authIsAdmin, deleteUser]; // if you want to use middlewares
```

## javascript

### how to setup on javascript

## setup <i><u>main.js<u></i>

```js
// ... pree code
const routerGenerators = new rg(app, { lang: 'js' });

// ... other
```

default is {lang:'ts'}

### how to set start folder

```typescript
// this is default
const routerGenerators = new rg(app, { startDirName: 'src' });
```
