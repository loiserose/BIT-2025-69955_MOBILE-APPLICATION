// testEvents.js - Using CommonJS (require)
const EventHandler = require('./EventHandler');

// Create an instance of the event handler
const handler = new EventHandler();

console.log('=== TESTING KEYBOARD EVENTS ===');
handler.onKeyPress('Enter');
handler.onKeyPress('Escape');
handler.onKeyPress('A');

console.log('\n=== TESTING TOUCH EVENTS ===');
handler.onTap();
handler.onSwipe('left');
handler.onSwipe('right');
handler.onSwipe('up');
handler.onLongPress();

console.log('\n=== TESTING INPUT VALIDATION ===');
console.log('Username "jo":', handler.validateInput('jo', 'username'));
console.log('Username "john":', handler.validateInput('john', 'username'));
console.log('Email "test":', handler.validateInput('test', 'email'));
console.log('Email "test@email.com":', handler.validateInput('test@email.com', 'email'));
console.log('Password "123":', handler.validateInput('123', 'password'));
console.log('Password "123456":', handler.validateInput('123456', 'password'));

console.log('\n=== TESTING EVENT LOGGING ===');
handler.logEvent('login_attempt', { username: 'john', success: true });
handler.logEvent('shipment_added', { trackingNumber: 'CRG-1842', status: 'Pending' });