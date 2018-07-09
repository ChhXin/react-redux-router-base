/**
 * 全局常量
 */

const isProd = process.env.NODE_ENV === 'production';
const isBeta = process.env.NODE_ENV === 'beta';

// 定义 url 二级路径，根据实际项目定义其值
module.exports.URL_CONTEXT = ''; // 如：'/urlContext'

// result
module.exports.RES_CODE = 'code';
module.exports.RES_DATA = 'data';
module.exports.RES_MSG = 'msg';
module.exports.SUCCESS_CODE = '0';
module.exports.FAIL_CODE = '1';
module.exports.AUTH_EXPIRED_CODE = '9999';
module.exports.NO_PERMISSION_CODE = '12';
