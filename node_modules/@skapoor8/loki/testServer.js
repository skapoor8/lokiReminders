const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');



try {
    var app = express();

    app.use(express.static(path.join(__dirname, 'src')));

    app.use('/', (req, res) => {
        console.log('serving', path.join(process.cwd(), 'src', 'index.html'));
        res.status(200).sendFile(path.join(process.cwd(), 'src', 'index.html'));
    });

    app.use((req, res) => {
        res.status(404).redirect('/');
    });

    http.createServer(app).listen(3011);
} catch (e) {
    console.error('No loki config found');
    console.error(e);
}
