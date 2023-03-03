/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

namespace Config {

    export class Redis {

        private Env = Venida.import('dotenv', true);

        private readonly config: { [key: string]: any } = {};

        /**
         * Constructor Method
         */
        constructor() {

            this.Env.config();

            this.config = {

                /**
                 * Redis Configuration
                 */
                redisConfig : {
                    host     : process.env["REDIS_HOST"],
                    port     : process.env["REDIS_PORT"],
                    password : process.env["REDIS_PASSWORD"],
                    database : process.env["REDIS_DB"] ?? 0,
                }
            }
        }

        public get(key: string) {
            return this.config[key];
        }
    }
}

module.exports = new Config.Redis();