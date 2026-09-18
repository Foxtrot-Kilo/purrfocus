/**
 * PURRFOCUS - LÓGICA DE INTERACCIÓN, POMODORO Y SÍNTESIS DE AUDIO
 * Versión 2.0: Animaciones mejoradas, seguimiento ocular, modo dormir y diálogos contextuales
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
    
    // Estados del gato
    isSleeping: false,
    isFocused: false,

    // Temporizador
    timerDuration: 25 * 60, // 25 min en segundos
    timeLeft: 25 * 60,
    timerInterval: null,
    isRunning: false,
    currentMode: 'focus', // 'focus', 'short-break', 'long-break'

    // Audio ambiental
    ambientPlaying: false
  };

  // Frases de Mochi (Diálogos inteligentes según el contexto)
  const mochiQuotes = {
    welcome: [
      "¡Miau! Hola, soy <strong>Mochi</strong>. Hoy vamos a romperla en el examen. ¡Acaríciame para empezar!",
      "¿Sabías que los gatos ronronean a 20-140 Hz? ¡Eso estimula la concentración y el aprendizaje!",
      "¡Listo para una sesión de código! Define tus metas en la lista de abajo."
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

  // Sonido de Ronroneo Dormilón Suave
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

  // Sonido de Campanada / Victoria (Timer o Tarea)
  function playChimeSound() {
    if (!state.soundEnabled) return;
    initAudioContext();
    if (!audioCtx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // Acorde C Mayor
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
  // 4. CONTROLADOR DE ESTADO DEL GATITO (DORMIR / DESPERTAR)
  // ==========================================
  function setCatSleep(sleeping, mode = 'short-break') {
    state.isSleeping = sleeping;

    if (sleeping) {
      catCharacter.classList.add('sleeping');
      catCharacter.classList.remove('focused');
      accSleepCap.classList.add('active');

      // Ocultar temporalmente otros accesorios mientras duerme
      accGlasses.classList.remove('active');
      accHeadphones.classList.remove('active');
      accHat.classList.remove('active');

      // Resetear posición de ojos
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

      // Restaurar accesorio elegido por el usuario
      restoreAccessory();

      badgeIcon.textContent = "🐱";
      badgeText.textContent = "Despierto & Atento";

      const q = mochiQuotes.focusMode[Math.floor(Math.random() * mochiQuotes.focusMode.length)];
      sayDialogue(q);

      // Pequeña animación de saludo con la patita al despertar
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
  // 5. SEGUIMIENTO OCULAR INTERACTIVO (CURSOR)
  // ==========================================
  window.addEventListener('mousemove', (e) => {
    if (state.isSleeping) return; // Si duerme, no sigue el cursor

    const rect = catCharacter.getBoundingClientRect();
    const catCenterX = rect.left + rect.width / 2;
    const catCenterY = rect.top + rect.height * 0.4; // Altura de los ojos

    const deltaX = e.clientX - catCenterX;
    const deltaY = e.clientY - catCenterY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance === 0) return;

    // Limitar desplazamiento máximo a 4 píxeles
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
  // 7. INTERACCIONES CON MOCHI
  // ==========================================
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
    // Saludar con la patita al hablar
    catCharacter.classList.add('waving');
    setTimeout(() => catCharacter.classList.remove('waving'), 1200);

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
  // 8. TEMPORIZADOR POMODORO MEJORADO
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
      // Pausar
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
      // Iniciar
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
          // Finalizado
          clearInterval(state.timerInterval);
          state.isRunning = false;
          startBtnText.textContent = "Comenzar Sesión";
          startTimerBtn.classList.remove('running');
          catCharacter.classList.remove('focused');

          playChimeSound();

          if (state.isSleeping) {
            // El descanso terminó -> despertar al gato
            setCatSleep(false);
            sayDialogue("¡Fin del descanso! ⏰ Mochi se despierta recargado. ¡A concentrarse con todo!");
          } else {
            // La sesión de enfoque terminó -> felicitar y sugerir descanso
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

    // Actualizar estado de dormir / despertar del gato según el modo
    if (modeName === 'short-break' || modeName === 'long-break') {
      setCatSleep(true, modeName);
    } else {
      setCatSleep(false);
    }
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
  // 9. LISTA DE TAREAS (MISIONES DE ENFOQUE)
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
  // 10. TEMA VISUAL Y CONFIGURACIÓN
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
