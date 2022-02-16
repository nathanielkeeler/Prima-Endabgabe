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
    ƒ.Project.registerScriptNamespace(FlappyBug); // Register the namespace to FUDGE for serialization
    class EnemyScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(EnemyScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "EnemyScript added to Enemy";
        speedEnemyTranslation = -1;
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
                    ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
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
        update = (_event) => {
            this.node.mtxLocal.translateX(this.speedEnemyTranslation * ƒ.Loop.timeFrameGame / 1000);
        };
        checkCollision(_pos, _radius) {
            let enemy = this.node;
            let enemyMeshPivot = enemy.getComponent(ƒ.ComponentMesh).mtxPivot;
            let posLocal = ƒ.Vector3.TRANSFORMATION(_pos, enemy.mtxWorldInverse, true);
            if (posLocal.y < -_radius || posLocal.y > enemyMeshPivot.scaling.y + _radius || posLocal.x < -enemyMeshPivot.scaling.x / 2 - _radius || posLocal.x > enemyMeshPivot.scaling.x / 2 + _radius)
                return false;
            return true;
        }
    }
    FlappyBug.EnemyScript = EnemyScript;
})(FlappyBug || (FlappyBug = {}));
var FlappyBug;
(function (FlappyBug) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let root;
    let viewport;
    let player;
    let playerPlaceholderNode;
    // let playerBody: ƒ.ComponentRigidbody;
    let enemies;
    let enemy;
    let sky;
    let ground;
    let matSky;
    let matGround;
    let gravity = 0.01;
    let fps = 144;
    let deltaTime = ƒ.Loop.timeFrameReal / 1000;
    let ctrFlap = new ƒ.Control("Flap", 4, 0 /* PROPORTIONAL */);
    ctrFlap.setDelay(300);
    document.addEventListener("interactiveViewportStarted", start);
    async function start(_event) {
        viewport = _event.detail;
        getNodesFromGraph();
        let graphEnemy = FudgeCore.Project.resources["Graph|2022-02-10T16:40:52.309Z|18989"];
        for (let i = 0; i < 4; i++) {
            enemy = await ƒ.Project.createGraphInstance(graphEnemy);
            enemy.addEventListener("graphEvent", hndGraphEvent, true);
            enemies.addChild(enemy);
            enemy.mtxLocal.translateY(-1 + i / 2);
            enemy.getComponent(FlappyBug.EnemyScript).speedEnemyTranslation *= randFloat(1, 2);
        }
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, fps); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        deltaTime = ƒ.Loop.timeFrameReal / 1000;
        checkOutOfBounds();
        // Background Paralax
        matSky.mtxPivot.translateX(0.04 * deltaTime);
        matGround.mtxPivot.translateX(0.25 * deltaTime);
        let flap = ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.SPACE, ƒ.KEYBOARD_CODE.ARROW_UP, ƒ.KEYBOARD_CODE.S]);
        ctrFlap.setInput(flap * deltaTime);
        player.mtxLocal.translateY(ctrFlap.getOutput() - gravity);
        // playerBody.applyForce(ƒ.Vector3.SCALE(player.mtxLocal.getY(), ctrFlap.getOutput()));
        // impulse
        // world up vector instead node vector
        // Collision Detection
        for (let enemy of enemies.getChildren()) {
            if (enemy.getComponent(FlappyBug.EnemyScript).checkCollision(player.mtxWorld.translation, 0.3)) {
                console.log("Collision");
                break;
            }
        }
        // ƒ.Physics.world.simulate();  // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
    }
    function getNodesFromGraph() {
        root = ƒ.Project.resources["Graph|2021-12-20T18:00:23.325Z|85852"];
        // player = root.getChildrenByName("Player")[0];
        // playerBody = player.getComponent(ƒ.ComponentRigidbody);
        enemies = root.getChildrenByName("Enemies")[0];
        sky = root.getChildrenByName("Background")[0].getChildrenByName("Sky")[0];
        ground = root.getChildrenByName("Background")[0].getChildrenByName("Ground")[0];
        matSky = sky.getComponent(ƒ.ComponentMaterial);
        matGround = ground.getComponent(ƒ.ComponentMaterial);
        player = new FlappyBug.Player();
        playerPlaceholderNode = root.getChildrenByName("Players")[0];
        playerPlaceholderNode.addChild(player);
    }
    function checkOutOfBounds() {
        let upperBoundry = 1.4;
        let lowerBoundry = -1.25;
        let leftBoundary = -3.2;
        let rightBoundary = 3.2;
        // Player
        if (player.mtxWorld.translation.y >= upperBoundry)
            player.mtxLocal.translation = new ƒ.Vector3(player.mtxWorld.translation.x, upperBoundry, 0);
        if (player.mtxWorld.translation.y <= lowerBoundry) {
            player.mtxLocal.translation = new ƒ.Vector3(player.mtxWorld.translation.x, lowerBoundry, 0);
            matSky.mtxPivot.translateX(-0.04 * deltaTime);
            matGround.mtxPivot.translateX(-0.25 * deltaTime);
        }
        // Enemy
        if (enemy.mtxWorld.translation.x <= leftBoundary) {
            enemy.mtxLocal.translation = new ƒ.Vector3(rightBoundary, randFloat(lowerBoundry + 0.05, upperBoundry), 0);
        }
    }
    function randFloat(min, max) {
        return Math.random() * (max - min) + min;
    }
    function hndGraphEvent(_event) {
        console.log("Graph event received", _event.currentTarget);
    }
})(FlappyBug || (FlappyBug = {}));
var FlappyBug;
(function (FlappyBug) {
    var ƒ = FudgeCore;
    class Player extends ƒ.Node {
        health = 1;
        componentAudio;
        flapSound;
        hitSound;
        constructor() {
            super("Player");
            this.createPlayer();
            this.loadSounds();
        }
        createPlayer() {
            this.addComponent(new ƒ.ComponentMesh(new ƒ.MeshQuad("MeshPlayer")));
            this.getComponent(ƒ.ComponentMesh).mtxPivot.scale(new ƒ.Vector3(0.35, 0.2, 1));
            this.getComponent(ƒ.ComponentMesh).mtxPivot.translation = new ƒ.Vector3(-1.5, 0, 0);
            this.addComponent(new ƒ.ComponentMaterial(new ƒ.Material("BirdTex", ƒ.ShaderTexture, new ƒ.CoatTextured(new ƒ.Color(1, 1, 1), new ƒ.TextureImage("assets/images/sprites/bird/skeleton-animation_00.png")))));
            this.addComponent(new ƒ.ComponentTransform());
        }
        async loadSounds() {
            this.flapSound = new ƒ.ComponentAudio(new ƒ.Audio("assets/audio/player/flap.mp3"), false, false);
            this.flapSound.volume = 25;
            this.addComponent(this.flapSound);
        }
    }
    FlappyBug.Player = Player;
})(FlappyBug || (FlappyBug = {}));
//# sourceMappingURL=Script.js.map