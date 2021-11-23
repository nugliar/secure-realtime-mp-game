const canvasWidth = 640;
const canvasHeight = 480;

const canvasProps = {
  width: canvasWidth,
  height: canvasHeight,
  playerRadius: 30,
  collectibleRadius: 20,
  borderSize: 5,
  borderTopSize: 50,
  get playerLimit() {
    return {
      x: [
        this.borderSize,
        this.width - this.borderSize - this.playerRadius
      ],
      y: [
        this.borderTopSize,
        this.height - this.borderSize - this.playerRadius
      ]
    }
  }
};

const randomPositionOnAxis = (axis) => {
  const limit = canvasProps.playerLimit;
  const x = limit.x;
  const y = limit.y;

  if (axis == 'x') {
    return Math.floor(x[0] + Math.random() * (x[1] - x[0]));
  } else if (axis == 'y') {
    return Math.floor(y[0] + Math.random() * (y[1] - y[0]));
  }
}

export {
  canvasProps,
  randomPositionOnAxis
}
