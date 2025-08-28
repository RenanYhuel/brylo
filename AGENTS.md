# AGENTS.md

## Project Overview

brylo-cli is an ultra-clean, open source CLI project built with TypeScript. It features strict code quality, automated security, and a modular architecture for easy extension.

## Build and Test Commands

- **Build:**
    ```sh
    npm run build
    ```
- **Test:**
    ```sh
    npm test
    ```

## Code Style Guidelines

- Indentation: 4 spaces
- Single quotes for strings
- Semicolons required
- Prettier and EditorConfig enforce formatting
- ESLint for code quality

## Testing Instructions

- All tests are in the `test/` directory
- Use Jest for unit tests
- Run `npm test` before every commit/PR

## Security Considerations

- Dependabot enabled for automated dependency updates
- Run `npm audit` regularly
- See `docs/security.md` for more details

## Commit and PR Guidelines

- Use Conventional Commits (e.g., `feat: add new command`)
- All PRs must pass tests and linting
- Update documentation and changelog for every significant change

## Deployment Steps

- Releases are automated via Semantic Release
- Changelog and versioning are updated automatically

## Large Datasets / Special Instructions

- No large datasets included by default
- For subprojects, add a dedicated `AGENTS.md` in each package if needed

## For Agents

- Always read the nearest `AGENTS.md` for context
- Follow all instructions for build, test, style, and security
- Log actions and decisions for traceability

---

For more details, see `docs/architecture.md`, `docs/security.md`, and the README.
