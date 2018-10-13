const Factory = require('../base/factory');
const config = require('./config.json');

/**
 * 公共接口，聚合 增删修改基本 操作
 */
class Service {
    constructor() {
        this.tb_name = '';  // 当前类所需要的数据库表名
    }
    // 获取列表
    async query(req, res, params) {
        let list = [];
        if (params) {
            // 带条件查询列表
            list = await Factory.query(this.tb_name, params);
            let totalCount = await Factory.count(this.tb_name, params);
            // 页码信息
            let size = totalCount[0].count || 0;
            let { page=0, count=config.defaultPageSize } = params;
            res.set({
                Range: JSON.stringify({page, count, size, pages: Math.ceil(size/count)})
            });
            // 格外需要处理的列表数据
            this.otherDutyQueryList(list);
        } else {
            // 不带条件，获取所有数据
            list = await Factory.query(this.tb_name, {});
        }
        // 返回
        this.responseSuccess(res, list);
    }
    // 如要需要格外处理查询的列表数据，在此处理
    async otherDutyQueryList(list) {

    }
    // 获取某一条数据
    get(req, res, id) {
        if(id) {
            Factory.get(this.tb_name, id).then( data => {
                if(data) {
                    this.responseSuccess(res, data);
                } else {
                    this.responseError(res, '数据不存在，id='+id, 404)
                }
            });
        }else{
            this.responseError(res, 'id为空', 400)
        }
    }
    // 添加
    add(req, res, params) {
        Factory.add(this.tb_name, params).then( ({insertId}) => {
            if(insertId) {
                Factory.get(this.tb_name, insertId).then( data => {
                    this.responseSuccess(res, data);
                })
            }else{
                this.responseError(res, '添加失败')
            }
        })
    }
    // 修改
    modify(req, res, id, params) {
        Factory.update(this.tb_name, id, params).then( data => {
            if(data.affectedRows > 0) {
                Factory.get(this.tb_name, id).then( data2 => {
                    this.responseSuccess(res, data2)
                });
            } else {
                this.responseError(res, '数据不存在，id='+id, 404)
            }
        })
    }
    // 删除
    remove(req, res, ids) {
        Factory.remove(this.tb_name, ids).then( data => {
            if(data) {
                this.responseSuccess(res, ids, '删除成功')
            } else {
                this.responseError(res, '删除失败，找不到数据', 404)
            }
        }).catch( err => {
            this.responseError(res, '服务器出错')
        })
    }
    // 返回客户端的数据 - success
    responseSuccess(res, data, msg='success') {
        res.status(200).send({ code:0, msg, data })
    }
    // 返回客户端的错误数据 - error
    responseError(res, msg, code=500) {
        res.status(code).send({ code:-1, msg })
    }
}

module.exports = Service;
