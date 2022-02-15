namespace FlappyBug {
  import ƒ = FudgeCore;
  ƒ.Project.registerScriptNamespace(FlappyBug);  // Register the namespace to FUDGE for serialization

  export class EnemyScript extends ƒ.ComponentScript {
    // Register the script as component for use in the editor via drag&drop
    public static readonly iSubclass: number = ƒ.Component.registerSubclass(EnemyScript);
    // Properties may be mutated by users in the editor via the automatically created user interface
    public message: string = "EnemyScript added to Enemy";
    public speedEnemyTranslation: number = -1;


    constructor() {
      super();

      // Don't start when running in editor
      if (ƒ.Project.mode == ƒ.MODE.EDITOR)
        return;

      // Listen to this component being added to or removed from a node
      this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
      this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
      this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.hndEvent);
    }

    // Activate the functions of this component as response to events
    public hndEvent = (_event: Event): void => {
      switch (_event.type) {
        case ƒ.EVENT.COMPONENT_ADD:
          ƒ.Debug.log(this.message, this.node);
          ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
          break;
        case ƒ.EVENT.COMPONENT_REMOVE:
          this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
          this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
          break;
        case ƒ.EVENT.NODE_DESERIALIZED:
          // if deserialized the node is now fully reconstructed and access to all its components and children is possible
          break;
      }
    }

    public update = (_event: Event): void => {
      this.node.mtxLocal.translateX(this.speedEnemyTranslation * ƒ.Loop.timeFrameGame / 1000);
    }

    public checkCollision(_pos: ƒ.Vector3, _radius: number): boolean {
      let enemy: ƒ.Node = this.node;
      let enemyMeshPivot: ƒ.Matrix4x4 = enemy.getComponent(ƒ.ComponentMesh).mtxPivot;
      let posLocal: ƒ.Vector3 = ƒ.Vector3.TRANSFORMATION(_pos, enemy.mtxWorldInverse, true);
      if (posLocal.y < -_radius || posLocal.y > enemyMeshPivot.scaling.y + _radius || posLocal.x < -enemyMeshPivot.scaling.x / 2 - _radius || posLocal.x > enemyMeshPivot.scaling.x / 2 + _radius)
        return false;
      return true;
    }

    // protected reduceMutator(_mutator: ƒ.Mutator): void {
    //   // delete properties that should not be mutated
    //   // undefined properties and private fields (#) will not be included by default
    // }
  }
}