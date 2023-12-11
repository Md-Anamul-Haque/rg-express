# rg-express

## (route generator in express) user guide 

> express routers generator

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
    │   │   ├── route.js / ts -> export GET,POST...
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

> export methods (GET,POST,PUT,DELETE,PATCH,OPTIONS,HEAD,CONNECT,TRACE,COPY,LOCK,MOVE,UNLOCK,PROPFIND,PROPPATCH,MKCOL,CHECKOUT,SEARCH)

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

#### Happy coding!