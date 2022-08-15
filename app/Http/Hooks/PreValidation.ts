/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

 namespace App.Http.Hooks {

    export class PreValidation {

        public async handler (request: any, response: any) {

            console.log(request.params);
            
        }
    }
}

module.exports = new App.Http.Hooks.PreValidation();