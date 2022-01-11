namespace FlappyBug {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let root: ƒ.Graph;
  let viewport: ƒ.Viewport;
  let player: ƒ.Node;
  let playerBody: ƒ.ComponentRigidbody;

  let ctrFlap: ƒ.Control = new ƒ.Control("Flap", 3, ƒ.CONTROL_TYPE.PROPORTIONAL);

  document.addEventListener("interactiveViewportStarted", <EventListener>start);


  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    root = <ƒ.Graph>ƒ.Project.resources["Graph|2021-12-20T18:00:23.325Z|85852"];

    player = root.getChildrenByName("Player")[0];
    playerBody = player.getComponent(ƒ.ComponentRigidbody);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }


  function update(_event: Event): void {

    let flap: number = ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.SPACE, ƒ.KEYBOARD_CODE.ARROW_UP, ƒ.KEYBOARD_CODE.S]);
    ctrFlap.setInput(flap);
    playerBody.applyForce(ƒ.Vector3.SCALE(player.mtxLocal.getY(), ctrFlap.getOutput()));


    ƒ.Physics.world.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }
}