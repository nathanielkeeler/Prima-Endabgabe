namespace FlappyBug {
	import ƒ = FudgeCore;
	import ƒAid = FudgeAid;

	document.addEventListener("interactiveViewportStarted", <EventListener>start);

	let viewport: ƒ.Viewport;
	let root: ƒ.Node;
	let sky: ƒ.Node;
	let ground: ƒ.Node;
	let player: Player;
	let enemy: ƒ.Node;

	let gameState: GameState;
	let soundtrack: ƒ.ComponentAudio;


	function start(_event: CustomEvent): void {
		ƒ.AudioManager.default.listenTo(root);
		viewport = _event.detail;

		initGame();

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


	function initGame(): void {
		root = viewport.getBranch();
		sky = root.getChildrenByName("Sky")[0];
		ground = root.getChildrenByName("Ground")[0];
		player = new Player();
		root.appendChild(player);
		enemy = root.getChildrenByName("Enemy")[0];

		initAudio();
		initAnim();

		gameState = new GameState();
		gameState.gameRunning = true;

		let canvas: HTMLCanvasElement = viewport.getCanvas();
		canvas.requestPointerLock();
	}

	function animateBackground(): void {
		sky.getComponent(ƒ.ComponentMaterial).mtxPivot.translateX(0.001);
		ground.getComponent(ƒ.ComponentMaterial).mtxPivot.translateX(0.005);
	}

	function initAudio(): void {
		ƒ.AudioManager.default.listenTo(root);
		soundtrack = root.getChildrenByName("Soundtrack")[0].getComponents(ƒ.ComponentAudio)[0];
		soundtrack.play(true);
		soundtrack.volume = 7;
	}

	function initAnim(): void {
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

		console.log("Component", cmpAnimator);
	}
}