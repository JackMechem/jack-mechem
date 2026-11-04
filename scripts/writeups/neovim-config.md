## Overview

This is the Neovim setup I use for everything: Rust, C and C++, TypeScript, Java, Nix, Lua and Markdown notes. The repo dates back to 2023 and credits Josean Martinez's config tutorials. It's a small Lua config on lazy.nvim. `init.lua` loads the editor settings, the plugin manager and global keymaps, and each plugin lives in its own spec file under `lua/plugins/`.

## Language servers

The language-server setup is the most distinctive part. Rather than relying on Mason to install language servers, the config keeps a table that maps each server to the binary it needs, and at startup it enables only the servers whose binary is on `PATH`:

```lua
for server, binary in pairs(LSP_BINARIES) do
	if vim.fn.executable(binary) == 1 then
		local config = LSP_SERVERS[server] or {}
		vim.lsp.config(server, {
			settings = config.settings or {},
			init_options = config.init_options or {},
		})
		vim.lsp.enable(server)
	end
end
```

That fits NixOS. My nixos-config installs the servers and formatters through home-manager but leaves the Neovim config alone. The same config also works on a machine with half the toolchains, without errors about missing servers. Per-server settings keep 4-space formatting consistent across nil (with `nixfmt`), lua_ls, ts_ls and clangd.

Some languages get dedicated plugins: rustaceanvim for Rust, nvim-jdtls for Java (with the Lombok agent), and VimTeX for LaTeX.

## Formatting and linting

- conform.nvim runs Prettier (with tabs), stylua, black and isort, and clang-format with an LLVM-based style that uses tabs. Format-on-save is wired up but off by default. `<leader>ft` formats on demand.
- nvim-lint runs eslint_d for JS/TS/Svelte and pylint for Python on enter, save and leaving insert mode.

## Navigation

oil.nvim replaces netrw as the file explorer, so directories are editable buffers. Telescope handles search, and Harpoon marks the few files I'm bouncing between (`<leader>hx` to mark, `<leader>hn`/`<leader>hp` to cycle). vim-tmux-navigator moves across Neovim splits and tmux panes with the same keys, and global-note keeps one scratch note on `` <leader>` ``.

## AI tools

claudecode.nvim is bound under `<leader>a`. It toggles, resumes or continues a Claude Code session, sends a selection or the current buffer, and accepts or rejects proposed diffs. opencode.nvim is bound under `<leader>o` and points at a local Ollama model (`qwen2.5-coder:32b`), so I can use an assistant offline.

## Markdown

Markdown buffers turn on soft wrap and line breaks and map `j`/`k` to `gj`/`gk`. peek.nvim opens a live preview in the browser.
