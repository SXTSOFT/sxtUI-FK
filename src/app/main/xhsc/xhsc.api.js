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
         * 获取本人所有实测项目
         *
         * @param    {string}  areaID     分期ID
         * */
        query:function(areaID) {
          //return  $http.get('api/address',{data:''});
          return query (array ({
              AcceptanceItemID: 'string1',
              MeasureItemName: '测量项名称',
              SpecialtyID: 'id1;id2;id3',
              SpecialtyName: '专业类型;专业类型',
              /**
               * 1 、项目
               * 2、 区域
               * 4、 楼项
               * 8、 楼层
               * 16、 房间
               * */
              RegionType: 2 | 4 | 8 | 16
            }
          ))
        },
        MeasureIndex:{
          /**
           * 获取实测项所有指标
           *
           * @param  {string} acceptanceItemID 实测项ID
           * */
          query:function(acceptanceItemID){
            return query(array({
              AcceptanceIndexID:'',
              AcceptanceItemID:'',
              ParentAcceptanceIndexID:'',
              IndexName:'',//指标名称
              /**
               * Single：各自测量，SelectMaterial：选择材质测量）
               * */
              IndexType:'Single',
              /**
               * 1 原位
               * 2 非原位
               * */
              MeasureMethod:'',//实测方法
              PassYieldComputeMode:'',//计算合格率方式
              /**
               * 合并标识
               * 0：不合并，1：合并
               * */
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
            }))
          }
        }
      },
      /**
       * 项目
       * */
      Project:{
        /**
         * 分期
         * */
        Area:{
          /**
           * 获取本人所有相关分期
           * */
          query:function(){
            return query(array({
              AreaID: 'string',
              ProjectID:'string',
              AreaName:'一期',
              ProjectName:'星河丹堤'
            }));
          },
          /**
           * 获取分期所楼栋、层、房间数据
           * @param    {string}  areaID     分期ID
           * */
          queryRegion:function(areaID){
            return get(array({
              RegionID: 'string',
              RegionName:'{0}栋',
              RegionType: 4,
              ParentRegionID: 'string',//分期ID
              ParentRegionName: '一期',
              FullName: '星河丹堤-一期-1栋',
              children:array(
                {
                  RegionID: 'string',
                  RegionName:'{0}层',
                  RegionType: 8,
                  ParentRegionID: 'string',
                  ParentRegionName: '1栋',
                  FullName: '星河丹堤-一期-1栋-1层',
                  children:array(
                    {
                      RegionID: 'string',
                      RegionName:'{0}R',
                      RegionType: 16,
                      ParentRegionID: 'string',
                      ParentRegionName: '1层',
                      FullName: '星河丹堤-一期-1栋-1层-101'
                    })
                })
            }))
          }
        },

        /**
         * 获取<tt>regionID</tt>户型图
         * @param {string} regionID the区域ID
         * @returns {object}
         * */
        getHouseDrawing:function(regionID){
          get({
            DrawingID:'',
            DrawingName:'',
            /**
            * 1建筑平面图
            * 3户型图
            * 4平面结构图
            * */
            DrawingType:1,
            DrawingImageUrl:'',
            Width:1024,
            Height:1024
          })
        },
        /**
         * 获取楼层图
         * @param {string} regionID　区域ID
         * @returns {object}
         * */
        getFloorDrawing:function(regionID){
          get({
            DrawingID:'',
            DrawingName:'',
            DrawingType:'',
            DrawingImageUrl:'',
            Width:1024,
            Height:1024
          })
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
          return post(regionID,draw);
        }
      },

      /**
       * 验收状态
       * */
      MeasureCheckBatch:{
        /**
         * @param    {string}  acceptanceItemID     实测项ID/工序ID
         * @param    {string}  regionID  区域ID
         * @param    {int}     acceptanceItemIDType  返回状态类型
         *           1   --实测项
         *           2   --工序
         *           3   --整改
         * */
        getStatus:function(acceptanceItemID, regionID, acceptanceItemIDType){
          return query(array({
            RegionID:'string',
            CheckBatchID:'{0}',//验收批Id
            CheckBatchNo:'批{0}',//验收批号
            CheckBatchDescription:'',//验收批描述
            /**
             * 0：未开始，
             * 1：验收合格，
             * 2：验收不合格
             * */
            Status:1
          }))
        }
      },

      ProjectQuality:{
        MeasurePoint:{
          /**
           * 添加测量标注点
           * @param {Array} points
           *        [{
           *        type:'Feature',//固定为Feature
           *        geometry:{
           *          type:'stamp' // 固定为stamp
           *          coordinates:[0.21,0.20003] //图形位置信息
           *        }，
           *        options:{       //几何图形配置项，属性不固定，不同的geometry.type不尽相同
           *          color:'red'
           *        }
           *      }]
           * **/
          create:function(points){
            return post(points);
          },
          /**
           * 更新测量标注点
           * @param {string} measurePointID 唯一ID
           * @param {Array} points
           *        [{
           *        type:'Feature',//固定为Feature
           *        geometry:{
           *          type:'stamp' // lineGroup 测量组，areaGroup　区域组，以后会扩展，
           *          coordinates:[] //图形位置信息
           *        }，
           *        options:{       //几何图形配置项，属性不固定，不同的geometry.type不尽相同
           *          color:'red'
           *        }
           *      }]
           * **/
          update:function(measurePointID, points){
            return post(points);
          },
          /**
           * 添加测量组
           * @param {Array} points
           * 　　　　[{
           *        type:'Feature',//固定为Feature
           *        geometry:{
           *          type:'lineGroup' // lineGroup 测量组 或　areaGroup　区域组
           *          coordinates:[] //图形位置信息
           *        }，
           *        options:{       //几何图形配置项，属性不固定，不同的geometry.type不尽相同
           *          color:'red'
           *        },
           *        properties：{
           *          MeasurePointID:'id',//唯一ID，客户端生成
           *          RegionType:'Group',//区域类型（Point：标注点，Region：区域，Group：组） 固定为Group,
           *          Geometry:'',//几何描述
           *          ChildrenPointID:[
           *            'id1','id2'
           *          ]
           *         }
           *        }]
           * */
          createGroup:function(points){
            return post(points);
          },
          /**
           *  更新测量组
           * @param {string} measurePointID 唯一ID
           * @param {Array} points
           * 　　　　[{
           *        type:'Feature',//固定为Feature
           *        geometry:{
           *          type:'lineGroup' // lineGroup 测量组 或　areaGroup　区域组
           *          coordinates:[] //图形位置信息
           *        }，
           *        options:{       //几何图形配置项，属性不固定，不同的geometry.type不尽相同
           *          color:'red'
           *        },
           *        properties：{
           *          MeasurePointID:'id',//唯一ID，客户端生成
           *          RegionType:'Group',//区域类型（Point：标注点，Region：区域，Group：组） 固定为Group,
           *          Geometry:'',//几何描述
           *          ChildrenPointID:[
           *            'id1','id2'
           *          ]
           *        }
           *        }]
           * */
          updateGroup:function(measurePointID,points){
            return post(points);
          },
          /**
           * 删除点
           *
           * @param {string} measurePointID 唯一ID
           * */
          delete:function(measurePointID){
            return post(points);
          },

          /**
           * 获取点
           * @param {string} acceptanceIndexID 实测指标Id
           * @param {string} checkRegionID 区域ID
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
           *              }
           *            }]
           *          }
           *
           * */
          query:function(acceptanceIndexID,checkRegionID){
            return query(array({
              MeasurePointID:'id',//唯一ID
              AcceptanceItemID:'',// 实测项ID
              CheckRegionID:'', //区域ID
              AcceptanceIndexID:'',//实测指标Id
              MeasurePointNo:'',//测量点编号
              Remark:'', //备注
              RegionType:'Point',//区域类型（Point：标注点，Region：区域，Group：组） 固定为Point
              RegionName:'',//标点名称,
              Geometry:'',//几何描述
              ExtendedField1:'',
              ExtendedField2:'',
              ExtendedField3:''
            }))
          }
        },
        MeasureValue:{
          /**
           * 添加测试值
           * @param {Array} values 测试值
           *        {
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
          create:function(values){
            return post(values);
          },
          /**
           *  更新测试值
           * @param {Array} values 测试值
           *        {
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
          update:function(values){
            return post(values);
          },
          /**
           * 获取检查点值
           * @param {string} acceptanceIndexID 实测指标Id
           * @param {string} checkRegionID 区域ID
           * */
          query:function(acceptanceIndexID,checkRegionID){
            return query(array(
              {
                MeasurePointID:'',
                AcceptanceIndexID:'',
                MeasureValue:'',//测量值
                DesignValue:'',//设计值
                CalculatedValue:'',//计算值
                Remark:'',//备注
                ExtendedField1:'',//扩展字段1
                ExtendedField2:'',//扩展字段2
                ExtendedField3:''//扩展字段3
              }));
          }
        }
      }
    });

    function query(data){
      return $q(function(resolve){
        resolve({
          rows:data,
          total:100
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
            if(v.indexOf('{0}')==-1)
              v = v+ (i+1);
            else
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
        resolve(data);
      })
    }

    function post(data){
      return $q(function(resolve){
        resolve({
          code:1
        });
      })
    }
  }
})();
