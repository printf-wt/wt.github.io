(function initLogin() {
    const form = document.getElementById('login-form');
    const usernameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');
    const errorEl = document.getElementById('login-error');

    const VALID_USERNAME = '17673680052';
    const VALID_PASSWORD = 'wangteng20051215';
    const STORAGE_KEY = 'registeredUser';

    function setError(message) {
        errorEl.textContent = message || '';
    }

    function getRegisteredUser() {
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
        e.preventDefault();
        setError('');

        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        if (!username || !password) {
            setError('请输入用户名和密码');
            return;
        }

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
            localStorage.setItem('loggedIn', '1');
        } catch (e) {
            // localStorage 不可用时也允许进入
        }

        window.location.href = 'home.html';
    });

    usernameInput.focus();
})();
