/**
 * 注册页（register.html）表单逻辑
 *
 * 功能：
 * - 校验必填项（账号/密码/性别/协议）
 * - 将注册信息写入 localStorage.registeredUser
 * - 注册成功后跳回登录页 login.html
 */
(function initRegister() {
    // 获取注册表单与关键表单控件
    const form = document.getElementById('register-form');
    const usernameInput = document.getElementById('reg-username');
    const passwordInput = document.getElementById('reg-password');
    const agreeInput = document.getElementById('reg-agree');
    const submitBtn = document.getElementById('register-submit');
    const errorEl = document.getElementById('register-error');

    // localStorage 持久化键名：与登录页保持一致
    const STORAGE_KEY = 'registeredUser';

    function setError(message) {
        // 统一错误提示出口
        // message 为空时清空提示
        errorEl.textContent = message || '';
    }

    function getSelectedGender() {
        // 读取单选框选中的性别
        const selected = form.querySelector('input[name="gender"]:checked');
        // 未选择则返回空字符串
        return selected ? selected.value : '';
    }

    function getSelectedHobbies() {
        // 读取多选框选中的兴趣爱好
        // 通过 map 提取每个 checkbox 的 value
        return Array.from(form.querySelectorAll('input[name="hobbies"]:checked')).map((el) => el.value);
    }

    function updateSubmitState() {
        // 只有勾选协议才允许提交
        // disabled=true 时按钮不可点击
        submitBtn.disabled = !agreeInput.checked;
    }

    agreeInput.addEventListener('change', updateSubmitState);
    updateSubmitState();

    form.addEventListener('submit', (e) => {
        // 静态站点：阻止默认提交，改为本地校验+写 localStorage
        e.preventDefault();
        // 提交前清空错误
        setError('');

        // 收集用户输入
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        const gender = getSelectedGender();
        const hobbies = getSelectedHobbies();

        if (!username || !password) {
            // 基础校验：账号/密码必填
            setError('请填写账号和密码');
            return;
        }

        if (!gender) {
            // 校验：必须选择性别
            setError('请选择性别');
            return;
        }

        if (!agreeInput.checked) {
            // 校验：必须勾选协议
            setError('请先同意用户协议');
            return;
        }

        // 注册信息结构：后续登录页会读取 username/password
        const user = {
            // 登录需要的字段
            username,
            password,
            // 注册页额外信息字段（用于展示/记录）
            gender,
            hobbies,
            // 注册时间：ISO 字符串便于存储与比较
            createdAt: new Date().toISOString(),
        };

        try {
            // 持久化到 localStorage
            // JSON.stringify 将对象序列化为字符串保存
            localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        } catch (e) {
            // localStorage 不可用/超额时给出提示
            setError('注册失败：浏览器存储不可用');
            return;
        }

        // 注册成功：返回登录页
        window.location.href = 'login.html';
    });

    // 默认聚焦账号输入框
    usernameInput.focus();
})();
