import Matter, { Bodies, Vector, World } from "matter-js";

/**
 * Arguments for constructing a Particle instance.
 *
 * @property x - The initial x-coordinate of the particle.
 * @property y - The initial y-coordinate of the particle.
 * @property dx - (Optional) The initial velocity in the x-direction.
 * @property dy - (Optional) The initial velocity in the y-direction.
 * @property angle - (Optional) The initial angle of the particle in radians.
 * @property angularSpeed - (Optional) The initial angular speed of the particle.
 * @property radius - (Optional) The radius of the particle.
 * @property color - (Optional) The color of the particle, as a string.
 * @property targetWorld - The Matter.World instance to which the particle belongs.
 */
type ParticleConstructorArguments = {
	targetWorld: Matter.World;
	x: number;
	y: number;
	dx?: number;
	dy?: number;
	angle?: number;
	angularSpeed?: number;
	radius?: number;
	color?: string;
};

export interface IParticle {
	position: { x: number; y: number };
	speed: { x: number; y: number };
	angle: number;
	angularSpeed: number;
	radius: number;
	color: string;
	body: Matter.Body;
	targetWorld: Matter.World;
	updatePosition(): { x: number; y: number; angle: number };
}
abstract class Particle implements IParticle {
	position: { x: number; y: number } = { x: 0, y: 0 };
	speed: { x: number; y: number } = { x: 0, y: 0 };
	angle: number;
	angularSpeed: number;
	radius: number;
	color: string;
	body: Matter.Body;
	targetWorld: Matter.World;
	abstract updatePosition(): { x: number; y: number; angle: number };
	constructor({
		targetWorld,
		x,
		y,
		dx = 0,
		dy = 0,
		angle = 0,
		angularSpeed = 0,
		radius = 10,
		color = "#000000",
	}: ParticleConstructorArguments) {
		this.position.x = x;
		this.position.y = y;
		this.speed.x = dx;
		this.speed.y = dy;
		this.angle = angle;
		this.angularSpeed = angularSpeed;
		this.radius = radius;
		this.color = color;
		this.body = Matter.Bodies.circle(
			this.position.x,
			this.position.y,
			this.radius,
			{
				friction: 0,
				restitution: 0.95,
			}
		);
		this.targetWorld = targetWorld;
	}
}

export class Leaf extends Particle {
	constructor({
		targetWorld,
		x,
		y,
		dx = 0,
		dy = 0,
		angle = 0,
		angularSpeed = 0,
		radius = 10,
		color = "#00ff00",
	}: ParticleConstructorArguments) {
		super({
			targetWorld,
			x,
			y,
			dx,
			dy,
			angle,
			angularSpeed,
			radius,
			color,
		});
	}

	updatePosition() {
		return { x: this.position.x, y: this.position.y, angle: this.angle };
	}
}

export class Circle extends Particle {
	constructor({
		targetWorld,
		x,
		y,
		dx = 0,
		dy = 0,
		angle = 0,
		angularSpeed = 0,
		radius = 10,
		color = "#000000",
	}: ParticleConstructorArguments) {
		super({
			targetWorld,
			x,
			y,
			dx,
			dy,
			angle,
			angularSpeed,
			radius,
			color,
		});
		this.body = Matter.Bodies.circle(
			this.position.x,
			this.position.y,
			this.radius,
			{
				friction: 0,
				restitution: 0.95,
			}
		);
		World.add(this.targetWorld, this.body);
	}

	updatePosition() {
		this.position.x = this.body.position.x;
		this.position.y = this.body.position.y;
		this.angle = this.body.angle;
		return { x: this.position.x, y: this.position.y, angle: this.angle };
	}
}

export class Sakura extends Particle {
	constructor({
		targetWorld,
		x,
		y,
		dx = 0,
		dy = 0,
		angle = 0,
		angularSpeed = 0,
		radius = 10,
		color = "#ffb6c1",
	}: ParticleConstructorArguments) {
		super({
			targetWorld,
			x,
			y,
			dx,
			dy,
			angle,
			angularSpeed,
			radius,
			color,
		});
		const createPetalVertices = () => {
			// 桜の花びらの形状に近い頂点を定義
			const vertices: Matter.Vector[] = [
				Vector.create(0, radius * 0.8), // 底部（茎の部分）
				Vector.create(radius * 0.4, radius * 0.3), // 右下
				Vector.create(radius * 0.7, -radius * 0.2), // 右中
				Vector.create(radius * 0.5, -radius * 0.7), // 右上の膨らみ
				Vector.create(radius * 0.3, -radius * 0.9), // 右上切れ込み手前
				Vector.create(0, -radius * 0.85), // 切れ込みの中央
				Vector.create(-radius * 0.3, -radius * 0.9), // 左上切れ込み手前
				Vector.create(-radius * 0.5, -radius * 0.7), // 左上の膨らみ
				Vector.create(-radius * 0.7, -radius * 0.2), // 左中
				Vector.create(-radius * 0.4, radius * 0.3), // 左下
			];

			return vertices;
		};
		const petalVertices = createPetalVertices();
		this.body = Bodies.fromVertices(
			this.position.x,
			this.position.y,
			[petalVertices],
			{
				friction: 1,
				restitution: 0,
				frictionAir: 0.03 * this.radius,
				density: 0.005 * this.radius,
				angle: this.angle,
				angularVelocity: this.angularSpeed,
			}
		);
		World.add(this.targetWorld, this.body);
	}

	updatePosition(): { x: number; y: number; angle: number } {
		this.position.x = this.body.position.x;
		this.position.y = this.body.position.y;
		this.angle = this.body.angle;
		return { x: this.position.x, y: this.position.y, angle: this.angle };
	}
}
