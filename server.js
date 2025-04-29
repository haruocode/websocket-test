// server.js
const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

server.on('connection', (socket) => {
  console.log('クライアント接続！');

  socket.on('message', (message) => {
    console.log('受信:', message.toString());

    // ここで全クライアントにブロードキャストする
    server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`誰かが送信: ${message}`);
      }
    });
  });

  socket.on('close', () => {
    console.log('クライアント切断');
  });
});

console.log('WebSocketサーバー起動中 (ポート8080)');
