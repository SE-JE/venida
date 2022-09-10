/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

namespace Routes {

    module.exports = () => {

        return [

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
            {
                prefix: '/user',
                version: 'v1',
                routes: [
                    {
                        method: 'get',
                        controller: 'App.Http.Controllers.Api.V1.UserController',
                        fn: 'detail',
                        path: '/user/detail',
                        alias: '/user/detail',
                        query: '/:id',
                        requestAuth: 0
                    },
                    {
                        method: 'get',
                        controller: 'App.Http.Controllers.Api.V1.UserController',
                        fn: 'index',
                        path: '/user',
                        alias: '/user',
                        query: '/:username/:class',
                        requestAuth: 0
                    },
                    {
                        method: 'get',
                        controller: 'App.Http.Controllers.Api.V1.UserController',
                        fn: 'index',
                        path: '/user',
                        alias: '/user',
                        query: null,
                        requestAuth: 0
                    },
                ]
            }
        ];
    }
}