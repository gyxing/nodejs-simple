const express = require('express');
const FileStreamRotator = require('file-stream-rotator');
const fs = require('fs');
const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const NodeCache = require('node-cache');
const sqlext = require('./src/base/sqlext');
const cache = new NodeCache();
const SqlExt = new sqlext();

const interface_files = require('./src/files');
const interface_setup = require('./src/setup');

// 解决response.send的JSON.stringify时对Date数据的处理
Date.prototype.toJSON = function () { return this.getTime() };

global.cache = cache;   // 缓存对象
global.cacheDeadline = 60*24*3; // 有效期3天，单位s

SqlExt.init();

const app = express();

// 日志
let logDirectory = path.join(__dirname, 'logs');
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
// create a rotating write stream
let accessLogStream = FileStreamRotator.getStream({
    date_format: 'YYYYMMDD',
    filename: path.join(logDirectory, 'access-%DATE%.log'),
    frequency: 'daily',
    verbose: false
});
// setup the logger
morgan.format('myLog', ':remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" - :status -- :response-time ms');
app.use(morgan('myLog', {
    stream: accessLogStream,
    skip: (req, res) => {
        // 过滤 不记录规则
        return req.url.indexOf('/web/') !== -1 || req.url.indexOf('/apidoc/') !== -1;
    }
}));
// app.use(morgan('common', {stream: accessLogStream}));

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Content-Length, Authorization, Accept, X-Requested-With, data, uid");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Character-Encoding", "utf-8");
    next();
});

app.use(cookieParser('session_secret'));
app.use(express.static('static'));

app.use('/rest/file', interface_files);
app.use('/rest/setup', interface_setup);

app.get("/", function(req, res) {
    res.end('hello world');
});

app.listen(8100, () => {
    console.log('to open: http://localhost:8100');
});

module.exports = app;
