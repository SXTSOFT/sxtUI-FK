/**
 * Created by lss on 2016/10/20.
 */
/**
 * Created by lss on 2016/10/20.
 */
/**
 * Created by emma on 2016/6/12.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('personController',personController);

  /**@ngInject*/
  function personController($scope,$mdDialog,db,auth,$rootScope,api,utils,$q,remote,versionUpdate,$state,$timeout,$mdBottomSheet){
    var vm = this;

    var pro=[
      remote.profile()
    ];
    $q.all(pro).then(function(r){
      var role=r[0];
      vm.user={};
      vm.u={};
      if (role&&role.data&&role.data){
          vm.user.name= role.data.Name;
          vm.user.userName= role.data.UserName;
          vm.user.OUName = role.data.Role.OUName;
          vm.user.role=role.data.Role.MemberTypeName;
      }
    });


  }
})();
