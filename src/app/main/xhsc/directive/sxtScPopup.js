/**
 * Created by jiuyuong on 2016/4/13.
 */
(function(){
  'use strict';
  angular
    .module('app.xhsc')
    .directive('sxtScPopup',sxtScPopup);
  /** @ngInject */
  function sxtScPopup(mapPopupSerivce,$timeout,sxt,xhUtils){
    return {
      restrict:'E',
      scope:{
        readonly:'='
      },
      templateUrl:'app/main/xhsc/directive/sxtScPopup.html',
      link:link
    }

    function link(scope,element,attr,ctrl){
      scope.ct ={
      };
      //实测值
      scope.$watch('value',function(){
        console.log('value',scope.value);
        //console.log('scope',scope)
        /**
         * 添加测试值
         * @param {Array} values 测试值
         *        {
           *          ParentMeasurePointID:'',//所在测量组ID，如果没有为null
           *          MeasurePointID:'',
           *          AcceptanceIndexID:''
           *          MeasureValue:''//测量值
           *          DesignValue:''//设计值
           *          CalculatedValue:''//计算值
           *          Remark:'',//备注
           *          ExtendedField1:'',//扩展字段1
           *          ExtendedField2:'',//扩展字段2
           *          ExtendedField3:''//扩展字段3
           *        }
         * */
      });
      //指标
      scope.$watch('MeasureIndex',function(){
        console.log('MeasureIndex',scope.MeasureIndex);
        /**
	       * {
              AcceptanceIndexID:'',
              AcceptanceItemID:'',
              ParentAcceptanceIndexID:'',
              IndexName:'指标名称{0}',//指标名称
        **
               * Single：各自测量，SelectMaterial：选择材质测量）
               *
          IndexType:'Single',
          *
           * 1 原位
           * 2 非原位
           *
            MeasureMethod:'1',//实测方法
          *
           * 1 测量值
           * 2 与设计值对比
           * 3 测量组对比
           * 4 区域测量点对比
           * 5 上下楼层对比
            PassYieldComputeMode:'1',//计算合格率方式
          *
           * 合并标识
           * 0：不合并
           * 1：合并
           *
            GroupSign:1,//合并标识
            Weight:9.1,//权重
            SinglePassYield:true,//各自合格率
            SummaryPassYield:true,//汇总合格率
            children:array({
            AcceptanceIndexID:'',
            AcceptanceItemID:'',
            ParentAcceptanceIndexID:'',
            IndexName:'',//指标名称
            IndexType:'Single',
            MeasureMethod:'',//实测方法
            PassYieldComputeMode:'',//计算合格率方式
            GroupSign:1,//合并标识
            Weight:9.1,//权重
            SinglePassYield:true,//各自合格率
            SummaryPassYield:true//汇总合格率
          })
        }
         */

      });
      scope.updateValue = function() {
        //var context = scope.context;

        //if (!context.featureGroup.options.onUpdateData || context.featureGroup.options.onUpdateData (context,scope.data.updates,scope) !== false) {
          scope.cancelEdit (true);
        //}
      };
      scope.apply = function() {
        scope.isSaveData = null;
        var context = scope.context,p = context.layer.getValue();
        var singleEdit=[],mutiEdit=[],floorEdit=[],sjzEdit=[],materEidt=[],group;
        scope.data.updates = [];
        scope.data.measureIndexes.forEach(function(m){
          var o={
            m:m,
            v:scope.data.values.find(function(o){
              return o.MeasurePointID == p.$id
              && o.AcceptanceIndexID == m.AcceptanceIndexID
            })
          };
          scope.data.updates.push(o);
          if(m.IndexType == 'SelectMaterial'){

          }else if(context.layer instanceof L.LineGroup || context.layer instanceof L.AreaGroup){
            //o.v.children = [];
            group = o;
            o.v.children = xhUtils.findAll(scope.data.values, function (v) {
              return v.ParentMeasureValueID == o.v._id;
            });
          }
          else {
            switch (m.QSKey) {
              case '1':
              case '3':
              case '4':
                mutiEdit.push(o);
                break;
              case '2':
                sjzEdit.push(o);
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
        scope.edit ={
          singleEdit:singleEdit,
          mutiEdit:mutiEdit,
          floorEdit:floorEdit,
          sjzEdit:sjzEdit,
          materEidt:materEidt,
          group:group
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
