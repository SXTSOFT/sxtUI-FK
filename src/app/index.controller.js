(function ()
{
    'use strict';

    angular
        .module('sxt')
        .controller('IndexController', IndexController);

    /** @ngInject */
    function IndexController(fuseTheming,api,$mdDialog,$rootScope)
    {
      $rootScope.$on('sxt:onNetworking',function (e,config) {
        $mdDialog.show({
          controller: ['$scope', '$mdDialog', function ($scope, $mdDialog) {
            $scope.url = config.url;
          }],
          template: '<md-dialog aria-label="正在加载"  ng-cloak><md-dialog-content> <md-progress-circular md-mode="indeterminate" md-diameter="20"></md-progress-circular>网络不太给力，请稍后...</md-dialog-content></md-dialog>',
          parent: angular.element(document.body),
          clickOutsideToClose: true,
          fullscreen: false
        });
      })
      $rootScope.$on('sxt:cancelNetworking',function () {
        $mdDialog.cancel();
      });

/*        api.szgc.vanke.profile().then(function () {

        });*/
        var vm = this;

        // Data
        vm.themes = fuseTheming.themes;

        //////////
    }
})();
