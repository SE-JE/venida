/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

namespace App.Models {

    const BaseModel = Venida.import('Venida.system.Core.Base.Model');

    export class User extends BaseModel {

        public tableName: string = 'users';

        public async getAll () {

            let result = await this.DB.select('id', 'username', 'name')
                .from(this.tableName)
                .where('is_active', 1)
                .limit(100);

            return result;
        }

    }

}

module.exports = App.Models.User;