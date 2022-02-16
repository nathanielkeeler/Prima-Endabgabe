namespace FlappyBug {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;

    export class Player extends ƒ.Node {

        private health: number = 1;
        private componentAudio : ƒ.ComponentAudio;
        private flapSound: ƒ.ComponentAudio;
        private hitSound: ƒ.ComponentAudio;

        constructor() {
            super("Player");

            this.createPlayer();
            this.loadSounds();
        }

        private createPlayer(): void {
            this.addComponent(new ƒ.ComponentMesh(new ƒ.MeshQuad("MeshPlayer")));
            this.getComponent(ƒ.ComponentMesh).mtxPivot.scale(new ƒ.Vector3(0.35, 0.2, 1));
            this.getComponent(ƒ.ComponentMesh).mtxPivot.translation = new ƒ.Vector3(-1.5, 0, 0);

            this.addComponent(new ƒ.ComponentMaterial(
                new ƒ.Material("BirdTex", ƒ.ShaderTexture,
                    new ƒ.CoatTextured(
                        new ƒ.Color(1, 1, 1), 
                        new ƒ.TextureImage("assets/images/sprites/bird/skeleton-animation_00.png")
                    )
                )
            ));
            this.addComponent(new ƒ.ComponentTransform());
        }

        private async loadSounds() : Promise<void> {
            this.flapSound = new ƒ.ComponentAudio(new ƒ.Audio("assets/audio/player/flap.mp3"), false, false);
            this.flapSound.volume = 25;
            this.addComponent(this.flapSound);
        }
    }
}