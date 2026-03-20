/**
 * 登录页（login.html）表单逻辑
 *
 * 功能：
 * - 校验用户输入的账号/密码
 * - 若存在已注册账号（localStorage.registeredUser），优先使用注册信息作为“正确账号”
 * - 否则回退到演示账号（写死在代码里的 VALID_USERNAME/VALID_PASSWORD）
 * - 登录成功后写入 localStorage.loggedIn = '1' 并跳转到主页 index.html
 *
 * 说明：
 * - 纯静态站点，无后端；所有信息都在浏览器 localStorage 中保存
 */
(function initLogin() {
    const form = document.getElementById('login-form');
    const usernameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');
    const errorEl = document.getElementById('login-error');

    const VALID_USERNAME = '17673680052';
    const VALID_PASSWORD = 'wangteng20051215';
    const STORAGE_KEY = 'registeredUser';

    function setError(message) {
        // 统一的错误展示出口：避免到处直接操作 DOM
        errorEl.textContent = message || '';
    }

    function getRegisteredUser() {
        // 从 localStorage 读取注册信息（结构：{ username, password, ... }）
        // 任意解析失败都返回 null，表示“没有有效注册信息”
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (!parsed || typeof parsed !== 'object') return null;
            if (typeof parsed.username !== 'string' || typeof parsed.password !== 'string') return null;
            return { username: parsed.username, password: parsed.password };
        } catch (e) {
            return null;
        }
    }

    form.addEventListener('submit', (e) => {
        // 拦截默认提交（静态站点不需要真正提交到服务器）
        e.preventDefault();
        setError('');

        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        if (!username || !password) {
            setError('请输入用户名和密码');
            return;
        }

        // 决定“正确账号”来自哪里：注册用户优先，否则用演示账号
        const registered = getRegisteredUser();
        const expectedUsername = registered ? registered.username : VALID_USERNAME;
        const expectedPassword = registered ? registered.password : VALID_PASSWORD;

        if (username !== expectedUsername || password !== expectedPassword) {
            setError('账号或密码错误');
            passwordInput.value = '';
            passwordInput.focus();
            return;
        }

        try {
            // 写入登录态：供 auth.js 判断
            localStorage.setItem('loggedIn', '1');
        } catch (e) {
            // localStorage 不可用时也允许进入
        }

        // 登录成功：进入主页
        window.location.href = 'index.html';
    });

    // 默认聚焦用户名输入框，提升可用性
    usernameInput.focus();
})();
