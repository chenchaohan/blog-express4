//分类信息
const express = require('express');
const router = express.Router();
const connect = require('../db/index')

//查询分类信息
router.get('/getCategories', function (req, resp) {
    const sql = 'select * from category'
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

//新增分类
router.post('/addCategories', (req, resp) => {
    let data = req.body
    let sql = `insert into category (name,date,num,color) values ('${data.name}',${data.date},0,'${data.color}')`
    connect.query(sql, (err, res) => {
        if (err) {
            console.error('数据库查询错误：', err);
        } else {
            let sql2 = `select * from category where date=${data.date}`
            connect.query(sql2, (err2, res2) => {
                if (err2) {
                    console.error('数据库查询错误：', err2);
                } else {
                    resp.send({
                        code: 200,
                        msg: `分类(${data.name})添加成功`,
                        data: res2[0]
                    })
                }
            })
        }
    })
})

//修改分类
router.post('/editCategories', (req, resp) => {
    let data = req.body
    let sql = `update category set name='${data.name}',date=${data.date},color='${data.color}' where id=${data.id}`
    connect.query(sql, (err, res) => {
        if (err) {
            console.error('数据库查询错误：', err);
        } else {
            resp.send({
                code: 200,
                msg: `分类(${data.name})修改成功`
            })
        }
    })
})

//删除分类
router.get('/deleteCategories', (req, resp) => {
    let sql = `delete from category where id=${req.query.categoryId}`
    connect.query(sql, (err, res) => {
        if (err) {
            console.error('数据库查询错误：', err);
        } else {
            resp.send({
                code: 200,
                msg: `成功删除id为${req.query.categoryId}的分类`
            })
        }
    })
})


module.exports = router