import express from 'express';
import path from 'path';
import fileUpload from 'express-fileupload';
import session from 'express-session';
import EventEmitter from 'node:events';
import bodyParser from 'body-parser';

// Work around for __dirname not being useable with experimental modules
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
global.__dirname = path.dirname(__filename);
// ---

/*
Socket IO
Low DB
UI Kit
JS RTC tutorial - voice chat / screenshare
*/

let app = express();
var ip = '0.0.0.0';
var port = 3000;
var eventEmitter = new EventEmitter();

// Setup content that can be accessed on the browser
app.use (express.static('./Browser'));

// Setup file upload and body data from post requests
app.use (bodyParser.urlencoded ({extended: false }));
app.use (bodyParser.json ({ limit: '1024mb' }));
app.use (fileUpload ());

// Session and server secret for auth stuff, TBD
app.use (session ({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

import KeeperscapeRouter from './KeeperscapeRouter.js';
var keeperscapeRouter = new KeeperscapeRouter ({app, directory: __dirname});

let requestHandler = app.listen (
    port,
    ip,
    () => {
        console.log ('Running server at ' + ip + ':' + port);
    }
)

process.on('SIGINT', () => {
  console.log("Shutting down.");
  process.exit();
});