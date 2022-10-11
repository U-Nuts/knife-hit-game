import { _decorator, Component, Node, Label, log, tween,  Vec3, UITransform, instantiate, game, screen, view, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('gamePlay')
export class gamePlay extends Component {
	
	@property(Node)
		sprWood: Node = null;
	@property(Node)
		sprKnife: Node = null;
	@property(Label)
		lblScore: Label = null;

	
	static canThrow = true;
	static sprWoodRotation = null;
	static defaultSprKnife = null;
	static arrayKnife = [];
	static score = 0;
	
	onLoad() {
		console.log("in onLoad by console.log")
		log("in onLoad by log")
		
		gamePlay.canThrow = true;
		this.sprWood.setSiblingIndex(2);
		this.sprKnife.setSiblingIndex(1);
		gamePlay.sprWoodRotation = 2.5;
		gamePlay.arrayKnife = [];
		gamePlay.defaultSprKnife = this.sprKnife.position.clone();
		gamePlay.score = 0;
		
		this.node.on(Node.EventType.MOUSE_DOWN, () => {
			this.knifeThrow()
		});
		
		setInterval(() => {
			this.changeSpeed()
		}, 2500);
	}
	
	onDestroy() {
		this.node.off(Node.EventType.MOUSE_DOWN, this.knifeThrow);
	}
	
	start() {
		console.log('gamePlay.score', gamePlay.score);
		console.log('this.lblScore.string', this.lblScore.string);
		this.lblScore.string = "Score: " + gamePlay.score;
	}
	
	changeSpeed() {
		console.log('in changeSpeed');
		let dir = Math.random() > 0.5 ? 1 : -1;
		let speed = 1 + Math.random() * 2;
		gamePlay.sprWoodRotation = dir * speed;
		console.log('gamePlay.sprWoodRotation', gamePlay.sprWoodRotation);
	}
	
	updateScore() {
		gamePlay.score += 1;
		// console.log('gamePlay.score', gamePlay.score);
		// console.log('this.lblScore.string', this.lblScore.string);
		this.lblScore.string = "Score: " + gamePlay.score;
	}

	knifeThrow() {
		log("click!!")
		console.log('gamePlay.canThrow', gamePlay.canThrow)
		console.log('this.sprKnife', this.sprKnife)
		if(gamePlay.canThrow == true) {
			gamePlay.canThrow = false;
			
			const knife_x = this.sprKnife.position.x;
			const wood_y = this.sprWood.position.y;
			const wood_w = this.sprWood.getComponent(UITransform).width;
			console.log('knife_x', knife_x);
			console.log('wood_y', wood_y);
			console.log('wood_w', wood_w);
			
			tween(this.sprKnife)
				.to(0.5, { position: new Vec3(knife_x, wood_y - wood_w/2) })
				.call(() => {
					const gap: Number = 15;
					let isHit: Boolean = false;
					for(let knife of gamePlay.arrayKnife) {
						
						if(Math.abs(knife.angle) < gap || 360 - knife.angle < gap) {
							isHit = true;
							break;
						}
					}
					
					console.log('new Vec3(this.sprKnife.position.x, screen.windowSize.height, 0)', new Vec3(this.sprKnife.position.x, this.node.getComponent(UITransform).height, 0));
					if(isHit) {
						tween(this.sprKnife)
							.to(0.25, {position: new Vec3(this.sprKnife.position.x, -this.node.getComponent(UITransform).height, 0), angle: 30})
							.call(() => {
								director.loadScene('GamePlay')
							})
							.start()
					} else {
						let knifeNode = instantiate(this.sprKnife);
						knifeNode.setPosition(this.sprKnife.position.clone())
						this.updateScore();
						
						this.node.addChild(knifeNode);
						
						gamePlay.arrayKnife.push(knifeNode)
						knifeNode.setSiblingIndex(1);
						
						gamePlay.canThrow = true;
						
						this.sprKnife.setPosition(gamePlay.defaultSprKnife)
					}
				})
				.start()
		}
	}
	
	update() {
		this.sprWood.angle = (this.sprWood.angle + gamePlay.sprWoodRotation) % 360;
		
		for(let knife of gamePlay.arrayKnife) {
			knife.angle = (knife.angle + gamePlay.sprWoodRotation) % 360;
			
			let rad = Math.PI * (knife.angle - 90) / 180;
			let r = this.sprWood.getComponent(UITransform).width / 2;
			
			knife.position.x = this.sprWood.position.x + r*Math.cos(rad);
			knife.position.y = this.sprWood.position.y + r*Math.sin(rad);
		}
	}
	
}

