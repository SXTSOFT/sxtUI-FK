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

})();

(function(win) {
  'use strict';

  win.sxt = {
    version: '1.1.12',
    app: {
      couchDb:'http://ggem.sxtsoft.com:5984',
      api:'http://s1511f9225.51mypc.cn:9090',
      //api:'http://localhost:80',
      fs:'http://s1511f9225.51mypc.cn:9090'
      //api:'http://10.245.9.164:8107',
    },
    angular:{

    }
  };

})(window);
