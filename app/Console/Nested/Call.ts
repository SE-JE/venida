/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

namespace App.Console.Nested {
    const BaseConsole = Venida.import('Venida.system.Core.Base.Console');

    export class Call extends BaseConsole {
        protected signature: string = '';
        protected description: string = 'Example of nested console';

        handle = async () => {
            this.print(`This is a nested command, you can call it with: venida nested:call`);
        }
    }
}

module.exports = App.Console.Nested.Call;