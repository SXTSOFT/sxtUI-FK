/**
 * Created by emma on 2016/6/12.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('pcenterController',pcenterController);

  /**@ngInject*/
  function pcenterController($scope,$mdDialog){
    var vm = this;
    vm.tel=13112345678;
    vm.changeTel = function(tel){
      $mdDialog.show({
        controller:['$scope',function($scope){
            $scope.tel = vm.tel;
            $scope.cancel = function(){
              $mdDialog.hide();
            }
          $scope.submit = function(tel){
            $mdDialog.hide(tel);
            vm.tel = tel;
          }
        }],
        templateUrl: 'app/main/xhsc/center/changeTel.html',
        parent: angular.element(document.body),
        focusOnOpen:false,
        clickOutsideToClose: true
      }

        //$mdDialog.prompt({
        //  title:'手机号码',
        //  placeholder:'电话号码',
        //  ok:'确定',
        //  cancel:'取消'
        //})
      )
    }
    vm.logout = function(){
      vm.showmyDialog = true;
    }
  }
})();
