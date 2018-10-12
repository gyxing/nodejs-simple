const Factory = require('../base/factory');

/**
 * 公共接口
 */
class Service {
    constructor() {
        this.tb_name = '';
    }
    query(req, res) {
        Factory.query(this.tb_name, {}).then( data => {
            res.send(Factory.responseSuccess(data))
        })
    }
    get(req, res, id) {
        if(id) {
            Factory.get(this.tb_name, id).then( data => {
                if(data) {
                    res.send(Factory.responseSuccess(data))
                } else {
                    res.send(Factory.responseError('数据不存在，id='+id))
                }
            });
        }else{
            res.send(Factory.responseError('id为空'))
        }
    }
    add(req, res, params) {
        Factory.add(this.tb_name, params).then( ({insertId}) => {
            if(insertId) {
                Factory.get(this.tb_name, insertId).then( data => {
                    res.send(Factory.responseSuccess(data))
                })
            }else{
                res.send(Factory.responseError('添加失败'))
            }
        })
    }
    modify(req, res, id, params) {
        Factory.update(this.tb_name, id, params).then( data => {
            if(data.affectedRows > 0) {
                Factory.get(this.tb_name, id).then( data2 => {
                    res.send(Factory.responseSuccess(data2))
                });
            } else {
                res.send(Factory.responseError('数据不存在，id='+id))
            }
        })
    }
    remove(req, res, ids) {
        Factory.remove(this.tb_name, ids).then( data => {
            if(data) {
                res.send(Factory.responseSuccess(ids, '删除成功'))
            } else {
                res.send(Factory.responseError('删除失败'))
            }
        })
    }
}

module.exports = Service;
