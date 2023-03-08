/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

namespace App.Console.Queue {

    const BaseConsole = Venida.import('Venida.system.Core.Base.Console');
    const VFile = Venida.import('Venida.system.Core.Base.File');
    const FileSystem = Venida.import('fs');
    const Path = Venida.import('path');

    export class Table extends BaseConsole {

        constructor() {
            super();
            this.signature = '';
            this.description = 'Make database migration file for log job table';
        }

        handle = async () => {

            let migrationName: string;
            let prefixMigrationName = this.getPrefixDate();

            migrationName = `${prefixMigrationName}_job.ts`;

            console.log('Migration name:', migrationName.toLowerCase());

            let template = await this.generateTemplate();

            const migrationFileLocation = Path.join(Venida.getPath(), '..', 'database', 'migrations', `${migrationName.toLowerCase()}`);
            
            if (!FileSystem.existsSync(migrationFileLocation)) {
                await VFile.put(migrationFileLocation, template);
            }

            this.print('Make migration run success');

            return true;
        }

        private generateTemplate = async () => {

            let template: any = await VFile.get(
                Path.join(Venida.getPath(), '..', 'generators', 'templates', 'Migration', 'JobMigration.venida')
            );

            return template;
        }

        private getPrefixDate = () => {

            let str: string;

            let now = new Date();
            let month = (now.getMonth() + 1).toString();
            if (month.length < 2) {
                month = `0${month}`;
            }
            let date = (now.getDate()).toString();
            if (date.length < 2) {
                date = `0${date}`;
            }
            

            str = `${now.getFullYear()}${month}${date}${now.getHours()}${now.getMinutes()}${now.getSeconds()}${now.getMilliseconds()}`;

            return str;
        }
    }
}

module.exports = App.Console.Queue.Table;