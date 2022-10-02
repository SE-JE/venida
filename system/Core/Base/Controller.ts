/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

 namespace System.Core.Base {

    export class Controller {

        public request: any = {};

        public response: any = {};

        public load: (moduleName: any) => any = () => {};

        /**
         * Constructor method
         */
        public constructor (req: any, res: any) {

            this.request = req;

            this.response = res;

            this.load = async (modelName: any) => {

                let packagePath = Venida.identifier.concat('.',
                    Venida.Config.get('model'),
                    '.',
                    modelName
                );

                let model = Venida.import(packagePath);

                model = new model();

                await model.init();

                return model;
            }

        }
    }
}

module.exports = System.Core.Base.Controller;