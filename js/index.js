/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/

;// external "p5"
const external_p5_namespaceObject = p5;
var external_p5_default = /*#__PURE__*/__webpack_require__.n(external_p5_namespaceObject);
;// external "Matter"
const external_Matter_namespaceObject = Matter;
var external_Matter_default = /*#__PURE__*/__webpack_require__.n(external_Matter_namespaceObject);
;// ./src/ts/Particles.ts

class Particle {
    constructor({ targetWorld, x, y, dx = 0, dy = 0, angle = 0, angularSpeed = 0, radius = 10, color = "#000000", }) {
        this.position = { x: 0, y: 0 };
        this.speed = { x: 0, y: 0 };
        this.position.x = x;
        this.position.y = y;
        this.speed.x = dx;
        this.speed.y = dy;
        this.angle = angle;
        this.angularSpeed = angularSpeed;
        this.radius = radius;
        this.color = color;
        this.body = external_Matter_default().Bodies.circle(this.position.x, this.position.y, this.radius, {
            friction: 0,
            restitution: 0.95,
        });
        this.targetWorld = targetWorld;
    }
}
class Leaf extends Particle {
    constructor({ targetWorld, x, y, dx = 0, dy = 0, angle = 0, angularSpeed = 0, radius = 10, color = "#00ff00", }) {
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
class Circle extends Particle {
    constructor({ targetWorld, x, y, dx = 0, dy = 0, angle = 0, angularSpeed = 0, radius = 10, color = "#000000", }) {
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
        this.body = external_Matter_default().Bodies.circle(this.position.x, this.position.y, this.radius, {
            friction: 0,
            restitution: 0.95,
        });
        external_Matter_namespaceObject.World.add(this.targetWorld, this.body);
    }
    updatePosition() {
        this.position.x = this.body.position.x;
        this.position.y = this.body.position.y;
        this.angle = this.body.angle;
        return { x: this.position.x, y: this.position.y, angle: this.angle };
    }
}
class Sakura extends Particle {
    constructor({ targetWorld, x, y, dx = 0, dy = 0, angle = 0, angularSpeed = 0, radius = 10, color = "#ffb6c1", }) {
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
            const vertices = [
                external_Matter_namespaceObject.Vector.create(0, radius * 0.8), // 底部（茎の部分）
                external_Matter_namespaceObject.Vector.create(radius * 0.4, radius * 0.3), // 右下
                external_Matter_namespaceObject.Vector.create(radius * 0.7, -radius * 0.2), // 右中
                external_Matter_namespaceObject.Vector.create(radius * 0.5, -radius * 0.7), // 右上の膨らみ
                external_Matter_namespaceObject.Vector.create(radius * 0.3, -radius * 0.9), // 右上切れ込み手前
                external_Matter_namespaceObject.Vector.create(0, -radius * 0.85), // 切れ込みの中央
                external_Matter_namespaceObject.Vector.create(-radius * 0.3, -radius * 0.9), // 左上切れ込み手前
                external_Matter_namespaceObject.Vector.create(-radius * 0.5, -radius * 0.7), // 左上の膨らみ
                external_Matter_namespaceObject.Vector.create(-radius * 0.7, -radius * 0.2), // 左中
                external_Matter_namespaceObject.Vector.create(-radius * 0.4, radius * 0.3), // 左下
            ];
            return vertices;
        };
        const petalVertices = createPetalVertices();
        this.body = external_Matter_namespaceObject.Bodies.fromVertices(this.position.x, this.position.y, [petalVertices], {
            friction: 1,
            restitution: 0,
            frictionAir: 0.03 * this.radius,
            density: 0.005 * this.radius,
            angle: this.angle,
            angularVelocity: this.angularSpeed,
        });
        external_Matter_namespaceObject.World.add(this.targetWorld, this.body);
    }
    updatePosition() {
        this.position.x = this.body.position.x;
        this.position.y = this.body.position.y;
        this.angle = this.body.angle;
        return { x: this.position.x, y: this.position.y, angle: this.angle };
    }
}

;// ./src/ts/ParticleRenderer.ts

class ParticleRenderer {
    constructor(targetField, targetWorld, canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth !== null && canvasWidth !== void 0 ? canvasWidth : targetField.windowWidth;
        this.canvasHeight = canvasHeight !== null && canvasHeight !== void 0 ? canvasHeight : targetField.windowHeight;
        this.targetField = targetField;
        this.targetWorld = targetWorld;
    }
    resizeCanvas(width, height) {
        this.canvasWidth = width;
        this.canvasHeight = height;
    }
    getTargetField() {
        return this.targetField;
    }
    drawParticle(particle) {
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
            p.bezierVertex(radius * 0.4, radius * 0.3, // 制御点1
            radius * 0.7, -radius * 0.2, // 制御点2
            radius * 0.5, -radius * 0.7 // 右上の膨らみ
            );
            // 上部の切れ込み（右側）
            p.bezierVertex(radius * 0.3, -radius * 0.9, // 制御点1
            radius * 0.1, -radius * 0.95, // 制御点2
            0, -radius * 0.85 // 切れ込みの中央
            );
            // 上部の切れ込み（左側）
            p.bezierVertex(-radius * 0.1, -radius * 0.95, // 制御点1
            -radius * 0.3, -radius * 0.9, // 制御点2
            -radius * 0.5, -radius * 0.7 // 左上の膨らみ
            );
            // 左側の曲線
            p.bezierVertex(-radius * 0.7, -radius * 0.2, // 制御点1
            -radius * 0.4, radius * 0.3, // 制御点2
            0, radius * 0.8 // 底部に戻る
            );
            p.endShape(p.CLOSE);
            p.pop();
        }
    }
}

;// ./src/ts/index.ts
var _a;





const requestAccessMotionSensorPermission = () => {
    const deviceMotionEventAny = DeviceMotionEvent;
    if (typeof deviceMotionEventAny.requestPermission === "function") {
        deviceMotionEventAny
            .requestPermission()
            .then((response) => {
            if (response === "granted") {
                console.log("Device motion permission granted.");
            }
            else {
                console.warn("Device motion permission denied.");
            }
        })
            .catch((error) => {
            console.error("Error requesting device motion permission:", error);
        });
    }
    else {
        console.warn("Device motion permission request not supported.");
    }
};
const isIOS = /iP(hone|(o|a)d)/.test(navigator.userAgent);
(_a = document
    .getElementById("permission")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", requestAccessMotionSensorPermission);
const deviceAcceleration = { x: 0, y: 0, z: 0 };
let gravityX = 0;
const smoothingFactor = 0.1;
const handleDeviceMotion = (event) => {
    var _a, _b, _c, _d, _e, _f;
    const adjustIOS = isIOS ? -1 : 1;
    if (event.accelerationIncludingGravity) {
        deviceAcceleration.x =
            ((_b = (_a = event.accelerationIncludingGravity) === null || _a === void 0 ? void 0 : _a.x) !== null && _b !== void 0 ? _b : 0) * adjustIOS * -1;
        deviceAcceleration.y =
            ((_d = (_c = event.accelerationIncludingGravity) === null || _c === void 0 ? void 0 : _c.y) !== null && _d !== void 0 ? _d : 0) * adjustIOS * -1;
        deviceAcceleration.z =
            ((_f = (_e = event.accelerationIncludingGravity) === null || _e === void 0 ? void 0 : _e.z) !== null && _f !== void 0 ? _f : 0) * adjustIOS * -1;
    }
};
window.addEventListener("devicemotion", handleDeviceMotion);
const sketch = (p) => {
    const engine = external_Matter_namespaceObject.Engine.create();
    const world = engine.world;
    const renderer = new ParticleRenderer(p, world);
    const particles = new Set();
    let ground;
    p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.parent("#field");
        // 地面を作成
        ground = external_Matter_namespaceObject.Bodies.rectangle(p.width / 2, // x座標（画面中央）
        p.height - 10, // y座標（画面下部）
        p.width, // 幅（画面幅）
        20, // 高さ
        {
            isStatic: true,
            friction: 0.5,
        });
        external_Matter_namespaceObject.World.add(world, ground);
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
            particles.add(new Sakura({
                targetWorld: world,
                x: x,
                y: y,
                radius: p.random(5, 8),
                angle: p.random(0, p.TWO_PI), // ← ランダムな初期角度
                angularSpeed: p.random(-0.05, 0.05), // ← ランダムな回転速度
                color: p.random(["#ffb6c1", "#ffc0cb", "#ff69b4"]),
            }));
        }
        const toDelete = new Set();
        for (const particle of particles) {
            const position = particle.updatePosition();
            const isOnField = -100 <= position.y + particle.radius &&
                position.y - particle.radius <= p.height;
            if (isOnField) {
                renderer.drawParticle(particle);
            }
            else {
                toDelete.add(particle);
            }
        }
        for (const particle of toDelete) {
            particles.delete(particle);
            external_Matter_namespaceObject.World.remove(world, particle.body);
        }
        external_Matter_namespaceObject.Engine.update(engine, 1000 / 60);
    };
    p.mouseClicked = () => { };
};
new (external_p5_default())(sketch);

/******/ })()
;