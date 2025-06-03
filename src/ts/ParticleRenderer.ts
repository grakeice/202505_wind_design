import Matter from "matter-js";
import p5 from "p5";
import { IParticle, Leaf, Circle, Sakura } from "./Particles";

export class ParticleRenderer {
	private canvasWidth: number;
	private canvasHeight: number;
	private targetField: p5 | p5.Graphics;
	private targetWorld: Matter.World;

	constructor(
		targetField: p5 | p5.Graphics,
		targetWorld: Matter.World,
		canvasWidth?: number,
		canvasHeight?: number
	) {
		this.canvasWidth = canvasWidth ?? targetField.windowWidth;
		this.canvasHeight = canvasHeight ?? targetField.windowHeight;
		this.targetField = targetField;
		this.targetWorld = targetWorld;
	}

	resizeCanvas(width: number, height: number) {
		this.canvasWidth = width;
		this.canvasHeight = height;
	}

	getTargetField() {
		return this.targetField;
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
			const radius = particle.radius;

			p.push();
			p.fill(particle.color);
			p.noStroke();
			p.translate(particle.position.x, particle.position.y);
			p.rotate(particle.angle);

			// 画像に似た桜の花びら形状
			p.beginShape();
			p.vertex(0, radius * 0.8); // 底部（茎の部分）

			// 右側の曲線
			p.bezierVertex(
				radius * 0.4,
				radius * 0.3, // 制御点1
				radius * 0.7,
				-radius * 0.2, // 制御点2
				radius * 0.5,
				-radius * 0.7 // 右上の膨らみ
			);

			// 上部の切れ込み（右側）
			p.bezierVertex(
				radius * 0.3,
				-radius * 0.9, // 制御点1
				radius * 0.1,
				-radius * 0.95, // 制御点2
				0,
				-radius * 0.85 // 切れ込みの中央
			);

			// 上部の切れ込み（左側）
			p.bezierVertex(
				-radius * 0.1,
				-radius * 0.95, // 制御点1
				-radius * 0.3,
				-radius * 0.9, // 制御点2
				-radius * 0.5,
				-radius * 0.7 // 左上の膨らみ
			);

			// 左側の曲線
			p.bezierVertex(
				-radius * 0.7,
				-radius * 0.2, // 制御点1
				-radius * 0.4,
				radius * 0.3, // 制御点2
				0,
				radius * 0.8 // 底部に戻る
			);

			p.endShape(p.CLOSE);

			p.pop();
		}
	}
}
