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
    var ƒui = FudgeUserInterface;
    class GameState extends ƒ.Mutable {
        static instance;
        gameRunning;
        score;
        constructor() {
            super();
            GameState.instance = this;
            let hud = document.querySelector("#HUD");
            console.log(new ƒui.Controller(this, hud));
        }
        static get() {
            return GameState.instance || new GameState();
        }
        reduceMutator(_mutator) { }
    }
    FlappyBug.GameState = GameState;
})(FlappyBug || (FlappyBug = {}));
var FlappyBug;
(function (FlappyBug) {
    var ƒ = FudgeCore;
    document.addEventListener("interactiveViewportStarted", start);
    let viewport;
    let root;
    let sky;
    let ground;
    let player;
    let enemy;
    let gameState;
    let soundtrack;
    function start(_event) {
        ƒ.AudioManager.default.listenTo(root);
        viewport = _event.detail;
        viewport.camera.projectOrthographic();
        initGame();
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 120, true);
    }
    function update(_event) {
        ƒ.Physics.simulate();
        if (gameState.gameRunning == true) {
            animateBackground();
            gameState.score = Math.floor(ƒ.Time.game.get() / 1000);
        }
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function initGame() {
        root = viewport.getBranch();
        sky = root.getChildrenByName("Sky")[0];
        ground = root.getChildrenByName("Ground")[0];
        player = new FlappyBug.Player();
        root.appendChild(player);
        enemy = root.getChildrenByName("Enemy")[0];
        initAudio();
        initAnim();
        gameState = new FlappyBug.GameState();
        gameState.gameRunning = true;
        let canvas = viewport.getCanvas();
        canvas.requestPointerLock();
    }
    function animateBackground() {
        sky.getComponent(ƒ.ComponentMaterial).mtxPivot.translateX(0.001);
        ground.getComponent(ƒ.ComponentMaterial).mtxPivot.translateX(0.005);
    }
    function initAudio() {
        ƒ.AudioManager.default.listenTo(root);
        soundtrack = root.getChildrenByName("Soundtrack")[0].getComponents(ƒ.ComponentAudio)[0];
        soundtrack.play(true);
        soundtrack.volume = 3;
    }
    function initAnim() {
        let animseq = new ƒ.AnimationSequence();
        animseq.addKey(new ƒ.AnimationKey(0, 0));
        animseq.addKey(new ƒ.AnimationKey(1500, 0.2));
        animseq.addKey(new ƒ.AnimationKey(3000, 0));
        let animStructure = {
            components: {
                ComponentTransform: [
                    {
                        "ƒ.ComponentTransform": {
                            mtxLocal: {
                                translation: {
                                    y: animseq
                                }
                            }
                        }
                    }
                ]
            }
        };
        let animation = new ƒ.Animation("enemyWaveAnimation", animStructure, 120);
        let cmpAnimator = new ƒ.ComponentAnimator(animation, ƒ.ANIMATION_PLAYMODE["LOOP"], ƒ.ANIMATION_PLAYBACK["TIMEBASED_CONTINOUS"]);
        if (enemy.getComponent(ƒ.ComponentAnimator)) {
            enemy.removeComponent(enemy.getComponent(ƒ.ComponentAnimator));
        }
        enemy.addComponent(cmpAnimator);
        cmpAnimator.activate(true);
    }
})(FlappyBug || (FlappyBug = {}));
var FlappyBug;
(function (FlappyBug) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    class Player extends ƒ.Node {
        spriteNodeFly;
        spriteNodeCrash;
        rigidbody;
        cmpAudioFlying;
        cmpAudioCrash;
        flyingSound;
        crashSound;
        framerateLow = 5;
        framerateHigh = 40;
        constructor() {
            super("Player");
            this.initPlayer();
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.updatePlayer);
        }
        async initPlayer() {
            await this.initPlayerBodyandPosition();
            await this.initAudio();
            await this.initFlyingSprites();
            await this.initCrashSprites();
        }
        updatePlayer = (_event) => {
            this.handlePlayerMovement();
        };
        async initPlayerBodyandPosition() {
            this.addComponent(new ƒ.ComponentMesh(new ƒ.MeshCube("PlayerMesh")));
            this.addComponent(new ƒ.ComponentMaterial(new ƒ.Material("PlayerMaterial", ƒ.ShaderLit, new ƒ.CoatColored())));
            this.addComponent(new ƒ.ComponentTransform());
            this.mtxLocal.translation = new ƒ.Vector3(-1, 0, 0);
            this.mtxLocal.scaling = new ƒ.Vector3(0.15, 0.15, 0.15);
            this.rigidbody = new ƒ.ComponentRigidbody();
            this.rigidbody.initialization = ƒ.BODY_INIT.TO_PIVOT;
            this.rigidbody.mass = 1;
            this.rigidbody.dampTranslation = 1;
            this.rigidbody.effectGravity = 0.115;
            this.rigidbody.effectRotation = new ƒ.Vector3(0, 0, 0);
            this.rigidbody.typeBody = ƒ.BODY_TYPE.DYNAMIC;
            this.rigidbody.typeCollider = ƒ.COLLIDER_TYPE.CUBE;
            this.addComponent(this.rigidbody);
        }
        handlePlayerMovement() {
            let vertical = ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE, ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]);
            this.spriteNodeFly.framerate = this.framerateLow;
            this.removeComponent(this.cmpAudioFlying);
            if (vertical) {
                this.rigidbody.applyForce(new ƒ.Vector3(0, 3, 0));
                this.spriteNodeFly.framerate = this.framerateHigh;
                this.addComponent(this.cmpAudioFlying);
            }
        }
        async initFlyingSprites() {
            let imgSpriteSheet = new ƒ.TextureImage();
            await imgSpriteSheet.load("Assets/images/sprites/bug-flying.png");
            let coat = new ƒ.CoatTextured(undefined, imgSpriteSheet);
            let animation = new ƒAid.SpriteSheetAnimation("PlayerFlyingSpriteAnimation", coat);
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
        async initCrashSprites() {
            let imgSpriteSheet = new ƒ.TextureImage();
            await imgSpriteSheet.load("Assets/images/sprites/bug-crash.png");
            let coat = new ƒ.CoatTextured(undefined, imgSpriteSheet);
            let animation = new ƒAid.SpriteSheetAnimation("PlayerCrashSpriteAnimation", coat);
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
        async initAudio() {
            this.flyingSound = new ƒ.Audio("Assets/audio/bug_flying.mp3");
            this.cmpAudioFlying = new ƒ.ComponentAudio(this.flyingSound, true, true);
            this.cmpAudioFlying.volume = 0.8;
            // this.addComponent(this.cmpAudioFlying);
            this.crashSound = new ƒ.Audio("Assets/audio/bug_splat.mp3");
            this.cmpAudioCrash = new ƒ.ComponentAudio(this.crashSound, false, false);
            this.addComponent(this.cmpAudioCrash);
        }
    }
    FlappyBug.Player = Player;
})(FlappyBug || (FlappyBug = {}));
//# sourceMappingURL=Script.js.map