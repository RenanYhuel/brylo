# User Configuration

## Storage Folder

Modules and packs are stored outside the global npm folder, in a configurable directory (e.g. `~/.brylo-cli`).

### Initialization

On first use, the CLI asks:

```
Where do you want to store your modules and packs? [default: ~/.brylo-cli]
```

The path is saved in `config.json`:

```json
{
    "baseDir": "/user/path"
}
```

## Related Commands

- `brylo config set baseDir <path>` : change the user folder
- `brylo config show` : display current config

## Best Practices

- Store modules/packs in a versioned or synced folder (optional)
- Backup config before each update
