var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
    development: {
        db: 'mongodb://localhost:27017/mean',
        rootPath: rootPath,
        port: process.env.PORT || 8888
    },
    production: {
        rootPath: rootPath,
        db: 'mongodb://rateb:clubiste@ds025419.mlab.com:25419/meanrateb',
        port: process.env.PORT || 80
    }
}