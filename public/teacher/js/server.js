const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

// 存储所有连接的客户端
const clients = new Set();

wss.on('connection', (ws) => {
    // 新客户端连接时，将其添加到客户端集合中
    clients.add(ws);

    // 监听客户端发送的消息
    ws.on('message', (message) => {
        // 广播消息给所有连接的客户端
        clients.forEach((client) => {
            if (client!== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    // 客户端断开连接时，将其从客户端集合中移除
    ws.on('close', () => {
        clients.delete(ws);
    });
});

console.log('WebSocket server is running on port 8080');