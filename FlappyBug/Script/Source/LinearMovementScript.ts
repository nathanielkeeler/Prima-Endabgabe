namespace FlappyBug {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(FlappyBug);  // Register the namespace to FUDGE for serialization

    export class LinearMovementScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        public static readonly iSubclass: number = ƒ.Component.registerSubclass(LinearMovementScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        public message: string = "LinearMovementScript added to " + this.node;
        private rigidbody: ƒ.ComponentRigidbody;
        private speed: number = 1;


        constructor() {
            super();

            if (ƒ.Project.mode == ƒ.MODE.EDITOR) return;

            this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.addComponent);
        }

        public addComponent = (): void => {
            this.node.mtxLocal.translation = new ƒ.Vector3(this.getRandomFloat(2.2, 8, 2), this.getRandomFloat(-0.75, 0.85, 2), 0);
            this.rigidbody = this.node.getComponent(ƒ.ComponentRigidbody);
            this.node.addEventListener(ƒ.EVENT.RENDER_PREPARE, this.straightMovement);
            this.node.addEventListener(ƒ.EVENT.RENDER_PREPARE, this.reposition);
        };

        public straightMovement = (): void => {
            let deltaTime: number = ƒ.Loop.timeFrameReal / 1000;
            this.rigidbody.translateBody(new ƒ.Vector3(-this.speed * deltaTime * gameSpeed, 0, 0));
        };

        private reposition = (): void => {
            if (this.rigidbody.getPosition().x <= this.getRandomFloat(-2.2, -60, 2)) {
                let yPos: number = this.getRandomFloat(-0.75, 0.85, 1);
                this.rigidbody.setPosition(new ƒ.Vector3(2.2, yPos, 0));
            }
        }

        private getRandomFloat(min: number, max: number, decimals: number): number {
            let str = (Math.random() * (max - min) + min).toFixed(decimals);
            return parseFloat(str);
        }
    }
}