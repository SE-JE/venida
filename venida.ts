/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

console.log('init Venida Platform');

global.Venida = require('./system/Core/Core');

Venida.setPath(__dirname);

/**
 * Load Configuration
 */
Venida.define('Config', Venida.class('Venida.config.config'));

Venida.define('RouterConfig', Venida.class('Venida.config.router'));

Venida.define('DatabaseConfig', Venida.class('Venida.config.database'));

Venida.define('RedisConfig', Venida.class('Venida.config.redis'));

/**
 * Initial Venida Utils
 */
Venida.define('Utils', Venida.class('Venida.config.util'));

// get first argument
let firstArgument = process.argv[2];

// Assign serve to firstArgument if argument is not set
if (!firstArgument) {
    firstArgument = 'list';
}

// replace : with space
firstArgument = firstArgument.split(':').join(' ');

// capitalize first letter
firstArgument = firstArgument.toLowerCase().replace(/\b[a-z]/g, function (letter) {
    return letter.toUpperCase();
});

// replace space with :
firstArgument = firstArgument.split(' ').join('.');

// check if command is exist
if (Venida.exist(`Venida.app.Console.${firstArgument}`)) {
    Venida.command(`Venida.app.Console.${firstArgument}`, process.argv, false, true);
}


