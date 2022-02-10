namespace FlappyBug {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let root: ƒ.Graph;
  let viewport: ƒ.Viewport;
  let player: ƒ.Node;
  // let playerBody: ƒ.ComponentRigidbody;
  let enemies: ƒ.Node;
  let gravity: number = 0.01;

  let fps: number = 144;

  let ctrFlap: ƒ.Control = new ƒ.Control("Flap", 4, ƒ.CONTROL_TYPE.PROPORTIONAL);
  ctrFlap.setDelay(100);

  document.addEventListener("interactiveViewportStarted", <EventListener><unknown>start);


  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;

    root = <ƒ.Graph>ƒ.Project.resources["Graph|2021-12-20T18:00:23.325Z|85852"];

    player = root.getChildrenByName("Player")[0];
    // playerBody = player.getComponent(ƒ.ComponentRigidbody);
    enemies = root.getChildrenByName("Enemies")[0];

    let graphEnemy: ƒ.Graph = <ƒ.Graph>FudgeCore.Project.resources["Graph|2022-02-10T16:15:03.308Z|86091"];

    for (let i: number = 0; i < 2; i++) {
      let enemy = await ƒ.Project.createGraphInstance(graphEnemy);
      enemy.addEventListener("graphEvent", hndGraphEvent, true);
      enemies.addChild(enemy);
      enemy.mtxLocal.translateY(-1);
      if (i % 2 == 0)
          enemy.getComponent(EnemyScript).speedEnemyTranslation *= 50;
    }

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, fps);  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }


  function update(_event: Event): void {

    let deltaTime: number = ƒ.Loop.timeFrameReal / 1000;

    let flap: number = ƒ.Keyboard.mapToValue(1, 0, [ƒ.KEYBOARD_CODE.SPACE, ƒ.KEYBOARD_CODE.ARROW_UP, ƒ.KEYBOARD_CODE.S]);
    // ctrFlap.setInput(flap);
    ctrFlap.setInput(flap * deltaTime);
    player.mtxLocal.translateY(ctrFlap.getOutput() - gravity);
    // playerBody.applyForce(ƒ.Vector3.SCALE(player.mtxLocal.getY(), ctrFlap.getOutput()));
    // impulse
    // world up vector instead node vector

    for (let enemy of enemies.getChildren()) {
      if (enemy.getComponent(EnemyScript).checkCollision(player.mtxWorld.translation, 0.35)) {
        console.log("Collision");
        break;
      }
    }

    // ƒ.Physics.world.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
  }

  function hndGraphEvent(_event: Event): void {
    console.log("Graph event received", _event.currentTarget);
  }
}