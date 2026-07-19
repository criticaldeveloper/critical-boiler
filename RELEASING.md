# Releasing Critical Boiler

Releases use immutable `vX.Y.Z` Git tags. A tag must match both the `package.json` version and `VERSION` in `src/catalog.js`. The release workflow validates, tests, publishes the public npm package with provenance, and publishes generated GitHub release notes.

## One-Time GitHub Setup

1. Keep the repository public at `criticaldeveloper/critical-boiler` and enable GitHub Actions.
2. Protect `main` with required CI checks and protect tags matching `v*` so only maintainers can create releases.

The workflow uses the repository's short-lived `GITHUB_TOKEN` for GitHub Releases. No personal GitHub token is needed.

## Publish Version 1.0.0 Manually

npm Trusted Publishing is configured from an existing package's settings, so publish the first version interactively:

1. Confirm that your npm account can publish public packages under the `@critical` scope.
2. Run the full validation locally.
3. Sign in to the public npm registry and publish with your interactive 2FA:

```sh
pnpm install --frozen-lockfile
pnpm release:check
pnpm check
pnpm test
pnpm smoke
pnpm pack --dry-run
npm login --registry=https://registry.npmjs.org/
npm publish --access public --registry=https://registry.npmjs.org/
```

After the first package exists on npmjs.com, open its **Settings → Trusted Publisher** and configure:

- Provider: GitHub Actions
- Organization or user: `criticaldeveloper`
- Repository: `critical-boiler`
- Workflow filename: `publish.yml`
- Environment: leave empty
- Allowed action: `npm publish`

No npm token or GitHub secret is needed. In npm package settings, select **Require two-factor authentication and disallow tokens** after Trusted Publishing is configured. Future publications authenticate with short-lived OIDC credentials and automatically receive npm provenance.

You may then push the existing `v1.0.0` tag. The workflow detects that version 1.0.0 already exists on npm, skips republishing it, and creates the matching GitHub Release.

## Normal Release

Start from an up-to-date, clean `main` branch:

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm version:set patch # or minor, major, or an exact X.Y.Z
pnpm release:check
git add package.json src/catalog.js
git commit -m "chore(release): vX.Y.Z"
git tag -a vX.Y.Z -m "vX.Y.Z"
git push origin main
git push origin vX.Y.Z
```

Replace `X.Y.Z` with the version printed by `pnpm version:set`. Push the release commit, wait for CI on `main` to pass, and then push its tag. The tag starts `.github/workflows/publish.yml`. The workflow leaves the GitHub Release as a draft if npm publication fails, and safely skips npm publication on a retry when that exact version already exists.

Do not move or reuse published version tags. Fix the problem, increment the version, and create a new tag.
