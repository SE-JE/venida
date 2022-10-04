/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

namespace App.Console {
    const BaseConsole = Venida.import('Venida.System.Core.Base.Console');

    export class Hello extends BaseConsole {
        protected signature: string = '{name:The name of user="wildan afbidal"} {--age: Age of user} {--skill|s: Skills of user=*}';
        protected description: string = 'This is a sample console command';

        handle = async () => {
            let template = `Hello ${this.argument('name')}, your age is ${this.option('age')} and your skills are ${this.option('skill')}`;
            this.print(template);
        }
    }
}

module.exports = App.Console.Hello;