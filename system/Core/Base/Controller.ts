/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

 namespace System.Core.Base {

    export class Controller {

        public request: any = {};

        public response: any = {};

        public service: (moduleName: any) => any = () => {};

        /**
         * Constructor method
         */
        public constructor (req: any, res: any) {
            this.request = req;

            this.response = res;

            this.service = async (serviceName: any) => {

                let packagePath = Venida.identifier.concat('.',
                    Venida.Config.get('service'),
                    '.',
                    serviceName
                );

                let service = Venida.import(packagePath);

                service = new service();

                await service;

                return service;
            }

        }
    }
}

module.exports = System.Core.Base.Controller;