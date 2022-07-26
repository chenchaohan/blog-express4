//网站首页信息
const express = require('express');
const router = express.Router();
const connect = require('../db/index')

//查询网站信息
router.get('/getBlogMes', function (req, resp) {
  const sql = 'select * from blog'
  connect.query(sql, (err, res) => {
    if (err) {
      console.error('数据库查询错误：', err);
    } else {
      resp.send({
        code: 200,
        msg: "网站信息获取成功",
        data: res[0]
      })
    }
  })
});

//查询网站首页信息
router.get('/getHome', function (req, resp) {
  const sql = 'select * from home'
  connect.query(sql, (err, res) => {
    if (err) {
      console.error('数据库查询错误：', err);
    } else {
      resp.send({
        code: 200,
        msg: "网站首页信息获取成功",
        data: res[0]
      })
    }
  })
});

//查询文章列表
router.get('/getArticleList', function (req, resp) {
  let sql = ''
  if (req.query.categoryId) {
    //查询分类文章
    sql = `select id,title,date,categoryId from article where categoryId=${req.query.categoryId}`
  } else if (req.query.tagId) {
    //查询标签文章(使用正则匹配)
    sql = `select id,title,date,tagId from article where tagId regexp ${req.query.tagId}`
  } else {
    //查询所有文章列表
    sql = `select id,title,date,categoryId,tagId from article`
  }
  connect.query(sql, (err, res) => {
    if (err) {
      console.error('数据库查询错误：', err);
    } else {
      resp.send({
        code: 200,
        msg: "文章列表获取成功",
        data: res
      })
    }
  })
})

module.exports = router;
