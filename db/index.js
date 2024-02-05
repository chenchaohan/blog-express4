//连接mysql数据库
var mysql = require('mysql')
var connection = mysql.createConnection({
    //连接远程数据库
    host: '114.55.75.3',
    user: 'haixtx',
    password: 'hewujun1027',
    database: 'blog',
    port: 3307, // 端口号，默认3306
    useConnectionPooling: true,  // 解决连接数据库报错问题
    debug: true,
    // 解决错误Error: Cannot enqueue Query after fatal error.
    supportBigNumbers: true,
    bigNumberStrings: true
    //连接本地数据库
    // host: '127.0.0.1',
    // user: 'root',
    // password: 'hewujun1027',
    // database: 'blogsql'
})

connection.connect((err) => {
  if (err) {
    console.error('连接错误: ' + err.stack)
    return
  }
  console.log('数据库连接进程id ' + connection.threadId)
  // connection.query('SELECT * FROM users', (error, results, fields) => {
  //   if (error) {
  //     console.log('测试查询错误:', error)
  //     return
  //   }

  //   console.log('查询用户测试:', results)
  // })
})

module.exports = connection