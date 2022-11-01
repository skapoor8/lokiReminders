const fs = require('fs');
const path = require('path');

const webpack = require('webpack');

// 1. build index file
// 2. build wpconfig
// 3. compile

function buildLokiApp(config, callback) {
    // console.log('loki config:', config);
    var appName = config['project-name'],
        appPath = path.join(process.cwd(), 'src', config['js-main']),
        appSelector = config['app-selector'],
        bootstrapComponent = config['bootstrap-component'],
        wpConfig,
        indexPath;
    
    indexPath = buildIndexFile(appName, appPath, appSelector, bootstrapComponent);
    wpConfig = buildWebpackConfig(appName, indexPath);
    // console.log('final wpconfig:', wpConfig);
    webpack(wpConfig, (err, stats) => {
        if (err || stats.hasErrors()) {
            console.error('Loki build failed');
            if (err) console.error(err);
            if (stats.hasErrors()) console.error(stats.compilation.errors);
        } else {
            console.log('Loki build success\n');
            if (callback) callback();
        }    
    });
}

module.exports = buildLokiApp; 

// helpers -----------------------------------------------------------------------------------------

function buildIndexFile(appName, appPath, appSelector, bootstrapComponent) {
    var templatePath = path.join(__dirname, '..', 'templates', 'index.js.template'),
        appIndexPath = path.join(__dirname, '..', 'tmp', appName+'-index.js');

    var template = fs.readFileSync(templatePath, 'utf-8');
    template = template.replace(/<APP_NAME>/g, appName);
    template = template.replace(/<APP_PATH>/g, appPath);
    template = template.replace(/<APP_SELECTOR>/g, appSelector);
    template = template.replace(/<BOOTSTRAP_COMPONENT>/g, bootstrapComponent);

    if (!fs.existsSync(path.join(__dirname, '..', 'tmp'))){
        fs.mkdirSync(path.join(__dirname, '..', 'tmp'));
    }
    fs.writeFileSync(appIndexPath, template);
    return appIndexPath;
}

function buildWebpackConfig(appName, indexPath) {
    var wpConfig = {
        entry: indexPath,
        output: {
            filename: appName ? appName+'.bundle.js' : 'lokiApp.bundle.js',
            path: path.join(process.cwd(), 'dist', appName)
        }, 
        // soure maps for east debugging 
        devtool: 'inline-source-map',
        resolve: {
            alias: {
                loki: path.join(__dirname, '..', 'src' ),
                'socket.io': path.join( __dirname, '..', 'node_modules', 'socket.io', 'client-dist')
            }
        },
        module: {
            rules: [
                {
                    test: /\.(css)$/,
                    use: ['style-loader', 'css-loader'],
                }
            ]
        }
    };
    return wpConfig;
}

function copyHTML() {}

function copyCSS() {}

function copyAssets() {}