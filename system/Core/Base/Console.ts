/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

namespace System.Core.Base {

    export interface ArgumentInterface {
        name: string;
        description: string;
        required: boolean;
        default: any;
        position: number;
        value: any;
    }

    export interface OptionInterface {
        name: string;
        description: string;
        required: boolean;
        default: any;
        shorthand: string;
        value: any;
    }

    export class Console {
        /**
         * @var signature
         * @type string
         * @description
         * Command Signature
         * Allowed template: 
         *  * {argumentName}  => argument description
         *  * {argumentName:description} => argument with description
         *  * {--optionName} => option
         *  * {--optionName=defaultValue} => in this case, option is have default value
         *  * {--optionName|shorthand=defaultValue} => initial value and shorthand 
         *  * {--optionName?} => optional option
         * @example 'hello {--name=World} {--greeting?} {--age=0} {--skill|s=}'
         */
        protected signature: string = '';

        /**
         * @var description
         * @type string
         * @description
         * Command Description
         * @example 'This is a sample console command'
         */
        protected description: string = '';


        private isThrowError: boolean = false;
        private msgThrowError: string = '';

        private msgPrint: string = '';
        private withReturnValue: boolean = false;

        private arguments: any = [];
        private options: any = [{
            name: '--help',
            description: 'Show help',
            required: false,
            default: false,
            shorthand: '-h',
            value: false
        }];

        public handle: () => any = async () => { };
        public beforeRun: () => any = async () => { };
        public run: (argv: any) => any = async () => { };
        public afterRun: () => any = async () => { };
        protected argument = (key: string, valOnly: boolean) => { }
        protected option = (key: string, valOnly: boolean) => { }
        protected showHelp = () => { }


        constructor() {
            this.run = async (argv: any, withReturnValue: boolean = false) => {
                this.withReturnValue = withReturnValue;
                // parsing arguments & options from signature
                let signature = this.signature.matchAll(/{([\w\s\-\=\?\:\|\'\"\*]+)}/g);

                /**
                 * Argument start from 3rd index
                 * 1 = node
                 * 2 = file
                 * 3 = command
                 */
                // if argv is array, then we will parse it
                if (Array.isArray(argv)) {
                    argv = argv.slice(3);
                } else {
                    argv = [];
                }


                // if argv is object, then convert to array
                if (argv.length == 1 && typeof argv[0] == 'object') {
                    argv = argv[0];
                    // loop all argv
                    let argvArray: any = [];
                    for (let key in argv) {
                        let value: any = argv[key];

                        if (typeof value === 'boolean') {
                            if (key.startsWith('--')) {
                                argvArray.push(key);
                            }
                        } else if (typeof value === 'string') {
                            if (key.startsWith('--')) {
                                argvArray.push(`${key}=${value}`);
                            } else {
                                argvArray.push(value);
                            }
                        } else if (typeof value === 'number') {
                            if (key.startsWith('--')) {
                                argvArray.push(`${key}=${value}`);
                            } else {
                                argvArray.push(value);
                            }
                        } else if (typeof value === 'object') {
                            if (value instanceof Array) {
                                for (let val of value) {
                                    if (key.startsWith('--')) {
                                        argvArray.push(`${key}=${val}`);
                                    } else {
                                        argvArray.push(val);
                                    }
                                }
                            }
                        } else {
                            if (key.startsWith('--')) {
                                argvArray.push(`${key}=${value}`);
                            } else {
                                argvArray.push(value);
                            }
                        }
                    }

                    argv = argvArray;
                }

                let { args, opts } = this.parseSignature(signature, argv);

                this.arguments = args;
                this.options = opts;

                // if in argv have --help or -h, show help
                if (argv.includes('--help') || argv.includes('-h')) {
                    this.showHelp();
                    return;
                }

                // check isThrowError argument & option
                if (this.isThrowError) {
                    // change color to red
                    if (this.withReturnValue) {
                        return `${this.msgThrowError}`;
                    } else {
                        console.log(this.msgThrowError);
                        return;
                    }
                }

                // parsing options from signature
                await this.beforeRun();
                await this.handle();
                await this.afterRun();

                // check isThrowError for user program
                if (this.isThrowError) {
                    // change color to red
                    if (this.withReturnValue) {
                        return `${this.msgThrowError}`;
                    } else {
                        console.log(this.msgThrowError);
                        return;
                    }
                }

                if (this.withReturnValue) {
                    return this.msgPrint;
                } else {
                    console.log(this.msgPrint);
                    return;
                }
            }

            this.argument = (key: any, defaultValue: any = null) => {
                let item = this.arguments[key];

                if (item) {
                    return item.value || item.default || defaultValue;
                } else {
                    return defaultValue;
                }
            }

            this.option = (key: any, defaultValue: any = null) => {
                let keyName = '--' + key;
                let item = this.options[keyName];

                if (!item) {
                    keyName = '-' + key;
                    item = this.options[keyName];
                }


                if (item) {
                    return item.value || item.default || defaultValue;
                } else {
                    return defaultValue;
                }
            }

            this.showHelp = () => {
                let template: string = '';
                let optionString: string = '';
                let argumentString: string = '';

                let listOptions: OptionInterface[] = this.options;

                // add help option
                listOptions.push({
                    name: '--help',
                    description: 'Show help',
                    required: false,
                    default: false,
                    shorthand: '-h',
                    value: false
                });

                // remove shorthand
                for (let key in listOptions) {
                    if (listOptions[key].shorthand) {
                        delete listOptions[listOptions[key].shorthand];
                    }
                }

                // show description of arguments & options
                for (let key in listOptions) {
                    let item = this.options[key];
                    let name = item.name;
                    let description = item.description;
                    let required = item.required;
                    let defaultVal = item.default;
                    let shorthand = item.shorthand;

                    if (shorthand) name = `${name} | ${shorthand.padEnd(10)}`;
                    else name = `${name.padEnd(10)}`;

                    if (defaultVal) {
                        if (defaultVal == '*') defaultVal = 'multiple';
                        description = `${description} (default: ${defaultVal})`;
                    }

                    if (!required) description = `${description} (optional)`;
                    else description = `${description} (required)`;

                    optionString += `   ${name.padEnd(20)} ${description} \r\n`;
                }

                for (let key in this.arguments) {
                    let item = this.arguments[key];
                    let name = item.name;
                    let description = item.description;
                    let required = item.required;
                    let defaultVal = item.default;

                    if (defaultVal) {
                        if (defaultVal == '*') defaultVal = 'multiple';
                        description = `${description} (default: ${defaultVal})`;
                    }

                    if (!required) description = `${description} (optional)`;
                    else description = `${description} (required)`;

                    argumentString += `   ${name.padEnd(20)} ${description} \r\n`;
                }

                template = ` Description: ${this.description} \r\n\r\n`;
                template += ` Arguments: \r\n`;
                template += argumentString;
                template += ` Options: \r\n`;
                template += optionString;

                this.print(template);
            }
        }

        /**
         * @method groupArgv
         * @param {Array} argv
         * @returns {Array}
         * @description Group Argv value by type (argument or option)
         **/
        private groupArgv = (argv: any) => {
            let args: any[] = [];
            let opts: any[] = [];

            for (let i = 0; i < argv.length; i++) {
                let arg = argv[i];
                if (arg.startsWith('--') || arg.startsWith('-')) {
                    let splitArg: any = arg.split('=');
                    let key: string = splitArg[0].replace('--', '').replace('-', '').trim();
                    let value: any = true;

                    if (splitArg.length > 1) {
                        value = splitArg[1].trim().replace(/\"/g, '').replace(/\'/g, '');
                    }

                    // if opts key already exists, then push value to array
                    if (opts[key]) {
                        if (Array.isArray(opts[key])) {
                            opts[key].push(value);
                        } else {
                            let existingValue: any = opts[key];
                            opts[key] = [existingValue];
                            opts[key].push(value);
                        }
                    } else {
                        opts[key] = value;
                    }
                } else {
                    args.push(arg);
                }
            }

            return { args, opts };
        }


        private parseSignature = (signature: any, argv: any): any => {
            let listOfArguments: ArgumentInterface[] = [];
            let listOfOptions: OptionInterface[] = [];

            let { args: argsval, opts: optsval } = this.groupArgv(argv);

            for (let item of signature) {
                let argument: ArgumentInterface = {
                    name: '',
                    position: 0,
                    required: true,
                    default: null,
                    value: null,
                    description: ''
                };

                let option: OptionInterface = {
                    name: '',
                    shorthand: '',
                    required: true,
                    default: null,
                    value: null,
                    description: ''
                };

                item = item[1].trim();
                let isArgument = item.indexOf('--') == -1 || item.indexOf('-') == -1;

                // start with --
                if (!isArgument) {
                    let opts = item;

                    // get required in last character
                    if (opts.endsWith('?')) {
                        option.required = false;
                        opts = opts.slice(0, -1);
                    }

                    // parse opts to object and push to listOfOptions
                    if (opts.includes('=')) {
                        opts = opts.split('=');
                        option.required = false;
                        option.name = opts[0].trim();
                        option.default = opts[1].trim().replace(/\'/g, '').replace(/\"/g, '') || null;
                        opts = opts[0];
                    }

                    // get description
                    if (opts.includes(':')) {
                        opts = opts.split(':');
                        option.name = opts[0].trim();
                        option.description = opts[1].trim().replace(/\'/g, '').replace(/\"/g, '');
                        opts = opts[0];
                    }

                    // get shorthand
                    if (opts.includes('|')) {
                        opts = opts.split('|');
                        option.name = opts[0].trim();
                        option.shorthand = '-' + opts[1].trim();
                    } else {
                        option.name = opts.trim();
                    }


                    let keyName: string = option.name.replace('--', '').trim();
                    let keyShorthand: string = option.shorthand.replace('-', '').trim();
                    option.value = optsval[keyName] || optsval[keyShorthand] || option.default || null;

                    // set default value if option is not required
                    if (option.default && !option.value) {
                        option.value = option.default;
                    }

                    // if option is required, then throw error if value is null
                    if (option.required && !option.value) {
                        this.throw(`Option ${option.name} is required`);
                    }

                    // if default not *, change array to string
                    if (option.default != '*' && Array.isArray(option.value)) {
                        option.value = option.value[0];
                    }

                    // if value is *, then change to array
                    if (option.value == '*') {
                        option.value = [];
                    }

                    // push to listOfOptions
                    if (option.shorthand) {
                        listOfOptions[option.shorthand] = option;
                    }

                    listOfOptions[option.name] = option;
                } else {
                    let opts = item;
                    argument.position = listOfArguments.length; // 3 is for node, file, command

                    // get required in last character
                    if (opts.endsWith('?')) {
                        argument.required = false;
                        opts = opts.slice(0, -1);
                    }

                    // parse opts to object and push to listOfArguments
                    if (opts.includes('=')) {
                        opts = opts.split('=');
                        argument.required = false;
                        argument.name = opts[0].trim();
                        argument.default = opts[1].trim().replace(/\'/g, '').replace(/\"/g, '') || null;
                        opts = opts[0];
                    }

                    // get description
                    if (opts.includes(':')) {
                        opts = opts.split(':');
                        argument.name = opts[0].trim();
                        argument.description = opts[1].trim().replace(/\'/g, '').replace(/\"/g, '');
                        opts = opts[0];
                    }

                    argument.name = opts.trim();
                    argument.value = argsval[argument.position] || argument.default || null;

                    // set default value if argument is not required
                    if (argument.default && !argument.value) {
                        argument.value = argument.default;
                    }

                    // if argument is required, then throw error if value is null
                    if (argument.required && !argument.value) {
                        this.throw(`Argument ${argument.name} is required`);
                    }

                    // if default not *, change array to string
                    if (argument.default != '*' && Array.isArray(argument.value)) {
                        argument.value = argument.value.join(' ');
                    }

                    listOfArguments[argument.name] = argument;
                }
            }

            return {
                args: listOfArguments,
                opts: listOfOptions
            };
        }

        protected throw = (message: string): void => {
            // show error message with red color
            this.msgThrowError += message + '\n';
            this.isThrowError = true;
        }

        protected print = (message: string): void => {
            // show message with green color
            this.msgPrint += message + '\n';
        }

    }
}

module.exports = System.Core.Base.Console;