/**
 * 登录页左侧“卡通互动”脚本（login.html）
 *
 * 交互效果概览：
 * - 眼睛瞳孔跟随鼠标移动（通过 CSS 变量 --px/--py 驱动）
 * - 随机眨眼（紫色/黑色角色分别定时）
 * - 输入/聚焦时产生“正在输入”的姿态变化
 * - 密码显示时：整体视线偏向左上；紫色偶尔“偷看”右下
 * - 支持 prefers-reduced-motion：开启后停止动画循环与眨眼调度
 *
 * DOM 约定：
 * - 左侧舞台容器：data-login-stage
 * - 表单：data-login-form
 * - 角色容器：data-character="purple|black|orange|yellow"
 * - 眼睛/瞳孔：data-eye / data-pupil；部分角色为 data-pupil-only
 */
(function initAnimatedLogin() {
  const stage = document.querySelector("[data-login-stage]");
  const form = document.querySelector("[data-login-form]");
  const usernameInput = document.getElementById("login-username");
  const passwordInput = document.getElementById("login-password");
  const toggle = document.querySelector("[data-password-toggle]");

  // 若关键节点缺失，直接退出（避免报错影响登录逻辑）
  if (!stage || !form || !usernameInput || !passwordInput || !toggle) return;

  // 无障碍：系统设置“减少动态效果”时尽量关闭动画
  const prefersReducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 缓存角色 DOM，后续用于计算中心点、设置 transform 等
  const characters = {
    purple: stage.querySelector('[data-character="purple"]'),
    black: stage.querySelector('[data-character="black"]'),
    orange: stage.querySelector('[data-character="orange"]'),
    yellow: stage.querySelector('[data-character="yellow"]'),
  };

  // 收集眼睛/瞳孔元素：
  // - 紫色/黑色：白色眼球 + 瞳孔（data-pupil）
  // - 橙色/黄色：只有“瞳孔点”（data-pupil-only）
  const purpleEyes = Array.from(stage.querySelectorAll('[data-eye-owner="purple"]'));
  const blackEyes = Array.from(stage.querySelectorAll('[data-eye-owner="black"]'));
  const eyeEls = Array.from(stage.querySelectorAll("[data-eye]"));
  const pupilEls = Array.from(stage.querySelectorAll("[data-pupil]"));
  const pupilOnlyEls = Array.from(stage.querySelectorAll("[data-pupil-only]"));

  // 当前鼠标位置：用于“目光跟随”
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  // 状态机：
  // - isTyping：输入/聚焦后的短暂状态（用于角色夸张动作）
  // - showPassword：密码是否可见
  // - purplePeeking：紫色是否处于“偷看”阶段
  let isTyping = false;
  let showPassword = false;
  let purplePeeking = false;

  // 工具函数：将值夹在 min/max 之间，避免过度偏移
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  // 将瞳孔偏移写入 CSS 变量（由 CSS 负责 transform）
  const setPupilOffset = (el, x, y) => {
    el.style.setProperty("--px", `${x}px`);
    el.style.setProperty("--py", `${y}px`);
  };

  // 眨眼：通过 class 控制 eye 高度变化
  const setBlink = (ownerEyes, blinking) => {
    ownerEyes.forEach((eye) => {
      if (blinking) eye.classList.add("is-blinking");
      else eye.classList.remove("is-blinking");
    });
  };

  // 随机眨眼调度：返回一个取消函数
  const scheduleRandomBlink = (ownerEyes) => {
    if (prefersReducedMotion) return () => {};

    let cancelled = false;

    const loop = () => {
      if (cancelled) return;
      const delay = Math.random() * 4000 + 3000; // 3-7s
      window.setTimeout(() => {
        if (cancelled) return;
        setBlink(ownerEyes, true);
        window.setTimeout(() => {
          setBlink(ownerEyes, false);
          loop();
        }, 150);
      }, delay);
    };

    loop();
    return () => {
      cancelled = true;
    };
  };

  const getCenter = (el) => {
    // 取元素中心点：y 使用 1/3 高度更像“脸部中心”
    const rect = el.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 3,
    };
  };

  const updateBodyAndFace = () => {
    // 根据鼠标位置更新角色整体 skew/translate，并微调“脸”位移
    const applyFor = (key, extraSkew = 0, extraTranslateX = 0) => {
      const el = characters[key];
      if (!el) return;

      const center = getCenter(el);
      const dx = mouseX - center.x;
      const dy = mouseY - center.y;

      const faceX = clamp(dx / 20, -15, 15);
      const faceY = clamp(dy / 30, -10, 10);
      const bodySkew = clamp(-dx / 120, -6, 6);

      const face = el.querySelector("[data-face]");
      if (face) {
        face.style.transform = `translate(${faceX}px, ${faceY}px)`;
      }

      // 紫色在“正在输入/密码隐藏且有内容”时更夸张一点（模仿参考效果）
      const passwordHasText = String(passwordInput.value || "").length > 0;
      const purpleExtra =
        key === "purple" && (isTyping || (passwordHasText && !showPassword));

      const skew = bodySkew + extraSkew + (purpleExtra ? -12 : 0);
      const tx = extraTranslateX + (purpleExtra ? 40 : 0);
      el.style.transform = `skewX(${skew}deg) translateX(${tx}px)`;

      // 高度变化（紫色输入时抬高一点）
      if (key === "purple") {
        el.style.height = purpleExtra ? "440px" : "400px";
      }
    };

    applyFor("orange");
    applyFor("yellow");
    applyFor("black", isTyping ? 10 : 0, isTyping ? 20 : 0);
    applyFor("purple");
  };

  const updatePupils = () => {
    // forced look values: 与参考接近的偏移量
    const forced = {
      purple: null,
      black: null,
      orange: null,
      yellow: null,
    };

    const passwordHasText = String(passwordInput.value || "").length > 0;

    if (isTyping) {
      // 输入/聚焦：给紫/黑一个固定视线，表现“注意力集中”
      forced.purple = { x: 3, y: 4 };
      forced.black = { x: 0, y: -4 };
    }

    if (passwordHasText && showPassword) {
      // 密码可见时：整体偏向左上（并偶尔偷看右下）
      forced.black = { x: -4, y: -4 };
      forced.orange = { x: -5, y: -4 };
      forced.yellow = { x: -5, y: -4 };
      forced.purple = purplePeeking ? { x: 4, y: 5 } : { x: -4, y: -4 };
    }

    // white eye balls
    pupilEls.forEach((pupil) => {
      const eye = pupil.parentElement;
      if (!eye) return;

      const owner = eye.getAttribute("data-eye-owner");
      const force = owner && forced[owner];

      if (force) {
        setPupilOffset(pupil, force.x, force.y);
        return;
      }

      const rect = eye.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = mouseX - cx;
      const dy = mouseY - cy;

      const maxDistance = owner === "black" ? 4 : 5;
      const dist = Math.min(Math.sqrt(dx * dx + dy * dy), maxDistance);
      const angle = Math.atan2(dy, dx);

      const px = Math.cos(angle) * dist;
      const py = Math.sin(angle) * dist;

      setPupilOffset(pupil, px, py);
    });

    // pupil-only eyes (orange/yellow)
    pupilOnlyEls.forEach((pupil) => {
      // 通过 DOM 归属判断 owner
      const char = pupil.closest("[data-character]");
      const owner = char ? char.getAttribute("data-character") : null;
      const force = owner && forced[owner];

      if (force) {
        setPupilOffset(pupil, force.x, force.y);
        return;
      }

      const rect = pupil.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = mouseX - cx;
      const dy = mouseY - cy;

      const maxDistance = 5;
      const dist = Math.min(Math.sqrt(dx * dx + dy * dy), maxDistance);
      const angle = Math.atan2(dy, dx);

      const px = Math.cos(angle) * dist;
      const py = Math.sin(angle) * dist;

      setPupilOffset(pupil, px, py);
    });
  };

  const render = () => {
    // 动画主循环：每一帧都更新姿态与瞳孔
    if (prefersReducedMotion) return;
    updateBodyAndFace();
    updatePupils();
    requestAnimationFrame(render);
  };

  // Track mouse
  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Typing interaction
  const typingPulse = () => {
    // 简化“正在输入”状态：触发后维持 800ms
    isTyping = true;
    window.setTimeout(() => {
      isTyping = false;
    }, 800);
  };

  usernameInput.addEventListener("focus", typingPulse);
  passwordInput.addEventListener("focus", typingPulse);

  // Show/hide password
  const syncToggleLabel = () => {
    // 同步按钮文案（显示/隐藏）
    toggle.textContent = showPassword ? "隐藏" : "显示";
  };

  toggle.addEventListener("click", () => {
    // 切换密码可见性
    showPassword = !showPassword;
    passwordInput.setAttribute("type", showPassword ? "text" : "password");
    syncToggleLabel();
  });

  // Purple peeking scheduling
  const schedulePeek = () => {
    // 紫色“偷看”调度：仅在“有密码 + 密码可见”时生效
    const passwordHasText = String(passwordInput.value || "").length > 0;
    if (!passwordHasText || !showPassword || prefersReducedMotion) {
      purplePeeking = false;
      return;
    }

    const delay = Math.random() * 3000 + 2000; // 2-5s
    window.setTimeout(() => {
      const stillHasText = String(passwordInput.value || "").length > 0;
      if (!stillHasText || !showPassword) {
        purplePeeking = false;
        return;
      }

      purplePeeking = true;
      window.setTimeout(() => {
        purplePeeking = false;
        schedulePeek();
      }, 800);
    }, delay);
  };

  passwordInput.addEventListener("input", () => {
    // 密码变化时，重新安排偷看
    schedulePeek();
  });

  // Initial state
  syncToggleLabel();
  const stopPurpleBlink = scheduleRandomBlink(purpleEyes);
  const stopBlackBlink = scheduleRandomBlink(blackEyes);

  // Start render loop
  if (!prefersReducedMotion) {
    requestAnimationFrame(render);
  }

  // Cleanup on page unload (best-effort)
  window.addEventListener("beforeunload", () => {
    stopPurpleBlink();
    stopBlackBlink();
  });
})();
