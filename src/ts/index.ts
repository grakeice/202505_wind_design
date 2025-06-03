import "../style/index";
import p5 from "p5";
import { ParticleRenderer } from "./ParticleRenderer";
import { Bodies, Engine, World } from "matter-js";
import { Circle, IParticle } from "./Particles";

const requestAccessMotionSensorPermission = () => {
	const deviceMotionEventAny = DeviceMotionEvent as any;
	if (typeof deviceMotionEventAny.requestPermission === "function") {
		deviceMotionEventAny
			.requestPermission()
			.then((response: string) => {
				if (response === "granted") {
					console.log("Device motion permission granted.");
				} else {
					console.warn("Device motion permission denied.");
				}
			})
			.catch((error: any) => {
				console.error("Error requesting device motion permission:", error);
			});
	} else {
		console.warn("Device motion permission request not supported.");
	}
};

const isIOS = /iP(hone|(o|a)d)/.test(navigator.userAgent);
console.log(isIOS);

document
	.getElementById("permission")
	?.addEventListener("click", requestAccessMotionSensorPermission);

const deviceAcceleration = { x: 0, y: 0, z: 0 };

const handleDeviceMotion = (event: DeviceMotionEvent) => {
	const adjustIOS = isIOS ? -1 : 1;
	if (event.accelerationIncludingGravity) {
		deviceAcceleration.x = (event.acceleration?.x ?? 0) * adjustIOS * -1;
		deviceAcceleration.y = (event.acceleration?.y ?? 0) * adjustIOS * -1;
		deviceAcceleration.z = (event.acceleration?.z ?? 0) * adjustIOS * -1;
	}
};

window.addEventListener("devicemotion", handleDeviceMotion);

const sketch = (p: p5) => {
	const engine = Engine.create();
	const world = engine.world;
	const renderer = new ParticleRenderer(p, world);
	const particles: Set<IParticle> = new Set();
	let ground: Matter.Body;

	p.setup = () => {
		const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
		canvas.parent("#field");
		// 地面を作成
		ground = Bodies.rectangle(
			p.width / 2, // x座標（画面中央）
			p.height - 10, // y座標（画面下部）
			p.width, // 幅（画面幅）
			20, // 高さ
			{ isStatic: true } // 動かない静的オブジェクト
		);
		World.add(world, ground);
		p.background(255);
	};
	p.draw = () => {
		p.background(255);
		// 加速度センサーの値を重力として設定
		// デバイスを左に傾けると負の値、右に傾けると正の値
		const gravityX = deviceAcceleration.x * 1; // 強度を調整
		const gravityY = 1; // 通常の重力（下向き）

		engine.world.gravity.x = gravityX;
		engine.world.gravity.y = gravityY;

		// 加速度の値を画面に表示（デバッグ用）
		p.fill(0);
		p.textSize(16);
		p.text(`X: ${deviceAcceleration.x.toFixed(2)}`, 10, 30);
		p.text(`Y: ${deviceAcceleration.y.toFixed(2)}`, 10, 50);
		p.text(`Gravity X: ${gravityX.toFixed(4)}`, 10, 70);

		engine.world.gravity.x = gravityX;
		engine.world.gravity.y = gravityY;

		if (p.frameCount % 5 === 0 && particles.size < 2)
			particles.add(
				new Circle({
					targetWorld: world,
					x: p.random(p.width),
					y: p.random(p.height),
					radius: p.random(10, 20),
				})
			);
		const toDelete: Set<IParticle> = new Set();
		for (const particle of particles) {
			const position = particle.updatePosition();
			const isOnField =
				0 <= position.x + particle.radius &&
				position.x - particle.radius <= p.width &&
				0 <= position.y + particle.radius &&
				position.y - particle.radius <= p.height;

			if (isOnField) {
				renderer.drawParticle(particle);
			} else {
				toDelete.add(particle);
			}
		}
		for (const particle of toDelete) {
			particles.delete(particle);
			World.remove(world, particle.body);
		}
		Engine.update(engine, 1000 / 60);
	};
	p.mouseClicked = () => {};
};

new p5(sketch);
