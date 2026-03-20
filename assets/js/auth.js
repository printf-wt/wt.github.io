/**
 * 登录态校验（静态前端演示用）
 *
 * 设计目标：
 * - 对需要登录才能访问的页面做“前端拦截”
 * - 未登录则跳到登录页（login.html）
 *
 * 关键约定：
 * - localStorage.loggedIn === '1' 视为已登录
 *
 * 注意：
 * - 这不是安全方案（没有后端、没有真正鉴权），仅用于课程/展示。
 */
(function enforceLogin() {
    try {
        if (localStorage.getItem('loggedIn') !== '1') {
            window.location.href = 'login.html';
        }
    } catch (e) {
        // 如果浏览器禁用 localStorage，则不做强制跳转
    }
})();
