# Advanced Husky & Commitlint Setup

Husky is installed via the `prepare` script in `package.json`.

## Hooks configured

- `.husky/pre-commit`: Runs lint, format, and lint-staged for staged files.
- `.husky/pre-push`: Runs all tests before pushing.
- `.husky/pre-merge`: Runs lint before merging.
- `.husky/commit-msg`: Enforces Conventional Commits and header length.
- `.husky/pre-commit-to-master`: Asks for confirmation before committing directly to master.

## How to initialize

1. Install dependencies: `npm install`
2. Run the prepare script: `npm run prepare`
3. Hooks are in `.husky/` and can be customized as needed.

## Commitlint

- Enforces a wide range of commit types (see `commitlint.config.js`).
- Checks subject case and header length.

## Lint-Staged

- Runs ESLint and Prettier on staged files of type js, ts, json, md.
- Auto-adds fixed files to the commit.

## Best Practices

- Never commit directly to master without confirmation.
- Always run tests before pushing.
- Keep commit messages clear and conventional.

## Manual hook management

If needed, create or edit hooks in `.husky/` manually for advanced workflows.

For more details, see the official Husky and Commitlint documentation.
