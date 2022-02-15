namespace FlappyBug {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    export class Player extends ƒ.Node {

        private health: number = 1;
        private componentAudio : ƒ.ComponentAudio;
        private flapSound: ƒ.Audio;
        private hitSound: ƒ.Audio;

        constructor() {
            super("Player");

            this.createPlayer();
            this.loadSounds();
        }

        private createPlayer(): void {
            this.addComponent(new ƒ.ComponentMesh(new ƒ.MeshQuad("MeshPlayer")));
            this.getComponent(ƒ.ComponentMesh).mtxPivot.scale(new ƒ.Vector3(0.35, 0.2, 1));

            this.addComponent(new ƒ.ComponentMaterial(
                new ƒ.Material("BirdTex", ƒ.ShaderTexture,
                    new ƒ.CoatTextured(
                        new ƒ.Color(1, 1, 1), 
                        new ƒ.TextureImage("assets/images/sprites/bird/skeleton-animation_00.png")
                    )
                )
            ));
            this.addComponent(new ƒ.ComponentTransform());

            // this.mtxLocal.scale(new ƒ.Vector3(0.2, 0.4, 0));
        }

        private async loadSounds() : Promise<void> {
            // this.flapSound = await ƒ.Audio.load("assets/audio/player/flap.mp3");
            this.componentAudio = new ƒ.ComponentAudio(this.flapSound);
            this.addComponent(this.componentAudio);
        }
    }
}