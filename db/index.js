//连接mysql数据库
var mysql = require('mysql')

var mysqlConfig = {
  //连接远程数据库
  host: '114.55.75.3',
  user: 'root',
  // user: 'haixtx',  //docker部署mysql
  password: 'hewujun1027',
  database: 'blog',
  port: 3306,
  // port: 3307, // docker部署mysql--端口号，默认3306
  // 解决连接数据库报错问题
  // useConnectionPooling: true,
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
let connection
function handleDisconnect () {
  connection = mysql.createConnection(mysqlConfig)

  connection.connect((err) => {
    if (err) {
      console.error('mysql连接错误，2s后重连: ' + err.stack)
      // 2s后重连
      setTimeout(handleDisconnect, 2000)
      return
    }
    console.log('数据库连接成功，mysql连接进程id: ' + connection.threadId)
  })

  // 监听MySQL连接的end事件，一旦连接断开则自动重连
  connection.on('end', function() {
    console.log('数据库连接已断开，正在尝试重新连接...')
    handleDisconnect()
    // connection.connect(function(err) {
    //   if (err) {
    //     console.error('数据库重新连接失败，2s后再次尝试重连：' + err.stack)
    //     setTimeout(function() {
    //       connection.connect(function(err) {
    //         if (err) {
    //           console.error('数据库二次重新连接失败：' + err.stack)
    //         } else {
    //           console.log('数据库重新连接成功')
    //         }
    //       })
    //     }, 2000)
    //   } else {
    //     console.log('数据库重新连接成功')
    //   }
    // })
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

  // return connection
}
handleDisconnect ()

module.exports = connection