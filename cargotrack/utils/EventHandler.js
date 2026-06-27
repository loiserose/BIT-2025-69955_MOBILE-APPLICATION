// EventHandler.js - Using CommonJS (module.exports)

/**
 * Class-based event handler for user input
 * Week 8: Handling User Input and Events
 */

class EventHandler {
  // Keyboard events
  onKeyPress(key) {
    console.log(`[KEYBOARD] Key pressed: ${key}`);
    
    // Handle specific keys
    if (key === 'Enter') {
      return this.submitForm();
    } else if (key === 'Escape') {
      return this.cancelAction();
    } else {
      console.log(`[KEYBOARD] Unhandled key: ${key}`);
      return { success: false, message: `Unhandled key: ${key}` };
    }
  }

  submitForm() {
    console.log('[ACTION] Form submitted successfully!');
    return { success: true, message: 'Form submitted' };
  }

  cancelAction() {
    console.log('[ACTION] Action cancelled');
    return { success: false, message: 'Cancelled by user' };
  }

  // Touch events
  onTap() {
    console.log('[TOUCH] Tap detected');
    return { success: true, message: 'Screen tapped' };
  }

  onSwipe(direction) {
    console.log(`[TOUCH] Swipe detected: ${direction}`);
    
    if (direction === 'left') {
      return this.swipeLeft();
    } else if (direction === 'right') {
      return this.swipeRight();
    } else {
      return { success: false, message: `Unknown swipe direction: ${direction}` };
    }
  }

  swipeLeft() {
    console.log('[NAVIGATION] Swiped left - Previous page');
    return { success: true, action: 'previous', message: 'Navigating to previous page' };
  }

  swipeRight() {
    console.log('[NAVIGATION] Swiped right - Next page');
    return { success: true, action: 'next', message: 'Navigating to next page' };
  }

  onLongPress() {
    console.log('[TOUCH] Long press detected');
    return { success: true, action: 'context_menu', message: 'Displaying context menu' };
  }

  // Input validation
  validateInput(input, type) {
    if (type === 'username') {
      if (input.length < 3) {
        return { valid: false, message: 'Username must be at least 3 characters' };
      }
      return { valid: true, message: 'Valid username' };
    }
    
    if (type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input)) {
        return { valid: false, message: 'Please enter a valid email address' };
      }
      return { valid: true, message: 'Valid email' };
    }
    
    if (type === 'password') {
      if (input.length < 6) {
        return { valid: false, message: 'Password must be at least 6 characters' };
      }
      return { valid: true, message: 'Valid password' };
    }
    
    return { valid: false, message: 'Unknown validation type' };
  }

  // Log events
  logEvent(eventType, data) {
    const timestamp = new Date().toISOString();
    console.log(`[LOG] ${timestamp} - Event: ${eventType}`, data);
    return { timestamp, eventType, data };
  }
}

// Export using CommonJS
module.exports = EventHandler;