(function initLogin() {
    const form = document.getElementById('login-form');
    const usernameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');
    const errorEl = document.getElementById('login-error');

    const VALID_USERNAME = '17673680052';
    const VALID_PASSWORD = 'wangteng20051215';

    function setError(message) {
        errorEl.textContent = message || '';
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

        if (username !== VALID_USERNAME || password !== VALID_PASSWORD) {
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
