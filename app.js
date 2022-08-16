const express = require('express');
const app = express();
const cors = require('cors')
const jwt = require('jsonwebtoken')

//路由文件
const index = require('./routes/index')
const tags = require('./routes/tags')
const categories = require('./routes/categories')
const articles = require('./routes/articles')
const about = require('./routes/about')
const comment = require('./routes/comment')

//将public文件夹设为静态资源
app.use(express.static('public'))

//跨域
app.use(cors())

//配置解析req.body请求体参数
app.use(express.json()) // 解析post请求application/json类型数据
app.use(express.urlencoded({ extended: true })) // 解析application/x-www-form-urlencoded类型数据

//定义一个全局变量存放token密钥
global.secretJwt = 'haixtx'

//在进入路由中间件匹配之前可以拦截请求判断token是否失效
app.use(function (req, res, next) {
  let token = req.headers.token
  //通过请求头是否携带token来区分需要token鉴权和不需要token的请求
  if (token) {
    jwt.verify(token, global.secretJwt, (err, decoded) => {
      //token有效就next进入路由中间件处理 ->next()
      if (decoded) {
        //将解析后的token加到请求的user属性方便后面处理该请求的中间件使用
        req.user = decoded
        next()
      } else {
        //token失效就进入错误中间件  ->next(err)
        next({ name: 'tokenError' })
      }
    })
  } else {
    //不需要token鉴权就直接放行
    next()
  }
})

//使用路由中间件
app.use('/api', index)
app.use('/api/tags', tags)
app.use('/api/categories', categories)
app.use('/api/articles', articles)
app.use('/api/about', about)
app.use('/api/comment', comment)

//错误处理中间件
app.use(function (err, req, res, next) {
  if (err.name === 'tokenError') {
    res.status(200).send({
      code: 401,
      msg: 'token失效，请重新登录'
    })
  }
})

app.listen(process.env.PORT || 4000, () => {
  console.log('server on http://localhost:4000.....');
})