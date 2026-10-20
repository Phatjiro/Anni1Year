export class MusicController {
  constructor(config, widgetElements) {
    this.config = config;
    this.elements = widgetElements;
    this.audio = new Audio(config.sourceUrl);
    this.audio.loop = true;
    this.isPlaying = false;
    this.audioContext = null;
    this.synthesizerInterval = null;

    this.bindEvents();
  }

  bindEvents() {
    if (this.elements.toggleBtn) {
      this.elements.toggleBtn.addEventListener('click', () => this.toggle());
    }

    this.audio.addEventListener('play', () => {
      this.isPlaying = true;
      this.updateVisualState(true);
    });

    this.audio.addEventListener('pause', () => {
      this.isPlaying = false;
      this.updateVisualState(false);
    });

    this.audio.addEventListener('error', () => {
      this.useSynthesizerFallback = true;
    });
  }

  play() {
    if (this.useSynthesizerFallback) {
      this.startSynthesizerMelody();
      this.isPlaying = true;
      this.updateVisualState(true);
      return;
    }

    this.audio.play()
      .then(() => {
        this.isPlaying = true;
        this.updateVisualState(true);
      })
      .catch(() => {
        this.startSynthesizerMelody();
        this.isPlaying = true;
        this.updateVisualState(true);
      });
  }

  pause() {
    if (this.useSynthesizerFallback || this.audioContext) {
      this.stopSynthesizerMelody();
    }
    this.audio.pause();
    this.isPlaying = false;
    this.updateVisualState(false);
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  updateVisualState(playing) {
    if (this.elements.disc) {
      this.elements.disc.classList.toggle('spinning', playing);
    }
    if (this.elements.status) {
      this.elements.status.textContent = playing ? 'Đang phát...' : 'Tạm dừng';
    }
    if (this.elements.toggleBtn) {
      this.elements.toggleBtn.classList.toggle('is-playing', playing);
      this.elements.toggleBtn.classList.toggle('is-paused', !playing);
    }
  }

  startSynthesizerMelody() {
    if (!this.audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioCtx();
    }

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    const notes = [261.63, 329.63, 392.00, 523.25, 440.00, 392.00, 329.63];
    let noteIndex = 0;

    const playNote = () => {
      if (!this.isPlaying) return;
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(notes[noteIndex % notes.length], this.audioContext.currentTime);

      gain.gain.setValueAtTime(0.001, this.audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, this.audioContext.currentTime + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioContext.currentTime + 1.8);

      osc.connect(gain);
      gain.connect(this.audioContext.destination);

      osc.start();
      osc.stop(this.audioContext.currentTime + 1.9);

      noteIndex++;
    };

    playNote();
    this.synthesizerInterval = setInterval(playNote, 1600);
  }

  stopSynthesizerMelody() {
    if (this.synthesizerInterval) {
      clearInterval(this.synthesizerInterval);
      this.synthesizerInterval = null;
    }
  }
}
