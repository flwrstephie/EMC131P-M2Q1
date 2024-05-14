import game from './game.js';

class CreditsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CreditsScene' });
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


        this.add.text(400, 300, 'Stephanie  Pearl F. Virtudazo', {
            fontSize: '32px',
            fontFamily: 'Fatpix',
            fill: '#D8D1CA',
            stroke: '#282229',
            strokeThickness: 6
        }).setOrigin(0.5);

        this.add.text(400, 350, 'EMC131P - A223', {
            fontSize: '32px',
            fontFamily: 'Fatpix',
            fill: '#D8D1CA',
            stroke: '#282229',
            strokeThickness: 6
        }).setOrigin(0.5);

        this.add.text(400, 400, '2nd Year BSEMC', {
            fontSize: '32px',
            fontFamily: 'Fatpix',
            fill: '#D8D1CA',
            stroke: '#282229',
            strokeThickness: 6
        }).setOrigin(0.5);


        const backButton = this.add.text(100, 550, 'BACK', {
            fontSize: '32px',
            fontFamily: 'Fatpix',
            fill: '#D8D1CA',
            stroke: '#282229',
            strokeThickness: 6
        }).setOrigin(0.5);

        backButton.setInteractive().on('pointerdown', () => {
            this.scene.start('MainMenuScene');
        });
    }
}

export default CreditsScene;