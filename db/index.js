//连接mysql数据库
var mysql = require('mysql')
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'hewujun1027',
    database: 'blog'
})

connection.connect()

module.exports = connection