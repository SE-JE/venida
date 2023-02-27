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

            this.init = (request?: any, response?: any) => {

                this.request = request ?? {};
                this.response = response ?? {};

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

                await model.init(this.request, this.response);

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
             * Filter Operate at field defined
             */
            if (this.fieldDefined?.filter && this.fieldDefined?.filter.length > 0) {

                for (let filter of this.fieldDefined?.filter) {

                    switch (filter?.operator) {

                        case '=':
                        case '>':
                        case '<':
                        case '>=':
                        case '<=':
                        case '!=':
                        case 'like': {
                            this.query = this.query.where(filter.fieldName, filter?.operator, filter?.val);
                        } break;
                        case 'in': {
                            if (!Array.isArray(filter?.val)) {
                                Venida.Response.exception('QUERY_ERROR', 'Wrong format filter at type `in`');
                            }
                            this.query = this.query.whereIn(filter?.fieldName, filter?.val);
                        } break;
                        case 'or': {
                            if (!Array.isArray(filter?.val)) {
                                Venida.Response.exception('QUERY_ERROR', 'Wrong format filter at type `or`');
                            }
                            if (filter?.val.length > 0) {
                                for (const one of filter?.val) {
                                    this.query = this.query.orWhere(one?.fieldName, one?.operator, one?.val);
                                }
                            }
                        } break;
                    }
                }
            }

            /**
             * Implement filter from request query
             */
            this.implementFilterQuery();

            /**
             * Check if field defined has a relation model or not
             */
            for (const key in flattenedFieldDefined) {

                if (key.includes(stringKey)) {

                    const splitKey = key.split('.');

                    const identifier = splitKey.slice(0, splitKey.length - 1).join('.');
                    const parentModel = splitKey.slice(0, splitKey.length - 3).join('.');

                    const modelKey = identifier.concat('.model');
                    const foreignKey = identifier.concat('.foreignKey');
                    const foreignKeyAlias = identifier.concat('.foreignKeyAlias');
                    const localKey = identifier.concat('.localKey');
                    const localKeyAlias = identifier.concat('.alias');
                    const joinType = identifier.concat('.joinType');
                    const joinRawStatement = identifier.concat('.joinRawStatement');

                    const aliasForeignKey = splitKey.length > 3 ? parentModel.concat('.alias') : 'alias';

                    if (!flattenedFieldDefined[modelKey] || !flattenedFieldDefined[foreignKey] || !flattenedFieldDefined[localKey]) {
                        continue;
                    }

                    switch (flattenedFieldDefined[joinType].toUpperCase()) {
                        case 'LEFT': {
                            this.query = this.query.leftJoin(
                                `${flattenedFieldDefined[modelKey]} AS ${flattenedFieldDefined[localKeyAlias]}`,
                                `${flattenedFieldDefined[localKeyAlias]}.${flattenedFieldDefined[localKey]}`,
                                `${flattenedFieldDefined[aliasForeignKey]}.${flattenedFieldDefined[foreignKey]}`
                            );
                        } break;
                        case 'RIGHT': {
                            this.query = this.query.rightJoin(
                                `${flattenedFieldDefined[modelKey]} AS ${flattenedFieldDefined[localKeyAlias]}`,
                                `${flattenedFieldDefined[localKeyAlias]}.${flattenedFieldDefined[localKey]}`,
                                `${flattenedFieldDefined[aliasForeignKey]}.${flattenedFieldDefined[foreignKey]}`
                            );
                        } break;
                        case 'RAW': {
                            if (!flattenedFieldDefined[joinRawStatement] || flattenedFieldDefined[joinRawStatement] === '') {
                                Venida.Response.exception('QUERY_ERROR', 'Not found joinRawStatement parameters in RAW joinType');
                            }
                            this.query = this.query.joinRaw(flattenedFieldDefined[joinRawStatement]);
                        } break;
                        case 'INNER': {
                            this.query = this.query.innerJoin(
                                `${flattenedFieldDefined[modelKey]} AS ${flattenedFieldDefined[localKeyAlias]}`,
                                `${flattenedFieldDefined[localKeyAlias]}.${flattenedFieldDefined[localKey]}`,
                                `${flattenedFieldDefined[aliasForeignKey]}.${flattenedFieldDefined[foreignKey]}`
                            )
                        } break;
                        default: {
                            Venida.Response.exception('QUERY_ERROR', 'Wring joinType value');
                        } break;
                    }
                }
            }

            return this;
        }

        /**
         * Implement filter from request query
         */
        private implementFilterQuery () {

            let requestQuery = this.request.query;

            if (requestQuery) {

                let filters: any[] = [];
                try {
                    filters = JSON.parse(requestQuery?.filter);
                } catch (error: any) {
                    Venida.Error.exception('BAD_REQUEST', 'Failed to parsing query request query filter format');
                }

                for (const filter of filters) {

                    this.applyConditionalFilter(this.mapping[filter.field], filter.operator, filter.val);
                }
            }
        }

        /**
         * Apply Condition Mapping
         */
        private applyConditionalFilter (field: string, operator: string, val: any) {

            switch (operator) {
                case '=':
                case '>':
                case '<':
                case '>=':
                case '<=': {
                    this.query = this.query.orWhere(field, operator, val);
                } break;
                case 'in': {
                    if (typeof val == 'string') {
                        val = val.split(',');
                    }

                    this.query = this.query.whereIn(field, val);
                } break;
                case 'ni': {
                    if (typeof val == 'string') {
                        val = val.split(',');
                    }
    
                    this.query = this.query.whereNotIn(field, val);
                } break;
                case 'bw': {
                    this.query = this.query.where(field, 'LIKE', `${val}%`);
                } break;
                case 'fw': {
                    this.query = this.query.where(field, 'LIKE', `%${val}`);
                } break;
                case 'xw': {
                    this.query = this.query.where(field, 'LIKE', `%${val}%`);
                } break;
                /**
                 * Still thinking for next improvement with or filter
                 */
                // case 'or': {
                //     this.query = this.query.where((queryWhere: any) => {

                //         for (const queryFilter of val) {

                //             this.applyConditionalFilter(this.mapping[queryFilter?.field], queryFilter?.operator, queryFilter?.val);
                //         }
                //     });
                // }
            }
        }

        private fieldMappingExtractor () {

            const flatten = Venida.import('flat', true);

            let flatFieldDefined = flatten(this.fieldDefined);

            for (const key in flatFieldDefined) {

                if (key.includes('.fieldName')) {
                    
                    const splitKey = key.split('.');
    
                    const identifier = splitKey.slice(0, splitKey.length - 3).join('.');
    
                    const tableAlias = identifier == '' ? 'alias' : identifier.concat('.alias');

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
         * Custom where function
         */
        private where (value1: any, value2?: any, value3?: any) {

            if (value3) {

                if (this.query) {
                    this.query = this.query.where(value1, value2, value3);
                } else {
                    this.query = this.DB.where(value1, value2, value3);
                }
            } else if (value2) {

                if (this.query) {
                    this.query = this.query.where(value1, value2);
                } else {
                    this.query = this.DB.where(value1, value2);
                }
            } else if (value1) {
                
                if (this.query) {
                    this.query = this.query.where(value1, value2);
                } else {
                    this.query = this.DB.where(value1, value2);
                }
            }

            return this;
        }

        /**
         * Custom or where function
         */
        private orWhere (value1: any, value2?: any, value3?: any) {

            if (value3) {

                if (this.query) {
                    this.query = this.query.orWhere(value1, value2, value3);
                } else {
                    this.query = this.DB.orWhere(value1, value2, value3);
                }
            } else if (value2) {

                if (this.query) {
                    this.query = this.query.orWhere(value1, value2);
                } else {
                    this.query = this.DB.orWhere(value1, value2);
                }
            } else if (value1) {
                
                if (this.query) {
                    this.query = this.query.orWhere(value1, value2);
                } else {
                    this.query = this.DB.orWhere(value1, value2);
                }
            }

            return this;
        }

        /**
         * Custom where in function
         */
        private whereIn (value1: any, value2: any[]) {

            if (this.query) {
                this.query = this.query.whereIn(value1, value2);
            } else {
                this.query = this.DB.whereIn(value1, value2);
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
            console.log('sql bindings:', toSql.bindings);

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

            /**
             * Note implement refresh field defined yet for next improvement
             */

            return {
                data: result,
                metaData: {}
            }
        }
    }
}

module.exports = System.Core.Base.Model;