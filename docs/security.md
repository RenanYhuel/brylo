# Security & Dependency Management

## Automated Security Checks

- **Dependabot**: Automatically creates pull requests to update dependencies and fix vulnerabilities. Enabled via GitHub configuration.
- **npm audit**: Run `npm audit` regularly to check for known vulnerabilities in dependencies.
- **Semantic Release**: Ensures releases are based on tested, up-to-date code.

## Recommended Practices

- Keep dependencies up to date (use Dependabot or renovate).
- Review and merge Dependabot PRs promptly.
- Run `npm audit` before every release or major merge.
- Use only trusted libraries and check for recent maintenance.
- Monitor GitHub security alerts for the repository.

## Example: Manual Audit

```sh
npm audit
```

## Example: Enable Dependabot

Create `.github/dependabot.yml` with:

```yaml
version: 2
updates:
  - package-ecosystem: 'npm'
    directory: '/'
    schedule:
      interval: 'weekly'
```

## Additional Tools

- [Snyk](https://snyk.io/) for advanced vulnerability scanning
- [Renovate](https://github.com/renovatebot/renovate) for dependency updates

---

For more details, see [npm audit documentation](https://docs.npmjs.com/cli/v10/commands/npm-audit).
