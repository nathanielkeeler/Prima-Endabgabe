namespace FlappyBug {
	import ƒ = FudgeCore;

	ƒ.Debug.info("Main Program Template running!");
	document.addEventListener("interactiveViewportStarted", <EventListener>start);

	let viewport: ƒ.Viewport;
	let root: ƒ.Node;
	let sky: ƒ.Node;
	let ground: ƒ.Node;
	let player: Player;


	function start(_event: CustomEvent): void {
		viewport = _event.detail;
		root = viewport.getBranch();
		sky = root.getChildrenByName("Sky")[0];
		ground = root.getChildrenByName("Ground")[0];
		
		player = new Player();
		root.appendChild(player);
		
		ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
		ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60, true);
	}



	function update(_event: Event): void {
		// ƒ.Physics.simulate();
		animateBackground();

		viewport.draw();
		ƒ.AudioManager.default.update();
	}



	function animateBackground(): void {
		sky.getComponent(ƒ.ComponentMaterial).mtxPivot.translateX(0.001);
		ground.getComponent(ƒ.ComponentMaterial).mtxPivot.translateX(0.005);
	}
}