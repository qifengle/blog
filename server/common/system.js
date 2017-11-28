let os = require('os');
const http =require('http');
// module.exports.getClientIP = function (req) {
//     return req.headers['x-forwarded-for'] ||
//         req.connection.remoteAddress ||
//         req.socket.remoteAddress ||
//         req.connection.socket.remoteAddress;
// };


module.exports.getServerIP = function () {
    let interfaces = os.networkInterfaces();
    for (let devName in interfaces) {
        let dn = interfaces[devName];
        for (let i = 0; i < dn.length; i++) {
            let alias = dn[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}

module.exports.getClientIP = function (req) {
    var ipAddress;
    var headers = req.headers;
    var forwardedIpsStr = headers['x-real - ip'] || headers['x - forwarded -for'];
    forwardedIpsStr ? ipAddress = forwardedIpsStr : ipAddress = null;
    if (!ipAddress) {
        ipAddress = req.connection.remoteAddress;
    }
    return ipAddress;
}

module.exports.get_client_ip = function (req) {
    let ip = req.headers['x-forwarded-for'] ||
        req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || '';
    if (ip.split(',').length > 0) {
        ip = ip.split(',')[0];
    }
    return ip;
};

module.exports.getIpInfo = function(ip, cb) {
    var sina_server = 'http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json&ip=';
    var url = sina_server + ip;
    http.get(url, function(res) {
        var code = res.statusCode;
        if (code == 200) {
            res.on('data', function(data) {
                try {
                    cb(null, JSON.parse(data));
                } catch (err) {
                    cb(err);
                }
            });
        } else {
            cb({ code: code });
        }
    }).on('error', function(e) { cb(e); });
};