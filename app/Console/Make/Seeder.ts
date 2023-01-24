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

    export class Seeder extends BaseConsole {

        constructor() {
            super();
            this.signature = '{name: The seeder name}';
            this.description = 'Make database seeder file with named';
        }

        handle = async () => {

            let seederName: string;

            seederName = `${this.argument('name')}.ts`;

            console.log('seeder name:', seederName);

            let template = await this.generateTemplate(this.argument('name'));

            const seedFileLocation = Path.join(Venida.getPath(), `../database/seeders/${seederName}`);

            if (!FileSystem.existsSync(seedFileLocation)) {
                await VFile.put(seedFileLocation, template);
            }

            this.print('Make seeder file success');

            return true;
        }

        private generateTemplate = async (seederName: string) => {

            let template: any = await VFile.get(Path.join(Venida.getPath(), `../generators/templates/Seeder/CreateSeeder.venida`));

            let tableName = seederName.split('Seeder')[0];

            template = template.replace(new RegExp(`{{ tableName }}`, 'g'), `\"${tableName}\"`);

            return template;
        }
    }
}

module.exports = App.Console.Make.Seeder;