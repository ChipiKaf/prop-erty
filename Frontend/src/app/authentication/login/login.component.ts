import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormCardComponent } from '../../form-card/form-card.component';
import * as THREE from 'three';
import { DRACOLoader, GLTFLoader } from 'three/examples/jsm/Addons.js';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, FormCardComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild('entry', { static: true })
  canvasContainer!: ElementRef<HTMLDivElement>;
  // Render state
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private renderer: THREE.WebGLRenderer | null = null;

  // Loaders
  private gltfLoader: GLTFLoader | null = null;
  private dracoLoader: DRACOLoader | null = null;

  // model
  private city!: THREE.Group<THREE.Object3DEventMap>;

  // Parallax state
  private oldX: number = 0;
  private oldY: number = 0;
  private cameraInitialPos = new THREE.Vector3(10, 10, 10);
  private cameraOffsetCurrent = new THREE.Vector2(0, 0);
  private cameraOffsetTarget = new THREE.Vector2(0, 0);
  private parallaxStrenght = 5;

  // For cleanup
  animationId: number | null = null;

  constructor() {}

  private initializeScene() {
    const container = this.canvasContainer.nativeElement;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      45,
      container.offsetWidth / container.offsetHeight,
      0.1,
      200
    );

    this.scene.background = new THREE.Color(0x000000);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.offsetWidth, container.offsetHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.camera.position.copy(this.cameraInitialPos);
    this.camera.lookAt(0, 0, 0);
    this.canvasContainer.nativeElement.appendChild(this.renderer.domElement);
  }

  private loadModel() {
    this.gltfLoader = new GLTFLoader();
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath('draco/');
    this.gltfLoader.setDRACOLoader(this.dracoLoader);
    this.gltfLoader.load('models/city.glb', (gltf) => {
      this.city = gltf.scene;
      gltf.scene.scale.set(1.5, 1.5, 1.5);
      // console.log(model)
      // this.scene.add(model.children);
      // if (!model) return;
      this.city.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: mesh.name !== 'Plane001',
          });
        }
      });
      this.scene?.add(this.city);
    });
  }

  private onPointerMove(ev: PointerEvent) {
    const x = ev.clientX / window.innerWidth - 0.5;
    const y = ev.clientY / innerHeight - 0.5;
    this.cameraOffsetTarget.set(x, y);
  }

  private onWindowResize() {
    const container = this.canvasContainer.nativeElement;
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = container.offsetWidth / container.offsetHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.offsetWidth, container.offsetHeight);
  }

  private disposeThreeJs() {
    this.camera = null;
    this.scene = null;

    this.gltfLoader = null;
    this.dracoLoader = null;

    this.city.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.geometry?.dispose();

        if (Array.isArray(mesh.material)) {
          mesh.material?.forEach((mat) => mat.dispose());
        } else {
          mesh.material?.dispose();
        }
      }
      this.renderer?.dispose();
    });
  }

  private addEvents() {
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('resize', this.onWindowResize);
  }

  private removeEvents() {
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('resize', this.onWindowResize);
  }

  ngOnInit() {
    this.initializeScene();
    this.loadModel();
    this.addEvents();
    this.animate();
  }

  ngOnDestroy(): void {
    this.removeEvents();

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.disposeThreeJs();
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    this.cameraOffsetCurrent.lerp(this.cameraOffsetTarget, 0.05);
    const offsetX = this.cameraOffsetCurrent.x * this.parallaxStrenght;
    const offsetY = this.cameraOffsetCurrent.y * this.parallaxStrenght;

    this.camera?.position.set(
      this.cameraInitialPos.x + offsetX,
      this.cameraInitialPos.y - offsetY,
      this.cameraInitialPos.z
    );

    this.camera?.lookAt(0, 0, 0);
    // this.controls.update();
    // this.camera.position.z += 0.01;
    if (this.scene && this.camera)
      this.renderer?.render(this.scene, this.camera);
  }
}
