# `.devpack` Packs

## Format

A `.devpack` pack is a JSON file listing `.devmod` modules to be executed sequentially.

### Example

```json
{
    "name": "react-tagwin-chat-cn",
    "modules": ["tagwin.devmod", "react-setup.devmod", "chat-cn.devmod"]
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
