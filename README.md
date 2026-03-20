# 个人博客（静态站点 / GitHub Pages）

这是一个纯前端的个人博客小站点，包含登录/注册、个人主页信息展示、经验分享文章列表与文章详情页，以及可拖动旋转（并支持自动旋转）的 3D 环形照片墙。

> 说明：本项目无后端，所有“登录态/注册信息”均使用浏览器 `localStorage` 存储。

## 近期更新（UI/交互）

- 统一浅色系背景与导航栏：降低背景纹理对比度，整体更柔和
- 登录页升级为「左侧卡通互动 + 右侧表单」布局：鼠标跟随、随机眨眼、输入时互动、密码显示时“偷看”
- 照片墙新增自动旋转：拖拽时自动暂停，松手后继续
- 支持系统“减少动态效果”（`prefers-reduced-motion`）时自动减少/关闭动画

## 页面说明

- 对外主页（入口页）：`index.html`
  - 外来浏览默认先看到主页信息，不会强制登录
  - 顶部导航栏（`#daohang`）
  - “学历/获奖/科研/联系方式”通过 `#hash` 切换显示（如 `index.html#awards`）
- 登录页：`login.html`
  - 登录成功后跳转主页
  - 背景主题使用 `assets/css/background.css`
  - 动画/布局样式：`assets/css/login-animated.css`
  - 动画脚本：`assets/js/login-animated.js`
- 注册页：`register.html`
  - 注册信息写入 `localStorage.registeredUser`
- 经验分享（文章列表）：`sharing.html`
  - 展示“标题 + 时间/关键词 + 摘要（前几行）”
  - 点击进入对应文章详情页
- 文章详情页：`posts/*.html`
  - 每篇文章独立一个 HTML
  - 文章样式共用同一个 CSS：`assets/css/posts.css`
- 照片墙：`photowall.html`
  - 3D 环形照片墙，可鼠标/触摸拖动旋转寻找照片
  - 照片数量可扩展（按数量自动均分环形角度）
  - 默认自动缓慢旋转；拖拽时暂停自动旋转

## 运行方式

### 本地直接打开

这是纯静态站点，直接双击打开 `index.html` 即可。

### 推荐：使用 VS Code Live Server

使用 Live Server 打开 `index.html`，可以避免部分浏览器对本地文件路径/缓存的影响。

## 登录与访问控制

- 登录逻辑：`assets/js/index.js`
  - 如果你注册过，会优先使用注册账号密码登录
  - 否则会使用内置的演示账号（写在代码里）
- 登录校验：`assets/js/auth.js`
  - `sharing.html`、`posts/*.html`、`photowall.html` 会校验 `localStorage.loggedIn === '1'`
  - 未登录会自动跳到 `login.html`

## 经验分享（新增文章）

### 1）新增文章页

在 `posts/` 下新建一个 HTML，例如：`posts/post-my-new-article.html`。

文章页的样式统一引用：

- `../assets/css/background.css`（背景主题）
- `../assets/css/home.css`（复用导航栏样式）
- `../assets/css/posts.css`（文章详情排版）

并在页面底部引入：`../assets/js/auth.js`（登录校验）。

### 2）在文章列表中加入入口

编辑 `sharing.html`，在 `.posts` 里复制一段 `article.post`，修改：

- `href` 指向新文章页
- 标题（`.post-title`）
- 元信息（`.post-meta`）
- 摘要（`.post-excerpt`）

## 照片墙（新增/替换照片）

- 页面：`photowall.html`
- 样式：`assets/css/photowall.css`
- 拖动 + 自动旋转逻辑：`assets/js/photowall.js`

### 调整自动旋转速度

在 `assets/js/photowall.js` 中调整常量 `AUTO_ROTATE_DEG_PER_MS`（单位：度/毫秒）。

### 增加照片数量

在 `photowall.html` 的 `.ring` 内复制一段：

```html
<div class="item" data-photowall-item>
  <img src="assets/img/8.webp" alt="照片 8" />
</div>
```

JS 会自动统计 `data-photowall-item` 数量并均分一圈角度。

### 图片放置位置

把图片放到 `assets/img/` 下，然后在 `photowall.html` 更新 `img src` 路径即可。

## 背景主题（background）

统一背景主题定义在：`assets/css/background.css`。

说明：背景纹理已调整为更浅的低对比度风格，并放慢动画；如果系统开启“减少动态效果”，背景动画会自动停止。

使用方式：

1. 在页面 `<head>` 中引入 `assets/css/background.css`
2. 给 `<body>` 添加 `class="background"`

## 目录结构

```text
index.html                对外主页（入口页）
login.html                登录页
register.html             注册页
sharing.html              经验分享（文章列表）
photowall.html            3D 环形照片墙
posts/                    文章详情页（每篇一份 HTML）

assets/
  css/
    index.css             登录页样式
    login-animated.css     登录页：左侧卡通互动布局与样式
    register.css          注册页补充样式
    home.css              主页 + 顶部导航栏样式
    sharing.css           经验分享列表页小覆盖
    posts.css             文章列表/详情共用样式
    photowall.css         3D 照片墙样式
    background.css        背景主题
  js/
    index.js              登录逻辑
    login-animated.js      登录页：卡通角色互动脚本
    register.js           注册逻辑
    home.js               主页 hash 切换逻辑
    photowall.js          照片墙拖动旋转逻辑
    auth.js               登录态校验
  img/                    图片资源

可选（未接入当前静态站点运行）：
components/ui/            React/shadcn 风格组件草稿（需要 React + TS + Tailwind 环境）
lib/utils.ts              cn 工具函数（React 组件用）
demo.tsx                  React 示例入口（静态站点不使用）
```
