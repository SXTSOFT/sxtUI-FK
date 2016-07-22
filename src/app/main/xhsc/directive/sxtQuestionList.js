/**
 * Created by emma on 2016/7/22.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .directive('sxtQuestionList',sxtQuestionList);

  /**@ngInject*/
  function sxtQuestionList(remote){
    return {
      scope:{
        listShow:'=',
        listInspectid:'=',
        procedure:'=',
        regionId:'='
      },
      templateUrl:'app/main/xhsc/directive/qlistUp.html',
      link:link
    }

    function link(scope,element,attr,ctrl){
      $(element).appendTo('body');
      var load = function(){
        if(!scope.regionId) return;
        if(!scope.listInspectid) return;
        remote.Procedure.InspectionCheckpoint.query(scope.procedure,scope.regionId,scope.listInspectid).then(function (r) {
          scope.pList = [];
          scope.templist = [];
          r.data.forEach(function(t){
            if(t.InspectionID == scope.listInspectid){
              scope.templist.push(t);
            }
          })
          scope.templist.forEach(function(_t){
            var find = scope.pList.find(function(p){
              return p.id == _t.IndexPointID;
            })
            if(!find){
              var f = {
                id:_t.IndexPointID,
                ProblemSortName:_t.ProblemSortName,
                ProblemDescription: _t.IndexPointID?_t.ProblemDescription:'合格',
                rows:[]
              };
              f.rows.push(_t)
              scope.pList.push(f)
            }else{
              find.rows.push(_t)
            }
          })
          console.log('find',scope.pList)
        });
      }
      scope.$watch('regionId',function(){
        load();
      })
      scope.$watch('listInspectid',function(){
        load();
      })
      $('body').on('click',function(e){
        var evt = window.event ? window.event: e,
          target = evt.srcElement || evt.target;
        if($('.slideTop').hasClass('slidedown')){
          if(target.id == 'qlistUp'){
            scope.listShow = false;
            scope.$apply()
          }
        }

      })
      scope.submit = function(){
        scope.listShow = false;
      }
      scope.$on('$destroy',function(){
        $(element).remove();
      })
    }

  }
})();
