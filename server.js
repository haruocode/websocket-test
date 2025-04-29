const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

setInterval(() => {
  server.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      console.log(`切断: 応答なし(${ws.nickname || '名無し'})`);
      return ws.terminate();
    }

    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

server.on('connection', (socket) => {
  console.log('クライアント接続！');
  socket.isAlive = true;
  socket.nickname = '名無し';

  socket.on('pong', () => {
    console.log(`${socket.nickname} is ALIVE`)
    socket.isAlive = true;
  });

  socket.on('message', (data) => {
    const message = data.toString();
    console.log('受信:', message);

    if (message.startsWith('NICKNAME:')) {
      const nickname = message.replace('NICKNAME:', '').trim();
      socket.nickname = nickname || '名無し';
      console.log(`ニックネーム登録: ${socket.nickname}`);

      broadcast(`【入室】${socket.nickname}さんが入室しました`);
      broadcastUserCount();
      return;
    }

    broadcast(`${socket.nickname}: ${message}`);
  });

  socket.on('close', () => {
    console.log(`クライアント切断: ${socket.nickname}`);
    broadcast(`【退室】${socket.nickname}さんが退室しました`);
    broadcastUserCount();
  });
});

function broadcast(message) {
  server.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

function broadcastUserCount() {
  const count = [...server.clients].filter(c => c.readyState === WebSocket.OPEN).length;
  broadcast(`🧑‍🤝‍🧑 現在の接続人数：${count}人`);
}

console.log('WebSocketサーバー起動中 (ポート8080)');
