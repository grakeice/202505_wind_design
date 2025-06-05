import "../style/index";
import p5 from "p5";
import gsap from "gsap";
import { ParticleRenderer } from "./ParticleRenderer";
import { Bodies, Engine, World } from "matter-js";
import { IParticle, Sakura } from "./Particles";
import { sakura as image } from "./photo";

const isIOS = /iP(hone|(o|a)d)/.test(navigator.userAgent);

const deviceAcceleration = { x: 0, y: 0, z: 0 };
let gravityX = 0;
const smoothingFactor = 0.1;

const sleep = async (delay: number) => new Promise((r) => setTimeout(r, delay));

const requestAccessMotionSensorPermission = async (): Promise<boolean> => {
	const deviceMotionEventAny = DeviceMotionEvent as any;

	if (typeof deviceMotionEventAny.requestPermission === "function") {
		try {
			const response: string = await deviceMotionEventAny.requestPermission();
			if (response === "granted") {
				console.log("Device motion permission granted.");
				return true;
			} else {
				console.warn("Device motion permission denied.");
				return false;
			}
		} catch (error: any) {
			console.error("Error requesting device motion permission:", error);
			return false;
		}
	} else {
		console.warn("Device motion permission request not supported.");
		// デスクトップ環境では許可されたものとして扱う
		return true;
	}
};

const displaySplash = async function* () {
	gsap
		.timeline()
		.to("#splash-title", {
			opacity: 0,
			filter: "blur(10px)",
			transition: 1000,
		})
		.set("#splash-title", {
			visibility: "hidden",
		})
		.to("#start", {
			visibility: "visible",
		})
		.to(
			"#start",
			{
				opacity: 1,
				transition: 500,
			},
			"-=0.5"
		);
	yield;
	window.dispatchEvent(splashEndEvent);
	gsap
		.timeline()
		.to("#start", {
			filter: "blur(10px)",
		})
		.to("#splash", {
			opacity: 0,
		})
		.to("meta[name=theme-color]", {
			attr: { content: "#fff6f1" },
		})
		.to("#splash", {
			visibility: "hidden",
		})
		.to("body", {
			backgroundColor: "#fff6f1",
		});
};

window.addEventListener("load", async () => {
	await sleep(1000);
	const tmp = displaySplash();
	tmp.next();
	const startButton = document.getElementById("start");
	if (startButton) {
		addEventListener("click", async () => {
			await requestAccessMotionSensorPermission();
			tmp.next();
		});
	}
});

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
	const img = p.loadImage(image);

	p.setup = () => {
		const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
		canvas.parent("#field");
		// 地面を作成
		ground = Bodies.rectangle(p.width / 2, p.height, p.width, 20, {
			isStatic: true,
			friction: 0.5,
		});
		World.add(world, ground);
		p.background("#fff6f1");
	};
	p.draw = () => {
		p.background("#fff6f1");
		// 地面を描画
		p.fill(139, 69, 19);
		p.noStroke();
		p.rect(0, p.height - 20, p.width, 20);

		p.image(
			img,
			p.width / 6,
			p.height - (p.width / 3 / 6) * 2 * 5 - 10,
			(p.width / 3) * 2,
			(p.width / 3 / 6) * 2 * 5
		);
		// 目標となる重力値
		const targetGravityX = deviceAcceleration.x * 1;

		// なめらかな重力変化（線形補間）
		gravityX = p.lerp(gravityX, targetGravityX, smoothingFactor);

		// 重力を設定
		const gravityY = 1;
		engine.gravity.x = gravityX / 4;
		engine.gravity.y = gravityY;

		// 加速度の値を画面に表示（デバッグ用）
		/*
		p.fill(0);
		p.textSize(16);
		p.text(`X: ${deviceAcceleration.x.toFixed(2)}`, 10, 30);
		p.text(`Y: ${deviceAcceleration.y.toFixed(2)}`, 10, 50);
		p.text(`Gravity X: ${gravityX.toFixed(4)}`, 10, 70);
		*/

		if (p.frameCount % 3 === 0 && particles.size < 10000) {
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
					angle: p.random(0, p.TWO_PI),
					angularSpeed: p.random(-0.05, 0.05),
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
};

window.addEventListener("splash-end", () => {
	new p5(sketch);
});

const splashEndEvent = new CustomEvent("splash-end");

declare global {
	interface WindowEventMap {
		"splash-end": CustomEvent<unknown>;
	}
}
