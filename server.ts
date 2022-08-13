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


/**
 * Web Server Initialize
 */
const Server = Venida.class('Venida.system.Core.Boot');

const nodePort = Venida.Config.get('server')['port'];
const nodeName = Venida.Config.get('server')['name'];

// const ServerStarter = async () => {
//     try {
//         await Server.listen(nodePort, nodeName);
//     } catch (error: any) {
//         Server.log.error(error);
//         process.exit(0);
//     }
// }

// ServerStarter();

Server.listen({
    port: nodePort
})
    .then((address: string) => console.log(`Node [${nodeName}] started on ${address}`))
    .catch((err: string) => {
        console.log('Error starting server:', err);
        process.exit(1);
    });