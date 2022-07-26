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


module.exports = router