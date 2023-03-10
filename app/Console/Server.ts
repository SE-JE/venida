/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

namespace App.Console {
    const BaseConsole = Venida.import('Venida.system.Core.Base.Console');
    export class Server extends BaseConsole {
        protected signature: string = 'serve {--nodePort:running port=} {--nodeName:name of the node=}';
        protected description: string = 'Running Venida Server';

        handle = async () => {
            /**
             * Web Server Initialize
             */
            const Server = Venida.class('Venida.system.Core.Boot');

            /**
             * Set route configuration
             */
            Venida.class('Venida.system.Handler.Route').initRoute();

            const nodePort = this.option('nodePort', Venida.Config.get('server')['port']);
            const nodeName = this.option('nodeName', Venida.Config.get('server')['name']);

            Server.listen({
                port: nodePort
            })
                .then((address: string) => this.print(`Node [${nodeName}] started on ${address}`))
                .catch((err: string) => {

                    this.trow('Error starting server:', err);
                    process.exit(1);
                });
        }
    }
};

module.exports = App.Console.Server;