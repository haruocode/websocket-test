// server.js
const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

server.on('connection', (socket) => {
  console.log('クライアント接続！');

  // この接続ごとにニックネームを保存する変数を用意
  socket.nickname = '名無し';

  socket.on('message', (data) => {
    const message = data.toString();
    console.log('受信:', message);

    // 最初に "NICKNAME:〇〇" という形式で送ってきたらニックネーム登録
    if (message.startsWith('NICKNAME:')) {
      const nickname = message.replace('NICKNAME:', '').trim();
      socket.nickname = nickname || '名無し'; // 空だったら名無し
      console.log(`ニックネーム登録: ${socket.nickname}`);
      return;
    }

    // 通常メッセージなら、ニックネームを付けて全員に送信
    server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`${socket.nickname}: ${message}`);
      }
    });
  });

  socket.on('close', () => {
    console.log(`クライアント切断: ${socket.nickname}`);
  });
});

console.log('WebSocketサーバー起動中 (ポート8080)');
