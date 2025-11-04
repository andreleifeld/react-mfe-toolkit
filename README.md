# Enterprise React MFE Workspace (Nx + TypeScript + Module Federation)

A modular **Enterprise React architecture** built with [Nx](https://nx.dev), [TypeScript](https://www.typescriptlang.org/), and [Webpack Module Federation](https://webpack.js.org/concepts/module-federation/).

This workspace demonstrates:
* Multiple **Microfrontends (MFEs)** running as independent React applications.
* Strict **layered architecture enforcement** via Nx linting rules.
* **Shared libraries** for core logic, UI, domain, and data access.
* Custom **Nx generator** for creating new MFEs with consistent structure.
* Full TypeScript setup and linting configuration.

## Project Overview

```
apps/
|─ shell/ # Host application (main entrypoint)
|─ dashboards/ # Example MFE: dashboards module
|─ reports/ # Example MFE: reports module
|─ settings/ # Example MFE: settings module
libs/
|─ core/ # cross-cutting logic (auth, RBAC, event bus, config)
|─ ui/ # shared UI components (design system)
|─ domain/ # domain services and models
|─ data/ # API access layer (REST/GraphQL adapters)
tools/
|─ generators/mfe/ # Nx generator for new MFEs
nx.json
package.json
tsconfig.base.json
.eslintrc.json
```

## Architecture Layers

| Layer     | Description                           | Examples          | Allowed Dependencies           |
| --------- | ------------------------------------- | ----------------- | ------------------------------ |
| `app`     | Application shell / composition layer | `apps/shell`      | `core`, `ui`, `domain`, `data` |
| `feature` | Feature or MFE-specific code          | `apps/dashboards` | `core`, `ui`, `domain`, `data` |
| `domain`  | Business logic, models                | `libs/domain`     | `data`, `core`                 |
| `data`    | Data access (REST, GraphQL, etc.)     | `libs/data`       | `core`                         |
| `ui`      | Reusable presentation components      | `libs/ui`         | `core`                         |
| `core`    | Cross-cutting logic, utilities        | `libs/core`       | `core`                         |

These boundaries are **enforced automatically** by ESLint using the Nx rule `@nx/enforce-module-boundaries`.
Any violation will cause linting to fail.

## Setup & Installation

### 1. Install

```bash
yarn install
```

### 2. Verify the Nx CLI

```bash
yarn nx --version
```

### 3. Start all MFEs

Run each app in a separate terminal:

```bash
# Host (Shell)
yarn nx serve shell

# Remotes
yarn nx serve dashboards
yarn nx serve reports
yarn nx serve settings
```

Each remote runs on its own port:

* `dashboards` → http://localhost:4201
* `reports` → http://localhost:4202
* `settings` → http://localhost:4203

The `shell` will be available at http://localhost:4200 and dynamically load the remotes via Module Federation.

To start every MFE from a single terminal, let Nx orchestrate all serve targets:

```bash
yarn nx run-many --target=serve --projects=shell,dashboards,reports,settings --parallel --maxParallel=4
```

> Each dev server keeps running, so stop them with `Ctrl+C` in that terminal when you're done.

## Module Federation Setup

The shell defines its remotes in `apps/shell/module-federation.config.js:`

```js
remotes: [
  ['dashboards', 'http://localhost:4201/remoteEntry.js'],
  ['reports', 'http://localhost:4202/remoteEntry.js'],
  ['settings', 'http://localhost:4203/remoteEntry.js']
]
```

Each remote exposes a single entry:

```js
exposes: {
    './Module': './apps/<mfe-name>/src/remote-entry.tsx'
}
```

This allows the shell to load routes dynamically:

```ts
const Dashboards = React.lazy(() => import('dashboards/Module'));
```

## Shared Libraries

| Library    | Purpose                                        | Example                             |
| ---------- | ---------------------------------------------- | ----------------------------------- |
| core       | Authentication, RBAC, configuration, event bus | `libs/core/src/lib/auth.service.ts` |
| ui         | Design system (buttons, modals, layout)        | `libs/ui/src/lib/Button.tsx`        |
| domain     | Business models, domain logic                  | `libs/domain/src/lib/index.ts`      |
| data       | API clients (REST, GraphQL, caching)           | `libs/data/src/lib/http.ts`         |

All libraries are tagged in `project.json` with the correct `layer:*` tag.

## Nx Commands

| Command                                                                                                   | Description                    |
| --------------------------------------------------------------------------------------------------------- | ------------------------------ |
| `yarn nx serve <app>`                                                                                     | Run app in dev mode            |
| `yarn nx build <app>`                                                                                     | Build for production           |
| `yarn nx lint <project>`                                                                                  | Run ESLint for a given app/lib |
| `yarn nx graph`                                                                                           | Visualize dependency graph     |
| `yarn nx affected:lint`                                                                                   | Lint only changed projects     |
| `yarn nx affected:build`                                                                                  | Build only changed projects    |
| `yarn nx run-many --target=build --all`                                                                   | Build everything               |
| `yarn nx run-many --target=serve --projects=shell,dashboards,reports,settings --parallel --maxParallel=4` | Serve all MFEs at once         |

## Creating a new Microfrontend

This workspace includes a custom Nx generator located at `tools/generators/mfe.`

Run:

```bash
yarn nx g ./tools/generators.json:mfe --name=<mfe-name> --port=<port>
```

Example:

```bash
yarn nx g ./tools/generators.json:mfe --name=analytics --port=4210
```

This will:

* Scaffold `apps/analytics/` with the correct Nx structure.
* Create `project.json`, `module-federation.config.js`, `webpack.config.js`, and entry files.
* Tag the project as `layer:feature`.

You can then add it to the shell’s federation config to load it dynamically.

## Example Routing (Shell)

The shell uses React Router and lazy loads each remote:

```tsx
import { Link, Route, Routes } from 'react-router-dom';
const Dashboards = React.lazy(() => import('dashboards/Module'));
const Reports = React.lazy(() => import('reports/Module'));
const Settings = React.lazy(() => import('settings/Module'));

<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/dashboards" element={<Dashboards />} />
  <Route path="/reports" element={<Reports />} />
  <Route path="/settings" element={<Settings />} />
</Routes>
```

## Linting & Quality

The `.eslintrc.json` root config enforces:

* Architectural boundaries (no illegal cross-layer imports)
* Common TypeScript linting rules
* Prettier integration

Run manually:

```bash
yarn nx lint
```

## Building All Apps

To produce production builds of all MFEs:

```bash
yarn nx run-many --target=build --all
```

Outputs are placed in `dist/apps/<name>`.

## Dependency Graph Visualization

You can visualize the project structure with:

```bash
yarn nx graph
```

This opens an interactive dependency map in your browser.

## Best Practices

✅ Keep domain logic inside libs/domain - never inside components.
✅ Use libs/data for API integrations (REST, GraphQL).
✅ Avoid circular dependencies between features.
✅ Use the Nx generator for new MFEs - don’t copy-paste manually.
✅ Use RxJS for cross-feature event streams or pub/sub behavior.

## Troubleshooting

| Issue                           | Cause                                | Fix                                                |
| ------------------------------- | ------------------------------------ | -------------------------------------------------- |
| Remote not loading              | Wrong `remoteEntry.js` URL           | Check `module-federation.config.js`                |
| TypeScript errors               | TS paths misaligned                  | Run `yarn nx graph` or verify `tsconfig.base.json` |
| ESLint failing on imports       | Layer violation                      | Adjust tags or fix import direction                |
| Module Federation runtime error | Version mismatch between React or Nx | Run `yarn dedupe` and reinstall                    |

## License

MIT - You are free to use, modify, and extend this architecture 🖖
