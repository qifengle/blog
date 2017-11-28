var mysql = require('../db');
var async = require('async');
var xlsx = require('node-xlsx');
var fs = require('fs');
const mail = require('./emails.js');

var task1 = function (callback) {
    mysql.query('select * from user', function (err, rows, fields) {
        if (err) {
            callback(err, null);
            return;
        }
        var datas = [];
        rows.forEach(function (row) {
            var newRow = [];
            for (var key in row) {
                newRow.push(row[key]);
            }
            datas.push(newRow);
        })
        callback(null, datas);
    })
}

var task2 = function (datas, callback) {
    var buffer = xlsx.build([{ name: "我只是个测试", data: datas }]);
    var xlsxname = `./files/${nowDate().split(' ')[0]}.xlsx`;
    fs.writeFile(xlsxname, buffer, 'binary', function (err) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, xlsxname);
    })
}

var task3 = function (xlsxname, callback) {
    mail.send({
        from: '"Lipper" <lipper251645731@126.com>',
        to: '251645731@qq.com',
        subject: 'Lipper',
        text: '数据库mysql连接数据库模块 mysql',
        attachments: [{ filename: 'lipper.xlsx', path: `./${xlsxname}` }],
        html: '<b>数据库mysql连接数据库模块 mysql  基本封装: http://blog.csdn.net/zzwwjjdj1/article/details/51991348自动运行模块   node-schedule 基本使用 : http://blog.csdn.net/zzwwjjdj1/article/details/51898257生成excel表格   node-xlsx发送邮件   nodemailer 基本使用 : http://blog.csdn.net/zzwwjjdj1/article/details/51878392</b>'
    });
    callback(null, "success");
}

exports.sendFiles = function () {
    async.waterfall([task1, task2, task3], function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        console.log(result);
    })
}

const nowDate = function () {
    var date = new Date();
    var fmtTwo = function (number) {
        return (number < 10 ? '0' : '') + number;
    }
    var yyyy = date.getFullYear();
    var MM = fmtTwo(date.getMonth() + 1);
    var dd = fmtTwo(date.getDate());
    var HH = fmtTwo(date.getHours());
    var mm = fmtTwo(date.getMinutes());
    var ss = fmtTwo(date.getSeconds());
    return '' + yyyy + '-' + MM + '-' + dd + ' ' + HH + ':' + mm + ':' + ss;
}