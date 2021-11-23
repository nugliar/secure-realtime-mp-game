const ioSocket = (io) => {

  let players = {};
  let coin;

  const log = (...values) => {
    console.log('[server]:', ...values);
  }

  io.on('connection', (socket) => {
    log('a user connected');
    let id;

    socket.on('newPlayer', player => {
      id = player.id;
      players[id] = player;

      io.emit('newPlayer', players, coin);
      log('new player', player);
    })

    socket.on('movePlayer', move => {
      players[id].x = move.x;
      players[id].y = move.y;
      io.emit('movePlayer', id, { dir: move.dir, x: move.x, y: move.y });
      log('move player', id, move.dir);
    })

    socket.on('newCoin', coinData => {
      coin = {...coinData};
      io.emit('newCoin', coinData);
      log('new coin', coin.id);
    })

    socket.on('collision', (id, coinId) => {
      log('collision', id, 'coin', coinId);

      if (coin.id === coinId && !coin.destroyed) {
        coin.destroyed = true;
        const newScore = players[id].score + coin.value;
        io.emit('collision', id, newScore);
      }
    })

    socket.on('disconnect', () => {
      delete players[id];
      io.emit('removePlayer', id);
      log('remove player', id);
      log('a user disconnected');
    })
  })
}

module.exports = ioSocket
