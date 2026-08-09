import * as THREE from "three";
import type { StellarState } from "../core/types";
import { SupernovaShockwave } from "./effects";

export class StarScene {
  readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(45, 1, 0.1, 2_000);
  private readonly star = new THREE.Mesh();
  private readonly corona = new THREE.Mesh();
  private readonly accretion = new THREE.Mesh();
  private readonly stars = new THREE.Points();
  private readonly shockwave = new SupernovaShockwave();
  private readonly root = new THREE.Group();
  private time = 0;

  constructor(container: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.setClearColor(0x03040a, 1);
    container.appendChild(this.renderer.domElement);

    this.camera.position.set(0, 1.2, 12);
    this.camera.lookAt(0, 0, 0);

    this.scene.add(this.root);
    this.root.add(this.star, this.corona, this.accretion, this.shockwave.group);

    this.createBackground();
    this.createStar();
    this.createAccretionDisk();

    window.addEventListener("resize", () => this.resize(container));
    this.resize(container);
  }

  private createBackground(): void {
    const count = 7_500;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 300 + Math.random() * 900;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    this.stars.geometry = geometry;
    this.stars.material = new THREE.PointsMaterial({
      color: 0xaeb9ff,
      size: 0.45,
      sizeAttenuation: true
    });
    this.scene.add(this.stars);
  }

  private createStar(): void {
    this.star.geometry = new THREE.SphereGeometry(1, 96, 64);
    this.star.material = new THREE.MeshStandardMaterial({
      color: 0xffe0a0,
      emissive: 0xff7b2d,
      emissiveIntensity: 1.8,
      roughness: 0.6,
      metalness: 0
    });

    this.corona.geometry = new THREE.SphereGeometry(1.18, 64, 32);
    this.corona.material = new THREE.MeshBasicMaterial({
      color: 0xffb45a,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    });
  }

  private createAccretionDisk(): void {
    this.accretion.geometry = new THREE.RingGeometry(1.5, 3.8, 256, 16);
    this.accretion.rotation.x = Math.PI * 0.64;
    this.accretion.material = new THREE.MeshBasicMaterial({
      color: 0x8f4a23,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
  }

  private resize(container: HTMLElement): void {
    const width = Math.max(1, container.clientWidth);
    const height = Math.max(1, container.clientHeight);
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  update(state: StellarState, dt: number): void {
    this.time += dt;
    this.shockwave.update(dt);

    const stage = state.stage;
    const normalizedRadius =
      stage === "BLACK_HOLE" ? 0.75 :
      stage === "RED_SUPERGIANT" ? 2.6 :
      stage === "SUPERNOVA" ? 1.5 + 0.2 * Math.sin(this.time * 10) :
      stage === "CORE_COLLAPSE" ? Math.max(0.2, 1.2 - this.time * 0.6) :
      0.9;

    this.star.scale.setScalar(normalizedRadius);
    this.corona.scale.setScalar(normalizedRadius * 1.2);

    const starMaterial = this.star.material as THREE.MeshStandardMaterial;
    const coronaMaterial = this.corona.material as THREE.MeshBasicMaterial;
    const diskMaterial = this.accretion.material as THREE.MeshBasicMaterial;

    if (stage === "BLACK_HOLE") {
      starMaterial.color.setHex(0x000000);
      starMaterial.emissive.setHex(0x000000);
      starMaterial.emissiveIntensity = 0;
      coronaMaterial.opacity = 0;
      diskMaterial.opacity = 0.6;
      this.accretion.rotation.z += dt * 1.8;
      this.accretion.scale.setScalar(1 + Math.sin(this.time * 1.4) * 0.03);
    } else {
      const hue = stage === "RED_SUPERGIANT" ? 0x8a2412 :
        stage === "SUPERNOVA" ? 0xffd0a0 :
        stage === "CORE_COLLAPSE" ? 0xff6a2d :
        stage === "MAIN_SEQUENCE" ? 0xffe7b0 : 0xffb36b;

      starMaterial.color.setHex(hue);
      starMaterial.emissive.setHex(stage === "SUPERNOVA" ? 0xffffff : hue);
      starMaterial.emissiveIntensity = stage === "SUPERNOVA" ? 8 : 2.2;
      coronaMaterial.opacity = stage === "SUPERNOVA" ? 0.45 : 0.16;
      diskMaterial.opacity = 0;
    }

    this.root.rotation.y += dt * (0.025 + state.rotation * 0.05);
    this.star.rotation.y += dt * 0.15;
    this.render();
  }

  triggerSupernova(): void {
    this.shockwave.trigger();
  }

  private render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  dispose(): void {
    this.renderer.dispose();
  }
}
