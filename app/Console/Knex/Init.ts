/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

namespace App.Console.Knex {

    const BaseConsole = Venida.import('Venida.System.Core.Base.Console');

    export class Db extends BaseConsole {

        constructor() {
            super();
            this.signature = '';
            this.description = 'initiate knex database';
        }


        handle = async () => {
            const knex = Venida.import('knex');
            const config = Venida.import('Venida.config.Database');

            let connectionConfig = config.getDatabase();

            // generate knexfile.js file
            const fs = Venida.import('fs');
            const path = Venida.import('path');
            const knexfile = path.join(Venida.getPath(), '../declaration/knexfile.ts');

            let setting: any = connectionConfig;
            console.log('connectionConfig', connectionConfig);
            
            setting['migrations'] = {
                "tableName": "migrations",
                "extensions": ["js"],
                "directory": "../../database/migrations"
            }
            setting['seeds'] = {
                "directory": "../../database/seeds"
            }

            if (!fs.existsSync(knexfile)) {
                fs.writeFileSync(knexfile, `module.exports = {\n\t"development": ${JSON.stringify(setting, null, 4)}\n}`);
            }

            // initiate knex database
            const db = knex(connectionConfig);
            await db.raw('CREATE DATABASE IF NOT EXISTS ??', [connectionConfig.connection.database]);
            await db.destroy();

            console.log('Path:', knexfile);
            this.print('Knex database initiated successfully');

            return true;
        }
    }
}

module.exports = App.Console.Knex.Db;

