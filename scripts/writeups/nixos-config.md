## Overview

One Nix flake builds all three of my machines: `desktop`, a three-monitor workstation; `t480`, a ThinkPad T480; and `dellserv`, a Dell XPS that runs headless as my home server. Each host is a `nixosConfiguration` with home-manager as a NixOS module, so system and user setup rebuild together with `nixos-rebuild switch --flake .#<host>`.

## Layout

Each host has a `configuration.nix`, its `hardware-configuration.nix` and a `home.nix`. Everything else is a small module that a host opts into:

- `modules/nixos/`: desktop, sound, printing, Bluetooth, Steam, Syncthing, Ollama, fonts, YubiKey, user account.
- `modules/home-manager/`: Hyprland, DankMaterialShell, zsh, tmux, Ghostty, theme, packages.

Some of my own projects, such as gtkbar, gtkapps and rust-app-menu, come in as flake inputs. They're pinned in the same `flake.lock` as everything else.

## Desktop

Hyprland is configured entirely in Nix through home-manager, using Hyprland's Lua config format. DankMaterialShell provides the bar, launcher, notifications and lock screen. It's pinned to a release tag and runs as a systemd user service bound to `hyprland-session.target`, so it stays out of the Plasma 6 fallback session. The generated Hyprland config loads the fragments that DMS's settings GUI writes, except monitors: the 10-bit, three-output layout stays in Nix.

Audio is set up for recording. PipeWire runs with its ALSA, PulseAudio and JACK interfaces, rtkit is on, and the `audio` group gets real-time priority and unlimited memlock. Ardour comes with LV2 plugins, including x42, LSP, Calf, Guitarix and Neural Amp Modeler.

## Home server

`dellserv` runs Jellyfin, FileBrowser Quantum, Forgejo, Syncthing and AdGuard Home behind Caddy. Caddy gets its certificates through the Cloudflare DNS plugin, and cloudflare-dyndns keeps the domain pointed at my home IP. Two parts took more than enabling a module:

- **SSH and HTTPS on one port.** To reach Forgejo over SSH without opening port 22 on the router, sslh listens on 443 and splits traffic between sshd and Caddy. I wrote that systemd unit by hand, because the NixOS sslh module added extra IPv4/IPv6 listen entries that failed with duplicate binds.
- **FileBrowser Quantum.** nixpkgs has the package but no NixOS module, so the service is hand-rolled. The admin password isn't in the config, where it would end up world-readable in the Nix store. A pre-start script generates it once into the state directory. The media directories are setgid to the `jellyfin` group and the service runs with `UMask=0027`, so uploads stay readable by Jellyfin. The unit also turns on systemd's sandboxing options.

## Hardware keys

On the T480, `pam_u2f` requires a YubiKey touch for `sudo`, console login and hyprlock. On the server, sshd accepts only FIDO2-backed keys (`sk-ssh-ed25519` and `sk-ecdsa`) and password login is off, so every SSH session needs the physical key.

## Notes

home-manager installs Neovim's language servers and formatters, but the Neovim config itself lives in its own hand-managed repo. The primary git remote is Forgejo on the server, and GitHub is a public mirror.
