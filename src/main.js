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
    html: `<span class="emoji-cursor">🪡</span>`
  },
  { 
    name: 'Knife', 
    label: '🔪',
    html: `<svg viewBox="0 0 100 100"><path d="M20 75 L35 60 L75 20 C85 20 85 45 60 55 L30 85 Z" fill="#e0e0e0" stroke="#999" stroke-width="2"/><rect x="15" y="70" width="20" height="15" rx="3" transform="rotate(-45 25 77)" fill="#5c3a21"/></svg>`
  },
  { 
    name: 'Flower', 
    label: '🌸',
    html: `<img src="/flower.jpg?v=2" alt="Flower" class="flower-cursor" />`
  },
  { 
    name: 'Kitten', 
    label: '🐱',
    html: `<svg viewBox="0 0 100 100"><defs><radialGradient id="catEye" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#c0ca33"/><stop offset="70%" stop-color="#388e3c"/><stop offset="100%" stop-color="#1b5e20"/></radialGradient><linearGradient id="catFur" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ffe0b2"/><stop offset="50%" stop-color="#ffb74d"/><stop offset="100%" stop-color="#f57c00"/></linearGradient></defs><path d="M 12 40 L 28 5 L 48 35 Z" fill="url(#catFur)" stroke="#e65100" stroke-width="1.5"/><path d="M 18 36 L 28 12 L 42 33 Z" fill="#ffb6c1"/><path d="M 88 40 L 72 5 L 52 35 Z" fill="url(#catFur)" stroke="#e65100" stroke-width="1.5"/><path d="M 82 36 L 72 12 L 58 33 Z" fill="#ffb6c1"/><ellipse cx="50" cy="56" rx="38" ry="32" fill="url(#catFur)" stroke="#e65100" stroke-width="1.5"/><path d="M 50 26 L 50 36 M 42 28 L 45 36 M 58 28 L 55 36" stroke="#d84315" stroke-width="2.5" stroke-linecap="round"/><ellipse cx="42" cy="65" rx="12" ry="9" fill="#fff8e7"/><ellipse cx="58" cy="65" rx="12" ry="9" fill="#fff8e7"/><ellipse cx="33" cy="48" rx="8" ry="11" fill="url(#catEye)"/><ellipse cx="67" cy="48" rx="8" ry="11" fill="url(#catEye)"/><ellipse cx="33" cy="48" rx="2.5" ry="9" fill="#000"/><ellipse cx="67" cy="48" rx="2.5" ry="9" fill="#000"/><circle cx="31" cy="44" r="2.5" fill="#fff"/><circle cx="65" cy="44" r="2.5" fill="#fff"/><polygon points="46,59 54,59 50,65" fill="#ff80ab"/><path d="M 44 67 Q 50 72 50 66 Q 50 72 56 67" fill="none" stroke="#5d4037" stroke-width="2" stroke-linecap="round"/><path d="M 28 62 L 2 58 M 26 66 L 2 66 M 28 70 L 4 74 M 72 62 L 98 58 M 74 66 L 98 66 M 72 70 L 96 74" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/></svg>`
  },
  { 
    name: 'Puppy', 
    label: '🐶',
    html: `<svg viewBox="0 0 100 100"><defs><linearGradient id="dogFur" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#d7ccc8"/><stop offset="40%" stop-color="#a1887f"/><stop offset="100%" stop-color="#6d4c41"/></linearGradient><linearGradient id="earFur" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#5d4037"/><stop offset="100%" stop-color="#3e2723"/></linearGradient></defs><path d="M 24 30 C 5 30 2 65 18 80 C 28 85 30 60 28 40 Z" fill="url(#earFur)"/><path d="M 76 30 C 95 30 98 65 82 80 C 72 85 70 60 72 40 Z" fill="url(#earFur)"/><ellipse cx="50" cy="48" rx="34" ry="30" fill="url(#dogFur)"/><ellipse cx="50" cy="62" rx="20" ry="16" fill="#f5f5f5"/><circle cx="34" cy="44" r="7" fill="#212121"/><circle cx="66" cy="44" r="7" fill="#212121"/><circle cx="32" cy="41" r="2.5" fill="#fff"/><circle cx="64" cy="41" r="2.5" fill="#fff"/><ellipse cx="34" cy="33" rx="5" ry="3" fill="#d7ccc8"/><ellipse cx="66" cy="33" rx="5" ry="3" fill="#d7ccc8"/><path d="M 42 56 Q 50 52 58 56 C 60 63 40 63 42 56 Z" fill="#111"/><ellipse cx="47" cy="56" rx="2" ry="1" fill="#fff" opacity="0.6"/><path d="M 44 64 Q 50 68 56 64" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round"/><path d="M 47 66 Q 50 77 53 66 Z" fill="#ff5252"/></svg>`
  },
  { 
    name: 'Number 67', 
    label: '67',
    html: `<svg viewBox="0 0 100 100"><rect x="5" y="5" width="90" height="90" rx="20" fill="#d32f2f"/><text x="50" y="68" font-size="52" font-weight="900" fill="#fff" text-anchor="middle" font-family="sans-serif">67</text></svg>`
  },
  { 
    name: 'Car', 
    label: '🚗',
    html: `<svg viewBox="0 0 100 100"><path d="M15 55 Q25 30 40 28 L65 28 Q80 30 88 55 Z" fill="#e53935"/><rect x="10" y="50" width="82" height="22" rx="8" fill="#c62828"/><circle cx="28" cy="72" r="10" fill="#333"/><circle cx="28" cy="72" r="4" fill="#ccc"/><circle cx="72" cy="72" r="10" fill="#333"/><circle cx="72" cy="72" r="4" fill="#ccc"/><polygon points="42,33 60,33 63,50 38,50" fill="#b3e5fc"/></svg>`
  },
  { 
    name: 'Pacman', 
    label: 'ᗧ',
    html: `<svg viewBox="0 0 100 100"><path d="M 50,50 L 95,15 A 45,45 0 1,0 95,85 Z" fill="#ffeb3b"/><circle cx="52" cy="22" r="5.5" fill="#000"/></svg>`,
    htmlChomp: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#ffeb3b"/><circle cx="65" cy="25" r="5.5" fill="#000"/><line x1="50" y1="50" x2="95" y2="50" stroke="#d4b200" stroke-width="3"/></svg>`
  },
  { 
    name: 'Mario', 
    label: '👨🏻‍🔧',
    html: `<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3KxjaxaMIXy9i_Ld6U8BN-348wXgUaaeXS4xwI2CuXoZRWJJskQQIxDAH&s=10" alt="Mario" class="avatar-cursor" />`
  },
  { 
    name: 'Sonic', 
    label: '🦔',
    html: `<img src="https://i.pinimg.com/originals/df/2d/a0/df2da022dcb517b28ef617f572031486.jpg" alt="Sonic" class="avatar-cursor" />`
  },
  { 
    name: 'Michael Jackson', 
    label: '🕺',
    html: `<img src="/mj.jpg" alt="Michael Jackson" class="avatar-cursor" />`
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

// 5-Second Retro NES 8-Bit Victory Fanfare Synthesizer
function playRetroVictoryFanfare() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const startTime = audioCtx.currentTime + 0.05;
  const noteFreq = (m) => 440 * Math.pow(2, (m - 69) / 12);

  // Lead melody channel [MIDI Note, Delay, Duration]
  const melody = [
    [60, 0.0, 0.1],   // C4
    [64, 0.1, 0.1],   // E4
    [67, 0.2, 0.1],   // G4
    [72, 0.3, 0.25],  // C5

    [65, 0.6, 0.1],   // F4
    [69, 0.7, 0.1],   // A4
    [72, 0.8, 0.1],   // C5
    [77, 0.9, 0.25],  // F5

    [67, 1.2, 0.1],   // G4
    [71, 1.3, 0.1],   // B4
    [74, 1.4, 0.1],   // D5
    [79, 1.5, 0.25],  // G5

    [72, 1.85, 0.15], // C5
    [72, 2.05, 0.15], // C5
    [72, 2.25, 0.15], // C5
    [84, 2.45, 2.3],  // C6 (Grand final held note)

    // Triad chord extensions on final note
    [76, 2.45, 2.3],  // E5
    [79, 2.45, 2.3]   // G5
  ];

  // Triangle Bassline
  const bass = [
    [48, 0.0, 0.55],  // C3
    [53, 0.6, 0.55],  // F3
    [55, 1.2, 0.60],  // G3
    [48, 1.85, 2.9]   // C3
  ];

  // Play Square Wave Chiptune Lead
  melody.forEach(([note, delay, duration]) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(noteFreq(note), startTime + delay);

    gain.gain.setValueAtTime(0.12, startTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + delay + duration - 0.01);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(startTime + delay);
    osc.stop(startTime + delay + duration);
  });

  // Play Triangle Wave Bass
  bass.forEach(([note, delay, duration]) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(noteFreq(note), startTime + delay);

    gain.gain.setValueAtTime(0.22, startTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + delay + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(startTime + delay);
    osc.stop(startTime + delay + duration);
  });
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
    if (tool.name === 'Number 67') {
      toolBtn.textContent = `67 (${popsWithCurrentTool}/${POPS_PER_TOOL})`;
    } else {
      toolBtn.textContent = `${tool.label} ${tool.name} (${popsWithCurrentTool}/${POPS_PER_TOOL})`;
    }
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
  customCursor.innerHTML = currentTool.html;
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

      const currentTool = TOOLS[currentToolIndex];
      if (currentTool.name === 'Pacman') {
        customCursor.innerHTML = currentTool.htmlChomp;
        setTimeout(() => {
          if (isToolActive && TOOLS[currentToolIndex]?.name === 'Pacman') {
            customCursor.innerHTML = currentTool.html;
          }
        }, 130);
      }

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
      } else if (currentTool.name !== 'Pacman') {
        const nextTool = TOOLS[currentToolIndex];
        customCursor.innerHTML = nextTool.html;
      }

      updateToolUI();
    }
  }
});

function triggerVictory() {
  playRetroVictoryFanfare(); // Play 5-second retro NES victory music
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