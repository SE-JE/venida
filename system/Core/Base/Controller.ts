/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

 namespace System.Core.Base {

    export class Controller {

        public request: any = {};

        public response: any = {};

        public load: (moduleName: any, type: string) => any = () => {};

        /**
         * Constructor method
         */
        public constructor (req: any, res: any) {
            this.request = req;

            this.response = res;

            this.load = async (moduleName: any, type: string = 'model') => {

                let packagePath = Venida.identifier.concat('.',
                    Venida.Config.get(type),
                    '.',
                    moduleName
                );

                let module = Venida.import(packagePath);

                module = new module();

                if (type == 'model') {
                    await module.init();
                }

                return module;
            }

        }
    }
}

module.exports = System.Core.Base.Controller;