const canvasWidth = 640;
const canvasHeight = 480;
const playerWidth = 30;
const playerHeight = 30;
const border = 5;
const infoBar = 45;


const canvasProps = {
  canvasWidth: canvasWidth,
  canvasHeight: canvasHeight,
  limitMinX: (canvasWidth / 2) - (canvasWidth - 10) / 2,
  limitMinY: (canvasHeight / 2) - (canvasHeight - 100) / 2,
  playFieldWidth: canvasWidth - (border * 2),
  playFieldHeight: (canvasHeight - infoBar) - (border * 2),
  limitMaxX: (canvasWidth - playerWidth) - border,
  limitMaxY: (canvasHeight - playerHeight) - border,
  playerArtSize: 40,
  collectibleArtSize: 30
}

const getRandomPosition = (min, max, multiple) => {
  return Math.floor(Math.random() * ((max - min) / multiple)) * multiple + min;
};

export {
  getRandomPosition,
  canvasProps
}
