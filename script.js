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

function start() {
  audio.volume = 0.6;
  audio.play();

  hint.remove();

  ground.style.transform = 'scale(1.5)';
  ground.style.animationPlayState = 'running';

  startFlowers();
  document.removeEventListener('click', start);
  document.removeEventListener('touchstart', start);
}

document.addEventListener('click', start);
document.addEventListener('touchstart', start, { passive: false });

// Segundo intento de activación de audio si el primero falla
document.addEventListener('touchend', function audioRetry(e) {
  if (audio && audio.paused && !hint) {
    audio.play().catch(err => console.log('Retry failed:', err));
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

// Actualizar altura al cargar, redimensionar o rotar
updateViewportHeight();
window.addEventListener('resize', updateViewportHeight);
window.addEventListener('orientationchange', updateViewportHeight);

// Prevenir scroll accidental en móviles durante la interacción con tapHint
if (hint) {
  hint.addEventListener('touchmove', function (e) {
    e.preventDefault();
  }, { passive: false });
}