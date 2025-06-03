import "../style/index";
import p5 from "p5";
import { ParticleRenderer } from "./ParticleRenderer";
import { Bodies, Engine, World } from "matter-js";
import { IParticle, Sakura } from "./Particles";

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

document
	.getElementById("permission")
	?.addEventListener("click", requestAccessMotionSensorPermission);

const deviceAcceleration = { x: 0, y: 0, z: 0 };
let gravityX = 0;
const smoothingFactor = 0.1;

const handleDeviceMotion = (event: DeviceMotionEvent) => {
	const adjustIOS = isIOS ? -1 : 1;
	if (event.accelerationIncludingGravity) {
		deviceAcceleration.x =
			(event.accelerationIncludingGravity?.x ?? 0) * adjustIOS * -1;
		deviceAcceleration.y =
			(event.accelerationIncludingGravity?.y ?? 0) * adjustIOS * -1;
		deviceAcceleration.z =
			(event.accelerationIncludingGravity?.z ?? 0) * adjustIOS * -1;
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
			{
				isStatic: true,
				friction: 0.5,
			}
		);
		World.add(world, ground);
		p.background(255);
	};
	p.draw = () => {
		p.background(255);
		// 目標となる重力値
		const targetGravityX = deviceAcceleration.x * 1;

		// なめらかな重力変化（線形補間）
		gravityX = p.lerp(gravityX, targetGravityX, smoothingFactor);

		// 重力を設定
		const gravityY = 1;
		engine.world.gravity.x = gravityX / 4;
		engine.world.gravity.y = gravityY;

		// 加速度の値を画面に表示（デバッグ用）
		p.fill(0);
		p.textSize(16);
		p.text(`X: ${deviceAcceleration.x.toFixed(2)}`, 10, 30);
		p.text(`Y: ${deviceAcceleration.y.toFixed(2)}`, 10, 50);
		p.text(`Gravity X: ${gravityX.toFixed(4)}`, 10, 70);

		if (p.frameCount % 3 === 0 && particles.size < 10000) {
			// 画面外のランダムな位置を生成
			const spawnArea = p.random(["top", "left", "right"]);
			let x, y;

			switch (spawnArea) {
				case "top":
					x = p.random(-50, p.width + 50);
					y = p.random(-100, -50);
					break;
				case "left":
					x = p.random(-p.width, -50);
					y = p.random(-50, p.height / 2);
					break;
				case "right":
					x = p.random(p.width + 50, p.width * 2);
					y = p.random(-50, p.height / 2);
					break;
				default:
					x = p.random(-50, p.width + 50);
					y = p.random(-100, -50);
			}
			particles.add(
				new Sakura({
					targetWorld: world,
					x: x,
					y: y,
					radius: p.random(5, 8),
					angle: p.random(0, p.TWO_PI), // ← ランダムな初期角度
					angularSpeed: p.random(-0.05, 0.05), // ← ランダムな回転速度
					color: p.random(["#ffb6c1", "#ffc0cb", "#ff69b4"]),
				})
			);
		}
		const toDelete: Set<IParticle> = new Set();
		for (const particle of particles) {
			const position = particle.updatePosition();
			const isOnField =
				-100 <= position.y + particle.radius &&
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
