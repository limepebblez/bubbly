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

const TOOLS = [
  { 
    name: 'Needle', 
    label: '🪡',
    svg: `<svg viewBox="0 0 100 100"><path d="M75 10 L85 20 L35 70 L20 80 L30 65 Z" fill="#c0c0c0" stroke="#777" stroke-width="2"/><circle cx="78" cy="17" r="3" fill="#333"/><path d="M78 17 Q90 5 95 25" fill="none" stroke="#ff0055" stroke-width="3"/></svg>`
  },
  { 
    name: 'Knife', 
    label: '🔪',
    svg: `<svg viewBox="0 0 100 100"><path d="M20 75 L35 60 L75 20 C85 20 85 45 60 55 L30 85 Z" fill="#e0e0e0" stroke="#999" stroke-width="2"/><rect x="15" y="70" width="20" height="15" rx="3" transform="rotate(-45 25 77)" fill="#5c3a21"/></svg>`
  },
  { 
    name: 'Bazooka', 
    label: '🚀',
    svg: `<svg viewBox="0 0 100 100"><rect x="15" y="40" width="60" height="20" rx="4" fill="#2d4a22"/><polygon points="75,35 95,50 75,65" fill="#d32f2f"/><polygon points="15,35 5,40 5,60 15,65" fill="#1b3313"/><rect x="40" y="60" width="10" height="20" fill="#1b3313"/></svg>`
  },
  { 
    name: 'Kitten', 
    label: '🐱',
    svg: `<svg viewBox="0 0 100 100"><polygon points="20,40 35,10 45,42" fill="#ff9800"/><polygon points="80,40 65,10 55,42" fill="#ff9800"/><circle cx="50" cy="55" r="32" fill="#ffb74d"/><circle cx="38" cy="50" r="6" fill="#2e7d32"/><circle cx="62" cy="50" r="6" fill="#2e7d32"/><polygon points="50,60 45,64 55,64" fill="#e91e63"/><path d="M20 58 L5 55 M20 62 L5 65 M80 58 L95 55 M80 62 L95 65" stroke="#fff" stroke-width="3"/></svg>`
  },
  { 
    name: 'Puppy', 
    label: '🐶',
    svg: `<svg viewBox="0 0 100 100"><ellipse cx="20" cy="35" rx="12" ry="25" fill="#6d4c41"/><ellipse cx="80" cy="35" rx="12" ry="25" fill="#6d4c41"/><circle cx="50" cy="50" r="30" fill="#8d6e63"/><ellipse cx="50" cy="62" rx="16" ry="12" fill="#d7ccc8"/><circle cx="38" cy="45" r="5" fill="#000"/><circle cx="62" cy="45" r="5" fill="#000"/><ellipse cx="50" cy="58" rx="6" ry="4" fill="#000"/></svg>`
  },
  { 
    name: 'Number 67', 
    label: '67',
    svg: `<svg viewBox="0 0 100 100"><rect x="5" y="5" width="90" height="90" rx="20" fill="#d32f2f"/><text x="50" y="68" font-size="52" font-weight="900" fill="#fff" text-anchor="middle" font-family="sans-serif">67</text></svg>`
  },
  { 
    name: 'Car', 
    label: '🚗',
    svg: `<svg viewBox="0 0 100 100"><path d="M15 55 Q25 30 40 28 L65 28 Q80 30 88 55 Z" fill="#e53935"/><rect x="10" y="50" width="82" height="22" rx="8" fill="#c62828"/><circle cx="28" cy="72" r="10" fill="#333"/><circle cx="28" cy="72" r="4" fill="#ccc"/><circle cx="72" cy="72" r="10" fill="#333"/><circle cx="72" cy="72" r="4" fill="#ccc"/><polygon points="42,33 60,33 63,50 38,50" fill="#b3e5fc"/></svg>`
  },
  { 
    name: 'Pacman', 
    label: 'ᗧ',
    svg: `<svg viewBox="0 0 100 100"><path d="M 50,50 L 92,26 A 42,42 0 1,0 92,74 Z" fill="#ffeb3b"/><circle cx="50" cy="24" r="5" fill="#000"/></svg>`
  },
  { 
    name: 'Mario', 
    label: '🍄',
    svg: `<svg viewBox="0 0 100 100"><path d="M 10 50 A 40 40 0 0 1 90 50 Z" fill="#d32f2f"/><rect x="10" y="50" width="80" height="12" fill="#d32f2f"/><circle cx="50" cy="38" r="15" fill="#fff"/><text x="50" y="44" font-size="18" font-weight="900" fill="#d32f2f" text-anchor="middle">M</text></svg>`
  },
  { 
    name: 'Sonic', 
    label: '🦔',
    svg: `<svg viewBox="0 0 100 100"><path d="M 15 70 L 35 20 L 55 45 L 75 15 L 85 60 Z" fill="#1565c0"/><circle cx="50" cy="55" r="28" fill="#1976d2"/><ellipse cx="50" cy="65" rx="18" ry="12" fill="#ffe0b2"/><circle cx="60" cy="48" r="6" fill="#fff"/><circle cx="62" cy="48" r="3" fill="#000"/><ellipse cx="66" cy="60" rx="4" ry="3" fill="#000"/></svg>`
  },
  { 
    name: 'Michael Jackson', 
    label: '🕺',
    svg: `<svg viewBox="0 0 100 100"><path d="M 10 45 Q 50 35 90 45 L 75 40 Q 50 15 25 40 Z" fill="#111"/><rect x="30" y="38" width="40" height="6" fill="#d32f2f"/><path d="M 40 55 L 65 55 L 70 85 L 35 85 Z" fill="#fff" stroke="#ccc"/><circle cx="45" cy="65" r="2" fill="#999"/><circle cx="58" cy="72" r="2" fill="#999"/></svg>`
  }
];

const POPS_PER_TOOL = 10;
const SPAWNS_TO_UNLOCK = 20;

let spawnCount = 0;
let currentToolIndex = 0;
let popsWithCurrentTool = 0;
let isToolActive = false;
let toolsUnlocked = false;

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
const customCursor = document.getElementById('custom-cursor');
const victoryScreen = document.getElementById('victory-screen');
const restartBtn = document.getElementById('restart-btn');

function updateToolUI() {
  if (toolsUnlocked && currentToolIndex < TOOLS.length) {
    const tool = TOOLS[currentToolIndex];
    toolBtn.textContent = `${tool.label} ${tool.name} (${popsWithCurrentTool}/${POPS_PER_TOOL})`;
    toolBtn.classList.remove('hidden');
  } else {
    toolBtn.classList.add('hidden');
  }
}

function spawnBubble() {
  playSound('spawn');
  spawnCount++;

  if (!toolsUnlocked && spawnCount >= SPAWNS_TO_UNLOCK) {
    toolsUnlocked = true;
  }

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

  updateToolUI();
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

window.addEventListener('pointermove', (e) => {
  if (isToolActive) {
    customCursor.style.left = `${e.clientX}px`;
    customCursor.style.top = `${e.clientY}px`;
  }
});

toolBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  isToolActive = true;
  
  const currentTool = TOOLS[currentToolIndex];
  customCursor.innerHTML = currentTool.svg;
  customCursor.classList.remove('hidden');
  document.body.style.cursor = 'none';
});

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

      popsWithCurrentTool++;

      if (popsWithCurrentTool >= POPS_PER_TOOL) {
        popsWithCurrentTool = 0;
        currentToolIndex++;
        
        customCursor.classList.add('hidden');
        document.body.style.cursor = 'default';
        isToolActive = false;

        if (currentToolIndex >= TOOLS.length) {
          triggerVictory();
        }
      } else {
        // Update tool cursor image if tool is active
        const currentTool = TOOLS[currentToolIndex];
        customCursor.innerHTML = currentTool.svg;
      }

      updateToolUI();
    }
  }
});

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
  spawnCount = 0;
  currentToolIndex = 0;
  popsWithCurrentTool = 0;
  toolsUnlocked = false;
  isToolActive = false;
  customCursor.classList.add('hidden');
  document.body.style.cursor = 'default';
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