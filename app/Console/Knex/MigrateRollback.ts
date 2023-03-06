/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

namespace App.Console.Knex {

    const BaseConsole = Venida.import('Venida.system.Core.Base.Console');
    const Path = Venida.import('path', true);
    const Env = Venida.import('dotenv', true);
    Env.config();
    const Knex = Venida.import('knex', true);

    export class MigrateRollback extends BaseConsole {

        constructor() {
            super();
            this.signature = '{--class: The migration file name}';
            this.description = 'Run the database migration rollback file for rollback all migrations';
        }

        handle = async () => {

            /**
             * Typescript build directory /database/migrations
             */
            // let migrationsPath = Path.join(Venida.getPath(), '..', 'database', 'migrations');
            // console.log('Build database migration files');

            // await FileSystem.readdir(migrationsPath, async (err: any, files: any) => {
            //     for (let file of files) {

            //         let fileDir = Path.join(migrationsPath, file);
            //         await execSync(`ts-node compiler.ts ${fileDir}`, {
            //             stdio: 'inherit'
            //         });
            //     }
            // });

            /**
             * Knex migrate rollback
             */
            let knexfile = Venida.import('Venida.declaration.knexfile');

            let KnexInstance = Knex(knexfile[`${process.env.APP_MODE}`]);

            let config = {
                directory: Path.join(Venida.getPath(), 'database', 'migrations'),
                extension: 'js'
            }

            if (this.option('class')) {
                config['name'] = `${this.option('class')}.js`
            }
            
            await KnexInstance.migrate.down(config)
                .then(() => {
                    // console.log('success migrate rollback');
                })
                .catch((err: any) => {
                    console.error(err);
                })

            this.print('Success run database migrate rollback');

            return true;
        }
    }
}

module.exports = App.Console.Knex.MigrateRollback;