import Phaser from 'phaser';

function getRandomXY(xMin: number, xMax: number, yMin: number = 1, yMax: number = 1) {
  const x = Phaser.Math.Between(xMin, xMax);
  const y = Phaser.Math.Between(yMin, yMax);

  return { x: x, y: y };
}

export {
  getRandomXY
}