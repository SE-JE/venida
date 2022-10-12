/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

namespace App.Console {
    const BaseConsole = Venida.import('Venida.System.Core.Base.Console');
    const VFile = Venida.import('Venida.System.Core.Base.File');

    export class Vgen extends BaseConsole {
        /**
         * How to use this command ??
         * use --help to see how to use this command
         */
        protected signature: string = `
            {name:Name of json file in generator/data folder} 
            {--controller|c:Generate controller?}
            {--template|t:Template name=default}
            {--service|s:Generate service?}
            {--route|r:Generate route?}
            {--model|m:Generate model?}
            {--all:Generate all?}
        `;
        protected description: string = 'Generate a new class';

        private name: string = '';
        private variables: any = {};

        private dateTemplate: string = `
            data.{{ field }} = new Date();
        `;

        private generate = async (type: string) => {
            let template: any = await VFile.get(`${__dirname}/../../../generators/templates/${this.option('template')}/${type}.venida`);
            // get namespace of type
            let namespace: string = '';
            let fileName: string = '';

            fileName = this.variables[`${type}Name`];
            namespace = this.variables[`${type}Namespace`];

            let path = namespace.replace(/\\/g, '/');
            path = path.replace(/\./g, '/');
            // change first letter to lowercase
            path = path.charAt(0).toLowerCase() + path.slice(1);

            // replace variables
            for (let variable in this.variables) {
                template = template.replace(new RegExp(`{{ ${variable} }}`, 'g'), this.variables[variable]);
            }

            // type ucfirst
            type = type.charAt(0).toUpperCase() + type.slice(1);

            return await VFile.put(`${__dirname}/../../../${path}/${fileName}.ts`, template);
        }

        private getInterfaceProperties = async (name: string) => {
            this.print('Preparing interface properties...');
            // get database name from connection
            let database = Venida.DatabaseConfig.getDatabaseName();
            // generate interface properties from information_schema
            this.print(`Generating interface properties from ${database}...`);
            const datasource = Venida.import('Venida.system.Core.Datasource');
            let newConnection = await datasource.createConnection(Venida.DatabaseConfig.get('secondaryConnection')['mysql']);
            let properties = await newConnection.select('COLUMN_NAME', 'DATA_TYPE', 'COLUMN_KEY', 'COLUMN_DEFAULT').from('information_schema.COLUMNS').where('TABLE_SCHEMA', database).andWhere('TABLE_NAME', name);
            // close connection
            await newConnection.destroy();
            // if no properties
            if (!properties.length) {
                this.throw(`No properties found for ${name}`);
                return false;
            }

            this.print('Get interface properties from database...');
            let interfaceProperties = '';

            properties.forEach((property: any) => {
                let type = property.DATA_TYPE;

                if (property.IS_NULLABLE == 'NO') {
                    type = `${type} | null`;
                }

                if (property.COLUMN_DEFAULT) {
                    type = `${type} | ${property.COLUMN_DEFAULT}`;
                }

                // easy convert from mysql to typescript
                type = type.replace(/int/g, 'number');
                type = type.replace(/varchar/g, 'string');
                type = type.replace(/text/g, 'string');
                type = type.replace(/datetime/g, 'Date');
                type = type.replace(/timestamp/g, 'Date');
                type = type.replace(/tinyint/g, 'boolean');
                type = type.replace(/decimal/g, 'number');
                type = type.replace(/double/g, 'number');
                type = type.replace(/float/g, 'number');
                type = type.replace(/char/g, 'string');
                type = type.replace(/longtext/g, 'string');
                type = type.replace(/mediumtext/g, 'string');
                type = type.replace(/tinytext/g, 'string');
                type = type.replace(/blob/g, 'string');
                type = type.replace(/mediumblob/g, 'string');
                type = type.replace(/longblob/g, 'string');
                type = type.replace(/tinyblob/g, 'string');
                type = type.replace(/date/g, 'Date');
                type = type.replace(/enum/g, 'string');
                type = type.replace(/set/g, 'string');

                interfaceProperties += `\t\t${property.COLUMN_NAME}: ${type};\n`;

                // get primary key
                if (property.COLUMN_KEY == 'PRI') {
                    this.variables['primaryKey'] = property.COLUMN_NAME;
                    this.variables['primaryKeyType'] = type;
                } else {
                    if (!(property.COLUMN_KEY == 'PRI') && property.COLUMN_NAME && property.COLUMN_NAME != 'created_at' && property.COLUMN_NAME != 'updated_at') {
                        this.variables['acceptedFields'] += `'${property.COLUMN_NAME}', `;
                    } else if (property.COLUMN_NAME == 'created_at' || property.COLUMN_NAME == 'updated_at') {
                        this.variables['timestamps'] += this.dateTemplate.replace(new RegExp(`{{ field }}`, 'g'), property.COLUMN_NAME);
                    }
                }
            });

            if (this.variables['acceptedFields']) {
                this.variables['acceptedFields'] = this.variables['acceptedFields'].slice(0, -2);
                this.variables['acceptedFields'] = "[" + this.variables['acceptedFields'] + "]";
            } else {
                this.variables['acceptedFields'] = '[]';
            }

            return `{\n ${interfaceProperties}\t}`;
        }


        private checkIfClassExists = async (type: string): Promise<boolean> => {
            let path = this.variables[`${type}Namespace`];
            path = path.replace(/\\/g, '/')
            path = path.replace(/\./g, '/');

            // change first letter to lowercase
            path = path.charAt(0).toLowerCase() + path.slice(1);
            let fileName: string = "";

            fileName = this.variables[`${type}Name`];

            let file = `${__dirname}/../../../${path}/${fileName}.ts`;

            if (await VFile.exists(file)) {
                this.print(`File ${fileName} already exists`);

                // ask to overwrite
                let answer: string = await this.ask(`Overwrite ${fileName} ?`);
                answer = answer.toLowerCase();

                if (answer != 'y' && answer != 'yes') return false;
            }

            return true;
        }


        handle = async () => {
            let name = this.argument('name');
            name = name.charAt(0).toUpperCase() + name.slice(1); // capitalize first letter

            this.variables = await VFile.get(`generators/data/${name}.json`);
            if (!this.variables) {
                this.throw(`Data for ${this.name} not found`);
            }

            this.variables = JSON.parse(this.variables);
            if (!this.variables) {
                this.throw(`Data for ${name} not found`);
            }


            // add dynamic variables

            this.variables['timestamp'] = '';
            this.variables['acceptedFields'] = '';

            let controllerNamespace = this.variables['controllerFullName'].split('.').slice(0, -1).join('.');
            let serviceNamespace = this.variables['serviceFullName'].split('.').slice(0, -1).join('.');
            let modelNamespace = this.variables['modelFullName'].split('.').slice(0, -1).join('.');
            let routeNamespace = this.variables['routeFullName'].split('.').slice(0, -1).join('.');

            let controllerName = this.variables['controllerFullName'].split('.').slice(-1).join('.');
            let serviceName = this.variables['serviceFullName'].split('.').slice(-1).join('.');
            let modelName = this.variables['modelFullName'].split('.').slice(-1).join('.');
            let routeName = this.variables['routeFullName'].split('.').slice(-1).join('.');

            let interfaceProperties = await this.getInterfaceProperties(this.variables['tableName']);

            let dynamicVariables = {
                controllerNamespace,
                serviceNamespace,
                modelNamespace,
                routeNamespace,
                controllerName,
                serviceName,
                modelName,
                routeName,
                interfaceProperties
            };

            for (let variable in dynamicVariables) {
                this.variables[variable] = dynamicVariables[variable];
            }

            let listFiles = {
                'c': 'controller',
                'm': 'model',
                's': 'service',
                'r': 'route',
            };

            let listGeneratedFiles = [];

            if (this.option('all')) {
                for (let key in listFiles) {
                    let type = listFiles[key];
                    listGeneratedFiles.push({
                        name: name,
                        type: type
                    })
                }
            } else {
                let answer: string = await this.ask(`Generate ${name} ?`);
                answer = answer.toLowerCase();

                if (answer != 'y' && answer != 'yes') return false;

                let answer2: string = await this.ask(`Generate ${name} for (c)ontroller, (m)odel, (s)ervice, (r)oute ?`);
                answer2 = answer2.toLowerCase();

                if (answer2 == 'all') {
                    for (let key in listFiles) {
                        let type = listFiles[key];
                        listGeneratedFiles.push({
                            name: name,
                            type: type
                        })
                    }
                } else {
                    for (let key in listFiles) {
                        if (answer2.indexOf(key) != -1) {
                            let type = listFiles[key];
                            listGeneratedFiles.push({
                                name: name,
                                type: type
                            })
                        }
                    }
                }
            }

            for (let i = 0; i < listGeneratedFiles.length; i++) {
                let item = listGeneratedFiles[i];
                // check if file exists
                let overwrite: boolean = await this.checkIfClassExists(item.type);
                if (!overwrite) {
                    this.print(`Skip Generate ${item.type} ${item.name} success!`);
                } else {
                    await this.generate(item.type);
                    this.print(`Generate ${item.type} ${item.name} success!`);
                }
            }

            return true;
        }

    }
}

module.exports = App.Console.Vgen;