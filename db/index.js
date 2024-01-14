//连接mysql数据库
var mysql = require('mysql')
var connection = mysql.createConnection({
    //连接远程数据库
    host: '114.55.75.3',
    user: 'root',
    password: '123456',
    database: 'blog'
    //连接本地数据库
    // host: '127.0.0.1',
    // user: 'root',
    // password: 'hewujun1027',
    // database: 'blogsql'
})

connection.connect()

module.exports = connection