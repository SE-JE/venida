namespace System.Core.Base {
    const fs = require('fs');

    export class File {
        static get = async (path: string) => {
            return new Promise((resolve, reject) => {
                fs.readFile(path, 'utf8', (err: any, data: any) => {
                    if (err) reject(err);
                    resolve(data);
                });
            });
        }

        static put = async (path: string, content: string) => {
            return new Promise((resolve, reject) => {
                fs.writeFile(path, content, (err: any) => {
                    if (err) reject(err);
                    resolve(true);
                });
            });
        }

        static exists = async (path: string) => {
            return new Promise((resolve, reject) => {
                fs.exists(path, (exists: boolean) => {
                    resolve(exists);
                });
            });
        }

        static mkdir = async (path: string) => {
            return new Promise((resolve, reject) => {
                fs.mkdir(path, (err: any) => {
                    if (err) reject(err);
                    resolve(true);
                });
            });
        }

        static mkdirs = async (path: string) => {
            return new Promise((resolve, reject) => {
                fs.mkdir(path, { recursive: true }, (err: any) => {
                    if (err) reject(err);
                    resolve(true);
                });
            });
        }

        static copy = async (source: string, target: string) => {
            return new Promise((resolve, reject) => {
                fs.copyFile(source, target, (err: any) => {
                    if (err) reject(err);
                    resolve(true);
                });
            });
        }

        static delete = async (path: string) => {
            return new Promise((resolve, reject) => {
                fs.unlink(path, (err: any) => {
                    if (err) reject(err);
                    resolve(true);
                });
            });
        }

        static deleteDir = async (path: string) => {
            return new Promise((resolve, reject) => {
                fs.rmdir(path, (err: any) => {
                    if (err) reject(err);
                    resolve(true);
                });
            });
        }

        static rename = async (path: string, newPath: string) => {
            return new Promise((resolve, reject) => {
                fs.rename(path, newPath, (err: any) => {
                    if (err) reject(err);
                    resolve(true);
                });
            });
        }

        static move = async (path: string, newPath: string) => {
            return new Promise((resolve, reject) => {
                fs.rename(path, newPath, (err: any) => {
                    if (err) reject(err);
                    resolve(true);
                });
            });
        }

        static getStats = async (path: string) => {
            return new Promise((resolve, reject) => {
                fs.stat(path, (err: any, stats: any) => {
                    if (err) reject(err);
                    resolve(stats);
                });
            });
        }

        static getStatsSync = (path: string) => {
            return fs.statSync(path);
        }

        static isDir = async (path: string) => {
            let stats: any = await this.getStats(path);
            return stats.isDirectory();
        }

        static isDirSync = (path: string) => {
            let stats: any = this.getStatsSync(path);
            return stats.isDirectory();
        }

        static isFile = async (path: string) => {
            let stats: any = await this.getStats(path);
            return stats.isFile();
        }

        static isFileSync = (path: string) => {
            let stats: any = this.getStatsSync(path);
            return stats.isFile();
        }

        static isSymbolicLink = async (path: string) => {
            let stats: any = await this.getStats(path);
            return stats.isSymbolicLink();
        }

        static isSymbolicLinkSync = (path: string) => {
            let stats: any = this.getStatsSync(path);
            return stats.isSymbolicLink();
        }
    }
}

module.exports = System.Core.Base.File;