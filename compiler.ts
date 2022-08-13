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
        let excludeRegex = new RegExp("^(node_modules|node_types|compiler|compile|build|\.git|\.vscode)");

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
            }
        }
    });

}


/**
 * Load compiler config
 */
let data = tsconfig.loadSync('./tsconfig.json');

let option = data.config.compilerOptions;
 
console.log(ts.getDefaultLibFilePath(option));

let directory = './';

let files: string[] = [];

if (process.argv[3]) {
    files.push(process.argv[3])
} else {
    scan(directory, files);
}

/**
 * Compile all ts files
 */
const program = ts.createProgram(
    files, option
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