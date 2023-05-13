import { ThridGameScene } from './thrid-scene';
import Phaser from 'phaser';
import './style.css';

const config: Phaser.Types.Core.GameConfig = {
    width: 800,
    height: 600,
    type: Phaser.AUTO,
    parent: 'game-container',
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: false
      }
    },
    scene: [ThridGameScene]
  };

new Phaser.Game(config);