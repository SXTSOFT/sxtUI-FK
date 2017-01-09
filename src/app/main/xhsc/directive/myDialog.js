/**
 * Created by emma on 2016/6/7.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .directive('myDialog',myDialogDirective);

  /**@ngInject*/
  function myDialogDirective($state,$timeout,remote,utils,auth,sxt,$mdDialog,api){
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
      }
    }
    function link(scope,element,attr,ctrl){
      $(element).appendTo('body');
      $('.my-dialog-mask',element).fadeOut();
      scope.$watch('dialogShow',function(){
        if(scope.dialogShow){
          $('.my-dialog-mask',element).fadeIn();
          scope.description="";
        }
        if(scope.dialogSure != '报验'){
          scope.logOut= true;
        }
      })
      scope.$watch('dialogData',function(){
        if(!scope.dialogData) return;
        var msg='';
        scope.max=0;
        scope.dialogData.Rows.forEach(function(t){
          msg += t.projectTree+'，';
          var percent=0;
          t.inspectionRows.forEach(function (s) {
            percent+=s.Percentage;
          })
          percent=100-percent;
          if (scope.max<percent){
            scope.max=percent;
          }
          $timeout(function () {
            scope.percentage=scope.max;
          },300)
        })
        scope.dialogMsg = msg + scope.dialogData.acceptanceItemName+ '工序已自检完毕，请监理验收';
      })
      scope.cancel= function(){
        scope.dialogShow = false;
        $('.my-dialog-mask',element).fadeOut();
      }
      scope.submit = function(evt){
        var parentEl = angular.element(document.body);
        $mdDialog.show({
          parent: parentEl,
          targetEvent: evt,
          template:'<md-dialog   ng-cloak><md-dialog-content> <md-progress-circular md-mode="indeterminate"></md-progress-circular> 正在提交数据，请稍候……</md-dialog-content></md-dialog>',
          controller: DialogController
        });
        function DialogController($scope) {
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
              Percentage:percentage,
              id:sxt.uuid()
            }
            api.setNetwork(0).then(function(){
              remote.Procedure.postInspection(params).then(function(result){
                if (result.data.ErrorCode==0) {
                  $timeout(function () {
                    scope.callBack();
                  },300);
                  $mdDialog.hide();
                }
              }).catch(function(){
                $mdDialog.cancel();
              });
            });
          }else{
            $mdDialog.hide();
          }
        }
      }
      scope.$on('$destroy', function () {
        $(element).remove()
      });
    }
  }
})();
