# Brylo CLI Architecture

## Folder Structure

```
├── bin/              # Global CLI entry point (brylo.js)
├── src/              # TypeScript source code (interpreter, commands)
├── test/             # Unit and integration tests
├── docs/             # Detailed documentation
├── modules/          # Sample .devmod modules
├── packs/            # Sample .devpack packs
├── .github/          # Community files
├── package.json      # Node.js & CLI config
├── tsconfig.json     # TypeScript config
├── .gitignore        # Ignore node_modules, dist, .env
├── LICENSE           # MIT License
├── CHANGELOG.md      # Version history
```

## Execution Flow

1. The user runs a command via the global CLI (`brylo <command>`)
2. The CLI parses arguments and calls the interpreter engine
3. The engine reads `.devmod` or `.devpack` files and executes instructions
4. User responses, logs, and results are displayed in real time

## Extending the CLI

- Add a command: create a file in `src/commands/`, export it and import in `src/index.ts`
- Use a CLI framework (`commander`, `yargs`) for scalability
- Document every new command in the README and docs

## Interpreter Engine

- Line-by-line reading of `.devmod` files
- Executes instructions: log, ask, if, function, call, install
- Supports interactive questions (inquirer)
- Handles internal functions and conditions

## Tests

- All new features must be covered by tests in `test/`
- Use Jest for unit and integration tests

## Contribution

- Fork, dedicated branch, PR with clear description
- Follow commit conventions and quality workflow

---

For user configuration, see [docs/config.md](docs/config.md).
For module/pack formats, see [docs/modules.md](docs/modules.md) and [docs/packs.md](docs/packs.md).
