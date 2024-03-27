//标签信息
const express = require('express');
const router = express.Router();
const connect = require('../db/index')

//查询标签信息
router.get('/getTags', function (req, resp) {
    const sql = 'select * from tag'
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
//新增标签
router.post('/addTags', (req, resp) => {
    let data = req.body
    let sql = `insert into tag (name,date,num,color) values ('${data.name}',${data.date},0,'${data.color}')`
    connect.query(sql, (err, res) => {
        if (err) {
            console.error('数据库查询错误：', err);
        } else {
            let sql2 = `select * from tag where date=${data.date}`
            connect.query(sql2, (err2, res2) => {
                if (err2) {
                    console.error('数据库查询错误：', err2);
                } else {
                    resp.send({
                        code: 200,
                        msg: `标签(${data.name})添加成功`,
                        data: res2[0]
                    })
                }
            })
        }
    })
})

//修改标签
router.post('/editTags', (req, resp) => {
    let data = req.body
    let sql = `update tag set name='${data.name}',date=${data.date},color='${data.color}' where id=${data.id}`
    connect.query(sql, (err, res) => {
        if (err) {
            console.error('数据库查询错误：', err);
        } else {
            resp.send({
                code: 200,
                msg: `标签(${data.name})修改成功`
            })
        }
    })
})

//删除标签
router.get('/deleteTags', (req, resp) => {
    let sql = `delete from tag where id=${req.query.tagId}`
    connect.query(sql, (err, res) => {
        if (err) {
            console.error('数据库查询错误：', err);
        } else {
            resp.send({
                code: 200,
                msg: `成功删除id为${req.query.tagId}的标签`
            })
        }
    })
})


module.exports = router