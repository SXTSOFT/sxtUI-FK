/**
 * Created by zhangzhaoyong on 16/1/28.
 */
(function(){
  angular
    .module('app.szgc')
    .filter('filterGrpWokerName',filterGrpWokerName);
  /** @ngInject */
  function filterGrpWokerName(){
    return function(value) {
      var name = "";
      if (value && value.length > 4) {
        name = value.substr(0,4) + '...';
      } else {
        name = value;
      }
      return name;
    };
  }
})();
