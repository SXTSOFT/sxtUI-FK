/**
 * Created by 陆科桦 on 2016/10/14.
 */

(function(angular,undefined){
  'use strict';
  angular
    .module('app.material')
    .component('materialList',{
      templateUrl:'app/main/material/component/material-list.html',
      controller:material,
      controllerAs:'vm'
  });
  /** @ngInject */
  function material($scope,api,utils){
    console.log('aaa');
  }
})(angular,undefined);
