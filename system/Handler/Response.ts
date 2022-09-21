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

    interface optionError {
        responseCode: number,
        success: boolean,
        message: string,
        error?: any
    }

    export class Response {

        private readonly responseContent: {[key: string]: any};

        /**
         * Constructor method
         */
        constructor () {

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

        public sendError (response: {[key: string]: any}, errorCode: string, options: any = null) {

            response.output = Venida.Config.get('defaultOutput');

            let responseContent: any = this.onError(errorCode, options);

            responseContent['execTime'] = Math.floor(Date.now()/1000) - Venida.Request.requestTime;

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
         * Format Response on Error/Failed
         * 
         * @param errorCode 
         * @param options
         */
        private onError (errorCode: string = "INTERNAL_SERVER_ERROR", options: optionError) {

            let responseContent = this.responseContent;

            responseContent.responseCode = 500;
            responseContent.success = false;
            responseContent.message = 'Yout request failed.';
            responseContent.error = null;
            delete responseContent['value'];

            responseContent.context = Venida.Utils.String.generateRandomString(32);

            let errorDeclaration = this.getError(errorCode);

            if (errorDeclaration) {
                responseContent['message'] = errorDeclaration?.message;
                responseContent['responseCode'] = errorDeclaration?.responseCode;
            }

            if (options) {
                responseContent['message'] = options?.message ?? responseContent['message'];
                responseContent['responseCode'] = options?.responseCode ?? responseContent['responseCode'];
                responseContent['success'] = options?.success ?? responseContent['success'];
                responseContent['error'] = options?.error ?? responseContent['error'];
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

        /**
         * Basic Venida response getter
         */

        public getError (errorCode: string) {

            let ErrorJson = Venida.import('Venida.error-declaration');

            let error = ErrorJson[errorCode];

            if (!error) {
                error = ErrorJson['INTERNAL_SERVER_ERROR'];
                error['message'] = `Unknown error code ${errorCode} at error declaration.`;
            }

            if (error && error?.isActive != 1) {
                error = ErrorJson['INTERNAL_SERVER_ERROR'];
                error['message'] = `Error type ${errorCode} doesn't activated yet.`;
            }

            return error;
        }
    }
}

module.exports = new System.Handler.Response();