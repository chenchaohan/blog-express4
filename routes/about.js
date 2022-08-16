//关于页信息
const express = require('express');
const router = express.Router();
const connect = require('../db/index')
const marked = require('marked')

//查询关于页信息
router.get('/getAbout', function (req, resp) {
    const sql = 'select * from about'
    connect.query(sql, (err, res) => {
        if (err) {
            console.error('数据库查询错误：', err);
        } else {
            //返回给前台的文章将md转换为html
            //由于前台和后台共用这一个接口获取关于内容，但是前台需要md转html，所以通过是否携带token来区分前后台
            res[0].content = req.headers.token ? res[0].content : marked.parse(res[0].content)
            resp.send({
                code: 200,
                msg: "关于信息获取成功",
                data: res[0]
            })
        }
    })
});

//修改关于页内容
router.post('/editAbout', (req, resp) => {
    const sql = `update about set content=${JSON.stringify(req.body.content)}`
    connect.query(sql, (err, res) => {
        if (err) {
            console.error('数据库执行错误：', err);
        } else {
            resp.send({
                code: 200,
                msg: "关于页信息修改成功"
            })
        }
    })
})


module.exports = router