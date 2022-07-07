namespace FlappyBug {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    export class Coin extends ƒ.Node {

        // private rigidbody: ƒ.ComponentRigidbody;
        private spriteNode: ƒAid.NodeSprite;

        constructor() {
            super("Coin");
            this.initCoin();
        }


        private async initCoin(): Promise<void> {
            await this.initPosition();
            await this.initSprites();
        }

        private async initPosition(): Promise<void> {
            this.addComponent(new ƒ.ComponentMesh(new ƒ.MeshCube("CoinMesh")));
            this.addComponent(new ƒ.ComponentMaterial(new ƒ.Material("CoinMaterial", ƒ.ShaderLit, new ƒ.CoatColored())));
            this.addComponent(new ƒ.ComponentTransform());
            this.mtxLocal.translation = new ƒ.Vector3(0, 0, 0);
            this.mtxLocal.scaling = new ƒ.Vector3(0.1, 0.1, 0.1);

            // this.rigidbody = new ƒ.ComponentRigidbody();
            // this.rigidbody.initialization = ƒ.BODY_INIT.TO_MESH;
            // this.rigidbody.effectRotation = new ƒ.Vector3(0, 0, 0);
            // this.rigidbody.typeBody = ƒ.BODY_TYPE.KINEMATIC;
            // this.rigidbody.typeCollider = ƒ.COLLIDER_TYPE.SPHERE;
            // this.addComponent(this.rigidbody);
        }

        private async initSprites(): Promise<void> {
            let imgSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
            await imgSpriteSheet.load("Assets/images/sprites/coin.png");
            let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, imgSpriteSheet);

            let animation: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation("CoinSpriteAnimation", coat);
            animation.generateByGrid(ƒ.Rectangle.GET(1, 1, 170, 170), 6, 165, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(200));

            this.spriteNode = new ƒAid.NodeSprite("CoinSprite");
            this.spriteNode.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
            this.spriteNode.setAnimation(animation);
            this.spriteNode.setFrameDirection(1);
            this.spriteNode.mtxLocal.translateY(-0.5);
            this.spriteNode.framerate = 5;

            this.addChild(this.spriteNode);
            this.getComponent(ƒ.ComponentMaterial).clrPrimary = new ƒ.Color(0,0,0,0);
        }
    }
}