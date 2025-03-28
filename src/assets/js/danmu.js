// 弹幕系统
class BarrageSystem {
    constructor(container) {
        this.container = container;
        this.displayArea = container.querySelector('.barrage-display-area');
        this.barrages = [];
        this.maxBarrages = 10; // 最大同时显示的弹幕数
        this.colors = ['#fff', '#ff9999', '#99ff99', '#9999ff', '#ffff99', '#ff99ff', '#99ffff'];
        this.inputHeight = 50; // 输入区域的高度
    }

    // 创建新弹幕
    createBarrage(text) {
        const barrage = document.createElement('div');
        barrage.className = 'barrage-item';
        barrage.textContent = text;
        
        // 随机颜色
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];
        barrage.style.color = color;
        
        // 随机垂直位置（避开输入框区域）
        const containerHeight = this.displayArea.clientHeight;
        const maxTop = containerHeight - this.inputHeight; // 减去输入区域的高度
        const top = Math.random() * maxTop;
        barrage.style.top = `${top}px`;
        
        // 添加弹幕到显示区域
        this.displayArea.appendChild(barrage);
        
        // 动画结束后移除弹幕
        barrage.addEventListener('animationend', () => {
            barrage.remove();
            this.barrages = this.barrages.filter(b => b !== barrage);
        });
        
        this.barrages.push(barrage);
        
        // 如果弹幕数量超过限制，移除最早的弹幕
        if (this.barrages.length > this.maxBarrages) {
            const oldestBarrage = this.barrages.shift();
            oldestBarrage.remove();
        }
    }
}

// 初始化弹幕系统
let barrageSystem;

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('barrage-container');
    barrageSystem = new BarrageSystem(container);
});

// 发送弹幕
function sendBarrage() {
    const input = document.getElementById('barrage-input');
    const text = input.value.trim();
    
    if (text) {
        barrageSystem.createBarrage(text);
        input.value = '';
    }
}

// 按回车发送弹幕
document.getElementById('barrage-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendBarrage();
    }
});