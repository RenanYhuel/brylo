# brylo-cli

[![npm version](https://img.shields.io/npm/v/brylo-cli?style=flat-square)](https://www.npmjs.com/package/brylo-cli)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/RenanYhuel/brylo/ci.yml?branch=master&style=flat-square)](https://github.com/RenanYhuel/brylo/actions)
[![Coverage Status](https://img.shields.io/badge/coverage-100%25-brightgreen?style=flat-square)](./test)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](https://github.com/RenanYhuel/brylo/pulls)
[![GitHub stars](https://img.shields.io/github/stars/RenanYhuel/brylo?style=flat-square)](https://github.com/RenanYhuel/brylo/stargazers)
[![Last commit](https://img.shields.io/github/last-commit/RenanYhuel/brylo?style=flat-square)](https://github.com/RenanYhuel/brylo/commits/master)

# Brylo CLI V1

**Brylo** is a clean open source CLI designed to install, run, create, and edit `.devmod` modules and `.devpack` packs interactively, with no server or authentication required.

---

## Table of Contents

- [Goal](#goal)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Main Commands](#main-commands)
- [`.devmod` Modules](#devmod-modules)
- [`.devpack` Packs](#devpack-packs)
- [Interpreter Engine](#interpreter-engine)
- [User Configuration](#user-configuration)
- [Quality & Security](#quality--security)
- [V1 Roadmap](#v1-roadmap)
- [Usage Examples](#usage-examples)
- [Detailed Documentation](#detailed-documentation)

---

## Goal

Create a global CLI that enables:

- Installation and execution of `.devmod` modules and `.devpack` packs
- Interactive creation and editing of these modules/packs
- Interactive questions, logs, conditions, functions
- 100% local, open source operation, no server

---

## Project Structure

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

See [docs/architecture.md](docs/architecture.md) for technical details.

---

## Installation

```bash
npm install -g .
# Global access:

```

---

## Main Commands

| Command                    | Description                   |
| -------------------------- | ----------------------------- |
| brylo list                 | List available modules        |
| brylo use <module>         | Run a `.devmod` module        |
| brylo create module <name> | Create a new `.devmod` module |
| brylo create pack <name>   | Create a new `.devpack` pack  |
| brylo edit module <name>   | Open a module for editing     |
| brylo edit pack <name>     | Open a pack for editing       |

See [docs/architecture.md](docs/architecture.md) for CLI extension.

---

## `.devmod` Modules

Text files containing interpretable instructions:

- `log: "text"` : display a message
- `ask: <id>` : ask a question to the user
- `question: "text"` : question text
- `if: <id>` / `else:` : simple conditions
- `function <name>` : define an internal function
- `call <name>` : execute an internal function
- `exec: <command>` : run a generic system command (use with caution)

> **Warning:** Use `exec:` for shell/system commands. Avoid dangerous or destructive commands.

Example:

```txt
log: "Welcome to the TagWin module!"
ask: enableAutoTag
question: "Do you want to enable auto-tag? (y/n)"
if: enableAutoTag
	log: "Auto-tag enabled"
else:
	log: "Auto-tag disabled"
function exampleFunc
	log: "This is an internal function"
call exampleFunc
exec: echo "Module finished"
```

See [docs/modules.md](docs/modules.md) for full format and best practices.

---

## `.devpack` Packs

JSON files listing modules to be executed sequentially:

```json
{
    "name": "react-tagwin-chat-cn",
    "modules": ["tagwin.devmod", "react-setup.devmod", "chat-cn.devmod"]
}
```

See [docs/packs.md](docs/packs.md) for format and validation.

---

## Interpreter Engine

Reads `.devmod` files line by line, executes instructions, manages interactive questions, internal functions, and conditions.

See [docs/architecture.md](docs/architecture.md) for technical flow.

---

## User Configuration

Modules and packs are stored outside the global npm folder, in a configurable directory (e.g. `~/.brylo-cli`).

On first use, the CLI asks:

```
Where do you want to store your modules and packs? [default: ~/.brylo-cli]
```

The path is saved in `config.json`.

See [docs/config.md](docs/config.md) for management and related commands.

---

## Quality & Security

- Husky: Git hooks (lint, test, commit)
- ESLint & Prettier: clean and formatted code
- Commitlint: commit conventions
- Lint-Staged: lint on staged files
- CI/CD: automated tests and releases
- Security audit: npm audit, Dependabot

See [docs/quality.md](docs/quality.md) and [docs/security.md](docs/security.md).

---

## V1 Roadmap

- Global CLI with list, use, create, edit
- Minimal `.devmod` engine: log, ask, if, function, call, install
- `.devpack` JSON packs running modules sequentially
- Configurable user folder
- Clean repo with Husky, ESLint, CHANGELOG

---

## Usage Examples

```bash
# Install the CLI globally
npm install -g .

# List modules
brylo list

# Run a module
brylo use tagwin

# Create a new module
brylo create module myModule

# Edit a module
brylo edit module myModule

# Create a pack
brylo create pack myPack
```

---

## Detailed Documentation

- [docs/architecture.md](docs/architecture.md): Technical structure, CLI extension
- [docs/modules.md](docs/modules.md): `.devmod` format and best practices
- [docs/packs.md](docs/packs.md): `.devpack` format and validation
- [docs/config.md](docs/config.md): User configuration
- [docs/quality.md](docs/quality.md): Quality, Husky, ESLint, Prettier
- [docs/security.md](docs/security.md): Security, audit, dependencies

---

## Contribution & Code of Conduct

See [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
