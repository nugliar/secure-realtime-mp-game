import Player from './Player.mjs';
import Collectible from './Collectible.mjs';
import controller from './controller.mjs'
import { canvasProps, randomPositionOnAxis } from './canvasProps.mjs'

const socket = io();
const canvas = document.getElementById('game-window');
const ctx = canvas.getContext('2d', {alpha: false});

const avatars = ['bee', 'dog', 'fox', 'turtle', 'wolf'];
const coins = ['coin', 'coins', 'dollar'];

const randomElem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const newCoin = () => {
  const idx = Math.floor(Math.random() * 3);
  const coinName = coins[idx];
  const coinValue = Math.pow(10, idx);

  return new Collectible({
    x: randomPositionOnAxis('x'),
    y: randomPositionOnAxis('y'),
    id: Math.random().toString(16).slice(2),
    avatar: `./public/img/${coinName}.png`,
    value: coinValue
  })
}

let players = {};
let thisPlayer;
let coin;

socket.on('connect', () => {

  const initProps = {
    id: socket.id,
    x: randomPositionOnAxis('x'),
    y: randomPositionOnAxis('y'),
    avatar: `./public/img/${randomElem(avatars)}.png`
  };

  thisPlayer = new Player(initProps);
  players[thisPlayer.id] = thisPlayer;

  socket.emit('newPlayer', {
    id: thisPlayer.id,
    x: thisPlayer.x,
    y: thisPlayer.y,
    score: thisPlayer.score,
    avatar: thisPlayer.avatar
  });

  socket.on('newPlayer', (updatedPlayers, coinData) => {
    if (!coinData) {
      socket.emit('newCoin', newCoin());
    } else {
      coin = new Collectible(coinData);
    }

    for (const id in updatedPlayers) {
      if (!players[id]) {
        const newPlayer = new Player(updatedPlayers[id]);
        players[id] = newPlayer;
      }
    }
  })

  socket.on('newCoin', coinData => {
    coin = new Collectible(coinData);
  })

  socket.on('movePlayer', (id, move) => {
    if (id !== thisPlayer.id) {
      players[id].dir[move.dir] = true;
      players[id].x = move.x;
      players[id].y = move.y;
    }
  })

  socket.on('removePlayer', id => {
    if (id !== thisPlayer.id) {
      delete players[id];
    }
  })

  socket.on('collision', (id, score) => {
    if (players[id]) {
      players[id].score = score;
    }
  })

  controller(thisPlayer, socket);
})

socket.on('disconnect', () => {
  socket.emit('removePlayer', {});
})

const draw = () => {
  ctx.clearRect(0, 0, canvasProps.width, canvasProps.height);

  ctx.fillStyle ='black';
  ctx.fillRect(0, 0, canvasProps.width, canvasProps.height);

  ctx.strokeStyle = 'white';
  ctx.strokeRect(
    canvasProps.borderSize,
    canvasProps.borderTopSize,
    canvasProps.width - 2 * canvasProps.borderSize,
    canvasProps.height - canvasProps.borderTopSize - canvasProps.borderSize
  )

  if (thisPlayer) {
    for (const [dir, active] of Object.entries(thisPlayer.dir)) {
      if (active) {
        thisPlayer.movePlayer(dir, 3);
      }
    };
    if (coin) {
      if (thisPlayer.collision(coin)) {
        socket.emit('collision', thisPlayer.id, coin.id);
        coin = undefined;
        socket.emit('newCoin', newCoin());
      } else {
        coin.draw(ctx);
      }
    }
  }

  for (const id in players) {
    players[id].draw(ctx);
  };

  requestAnimationFrame(draw);
};

draw();
