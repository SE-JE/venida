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

            let UserModel = await this.load('User');

            let result = await UserModel.getAll();

            Venida.Response.send(this.response, {data: result, total: result.length});
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

            let requests = this.request.body;

            console.log('body parser', requests);

            let dataParams = {data: `Test doubleParams controller: ${username} ${id}`};

            let result = await Venida.Datasource.select('*').from('siteoperator').limit(100)
                .catch((err: any) => {
                    console.log(err);
                    Venida.Response.exception('QUERY_ERROR', 'Failed to query');
                });

            console.log(Venida.DatabaseConfig.get('secondaryConnection')['mysql']);

            let newConnection = await Venida.Datasource.createConnection(Venida.DatabaseConfig.get('secondaryConnection')['mysql']);

            if (!newConnection) {
                Venida.Response.exception('INTERNAL_SERVER_ERROR', 'Failed to create connection');
            }

            let result2 = await newConnection.select('*').from('users')
                .catch((err: any) => {
                    console.log(err);
                    Venida.Response.exception('QUERY_ERROR', 'Failed to query');
                })
            
            
            Venida.Response.send(this.response, result2);
        }

    }
 }

 module.exports = App.Http.Controllers.Api.V1.UserController;