import game from './game.js';

// Variables
let player, platforms, cursors, scoreText, bombs, fishies, playerSizeMultiplier = 1, playerColorIndex = 0;
let playerColors = ['0xffadad', '0xffd6a5', '0xfdffb6', '0xcaffbf', '0x9bf6ff', '0xa0c4ff', '0xbdb2ff'];
let score = 0;
let gameOver = false;

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
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

        // Add background image
        this.add.image(400, 300, 'sky');

        // Add platforms
        platforms = this.physics.add.staticGroup();
        platforms.create(400, 572, 'ground').refreshBody();
        platforms.create(600, 400, 'platform1');
        platforms.create(120, 250, 'platform2');
        platforms.create(700, 220, 'platform2');

        // Add player
        player = this.physics.add.sprite(100, 450, 'cat');
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        // Add sound
        this.collectSound = this.sound.add('collectFish');
        
        // Add input keys
        cursors = this.input.keyboard.createCursorKeys();

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
        scoreText = this.add.text(510, 20, 'Fishies Collected: 0', { 
            fontFamily: 'FatPix',
            fontSize: '25px',
            fill: '#282229' });
        scoreText.setDepth(1);

        // Add fishies
        fishies = this.physics.add.group();
        for (let i = 0; i < 5; i++) {
            let x = Phaser.Math.Between(0, 800);
            let y = Phaser.Math.Between(0, 500);
            let fish = fishies.create(x, y, 'fish');
            fish.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        }

        fishies.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        // Collisions
        this.physics.add.collider(player, platforms);
        this.physics.add.collider(fishies, platforms);

        // Overlaps
        this.physics.add.overlap(player, fishies, this.collectFishies, null, this);

        // Bombs
        bombs = this.physics.add.group();
        this.physics.add.collider(bombs, platforms);
        this.physics.add.collider(player, bombs, this.hitBomb, null, this);
    }

    update() {
        if (!gameOver) { // Check if game is not over
            if (cursors.left.isDown) {
                player.setVelocityX(-160);
                player.anims.play('left', true);
            } else if (cursors.right.isDown) {
                player.setVelocityX(160);
                player.anims.play('right', true);
            } else {
                player.setVelocityX(0);
                player.anims.play('turn');
            }

            if (cursors.up.isDown && player.body.touching.down) {
                player.setVelocityY(-330);
            }
        }
    }

    collectFishies(player, fish) {
        fish.disableBody(true, true);
        score += 1;
        scoreText.setText('Fishies Collected: ' + score);

        // Change player color
        player.setTint(playerColors[playerColorIndex]);
        playerColorIndex = (playerColorIndex + 1) % playerColors.length;

        // Increase player size every 5 fishies
        if (score % 5 === 0) {
            playerSizeMultiplier += 0.1;
            player.setScale(playerSizeMultiplier);
        }

        var x = Phaser.Math.Between(0, 800);
        var y = Phaser.Math.Between(0, 200);
        fishies.create(x, y, 'fish');

        // Check if 5 fishies have been collected
        if (score % 5 === 0) {
            this.spawnBomb();
        }

        this.collectSound.play();
    }

    spawnBomb() {
        var x = Phaser.Math.Between(0, 800);
        var y = 16;
        var bomb = bombs.create(x, y, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }

    hitBomb(player, bomb) {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
        gameOver = true;

        player.setVisible(false);

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
        score = 0;
        gameOver = false;
        playerSizeMultiplier = 1;
        playerColorIndex = 0;

        // Restart the scene
        this.scene.restart();
    }
}

export default GameScene;
