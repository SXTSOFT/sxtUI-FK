/**
 * Created by emma on 2016/7/22.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .directive('sxtQuesDetailUp',sxtQuesDetailUp);

  /**@ngInject*/
  function sxtQuesDetailUp($q,remote){
    return {
      scope:{
        upShow:'=',
        selectedArea:'=',
        currentRectificationid:'='
      },
      templateUrl:'app/main/xhsc/directive/listUp.html',
      link:link
    }

    function link(scope,element,attr,ctrl){
      $(element).appendTo('body');
      var load = function(){
        if(!scope.currentRectificationid) return;
        if(!scope.selectedArea) return;
        var promises=[
          remote.Procedure.getZGReginQues(scope.selectedArea,scope.currentRectificationid)/*,
           remote.Procedure.getZGReginQuesPoint(vm.regionSelect.AreaID,RectificationID)*/
        ]
        scope.ques=[];
        $q.all(promises).then(function(res){
          scope.items = res.data;
          res[0].data.forEach(function (item) {
            var fd = scope.ques.find(function (it) {
              return it.IndexPointID==item.IndexPointID;
            });
            if(!fd){
              fd = item;
              scope.ques.push(fd);
              fd.Points = 1;
            }
            else{
              fd.Points++;
            }
          })
          console.log(scope.ques)
        })
      }
      scope.$watch('selectedArea',function(){
        load();
      })
      scope.$watch('currentRectificationid',function(){
        load();
      })
      $('body').on('click',function(e){
        var evt = window.event ? window.event: e,
          target = evt.srcElement || evt.target;
        if($('.slideTop').hasClass('slidedown')){
          if(target.id == 'quesUp'){
            scope.upShow = false;
            scope.$apply()
          }
        }

      })
      scope.submit = function(){
        scope.upShow = false;
      }
      scope.$on('$destroy',function(){
        $(element).remove();
      })
    }

  }
})();
