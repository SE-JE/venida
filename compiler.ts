import * as ts from "typescript";
import * as fs from "fs";
import * as path from "path";
import * as tsconfig from "tsconfig";


/**
 * Scan all ts files
 * 
 * @params directory
 * @params files
 */
function scan (directory: string, files: string[]) {

    let readDirectory = fs.readdirSync(directory);

    readDirectory.forEach((file: any) => {

        const absolute = path.join(directory, file);
        let excludeRegex = new RegExp("^(node_modules|compiler|build|\.git|\.vscode)");

        if (excludeRegex.test(absolute)) {
            return;
        }

        if (fs.statSync(absolute).isDirectory()) {
        
            if (!fs.existsSync(`${option.outDir}/`+absolute.replace(/\./g, "/"))) {
                fs.mkdirSync(`${option.outDir}/`+absolute.replace(/\./g, "/"), { recursive: true });
            }

            return scan(absolute, files);
        } else {

            let fileName = path.basename(absolute);

            if (fileName.match(new RegExp("\.ts$"))) {
                files.push(absolute);
            } else if (!excludeRegex.test(absolute)) {
                
            }
        }
    });

}

/**
 * Get source file to text
 * 
 * @param fileName path file
 * @param target target compile typescript
 * @returns string | undefined
 */
 function getSourceFileToText (fileName: string, target: ts.ScriptTarget) {

    const sourceText = ts.sys.readFile(fileName);

    return (sourceText !== undefined) 
        ? ts.createSourceFile(fileName, sourceText, target).text
        : undefined;
}

/**
 * Custom ts compiler host
 */
 function createCompilerHost (options: ts.CompilerOptions): ts.CompilerHost {

    return {
        getSourceFile: (name: any, languageVersion: any) => {

            let check = new RegExp('.*/node_modules/.*');

            // for non node_modules file
            if (!check.test(name)) {

                let string  = getSourceFileToText(name, option.target);

                let arrString = (string !== undefined) ? string.split('\n') : [];

                let newReplacementString = `///<reference types="node" />\n` +
                    `///<reference path="${__dirname}/declaration/global-types.d.ts" />\n`;

                let skipPrint = false;

                arrString.forEach((str: string) => {

                    if (!skipPrint) {
                        newReplacementString += str+'\n';
                    }
                    skipPrint = false
                });

                let sourceFile = ts.createSourceFile(
                    name, newReplacementString, option.target
                );

                return sourceFile;
            } else {

                //for node_modules use default compiler
                const defaultCompilerHost = ts.createCompilerHost({});

                return defaultCompilerHost.getSourceFile(
                    name, languageVersion
                );
            }

        },
        writeFile: (filename: any, data: any) => {

            console.log(filename);
            ts.sys.writeFile(filename, data);
        },
        getDefaultLibFileName: () => ts.getDefaultLibFilePath(option),
        getCurrentDirectory: () => ts.sys.getCurrentDirectory(),
        getDirectories: path => ts.sys.getDirectories(path),
        getCanonicalFileName: fileName =>
            // ts.sys.useCaseSensitiveFileNames ? fileName : fileName.toLowerCase(),
            fileName,
        getNewLine: () => ts.sys.newLine,
        useCaseSensitiveFileNames: () => ts.sys.useCaseSensitiveFileNames,
        fileExists: (pathFile: string) => ts.sys.fileExists(pathFile),
        readFile: (pathFile: string) => ts.sys.readFile(pathFile)
    };
}


/**
 * Load compiler config
 */
let data = tsconfig.loadSync('./tsconfig.json');

let option = data.config.compilerOptions;
 
console.log(ts.getDefaultLibFilePath(option));

let directory = './';

let files: string[] = [];

if (process.argv[2]) {
    files.push(process.argv[2])
} else {
    scan(directory, files);
}

/**
 * Compile all ts files
 */
const program = ts.createProgram(
    files, option, createCompilerHost(option)
);

const diagnostics = ts.getPreEmitDiagnostics(program);

let isValid = true;


for (const diagnostic of diagnostics) {

    let message = diagnostic.messageText;
    const file: any = diagnostic.file;
    const filename: any = file.fileName;

    const lineAndChar: any  = file.getLineAndCharacterOfPosition(
        diagnostic.start
    );

    const line      = lineAndChar.line + 1;
    const character = lineAndChar.character + 1;

    if (typeof message === 'string') {
        message = message.replace('$VenidaPlatform', 'Venida');
    }

    console.log(message);
    console.log(`(${filename}:${line}:${character})`);

    if (message) {
        isValid = false;
    }

}

/**
 * Stop compiler process if error detected
 */
if (!isValid) {
    process.exit(1);
}

program.emit();