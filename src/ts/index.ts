import "../style/index";
import p5 from "p5";
import { Engine } from "matter-js";
import { Circle, IParticle } from "./Particles";
import { ParticleRenderer } from "./ParticleRenderer";

const particles: Set<IParticle> = new Set();
const sketch = (p: p5) => {
	const engine = Engine.create();
	const world = engine.world;
	let renderer: ParticleRenderer;
	p.setup = () => {
		p.createCanvas(p.windowWidth, p.windowHeight);
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
			})
		);
		for (const particle of particles) {
			particle.updatePosition();
			renderer.drawParticle(particle);
		}
		Engine.update(engine, 1000 / 60);
	};
};

new p5(sketch);
