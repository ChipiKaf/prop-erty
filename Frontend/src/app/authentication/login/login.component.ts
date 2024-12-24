import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertifyService } from '../../services/alertify.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormCardComponent } from '../../form-card/form-card.component';
import * as THREE from 'three';
import {
  DRACOLoader,
  GLTFLoader,
  OrbitControls,
} from 'three/examples/jsm/Addons.js';

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
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;

  // Loaders
  private gltfLoader!: GLTFLoader;
  private dracoLoader!: DRACOLoader;

  // Controls
  private controls!: OrbitControls;
  private cube!: THREE.Mesh;
  private city!: THREE.Mesh;

  // Parallax state
  private oldX: number = 0;
  private oldY: number = 0;
  private cameraInitialPos = new THREE.Vector3(10, 10, 10);
  private cameraOffsetCurrent = new THREE.Vector2(0, 0);
  private cameraOffsetTarget = new THREE.Vector2(0, 0);
  private parallaxStrenght = 5;

  constructor(
    private authService: AuthService,
    private alertify: AlertifyService,
    private router: Router
  ) {}

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
      const model = gltf.scene;
      gltf.scene.scale.set(1.5, 1.5, 1.5);
      // console.log(model)
      // this.scene.add(model.children);
      // if (!model) return;
      model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: mesh.name !== 'Plane001',
          });
        }
      });
      this.scene.add(model);
    });
  }

  private onPointerMove(ev: PointerEvent) {
    const x = ev.clientX / window.innerWidth - 0.5;
    const y = ev.clientY / innerHeight - 0.5;
    this.cameraOffsetTarget.set(x, y);
  }

  private onWindowResize() {
    const container = this.canvasContainer.nativeElement;
    this.camera.aspect = container.offsetWidth / container.offsetHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.offsetWidth, container.offsetHeight);
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
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.cameraOffsetCurrent.lerp(this.cameraOffsetTarget, 0.05);
    const offsetX = this.cameraOffsetCurrent.x * this.parallaxStrenght;
    const offsetY = this.cameraOffsetCurrent.y * this.parallaxStrenght;

    this.camera.position.set(
      this.cameraInitialPos.x + offsetX,
      this.cameraInitialPos.y - offsetY,
      this.cameraInitialPos.z
    );

    this.camera.lookAt(0, 0, 0);
    // this.controls.update();
    // this.camera.position.z += 0.01;
    this.renderer.render(this.scene, this.camera);
  }

  onLogin(loginForm: NgForm) {
    console.log(loginForm.value);
    // const token = this.authService.authUser(loginForm.value);
    // this.authService.authUser(loginForm.value).subscribe(
    // (response: UserForLogin) => {
    //     console.log(response);
    //     const user = response;
    //     if (user) {
    //         localStorage.setItem('token', user.token);
    //         localStorage.setItem('userName', user.userName);
    //         this.alertify.success('Login Successful');
    //         this.router.navigate(['/']);
    //     }
    // }
    // );
  }
}
