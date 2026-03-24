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
    const form = document.getElementById('register-form'); // 注册表单
    const usernameInput = document.getElementById('reg-username'); // 账号输入框
    const passwordInput = document.getElementById('reg-password'); // 密码输入框
    const agreeInput = document.getElementById('reg-agree'); // 同意协议 checkbox
    const submitBtn = document.getElementById('register-submit'); // 提交按钮（需要联动 disabled）
    const errorEl = document.getElementById('register-error'); // 错误提示容器

    // localStorage 持久化键名：与登录页保持一致
    const STORAGE_KEY = 'registeredUser'; // 与 login.js 保持一致的 key

    function setError(message) {
        // 统一错误提示出口
        // message 为空时清空提示
        errorEl.textContent = message || ''; // 使用 textContent，避免插入 HTML
    }

    function getSelectedGender() {
        // 读取单选框选中的性别
        const selected = form.querySelector('input[name="gender"]:checked'); // CSS 选择器：找被选中的 radio
        // 未选择则返回空字符串
        return selected ? selected.value : '';
    }

    function getSelectedHobbies() {
        // 读取多选框选中的兴趣爱好
        // 通过 map 提取每个 checkbox 的 value
        return Array.from(form.querySelectorAll('input[name="hobbies"]:checked')) // 取所有被勾选的 checkbox
            .map((el) => el.value); // 抽取它们的 value 组成数组
    }

    function updateSubmitState() {
        // 只有勾选协议才允许提交
        // disabled=true 时按钮不可点击
        submitBtn.disabled = !agreeInput.checked; // 未同意协议则禁用提交按钮
    }

    agreeInput.addEventListener('change', updateSubmitState); // 勾选状态变化时更新按钮
    updateSubmitState(); // 初始化一次：进入页面就正确反映 disabled

    form.addEventListener('submit', (e) => {
        // 静态站点：阻止默认提交，改为本地校验+写 localStorage
        e.preventDefault(); // 阻止真正提交（静态站点）
        // 提交前清空错误
        setError(''); // 清空历史错误

        // 收集用户输入
        const username = usernameInput.value.trim(); // 账号：去空格
        const password = passwordInput.value; // 密码：不去空格，按原样存储
        const gender = getSelectedGender(); // 性别：radio
        const hobbies = getSelectedHobbies(); // 兴趣：checkbox 数组

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
    usernameInput.focus(); // 首次进入把光标放在账号输入框
})();
