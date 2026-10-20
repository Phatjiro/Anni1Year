export class TypewriterObserver {
  constructor() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const diaryElement = entry.target.querySelector('.polaroid-diary');
          if (diaryElement && !diaryElement.dataset.typed) {
            this.typeText(diaryElement);
          }
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.35
    });
  }

  observe(cardElement) {
    this.observer.observe(cardElement);
  }

  typeText(element) {
    element.dataset.typed = 'true';
    const originalText = element.dataset.fullText || '';
    element.textContent = '';
    let charIndex = 0;

    const interval = setInterval(() => {
      if (charIndex < originalText.length) {
        element.textContent += originalText[charIndex];
        charIndex++;
      } else {
        clearInterval(interval);
      }
    }, 38);
  }
}
