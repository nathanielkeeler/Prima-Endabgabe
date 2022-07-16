namespace FlappyBug {
	import ƒui = FudgeUserInterface;

	export class GameState extends ƒ.Mutable {
		private static instance: GameState;
		public gameRunning: boolean;
		public score: number;
		public hScore: number;
		public heart1: boolean = true;
		public heart2: boolean = true;
		public heart3: boolean = true;


		public constructor() {
			super();
			GameState.instance = this;
			let hud: HTMLDivElement = document.querySelector("#HUD");
			console.log(new ƒui.Controller(this, hud));
		}

		public setHealth(): void {
			if (this.heart1) {
				document.querySelector("#heart1").setAttribute("class", "heart1enabled");
			} else {
				document.querySelector("#heart1").setAttribute("class", "heart1disabled");
			}
			if (this.heart2) {
				document.querySelector("#heart2").setAttribute("class", "heart2enabled");
			} else {
				document.querySelector("#heart2").setAttribute("class", "heart2disabled");
			}
			if (this.heart3) {
				document.querySelector("#heart3").setAttribute("class", "heart3enabled");
			} else {
				document.querySelector("#heart3").setAttribute("class", "heart3disabled");
			}
		}

		public addHealth(): void {
			if (!this.heart1) {
				this.heart3 = false;
				this.setHealth();
				return;
			}
			else if (!this.heart2) {
				this.heart2 = true;
				this.setHealth();
				return;
			}
			else {
				this.heart3 = true;
				this.setHealth();
				return;
			}
		}

		public reduceHealth(): number {
			if (this.heart3) {
				this.heart3 = false;
				this.setHealth();
				return 2;
			}
			else if (this.heart2) {
				this.heart2 = false;
				this.setHealth();
				return 1;
			}
			else {
				this.heart1 = false;
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