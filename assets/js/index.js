function showSection(sectionId) {
    // 隐藏所有内容区域
    document.querySelectorAll('section').forEach((section) => {
        section.style.display = 'none';
    });
    // 显示被点击按钮对应的内容区域
    document.getElementById(sectionId).style.display = 'block'; // 显示被选中的目标区域
}

function getSectionIdFromHash() {
    const hash = window.location.hash || '';
    const sectionId = hash.startsWith('#') ? hash.slice(1) : hash;
    return sectionId;
}

function syncSectionFromHash() {
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
    const link = event.target.closest('a[data-section]');
    if (!link) return;

    const sectionId = link.getAttribute('data-section');
    if (!sectionId) return;
    if (!document.getElementById(sectionId)) return;

    event.preventDefault();
    window.location.hash = `#${sectionId}`;
    // hashchange 会触发 syncSectionFromHash，这里不重复 showSection
});

window.addEventListener('hashchange', syncSectionFromHash);
document.addEventListener('DOMContentLoaded', syncSectionFromHash);

// 兼容部分环境下的作用域差异，确保 inline onclick 能访问到
window.showSection = showSection;
