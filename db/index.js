//连接mysql数据库
var mysql = require('mysql')
var connection = mysql.createConnection({
    //连接远程数据库
    host: '114.55.75.3',
    user: 'haixtx',
    password: 'hewujun1027',
    database: 'blog',
    port: 3307, // 端口号，默认3306
    useConnectionPooling: true  // 解决连接数据库报错问题
    //连接本地数据库
    // host: '127.0.0.1',
    // user: 'root',
    // password: 'hewujun1027',
    // database: 'blogsql'
})

connection.connect()

module.exports = connection