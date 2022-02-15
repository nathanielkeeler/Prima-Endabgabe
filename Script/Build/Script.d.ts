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
    class EnemyScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        speedEnemyTranslation: number;
        constructor();
        hndEvent: (_event: Event) => void;
        update: (_event: Event) => void;
        checkCollision(_pos: ƒ.Vector3, _radius: number): boolean;
    }
}
declare namespace FlappyBug {
}
declare namespace FlappyBug {
    import ƒ = FudgeCore;
    class Player extends ƒ.Node {
        private health;
        private componentAudio;
        private flapSound;
        private hitSound;
        constructor();
        private createPlayer;
        private loadSounds;
    }
}
