const { canvasProps, getRandomPosition } = require('../public/canvasProps.mjs');

const serverLog = (...values) => {
  console.log('[server]:', ...values);
}

const newCoin = () => {
  return {
    id: Math.random().toString(16).slice(2),
    value: Math.floor(1 + Math.random() * 3),
    x: getRandomPosition(canvasProps.limitMinX, canvasProps.limitMaxX, 5),
    y: getRandomPosition(canvasProps.limitMinY, canvasProps.limitMaxY, 5)
  }
}

const ioSocket = (io) => {
  let coin = newCoin();
  let players = [];
  let curDir;

  io.on('connection', (socket) => {
    serverLog('a user connected');
    let curPlayer;

    socket.emit('init', {
      id: socket.id,
      players: players,
      coin: coin
    })

    socket.on('new-player', newPlayer => {
      serverLog('new player', newPlayer.id);
      players.push(newPlayer);
      curPlayer = newPlayer;
      io.emit('new-player', {
        id: newPlayer.id,
        x: newPlayer.x,
        y: newPlayer.y
      })
    })

    socket.on('move-player', (dir, posObj) => {
      curPlayer.x = posObj.x;
      curPlayer.y = posObj.y;
      io.emit('move-player', {
        id: curPlayer.id,
        dir: dir,
        posObj: posObj
      })
      if (curDir !== dir) {
        serverLog('player', curPlayer.id, 'start move', dir.toUpperCase(), 'at', posObj);
        curDir = dir;
      }
    });

    socket.on('stop-player', (dir, posObj) => {
      curPlayer.x = posObj.x;
      curPlayer.y = posObj.y;
      io.emit('stop-player', {
        id: curPlayer.id,
        dir: dir,
        posObj: posObj
      })
      serverLog('player', curPlayer.id, 'stop move', dir.toUpperCase(), 'at', posObj);
    });

    socket.on('destroy-item', ({ playerId, coinValue, coinId }) => {
      if (coin.id === coinId) {
        curPlayer.score += coinValue;
        serverLog('player scores', curPlayer.id, curPlayer.score);
        io.emit('update-player', { id: curPlayer.id, score: curPlayer.score });
      }
      coin = newCoin();
      io.emit('new-coin', coin);
    });

    socket.on('disconnect', () => {
      serverLog('user disconnected')
      players = players.filter(player => player.id !== curPlayer.id);
      io.emit('remove-player', curPlayer.id);
    })
  })
}

module.exports = ioSocket
