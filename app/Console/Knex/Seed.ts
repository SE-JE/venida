/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

namespace App.Console.Knex {

    const BaseConsole = Venida.import('Venida.system.Core.Base.Console');
    const Path = Venida.import('path', true);
    const Env = Venida.import('dotenv', true);
    const FileSystem = Venida.import('fs', true);
    Env.config();
    const Knex = Venida.import('knex', true);
    const { execSync  } = Venida.import('child_process', true);

    export class Seed extends BaseConsole {

        constructor() {
            super();
            this.signature = '{--class: The seeder specified file name?}';
            this.description = 'Run the database seeder file';
        }

        handle = async () => {

            /**
             * Typescript build directory /database/seeders
             */
            // let seedersPath = Path.join(Venida.getPath(), '..', 'database', 'seeders');
            // console.log('Build database seeder files');

            // await FileSystem.readdir(seedersPath, async (err: any, files: any) => {
            //     for (let file of files) {
            //         let fileDir = Path.join(seedersPath, file);
            //         await execSync(`ts-node compiler.ts ${fileDir}`, {
            //             stdio: 'inherit'
            //         });
            //     }
            // });

            /**
             * Knex seed run
             */
            let knexfile = Venida.import('Venida.declaration.knexfile');

            let KnexInstance = Knex(knexfile[`${process.env.APP_MODE}`]);

            let config = {
                directory: Path.join(Venida.getPath(), 'database', 'seeders'),
                extension: 'js'
            }

            if (this.option('class')) {
                config['specific'] = `${this.option('class')}.js`;
            }
            
            await KnexInstance.seed.run(config)
                .catch((err: any) => {
                    console.error(err);
                })

            this.print('Success run database seeder');

            return true;
        }
    }
}

module.exports = App.Console.Knex.Seed;