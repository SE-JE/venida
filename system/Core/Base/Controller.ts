/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

 namespace System.Core.Base {

    export class Controller {

        public request: any = {};

        public response: any = {};

        /**
         * Constructor method
         */
        public constructor (req: any, res: any) {

            this.request = req;

            this.response = res;

        }
    }
}

module.exports = System.Core.Base.Controller;