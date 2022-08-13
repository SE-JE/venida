/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

namespace Config {

    export class Database {

        private Env = Venida.import('dotenv', true);

        private readonly config: {[key: string]: any} = {};

        /**
         * Constructor Method
         */
        constructor () {

            this.Env.config();

            this.config = {

                default: 'mysql',

                connection: {

                    mysql: {
                        client: 'mysql2',
                        connection: {
                            host : process.env.DB_HOST ?? '127.0.0.1',
                            port : process.env.DB_PORT ?? 3306,
                            user : process.env.DB_USER ?? 'root',
                            password : process.env.DB_PASSWORD ?? '',
                            database : process.env.DB_NAME ?? 'venida_platform'
                          }                        
                    },

                    postgresql: {
                        client: 'pg',
                        version: '7.x',
                        connection: {
                            host : process.env.DB_HOST ?? '127.0.0.1',
                            port : process.env.DB_PORT ?? 3306,
                            user : process.env.DB_USER ?? 'root',
                            password : process.env.DB_PASSWORD ?? '',
                            database : process.env.DB_NAME ?? 'venida_platform'
                        }
                    }
                }

            }
        }

        public get (key: string) {
            return this.config[key];
        }
    }
}

module.exports = new Config.Database();