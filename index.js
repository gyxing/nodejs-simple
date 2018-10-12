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

// 解决response.send的JSON.stringify时对Date数据的处理
Date.prototype.toJSON = function () { return this.getTime() };

global.cache = cache;   // 缓存对象
global.cacheDeadline = 60*24*3; // 有效期3天，单位s

// 初始化数据库
SqlExt.init();

const app = express();

// 日志配置 - 自定义
let logDirectory = path.join(__dirname, 'logs');
// 确认日志存放的目录存在
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
// 日志文件格式
let accessLogStream = FileStreamRotator.getStream({
    date_format: 'YYYYMMDD',
    filename: path.join(logDirectory, 'access-%DATE%.log'),
    frequency: 'daily',
    verbose: false
});
// 日志内容格式
morgan.format('myLog', ':remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" - :status -- :response-time ms');
app.use(morgan('myLog', {
    stream: accessLogStream,
    skip: (req, res) => {
        // 过滤 不记录规则
        return req.url.indexOf('/web/') !== -1 || req.url.indexOf('/apidoc/') !== -1;
    }
}));

// 请求头设置
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Content-Length, Authorization, Accept, X-Requested-With, data, uid");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Character-Encoding", "utf-8");
    next();
});

//开启cookie
app.use(cookieParser('session_secret'));
// 静态资源路径
app.use(express.static('static'));

// 添加服务接口（src目录下的直属js文件）
let interfacePath = path.join(__dirname, 'src');
fs.readdirSync(interfacePath).map( file => {
    let p = `./src/${file}`;
    let fp = path.resolve(__dirname, p);
    let stat = fs.statSync(fp);
    if(stat.isFile()) {
        let fn = file.substring(0, file.lastIndexOf('.'));
        let pos = file.substring(file.lastIndexOf('.')+1, file.length);
        if(pos.toLowerCase() === 'js') {
            app.use(`/rest/${fn}`, require(p))
        }
    }
});

app.get("/", function(req, res) {
    res.end('hello world');
});

app.listen(8100, () => {
    console.log('build end, to open: http://localhost:8100');
});

module.exports = app;
