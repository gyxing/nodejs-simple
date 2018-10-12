/**
 * Example Controller
 */
const express = require('express');
const bodyParser = require('body-parser');
const ExampleService = require('./service/example');

// const setupService = new SetupService();

const app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

/**
 * 查询列表
 * @api {GET} /example 查询列表
 * @apiDescription 根据条件获得相应的列表
 * @apiName query
 * @apiSampleRequest /example
 * @apiGroup example
 * @apiVersion 1.0.0
 */
app.get('/', (req, res) => {
    ExampleService.query(req, res);
});

/**
 * 获取数据
 * @api {GET} /example/:id 获取数据
 * @apiDescription 根据ID获得数据
 * @apiName get
 * @apiSampleRequest /example/1
 * @apiGroup example
 * @apiVersion 1.0.0
 */
app.get('/:id', (req, res) => {
    ExampleService.get(req, res, req.params.id);
});

/**
 * 添加
 * @api {POST} /example 添加
 * @apiDescription 添加
 * @apiName add
 * @apiParam {String} name body，名称
 * @apiSampleRequest /example
 * @apiGroup example
 * @apiVersion 1.0.0
 */
app.post('/', (req, res) => {
    ExampleService.add(req, res, req.body)
});

/**
 * 修改
 * @api {POST} /example/:id 修改
 * @apiDescription 修改
 * @apiName modify
 * @apiParam {String} name body，名称
 * @apiSampleRequest /example/1
 * @apiGroup example
 * @apiVersion 1.0.0
 */
app.post('/:id', (req, res) => {
    ExampleService.modify(req, res, req.params.id, req.body)
});

/**
 * 批量删除
 * @api {DELETE} /example/batch 批量删除
 * @apiDescription 批量删除
 * @apiName remove_batch
 * @apiParam {Array} ids body，ID集合
 * @apiSampleRequest /example/batch
 * @apiGroup example
 * @apiVersion 1.0.0
 */
app.delete('/batch', (req, res) => {
    ExampleService.remove(req, res, req.body.ids)
});

/**
 * 删除单个
 * @api {DELETE} /example/:id 删除
 * @apiDescription 根据ID删除单个
 * @apiName remove
 * @apiSampleRequest /example/1
 * @apiGroup example
 * @apiVersion 1.0.0
 */
app.delete('/:id', (req, res) => {
    ExampleService.remove(req, res, req.params.id)
});

module.exports = app;
