# `.devmod` Modules

## Format

A `.devmod` module is a text file containing instructions interpretable by Brylo.

### Basic Instructions

- `log: "text"` : display a message
- `ask: <id>` : ask a question to the user
- `question: "text"` : question text (after ask)
- `if: <id>` / `else:` : simple conditions
- `function <name>` : define an internal function
- `call <name>` : execute an internal function
- `exec: <command>` : run a generic system command (use with caution)

> **Warning:** Use `exec:` for shell/system commands. Avoid dangerous or destructive commands.

### Full Example

```
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

## Best Practices

- Use clear identifiers for questions and conditions
- Group internal functions at the end of the module
- Document each module with a header comment
- Validate the module before execution (syntax, instructions)
- Use `exec:` for generic commands, but avoid dangerous operations

## Going Further

- Support for variables, loops, imports (roadmap V2)
- Marketplace, module sharing (roadmap V2)
