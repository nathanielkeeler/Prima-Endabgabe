"use strict";
var FlappyBug;
(function (FlappyBug) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    class Coin extends ƒ.Node {
        rigidbody;
        spriteNode;
        constructor() {
            super("Coin");
            this.initCoin();
        }
        async initCoin() {
            await this.initPosition();
            await this.initSprites();
        }
        async initPosition() {
            this.addComponent(new ƒ.ComponentMesh(new ƒ.MeshCube("CoinMesh")));
            this.addComponent(new ƒ.ComponentMaterial(new ƒ.Material("CoinMaterial", ƒ.ShaderLit, new ƒ.CoatColored())));
            this.addComponent(new ƒ.ComponentTransform());
            this.mtxLocal.translation = new ƒ.Vector3(0, 0, 0);
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
        async initSprites() {
            let imgSpriteSheet = new ƒ.TextureImage();
            await imgSpriteSheet.load("Assets/images/sprites/coin.png");
            let coinCoat = new ƒ.CoatTextured(undefined, imgSpriteSheet);
            let animation = new ƒAid.SpriteSheetAnimation("CoinSpriteAnimation", coinCoat);
            animation.generateByGrid(ƒ.Rectangle.GET(1, 1, 170, 170), 6, 165, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(200));
            this.spriteNode = new ƒAid.NodeSprite("CoinSprite");
            this.spriteNode.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
            this.spriteNode.setAnimation(animation);
            this.spriteNode.setFrameDirection(1);
            this.spriteNode.mtxLocal.translateY(-0.5);
            this.spriteNode.framerate = 5;
            this.addChild(this.spriteNode);
            this.getComponent(ƒ.ComponentMaterial).clrPrimary = new ƒ.Color(0, 0, 0, 0);
        }
    }
    FlappyBug.Coin = Coin;
})(FlappyBug || (FlappyBug = {}));
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
    var ƒAid = FudgeAid;
    class Enemy extends ƒ.Node {
        spriteNodeFly;
        // private enemySpeed: number = 1;
        rigidbody;
        constructor() {
            super("Enemy");
            this.initEnemy();
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.updateEnemy);
        }
        updateEnemy = (_event) => {
        };
        async initEnemy() {
            await this.initEnemyBodyandPosition();
            await this.initFlyingSprites();
        }
        async initEnemyBodyandPosition() {
            this.addComponent(new ƒ.ComponentMesh(new ƒ.MeshCube("EnemyMesh")));
            this.addComponent(new ƒ.ComponentMaterial(new ƒ.Material("EnemyMaterial", ƒ.ShaderLit, new ƒ.CoatColored())));
            this.addComponent(new ƒ.ComponentTransform());
            this.mtxLocal.translation = new ƒ.Vector3(2.2, 0, 0);
            this.mtxLocal.scaling = new ƒ.Vector3(0.19, 0.19, 0.19);
            this.rigidbody = new ƒ.ComponentRigidbody();
            this.rigidbody.initialization = ƒ.BODY_INIT.TO_PIVOT;
            this.rigidbody.mtxPivot.scaling = new ƒ.Vector3(0.8, 0.8, 0.8);
            this.rigidbody.mass = 1;
            this.rigidbody.dampTranslation = 1;
            this.rigidbody.effectGravity = 0;
            this.rigidbody.effectRotation = new ƒ.Vector3(0, 0, 0);
            this.rigidbody.typeBody = ƒ.BODY_TYPE.STATIC;
            this.rigidbody.typeCollider = ƒ.COLLIDER_TYPE.CUBE;
            this.rigidbody.isTrigger = true;
            this.addComponent(this.rigidbody);
        }
        async initFlyingSprites() {
            let imgSpriteSheet = new ƒ.TextureImage();
            await imgSpriteSheet.load("Assets/images/sprites/enemy.png");
            let enemyCoat = new ƒ.CoatTextured(undefined, imgSpriteSheet);
            let animation = new ƒAid.SpriteSheetAnimation("EnemyFlyingSpriteAnimation", enemyCoat);
            animation.generateByGrid(ƒ.Rectangle.GET(0, 0, 598, 402), 4, 340, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(598));
            this.spriteNodeFly = new ƒAid.NodeSprite("SpriteFly");
            this.spriteNodeFly.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
            this.spriteNodeFly.setAnimation(animation);
            this.spriteNodeFly.setFrameDirection(1);
            this.spriteNodeFly.mtxLocal.translateY(-0.5);
            this.spriteNodeFly.framerate = 10;
            this.addChild(this.spriteNodeFly);
            this.getComponent(ƒ.ComponentMaterial).clrPrimary = new ƒ.Color(0, 0, 0, 0);
        }
    }
    FlappyBug.Enemy = Enemy;
})(FlappyBug || (FlappyBug = {}));
var FlappyBug;
(function (FlappyBug) {
    var ƒui = FudgeUserInterface;
    class GameState extends ƒ.Mutable {
        static instance;
        gameRunning;
        score;
        hScore;
        heart1 = true;
        heart2 = true;
        heart3 = true;
        constructor() {
            super();
            GameState.instance = this;
            let hud = document.querySelector("#HUD");
            console.log(new ƒui.Controller(this, hud));
        }
        setHealth() {
            if (this.heart1) {
                document.querySelector("#heart1").setAttribute("class", "heart1enabled");
            }
            else {
                document.querySelector("#heart1").setAttribute("class", "heart1disabled");
            }
            if (this.heart2) {
                document.querySelector("#heart2").setAttribute("class", "heart2enabled");
            }
            else {
                document.querySelector("#heart2").setAttribute("class", "heart2disabled");
            }
            if (this.heart3) {
                document.querySelector("#heart3").setAttribute("class", "heart3enabled");
            }
            else {
                document.querySelector("#heart3").setAttribute("class", "heart3disabled");
            }
        }
        addHealth() {
            if (!this.heart1) {
                this.heart3 = false;
                this.setHealth();
                return;
            }
            else if (!this.heart2) {
                this.heart2 = true;
                this.setHealth();
                return;
            }
            else {
                this.heart3 = true;
                this.setHealth();
                return;
            }
        }
        reduceHealth() {
            if (this.heart3) {
                this.heart3 = false;
                this.setHealth();
                return 2;
            }
            else if (this.heart2) {
                this.heart2 = false;
                this.setHealth();
                return 1;
            }
            else {
                this.heart1 = false;
                this.setHealth();
                return 0;
            }
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
    var ƒAid = FudgeAid;
    class Heart extends ƒ.Node {
        rigidbody;
        spriteNode;
        constructor() {
            super("Heart");
            this.initHeart();
        }
        async initHeart() {
            await this.initPosition();
            await this.initSprites();
        }
        async initPosition() {
            this.addComponent(new ƒ.ComponentMesh(new ƒ.MeshCube("HeartMesh")));
            this.addComponent(new ƒ.ComponentMaterial(new ƒ.Material("HeartMaterial", ƒ.ShaderLit, new ƒ.CoatColored())));
            this.addComponent(new ƒ.ComponentTransform());
            this.mtxLocal.translation = new ƒ.Vector3(0, 0.2, 0);
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
        async initSprites() {
            let imgSpriteSheet = new ƒ.TextureImage();
            await imgSpriteSheet.load("Assets/images/sprites/heart.png");
            let heartCoat = new ƒ.CoatTextured(undefined, imgSpriteSheet);
            let animation = new ƒAid.SpriteSheetAnimation("HeartSpriteAnimation", heartCoat);
            animation.generateByGrid(ƒ.Rectangle.GET(0, 0, 564, 768), 6, 400, ƒ.ORIGIN2D.CENTER, ƒ.Vector2.X(0));
            this.spriteNode = new ƒAid.NodeSprite("HeartSprite");
            this.spriteNode.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
            this.spriteNode.setAnimation(animation);
            this.spriteNode.setFrameDirection(1);
            this.spriteNode.mtxLocal.translateY(0);
            this.spriteNode.framerate = 1;
            this.addChild(this.spriteNode);
            this.getComponent(ƒ.ComponentMaterial).clrPrimary = new ƒ.Color(0, 0, 0, 0);
        }
    }
    FlappyBug.Heart = Heart;
})(FlappyBug || (FlappyBug = {}));
var FlappyBug;
(function (FlappyBug) {
    var ƒ = FudgeCore;
    let viewport;
    let canvas;
    let hud;
    let root;
    let sky;
    let ground;
    let player;
    let enemies;
    let enemy;
    let collectibles;
    let coin;
    let heart;
    let gameState;
    let startSpeed = 1;
    let audio;
    let soundtrack;
    let dialog;
    window.addEventListener("load", init);
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        initViewport(_event);
        window.addEventListener("resize", () => {
            canvas.width = window.innerWidth;
        });
        initGame();
        ƒ.AudioManager.default.listenTo(root);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 120, true);
    }
    function update(_event) {
        ƒ.Physics.simulate();
        if (gameState.gameRunning == true) {
            animateBackground(true);
            // gameState.score = Math.floor(ƒ.Time.game.get() / 1000);
            gameState.score += Math.floor(1 / 1000);
        }
        if (ƒ.Time.game.get() % 10 == 0 && gameState.score != 0 && FlappyBug.gameSpeed < 3) {
            document.dispatchEvent(new Event("increaseGameSpeed"));
        }
        document.addEventListener("increaseGameSpeed", increaseGameSpeed);
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function initGame() {
        root = viewport.getBranch();
        sky = root.getChildrenByName("Sky")[0];
        ground = root.getChildrenByName("Ground")[0];
        audio = root.getChildrenByName("Audio")[0];
        player = new FlappyBug.Player();
        root.appendChild(player);
        player.getComponent(ƒ.ComponentRigidbody).addEventListener("TriggerEnteredCollision" /* TRIGGER_ENTER */, hndCollision, true);
        collectibles = root.getChildrenByName("Collectibles")[0];
        coin = new FlappyBug.Coin();
        collectibles.appendChild(coin);
        heart = new FlappyBug.Heart();
        collectibles.appendChild(heart);
        enemies = root.getChildrenByName("Enemies")[0];
        enemy = new FlappyBug.Enemy();
        enemies.appendChild(enemy);
        enemy.addComponent(new FlappyBug.SineMovementScript);
        coin.addComponent(new FlappyBug.MovementScript);
        heart.addComponent(new FlappyBug.MovementScript);
        ƒ.Time.game.set(0);
        hud.style.visibility = "visible";
        gameState = new FlappyBug.GameState();
        gameState.gameRunning = true;
        gameState.score = 0;
        gameState.setHealth();
        FlappyBug.gameSpeed = startSpeed;
        playSoundtrack();
        // initEnemyAnimation();
        // canvas.requestPointerLock();
    }
    function hndCollision(_event) {
        if (gameState.gameRunning != true)
            return;
        let obstacle = _event.cmpRigidbody.node;
        console.log(obstacle.name);
        if (obstacle.name == "Enemy" || obstacle.name == "Ground_Trigger") {
            playAudio("hit").play(true);
            if (gameState.reduceHealth() == 0) {
                soundtrack.play(false);
                playAudio("end").play(true);
                playAudio("hit").play(false);
                player.removeChild(player.spriteNodeFly);
                player.addChild(player.spriteNodeCrash);
                animateBackground(false);
            }
        }
        else if (obstacle.name == "Coin") {
            gameState.score = Math.floor((ƒ.Time.game.get() / 1000) + 50);
            ;
            playAudio("coin").play(true);
        }
        else if (obstacle.name == "Heart") {
            playAudio("heart").play(true);
            gameState.addHealth();
        }
    }
    function playAudio(name) {
        switch (name) {
            case "hit":
                return audio.getChildrenByName("Hit")[0].getComponent(ƒ.ComponentAudio);
                break;
            case "end":
                return audio.getChildrenByName("End")[0].getComponent(ƒ.ComponentAudio);
                break;
            case "coin":
                return audio.getChildrenByName("Coin")[0].getComponent(ƒ.ComponentAudio);
                break;
            case "heart":
                return audio.getChildrenByName("Heart")[0].getComponent(ƒ.ComponentAudio);
                break;
            default:
                break;
        }
    }
    function playSoundtrack() {
        ƒ.AudioManager.default.listenTo(root);
        soundtrack = root.getChildrenByName("Audio")[0].getChildrenByName("Soundtrack")[0].getComponents(ƒ.ComponentAudio)[0];
        soundtrack.play(true);
        soundtrack.volume = 0.8;
    }
    // Höhe Spielfeld / Höhe Gegner = Anzahl an Steps
    // Höhe Gegner * Random(Anzahl an Steps)
    // function initEnemyAnimation(): void {
    // 	let animseq: ƒ.AnimationSequence = new ƒ.AnimationSequence();
    // 	animseq.addKey(new ƒ.AnimationKey(0, 0));
    // 	animseq.addKey(new ƒ.AnimationKey(1500, 0.2));
    // 	animseq.addKey(new ƒ.AnimationKey(3000, 0));
    // 	let animStructure: ƒ.AnimationStructure = {
    // 		components: {
    // 			ComponentTransform: [
    // 				{
    // 					"ƒ.ComponentTransform": {
    // 						mtxLocal: {
    // 							translation: {
    // 								y: animseq
    // 							}
    // 						}
    // 					}
    // 				}
    // 			]
    // 		}
    // 	};
    // 	let animation: ƒ.Animation = new ƒ.Animation("enemyWaveAnimation", animStructure, 120);
    // 	let cmpAnimator: ƒ.ComponentAnimator = new ƒ.ComponentAnimator(animation, ƒ.ANIMATION_PLAYMODE["LOOP"], ƒ.ANIMATION_PLAYBACK["TIMEBASED_CONTINOUS"]);
    // 	if (enemy.getComponent(ƒ.ComponentAnimator)) {
    // 		enemy.removeComponent(enemy.getComponent(ƒ.ComponentAnimator));
    // 	}
    // 	enemy.addComponent(cmpAnimator);
    // 	cmpAnimator.activate(true);
    // }
    function initViewport(_event) {
        viewport = _event.detail;
        viewport.camera.projectOrthographic();
        viewport.camera.mtxPivot.translateZ(4.5);
        viewport.camera.mtxPivot.rotateY(180);
    }
    function animateBackground(action) {
        let deltaTime = ƒ.Loop.timeFrameReal / 1000;
        switch (action) {
            case true:
                sky.getComponent(ƒ.ComponentMaterial).mtxPivot.translateX(0.075 * deltaTime * FlappyBug.gameSpeed);
                ground.getComponent(ƒ.ComponentMaterial).mtxPivot.translateX(0.4 * deltaTime * FlappyBug.gameSpeed);
                break;
            case false:
                sky.getComponent(ƒ.ComponentMaterial).mtxPivot.translateX(0 * deltaTime * FlappyBug.gameSpeed);
                ground.getComponent(ƒ.ComponentMaterial).mtxPivot.translateX(0 * deltaTime * FlappyBug.gameSpeed);
                break;
            default:
                break;
        }
    }
    function increaseGameSpeed() {
        FlappyBug.gameSpeed += 0.015;
    }
    // async function getData() {
    // 	let data = await fetchData();
    // 	let fetchedHighscore: number = data.data.startHighscore;
    // 	startSpeed = data.data.startSpeed;
    // 	gameState.hScore = <number><unknown>localStorage.getItem("HighScore")
    // 	if (fetchedHighscore > gameState.hScore)
    // 		gameState.hScore = fetchedHighscore;
    // }
    // async function fetchData() {
    // 	try {
    // 		const response = await fetch("data.json");
    // 		const responseObj = await response.json();
    // 		return responseObj;
    // 	} catch (error) {
    // 		return error;
    // 	}
    // }
    // function saveData() {
    // 	if (gameState.score > gameState.hScore) {
    // 		gameState.hScore = gameState.score;
    // 		localStorage.setItem("HighScore", JSON.stringify(gameState.score));
    // 	}
    // }
    // Imported the following two functions from index.html
    function init(_event) {
        hud = document.getElementById("HUD");
        hud.style.visibility = "hidden";
        dialog = document.querySelector("dialog");
        dialog.querySelector("h1").textContent = document.title;
        dialog.addEventListener("click", function (_event) {
            // @ts-ignore until HTMLDialog is implemented by all browsers and available in dom.d.ts
            dialog.close();
            startInteractiveViewport();
        });
        //@ts-ignore
        dialog.showModal();
    }
    async function startInteractiveViewport() {
        await ƒ.Project.loadResourcesFromHTML();
        ƒ.Debug.log("Project:", ƒ.Project.resources);
        let graph = ƒ.Project.resources["Graph|2022-04-08T13:27:53.880Z|73360"];
        ƒ.Debug.log("Graph:", graph);
        if (!graph) {
            alert("Nothing to render.");
            return;
        }
        let cmpCamera = new ƒ.ComponentCamera();
        canvas = document.querySelector("canvas");
        let viewport = new ƒ.Viewport();
        viewport.initialize("InteractiveViewport", graph, cmpCamera, canvas);
        viewport.draw();
        canvas.dispatchEvent(new CustomEvent("interactiveViewportStarted", { bubbles: true, detail: viewport }));
    }
})(FlappyBug || (FlappyBug = {}));
var FlappyBug;
(function (FlappyBug) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(FlappyBug); // Register the namespace to FUDGE for serialization
    class MovementScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(MovementScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "MovementScript added to " + this.node;
        rigidbody;
        speed = 1;
        constructor() {
            super();
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.addComponent);
        }
        addComponent = () => {
            this.rigidbody = this.node.getComponent(ƒ.ComponentRigidbody);
            this.node.addEventListener("renderPrepare" /* RENDER_PREPARE */, this.straightMovement);
            this.node.addEventListener("renderPrepare" /* RENDER_PREPARE */, this.reposition);
        };
        straightMovement = () => {
            let deltaTime = ƒ.Loop.timeFrameReal / 1000;
            this.rigidbody.translateBody(new ƒ.Vector3(-this.speed * deltaTime * FlappyBug.gameSpeed, 0, 0));
        };
        reposition = () => {
            if (this.rigidbody.getPosition().x <= this.getRandomFloat(-2.2, -20, 2))
                this.rigidbody.setPosition(new ƒ.Vector3(2.2, 0, 0));
        };
        getRandomFloat(min, max, decimals) {
            let str = (Math.random() * (max - min) + min).toFixed(decimals);
            return parseFloat(str);
        }
    }
    FlappyBug.MovementScript = MovementScript;
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
            this.initPlayer().then(() => ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.updatePlayer));
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
            this.rigidbody.effectGravity = 0.15;
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
                this.rigidbody.applyForce(new ƒ.Vector3(0, 3.5, 0));
                this.spriteNodeFly.framerate = this.framerateHigh;
                this.addComponent(this.cmpAudioFlying);
            }
        }
        async initFlyingSprites() {
            let imgSpriteSheet = new ƒ.TextureImage();
            await imgSpriteSheet.load("Assets/images/sprites/bug-flying.png");
            let playerFlyingCoat = new ƒ.CoatTextured(undefined, imgSpriteSheet);
            let animation = new ƒAid.SpriteSheetAnimation("PlayerFlyingSpriteAnimation", playerFlyingCoat);
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
            let playerCrashCoat = new ƒ.CoatTextured(undefined, imgSpriteSheet);
            let animation = new ƒAid.SpriteSheetAnimation("PlayerCrashSpriteAnimation", playerCrashCoat);
            animation.generateByGrid(ƒ.Rectangle.GET(1, 1, 742, 520), 11, 500, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(714));
            this.spriteNodeCrash = new ƒAid.NodeSprite("SpriteCrash");
            this.spriteNodeCrash.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
            this.spriteNodeCrash.setAnimation(animation);
            this.spriteNodeCrash.setFrameDirection(1);
            this.spriteNodeCrash.mtxLocal.translateY(-0.5);
            this.spriteNodeCrash.framerate = 8;
            // this.addChild(this.spriteNodeCrash);
            this.getComponent(ƒ.ComponentMaterial).clrPrimary = new ƒ.Color(0, 0, 0, 0);
        }
        async initAudio() {
            this.flyingSound = new ƒ.Audio("Assets/audio/bug_flying.mp3");
            this.cmpAudioFlying = new ƒ.ComponentAudio(this.flyingSound, true, true);
            this.cmpAudioFlying.volume = 0.5;
            // this.addComponent(this.cmpAudioFlying);
            this.crashSound = new ƒ.Audio("Assets/audio/bug_splat.mp3");
            this.cmpAudioCrash = new ƒ.ComponentAudio(this.crashSound, false, false);
            this.addComponent(this.cmpAudioCrash);
        }
    }
    FlappyBug.Player = Player;
})(FlappyBug || (FlappyBug = {}));
var FlappyBug;
(function (FlappyBug) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(FlappyBug); // Register the namespace to FUDGE for serialization
    class SineMovementScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(SineMovementScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "SineMovementScript added to " + this.node;
        rigidbody;
        speed = 1;
        constructor() {
            super();
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.addComponent);
        }
        addComponent = () => {
            this.rigidbody = this.node.getComponent(ƒ.ComponentRigidbody);
            this.node.addEventListener("renderPrepare" /* RENDER_PREPARE */, this.sineMovement);
            this.node.addEventListener("renderPrepare" /* RENDER_PREPARE */, this.reposition);
        };
        sineMovement = () => {
            let deltaTime = ƒ.Loop.timeFrameReal / 1000;
            this.rigidbody.translateBody(new ƒ.Vector3(-this.speed * deltaTime * FlappyBug.gameSpeed, 0.002 * Math.sin(2 * this.rigidbody.getPosition().x), 0));
        };
        reposition = () => {
            if (this.rigidbody.getPosition().x <= this.getRandomFloat(-2.2, -20, 2))
                this.rigidbody.setPosition(new ƒ.Vector3(2.2, 0, 0));
        };
        getRandomFloat(min, max, decimals) {
            let str = (Math.random() * (max - min) + min).toFixed(decimals);
            return parseFloat(str);
        }
    }
    FlappyBug.SineMovementScript = SineMovementScript;
})(FlappyBug || (FlappyBug = {}));
//# sourceMappingURL=Script.js.map