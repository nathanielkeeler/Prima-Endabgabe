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
    document.addEventListener("interactiveViewportStarted", start);
    let viewport;
    let root;
    let sky;
    let ground;
    let player;
    function start(_event) {
        viewport = _event.detail;
        root = viewport.getBranch();
        sky = root.getChildrenByName("Sky")[0];
        ground = root.getChildrenByName("Ground")[0];
        player = new FlappyBug.Player();
        root.appendChild(player);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 120, true);
    }
    function update(_event) {
        ƒ.Physics.simulate();
        animateBackground();
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function animateBackground() {
        sky.getComponent(ƒ.ComponentMaterial).mtxPivot.translateX(0.001);
        ground.getComponent(ƒ.ComponentMaterial).mtxPivot.translateX(0.005);
    }
})(FlappyBug || (FlappyBug = {}));
var FlappyBug;
(function (FlappyBug) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    class Player extends ƒ.Node {
        spriteNode;
        rigidbody;
        constructor() {
            super("Player");
            this.initPlayer();
            this.initSprites();
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        }
        update = (_event) => {
            this.handlePlayerMovement();
        };
        initPlayer() {
            this.addComponent(new ƒ.ComponentMesh(new ƒ.MeshCube("PlayerMesh")));
            this.addComponent(new ƒ.ComponentMaterial(new ƒ.Material("PlayerMaterial", ƒ.ShaderLit, new ƒ.CoatColored())));
            this.addComponent(new ƒ.ComponentTransform());
            this.mtxLocal.translation = new ƒ.Vector3(-1, 0, 0);
            this.mtxLocal.scaling = new ƒ.Vector3(0.15, 0.15, 0.15);
            this.rigidbody = new ƒ.ComponentRigidbody();
            this.addComponent(this.rigidbody);
            this.rigidbody.initialization = ƒ.BODY_INIT.TO_PIVOT;
            this.rigidbody.mass = 1;
            this.rigidbody.dampTranslation = 1;
            this.rigidbody.effectGravity = 0.11;
            this.rigidbody.effectRotation = new ƒ.Vector3(0, 0, 0);
            this.rigidbody.typeBody = ƒ.BODY_TYPE.DYNAMIC;
            this.rigidbody.typeCollider = ƒ.COLLIDER_TYPE.CUBE;
        }
        handlePlayerMovement() {
            let vertical = ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE, ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]);
            if (vertical) {
                this.rigidbody.applyForce(new ƒ.Vector3(0, 3, 0));
            }
        }
        initSprites() {
            this.flyingSprites();
        }
        async flyingSprites() {
            let imgSpriteSheet = new ƒ.TextureImage();
            await imgSpriteSheet.load("Assets/images/sprites/bug-flying.png");
            let coat = new ƒ.CoatTextured(undefined, imgSpriteSheet);
            let animation = new ƒAid.SpriteSheetAnimation("PlayerFlyingSpriteAnimation", coat);
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
        async crashSprites() {
            let imgSpriteSheet = new ƒ.TextureImage();
            await imgSpriteSheet.load("Assets/images/sprites/bug-crash.png");
            let coat = new ƒ.CoatTextured(undefined, imgSpriteSheet);
            let animation = new ƒAid.SpriteSheetAnimation("PlayerCrashSpriteAnimation", coat);
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
    FlappyBug.Player = Player;
})(FlappyBug || (FlappyBug = {}));
//# sourceMappingURL=Script.js.map