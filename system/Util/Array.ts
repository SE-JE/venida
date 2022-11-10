/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

 namespace System.Util {

    export class ArrayUtil {

        /**
         * To order array of objects by key of object
         * 
         * @param items 
         * @param field
         * @param direction 
         * @returns array
         */
        public orderBy (items: any[], field: string, direction: string = 'ASC') {

            if (!typeof Array && !Array.isArray(items)) {
                return items;
            }

            direction = direction.toUpperCase();

            return items.sort((a, b) => {
                return this.order(field, a, b, direction);
            });
        }

        private order (field: string | number, a: {[key: string]: any}, b: {[key: string]: any}, direction: string = 'ASC') {

            direction = direction.toUpperCase();

            if (direction === 'ASC') {

                if (a[field] < b[field]) {
                    return -1;
                }

                if (a[field] > b[field]) {
                    return 1;
                }
            } else {

                if (a[field] > b[field]) {
                    return -1;
                }

                if (a[field] < b[field]) {
                    return 1;
                }
            }

            return 0;
        }
    }
}

module.exports = new System.Util.ArrayUtil();