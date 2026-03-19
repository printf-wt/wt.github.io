(function () {
    function initPhotoWall() {
        const ring = document.querySelector('[data-photowall-ring]');
        if (!ring) return;

        const items = Array.from(ring.querySelectorAll('[data-photowall-item]'));
        ring.style.setProperty('--count', String(items.length));
        items.forEach((item, index) => {
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
            rotation = value;
            ring.style.setProperty('--rotation', `${rotation}deg`);
        };

        const onPointerDown = (event) => {
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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPhotoWall);
    } else {
        initPhotoWall();
    }
})();
