(function () {
  'use strict';

  angular
    .module('app.core')
    .filter('nav', nav);

  /** @ngInject */
  function nav($stateParams, $rootScope,auth) {
    var user = auth.current();
    console.log(user.Role.MemberType);
    return function (items) {
      if (!user) {
        return [];

      }
      else {
        var list = items.filter(function (item) {
          var allow = true;
          // if (item.state=="app.enterprise.sysadmin.project"){
          if (item.allow) {
            allow = !!item.allow.find(function (allow) {
              switch (allow.user) {
                case 'm':
                  if (user.UserId == "13699877965") return true;
                  item.children = item.children.filter(function(c){
                    return !!c.allow.find(function (a) {
                      return (user.Role.MemberType|a.memberType) == a.memberType;
                    });
                  });
                  return (user.Role.MemberType|allow.memberType) == allow.memberType;
                break;
              }
            });
          }
          return allow;
        });
        return list;
      }
    };
  }

})();
