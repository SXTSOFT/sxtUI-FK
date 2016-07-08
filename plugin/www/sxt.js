/**
 * Created by jiuyuong on 2016/7/8.
 */
var exec = require('cordova/exec');

exports.getExtra = function(success, error, options) {
  exec(success, error, "sxt", "playYs7", options);
};
