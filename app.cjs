/**
 * cPanel / Phusion Passenger Node.js Entry Point
 * 
 * In cPanel's "Setup Node.js App" interface:
 * - Set "Application startup file" to: app.cjs (or dist/server.cjs)
 * - Set "Application mode" to: Production
 */

require('./dist/server.cjs');
