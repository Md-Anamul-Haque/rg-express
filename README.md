# rg-express

## User Guide

Welcome to the **rg-express** user guide! This document will help you get started with **rg-express**, a powerful route generator for Express that simplifies route management with file-based approach. Whether you're building APIs in TypeScript or JavaScript, **rg-express** provides a clean, intuitive way to organize your routes.

---

## 🚀 Introduction

**rg-express** is a route generator for Express, inspired by the modular routing style of **Next.js**. It helps developers manage routes with cleaner structure, reduced boilerplate, and optional middleware support — all by convention over configuration.

👉 [Explore the Example Project (TypeScript)](https://github.com/Md-Anamul-Haque/rg-express_example)

---

## 📦 Installation

Install using your preferred package manager:

```bash
npm install rg-express
# or
pnpm add rg-express
# or
yarn add rg-express
```

---

## Requirements

- **Express**: `>=5.0.0` is required for compatibility with `rg-express`.
- Make sure you have Express v5 or higher installed.
- Install Express using `npm install express@^5.0.0` , `pnpm add express@^5.0.0` or `yarn add express@^5.0.0`.
- Older versions of Express are not supported.
- For full functionality, ensure your Express version meets the requirement.

---

## 🗂️ Project Structure

### Basic Setup

#### Without `src` Directory

```
├── package.json
├── routes/
├── app.ts or app.js
```

#### With `src` Directory

```
├── package.json
├── src/
│   ├── routes/
│   └── app.ts or app.js
```

### Inside `routes` Folder

```
routes/
├── product/
│   ├── route.ts         → /product
│   └── [slug]/route.ts  → /product/:slug     → req.params.slug (string)
├── hello/
│   └── [...slugs]/route.ts → /hello/*        → req.params.slugs (string[])
```

---

## ⚙️ Basic Usage (Detailed)

`rg-express` makes it easy to wire up your routes by pointing to a directory. Under the hood, it scans the folder, maps files to route paths, and returns an Express Router. You can attach this to any Express app instance.

---

### 🔹 Option 1: Minimal Setup (String Path)

The simplest way—just provide the root directory where your `routes/` folder exists.

```ts
// app.ts

import express from 'express';
import { routes } from 'rg-express';

const app = express();

app.use(express.json());
app.use(routes(__dirname)); // Loads routes from __dirname/routes by default

app.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000');
});
```

📁 **Directory structure**

```
project-root/
├── routes/
│   └── hello/
│       └── route.ts
└── app.ts
```

🧠 In `routes/hello/route.ts`:

```ts
export const GET = (req, res) => {
  res.send('Hello world!');
};
```

🔗 Access: `http://localhost:3000/hello`

---

### 🔹 Option 2: Full Configuration

You can provide an object with more options:

```ts
import express from 'express';
import { routes } from 'rg-express';

const app = express();

app.use(
  routes({
    baseDir: __dirname, // required
    routeGenIfEmpty: true, // optional: creates template files if missing
    app, // optional: attaches directly to the app
  })
);

app.listen(3000, () => {
  console.log('✅ Server ready at http://localhost:3000');
});
```

#### ✅ `RouteConfig` interface options:

| Option            | Type      | Description                                       |
| ----------------- | --------- | ------------------------------------------------- |
| `baseDir`         | `string`  | **Required.** Root folder (where `routes/` lives) |
| `routeGenIfEmpty` | `boolean` | Auto-generates starter route if file is empty     |
| `app`             | `Express` | Optional: If provided, routes attach directly     |
| `autoSetup`       | `boolean` | ⚠️ _Deprecated_ in favor of `routeGenIfEmpty`     |

---

### 🔹 Option 3: Use Default Export

You can also use the default `rg` function:

```ts
import express from 'express';
import rg from 'rg-express';

const app = express();

app.use(rg({ baseDir: __dirname }));
```

🔁 This is equivalent to:

```ts
import { routes } from 'rg-express';

app.use(routes({ baseDir: __dirname }));
```

---

## 💡 Pro Tip

Set your routes folder to `src/routes` in a TypeScript project:

```ts
import { routes } from 'rg-express';

app.use(routes({ baseDir: path.join(__dirname, 'src') }));
```

Then put your route files under `src/routes/...`

---

## 📚 Bonus: What Happens Under the Hood?

Given `baseDir = __dirname`:

- It looks for `routes/` inside `baseDir`.
- Matches any file named `route.ts` or `route.js`
- Automatically converts folders like `routes/product/[id]/route.ts` to `/product/:id`

---

## ⚙️ Route Configuration

You define HTTP handlers (`GET`, `POST`, etc.) by exporting them from route files.

### TypeScript Example

```ts
// routes/hello/route.ts

import type { Request, Response } from 'express';

/**
 * @api_endpoint: /hello/
 */
export const GET = (req: Request, res: Response) => {
  res.send('Hello from rg-express!');
};

// With middleware
export const POST = [
  checkAuth, // your middleware
  (req: Request, res: Response) => {
    res.send('Posted with middleware!');
  },
];
```

### JavaScript Example

```js
// routes/hello/route.js

module.exports.GET = (req, res) => {
  res.send('Hello from rg-express!');
};

const handlePost = (req, res) => {
  res.send('Posted with middleware!');
};

module.exports.POST = [checkAuth, handlePost];
```

---

## 📌 Dynamic Routing

### `[slug]` – Single Dynamic Segment

```ts
// routes/abc/[slug]/route.ts

export const GET = (req: Request, res: Response) => {
  res.send(`Slug: ${req.params.slug}`);
};
```

✅ Matches: `/abc/apple`, `/abc/banana`

---

### `[...slugs]` – Catch-All Segment

```ts
// routes/abc/[...slugs]/route.ts

export const GET = (req: Request, res: Response) => {
  res.send(`Slugs: ${req.params.slugs.join(', ')}`);
};
```

✅ Matches: `/abc/a`, `/abc/a/b/c`

---

## 🛡️ Smart Middleware Support

You can use Express middlewares before your handler. Just export them as an array:

### Example with Middlewares

```ts
// routes/user/route.ts

import { Request, Response, NextFunction } from 'express';
import { auth, isAdmin } from '../../middlewares';

const getUsers = (req: Request, res: Response) => {
  res.send('List of users');
};

const createUser = (req: Request, res: Response) => {
  res.send('User created!');
};

export const GET = [auth, getUsers];
export const POST = [auth, isAdmin, createUser];
```

Or define inline handlers:

```ts
// routes/user/route.ts

export const POST = [
  auth,
  isAdmin,
  (req: Request, res: Response) => {
    // Logic here
    res.send('User created with inline handler');
  },
];
```

---

## 🧠 Dynamic Routes

### `[slug]` → Single Param

```ts
// routes/blog/[slug]/route.ts

export const GET = (req: Request, res: Response) => {
  const { slug } = req.params;
  res.send(`You requested blog: ${slug}`);
};
```

### `[...slugs]` → Wildcard / Catch-All

```ts
// routes/files/[...slugs]/route.ts

export const GET = (req: Request, res: Response) => {
  const { slugs } = req.params; // slugs is a string[]
  res.send(`Path: ${slugs.join('/')}`);
};
```

---

## 🧱 JavaScript Support

```js
// routes/hello/route.js

module.exports.GET = (req, res) => {
  res.send('Hello from JavaScript!');
};

module.exports.POST = [
  checkAuth,
  (req, res) => {
    res.send('Post with middleware in JS!');
  },
];
```

---

## 🧩 Middleware Utilities

You can create reusable middleware functions like:

```ts
// middlewares/index.ts

import { Request, Response, NextFunction } from 'express';

export const auth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    return res.status(401).send('Unauthorized');
  }
  next();
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers['x-role'] !== 'admin') {
    return res.status(403).send('Forbidden');
  }
  next();
};
```

Then reuse them smartly in routes.

---

## 🤝 Contributing

We welcome contributions! Please read the [CONTRIBUTING.md](CONTRIBUTING.md) for details on submitting PRs or reporting issues.

---

## 🎉 Conclusion

`rg-express` makes route organization in Express apps easier, cleaner, and more modular with built-in support for:

- ✅ TypeScript & JavaScript
- 🧠 Dynamic & catch-all routes
- 🧩 Express-style middleware
- ⚡ File-based auto-loading

> Build smarter APIs, faster.

---
