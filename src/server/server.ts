/// <reference path='../../typings/index.d.ts' />
'use strict';

import * as express from 'express';
import * as favicon from 'serve-favicon';
import * as bodyParser from 'body-parser';

let app = express();

app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));
app.use(bodyParser.json({ limit: '1mb' }));
app.use('/', express.static(__dirname + '/../client'));
app.use(favicon(__dirname + '/../client/favicon.ico'));

// set port and start server
let port: number = process.env.PORT || 3000;

app.set('port', port);

app.listen(port, () => {
    console.log('Server is listening on port ' + port);
});
