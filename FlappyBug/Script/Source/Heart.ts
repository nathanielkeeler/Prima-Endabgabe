namespace FlappyBug {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    export class Heart extends ƒ.Node {

        private rigidbody: ƒ.ComponentRigidbody;
        private spriteNode: ƒAid.NodeSprite;

        constructor() {
            super("Heart");
            this.initHeart();
        }


        private async initHeart(): Promise<void> {
            await this.initPosition();
            await this.initSprites();
        }

        private async initPosition(): Promise<void> {
            this.addComponent(new ƒ.ComponentMesh(new ƒ.MeshCube("HeartMesh")));
            this.addComponent(new ƒ.ComponentMaterial(new ƒ.Material("HeartMaterial", ƒ.ShaderLit, new ƒ.CoatColored())));
            this.addComponent(new ƒ.ComponentTransform());
            this.mtxLocal.scaling = new ƒ.Vector3(0.1, 0.1, 0.1);

            this.rigidbody = new ƒ.ComponentRigidbody();
            this.rigidbody.initialization = ƒ.BODY_INIT.TO_MESH;
            this.rigidbody.effectRotation = new ƒ.Vector3(0, 0, 0);
            this.rigidbody.effectGravity = 0;
            this.rigidbody.typeBody = ƒ.BODY_TYPE.STATIC;
            this.rigidbody.typeCollider = ƒ.COLLIDER_TYPE.SPHERE;
            this.rigidbody.isTrigger = true;
            this.addComponent(this.rigidbody);
        }

        private async initSprites(): Promise<void> {
            let imgSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
            await imgSpriteSheet.load("Assets/images/sprites/heart.png");
            let heartCoat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, imgSpriteSheet);

            let animation: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation("HeartSpriteAnimation", heartCoat);
            animation.generateByGrid(ƒ.Rectangle.GET(0, 0, 564, 768), 6, 400, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(0));

            this.spriteNode = new ƒAid.NodeSprite("HeartSprite");
            this.spriteNode.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
            this.spriteNode.setAnimation(animation);
            this.spriteNode.setFrameDirection(1);
            this.spriteNode.mtxLocal.translateY(0);
            this.spriteNode.framerate = 1;

            this.addChild(this.spriteNode);
            this.getComponent(ƒ.ComponentMaterial).clrPrimary = new ƒ.Color(0,0,0,0);
        }
    }
}