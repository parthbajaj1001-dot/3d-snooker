import * as THREE from 'three';

export class SceneManager {
  constructor(container) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x090b10);
    this.scene.fog = new THREE.Fog(0x090b10, 3, 15);

    this.camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.01, 100);
    this.camera.position.set(0, 2.4, 2.6);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    container.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock();
    this.setupLights();
    this.setupArena();

    window.addEventListener('resize', this.onResize);
  }

  setupLights() {
    const hemi = new THREE.HemisphereLight(0x77aaff, 0x080906, 0.28);
    this.scene.add(hemi);

    const key = new THREE.SpotLight(0xfff7d8, 1.6, 18, Math.PI / 7, 0.34, 1.2);
    key.position.set(0, 5.6, 0);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.bias = -0.0001;
    this.scene.add(key);

    const rimL = new THREE.PointLight(0x5fa8ff, 0.6, 12, 2);
    rimL.position.set(-2, 1.5, -1.5);
    const rimR = new THREE.PointLight(0xe4ad3f, 0.55, 12, 2);
    rimR.position.set(2, 1.2, 1.5);

    this.scene.add(rimL, rimR);
  }

  setupArena() {
    const floorGeo = new THREE.CircleGeometry(10, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x111317,
      roughness: 0.95,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.08;
    floor.receiveShadow = true;
    this.scene.add(floor);

    const ringGeo = new THREE.TorusGeometry(3.2, 0.04, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({ emissive: 0x6b8c3b, color: 0x1b2d13, roughness: 0.3, metalness: 0.6 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.02;
    this.scene.add(ring);
  }

  onResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  getDelta() {
    return Math.min(this.clock.getDelta(), 0.032);
  }

  dispose() {
    window.removeEventListener('resize', this.onResize);
    this.renderer.dispose();
  }
}
