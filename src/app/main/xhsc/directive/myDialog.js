/**
 * Created by emma on 2016/6/7.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .directive('myDialog',myDialogDirective);

  /**@ngInject*/
  function myDialogDirective($state,$timeout,remote,utils){
    return {
      scope:{
        dialogShow:'=',
        dialogData:'=',
        dialogSure:'@',
        dialogMsg:'@',
        callBack:"&"
      },
      templateUrl:"app/main/xhsc/directive/mydialog.html",
      link:link,
      controller:function($scope){
        $scope.description="";
        $scope. percentage="";
      }
    }
    function link(scope,element,attr,ctrl){
      $(element).appendTo('body');
      $('.my-dialog-mask',element).fadeOut();
      scope.$watch('dialogShow',function(){
        if(scope.dialogShow){
          $('.my-dialog-mask',element).fadeIn();
          scope.description="";
          scope. percentage="";
        }
      })
      scope.$watch('dialogData',function(){
        if(!scope.dialogData) return;
        var msg='';
        scope.dialogData.Rows.forEach(function(t){
          msg += t.projectTree+',';
        })
        scope.dialogMsg = msg + scope.dialogData.acceptanceItemName+ '工序已自检完毕，请监理验收';
      })
      scope.cancel= function(){
        scope.dialogShow = false;
        $('.my-dialog-mask',element).fadeOut();
      }
      scope.submit = function(evt){
        scope.dialogShow = false;
        scope.areaIds=[];
        scope.dialogData.Rows.forEach(function(t){
          scope.areaIds.push( {
            RegionID:t.RegionID,
            description:scope.description,
            percentage:scope.percentage
          });
        })
        var params ={
          acceptancetemID:scope.dialogData.acceptanceItemID,
          areaID:scope.areaIds,
          description:scope.description,
          percentage:scope.percentage
        }
        //{AcceptanceItemID:AcceptanceItemID,AreaID:AreaID, description:description,percentage:percentage}
        $('.my-dialog-mask',element).fadeOut();
        if(scope.dialogSure == '报检'){
          remote.Procedure.postInspection(params).then(function(result){
            $timeout(function(){
              utils.alert('报检成功',evt,scope.callBack);
            },200);
          })
        }
      }
      scope.$on('$destroy', function () {
        $(element).remove()
      });
    }
  }
})();
