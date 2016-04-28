/**
 * Created by jiuyuong on 2016/1/21.
 */
if(!Array.prototype.find)
  Array.prototype.find = function(fn){
    for(var i= 0,l=this.length;i<l;i++){
      if(fn(this[i])===true){
        return this[i];
      }
    }
  }
window.sxt = (function(win)
{
  'use strict';

  var sxt;

  sxt = {
    version: '1.1.12',
    app: {
      //api:'http://ggem.sxtsoft.com:9191',
      api:'http://localhost:8107',
      //api:'http://10.245.9.164:8107',
    },
    angular:{

    }
  };

  return sxt;

})(window);
