/**
 * Created by lss on 2016/10/29.
 */
/**
 * Created by lss on 2016/10/20.
 */
/**
 * Created by emma on 2016/6/12.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('scPiclstController',scPiclstController);

  /**@ngInject*/
  function scPiclstController($scope,$q,remote,$stateParams,$state,$timeout,$mdBottomSheet,utils){
    var vm = this;
    var  arr=[
      remote.Project.GetMeasureItemInfoByAreaID(),
      remote.PQMeasureStandard.GetProjectDrawing($stateParams.projectID)
    ];
    vm.searchText="";
    vm.selectedItem=null;

    $q.all(arr).then(function(res){
      vm.scItems=res[0]? res[0].data:[];
      var  draws=res[1]? res[1].data:[];
      function init(o,draws){
        o.pics=[];

        function build(o,k) {
          var pic={
            DrawingID: k.DrawingID,
            AcceptanceItemID: o.AcceptanceItemID,
            DrawingName: k.DrawingName
          }
          pic.indexs=[];
          o.pics.push(pic);
          o.MeasureIndexList.forEach(function(n){
            pic.indexs.push({
              AcceptanceIndexID: n.AcceptanceIndexID,
              AcceptanceItemID: o.AcceptanceItemID,
              DrawingID:k.DrawingID,
              IndexName: n.IndexName
            });
          });
        }

        draws.forEach(function(k){
          if (k.Type== o.MeasurePictureType){
            build(o,k)
          }else {
            var split=o.SplitRule;
            var apply=[];
            if (split){
              apply=split.split(",");
            }
            if (k.Type=-3&&apply.find(function (o) {
                return o=="16"||o==16;
              })){
              build(o,k)
            }
          }
        });
      }
      vm.scItems.forEach(function(o){
          init(o,draws);
          o.querySearch=function(text){
            var k=[];
            o.pics.forEach(function(n){
              var py=window.Pinyin.getPinyinArrayFirst(n.DrawingName)
              py=py.join("");
              if (text&&n.DrawingName.indexOf(text)>-1||py.toLowerCase().indexOf(text.toLowerCase())>-1){
                k.push({
                  DrawingID: n.DrawingID,
                  DrawingName: n.DrawingName
                });
              }
            })
            return k;
          }
          o.changeItem=function(selectedItem){
            if (selectedItem){
              var p= draws.find(function(u){
                return u.DrawingID==selectedItem.DrawingID
              })
              if (p){
                init(o,[p]);
              }
            }else {
              init(o,draws);
            }
          }
        });
      vm.show=true;
    });

    vm.stretch = function (item) {
      item.stretch = !item.stretch;
      if (item.stretch){
        remote.PQMeasureStandard.messageList(item.DrawingID,item.AcceptanceItemID).then(function(r){
          item.indexs.forEach(function(k){
            r.data.forEach(function(m){
               if (m.AcceptanceIndexID== k.AcceptanceIndexID&&item.DrawingID==m.DrawingID){
                 k.standar=k.standar=="completed"?k.standar:"no";
                 if (m.Status==1){
                   k.standar="completed"
                 }
               }
            });
          })
        })
      }
    }
    vm.go=function(AcceptanceItemID,drawingID,AcceptanceIndexID){
      $state.go("app.xhsc.sc_standar",{
        AcceptanceItemID:AcceptanceItemID,
        DrawingID:drawingID,
        AcceptanceIndexID:AcceptanceIndexID,
        projectID:$stateParams.projectID
      })
    }

    vm.click=function (item,evt) {
      evt.stopPropagation();
      // if (item.standar=='completed'){
      //   return;
      // }
      vm.go(item.AcceptanceItemID,item.DrawingID,item.AcceptanceIndexID);
    }
    vm.action = function (item, evt) {
      evt.stopPropagation();
      if (item.standar=="completed"){
        return;
      }
      $mdBottomSheet.show({
        templateUrl: 'app/main/xhsc/procedure/action.html',
        controller: function ($scope) {
          $scope.btns = [{
            title: '标准化',
            action: function () {
              $mdBottomSheet.hide();
              vm.go(item.AcceptanceItemID,item.DrawingID,item.AcceptanceIndexID);
            }
          },
            {
            title: '取 消',
            action: function () {
              $mdBottomSheet.hide();
            }
          }]
        }
      });
    }
  }
})();
