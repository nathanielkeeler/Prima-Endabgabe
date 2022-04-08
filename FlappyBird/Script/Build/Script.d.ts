declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace FlappyBird {
}
declare namespace FlappyBird {
    import ƒ = FudgeCore;
    class Player extends ƒ.Node {
        private spriteAnimations;
        private spriteNode;
        constructor();
        private initPlayer;
        private update;
        private handlePlayerMovement;
        private initSprites;
        private loadSprites;
        private generateSprites;
    }
}
