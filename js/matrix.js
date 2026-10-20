export class MemoryMatrix3D {
  constructor(containerId, photos) {
    this.container = document.getElementById(containerId);
    this.photos = photos || [];
    this.tracks = [];
    this.animationId = null;
    const isPhone = window.innerWidth < 768;
    this.currentSpeed = isPhone ? 2.4 : 3.6;
    this.targetSpeed = isPhone ? 0.55 : 1.35;
    this.decayRate = 0.996;

    if (this.container && this.photos.length > 0) {
      this.init();
    }
  }

  init() {
    this.container.innerHTML = '';

    const isPhone = window.innerWidth < 768;
    const trackConfigs = [
      { depthClass: 'depth-far', estimatedWidth: isPhone ? 115 : 145, speedMult: 0.75, topPercent: 18 },
      { depthClass: 'depth-near', estimatedWidth: isPhone ? 215 : 270, speedMult: 1.35, topPercent: 38 },
      { depthClass: 'depth-mid', estimatedWidth: isPhone ? 160 : 195, speedMult: 1.0, topPercent: 66 },
      { depthClass: 'depth-far', estimatedWidth: isPhone ? 115 : 145, speedMult: 0.8, topPercent: 86 }
    ];

    window.addEventListener('resize', () => {
      this.targetSpeed = window.innerWidth < 768 ? 0.55 : 1.35;
    });

    const screenWidth = window.innerWidth || 1920;
    const shuffledPool = [...this.photos];
    for (let i = shuffledPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledPool[i], shuffledPool[j]] = [shuffledPool[j], shuffledPool[i]];
    }

    trackConfigs.forEach((cfg, trackIndex) => {
      const trackWrapper = document.createElement('div');
      trackWrapper.className = `matrix-3d-row ${cfg.depthClass}`;
      trackWrapper.style.top = `${cfg.topPercent}%`;

      const trackInner = document.createElement('div');
      trackInner.className = 'matrix-3d-track';

      trackWrapper.appendChild(trackInner);
      this.container.appendChild(trackWrapper);

      const trackPhotos = [];
      for (let i = 0; i < shuffledPool.length; i++) {
        if (i % trackConfigs.length === trackIndex) {
          trackPhotos.push(shuffledPool[i]);
        }
      }
      if (trackPhotos.length === 0) {
        trackPhotos.push(...shuffledPool);
      }

      for (let i = trackPhotos.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [trackPhotos[i], trackPhotos[j]] = [trackPhotos[j], trackPhotos[i]];
      }

      const minSetWidth = screenWidth + 1200;
      const minItems = Math.max(12, Math.ceil(minSetWidth / cfg.estimatedWidth));
      const repeatWithinSet = Math.max(1, Math.ceil(minItems / trackPhotos.length));

      const singleSet = [];
      for (let r = 0; r < repeatWithinSet; r++) {
        singleSet.push(...trackPhotos);
      }

      const itemsPerSet = singleSet.length;
      const fullList = [...singleSet, ...singleSet, ...singleSet];

      fullList.forEach((item) => {
        const card = document.createElement('div');
        card.className = `matrix-3d-card ${cfg.depthClass}`;
        card.innerHTML = `
          <div class="matrix-3d-inner">
            <img src="${item.image}" alt="${item.title || 'Kỷ niệm'}" loading="lazy" decoding="async">
            <span class="matrix-3d-tag">${item.month || ''}</span>
          </div>
        `;
        trackInner.appendChild(card);
      });

      const fallbackSetWidth = itemsPerSet * cfg.estimatedWidth;
      const initialStagger = (trackIndex * 240) % fallbackSetWidth;

      this.tracks.push({
        element: trackInner,
        itemsPerSet: itemsPerSet,
        singleSetWidth: fallbackSetWidth,
        x: -fallbackSetWidth + initialStagger,
        measured: false,
        speedMult: cfg.speedMult
      });
    });

    this.startLoop();
  }

  startLoop() {
    const frame = () => {
      if (this.currentSpeed > this.targetSpeed) {
        this.currentSpeed = Math.max(this.targetSpeed, this.currentSpeed * this.decayRate);
      }

      this.tracks.forEach((track) => {
        if (!track.measured && track.element.children.length > track.itemsPerSet) {
          const firstCard = track.element.children[0];
          const nextSetCard = track.element.children[track.itemsPerSet];
          if (firstCard && nextSetCard) {
            const actualSetWidth = nextSetCard.offsetLeft - firstCard.offsetLeft;
            if (actualSetWidth > 0) {
              const currentOffsetFromSet = (track.x % track.singleSetWidth);
              track.singleSetWidth = actualSetWidth;
              track.x = -actualSetWidth + currentOffsetFromSet;
              track.measured = true;
            }
          }
        }

        track.x += this.currentSpeed * track.speedMult;

        if (track.x >= 0) {
          track.x -= track.singleSetWidth;
        }

        track.element.style.transform = `translate3d(${track.x}px, 0, 0)`;
      });

      this.animationId = requestAnimationFrame(frame);
    };

    this.animationId = requestAnimationFrame(frame);
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}
