/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

const Fastify = Venida.import('fastify', true);

/**
 * Define Venida handler
 */
Venida.define('Request', Venida.import('Venida.system.Handler.Request'));

Venida.define('Route', Venida.import('Venida.system.Handler.Route'));

Venida.define('Security', Venida.import('Venida.system.Core.Security'));

Venida.define('Response', Venida.import('Venida.system.Handler.Response'));

/**
 * Datasource initializer
 */
Venida.define('Datasource', Venida.import('Venida.system.Core.Datasource'));

/**
 * Init Venida Packages
 */
Venida.define('Packages', Venida.class('Venida.config.package'));


/**
 * Init Fastfy as Venida Web Server
 */
Venida.Server = new Fastify({
    logger: true
});

/**
 * Initial response exception
 */
Venida.Response.initException();

/**
 * Register Hooks
 */
Venida.Server.addHook('onRequest', async (request: any, response: any) => {

    const OnRequestHook = Venida.import('Venida.app.Http.Hooks.OnRequest');

    console.log(OnRequestHook);

    return await OnRequestHook.handler(request, response);
});

Venida.Server.addHook('preValidation', async (request: any, response: any) => {

    const PreValidationHook = Venida.import('Venida.app.Http.Hooks.PreValidation');

    return await PreValidationHook.handler(request, response);
});

Venida.Server.addHook('onResponse', async (request: any, response: any) => {

    const OnResponseHook = Venida.import('Venida.app.Http.Hooks.OnResponse');

    return await OnResponseHook.handler(request, response);
});

/**
 * Register the Fastify packages
 */
Venida.Server.register(Venida.import('@fastify/formbody', true));

Venida.Server.register(Venida.import('@fastify/helmet', true), {
    contentSecurityPolicy: false
});

Venida.Server.register(Venida.import('@fastify/compress', true), {
    global: true,
    encodings: ['gzip']
});

Venida.Server.register(Venida.import('@fastify/multipart', true), {
    addToBody: true
})



module.exports = Venida.Server;