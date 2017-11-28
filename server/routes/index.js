const path = require('path');
const express = require('express');

const db = require('../db.js');
const Article = require('../controller/article');
let { getClientIP, getIpInfo } = require('../common/system')
const router = express.Router();

/**
 *
 * @api {get} /get-articles 获取博客列表
 * @apiDescription 获取博客列表
 * @apiName get-articles
 * @apiGroup Lipper
 * @apiParam {string} count 每页显示数
 * @apiParam {string} type 显示所有类型博客
 * @apiVersion 1.0.0
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *
 *{
 *	"status": 1,
 * 	"info": {
 *   	"articles":[
 *     		{
 *       		"id": 102,
 *       		"title": "深入浅出ES6 — 解构",
 *       		"tag": "ES6",
 *       		"abstract": "解构赋值解构赋值允许你使用类似数组或者对象字面量的方式将数组或对象的属性赋值给各个变量。和传统方式相比，这种赋值语法更加简洁和清晰。举个栗子：123456var arr = [1,2,3];var a = arr[0];var b = arr[1];var c",
 *       		"created_at": "2017-11-03",
 *       		"views": 1,
 *       		"theme": "ES6"
 *     		}
 *   	],
 *   	"total": 1
 * 	}
 *}
 *
 *
 * @apiErrorExample Error-Response:
 *
 * HTTP/1.1 404 Not Found
 * {
 *     "status": 404
 * }
 * */
router.get('/get-articles', Article.getArticles);

router.get('/get-article-detail/:id', Article.getArticleDetail);

router.get('/get-timeline', Article.getTimeline);


router.get('/get-note', (req, res, next) => {
  const { current = 1, count = 15 } = req.query;
  const field = 'id, title, detail, tag, created_at';
  const sql = `select ${field} from gather where status = 1 order by created_at desc limit ${(+current - 1) * +count}, ${+count}`;

  db.query(sql, (err, rows) => {
    if (err) {
      res.json({
        status: 0,
        message: '',
      });
    } else {
      db.query('select count(*) as total from gather where status = 1 ', (err, t) => {
        res.json({
          status: 1,
          notes: rows,
          total: t[0].total,
        });
      });
    }
  });
});


router.get('/get-gossip', (req, res, next) => {
  const {
    current = 1, count = 30,
  } = req.query;
  const sql = `select * from gossip order by created_at desc limit ${(+current - 1) * +count}, ${+count}`;

  db.query(sql, (err, rows) => {
    if (err) {
      res.json({
        status: 0,
        message: '',
      });
    } else {
      db.query('select count(*) as total from gossip', (err, t) => {
        res.json({
          status: 1,
          gossips: rows,
          total: t[0].total,
        });
      });
    }
  });
});


router.get('/get-navside-info', (req, res, next) => {
  const sqls = [
    "select value from config where (name = 'intro' or name = 'view_count') and status = 1",
    'select id, title from article where status = 1 order by created_at desc limit 10',
    'select id, theme from category where status = 1',
    'select id, text, url from link where status = 1',
    'select distinct tag from article where status = 1 order by created_at desc limit 15',
    'select count(*) as count from article where status = 1',
  ];

  const ps = [];
  for (sql of sqls) {
    ps.push(new Promise(((resolve, reject) => {
      db.query(sql, (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve(rows);
      });
    })));
  }

  const p = Promise.all(ps);
  p.then((out) => {
    let tags = [];

    for (item of out[4]) {
      tags.push(...(item.tag.trim().replace(/\s/, ' ').split(' ')));
    }

    tags = [...new Set(tags)];

    res.json({
      status: 1,
      portrait: {
        intro: out[0][0].value,
        viewCount: out[0][1].value,
        articleCount: out[5][0].count,
      },
      articles: out[1],
      categories: out[2],
      links: out[3],
      tags,
    });
  }).catch((err) => {
    res.json({
      status: 0,
      message: '',
    });
  });
});

router.get('/post-comment', (req, res, next) => {
  const cip = getClientIP(req);
  let {
    comment,
    id
  } = req.query;

  const time = new Date().toLocaleString();
  getIpInfo(cip, function (err, msg) {
    if (err) {
      res.json({
        result: false,
        message: err
      });
    }
    else {
      const sql = "INSERT INTO `comment` (`ip`, `country`, `province`, `city`, `content`, `subtime`, `articleid`) VALUES ( '" + cip + "', '" + msg.country + "', '" + msg.province + "', '" + msg.city + "', '" + comment + "', '" + time + "', '" + id + "');";
      db.query(sql, (err, rows) => {
        if (err) {
          res.json({
            result: false,
            message: "提交失败"
          });
        } else {
          res.json({
            result: true,
            ip: cip,
            city: msg.city,
            comment: comment,
            id: id,
            time: time
          });
        }
      });
    }
  })
});

router.get('/get-comment', (req, res, next) => {
  const {
    id
  } = req.query;
  const sql = "SELECT id as commentid,city,subtime as time,content as comment,articleid as id,ip FROM `comment` where articleid='" + id + "' order by subtime desc;";

  db.query(sql, (err, rows) => {
    if (err) {
      res.json({
        status: 0,
        message: '',
      });
    } else {
      res.json(rows);
    }
  });
});

router.get('/get-map-data', (req, res, next) => {
  var data ={
    data: [
      { year: '2000', internally: 21.0, refugees: 16, seekers: 0.8 },
      { year: '2001', internally: 25.0, refugees: 16, seekers: 0.8 },
      { year: '2002', internally: 25.0, refugees: 15, seekers: 0.8 },
      { year: '2003', internally: 25.0, refugees: 14, seekers: 0.7 },
      { year: '2004', internally: 25.0, refugees: 14, seekers: 0.7 },
      { year: '2005', internally: 24.0, refugees: 13, seekers: 0.8 },
      { year: '2006', internally: 24.0, refugees: 14, seekers: 0.7 },
      { year: '2007', internally: 26.0, refugees: 16, seekers: 0.7 },
      { year: '2008', internally: 26.0, refugees: 15.2, seekers: 0.8 },
      { year: '2009', internally: 27.1, refugees: 15.2, seekers: 1.0 },
      { year: '2010', internally: 27.5, refugees: 15.4, seekers: 0.8 },
      { year: '2011', internally: 26.4, refugees: 15.2, seekers: 0.9 },
      { year: '2012', internally: 28.8, refugees: 15.4, seekers: 0.9 },
      { year: '2013', internally: 33.3, refugees: 16.7, seekers: 1.2 },
      { year: '2014', internally: 38.2, refugees: 19.5, seekers: 1.8 }
    ],
    total:15
  };
  res.json(data);
});

router.get('*', (req, res, next) => {
  res.sendfile(path.join(__dirname, '../../public/index.html')); // 发送静态文件
});

module.exports = router;
