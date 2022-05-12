namespace FlappyBug {
	import ƒ = FudgeCore;

	document.addEventListener("interactiveViewportStarted", <EventListener>start);

	let viewport: ƒ.Viewport;
	let root: ƒ.Node;
	let sky: ƒ.Node;
	let ground: ƒ.Node;
	let player: Player;

	// let soundtrack: ƒ.ComponentAudio;


	function start(_event: CustomEvent): void {
		ƒ.AudioManager.default.listenTo(root);
		viewport = _event.detail;

		initGame();

		ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
		ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 120, true);
	}



	function update(_event: Event): void {
		ƒ.Physics.simulate();

		animateBackground();

		viewport.draw();
		ƒ.AudioManager.default.update();
	}


	function initGame(): void {
		root = viewport.getBranch();
		sky = root.getChildrenByName("Sky")[0];
		ground = root.getChildrenByName("Ground")[0];
		player = new Player();
		root.appendChild(player);
		// initAudio();

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
	// 	soundtrack.volume = 7;
	// }
}