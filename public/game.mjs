import Player from './Player.mjs';
import Collectible from './Collectible.mjs';
import controls from './controller.mjs';
import { getRandomPosition, canvasProps } from './canvasProps.mjs';

const socket = io();
const canvas = document.getElementById('game-window');
const ctx = canvas.getContext('2d', { alpha: false });

const loadImage = src => {
  const img = new Image();
  img.src = src;
  return img;
}

const coinArt = loadImage('./public/img/coin.png');
const manyCoinsArt = loadImage('./public/img/coins.png');
const dollarArt = loadImage('./public/img/dollar.png');
const mainPlayerArt = loadImage('./public/img/turtle.png');
const otherPlayerArt = loadImage('./public/img/bee.png');

let tick;
let currPlayers = [];
let item;

socket.on('init', ({ id, players, coin }) => {
  cancelAnimationFrame(tick);

  const mainPlayer = new Player({
    x: getRandomPosition(canvasProps.playFieldMinX, canvasProps.playFieldMaxX, 5),
    y: getRandomPosition(canvasProps.playFieldMinY, canvasProps.playFieldMaxY, 5),
    id,
    main: true
  });

  controls(mainPlayer, socket);

  socket.emit('new-player', mainPlayer);

  socket.on('new-player', obj => {
    const playerIds = currPlayers.map(player => player.id);
    if (!playerIds.includes(obj.id)) currPlayers.push(new Player(obj));
  });

  socket.on('move-player', ({ id, dir, posObj }) => {
    const movingPlayer = currPlayers.find(obj => obj.id === id);
    movingPlayer.moveDir(dir);

    movingPlayer.x = posObj.x;
    movingPlayer.y = posObj.y;
  });

  socket.on('stop-player', ({ id, dir, posObj }) => {
    const stoppingPlayer = currPlayers.find(obj => obj.id === id);
    stoppingPlayer.stopDir(dir);

    stoppingPlayer.x = posObj.x;
    stoppingPlayer.y = posObj.y;
  });

  socket.on('new-coin', newCoin => {
    item = new Collectible(newCoin);
  });

  socket.on('remove-player', id => {
    currPlayers = currPlayers.filter(player => player.id !== id);
  });

  socket.on('update-player', playerObj => {
    const scoringPlayer = currPlayers.find(obj => obj.id === playerObj.id);
    scoringPlayer.score = playerObj.score;
  });

  currPlayers = players.map(val => new Player(val)).concat(mainPlayer);
  item = new Collectible(coin);

  draw();
});

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'white';
  ctx.strokeRect(canvasProps.playFieldMinX, canvasProps.playFieldMinY, canvasProps.playFieldWidth, canvasProps.playFieldHeight);

  ctx.fillStyle = 'white';
  ctx.font = `16px 'Verdana'`;
  ctx.textAlign = 'center';
  ctx.fillText('Controls: WASD', 100, 32.5);

  ctx.font = `22px 'Verdana'`;
  ctx.fillText('Coin Race', canvasProps.canvasWidth / 2, 32.5);

  currPlayers.forEach(player => {
    player.draw(ctx, item, { mainPlayerArt, otherPlayerArt }, currPlayers);
  });

  item.draw(ctx, { coinArt, manyCoinsArt, dollarArt });

  if (item.collectedBy) {
    socket.emit('destroy-item', { playerId: item.collectedBy, coinValue: item.value, coinId: item.id });
  }

  tick = requestAnimationFrame(draw);
}
