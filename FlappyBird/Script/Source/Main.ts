namespace FlappyBird {
	import ƒ = FudgeCore;

	ƒ.Debug.info("Main Program Template running!");
	document.addEventListener("interactiveViewportStarted", <EventListener>start);

	let viewport: ƒ.Viewport;
	


	function start(_event: CustomEvent): void {
		viewport = _event.detail;



		ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
		ƒ.Loop.start();
	}



	function update(_event: Event): void {
		// ƒ.Physics.simulate();



		viewport.draw();
		ƒ.AudioManager.default.update();
	}
}