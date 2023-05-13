import Phaser from 'phaser';

/**
 * FirstGameScene is an example Phaser Scene
 * @class
 * @constructor
 * @public
 */
export class ThridGameScene extends Phaser.Scene {

  private score!: number;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private stars!: Phaser.Physics.Arcade.Group;
  private bombs!: Phaser.Physics.Arcade.Group;
  private scoreText!: Phaser.GameObjects.Text;
  private fpsText!: Phaser.GameObjects.Text;



  private snake!: Phaser.Physics.Arcade.Image;
  private speed = 300;
  private apples!: Phaser.Physics.Arcade.Group;

  private snakeBody!: Phaser.Physics.Arcade.Group;
  private enemy!: Phaser.Physics.Arcade.Group;

  constructor() {
    super('ThridGameScene');
    console.log('FirstGameScene.constructor()');
  }

  preload() {
    console.log('FirstGameScene.preload');
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.audio('mainSound', 'assets/mainLoop.wav');
  }

  create() {
    this.score = 0;
    
    this.add.image(400, 300, 'sky');
    this.initScoreText();
    
    const sound = this.sound.add('mainSound');
    sound.play();

    this.fpsText = this.add.text(720, 10, '', { font: '16px Arial' });
    this.add.text(20, 580, 'Lider: GÜni Score: 1050', { font: '16px Arial' });
    // // Spawn enemies every 2 seconds
    this.time.addEvent({
      delay: 2000,
      loop: true,
      callback: this.addEnemy,
      callbackScope: this
    });

    this.time.addEvent({
      delay: 10000,
      loop: true,
      callback: this.spawnStart,
      callbackScope: this
    });

    this.bombs = this.physics.add.group();
    this.physics.add.overlap(this.bombs, this.bombs, this.destroyBomb, undefined, this);

    // Input Events
    this.cursors = this.input.keyboard.createCursorKeys();

    // Set Apples
    this.apples = this.physics.add.group();

    // Set Snakebody
    this.snakeBody = this.physics.add.group();
    this.enemy = this.physics.add.group();
    this.stars = this.physics.add.group();

    // Set the PLAYER
    this.initPlayer();
    this.spawnApple();

    this.physics.add.overlap(this.snake, this.apples, this.collectApple as any, undefined, this);

    this.physics.add.overlap(this.snake, this.enemy, () => {
      this.gameOverFunc();
    }, undefined, this);

    this.physics.add.overlap(this.snakeBody, this.enemy, (bodyPart) => {
      this.gameOverFunc();
    }, undefined, this);

    this.physics.add.overlap(this.snake, this.stars, this.useStar, undefined, this);

    // this.physics.add.overlap(this.player, this.stars, this.collectStar, undefined, this);
  }

  update() {
    this.fpsText.setText('FPS: ' + Math.round(this.game.loop.actualFps));

    this.playerMovement();
    this.updateSnakeBody();
  }

  initPlayer() {
    this.snake = this.physics.add.image(400, 300, 'bomb');
    this.physics.add.existing(this.snake);
    this.snake.setCollideWorldBounds(true);
    this.snake.setScale(1.4);
    this.snake.setZ(2);
  }

  playerMovement() {
    if (this.cursors.left.isDown) {
      this.snake.setVelocity(-this.speed, 0);
    }
    else if (this.cursors.right.isDown) {
      this.snake.setVelocity(this.speed, 0);
    }
    else if (this.cursors.up.isDown) {
      this.snake.setVelocity(0, -this.speed);
    }
    else if (this.cursors.down.isDown) {
      this.snake.setVelocity(0, this.speed);
    }
  }

  spawnApple() {
    const x = Phaser.Math.Between(0, 800);
    const y = Phaser.Math.Between(0, 600);

    const apple = this.apples.create(x, y, 'bomb');
    apple.setTint(0xff0000);
  }

  collectApple(_snake: Phaser.Physics.Arcade.Image, apple: Phaser.Physics.Arcade.Image) {
    apple.destroy();
    this.spawnApple();
    this.addScore(10);

    this.addBodyPart();
    this.addBodyPart();
    this.addBodyPart();
  }

  addBodyPart() {
    
    const firstBodyElement: any = this.snakeBody.getChildren()[0];
    
    const spawnX = this.snakeBody.getChildren().length > 0 ? firstBodyElement.x : this.snake.x;
    const spawnY = this.snakeBody.getChildren().length > 0 ? firstBodyElement.y : this.snake.y;

    const bodyPart = this.snakeBody.create(spawnX, spawnY, 'bomb');
    bodyPart.setZ(1);

    // Adjust the position of the new body part based on the previous body part
    if (this.snakeBody.getChildren().length > 1) {
      const previousBodyPart: any = this.snakeBody.getChildren()[1];
      bodyPart.x = previousBodyPart.x;
      bodyPart.y = previousBodyPart.y;
    } else {
      bodyPart.x = this.snake.x;
      bodyPart.y = this.snake.y;
    }
  }

  updateSnakeBody() {

    for (let i = this.snakeBody.getChildren().length - 1; i > 0; i--) {
      const snakePartLast: any = this.snakeBody.getChildren()[i];
      const snakePartNext: any = this.snakeBody.getChildren()[i - 1];

      snakePartLast.x = snakePartNext.x;
      snakePartLast.y = snakePartNext.y;
    }

    if (this.snakeBody.getChildren().length) {
      const firstElem: any = this.snakeBody.getChildren()[0];  

      firstElem.x = this.snake.x;
      firstElem.y = this.snake.y;
    }
  }

  addEnemy() {

    const x = Phaser.Math.Between(20, 780);
    const y = Phaser.Math.Between(20, 50);

    const enemy1 = this.enemy.create(x, y, 'dude');
    enemy1.setVelocityY(20);
  }

  gameOverFunc() {
    // Display a game over message or screen
    this.add.text(400, 300, 'Game Over', { fontSize: '32px', }).setOrigin(0.5);
    this.add.text(400, 350, 'Score: ' + this.score, { fontSize: '32px', }).setOrigin(0.5);
    this.game.destroy(false, true);
  }

  spawnStart() {
    const x = Phaser.Math.Between(0, 800);
    const y = Phaser.Math.Between(0, 600);

    this.stars.create(x, y, 'star');
  }

  useStar(_snake: any, _star: any) {
    this.enemy.getChildren().forEach(child => {
      child.destroy();
      this.addScore(10);
    });
    
    _star.destroy();
  }

  initScoreText() {
    //  The score
    this.scoreText = this.add.text(16, 16, 'score: 0');
    this.scoreText.style.fontSize = '32px';
    this.scoreText.style.setFill('#000');
  }

  addScore(amount: number) {
    this.score += amount;
    this.scoreText.setText('Score: ' + this.score);
  }

}
