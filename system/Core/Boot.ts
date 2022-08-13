/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

const Fastify = Venida.import('fastify', true);

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

    const OnRequestHook = Venida.import('App.Http.Hooks.OnRequest');

    console.log(OnRequestHook);

    return await OnRequestHook.handler(request, response);
});


module.exports = Venida.Server;