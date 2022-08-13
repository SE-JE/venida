/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

namespace App.Http.Hooks {

    export class OnRequest {

        public async handler (request: any, response: any) {

            // do something..
        }
    }
}

module.exports = new App.Http.Hooks.OnRequest();