namespace FlappyBird {
	import ƒ = FudgeCore;
	import ƒAid = FudgeAid;

	export class Player extends ƒ.Node {

		private spriteAnimations: ƒAid.SpriteSheetAnimations;
		private spriteNode: ƒAid.NodeSprite;

		constructor() {
			super("Player");
			this.initPlayer();
			this.initSprites();

			ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
		}

		private initPlayer(): void {
			this.addComponent(new ƒ.ComponentMesh(new ƒ.MeshCube("PlayerMesh")));
			this.addComponent(new ƒ.ComponentMaterial());
			this.addComponent(new ƒ.ComponentTransform());
		}


		private update = (_event: Event) => {
			this.handlePlayerMovement();
		}


		private handlePlayerMovement() {

		}

		private async initSprites(): Promise<void> {
			await this.loadSprites();
			this.spriteNode = new ƒAid.NodeSprite("Sprite");
			this.spriteNode.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
			this.spriteNode.setAnimation(<ƒAid.SpriteSheetAnimation>this.spriteAnimations["PlayerSpriteAnimation"]);
			this.spriteNode.setFrameDirection(1);
			this.spriteNode.mtxLocal.translateY(0);
			this.spriteNode.framerate = 25;

			this.addChild(this.spriteNode);
			this.getComponent(ƒ.ComponentMaterial).clrPrimary = new ƒ.Color(0, 0, 0, 0);
		}

		private async loadSprites(): Promise<void> {
			let imgSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
			await imgSpriteSheet.load("Assets/images/sprites/bird-sprite.png");
			let spriteSheet: ƒ.CoatTextured = new ƒ.CoatTextured(new ƒ.Color(), imgSpriteSheet);
			this.generateSprites(spriteSheet);
		}

		private generateSprites(_spritesheet: ƒ.CoatTextured): void {
			this.spriteAnimations = {};
			let spriteName: string = "PlayerSprite";
			let sprite: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation(spriteName, _spritesheet);
			sprite.generateByGrid(ƒ.Rectangle.GET(0, 0, 64, 64), 6, 70, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(64));
			this.spriteAnimations[spriteName] = sprite;
		}
	}
}