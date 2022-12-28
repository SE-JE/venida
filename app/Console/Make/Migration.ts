/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

 namespace App.Console.Make {

    const BaseConsole = Venida.import('Venida.system.Core.Base.Console');
    const VFile = Venida.import('Venida.system.Core.Base.File');
    const FileSystem = Venida.import('fs');
    const Path = Venida.import('path');

    export class Migration extends BaseConsole {

        constructor() {
            super();
            this.signature = '{name: The migration name}';
            this.description = 'Make database migration file with named';
        }

        handle = async () => {

            let migrationName: string;
            let prefixMigrationName = this.getPrefixDate();

            migrationName = `${prefixMigrationName}_${this.argument('name')}.ts`;

            console.log('migration name:', migrationName);

            let template = await this.generateTemplate(this.argument('name'));
            
            const migrationFileLocation = Path.join(Venida.getPath(), `../database/migrations/${migrationName}`);
            
            if (!FileSystem.existsSync(migrationFileLocation)) {
                await VFile.put(migrationFileLocation, template);
            }

            this.print('Migration run success');

            return true;
        }

        private generateTemplate = async (migrationName: string) => {

            let template: any = await VFile.get(Path.join(Venida.getPath(), `../generators/templates/Migration/CreateMigration.venida`));

            let fileName: string = migrationName;

            template = template.replace(new RegExp(`{{ tableName }}`, 'g'), `\"${migrationName}\"`);

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

module.exports = App.Console.Make.Migration;