/**
 * Created by emma on 2016/11/3.
 */
(function(){
  'use strict';

  angular
    .module('app.plan')
    .filter('filterTmp',filterTmp);

  /**@ngInject*/
  function filterTmp(){
    return function (data,arg1,arg2){
      var outputs=[];
      data&&data.forEach(function(r){
        var x1=r.Name.indexOf(arg1);
        var x2=r.Name.indexOf(arg2);
        if(x1 !=-1 && x2 !=-1){
          outputs.push(r);
        }
      })
      return outputs;
    }
  }
})();
