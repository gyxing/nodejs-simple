/**
 * 公共接口，没其他操作
 */
class ServiceSimple {
    constructor() {
        this.tb_name = '';
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

module.exports = ServiceSimple;