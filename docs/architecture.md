# brylo-cli Technical Documentation

## Architecture Overview

- **src/**: Contains all the main TypeScript source code. Organize features, commands, and utilities here.
- **bin/**: Contains the CLI entry point (`index.js`). This file imports the compiled code from `dist` and launches the CLI. It uses a shebang for direct execution.
- **test/**: Contains unit tests (Jest). All new features should be covered by tests.
- **docs/**: Documentation and guides.
- **.github/**: Community health files (issue/PR templates).

### Build & Execution Flow

```
[TypeScript code in src/] --(npm run build)--> [Compiled JS in dist/]
[bin/index.js] --(node bin/index.js)--> [Calls dist/index.js]
```

## CLI Usage

After building:

```sh
node bin/index.js
```

Or, if published globally:

```sh
brylo
```

## Example: Add a Command

1. Create a new file in `src/commands/` (e.g. `hello.ts`).
2. Export a function (e.g. `export function hello() { ... }`).
3. Import and call it from `src/index.ts` based on CLI arguments.

## Contribution Guide

- Fork the repo, clone, and create a feature branch.
- Write code in `src/`, add/modify tests in `test/`.
- Ensure all tests pass (`npm test`).
- Follow commit conventions (see CONTRIBUTING.md).
- Submit a PR with a clear description.

## Schematics

```
Project Root
├── src/
│   └── index.ts
├── bin/
│   └── index.js
├── test/
│   └── cli.test.ts
├── docs/
│   └── husky.md
├── .github/
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
├── package.json
├── tsconfig.json
├── .gitignore
├── LICENSE
```

## Extending the CLI

- Add new commands in `src/commands/`.
- Use libraries like `commander` or `yargs` for argument parsing (recommended for future scalability).
- Document every new feature in the README and docs.

## Maintainers

- See CODE_OF_CONDUCT.md for contact and reporting guidelines.

---

For more details, see README.md and CONTRIBUTING.md.
