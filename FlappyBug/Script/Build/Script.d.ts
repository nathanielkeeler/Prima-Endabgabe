declare namespace FlappyBug {
    import ƒ = FudgeCore;
    class Coin extends ƒ.Node {
        private rigidbody;
        private spriteNode;
        constructor();
        private initCoin;
        private initPosition;
        private initSprites;
    }
}
declare namespace FlappyBug {
    import ƒ = FudgeCore;
    class CoinMovementScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        private rigidbody;
        private speed;
        constructor();
        addComponent: () => void;
        straightMovement: () => void;
        private reposition;
        private getRandomFloat;
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
    import ƒ = FudgeCore;
    class Enemy extends ƒ.Node {
        private spriteNodeFly;
        private rigidbody;
        constructor();
        private updateEnemy;
        private initEnemy;
        private initEnemyBodyandPosition;
        private initFlyingSprites;
    }
}
declare namespace FlappyBug {
    class GameState extends ƒ.Mutable {
        private static instance;
        gameRunning: boolean;
        score: number;
        hScore: number;
        heart1: boolean;
        heart2: boolean;
        heart3: boolean;
        constructor();
        setHealth(): void;
        addHealth(): void;
        reduceHealth(): number;
        static get(): GameState;
        protected reduceMutator(_mutator: ƒ.Mutator): void;
    }
}
declare namespace FlappyBug {
    import ƒ = FudgeCore;
    class Heart extends ƒ.Node {
        private rigidbody;
        private spriteNode;
        constructor();
        private initHeart;
        private initPosition;
        private initSprites;
    }
}
declare namespace FlappyBug {
    import ƒ = FudgeCore;
    class HeartMovementScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        private rigidbody;
        private speed;
        constructor();
        addComponent: () => void;
        straightMovement: () => void;
        private reposition;
        private getRandomFloat;
    }
}
declare namespace FlappyBug {
    import ƒ = FudgeCore;
    class LinearMovementScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        private rigidbody;
        private speed;
        constructor();
        addComponent: () => void;
        straightMovement: () => void;
        private reposition;
        private getRandomFloat;
    }
}
declare namespace FlappyBug {
    let gameSpeed: number;
}
declare namespace FlappyBug {
    import ƒ = FudgeCore;
    import ƒAid = FudgeAid;
    class Player extends ƒ.Node {
        spriteNodeFly: ƒAid.NodeSprite;
        spriteNodeCrash: ƒAid.NodeSprite;
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
declare namespace FlappyBug {
    import ƒ = FudgeCore;
    class SineMovementScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        private rigidbody;
        private speed;
        constructor();
        addComponent: () => void;
        private sineMovement;
        private reposition;
        private getRandomFloat;
    }
}
