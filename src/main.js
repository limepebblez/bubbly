import * as THREE from 'three';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 18);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(ambientLight);

const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight1.position.set(10, 20, 15);
scene.add(dirLight1);

const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight2.position.set(-10, -10, -10);
scene.add(dirLight2);

const BASE_COLORS = [
  0xff0000, // red
  0x0066ff, // blue
  0x00cc44, // green
  0xffff00, // yellow
  0xff7700, // orange
  0x9933ff, // purple
  0xff66cc, // pink
  0x8b4513, // brown
  0x808080  // grey
];

const PALETTE = [...BASE_COLORS, 'glitter'];

const bubbles = [];

// Web Audio API Synthesizer for a cute bubble pop sound
let audioCtx = null;

function playBubblePopSound() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';

  // Cute pitch variation: fast upward pitch sweep
  const startFreq = 400 + Math.random() * 200;
  const endFreq = startFreq + 500 + Math.random() * 300;

  const now = audioCtx.currentTime;
  const duration = 0.08;

  osc.frequency.setValueAtTime(startFreq, now);
  osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration * 0.75);

  gain.gain.setValueAtTime(0.35, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + duration);
}

function createBubbleMaterial(colorHex) {
  return new THREE.MeshPhysicalMaterial({
    color: colorHex,
    transmission: 0.25,
    opacity: 0.95,
    transparent: true,
    roughness: 0.05,
    metalness: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    ior: 1.25
  });
}

function createGlitterParticles() {
  const particleCount = 180;
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = 0.92 * Math.cbrt(Math.random());

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.08,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending
  });

  return new THREE.Points(geometry, material);
}

function getScreenLimits(zPos, radius) {
  const distToCam = camera.position.z - zPos;
  const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * distToCam;
  
  const borderPadding = 28; 
  const innerRatioY = (window.innerHeight - borderPadding * 2) / window.innerHeight;
  const innerRatioX = (window.innerWidth - borderPadding * 2) / window.innerWidth;

  const limitY = Math.max(0, (halfH * innerRatioY) - radius);
  const limitX = Math.max(0, (halfH * camera.aspect * innerRatioX) - radius);

  return { limitX, limitY };
}

function spawnBubble() {
  playBubblePopSound(); // Play cute synth pop sound on spawn

  const radius = 0.7 + Math.random() * 0.3;
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const choice = PALETTE[Math.floor(Math.random() * PALETTE.length)];
  
  const isGlitter = choice === 'glitter';
  const colorHex = isGlitter ? BASE_COLORS[Math.floor(Math.random() * BASE_COLORS.length)] : choice;
  
  const material = createBubbleMaterial(colorHex);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.scale.set(radius, radius, radius);

  if (isGlitter) {
    const glitterParticles = createGlitterParticles();
    mesh.add(glitterParticles);
  }

  const zPos = (Math.random() - 0.5) * 4;
  const { limitX, limitY } = getScreenLimits(zPos, radius);

  mesh.position.set(
    (Math.random() - 0.5) * (limitX * 1.2),
    (Math.random() - 0.5) * (limitY * 1.2),
    zPos
  );

  const velocity = new THREE.Vector3(
    (Math.random() - 0.5) * 0.06,
    (Math.random() - 0.5) * 0.06,
    (Math.random() - 0.5) * 0.03
  );

  const colorRGB = new THREE.Color(colorHex);

  scene.add(mesh);
  bubbles.push({ mesh, radius, velocity, color: colorRGB, isGlitter });
}

function disposeMesh(bubble) {
  scene.remove(bubble.mesh);
  bubble.mesh.traverse((child) => {
    if (child.geometry) child.geometry.dispose();
    if (child.material) child.material.dispose();
  });
}

function mergeBubbles(b1, b2) {
  const v1 = Math.pow(b1.radius, 3);
  const v2 = Math.pow(b2.radius, 3);
  const vTotal = v1 + v2;

  const newRadius = Math.cbrt(vTotal);

  const newPos = new THREE.Vector3()
    .copy(b1.mesh.position).multiplyScalar(v1)
    .add(new THREE.Vector3().copy(b2.mesh.position).multiplyScalar(v2))
    .divideScalar(vTotal);

  const newVel = new THREE.Vector3()
    .copy(b1.velocity).multiplyScalar(v1)
    .add(new THREE.Vector3().copy(b2.velocity).multiplyScalar(v2))
    .divideScalar(vTotal);

  const r = (b1.color.r * v1 + b2.color.r * v2) / vTotal;
  const g = (b1.color.g * v1 + b2.color.g * v2) / vTotal;
  const b = (b1.color.b * v1 + b2.color.b * v2) / vTotal;
  const newColor = new THREE.Color(r, g, b);

  const hasGlitter = b1.isGlitter || b2.isGlitter;
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const material = createBubbleMaterial(newColor);
  
  const newMesh = new THREE.Mesh(geometry, material);
  newMesh.scale.set(newRadius, newRadius, newRadius);
  newMesh.position.copy(newPos);

  if (hasGlitter) {
    const glitterParticles = createGlitterParticles();
    newMesh.add(glitterParticles);
  }

  disposeMesh(b1);
  disposeMesh(b2);

  scene.add(newMesh);

  return { mesh: newMesh, radius: newRadius, velocity: newVel, color: newColor, isGlitter: hasGlitter };
}

function checkCollisions() {
  for (let i = 0; i < bubbles.length; i++) {
    for (let j = i + 1; j < bubbles.length; j++) {
      const b1 = bubbles[i];
      const b2 = bubbles[j];

      const dist = b1.mesh.position.distanceTo(b2.mesh.position);
      if (dist <= b1.radius + b2.radius) {
        const merged = mergeBubbles(b1, b2);
        bubbles[i] = merged;
        bubbles.splice(j, 1);
        return checkCollisions();
      }
    }
  }
}

function animate() {
  requestAnimationFrame(animate);

  for (const b of bubbles) {
    b.mesh.position.add(b.velocity);
    
    b.mesh.rotation.x += 0.005;
    b.mesh.rotation.y += 0.005;

    const { limitX, limitY } = getScreenLimits(b.mesh.position.z, b.radius);
    const limitZ = 3;

    if (Math.abs(b.mesh.position.x) > limitX) {
      b.mesh.position.x = Math.sign(b.mesh.position.x) * limitX;
      b.velocity.x *= -1;
    }

    if (Math.abs(b.mesh.position.y) > limitY) {
      b.mesh.position.y = Math.sign(b.mesh.position.y) * limitY;
      b.velocity.y *= -1;
    }

    if (Math.abs(b.mesh.position.z) > limitZ) {
      b.mesh.position.z = Math.sign(b.mesh.position.z) * limitZ;
      b.velocity.z *= -1;
    }
  }

  checkCollisions();
  renderer.render(scene, camera);
}

document.getElementById('spawn-btn').addEventListener('click', spawnBubble);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

spawnBubble();
animate();