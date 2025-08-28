# Security & Dependency Management

Brylo CLI project security relies on automation, monitoring, and open source best practices.

## Automation

- **Dependabot**: automatic PRs for updates and vulnerabilities
- **npm audit**: regular dependency checks
- **Semantic Release**: releases on tested, up-to-date code

## Best Practices

- Keep dependencies up to date (Dependabot, Renovate)
- Review and merge security PRs quickly
- Use only maintained libraries
- Monitor GitHub alerts

## Additional Tools

- [Snyk](https://snyk.io/): advanced scanning
- [Renovate](https://github.com/renovatebot/renovate): updates

## Manual Audit Example

```sh
npm audit
```

## Example: Enable Dependabot

Create `.github/dependabot.yml`:

```yaml
version: 2
updates:
    - package-ecosystem: 'npm'
      directory: '/'
      schedule:
          interval: 'weekly'
```

---

For more details, see the [npm audit documentation](https://docs.npmjs.com/cli/v10/commands/npm-audit).
