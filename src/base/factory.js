const Sqlext = require('./sqlext');
const utils = require('../utils');
const config = require('./config.json');

// 组装sql的where条件语句
const createWhereSql = (query) => {
    let sql = '', sqlAnd = [], values = [];

    function _cr(str, con) {
        if(con.value2) {
            // between and
            str.push(`${con.key} between ? and ?`);
            values.push(con.value);
            values.push(con.value2);
        } else if (con.like) {
            // like
            str.push(`${con.key} like ?`);
            values.push(`%${con.value}%`);
        } else {
            // equal
            str.push(`${con.key}=?`);
            values.push(con.value);
        }
    }

    query.map( firCon => {
        if(utils.isArray(firCon)) {
            // or
            if(firCon.length > 0) {
                let temp = [];
                firCon.map( secCon => {
                    _cr(temp, secCon);
                });
                sqlAnd.push(temp.join(' or '));
            }
        } else {
            // and
            _cr(sqlAnd, firCon);
        }
    });
    if(sqlAnd.length > 0) {
        sql += ` where ${sqlAnd.join(' and ')}`
    }
    return { sql, values }
};

/**
 * sql通用接口工程类
 */
const Factory = {
    // 根据id获取表数据
    get: async (table, id) => {
        let sql = `select * from ${table} where id=${id}`;
        let data = await Sqlext.exec(sql);
        data = data[0];
        if(data && table === 'user') {
            delete data.password;
        }
        return data;
    },
    /**
     * 查询列表
     *
     * @param table     数据表名
     * @param params
     *      {
     *         query: [
     *            { key: 'title', value: '测试', like:true },
     *            { key: 'createTime', value: '2018-08-01', value2: '2018-08-15' },
     *            [
     *                { key: 'tagId', value: 1 },
     *                { key: 'tagId', value: 2 }
     *            ]
     *         ],
     *         sort: '-createTime',
     *         page: 0,
     *         count: 1000
     *      }
     *
     *   sort排序方式， 默认-createTime降序，+升序 / -降序
     *
     * @returns {Promise<void>}
     */
    query: async (table, params) => {
        let { query=[], sort=config.defaultSort, page=0, count=config.defaultPageSize} = params;

        let sql = `select * from ${table}`, values = [];
        if(query.length > 0) {
            let wSQL = createWhereSql(query);
            sql += wSQL.sql;
            values = values.concat(wSQL.values);
        }
        // 排序
        if(sort) {
            let sortType = sort.indexOf('-')===0?'desc':'asc';
            let sortKey = sort.substr(1, sort.length);
            sql += ` order by ${sortKey} ${sortType}`
        }else{
            sql += ` order by createTime desc`
        }
        // 分页
        sql += ` limit ${page*count}, ${count}`;

        return await Sqlext.exec(sql, values);
    },
    // 总条数
    count: async (table, params) => {
        let { query=[] } = params;

        let sql = `select count(*) as count from ${table}`, values = [];
        if(query.length > 0) {
            let wSQL = createWhereSql(query);
            sql += wSQL.sql;
            values = values.concat(wSQL.values);
        }

        return await Sqlext.exec(sql, values);
    },
    // 添加表数据
    add: async (table, params) => {
        let keys = [], keys2 = [], values = [];
        Object.keys(params).map( key => {
            keys.push(key);
            keys2.push('?');
            values.push(params[key]);
        });
        let sql = `insert into ${table} (${keys.join(',')}) values(${keys2.join(',')})`;
        return await Sqlext.exec(sql, values);
    },
    // 更新表数据
    update: async (table, id, params) => {
        let keys = [], values = [];
        Object.keys(params).map( key => {
            keys.push(`${key}=?`);
            values.push(params[key])
        });
        let sql = `update ${table} set ${keys.join(',')} where id=${id}`;
        return await Sqlext.exec(sql, values);
    },
    // 删除表数据 单个/批量
    remove: async (table, ids) => {
        let sqls = [];
        if(ids instanceof Array) {
            sqls = ids.map( id => `delete from ${table} where id='${id}'`)
        }else{
            sqls.push(`delete from ${table} where id='${ids}'`)
        }
        return await Sqlext.exec(sqls.join(';'))
    },
    // 执行sql命令
    exec: async (sql, values) => {
        return await Sqlext.exec(sql, values);
    },
    // 查询用户id，从cookie的token里面取
    getUid: (req) => {
        let token = req.signedCookies.token;
        if(token) {
            return cache.get(token);
        }
        return null;
    }
};

module.exports = Factory;
