---
name: cut-release
description: Cut a desktop release of SSH Ache — bump version, add changelog, tag, build installers, publish. Use when releasing a new version of the desktop app.
---

# Cut a desktop release

1. Bump the version in BOTH `package.json` and `src-tauri/tauri.conf.json` (keep them equal).
   `src-tauri/Cargo.toml` version is NOT bumped per release — leave it.
2. Add a `CHANGELOG` entry at the top of the array in `src/App.tsx` (short user-facing bullets).
3. `npm run build` — confirm the frontend compiles (this is the only local build gate; `tsc`
   does not check `App.tsx`).
4. Commit `chore(release): vX.Y.Z`, open a PR, merge to `main`.
5. Tag + push: `git tag vX.Y.Z && git push origin vX.Y.Z`.
6. The tag triggers `.github/workflows/release.yml` → builds macOS/Windows/Linux installers →
   creates a **DRAFT** GitHub Release.
7. Watch the run by polling `gh run view <id>` (avoid `gh run watch` — it dies on network
   flakiness). When green, **publish the draft**: `gh release edit vX.Y.Z --draft=false`.

Notes:
- Signing/notarization secrets are not configured in this repo, so builds are unsigned (macOS
  shows an "unidentified developer" warning — right-click → Open).
- Keep releases free of any cloud/teams functionality — this is the local-only community edition.
