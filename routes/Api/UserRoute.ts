namespace Routes.Api {
    module.exports = () => {
        return [
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
                        method: 'post',
                        controller: 'App.Http.Controllers.Api.V1.UserController',
                        fn: 'doubleParams',
                        path: '/user/doubleParams',
                        alias: '/user/doubleParams',
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
                    {
                        method: 'get',
                        controller: 'App.Http.Controllers.Api.V1.UserController',
                        fn: 'console',
                        path: '/user/console',
                        alias: '/user/console',
                        query: null,
                        requestAuth: 0
                    },
                ]
            }
        ];
    }
}
