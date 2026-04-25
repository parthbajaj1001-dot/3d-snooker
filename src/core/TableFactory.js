import * as THREE from 'three';
import { TABLE } from './Constants.js';

export class TableFactory {
  constructor(scene) {
    this.scene = scene;
    this.pocketPositions = [];
    this.create();
  }

  create() {
    const group = new THREE.Group();

    const borderGeo = new THREE.BoxGeometry(TABLE.width + 0.24, 0.15, TABLE.height + 0.24);
    const borderMat = new THREE.MeshStandardMaterial({ color: 0x4a2814, roughness: 0.33, metalness: 0.15 });
    const border = new THREE.Mesh(borderGeo, borderMat);
    border.position.y = -0.04;
    border.castShadow = true;
    border.receiveShadow = true;
    group.add(border);

    const clothGeo = new THREE.BoxGeometry(TABLE.width, 0.04, TABLE.height);
    const clothMat = new THREE.MeshStandardMaterial({
      color: 0x1e613a,
      roughness: 0.86,
      metalness: 0.02,
      emissive: 0x092814,
      emissiveIntensity: 0.3,
    });
    const cloth = new THREE.Mesh(clothGeo, clothMat);
    cloth.position.y = 0.01;
    cloth.receiveShadow = true;
    group.add(cloth);

    this.createPockets(group);
    this.scene.add(group);
  }

  createPockets(group) {
    const pocketGeo = new THREE.CylinderGeometry(TABLE.pocketRadius, TABLE.pocketRadius * 0.85, 0.05, 24);
    const pocketMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.8, metalness: 0.2 });

    const halfW = TABLE.width / 2;
    const halfH = TABLE.height / 2;
    const pocketPos = [
      [-halfW, -halfH],
      [0, -halfH],
      [halfW, -halfH],
      [-halfW, halfH],
      [0, halfH],
      [halfW, halfH],
    ];

    pocketPos.forEach(([x, z]) => {
      const pocket = new THREE.Mesh(pocketGeo, pocketMat);
      pocket.position.set(x, -0.02, z);
      pocket.rotation.x = Math.PI / 2;
      group.add(pocket);
      this.pocketPositions.push(new THREE.Vector2(x, z));
    });
  }
}
