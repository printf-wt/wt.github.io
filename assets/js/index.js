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

function showSection(sectionId) {
    // 隐藏所有内容区域
    document.querySelectorAll('section').forEach((section) => {
        section.style.display = 'none';
    });
    // 显示被点击按钮对应的内容区域
    document.getElementById(sectionId).style.display = 'block'; // 显示被选中的目标区域
}

function getSectionIdFromHash() {
    // 读取当前 URL 的 hash（#education / #awards / ...）并转换成 sectionId
    const hash = window.location.hash || '';
    const sectionId = hash.startsWith('#') ? hash.slice(1) : hash;
    return sectionId;
}

function syncSectionFromHash() {
    // 根据 hash 同步当前应展示的 section
    const sectionId = getSectionIdFromHash();
    if (sectionId && document.getElementById(sectionId)) {
        showSection(sectionId);
        return;
    }
    // 默认进入页面时先展示“学历信息”
    if (document.getElementById('education')) {
        showSection('education');
    }
}

document.addEventListener('click', (event) => {
    // 事件委托：只处理导航栏里带 data-section 的链接
    const link = event.target.closest('a[data-section]');
    if (!link) return;

    const sectionId = link.getAttribute('data-section');
    if (!sectionId) return;
    if (!document.getElementById(sectionId)) return;

    event.preventDefault();
    // 写入 hash，使得“返回/前进/刷新”都能保持当前 section
    window.location.hash = `#${sectionId}`;
    // hashchange 会触发 syncSectionFromHash，这里不重复 showSection
});

window.addEventListener('hashchange', syncSectionFromHash);
document.addEventListener('DOMContentLoaded', syncSectionFromHash);

// 兼容部分环境下的作用域差异，确保 inline onclick 能访问到
window.showSection = showSection;
