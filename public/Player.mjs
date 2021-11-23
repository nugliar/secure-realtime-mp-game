import { canvasProps } from './canvasProps.mjs'

class Player {
  constructor({id, x, y, avatar, score = 0}) {
    this.x = x;
    this.y = y;
    this.w = canvasProps.playerRadius;
    this.h = canvasProps.playerRadius;
    this.score = score;
    this.id = id;
    this.avatar = avatar;
    this.dir = {
      'left': false,
      'right': false,
      'up': false,
      'down': false,
    }
  }

  draw(ctx) {
    const img = new Image();
    img.src = this.avatar;
    ctx.drawImage(img, this.x, this.y, this.w, this.h);
  }

  setDirection(dir, bool) {
    this.dir[dir] = bool;
  }

  movePlayer(dir, speed) {
    const x = this.x;
    const y = this.y;
    const limit = canvasProps.playerLimit;
    const lx = limit.x;
    const ly = limit.y;

    if (dir == 'left') this.x = x - speed;
    else if (dir == 'right') this.x = x + speed;
    else if (dir == 'down') this.y = y + speed;
    else if (dir == 'up') this.y = y - speed;

    if (this.x > lx[1] || this.x < lx[0]) this.x = x;
    if (this.y > ly[1] || this.y < ly[0]) this.y = y;
  }

  collision(item) {
    const r = canvasProps.playerRadius * 0.5;
    const pX = this.x + this.w / 2;
    const pY = this.y + this.h / 2;
    const cX = item.x + item.w / 2;
    const cY = item.y + item.h / 2;
    let intersectX = false;
    let intersectY = false;

    if (Math.abs(pX - cX) < r) {
      intersectX = true;
    }
    if (Math.abs(pY - cY) < r) {
      intersectY = true;
    }
    return intersectX && intersectY;
  }

  calculateRank(arr) {
    const sortedArr = arr.sort((a, b) => a.score - b.score);
    const rank = sortedArr.findIndex(player => player.id === this.id) + 1;

    return `Rank: ${rank}/${arr.length}`
  }
}

export default Player;
