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
}
declare namespace FlappyBug {
    import ƒ = FudgeCore;
    class Player extends ƒ.Node {
        constructor();
    }
}
