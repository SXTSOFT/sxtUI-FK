/**
 * Created by shaoshun on 2017/3/1.
 */
/**
 * Created by shaoshun on 2017/3/1.
 */
/**
 * Created by lss on 2016/10/30.
 */
/**
 * Created by lss on 2016/7/25.
 */
/**
 * Created by jiuyuong on 2016/4/13.
 */
(function(){
  'use strict';
  angular
    .module('app.xhsc')
    .directive('buildingSelet',buildingSelet);
  /** @ngInject */
  function buildingSelet(xhscService){
    return {
      restrict:'E',
      scope:{
        selected:'='
      },
      templateUrl:'app/main/xhsc/directive/gx/building-select.html',
      link:link
    }

    function link(scope,element,attr,ctrl){
      scope.zk=function (item) {
        item.hide=!item.hide;
      }
      xhscService.getRegionTreeOffline("", 15,1,"scRigthRegions").then(function (r) {
        scope.data=r;
        scope.show=true;
      }).catch(function () {
        vm.show=true;
      });

      function setDisable(item) {
        scope.data.forEach(function (m) {
          m.Children.forEach(function (r) {
            if (r.RegionID==item.ParentID){
              r.Children.forEach(function (k) {
                if (!item.checked){
                  k.disable=false;
                }
              })
            }else {
              r.Children.forEach(function (k) {
                if(item.checked){
                  k.disable=true;
                }
              })
            }
          })
        });
      }



      scope.selected=[];
      scope.checked=function (item) {
        setDisable(item)
        if(!item.checked){
          if (!scope.selected.find(function (o) {
              return o.RegionID==item.RegionID;
            })){
            scope.selected.push(item);
          }
        }else {
          var obj= scope.selected.find(function (o) {
            return o.RegionID==item.RegionID;
          })
          if (obj!=null){
            var  index=scope.selected.indexOf(obj);
            scope.selected.splice (index,1);
          }
        }
      }
    }
  }
})();
