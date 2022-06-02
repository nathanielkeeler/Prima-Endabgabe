namespace FlappyBug {
	import ƒ = FudgeCore;
	import ƒAid = FudgeAid;

	let viewport: ƒ.Viewport;
	let root: ƒ.Node;
	let sky: ƒ.Node;
	let ground: ƒ.Node;
	let player: Player;
	let enemy: ƒ.Node;
	let gameState: GameState;
	// let soundtrack: ƒ.ComponentAudio;

	let dialog: HTMLDialogElement;
	window.addEventListener("load", init);
	document.addEventListener("interactiveViewportStarted", <EventListener>start);

	function init(_event: Event) {
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
		// load resources referenced in the link-tag
		await ƒ.Project.loadResourcesFromHTML();
		ƒ.Debug.log("Project:", ƒ.Project.resources);
		// pick the graph to show
		let graph = <ƒ.Graph>ƒ.Project.resources["Graph|2022-04-08T13:27:53.880Z|73360"];
		ƒ.Debug.log("Graph:", graph);
		if (!graph) {
			alert("Nothing to render. Create a graph with at least a mesh, material and probably some light");
			return;
		}
		// setup the viewport
		let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
		let canvas: HTMLCanvasElement = document.querySelector("canvas");
		let viewport: ƒ.Viewport = new ƒ.Viewport();
		viewport.initialize("InteractiveViewport", graph, cmpCamera, canvas);
		// ƒAid.Viewport.expandCameraToInteractiveOrbit(viewport);

		viewport.draw();
		canvas.dispatchEvent(new CustomEvent("interactiveViewportStarted", { bubbles: true, detail: viewport }));
	}

	function start(_event: CustomEvent): void {
		initViewport(_event);
		initGame();

		ƒ.AudioManager.default.listenTo(root);
		ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
		ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 120, true);
	}



	function update(_event: Event): void {
		ƒ.Physics.simulate();

		if (gameState.gameRunning == true) {
			animateBackground();
			gameState.score = Math.floor(ƒ.Time.game.get() / 1000);
		}

		viewport.draw();
		ƒ.AudioManager.default.update();
	}


	// function startGame(): void {

	// }

	function initGame(): void {
		root = viewport.getBranch();
		sky = root.getChildrenByName("Sky")[0];
		ground = root.getChildrenByName("Ground")[0];
		player = new Player();
		root.appendChild(player);
		enemy = root.getChildrenByName("Enemy")[0];

		// initAudio();
		initEnemyAnim();

		gameState = new GameState();
		gameState.gameRunning = true;

		let canvas: HTMLCanvasElement = viewport.getCanvas();
		canvas.requestPointerLock();
	}

	function animateBackground(): void {
		sky.getComponent(ƒ.ComponentMaterial).mtxPivot.translateX(0.001);
		ground.getComponent(ƒ.ComponentMaterial).mtxPivot.translateX(0.005);
	}

	// function initAudio(): void {
	// 	ƒ.AudioManager.default.listenTo(root);
	// 	soundtrack = root.getChildrenByName("Soundtrack")[0].getComponents(ƒ.ComponentAudio)[0];
	// 	soundtrack.play(true);
	// 	soundtrack.volume = 0.8;
	// }

	function initEnemyAnim(): void {
		let animseq: ƒ.AnimationSequence = new ƒ.AnimationSequence();
		animseq.addKey(new ƒ.AnimationKey(0, 0));
		animseq.addKey(new ƒ.AnimationKey(1500, 0.2));
		animseq.addKey(new ƒ.AnimationKey(3000, 0));

		let animStructure: ƒ.AnimationStructure = {
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

		let animation: ƒ.Animation = new ƒ.Animation("enemyWaveAnimation", animStructure, 120);
		let cmpAnimator: ƒ.ComponentAnimator = new ƒ.ComponentAnimator(animation, ƒ.ANIMATION_PLAYMODE["LOOP"], ƒ.ANIMATION_PLAYBACK["TIMEBASED_CONTINOUS"]);
		if (enemy.getComponent(ƒ.ComponentAnimator)) {
			enemy.removeComponent(enemy.getComponent(ƒ.ComponentAnimator));
		}

		enemy.addComponent(cmpAnimator);
		cmpAnimator.activate(true);
	}

	function initViewport(_event: CustomEvent): void {
		viewport = _event.detail;
		viewport.camera.projectOrthographic();
		viewport.camera.mtxPivot.translateZ(4.5);
		viewport.camera.mtxPivot.rotateY(180);
	}
}