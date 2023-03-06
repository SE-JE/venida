/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

namespace App.Console {
    const BaseConsole = Venida.import('Venida.system.Core.Base.Console');
    const fs = Venida.import('fs', true);

    export class List extends BaseConsole {
        protected signature: string = '';
        protected description: string = 'Show list of console command';

        private directoryPath: string = Venida.getPath() + Venida.Config.get('applicationPath') + '/Console';

        private getConsoleList = (path: string) => {
            let list: string[] = [];
            let files = fs.readdirSync(path);
            files.forEach((file: string) => {
                let stat = fs.statSync(path + '/' + file);
                if (stat.isDirectory()) {
                    list = list.concat(this.getConsoleList(path + '/' + file));
                } else {
                    list.push(path + '/' + file);
                }
            });
            return list;
        }

        handle = async () => {
            // get all files in the console directory
            const files: any = this.getConsoleList(this.directoryPath);

            // remove the directory path and the .js extension
            const commandNames: any = files.map((command: any) => command.replace(this.directoryPath + '/', '').replace('.js', ''));

            // to lower case
            let commands: any = commandNames.map((command: any) => {
                const commandName: string = command.replace('/', ':').toLowerCase();
                const localClassName: string = 'Venida.app.Console.' + command.replace(/\//g, '.');

                const commandClass: any = Venida.import(localClassName);
                let commandConstructor: any = new commandClass();

                let returner: object = {};
                returner[commandName] = commandConstructor.description;
                return returner;
            });

            // merge all objects into one
            commands = Object.assign({}, ...commands);

            // order the object by key
            commands = Object.keys(commands).sort().reduce( (r, k) => (r[k] = commands[k], r), {} );

            this.print('Available Commands:');
            this.print('------------------');
            for (let command in commands) {
                this.print(command.padEnd(20) + ' ' + commands[command]);
            }
        }
    }
}

module.exports = App.Console.List;