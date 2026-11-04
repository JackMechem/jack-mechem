## Overview

Midirun is a small daemon I wrote that turns any MIDI controller into a macro pad on Linux. You hit a pad, it matches the MIDI message against a TOML config, and it types a key combination through `/dev/uinput`. Configuring it was the hard part. You read raw bytes off the controller with `midirun --listen`, looked up Linux keycodes with `sudo showkey --keycode`, and wrote `[[mapping]]` tables by hand.

midirun-config is the GTK 4 app that replaces that loop. Midirun and midirun-config are both on the AUR.

## What I built

It's written in C++ with gtkmm 4 and built with Meson. RtMidi handles MIDI, toml++ the config, and libevdev and libudev keyboard input.

- **MIDI monitor.** Pick a device, press Listen, and incoming messages stream into a pane with every byte and a timestamp. While listening, the window switches to a resizable split so you can watch the controller and edit mappings side by side.
- **Mapping editor.** Each row holds a name, byte 0, byte 1 and the keycodes. On launch the app parses the existing `~/.config/midirun/config.toml` into rows, so it edits your current setup.
- **Keycode capture.** Focus the Keys field and press the combination.
- **Apply.** Writes the TOML and tells the running daemon to reload it.

## Capturing kernel keycodes

GTK key events report keyvals for the current layout, but Midirun needs the kernel `KEY_*` codes that uinput emits. So capture reads evdev directly. It walks `/dev/input/event*` and uses libudev to keep only keyboards, skipping mice and USB receivers. It opens those nodes non-blocking with libevdev and `poll()`s them until a key-down arrives.

That loop runs on a worker thread that starts when the field gains focus and stops when it loses focus. Results reach the UI through `Glib::signal_idle()`, since GTK widgets may only be touched from the main thread.

Reading `/dev/input` needs permission, so the project ships a udev rule that gives the `input` group access. If no keyboard can be opened, the field falls back to plain text entry.

## Reloading without a restart

I didn't want Apply to mean restarting a service. On startup the daemon writes its PID to `/tmp/midirun.pid` and installs a SIGHUP handler that only sets an atomic flag. The main loop sees the flag, leaves its listen loop and re-reads the config.

The GUI writes the TOML, reads the PID file and sends SIGHUP. The daemon's systemd user unit uses the same signal for `ExecReload`.

## What I learned

- Keyvals and kernel keycodes are different layers. A tool that injects input through uinput has to work at the kernel's level.
- Keep signal handlers tiny, and do the real work in the main loop.
- GTK's threading rule shaped the design. Blocking I/O lives on worker threads, and the UI only changes from idle callbacks.
