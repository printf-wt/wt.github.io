/**
 * 主页（index.html）内容切换逻辑
 *
 * 页面结构：
 * - 顶部导航栏里每个链接带有 data-section="xxx"
 * - 页面中对应的内容区块是 <section id="xxx"> ... </section>
 *
 * 交互目标：
 * - 点击导航项时，只显示对应 section，隐藏其它 section
 * - 同步更新 URL hash（例如 #awards），支持刷新/复制链接直达
 */
/**
 * 显示指定的内容区块，并隐藏其它所有 <section>。
 *
 * 约定：
 * - sectionId 必须与页面里某个 <section id="..."> 对应。
 * - 本函数只负责“显隐切换”，不负责写 hash（hash 由点击事件/路由逻辑处理）。
 *
 * @param {string} sectionId 目标 section 的 id（例如 "education"）。
 */
function showSection(sectionId) {
    // 隐藏所有内容区域
    document.querySelectorAll('section').forEach((section) => {
        // 统一隐藏：避免多个 section 同时显示
        section.style.display = 'none'; // 直接改内联样式：覆盖 CSS 的默认 display
    });
    // 显示被点击按钮对应的内容区域
    // 注意：sectionId 来自导航 data-section，要求与 section 的 id 一致
    document.getElementById(sectionId).style.display = 'block'; // 显示被选中的目标区域
}

/**
 * 从 URL hash 解析出 sectionId。
 *
 * 示例：
 * - "#education" -> "education"
 * - ""（无 hash） -> ""
 *
 * @returns {string} 不带 # 的 sectionId。
 */
function getSectionIdFromHash() {
    // 读取当前 URL 的 hash（#education / #awards / ...）并转换成 sectionId
    const hash = window.location.hash || ''; // 例如 "#education"；没有 hash 时为空字符串
    // 去掉开头的 #，得到纯 id（没有 hash 时返回空字符串）
    const sectionId = hash.startsWith('#') ? hash.slice(1) : hash; // slice(1) 去掉 '#'
    return sectionId;
}

/**
 * 根据当前 hash 决定显示哪个 section：
 * - hash 有效且对应元素存在：显示该 section
 * - 否则回退到默认 section（education）
 */
function syncSectionFromHash() {
    // 根据 hash 同步当前应展示的 section
    const sectionId = getSectionIdFromHash(); // 从 URL 解析当前目标 section
    // hash 对应的 section 存在时，直接切换
    if (sectionId && document.getElementById(sectionId)) {
        showSection(sectionId); // 显示该区块
        return;
    }
    // 默认进入页面时先展示“学历信息”
    if (document.getElementById('education')) {
        showSection('education'); // 默认回退
    }
}

document.addEventListener('click', (event) => {
    // 事件委托：只处理导航栏里带 data-section 的链接
    // 使用 closest 兼容点击到 <a> 内部子元素的情况
    const link = event.target.closest('a[data-section]');
    if (!link) return;

    const sectionId = link.getAttribute('data-section');
    if (!sectionId) return;
    // 防御式检查：避免跳到不存在的 section
    if (!document.getElementById(sectionId)) return;

    event.preventDefault(); // 阻止 a 的默认跳转（否则会直接跳到 hash，且可能触发滚动）
    // 写入 hash，使得“返回/前进/刷新”都能保持当前 section
    window.location.hash = `#${sectionId}`; // 只更新 hash，不做整页刷新
    // hashchange 会触发 syncSectionFromHash，这里不重复 showSection
});

window.addEventListener('hashchange', syncSectionFromHash); // 用户手动改 hash / 浏览器前进后退时触发
// 首次加载时，根据 hash（或默认值）决定展示哪个 section
document.addEventListener('DOMContentLoaded', syncSectionFromHash); // DOM 就绪后执行一次初始化
