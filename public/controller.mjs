const controller = (player, socket) => {

  const getKeyCode = (e) => {
    const x = e.keyCode;
    if (x == 37 || x == 65) return 'left';
    if (x == 39 || x == 68) return 'right';
    if (x == 40 || x == 83) return 'down';
    if (x == 38 || x == 87) return 'up';
  }

  document.addEventListener('keydown', (e) => {
    const dir = getKeyCode(e);
    if (dir) {
      player.setDirection(dir, true);
      socket.emit('movePlayer', { dir: dir, x: player.x, y: player.y })
    }
  })

  document.addEventListener('keyup', (e) => {
    const dir = getKeyCode(e);
    if (dir) {
      player.setDirection(dir, false);
      socket.emit('movePlayer', { dir: dir, x: player.x, y: player.y })
    }
  })
}

export default controller;
