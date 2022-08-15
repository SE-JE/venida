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


/**
 * Init Fastfy as Venida Web Server
 */
Venida.Server = new Fastify({
    logger: true
});

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


module.exports = Venida.Server;