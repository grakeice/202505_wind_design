import "../style/index";
import p5 from "p5";
import { Engine, World } from "matter-js";
import { Circle, IParticle } from "./Particles";
import { ParticleRenderer } from "./ParticleRenderer";

introduction: {

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
