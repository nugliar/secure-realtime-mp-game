import { canvasProps } from './canvasProps.mjs';

class Collectible {
  constructor({ x = 10, y = 10, value = 1, id }) {
    this.x = x;
    this.y = y;
    this.w = canvasProps.collectibleArtSize;
    this.h = canvasProps.collectibleArtSize;
    this.value = value;
    this.id = id;
  }

  draw(context, imgObj) {
    if (this.value === 1) {
      context.drawImage(imgObj.coinArt, this.x, this.y, this.w, this.h);
    } else if (this.value === 2) {
      context.drawImage(imgObj.manyCoinsArt, this.x, this.y, this.w, this.h);
    } else {
      context.drawImage(imgObj.dollarArt, this.x, this.y, this.w, this.h);
    }
  }
}

export default Collectible;
