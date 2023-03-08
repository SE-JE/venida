/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

namespace App.Console.Queue {

    const BaseConsole = Venida.import('Venida.system.Core.Base.Console');
    const { spawn } = Venida.import('child_process', true);
    const Path = Venida.import('path', true);

    export class Work extends BaseConsole {

        constructor() {
            super();
            this.signature = '';
            this.description = 'Run a worker queue process';
        }

        handle = async () => {

            this.print('Queue:Work running');
            let path = `"${Path.join(Venida.getPath(), 'system', 'Core', 'Base', 'Queue', 'Worker.js')}"`;
            path = path.replace(/ /g, '\ ');
            this.print(path);

            let command = `node ${path}`;
            command = command.replace(/ /g, '\ ');

            this.executer(command, function (result: any) {
                return result;
            });

            return true;
        }

        private executer (cmd: any, callback: any) {
            cmd = cmd.replace(/ /g, '\ ');
            let command = spawn(cmd, { stdio: 'inherit', shell: true });
            // command.stdout.on('data', function(data: any) {
            //      result += data.toString();
            // });
            command.on('close', function(code: any) {
                return callback(code);
            });
        }
    }
}

module.exports = App.Console.Queue.Work;