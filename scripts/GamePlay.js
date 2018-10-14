var GamePlay = {
	create: function(){
		//Sounds
		music = game.add.audio('suita');
		gun1 = game.add.audio('gun1');

		//Start background music
		music.play('',0,0.5,true);

		game.scale.pageAlignHorizontally = true;
		
		//  The scrolling starfield background
		starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');

		//  Our bullet group
		bullets = game.add.group();
		bullets.enableBody = true;
		bullets.physicsBodyType = Phaser.Physics.ARCADE;
		bullets.createMultiple(30, 'bullet');
		bullets.setAll('anchor.x', 0.5);
		bullets.setAll('anchor.y', 1);
		bullets.setAll('outOfBoundsKill', true);
		bullets.setAll('checkWorldBounds', true);

		//  The hero!
		player = game.add.sprite(100, game.height / 2, 'ship');
		player.anchor.setTo(0.5, 0.5);
		game.physics.enable(player, Phaser.Physics.ARCADE);
		player.body.maxVelocity.setTo(MAXSPEED, MAXSPEED);
		player.body.drag.setTo(DRAG, DRAG);

		//Enemies 1
		enemies1 = game.add.group();
		enemies1.enableBody = true;
		enemies1.physicsBodyType = Phaser.Physics.ARCADE;
		enemies1.createMultiple(5, 'enemy1');
		enemies1.setAll('anchor.x', 0.5);
		enemies1.setAll('anchor.y', 0.5);
		enemies1.setAll('scale.x', 0.75);
		enemies1.setAll('scale.y', 0.75);
		enemies1.forEach(function(enemy){
			addEnemyEmitterTrail(enemy);
			enemy.events.onKilled.add(function(){
				enemy.trail.kill();
			});
		});

		launchEnemies1();

		//  And some controls to play the game with
		cursors = game.input.keyboard.createCursorKeys();
		fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		//  Add an emitter for the ship's trail
		shipTrail = game.add.emitter(player.x - 20, player.y, 400);
		shipTrail.height = 10;
		shipTrail.makeParticles('bullet');
		shipTrail.setYSpeed(20, -20);
		shipTrail.setXSpeed(-140, -120);
		shipTrail.setRotation(50, -50);
		shipTrail.setAlpha(1, 0.01, 800);
		shipTrail.setScale(0.05, 0.4, 0.05, 0.4, 2000, Phaser.Easing.Quintic.Out);
		shipTrail.start(false, 5000, 10);
	},

	update: function() {

		//  Scroll the background
		starfield.tilePosition.x -= 2;

		//  Reset the player, then check for movement keys
		player.body.acceleration.y = 0;
		player.body.acceleration.x = 0;

		if (cursors.up.isDown) {
			player.body.acceleration.y = -ACCLERATION;
			if (cursors.left.isDown) {
				player.body.acceleration.x = -ACCLERATION;
				player.body.acceleration.y = -ACCLERATION;
			} else if (cursors.right.isDown) {
				player.body.acceleration.x = ACCLERATION;
				player.body.acceleration.y = -ACCLERATION;
			}

		} else if (cursors.down.isDown) {
			player.body.acceleration.y = ACCLERATION;
			if (cursors.left.isDown) {
				player.body.acceleration.x = -ACCLERATION;
				player.body.acceleration.y = ACCLERATION;
			} else if (cursors.right.isDown) {
				player.body.acceleration.x = ACCLERATION;
				player.body.acceleration.y = ACCLERATION;
			}
		
		} else if (cursors.left.isDown) {
			player.body.acceleration.x = -ACCLERATION;
			if (cursors.right.isDown) {
				player.body.acceleration.x = 0;
			}
		} else if (cursors.right.isDown) {
			player.body.acceleration.x = ACCLERATION;
			if (cursors.left.isDown) {
				player.body.acceleration.x = 0;
			}
		}

		//  Stop at screen edges
		if (player.x > game.width - 30) {
			player.x = game.width - 30;
			player.body.acceleration.x = 0;
		}
		if (player.x < 30) {
			player.x = 30;
			player.body.acceleration.x = 0;
		}
		if (player.y > game.height - 15) {
			player.y = game.height - 15;
			player.body.acceleration.y = 0;
		}
		if (player.y < 15) {
			player.y = 15;
			player.body.acceleration.y = 0;
		}

		//  Fire bullet
		if (player.alive && fireButton.isDown) {
			fireBullet();
		}

		//  Keep the shipTrail lined up with the ship
		shipTrail.y = player.y;
		shipTrail.x = player.x - 20;

	}
}