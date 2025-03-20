// 处理 ResizeObserver 循环限制错误
const handleResizeObserverLoopError = () => {
    const resizeObserverError = 'ResizeObserver loop completed with undelivered notifications.';

    window.addEventListener('error', (e) => {
        if (e.message === resizeObserverError) {
            // 阻止错误继续传播
            e.stopImmediatePropagation();
        }
    });
};

export default handleResizeObserverLoopError; 