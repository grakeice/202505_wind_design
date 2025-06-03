import Matter from "matter-js";
import p5 from "p5";
import { IParticle, Leaf, Circle, Sakura } from "./Particles";

export class ParticleRenderer {
	private canvasWidth: number;
	private canvasHeight: number;
	private targetField: p5 | p5.Graphics;
	private targetWorld: Matter.World;

	constructor(
		canvasWidth: number,
		canvasHeight: number,
		targetField: p5 | p5.Graphics,
		targetWorld: Matter.World
	) {
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.targetField = targetField;
		this.targetWorld = targetWorld;
	}

	drawParticle(particle: IParticle): void {
		if (particle instanceof Circle) {
			const p = this.targetField;
			p.push();
			p.fill(particle.color);
			p.noStroke();
			p.circle(particle.position.x, particle.position.y, particle.radius * 2);
			p.pop();
		}
		if (particle instanceof Sakura) {
			const p = this.targetField;
			p.push();
			p.fill(particle.color);
			p.noStroke();
			p.translate(particle.position.x, particle.position.y);
			p.rotate(particle.angle);
			p.beginShape();
			p.vertex(0, -particle.radius);
			p.vertex(particle.radius / 2, particle.radius / 2);
			p.vertex(0, particle.radius);
			p.vertex(-particle.radius / 2, particle.radius / 2);
			p.endShape(p.CLOSE);
			p.pop();
		}
	}
}
