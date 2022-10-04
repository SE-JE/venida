/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

namespace App.Console {
    const BaseConsole = Venida.import('Venida.System.Core.Base.Console');
    export class Server extends BaseConsole {
        protected signature: string = 'serve {--host=} {--port=}';
        protected description: string = 'This is a sample console command';

        handle = async () => {
            /**
             * Web Server Initialize
             */
            const Server = Venida.class('Venida.system.Core.Boot');

            /**
             * Set route configuration
             */
            Venida.class('Venida.system.Handler.Route').initRoute();

            const nodePort = Venida.Config.get('server')['port'];
            const nodeName = Venida.Config.get('server')['name'];

            Server.listen({
                port: nodePort
            })
                .then((address: string) => console.log(`Node [${nodeName}] started on ${address}`))
                .catch((err: string) => {
                    console.log('Error starting server:', err);
                    process.exit(1);
                });
        }
    }
};

module.exports = App.Console.Server;