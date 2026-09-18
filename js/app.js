/**
 * PURRFOCUS - LÓGICA DE INTERACCIÓN, POMODORO Y SÍNTESIS DE AUDIO
 * Proyecto de Examen desarrollado con Gemini CLI
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. ESTADO DE LA APLICACIÓN
  // ==========================================
  const state = {
    soundEnabled: true,
    theme: 'dark',
    happiness: 90,
    energy: 85,
    accessoryIndex: 0, // 0: ninguno, 1: gafas, 2: auriculares, 3: sombrero
    accessories: ['none', 'glasses', 'headphones', 'hat'],
    
    // Temporizador
    timerDuration: 25 * 60, // 25 min en segundos
    timeLeft: 25 * 60,
    timerInterval: null,
    isRunning: false,
    currentMode: 'focus', // 'focus', 'short-break', 'long-break'

    // Audio ambiental
    ambientPlaying: false
  };

  // Frases de Mochi (Estilo BonziBuddy)
  const mochiQuotes = {
    welcome: [
      "¡Miau! Hola, soy <strong>Mochi</strong>. Hoy vamos a romperla en el examen. ¡Acaríciame para empezar!",
      "¿Sabías que los gatos ronronean a una frecuencia de 20-140 Hz? ¡Eso mejora la concentración!",
      "¡Listo para una sesión productiva! Define tu meta de hoy en las tareas de abajo."
    ],
    pet: [
      "¡Puurrr! Me encantan los mimos. ¡Mi felicidad aumentó! ❤️",
      "¡Prrrr! Siento cómo tu código compila a la primera.",
      "¡Miau suave! Eres el mejor compañero de estudio.",
      "¡Ronroneo terapéutico activado! (+Felicidad)"
    ],
    feed: [
      "¡Ñam ñam! ¡Qué rico pescadito! 🐟 ¡Energía al 100%!",
      "¡Delicioso! Un buen refrigerio siempre mejora la productividad.",
      "¡Miau glotón! Gracias por el snack, ahora a seguir concentrados."
    ],
    accessories: [
      "¡Look natural! Sencillo, elegante y veloz.",
      "¡Gafas de Hacker activadas! 🕶️ 'Mainframe hackeado con éxito'.",
      "¡Auriculares Gamer puestos! 🎧 Modo Lo-Fi Beats en curso.",
      "¡Sombrero de Mago! 🧙‍♂️ '¡Que los bugs desaparezcan por arte de magia!'"
    ],
    motivation: [
      "Consejo felino: Si una función tiene más de 30 líneas, ¡divídela!",
      "Recuerda hidratarte: toma un sorbo de agua ahora mismo. 💧",
      "¡Estás avanzando genial! Cada commit cuenta.",
      "¿Te trabaste con un bug? Explícamelo a mí (técnica del patito de goma felino).",
      "No olvides hacer 'git commit -m' con mensajes descriptivos. 🐱"
    ],
    focusComplete: [
      "¡TIEMPO! 🎉 ¡Gran trabajo completando el bloque de concentración!",
      "¡Excelente sesión! Tómate 5 minutos de descanso, estira las patitas."
    ]
  };

  // ==========================================
  // 2. REFERENCIAS DOM
  // ==========================================
  const catCharacter = document.getElementById('catCharacter');
  const petStage = document.getElementById('petStage');
  const catDialogue = document.getElementById('catDialogue');
  const dialogueText = document.getElementById('dialogueText');
  const effectsLayer = document.getElementById('effectsLayer');

  // Stats
  const happinessBar = document.getElementById('happinessBar');
  const happinessValue = document.getElementById('happinessValue');
  const energyBar = document.getElementById('energyBar');
  const energyValue = document.getElementById('energyValue');

  // Botones de Mochi
  const petBtn = document.getElementById('petBtn');
  const feedBtn = document.getElementById('feedBtn');
  const accessoryBtn = document.getElementById('accessoryBtn');
  const meowBtn = document.getElementById('meowBtn');

  // Accesorios
  const accGlasses = document.getElementById('accGlasses');
  const accHeadphones = document.getElementById('accHeadphones');
  const accHat = document.getElementById('accHat');

  // Temporizador
  const timeDisplay = document.getElementById('timeDisplay');
  const phaseTag = document.getElementById('phaseTag');
  const startTimerBtn = document.getElementById('startTimerBtn');
  const startBtnText = document.getElementById('startBtnText');
  const resetTimerBtn = document.getElementById('resetTimerBtn');
  const modeChips = document.querySelectorAll('.mode-chip');
  const timerProgressCircle = document.getElementById('timerProgressCircle');

  // Audio Ambiental
  const ambientSoundBtn = document.getElementById('ambientSoundBtn');
  const ambientStateText = document.getElementById('ambientStateText');

  // Configuración Navbar
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const themeLabel = document.getElementById('themeLabel');

  // To-do List
  const todoForm = document.getElementById('todoForm');
  const todoInput = document.getElementById('todoInput');
  const todoList = document.getElementById('todoList');
  const taskCounter = document.getElementById('taskCounter');

  // ==========================================
  // 3. SINTETIZADOR DE AUDIO (WEB AUDIO API)
  // Sin archivos externos de audio
  // ==========================================
  let audioCtx = null;
  let ambientSource = null;
  let ambientGain = null;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Sonido de Miau Sintético
  function playMeowSound() {
    if (!state.soundEnabled) return;
    initAudioContext();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      // Curva de tono felino: sube y baja suavemente
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.35);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch (e) {
      // Ignorar restricciones de audio del navegador
    }
  }

  // Sonido de Campanada / Victoria (Timer o Tarea)
  function playChimeSound() {
    if (!state.soundEnabled) return;
    initAudioContext();
    if (!audioCtx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // Acorde C Major (C, E, G, C)
      notes.forEach((freq, idx) => {
        const now = audioCtx.currentTime + (idx * 0.09);
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.5);
      });
    } catch (e) {}
  }

  // Generador de Sonido Ambiental (Lluvia Suave & Ronroneo)
  function toggleAmbientSound() {
    initAudioContext();
    if (!audioCtx) return;

    if (state.ambientPlaying) {
      // Detener
      if (ambientGain) {
        ambientGain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
        setTimeout(() => {
          if (ambientSource) {
            ambientSource.stop();
            ambientSource.disconnect();
          }
        }, 500);
      }
      state.ambientPlaying = false;
      ambientSoundBtn.classList.remove('active');
      ambientStateText.textContent = "Activar Audio";
      sayDialogue("Audio ambiental pausado.");
    } else {
      // Iniciar generador de ruido suave (Brownian/Pink noise)
      const bufferSize = audioCtx.sampleRate * 2;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02; // Ruido marrón (sonido de lluvia/río)
        lastOut = output[i];
        output[i] *= 3.5;
      }

      ambientSource = audioCtx.createBufferSource();
      ambientSource.buffer = noiseBuffer;
      ambientSource.loop = true;

      // Filtro de paso bajo para hacerlo muy suave y cálido
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, audioCtx.currentTime);

      ambientGain = audioCtx.createGain();
      ambientGain.gain.setValueAtTime(0.01, audioCtx.currentTime);
      ambientGain.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 1);

      ambientSource.connect(filter);
      filter.connect(ambientGain);
      ambientGain.connect(audioCtx.destination);

      ambientSource.start();
      state.ambientPlaying = true;
      ambientSoundBtn.classList.add('active');
      ambientStateText.textContent = "Pausar Audio";
      sayDialogue("🎧 Lluvia suave y ronroneo activados. ¡A concentrarse!");
    }
  }

  // ==========================================
  // 4. DIÁLOGOS Y EFECTOS VISUALES
  // ==========================================
  function sayDialogue(text) {
    dialogueText.innerHTML = text;
    catDialogue.style.animation = 'none';
    void catDialogue.offsetWidth; // Trigger reflow
    catDialogue.style.animation = 'bubbleBounce 4s ease-in-out infinite';
  }

  function spawnEffect(emoji) {
    const el = document.createElement('div');
    el.className = 'floating-effect';
    el.textContent = emoji;
    
    // Posición aleatoria dentro del escenario del gato
    const rect = petStage.getBoundingClientRect();
    const x = Math.random() * (rect.width - 60) + 30;
    const y = rect.height - 50;

    el.style.left = `${x}px`;
    el.style.top = `${y}px`;

    effectsLayer.appendChild(el);

    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 1400);
  }

  function updateStats() {
    happinessBar.style.width = `${state.happiness}%`;
    happinessValue.textContent = `${state.happiness}%`;
    energyBar.style.width = `${state.energy}%`;
    energyValue.textContent = `${state.energy}%`;
  }

  // ==========================================
  // 5. INTERACCIONES CON MOCHI
  // ==========================================
  function petCat() {
    state.happiness = Math.min(100, state.happiness + 5);
    updateStats();
    playMeowSound();
    
    for (let i = 0; i < 3; i++) {
      setTimeout(() => spawnEffect('❤️'), i * 150);
    }

    const quote = mochiQuotes.pet[Math.floor(Math.random() * mochiQuotes.pet.length)];
    sayDialogue(quote);

    // Animación de pulso
    catCharacter.style.transform = 'scale(1.1) rotate(2deg)';
    setTimeout(() => {
      catCharacter.style.transform = '';
    }, 250);
  }

  function feedCat() {
    state.energy = Math.min(100, state.energy + 10);
    state.happiness = Math.min(100, state.happiness + 3);
    updateStats();
    playMeowSound();

    spawnEffect('🐟');
    setTimeout(() => spawnEffect('✨'), 200);

    const quote = mochiQuotes.feed[Math.floor(Math.random() * mochiQuotes.feed.length)];
    sayDialogue(quote);
  }

  function cycleAccessory() {
    state.accessoryIndex = (state.accessoryIndex + 1) % state.accessories.length;
    
    // Ocultar todos
    accGlasses.classList.remove('active');
    accHeadphones.classList.remove('active');
    accHat.classList.remove('active');

    const current = state.accessories[state.accessoryIndex];
    if (current === 'glasses') accGlasses.classList.add('active');
    if (current === 'headphones') accHeadphones.classList.add('active');
    if (current === 'hat') accHat.classList.add('active');

    const quote = mochiQuotes.accessories[state.accessoryIndex];
    sayDialogue(quote);
    playMeowSound();
  }

  function talkCat() {
    playMeowSound();
    const quote = mochiQuotes.motivation[Math.floor(Math.random() * mochiQuotes.motivation.length)];
    sayDialogue(quote);
  }

  // Listeners de la mascota
  catCharacter.addEventListener('click', petCat);
  petBtn.addEventListener('click', petCat);
  feedBtn.addEventListener('click', feedCat);
  accessoryBtn.addEventListener('click', cycleAccessory);
  meowBtn.addEventListener('click', talkCat);

  // ==========================================
  // 6. TEMPORIZADOR POMODORO
  // ==========================================
  const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * 90; // r=90 en SVG

  function updateTimerDisplay() {
    const minutes = Math.floor(state.timeLeft / 60);
    const seconds = state.timeLeft % 60;
    const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    timeDisplay.textContent = formatted;
    document.title = `(${formatted}) PurrFocus 🐾`;

    // Actualizar anillo SVG
    const progress = state.timeLeft / state.timerDuration;
    const offset = CIRCLE_CIRCUMFERENCE * (1 - progress);
    timerProgressCircle.style.strokeDashoffset = offset;
  }

  function startTimer() {
    if (state.isRunning) {
      // Pausar
      clearInterval(state.timerInterval);
      state.isRunning = false;
      startBtnText.textContent = "Reanudar";
      startTimerBtn.classList.remove('running');
      sayDialogue("Temporizador pausado. ¡Aquí estaré cuando regreses!");
    } else {
      // Iniciar
      state.isRunning = true;
      startBtnText.textContent = "Pausar";
      startTimerBtn.classList.add('running');
      sayDialogue("¡Sesión en marcha! Concéntrate en tu código.");

      state.timerInterval = setInterval(() => {
        if (state.timeLeft > 0) {
          state.timeLeft--;
          updateTimerDisplay();
        } else {
          // Finalizado
          clearInterval(state.timerInterval);
          state.isRunning = false;
          startBtnText.textContent = "Comenzar Sesión";
          startTimerBtn.classList.remove('running');

          playChimeSound();
          const completeQuote = mochiQuotes.focusComplete[Math.floor(Math.random() * mochiQuotes.focusComplete.length)];
          sayDialogue(completeQuote);

          state.happiness = Math.min(100, state.happiness + 15);
          updateStats();
          for (let i = 0; i < 5; i++) {
            setTimeout(() => spawnEffect('🎉'), i * 120);
          }
        }
      }, 1000);
    }
  }

  function resetTimer() {
    clearInterval(state.timerInterval);
    state.isRunning = false;
    state.timeLeft = state.timerDuration;
    startBtnText.textContent = "Comenzar Sesión";
    startTimerBtn.classList.remove('running');
    updateTimerDisplay();
    sayDialogue("Temporizador reiniciado.");
  }

  function setTimerMode(seconds, modeName, labelText) {
    clearInterval(state.timerInterval);
    state.isRunning = false;
    state.timerDuration = seconds;
    state.timeLeft = seconds;
    state.currentMode = modeName;
    startBtnText.textContent = "Comenzar Sesión";
    startTimerBtn.classList.remove('running');

    phaseTag.textContent = labelText;
    updateTimerDisplay();
  }

  // Listeners del Timer
  startTimerBtn.addEventListener('click', startTimer);
  resetTimerBtn.addEventListener('click', resetTimer);

  modeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      modeChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const time = parseInt(chip.dataset.time, 10);
      const mode = chip.dataset.mode;
      let label = "🔥 Modo Concentración";
      if (mode === 'short-break') label = "☕ Descanso Corto (5m)";
      if (mode === 'long-break') label = "🛋️ Descanso Largo (15m)";

      setTimerMode(time, mode, label);
    });
  });

  ambientSoundBtn.addEventListener('click', toggleAmbientSound);

  // ==========================================
  // 7. LISTA DE TAREAS (MISIONES DE ENFOQUE)
  // ==========================================
  function updateTaskCounter() {
    const total = todoList.querySelectorAll('.todo-item').length;
    const completed = todoList.querySelectorAll('.todo-item.done').length;
    taskCounter.textContent = `${completed}/${total} completadas`;
  }

  todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (!text) return;

    const li = document.createElement('li');
    li.className = 'todo-item';
    li.innerHTML = `
      <label class="todo-label">
        <input type="checkbox" class="todo-checkbox">
        <span class="todo-custom-check">✓</span>
        <span class="todo-text">${escapeHtml(text)}</span>
      </label>
      <span class="todo-tag tag-git">Meta</span>
    `;

    todoList.appendChild(li);
    todoInput.value = '';
    updateTaskCounter();
    playMeowSound();
    sayDialogue(`¡Nueva misión agregada: "${text}"! A por ella.`);
  });

  todoList.addEventListener('change', (e) => {
    if (e.target.classList.contains('todo-checkbox')) {
      const item = e.target.closest('.todo-item');
      if (e.target.checked) {
        item.classList.add('done');
        playChimeSound();
        spawnEffect('⭐');
        state.happiness = Math.min(100, state.happiness + 5);
        updateStats();
        sayDialogue("¡Misión cumplida! Excelente trabajo. Mochi está muy orgulloso.");
      } else {
        item.classList.remove('done');
      }
      updateTaskCounter();
    }
  });

  function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  // ==========================================
  // 8. TEMA VISUAL Y CONFIGURACIÓN
  // ==========================================
  soundToggleBtn.addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    const label = soundToggleBtn.querySelector('.btn-label');
    const icon = soundToggleBtn.querySelector('.icon');
    if (state.soundEnabled) {
      label.textContent = "FX On";
      icon.textContent = "🔔";
    } else {
      label.textContent = "FX Off";
      icon.textContent = "🔕";
    }
  });

  themeToggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'light');
      themeIcon.textContent = "☀️";
      themeLabel.textContent = "Modo Día";
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeIcon.textContent = "🌙";
      themeLabel.textContent = "Modo Noche";
    }
  });

  // Inicialización
  updateTimerDisplay();
  updateStats();
  updateTaskCounter();
});
