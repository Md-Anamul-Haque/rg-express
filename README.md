# rg-express(route generator in express) user guide

> এই লাইব্রেরিটি next.js এবং express থেকে অনুপ্রেরণা নিয়ে তৈরি করা হয়েছে ৷

> This library is inspired by next.js and express.

```bash
npm i rg-express
# or
yarn add rg-express
```

## setup with new way

```
project-directory
    ├── package.json
    ├── routes
    │   ├──hello
    │   │   ├── route.js / ts -> GET,POST
    │   │   └── ...
    │   ├──product
    │   │   ├── route.js / ts
    │   │   └──[id]
    │   │        └──  route.js / ts
    │   ├──<any-api-name>
    │   │   ├── route.js / ts
    │   │   └── ...
    │   └── ..
    ├──app.js / ts
    └── ...

```

```js
// app.js
const express = require('express');

const rg = require('rg-express');
const app = express();
app.use(rg.routes(__dirname));

app.listen(8001, () => {
  console.log('server is running at http://localhost:8001');
});
```

```ts
// app.ts
import express from 'express';
import rg from 'rg-express';
const app = express();
app.use(rg.routes(__dirname));

app.listen(8001, () => {
  console.log('server is running at http://localhost:8001');
});
```

```bash
node app.js
```

## with src

```

project-directory
      ├── package.json
      ├── src
            ├──routes
            │     ├─hello
            │     │   ├── route.ts/js
            │     │   └── ...
            │     ├──product
            │     │    ├── route.ts/js
            │     │    └── ...
            │     └──<any-api-name>
            │          └── route.ts/js
            ├──app.ts/js


```

```bash
node src/app.js
```

> or
> <br />
> when routes dir is my-project/src/routes
> <br />
> and application file is my-project/app.js

```js
// my-project/app.js/ts
// ...
// when routes is my-project/src/routes
app.use(rg.routes(__dirname + '/src'));
// ...
```

```bash
node app.js
```

## route path make as it is >

### Project Structure

This project follows a modular structure to organize its codebase efficiently. Below is an overview of the key directories and their purposes:

## `routes`

The `routes` directory contains the route handlers for different parts of the application. Each subdirectory within `routes` corresponds to a specific feature or section of the app.

In your project, the routes are organized as follows:

- **`routes/abc/route.ts`**
  This file handles the route for a specific scenario.

- **`routes/abc/[slug]/route.ts`**
  This file manages the route with a single slug parameter.

- **`routes/abc/[slug]/[..slugs]/route.ts`**
  This file deals with routes containing a dynamic number of slugs.

- **`routes/abc/[..slugs]/route.ts`**
  This file handles routes with a variable number of slugs.

Ensure that you configure each route file based on your project requirements.

> Project Structure detels

In your project, the routes follow specific patterns to handle different scenarios:

- **`routes/abc/[slug]/`**
  This route corresponds to paths like `/abc/something/`. The `[slug]` indicates a dynamic parameter, and in this case, it represents a single value (e.g., `/abc/example/`). In your code, this would be accessed as `req.params.slug`.

  Example:

  ```javascript
  // In your code, accessing the value of [slug]
  app.get('/abc/:slug', (req, res) => {
    const dynamicValue = req.params.slug;
    // Your logic here
  });
  ```

- **`routes/abc/[..slugs]/`**
  This route is used for paths with multiple dynamic parameters, and the `[..slugs]` notation represents a variable number of values (e.g., `/abc/first/second/third/`). In your code, these values are accessible as an array: `req.params.slugs`.

  Example:

  ```javascript
  // In your code, accessing the values of [..slugs]
  app.get('/abc/*', (req, res) => {
    const dynamicValues = req.params[0].split('/');
    console.log(dynamicValues);
    // Your logic here
  });
  ```

  http://localhost:3000/abc/food/23

  ```css
  ['food', '23']

  ```

  These patterns allow your application to handle a variety of URL structures dynamically. Be sure to customize the route files based on your project's requirements.

<!-- ------------------------------------------------------------------------ -->

### use middlewares

```js
// route.js
module.exports.GET = [auth, getUser]; // if you want to use middlewares
module.exports.POST = [auth, authIsAdmin, newUser]; // if you want to use middlewares
module.exports.PUT = [auth, authIsAdmin, updateUser]; // if you want to use middlewares
module.exports.DELETE = [auth, authIsAdmin, deleteUser]; // if you want to use middlewares
```

## or ts

```ts
// route.ts
export const GET = [auth, getUser]; // if you want to use middlewares
export const POST = [auth, authIsAdmin, newUser]; // if you want to use middlewares
export const PUT = [auth, authIsAdmin, updateUser]; // if you want to use middlewares
export const DELETE = [auth, authIsAdmin, deleteUser]; // if you want to use middlewares
```

## Contributing

If you'd like to contribute to the project, please follow the guidelines outlined in the [CONTRIBUTING.md](CONTRIBUTING.md) file.

Happy coding!

<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />

## legacy

## project setup with Typescript --(legacy)

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

> This(\_router.ts ) file can be automatically created at startDir such as src or any, but the default is src

### how to setup on typescript

## setup just builder

> only development

```typescript
// builder.ts
// only development
import { rg } from 'rg-express';
const routerGenerators = new rg();
routerGenerators.runDevBuilder();
// ... other code
```

```josn
<!-- package.json -->
"rgbuil":"nodemon builder.ts",
# ...
```

```bash
yarn rgbuil
or
npm run rgbuil

```

## setup with my app <i><u>main.ts<u></i>

> only development

```typescript
// main.ts
// only development
import express from 'express';
import { rg } from 'rg-express';
const app = express();
const appInit = async () => {
  if ('development' === process.env.NODE_ENV) {
    const routerGenerators = new rg();
    await routerGenerators.runDevBuilder();
    await routerGenerators.init(app);
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
const appInit = async () => {
  if ('development' === process.env.NODE_ENV) {
    const routerGenerators = new rg();
    await routerGenerators.runDevBuilder();
    await routerGenerators.init(app);
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

const appInit = async () => {
  if ('development' === process.env.NODE_ENV) {
    const routerGenerators = new rg({
      startDir: 'your api dir name ("src" | "api/"|"src/api")',
    });
    await routerGenerators.runDevBuilder();
    await routerGenerators.init(app);
    await routerGenerators.runStudio(app);
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
> don't wary this file created automatically after run 'routerGenerators.runDevBuilder();' <pre>... error in \_router.ts </code>

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

```ts
// route.ts
export const GET = [auth, getUser]; // if you want to use middlewares
export const POST = [auth, authIsAdmin, newUser]; // if you want to use middlewares
export const PUT = [auth, authIsAdmin, updateUser]; // if you want to use middlewares
export const DELETE = [auth, authIsAdmin, deleteUser]; // if you want to use middlewares
```

### how to set start folder

```typescript
// this is default
const routerGenerators = new rg({ startDir: 'src' });
```
