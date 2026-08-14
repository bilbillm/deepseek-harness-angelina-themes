# DeepSeek Harness Angelina Themes

An independent `dsh-plugin` that ports the Codex Angelina light and dark themes to [deepseek-harness](https://github.com/deepseek-ai/deepseek-harness).

It includes the full token palettes, leaf-node frosted glass for inputs/composer/menus/listboxes/dialogs, one artwork composition and parallax path shared by empty and active conversations, reduced-motion and touch fallbacks, a settings row, durable selection, and complete unload cleanup.

简体中文: [README.md](README.md)

## Install

Use a DeepSeek Harness Web profile with Node.js 20+:

```sh
dsh plugin --profile web add github:bilbillm/deepseek-harness-angelina-themes
```

Restart the Web profile and choose **Angelina themes** in Settings > General. Remove it with:

```sh
dsh plugin --profile web remove dsh-angelina-themes
```

The package commits `lib/`, so a GitHub source install does not depend on a user-side build. Selection is stored under the browser-local `dsh-angelina-themes.selection` key; switching back to a host built-in clears that marker to `system`. Browser-local persistence is intentional because upstream Harness exposes a fixed Host settings namespace allowlist. The fork's built-in themes still persist through its `ui-theme` namespace.

## Fork compatibility

The `feature/angelina-themes` fork already registers both ids. The plugin checks `ctx.theme.getTheme().themes`, reuses existing ids, and registers only missing definitions. It therefore avoids duplicate-id failures and never disposes a theme owned by the fork.

When the fork already owns `#dsh-angelina-parallax` and `body[data-dsh-angelina-parallax]`, the plugin becomes a passive observer and does not add another pointer listener or layer stack.

## Build and test

```sh
pnpm install
pnpm generate-assets
pnpm typecheck
pnpm build
pnpm test
pnpm smoke
```

`src/themes.json` and `src/assets/` are the auditable sources. The generator embeds WebP data URIs into the client bundle so installation never relies on a remote image host.

## Motion and glass contract

The light theme uses background `-5/-3` and foreground `10/6` artwork parallax. Dark uses a restrained background `0.5/0.25` layer. The Hero composer retains the Harness default layout, and titles, selectors, composers, controls, and copy do not move. Motion is disabled or reset for reduced motion, touch input, viewports at or below 900px, blur, and hidden pages.

Empty and active conversations share the same artwork position and parallax layers. Glass is restricted to leaf surfaces, while active conversation content receives only a translucent tint without a full-column blur, preserving text clarity and fixed overlay positioning.

## License and assets

Code and metadata are MIT-licensed. Angelina, Arknights, and related artwork and marks remain with their respective rights holders. This is an unofficial fan customization and is not affiliated with DeepSeek, OpenAI, Hypergryph, Yostar, or Arknights. See [ASSET-PROVENANCE.md](ASSET-PROVENANCE.md) and [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).
