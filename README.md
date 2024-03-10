# `rg-express` User Guide

## Introduction

`rg-express` is a route generator library for Express inspired by Next.js and Express itself. It simplifies the process of setting up routes in an Express application, following a modular structure. This guide will walk you through the installation, setup, and usage of `rg-express` in your project.

## Installation

You can install `rg-express` using npm or yarn:

```bash
npm install rg-express
# or
yarn add rg-express
```

## Project Structure
### Basic Setup
#### Without src Directory
```bash
├── package.json
├── routes
├── app.ts or app.js
└── ...
```

#### or
```bash
├── package.json
├── src
│   ├── routes
│   ├── app.ts or app.js
```

#### in routes
```bash
 routes
   ├── product
   │      ├──route.ts ['/product']
   │      └──[slug]/route.ts ['/product/:slug']
   │                    └── (req.params.slug) // string
   │── hello
   │      └──[...slugs]
   │             └── route.ts ['/hello/:*']
   │                   └── (req.params.slugs) // string[]
   └── ...
```

## Usage
#### Without src Directory

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


## Route Configuration

```typescript
// route.ts
export const GET =(req:Request,res:Response)=>{
  res.send('hello rg-express ')
}

// --------------- Middlewares ----------------
const handlePost=(req:Request,res:Response)=>{
//  ...
}

// checkAuth is a normal expressjs Middleware function
export const POST=[checkAuth,handlePost]
```
### or, <i>with js</i>

```javascript
// route.js
module.exports.GET = (req,res)=>{
  res.send('hello rg-express ')
}

// --------------- Middlewares ----------------
const handlePost=(req:Request,res:Response)=>{
//  ...
}

// checkAuth is a normal expressjs Middleware function
module.exports.POST=[checkAuth,handlePost]
```



### `routes/abc/route.ts`
The routes in this project adhere to specific patterns to handle various scenarios:

> This file handles the route for a specific scenario.

### `routes/abc/[slug]/`

This route corresponds to paths such as `/abc/something/`. The `[slug]` notation denotes a dynamic parameter, representing a single value (e.g., `/abc/example/`). In your code, access this parameter using `req.params.slug`.

### `routes/abc/[...slugs]/`

This route is designed for paths with multiple dynamic parameters, where the `[...slugs]` notation signifies a variable number of values (e.g., `/abc/first/second/third/`). In your code, these values are accessible as an array: `req.params.slugs`.

## Middlewares

You can directly assign functions for different HTTP methods with using any middlewares:


## Middlewares

You can incorporate middlewares for different HTTP methods:

### JavaScript

```javascript
// route.js
module.exports.GET = [auth, getUser]; // Middleware for GET requests
module.exports.POST = [auth, authIsAdmin, newUser]; // Middleware for POST requests
module.exports.PUT = [auth, authIsAdmin, updateUser]; // Middleware for PUT requests
module.exports.DELETE = [auth, authIsAdmin, deleteUser]; // Middleware for DELETE requests
```


### TypeScript

```typescript
// route.ts
export const GET = [auth, getUser]; // Middleware for GET requests
export const POST = [auth, authIsAdmin, newUser]; // Middleware for POST requests
export const PUT = [auth, authIsAdmin, updateUser]; // Middleware for PUT requests
export const DELETE = [auth, authIsAdmin, deleteUser]; // Middleware for DELETE requests
```




## Contributing

If you'd like to contribute to the project, please follow the guidelines outlined in the [CONTRIBUTING.md](CONTRIBUTING.md) file.

## Conclusion
With `rg-express`, you can easily organize and set up routes in your Express application, making it more modular and scalable. Happy coding!


#### Happy coding!