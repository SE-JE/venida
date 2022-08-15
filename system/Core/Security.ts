/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

namespace System.Core {

    export class Security {

        /**
         * Validate route by request
         */
        public async validateRoute(req: any, res: any) {

            /**
             * Route Structure
             */
            let separator = '/';

            let requestUri = Venida.Route.requestURI(req);

            let routerData = Venida.import('Venida.routes.Api');

            let pathParams = Venida.Request.get(req, 'params')['*'].replace('/index', '');

            let params = pathParams.split(separator);

            let module = params[0];

            let func = params[1];

            let endpoint = separator.concat(module);
        
            console.log('module:', module);
            console.log('function:', func);
            console.log('endpoint:', endpoint);

            return requestUri;
        }
    }
}

module.exports = new System.Core.Security();