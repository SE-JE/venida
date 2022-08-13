/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

namespace System.Core {

    export class Core {

        private static Instance: Core;

        private path: string = '';

        private identifier: string = 'Venida';

        private define: (key: any, value: any) =>  any = () => {};

        private class: (className: string, ignoreVenidaPackage?: boolean) => any = () => {};

        private readonly import: (pkg: string, ignoreVenidaPackage?: boolean) => any = () => {};

        private readonly getPath: () => any = () => {};


        /**
         * Constructor Method
         */
        private constructor () {

            if (!Core.Instance) {

                this.getPath = () => {
                    return this.path;
                }

                this.import = (pkg: any, ignoreVenidaPackage?: boolean) => {
                    
                    if (ignoreVenidaPackage) {
                        return require(pkg);
                    }

                    let splitedPackage: any = pkg.split('.');
                    let loadPackage: any[] = [];

                    splitedPackage.forEach((str: any, idx: any) => {
                        if (idx == 0) {
                            loadPackage.push((str == this.identifier) ? this.path : str);
                        } else {
                            loadPackage.push(str);
                        }
                    });

                    let packagePath = loadPackage.join('/');

                    return require(packagePath);
                }

                this.class = (pkg: any, ignoreVenidaPackage?: boolean) => {
                    return this.import(pkg, ignoreVenidaPackage);
                }

                this.define = (key, value) => {
                    if (!this[key]) {
                        this[key] = value;
                    }
                }
            }

            return this;
        }

        public setPath (path: string) {
            this.path = path;
        }

        public static getInstance (): Core {

            if (!Core.Instance) {
                Core.Instance = new Core();
            }

            return Core.Instance;
        }

    }
}

module.exports = System.Core.Core.getInstance();