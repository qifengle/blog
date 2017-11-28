const http = require('http');
const util = require('util');
var mail = require('./utils/emails.js');
/**
 * 根据 ip 获取获取地址信息
 */
const getIpInfo = function (ip, cb) {
  const sina_server = 'http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json&ip=';
  const url = sina_server + ip;
  http.get(url, (res) => {
    const code = res.statusCode;
    if (code == 200) {
      res.on('data', (data) => {
        try {
          cb(null, JSON.parse(data));
        } catch (err) {
          cb(err);
        }
      });
    } else {
      cb({ code });
    }
  }).on('error', (e) => { cb(e); });
};

// getIpInfo('115.236.68.194', (err, msg) => {
//   console.log(`城市: ${msg.city}`);
//   console.log(`msg: ${util.inspect(msg, true, 8)}`);
// });