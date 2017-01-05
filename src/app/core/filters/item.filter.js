(function ()
{
  'use strict';

  angular
    .module('app.core')
    .filter('itemFilter', itemFilter);

  /** @ngInject */
  function itemFilter()
  {
    return function (value,type,id)
    {
      if(id!=""){
        return value.filter(function(r) {
          return r.operator.id==id;
        });
      }else{
        return value.filter(function(r) {
          return (r.status==type||type=="");
        });
      }
    };
  }


})();
