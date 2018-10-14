var PreloadState = {
	preload: function(){
		this.load.baseURL = 'https://XristosTafarlis.github.io/Shooter/';
		this.load.crossOrigin = 'anonymous';
		
		//ionio logo
		var logo = this.add.sprite(this.game.world.centerX, this.game.world.centerY - 32, ' ');
		logo.anchor.set(0.5, 0.5);
		logo.scale.set(0.75);

		//loading bar
		var loadingBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 64, 'loadingBar');
		loadingBar.anchor.set(0.5, 0.5);
		this.load.setPreloadSprite(loadingBar);
		
		//Sound preloads
		this.load.audio('suita', ['sounds/suita.mp3', 'sounds/suita.ogg']);
		this.load.audio('gun1', ['sounds/gun1.mp3', 'sounds/gun1.ogg']);
		
		//Image preloads
		this.load.image('starfield', 'assets/starfield.png');
		this.load.image('ship', 'assets/ship.png');
		this.load.image('bullet', 'assets/bullets/bullet.png');
		this.load.image('title', 'assets/title.png');
		this.load.image('lvl1', 'assets/levels/level1.png');
		this.load.image('lvl2', 'assets/levels/level2.png');
		this.load.image('enemy1', 'assets/enemies/enemy2.png');
		this.load.spritesheet('explosion', 'assets/explode.png', 128, 128);

	},
	create: function(){
		game.state.start('MainMenu');
	}
}