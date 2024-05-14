import game from './game.js';

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.playerColors = ['0xffadad', '0xffd6a5', '0xfdffb6', '0xcaffbf', '0x9bf6ff', '0xa0c4ff', '0xbdb2ff'];
    }

    preload() {
        // Assets by Stephanie Virtudazo
        this.load.image('sky', './assets/sprites/sky.png');
        this.load.image('ground', './assets/sprites/ground.png');
        this.load.image('platform1', './assets/sprites/platform1.png');
        this.load.image('platform2', './assets/sprites/platform2.png');
        this.load.image('fish', './assets/sprites/fish.png');
        this.load.image('bomb', './assets/sprites/bomb.png');
        this.load.spritesheet('cat', './assets/sprites/CookieCat.png', { frameWidth: 48, frameHeight: 39 });

        this.load.audio('theme', './assets/audio/bgm.mp3');
        this.load.audio('collectFish', 'assets/audio/fishSFX.mp3');
    }

    create() {
        // Background music
        if (!game.music) {
            game.music = this.sound.add('theme');
            game.music.play({ loop: true });
        }

        // Initialize game state variables
        this.score = 0;
        this.gameOver = false;
        this.playerSizeMultiplier = 1;
        this.playerColorIndex = 0;

        // Add background image
        this.add.image(400, 300, 'sky');

        // Add platforms
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 572, 'ground').refreshBody();
        this.platforms.create(600, 400, 'platform1');
        this.platforms.create(120, 250, 'platform2');
        this.platforms.create(700, 220, 'platform2');

        // Add player
        this.player = this.physics.add.sprite(100, 450, 'cat');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        // Add sound
        this.collectSound = this.sound.add('collectFish');
        
        // Add input keys
        this.cursors = this.input.keyboard.createCursorKeys();

        // Player Movement
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('cat', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'cat', frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('cat', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        // Score text
        this.scoreText = this.add.text(510, 20, 'Fishies Collected: 0', { 
            fontFamily: 'FatPix',
            fontSize: '25px',
            fill: '#282229' });
        this.scoreText.setDepth(1);

        // Add fishies
        this.fishies = this.physics.add.group();
        for (let i = 0; i < 5; i++) {
            let x = Phaser.Math.Between(0, 800);
            let y = Phaser.Math.Between(0, 500);
            let fish = this.fishies.create(x, y, 'fish');
            fish.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        }

        this.fishies.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        // Collisions
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.fishies, this.platforms);

        // Overlaps
        this.physics.add.overlap(this.player, this.fishies, this.collectFishies, null, this);

        // Bombs
        this.bombs = this.physics.add.group();
        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
    }

    update() {
        if (!this.gameOver) { // Check if game is not over
            if (this.cursors.left.isDown) {
                this.player.setVelocityX(-160);
                this.player.anims.play('left', true);
            } else if (this.cursors.right.isDown) {
                this.player.setVelocityX(160);
                this.player.anims.play('right', true);
            } else {
                this.player.setVelocityX(0);
                this.player.anims.play('turn');
            }

            if (this.cursors.up.isDown && this.player.body.touching.down) {
                this.player.setVelocityY(-330);
            }
        }
    }

    collectFishies(player, fish) {
        fish.disableBody(true, true);
        this.score += 1;
        this.scoreText.setText('Fishies Collected: ' + this.score);

        // Change player color
        this.player.setTint(this.playerColors[this.playerColorIndex]);
        this.playerColorIndex = (this.playerColorIndex + 1) % this.playerColors.length;

        // Increase player size every 5 fishies
        if (this.score % 5 === 0) {
            this.playerSizeMultiplier += 0.1;
            this.player.setScale(this.playerSizeMultiplier);
        }

        var x = Phaser.Math.Between(0, 800);
        var y = Phaser.Math.Between(0, 200);
        this.fishies.create(x, y, 'fish');

        // Check if 5 fishies have been collected
        if (this.score % 5 === 0) {
            this.spawnBomb();
        }

        this.collectSound.play();
    }

    spawnBomb() {
        var x = Phaser.Math.Between(0, 800);
        var y = 16;
        var bomb = this.bombs.create(x, y, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }

    hitBomb(player, bomb) {
        this.physics.pause();
        this.player.setTint(0xff0000);
        this.player.anims.play('turn');
        this.gameOver = true;

        this.player.setVisible(false);

        // Display game over message
        var gameOverText = this.add.text(400, 300, 'Game Over', { 
            fontFamily: 'FatPix',
            fill: '#C99C68',
            stroke: '#96612D',
            fontSize: '100px',
            strokeThickness: 6 
        });
        gameOverText.setOrigin(0.5);

        // Game Over
        const homeButton = this.add.text(300, 400, 'MAIN MENU', {
            fontSize: '32px',
            fontFamily: 'FatPix',
            fill: '#D8D1CA',
            stroke: '#282229',
            strokeThickness: 6
        }).setOrigin(0.5);

        const retryButton = this.add.text(500, 400, 'RETRY', {
            fontSize: '32px',
            fontFamily: 'FatPix',
            fill: '#D8D1CA',
            stroke: '#282229',
            strokeThickness: 6
        }).setOrigin(0.5);
        
        homeButton.setInteractive().on('pointerdown', () => {
            this.scene.start('MainMenuScene');
        });

        retryButton.setInteractive().on('pointerdown', () => {
            this.resetGame();
        });
    }

    resetGame() {
        this.scene.restart();
    }
}

export default GameScene;
