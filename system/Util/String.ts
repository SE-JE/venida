/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

 namespace System.Util {

    export class String {

        public generateRandomString (strLength: any, withSpecialChar: boolean = false) {

            let text = "";

            let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            if (withSpecialChar) {
                possible = possible.concat("!?@#$%^&*+-");
            }

            for (let i = 0; i < strLength; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        }

        public capitalize (str: string, removeSpacing: boolean = false) {

            if (typeof str !== 'string') {
                return '';
            }

            let text = "";

            if (removeSpacing) {
                text = str.replace(/\s/g, '');
                text = text.charAt(0).toUpperCase() + text.slice(1);
            } else {
                text = str.charAt(0).toUpperCase() + str.slice(1);
            }

            return text;
        }

        public camelizeString (str: string) {


        }
    }
}

module.exports = new System.Util.String();