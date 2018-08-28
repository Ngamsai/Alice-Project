ig.module( 
	'game.entities.player' 
)
.requires(
    'impact.entity',
    'game.entities.sword',
	'game.entities.coin',
	
)
.defines(function(){

EntityPlayer = ig.Entity.extend ({
    // flip: false,
    speed: 100,
    // tileSizeX: 32,
    // tileSizeY: 36,
    coin: 0,
    health: 3,

	type: ig.Entity.TYPE.A, // Player friendly group
	checkAgainst: ig.Entity.TYPE.NONE,
    collides: ig.Entity.COLLIDES.ACTIVE,
    
    // size: {x: this.tileSizeX, y: this.tileSizeY},
    size: {x: 32, y: 36},
    animSheet: new ig.AnimationSheet('media/warrior_m.png' ,32,36),

    init: function (x,y,settings) {
        this.parent(x,y,settings);

        this.addAnim( 'idle', 0.1, [7] );
        this.addAnim( 'up', 0.1, [0,1,2] ); 
        this.addAnim( 'down', 0.1, [6,7,8] ); 
        this.addAnim( 'right',0.1, [3,4,5] ); 
        this.addAnim( 'left',0.1, [9,10,11] ); 
        
        ig.game.player = this;
   
    },
    

    update: function() {
        if( ig.input.state('up') ) {
            this.vel.y = -this.speed;
            this.currentAnim = this.anims.up;

        }else if (( ig.input.state('down') )){
            this.vel.y = this.speed;
            this.currentAnim = this.anims.down;

        }else if (( ig.input.state('left') )){
            this.vel.x = -this.speed;
            this.currentAnim = this.anims.left;

        }else if (( ig.input.state('right') )){
            this.vel.x = this.speed;
            this.currentAnim = this.anims.right;

        }else{
            this.vel.x = 0;
            this.vel.y = 0;
            this.currentAnim = this.anims.idle;
        }
    
    //move
    this.parent(); 
    },
    
    kill: function() {
		this.parent();

		// Reload this level
		ig.game.reloadLevel();
	},
    // keepCoins: function( count_coin ){
    //     this.coins += count_coin;
    // },

    keepSword: function (amount){
        this.sword += amount;
    },

});

});