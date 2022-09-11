/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

 namespace System.Handler {

    interface optionSucces {
        responseCode: number,
        success: boolean,
        message: string
    }

    export class Response {

        private readonly responseCode: number;

        private readonly responseContent: {[key: string]: any};

        /**
         * Constructor method
         */
        constructor () {

            this.responseCode = 200;

            this.responseContent = {

                /**
                 * Default response code
                 */
                responseCode: 200,

                /**
                 * Context
                 */
                context: '',

                /**
                 * Execute time
                 */
                execTime: 0,

                /**
                 * Application environment
                 */
                environment: Venida.Config.server?.environment,

                /**
                 * Default success status
                 */
                success: true,

                /**
                 * Default success message
                 */
                message: 'Your request successfully completed.',

                /**
                 * Response data
                 */
                value: null
            }
        }

        public send (response: {[key: string]: any}, data: any, option: any = null) {

            response.output = Venida.Config.get('defaultOutput');

            let responseContent: any = this.onSuccess(data, option);

            responseContent['execTime'] = Math.floor(Date.now()/1000) - Venida.Request.requestTime;
            // Venida.Request.resetRequestTime();

            response.status(responseContent.responseCode);
            response.send(responseContent);
        }

        /**
         * Format Response on Success
         * 
         * @param data
         * @param options
         */
        private onSuccess (data: any, options: optionSucces) {

            let responseContent = this.responseContent;

            responseContent.success = true;
            responseContent.message = 'Your request successfully completed.';
            responseContent.value   = data;

            responseContent.context = Venida.Utils.String.generateRandomString(32);

            if (options) {
                responseContent = Object.assign(responseContent, options);
            }

            return responseContent;
        }

        /**
         * Basic Venida response setter
         */

        public setHeader (response: {[key: string]: any}, key: string, value: any) {
            response.setHeader(key, value);
        }

        public setStatus (response: {[key: string]: any}, key: string, value: any) {
            response.status(key, value);
        }

        public setSuccess (success: string) {
            this.responseContent['success'] = success;
            return this;
        }

        public setMessage (message: string) {
            this.responseContent['message'] = message;
            return this;
        }
    }
}

module.exports = new System.Handler.Response();