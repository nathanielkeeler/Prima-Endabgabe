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
var FlappyBird;
(function (FlappyBird) {
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
        player = new FlappyBird.Player();
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60, true);
    }
    function update(_event) {
        // ƒ.Physics.simulate();
        animateBackground();
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function animateBackground() {
        sky.getComponent(ƒ.ComponentMaterial).mtxPivot.translateX(0.001);
        ground.getComponent(ƒ.ComponentMaterial).mtxPivot.translateX(0.005);
    }
})(FlappyBird || (FlappyBird = {}));
var FlappyBird;
(function (FlappyBird) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    class Player extends ƒ.Node {
        spriteAnimations;
        spriteNode;
        constructor() {
            super("Player");
            this.initPlayer();
            this.initSprites();
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        }
        initPlayer() {
            this.addComponent(new ƒ.ComponentMesh(new ƒ.MeshCube("PlayerMesh")));
            this.addComponent(new ƒ.ComponentMaterial());
            this.addComponent(new ƒ.ComponentTransform());
        }
        update = (_event) => {
            this.handlePlayerMovement();
        };
        handlePlayerMovement() {
        }
        async initSprites() {
            await this.loadSprites();
            this.spriteNode = new ƒAid.NodeSprite("Sprite");
            this.spriteNode.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
            this.spriteNode.setAnimation(this.spriteAnimations["PlayerSpriteAnimation"]);
            this.spriteNode.setFrameDirection(1);
            this.spriteNode.mtxLocal.translateY(0);
            this.spriteNode.framerate = 25;
            this.addChild(this.spriteNode);
            this.getComponent(ƒ.ComponentMaterial).clrPrimary = new ƒ.Color(0, 0, 0, 0);
        }
        async loadSprites() {
            let imgSpriteSheet = new ƒ.TextureImage();
            await imgSpriteSheet.load("Assets/images/sprites/bird-sprite.png");
            let spriteSheet = new ƒ.CoatTextured(new ƒ.Color(), imgSpriteSheet);
            this.generateSprites(spriteSheet);
        }
        generateSprites(_spritesheet) {
            this.spriteAnimations = {};
            let spriteName = "PlayerSprite";
            let sprite = new ƒAid.SpriteSheetAnimation(spriteName, _spritesheet);
            sprite.generateByGrid(ƒ.Rectangle.GET(0, 0, 64, 64), 6, 70, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(64));
            this.spriteAnimations[spriteName] = sprite;
        }
    }
    FlappyBird.Player = Player;
})(FlappyBird || (FlappyBird = {}));
//# sourceMappingURL=Script.js.map