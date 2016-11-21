/**
 * Created by emma on 2016/11/15.
 */
(function(){
  'use strict';

  angular
    .module('app.inspection')
    .directive('sxtWtPop',sxtWtPop);

  /**@ngInject*/
  function sxtWtPop(xhUtils,$mdPanel,$state){
    return {
      scope:{
        show:'='
      },
      templateUrl:'app/main/inspection/directives/sxt-wt-pop.html',
      link:link
    }
    function link(scope,element,attr,ctrl){
      //$(element).appendTo('#content');
      scope.addPhoto = function(){
        xhUtils.photo().then(function(img){

        })
      }
      scope.$watch('show',function(){
        console.log(scope.show)
        //if(scope.show){
        //  $(element).css('display','block')
        //}
      })
      scope.cancel = function(){
        scope.show = false;
        //$(element).css('display','none')
      }
      scope.chooseQues = function(){
        //$state.go('app.inspection.check.cjwt')

          var position = $mdPanel.newPanelPosition()
            .relativeTo('md-toolbar')
            .addPanelPosition($mdPanel.xPosition.ALIGN_START, $mdPanel.yPosition.BELOW)
            .bottom(0)
            .right(0)

          $mdPanel.open({
            controller: ['$scope','mdPanelRef',function ($scope,mdPanelRef) {
              $scope.select = function(){
                mdPanelRef.close();
                mdPanelRef.destroy();
              }
              $scope.check = function(){
                mdPanelRef.close();
                mdPanelRef.destroy();
              }
            }],
            templateUrl:'app/main/inspection/directives/inspection-problems.html',
            hasBackdrop: false,
            position: position,
            trapFocus: true,
            panelClass: 'is-cjwt',
            zIndex: 5000,
            clickOutsideToClose: true,
            escapeToClose: true,
            focusOnOpen: true,
            attachTo:angular.element('body')
          });
      }
    }
  }
})();
