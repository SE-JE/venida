/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

 namespace App.Http.Controllers.Api.V1 {

    const BaseController = Venida.import('Venida.system.Core.Base.Controller');

    export class UserController extends BaseController {

        constructor (request: any, response: any) {
            super(request, response);
        }

        public async index () {

            console.log('Called UserController');

            let dataExample = {
                name: 'Venida Platform',
                status: 'Development'
            }

            Venida.Response.send(this.response, {data: dataExample});
        }

    }
 }

 module.exports = App.Http.Controllers.Api.V1.UserController;