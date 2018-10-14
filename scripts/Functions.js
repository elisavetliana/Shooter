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
		enemy.reset( 800, game.rnd.integerInRange ( 20, 580));
		enemy.body.velocity.y = game.rnd.integerInRange(-200, 200);
		enemy.body.velocity.x = -300;
		enemy.body.drag.y = 100;

		enemy.trail.start(false, 800, 1);

		enemy.update = function(){
			enemy.angle = 270 - game.math.radToDeg(Math.atan2(enemy.body.velocity.x, enemy.body.velocity.y));

			enemy.trail.x = enemy.x;
			enemy.trail.y = enemy.y -10;

			//  Kill enemies once they go off screen
			if (enemy.x > game.height - 200) {
			enemy.kill();
        }
	}

	//  Send another enemy soon
	game.time.events.add(game.rnd.integerInRange(300, 3000), launchEnemies1);
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
