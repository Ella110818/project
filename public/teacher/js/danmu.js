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

    // 连接Socket.IO服务器
    const socket = io("http://127.0.0.1:3333", {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
    });
    
    // 监听连接成功事件
    socket.on('connect', () => {
        console.log('弹幕系统已连接到服务器');
    });

    // 监听连接错误事件
    socket.on('connect_error', (error) => {
        console.error('弹幕系统连接错误:', error);
    });

    // 监听断开连接事件
    socket.on('disconnect', (reason) => {
        console.log('弹幕系统断开连接:', reason);
    });

    // 监听新消息
    socket.on('sendFunEventCallBack', (data) => {
        const messages = JSON.parse(data);
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.info) {
            barrageSystem.createBarrage(lastMessage.info);
        }
    });

    // 发送弹幕
    window.sendBarrage = function() {
        const input = document.getElementById('barrage-input');
        const text = input.value.trim();
        
        if (text) {
            socket.emit('sendFunEvent', {
                info: text
            });
            input.value = '';
        }
    }

    // 按回车发送弹幕
    document.getElementById('barrage-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendBarrage();
        }
    });
});