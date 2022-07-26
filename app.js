const express = require('express');
const app = express();
const cors = require('cors')

//路由文件
const index = require('./routes/index')
const tags = require('./routes/tags')
const categories = require('./routes/categories')
const articles = require('./routes/articles')
const about = require('./routes/about')

//将public文件夹设为静态资源
app.use(express.static('public'))

//跨域
app.use(cors())

//配置解析req.body请求体参数
app.use(express.json()) // 解析post请求application/json类型数据
app.use(express.urlencoded({ extended: true })) // 解析application/x-www-form-urlencoded类型数据

//在进入路由中间件匹配之前可以拦截请求判断token是否失效
app.use(function (req, res, next) {
  //token有效就next进入路由中间件处理 ->next()
  next()
  //token失效就进入错误中间件  ->next(err)
})

//使用路由中间件
app.use('/api', index)
app.use('/api/tags', tags)
app.use('/api/categories', categories)
app.use('/api/articles', articles)
app.use('/api/about', about)

//错误处理中间件
app.use(function (err, req, res, next) {
  res.status(500).send({
    code: 500,
    error: err.message
  })
})

app.listen(process.env.PORT || 4000, () => {
  console.log('node server on http://localhost:4000.....');
})