let chokidar = require('chokidar');
const { exec } = require('child_process');

let listAllowedWatching = [
    './app', './config', './routes', './system'
];

let watcher = chokidar.watch(listAllowedWatching, {ignore: /^\./, persistent: true});

console.log('[Venida: Child Process] Starting watch file');
exec(`osascript -e 'display notification \"Staring Watch File\"'`);

let argument = process.argv[2];

/**
 * Watcher event handler
 */
watcher
    .on('change', async (path: string) => {

        let splitedPath = path.split('/');
        let fileName = splitedPath[splitedPath.length - 1];
        let fileExtension = fileName.split('.')[fileName.split('.').length - 1];

        switch (fileExtension) {
            case 'ts': {

                exec(`osascript -e 'display notification \"Waiting compile at ${fileName}\ file."'`);

                exec(`ts-node compiler.ts ${path}`, (error: any, stdout: any, stderr: any) => {

                    if (error) {
                        console.log(`error: ${error.message}`);
                        return;
                    }
    
                    if (stderr) {
                        console.log(`stderr: ${stderr}`);
                        return;
                    }
    
                    console.log(`stdout: ${stdout}`);
    
                    exec(`osascript -e 'display notification \"Compiled file ${fileName}\ successfully completed."'`); 

                    if (argument?.toLowerCase() == 'server') {

                        exec('pm2 start venida.server.yaml', (error: any, stdout: any, stderr: any) => {
            
                            if (error) {
                                console.log(`error: ${error.message}`);
                                return;
                            }
            
                            if (stderr) {
                                console.log(`stderr: ${stderr}`);
                                return;
                            }
            
                            console.log(`stdout: ${stdout}`);
            
                            exec(`osascript -e 'display notification \"Server restarted successfully!\"'`);
                        });
                    }
                });
            } break;
            case 'json': {

                exec(`osascript -e 'display notification \"Waiting copy ${fileName}\ file to ./build."'`);
                
                let mainPath = (splitedPath.length == 1) ? './'.concat(path) : path;

                exec(`cp ${mainPath} ./build/${path}`, (error: any, stdout: any, stderr: any) => {

                    if (error) {
                        console.log(`error: ${error.message}`);
                        return;
                    }
    
                    if (stderr) {
                        console.log(`stderr: ${stderr}`);
                        return;
                    }
    
                    console.log(`stdout: ${stdout}`);
    
                    exec(`osascript -e 'display notification \"Copied file ${fileName}\ successfully completed."'`);
                });

            } break;
            default: {
                // do something..
            }
        }
    })
    .on('error', (error: any) => {

        console.error(`Something wrong: ${error}`);
    });


