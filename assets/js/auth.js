(function enforceLogin() {
    try {
        if (localStorage.getItem('loggedIn') !== '1') {
            window.location.href = 'login.html';
        }
    } catch (e) {
        // 如果浏览器禁用 localStorage，则不做强制跳转
    }
})();
