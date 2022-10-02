/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

namespace System.Core {

    const Knex: any = Venida.import('knex', true);

    export class Datasource {

        private static PrimaryDatabase: any;

        /**
         * Constructor Method
         */
        constructor () {

            if (!Datasource.PrimaryDatabase) {
                Datasource.PrimaryDatabase = this;
            }
        }

        public static Instance () {

            if (!Datasource.PrimaryDatabase) {
                
                let defaultDatabase = Venida.DatabaseConfig.get('default');

                Datasource.PrimaryDatabase = Knex(Venida.DatabaseConfig.get('connection')[defaultDatabase]);
            }

            Datasource.PrimaryDatabase.createConnection = async (config: any) => {

                if (!config) {
                    return false;
                }

                let connection = await Knex(config);

                if (!connection) {
                    return false;
                }
                
                return connection;
            } 

            return Datasource.PrimaryDatabase;
        }
        
    }
}

module.exports = System.Core.Datasource.Instance();
