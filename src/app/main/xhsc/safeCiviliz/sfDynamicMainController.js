/**
 * Created by shaoshun on 2016/11/29.
 */
/**
 * Created by shaoshun on 2016/11/28.
 */
/**
 * Created by lss on 2016/10/19.
 */
/**
 * Created by emma on 2016/7/1.
 */
(function () {
  'use strict';

  angular
    .module('app.xhsc')
    .controller('sfDynamicMainController', sfDynamicMainController);

  /** @ngInject */
  function sfDynamicMainController(xhscService,$mdDialog) {
    var vm = this;
    vm.create=function () {
      $mdDialog.show({
        controller: ['$scope', 'utils', '$mdDialog', function ($scope, utils, $mdDialog) {
          $scope.ok=function () {
            $mdDialog.hide();
          }

          $scope.cancel=function () {
            $mdDialog.cancel();
          }

          function getYearWeek(date){
            var date=date.getDate();
            var week= Math.ceil(date/7);
            return week;
          }
          function getTheme() {
            var date=new Date();
            var year=date.getFullYear();
            var month=date.getMonth()+1;
            var week=getYearWeek(date);
            return  year+"年"+month+"月"+"第"+week+"周安全验收";
          }
          $scope.subject=getTheme();
          xhscService.getRegionTreeOffline("",3,1).then(function (r) {
            $scope.projects=r;
            if(angular.isArray($scope.projects)&&$scope.projects.length){
              $scope.currentProject=$scope.projects[0];
              if ($scope.currentProject.Children.length){
                $scope.currentArea=$scope.currentProject.Children[0];
              }
            }
          })


        }],
        templateUrl: 'app/main/xhsc/safeCiviliz/safe_civiliz_createTemplate.html',
        parent: angular.element(document.body),
        clickOutsideToClose: true,
        fullscreen: false
      }).then(function () {

      });
    }
    xhscService.getProfile().then(function (profile) {
      vm.role = profile.role;
      vm.OUType = profile.ouType;
    });
  }
})();
