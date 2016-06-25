/**
 * Created by jiuyuong on 2016/4/13.
 */
(function(){
  'use strict';
  angular
    .module('app.xhsc')
    .directive('sxtScMapPopup',sxtScMapPopup);
  /** @ngInject */
  function sxtScMapPopup(mapPopupSerivce,$timeout){
    return {
      restrict:'E',
      scope:{
        readonly:'='
      },
      templateUrl:'app/main/xhsc/directive/sxtScMapPopup.html',
      link:link
    }

    function link(scope,element,attr,ctrl){
      scope.ct ={
      };
      scope.updateValue = function() {
        var context = scope.context;

        if (!context.featureGroup.options.onUpdateData || context.featureGroup.options.onUpdateData (context) !== false) {
          scope.cancelEdit ();
        }
      };
      scope.apply = function() {
        var context = scope.context;
        scope.PointType = context.layer.toGeoJSON().geometry.type;

        //console.log('PointType',scope.PointType )
        scope.MeasureIndex = context.featureGroup.options.properties;
        scope.value = context.layer.getValue();
        scope.values=null;
        if(scope.PointType=='LineGroup' || scope.PointType=='AreaGroup') {
          var ps = [];
          context.featureGroup.eachLayer(function (layer) {
            if (layer._value && layer._value.$groupId == scope.value.$id) {
              ps.push(layer._value);
            }
            scope.values = ps;
          });
        }
        $timeout(function(){scope.ct.show && scope.ct.show();},300);
        scope.$apply();
      };
      scope.distinct = function(array){
        if(!array || !array.forEach)return;
        var min=100000,max=-100000;
        array.forEach(function(item){
          if(item.MeasureValue) {
            if (item.MeasureValue < min)
              min = item.MeasureValue;
            if (item.MeasureValue > max)
              max = item.MeasureValue;
          }
          else {
            if (item < min)
              min = item;
            if (item > max)
              max = item;
          }
        })
        return max-min;
      }
      scope.distinct2 = function(){
        scope.distinct(Array.prototype.splice.call(arguments));
      }
      scope.removeLayer = function(){
        var layer = scope.context.layer;
        layer._fg.removeLayer(layer);
      };
      scope.cancelEdit = function(){
        var layer = scope.context.layer;
        layer.editing && layer.editing.disable();
      };
      mapPopupSerivce.set('mapPopup',{
        el:element,
        scope:scope
      });
      scope.$on('$destroy',function(){
        mapPopupSerivce.remove('mapPopup');
      })
    }
  }
})();
