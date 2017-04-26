/**
 * Created by shaoshunliu on 2017/4/25.
 */

(function(angular){
  'use strict';

  angular
    .module('app.xhsc')
    .filter('percent',percent);

  function percent(){
    return function(item,noFilter) {
      if (item>1){
        return Math.floor(item*100)/100;
      }
      if (item==1){
        return 100+"%";
      }
      if (item){
        item=(item*100).toFixed(3);
        return item>=10?(item.substr(0,5)+"%"):(item.substr(0,4)+"%");
      }
      return  noFilter?"/":item;
    }
  }

})(angular);
