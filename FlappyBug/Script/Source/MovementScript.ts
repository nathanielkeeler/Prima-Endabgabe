namespace FlappyBug {
    import ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(FlappyBug);  // Register the namespace to FUDGE for serialization

    export class MovementScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        public static readonly iSubclass: number = ƒ.Component.registerSubclass(MovementScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        public message: string = "MovementScript added to " + this.node;
        private rigidbody: ƒ.ComponentRigidbody;
        private speed: number = 1;


        constructor() {
            super();

            if (ƒ.Project.mode == ƒ.MODE.EDITOR) return;

            this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.addComponent);
        }

        public addComponent = (): void => {
            this.rigidbody = this.node.getComponent(ƒ.ComponentRigidbody);
            this.node.addEventListener(ƒ.EVENT.RENDER_PREPARE, this.straightMovement);
        };

        public straightMovement = (): void => {
            let deltaTime: number = ƒ.Loop.timeFrameReal / 1000;
            this.rigidbody.translateBody(new ƒ.Vector3(-this.speed * deltaTime * gameSpeed, 0, 0));
        };
    }
}