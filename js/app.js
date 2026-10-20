import { anniversaryConfig } from './config.js';
import { MusicController } from './audio.js';
import { HeartExplosion } from './heartExplosion.js';

document.addEventListener('DOMContentLoaded', () => {
  const heartExplosion = new HeartExplosion('heart-canvas');

  const musicController = new MusicController(anniversaryConfig.music, {
    disc: document.getElementById('vinyl-disc'),
    status: document.getElementById('vinyl-status'),
    toggleBtn: document.getElementById('vinyl-toggle-btn')
  });

  initEnvelope(heartExplosion, musicController);
  renderScrapbookTimeline(heartExplosion);
  initSecretModal(heartExplosion);
  startFloatingPetals();
  initScrollReveal();
});

function initEnvelope(heartExplosion, musicController) {
  const envelopeScreen = document.getElementById('envelope-screen');
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  const waxSealBtn = document.getElementById('wax-seal-btn');

  const openAction = () => {
    if (envelopeWrapper.classList.contains('opening')) return;

    envelopeWrapper.classList.add('opening');
    const rect = waxSealBtn.getBoundingClientRect();
    heartExplosion.createHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 35);
    musicController.play();

    setTimeout(() => {
      envelopeScreen.classList.add('opened');
    }, 1200);
  };

  waxSealBtn.addEventListener('click', openAction);
  envelopeWrapper.addEventListener('click', () => {
    if (!envelopeWrapper.classList.contains('opening')) {
      openAction();
    }
  });
}

function renderScrapbookTimeline(heartExplosion) {
  const streamContainer = document.getElementById('scrapbook-stream');
  if (!streamContainer) return;

  streamContainer.innerHTML = '';

  anniversaryConfig.memories.forEach((mem, index) => {
    const isReversed = index % 2 === 1;
    const entryEl = document.createElement('article');
    entryEl.className = `scrapbook-entry fade-in-up ${isReversed ? 'layout-reversed' : 'layout-normal'}`;

    entryEl.innerHTML = `
      <div class="scrapbook-photo-col">
        <div class="polaroid-scrapbook-card ${mem.tilt}">
          <div class="washi-tape-angle"></div>
          <div class="polaroid-image-frame" data-id="${mem.id}">
            <img src="${mem.image}" alt="${mem.title}" class="polaroid-img" loading="lazy" decoding="async">
            <div class="photo-overlay-badge">
              ${mem.month}
            </div>
            <svg class="double-tap-heart" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="scrapbook-text-col">
        <div class="journal-paper-card">
          <div class="journal-top-bar">
            <span class="journal-chapter-tag">${mem.month}</span>
            <span class="journal-date-tag">${mem.date}</span>
          </div>

          <h3 class="journal-title">${mem.title}</h3>

          <p class="journal-diary-content">${mem.diary}</p>

          <div class="journal-quote-box">
            <span class="journal-quote-text">"${mem.quote}"</span>
          </div>

          <div class="journal-footer-stamp">
            <span>Anh yêu Mí</span>
          </div>
        </div>
      </div>
    `;

    const frame = entryEl.querySelector('.polaroid-image-frame');
    const heartSvg = entryEl.querySelector('.double-tap-heart');
    let lastTap = 0;

    frame.addEventListener('click', (e) => {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap;

      if (tapLength < 350 && tapLength > 0) {
        heartSvg.classList.remove('animate');
        void heartSvg.offsetWidth;
        heartSvg.classList.add('animate');

        const rect = frame.getBoundingClientRect();
        heartExplosion.createHeartBurst(e.clientX || (rect.left + rect.width / 2), e.clientY || (rect.top + rect.height / 2), 20);

        setTimeout(() => {
          heartSvg.classList.remove('animate');
        }, 900);
      }
      lastTap = currentTime;
    });

    streamContainer.appendChild(entryEl);
  });
}

function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.15
  });

  document.querySelectorAll('.scrapbook-entry').forEach((el) => {
    observer.observe(el);
  });
}

function initSecretModal(heartExplosion) {
  const openBtn = document.getElementById('open-secret-btn');
  const modal = document.getElementById('secret-modal');
  const closeBtn = document.getElementById('close-secret-btn');
  const letterHeading = document.getElementById('modal-letter-heading');
  const letterBody = document.getElementById('modal-letter-body');
  const letterSign = document.getElementById('modal-letter-sign');

  if (letterHeading) letterHeading.textContent = anniversaryConfig.letter.heading;
  if (letterBody) letterBody.textContent = anniversaryConfig.letter.body;
  if (letterSign) letterSign.textContent = anniversaryConfig.letter.signature;

  const showModal = () => {
    modal.classList.add('active');
    const rect = openBtn.getBoundingClientRect();
    heartExplosion.createHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 45);
  };

  const hideModal = () => {
    modal.classList.remove('active');
  };

  if (openBtn) openBtn.addEventListener('click', showModal);
  if (closeBtn) closeBtn.addEventListener('click', hideModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) hideModal();
    });
  }
}

function startFloatingPetals() {
  const container = document.body;

  setInterval(() => {
    if (document.hidden) return;
    const petal = document.createElement('div');
    petal.className = 'floating-petal';

    const startX = Math.random() * window.innerWidth;
    const size = Math.random() * 8 + 10;
    const duration = Math.random() * 6 + 6;

    petal.style.left = `${startX}px`;
    petal.style.top = '-20px';
    petal.style.width = `${size}px`;
    petal.style.height = `${size * 1.3}px`;
    petal.style.transition = `transform ${duration}s linear, opacity ${duration}s ease`;

    container.appendChild(petal);

    requestAnimationFrame(() => {
      const endX = startX + (Math.random() - 0.5) * 150;
      const endRotation = Math.random() * 720;
      petal.style.transform = `translate(${endX - startX}px, ${window.innerHeight + 40}px) rotate(${endRotation}deg)`;
      petal.style.opacity = '0';
    });

    setTimeout(() => {
      petal.remove();
    }, duration * 1000);
  }, 1200);
}
