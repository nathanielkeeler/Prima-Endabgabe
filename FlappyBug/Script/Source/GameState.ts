namespace FlappyBug {
	import ƒui = FudgeUserInterface;

	export class GameState extends ƒ.Mutable {
		private static instance: GameState;
		public gameRunning: boolean;
		public score: number;

		public constructor() {
			super();
			GameState.instance = this;
			let hud: HTMLDivElement = document.querySelector("#HUD");
			console.log(new ƒui.Controller(this, hud));
		}

		public static get(): GameState {
			return GameState.instance || new GameState();
		}

		protected reduceMutator(_mutator: ƒ.Mutator): void {/* */ }
	}
}