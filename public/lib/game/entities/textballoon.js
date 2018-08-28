ig.module(
	'game.entities.textballoon'
)
.requires(
	'impact.entity',
	'impact.game'
)
.defines(function(){
	EntityTextBalloon = ig.Entity.extend({
		pos:{x:0,y:0},
		size:{x:100,y:50},
		lifeTime:200,
		font: new ig.Font('media/04b03.font.png'),
		animSheet: new ig.AnimationSheet('media/dialog.jpg',100,50),
		wrapper : null,
		init: function (x,y,settings){
			this.zIndex = 1000;
			this.addAnim ('idle' , 1 , [0]);
			this.currentAnim = this.anims.idle;
			this.parent(x,y,settings);
			this.wrapper = new WordWrap('Happy THREE friends!!!',20)
		},
		update: function (){
			this.lifeTime = this.lifeTime -1;
			if(this.lifeTime < 0){
				this.kill();
			}
			this.parent();
		},
		draw: function (){
			this.parent();
			var x = this.pos.x - ig.game.screen.x + 5;
			var y = this.pos.y - ig.game.screen.y + 5;
			this.font.draw(this.wrapper.wrap(),x,y,ig.Font.ALIGN.LEFT);
		}
		 
	});
	WordWrap = ig.Class.extend({
		text = "",
		maxWidth: 100,
		cut: false,
		init: function (text,maxWidth,cut){
			this.text = text;
			this.maxWidth = maxWidth;
			this.cut = cut;
		},
		
		wrap: function (){
			var regex = '.{1,' + this.maxWidth + '}(\\s|$)' + (this.cut ? '|. {' + this.maxWidth
			+ '}|.+$' : '|\\S+?(\\s|$)');
			return this.text.match ( RegExp(regex, 'g')).join ('\n');
		}
	})
});