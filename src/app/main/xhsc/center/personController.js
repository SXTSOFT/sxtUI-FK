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
          vm.user.memberTypeName = role.data.Role.MemberTypeName;
        switch (role.data.Role.MemberType){
          case 0:
            vm.user.role='总包';
            break
          case 2:
            vm.user.role='监理';
            break;
          case 4:
            vm.user.role="项目部";
            break;
          case 8:
            vm.user.role="工程管理部";
            break;
          case 16:
            vm.user.role="集团";
            break;
        }
      }
    });


  }
})();
