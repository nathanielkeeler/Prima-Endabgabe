declare namespace FlappyBug {
    import ƒ = FudgeCore;
    class Coin extends ƒ.Node {
        private spriteNode;
        constructor();
        private initCoin;
        private initPosition;
        private initSprites;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace FlappyBug {
    class GameState extends ƒ.Mutable {
        private static instance;
        gameRunning: boolean;
        score: number;
        constructor();
        static get(): GameState;
        protected reduceMutator(_mutator: ƒ.Mutator): void;
    }
}
declare namespace FlappyBug {
    import ƒ = FudgeCore;
    class Heart extends ƒ.Node {
        private spriteNode;
        constructor();
        private initHeart;
        private initPosition;
        private initSprites;
    }
}
declare namespace FlappyBug {
}
declare namespace FlappyBug {
    import ƒ = FudgeCore;
    class Player extends ƒ.Node {
        private spriteNodeFly;
        private spriteNodeCrash;
        private rigidbody;
        private cmpAudioFlying;
        private cmpAudioCrash;
        private flyingSound;
        private crashSound;
        framerateLow: number;
        framerateHigh: number;
        constructor();
        private initPlayer;
        private updatePlayer;
        private initPlayerBodyandPosition;
        private handlePlayerMovement;
        private initFlyingSprites;
        private initCrashSprites;
        private initAudio;
    }
}
