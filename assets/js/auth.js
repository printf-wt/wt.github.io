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
(function enforceLogin() { // IIFE：脚本加载后立刻执行“访问控制”
    try { // try/catch：避免 localStorage 不可用导致整页脚本报错
        // 读取登录态：约定值为字符串 '1' 才算已登录
        const loggedInFlag = localStorage.getItem('loggedIn'); // 从本地存储读取登录标记

        // 只要不是 '1' 就视为未登录（包括 null/undefined/其它值）
        if (loggedInFlag !== '1') {
            // 未登录：跳转到登录页（用于前端演示的访问控制）
            window.location.href = 'login.html'; // 直接改 location 触发页面导航
        }
    } catch (e) {
        // 如果浏览器禁用 localStorage/隐私模式限制等，则不做强制跳转（降级策略）
    }
})(); // 立即执行
