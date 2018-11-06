var GamePlay = {
	create: function(){
		//Sounds
		explosionSound = game.add.audio('explosionSound');
		music = game.add.audio('suita');
		gun1 = game.add.audio('gun1');

		//Start background music
		music.play('',0,0.5,true);

		game.scale.pageAlignHorizontally = true;
		
		//  The scrolling starfield background
		starfield = game.add.tileSprite(0, 0, game.width, game.height, 'starfield');

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
		player.health = 100;
		player.anchor.setTo(0.5, 0.5);
		game.physics.enable(player, Phaser.Physics.ARCADE);
		player.body.maxVelocity.setTo(MAXSPEED, MAXSPEED);
		player.body.drag.setTo(DRAG, DRAG);
		player.events.onKilled.add(function(){
			shipTrail.kill();
		});
		player.events.onRevived.add(function(){
			shipTrail.start(false, 5000, 10);
		});

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
			enemy.damageAmount = 20;
			enemy.events.onKilled.add(function(){
				enemy.trail.kill();
			});
		});

		game.time.events.add(1000, launchEnemies1);

		//Enemies 2
		enemies2 = game.add.group();
		enemies2.enableBody = true;
		enemies2.physicsBodyType = Phaser.Physics.ARCADE;
		enemies2.createMultiple(30, 'enemy2');
		enemies2.setAll('anchor.x', 0.5);
		enemies2.setAll('anchor.y', 0.5);
		enemies2.setAll('scale.x', 0.75);
		enemies2.setAll('scale.y', 0.75);
		enemies2.forEach(function(enemy){
			enemy.damageAmount = 40;
		});

		game.time.events.add(1000, launchEnemies2);

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

		//  An explosion pool
		explosions = game.add.group();
		explosions.enableBody = true;
		explosions.physicsBodyType = Phaser.Physics.ARCADE;
		explosions.createMultiple(30, 'explosion');
		explosions.setAll('anchor.x', 0.5);
		explosions.setAll('anchor.y', 0.5);
		explosions.forEach( function(explosion) {
			explosion.animations.add('explosion');
    	});

		//  Shields stat
		shields = game.add.bitmapText(game.world.width - 250, 10, 'spacefont', '' + player.health +'%', 50);
		shields.render = function () {
			shields.text = 'Shields: ' + Math.max(player.health, 0) +'%';
		};
		shields.render();

		//  Score
		scoreText = game.add.bitmapText(10, 10, 'spacefont', '', 50);
		scoreText.render = function () {
			scoreText.text = 'Score: ' + score;
		};
		scoreText.render();

		//  Game Over
		gameOver = game.add.bitmapText(game.world.centerX, game.world.centerY, 'spacefont', 'GAME OVER!', 110);
		gameOver.x = gameOver.x - gameOver.textWidth / 2;
		gameOver.y = gameOver.y - gameOver.textHeight / 3;
		gameOver.visible = false;

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
			//player.body.acceleration.x = 0;
			player.body.acceleration.x = -ACCLERATION;
		}
		if (player.x < 30) {
			player.x = 30;
			player.body.acceleration.x = ACCLERATION;
		}
		if (player.y > game.height - 15) {
			player.y = game.height - 15;
			player.body.acceleration.y = -ACCLERATION;
		}
		if (player.y < 15) {
			player.y = 15;
			player.body.acceleration.y = ACCLERATION;
		}

		//  Fire bullet
		if (player.alive && (fireButton.isDown || game.input.activePointer.isDown)) {
			fireBullet();
		}

		//  Keep the shipTrail lined up with the ship
		shipTrail.y = player.y;
		shipTrail.x = player.x - 20;

		//  Check collisions
		game.physics.arcade.overlap(player, enemies1, shipCollide, null, this);
		game.physics.arcade.overlap(enemies1, bullets, hitEnemy, null, this);

		game.physics.arcade.overlap(player, enemies2, shipCollide, null, this);
		game.physics.arcade.overlap(enemies2, bullets, hitEnemy, null, this);

		//  Game over?
		if (! player.alive && gameOver.visible === false) {
			gameOver.visible = true;
			gameOver.alpha = 0;
			var fadeInGameOver = game.add.tween(gameOver);
			fadeInGameOver.to({alpha: 1}, 1000, Phaser.Easing.Quintic.Out);
			fadeInGameOver.onComplete.add(setResetHandlers);
			fadeInGameOver.start();
			function setResetHandlers() {

				//  The restart handler
				tapRestart = game.input.onTap.addOnce(_restart,this);
				spaceRestart = fireButton.onDown.addOnce(_restart,this);
				function _restart() {
					tapRestart.detach();
					spaceRestart.detach();
					restart();
				}
			}
		}
	}
}
