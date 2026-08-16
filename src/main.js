import * as THREE from 'three';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  22,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 48);

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
  0xff0000, 0x0066ff, 0x00cc44, 0xffff00, 
  0xff7700, 0x9933ff, 0xff66cc, 0x8b4513, 0x808080
];

const PALETTE = [...BASE_COLORS, 'glitter'];

// Tool progression list ending with Michael Jackson
const TOOLS = [
  { name: 'Needle', icon: '🪡' },
  { name: 'Knife', icon: '🔪' },
  { name: 'Bazooka', icon: '🚀' },
  { name: 'Kitten', icon: '🐱' },
  { name: 'Puppy', icon: '🐶' },
  { name: 'Number 67', icon: '67', isText: true },
  { name: 'Car', icon: '🚗' },
  { name: 'Pacman', icon: 'ᗧ' },
  { name: 'Mario', icon: '🍄' },
  { name: 'Sonic', icon: '🦔' },
  { name: 'Michael Jackson', icon: '🕺' }
];

let currentToolIndex = 0;
let isToolActive = false;
let maxBubbleReached = false;

const bubbles = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let audioCtx = null;

function playSound(type = 'spawn') {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  const now = audioCtx.currentTime;

  if (type === 'spawn') {
    osc.type = 'sine';
    const startFreq = 400 + Math.random() * 200;
    const endFreq = startFreq + 500 + Math.random() * 300;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.06);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  } else if (type === 'pop') {
    // Satisfying burst sound when popping giant bubble
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }
}

// Generate dynamic custom SVG cursors for each tool
function createToolCursor(tool) {
  let svg;
  if (tool.isText) {
    svg = `<svg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 44 44'><text y='30' font-size='26' font-weight='900' fill='%23d32f2f'>67</text></svg>`;
  } else {
    svg = `<svg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 44 44'><text y='32' font-size='30'>${tool.icon}</text></svg>`;
  }
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}") 16 16, crosshair`;
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

const spawnBtn = document.getElementById('spawn-btn');
const toolBtn = document.getElementById('tool-btn');
const victoryScreen = document.getElementById('victory-screen');
const restartBtn = document.getElementById('restart-btn');

function updateToolUI() {
  if (maxBubbleReached && currentToolIndex < TOOLS.length) {
    const tool = TOOLS[currentToolIndex];
    toolBtn.textContent = `${tool.icon} Pop with ${tool.name}`;
    toolBtn.classList.remove('hidden');
    spawnBtn.disabled = true;
  } else {
    toolBtn.classList.add('hidden');
    spawnBtn.disabled = false;
  }
}

function spawnBubble() {
  if (maxBubbleReached) return;
  playSound('spawn');

  const radius = 0.7 + Math.random() * 0.3;
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const choice = PALETTE[Math.floor(Math.random() * PALETTE.length)];
  const isGlitter = choice === 'glitter';
  const colorHex = isGlitter ? BASE_COLORS[Math.floor(Math.random() * BASE_COLORS.length)] : choice;

  const material = createBubbleMaterial(colorHex);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.scale.set(radius, radius, radius);

  if (isGlitter) mesh.add(createGlitterParticles());

  const zPos = (Math.random() - 0.5) * 4;
  const { limitX, limitY } = getScreenLimits(zPos, radius);
  mesh.position.set((Math.random() - 0.5) * limitX * 1.2, (Math.random() - 0.5) * limitY * 1.2, zPos);

  const velocity = new THREE.Vector3(
    (Math.random() - 0.5) * 0.06,
    (Math.random() - 0.5) * 0.06,
    (Math.random() - 0.5) * 0.03
  );

  scene.add(mesh);
  bubbles.push({ mesh, radius, velocity, color: new THREE.Color(colorHex), isGlitter });
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

  const newPos = new THREE.Vector3().copy(b1.mesh.position).multiplyScalar(v1)
    .add(new THREE.Vector3().copy(b2.mesh.position).multiplyScalar(v2)).divideScalar(vTotal);
  const newVel = new THREE.Vector3().copy(b1.velocity).multiplyScalar(v1)
    .add(new THREE.Vector3().copy(b2.velocity).multiplyScalar(v2)).divideScalar(vTotal);

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

  if (hasGlitter) newMesh.add(createGlitterParticles());

  disposeMesh(b1);
  disposeMesh(b2);

  scene.add(newMesh);

  // Trigger max bubble tool state when radius gets large (>= 2.5) or single merged bubble
  if (newRadius >= 2.3) {
    maxBubbleReached = true;
    updateToolUI();
  }

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

// Tool button click: Turn cursor into current tool
toolBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  isToolActive = true;
  document.body.style.cursor = createToolCursor(TOOLS[currentToolIndex]);
});

// Canvas click handling for popping bubbles with tool
window.addEventListener('pointerdown', (e) => {
  if (!isToolActive || bubbles.length === 0) return;

  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(bubbles.map(b => b.mesh));

  if (intersects.length > 0) {
    const poppedMesh = intersects[0].object;
    const index = bubbles.findIndex(b => b.mesh === poppedMesh);
    if (index !== -1) {
      playSound('pop');
      disposeMesh(bubbles[index]);
      bubbles.splice(index, 1);

      // Reset tool cursor and state
      document.body.style.cursor = 'default';
      isToolActive = false;
      maxBubbleReached = false;
      currentToolIndex++;

      // Check for completion after Michael Jackson pops the last bubble
      if (currentToolIndex >= TOOLS.length) {
        triggerVictory();
      } else {
        updateToolUI();
      }
    }
  }
});

// Confetti Particle Explosion Generator
function triggerVictory() {
  updateToolUI();
  victoryScreen.classList.remove('hidden');

  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#ff0055', '#00cc44', '#0066ff', '#ffff00', '#ff7700', '#9933ff'];

  for (let i = 0; i < 150; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 10 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      vy: Math.random() * 5 + 3,
      vx: (Math.random() - 0.5) * 3,
      rot: Math.random() * 360
    });
  }

  function renderConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
      p.y += p.vy;
      p.x += p.vx;
      p.rot += 4;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
      if (p.y > canvas.height) p.y = -20;
    }
    if (!victoryScreen.classList.contains('hidden')) {
      requestAnimationFrame(renderConfetti);
    }
  }
  renderConfetti();
}

restartBtn.addEventListener('click', () => {
  victoryScreen.classList.add('hidden');
  currentToolIndex = 0;
  maxBubbleReached = false;
  updateToolUI();
});

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

spawnBtn.addEventListener('click', spawnBubble);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

spawnBubble();
animate();