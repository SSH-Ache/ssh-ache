# Security policy

## Reporting a vulnerability

Email **tanvirmahin24@gmail.com** with `SSH Ache security` in the subject, or open a
[private security advisory](https://github.com/SSH-Ache/ssh-ache/security/advisories/new)
on GitHub. Please do not open a public issue for a vulnerability.

Include what you did, what happened, and the version (`Settings → About`). A proof of
concept helps but is not required. Expect an acknowledgement within 72 hours and, if the
report is valid, a fix or a plan with a date. You will be credited in the release notes
unless you would rather not be.

## Supported versions

The latest release. This is a one-person project — there are no backports.

## What is and isn't in scope

The interesting surface is: host-key verification, the credential store, the MCP agent
bridge, port forwarding, SFTP path handling, and the encrypted export format.

Known and deliberate, so not vulnerabilities on their own:

- **Secrets are not encrypted at rest.** `~/.ssh-ache/secrets.json` is a `0600` file, the
  same posture as `~/.ssh/id_rsa`. Anything running as your user can read it. See
  [Where secrets are stored](./README.md#where-secrets-are-stored).
- **The idle lock is a screen lock.** It does not re-encrypt anything, and sessions,
  forwards and the MCP server keep running behind it.
- **Auto-allow, when you turn it on**, lets an agent run commands on that host without a
  prompt. That is the documented purpose of the toggle — see [docs/MCP.md](./docs/MCP.md).
- **macOS builds are unsigned and un-notarised** today.

A way to defeat any of those *without* the user's local account — say, reading secrets
from another user, or turning on Auto-allow from an imported file — is in scope.

## Known dependency advisories

`npm audit` is clean. `cargo audit` reports one advisory with no upstream fix:

- **[RUSTSEC-2023-0071](https://rustsec.org/advisories/RUSTSEC-2023-0071)** — Marvin attack
  (timing sidechannel) in the `rsa` crate, pulled in transitively by `russh`. No fixed version
  exists. It affects RSA private-key operations, i.e. publickey auth with an RSA key, and needs
  fine-grained timing measurements of that key's operations. Using an Ed25519 key avoids the
  code path entirely. Every Rust SSH client currently carries this.

The rest of what `cargo audit` prints is unmaintained-crate warnings for tauri's Linux GTK3
bindings, which are not fixable from here.
