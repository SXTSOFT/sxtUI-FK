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
      //templateUrl:'app/main/xhsc/directive/mydialog.html',
      scope:{
        dialogShow:'=',
        dialogData:'=',
        dialogSure:'@',
        dialogMsg:'@'
      },
      template:'<div class="my-dialog-mask">\
      <div class="my-dialog"><div class="dialog-top">\
      <p>{{dialogMsg}}</p>\
    <md-button flex style="width:100%;" ng-click="submit()">{{dialogSure}}</md-button>\
    </div><div class="dialog-bottom"><md-button flex style="width:100%;" ng-click="cancel()">取消</md-button></div></div></div>',
      link:link
    }
    function link(scope,element,attr,ctrl){
      //console.log(element)
      $(element).appendTo('body');
      //$('.my-dialog-mask').css('display','block');
     // $('.my-dialog-mask').fadeIn(2000);
      $('.my-dialog-mask',element).fadeOut();
      scope.$watch('dialogShow',function(){
        if(scope.dialogShow){
          $('.my-dialog-mask',element).fadeIn();
        }
      })
      scope.$watch('dialogData',function(){
        if(!scope.dialogData) return;
        //$('.my-dialog-mask').css('display','block');
        //$('.my-dialog-mask').fadeIn();

        if(!scope.dialogMsg){
          scope.dialogMsg = scope.dialogData.name + ',' + scope.dialogData.acceptanceItemName + '工序已完成，请监理验收';
        }
      })
      scope.cancel= function(){
        //$('.my-dialog-mask').css('display','none');
        scope.dialogShow = false;
        $('.my-dialog-mask',element).fadeOut();
      }
      scope.submit = function(){
        scope.dialogShow = false;
        console.log(scope.dialogData)
        var params ={
          acceptancetemID:scope.dialogData.acceptanceItemID,
          areaID:scope.dialogData.regionId
        }
        $('.my-dialog-mask',element).fadeOut();
        if(scope.dialogSure == '报检'){
          remote.Procedure.postInspection(scope.dialogData.acceptanceItemID,scope.dialogData.regionId).then(function(result){
            //console.log('a')
            $timeout(function(){
              utils.alert('报检成功');
            },200);
          })
          $timeout(function(){
            $state.go('app.xhsc.gx.gxtest',{acceptanceItemID:scope.dialogData.acceptanceItemID,acceptanceItemName:scope.dialogData.acceptanceItemName,name:scope.dialogData.name,regionId:scope.dialogData.regionId,projectId:scope.dialogData.projectId,areaId:scope.dialogData.areaId});
          },100)
        }

      }
      scope.$on('$destroy', function () {
        $(element).remove()
      });
    }
  }
})();
