ig.module(
	'game.entities.sword'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntitySword = ig.Entity.extend({
	size: {x: 24, y: 24},
	
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.A, // Check against friendly
	collides: ig.Entity.COLLIDES.PASSIVE,
	
	animSheet: new ig.AnimationSheet( 'media/Swords.png',24, 24 ),
	
	
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.addAnim( 'idle', 1, [3] );
	},
	
	
	update: function() {		
		// Do nothing in this update function; don't even call this.parent().
		// The coin just sits there, isn't affected by gravity and doesn't move.

		// We still have to update the animation, though. This is normally done
		// in the .parent() update:
		this.currentAnim.update();
	},

	check: function( other ) {
	// 	// The instanceof should always be true, since the player is
	// 	// the only entity with TYPE.A - and we only check against A.
		if( other instanceof EntityPlayer ) {
			// other.keepCoins(1);
			this.kill();
		}
	},
	kill: function(){
		ig.game.increaseScore(100);
		this.parent();
	}

});

});