/**
 * Category Controller
 */
const express = require('express');
const bodyParser = require('body-parser');
const SetupService = require('./service/setup');

// const setupService = new SetupService();

const app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

/**
 * 查询列表
 * @api {GET} /setup 查询列表
 * @apiDescription 根据条件获得相应的列表
 * @apiName query
 * @apiSampleRequest /setup
 * @apiGroup setup
 * @apiVersion 1.0.0
 */
app.get('/', (req, res) => {
    SetupService.query(req, res);
});

/**
 * 添加
 * @api {POST} /setup 添加
 * @apiDescription 添加
 * @apiName add
 * @apiParam {String} type body，类型
 * @apiParam {String} content body，内容
 * @apiSampleRequest /setup
 * @apiGroup setup
 * @apiVersion 1.0.0
 */
app.post('/', (req, res) => {
    SetupService.add(req, res, req.body)
});

module.exports = app;
