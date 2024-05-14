import MainMenuScene from './menuScene.js';
import GameScene from './gameScene.js';
import CreditsScene from './creditsScene.js';

let bgm;

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [MainMenuScene, CreditsScene, GameScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    }
};

// Initializes the Game
let game = new Phaser.Game(config);
game.bgm = bgm;

export default game;
