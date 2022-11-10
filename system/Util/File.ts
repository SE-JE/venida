/**
 * Venida Platform
 * Free Open Source Software
 * SEJE - Digital
 */

 namespace System.Util {

    const fs = Venida.import('fs', true);

    export class File {

        public async get (path: string) {

            return new Promise((resolve, reject) => {
                fs.readFile(path, 'utf8', (err: any, data: any) => {
                    if (err) reject(err);
                    resolve(data);
                });
            });
        }

        public async put (path: string, content: string) {

            return new Promise((resolve, reject) => {
                fs.writeFile(path, content, (err: any) => {
                    if (err) reject(err);
                    resolve(true);
                });
            });
        }

        public async exists (path: string) {

            return new Promise((resolve, reject) => {
                fs.exists(path, (exists: boolean) => {
                    resolve(exists);
                });
            });
        }

        public async mkdir (path: string) {

            return new Promise((resolve, reject) => {
                fs.mkdir(path, (err: any) => {
                    if (err) reject(err);
                    resolve(true);
                });
            });
        }

        public async mkdirs (path: string) {

            return new Promise((resolve, reject) => {
                fs.mkdir(path, { recursive: true }, (err: any) => {
                    if (err) reject(err);
                    resolve(true);
                });
            });
        }

        public async copy (source: string, target: string) {

            return new Promise((resolve, reject) => {
                fs.copyFile(source, target, (err: any) => {
                    if (err) reject(err);
                    resolve(true);
                });
            });
        }

        public async delete (path: string) {

            return new Promise((resolve, reject) => {
                fs.unlink(path, (err: any) => {
                    if (err) reject(err);
                    resolve(true);
                });
            });
        }

        public async deleteDir (path: string) {

            return new Promise((resolve, reject) => {
                fs.rmdir(path, (err: any) => {
                    if (err) reject(err);
                    resolve(true);
                });
            });
        }

        public async rename (path: string, newPath: string) {

            return new Promise((resolve, reject) => {
                fs.rename(path, newPath, (err: any) => {
                    if (err) reject(err);
                    resolve(true);
                });
            });
        }

        public async move (path: string, newPath: string) {
            
            return new Promise((resolve, reject) => {
                fs.rename(path, newPath, (err: any) => {
                    if (err) reject(err);
                    resolve(true);
                });
            });
        }

        public async getStats (path: string) {

            return new Promise((resolve, reject) => {
                fs.stat(path, (err: any, stats: any) => {
                    if (err) reject(err);
                    resolve(stats);
                });
            });
        }

        public getStatsSync (path: string) {
            return fs.statSync(path);
        }

        public async isDir (path: string) {

            let stats: any = await this.getStats(path);
            return stats.isDirectory();
        }

        public isDirSync (path: string) {

            let stats: any = this.getStatsSync(path);
            return stats.isDirectory();
        }

        public async isFile (path: string) {

            let stats: any = await this.getStats(path);
            return stats.isFile();
        }

        public async isFileSync (path: string) {

            let stats: any = this.getStatsSync(path);
            return stats.isFile();
        }

        public async isSymbolicLink (path: string) {

            let stats: any = await this.getStats(path);
            return stats.isSymbolicLink();
        }

        public isSymbolicLinkSync (path: string) {

            let stats: any = this.getStatsSync(path);
            return stats.isSymbolicLink();
        }

    }
}

module.exports = new System.Util.File();