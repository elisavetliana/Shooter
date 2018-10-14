var BootState = {
	init: function(){
		//initiating cavas scaling
		Phaser.Canvas.setImageRenderingCrisp(game.canvas)
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true
	},
	preload: function(){
		//loading preload images
		this.load.image('loadingBar','assets/boot/loadingBar.png');
		this.load.image('logo','assets/boot/logo.jpg');
	},
	create: function(){
		this.state.start('PreloadState');
	}
}
