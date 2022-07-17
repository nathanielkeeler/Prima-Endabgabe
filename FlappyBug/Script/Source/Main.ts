namespace FlappyBug {
	import ƒ = FudgeCore;

	let viewport: ƒ.Viewport;
	let canvas: HTMLCanvasElement;
	let hud: HTMLElement;
	let root: ƒ.Node;
	let sky: ƒ.Node;
	let ground: ƒ.Node;

	let player: Player;

	let enemies: ƒ.Node;
	let enemy: ƒ.Node;

	let collectibles: ƒ.Node;
	let coin: Coin;
	let heart: Heart;

	let gameState: GameState;
	export let gameSpeed: number;
	let startSpeed: number = 1;

	let audio: ƒ.Node;
	let soundtrack: ƒ.ComponentAudio;

	let gametime: number;

	let dialog: HTMLDialogElement;
	window.addEventListener("load", init);
	document.addEventListener("interactiveViewportStarted", <EventListener>start);


	function start(_event: CustomEvent): void {
		initViewport(_event);
		window.addEventListener("resize", () => {
			canvas.width = window.innerWidth;
		});

		initGame();

		ƒ.AudioManager.default.listenTo(root);
		ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
		ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 120, true);
	}

	function update(_event: Event): void {
		ƒ.Physics.simulate();
		// let deltaTime: number = ƒ.Loop.timeFrameReal / 1000;
		gametime = Math.floor(ƒ.Time.game.get() / 1000);

		if (gameState.gameRunning == true) {
			animateBackground(true);
			// gameState.score = Math.floor(ƒ.Time.game.get() / 1000);
			gameState.score = gametime;
		}
		if (ƒ.Time.game.get() % 10 == 0 && gameState.score != 0 && gameSpeed < 3) {
			document.dispatchEvent(new Event("increaseGameSpeed"));
		}
		document.addEventListener("increaseGameSpeed", increaseGameSpeed);

		viewport.draw();
		ƒ.AudioManager.default.update();
	}


	function initGame(): void {
		root = viewport.getBranch();
		sky = root.getChildrenByName("Sky")[0];
		ground = root.getChildrenByName("Ground")[0];
		audio = root.getChildrenByName("Audio")[0];
		player = new Player();
		root.appendChild(player);
		player.getComponent(ƒ.ComponentRigidbody).addEventListener(ƒ.EVENT_PHYSICS.TRIGGER_ENTER, hndCollision, true);

		collectibles = root.getChildrenByName("Collectibles")[0];
		coin = new Coin();
		collectibles.appendChild(coin);
		heart = new Heart();
		collectibles.appendChild(heart);

		enemies = root.getChildrenByName("Enemies")[0];
		enemy = new Enemy();
		enemies.appendChild(enemy);

		enemy.addComponent(new SineMovementScript);
		coin.addComponent(new MovementScript);
		heart.addComponent(new MovementScript);

		ƒ.Time.game.set(0);
		hud.style.visibility = "visible";
		gameState = new GameState();
		gameState.gameRunning = true;
		gameState.score = 0;
		gameState.setHealth();
		gameSpeed = startSpeed;

		playSoundtrack();

		// initEnemyAnimation();

		// canvas.requestPointerLock();
	}

	function hndCollision(_event: ƒ.EventPhysics): void {
		if (gameState.gameRunning != true)
			return;

		let obstacle: ƒ.Node = _event.cmpRigidbody.node;
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
		} else if (obstacle.name == "Coin") {
			gameState.score = gametime + 50;
			// gametime and coin system need fixing
			playAudio("coin").play(true);

		} else if (obstacle.name == "Heart") {
			playAudio("heart").play(true);
			gameState.addHealth();
		}
	}

	function playAudio(name: string): ƒ.ComponentAudio {
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

	function playSoundtrack(): void {
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

	function initViewport(_event: CustomEvent): void {
		viewport = _event.detail;
		viewport.camera.projectOrthographic();
		viewport.camera.mtxPivot.translateZ(4.5);
		viewport.camera.mtxPivot.rotateY(180);
	}

	function animateBackground(action: boolean): void {
		let deltaTime: number = ƒ.Loop.timeFrameReal / 1000;
		switch (action) {
			case true:
				sky.getComponent(ƒ.ComponentMaterial).mtxPivot.translateX(0.075 * deltaTime * gameSpeed);
				ground.getComponent(ƒ.ComponentMaterial).mtxPivot.translateX(0.4 * deltaTime * gameSpeed);
				break;
			case false:
				sky.getComponent(ƒ.ComponentMaterial).mtxPivot.translateX(0 * deltaTime * gameSpeed);
				ground.getComponent(ƒ.ComponentMaterial).mtxPivot.translateX(0 * deltaTime * gameSpeed);
				break;
			default:
				break;
		}
	}

	function increaseGameSpeed(): void {
		gameSpeed += 0.015;
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
	function init(_event: Event) {
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
	async function startInteractiveViewport(): Promise<void> {
		await ƒ.Project.loadResourcesFromHTML();
		ƒ.Debug.log("Project:", ƒ.Project.resources);
		let graph = <ƒ.Graph>ƒ.Project.resources["Graph|2022-04-08T13:27:53.880Z|73360"];
		ƒ.Debug.log("Graph:", graph);
		if (!graph) {
			alert("Nothing to render.");
			return;
		}
		let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
		canvas = document.querySelector("canvas");
		let viewport: ƒ.Viewport = new ƒ.Viewport();
		viewport.initialize("InteractiveViewport", graph, cmpCamera, canvas);
		viewport.draw();
		canvas.dispatchEvent(new CustomEvent("interactiveViewportStarted", { bubbles: true, detail: viewport }));
	}
}