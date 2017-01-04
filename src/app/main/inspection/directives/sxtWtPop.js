/**
 * Created by emma on 2016/11/15.
 */
(function(){
  'use strict';

  angular
    .module('app.inspection')
    .directive('sxtWtPop',sxtWtPop);

  /**@ngInject*/
  function sxtWtPop(xhUtils,$mdPanel,$state,api,auth){
    return {
      scope:{
        show:'=',
        question:'@',
        publicquestion:'@',
        roomid:'@',
        username:'@'
      },
      templateUrl:'app/main/inspection/directives/sxt-wt-pop.html',
      link:link
    }
    function link(scope,element,attr,ctrl){
2
      //$(element).appendTo('#content');
      scope.photos = [{url:''},
        {url:'app/main/szgc/images/1.jpg'},
        {url:'app/main/szgc/images/1.jpg'},
        {url:'app/main/szgc/images/1.jpg'},
        {url:'app/main/szgc/images/1.jpg'},
        {url:'app/main/szgc/images/1.jpg'},
        {url:'app/main/szgc/images/1.jpg'},        {url:'app/main/szgc/images/1.jpg'}
        // {url:'app/main/szgc/images/bg_home.png'}
        ]

      scope.remove = function ($event,item) {
        scope.photos.splice(item,1);
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
        scope.question=scope.publicquestion;
        scope.issues='';
      }

      scope.submit = function () {
        var question = element.find('.question').text()
        var description = scope.description
        var  issues=scope.issues;
        var  room_id=scope.roomid;
        var usernamm =scope.username;
        scope.$emit('submit',{
          question:question,
          description: description
        })



        scope.data= {
          room_id:room_id,
          issues:issues,
          contact_name: usernamm,
          contact_phone: "",
          caller_name: usernamm,
          caller_phone: "",
          reservation_date_begin: new Date(),
          reservation_date_end: new Date(),
          description: description,
          pictures:''
        }


        api.inspection.estate.insertrepair_tasks(scope.data).then(function (r) {
        });
        scope.show = false
      }
      scope.parm={
        type:'delivery',
        parent_id:'',
        enabled:true,
        page_size:10,
        page_number:1
      }
      scope.currentQ = 0;
      api.inspection.estate.issues_tree(scope.parm).then(function (r) {
        
        scope.options=r.data.data;
      });
      scope.chooseQues = function(){
        //$state.go('app.inspection.check.cjwt')

          var position = $mdPanel.newPanelPosition()
            .relativeTo('md-toolbar')
            .addPanelPosition($mdPanel.xPosition.ALIGN_START, $mdPanel.yPosition.BELOW)
            .bottom(0)
            .right(0)

          $mdPanel.open({
            controller: ['$scope','mdPanelRef','api','$timeout',function ($scope,mdPanelRef,api,$timeout) {
              // scope.publicquestion='';
              $scope.firstSelect = function(num){
                $scope.firstCurrent = num
                // mdPanelRef.close();
                // mdPanelRef.destroy();
              }
              $scope.secondSelect = function(num){
                $scope.secondCurrent = num
              }
              $scope.check = function(title,id){
                scope.question=title;
                scope.issues=id;
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
            controllerAs:'vm',
            locals:{
              options:scope.options,
            },
            clickOutsideToClose: true,
            escapeToClose: true,
            focusOnOpen: true,
            attachTo:angular.element('body')
          });
      }
    }
  }
})();
