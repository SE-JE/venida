/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

namespace System.Package {

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

        public async validate (params: any, rules: {[key: string]: string[]}) {

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

                    const startsWith = (str: string) => {
                        if (validationRule[idx].startsWith(str)) {
                            return validationRule[idx];
                        }
                    }

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
                        case startsWith('isExist'): {
                            
                            const separator: string = '.';
                            const QueryBuilder = Venida.Datasource;

                            const lookupParams = validationRule[idx].split(':')[validationRule[idx].split(':').length - 1] ?? null;
                            let lookupParamsArray: string[] = (lookupParams && typeof lookupParams === 'string') ? lookupParams.split(separator) : [];

                            if (Array.isArray(lookupParamsArray) && lookupParamsArray.length > 0) {

                                if (lookupParamsArray.length == 2) {

                                    let result = await QueryBuilder.first(`${lookupParamsArray[1]} AS fieldSelect`)
                                        .from(lookupParamsArray[0])
                                        .where(`${lookupParamsArray[0]}.${lookupParamsArray[1]}`, paramData)
                                        .catch((error: any) => {
                                            console.log(error);
                                            this.setErrors(key, `Failed to lookup database at field ${key}`);
                                        });

                                    if (!result) {
                                        this.setErrors(key, `The key of ${key} is not match in our database records`);
                                    }
                                }
                            }
                        } break;
                    }
                }
            }

            return this.getErrors();
        }
    }
}

module.exports = new System.Package.Validator();