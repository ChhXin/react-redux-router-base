/**
 * 服务端的日志封装
 *   提供统一日志入口，满足统一日志格式要求
 * how to use ?
 * const logger = require('/path/to/mylogger').Logger;
 *
 * Created by tanxiangyuan on 2016/12/20.
 */
const winston = require('winston');
const path = require('path');
const moment = require('moment');
const localIp = require('ip');
const fs = require('fs-extra');

let formatter = function(args) {
    let date = moment().format('YY-MM-DD.HH:mm:ss.SSS'),
        level = args.level,
        ip = localIp.address(),
        msg = args.message,
        location = args.meta.location;
    return `${date} [${ip}_${process.pid}] ${level.toUpperCase()} ${location} - ${msg}`;
};
/**
 * 获取异常文件路径和行号
 * 异常stack样例：
 * Error
 at _getCallerFile (/Volumes/workspace/Webs/crpl/credit-front-m-node/server/helper/mylogger.js:21:18)
 at Logger.log (/Volumes/workspace/Webs/crpl/credit-front-m-node/server/helper/mylogger.js:67:19)
 at Logger.info (/Volumes/workspace/Webs/crpl/credit-front-m-node/server/helper/mylogger.js:81:10)
 at Server.onListening (/Volumes/workspace/Webs/crpl/credit-front-m-node/bin/www:91:12)
 at emitNone (events.js:86:13)
 at Server.emit (events.js:185:7)
 at emitListeningNT (net.js:1283:10)
 at _combinedTickCallback (internal/process/next_tick.js:71:11)
 at process._tickCallback (internal/process/next_tick.js:98:9)
 at Timeout.Module.runMain [as _onTimeout] (module.js:606:11)
 at ontimeout (timers.js:365:14)
 at tryOnTimeout (timers.js:237:5)
 at Timer.listOnTimeout (timers.js:207:5)
 * @param deepth
 * @param appName
 * @returns {string} 如：bin_www_91_21
 * @private
 */
let _getCallerFile = function(deepth, appName) {
    if (isNaN(deepth) || deepth < 0) deepth = 1;
    deepth += 1;
    let stack = (new Error()).stack.replace(/\\/g,'/')
        , a = stack.indexOf('\n', 5);
    while (deepth--) {
        a = stack.indexOf('\n', a + 1);
        if (a < 0) {
            a = stack.lastIndexOf('\n', stack.length);
            break;
        }
    }
    let b = stack.indexOf('\n', a + 1);
    if (b < 0) b = stack.length;
    let endStr = '/';
    if (appName) {
        endStr += appName + '/'
    }
    a = Math.max(stack.lastIndexOf(' ', b), stack.lastIndexOf(endStr, b) + endStr.length);
    b = stack.lastIndexOf(')', b);
    stack = stack.substring(a, b);
    return stack ? stack.replace(/\:|\//g, '_').replace(/\n|\s/g,'') : stack;
};

let wLogger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            name: 'console-log',
            formatter: formatter,
            level: process.env.ENV === 'development' ? 'debug' : 'info',
            json: false
        })
    ]
});

const log = function(level, msg) {
    let logInfo = {
        location: _getCallerFile(2, process.env.APP_NAME || undefined),
    };

    wLogger.log(level, msg, logInfo);
};

module.exports.Logger = {
    log: function(msg) {
        log('debug', msg);
    },
    debug: function(msg) {
        log('debug', msg);
    },
    info: function(msg) {
        log('info', msg);
    },
    error: function(msg) {
        log('error', msg);
    },
    profile: function(tag) {
        wLogger.profile(tag, {
            location: _getCallerFile(2, process.env.APP_NAME || undefined),
        });
    }
};