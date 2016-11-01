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
    .directive('sxtScPopupNew',sxtScPopupNew);
  /** @ngInject */
  function sxtScPopupNew(mapPopupSerivce,$timeout,sxt,xhUtils,db){
    return {
      restrict:'E',
      scope:{
        readonly:'='
      },
      templateUrl:'app/main/xhsc/directive/sxtScPopupNew.html',
      link:link
    }

    function link(scope,element,attr,ctrl){
      scope.ct ={
      };
      // console.log(scope.readonly);
      scope.updateValue = function() {
        scope.cancelEdit (true);
      };
      scope.apply = function() {
        scope.isSaveData = null;
        var context = scope.context,p = context.layer.getValue();
        var singleEdit=[],mutiEdit=[],floorEdit=[],sjzEdit=[],materEidt=[],group= null,groupEdit=[];
        scope.data.updates = [];
        var ms = [];
        scope.data.measureIndexes&&scope.data.measureIndexes.forEach(function(m){
          if(m.Children && m.Children.length){
            var m0 = m.Children.find(function(m2){
              return m2.QSKey=='2';
            });
            m.Children.forEach(function (it) {
              it.QSKey = m0?'2': m.QSKey;
              ms.push(it);
            });
          }
          else{
            ms.push(m);
          }
        });

        ms.forEach(function (m) {
          var o = {
            m: m,
            v: scope.data.values.find(function (o) {
              return o.MeasurePointID == p.$id
                && o.AcceptanceIndexID == m.AcceptanceIndexID;
            })
          };
          o.v=o.v? o.v:{};
          scope.data.updates.push(o);
          if (m.IndexType == 'SelectMaterial') {

          } else if (context.layer instanceof L.LineGroup || context.layer instanceof L.AreaGroup) {
            //o.v.children = [];
            group = o;
            o.v.children = xhUtils.findAll(scope.data.values, function (v) {
              return v.ParentMeasureValueID == o.v._id;
            });
          }
          else {
            switch (m.QSKey) {
              case '1':
              case '4':
                mutiEdit.push(o);
                break;
              case '2':
                sjzEdit.push(o);
                break;
              case '3':
                groupEdit.push(o);
                break;
              case '5':
                floorEdit.push(o)
                break;
            }
          }
        });
        if (mutiEdit.length == 1) {
          singleEdit = mutiEdit;
          mutiEdit = [];
        }
        console.log("singleEdit",singleEdit);
        scope.edit ={
          plasterDepth:sjzEdit.find(function (item) {
            return !!item.m.plasterDepth
          }),
          singleEdit:singleEdit,
          mutiEdit:mutiEdit,
          floorEdit:floorEdit,
          sjzEdit:sjzEdit,
          materEidt:materEidt,
          group:group,
          groupEdit:groupEdit
        }
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
      scope.getCalculatedValue = function (item) {
        if( (item.v.DesignValue || item.v.DesignValue==0) &&( item.v.MeasureValue||item.v.MeasureValue==0)){
          if(item.m.plasterDepth){
            item.v.CalculatedValue = parseInt(item.v.MeasureValue)+(2*(item.m.plasterDepthMethod=='+'?item.m.plasterDepth:-item.m.plasterDepth)) - item.v.DesignValue;
          }
          else {
            item.v.CalculatedValue = item.v.MeasureValue - item.v.DesignValue;
          }
        }
        else{
          item.v.CalculatedValue = null;
        }
        return item.v.CalculatedValue;
      }
      scope.onMeasureValueChange = function (v,item) {
        if(v.isDesignValueInput)return;
        $timeout(function () {
          if(v && v.MeasureValue){
            var str = v.MeasureValue.toString();
            if(str.length>1) {
              var sv = parseInt(v.MeasureValue);
              if(item.m.plasterDepth){
                sv+=2*(item.m.plasterDepthMethod=='+'?item.m.plasterDepth:-item.m.plasterDepth);
              }
              str = sv.toString();
              var xs = str.substr(str.length - 2, 2),
                n = parseInt(xs),
                l = str.substr(0,str.length-2);
              if(!isNaN(n)){
                if(n<25){
                  v.DesignValue = l+'00';
                }
                else if(n<75){
                  v.DesignValue = l+'50';
                }
                else{
                  v.DesignValue = l.length?(parseInt(l)+1)*100:100;
                }
              }
              else{
                v.DesignValue='';
              }
            }
            else{
              v.DesignValue = 0;
            }
          }
          else{
            v.DesignValue= null;
          }
        },0);

      }
      scope.onDesignValueToggle = function (v,item) {
        v.isDesignValueInput = true;
      }
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
        scope.isSaveData = false;
        var layer = scope.context.layer;
        if(layer  instanceof L.AreaGroup){
          var $id=layer._value.$id;
          if ($id){
            var key,v;
            for (key in  layer._fg._layers){
                if( layer._fg._layers.hasOwnProperty(key)){
                  v= layer._fg._layers[key];
                  if (v._value.$groupId&&v._value.$groupId==$id){
                    layer._fg.removeLayer(v);
                  }
                }
            }
          }
        }
        layer._fg.removeLayer(layer);

      };
      scope.cancelEdit = function(saveData){
        scope.isSaveData = saveData||false;
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
