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
			this.health1 = true;
			this.health2 = true;
			this.health3 = true;
		}
		
		public reduceHealth(): number {
			if (this.health3) {
				this.health3 = false
				this.setHealth();
				return 2;
			}
			else if (this.health2) {
				this.health2 = false
				this.setHealth();
				return 1;
			}
			else {
				this.health1 = false
				this.setHealth();
				return 0;
			}
			
		}
		
		public static get(): GameState {
			return GameState.instance || new GameState();
		}

		protected reduceMutator(_mutator: ƒ.Mutator): void {/* */ }
	}
}