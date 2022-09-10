/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

 namespace System.Util {

    export class String {

        public generateRandomString (strLength: any, withSpecialChar: false) {

            let text = "";

            let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            if (withSpecialChar) {
                possible = possible.concat("!?@#$%^&*+-");
            }

            for (let i = 0; i < strLength; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        }
    }
}

module.exports = new System.Util.String();