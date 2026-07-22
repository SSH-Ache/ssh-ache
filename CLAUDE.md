# SSH Ache — Community Edition

Local-first, open-source (**Apache-2.0**) desktop SSH client. Tauri 2 (Rust) + React + xterm.js.
**No cloud/teams features** — everything runs locally, nothing is uploaded, no account. (The
Teams/cloud variant is the private `ssh-ache-teams` repo.)

## Commands
- `npm install` — deps
- `npm run dev` — Vite dev server (frontend only, no desktop window)
- `npm run tauri dev` — run the full desktop app (needs Rust + the Tauri toolchain)
- `npm run build` — **the verify gate** (Vite/esbuild). Run after frontend changes.
- `npm run tauri build` — build installers (macOS/Windows/Linux)

## Architecture
- **Frontend** — `src/App.tsx` is one large React class component (~3200 lines) that IS the whole
  UI (tabs, terminal panes, host vault, SFTP, port forwarding, settings, command palette, Key
  Vault). `src/main.tsx` mounts it; `src/style.css` is global CSS.
- **Backend** — `src-tauri/src/main.rs`: all SSH/terminal/SFTP/tunnel logic in Rust (`russh`,
  `russh-sftp`, `portable-pty`, `keyring`), exposed as `#[tauri::command]`s (`ssh_*`, `sftp_*`,
  `pty_*`, `forward_*`, `socks_*`, `secret_*`, `mcp_*`, `read_ssh_config`, `trust_host`, …).
- **Persistence** — app state in `localStorage` under `sshache.state`; secrets (passwords, key
  text, passphrases, vault keys) in the **OS keychain** via `secret_get`/`secret_set`/`secret_delete`,
  keyed by host id / `key:<id>`.

## Conventions & gotchas
- **`src/App.tsx` starts with `// @ts-nocheck`** and builds via Vite/esbuild — **`tsc` does NOT
  typecheck it.** The only hard build-breaker is an unresolved import. **Verify with `npm run
  build`** (esbuild catches syntax/import errors), not tsc.
- Match the existing style: inline `css("…")` style helper, `Hov` hover wrapper, class-component
  `this.setState`. Dense but consistent.
- **Do not add cloud/backend/teams features here.** This is the local-only community edition
  (Apache-2.0). Anything that talks to a server belongs in `ssh-ache-teams`.
- The MCP agent bridge is off by default, localhost-only, bearer-token, per-command approval —
  preserve those guarantees if you touch `mcp_*`. See `docs/MCP.md`.

## CI / release
- `.github/workflows/ci.yml` — Vite build on push/PR (the gate).
- `.github/workflows/release.yml` — push a `vX.Y.Z` tag → builds installers → **draft** GitHub
  Release (publish manually). Bump `package.json` + `src-tauri/tauri.conf.json` together; add a
  `CHANGELOG` entry in `src/App.tsx`. See the `cut-release` skill.
- Signing/notarization secrets are not yet configured here — builds are unsigned.
