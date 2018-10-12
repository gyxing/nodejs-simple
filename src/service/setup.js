const Factory = require('../base/factory');
const BaseService = require('../base/service');

/**
 * 页面设置类接口
 */
const SetupService = new class extends BaseService {
    constructor() {
        super();
        this.tb_name = 'setup'; // 表名
    }
};

module.exports = SetupService;
