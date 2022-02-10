namespace FlappyBug {
    import ƒ = FudgeCore;

    export class Player extends ƒ.Node {

        constructor() {
            super("Player");

            this.addComponent(new ƒ.ComponentMesh(new ƒ.MeshQuad("MeshPlayer")));
            this.addComponent(new ƒ.ComponentMaterial(
                new ƒ.Material("MtrPlayer", ƒ.ShaderTexture)
            );
            this.addComponent(new ƒ.ComponentTransform);

            // this.mtxLocal.scale(new ƒ.Vector3(0.2, 0.4, 0));
            this.getComponent(ƒ.ComponentMesh).mtxPivot.scale(new ƒ.Vector3(0.2, 0.3, 0));
        }
    }
}