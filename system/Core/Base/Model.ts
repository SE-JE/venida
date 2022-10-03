/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

namespace System.Core.Base {

    export class Model {

        public DB: any;

        public init: (request: any, response: any) => any = () => {};

        public load: (moduleName: any) => any = () => {};

        /**
         * Constructor method
         */
        public constructor () {

            let me = this;

            this.init = () => {

                let createConnection = Venida.Datasource;

                if (!createConnection) {
                    Venida.Response.exception('INTERNAL_SERVER_ERROR', 'Failed to create connection at primary DB');
                }

                this.DB = createConnection;
            }

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

module.exports = System.Core.Base.Model;