/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

namespace System.Core {

    export class Core {

        private static Instance: Core;

        private fs = require('fs');

        private path: string = '';

        private identifier: string = 'Venida';

        private define: (key: any, value: any) => any = () => { };

        private class: (className: string, ignoreVenidaPackage?: boolean) => any = () => { };

        private readonly import: (pkg: string, ignoreVenidaPackage?: boolean) => any = () => { };

        private readonly getPath: () => any = () => { };

        /**
         * Check Local Package Exist
         */
        private exist: (className: string) => any = () => { };
        private command: (commandName: string, argv?: any) => any = () => { };


        /**
         * Constructor Method
         */
        private constructor() {

            if (!Core.Instance) {

                this.getPath = () => {
                    return this.path;
                }

                this.command = (commandName: string, argv?: any) => {
                    let command = this.import(commandName, false);
                    command = new command();
                    console.log(`Running command: ${commandName}`);
                    return command.run(argv);
                }

                this.exist = (pkg: any) => {
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
                    let packageFile = packagePath + '.js';

                    try {
                        // is exist?
                        if (this.fs.existsSync(packageFile)) {
                            console.log(`Package ${pkg} is exist`);
                            return true;
                        } else {
                            this.throw(`Package ${pkg} not found!`);
                            return false;
                        }
                    } catch (error) {
                        this.throw(error);
                        return false;
                    }
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

        public setPath(path: string) {
            this.path = path;
        }

        public static getInstance(): Core {

            if (!Core.Instance) {
                Core.Instance = new Core();
            }

            return Core.Instance;
        }

        public throw = (message: any) => {
            // print error with red color
            console.log('\x1b[31m%s\x1b[0m', message);
            // reset color
            console.log('\x1b[0m');
            process.exit(1);
        }


    }
}

module.exports = System.Core.Core.getInstance();