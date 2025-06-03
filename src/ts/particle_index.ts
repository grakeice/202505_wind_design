import "../style/index";
import p5 from "p5";
import { Bodies, Engine, World } from "matter-js";
import { Circle, IParticle, Sakura } from "./Particles";
import { ParticleRenderer } from "./ParticleRenderer";
import gsap from "gsap";

introduction: {
	const titleElement = document.querySelector("#introduction p");
	if (titleElement) {
		// 文字を一文字ずつspanで囲む
		const text = titleElement.textContent || "";
		titleElement.innerHTML = text
			.split("")
			.map((char) =>
				char === " "
					? " " // スペースはそのまま
					: `<span style="display: inline-block;">${char}</span>`
			)
			.join("");
		/// 各文字にアニメーションを適用（同時に開始）
		const chars = titleElement.querySelectorAll("span");
		chars.forEach((char, index) => {
			const ease = "power1.in";
			const duration = gsap.utils.random(0.3, 0.4);
			const transformOrigin = "50%, -50%";
			gsap
				.timeline({
					delay: 0,
				})
				.to(char, {
					ease: ease,
					transformOrigin: transformOrigin,
					duration: duration,
					rotation: 30,
				})
				.to(char, {
					ease: ease,
					transformOrigin: transformOrigin,
					duration: duration,
					rotation: -15,
				})
				.to(char, {
					ease: ease,
					transformOrigin: transformOrigin,
					duration: duration,
					rotation: 7.5,
				})
				.to(char, {
					ease: ease,
					transformOrigin: transformOrigin,
					duration: duration,
					rotation: 0,
				});
		});
	}
}

canvasSakura: {
	const particles: Set<IParticle> = new Set();
	const sketch = (p: p5) => {
		const engine = Engine.create();
		const world = engine.world;
		let renderer: ParticleRenderer;
		let ground: Matter.Body;
		p.setup = () => {
			const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
			canvas.parent("#canvas-sakura");
			renderer = new ParticleRenderer(p.width, p.height, p, world);
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

			// 地面を描画
			p.fill(100);
			p.noStroke();
			p.rect(0, p.height - 20, p.width, 20);

			// 時々新しい桜を追加（毎フレームではなく）
			if (p.frameCount % 2 === 0 && particles.size < 100) {
				particles.add(
					new Sakura({
						targetWorld: world,
						x: p.random(p.width),
						y: -50, // 画面上から落とす
						radius: p.random(5, 15),
					})
				);
			}

			const toDelete: IParticle[] = [];
			for (const particle of particles) {
				particle.updatePosition();

				// 画面外チェック（左右と下）
				const isOnField =
					-50 <= particle.position.x &&
					particle.position.x <= p.width + 50 &&
					particle.position.y <= p.height + 100; // 下は少し余裕を持たせる

				if (isOnField) {
					renderer.drawParticle(particle);
				} else {
					World.remove(world, particle.body);
					toDelete.push(particle);
				}
			}

			// 削除処理を分離
			for (const particle of toDelete) {
				particles.delete(particle);
			}

			Engine.update(engine, 1000 / 60);
		};
	};

	new p5(sketch);
}

canvasTree: {
	const particles: Set<IParticle> = new Set();
	const sketch = (p: p5) => {
		const engine = Engine.create();
		const world = engine.world;
		let renderer: ParticleRenderer;
		p.setup = () => {
			const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
			canvas.parent("#canvas-tree");
			renderer = new ParticleRenderer(p.width, p.height, p, world);
			p.background(255);
		};
		p.draw = () => {
			p.background(255);
			particles.add(
				new Circle({
					targetWorld: world,
					x: p.random(p.width),
					y: p.random(p.height),
					radius: p.random(10, 50),
				})
			);
			for (const particle of particles) {
				particle.updatePosition();
				const isOnField =
					0 <= particle.position.x + particle.radius &&
					particle.position.x - particle.radius <= p.width &&
					0 <= particle.position.y + particle.radius &&
					particle.position.y - particle.radius <= p.height;
				if (isOnField) {
					renderer.drawParticle(particle);
				} else {
					World.remove(world, particle.body);
					particles.delete(particle);
				}
				renderer.drawParticle(particle);
			}
			Engine.update(engine, 1000 / 60);
		};
	};

	// new p5(sketch);
}
