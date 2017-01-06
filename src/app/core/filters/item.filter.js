(function ()
{
  'use strict';

  angular
    .module('app.core')
    .filter('itemFilter', itemFilter)
    .filter('taskFilter', taskFilter)
  /** @ngInject */
  function itemFilter()
  {
    return function (value,type,id)
    {
      if(id==undefined&&type==undefined)
        return value;
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
  /** @ngInject */
  function taskFilter()
  {
    return function (value,type)
    {
      if(type==undefined)
        return value;

        return value.filter(function(r) {
          return r.status==type;

        });

    };
  }

})();
