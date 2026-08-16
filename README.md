# DeepSeek Harness Angelina Themes

把 Codex 的安洁莉娜亮色、暗色主题移植到 [deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) 的独立 `dsh-plugin`。插件包含：

- 安洁莉娜亮色与暗色完整 token 主题；
- 输入框、composer、菜单、listbox、dialog 的叶节点磨砂玻璃；
- 新建对话与活跃会话共用背景构图和视差层，活跃会话以 3px 浅层背景模糊和低透明度 tint 提升文字可读性；
- 亮色双层视差，暗色低幅度单层视差；
- `prefers-reduced-motion`、触摸输入、窄屏和页面失焦降级；
- 主题设置行、独立持久化选择和卸载清理。

English: [README.en.md](README.en.md)

## 安装

需要 DeepSeek Harness Web profile 和 Node.js 20+。`lib/` 已提交到仓库，GitHub 安装不需要在用户机器上编译插件。

```sh
dsh plugin --profile web add github:bilbillm/deepseek-harness-angelina-themes
```

重启 Web profile 后，在设置的 General 页面选择 **安洁莉娜主题**。移除插件：

```sh
dsh plugin --profile web remove dsh-angelina-themes
```

插件使用浏览器本地键 `dsh-angelina-themes.selection` 记住选择；选择内置 Light/Dark/System 时会把该键恢复为 `system`，不会覆盖宿主设置。采用本地持久化是因为上游 Harness 的设置 API 有固定 namespace allowlist，第三方 Host namespace 不会暴露给浏览器。fork 内置主题仍会通过其 `ui-theme` namespace 同步 Host 设置。

上游发布版 Harness `0.1.0-rc.6` 只投影活动主题的配色模式和 token，不投影第三方 CSS 选择器所需的主题 id。插件会在该环境同步并在卸载时恢复 `body[data-ds-theme]`；检测到已经内置主题的 fork 时不会接管该属性。

## Fork 内置主题兼容

本仓库的 `feature/angelina-themes` 分支已经内置了两个主题。插件会先读取 `ctx.theme.getTheme().themes`，对已存在的 id 直接复用，只注册缺失的主题，因此不会触发重复 id 异常，也不会在卸载时误删 fork 自己的主题。

同理，如果 fork 已经创建 `#dsh-angelina-parallax` 和 `body[data-dsh-angelina-parallax]`，插件会复用现有视差层，不会添加第二套指针监听。

## 构建与测试

```sh
pnpm install
pnpm generate-assets
pnpm typecheck
pnpm build
pnpm test
pnpm smoke
```

构建会从 `src/assets/` 和 `src/themes.json` 生成客户端 data URI 与主题定义，然后输出 `lib/index.js`、`lib/client.js`。发布包同时保留源素材、生成脚本、测试和归因文件，便于审计。

## 设计边界

- 玻璃只作用于叶节点；不会给 frame/sidebar 祖先加 `backdrop-filter`，避免破坏固定定位浮层。
- 新建对话与活跃会话共用图片位置和视差层；活跃内容使用 3px 浅层背景模糊和低透明度 tint，内部文字与控件本身保持清晰。
- 亮色图片视差参数为背景 `-5/-3`、前景 `10/6`，暗色背景为 `0.5/0.25`；Hero 输入区沿用 Harness 默认布局，标题、选择器、composer、控件及文字不参与视差。
- 视差在 reduced motion、触摸、宽度不超过 900px、失焦和页面隐藏时停用或复位。

## 许可证与素材

代码和元数据按 MIT 发布。安洁莉娜及相关原作、美术和商标权利归各自权利人所有。本项目为非官方同人定制，不代表 DeepSeek、OpenAI、鹰角网络、悠星或《明日方舟》。详见 [ASSET-PROVENANCE.md](ASSET-PROVENANCE.md) 与 [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md)。

## 主题目录

`src/themes.json` 是唯一的 token 源文件，亮暗主题各包含 114 个 `--dsw-*` token。图片原文件位于 `src/assets/`，`src/client/*.generated.ts` 是可重复生成的构建输入。
