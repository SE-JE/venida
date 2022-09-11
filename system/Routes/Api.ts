/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

namespace System.Routes.API {

    const RegExpMatch = Venida.import('path-to-regexp', true).match;

    module.exports = (router: any, option: any, next: any) => {

        /**
         * Dynamic Route Mapping
         */
        router.get('/:id', (req: any, res: any, next: any) => {
            
            console.log('req', req.params);
            
            res.send('TEST SUCCESS');
        });

        router.all('/:version/*', {}, async (req: any, res: any) => {

            /**
             * Serve routing engine
             */
            let method = Venida.Request.get(req, 'method');

            let allowedMethod = Venida.Config.get('allowedApiMethod');
            console.log('method = ', method);
            

            if (allowedMethod.includes(method)) {
                /**
                 * Allowed request method
                 */
                let route = await Venida.Security.validateRoute(req, res);

                console.log('❄️', route);

                let separator   = '/';
                let version = Venida.Request.get(req, 'params')['version'];
                
                let params = separator.concat(Venida.Request.get(req, 'params')['*']).replace('/index', '');

                let pathParams = params.split(separator)[1];
                let routeData   = route?.alias.split(separator);

                console.log('pathParams',pathParams);
                console.log('route.query', route?.query);

                let config = {
                    method: method.toUpperCase(),
                    params: [],
                    func: routeData[2] ? routeData[2] : 'index',
                    version: version
                }

                if (pathParams && !route?.query) {
                    console.error('Request Not Implement');
                }

                if (pathParams && route?.query) {

                    let match = RegExpMatch(route.query, { decode: decodeURIComponent });

                    let check = match(pathParams);

                    config['params'] = Object.values(check?.params);
                }

                /**
                 * Require Http Controller
                 */
                let HttpController = Venida.import(
                    'Venida.'
                    .concat(route?.controller)
                );

                let Controller = new HttpController(req, res);

                if (Controller && typeof Controller[config?.func] == 'function') {

                    await Controller[config?.func].apply(Controller, option?.params);
                } else {

                    console.error('Controller not implements');
                }


            } else {
                /**
                 * Request not implement
                 */
                return false;
            }
        });

        next();
    }
 }