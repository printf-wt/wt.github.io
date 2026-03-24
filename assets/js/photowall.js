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
        // 获取照片环形容器（CSS 3D 旋转的根节点）
        const ring = document.querySelector('[data-photowall-ring]'); // 环形容器（CSS 变量写入目标）
        // 页面上没有照片墙时直接退出
        if (!ring) return;

        // 1) 统计照片数量并写入 CSS 变量
        const items = Array.from(ring.querySelectorAll('[data-photowall-item]')); // 收集所有照片卡片
        // 写入总数量：CSS 用它把 360° 均分成 N 份
        ring.style.setProperty('--count', String(items.length)); // --count 是 CSS 计算角度的分母
        items.forEach((item, index) => {
            // 2) 为每个 item 写入索引变量 --i，CSS 负责算位置
            // index 从 0 开始：对应第 0 张、第 1 张...
            item.style.setProperty('--i', String(index)); // --i 是每张照片的索引（决定其角度位置）
        });

        // 拖拽相关状态
        let isDragging = false; // 是否处于拖拽中
        let startX = 0; // pointerdown 时的 clientX
        let startRotation = 0; // pointerdown 时的 rotation（起始角度）
        // 当前旋转角度（单位：deg）
        let rotation = 0; // 内部状态：与 CSS 变量 --rotation 同步

        const prefersReducedMotion = window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches; // 无障碍：减少动态则禁用自动旋转
        // 自动旋转速度：度/毫秒（例如 0.006 => 约 6deg/s）
        const AUTO_ROTATE_DEG_PER_MS = 0.006;

        const setRotation = (value) => {
            // 统一入口：更新内部 rotation 并写回 CSS 变量
            rotation = value; // 更新内部角度状态
            // CSS 读取 --rotation 来做整体 rotateY/rotateZ 等变换
            ring.style.setProperty('--rotation', `${rotation}deg`); // 写入 CSS 变量（单位 deg）
        };

        const onPointerDown = (event) => {
            // 开始拖动：记录起点与起始角度
            isDragging = true; // 开始拖动
            // 给容器加 class：可用于拖动时的样式反馈（如光标/过渡）
            ring.classList.add('is-dragging'); // 添加拖动态 class（cursor/过渡等）
            // 记录指针起始 x
            startX = event.clientX; // 记录起点 x
            // 记录拖动开始时的角度
            startRotation = rotation; // 记录拖拽开始时的角度
            // 捕获指针：避免拖动过程中指针移出元素导致事件丢失
            ring.setPointerCapture(event.pointerId); // 捕获指针，避免移出元素导致拖拽中断
        };

        const onPointerMove = (event) => {
            if (!isDragging) return;
            // 鼠标/手指水平位移
            const deltaX = event.clientX - startX;
            // 旋转灵敏度：每拖动 1px 旋转 0.35deg
            setRotation(startRotation + deltaX * 0.35);
        };

        const endDrag = (event) => {
            // 结束拖动：释放 capture，恢复自动旋转
            if (!isDragging) return;
            isDragging = false; // 结束拖拽
            // 移除拖动中的样式状态
            ring.classList.remove('is-dragging'); // 移除拖动态 class
            try {
                // 释放指针捕获（不同浏览器可能抛异常，故 try/catch）
                ring.releasePointerCapture(event.pointerId); // 释放捕获
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
                if (!lastTime) lastTime = now; // 第一帧初始化时间基准
                // 计算本帧相对上一帧的时间差（ms）
                const delta = now - lastTime;
                lastTime = now;

                if (!isDragging) {
                    // 非拖拽状态：按时间差累加自动旋转角度
                    setRotation(rotation + delta * AUTO_ROTATE_DEG_PER_MS);
                }

                // 继续下一帧
                requestAnimationFrame(tick);
            };

            requestAnimationFrame(tick);
        }

        // 默认稍微转一点，避免完全正面重叠
        setRotation(-10); // 初始角度：让视觉上不完全正对，减少重叠
    }

    // DOM ready 兼容：保证在元素存在后再初始化
    if (document.readyState === 'loading') {
        // 文档仍在加载：等 DOMContentLoaded 再初始化
        document.addEventListener('DOMContentLoaded', initPhotoWall);
    } else {
        // 文档已就绪：直接初始化
        initPhotoWall();
    }
})();
