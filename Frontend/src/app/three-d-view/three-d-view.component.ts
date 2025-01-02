import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';
import {
  EffectComposer,
  FXAAShader,
  OrbitControls,
  OutputPass,
  RenderPass,
  RGBELoader,
  ShaderPass,
  SSAARenderPass,
} from 'three/examples/jsm/Addons.js';
import normalizeWheel from 'normalize-wheel';
import { Sky } from 'three/addons/objects/Sky.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export type Value = { min: number; max: number };

@Component({
  selector: 'app-three-d-view',
  standalone: true,
  imports: [],
  templateUrl: './three-d-view.component.html',
  styleUrl: './three-d-view.component.scss',
})
export class ThreeDViewComponent implements OnInit, OnDestroy {
  @ViewChild('canvasContainer', { static: true })
  canvasContainer!: ElementRef<HTMLDivElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private cube!: THREE.Mesh;
  private canMove = false;
  private textureLoader!: THREE.TextureLoader;
  private gltfLoader!: GLTFLoader;
  private currentTime!: number;
  private previousTime!: number;
  private controls!: OrbitControls;
  private composer!: EffectComposer;
  private fxaaPass!: ShaderPass;
  private ssaaRenderPass!: SSAARenderPass;

  private spherical!: {
    value: THREE.Spherical;
    smoothed: THREE.Spherical;
    smoothing: number;
    limits: { radius: Value; phi: Value; theta: Value };
    delta: number;
    updateTheta: (valueToAdd: number) => void;
    updatePhi: (valueToAdd: number) => void;
    zoom: (_delta: number) => void;
  };

  private drag!: {
    delta: THREE.Vector2;
    previous: THREE.Vector2;
    sensitivity: number;
    down: (x: number, y: number) => void;
    move: (x: number, y: number) => void;
    up: () => void;
    getTheta: (size: { width: number; height: number }) => number;
    getPhi: (size: { width: number; height: number }) => number;
    resetDelta: () => void;
  };

  private target!: {
    value: THREE.Vector3;
    smoothed: THREE.Vector3;
    smoothing: number;
    limits: { x: Value; y: Value; z: Value };
  };

  // #region Event functions
  private onWheel: (event: WheelEvent) => void;
  private onMouseMove!: (event: MouseEvent) => void;
  private onMouseUp!: (event: MouseEvent) => void;
  private onMouseDown!: (event: MouseEvent) => void;
  private onContextMenu!: (event: Event) => void;
  // #region Mobile Events
  private onTouchMove!: (event: TouchEvent) => void;
  private onTouchStart!: (event: TouchEvent) => void;
  private onTouchEnd!: () => void;
  // #endregion
  // #endregion

  private updateControls!: (delta: number) => void;
  constructor() {
    this.spherical = {
      value: new THREE.Spherical(60, Math.PI * 0.35, Math.PI * 0.25),
      smoothed: new THREE.Spherical(20, Math.PI * 0.35, -Math.PI * 0.25),
      smoothing: 1,
      limits: {
        radius: { min: 40, max: 60 },
        phi: { min: 0.5, max: Math.PI * 0.4 },
        theta: { min: 0, max: Math.PI * 0.5 },
      },
      delta: 0,
      updateTheta: (valueToAdd: number) => {
        this.spherical.value.theta += valueToAdd;
      },
      updatePhi: (valueToAdd: number) => {
        this.spherical.value.phi -= valueToAdd;
      },
      zoom: (_delta: number) => {
        this.spherical.delta += _delta;
      },
    };

    this.drag = {
      delta: new THREE.Vector2(0, 0),
      previous: new THREE.Vector2(0, 0),
      sensitivity: 1,
      down: function (x, y) {
        this.previous.x = x;
        this.previous.y = y;
      },
      move: function (x, y) {
        this.delta.x += x - this.previous.x;
        this.delta.y += y - this.previous.y;
        this.previous.x = x;
        this.previous.y = y;
      },
      up: () => {},
      getTheta: function (size) {
        return (
          (this.delta.x * this.sensitivity || 0) /
          Math.min(size.width, size.height)
        );
      },
      getPhi: function (size) {
        return (
          (this.delta.y * this.sensitivity || 0) /
          Math.min(size.width, size.height)
        );
      },
      resetDelta: function () {
        this.delta.x = 0;
        this.delta.y = 0;
      },
    };

    this.target = {
      value: new THREE.Vector3(0, 2, 0),
      smoothed: new THREE.Vector3(0, 2, 0),
      smoothing: 5,
      limits: {
        x: { min: -4, max: 4 },
        y: { min: 1, max: 4 },
        z: { min: -4, max: 4 },
      },
    };

    this.previousTime = Date.now();

    // #region Events
    // #region For Desktop
    this.onWheel = (event) => {
      const normalized = normalizeWheel(event);
      this.spherical.zoom(normalized.pixelY);
      event.preventDefault();
    };
    this.onMouseMove = (event) => {
      this.drag.move(event.clientX, event.clientY);
    };
    this.onMouseUp = () => {
      window.removeEventListener('mouseup', this.onMouseUp);
      window.removeEventListener('mousemove', this.onMouseMove);
    };
    this.onMouseDown = (event) => {
      this.canMove = !event.button;
      this.drag.down(event.clientX, event.clientY);

      window.addEventListener('mouseup', this.onMouseUp);
      window.addEventListener('mousemove', this.onMouseMove);
    };
    this.onContextMenu = (event) => event.preventDefault();
    // #endregion

    // #region For mobile
    this.onTouchMove = (event) => {
      this.drag.move(event.touches[0].clientX, event.touches[0].clientY);
    };

    this.onTouchStart = (event) => {
      this.drag.down(event.touches[0].clientX, event.touches[0].clientY);

      window.addEventListener('touchend', this.onTouchEnd);
      window.addEventListener('touchmove', this.onTouchMove);
    };

    this.onTouchEnd = () => {
      window.removeEventListener('touchend', this.onTouchEnd);
      window.removeEventListener('touchmove', this.onTouchMove);
    };
    // #endregion
    // #endregion
  }

  ngOnInit(): void {
    // #region Add event listeners
    window.addEventListener('wheel', this.onWheel, { passive: false });
    window.addEventListener('touchstart', this.onTouchStart);
    window.addEventListener('contextmenu', this.onContextMenu, {
      passive: false,
    });
    window.addEventListener('mousedown', this.onMouseDown);
    // #endregion
    this.updateControls = (delta) => {
      this.spherical.value.radius += this.spherical.delta * 0.01;
      this.spherical.value.radius = Math.min(
        Math.max(this.spherical.value.radius, this.spherical.limits.radius.min),
        this.spherical.limits.radius.max
      );

      if (this.canMove) {
        const size = {
          width: window.innerWidth,
          height: window.innerHeight,
        };
        const theta = this.drag.getTheta(size);
        const phi = this.drag.getPhi(size);

        this.spherical.updateTheta(-theta);
        this.spherical.updatePhi(phi);

        // Apply limits
        this.spherical.value.theta = Math.min(
          Math.max(this.spherical.value.theta, this.spherical.limits.theta.min),
          this.spherical.limits.theta.max
        );
        this.spherical.value.phi = Math.min(
          Math.max(this.spherical.value.phi, this.spherical.limits.phi.min),
          this.spherical.limits.phi.max
        );
      }
      // else {
      //   const up = new THREE.Vector3(0, 1, 0);
      //   const right = new THREE.Vector3(-1, 0, 0);

      //   up.applyQuaternion(this.camera.quaternion);
      //   right.applyQuaternion(this.camera.quaternion);

      //   up.multiplyScalar(this.drag.delta.y * 0.01);
      //   right.multiplyScalar(this.drag.delta.x * 0.01);

      //   this.target.value.add(up);
      //   this.target.value.add(right);

      //   // Apply Limits
      //   this.target.value.x = Math.min(
      //     Math.max(this.target.value.x, this.target.limits.x.min),
      //     this.target.limits.x.max
      //   );
      //   this.target.value.y = Math.min(
      //     Math.max(this.target.value.y, this.target.limits.y.min),
      //     this.target.limits.y.max
      //   );

      //   this.target.value.z = Math.min(
      //     Math.max(this.target.value.z, this.target.limits.z.min),
      //     this.target.limits.z.max
      //   );
      // }

      this.drag.resetDelta();
      this.spherical.delta = 0;

      // smoothing
      this.target.smoothed.x = THREE.MathUtils.damp(
        this.target.smoothed.x,
        this.target.value.x,
        this.target.smoothing,
        delta
      );

      this.target.smoothed.y = THREE.MathUtils.damp(
        this.target.smoothed.y,
        this.target.value.y,
        this.target.smoothing,
        delta
      );

      this.target.smoothed.y = THREE.MathUtils.damp(
        this.target.smoothed.z,
        this.target.value.z,
        this.target.smoothing,
        delta
      );

      this.spherical.smoothed.radius = THREE.MathUtils.damp(
        this.spherical.smoothed.radius,
        this.spherical.value.radius,
        this.spherical.smoothing,
        delta
      );

      this.spherical.smoothed.phi = THREE.MathUtils.damp(
        this.spherical.smoothed.phi,
        this.spherical.value.phi,
        this.spherical.smoothing,
        delta
      );

      this.spherical.smoothed.theta = THREE.MathUtils.damp(
        this.spherical.smoothed.theta,
        this.spherical.value.theta,
        this.spherical.smoothing,
        delta
      );

      const viewPosition = new THREE.Vector3();
      viewPosition.setFromSpherical(this.spherical.smoothed);
      viewPosition.add(this.target.smoothed);
      this.camera.position.copy(viewPosition);
      this.camera.lookAt(this.target.smoothed);
    };
    this.initThreeJs();
    this.tick();
  }

  ngOnDestroy(): void {
    window.removeEventListener('wheel', this.onWheel);
    window.removeEventListener('touchstart', this.onTouchStart);
    window.removeEventListener('contextmenu', this.onContextMenu);
  }

  private initThreeJs(): void {
    const container = this.canvasContainer.nativeElement;

    // Create the scene
    this.scene = new THREE.Scene();
    // this.scene.background = new THREE.Color(0xffffff);
    this.camera = new THREE.PerspectiveCamera(
      45,
      container.offsetWidth / container.offsetHeight,
      0.1,
      200
    );

    // new RGBELoader().load('2.hdr', (envMap) => {
    //   envMap.mapping = THREE.EquirectangularReflectionMapping;
    //   this.scene.background = envMap;
    //   this.scene.environment = envMap;
    // });

    // Remove or comment out:
    // this.scene.background = envMap;
    // this.scene.environment = envMap;

    new RGBELoader().load('2.hdr', (envMap) => {
      envMap.mapping = THREE.EquirectangularReflectionMapping;

      // Create a large sphere geometry
      const sphereGeo = new THREE.SphereGeometry(100, 60, 40);

      // Create a material using the HDR as a texture
      const sphereMat = new THREE.MeshBasicMaterial({
        map: envMap,
        side: THREE.BackSide, // We are inside the sphere, so we render the inside
      });

      // Create a mesh from the geometry and material
      const environmentSphere = new THREE.Mesh(sphereGeo, sphereMat);

      // Add the sphere to the scene
      this.scene.add(environmentSphere);

      // If needed, adjust the sphere's scale to make it appear "smaller" or "larger"
      // environmentSphere.scale.set(0.5, 0.5, 0.5); // for example, to make it appear smaller
    });

    // Create the renderer
    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(container.offsetWidth, container.offsetHeight);
    this.renderer.setPixelRatio(pixelRatio);
    // this.renderer.autoClear = false;
    const renderPass = new RenderPass(this.scene, this.camera);
    renderPass.clearAlpha = 0;

    this.fxaaPass = new ShaderPass(FXAAShader);
    this.ssaaRenderPass = new SSAARenderPass(this.scene, this.camera);

    this.fxaaPass.material.uniforms['resolution'].value.x =
      1 / (container.offsetWidth * pixelRatio);

    this.fxaaPass.material.uniforms['resolution'].value.y =
      1 / (container.offsetHeight * pixelRatio);

    const outputPass = new OutputPass();
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.composer = new EffectComposer(this.renderer);

    this.composer.addPass(renderPass);
    this.composer.addPass(outputPass);
    this.composer.addPass(this.fxaaPass);

    this.composer.setPixelRatio(1);

    container.appendChild(this.renderer.domElement);

    // Create a Cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

    this.cube = new THREE.Mesh(geometry, material);
    // this.scene.add(this.cube);

    this.scene.add(new THREE.AmbientLight());
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.loadModel();

    window.addEventListener('resize', () => this.onWindowResize());
  }

  private loadModel(): void {
    this.textureLoader = new THREE.TextureLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('draco/');
    this.gltfLoader = new GLTFLoader();
    this.gltfLoader.setDRACOLoader(dracoLoader);

    /**
     * Textures
     */

    const bakedTexture = this.textureLoader.load('textures/2.jpg');
    bakedTexture.colorSpace = THREE.SRGBColorSpace;
    bakedTexture.flipY = false;

    /**
     * Materials
     */

    const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture });

    /**
     * Model
     */

    this.gltfLoader.load('models/2.glb', (gltf) => {
      // gltf.scene.children.tra
      gltf.scene.scale.set(1.5, 1.5, 1.5);
      gltf.scene.traverse((child) => {
        const newChild = child as unknown as THREE.Mesh;
        if (newChild.isMesh) {
          newChild.material = bakedMaterial;
        }
      });
      this.scene.add(gltf.scene);
    });

    // this.gltfLoader.load('models/3.glb', (gltf) => {
    //   // gltf.scene.children.tra
    //   gltf.scene.traverse((child) => {
    //     const newChild = child as unknown as THREE.Mesh;
    //     if (newChild.isMesh) {
    //       // newChild.material = bakedMaterial;
    //       newChild.position.z -= 0.1;
    //     }
    //   });
    //   this.scene.add(gltf.scene);
    // });
  }

  private tick(): void {
    requestAnimationFrame(() => this.tick());
    const delta = (Date.now() - this.previousTime) / 100;
    this.previousTime = Date.now();
    this.updateControls(delta);
    // this.controls.update();

    this.ssaaRenderPass.clearColor = 0xffffff;
    this.ssaaRenderPass.clearAlpha = 1.0;
    this.ssaaRenderPass.sampleLevel = 3;
    this.ssaaRenderPass.unbiased = true;

    // this.renderer.render(this.scene, this.camera);
    this.composer.render();
  }

  private addSky(): void {
    const sky = new Sky();
    sky.scale.setScalar(10000);
    this.scene.add(sky);

    const skyUniforms = sky.material.uniforms;

    skyUniforms['turbidity'].value = 10;
    skyUniforms['rayleigh'].value = 2;
    skyUniforms['mieCoefficient'].value = 0.005;
    skyUniforms['mieDirectionalG'].value = 0.8;
  }

  private onWindowResize(): void {
    const container = this.canvasContainer.nativeElement;
    this.camera.aspect = container.offsetWidth / container.offsetHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.offsetWidth, container.offsetHeight);
  }
}
