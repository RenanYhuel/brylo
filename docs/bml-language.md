# Brylo Module Language (BML) - Documentation

## Introduction

Brylo Module Language (BML) is a DSL designed to describe automation modules, interactive workflows, and task packs for the Brylo CLI. This document details the syntax, grammar, concepts, best practices, edge cases, future perspectives, and potential objections. Goal: enable any user or developer to write, read, audit, and extend Brylo modules in a robust and clear way.

## 1. Foundational Principles

- **Readability**: clear syntax, minimal visual noise, explicit structure
- **Extensibility**: easy to enrich (new instructions, types, blocks)
- **Security**: control of system commands, strict validation
- **Interoperability**: possible conversion to JSON/YAML if needed
- **Testability**: modules easily testable and auditable

## 2. General Syntax

- Instructions are line by line
- Blocks are delimited by curly braces `{ ... }`
- Comments start with `#` or `//`
- Strings are enclosed in double or single quotes
- Identifiers are alphanumeric, dashes and underscores
- Lists are enclosed in brackets `[ ... ]`

## 3. Module Structure

```bml
module "example-module" {
    description: "A comprehensive example module using all main features"
    version: "1.0.0"
    author: "RenanYhuel"
    tags: ["demo", "test", "full"]

    run {
        log: "Welcome to the module!"

        ask: enableAutoTag {
            question: "Enable auto-tag? (y/n)"
            type: "bool"
            default: false
        }

    set: userName:string = "anonymous"
        ask: userName {
            question: "What is your name?"
            type: "string"
            default: "anonymous"
        }

    set: items:list = ["alpha", "beta", "gamma"]

        if: enableAutoTag {
            log: "Auto-tag enabled for ${userName}"
        } else {
            log: "Auto-tag disabled for ${userName}"
        }

        function greet {
            log: "Hello, ${userName}!"
        }
        call: greet

        for: item in items {
            exec: "echo Item: ${item}"
        }

        exec: "echo 'Module finished'"
    }
}
```

## 4. Basic Instructions (inside `run { ... }`)

### 4.1 log

Displays a message to the user.

```
log: "Text to display"
```

### 4.2 ask

Asks a question, stores the answer in a variable.

```
ask: variableName {
    question: "Question text"
    default: "y"
    type: "string|number|bool"
}
```

### 4.3 if / else

Conditional block on a variable or expression.

```
if: variableName {
    ...instructions...
} else {
    ...instructions...
}
```

**Note V1**: Only boolean variables or literals (`true`/`false`) are supported in conditions. Expressions like `x > 3` are not yet available.

### 4.4 set

Assigns a value to a variable with strict and mandatory typing.

**Note:** The syntax for assignment is strictly:

```
set: variableName:type = value
```

Where `type` must be one of:

- string
- number
- bool
- object
- list

Any other type (e.g. `boolean`, `int`, etc.) will result in a syntax error.

Examples:

```
set: x:number = 5
set: name:string = "Brylo"
set: items:list = ["a", "b", "c"]
set: flag:bool = true
set: config:object = { key: "value" }
```

### 4.4 function / call

Definition and call of internal functions.

```
function myFunction {
    ...instructions...
}
call: myFunction
```

### 4.5 exec

Executes a system command.

```
exec: "echo Hello World"
```

## 5. Data Types

- string: "text"
- number: 42
- bool: true/false
- list: ["a", "b", "c"]

## 6. Variables and Expressions

- Variables are created by `ask` or by assignment
- Usage in instructions: `${variable}`
  **Note V1**: Expressions in conditions (`x > 3`) are not yet supported. Use only boolean variables or literals.

## 7. Loops (V2)

Supported in V1:

```
for: item in items {
    log: "Item: ${item}"
}
```

## 8. Imports and Modularity (V2)

```
import: "common-functions.bml"
call: helperFunc
```

## 9. Packs (`.devpack`)

- JSON format
- List of modules to execute
- Example:

```json
{
    "name": "workflow-demo",
    "modules": ["mod1.bml", "mod2.bml"]
}
```

## 10. Edge Cases and Objections

- **Indentation vs curly braces**: curly braces are more robust, but beware of readability in large blocks
- **Command security**: `exec` must be filtered, sandboxed
- **Global vs local variables**: clearly define scope
- **Syntax errors**: strict validation, explicit messages
- **Extensibility**: plan for hooks, plugins
- **Interoperability**: possible conversion to JSON/YAML for audit or export

## 11. Best Practices

- Document each module (header, comments)
- Group internal functions
- Validate syntax before execution
- Limit use of `exec` to safe commands
- Use explicit names for variables and functions
- Test each module independently

## 12. Future Perspectives

- Loops, imports, advanced variables
- Module marketplace
- Plugins and hooks
- Static and dynamic validation
- Conversion tools (JSON, YAML, Markdown)
- Brylo IDE with syntax highlighting

## 13. Advanced Examples

### Interactive module

```bml
module "user-setup" {
    description: "User onboarding"
    run {
        log: "Welcome!"
        ask: userName {
            question: "What is your name?"
        }
        function greet {
            log: "Hello, ${userName}!"
        }
        call: greet
    }
}
```

### Module with conditions and exec

```bml
module "build-check" {
    description: "Build workflow"
    run {
        ask: doBuild {
            question: "Run build? (y/n)"
        }
        if: doBuild {
            exec: "npm run build"
            log: "Build started."
        } else {
            log: "Build skipped."
        }
    }
}
```

### Module with list and loop (V2)

```bml
module "multi-echo" {
    description: "Echo multiple items"
    run {
    set: items:list = ["a", "b", "c"]
        for: item in items {
            exec: "echo ${item}"
        }
    }
}
```

## 14. Formal Grammar (Simplified EBNF)

```
module = 'module' string '{' metadata* runBlock '}'
metadata = description | version | author | tags | ...
runBlock = 'run' '{' instruction* '}'
instruction = log | ask | if | function | call | exec | set | for | import
log = 'log:' string
ask = 'ask:' identifier '{' question (default)? (type)? '}'
if = 'if:' expression '{' instruction* '}' ('else' '{' instruction* '}')?
function = 'function' identifier '{' instruction* '}'
call = 'call:' identifier
exec = 'exec:' string
set = 'set:' identifier '=' value
for = 'for:' identifier 'in' identifier '{' instruction* '}'
import = 'import:' string
question = 'question:' string
identifier = /[a-zA-Z_][a-zA-Z0-9_-]*/
string = '"' .* '"' | '\'' .* '\''
value = string | number | bool | list | object
list = '[' value* ']'
object = '{' (identifier ':' value)* '}'
```

## 15. Validation and Parsing

- Strict syntax validation
- Parsing into AST (abstract syntax tree)
- Explicit error handling
- Linting and formatting tools

## 16. Security

- Filtering of `exec` commands
- Limiting file/system access
- Auditing modules before execution

## 17. Tools and Extensions

- Brylo linter
- Brylo formatter
- Automatic documentation generator
- Brylo <-> JSON/YAML converter
- VS Code plugin (syntax highlighting, snippets)

## 18. FAQ and Use Cases

- Project setup automation
- Interactive onboarding
- Task packs for CI/CD
- Interactive documentation modules

## 19. Roadmap

- V1: basic instructions, blocks, variables, packs
- V2: loops, imports, plugins, marketplace
- V3: IDE, advanced validation, multi-format conversion

## 20. Conclusion

Brylo Module Language aims for robustness, clarity, and extensibility. Any suggestion, objection, or improvement is welcome: the language is made to evolve with its users and their needs.

_End of detailed documentation (BML)_
