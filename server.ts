/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

console.log('init server.ts');

global.Venida = require('./system/Core/Core');

Venida.setPath(__dirname);

/**
 * Load Configuration
 */
Venida.define('Config', Venida.class('Venida.config.config'));
