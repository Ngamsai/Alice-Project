ig.module(
	'game.entities.alice'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntityAlice = ig.Entity.extend({
	size: {x: 40, y: 28},
	offset: {x: 24, y: 0},
	// maxVel: {x: 100, y: 100},
	friction: {x: 150, y: 0},
	
	type: ig.Entity.TYPE.B, // Evil enemy group
	checkAgainst: ig.Entity.TYPE.A, // Check against friendly
	collides: ig.Entity.COLLIDES.NONE,
	
	health: 1,
	
	
	// speed: 36,
	// flip: false,
	
	animSheet: new ig.AnimationSheet( 'media/warrior_f.png',32,36 ),
	
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.addAnim( 'idle', 1 , [7]);
		
	},
	
	
	update: function() {
		// Near an edge? return!
		// if( !ig.game.collisionMap.getTile(
		// 		this.pos.x + (this.flip ? +4 : this.size.x -4),
		// 		this.pos.y + this.size.y+1
		// 	)
		// ) {
		// 	this.flip = !this.flip;
			
		// 	// We have to move the offset.x around a bit when going
		// 	// in reverse direction, otherwise the blob's hitbox will
		// 	// be at the tail end.
		// 	this.offset.x = this.flip ? 0 : 24;
		// }
		
		// var xdir = this.flip ? -1 : 1;
		// this.vel.x = this.speed * xdir;
		// this.currentAnim.flip.x = !this.flip;
		
		// this.parent();
	},
	
	kill: function() {
		
		this.parent();
		
		// ig.game.reloadLevel();
	},
	
	// handleMovementTrace: function( res ) {
	// 	this.parent( res );
		
	// 	// Collision with a wall? return!
	// 	if( res.collision.x ) {
	// 		this.flip = !this.flip;
	// 		this.offset.x = this.flip ? 0 : 24;
	// 	}
	// },
	
	check: function( other ) {
		// other.receiveDamage( 1, this );
		ig.game.healthPotion();
		// ig.game.reloadLevel();
	}
});

});