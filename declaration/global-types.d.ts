/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

/**
 * This file use to declare dependency types code
 */

declare global {
    module NodeJS {
        interface Global {
            Venida: any
        }
    }
}


/**
 * Set "Venida" as a global variable
 */
declare var Venida: any;
