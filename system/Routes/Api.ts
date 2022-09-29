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
        router.get('/', (req: any, res: any, next: any) => {
            
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

                let pathParams = params.split(route?.path)[1];
                // let routeData   = route?.alias.split(separator);

                console.log('pathParams',pathParams);
                console.log('route.query', route?.query);

                let config: any = {
                    method: method.toUpperCase(),
                    params: [],
                    // func: routeData[2] ? routeData[2] : 'index',
                    func: route?.fn ? route?.fn : 'index',
                    version: version
                }

                if (pathParams && !route?.query) {
                    console.error('Request Not Implement');
                }

                if (pathParams && route?.query) {

                    let match = RegExpMatch(route.query, { decode: decodeURIComponent });

                    let check = match(pathParams);

                    if (!check) {
                        console.error('Request Not Implement');
                    }

                    config['params'] = Object.values(check?.params);
                }

                /**
                 * Require Http Contrcheckoller
                 */
                let HttpController: any;
                
                try {
                    HttpController = Venida.import(
                        'Venida.'
                        .concat(route?.controller)
                    );
                } catch (error: any) {
                    Venida.Response.exception('ROUTE_NOT_FOUND');
                }

                let Controller = new HttpController(req, res);

                if (Controller && typeof Controller[config?.func] == 'function') {

                    try {
                        await Controller[config?.func].apply(Controller, config?.params);
                    } catch (err: any) {
                        Venida.Response.exception('ROUTE_NOT_FOUND');
                    }
                } else {

                    console.error('Controller not implements');
                    Venida.Response.exception('ROUTE_NOT_FOUND');
                }


            } else {
                /**
                 * Request not implement
                 */
                Venida.Response.exception('ROUTE_NOT_FOUND');
                return false;
            }
        });

        next();
    }
 }