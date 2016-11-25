/**
 * Created by shaoshun on 2016/11/25.
 */
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
    .filter('zgFilter',zgFilter);

  function zgFilter(){
    return function(items,Status) {
      if (!items||!items.length){
        return;
      }
      if (!angular.isArray(Status)){
        return items;
      }
      return items.filter(function (t) {
         return Status.some(function (k) {
           return k==t.Status;
         })
      });
    }
  }

})(angular);
