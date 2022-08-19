//连接mysql数据库
var mysql = require('mysql')
var connection = mysql.createConnection({
    //连接远程数据库
    host: '101.33.249.237',
    user: 'root',
    password: 'hewujun1027',
    database: 'blog'
})

connection.connect()

module.exports = connection