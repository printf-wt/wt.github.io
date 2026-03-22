# 个人博客（纯静态前端 / GitHub Pages）

这是一个纯前端的个人博客小站点，包含：登录/注册（本地存储演示）、个人主页信息展示、经验分享（文章列表 + 详情页）、以及支持拖动/自动旋转的 3D 环形照片墙。

> 本项目无后端：所有“注册信息/登录态”均保存在浏览器 `localStorage` 中，仅用于展示/课程作业性质的前端交互。

## 功能一览

- 主页（`index.html`）：顶部导航 + `#hash` 切换 section（支持 `index.html#awards` 直达）
- 登录页（`login.html`）：左侧卡通互动（瞳孔跟随/眨眼/输入互动/“偷看”）+ 右侧表单
- 注册页（`register.html`）：本地校验后把账号信息写入 `localStorage`
- 经验分享（`sharing.html` + `posts/*.html`）：文章列表跳转到详情页
- 照片墙（`photowall.html`）：拖动旋转 + 自动旋转（拖动时暂停）
- 无障碍：支持系统“减少动态效果”（`prefers-reduced-motion`）时自动降低/关闭动画

## 快速开始

### 方式 1：直接打开

双击打开 `index.html` 即可运行（纯静态站点）。

### 方式 2（推荐）：VS Code Live Server

用 Live Server 打开 `index.html`，在部分浏览器下会比直接打开文件更稳定（缓存/路径行为更一致）。

## 登录与访问控制（前端演示）

- 登录逻辑：`assets/js/login.js`
  - 若已注册，则使用 `localStorage.registeredUser` 中的账号密码进行校验
  - 若未注册，则回退到代码内置的演示账号（配置在 `assets/js/login.js`）
- 访问控制：`assets/js/auth.js`
  - `sharing.html`、`photowall.html`、`posts/*.html` 会校验 `localStorage.loggedIn === '1'`
  - 未登录则跳转到 `login.html`

### 一键“重置登录/注册信息”

如果你想重新测试注册/登录流程，可在浏览器开发者工具 Console 执行：

```js
localStorage.removeItem('registeredUser');
localStorage.removeItem('loggedIn');
```

## 手机端扫码打开

用手机扫码下面的二维码打开站点，然后进入登录页完成登录即可。

说明：这是“扫码打开站点/登录页”，不是微信那种扫码授权登录。

![手机端扫码二维码](assets/img/QR.png)

推荐步骤：

1. 扫码打开站点首页
2. 点击右上角「去登陆」进入 `login.html`
3. 登录成功后即可访问需要登录校验的页面（分享/文章/照片墙等）

## 内容维护

### 新增文章

1. 在 `posts/` 下新建一个 HTML，例如：`posts/post-my-new-article.html`

文章页建议统一引用：

- `../assets/css/background.css`（背景主题）
- `../assets/css/index.css`（复用导航栏样式）
- `../assets/css/posts.css`（文章详情排版）

并在页面底部引入：`../assets/js/auth.js`（登录校验）。

1. 编辑 `sharing.html`：在 `.posts` 里复制一段 `article.post`，修改 `href/标题/元信息/摘要`。

### 照片墙：新增/替换照片

- 页面：`photowall.html`
- 样式：`assets/css/photowall.css`
- 逻辑：`assets/js/photowall.js`

调整自动旋转速度：修改 `assets/js/photowall.js` 中的 `AUTO_ROTATE_DEG_PER_MS`（单位：度/毫秒）。

增加照片数量：在 `photowall.html` 的 `.ring` 内复制一段：

```html
<div class="item" data-photowall-item>
  <img src="assets/img/8.webp" alt="照片 8" />
</div>
```

JS 会自动统计 `data-photowall-item` 的数量并均分一圈角度。

## 在线访问（GitHub Pages）

本项目已部署到 GitHub Pages。

- 站点地址（通常情况）：<https://printf-wt.github.io/>
  - 如果你设置了自定义域名或仓库名不同，请把这里替换为你的实际访问地址

部署来源（供复查用）：

1. 仓库 Settings → Pages
2. Source 选择 `Deploy from a branch`
3. Branch 选择你的默认分支（如 `main`）+ `/ (root)`

## 目录结构

```text
index.html                 对外主页（入口页）
login.html                 登录页
register.html              注册页
sharing.html               经验分享（文章列表）
photowall.html             3D 环形照片墙
posts/                     文章详情页（每篇一份 HTML）

assets/
  css/
    index.css              主页 + 顶部导航栏样式
    login.css              登录/注册页：表单基础样式
    login-animated.css      登录页：左侧卡通互动布局与样式
    register.css           注册页补充样式
    sharing.css            经验分享列表页小覆盖
    posts.css              文章列表/详情共用样式
    photowall.css          3D 照片墙样式
    background.css         背景主题
  js/
    login.js               登录逻辑
    login-animated.js       登录页：卡通角色互动脚本
    register.js            注册逻辑
    index.js               主页 hash 切换逻辑
    photowall.js           照片墙拖动旋转逻辑
    auth.js                登录态校验
  img/                     图片资源
```
