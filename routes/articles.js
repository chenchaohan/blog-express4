//文章信息
const express = require('express');
const router = express.Router();
const connect = require('../db/index')
const fs = require('fs')
const path = require('path')

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

//获取所有文章列表所有内容
router.get('/getArticleAllContent', (req, resp) => {
    let sql = 'select * from article'
    connect.query(sql, (err, res) => {
        if (err) {
            console.error('数据库查询错误：', err);
        } else {
            resp.send({
                code: 200,
                msg: '查询到所有文章',
                data: res
            })
        }
    })
})

//删除文章
router.post('/deleteArticle', (req, resp) => {
    let { id, categoryId, tagId, imgList } = req.body
    let sql = `delete from article where id=${id}`
    connect.query(sql, (err, res) => {
        if (err) {
            console.error('数据库查询错误：', err);
        } else {
            if (imgList.length != 0) {
                //删除文章包含的图片
                imgList.forEach(item => {
                    let pathUrl = path.join(__dirname, '../public', item)
                    fs.unlink(pathUrl, (err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(`图片(${pathUrl})删除成功`);
                        }
                    })
                })
            }
            //分类对应num减一
            let sql2 = `update category set num = num - 1 where id=${categoryId}`
            connect.query(sql2, (err2, res2) => {
                if (err2) {
                    console.error('数据库查询错误：', err2);
                }
            })
            //标签对应num减一
            for (let i = 0; i < tagId.length; i++) {
                let sql3 = `update tag set num = num - 1 where id=${parseInt(tagId[i])}`
                connect.query(sql3, (err3, res3) => {
                    if (err3) {
                        console.error('数据库执行错误：', err3);
                    }
                })
            }

            resp.send({
                code: 200,
                msg: `成功删除id为${id}的文章`
            })
        }
    })
})

//添加文章
router.post('/addArticle', (req, resp) => {
    const { title, author, date, categoryId, tagId, content, htmlContent, isshow, imgList } = req.body
    let sql = `insert into article (title,author,date,categoryId,tagId,readNum,content,htmlContent,likes,isshow,imgList) values ('${title}','${author}',${date},${categoryId},'${tagId}',0,` + JSON.stringify(content) + ',' + JSON.stringify(htmlContent) + `,0,'${isshow}','${JSON.stringify(imgList)}')`
    connect.query(sql, (err, res) => {
        if (err) {
            console.error('数据库执行错误：', err);
        } else {
            //将category分类表对应字段值加一
            let sql2 = `update category set num = num + 1 where id=${categoryId}`
            connect.query(sql2, (err2, res2) => {
                if (err2) {
                    console.error('数据库执行错误：', err2);
                }
            })
            //将tag标签表对应字段值加一
            let tagList = tagId.split('、')
            for (let i = 0; i < tagList.length; i++) {
                let sql3 = `update tag set num = num + 1 where id=${parseInt(tagList[i])}`
                connect.query(sql3, (err3, res3) => {
                    if (err3) {
                        console.error('数据库执行错误：', err3);
                    }
                })
            }
            //查询添加的文章并将值返回
            let sql4 = `select * from article where date=${date}`
            connect.query(sql4, (err4, res4) => {
                if (err4) {
                    console.error('数据库查询错误：', err4);
                } else {
                    resp.send({
                        code: 200,
                        msg: '成功添加文章',
                        data: res4[0]
                    })
                }
            })
        }
    })
})

//编辑文章
router.post('/editArticle', (req, resp) => {
    const { id, title, author, categoryId, oldCategoryId, tagId, addTag, minusTag, content, htmlContent, isshow, imgList } = req.body
    //这里文章内容不能直接使用字符串赋值，不然会和文章内的引号等冲突，这里应该使用JSON.stringify将字符串转义再使用
    let sql = `update article set title='${title}',author='${author}',categoryId=${categoryId},tagId='${tagId}',content=` + JSON.stringify(content) + ',htmlContent=' + JSON.stringify(htmlContent) + `,isshow='${isshow}',imgList='${JSON.stringify(imgList)}' where id=${id}`
    connect.query(sql, (err, res) => {
        if (err) {
            console.error('数据库执行错误：', err);
        } else {
            //判断分类数量是否需要改变
            if (oldCategoryId != -1) {
                //原本的分类数减一
                let sql2 = `update category set num = num - 1 where id=${oldCategoryId}`
                connect.query(sql2, (err2, res2) => {
                    if (err2) {
                        console.error('数据库执行错误：', err2);
                    }
                })
                let sql3 = `update category set num = num + 1 where id=${categoryId}`
                connect.query(sql3, (err3, res3) => {
                    if (err3) {
                        console.error('数据库执行错误：', err3);
                    }
                })
            }
            //判断标签数量是否需要改变
            //数量需要加一的标签数组
            if (addTag.length > 0) {
                for (let i = 0; i < addTag.length; i++) {
                    let sql4 = `update tag set num = num + 1 where id=${parseInt(addTag[i])}`
                    connect.query(sql4, (err4, res4) => {
                        if (err4) {
                            console.error('数据库执行错误：', err4);
                        }
                    })
                }
            }
            //数量需要减一的标签数组
            if (minusTag.length > 0) {
                for (let i = 0; i < minusTag.length; i++) {
                    let sql5 = `update tag set num = num - 1 where id=${parseInt(minusTag[i])}`
                    connect.query(sql5, (err5, res5) => {
                        if (err5) {
                            console.error('数据库执行错误：', err5);
                        }
                    })
                }
            }
            let sql6 = `select * from article where id=${id}`
            connect.query(sql6, (err6, res6) => {
                if (err6) {
                    console.error('数据库查询错误：', err6);
                } else {
                    resp.send({
                        code: 200,
                        msg: `id为${id}的文章信息修改成功`,
                        data: res6[0]
                    })
                }
            })
        }
    })
})

//删除图片列表
router.post('/deleteImgList', (req, resp) => {
    let imgList = req.body
    console.log(imgList);
    imgList.forEach(item => {
        let pathUrl = path.join(__dirname, '../public', item)
        fs.unlink(pathUrl, (err) => {
            if (err) {
            } else {
                console.log(`图片(${pathUrl})删除成功`);
            }
        })
        resp.send({
            code: 200,
            msg: `成功删除图片列表${imgList}`
        })
    })
})

module.exports = router