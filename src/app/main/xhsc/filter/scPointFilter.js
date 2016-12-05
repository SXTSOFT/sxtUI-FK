/**
 * Created by shaoshunliu on 2016/11/17.
 */
/**
 * Created by jiuyuong on 2016/11/8.
 */
(function(angular){
  'use strict';

  angular
    .module('app.xhsc')
    .filter('scPointFilter',scPointFilter);

  function scPointFilter(){
    return function(items,role) {
      if (!items||!items.length||items.length<index){
        return;
      }
      return [items[index]];
    }
  }

})(angular);
