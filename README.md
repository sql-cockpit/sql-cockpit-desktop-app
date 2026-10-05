# SQL Cockpit App — desktop release test

Minimal Electron + React + TypeScript shell for testing the website's public GitHub Releases feed. **Not production-ready. This placeholder does not connect to databases.** Windows and Mac share the version in `package.json`.

## Development

Use Node.js 22 (22.12 or later) and npm:

```sh
npm ci
npm run dev
```

`npm run dev` builds the renderer/main/preload and launches Electron. Rerun after edits. `npm run dev:web` is a browser-only visual preview: installed version is labelled “Browser preview” because the Electron bridge is absent. The packaged Content Security Policy blocks network access; no cloud/database service is configured.

```sh
npm test
npm run build
npm run smoke
```

The smoke test opens a hidden Electron window, verifies React rendering and the installed-version IPC bridge, and exits. Main/preload use a sandboxed, isolated renderer without Node.js integration. New windows, navigation, webviews and permissions are denied.

## Local packaging

On Windows: `npm run package:win` builds the x64 NSIS installer.
On Mac: `npm run package:mac` builds Apple Silicon and Intel DMGs.
Generated `release/`, `dist/`, `dist-electron/` and dependencies are ignored by Git. Builds currently use Electron's default icon.

## Publishing

The `Desktop build and release` GitHub Actions workflow validates and builds on main/PRs. Pushing a stable version tag builds Windows x64 and Mac arm64/x64, then a separate publication job creates one draft with all assets and publishes it as a stable latest release only after all builds succeed. Builds have read-only repository permissions; only the publication job receives `contents: write` via `GITHUB_TOKEN`. No personal token, npm publication or app-store upload is required.

Initial tag: `v0.0.1`. Test installers:

- `SQL-Cockpit-App-0.0.1-win-x64.exe`
- `SQL-Cockpit-App-0.0.1-mac-arm64.dmg`
- `SQL-Cockpit-App-0.0.1-mac-x64.dmg`

A SHA256SUMS.txt asset records installer hashes. Release notes live in `releases/<tag>.md`.

For the next release:

```sh
npm version 0.0.2 --no-git-tag-version
# Make a visible test change and add releases/v0.0.2.md.
npm test
npm run build
npm run smoke
git add package.json package-lock.json src releases
git commit -m "Prepare desktop test release 0.0.2"
git push origin main
git tag v0.0.2
git push origin v0.0.2
```

Never move an existing published tag. If a build fails, fix it before publication and rerun using GitHub Actions. If publication created a draft and failed, inspect that draft and assets before retrying; the workflow intentionally does not overwrite an existing release.

The website uses `/repos/sql-cockpit/sql-cockpit-desktop-app/releases/latest` and `/releases`. Its feed excludes drafts/prereleases and caches results for 15 minutes. After v0.0.2, verify the latest card is 0.0.2 and 0.0.1 remains in history.

## Signing and production readiness

**Windows is unsigned. Mac is ad-hoc signed, without Developer ID or notarization.** Ad-hoc signing permits packaging; it is not publisher identity verification. Operating systems may block or warn on these installers. This workflow never invents credentials and does not claim production signing.

Before production, configure real Windows Authenticode credentials (or a supported signing service), enable executable signing/editing, and configure Apple Developer ID Application signing plus notarization credentials. Use encrypted GitHub secrets for `CSC_LINK`, `CSC_KEY_PASSWORD`/Windows equivalents and Apple notarization settings supported by electron-builder. Restore hardened runtime and suitable entitlements; validate signing and notarization on built artifacts. Adjust release notes and UI only after verification. Do not commit certificates, private keys or tokens. See https://www.electron.build/code-signing and https://www.electron.build/mac.

This test does not configure automatic application updates, account authentication, database access, telemetry or production support.
