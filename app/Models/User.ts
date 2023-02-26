/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

namespace App.Models {

    const BaseModel = Venida.import('Venida.system.Core.Base.Model');

    interface UserInterface {
        id: number;
        name: string;
        email: string;
        is_active: string;
    }

    export class User extends BaseModel {

        public tableName = 'user';

        public fieldDefined = {
            model: this.tableName,
            alias: 'u',
            primaryKey: 'id',
            // filter: [
            //     {
            //         fieldName: 'r.id',
            //         operator: '=',
            //         val: 3
            //     }
            // ],
            field: [
                {
                    fieldName: 'id',
                    fieldAlias: 'id'
                },
                {
                    fieldName: 'name',
                    fieldAlias: 'name'
                },
                {
                    fieldName: 'email',
                    fieldAlias: 'email'
                },
                {
                    fieldName: 'is_active',
                    fieldAlias: 'isActive'
                },
                {
                    fieldName: 'created_at',
                    fieldAlias: 'createdAt',
                    fieldType: 'UNIXTIME'
                },
                {
                    model: 'role',
                    alias: 'r',
                    foreignKey: 'role_id',
                    foreignKeyAlias: 'userRole',
                    localKey: 'id',
                    joinType: 'LEFT',
                    field: [
                        {
                            fieldName: 'id',
                            fieldAlias: 'roleId'
                        },
                        {
                            fieldName: 'name',
                            fieldAlias: 'roleName'
                        },
                        {
                            fieldName: 'created_at',
                            fieldAlias: 'roleCreatedAt',
                            fieldType: 'UNIXTIME'
                        }
                    ]
                }
            ]
        }

        public async findAll() {
            const result = await this.select('*')
                .get()
                .result();

            return result;
        }

        public async getAll() {

            let result = await this.DB.select('id', 'username', 'name')
                .from(this.tableName)
                .where('is_active', 1)
                .limit(100);

            return result;
        }

        public async insert(data: UserInterface) {
            let result = await this.DB.insert(data).into(this.tableName);
            return result;
        }

        public async paginate(offset: number = 0, limit: number = 10, search: string = '') {
            let data = await this.DB.select('*').from(this.tableName).limit(limit).offset(offset);

            let dataCount = await this.DB
                .where('is_active', 1)
                .from(this.tableName)
                .count('id as total');
            let total: number = dataCount.length > 0 ? dataCount[0].total : 0;

            return {
                data,
                total
            }
        }


    }


}

module.exports = App.Models.User;