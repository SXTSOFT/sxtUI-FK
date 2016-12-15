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
        show:'=',
        question:'@'
      },
      templateUrl:'app/main/inspection/directives/sxt-wt-pop.html',
      link:link
    }
    function link(scope,element,attr,ctrl){
      //$(element).appendTo('#content');
      scope.photos = [{url:'app/main/szgc/images/1.jpg'},
        {url:'app/main/szgc/images/1.jpg'},
        {url:'app/main/szgc/images/1.jpg'},
        // {url:'app/main/szgc/images/bg_home.png'}
        ]

      scope.remove = function ($event,item) {
        scope.photos.splice(scope.photos.indexOf(item),1);
      }

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
        scope.question = ''
        //$(element).css('display','none')
      }

      scope.submit = function () {
        var question = element.find('.question').text()
        var description = scope.description
        scope.$emit('submit',{
          question:question,
          description: description
        })
        scope.show = false
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
              $scope.currentQ = 0
              $scope.options = [
                {name:'三表',question:[
                  {name:'电表',zimu:'SB'},{name:'水表',zimu:'SB'},{name:'天然气表',zimu:'SB'}
                  ]},
                {name:'入户门',question:[
                  {name:'sdf',zimu:'RM'},{name:'sefc',zimu:'RM'},{name:'sfd',zimu:'RM'}
                ]},
                {name:'地面',question:[
                  {name:'厨房',zimu:'DM'},{name:'客厅',zimu:'DM'}
                ]},
                {name:'墙面',question:[
                  {name:'墙面开裂',zimu:'QM'},{name:'墙面空鼓',zimu:'QM'}
                ]}
                ]
              $scope.select = function(num){
                $scope.currentQ = num
                // mdPanelRef.close();
                // mdPanelRef.destroy();
              }
              $scope.check = function(q){
                scope.question=q
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
