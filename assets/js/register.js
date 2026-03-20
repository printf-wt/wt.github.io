/**
 * 注册页（register.html）表单逻辑
 *
 * 功能：
 * - 校验必填项（账号/密码/性别/协议）
 * - 将注册信息写入 localStorage.registeredUser
 * - 注册成功后跳回登录页 login.html
 */
(function initRegister() {
    const form = document.getElementById('register-form');
    const usernameInput = document.getElementById('reg-username');
    const passwordInput = document.getElementById('reg-password');
    const agreeInput = document.getElementById('reg-agree');
    const submitBtn = document.getElementById('register-submit');
    const errorEl = document.getElementById('register-error');

    const STORAGE_KEY = 'registeredUser';

    function setError(message) {
        // 统一错误提示出口
        errorEl.textContent = message || '';
    }

    function getSelectedGender() {
        // 读取单选框选中的性别
        const selected = form.querySelector('input[name="gender"]:checked');
        return selected ? selected.value : '';
    }

    function getSelectedHobbies() {
        // 读取多选框选中的兴趣爱好
        return Array.from(form.querySelectorAll('input[name="hobbies"]:checked')).map((el) => el.value);
    }

    function updateSubmitState() {
        // 只有勾选协议才允许提交
        submitBtn.disabled = !agreeInput.checked;
    }

    agreeInput.addEventListener('change', updateSubmitState);
    updateSubmitState();

    form.addEventListener('submit', (e) => {
        // 静态站点：阻止默认提交，改为本地校验+写 localStorage
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

        // 注册信息结构：后续登录页会读取 username/password
        const user = {
            username,
            password,
            gender,
            hobbies,
            createdAt: new Date().toISOString(),
        };

        try {
            // 持久化到 localStorage
            localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        } catch (e) {
            setError('注册失败：浏览器存储不可用');
            return;
        }

        // 注册成功：返回登录页
        window.location.href = 'login.html';
    });

    // 默认聚焦账号输入框
    usernameInput.focus();
})();
