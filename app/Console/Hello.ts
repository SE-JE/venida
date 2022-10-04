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
            console.log(`
Hello World ${this.argument('name')}
Your age is ${this.option('age', 0)}
Your skill is ${this.option('skill', []).join(', ')}
`);
        }
    }
}

module.exports = App.Console.Hello;