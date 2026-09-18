/**
 * MOCHI EXTENSION - CONTENT SCRIPT
 * Se ejecuta en CUALQUIER sitio web sin restricciones de CSP ni bloqueos de navegador.
 */
(function () {
  if (document.getElementById('mochi-extension-pet')) return;

  const style = document.createElement('style');
  style.textContent = `
    #mochi-extension-pet {
      position: fixed;
      bottom: 30px;
      right: 30px;
      z-index: 2147483647;
      user-select: none;
      -webkit-user-select: none;
      cursor: grab;
      filter: drop-shadow(0 10px 25px rgba(0,0,0,0.45));
      font-family: 'Segoe UI', system-ui, sans-serif;
      transition: transform 0.15s ease-out;
    }
    #mochi-extension-pet.grabbing {
      cursor: grabbing;
      transform: scale(1.1) rotate(4deg);
    }
    .mochi-ext-bubble {
      position: absolute;
      bottom: 145px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(18, 24, 38, 0.95);
      border: 1px solid #8b5cf6;
      color: #f3f4f6;
      padding: 6px 14px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 700;
      white-space: nowrap;
      pointer-events: none;
      box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
      animation: mochiExtBounce 3s infinite ease-in-out;
    }
    .mochi-ext-bubble::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 50%;
      transform: translateX(-50%) rotate(45deg);
      width: 8px;
      height: 8px;
      background: rgba(18, 24, 38, 0.95);
      border-right: 1px solid #8b5cf6;
      border-bottom: 1px solid #8b5cf6;
    }
    @keyframes mochiExtBounce {
      0%, 100% { transform: translateX(-50%) translateY(0); }
      50% { transform: translateX(-50%) translateY(-5px); }
    }
    .mochi-ext-close {
      position: absolute;
      top: -8px;
      right: -8px;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: #ef4444;
      color: #ffffff;
      border: 2px solid #ffffff;
      font-size: 11px;
      font-weight: 900;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    }
    .mochi-ext-close:hover { transform: scale(1.2); }
    .mochi-ext-svg {
      width: 120px;
      height: 120px;
      display: block;
      animation: mochiExtFloat 3.5s ease-in-out infinite;
    }
    @keyframes mochiExtFloat {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }
  `;
  document.head.appendChild(style);

  const container = document.createElement('div');
  container.id = 'mochi-extension-pet';

  const quotes = [
    "¡Miau! Te acompaño en esta web 🐾",
    "¡Arrástrame a cualquier rincón!",
    "Recuerda tomar agua 💧",
    "Doble clic sobre mí para que duerma 💤",
    "¡Mucho éxito con tu código!"
  ];

  container.innerHTML = `
    <div class="mochi-ext-bubble" id="mochiExtBubble">${quotes[0]}</div>
    <div class="mochi-ext-close" id="mochiExtClose" title="Cerrar">✕</div>
    <svg class="mochi-ext-svg" viewBox="0 0 200 200">
      <ellipse cx="100" cy="180" rx="65" ry="12" fill="rgba(0,0,0,0.3)" />
      <path d="M 140 145 C 175 140, 185 105, 165 90 C 155 80, 145 95, 150 105 C 158 120, 148 135, 130 145 Z" fill="#ffd166" style="transform-origin:135px 145px; animation: mochiExtTail 2.5s ease-in-out infinite alternate;" />
      <path d="M 65 170 C 50 130, 60 95, 100 95 C 140 95, 150 130, 135 170 C 130 176, 70 176, 65 170 Z" fill="#ffd166" />
      <ellipse cx="100" cy="140" rx="22" ry="25" fill="#fff3b0" />
      <ellipse cx="80" cy="170" rx="12" ry="8" fill="#ffd166" />
      <ellipse cx="120" cy="170" rx="12" ry="8" fill="#ffd166" />
      <circle cx="100" cy="85" r="42" fill="#ffd166" />
      <polygon points="65,70 50,30 85,55" fill="#ffd166" />
      <polygon points="68,66 57,38 82,55" fill="#f4978e" />
      <polygon points="135,70 150,30 115,55" fill="#ffd166" />
      <polygon points="132,66 143,38 118,55" fill="#f4978e" />
      <ellipse cx="82" cy="85" rx="7" ry="9" fill="#1a1a1a" />
      <circle cx="80" cy="82" r="2.5" fill="#ffffff" />
      <ellipse cx="118" cy="85" rx="7" ry="9" fill="#1a1a1a" />
      <circle cx="116" cy="82" r="2.5" fill="#ffffff" />
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

  // Drag & drop
  let isDrag = false;
  let startX = 0, startY = 0;
  let origL = 0, origT = 0;
  let moved = false;

  container.addEventListener('mousedown', (e) => {
    if (e.target.id === 'mochiExtClose') return;
    isDrag = true;
    moved = false;
    container.classList.add('grabbing');
    startX = e.clientX;
    startY = e.clientY;
    const r = container.getBoundingClientRect();
    origL = r.left;
    origT = r.top;
    container.style.bottom = 'auto';
    container.style.right = 'auto';
    container.style.left = `${origL}px`;
    container.style.top = `${origT}px`;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDrag) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;
    container.style.left = `${Math.max(10, Math.min(window.innerWidth - 130, origL + dx))}px`;
    container.style.top = `${Math.max(10, Math.min(window.innerHeight - 130, origT + dy))}px`;
  });

  window.addEventListener('mouseup', () => {
    if (!isDrag) return;
    isDrag = false;
    container.classList.remove('grabbing');
    if (!moved) {
      const b = document.getElementById('mochiExtBubble');
      const q = quotes[Math.floor(Math.random() * quotes.length)];
      if (b) b.textContent = q;
    }
  });

  container.addEventListener('dblclick', () => {
    const b = document.getElementById('mochiExtBubble');
    if (b) b.textContent = "Zzz... Durmiendo en esta página... 💤";
  });

  document.getElementById('mochiExtClose').addEventListener('click', () => {
    container.remove();
  });
})();
