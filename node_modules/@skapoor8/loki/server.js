const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const { Server } = require("socket.io");

const watch = require('node-watch');
const buildLokiApp = require('./scripts/build.cjs');


try {
    var app = express();
    var config = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'loki.json')));
    
    // express middleware --------------------------------------------------------------------------
    app.use(express.static(path.join(process.cwd(), 'dist', config['project-name'])));
    app.use('/styles', express.static(path.join(process.cwd(), 'src', 'styles')));
    app.use('/assets', express.static(path.join(process.cwd(), 'src', 'assets')));
    console.error('css-main:', config['css-main']);
    app.use(`/${config['css-main']}`,(req, res) => {
        console.error(`hit /${config['css-main']}`);
        res.sendFile(path.join(process.cwd(), 'src', config['css-main']))
    });
    app.use('/socket.io.js', express.static(
        path.join(__dirname, 'node_modules', 'socket.io', 'client-dist', 'socket.io.js'))
    );
    app.use('/', (req, res) => {
        res.status(200).sendFile(path.join(process.cwd(), 'src', 'index.html'));
    });
    app.use((req, res) => {
        res.status(404).redirect('/'); 
    });

    const server = http.createServer(app);
    const io = new Server(server);
    server.listen(3012, () => console.log('Serving Loki app on http://localhost:3012\n'));

    // in development, listen for changes and refresh client
    if (config.mode === 'development') {
        // io.on('connection', (socket) => {
        //     console.log('A user connected!');
        //     socket.on('disconnect', () => {
        //         console.log('A user disconnected');
        //     });
        // });

        const watcher = watch(
            [__dirname, process.cwd()], 
            {
                recursive: true,
                filter: f => !/dist\//.test(f) && !/tmp\//.test(f) 
            }
        );

        watcher.on('change', () => {
            console.log('Compiling...'); 
            const config = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'loki.json')));
            buildLokiApp(config, () => {
                io.emit('refresh', {});
            });
        });
    }
} catch (e) {
    console.error('No loki config found');
    console.error(e);
}

