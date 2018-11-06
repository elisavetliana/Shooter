function fireBullet() {
	//  To avoid them being allowed to fire too fast we set a time limit
	if (game.time.now > bulletTimer) {
		var BULLET_SPEED = 400;
		var BULLET_SPACING = 250;
		//  Grab the first bullet we can from the pool
		var bullet = bullets.getFirstExists(false);

		if (bullet) {
			//  And fire it
			//  Make bullet come out of tip of ship with right angle
			var bulletOffset = 20 * Math.sin(game.math.degToRad(player.angle));
			bullet.reset(player.x + bulletOffset, player.y);
			bullet.angle = player.angle;
			game.physics.arcade.velocityFromAngle(bullet.angle, BULLET_SPEED, bullet.body.velocity);
			bullet.body.velocity.y += player.body.velocity.y;
			//Lazer sound
			gun1.play('',0,1,false);

			bulletTimer = game.time.now + BULLET_SPACING;
		}
	}
}

function launchEnemies1() {
	var enemy = enemies1.getFirstExists(false);
	if (enemy) {
		enemy.reset( game.width, game.rnd.integerInRange ( 20, 580));
		enemy.body.velocity.y = game.rnd.integerInRange(-200, 200);
		enemy.body.velocity.x = -300;
		enemy.body.drag.y = 100;

		enemy.trail.start(false, 800, 1);

		enemy.update = function(){
			enemy.angle = 270 - game.math.radToDeg(Math.atan2(enemy.body.velocity.x, enemy.body.velocity.y));

			enemy.trail.x = enemy.x;
			enemy.trail.y = enemy.y;

			//Kill enemies off screen
			if (enemy.x < -200)
				enemy.kill();
        }
	}

	//  Send another enemy soon
	Enemy1Timer = game.time.events.add(game.rnd.integerInRange(300, 3000), launchEnemies1);
}

function launchEnemies2() {
	var startingY = game.rnd.integerInRange(100, game.height - 100);
	var horizontalSpeed = -180;
	var spread = 60;
	var frequency = 70;
	var horizontalSpacing = 70;
	var numEnemiesInWave = 5;
	var timeBetweenWaves = 7000;

	//  Launch wave
	for (var i = 0; i < numEnemiesInWave; i++) {
		var enemy = enemies2.getFirstExists(false);
		if (enemy) {
			enemy.startingY = startingY;
			enemy.reset(1000 + horizontalSpacing * i, game.height / 2);
			enemy.body.velocity.x = horizontalSpeed;

			//  Update function for each enemy
			enemy.update = function(){

				//  Wave movement
				this.body.y = this.startingY + Math.sin((this.x) / frequency) * spread;
				
				//  Squish and rotate ship for illusion of "banking"
				bank = Math.cos((this.x + 60) / frequency)
				this.scale.y = 0.5 - Math.abs(bank) / 8;
				this.angle = 180 - bank * 2;
				
				//  Kill enemies once they go off screen
				if (this.x < -200) {
					this.kill();
				}
			};
		}
	}

	//  Send another wave soon
	Enemy2Timer = game.time.events.add(timeBetweenWaves, launchEnemies2);
}

function addEnemyEmitterTrail(enemy) {
	var enemyTrail = game.add.emitter(enemy.x, player.y - 10, 100);
	enemyTrail.width = 10;
	enemyTrail.makeParticles('explosion', [1,2,3,4,5]);
	enemyTrail.setXSpeed(20, -20);
	enemyTrail.setRotation(50,-50);
	enemyTrail.setAlpha(0.4, 0, 800);
	enemyTrail.setScale(0.01, 0.1, 0.01, 0.1, 1000, Phaser.Easing.Quintic.Out);
	enemy.trail = enemyTrail;
}

function shipCollide(player, enemy) {
	var explosion = explosions.getFirstExists(false);
	explosion.reset(enemy.body.x + enemy.body.halfWidth, enemy.body.y + enemy.body.halfHeight);
	explosion.body.velocity.y = enemy.body.velocity.y;
	explosion.alpha = 0.7;
	explosion.play('explosion', 30, false, true);
	explosionSound.play('',0,0.5,false);
	enemy.kill();

	player.damage(enemy.damageAmount);
	shields.render();
}

function hitEnemy(enemy, bullet) {
	var explosion = explosions.getFirstExists(false);
	explosion.reset(bullet.body.x + bullet.body.halfWidth, bullet.body.y + bullet.body.halfHeight);
	explosion.body.velocity.y = enemy.body.velocity.y;
	explosion.alpha = 0.7;
	explosion.play('explosion', 30, false, true);
	explosionSound.play('',0,0.5,false);
	enemy.kill();
	bullet.kill()

	// Increase score
	score += enemy.damageAmount * 10;
	scoreText.render()
}

function restart () {
	//  Reset the enemies
	enemies1.callAll('kill');
	game.time.events.remove(Enemy1Timer);
	game.time.events.add(1000, launchEnemies1);

	enemies2.callAll('kill');
    game.time.events.remove(Enemy2Timer);
    game.time.events.add(7000, launchEnemies2);

	//  Revive the player
	player.revive();
	player.health = 100;
	shields.render();
	score = 0;
	scoreText.render();

	//  Hide the text
	gameOver.visible = false;
}
