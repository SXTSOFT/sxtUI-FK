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
  function scPiclstController($scope,$q,remote,$state,$timeout,$mdBottomSheet,utils){
    var vm = this;
    var  arr=[
      remote.Project.GetMeasureItemInfoByAreaID(),
      remote.PQMeasureStandard.GetProjectDrawing()
    ];
    vm.searchText="";
    vm.selectedItem=null;

    $q.all(arr).then(function(res){
      vm.scItems=res[0]? res[0].data:[];
      var  draws=res[1]? res[1].data:[];
      function init(o,draws){
        o.pics=[];
        draws.forEach(function(k){
          if (k.Type== o.MeasurePictureType){
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
        });
        o.dynamicItems=new DynamicItems(o.pics);
      }
      vm.scItems.forEach(function(o){
          init(o,draws);
          o.querySearch=function(text){
            var k=[];
            o.pics.forEach(function(n){
              if (text&&n.DrawingName.indexOf(text)>-1){
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
          var t=""
          item.indexs.forEach(function(k){
            r.data.forEach(function(m){
               if (m.AcceptanceIndexID== k.AcceptanceIndexID){
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
        AcceptanceIndexID:AcceptanceIndexID
      })
    }

    vm.click=function (item,evt) {
      evt.stopPropagation();
      if (item.standar=='completed'){
        return;
      }
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
          //   {
          //   title: '删 除',
          //   action: function (evt) {
          //     utils.confirm('删除图纸所有的点位?', evt, '', '').then(function () {
          //       remote.PQMeasureStandard.delectScStandar(item.AcceptanceIndexID,item.DrawingID).then(function(){
          //         utils.alert("删除成功!");
          //       });
          //     });
          //     $mdBottomSheet.hide();
          //     evt.stopPropagation();
          //   }
          // },
            {
            title: '取 消',
            action: function () {
              $mdBottomSheet.hide();
            }
          }]
        }
      });

    }
    function DynamicItems(source) {
      /**
       * @type {!Object<?Array>} Data pages, keyed by page number (0-index).
       */
      this.loadedPages = {};

      /** @type {number} Total number of items. */
      this.numItems = 0;

      /** @const {number} Number of items to fetch per request. */
      this.PAGE_SIZE = 5;

      this.fetchNumItems_();

      this.source=angular.isArray(source)?source:[];
    };
    // Required.
    DynamicItems.prototype.getItemAtIndex = function (index) {
      var pageNumber = Math.floor(index / this.PAGE_SIZE);
      var page = this.loadedPages[pageNumber];

      if (page) {
        return page[index % this.PAGE_SIZE];
      } else if (page !== null) {
        this.fetchPage_(pageNumber);
      }
    };
    // Required.
    DynamicItems.prototype.getLength = function () {
      return this.numItems;
    };

    DynamicItems.prototype.fetchPage_ = function (pageNumber) {
      // Set the page to null so we know it is already being fetched.
      this.loadedPages[pageNumber] = null;

      // For demo purposes, we simulate loading more items with a timed
      // promise. In real code, this function would likely contain an
      // $http request.
      $timeout(angular.noop, 0).then(angular.bind(this, function () {
        this.loadedPages[pageNumber] = [];
        var pageOffset = pageNumber * this.PAGE_SIZE;
        for (var i = pageOffset; i < pageOffset + this.PAGE_SIZE; i++) {
          if (this.source[i]) {
            this.loadedPages[pageNumber].push(this.source[i]);
          }
        }
      }));
    };

    DynamicItems.prototype.fetchNumItems_ = function () {
      $timeout(angular.noop, 0).then(angular.bind(this, function () {
        this.numItems = this.source.length;
      }));
    };


  }
})();
