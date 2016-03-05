/**
 * Created by zhangzhaoyong on 16/2/15.
 */
(function(){
  angular
    .module('app.szgc')
    .filter('fileurl',fileurl);
  /** @ngInject */
  function fileurl(sxt){
    return function (value) {
      return 'http://vkde.sxtsoft.com' + (value && value.substring(0, 1) == '~' ? value.substring(1) : value);
    }
  }
})();
