/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

namespace App.Console.Route {
    const BaseConsole = Venida.import('Venida.system.Core.Base.Console');

    export class List extends BaseConsole {
        protected signature: string = '';
        protected description: string = 'List all available console commands';

        generateUrlFromRoute = (routes: any, prefix: string): any => {
            // format route: [method] url [controller::method]
            let template = [];
            for (let route of routes.routes) {
                let url = route.path;
                if (routes.version) {
                    url = routes.version + url;
                }
                if (prefix) {
                    url = prefix + '/' + url;
                }

                if (route.query) {
                    url = url + '/' + route.query;
                }

                // replace double slash with single slash
                url = url.replace(/\/\//g, '/');
                template.push({
                    method: route.method.toUpperCase(),
                    url,
                    controller: route.controller.replaceAll('.', '/'),
                    fn: route.fn
                });
            }

            return template;
        }

        handle = async () => {
            let routerConfig = Venida.import('Venida.config.router');
            // console.log(routerConfig);
            let routes = routerConfig.get('routes');
            // console.log(routes);

            let template = ``;
            let result = [];
            for (let route of routes) {
                let routeClass = Venida.import(route.target)();

                for (let r of routeClass) {
                    let url = this.generateUrlFromRoute(r, route.prefix);
                    for (let u of url) {
                        result.push(u);
                    }
                }
            }

            // sort result by url
            result.sort((a, b) => {
                if (a.url < b.url) {
                    return -1;
                }
                if (a.url > b.url) {
                    return 1;
                }
                return 0;
            });

            // display table with same width
            let maxMethodLength = 0;
            let maxUrlLength = 0;
            let maxControllerLength = 0;
            let maxFnLength = 0;
            for (let r of result) {
                if (r.method.length > maxMethodLength) {
                    maxMethodLength = r.method.length;
                }
                if (r.url.length > maxUrlLength) {
                    maxUrlLength = r.url.length;
                }
                if (r.controller.length > maxControllerLength) {
                    maxControllerLength = r.controller.length;
                }
                if (r.fn.length > maxFnLength) {
                    maxFnLength = r.fn.length;
                }
            }

            // add header
            result.unshift({
                method: 'Method',
                url: 'Url',
                controller: 'Controller',
                fn: 'Fn'
            });

            // add space
            maxMethodLength += 2;
            maxUrlLength += 2;
            maxControllerLength += 2;
            maxFnLength += 2;

            // add space
            for (let r of result) {
                r.method = r.method.padEnd(maxMethodLength, ' ');
                r.url = r.url.padEnd(maxUrlLength, ' ');
                r.controller = r.controller.padEnd(maxControllerLength, ' ');
                r.fn = r.fn.padEnd(maxFnLength, ' ');
            }

            // display result as table
            for (let index = 0; index < result.length; index++) {
                const r = result[index];

                // add border
                if (index === 0) {
                    template += `+${'-'.repeat(maxMethodLength + 2)}+${'-'.repeat(maxUrlLength + 2)}+${'-'.repeat(maxControllerLength + 2)}+${'-'.repeat(maxFnLength + 2)}+\n`;
                }

                // different color based on method type
                if (r.method.trim() === 'GET') {
                    template += `\x1b[32m| ${r.method} | ${r.url} | ${r.controller} | ${r.fn} |\n`;
                } else if (r.method.trim() === 'POST') {
                    template += `\x1b[33m| ${r.method} | ${r.url} | ${r.controller} | ${r.fn} |\n`;
                } else if (r.method.trim() === 'PUT') {
                    template += `\x1b[34m| ${r.method} | ${r.url} | ${r.controller} | ${r.fn} |\n`;
                } else if (r.method.trim() === 'DELETE') {
                    template += `\x1b[31m| ${r.method} | ${r.url} | ${r.controller} | ${r.fn} |\n`;
                } else {
                    template += `\x1b[37m| ${r.method} | ${r.url} | ${r.controller} | ${r.fn} |\n`;
                }

                // add border
                if (index === 0) {
                    template += `+${'-'.repeat(maxMethodLength + 2)}+${'-'.repeat(maxUrlLength + 2)}+${'-'.repeat(maxControllerLength + 2)}+${'-'.repeat(maxFnLength + 2)}+\n`;
                }
            }

            // add footer
            template += `+${'-'.repeat(maxMethodLength + 2)}+${'-'.repeat(maxUrlLength + 2)}+${'-'.repeat(maxControllerLength + 2)}+${'-'.repeat(maxFnLength + 2)}+\n`;

            this.print(template);
        }
    }
}

module.exports = App.Console.Route.List;