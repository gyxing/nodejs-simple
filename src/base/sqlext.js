const mysql  = require('mysql');
const tables = require('./tables.json');
const config = require('./config.json');

/**
 * 数据库设置、初始化
 */
const SqlExt = new class {

    constructor() {
        // 尝试连接，判断添加数据库
        let params = {
            host     : config.mysql.host,
            user     : config.mysql.user,
            password : config.mysql.password,
            port: '3306'
        };
        let pool = mysql.createPool(params);
        pool.getConnection((err, connection) => {
            connection.query( `CREATE DATABASE IF NOT EXISTS ${config.mysql.database} DEFAULT CHARSET utf8 COLLATE utf8_general_ci;`, (err, rows) => {
                connection.release();
                connection.destroy();
                // 初始配置数据库连接池
                this.mysqlPool = mysql.createPool({
                    ...params,
                    database: config.mysql.database,
                    multipleStatements: true,
                    stringifyObjects: true
                });
                // 建表
                this.createTables();
            });
        });
    }

    // 建表
    createTables() {
        Object.keys(tables).map( key => {
            let arr = tables[key], sql, fields;
            fields = Object.keys(arr).map( field => `${field} ${arr[field]}`);
            sql = `CREATE TABLE IF NOT EXISTS ${key} (${fields.join(',')})`;
            this.exec(sql);
        });
        /*setTimeout(()=>{
            this.exec('select count(*) as count from admin').then(ret => {
                if( ret[0].count == 0 ) {
                    //创建超管帐号
                    let ads = [
                        { name:'admin', password:'123', level:0 }
                    ];
                    let sqls = [];
                    ads.map( d => {
                        let fields = Object.keys(d).map( field => field);
                        let values = Object.values(d).map( v => `'${v}'`);
                        sqls.push(`insert into admin(${fields.join(',')}) values(${values.join(',')})`)
                    });
                    this.exec(sqls.join(';')).then( data => console.log(data.insertId) ).catch(e=> console.log(e))
                }
            })
        }, 200)*/
    }

    // 执行sql语句
    exec(sql, values) {
        return new Promise( (resolve, reject) => {
            this.mysqlPool.getConnection( (error, connection) => {
                if(error) throw error;

                connection.query(sql, values, function(err, results) {
                    if(err) {
                        reject({status:500, msg: err})
                    }
                    resolve(results);
                });
                this._release(connection);
            })
        });
    }

    /* 返回连接池 */
    _release(connection) {
        connection.release( (err) => {
            if(err) {
                console.log('关闭数据库连接异常！', err);
            }
        });
    }
};

module.exports = SqlExt;
