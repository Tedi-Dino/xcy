# 徐晨阳 · 人物专刊

一个无需构建、无需后端的静态网站。深海绿、暖纸色与香槟金；六章人物故事、原创潜艇 SVG、作文素材切换和绝密档案彩蛋。所有资源均在本地，不依赖在线字体、图片或第三方脚本。

## 本地预览

直接双击 `index.html` 即可。需要通过 HTTP 预览时，在此目录运行：

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

然后打开 `http://127.0.0.1:4173`。复制素材在 HTTPS 或 localhost 下使用浏览器剪贴板；权限受限时，页面会选中文字供手动复制。

## 一、部署到 Cloudflare Pages

### 推荐：连接 GitHub 自动更新

仓库：<https://github.com/Tedi-Dino/xcy>。使用 Pages 的 Git 集成后，每次推送到 `main` 都会自动部署。

1. Cloudflare → Workers & Pages → 创建应用 → Pages → 连接 Git。
2. 连接 GitHub，授权 Cloudflare 访问 `Tedi-Dino/xcy`，选择这个仓库。
3. 项目名称填 `xcy-archive`（若已占用，换一个），生产分支选 `main`。
4. 框架预设选 **None**，构建命令填 **`node build.mjs`**，构建输出目录填 **`dist`**，根目录保持默认。
5. 保存并部署。`build.mjs` 只把四个公开网站文件复制到输出目录，说明文档不会进入网站。
6. 部署成功后，按照下一节绑定自定义域名。今后推送新提交即可触发更新，不需要重新上传 ZIP。

后续本地修改后运行：

```powershell
git add index.html styles.css script.js favicon.svg build.mjs README.md .gitignore
git commit -m "Update XCY website"
git push origin main
```

### 备选：直接上传

直接上传不需要 GitHub，也不需要安装 Node.js，但不自动同步 Git 提交。

1. 登录 Cloudflare 控制台，进入 **Workers & Pages**，选择创建应用，再进入 **Pages** 的上传静态资源 / Direct Upload 入口。界面的按钮名称可能随版本变化，注意选择 Pages，而非 Workers。
2. 输入项目名称，例如 `xcy-archive`。它将生成类似 `xcy-archive.pages.dev` 的默认域名；项目名被占用时换一个。
3. 上传本项目的 **`index.html`、`styles.css`、`script.js`、`favicon.svg`**。也可以上传这四个文件组成的 ZIP，确保解压后的根目录直接是 `index.html`，不要多包一层 `xcy/`。
4. 点击部署。这个网站是纯静态文件，无需构建命令、环境变量或数据库。
5. 打开分配给你的 `https://项目名.pages.dev`，检查首页、作文切换和末尾弹窗。后续更新文件后，在这个 Pages 项目中创建新部署并重新上传即可。

仓库里的 `README.md`、`.git` 不需要上传。本文描述常规 Pages 操作流程，未查询教程或核验你账户当前的控制台按钮。

Direct Upload 项目和 Git 集成项目的创建方式不同；为了自动同步 GitHub，请使用本节开头的 Git 集成方式创建项目。

## 二、绑定腾讯云购买的中文根域名

这里按“域名在腾讯云购买，域名本身是 **徐晨阳.icu**”理解。“腾讯云”是注册商，不是域名的一部分。

| 用途 | 域名 |
| --- | --- |
| 中文域名 | `徐晨阳.icu` |
| ASCII / Punycode | `xn--l4t55mzn9b.icu` |
| 可选 www | `www.xn--l4t55mzn9b.icu` |

中文域名后台不接受输入时，使用 ASCII 写法，浏览器中仍可输入中文。上面的转换已使用 Node.js `domainToASCII` 验证。

**如果你实际买的是 `腾讯云徐晨阳.icu`，它是另一个域名，对应 `xn--9kq372bg8enm4azwkulp.icu`。请以腾讯云域名列表里的完整名称为准。**

### 推荐方案：注册商留在腾讯云，DNS 改到 Cloudflare

Pages 绑定裸域名 `徐晨阳.icu` 的常规方案，是将该域名所在 DNS 区域接入 Cloudflare。无需转移域名注册商，也不用向腾讯云购买服务器。

1. 在 Cloudflare 的域名管理入口添加 `xn--l4t55mzn9b.icu`，选择 Free 计划。
2. 检查导入的 DNS 记录。如果域名已有网站或邮箱，核对并补齐原有 A、AAAA、CNAME、MX、TXT 等记录，尤其是邮件记录，然后再切换 DNS。
3. Cloudflare 会给你分配 **两条专属名称服务器（NS）**。复制你账户实际分配的值，不要使用教程中的示例。
4. 在腾讯云控制台的**域名注册管理**里找到这个域名，进入 DNS 服务器 / 修改 DNS 服务器，将原来的服务器替换为上述两条 Cloudflare NS。这里是更换域名的权威 DNS 服务器，**不是在 DNSPod 解析列表里新增两条普通 NS 记录**。
5. 若该域名开启了 DNSSEC，先在注册商侧解除旧的 DNSSEC / DS 配置，再切换 NS；接入成功后，可按 Cloudflare 提供的新 DS 信息在注册商侧重新启用。遗留旧 DS 可能导致解析失败。
6. 等待 Cloudflare 显示域名 Active。NS 更新通常需要一段时间，个别缓存可能持续 24–48 小时。
7. 回到 **Workers & Pages → 你的 Pages 项目 → Custom domains / 自定义域名 → Set up a custom domain**，输入 `xn--l4t55mzn9b.icu`，按提示确认。由 Cloudflare 创建指向你项目 `项目名.pages.dev` 的记录。
8. 若同名 `@` 已有旧 A、AAAA 或 CNAME，核对用途后清理冲突记录。保留邮箱 MX/TXT 等无关记录。绑定后，Cloudflare 对根域名的 CNAME 执行 flattening；不必手动寻找一个固定 IP。
9. 等待 Pages 自定义域名显示 Active，证书完成签发，再打开 `https://徐晨阳.icu`。浏览器是否显示中文由其自身的 IDN 策略决定。

域名续费仍在腾讯云处理；网站部署与 DNS 解析在 Cloudflare 处理。这里的 NS 更改和上线操作需要你在自己的账户中完成，本项目没有执行这些操作。

### 可选：再加 www

在 Pages 的 Custom domains 中再添加 `www.xn--l4t55mzn9b.icu`。如果希望所有访问统一到不带 www 的地址，可在 Cloudflare 的 Redirect Rules 中创建从 www 到根域名的 301 跳转，并保留路径和查询参数；初次上线可先跳过。

### 如果坚持保留腾讯云 / DNSPod 解析

可绑定一个子域名，例如 `www.徐晨阳.icu`：

1. **先在 Pages 项目的 Custom domains 中添加** `www.xn--l4t55mzn9b.icu`，启动域名绑定。
2. 在 DNSPod 添加主机记录 `www`，类型 `CNAME`，值填写你的实际 `项目名.pages.dev`，不用写 `https://` 或路径。
3. 等待 Pages 域名验证和证书签发，然后访问 `https://www.徐晨阳.icu`。

仅添加 CNAME 而不在 Pages 登记自定义域名，可能无法正确访问。想让**裸域名**直接绑定这个 Pages 项目，优先采用上面的 Cloudflare NS 方案。

## 三、上线检查与常见问题

- **页面没有样式 / 交互：** 检查上传的文件是否都在同一目录，文件名大小写是否一致，ZIP 内是否多了一层目录。
- **默认 pages.dev 正常，中文域名异常：** 检查 NS 是否生效、Pages 是否登记了精确域名、域名记录是否指向正确项目。
- **证书一直 Pending：** 先确认 DNS 区域和自定义域名的验证状态；检查已有 CAA 记录是否阻止 Cloudflare 当前使用的证书机构，按控制台提示处理，不要猜证书机构名单。
- **浏览器提示证书错误：** 等待证书正常签发，别忽略或绕过浏览器的安全提示。
- **偶发地区访问慢：** 该方案走 Cloudflare 网络，实际速度取决于访问地区与网络；本项目不依赖 Google Fonts 等外部资源。

## 编辑内容

- 生平、文案和 SVG：`index.html`
- 颜色、排版与手机适配：`styles.css`
- 三个作文素材、复制、弹窗行为：`script.js`

页尾与荣誉卡片保留了“虚构故事 / 玩笑设定”说明；未来的 ICU 与获奖情节属于用户指定的故事梗概。
