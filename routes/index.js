//网站首页信息
const express = require('express');
const router = express.Router();
const connect = require('../db/index')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const busboy = require('busboy')
const path = require('path')

//查询网站信息
router.get('/getBlogMes', function (req, resp) {
  const sql = 'select * from website'
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

// //查询网站首页信息
// router.get('/getHome', function (req, resp) {
//   const sql = 'select * from home'
//   connect.query(sql, (err, res) => {
//     if (err) {
//       console.error('数据库查询错误：', err);
//     } else {
//       resp.send({
//         code: 200,
//         msg: "网站首页信息获取成功",
//         data: res[0]
//       })
//     }
//   })
// });

//查询文章列表
router.get('/getArticleList', function (req, resp) {
  let sql = ''
  if (req.query.categoryId) {
    //查询分类文章
    sql = `select id,title,date,categoryId,isshow from article where categoryId=${req.query.categoryId}`
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
  } else if (req.query.tagId) {
    //查询标签文章
    let sql2 = `select id,title,date,tagId,isshow from article`
    connect.query(sql2, (err2, res2) => {
      if (err2) {
        console.error('数据库查询错误：', err2);
      } else {
        let list = res2.filter(item => item.tagId.split('、').indexOf(req.query.tagId) != -1)
        resp.send({
          code: 200,
          msg: "标签文章列表获取成功",
          data: list
        })
      }
    })
  } else {
    //查询所有文章列表
    sql = `select id,title,date,categoryId,tagId,isshow from article`
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
  }
})

//登录
router.post('/login', (req, resp) => {
  let data = req.body
  const payload = {
    name: data.name,
    password: data.password
  }
  let sql = `select * from website where name='${data.name}'&&password='${data.password}'`
  connect.query(sql, (err, res) => {
    //登录成功
    if (res[0]) {
      //生成token(有效期10小时)
      const token = jwt.sign(payload, global.secretJwt, { expiresIn: '10h' })
      let result = {
        mes: res[0],
        token
      }
      resp.send({
        code: 200,
        msg: '登录成功',
        data: result
      })
    } else {
      //登录失败
      resp.send({
        code: 404,
        msg: '用户名或密码错误'
      })
    }
  })
})

//上传图片
//数据传递格式为：multipart/form-data
router.post('/uploadImg', (req, resp) => {
  let pathUrl = ''
  // const random = (() => {
  //   const buf = Buffer.alloc(4);
  //   //生成8位随机数
  //   return () => randomFillSync(buf).toString('hex');
  // })();
  const bb = busboy({ headers: req.headers });
  bb.on('file', (name, file, info) => {
    //使用时间戳作为图片前缀(确保图片名称的唯一性)
    pathUrl = `/imgs/upload/${+new Date()}-${info.filename}`
    const saveTo = path.join(__dirname, '../public' + pathUrl);
    file.pipe(fs.createWriteStream(saveTo));
  });
  bb.on('close', () => {
    resp.send({
      code: 200,
      msg: `图片(${pathUrl})上传成功`,
      data: { pathUrl }
    });
  });
  req.pipe(bb);
  return;
})

//删除图片
router.get('/deleteUploadImg', (req, resp) => {
  let name = req.query.name
  //去除字符串前后的引号
  let pathUrl = path.join(__dirname, '../public', name.replace(/^[\'\"]+|[\'\"]+$/g, ""))
  console.log('删除的图片路径：', pathUrl);
  fs.unlink(pathUrl, (err) => {
    if (err) {
      resp.send({
        code: 404,
        msg: err
      })
    } else {
      resp.send({
        code: 200,
        msg: `图片(${pathUrl})删除成功`
      });
    }
  })
})

//修改网站信息
router.post('/changeWebsiteMes', (req, resp) => {
  console.log('提交的网站信息：', req.body);
  let { name, password, avatar, introduce, desc, github, gitee, recode, websiteAddress } = req.body
  //name,password,desc三个名称和数据库冲突了
  let sql = "update website set " + "`name`" + `='${name}',` + "`password`" + `='${password}',avatar='${avatar}',introduce='${introduce}',` + "`desc`" + `='${desc}',github='${github}',gitee='${gitee}',recode='${recode}',websiteAddress='${websiteAddress}'`
  connect.query(sql, (err, res) => {
    if (err) {
      console.error('数据库修改错误：', err);
    } else {
      resp.send({
        code: 200,
        msg: "网站信息修改成功"
      })
    }
  })
})

module.exports = router;
