(function enforceLogin() {
    try {
        if (localStorage.getItem('loggedIn') !== '1') {
            window.location.href = 'index.html';
        }
    } catch (e) {
        // 如果浏览器禁用 localStorage，则不做强制跳转
    }
})();

function showSection(sectionId) {
    // 隐藏所有内容区域
    document.querySelectorAll('section').forEach((section) => {
        section.style.display = 'none';
    });
    // 显示被点击按钮对应的内容区域
    document.getElementById(sectionId).style.display = 'block'; // 显示被选中的目标区域
}

// 兼容部分环境下的作用域差异，确保 inline onclick 能访问到
window.showSection = showSection;
