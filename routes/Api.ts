/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

namespace Routes {

    module.exports = () => {

        return [
            // merge auth routes
            ...require('./Api/AuthRoute')(),
            // merge user routes
            ...require('./Api/UserRoute')(),


            /**
             * Route group prefix
             */
            {
                prefix: '/',
                version: 'v1',
                routes: [
                    {
                        method: 'get',
                        controller: 'App.Http.Controllers.Api.V1.RootController',
                        fn: 'index',
                        path: '/',
                        alias: '/',
                        query: null,
                        requestAuth: 0
                    }
                ]
            },
            {
                prefix: '/home',
                version: 'v1',
                routes: [
                    {
                        method: 'get',
                        controller: 'App.Http.Controllers.Api.V1.HomeController',
                        fn: 'index',
                        path: '/home',
                        alias: '/home',
                        query: null,
                        requestAuth: 0
                    }
                ]
            },

        ];
    }
}