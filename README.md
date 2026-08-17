# DeepSeek Harness Angelina Themes

把 Codex 的安洁莉娜亮色、暗色主题移植到 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的独立 `dsh-plugin`。它保留 Harness 原生的对话布局和控件行为，只把视觉层替换成安洁莉娜主题：背景图、视差、磨砂玻璃、清晰的文字层级，以及在低性能或移动环境下的优雅降级。

<p align="center">
  <a href="https://github.com/bilbillm/deepseek-harness-angelina-themes"><img src="https://img.shields.io/badge/dsh--plugin-Angelina-9e2f2e?style=flat-square" alt="dsh-plugin Angelina"></a>
  <a href="https://github.com/bilbillm/deepseek-harness-angelina-themes/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-357f7a?style=flat-square" alt="MIT License"></a>
  <img src="https://img.shields.io/badge/Node-%3E%3D20-4e8f95?style=flat-square" alt="Node.js 20 or newer">
</p>

English: [README.en.md](README.en.md)

## 先看效果

亮色主题使用清晨屋顶和暖灰色玻璃；暗色主题使用夜景和低亮度冷色玻璃。两种主题都给输入区、菜单、对话框和消息气泡保留足够的背景分离度，文字不会直接压在人物或高对比背景上。

<table>
  <tr>
    <td width="50%"><img src="./src/assets/angelina-light-hero.webp" alt="安洁莉娜亮色主题主视觉"></td>
    <td width="50%"><img src="./src/assets/angelina-dark-hero.webp" alt="安洁莉娜暗色主题主视觉"></td>
  </tr>
  <tr>
    <td align="center"><b>Angelina Light</b><br><sub>明亮、偏暖、适合日间长时间工作</sub></td>
    <td align="center"><b>Angelina Dark</b><br><sub>低亮度、偏冷、适合夜间使用</sub></td>
  </tr>
</table>

### 视差分层

背景和人物不是一张被整体移动的图片，而是两张透明/不透明图层。指针移动时，远景只做很小幅度位移，人物和信件做更明显的位移；标题、选择器、输入框和正文保持原位，避免阅读时跟着晃动。

<table>
  <tr>
    <td width="50%"><img src="./src/assets/angelina-light-parallax-background.webp" alt="亮色视差背景层"></td>
    <td width="50%"><img src="./src/assets/angelina-light-parallax-foreground.webp" alt="亮色视差前景人物层"></td>
  </tr>
  <tr>
    <td align="center"><b>Background layer</b><br><sub>城市、天空、屋顶与月光位置</sub></td>
    <td align="center"><b>Foreground layer</b><br><sub>安洁莉娜、信件和前景碎片</sub></td>
  </tr>
</table>

## 细节一览

| 区域 | 视觉处理 | 交互边界 |
| --- | --- | --- |
| 新建对话 / 活跃对话 | 共用同一套背景构图和视差层；活跃对话额外使用浅层背景模糊和低透明度 tint | 对话文字、标题、按钮、输入框不参与位移 |
| 顶栏、侧栏、菜单、listbox、dialog | 叶节点磨砂玻璃，不给固定定位的祖先 frame 叠加 `backdrop-filter` | 菜单打开时仍保持清晰的边界和阴影 |
| Composer、输入框、用户消息气泡 | 半透明填充 + 背景模糊 + 轻微饱和度，沿用 Harness 默认形状 | 不改变原生尺寸、键盘行为和按钮布局 |
| 设置页 | 主题选择行、浅色/深色预览、独立持久化选择 | 卸载插件时恢复宿主主题和 `body` 属性 |
| 视差层 | 亮色双层；暗色低幅度单层 | `prefers-reduced-motion`、触摸、窄屏、失焦和页面隐藏时停用或复位 |

<table>
  <tr>
    <td width="50%"><img src="./docs/screenshots/glass-actions-menu.png" alt="会话操作菜单的磨砂玻璃效果"></td>
    <td width="50%"><img src="./docs/screenshots/glass-sort-menu.png" alt="会话排序菜单的磨砂玻璃效果"></td>
  </tr>
  <tr>
    <td align="center"><b>操作菜单</b><br><sub>半透明底色、细边框和柔和阴影</sub></td>
    <td align="center"><b>排序菜单</b><br><sub>分组标题、选中状态和内容对比度</sub></td>
  </tr>
</table>

### 磨砂玻璃配方

主题把玻璃定义为可复用的 CSS 变量，菜单和设置卡片使用同一套配方，避免出现“顶栏很糊、卡片很硬”或不同浮层透明度不一致的问题。

```css
background: rgba(43, 51, 58, 0.66);
backdrop-filter: blur(18px) saturate(104%);
```

实际应用范围遵循叶节点策略：只给可见的菜单、卡片、输入框和气泡加玻璃，不给 sidebar/frame 祖先加滤镜，因此不会破坏固定定位浮层、滚动容器或对话层级。活跃对话区域使用浅层 `3px` 背景模糊，内部文字和控件保持锐利。

### 视差参数

| 模式 | 背景层 | 前景层 | 设计意图 |
| --- | ---: | ---: | --- |
| 安洁莉娜亮色 | `-5 / -3` | `10 / 6` | 有明显空间感，但不让内容跟着移动 |
| 安洁莉娜暗色 | `0.5 / 0.25` | —（未启用前景图） | 夜间使用更稳定，避免高对比背景晃动 |

每组两个数依次是 X/Y 位移系数；指针坐标会先按视口归一化到 `-1..1`，数值越大，图层位移越明显。视差容器使用 `pointer-events: none`，不会挡住任何 Harness 控件。

## 安装

### GitHub 安装（推荐）

需要 DeepSeek Harness Web profile 和 Node.js 20+。仓库已经提交 `lib/` 构建产物，用户安装时不需要在本机编译插件。

```sh
dsh plugin --profile web add github:bilbillm/deepseek-harness-angelina-themes
```

重启 Web profile：

```sh
dsh web
# 或者
npx @deepseek-ai/dsh web
```

打开 `设置 → 通用设置`，在 **安洁莉娜主题** 中选择亮色或暗色。主题选择保存在浏览器本地，刷新或重启后仍会保留。

卸载：

```sh
dsh plugin --profile web remove dsh-angelina-themes
```

### 本地 checkout 安装

适合想马上测试本地改动的情况。 `dsh plugin` 会把相对路径锚定到当前命令目录：

```powershell
cd C:\Users\lumoren\Documents\GitHub\deepseek-harness-angelina-themes
pnpm install
pnpm build
dsh plugin --profile web add .
```

修改 `src/` 后重新运行 `pnpm build`，然后重启 DSH Web profile。当前仓库的 `lib/` 已可直接安装，普通用户不需要执行构建步骤。

## 与 Harness 的兼容策略

- 上游 Harness `0.1.0-rc.6` 只投影活动主题的配色模式和 token，不投影第三方 CSS 选择器需要的主题 id；插件会同步 `body[data-ds-theme]`，卸载时恢复原值。
- `feature/angelina-themes` fork 已经内置主题时，插件先读取 `ctx.theme.getTheme().themes`，复用已有 id，只注册缺失项，避免重复 id。
- fork 如果已经创建 `#dsh-angelina-parallax` 和 `body[data-dsh-angelina-parallax]`，插件不会再创建第二套视差层或指针监听。
- 插件可以和 `dsh-motion`、`dsh-conversation-minimap` 一起安装；主题只负责视觉层，不接管动画插件或会话数据。

## 构建、测试与审计

```sh
pnpm install
pnpm generate-assets
pnpm typecheck
pnpm build
pnpm test
pnpm smoke
```

一次性执行完整检查：

```sh
pnpm verify
```

`src/themes.json` 是唯一的 token 源文件；`src/assets/` 保存可审计的 WebP 素材；生成器把素材嵌入客户端 data URI，因此运行时不依赖第三方图片域名。构建输出为 `lib/index.js`、`lib/client.js` 及对应类型声明。

## 常见问题

**安装后看不到主题选项？** 先确认 profile 是 `web`，再重启 DSH；如果仍未出现，运行 `dsh plugin --profile web why dsh-angelina-themes` 检查依赖是否安装到当前 profile。

**为什么移动端没有视差？** 触摸输入、视口宽度不超过 `900px`、系统开启减少动态效果、页面失焦或隐藏时都会停用/复位视差。这是为了保持可读性、续航和触控稳定性。

**为什么选择内置浅色/深色后安洁莉娜主题消失？** 这是预期行为。切回 Harness 内置主题会把插件选择标记恢复为 `system`，不会覆盖宿主的主题设置；之后可以再次选择安洁莉娜亮色或暗色。

## 许可证与素材

代码和元数据按 MIT 发布。安洁莉娜、《明日方舟》及相关原作、美术和商标权利归各自权利人所有。本项目为非官方同人定制，不代表 DeepSeek、OpenAI、鹰角网络、悠星或《明日方舟》。

素材来源与第三方声明见：[ASSET-PROVENANCE.md](ASSET-PROVENANCE.md) · [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md)
