# Prima Checklist: _Flappy Bug_

---

![](atc.png) <br />

##### _Concept art: Enemies (blue) move from right to left. Player (red) can move in any direction. Player must evade the enemies and optionally pick up collectibles for higher scores. Some collectibles can have a negative effects such as faster flying enemies, or a higher concentration of enemies._

<br />
<br />

| Nr  | Criterion           | Explanation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| :-: | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  0  | Units and Positions | ![](01.png) <br /> All of the resources will be placed on the XY-Axis.<br /> The 0 point will be located in the bottom left corner and the 1 will be located in the top right corner.<br />                                                                                                                                                                                                                                                                                                                                     |
|  1  | Hierarchy           | ![](hierarchy.png)<br /> The scene starts with a basic _root_-graph. This will contain all the elements in the scene.<br /> In the _root_ there will be a _Player_-Node, which will contain the _Player_-Components.<br /> The _Enemy_-Node and its Components will be bundled into a graph for further duplication.<br /> The _Collectible_-Branch has three Leafs (_Coin_, _Heart_, _Wave_) which represent pick up items while playing.<br /> At last there is a _Background_-Node for a simple game background (uses background texture scrolling.).  |
|  2  | Editor              | _Player_ will be created by code. Player stats like score and name (and maybe player character), will be saved in that class.<br /> _Enemy_- and _Collectible_-Nodes/Graphs are created in the Editor, however further instances will be created by code for simplicity.<br /> The _Background_-Node will also be created in the Editor.                                                                                                                                                                                                                  |
|  3  | Scriptcomponents    | All enemies and collectibles will have a custom script defining their movement and when they can be deleted again. Some Nodes will randomly get Custom Scripts which will randomize their behaviour. For instance there could be a bird that doesn't fly straight, but in a sine-curve motion. Same with the _Collectibles_.<br /> Position of _Enemy_ will be broadcasted to the _Player_ for him to handle the Event.                                                                                                                                   |
|  4  | Extend              | ![](collectible_class.png)<br /> _Collectible_-Class inherits from the Node Class and _Coin_, _Heart_, _Wave_ inherit from the _Collectible_-Class. _Player_-Node must be derived from Super-Class-_Node_.<br /> Gamestate will extend _Mutable_-Class for updating score and health in the UI, aswell as changing the player name and displaying it.                                                                                                                                                                                                     |
|  5  | Sound               | Sounds will occur on collision with enemies and collectibles. There will also be a background music and a losing screen music.                                                                                                                                                                                                                                                                                                                                                                                                                            |
|  6  | VUI                 | Menu Screen with start button and settings option.<br /> Settings configuration will lead you to another page where you can get insight to the controls and change your name (aswell as maybe player character).<br /> High score will be presented during the menu screen and while playing, and the current score will be shown while playing.<br /> Additionally there will be an indicator on how many lives the player has left.<br /> When the player has no lives anymore, he will be redirected to an End-Screen, where he can choose to restart. |
|  7  | Event-System        | _Player_ has an Event Handler that gets receives the current position of the _Enemies_ in each Frame.                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
|  8  | External Data       | High score and player name can be stored and loaded in the local storage of the browser.                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
|  9  | Light               | No light necessary.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
|  A  | Physics             | Flappy Bird style gravity.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
|  B  | Net                 |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
|  C  | State Machines      | State machines to change enemy behaviour.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
|  D  | Animation           | Enemies flying could be animated using sprites.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |