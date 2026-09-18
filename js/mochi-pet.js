/**
 * MOCHI EVERYWHERE (Bookmarklet & Embeddable Pet Script)
 * Permite inyectar y arrastrar a Mochi sobre CUALQUIER sitio web (Google, YouTube, GitHub, etc.)
 */
(function () {
  const EXISTING_ID = 'mochi-universal-pet-container';
  const existing = document.getElementById(EXISTING_ID);
  if (existing) {
    existing.remove();
    return;
  }

  // 1. Inyectar Estilos CSS Globales
  const styleEl = document.createElement('style');
  styleEl.id = 'mochi-universal-styles';
  styleEl.textContent = `
    #mochi-universal-pet-container {
      position: fixed;
      bottom: 30px;
      right: 30px;
      z-index: 2147483647;
      user-select: none;
      -webkit-user-select: none;
      touch-action: none;
      cursor: grab;
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      filter: drop-shadow(0 10px 25px rgba(0,0,0,0.35));
      transition: transform 0.15s ease-out;
    }
    #mochi-universal-pet-container.grabbing {
      cursor: grabbing;
      transform: scale(1.08) rotate(3deg);
    }
    .mochi-uni-bubble {
      position: absolute;
      bottom: 155px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(18, 24, 38, 0.95);
      border: 1px solid #8b5cf6;
      color: #f3f4f6;
      padding: 8px 14px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 600;
      white-space: nowrap;
      pointer-events: none;
      box-shadow: 0 4px 15px rgba(139, 92, 246, 0.35);
      animation: mochiUniBounce 3s infinite ease-in-out;
    }
    .mochi-uni-bubble::after {
      content: '';
      position: absolute;
      bottom: -6px;
      left: 50%;
      transform: translateX(-50%) rotate(45deg);
      width: 10px;
      height: 10px;
      background: rgba(18, 24, 38, 0.95);
      border-right: 1px solid #8b5cf6;
      border-bottom: 1px solid #8b5cf6;
    }
    @keyframes mochiUniBounce {
      0%, 100% { transform: translateX(-50%) translateY(0); }
      50% { transform: translateX(-50%) translateY(-4px); }
    }
    .mochi-uni-close {
      position: absolute;
      top: -10px;
      right: -10px;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: #ef4444;
      color: #fff;
      border: 2px solid #fff;
      font-size: 12px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      transition: transform 0.2s;
    }
    .mochi-uni-close:hover {
      transform: scale(1.2);
    }
    .mochi-uni-badge {
      position: absolute;
      bottom: -15px;
      left: 50%;
      transform: translateX(-50%);
      background: #8b5cf6;
      color: #fff;
      font-size: 10px;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 10px;
      white-space: nowrap;
    }
    .mochi-uni-avatar {
      width: 130px;
      height: 130px;
      display: block;
      animation: mochiUniFloat 3.5s ease-in-out infinite;
    }
    @keyframes mochiUniFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }
    .mochi-uni-tail {
      transform-origin: 135px 145px;
      animation: mochiUniTail 3s ease-in-out infinite;
    }
    @keyframes mochiUniTail {
      0%, 100% { transform: rotate(0deg); }
      50% { transform: rotate(12deg); }
    }
    .mochi-uni-ear-l {
      transform-origin: 65px 70px;
      animation: mochiUniEarL 5s infinite;
    }
    @keyframes mochiUniEarL {
      0%, 90%, 100% { transform: rotate(0deg); }
      95% { transform: rotate(-8deg); }
    }
    .mochi-uni-eye {
      transform-origin: center;
      animation: mochiUniBlink 4s infinite;
    }
    @keyframes mochiUniBlink {
      0%, 94%, 98%, 100% { transform: scaleY(1); }
      96% { transform: scaleY(0.1); }
    }
    #mochi-universal-pet-container.sleeping .mochi-uni-eye {
      display: none;
    }
    #mochi-universal-pet-container.sleeping .mochi-uni-sleep-eyes {
      display: block !important;
    }
    .mochi-uni-spark {
      position: absolute;
      font-size: 20px;
      pointer-events: none;
      animation: mochiUniSpark 1.2s forwards ease-out;
    }
    @keyframes mochiUniSpark {
      0% { opacity: 1; transform: translateY(0) scale(0.6); }
      100% { opacity: 0; transform: translateY(-40px) scale(1.3); }
    }
  `;
  document.head.appendChild(styleEl);

  // 2. Crear Contenedor
  const container = document.createElement('div');
  container.id = EXISTING_ID;

  // Citas flotantes aleatorias
  const quotes = [
    "¡Miau! Te acompaño en esta página. 🐾",
    "¡Arrástrame donde quieras en la pantalla!",
    "Recuerda descansar la vista cada 20 minutos. ☕",
    "¡Haz doble clic sobre mí para que me eche una siesta! 💤",
    "¡Mucho ánimo con lo que estés investigando! 💻"
  ];

  container.innerHTML = `
    <div class="mochi-uni-bubble" id="mochiUniBubble">${quotes[0]}</div>
    <div class="mochi-uni-close" id="mochiUniClose" title="Cerrar a Mochi">✕</div>
    <div class="mochi-uni-badge">Mochi 🐾</div>
    <svg class="mochi-uni-avatar" viewBox="0 0 200 200">
      <ellipse cx="100" cy="180" rx="65" ry="12" fill="rgba(0,0,0,0.25)" />
      <path d="M 140 145 C 175 140, 185 105, 165 90 C 155 80, 145 95, 150 105 C 158 120, 148 135, 130 145 Z" fill="#ffd166" class="mochi-uni-tail" />
      <path d="M 65 170 C 50 130, 60 95, 100 95 C 140 95, 150 130, 135 170 C 130 176, 70 176, 65 170 Z" fill="#ffd166" />
      <ellipse cx="100" cy="140" rx="22" ry="25" fill="#fff3b0" />
      <ellipse cx="80" cy="170" rx="12" ry="8" fill="#ffd166" />
      <ellipse cx="120" cy="170" rx="12" ry="8" fill="#ffd166" />
      <circle cx="100" cy="85" r="42" fill="#ffd166" />
      <polygon points="65,70 50,30 85,55" fill="#ffd166" class="mochi-uni-ear-l" />
      <polygon points="68,66 57,38 82,55" fill="#f4978e" />
      <polygon points="135,70 150,30 115,55" fill="#ffd166" />
      <polygon points="132,66 143,38 118,55" fill="#f4978e" />
      <!-- Ojos despierto -->
      <ellipse cx="82" cy="85" rx="7" ry="9" fill="#1a1a1a" class="mochi-uni-eye" />
      <circle cx="80" cy="82" r="2.5" fill="#fff" class="mochi-uni-eye" />
      <ellipse cx="118" cy="85" rx="7" ry="9" fill="#1a1a1a" class="mochi-uni-eye" />
      <circle cx="116" cy="82" r="2.5" fill="#fff" class="mochi-uni-eye" />
      <!-- Ojos dormido (ocultos por defecto) -->
      <g class="mochi-uni-sleep-eyes" style="display:none;">
        <path d="M 74 86 Q 82 92 90 86" fill="none" stroke="#222" stroke-width="3" stroke-linecap="round" />
        <path d="M 110 86 Q 118 92 126 86" fill="none" stroke="#222" stroke-width="3" stroke-linecap="round" />
      </g>
      <polygon points="97,95 103,95 100,99" fill="#e07a5f" />
      <path d="M 94 100 Q 100 105 100 100 Q 100 105 106 100" fill="none" stroke="#4a4e69" stroke-width="2.2" stroke-linecap="round" />
      <circle cx="73" cy="95" r="6" fill="rgba(244, 151, 142, 0.6)" />
      <circle cx="127" cy="95" r="6" fill="rgba(244, 151, 142, 0.6)" />
      <line x1="60" y1="94" x2="40" y2="90" stroke="#8d99ae" stroke-width="1.8" />
      <line x1="60" y1="98" x2="38" y2="101" stroke="#8d99ae" stroke-width="1.8" />
      <line x1="140" y1="94" x2="160" y2="90" stroke="#8d99ae" stroke-width="1.8" />
      <line x1="140" y1="98" x2="162" y2="101" stroke="#8d99ae" stroke-width="1.8" />
    </svg>
  `;

  document.body.appendChild(container);

  // 3. Audio Sintético Miau
  function playPop() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(500, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(850, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } catch (e) {}
  }

  function spawnSpark(text) {
    const s = document.createElement('div');
    s.className = 'mochi-uni-spark';
    s.textContent = text;
    s.style.left = '50px';
    s.style.top = '10px';
    container.appendChild(s);
    setTimeout(() => s.remove(), 1200);
  }

  // 4. Lógica de Arrastre (Drag & Drop)
  let isDragging = false;
  let startX = 0, startY = 0;
  let initialLeft = 0, initialTop = 0;
  let hasMoved = false;

  function onPointerDown(e) {
    if (e.target.id === 'mochiUniClose') return;
    isDragging = true;
    hasMoved = false;
    container.classList.add('grabbing');

    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    startX = clientX;
    startY = clientY;

    const rect = container.getBoundingClientRect();
    initialLeft = rect.left;
    initialTop = rect.top;

    // Cambiar a pos absoluta en coords left/top para moverlo libremente
    container.style.bottom = 'auto';
    container.style.right = 'auto';
    container.style.left = `${initialLeft}px`;
    container.style.top = `${initialTop}px`;

    document.addEventListener('mousemove', onPointerMove);
    document.addEventListener('mouseup', onPointerUp);
    document.addEventListener('touchmove', onPointerMove, { passive: false });
    document.addEventListener('touchend', onPointerUp);
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    const deltaX = clientX - startX;
    const deltaY = clientY - startY;

    if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
      hasMoved = true;
    }

    let newLeft = initialLeft + deltaX;
    let newTop = initialTop + deltaY;

    // Limitar dentro de la pantalla visible
    const maxX = window.innerWidth - 130;
    const maxY = window.innerHeight - 130;
    newLeft = Math.max(10, Math.min(newLeft, maxX));
    newTop = Math.max(10, Math.min(newTop, maxY));

    container.style.left = `${newLeft}px`;
    container.style.top = `${newTop}px`;
  }

  function onPointerUp() {
    if (!isDragging) return;
    isDragging = false;
    container.classList.remove('grabbing');

    document.removeEventListener('mousemove', onPointerMove);
    document.removeEventListener('mouseup', onPointerUp);
    document.removeEventListener('touchmove', onPointerMove);
    document.removeEventListener('touchend', onPointerUp);

    // Si fue solo un clic sin arrastrar
    if (!hasMoved) {
      playPop();
      spawnSpark('❤️');
      const bubble = document.getElementById('mochiUniBubble');
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      if (bubble) bubble.innerHTML = randomQuote;
    }
  }

  container.addEventListener('mousedown', onPointerDown);
  container.addEventListener('touchstart', onPointerDown, { passive: true });

  // Doble clic: Alternar Modo Dormir / Despertar
  container.addEventListener('dblclick', () => {
    container.classList.toggle('sleeping');
    const isSleep = container.classList.contains('sleeping');
    const bubble = document.getElementById('mochiUniBubble');
    if (isSleep) {
      spawnSpark('💤');
      if (bubble) bubble.innerHTML = "Zzz... Durmiendo en esta página... zzz...";
    } else {
      spawnSpark('☀️');
      if (bubble) bubble.innerHTML = "¡Desperté! Listo para ayudarte a navegar.";
    }
  });

  // Botón Cerrar
  document.getElementById('mochiUniClose').addEventListener('click', (e) => {
    e.stopPropagation();
    container.style.transform = 'scale(0.1) rotate(45deg)';
    container.style.opacity = '0';
    setTimeout(() => container.remove(), 250);
  });
})();
