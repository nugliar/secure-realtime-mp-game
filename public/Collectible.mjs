import { canvasProps } from './canvasProps.mjs';

class Collectible {
  constructor({x, y, value, id, avatar}) {
    this.x = x;
    this.y = y;
    this.w = canvasProps.avatarWidth;
    this.h = canvasProps.avatarHeight;
    this.value = value;
    this.id = id;
    this.avatar = avatar;
  }
  draw(ctx) {
    const img = new Image();
    img.src = this.avatar;
    ctx.drawImage(img, this.x, this.y, this.w, this.h);
  }
}

/*
  Note: Attempt to export this for use
  in server.js
*/
try {
  module.exports = Collectible;
} catch(e) {}

export default Collectible;
