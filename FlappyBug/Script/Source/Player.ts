namespace FlappyBug {
	import ƒ = FudgeCore;
	import ƒAid = FudgeAid;

	export class Player extends ƒ.Node {

		private spriteNode: ƒAid.NodeSprite;
		private rigidbody: ƒ.ComponentRigidbody;

		constructor() {
			super("Player");
			this.initPlayer();
			this.initSprites();

			ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
		}

		private update = (_event: Event) => {
			this.handlePlayerMovement();
		}

		private initPlayer(): void {
			this.addComponent(new ƒ.ComponentMesh(new ƒ.MeshCube("PlayerMesh")));
			this.addComponent(new ƒ.ComponentMaterial(new ƒ.Material("PlayerMaterial", ƒ.ShaderLit, new ƒ.CoatColored())));
			this.addComponent(new ƒ.ComponentTransform());
			this.mtxLocal.translation = new ƒ.Vector3(-1, 0, 0);
			this.mtxLocal.scaling = new ƒ.Vector3(0.15, 0.15, 0.15);

			this.rigidbody = new ƒ.ComponentRigidbody();
			this.addComponent(this.rigidbody);
			this.rigidbody.initialization = ƒ.BODY_INIT.TO_PIVOT;
			this.rigidbody.mass = 1;
			this.rigidbody.dampTranslation = 0.1;
			this.rigidbody.effectGravity = 1;
			this.rigidbody.effectRotation = new ƒ.Vector3(0, 0, 0);
			this.rigidbody.typeBody = ƒ.BODY_TYPE.DYNAMIC;
			this.rigidbody.typeCollider = ƒ.COLLIDER_TYPE.CUBE;
		}

		private handlePlayerMovement() {

		}

		private async initSprites(): Promise<void> {
			let imgSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
			await imgSpriteSheet.load("Assets/images/sprites/bug-flying.png");
			let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, imgSpriteSheet);

			let animation: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation("PlayerSpriteAnimation", coat);
			animation.generateByGrid(ƒ.Rectangle.GET(1, 1, 712, 520), 11, 500, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(714));

			this.spriteNode = new ƒAid.NodeSprite("Sprite");
			this.spriteNode.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
			this.spriteNode.setAnimation(animation);
			this.spriteNode.setFrameDirection(1);
			this.spriteNode.mtxLocal.translateY(-0.5);
			this.spriteNode.framerate = 30;

			this.addChild(this.spriteNode);
			this.getComponent(ƒ.ComponentMaterial).clrPrimary = new ƒ.Color(0, 0, 0, 0);
		}
	}
}