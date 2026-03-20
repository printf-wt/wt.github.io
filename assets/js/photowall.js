/**
 * 照片墙（photowall.html）交互逻辑
 *
 * 页面/样式配合：
 * - HTML：.ring 容器带 data-photowall-ring
 * - 每个照片 item 带 data-photowall-item
 * - CSS 使用变量：
 *   - --count：照片数量（用于均分 360°）
 *   - --i：每张照片的索引（用于计算角度）
 *   - --rotation：当前整体旋转角度（JS 实时更新）
 *
 * 交互：
 * - Pointer 事件拖动旋转（支持鼠标/触控）
 * - 自动缓慢旋转：拖动时暂停，松手后继续
 * - 支持 prefers-reduced-motion：开启时禁用自动旋转
 */
(function () {
    function initPhotoWall() {
        const ring = document.querySelector('[data-photowall-ring]');
        if (!ring) return;

        // 1) 统计照片数量并写入 CSS 变量
        const items = Array.from(ring.querySelectorAll('[data-photowall-item]'));
        ring.style.setProperty('--count', String(items.length));
        items.forEach((item, index) => {
            // 2) 为每个 item 写入索引变量 --i，CSS 负责算位置
            item.style.setProperty('--i', String(index));
        });

        let isDragging = false;
        let startX = 0;
        let startRotation = 0;
        let rotation = 0;

        const prefersReducedMotion = window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        // 自动旋转速度：度/毫秒（例如 0.006 => 约 6deg/s）
        const AUTO_ROTATE_DEG_PER_MS = 0.006;

        const setRotation = (value) => {
            // 统一入口：更新内部 rotation 并写回 CSS 变量
            rotation = value;
            ring.style.setProperty('--rotation', `${rotation}deg`);
        };

        const onPointerDown = (event) => {
            // 开始拖动：记录起点与起始角度
            isDragging = true;
            ring.classList.add('is-dragging');
            startX = event.clientX;
            startRotation = rotation;
            ring.setPointerCapture(event.pointerId);
        };

        const onPointerMove = (event) => {
            if (!isDragging) return;
            const deltaX = event.clientX - startX;
            // 旋转灵敏度：每拖动 1px 旋转 0.35deg
            setRotation(startRotation + deltaX * 0.35);
        };

        const endDrag = (event) => {
            // 结束拖动：释放 capture，恢复自动旋转
            if (!isDragging) return;
            isDragging = false;
            ring.classList.remove('is-dragging');
            try {
                ring.releasePointerCapture(event.pointerId);
            } catch (e) {
                // ignore
            }
        };

        ring.addEventListener('pointerdown', onPointerDown);
        ring.addEventListener('pointermove', onPointerMove);
        ring.addEventListener('pointerup', endDrag);
        ring.addEventListener('pointercancel', endDrag);

        if (!prefersReducedMotion) {
            let lastTime = 0;
            const tick = (now) => {
                // requestAnimationFrame 循环：根据时间增量推进旋转
                if (!lastTime) lastTime = now;
                const delta = now - lastTime;
                lastTime = now;

                if (!isDragging) {
                    setRotation(rotation + delta * AUTO_ROTATE_DEG_PER_MS);
                }

                requestAnimationFrame(tick);
            };

            requestAnimationFrame(tick);
        }

        // 默认稍微转一点，避免完全正面重叠
        setRotation(-10);
    }

    // DOM ready 兼容：保证在元素存在后再初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPhotoWall);
    } else {
        initPhotoWall();
    }
})();
