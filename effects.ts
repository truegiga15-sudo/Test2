import * as THREE from "three";
import { hashNoise } from "../utils/math";

export class SupernovaShockwave {
  readonly group = new THREE.Group();
  private shell: THREE.Mesh;
  private debris: THREE.Points;
  private elapsed = 0;
  private active = false;

  constructor() {
    const geometry = new THREE.SphereGeometry(1, 64, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffd6a0,
      transparent: true,
      opacity: 0,
      wireframe: true,
      blending: THREE.AdditiveBlending
    });
    this.shell = new THREE.Mesh(geometry, material);
    this.group.add(this.shell);

    const count = 5_000;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const u = hashNoise(i + 1);
      const v = hashNoise(i + 100_000);
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const s = Math.sin(phi);
      const x = s * Math.cos(theta);
      const y = Math.cos(phi);
      const z = s * Math.sin(theta);
      positions[i * 3] = x * 2;
      positions[i * 3 + 1] = y * 2;
      positions[i * 3 + 2] = z * 2;
      velocities[i * 3] = x * (4 + hashNoise(i + 9) * 12);
      velocities[i * 3 + 1] = y * (4 + hashNoise(i + 19) * 12);
      velocities[i * 3 + 2] = z * (4 + hashNoise(i + 29) * 12);
      colors[i * 3] = 1;
      colors[i * 3 + 1] = 0.35 + hashNoise(i + 39) * 0.65;
      colors[i * 3 + 2] = 0.1;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const pointMaterial = new THREE.PointsMaterial({
      size: 0.06,
      transparent: true,
      opacity: 0,
      vertexColors: true,
      blending: THREE.AdditiveBlending
    });
    this.debris = new THREE.Points(geometry, pointMaterial);
    this.debris.userData.velocities = velocities;
    this.group.add(this.debris);
  }

  trigger(): void {
    this.active = true;
    this.elapsed = 0;
  }

  update(dt: number): void {
    if (!this.active) return;
    this.elapsed += dt;

    const t = this.elapsed;
    const shellMaterial = this.shell.material as THREE.MeshBasicMaterial;
    const pointMaterial = this.debris.material as THREE.PointsMaterial;
    this.shell.scale.setScalar(1 + t * 14);
    shellMaterial.opacity = Math.max(0, 0.9 * Math.exp(-0.9 * t));
    pointMaterial.opacity = Math.max(0, 0.85 * Math.exp(-0.55 * t));

    const positions = this.debris.geometry.attributes.position.array as Float32Array;
    const velocities = this.debris.userData.velocities as Float32Array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] += velocities[i] * dt;
      positions[i + 1] += velocities[i + 1] * dt;
      positions[i + 2] += velocities[i + 2] * dt;
    }
    this.debris.geometry.attributes.position.needsUpdate = true;

    if (t > 12) this.active = false;
  }
}
