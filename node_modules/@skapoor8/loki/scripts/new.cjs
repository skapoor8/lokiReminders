const path = require('path');
const fs = require('fs');

function newLokiApp(appName) {
    console.log('Creating a new Loki app in', process.cwd());
    var appPath = process.cwd(),
        templateDir = path.join(__dirname, '..', 'templates');
    
    try { 
        // build src
        fs.mkdirSync(path.join(appPath, 'src'));
        // build loki.json
        generateFromTemplate(path.join(templateDir, 'loki.json.template'),
                            appPath,
                            'loki.json',
                            {
                                '<APP_NAME>': appName,
                                '<APP_SELECTOR>': 'loki-app', 
                                '<BOOTSTRAP_COMPONENT>': 'App'
                            });
        // build app.js
        generateFromTemplate(path.join(templateDir, 'app.js.template'),
                            path.join(appPath, 'src'),
                            'app.js',
                            {
                                '<APP_SELECTOR>': 'loki-app', 
                                '<BOOTSTRAP_COMPONENT>': 'App'
                            });
        // build app.css
        generateFromTemplate(path.join(templateDir, 'app.css.template'),
                            path.join(appPath, 'src'),
                            'app.css',
                            {});
        
        // build index.html
        generateFromTemplate(path.join(templateDir, 'index.html.template'),
                            path.join(appPath, 'src'),
                            'index.html',
                            {
                                '<APP_NAME>': appName,
                                '<APP_SELECTOR>': 'loki-app', 
                                '<BOOTSTRAP_COMPONENT>': 'App'
                            });

        // build components folder
        fs.mkdirSync(path.join(appPath, 'src', 'components'));
        // build styles folder
        fs.mkdirSync(path.join(appPath, 'src', 'styles'));
    } catch(e) {
        console.error('Error generating loki project');
        console.error(e);
    }
}

module.exports = newLokiApp;

// -----------------------------------------------------------------------------
function generateFromTemplate(templatePath, outPath, outfileName, replacements) {
    // console.log('args:', templatePath, outPath, outfileName, replacements);
    try {
        var template = fs.readFileSync(templatePath, 'utf-8');
        for (var toReplace in replacements) {
            var toReplaceRegex = new RegExp(toReplace, 'g'),
                replaceWith = replacements[toReplace];
            template = template.replace(toReplaceRegex, replaceWith);
        }
        fs.writeFileSync(path.join(outPath, outfileName), template);
    } catch(e) {
        console.log('Error generating file', outfileName, '\n', e);
        throw new Error(`!! Error generating file ${outfileName}:\n ${e.Error}`);
    }
}