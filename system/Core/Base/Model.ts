/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

namespace System.Core.Base {

    export class Model {

        public DB: any;

        public tableName: string = '';

        public fieldDefined: any;

        public fieldSelectQuery: any[] = [];

        public query: any;

        public mapping: any = {};

        public isObject: boolean = false;

        public init: (request: any, response: any) => any = () => {};

        public load: (moduleName: any) => any = () => {};

        public request: any  = {};

        public response: any = {};

        /**
         * Constructor method
         */
        public constructor () {

            let me = this;

            this.init = () => {

                let createConnection = Venida.Datasource;

                if (!createConnection) {
                    Venida.Response.exception('INTERNAL_SERVER_ERROR', 'Failed to create connection at primary DB');
                }

                this.DB = createConnection;
            }

            this.load = async (modelName: any) => {

                let packagePath = Venida.identifier.concat('.',
                    Venida.Config.get('model'),
                    '.',
                    modelName
                );

                let model = Venida.import(packagePath);

                model = new model();

                await model.init();

                return model;
            }
        }

        /**
         * Flatten field defined
         */
        private flattenFieldDefined () {

            const flatten = Venida.import('flat', true);

            return flatten(this.fieldDefined);
        }

        /**
         * Get model field defined
         */
        private get () {

            const me = this;

            this.fieldMappingExtractor();

            const flattenedFieldDefined = this.flattenFieldDefined();

            const stringKey = '.model';

            if (this.query) {
                this.query = this.query.from(this.DB.raw(`${flattenedFieldDefined['model']} AS ${flattenedFieldDefined['alias']}`));
            } else {
                this.query = this.DB.from(this.DB.raw(`${flattenedFieldDefined['model']} AS ${flattenedFieldDefined['alias']}`));
            }

            /**
             * I REALLY DONT KNOW WHAT MUST I WRITE HERE, LOL
             */
            // for (const key in flattenedFieldDefined) {
            //     if (key.includes(stringKey)) {
            //         const splitKey = key.split('.');
            //     }
            // }

            return this;
        }

        private fieldMappingExtractor () {

            const flatten = Venida.import('flat', true);

            let flatFieldDefined = flatten(this.fieldDefined);

            for (const key in flatFieldDefined) {

                if (key.includes('.fieldName')) {
                    
                    const splitKey = key.split('.');
    
                    const identifier = splitKey.slice(0, splitKey.length - 3).join('.');
    
                    const tableAlias = (identifier == '') ? this.tableName : identifier.concat('.alias');

                    const fieldKey = key;
                    const aliasKey = key.replace('.fieldName', '.fieldAlias');
                    this.mapping[flatFieldDefined[aliasKey]] = `${flatFieldDefined[tableAlias]}.${flatFieldDefined[fieldKey]}`;
                }
            }
        }

        /**
         * Validate query input from method caller
         * 
         * @param selectQuery
         */
        private extractSelect (selectQuery: any) {

            selectQuery = selectQuery.reduce((a: any, key: any) => Object.assign(a, { [key]: key }), {});

            let select: any[] = [];

            let flattenedFieldDefined = this.flattenFieldDefined();
            console.log('flattenFieldDefined', flattenedFieldDefined);

            if (Object.keys(selectQuery).length > 0) {

                let stringKey = 'fieldAlias';

                for (const key in flattenedFieldDefined) {

                    if (key.includes(stringKey)) {

                        const splitKey = key.split('.');

                        const modelKey = splitKey.length > 3 ? splitKey.slice(0, splitKey.length - 3).join('.').concat('.model') : 'model';
                        const aliasKey = splitKey.length > 3 ? splitKey.slice(0, splitKey.length - 3).join('.').concat('.alias') : 'alias';
                        const foreignKey = splitKey.length > 3 ? splitKey.slice(0, splitKey.length - 3).join('.').concat('.foreignKey') : 'foreignKey';
                        const foreignKeyAlias = splitKey.length > 3 ? splitKey.slice(0, splitKey.length - 3).join('.').concat('.alias') : 'alias';

                        const fieldKey = key.replace('.fieldAlias', '.fieldName');
                        const fieldType = key.replace('.fieldAlias', '.fieldType');

                        if (!flattenedFieldDefined[modelKey]) {
                            continue;
                        }

                        /**
                         * Reverse to basic query
                         */
                        if (selectQuery[flattenedFieldDefined[key]] || selectQuery['*']) {

                            if (flattenedFieldDefined[fieldType]) {

                                switch (flattenedFieldDefined[fieldType]) {
                                    case 'RAW': {
                                        select.push(this.DB.raw(`${flattenedFieldDefined[fieldKey]} AS ${flattenedFieldDefined[key]}`));
                                        this.fieldSelectQuery.push(`${flattenedFieldDefined[key]}`);
                                    } break;
                                    case 'UNIXTIME': {
                                        select.push(this.DB.raw(`FROM_UNIXTIME(${flattenedFieldDefined[aliasKey]}.${flattenedFieldDefined[fieldKey]}) AS ${flattenedFieldDefined[key]}`));
                                        this.fieldSelectQuery.push(`${flattenedFieldDefined[key]}`);
                                    } break;
                                    default: {
                                        if (flattenedFieldDefined[fieldType] === '' || flattenedFieldDefined[fieldType] === null) {
                                            Venida.Response.exception('QUERY_ERROR', 'Wrong field type query format');
                                        } else {
                                            Venida.Response.exception('QUERY_ERROR', 'Wrong field type query format');
                                        }
                                    } break;
                                }
                            } else {

                                select.push(`${flattenedFieldDefined[aliasKey]}.${flattenedFieldDefined[fieldKey]} AS ${flattenedFieldDefined[key]}`);
                                this.fieldSelectQuery.push(`${flattenedFieldDefined[key]}`);
                            }
                        }
                    }
                }
            } else {
                Venida.Response.exception('QUERY_ERROR', 'Parameter of selectQuery has a wrong format');
            }

            let uniqueSelect = [...new Set(select)];

            return uniqueSelect;
        }

        /**
         * Custom select function
         * 
         * @param select
         */
        private select (...select: any) {

            select = this.extractSelect(select);

            if (this.query) {
                this.query = this.query.select(select);
            } else {
                this.query = this.DB.select(select);
            }

            return this;
        }

        /**
         * Custom first function
         */
        private first (...select: any) {

            select = this.extractSelect(select);

            this.isObject = true;

            if (this.query) {
                this.query = this.query.first(select);
            } else {
                this.query = this.DB.first(select);
            }

            return this;
        }

        /**
         * Custom limit function
         */
        private limit (limitValue: any) {

            if (this.query) {
                this.query = this.query.limit(limitValue);
            } else {
                this.query = this.DB.limit(limitValue);
            }

            return this;
        }

        /**
         * Custom limit function
         */
        private offset (offsetValue: any) {

            if (this.query) {
                this.query = this.query.offset(offsetValue);
            } else {
                this.query = this.DB.offset(offsetValue);
            }

            return this;
        }

        /**
         * Process result query
         */
        private async result (requestQuery?: any) {

            if (requestQuery?.limit) {
                this.query = this.query.limit(requestQuery.limit);
            }

            if (requestQuery?.start) {
                this.query = this.query.offset(requestQuery.start);
            }

            if (this.fieldDefined?.groupBy) {
                this.query = this.query.groupBy(this.fieldDefined?.groupBy);
            }

            let toSql = await this.query.toSQL();

            console.log('sql result:', toSql.sql);

            let result = this.DB.with('tempTable', this.DB.raw(toSql.sql, toSql.bindings))
                .from('tempTable');

            if (this.isObject) {
                result = result.first(this.fieldSelectQuery);
            } else {
                result = result.select(this.fieldSelectQuery);
            }

            result = await result.catch((err: any) => {
                Venida.Response.exception('QUERY_ERROR', 'Failed to result a query', err);
            });

            if (this.isObject) {
                return result;
            }

            return {
                data: result,
                metaData: {}
            }
        }
    }
}

module.exports = System.Core.Base.Model;