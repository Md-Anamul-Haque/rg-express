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
│   └── [...slugs]/route.ts → /hello/{*slugs}        → req.params.slugs (string[])
```

---

## ⚙️ Basic Usage (Detailed)

rg-express makes it easy to wire up your routes by pointing to a directory. It scans the routes/ folder, maps files to route paths, and either returns an Express Router or attaches routes directly to a provided Express app. The routes function supports both TypeScript and JavaScript projects and can automatically generate starter code for empty route files.

---

### 🔹 Option 1: Minimal Setup (String Path)

The simplest way—just provide the root directory where your routes/ folder exists. This returns an Express Router that you can attach to your app.

```ts
// app.ts

import express from 'express';
import { routes } from 'rg-express';

const app = express();

app.use(express.json());
app.use(routes(__dirname)); // Loads routes from __dirname/routes

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

### 🔹 Option 2: Full Configuration (Returning Router)

Provide a configuration object to customize behavior, returning a Router for manual attachment.

```ts
import express from 'express';
import { routes } from 'rg-express';

const app = express();

app.use(
  routes({
    baseDir: __dirname, // Required: where routes/ folder lives
    routeGenIfEmpty: true, // Optional: generates starter code for empty route files
  })
);

app.listen(3000, () => {
  console.log('✅ Server ready at http://localhost:3000');
});
```

---

### 🔹 New Feature: Custom Code Snippet for `routeGenIfEmpty`

You can now pass a custom code snippet to `routeGenIfEmpty` instead of just a boolean. This allows you to define the default content for newly generated route files.

### 🔹 Option 3: Full Configuration (Attaching to App)

Provide an Express app in the configuration to automatically attach routes to it. This returns void as the routes are directly mounted.

```ts
import express from 'express';
import { routes } from 'rg-express';

const app = express();

routes({
  baseDir: __dirname,
  routeGenIfEmpty: true,
  app, // Attaches routes directly to this app instance
});

// or

app.use(
  routes({
    baseDir: __dirname,
    routeGenIfEmpty: {
      codeSnippet: `import { auth } from '@/middlewares/auth';
import { Request, Response } from 'express';

export const GET = [auth,async (req: Request, res: Response) => {
    res.send('hello');
}];`,
    },
  })
);

app.listen(3000, () => {
  console.log('✅ Server ready at http://localhost:3000');
});
```

In this example, if a route file is empty, the specified `codeSnippet` will be written to the file.

⚠️ **Note**: Passing `app` is deprecated. Prefer returning a `Router` and using `app.use()` for better flexibility.

---

### 🔹 Option 4: Use Default Export

You can use the default `rg` function, which is equivalent to `routes`:

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

#### ✅ `RouteConfig` interface options:

| Option            | Type                          | Description                                                                     |
| ----------------- | ----------------------------- | ------------------------------------------------------------------------------- |
| `baseDir`         | `string`                      | **Required.** Root folder (where `routes/` lives)                               |
| `routeGenIfEmpty` | `boolean`or `RouteGenIfEmpty` | Auto-generates starter route if file is empty                                   |
| `autoSetup`       | `boolean`                     | ⚠️ _Deprecated_ in favor of `routeGenIfEmpty`                                   |
| `app`             | `Express`                     | ⚠️ Deprecated. Attaches routes to the app (returns void). Omit to get a Router. |

---

#### Notes:

- If `autoSetup` is used, a deprecation warning is logged, recommending `routeGenIfEmpty`.
- `routeGenIfEmpty` only works if the project’s file extension (`.ts`, `.js`, `.mjs`, or `.mts`) matches the project type (TypeScript or JavaScript). For TypeScript projects, it requires `.ts` or `.mts` files.
- The `routes` function validates file extensions, supporting only `.ts`, `.js`, `.mjs`, or `.mts`.

---

## 💡 Pro Tips

Maximize `rg-express` with these best practices for organizing and scaling your Express projects:

- **Use a** `src/` **Structure**: Place your entry point (e.g., `src/main.ts`) and routes (`src/routes/*/**`) in a `src/` folder for a clean layout. Since `main.ts` is in `src/`, set `baseDir` to `__dirname`:

  ```ts
  import { routes } from 'rg-express';
  import express from 'express';

  const app = express();
  app.use(routes({ baseDir: __dirname }));
  ```

  📁 **Example Structure**:

  ```
  ├── src/
  │   ├── routes/
  │   │   ├── api/
  │   │   │   └── [id]/route.ts  → /api/:id
  │   │   └── hello/route.ts     → /hello
  │   └── main.ts
  ```

- **Enable Auto-Generation**: Set `routeGenIfEmpty: true` to create starter code for empty route files in `src/routes/`—great for rapid prototyping:

  ```ts
  app.use(routes({ baseDir: __dirname, routeGenIfEmpty: true }));
  ```

  This generates templates for new routes, requiring `.ts` for TypeScript or `.js`/`.mjs` for JavaScript.

- **Avoid Deprecated Options**: Skip `autoSetup` and `app` in `routes()`. Return a `Router` and use `app.use()` for modularity:

  ```ts
  const router = routes({ baseDir: __dirname });
  app.use('/api', router); // Mount at /api
  ```

- **Debug with Logs**: Use `rg-express` logs (e.g., "✓ Ready in") to troubleshoot route scanning or auto-generation in `src/routes/`.

---

## 📚 Bonus: What Happens Under the Hood?

Given `baseDir = __dirname`:

- **Folder Scanning**: Looks for a `routes/` folder inside `baseDir`.
- **File Matching**: Matches files named `route.ts`, `route.js`, `route.mjs`, or `route.mts`.
- **Route Mapping**: Converts folder structures to Express routes:
  - `routes/product/route.ts` → `/product`
  - `routes/product/[id]/route.ts` → `/product/:id`
  - `routes/hello/[...slugs]/route.ts` → `/hello/{*slugs}`
- **Auto-Generation**: If `routeGenIfEmpty` is `true`, generates starter code for empty route files (only if the file extension matches the project type).
- **HTTP Methods**: Supports standard HTTP methods (`GET`, `POST`, `PUT`, `DELETE`, etc.) exported from route files.
- **Performance Logging**: Logs processing time and completion status using `ProcessConsole`.

---

## ⚙️ Route Configuration

Define HTTP handlers (`GET`, `POST`, etc.) by exporting them from route files. The `routes` function automatically maps these to the corresponding Express routes.

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

Export an array to include Express middlewares before your handler:

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

We welcome contributions! Please read the CONTRIBUTING.md for details on submitting PRs or reporting issues.

---

## 🎉 Conclusion

`rg-express` makes route organization in Express apps easier, cleaner, and more modular with built-in support for:

- ✅ TypeScript & JavaScript (`.ts`, `.js`, `.mjs`, `.mts`)
- 🧠 Dynamic routes
- 🧩 Express-style middleware
- ⚡ File-based auto-loading
- 📝 Automatic starter code generation for empty files

> Build smarter APIs, faster.

---
