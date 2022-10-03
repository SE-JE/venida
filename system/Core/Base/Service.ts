/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

namespace System.Core.Base {

    export class Service {


        public model: (moduleName: any) => any = () => { };

        /**
         * Constructor method
         */
        public constructor() {
            this.model = async (modelName: any) => {

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

module.exports = System.Core.Base.Service;