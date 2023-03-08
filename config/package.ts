/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

namespace Config {

    /**
     * Basically the Venida Packages & Utils are the same thing. But the most basic differences is in
     * the Venida Package you can access the Datasource module that you can do queries to the database.
     * Besides that, you can also access several other services such as redis, and others.
     * Venida can do this because the Packages will load before the Fastify instance.
     */

    export class Package {

        private readonly config: {[key: string]: any} = {};

        /**
         * Constructor Method
         */
        constructor () {

            this.config = {

                register: [
                    {
                        name: 'Validator',
                        package: 'Venida.system.Package.Validator'
                    },
                    {
                        name: 'Queue',
                        package: 'Venida.system.Package.Queue'
                    },
                    // {
                    //     name: 'Storage',
                    //     package: 'Venida.system.Package.Storage'
                    // }
                ]
            }

            this.init();
        }

        private init () {

            if(this.config.register) {

                for (let one of this.config.register) {

                    if (!this[one.name]) {

                        this[one.name] = Venida.class(one.package);
                    } else {
                        console.error(`Duplicate load package at ${one.name}`);
                    }
                }
            }
        }

        public get (key: string) {
            return this.config[key];
        }
    }
}

module.exports = new Config.Package();