/**
 * Created by jiuyuong on 2016/11/8.
 */
(function(angular){
  'use strict';

  angular
    .module('app.xhsc')
    .filter('cnFilter',cnFilter);

  function cnFilter(){
    return function(items,o) {
      var r = [],b,v;
      items.forEach(function (item) {
        b = false;
        for(var k in o){
          if(b || !item[k]) break;
          item['_p_'+k] = item['_p_'+k]||Pinyin.getPinyinArrayFirst(item[k]).join('');
          v = item['_p_'+k]+item[k];
          if(v.toLowerCase().indexOf((o[k]||'').toLowerCase())!=-1){
            r.push(item);
          }
        }
      });
      return r;
    }
  }


})(angular);
