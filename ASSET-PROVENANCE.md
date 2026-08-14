# Asset provenance

The four source image files are kept under [`src/assets/`](src/assets/). The build embeds them as WebP data URIs in `src/client/assets.generated.ts`; the generated file is reproducible with `pnpm generate-assets` and is committed so a GitHub install does not need a build step.

## Light assets

- `angelina-light-hero.webp`: home/landing backdrop derived from the Angelina Gravity Field Codex theme pack.
- `angelina-light-parallax-background.webp`: low-detail background layer for the light two-layer parallax treatment.
- `angelina-light-parallax-foreground.webp`: transparent/high-detail foreground layer for the light two-layer parallax treatment.

## Dark assets

- `angelina-dark-hero.webp`: independent midnight operations scene derived from the Angelina Midnight Gravity Codex theme pack.

The original Codex theme pack records the generation and editing history in [Codex-Angelina-Themes](https://github.com/bilbillm/Codex-Angelina-Themes). This repository converts the source PNG/JPEG files to WebP for browser delivery; it does not claim ownership of the character or source artwork.

本仓库不主张拥有角色、商标或原始美术作品的权利。图片公开再分发和商业使用前，请自行确认适用授权。
