/**
 * PURRFOCUS - LÓGICA DE INTERACCIÓN, POMODORO, SÍNTESIS DE AUDIO Y MINI-JUEGO
 * Versión 3.0: Saltos, sentadillas, modo sigilo, mini-juego Caza del Láser y animaciones
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
    accessoryIndex: 0,
    accessories: ['none', 'glasses', 'headphones', 'hat'],
    
    // Estados del gato
    isSleeping: false,
    isFocused: false,

    // Temporizador
    timerDuration: 25 * 60,
    timeLeft: 25 * 60,
    timerInterval: null,
    isRunning: false,
    currentMode: 'focus',

    // Audio ambiental
    ambientPlaying: false
  };

  // Mini-Juego: Caza del Láser
  const laserGame = {
    isPlaying: false,
    score: 0,
    timeLeft: 20,
    timerId: null,
    moveTimerId: null,
    highScore: parseInt(localStorage.getItem('purrfocus_laser_highscore') || '0', 10)
  };

  // Frases de Mochi
  const mochiQuotes = {
    welcome: [
      "¡Miau! Hola, soy <strong>Mochi</strong>. Hoy vamos a romperla en el examen. ¡Hazme saltar o acaríciame!",
      "¿Sabías que los gatos ronronean a 20-140 Hz? ¡Eso estimula la concentración y el aprendizaje!",
      "¡Listo para una sesión de código! Define tus metas en la lista de abajo o jugamos un ratito."
    ],
    focusMode: [
      "¡Modo Concentración activado! 🎯 25 minutos de código puro. Cero distracciones. ¡Vamos!",
      "¡Ojos en la meta! 🚀 25 minutos para avanzar con todo. ¡Yo te acompaño!",
      "¡A programar! 💻 Divide el problema en funciones pequeñas y lo resolvemos juntos."
    ],
    shortBreak: [
      "¡Hora del recreo! ☕ Estira las piernas, toma agua y descansa la vista. Yo me echo una siesta de 5 min... ¡Zzz!",
      "¡Pausa corta merecida! 🥛 Respira hondo y relaja los hombros. Mochi entra en modo siestita... ¡Zzz!"
    ],
    longBreak: [
      "¡Descanso largo bien merecido! 🛋️ Aléjate del monitor, camina un poco. Te guardo el puesto mientras duermo plácidamente... ¡Zzz!",
      "¡Gran trabajo hasta aquí! 🎉 15 minutos para recargar energías por completo. ¡Dulces sueños felinos... Zzz!"
    ],
    timerRunningFocus: [
      "¡Sesión de enfoque en marcha! 💻 Mochi te acompaña con atención absoluta. ¡A romperla!",
      "¡Concéntrate! Cada línea de código te acerca más a la meta. 🎯"
    ],
    timerRunningBreak: [
      "Zzz... Mochi está durmiendo plácidamente. ¡Aprovecha tus minutos de relax! 💤",
      "Zzz... Relájate, no toques el teclado durante el descanso... zzz... 😴"
    ],
    petAwake: [
      "¡Puurrr! Me encantan los mimos. ¡Mi felicidad aumentó! ❤️",
      "¡Prrrr! Siento cómo ese código va a compilar a la primera.",
      "¡Miau suave! Eres el mejor compañero de estudio.",
      "¡Ronroneo terapéutico activado! (+Felicidad)"
    ],
    petSleeping: [
      "Zzz... *ronroneo dormilón*... miau suave... qué ricos mimos entre sueños... ❤️",
      "Zzz... mmm... 5 minutitos más... *ronronea abrazado a la almohada*... zzz...",
      "Zzz... soñando con un código libre de bugs... ¡purrrr!... zzz... 💤"
    ],
    feedAwake: [
      "¡Ñam ñam! ¡Qué rico pescadito! 🐟 ¡Energía al 100%!",
      "¡Delicioso! Un buen refrigerio siempre mejora la productividad.",
      "¡Miau glotón! Gracias por el snack, ahora a seguir con todo."
    ],
    feedSleeping: [
      "Mmm... ¿pescadito en mis sueños? *ñam ñam dormido*... qué delicia... zzz... 🐟",
      "Zzz... hasta dormido disfruto un buen pez... ¡gracias!... zzz... ✨"
    ],
    accessories: [
      "¡Look natural! Sencillo, elegante y veloz.",
      "¡Gafas de Hacker activadas! 🕶️ 'Mainframe hackeado con éxito'.",
      "¡Auriculares Gamer puestos! 🎧 Modo Lo-Fi Beats en curso.",
      "¡Sombrero de Mago! 🧙‍♂️ '¡Que los bugs desaparezcan por arte de magia!'"
    ],
    motivation: [
      "Consejo felino: Si una función tiene más de 30 líneas, ¡divídela en partes!",
      "Recuerda hidratarte: toma un sorbo de agua ahora mismo. 💧",
      "¡Estás avanzando genial! Cada commit cuenta.",
      "¿Te trabaste con un bug? Explícamelo a mí (técnica del patito felino).",
      "No olvides hacer 'git commit -m' con mensajes descriptivos. 🐱"
    ],
    sleepyAdvice: [
      "Zzz... 'Un buen programador también sabe cuándo descansar'... zzz...",
      "Zzz... Soñando con bases de datos que nunca se caen... ☁️",
      "Zzz... *ronroneo suave*... deja descansar tus ojos de la pantalla..."
    ],
    focusComplete: [
      "¡TIEMPO! 🎉 ¡Gran trabajo completando el bloque de concentración!",
      "¡Excelente sesión! Tómate tu descanso, estira las patitas."
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

  // Elementos de Modo Dormir y Ojos
  const catModeBadge = document.getElementById('catModeBadge');
  const badgeIcon = document.getElementById('badgeIcon');
  const badgeText = document.getElementById('badgeText');
  const eyeGroupLeft = document.getElementById('eyeGroupLeft');
  const eyeGroupRight = document.getElementById('eyeGroupRight');
  const accSleepCap = document.getElementById('accSleepCap');

  // Stats
  const happinessBar = document.getElementById('happinessBar');
  const happinessValue = document.getElementById('happinessValue');
  const energyBar = document.getElementById('energyBar');
  const energyValue = document.getElementById('energyValue');

  // Botones de Mochi
  const petBtn = document.getElementById('petBtn');
  const feedBtn = document.getElementById('feedBtn');
  const jumpBtn = document.getElementById('jumpBtn');
  const crouchBtn = document.getElementById('crouchBtn');
  const walkBtn = document.getElementById('walkBtn');
  const stretchBtn = document.getElementById('stretchBtn');
  const loafBtn = document.getElementById('loafBtn');
  const groomBtn = document.getElementById('groomBtn');
  const accessoryBtn = document.getElementById('accessoryBtn');
  const meowBtn = document.getElementById('meowBtn');

  // Accesorios
  const accGlasses = document.getElementById('accGlasses');
  const accHeadphones = document.getElementById('accHeadphones');
  const accHat = document.getElementById('accHat');

  // Mini-Juego Láser
  const laserGameBtn = document.getElementById('laserGameBtn');
  const laserGameOverlay = document.getElementById('laserGameOverlay');
  const closeLaserGameBtn = document.getElementById('closeLaserGameBtn');
  const laserScore = document.getElementById('laserScore');
  const laserTime = document.getElementById('laserTime');
  const laserHighScore = document.getElementById('laserHighScore');
  const laserTarget = document.getElementById('laserTarget');

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

  // Inicializar HighScore
  if (laserHighScore) laserHighScore.textContent = laserGame.highScore;

  // ==========================================
  // 3. SINTETIZADOR DE AUDIO (WEB AUDIO API)
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

  // Sonido de Miau Despierto
  function playMeowSound() {
    if (!state.soundEnabled) return;
    initAudioContext();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(530, now + 0.35);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch (e) {}
  }

  // Sonido de Salto (Boing elástico)
  function playJumpSound() {
    if (!state.soundEnabled) return;
    initAudioContext();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(740, now + 0.22);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.29);
    } catch (e) {}
  }

  // Sonido de Sentadilla / Agacharse
  function playCrouchSound() {
    if (!state.soundEnabled) return;
    initAudioContext();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(360, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.18);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.21);
    } catch (e) {}
  }

  // Sonido de Acierto en el Láser (Arcade 8-bit blip)
  function playLaserCatchSound() {
    if (!state.soundEnabled) return;
    initAudioContext();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(980, now);
      osc.frequency.setValueAtTime(1400, now + 0.06);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {}
  }

  // Sonido de Ronroneo Dormilón
  function playSleepyPurrSound() {
    if (!state.soundEnabled) return;
    initAudioContext();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(95, now);
      osc.frequency.linearRampToValueAtTime(115, now + 0.2);
      osc.frequency.linearRampToValueAtTime(90, now + 0.45);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.46);
    } catch (e) {}
  }

  // Sonido de Campanada / Victoria
  function playChimeSound() {
    if (!state.soundEnabled) return;
    initAudioContext();
    if (!audioCtx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50];
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

  // Generador de Sonido Ambiental
  function toggleAmbientSound() {
    initAudioContext();
    if (!audioCtx) return;

    if (state.ambientPlaying) {
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
      const bufferSize = audioCtx.sampleRate * 2;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }

      ambientSource = audioCtx.createBufferSource();
      ambientSource.buffer = noiseBuffer;
      ambientSource.loop = true;

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
  // 4. CONTROLADOR DE ESTADO DEL GATITO
  // ==========================================
  function setCatSleep(sleeping, mode = 'short-break') {
    state.isSleeping = sleeping;

    if (sleeping) {
      catCharacter.classList.add('sleeping');
      catCharacter.classList.remove('focused', 'jumping', 'crouching');
      accSleepCap.classList.add('active');

      accGlasses.classList.remove('active');
      accHeadphones.classList.remove('active');
      accHat.classList.remove('active');

      if (eyeGroupLeft) eyeGroupLeft.style.transform = 'translate(0px, 0px)';
      if (eyeGroupRight) eyeGroupRight.style.transform = 'translate(0px, 0px)';

      badgeIcon.textContent = "💤";
      badgeText.textContent = (mode === 'long-break') ? "Siesta Profunda (15m)" : "Siestita de Descanso (5m)";

      if (mode === 'long-break') {
        const q = mochiQuotes.longBreak[Math.floor(Math.random() * mochiQuotes.longBreak.length)];
        sayDialogue(q);
      } else {
        const q = mochiQuotes.shortBreak[Math.floor(Math.random() * mochiQuotes.shortBreak.length)];
        sayDialogue(q);
      }
    } else {
      catCharacter.classList.remove('sleeping');
      accSleepCap.classList.remove('active');

      restoreAccessory();

      badgeIcon.textContent = "🐱";
      badgeText.textContent = "Despierto & Atento";

      const q = mochiQuotes.focusMode[Math.floor(Math.random() * mochiQuotes.focusMode.length)];
      sayDialogue(q);

      catCharacter.classList.add('waving');
      setTimeout(() => catCharacter.classList.remove('waving'), 1500);
    }
  }

  function restoreAccessory() {
    accGlasses.classList.remove('active');
    accHeadphones.classList.remove('active');
    accHat.classList.remove('active');
    accSleepCap.classList.remove('active');

    const current = state.accessories[state.accessoryIndex];
    if (current === 'glasses') accGlasses.classList.add('active');
    if (current === 'headphones') accHeadphones.classList.add('active');
    if (current === 'hat') accHat.classList.add('active');
  }

  // ==========================================
  // 5. SEGUIMIENTO OCULAR CON CURSOR
  // ==========================================
  window.addEventListener('mousemove', (e) => {
    if (state.isSleeping) return;

    const rect = catCharacter.getBoundingClientRect();
    const catCenterX = rect.left + rect.width / 2;
    const catCenterY = rect.top + rect.height * 0.4;

    const deltaX = e.clientX - catCenterX;
    const deltaY = e.clientY - catCenterY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance === 0) return;

    const maxOffset = 4.0;
    const offsetX = Math.max(-maxOffset, Math.min(maxOffset, (deltaX / 120) * maxOffset));
    const offsetY = Math.max(-maxOffset, Math.min(maxOffset, (deltaY / 120) * maxOffset));

    if (eyeGroupLeft) eyeGroupLeft.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    if (eyeGroupRight) eyeGroupRight.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  });

  // ==========================================
  // 6. DIÁLOGOS Y EFECTOS VISUALES
  // ==========================================
  function sayDialogue(text) {
    dialogueText.innerHTML = text;
    catDialogue.style.animation = 'none';
    void catDialogue.offsetWidth;
    catDialogue.style.animation = 'bubbleBounce 4s ease-in-out infinite';
  }

  function spawnEffect(emoji) {
    const el = document.createElement('div');
    el.className = 'floating-effect';
    el.textContent = emoji;
    
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
  // 7. INTERACCIONES: SALTAR, AGACHARSE, MIMOS
  // ==========================================
  function jumpCat() {
    if (state.isSleeping) {
      sayDialogue("Zzz... Mochi está soñando que vuela por los tejados... 💤");
      playSleepyPurrSound();
      return;
    }

    catCharacter.classList.remove('jumping', 'crouching');
    void catCharacter.offsetWidth;
    catCharacter.classList.add('jumping');
    playJumpSound();
    spawnEffect('⭐');
    setTimeout(() => spawnEffect('💨'), 100);

    state.happiness = Math.min(100, state.happiness + 4);
    updateStats();

    const jumpQuotes = [
      "¡BOING! 🦘 ¡Qué salto felino acrobático!",
      "¡Arriba las patitas! 🐾 Esquivando todos los errores de sintaxis.",
      "¡Hop! Un salto de 10/10 según los jueces felinos."
    ];
    sayDialogue(jumpQuotes[Math.floor(Math.random() * jumpQuotes.length)]);

    setTimeout(() => catCharacter.classList.remove('jumping'), 650);
  }

  function crouchCat() {
    if (state.isSleeping) {
      sayDialogue("Zzz... Ya está bien acurrucado durmiendo... 😴");
      playSleepyPurrSound();
      return;
    }

    catCharacter.classList.remove('jumping', 'crouching');
    void catCharacter.offsetWidth;
    catCharacter.classList.add('crouching');
    playCrouchSound();
    spawnEffect('🐾');

    state.happiness = Math.min(100, state.happiness + 3);
    updateStats();

    const crouchQuotes = [
      "*Modo sigilo activado*... 🐾 Mochi acecha a los bugs en el código.",
      "*Agazapado en las sombras*... Preparando el zarpazo.",
      "¡Shhh! Mochi está concentrado observando la pantalla en cuclillas."
    ];
    sayDialogue(crouchQuotes[Math.floor(Math.random() * crouchQuotes.length)]);

    setTimeout(() => catCharacter.classList.remove('crouching'), 650);
  }

  function walkCat() {
    if (state.isSleeping) {
      sayDialogue("Zzz... Mochi sueña que camina por un tejado soleado... 💤");
      playSleepyPurrSound();
      return;
    }
    const isWalking = catCharacter.classList.toggle('walking');
    catCharacter.classList.remove('jumping', 'crouching', 'loafing', 'stretching', 'grooming');
    if (isWalking) {
      playMeowSound();
      spawnEffect('🐾');
      sayDialogue("¡De paseo por el código! 🐾 Estirando las patitas por el escenario.");
    } else {
      sayDialogue("Mochi se detiene a observar.");
    }
  }

  function stretchCat() {
    if (state.isSleeping) {
      setCatSleep(false);
    }
    catCharacter.classList.remove('jumping', 'crouching', 'walking', 'loafing', 'grooming');
    catCharacter.classList.add('stretching');
    playMeowSound();
    spawnEffect('✨');
    sayDialogue("*Haaaaam...* 🥱 ¡Qué delicia de estiramiento felino! Mente despejada.");
    setTimeout(() => catCharacter.classList.remove('stretching'), 1600);
  }

  function loafCat() {
    if (state.isSleeping) {
      sayDialogue("Zzz... Ya está bien acurrucado durmiendo... 😴");
      playSleepyPurrSound();
      return;
    }
    catCharacter.classList.remove('jumping', 'crouching', 'walking', 'stretching', 'grooming');
    const isLoaf = catCharacter.classList.toggle('loafing');
    if (isLoaf) {
      playSleepyPurrSound();
      spawnEffect('🍞');
      sayDialogue("*Modo panecillo activado* 🍞 Mochi esconde las patitas y se relaja calientito.");
    } else {
      sayDialogue("Mochi se levanta y sacude el pelaje.");
    }
  }

  function groomCat() {
    if (state.isSleeping) {
      sayDialogue("Zzz... limpiando bigotes entre sueños... 💤");
      playSleepyPurrSound();
      return;
    }
    catCharacter.classList.remove('jumping', 'crouching', 'walking', 'stretching', 'loafing');
    catCharacter.classList.add('grooming');
    playMeowSound();
    spawnEffect('🧼');
    sayDialogue("*Limpia que te limpia...* 🧼 Mochi se asea la carita y las orejas con la patita.");
    setTimeout(() => catCharacter.classList.remove('grooming'), 1500);
  }

  function petCat() {
    if (state.isSleeping) {
      state.happiness = Math.min(100, state.happiness + 5);
      updateStats();
      playSleepyPurrSound();
      spawnEffect('💤');
      setTimeout(() => spawnEffect('❤️'), 150);

      const q = mochiQuotes.petSleeping[Math.floor(Math.random() * mochiQuotes.petSleeping.length)];
      sayDialogue(q);
      return;
    }

    state.happiness = Math.min(100, state.happiness + 5);
    updateStats();
    playMeowSound();
    
    for (let i = 0; i < 3; i++) {
      setTimeout(() => spawnEffect('❤️'), i * 140);
    }

    const quote = mochiQuotes.petAwake[Math.floor(Math.random() * mochiQuotes.petAwake.length)];
    sayDialogue(quote);

    catCharacter.style.transform = 'scale(1.1) rotate(2deg)';
    setTimeout(() => {
      catCharacter.style.transform = '';
    }, 250);
  }

  function feedCat() {
    if (state.isSleeping) {
      state.energy = Math.min(100, state.energy + 10);
      updateStats();
      playSleepyPurrSound();
      spawnEffect('🐟');
      setTimeout(() => spawnEffect('✨'), 200);

      const q = mochiQuotes.feedSleeping[Math.floor(Math.random() * mochiQuotes.feedSleeping.length)];
      sayDialogue(q);
      return;
    }

    state.energy = Math.min(100, state.energy + 10);
    state.happiness = Math.min(100, state.happiness + 3);
    updateStats();
    playMeowSound();

    spawnEffect('🐟');
    setTimeout(() => spawnEffect('✨'), 200);

    const quote = mochiQuotes.feedAwake[Math.floor(Math.random() * mochiQuotes.feedAwake.length)];
    sayDialogue(quote);
  }

  function cycleAccessory() {
    if (state.isSleeping) {
      sayDialogue("Zzz... Deja dormir a Mochi con su gorrito de noche... Cuando despierte cambiamos de look. 💤");
      playSleepyPurrSound();
      return;
    }

    state.accessoryIndex = (state.accessoryIndex + 1) % state.accessories.length;
    restoreAccessory();

    const quote = mochiQuotes.accessories[state.accessoryIndex];
    sayDialogue(quote);
    playMeowSound();
  }

  function talkCat() {
    if (state.isSleeping) {
      playSleepyPurrSound();
      const q = mochiQuotes.sleepyAdvice[Math.floor(Math.random() * mochiQuotes.sleepyAdvice.length)];
      sayDialogue(q);
      return;
    }

    playMeowSound();
    catCharacter.classList.add('waving');
    setTimeout(() => catCharacter.classList.remove('waving'), 1200);

    const quote = mochiQuotes.motivation[Math.floor(Math.random() * mochiQuotes.motivation.length)];
    sayDialogue(quote);
  }

  // Al hacer clic directo sobre Mochi: salta, se agacha o ronronea
  catCharacter.addEventListener('click', (e) => {
    if (state.isSleeping) {
      petCat();
      return;
    }
    const rand = Math.random();
    if (rand < 0.4) {
      jumpCat();
    } else if (rand < 0.7) {
      crouchCat();
    } else {
      petCat();
    }
  });

  // Listeners de los botones
  petBtn.addEventListener('click', petCat);
  feedBtn.addEventListener('click', feedCat);
  jumpBtn.addEventListener('click', jumpCat);
  crouchBtn.addEventListener('click', crouchCat);
  if (walkBtn) walkBtn.addEventListener('click', walkCat);
  if (stretchBtn) stretchBtn.addEventListener('click', stretchCat);
  if (loafBtn) loafBtn.addEventListener('click', loafCat);
  if (groomBtn) groomBtn.addEventListener('click', groomCat);
  accessoryBtn.addEventListener('click', cycleAccessory);
  meowBtn.addEventListener('click', talkCat);

  // ==========================================
  // 8. MINI-JUEGO: CAZA DEL LÁSER ROJO 🔴
  // ==========================================
  function moveLaserTarget() {
    if (!laserGame.isPlaying) return;

    const rect = petStage.getBoundingClientRect();
    // Mantener dentro del escenario del gato
    const paddingX = 40;
    const paddingY = 40;
    const minX = paddingX;
    const maxX = rect.width - paddingX;
    const minY = paddingY;
    const maxY = rect.height - paddingY;

    const targetX = Math.random() * (maxX - minX) + minX;
    const targetY = Math.random() * (maxY - minY) + minY;

    laserTarget.style.left = `${targetX}px`;
    laserTarget.style.top = `${targetY}px`;

    // Programar próximo movimiento
    clearTimeout(laserGame.moveTimerId);
    laserGame.moveTimerId = setTimeout(moveLaserTarget, 850);
  }

  function startLaserGame() {
    if (state.isSleeping) {
      setCatSleep(false);
    }

    laserGame.isPlaying = true;
    laserGame.score = 0;
    laserGame.timeLeft = 20;

    laserScore.textContent = laserGame.score;
    laserTime.textContent = laserGame.timeLeft;
    laserGameOverlay.classList.add('active');

    sayDialogue("¡UN LÁSER ROJO! 🔴 ¡Atrápalo rápido haciendo clic antes de que escape!");
    playMeowSound();
    moveLaserTarget();

    // Cuenta regresiva de 20 segundos
    clearInterval(laserGame.timerId);
    laserGame.timerId = setInterval(() => {
      laserGame.timeLeft--;
      laserTime.textContent = laserGame.timeLeft;

      if (laserGame.timeLeft <= 0) {
        endLaserGame();
      }
    }, 1000);
  }

  function catchLaser(e) {
    if (!laserGame.isPlaying) return;
    e.stopPropagation();

    laserGame.score += 10;
    laserScore.textContent = laserGame.score;
    playLaserCatchSound();

    // Mochi salta hacia la presa (pounce)
    catCharacter.classList.remove('pouncing', 'jumping', 'crouching');
    void catCharacter.offsetWidth;
    catCharacter.classList.add('pouncing');
    setTimeout(() => catCharacter.classList.remove('pouncing'), 380);

    spawnEffect('💥');
    setTimeout(() => spawnEffect('⭐'), 80);

    // Mover inmediatamente a otra posición
    moveLaserTarget();
  }

  function endLaserGame() {
    laserGame.isPlaying = false;
    clearInterval(laserGame.timerId);
    clearTimeout(laserGame.moveTimerId);

    // Actualizar High Score
    if (laserGame.score > laserGame.highScore) {
      laserGame.highScore = laserGame.score;
      localStorage.setItem('purrfocus_laser_highscore', laserGame.highScore);
      laserHighScore.textContent = laserGame.highScore;
    }

    playChimeSound();
    state.happiness = 100;
    state.energy = Math.min(100, state.energy + 20);
    updateStats();

    for (let i = 0; i < 6; i++) {
      setTimeout(() => spawnEffect('🎉'), i * 120);
    }

    sayDialogue(`¡FIN DEL JUEGO! 🏆 Lograste <strong>${laserGame.score} puntos</strong>. ¡Mochi está eufórico y listo para seguir estudiando!`);

    setTimeout(() => {
      laserGameOverlay.classList.remove('active');
    }, 2400);
  }

  function closeLaserGame() {
    laserGame.isPlaying = false;
    clearInterval(laserGame.timerId);
    clearTimeout(laserGame.moveTimerId);
    laserGameOverlay.classList.remove('active');
    sayDialogue("Juego terminado. ¡De vuelta al modo de trabajo!");
  }

  laserGameBtn.addEventListener('click', startLaserGame);
  laserTarget.addEventListener('click', catchLaser);
  closeLaserGameBtn.addEventListener('click', closeLaserGame);

  // Modo Flotante / Arrastrable en Pantalla (Directo en DOM, sin fetch ni bloqueo de script)
  const spawnFloatingMochiBtn = document.getElementById('spawnFloatingMochiBtn');
  if (spawnFloatingMochiBtn) {
    spawnFloatingMochiBtn.addEventListener('click', () => {
      const existing = document.getElementById('mochi-universal-pet-container');
      if (existing) {
        existing.remove();
        sayDialogue("Mochi ha vuelto a su rincón principal. 🐾");
        return;
      }

      // Crear contenedor flotante directamente
      const container = document.createElement('div');
      container.id = 'mochi-universal-pet-container';

      if (!document.getElementById('mochi-uni-styles')) {
        const s = document.createElement('style');
        s.id = 'mochi-uni-styles';
        s.textContent = `
          #mochi-universal-pet-container {
            position: fixed;
            bottom: 40px;
            right: 40px;
            z-index: 999999;
            user-select: none;
            cursor: grab;
            filter: drop-shadow(0 10px 25px rgba(0,0,0,0.5));
            transition: transform 0.15s ease-out;
          }
          #mochi-universal-pet-container.grabbing {
            cursor: grabbing;
            transform: scale(1.1) rotate(4deg);
          }
          .uni-bubble {
            position: absolute;
            bottom: 140px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(18, 24, 38, 0.95);
            border: 1px solid #8b5cf6;
            color: #f3f4f6;
            padding: 6px 14px;
            border-radius: 12px;
            font-size: 13px;
            font-weight: 700;
            white-space: nowrap;
            pointer-events: none;
            box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
            animation: uniBounce 3s infinite ease-in-out;
          }
          .uni-bubble::after {
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
          @keyframes uniBounce {
            0%, 100% { transform: translateX(-50%) translateY(0); }
            50% { transform: translateX(-50%) translateY(-5px); }
          }
          .uni-close {
            position: absolute;
            top: -6px;
            right: -6px;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #ef4444;
            color: #ffffff;
            border: 2px solid #ffffff;
            font-size: 12px;
            font-weight: 900;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
            transition: transform 0.15s;
          }
          .uni-close:hover { transform: scale(1.2); }
          .uni-cat-svg {
            width: 125px;
            height: 125px;
            display: block;
            animation: floatCat 3.5s ease-in-out infinite;
          }
        `;
        document.head.appendChild(s);
      }

      container.innerHTML = `
        <div class="uni-bubble" id="uniBubble">¡Miau! Arrástrame por donde quieras 🐾</div>
        <div class="uni-close" id="uniClose" title="Cerrar">✕</div>
        <svg class="uni-cat-svg" viewBox="0 0 200 200">
          <ellipse cx="100" cy="180" rx="65" ry="12" fill="rgba(0,0,0,0.3)" />
          <path d="M 140 145 C 175 140, 185 105, 165 90 C 155 80, 145 95, 150 105 C 158 120, 148 135, 130 145 Z" fill="#ffd166" style="transform-origin:135px 145px; animation: tailWalk 2s ease-in-out infinite alternate;" />
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

      // Drag and drop con ratón
      let isDrag = false;
      let startX = 0, startY = 0;
      let origL = 0, origT = 0;
      let moved = false;

      container.addEventListener('mousedown', (e) => {
        if (e.target.id === 'uniClose') return;
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
          playMeowSound();
          spawnEffect('❤️');
          const b = document.getElementById('uniBubble');
          if (b) b.textContent = "¡Puuuurrr! Mimos flotantes ❤️";
        }
      });

      // Doble clic: Alternar siesta
      container.addEventListener('dblclick', () => {
        playSleepyPurrSound();
        spawnEffect('💤');
        const b = document.getElementById('uniBubble');
        if (b) b.textContent = "Zzz... Durmiendo en este rincón... zzz...";
      });

      // Cerrar
      document.getElementById('uniClose').addEventListener('click', () => {
        container.remove();
        sayDialogue("Mochi ha regresado a su camita principal. 🐾");
      });

      sayDialogue("¡Mochi liberado por la pantalla! 🚀 Puedes arrastrarlo donde quieras con el ratón.");
    });
  }

  // ==========================================
  // 9. TEMPORIZADOR POMODORO MEJORADO
  // ==========================================
  const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * 90;

  function updateTimerDisplay() {
    const minutes = Math.floor(state.timeLeft / 60);
    const seconds = state.timeLeft % 60;
    const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    timeDisplay.textContent = formatted;
    document.title = `(${formatted}) PurrFocus 🐾`;

    const progress = state.timeLeft / state.timerDuration;
    const offset = CIRCLE_CIRCUMFERENCE * (1 - progress);
    timerProgressCircle.style.strokeDashoffset = offset;
  }

  function startTimer() {
    if (state.isRunning) {
      clearInterval(state.timerInterval);
      state.isRunning = false;
      startBtnText.textContent = "Reanudar";
      startTimerBtn.classList.remove('running');
      catCharacter.classList.remove('focused');

      if (state.isSleeping) {
        sayDialogue("Descanso en pausa. ¿Volvemos o nos estiramos un poco más?");
      } else {
        sayDialogue("Temporizador pausado. ¡Aquí estaré esperándote!");
      }
    } else {
      state.isRunning = true;
      startBtnText.textContent = "Pausar";
      startTimerBtn.classList.add('running');

      if (state.isSleeping) {
        const q = mochiQuotes.timerRunningBreak[Math.floor(Math.random() * mochiQuotes.timerRunningBreak.length)];
        sayDialogue(q);
      } else {
        catCharacter.classList.add('focused');
        const q = mochiQuotes.timerRunningFocus[Math.floor(Math.random() * mochiQuotes.timerRunningFocus.length)];
        sayDialogue(q);
      }

      state.timerInterval = setInterval(() => {
        if (state.timeLeft > 0) {
          state.timeLeft--;
          updateTimerDisplay();
        } else {
          clearInterval(state.timerInterval);
          state.isRunning = false;
          startBtnText.textContent = "Comenzar Sesión";
          startTimerBtn.classList.remove('running');
          catCharacter.classList.remove('focused');

          playChimeSound();

          if (state.isSleeping) {
            setCatSleep(false);
            sayDialogue("¡Fin del descanso! ⏰ Mochi se despierta recargado. ¡A concentrarse con todo!");
          } else {
            const completeQuote = mochiQuotes.focusComplete[Math.floor(Math.random() * mochiQuotes.focusComplete.length)];
            sayDialogue(completeQuote);
            state.happiness = Math.min(100, state.happiness + 15);
            updateStats();
            for (let i = 0; i < 5; i++) {
              setTimeout(() => spawnEffect('🎉'), i * 120);
            }
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
    catCharacter.classList.remove('focused');
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
    catCharacter.classList.remove('focused');

    phaseTag.textContent = labelText;
    updateTimerDisplay();

    if (modeName === 'short-break' || modeName === 'long-break') {
      setCatSleep(true, modeName);
    } else {
      setCatSleep(false);
    }
  }

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
  // 10. LISTA DE TAREAS (MISIONES DE ENFOQUE)
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
    
    if (state.isSleeping) {
      playSleepyPurrSound();
      sayDialogue(`*Zzz... anotando meta dormido: "${text}"... zzz...*`);
    } else {
      playMeowSound();
      sayDialogue(`¡Nueva misión agregada: "${text}"! A por ella.`);
    }
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

        if (state.isSleeping) {
          sayDialogue("¡Misión cumplida! Hasta en mis sueños celebro tu avance... zzz... ⭐");
        } else {
          catCharacter.classList.add('waving');
          setTimeout(() => catCharacter.classList.remove('waving'), 1200);
          sayDialogue("¡Misión cumplida! Excelente trabajo. Mochi está muy orgulloso.");
        }
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
  // 11. TEMA VISUAL Y CONFIGURACIÓN
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
