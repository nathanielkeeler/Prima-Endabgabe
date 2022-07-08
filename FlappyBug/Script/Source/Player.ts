namespace FlappyBug {
	import ƒ = FudgeCore;
	import ƒAid = FudgeAid;

	export class Player extends ƒ.Node {

		private spriteNodeFly: ƒAid.NodeSprite;
		private spriteNodeCrash: ƒAid.NodeSprite;
		private rigidbody: ƒ.ComponentRigidbody;
		private cmpAudioFlying: ƒ.ComponentAudio;
		private cmpAudioCrash: ƒ.ComponentAudio;
		private flyingSound: ƒ.Audio;
		private crashSound: ƒ.Audio;
		public framerateLow: number = 5;
		public framerateHigh: number = 40;

		constructor() {
			super("Player");
			this.initPlayer();

			ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.updatePlayer);
		}


		private async initPlayer(): Promise<void> {
			await this.initPlayerBodyandPosition();
			await this.initAudio();
			await this.initFlyingSprites();
			await this.initCrashSprites();
		}

		private updatePlayer = (_event: Event) => {
			this.handlePlayerMovement();
		}

		private async initPlayerBodyandPosition(): Promise<void> {
			this.addComponent(new ƒ.ComponentMesh(new ƒ.MeshCube("PlayerMesh")));
			this.addComponent(new ƒ.ComponentMaterial(new ƒ.Material("PlayerMaterial", ƒ.ShaderLit, new ƒ.CoatColored())));
			this.addComponent(new ƒ.ComponentTransform());
			this.mtxLocal.translation = new ƒ.Vector3(-1, 0, 0);
			this.mtxLocal.scaling = new ƒ.Vector3(0.15, 0.15, 0.15);

			this.rigidbody = new ƒ.ComponentRigidbody();
			this.rigidbody.initialization = ƒ.BODY_INIT.TO_PIVOT;
			this.rigidbody.mass = 1;
			this.rigidbody.dampTranslation = 1;
			this.rigidbody.effectGravity = 0.12;
			this.rigidbody.effectRotation = new ƒ.Vector3(0, 0, 0);
			this.rigidbody.typeBody = ƒ.BODY_TYPE.DYNAMIC;
			this.rigidbody.typeCollider = ƒ.COLLIDER_TYPE.CUBE;
			this.addComponent(this.rigidbody);
		}

		private handlePlayerMovement() {
			let vertical: boolean = ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE, ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]);
			this.spriteNodeFly.framerate = this.framerateLow;
			this.removeComponent(this.cmpAudioFlying);
			if (vertical) {
				this.rigidbody.applyForce(new ƒ.Vector3(0, 3, 0));
				this.spriteNodeFly.framerate = this.framerateHigh;
				this.addComponent(this.cmpAudioFlying);
			}
		}

		private async initFlyingSprites(): Promise<void> {
			let imgSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
			await imgSpriteSheet.load("Assets/images/sprites/bug-flying.png");
			let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, imgSpriteSheet);

			let animation: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation("PlayerFlyingSpriteAnimation", coat);
			animation.generateByGrid(ƒ.Rectangle.GET(1, 1, 712, 520), 11, 500, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(714));

			this.spriteNodeFly = new ƒAid.NodeSprite("SpriteFly");
			this.spriteNodeFly.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
			this.spriteNodeFly.setAnimation(animation);
			this.spriteNodeFly.setFrameDirection(1);
			this.spriteNodeFly.mtxLocal.translateY(-0.5);
			this.spriteNodeFly.framerate = this.framerateLow;

			this.addChild(this.spriteNodeFly);
			this.getComponent(ƒ.ComponentMaterial).clrPrimary = new ƒ.Color(0, 0, 0, 0);
		}

		private async initCrashSprites(): Promise<void> {
			let imgSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
			await imgSpriteSheet.load("Assets/images/sprites/bug-crash.png");
			let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, imgSpriteSheet);

			let animation: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation("PlayerCrashSpriteAnimation", coat);
			animation.generateByGrid(ƒ.Rectangle.GET(1, 1, 712, 520), 11, 500, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(714));

			this.spriteNodeCrash = new ƒAid.NodeSprite("SpriteCrash");
			this.spriteNodeCrash.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
			this.spriteNodeCrash.setAnimation(animation);
			this.spriteNodeCrash.setFrameDirection(1);
			this.spriteNodeCrash.mtxLocal.translateY(-0.5);
			this.spriteNodeCrash.framerate = 30;

			// this.addChild(this.spriteNodeCrash);
			this.getComponent(ƒ.ComponentMaterial).clrPrimary = new ƒ.Color(0, 0, 0, 0);
		}

		private async initAudio(): Promise<void> {
			this.flyingSound = new ƒ.Audio("Assets/audio/bug_flying.mp3");
			this.cmpAudioFlying = new ƒ.ComponentAudio(this.flyingSound, true, true);
			this.cmpAudioFlying.volume = 0.5;
			// this.addComponent(this.cmpAudioFlying);

			this.crashSound = new ƒ.Audio("Assets/audio/bug_splat.mp3");
			this.cmpAudioCrash = new ƒ.ComponentAudio(this.crashSound, false, false);
			this.addComponent(this.cmpAudioCrash);
		}

		// private checkCollision(): void {

		// }
	}
}