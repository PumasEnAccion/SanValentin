function startFlowers() {
  document.querySelectorAll('.flower-container').forEach(el => {
    el.innerHTML = `<div class="flower-top">
                    <div class="flower-petal flower-petal__1"></div>
                    <div class="flower-petal flower-petal__2"></div>
                    <div class="flower-petal flower-petal__3"></div>
                    <div class="flower-petal flower-petal__4"></div>
                    <div class="flower-petal flower-petal__5"></div>
                    <div class="flower-petal flower-petal__6"></div>
                    <div class="flower-petal flower-petal__7"></div>
                    <div class="flower-petal flower-petal__8"></div>
                    <div class="flower-circle"></div>
                    <div class="flower-light flower-light__1"></div>
                    <div class="flower-light flower-light__2"></div>
                    <div class="flower-light flower-light__3"></div>
                    <div class="flower-light flower-light__4"></div>
                    <div class="flower-light flower-light__5"></div>
                    <div class="flower-light flower-light__6"></div>
                    <div class="flower-light flower-light__7"></div>
                    <div class="flower-light flower-light__8"></div>
                    </div>

                    <div class="flower-bottom">
                    <div class="flower-stem"></div>
                    <div class="flower-leaf flower-leaf__1"></div>
                    <div class="flower-leaf flower-leaf__2"></div>
                    <div class="flower-leaf flower-leaf__3"></div>
                    <div class="flower-leaf flower-leaf__4"></div>
                    <div class="flower-leaf flower-leaf__5"></div>
                    <div class="flower-leaf flower-leaf__6"></div>

                    <div class="flower-grass flower-grass__1"></div>
                    <div class="flower-grass flower-grass__2"></div>
                    <div class="flower-grass flower-grass__3"></div>
                    <div class="flower-grass flower-grass__4"></div>
                    </div>`;
  });

  const flowers = Array.from(document.querySelectorAll('.flower-container'));
  const animatedClass = 'animate';

  flowers[0].classList.add(animatedClass);

  setTimeout(() => {
    for (let i = 1; i <= 2 && i < flowers.length; i++) {
      flowers[i].classList.add(animatedClass);
    }

    let remaining = flowers.slice(3);
    const interval = setInterval(() => {
      if (remaining.length === 0) {
        clearInterval(interval);
        return;
      }

      const randomIndex = Math.floor(Math.random() * remaining.length);
      const el = remaining.splice(randomIndex, 1)[0];
      el.classList.add(animatedClass);
    }, 500);

  }, 3000);
}

const audio = document.querySelector('audio');
const hint = document.getElementById("tapHint");
const ground = document.querySelector('.ground');

// Variable para controlar si ya se inició
let started = false;
let audioUnlocked = false;

// Función para desbloquear audio en Android
function unlockAudio() {
  if (audioUnlocked || !audio) return;

  // Crear un AudioContext (necesario para Android)
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (AudioContext) {
    const audioContext = new AudioContext();
    audioContext.resume();
  }

  // Pre-cargar el audio
  audio.load();
  audio.volume = 0.6;

  // Intentar reproducir y pausar inmediatamente (desbloqueo)
  const unlockPromise = audio.play();
  if (unlockPromise !== undefined) {
    unlockPromise
      .then(() => {
        audio.pause();
        audio.currentTime = 0;
        audioUnlocked = true;
        console.log('✓ Audio desbloqueado');
      })
      .catch(e => {
        console.log('⚠ Unlock failed:', e);
      });
  }
}

function playAudio() {
  if (!audio) return;

  // Asegurar volumen
  audio.volume = 0.6;
  audio.currentTime = 0;

  // Intentar reproducir
  const playPromise = audio.play();

  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        console.log('✓ Audio reproduciendo');
      })
      .catch(error => {
        console.error('✗ Error al reproducir:', error);

        // Reintento 1
        setTimeout(() => {
          audio.play()
            .then(() => console.log('✓ Audio OK (intento 2)'))
            .catch(e => {
              console.error('✗ Intento 2 falló:', e);

              // Reintento 2
              setTimeout(() => {
                audio.play()
                  .then(() => console.log('✓ Audio OK (intento 3)'))
                  .catch(err => console.error('✗ Intento 3 falló:', err));
              }, 200);
            });
        }, 100);
      });
  }
}

function start(e) {
  // Evitar múltiples ejecuciones
  if (started) return;
  started = true;

  // Prevenir comportamiento por defecto
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }

  // Desbloquear audio primero (crítico para Android)
  unlockAudio();

  // Remover hint
  if (hint) {
    hint.remove();
  }

  // Iniciar animación
  ground.style.transform = 'scale(1.5)';
  ground.style.animationPlayState = 'running';
  startFlowers();

  // Reproducir audio con delay para Android
  setTimeout(() => {
    playAudio();
  }, 50);

  // Limpiar listeners
  document.removeEventListener('click', start);
  document.removeEventListener('touchstart', start);
  document.removeEventListener('touchend', startOnce);
}

// Función alternativa para touchend
function startOnce(e) {
  if (!started) {
    start(e);
  }
}

// Event listeners con máxima compatibilidad
document.addEventListener('click', start, { passive: false });
document.addEventListener('touchstart', start, { passive: false });
document.addEventListener('touchend', startOnce, { passive: false });

// Listener adicional para reintentar audio después
document.addEventListener('touchend', function retryAudio() {
  setTimeout(() => {
    if (audio && audio.paused && started) {
      console.log('⚠ Reintentando audio...');
      playAudio();
    }
  }, 500);
}, { once: true });

// Pre-desbloqueo en primer toque (Android)
let firstTouch = true;
document.addEventListener('touchstart', function preUnlock() {
  if (firstTouch && !started) {
    firstTouch = false;
    unlockAudio();
  }
}, { once: true, passive: false });

// Animación extra del logo después de 10 segundos
document.addEventListener('DOMContentLoaded', function () {
  const logoContainer = document.querySelector('.logo-container');

  setTimeout(() => {
    if (logoContainer) {
      logoContainer.classList.add('super-attention');
    }
  }, 10000);
});

// Fix para altura dinámica del viewport en móviles
function updateViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

updateViewportHeight();
window.addEventListener('resize', updateViewportHeight);
window.addEventListener('orientationchange', updateViewportHeight);

// Prevenir scroll accidental en móviles
if (hint) {
  hint.addEventListener('touchmove', function (e) {
    e.preventDefault();
  }, { passive: false });
}

// Debug: Log cuando el audio esté listo
if (audio) {
  audio.addEventListener('canplaythrough', function () {
    console.log('✓ Audio cargado y listo');
  }, { once: true });

  audio.addEventListener('playing', function () {
    console.log('✓ Audio está sonando');
  });

  audio.addEventListener('error', function (e) {
    console.error('✗ Error en el audio:', e);
  });
}