## Nodejs简易后台接口服务

技术架构： nodejs + express + mysql


#### 辅助工具：

* morgan: 请求接口，自动生成日志记录
* apidoc：自动生成接口api文档


#### 项目开始，自动创建数据库：
```base
# ./src/base/config.json

{
    "mysql": {
        "host": "localhost",        // 数据库所在的IP
        "user": "root",             // 连接数据库的用户名
        "password": "root",         // 连接数据库的密码
        "database": "my_example"    // 所用到的数据库名称
    },
    "defaultPageSize": 10,          // 查询数据时默认数据行数
    "defaultSort": "-createTime"    // 排序方式
}
```

## 框架基础组件
```base
-- src
|---- base
|-------- config.json           // 配置项，如 mysql
|-------- tables.json           // 数据库表结构
|-------- sqlext.js             // 数据库设置、初始化
|-------- factory.js            // sql通用接口工厂类
|-------- service.js            // 公共接口，聚合 增删修改 基本操作
|-------- service-simple.js     // 公共接口，不含基本操作
```

## 执行命令说明：
```base
npm install     // 安装依赖包
npm run api     // 生成api接口说明，生成的文档在 ./static/apidoc 目录

npm run dev     // 开发阶段
npm start       // 上线时，稳定运行
```

浏览器打开调试接口：[http://localhost:8100/apidoc](http://localhost:8100/apidoc)

## 一些说明

* 如需修改端口号，请在`./index.js`修改`port`变量值

* api文档基本配置，请修改`./apidoc.json`的`url`和`sampleUrl`参数值（改为自己的后台服务地址），如 `http://localhost:8100/rest`

* 自动遍历`./src`目录直属js子文件作为api入口，如：
```
-- src
|---- service
|---- example.js
|---- files.js
```
则会生成接口 `/rest/example`与`/rest/files`, 接口编写规则请参考例子

* api文档生成规则，请查看 [apidoc](http://apidocjs.com/)
