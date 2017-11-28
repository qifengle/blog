const mail = require('../utils/emails.js');
const excel = require('../utils/dbToExcel');
const schedule = require('node-schedule');
const Article = require('../controller/article');
const xlsxname = '/files/2017-11-03.xlsx';
function scheduleJob1() {
    this.sayHello = function () {
        schedule.scheduleJob('5 * * * * *', () => {
            Article.testSchedule('我只是一只定时器');
            // excel.sendFiles();
            // mail.send({  
            //     from: '"Lipper" <lipper251645731@126.com>',   
            //     to: '251645731@qq.com',   
            //     subject: 'Lipper',  
            //     text: '数据库mysql连接数据库模块 mysql', 
            //     attachments:[{ filename : 'lipper.xlsx', path : `./${xlsxname}` }],  
            //     html: '<b>数据库mysql连接数据库模块 mysql  基本封装: http://blog.csdn.net/zzwwjjdj1/article/details/51991348自动运行模块   node-schedule 基本使用 : http://blog.csdn.net/zzwwjjdj1/article/details/51898257生成excel表格   node-xlsx发送邮件   nodemailer 基本使用 : http://blog.csdn.net/zzwwjjdj1/article/details/51878392</b>'  
            //   }); 
        });
    };
} module.exports = scheduleJob1;
