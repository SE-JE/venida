/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

namespace System.Handler {

    export class Route {

        public requestURI (req: any) {

            const URL = Venida.import('url');
            let uri = URL.parse(this.getURI(req));

            if (req?.method) {
                uri.method = req?.method;
            } else {
                uri.method = null;
            }

            return uri;
        }

        public getURI (req: any) {

            /**
             * Soon improvement for whitelist IP Address feature
             * 
             * if (!whitelistHost.includes(req?.hostname)) {
             *     // exception
             * }
             */
            
            // if (req?.protocol && req?.host) {
            //     return req['protocol'] + '://' + req['host'] + '' + req['url'];
            // }

            return `${req?.protocol}://${req?.hostname}${req?.url}`;
        }

        /**
         * Init all router
         */
        public initRoute () {

            let routes = Venida.RouterConfig.get('routes');

            for (let route of routes) {

                Venida.Server.register(Venida.import(route.path), {prefix: route.prefix});
            }
        }
    }
 }

 module.exports = new System.Handler.Route();