import game from './game.js';

class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    preload() {
        this.load.image('sky', './assets/sprites/sky.png');
        this.load.audio('theme', './assets/audio/bgm.mp3');
    }

    create() {
        this.add.image(400, 300, 'sky');

        if (!game.music) {
            game.music = this.sound.add('theme');
            game.music.play({ loop: true });
        }
        
        this.add.text(400, 100, 'GOLDFISH', {
            fontSize: '90px',
            fontFamily: 'Fatpix',
            fill: '#C99C68',
            stroke: '#96612D',
            strokeThickness: 6
        }).setOrigin(0.5);
            
        this.add.text(400, 180, 'CHASE', {
            fontSize: '90px',
            fontFamily: 'Fatpix',
            fill: '#C99C68',
            stroke: '#96612D',
            strokeThickness: 6        
        }).setOrigin(0.5);

        const playButton = this.add.text(400, 350, 'PLAY', {
            fontSize: '32px',
            fontFamily: 'Fatpix',
            fill: '#D8D1CA',
            stroke: '#282229',
            strokeThickness: 6
        }).setOrigin(0.5);

        const creditsButton = this.add.text(400, 400, 'CREDITS', {
            fontSize: '32px',
            fontFamily: 'Fatpix',
            fill: '#D8D1CA',
            stroke: '#282229',
            strokeThickness: 6
        }).setOrigin(0.5);

        const quitButton = this.add.text(400, 450, 'QUIT', {
            fontSize: '32px',
            fontFamily: 'Fatpix',
            fill: '#D8D1CA',
            stroke: '#282229',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Add event listeners to buttons
        playButton.setInteractive().on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        creditsButton.setInteractive().on('pointerdown', () => {
            this.scene.start('CreditsScene');
        });

        quitButton.setInteractive().on('pointerdown', () => {
            // Show an alert when quitting the game
            alert('Exiting the game.');
        });
    }
}

export default MainMenuScene;