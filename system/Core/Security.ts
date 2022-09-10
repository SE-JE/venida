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
        public async validateRoute (req: any, res: any) {

            /**
             * Route Structure
             */
            let separator = '/';

            let requestUri = Venida.Route.requestURI(req);

            let routerData = Venida.import('Venida.routes.Api')();

            let pathParams = Venida.Request.get(req, 'params')['*'].replace('/index', '');

            let params = pathParams.split(separator);

            let module = params[0];

            let func = params[1];

            let endpoint = separator.concat(module);
            let endpoint2: any = null;

            let paramLength = 0;
            let paramLength2 = 0;

            if (params) {
                paramLength = params.length - 1;
                paramLength2 = params.length - 2;
            }

            if (func) {
                endpoint2 = endpoint.concat(separator, func);
            }
        
            console.log('module:', module);
            console.log('function:', func);
            console.log('endpoint:', endpoint);
            console.log('endpoint2', endpoint2);
            console.log('paramLength', paramLength);
            console.log('paramLength2', paramLength2);

            console.log('===========');

            let fetchRoute: any;
            let fetchRouterGroupData = routerData.find((routeGroup: any) => {

                return routeGroup?.prefix == endpoint;
            });

            if (fetchRouterGroupData) {

                fetchRoute = fetchRouterGroupData?.routes.find((route: any) => {

                    let returnValue: any = null;
                    if (endpoint2) {
                        /**
                         * is endpoint2
                         */
                        console.log('is endpoint2');
                        
                        if (route?.alias == endpoint2 && route?.alias != null) {

                            /**
                             * Have query params
                             */
                            if (paramLength2 > 0) {
                                console.log('paramlength>0');
                                let splitedUrl = Venida.Request.get(req, 'url').split(endpoint2);
                                let additionalWildcardParams = splitedUrl[splitedUrl.length - 1];
                                additionalWildcardParams = additionalWildcardParams.split('/');

                                if (additionalWildcardParams.length > 0) {

                                    let routeQueryLength = route?.query.split('/:').length;
                                    console.log(additionalWildcardParams.length);
                                    console.log(routeQueryLength);

                                    if (additionalWildcardParams.length == routeQueryLength) {

                                        returnValue = route?.method.toUpperCase() == Venida.Request.get(req, 'method') 
                                                && route?.alias == endpoint2
                                                && route?.query != null;
                                    } else {
                                        console.log('Route not found: additionalWildcardParams');
                                    }
                                }
                            } else {                                
                                returnValue = route?.method.toUpperCase() == Venida.Request.get(req, 'method') 
                                                && route?.alias == endpoint2
                                                && !route?.query;

                                if (!returnValue) {
                                    returnValue = route?.method.toUpperCase() == Venida.Request.get(req, 'method')
                                        && route?.alias == endpoint
                                        && route?.query != null;
                                }
                            }
                        } else {
                            console.log('is endpoint2, alias null', route?.query);

                            if (paramLength > 0) {

                                let splitedUrl = Venida.Request.get(req, 'url').split(endpoint);
                                let additionalWildcardParams = splitedUrl[splitedUrl.length - 1];
                                additionalWildcardParams = additionalWildcardParams.split('/');

                                let routeQueryLength = route?.query != null ? route?.query.split('/:').length : 0;

                                if (additionalWildcardParams.length > 0 && additionalWildcardParams.length == routeQueryLength) {

                                    returnValue = route?.method.toUpperCase() == Venida.Request.get(req, 'method') 
                                            && route?.alias == endpoint
                                            && route?.query != null;
                                } else {
                                    console.log('Route not found: additionalWildcardParams (endpoint in endpoint2)');
                                }
                            } else {

                                // returnValue = route?.method.toUpperCase() == Venida.Request.get(req, 'method')
                                //         && route?.alias == endpoint
                                //         || route?.alias == endpoint2
                                //         && route?.paramlength == 0;
                                console.log('(endpoint in endpoint2) paramLength 0');
                            }
                        }
                    } else {
                        /**
                         * is endpoint
                         */
                        console.log('is endpoint');
                        
                        returnValue = route?.method.toUpperCase() == Venida.Request.get(req, 'method')
                                        && route?.alias == endpoint
                                        && route?.query == null;
                    }

                    return returnValue;
                });
            }

            console.log('checkRoute', fetchRoute);
            
            if (!fetchRoute) {
                /**
                 * Request not implement
                 */
                console.log('Route not found');
            }

            return fetchRoute;
        }

        public async old_validateRoute (req: any, res: any) {

            /**
             * Route Structure
             */
            let separator = '/';

            let requestUri = Venida.Route.requestURI(req);

            let routerData = Venida.import('Venida.routes.Api')();

            let pathParams = Venida.Request.get(req, 'params')['*'].replace('/index', '');

            let params = pathParams.split(separator);

            let module = params[0];

            let func = params[1];

            let endpoint = separator.concat(module);
            let endpoint2: any = null;

            let paramLength = 0;
            let paramLength2 = 0;

            if (params) {
                paramLength = params.length - 1;
                paramLength2 = params.length - 2;
            }

            if (func) {
                endpoint2 = endpoint.concat(separator, func);
            }
        
            console.log('module:', module);
            console.log('function:', func);
            console.log('endpoint:', endpoint);
            console.log('endpoint2', endpoint2);
            console.log('paramLength', paramLength);
            console.log('paramLength2', paramLength2);

            console.log('===========');
            console.log('endpoint2 or 1', endpoint2 ? endpoint2 : endpoint);
            

            let fetchRoute: any;
            let fetchRouterGroupData: any;

            let flatten = Venida.import('flat', true);

            let flattenRouter = flatten(routerData);

            let prefixRequest: any;
            let aliasRequest: any;
            let pathRequest: any;

            for (let key in flattenRouter) {

                if (key.includes('routes')) {

                    
                }
            }
            
            console.log('routeGroup', fetchRouterGroupData);
            console.log('checkRoute', fetchRoute);
            console.log('prefixReq', prefixRequest);
            
            
            if (!fetchRoute) {
                /**
                 * Request not implement
                 */
                console.log('Route not found');
            }

            return fetchRoute;
        }
    }
}

module.exports = new System.Core.Security();