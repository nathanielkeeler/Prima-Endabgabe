"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    ƒ.Debug.log(this.message, this.node);
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
    }
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var FlappyBug;
(function (FlappyBug) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let root;
    let viewport;
    let player;
    // let playerBody: ƒ.ComponentRigidbody;
    let gravity = 0.0001;
    let gravitySpeed = 0;
    let fps = 144;
    let ctrFlap = new ƒ.Control("Flap", 4, 0 /* PROPORTIONAL */);
    ctrFlap.setDelay(100);
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        viewport = _event.detail;
        root = ƒ.Project.resources["Graph|2021-12-20T18:00:23.325Z|85852"];
        player = root.getChildrenByName("Player")[0];
        // playerBody = player.getComponent(ƒ.ComponentRigidbody);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, fps); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        let deltaTime = ƒ.Loop.timeFrameReal / 1000;
        gravitySpeed += gravity;
        let flap = ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.SPACE, ƒ.KEYBOARD_CODE.ARROW_UP, ƒ.KEYBOARD_CODE.S]);
        // ctrFlap.setInput(flap);
        ctrFlap.setInput(flap * deltaTime);
        player.mtxLocal.translateY(ctrFlap.getOutput() - gravitySpeed);
        // playerBody.applyForce(ƒ.Vector3.SCALE(player.mtxLocal.getY(), ctrFlap.getOutput()));
        // ƒ.Physics.world.simulate();  // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function accelerate(n) {
        gravity = n;
    }
})(FlappyBug || (FlappyBug = {}));
var FlappyBug;
(function (FlappyBug) {
    var ƒ = FudgeCore;
    class Player extends ƒ.Node {
        constructor() {
            super("Player");
            this.addComponent(new ƒ.ComponentMesh(new ƒ.MeshQuad("MeshPlayer")));
            this.addComponent(new ƒ.ComponentMaterial(new ƒ.Material("MtrPlayer", ƒ.ShaderTexture)));
            this.addComponent(new ƒ.ComponentTransform);
            // this.mtxLocal.scale(new ƒ.Vector3(0.2, 0.4, 0));
            this.getComponent(ƒ.ComponentMesh).mtxPivot.scale(new ƒ.Vector3(0.2, 0.3, 0));
        }
    }
    FlappyBug.Player = Player;
})(FlappyBug || (FlappyBug = {}));
//# sourceMappingURL=Script.js.map