/**
 * Created by zhangzhaoyong on 16/1/28.
 */
(function(){
  angular
    .module('app.szgc')
    .filter('filterGrpWokerName',filterGrpWokerName)
    .filter("roleId", roleId);
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
  /** @ngInject */
  function roleId() {
    return function (input) {
      switch (input) {
        case 'zb':
          return '总包';
        case 'jl':
          return '监理';
        case '3rd':
          return '第三方';
        case 'eg':
          return '万科';
        default:
          return ''
      }
    }
  }
})();
