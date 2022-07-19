namespace FlappyBug {
	import ƒ = FudgeCore;

	interface ExternalData { [name: string]: number; }
	let externalData: ExternalData;
	let viewport: ƒ.Viewport;
	let canvas: HTMLCanvasElement;
	let hud: HTMLElement;
	let root: ƒ.Node;
	let sky: ƒ.Node;
	let ground: ƒ.Node;
	let player: Player;
	let enemies: ƒ.Node;
	let enemy: ƒ.Node;
	let enemyAmount: number;
	let collectibles: ƒ.Node;
	let coin: Coin;
	let heart: Heart;
	let gameState: GameState;
	export let gameSpeed: number;
	let startSpeed: number;
	let audio: ƒ.Node;
	let soundtrack: ƒ.ComponentAudio;
	let gameTime: number;
	let counter: number;
	let dialog: HTMLDialogElement;
	let endStatsDiv: HTMLDivElement;

	window.addEventListener("load", init);
	document.addEventListener("interactiveViewportStarted", <EventListener><unknown>start);

	async function start(_event: CustomEvent): Promise<void> {
		initViewport(_event);

		await initGame();

		ƒ.AudioManager.default.listenTo(root);
		ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
		ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 120, true);
	}

	function update(_event: Event): void {
		ƒ.Physics.simulate();

		gameTime = Math.floor(ƒ.Time.game.get() / 1000);

		if (gameTime % 1 == 0) {
			counter += 0.01;
		}

		if (gameState.gameRunning == true) {
			animateBackground();
			gameState.score = Math.floor(counter);
		}

		// Increases Gamespeed
		if (ƒ.Time.game.get() % 10 == 0 && gameState.score != 0 && gameSpeed < 3.2) {
			document.dispatchEvent(new Event("increaseGameSpeed"));
		}
		document.addEventListener("increaseGameSpeed", increaseGameSpeed);

		viewport.draw();
		ƒ.AudioManager.default.update();
	}

	async function initGame(): Promise<void> {
		root = viewport.getBranch();
		sky = root.getChildrenByName("Sky")[0];
		ground = root.getChildrenByName("Ground")[0];
		audio = root.getChildrenByName("Audio")[0];
		player = new Player();
		root.appendChild(player);
		player.getComponent(ƒ.ComponentRigidbody).addEventListener(ƒ.EVENT_PHYSICS.TRIGGER_ENTER, hndCollision, true);
		collectibles = root.getChildrenByName("Collectibles")[0];
		enemies = root.getChildrenByName("Enemies")[0];

		ƒ.Time.game.set(0);
		hud.style.visibility = "visible";
		gameState = new GameState();
		await getData();
		gameSpeed = startSpeed;
		gameState.gameRunning = true;
		counter = 0;
		gameState.score = 0;
		gameState.setHealth();

		spawnObjects();
		playSoundtrack();

		// canvas.requestPointerLock();
	}

	function spawnObjects(): void {
		if (enemyAmount < 3)
			enemyAmount = 3;
		if (enemyAmount > 7)
			enemyAmount = 7;

		for (let i = 0; i <= enemyAmount; i++) {
			enemy = new Enemy();

			if (i % 2 == 0)
				enemy.addComponent(new SineMovementScript);
			else
				enemy.addComponent(new LinearMovementScript);

			enemies.appendChild(enemy);
		}

		for (let i = 0; i < 2; i++) {
			coin = new Coin();
			collectibles.appendChild(coin);
			coin.addComponent(new CoinMovementScript);
		}

		heart = new Heart();
		collectibles.appendChild(heart);
		heart.addComponent(new HeartMovementScript);
	}

	function hndCollision(_event: ƒ.EventPhysics): void {
		if (gameState.gameRunning != true)
			return;

		let obstacle: ƒ.Node = _event.cmpRigidbody.node;

		if (obstacle.name == "Enemy" || obstacle.name == "Ground_Trigger") {
			playAudio("hit").play(true);
			if (gameState.reduceHealth() == 0) {
				soundtrack.play(false);
				playAudio("end").play(true);
				playAudio("hit").play(false);

				player.removeChild(player.spriteNodeFly);
				player.addChild(player.spriteNodeCrash);

				saveData();
				ƒ.Loop.stop();
				endStats();
			}
		} else if (obstacle.name == "Coin") {
			counter += 25;
			playAudio("coin").play(true);

		} else if (obstacle.name == "Heart") {
			playAudio("heart").play(true);
			gameState.addHealth();
		}
	}

	function animateBackground(): void {
		let deltaTime: number = ƒ.Loop.timeFrameReal / 1000;

		sky.getComponent(ƒ.ComponentMaterial).mtxPivot.translateX(0.075 * deltaTime * gameSpeed);
		ground.getComponent(ƒ.ComponentMaterial).mtxPivot.translateX(0.4 * deltaTime * gameSpeed);
	}

	function increaseGameSpeed(): void {
		gameSpeed += 0.015;
	}

	function endStats(): void {
		endStatsDiv.setAttribute("class", "end-stats-show");

		let stats: HTMLParagraphElement = document.createElement("p");
		stats.innerHTML = "Game over <br><br> Your score: " + gameState.score + "<br>Highscore: " + gameState.hScore;
		endStatsDiv.appendChild(stats);

		
	}

	async function getData() {
		let data = await fetchData();

		let fetchedHighscore: number = data["startHighscore"];
		startSpeed = data["startSpeed"];
		enemyAmount = data["enemyAmount"];

		gameState.hScore = <number><unknown>window.localStorage.getItem("Highscore")
		if (fetchedHighscore > gameState.hScore)
			gameState.hScore = fetchedHighscore;
	}

	async function fetchData() {
		try {
			const response = await fetch("data.json");
			externalData = await response.json();
			return externalData;
		} catch (error) {
			return error;
		}
	}

	function saveData() {
		if (gameState.score > gameState.hScore) {
			gameState.hScore = gameState.score;
			window.localStorage.setItem("Highscore", JSON.stringify(gameState.score));
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

	function initViewport(_event: CustomEvent): void {
		viewport = _event.detail;
		viewport.camera.projectOrthographic();
		viewport.camera.mtxPivot.translateZ(4.5);
		viewport.camera.mtxPivot.rotateY(180);
	}

	function init(_event: Event) {
		hud = document.getElementById("HUD");
		hud.style.visibility = "hidden";
		endStatsDiv = <HTMLDivElement>document.querySelector("#end-stats");
		endStatsDiv.setAttribute("class", "end-stats-hide");
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