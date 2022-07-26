//文章信息
const express = require('express');
const router = express.Router();
const connect = require('../db/index')

//查询评论信息
router.get('/getComment/:articleId?', function (req, resp) {
    let sql = ''
    //存在文章id则查询文章id对应评论，不存在文章id则查询留言评论
    if (req.params.articleId) {
        sql = `select * from comment where articleId=${req.params.articleId}`
    } else {
        sql = `select * from comment where articleId is null`
    }
    connect.query(sql, (err, res) => {
        if (err) {
            console.error('数据库查询错误：', err);
        } else {
            resp.send({
                code: 200,
                msg: "标签信息获取成功",
                data: res
            })
        }
    })
});

//提交评论数据
router.post('/submitComment', function (req, resp) {
    let { tos, froms, email, content, date, articleId, parentId, toId } = req.body
    let sql = `insert into comment (tos,froms,email,content,date,articleId,parentId,toId) values ("${tos}","${froms}","${email}","${content}","${date}",${articleId},${parentId},${toId})`
    connect.query(sql, (err, res) => {
        if (err) {
            console.error('数据库提交错误：', err);
        } else {
            resp.send({
                code: 200,
                msg: "评论成功",
            })
        }
    })
});

//获取最新一条评论
router.get('/getLatestComment', function (req, resp) {
    const sql = 'select * from comment order by id desc limit 1'
    connect.query(sql, (err, res) => {
        if (err) {
            console.error('数据库查询错误：', err);
        } else {
            resp.send({
                code: 200,
                msg: "评论信息获取成功",
                data: res[0]
            })
        }
    })
});

//获取文章内容
router.get('/getArticleContent/:articleId', function (req, resp) {
    const sql = `select * from article where id=${req.params.articleId}`
    connect.query(sql, (err, res) => {
        if (err) {
            console.error('数据库查询错误：', err);
        } else {
            resp.send({
                code: 200,
                msg: `id为${req.params.articleId}的文章信息获取成功`,
                data: res[0]
            })
        }
    })
});

//文章已读数加一
router.get('/addReadNum/:articleId', function (req, resp) {
    const sql = `update article set readNum=readNum+1 where id=${req.params.articleId}`
    connect.query(sql, (err, res) => {
        if (err) {
            console.error('数据库查询错误：', err);
        } else {
            resp.send({
                code: 200,
                msg: `id为${req.params.articleId}的文章已读数加一`
            })
        }
    })
});

//文章喜欢数加一
router.get('/addLikeNum/:articleId', function (req, resp) {
    const sql = `update article set likes = likes + 1 where id=${req.params.articleId}`
    connect.query(sql, (err, res) => {
        if (err) {
            console.error('数据库查询错误：', err);
        } else {
            resp.send({
                code: 200,
                msg: `id为${req.params.articleId}的文章喜欢数加一`
            })
        }
    })
});


module.exports = router