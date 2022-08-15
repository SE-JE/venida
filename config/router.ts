/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

 namespace Config {

    export class Router {

        private readonly config: {[key: string]: any} = {};

        /**
         * Constructor Method
         */
        constructor () {

            this.config = {

                routes: [
                    {
                        name: 'Api',
                        path: 'Venida.system.Routes.Api',
                        prefix: '/api'
                    },
                    // {
                    //     name: 'Console',
                    //     path: 'Venida.system.Routes.Console',
                    //     prefix: '/console'
                    // }
                ]
            }
        }

        public get (key: string) {
            return this.config[key];
        }
    }
}

module.exports = new Config.Router();