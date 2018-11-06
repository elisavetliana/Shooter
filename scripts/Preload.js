var PreloadState = {
	preload: function(){
		this.load.baseURL = 'https://elisavetliana.github.io/Shooter/';
		this.load.crossOrigin = 'anonymous';
		
		//Loading logo
		var logo = this.add.sprite(this.game.world.centerX, this.game.world.centerY - 32, 'logo');
		logo.anchor.set(0.5, 0.5);
		logo.scale.set(0.75);

		//loading bar
		var loadingBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 64, 'loadingBar');
		loadingBar.anchor.set(0.5, 0.5);
		this.load.setPreloadSprite(loadingBar);
		
		//Sound preloads
		this.load.audio('explosionSound', ['sounds/explosion.mp3', 'sounds/explosion.ogg']);
		this.load.audio('bgm', 'sounds/bgm.mp3');
		this.load.audio('gun1', 'sounds/gun1.mp3',);
		
		//Image preloads
		this.load.image('starfield', 'assets/starfield2.png');
		this.load.image('ship', 'assets/ship1.png');
		this.load.image('bullet', 'assets/bullets/bullet.png');
		this.load.image('title', 'assets/title.png');
		this.load.image('lvl1', 'assets/levels/level1.png');
		this.load.image('lvl2', 'assets/levels/level2.png');
		this.load.image('enemy1', 'assets/enemies/newEnemy.png');
		this.load.image('enemy2', 'assets/enemies/enemy3.png');
		this.load.spritesheet('explosion', 'assets/explode.png', 128, 128);
		this.load.bitmapFont('spacefont', 'assets/spacefont/spacefont.png', 'assets/spacefont/spacefont.xml');

	},
	create: function(){
		game.state.start('MainMenu');
	}
}
