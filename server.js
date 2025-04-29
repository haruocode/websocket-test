// server.js
const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

server.on('connection', (socket) => {
  console.log('クライアント接続！');

  socket.nickname = '名無し';

  socket.on('message', (data) => {
    const message = data.toString();
    console.log('受信:', message);

    if (message.startsWith('NICKNAME:')) {
      const nickname = message.replace('NICKNAME:', '').trim();
      socket.nickname = nickname || '名無し';
      console.log(`ニックネーム登録: ${socket.nickname}`);

      // ★ここで入室メッセージを全員に送信！
      broadcast(`【入室】${socket.nickname}さんが入室しました`);
      return;
    }

    broadcast(`${socket.nickname}: ${message}`);
  });

  socket.on('close', () => {
    console.log(`クライアント切断: ${socket.nickname}`);

    // ★切断したら退室メッセージを全員に送信！
    broadcast(`【退室】${socket.nickname}さんが退室しました`);
  });
});

function broadcast(message) {
  server.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}
