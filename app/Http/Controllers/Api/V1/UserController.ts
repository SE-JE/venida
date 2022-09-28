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


            Venida.Response.exception('VALIDATION_ERROR', 'Failed to update');
            // Venida.Response.send(this.response, {data: dataExample});
            console.log('bottom exception does not execute');
        }

        public async detail (id: any) {
            
            // Venida.Response.send(this.response, {data: `Test detail controller: ${id}`})
            Venida.Response.sendError(this.response, 'VALIDATION_ERROR', {
                error: [
                    {
                        field: 'name',
                        message: 'is exist'
                    },
                    {
                        field: 'email',
                        message: 'not match with pattern'
                    }
                ]
            });
        }

        public async doubleParams (username: string, id: any) {
            
            Venida.Response.send(this.response, {data: `Test doubleParams controller: ${username} ${id}`})
        }

    }
 }

 module.exports = App.Http.Controllers.Api.V1.UserController;