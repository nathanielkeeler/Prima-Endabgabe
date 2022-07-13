namespace FlappyBug {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    export class Enemy extends ƒ.Node {

        private spriteNodeFly: ƒAid.NodeSprite;
        private enemySpeed: number = 1;
        private rigidbody: ƒ.ComponentRigidbody;

        constructor() {
            super("Enemy");
            this.initEnemy();

            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.updateEnemy);
        }

        private updateEnemy = (_event: Event) => {
            this.moveEnemy();
            this.repositionEnemy();
        }


        private async initEnemy(): Promise<void> {
            await this.initEnemyBodyandPosition();
            await this.initFlyingSprites();
        }

        private async initEnemyBodyandPosition(): Promise<void> {
            this.addComponent(new ƒ.ComponentMesh(new ƒ.MeshCube("EnemyMesh")));
            this.addComponent(new ƒ.ComponentMaterial(new ƒ.Material("EnemyMaterial", ƒ.ShaderLit, new ƒ.CoatColored())));
            this.addComponent(new ƒ.ComponentTransform());
            this.mtxLocal.translation = new ƒ.Vector3(2.2, 0, 0);
            this.mtxLocal.scaling = new ƒ.Vector3(0.19, 0.19, 0.19);

            this.rigidbody = new ƒ.ComponentRigidbody();
            this.rigidbody.initialization = ƒ.BODY_INIT.TO_PIVOT;
            this.rigidbody.mass = 1;
            this.rigidbody.dampTranslation = 1;
            this.rigidbody.effectGravity = 0;
            this.rigidbody.effectRotation = new ƒ.Vector3(0, 0, 0);
            this.rigidbody.typeBody = ƒ.BODY_TYPE.DYNAMIC;
            this.rigidbody.typeCollider = ƒ.COLLIDER_TYPE.CUBE;
            this.addComponent(this.rigidbody);
        }

        private async initFlyingSprites(): Promise<void> {
            let imgSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
            await imgSpriteSheet.load("Assets/images/sprites/enemy.png");
            let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, imgSpriteSheet);

            let animation: ƒAid.SpriteSheetAnimation = new ƒAid.SpriteSheetAnimation("EnemyFlyingSpriteAnimation", coat);
            animation.generateByGrid(ƒ.Rectangle.GET(0, 0, 598, 402), 4, 340, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(598));

            this.spriteNodeFly = new ƒAid.NodeSprite("SpriteFly");
            this.spriteNodeFly.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
            this.spriteNodeFly.setAnimation(animation);
            this.spriteNodeFly.setFrameDirection(1);
            this.spriteNodeFly.mtxLocal.translateY(-0.5);
            this.spriteNodeFly.framerate = 10;

            this.addChild(this.spriteNodeFly);
            this.getComponent(ƒ.ComponentMaterial).clrPrimary = new ƒ.Color(0,0,0,0);
        }

        // Moves Enemy from right to left across the screen. Becomes faster when gameSpeed is increased
        private moveEnemy(): void {
            let deltaTime: number = ƒ.Loop.timeFrameReal / 1000;
            // this.cmpTransform.mtxLocal.translateX(-this.enemySpeed * deltaTime * gameSpeed);
            this.rigidbody.translateBody(new ƒ.Vector3(-this.enemySpeed * deltaTime * gameSpeed, 0, 0));
            // this.rigidbody.translateBody(new ƒ.Vector3(Math.sin(deltaTime * this.rigidbody.getPosition().x), 0, 0));
        }

        // Repositions the Enemy once it passes visible boundaries
        private repositionEnemy(): void {
            // if(this.cmpTransform.mtxLocal.translation.x <= this.getRandomFloat(-2.2,-20,2))
            //     this.cmpTransform.mtxLocal.translation.x = 2.2;
            // if(this.rigidbody.mtxPivot.translation.x <= this.getRandomFloat(-2.2,-20,2))
            //     this.rigidbody.setPosition(new ƒ.Vector3(2.2, 0, 0));
        }

        // Höhe Spielfeld / Höhe Gegner = Anzahl an Steps
        // Höhe Gegner * Random(Anzahl an Steps)

        private getRandomFloat(min: number, max: number, decimals: number): number {
            let str = (Math.random() * (max - min) + min).toFixed(decimals);
            return parseFloat(str);
          }
    }
}