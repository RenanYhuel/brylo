# Code Quality & Workflow

## Tools

- **Husky**: Git hooks (pre-commit, pre-push, commit-msg)
- **ESLint**: TypeScript/JavaScript linting
- **Prettier**: automatic formatting
- **Commitlint**: commit conventions
- **Lint-Staged**: lint on staged files
- **CI/CD**: automated tests and releases (GitHub Actions)

## Recommended Workflow

1. Develop on a dedicated branch
2. Lint and format before commit
3. Husky hooks check quality and run tests
4. Commits follow the convention (see commitlint.config.js)
5. PRs are automatically tested and validated

## Best Practices

- Never commit directly to master
- Always pass tests before pushing
- Document every new feature

See [docs/husky.md](docs/husky.md) for hook details.
