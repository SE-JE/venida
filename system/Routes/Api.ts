/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

namespace System.Routes.API {

    module.exports = (router: any, option: any, next: any) => {

        /**
         * Dynamic Route Mapping
         */
        router.get('/', (req: any, res: any, next: any) => {
            
            console.log('req', req.protocol);
            
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

                let aliasParams = pathParams;

                let routerData = Venida.import('Venida.routes.Api')();
                
                // let fetchRouterData = routerData.filter((route: any) => {

                //     let removeSlash = route?.prefix?.split('/');

                //     console.log(removeSlash);

                //     let onetest = route?.routes.map((one: any) => { 
                //         if (one?.method.toUpperCase() == method) {
                //             return one;
                //         }
                //     });
                
                //     return route?.prefix == '/user' && onetest;
                // });

                let fetchRouterGroupData = routerData.find((routeGroup: any) => {
                    
                    return routeGroup?.prefix == '/user';
                });

                let checkRoute;

                if (fetchRouterGroupData) {

                    console.log('routeGroup found✅');
                    checkRoute = fetchRouterGroupData?.routes.find((route: any) => {

                        // return route?.method.toUpperCase() == method;
                        if (route?.method.toUpperCase() == method) {
                            return route;
                        } else {
                            /**
                             * Request not implement
                             */
                            console.log('Route not found');
                        }
                    });
                }

                console.log('fetchRouterData', checkRoute);
                
                

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