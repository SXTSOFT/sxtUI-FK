/**
 * Created by jiuyuong on 2016/4/11.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .config(config);

  /** @ngInject */
  function config(apiProvider){
    var $http = apiProvider.$http,
      $q = apiProvider.$q;

    apiProvider.register('xhsc',{
	    /**
       * 实测实量项
       */
      Measure:{
        /**
         * 获取本人所有实测项目(并非自定义的，而是系统基础项)
         *
         * @param    {string}  areaID     分期
         * */
        query:function(areaID) {
          return $http.get($http.url('/Api/MeasureInfo/MeasureQuery', {areaID: areaID}));
          /*return query (array ({
           AcceptanceItemID: 'string1',
           MeasureItemName: '测量项{0}',
           SpecialtyID: 'id1;id2',
           SpecialtyName: '专业类型;专业类型',
           /!**
           * 1 、项目
           * 2、 区域
           * 4、 楼项
           * 8、 楼层
           * 16、 房间
           * *!/
           RegionType: 1 | 2 | 4 | 8 | 16
           }
           ))*/
        },
        MeasureIndex:{
          /**
           * 获取实测项所有指标
           *
           * @param  {string} acceptanceItemID 实测项ID
           * */
          query:function(acceptanceItemID) {
            return $http.get($http.url('/Api/MeasureInfo/GetMeasureIndex', {acceptanceItemID: acceptanceItemID}));

          }
        }
      },
      /**
       * 项目
       * */
      Project:{
        query:function(){
          return $http.get($http.url('/Api/ProjectInfoApi/GetProjectList'));
        },
        /**
         * 分期
         * */
        Area:{
          /**
           * 获取本人所有相关分期
           * */
          query:function(){
            return $http.get($http.url('/Api/ProjectInfoApi/GetProjectAreaList'));
          },
          /**
           * 获取分期所楼栋、层、房间数据
           * @param    {string}  areaID     分期ID
           * */
          queryRegion:function(areaID){
            return $http.get($http.url('/api/ProjectInfoApi/GetRegionTreeByRegionID',{AreaID:areaID}));
          }
        },

        /**
         * 获取<tt>regionID</tt>户型图
         * @param {string} regionID the区域ID
         * @returns {object}
         * */
        getHouseDrawing:function(regionID){
          return $http.get($http.url('/Api/MeasurePointApi/GetHouseDrawing',{regionID:regionID}));
        },
        /**
         * 获取楼层图
         * @param {string} regionID　区域ID
         * @returns {object}
         * */
        getFloorDrawing:function(regionID){
          return $http.get($http.url('/Api/MeasurePointApi/getFloorDrawing',{regionID:regionID}));
        },
        /**
         * 更新户型图
         * @param {string} regionID 户型ID
         * @param {object} draw 户型描述
         *        {
         *          DrawingID:'',//使用图片
         *          Geometry:'' //几何信息
         *        }
         * @returns {*}
         * **/
        updateHouseDrawing:function(regionID,draw){
          return $http.post('/Api/MeasureInfo/ModifyHouseType',{regionID:regionID,draw:draw});
          /**return post(regionID,draw);**/
        }
      },

      /**
       * 验收状态
       * */
      MeasureCheckBatch:{
        /**
         * @param    {string}  acceptanceItemID     实测项ID/工序ID
         * @param    {string}  areaID  分期ID
         * @param    {int}     acceptanceItemIDType  返回状态类型（目前仅为1）
         *           1   --实测项
         *           2   --工序
         *           3   --整改
         * */
        getStatus:function(acceptanceItemID, areaID, acceptanceItemIDType) {
          return $http.get($http.url('/Api/MeasureInfo/getStatus', {
            acceptanceItemID: acceptanceItemID,
            areaID: areaID,
            acceptanceItemIDType: acceptanceItemIDType
          }));

          /** return query(array({
            RegionID:'string{0}',
            RegionType:1,
            AcceptanceItemID:'acceptanceItemID{0}',//自定义后的实测项目ID
            /**
             * 0：未验收
             * 1：进行中
             * 2：已验收
             *
            Status:Math.floor(Math.random()*2)
          }))
           }**/
        }
      },

	    /**
       * 质量管理
       */
      ProjectQuality:{
		    /**
         * 检查点
         *
         */
        MeasurePoint:{
          /**
           * 更新或添加测量标注点
           * @param {Array} points
           *        [{
           *        type:'Feature',//固定为Feature
           *        geometry:{
           *          type:'stamp' // 固定为stamp
           *          coordinates:[0.21,0.20003] //图形位置信息
           *        }，
           *        options:{       //几何图形配置项，属性不固定，不同的geometry.type不尽相同
           *          color:'red'
           *        },
           *        properties:{
           *          $id:'guid', //唯一ID
           *          $groupId:'guid' //所在属组（可以不用，但请保存为UI使用）
           *        }
           *      }]
           * **/
          create:function(points){
            return $http.post('/Api/MeasurePointApi/CreatePoint', points)
            /**return post(points);**/
          },
          /**
           * 删除点
           *
           * @param {string} measurePointID 唯一ID
           * */
          delete:function(measurePointID) {
            return $http.delete($http.url('/Api/MeasurePointApi/DeletePoint', {measurePointID: measurePointID}))
          },

          /**
           * 获取点
           * @param {string} acceptanceItemID 实测项Id
           * @param {string} checkRegionID 区域ID
           * @param {int} flags 0或空时为返回当前层，-1返回上一层同户型
           *
           * @returns {object}
           *          {
           *            type:'FeatureCollection',固定为FeatureCollection
           *            features:[{
           *              type:'Feature',//固定为Feature
           *              geometry:{
           *                type:'lineGroup' // lineGroup 测量组 或　areaGroup　区域组 或　stamp　测量点，以后会更多类型
           *                coordinates:[] //图形位置信息
           *              }，
           *              options:{       //几何图形配置项，属性不固定，不同的geometry.type不尽相同
           *                color:'red'
           *              },
           *              properties:{
           *                $id:'guid', //唯一ID
           *                $groupId:'guid' //所在属组（可以不用，但请保存为UI使用）
           *               }
           *            }]
           *          }
           *
           * */
          query:function(acceptanceItemID,checkRegionID,regionType,flags){
            return $http.get($http.url('/Api/MeasurePointApi/GetMeasurePoint', {acceptanceItemID: acceptanceItemID,checkRegionID:checkRegionID,regionType:regionType,flags:flags}))

           /** return get({
              type: 'FeatureCollection',//固定为FeatureCollection
              features: [{
                type: 'Feature',//固定为Feature
                geometry: {
                  type: 'lineGroup', // lineGroup 测量组 或　areaGroup　区域组 或　stamp　测量点，以后会更多类型
                  coordinates: [] //图形位置信息
                },
                options: {       //几何图形配置项，属性不固定，不同的geometry.type不尽相同
                  color: 'red'
                },
                properties:{
                  $id:'guid', //唯一ID
                  $groupId:'guid' //所在属组（可以不用，但请保存为UI使用）
                }
              }]
            });**/
          },

          submit:function(values){
            return $http.post('/Api/MeasurePointApi/MeasureSubmit',values)
          }
        },
		    /***
         * 检查值
         */
        MeasureValue: {
          /**
           * 添加或更新测试值
           * @param {Array} values 测试值
           *        [{
           *          AcceptanceItemID:"",//实测项ID 必填
           *          CheckRegionID:'',//测量区域Id 必填
           *          RegionType:'',//区域类型 必填
           *          ParentMeasurePointID:'',//所在测量组ID，如果没有为null，对应$groupId
           *          MeasurePointID:'',//测量点ID
           *          AcceptanceIndexID:'',//指标ID
           *          MeasureValue:''//测量值
           *          DesignValue:''//设计值
           *          CalculatedValue:''//计算值
           *          Remark:'',//备注
           *          ExtendedField1:'',//扩展字段1
           *          ExtendedField2:'',//扩展字段2
           *          ExtendedField3:''//扩展字段3
           *        }]
           * */
          create: function (values) {
            return $http.post('/Api/MeasureValueApi/CreateMeasureValue', values);
          },

          /**
           * 删除测试值
           * @param {string} acceptanceItemID 测量值ID
           * */
          delete:function(measureValueId)
          {
            return $http.post('/Api/MeasureValueApi/DeleteMeasureValue', measureValueId);
          }
          /**
           * 获取检查点值
           * @param {string} acceptanceItemID 实测项Id
           * @param {string} checkRegionID 区域ID
           * */
          query: function (acceptanceItemID, checkRegionID, flags) {
            return $http.get($http.url('/Api/MeasureValueApi/GetMeasureValues', {
              acceptanceItemID: acceptanceItemID,
              checkRegionID: checkRegionID
            }));
        },
          /**
           * 删除点
           *
           * @param {string} measurePointID 唯一ID
           * */
          delete:function(measureValueId) {
            return $http.delete($http.url('/Api/MeasureValueApi/DeleteMeasureValue', {measureValueId: measureValueId}))
          }
        }
      }
    });

    function query(data){
      return $q(function(resolve){
        resolve({
          data: {
            rows: data,
            total: 100
          }
        });
      })
    }

    function array(obj){
      var a=[];
      for(var i=0;i<10;i++){
        var o={};
        for(var k in obj){
          var v = obj[k];
          if(typeof(v)==='string'){
              v = v.replace('{0}',(i+1));
          }
          o[k] = v;
        }
        a.push(o);
      }
      return a;
    }


    function get(data){
      return $q(function(resolve){
        resolve({data:data});
      })
    }

    function post(data){
      return $q(function(resolve){
        resolve({
          data:{
          code:1
         }
        });
      })
    }
  }
})();
