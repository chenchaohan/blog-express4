//标签信息
const express = require('express');
const router = express.Router();
const connect = require('../db/index')

//删除评论
router.get('/deleteComment', (req, resp) => {
    let sql = `delete from comment where id=${req.query.commentId}`
    connect.query(sql, (err, res) => {
        if (err) {
            console.error('数据库查询错误：', err);
        } else {
            resp.send({
                code: 200,
                msg: `成功删除id为${req.query.commentId}的评论`
            })
        }
    })
})

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
    let sql = `insert into comment (tos,froms,email,content,date,articleId,parentId,toId,avatar) values ("${tos}","${froms}","${email}","${content}","${date}",${articleId},${parentId},${toId},"/imgs/avatar/avatar${Math.floor(Math.random() * 10 + 1)}.jpg")`
    connect.query(sql, (err, res) => {
        if (err) {
            console.error('数据库提交错误：', err);
        } else {
            let sql2 = `select * from comment where date=${date}`
            connect.query(sql2, (err2, res2) => {
                if (err2) {
                    console.error('数据库查询错误：', err2);
                } else {
                    resp.send({
                        code: 200,
                        msg: "评论成功",
                        data: res2[0]
                    })
                }
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

//查询所有评论
router.get('/getAllComment', (req, resp) => {
    let sql = 'select * from comment'
    connect.query(sql, (err, res) => {
        if (err) {
            console.error('数据库查询错误：', err);
        } else {
            resp.send({
                code: 200,
                msg: '查询到所有评论',
                data: res
            })
        }
    })
})

module.exports = router