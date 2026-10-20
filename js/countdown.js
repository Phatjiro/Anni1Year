export class LoveCountdown {
  constructor(startDateString, elements) {
    this.startDate = new Date(startDateString);
    this.elements = elements;
    this.timerId = null;
  }

  start() {
    this.update();
    this.timerId = setInterval(() => this.update(), 1000);
  }

  stop() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  update() {
    const now = new Date();
    const diff = Math.max(0, now - this.startDate);

    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (this.elements.days) this.elements.days.textContent = String(days).padStart(2, '0');
    if (this.elements.hours) this.elements.hours.textContent = String(hours).padStart(2, '0');
    if (this.elements.minutes) this.elements.minutes.textContent = String(minutes).padStart(2, '0');
    if (this.elements.seconds) this.elements.seconds.textContent = String(seconds).padStart(2, '0');
  }
}
