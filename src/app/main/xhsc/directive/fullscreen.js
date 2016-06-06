/**
 * Created by jiuyuong on 2016/6/6.
 */
(function () {
  'use strict';
  angular
    .module('app.xhsc')
    .directive('fullscreen',fullscreen);
  /** @ngInject */
  function fullscreen($window,$mdDialog) {
    return {
      link:link
    }
    function link(scope,element){
      var document = element[0].ownerDocument;
      if (!document.fullscreenElement &&
        !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
        $mdDialog.show({
          controller: ['$scope', '$mdDialog',function($scope, $mdDialog){
            $scope.cancel = function() {
              $mdDialog.cancel();
            };
            $scope.answer = function() {
              $mdDialog.hide();
              var d = document.documentElement || document;
              if (d.requestFullscreen) {
                d.requestFullscreen();
              } else if (d.mozRequestFullScreen) {
                d.mozRequestFullScreen();
              } else if (d.webkitRequestFullscreen) {
                d.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
              }
            };
          }],
          template:'<md-dialog aria-label="全屏"  ng-cloak>' +
          ' <md-toolbar><div class="md-toolbar-tools">全屏?</div></md-toolbar>' +
          '<md-dialog-content>是否全屏显示窗口?</md-dialog-content>' +
          '<md-dialog-actions layout="row"> <md-button ng-click="cancel()">否</md-button><span flex></span> <md-button fast-click="answer()" >是</md-button></md-dialog-actions>' +
          '</md-dialog>',
          parent: element,
          clickOutsideToClose: true
        });
      }
    }
  }
})();
