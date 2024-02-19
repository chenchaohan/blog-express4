//连接mysql数据库
var mysql = require('mysql')

var mysqlConfig = {
  //连接远程数据库
  host: '114.55.75.3',
  user: 'haixtx',
  password: 'hewujun1027',
  database: 'blog',
  port: 3307, // 端口号，默认3306
  // 解决连接数据库报错问题
  useConnectionPooling: true,
  // 连接超时时间设置为60s
  connectTimeout: 60000
  // 解决错误Error: Cannot enqueue Query after fatal error.
  // supportBigNumbers: true,
  // bigNumberStrings: true
  //连接本地数据库
  // host: '127.0.0.1',
  // user: 'root',
  // password: 'hewujun1027',
  // database: 'blogsql'
}

function handleDisconnect () {
  var connection = mysql.createConnection(mysqlConfig)

  connection.connect((err) => {
    if (err) {
      console.error('mysql连接错误，2s后重连: ' + err.stack)
      // 2s后重连
      setTimeout(handleDisconnect, 2000)
      return
    }
    console.log('mysql连接进程id: ' + connection.threadId)
  })

  connection.on('error', (err) => {
    console.log('mysql连接错误：', err)
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('数据库连接已关闭，执行重连')
      // 重连
      handleDisconnect()
    } else {
      throw err
    }
  })

  return connection
}

module.exports = handleDisconnect()