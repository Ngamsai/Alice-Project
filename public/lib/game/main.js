ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	// 'impact.debug.debug',

	'game.entities.player',
	'game.entities.alice',
	'game.entities.sword',
	'game.entities.coin',
	// 'game.entities.textballoon',

	'game.levels.state',
	'game.levels.start',
	// 'game.levels.main',
)
.defines(function(){

GameInfo = new function(){
	this.coins = 0;
	this.score = 0;
	this.health = 3;
}

MyGame = ig.Game.extend({
	
	// Load a font
	font: new ig.Font( 'media/fredoka-one.font.png' ),

	init: function() {
		// Initialize your game here; bind keys etc.
		// ig.input.bind ( ig.KEY.UP_ARROW , 'up');
		// ig.input.bind ( ig.KEY.DOWN_ARROW  , 'down');
		// ig.input.bind ( ig.KEY.RIGHT_ARROW , 'right');
		// ig.input.bind ( ig.KEY.LEFT_ARROW  , 'left');

		// this.backgroundImage = new ig.Image( 'media/bg.jpg' );

		this.loadLevel (LevelState);
	},
	
	reloadLevel: function() {
		this.loadLevelDeferred( this.currentLevel );
	},
	
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();
		
		// Add your own, additional update code here
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		
		this.font.draw( 'SCORE: ' + GameInfo.score , 10 , 20 , ig.Font.ALIGN.LEFT);
		this.font.draw( ', HEALTH: ' + GameInfo.health , 230, 20 , ig.Font.ALIGN.LEFT);
		// Add your own drawing code here
		// var x = ig.system.width/2,
		// 	y = ig.system.height/2;
		
		// this.font.draw( 'It Works!', x, y, ig.Font.ALIGN.CENTER );
	},

	addCoin: function(){
		GameInfo.coins += 1; //add a coin to the money
	},
	
	healthPotion: function(){
		GameInfo.health = GameInfo.health - 1;
	},

	increaseScore: function(points){
	  GameInfo.score +=points;
	},

});

MyTitle = ig.Game.extend({
	// clearColor: "#d0f4f7",
	// Load a font
	font: new ig.Font( 'media/fredoka-one.font.png' ),

	init: function() {
		// Initialize your game here; bind keys etc.
		ig.input.bind ( ig.KEY.UP_ARROW , 'up');
		ig.input.bind ( ig.KEY.DOWN_ARROW  , 'down');
		ig.input.bind ( ig.KEY.RIGHT_ARROW , 'right');
		ig.input.bind ( ig.KEY.LEFT_ARROW  , 'left');
		ig.input.bind( ig.KEY.SPACE, 'go' );

		// this.backgroundImage = new ig.Image( 'media/bg.jpg' );
		
		this.loadLevel (LevelStart);
	},

	update: function() {
		// Check for buttons; start the game if pressed
		if( ig.input.pressed('go') ) {
			ig.system.setGame( MyGame );
			return;
		}
		
		this.parent();
	},
	
	draw: function() {
		this.parent();
		// var cx = ig.system.width/2;
		// this.title.draw( cx - this.title.width/2, 60 );
		
		// var startText = ig.ua.mobile
		// 	? 'Press Button to Play!'
		// 	: 'Press SPACE to Play!';
		
		this.font.draw( 'Press SPACE to Play!', 500, 550 , ig.Font.ALIGN.CENTER);

	},

});

var scale = (window.innerWidth < 640) ? 2 : 1;


// We want to run the game in "fullscreen", so let's use the window's size
// directly as the canvas' style size.


var canvas = document.getElementById('canvas');
canvas.style.width = window.innerWidth + 'px';
canvas.style.height = window.innerHeight + 'px';


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
// ig.main( '#canvas', MyGame, 60, 320, 240, 2 );
// ig.main( '#canvas', MyGame,60, 1500 ,900, 1  );

var width = window.innerWidth * scale,
	height = window.innerHeight * scale;
ig.main( '#canvas', MyTitle, 60, width, height, 1, ig.ImpactSplashLoader );


});
