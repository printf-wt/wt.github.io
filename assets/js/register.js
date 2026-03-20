(function initRegister() {
    const form = document.getElementById('register-form');
    const usernameInput = document.getElementById('reg-username');
    const passwordInput = document.getElementById('reg-password');
    const agreeInput = document.getElementById('reg-agree');
    const submitBtn = document.getElementById('register-submit');
    const errorEl = document.getElementById('register-error');

    const STORAGE_KEY = 'registeredUser';

    function setError(message) {
        errorEl.textContent = message || '';
    }

    function getSelectedGender() {
        const selected = form.querySelector('input[name="gender"]:checked');
        return selected ? selected.value : '';
    }

    function getSelectedHobbies() {
        return Array.from(form.querySelectorAll('input[name="hobbies"]:checked')).map((el) => el.value);
    }

    function updateSubmitState() {
        submitBtn.disabled = !agreeInput.checked;
    }

    agreeInput.addEventListener('change', updateSubmitState);
    updateSubmitState();

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        setError('');

        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        const gender = getSelectedGender();
        const hobbies = getSelectedHobbies();

        if (!username || !password) {
            setError('请填写账号和密码');
            return;
        }

        if (!gender) {
            setError('请选择性别');
            return;
        }

        if (!agreeInput.checked) {
            setError('请先同意用户协议');
            return;
        }

        const user = {
            username,
            password,
            gender,
            hobbies,
            createdAt: new Date().toISOString(),
        };

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        } catch (e) {
            setError('注册失败：浏览器存储不可用');
            return;
        }

        window.location.href = 'login.html';
    });

    usernameInput.focus();
})();
