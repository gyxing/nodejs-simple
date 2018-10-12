/**
 * Files Controller
 */
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const FileService = require('./service/files');
const utils = require('./utils');

// 自动创建文件夹。
let baseSavePath = '../static/uploads'; // 保存文件的文件夹
let savePaths = ['', '/image']; // 细分目录
for(let item of savePaths) {
    let url = path.resolve(__dirname, baseSavePath + item);
    try{
        fs.statSync(url);
    }catch(e) {
        fs.mkdirSync(url)
    }
}

let uploadMulter = {};
for(let item of savePaths) {
    if(item) {
        let key = item.substring(item.lastIndexOf('/') + 1, item.length);
        uploadMulter[key] = multer({
            storage: multer.diskStorage({
                //设置上传后文件路径，uploads文件夹会自动创建。
                destination: function (req, file, cb) {
                    cb(null, path.resolve(__dirname, baseSavePath + item))
                },
                //给上传文件重命名，获取添加后缀名
                filename: function (req, file, cb) {
                    let ext = file.originalname.replace(/.+\./, "");
                    cb(null, utils.randomCode(18)+'.'+ext);
                }
            })
        })
    }
}

const app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

/**
 * 多文件上传
 * @api {POST} /files/upload/:pid 多文件上传，相册图片
 * @apiDescription 以form表单方式上传, 多文件上传
 * @apiName upload
 * @apiSampleRequest off
 * @apiGroup files
 * @apiSuccessExample {json} 上传成功返回:
 *     {
 *       "code": 0,
 *       "msg": "success",
 *       "data": ["http://www.xxx.com/files/123.png","http://www.xxx.com/files/158.png"]
 *     }
 * @apiVersion 1.0.0
 */
app.post('/upload/:pid', uploadMulter.image.array('files'), (req, res) => {
    FileService.upload(req, res, req.params.pid)
});

/**
 * 批量删除
 * @api {DELETE} /files/batch 批量删除
 * @apiDescription 批量删除类目
 * @apiName remove_batch
 * @apiParam {Array} ids body，类目ID集合
 * @apiSampleRequest /files/batch
 * @apiGroup files
 * @apiVersion 1.0.0
 */
app.delete('/batch', (req, res) => {
    FileService.removeFiles(req, res, req.body.ids)
});

/**
 * 日志文件
 * @api {GET} /files/logs 日志文件
 * @apiDescription 查看日志文件
 * @apiName get_logs
 * @apiSampleRequest /files/logs
 * @apiGroup files
 * @apiVersion 1.0.0
 */
app.get('/logs', (req, res) => {
    FileService.logs(req, res)
});

module.exports = app;
