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
        // 读取登录态：约定值为字符串 '1' 才算已登录
        if (localStorage.getItem('loggedIn') !== '1') {
            // 未登录：跳转到登录页（用于前端演示的访问控制）
            window.location.href = 'login.html';
        }
    } catch (e) {
        // 如果浏览器禁用 localStorage，则不做强制跳转
    }
})();
