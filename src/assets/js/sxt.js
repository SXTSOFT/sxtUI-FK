/**
 * Created by jiuyuong on 2016/1/21.
 */
(function(){
  'use strict';
  if(!Array.prototype.find) {
    Array.prototype.find = function (fn) {
      for (var i = 0, l = this.length; i < l; i++) {
        if (fn(this[i],i,this) === true) {
          return this[i];
        }
      }
    };
  }
  Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
      "M+": this.getMonth() + 1, //月份
      "d+": this.getDate(), //日
      "h+": this.getHours(), //小时
      "m+": this.getMinutes(), //分
      "s+": this.getSeconds(), //秒
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度
      "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }
})();

(function(win) {
  'use strict';

  win.sxt = {
    version: '1.1.12',
    app: {

      couchDb:'http://ggem.sxtsoft.com:5984',
      api:'http://vkde.sxtsoft.com:8091',
      //api:'http://xhszgc.sxtsoft.com:7091',
      //api:'http://xhszgc.sxtsoft.com:9091',
      //api:'http://10.0.8.183:9091',
      //fs:'http://xhszgc.sxtsoft.com:8090'
      fs:'http://xhszgc.sxtsoft.com:9090'
    },
    angular:{

    }
  };

})(window);
