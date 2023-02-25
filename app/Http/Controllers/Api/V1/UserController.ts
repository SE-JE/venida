/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

namespace App.Http.Controllers.Api.V1 {

    const BaseController = Venida.import('Venida.system.Core.Base.Controller');

    export class UserController extends BaseController {

        constructor(request: any, response: any) {
            super(request, response);
        }

        public async console() {
            // running console command
            Venida.commandSilently('Venida.App.Console.Hello', ['--name=Venada', '--age=20']);

            let response: string = await Venida.command('Venida.App.Console.Hello', {
                'name': 'Venida',
                '--age': 20,
                '--skill': ['mancing', 'besbol']
            }, true);

            return Venida.Response.send(this.response, { data: response });
        }

        public async index() {

            let UserService = await this.load('UserService', 'service');

            let { query } = this.request;
            let limit = query.limit ? parseInt(query.limit) : 10;
            let page = query.page ? parseInt(query.page) : 1;
            let search = query.search ?? '';
            let result = await UserService.paginate(page, limit, search);

            return Venida.Response.send(this.response, result);
        }

        public async detail(id: any) {
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

        public async doubleParams(username: string, id: any) {

            let requests = this.request.body;

            console.log('body parser', requests);

            let dataParams = { data: `Test doubleParams controller: ${username} ${id}` };

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

            let result2 = await newConnection.select('*').from('users').limit(60)
                .catch((err: any) => {
                    console.log(err);
                    Venida.Response.exception('QUERY_ERROR', 'Failed to query');
                })


            return Venida.Response.send(this.response, result);
        }

        public async requestValidate() {
            /**
             * Validator example
             */
            // let params = this.request.body;
            // let validate = await Venida.Packages.Validator.validate(params, {
            //     name: ['string'],
            //     age: ['numeric'],
            //     email: ['isExist:user.email']
            // });
            // Venida.Response.send(this.response, params);

            let model = await this.load('User', 'model');

            let result = await model.findAll();

            console.log('result log', result);

            Venida.Response.send(this.response, result);
            // Venida.Response.exception('QUERY_ERROR', 'Test error exception', result);
        }

    }
}

module.exports = App.Http.Controllers.Api.V1.UserController;