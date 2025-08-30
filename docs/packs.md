# Brylo Packs (`.bpack`)

## Format

A Brylo pack is a JSON file (recommended extension: `.bpack`) listing `.bml` modules to be executed sequentially.

> **Note:** For module syntax and advanced features, refer to the [Brylo Module Language Documentation](./bml-language.md).

Packs are collections of Brylo modules that define a complete workflow or automation pipeline. Each module in the pack must use the `.bml` extension and follow the BML syntax and conventions. Packs allow you to organize and execute multiple modules in sequence, making complex automation easy to manage.

### Example

```json
{
    "name": "react-tagwin-chat-cn",
    "modules": ["tagwin.bml", "react-setup.bml", "chat-cn.bml"]
}
```

## Execution

- Modules are executed in the order of the list
- If a module fails, the pack may stop or continue (to be defined)
- Logs and responses are aggregated

## Validation

- Check existence and validity of each module
- Validate the JSON before execution

## Best Practices

- Name the pack explicitly
- Document the pack's purpose in a comment
- Group modules by feature or workflow
