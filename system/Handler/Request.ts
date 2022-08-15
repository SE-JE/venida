/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

namespace System.Handler {

    export class Request {

        public get (requestName: string, key: string) {

            try {
                return requestName[key];
            } catch (error) {
                return null;
            }
        }

        public push (request: any, data: any) {

            if (!request) {
                return false;
            }

            request[Venida.identifier] = data;

            return request[Venida.identifier];
        }
    }
}

module.exports = new System.Handler.Request();