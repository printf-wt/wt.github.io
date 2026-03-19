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

        // 默认稍微转一点，避免完全正面重叠
        setRotation(-10);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPhotoWall);
    } else {
        initPhotoWall();
    }
})();
