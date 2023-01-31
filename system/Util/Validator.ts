/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

namespace System.Util {

    export class Validator {

        private errors: {[key: string]: any} = {};

        public setErrors (key: string, message: string) {
            if (!this.errors[key]) {
                this.errors[key] = [];
            }
            this.errors[key].push(message);
        }

        public getErrors () {
            return this.errors;
        }

        public resetErrors() {
            this.errors = {};
        }

        public validate (params: any, rules: {[key: string]: string[]}) {

            /**
             * @TODO: 
             * This is not tested if any request not reset the `this.errors` property.
             * For the alternative, save in error message to local variable scope then return errors.
             * In this situation we have a doubt about it. You can improve and pull a request!
             */
            this.resetErrors();

            for (const key in params) {

                let paramData = params[key];

                if (!rules[key]) {
                    continue;
                }
                
                let validationRule = rules[key] ?? [];

                for (const idx in validationRule) {

                    switch (validationRule[idx]) {
                        case 'string': {
                            
                            if (typeof paramData !== 'string') {
                                // if (!errors[key]) {
                                //     errors[key] = [];
                                // }
                                // errors[key].push(`The key of ${key} must be a string type`);
                                this.setErrors(key, `The key of ${key} must be a string type`);
                            }
                        } break;
                        case 'number':
                        case 'numeric': {

                            if (typeof paramData !== 'number') {
                                // if (!errors[key]) {
                                //     errors[key] = [];
                                // }
                                // errors[key].push(`The key of ${key} must be a numeric type`);
                                this.setErrors(key, `The key of ${key} must be a string type`);
                            }
                        } break;
                    }
                }
            }

            return this.getErrors();
        }
    }
}

module.exports = new System.Util.Validator();