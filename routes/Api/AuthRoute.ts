namespace Routes {
    module.exports = () => {
        return [
            {
                prefix: '/auth',
                version: 'v1',
                routes: [
                    {
                        method: 'post',
                        controller: 'App.Http.Controllers.Api.V1.AuthController',
                        fn: 'login',
                        path: '/auth/login',
                        alias: '/auth/login',
                        query: null,
                        requestAuth: 0
                    },
                    {
                        method: 'post',
                        controller: 'App.Http.Controllers.Api.V1.AuthController',
                        fn: 'register',
                        path: '/auth/register',
                        alias: '/auth/register',
                        query: null,
                        requestAuth: 0
                    },
                    {
                        method: 'get',
                        controller: 'App.Http.Controllers.Api.V1.AuthController',
                        fn: 'logout',
                        path: '/auth/logout',
                        alias: '/auth/logout',
                        query: null,
                        requestAuth: 0
                    }
                ]
            }
        ]
    }
}