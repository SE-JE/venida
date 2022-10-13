/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

namespace Config {

    export class Config {

        private Env = Venida.import('dotenv', true);

        private readonly config: { [key: string]: any } = {};

        /**
         * Constructor Method
         */
        constructor() {

            this.Env.config();

            this.config = {

                server: {
                    name: process.env.APP_NAME ?? 'Venida Platform',
                    host: process.env.SERVER_HOST ?? '127.0.0.1',
                    port: process.env.SERVER_PORT ?? 8080,
                    environment: process.env.APP_MODE ?? 'development'
                },

                defaultOutput: 'json',

                controller: 'App.Http.Controllers',
                model: 'App.Models',
                console: 'App.Console',
                service: 'App.Services',
                hooks: 'App.Http.Hooks',
                applicationPath: '/app',
                allowedApiMethod: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

            }
        }

        public get(key: string) {
            return this.config[key];
        }
    }
}

module.exports = new Config.Config();