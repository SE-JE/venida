/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

namespace App.Http.Hooks {

    export class OnRequest {

        public async handler (request: any, response: any) {

            /**
             * Fill request time for count the execute time
             */
            Venida.Request.requestTime = Date.now();

            // do something..
        }
    }
}

module.exports = new App.Http.Hooks.OnRequest();