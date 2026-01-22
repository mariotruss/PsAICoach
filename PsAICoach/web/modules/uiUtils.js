// UI Utilities Module
export class UIUtils {
  static timestamp() {
    return new Intl.DateTimeFormat('de-DE', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    }).format(new Date());
  }

  static formatDate(date, options = {}) {
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    
    return new Intl.DateTimeFormat('de-DE', { ...defaultOptions, ...options }).format(date);
  }

  static showNotification(message, type = 'info', duration = 3000) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    
    // Add to body
    document.body.appendChild(notification);
    
    // Trigger animation
    requestAnimationFrame(() => {
      notification.classList.add('show');
    });
    
    // Remove after duration
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, duration);
  }

  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  static async animateValue(element, start, end, duration = 1000) {
    const startTime = Date.now();
    const range = end - start;
    
    function updateValue() {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const eased = progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;
      
      const current = start + (range * eased);
      element.textContent = Math.round(current);
      
      if (progress < 1) {
        requestAnimationFrame(updateValue);
      }
    }
    
    requestAnimationFrame(updateValue);
  }

  static renderCardList(items, container, formatter) {
    container.innerHTML = '';
    items.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = formatter(item);
      container.appendChild(li);
    });
  }

  static smoothScrollTo(element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

