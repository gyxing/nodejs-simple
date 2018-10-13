const path = require('path');
const fs = require('fs');
const Factory = require('../base/factory');
const BaseServiceSimple = require('../base/service-simple');

const staticDir = path.resolve(__dirname, '../../static');

/**
 * 文章类接口
 */
const FilesService = new class extends BaseServiceSimple {
    constructor() {
        super();
        this.tb_name = 'files';
    }
    upload(req, res, pid) {
        let files = req.files, urls = [];
        if(files.length > 0) {
            let list = [];
            function _loop(arr) {
                if(arr.length > 0) {
                    let file = arr[0];
                    let {originalname, size, filename} = file;
                    let photo = {
                        filename: originalname,
                        path: `/uploads/images/${filename}`,
                        size,
                        pid
                    };
                    Factory.add(this.tb_name, photo).then(({insertId}) => {
                        if(insertId) {
                            Factory.get(this.tb_name, insertId).then( data => {
                                list.push(data);
                                _loop(arr.filter((d,i) => i>0))
                            })
                        }else{
                            _loop(arr.filter((d,i) => i>0))
                        }
                    })
                } else {
                    this.responseSuccess(res, list)
                }
            }
            _loop(files)
        }else{
            this.responseError(res, '没有文件');
        }
    }
    async removeFiles(req, res, ids) {
        try {
            let tempIds = ids instanceof Array? ids : [ids];
            for(let id of tempIds) {
                let file = await Factory.get(this.tb_name, id);
                fs.unlinkSync(path.resolve(`${staticDir}\\${file.path}`));    // 删除本地存储
                await Factory.remove(this.tb_name, id);
            }
            this.responseSuccess(res, ids, '删除成功')
        } catch (e) {
            this.responseError(res, '删除失败');
        }
    }
    // 删除本地文件
    remove(paths, cb) {
        let tempPaths = paths instanceof Array? paths : [paths];
        for(let item of tempPaths) {
            try{
                item && fs.unlinkSync(path.resolve(`${staticDir}\\${item}`))
            }catch(e) {}
        }
        cb && cb();
    }
    // 获取日志文件内容
    logs(req, res) {
        let logsPath = path.resolve(__dirname, '../../logs');    // 日志文件所在
        let arr = [];
        try{
            let fns = fs.readdirSync(logsPath).reverse();
            for(let item of fns) {
                let url = path.resolve(logsPath, item);
                let stat = fs.statSync(url);
                if(stat.isFile()) {
                    let txt = fs.readFileSync(url, 'utf-8');
                    arr.push({
                        name: item,
                        size: stat.size,
                        createTime: stat.birthtimeMs,
                        lastModifyTime: stat.mtimeMs,
                        content: txt.split('\n')
                    })
                }
            }
            this.responseSuccess(res, arr);
        }catch(e) {
            this.responseError(res, '找不到日志文件', 400);
        }
    }
};

module.exports = FilesService;
