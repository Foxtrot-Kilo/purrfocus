# 🐾 PurrFocus - Compañero Felino de Productividad y Enfoque

> **Proyecto desarrollado para examen práctico de Frontend.**  
> Creado con **HTML5**, **CSS3** y **JavaScript Vanilla**, asistido y generado mediante **Gemini CLI**.

---

## 📌 Descripción del Proyecto

**PurrFocus** es una aplicación web interactiva que reinventa el concepto de los asistentes clásicos de escritorio (estilo *BonziBuddy* o *Tamagotchi*) para convertirlo en un amigable compañero de estudio y desarrollo de software llamado **Mochi**.

El objetivo principal es brindar al estudiante o desarrollador un entorno de trabajo visualmente estimulante, relajante y estructurado, combinando técnicas de productividad comprobadas (como la metodología **Pomodoro**) con retroalimentación interactiva y gamificación.

---

## ✨ Características Principales

- **🐱 Mascota Virtual Interactiva (Mochi):**
  - Ilustración y animaciones vectoriales fluidas con **CSS3** (pestañeo, movimiento de orejas, cola y respiración).
  - Acciones interactivas:
    - **Acariciar:** Aumenta la felicidad del gatito, emite maullidos sintetizados y genera corazones flotantes.
    - **Alimentar:** Rellena la barra de energía de Mochi con pescaditos.
    - **Cambiar Look:** Permite alternar accesorios (Gafas de Hacker, Auriculares Gamer, Sombrero de Mago).
    - **Hablar:** Consejos de estudio y recordatorios de buenas prácticas de programación (commits frecuentes, hidratación, modularización).
- **🚀 Mochi Universal & Modo Flotante (Arrastrable por la pantalla):**
  - Permite liberar a Mochi para que flote por toda la pantalla del navegador mediante **Drag & Drop** (puedes moverlo, soltarlo sobre cualquier elemento y hacer doble clic para que se duerma).
- **🌐 Bookmarklet "Mochi Everywhere" (Llevarlo a otras webs):**
  - Incluye un marcador de navegador listo para arrastrar a la barra de favoritos (`Ctrl+Shift+B`).
  - Al hacer clic en el marcador desde **Google, YouTube, Wikipedia o GitHub**, ¡Mochi aparece en esa página web como compañero de navegación interactivo!
- **⏱️ Temporizador Pomodoro Integrado:**
  - Modos de trabajo: **Concentración (25 min)**, **Descanso Corto (5 min)** y **Descanso Largo (15 min)**.
  - Anillo de progreso SVG dinámico con cuenta regresiva en tiempo real y actualización del título de pestaña.
- **🎧 Audio Ambiental Relajante (Web Audio API):**
  - Generador procedural de lluvia suave y ronroneo binaural felino para aislamiento acústico y concentración, 100% nativo sin librerías externas ni archivos de audio pesados.
- **📝 Gestor de Misiones / To-Do List:**
  - Lista de metas para el bloque de estudio actual, con efectos de celebración y aumento de felicidad de la mascota al completar tareas.
- **🎨 Diseño Visual Cyber-Cozy & Temas:**
  - Interfaz responsiva adaptada a móviles, tablets y monitores de escritorio.
  - Soporte de cambio de tema en un clic: **Modo Noche (Cyber-Dark)** y **Modo Día (Cozy-Pastel)** mediante variables CSS (`:root`).

---

## 🛠️ Tecnologías Utilizadas

- **HTML5:** Marcado semántico estructurado (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<form>`).
- **CSS3 Moderno:**
  - Variables CSS personalizadas (`CSS Custom Properties`).
  - Sistemas de maquetación avanzados (**CSS Grid** y **Flexbox**).
  - Animaciones y transiciones fluidas con `@keyframes`.
  - Media queries para diseño 100% adaptativo (*Responsive Web Design*).
- **JavaScript (ES6+):** Lógica del temporizador, sintetizador de frecuencias con *Web Audio API*, manipulación del DOM y persistencia del estado.
- **Gemini CLI:** Asistencia en la arquitectura, estructuración de código, diseño de interfaz y documentación del proyecto.
- **Git & GitHub:** Control de versiones y publicación en repositorio remoto.

---

## 📂 Estructura del Repositorio

```
purrfocus-web/
├── index.html          # Estructura semántica principal
├── css/
│   └── styles.css      # Estilos visuales, variables y animaciones CSS3
├── js/
│   └── app.js          # Lógica interactiva, Pomodoro y síntesis de audio
├── .gitignore          # Reglas de exclusión de archivos temporales
└── README.md           # Documentación completa del proyecto
```

---

## 🚀 Cómo Visualizar y Probar el Proyecto

Este proyecto no requiere instalación de gestores de paquetes (`npm`), dependencias externas ni compiladores:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Foxtrot-Kilo/purrfocus.git
   ```
2. **Abrir la aplicación:**
   - Navega a la carpeta del proyecto y haz doble clic sobre el archivo `index.html`.
   - Se abrirá inmediatamente en tu navegador web predeterminado (Google Chrome, Firefox, Edge, Safari, etc.).

---

## 👨‍💻 Autor y Entrega

- **Estudiante / Usuario:** [Foxtrot-Kilo](https://github.com/Foxtrot-Kilo)
- **Asistente:** Gemini CLI / Antigravity
- **Fecha:** Septiembre 2026
- **Estado:** Entrega completada para consignación de examen.
