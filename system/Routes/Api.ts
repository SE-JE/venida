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

                let aliasParams = pathParams;

                console.log('pathParams✅', pathParams);
                

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