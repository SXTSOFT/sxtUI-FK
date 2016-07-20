/**
 * Created by emma on 2016/6/7.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .directive('myDialog',myDialogDirective);

  /**@ngInject*/
  function myDialogDirective($state,$timeout,remote,utils,auth){
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
          scope. percentage=100;
        }
        if(scope.dialogSure != '报验'){
          scope.logOut= true;
        }
      })
      scope.$watch('dialogData',function(){
        if(!scope.dialogData) return;
        var msg='';
        scope.dialogData.Rows.forEach(function(t){
          msg += t.projectTree+'，';
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

        $('.my-dialog-mask',element).fadeOut();
        if(scope.dialogSure == '报验'){
          var percentage= scope.percentage?scope.percentage:100
          scope.dialogData.Rows.forEach(function(t){
            scope.areaIds.push( {
              AreaID:t.RegionID,
              Describe:scope.description,
              Percentage:percentage
            });
          })
          var params ={
            AcceptanceItemID:scope.dialogData.acceptanceItemID,
            AreaList:scope.areaIds,
            Describe:scope.description,
            Percentage:percentage
          }
          remote.Procedure.postInspection(params).then(function(result){
            if (result.data.ErrorCode==0){
              $timeout(function(){
                utils.alert('报验成功',evt,scope.callBack);
              },200);
            }
          })
        }else{
         //auth.logout();
        }
      }
      scope.$on('$destroy', function () {
        $(element).remove()
      });
    }
  }
})();
