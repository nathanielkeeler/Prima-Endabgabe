namespace FlappyBug {
	import ƒui = FudgeUserInterface;

	export class GameState extends ƒ.Mutable {
		private static instance: GameState;
		public gameRunning: boolean;
		public score: number;
		public hScore: number;
		public health1: boolean = true;
		public health2: boolean = true;
		public health3: boolean = true;


		public constructor() {
			super();
			GameState.instance = this;
			let hud: HTMLDivElement = document.querySelector("#HUD");
			console.log(new ƒui.Controller(this, hud));
		}

		public setHealth(): void {
			
		}

		public static get(): GameState {
			return GameState.instance || new GameState();
		}

		protected reduceMutator(_mutator: ƒ.Mutator): void {/* */ }
	}
}