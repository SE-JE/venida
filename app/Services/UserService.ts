/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

namespace App.Services {
    /**
     * declare BaseService
     * @object BaseService
     */
    const BaseService = Venida.import('Venida.system.Core.Base.Service');

    /**
     * declare User Service
     * @object UserService
     * @type {App.Services.UserService}
     * @description bussiness logic for user
     * @extends BaseService
     */
    export class UserService extends BaseService {
        /**
         * Generate pagination meta
         * @param limit max limit per page
         * @param page current page
         * @param offset offset of current page
         * @param total total data
         * @returns object meta
         */
        private generatePaginationMeta(limit: number, page: number, offset: number, total: number): any {
            
            let totalPage = 0;

            if (total > 0) {
                totalPage = Math.ceil(total / limit) || 1;
            }

            let nextPage = page + 1;
            let prevPage = page - 1;

            if (nextPage > totalPage) {
                nextPage = totalPage;
            }

            if (prevPage < 1) {
                prevPage = 1;
            }

            return {
                offset,
                limit,
                total,
                totalPage,
                currentPage: page,
                nextPage,
                prevPage
            };
        }

        /**
         * Paginate data from database
         * @param page current page
         * @param limit limit per page
         * @param search search keyword
         * @returns
         */
        public async paginate(page: number, limit: number, search: string) {

            let user = await this.model('User');
            let offset = (page - 1) * limit;

            let { data, total } = await user.paginate(offset, limit, search ?? null);
            let meta = this.generatePaginationMeta(limit, page, offset, total);

            return {
                data,
                meta
            };

        }

        /**
         * Find user by id
         * @param id id of user
         * @returns
         */
        public async getById(id: number) {
            let user = await this.model('User');
            let result = await user.getById(id);
            return result;
        }

        /**
         * Insert new user
         * @param data object of user data
         * @returns 
         */
        public async insert(data: any) {
            let user = await this.model('User');
            let result = await user.insert(data);
            return result;
        }

        /**
         * Update user data
         * @param data object of user data
         * @returns 
         */
        public async update(data: any) {
            let user = await this.model('User');
            let result = await user.update(data);
            return result;
        }

        /**
         * Delete user by id
         * @param id id of user
         * @returns 
         */
        public async delete(id: number) {
            let user = await this.model('User');
            let result = await user.delete(id);
            return result;
        }

    }
}

module.exports = App.Services.UserService;