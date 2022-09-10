/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

 namespace Config {

    export class Util {

        private readonly config: {[key: string]: any} = {};

        /**
         * Constructor Method
         */
        constructor () {

            this.config = {

                register: [
                    {
                        name: 'String',
                        package: 'Venida.system.Util.String'
                    },
                    // {
                    //     name: 'Date',
                    //     package: 'Venida.system.Util.Date'
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
                        console.error(`Duplicate load util at ${one.name}`);
                    }
                }
            }
        }

        public get (key: string) {
            return this.config[key];
        }
    }
}

module.exports = new Config.Util();