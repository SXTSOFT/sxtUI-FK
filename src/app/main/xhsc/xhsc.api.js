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
  var r = function(data) {
    return $q(function (resolve) {
      resolve({
        data: data
      })
    });
  }
  apiProvider.register('xhsc',{
    Project: {
      getMap: $http.db({
        _id: 'mapPoroject',
        idField: 'ProjectID',
        dataType: 1
      }).bind(function () {
        return $http.get($http.url('/api/ProjectInfoApi/GetMapProjectList'))
      }),
      getDrawingRelations: $http.db({
        _id: 'DrawingRelation',
        idField: function (d) {
          return d.RegionId+(d.AcceptanceItemID?d.AcceptanceItemID:'');
        },
        dataType: 1
      }).bind(function (projectId) {
        return $http.get($http.url('/Api/WPAcceptanceApi/GetGxDrawingRelation', {projectId: projectId}));
      }),
      getDrawings: $http.db({
        _id: 'Drawing',
        idField: 'DrawingID',
        dataType: 1,
        filter:function (item,projectId) {
          return item.ProjectID==projectId;
        }
      }).bind(function (projectId) {
        return $http.get($http.url('/Api/WPAcceptanceApi/GetGxDrawingList', {projectId: projectId}));
      }),
      getDrawing: $http.db({
        _id: 'Drawing',
        idField: 'DrawingID',
        dataType: 3,
        filter:function (item,drawingId) {
          return item.DrawingID == drawingId;
        }
      }).bind(function (drawingId) {
        return $http.get($http.url('/Api/WPAcceptanceApi/GetGxDrawing', {drawingId: drawingId}));
      }),
      queryAllBulidings: $http.db({
        _id: 'Projects',
        idField: 'ProjectID',
        dataType: 1,
        filter: function (item,projectId) {
          return item.ProjectID == projectId;
        }
      }).bind(function (projectId) {
        return $http.get($http.url('/api/ProjectInfoApi/GetProjectListByid', {projectId: projectId}));
      })
    },
    Procedure:{
      queryProcedure:$http.db({
          _id: 'Procedure',
          idField: 'SpecialtyID',
          dataType: 1
        }).bind(function(){
        return $http.get($http.url('/Api/WPAcceptanceApi/GetWPAcceptanceInfo'));
      }),
      InspectionPoint:$http.db({
        _id:'InspectionPoint',
        idField:'MeasurePointID',
        methods:{
          query:{
            dataType:1
          },
          create:{
            upload:true,
            fn:function (point) {
              return $http.post('/Api/MeasurePointApi/CreatePoint',[point]);
            }
          },
          delete:{
            delete:true
          }
        }
      }),
      InspectionIndex:{
        query:$http.db({
          _id:'EMBDInspectionIndex',
          idField:'InspectionIndexID',
          dataType:1,
          filter:function (item,areaID,acceptanceItemID,userID,count) {
            return item.AreaID==areaID
              && item.AcceptanceItemID==acceptanceItemID
              && item.UserID==userID
              && item.Count==count
          }
        }).bind(function (areaID,acceptanceItemID,userID,count) {
          return $http.get($http.url('/Api/InspectionApi/GetInspectionIndex', {AreaID: areaID,AcceptanceItemID:acceptanceItemID,UserID:userID,Count:count}));
        }),
        create:$http.db({
          name:'检查点',
          _id:'EMBDInspectionIndex',
          idField:'InspectionIndexID',
          upload:true,
          local:true
        }).bind(function (inspectionIndex) {
          return $http.post($http.url('/Api/InspectionApi/CreateInspectionIndex', inspectionIndex));
        }),
        delete:$http.db({
          _id:'EMBDInspectionIndex',
          idField:'InspectionIndexID',
          delete:true,
          local:true
        }).bind()
      },
      InspectionCheckpoint:$http.db({
        _id:'InspectionCheckpoint',
        idField:'CheckpointID',
        methods:{
          query:{
            dataType:1,
            filter:function (item,AcceptanceItemID,AreaID) {
              return item.AcceptanceItemID==AcceptanceItemID && item.AreaID==AreaID;
            }
          },
          create:{
            name:'检查记录',
            upload:true,
            fn:function (InspectionCheckpoint) {
              return $http.post('/Api/InspectionCheckpointApi/CreateInspectionCheckpoint',InspectionCheckpoint);
            }
          },
          delete:{
            delete:true
          }
        }
      }),
      InspectionProblemRecord:{
        query:$http.db({
          _id:'InspectionProblemRecord',
          idField:'ProblemRecordID',
          local:true,
          filter:function (item,CheckpointID) {
            return item.CheckpointID==CheckpointID;
          }
        }).bind(),
        create:$http.db({
          name:'问题记录',
          _id:'InspectionProblemRecord',
          idField:'ProblemRecordID',
          upload:true
        }).bind(function (InspectionProblemRecord) {
          return $http.post('/Api/InspectionProblemRecordApi/CreateInspectionProblemRecord',InspectionProblemRecord);
        }),
        delete:$http.db({
          _id:'InspectionProblemRecord',
          idField:'ProblemRecordID',
          local:true,
          delete:true
        }).bind()
      },
      InspectionProblemRecordFile:{
        query:$http.db({
          _id:'InspectionProblemRecordFile',
          idField:'ProblemRecordFileID',
          local:true,
          filter:function (item,ProblemRecordID,CheckpointID) {
            return item.ProblemRecordID==ProblemRecordID && item.CheckpointID==CheckpointID;
          }
        }).bind(),
        create:$http.db({
          name:'照片',
          _id:'InspectionProblemRecordFile',
          idField:'ProblemRecordFileID',
          upload:true
        }).bind(function (InspectionProblemRecordFile) {
          return $http.post('/Api/InspectionProblemRecordFileApi/CreateInspectionProblemRecordFile',InspectionProblemRecordFile);
        }),
        delete:$http.db({
          _id:'InspectionProblemRecordFile',
          idField:'ProblemRecordFileID',
          delete:true
        }).bind()
      },
      getRegionStatus:$http.db({
          _id:'project_status',
          idField:function (item) {
            return item.AcceptanceItemID+item.AreaID;
          },
          dataType:1
        }).bind(function(projectId) {
        return $http.get($http.url('/Api/InspectionApi/GetUserInspectionInfo', {projectId: projectId}));
      }),
      postInspection:function(AcceptanceItemID,AreaID){
        return $http.post($http.url('/Api/InspectionApi/insert'), {AcceptanceItemID:AcceptanceItemID,AreaID:AreaID})
      }
    },
    Assessment:{
      queryRegions:function (arg) {
        return $http.get($http.url('/Api/AssessmentApi/GetAssessmentSectionExtractRegion',arg))
      },
      GetMeasureIndexMeasureInfo:function (recordId,itemId) {
        return $http.get($http.url('/Api/MeasureValueApi/GetMeasureIndexMeasureInfo',{measureRecordID:recordId,acceptanceIndexID:itemId}));
      },
      query:$http.db({
          _id:'projects',
          idField:'AssessmentID',
          dataType:1
        }).bind(function () {
        return $http.get($http.url('/Api/AssessmentApi/GetAssessmentProject'));
      }),
      queryById:function (assessmentID) {
        return $http.get($http.url('/Api/AssessmentApi/GetAssessmentProjectSingle',{assessmentID:assessmentID}))
      },
      GetAssessmentStatus:function (assessmentID) {
        return $http.get($http.url('/Api/AssessmentApi/GetAssessmentStatus',{assessmentID:assessmentID}))
      },
      queryRegion:function (areaID) {
        return $http.get($http.url('/Api/ProjectInfoApi/GetRegionTreeInfo',{AreaID:areaID}));
      },
      getMeasure:function(param){
        return $http.get($http.url('/Api/MeasureValueApi/GetMeasureIndexResult',param));
      },
      queryResult:function (assessmentID) {
        return $http.get($http.url('/Api/AssessmentApi/GetAssessmentItemResult',{AssessmentID:assessmentID}))
      },
      modifyScore:function (data) {
        return $http.post($http.url('/Api/AssessmentApi/SubmitAssessmentItemModifyScore'),data);
      },
      deleteScoreItem:function (deducScoretItemID) {
        return $http.delete('/Api/AssessmentApi/DeleteDeducScoretItem/'+deducScoretItemID);
      },
      queryResutTotal:function (assessmentID) {
        return $http.get($http.url('/Api/AssessmentApi/GetAssessmentTotalReport',{AssessmentID:assessmentID}));
      },
      queryItemResults:function () {
        return $http.get($http.url('/Api/AssessmentApi/GetAllAssessmentProject'));
      },
      queryReport:function (year,quarter,projectID,assessmentStage) {
        return $http.get($http.url('/Api/AssessmentApi/GetAssessmentItemStatisticsResult',{year:year,projectID:projectID,quarter:quarter,assessmentStage:assessmentStage}));
      },
      queryTotalReport:function(year,quarter,projectID,assessmentStage){
        return $http.get($http.url('/Api/AssessmentApi/GetAssessmentTotalReport',{year:year,projectID:projectID,quarter:quarter,assessmentStage:assessmentStage}));
      },
      queryProjectRegionInfo:function(projectID){
         return $http.get($http.url('/Api/ProjectInfoApi/GetProjectRegionRelationByProjectID',{projectID:projectID}));
      },
      sumReportTotal:function(assessmentID){
        return $http.post($http.url('/Api/AssessmentApi/SumReportTotal'),{assessmentID:assessmentID});
      },
      queryProcessBuildings:function(regionId){
        return $http.get($http.url('/api/ImageSignApi/GetBuildingList?stageId='+regionId))
      },
      EngineeringProcess:{
        getWorkingMap:function(projectId){
          return $q(function(resolve){
              resolve({
                data:{
                  Application: null,
                  AreaImage: "a13d7f27-f320-40ed-aa43-242075e6c4cf",
                  AreaRemark: {"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[0.5732421875,0.4951171875]},"options":{"icon":{"options":{"className":"","shadowUrl":null,"iconAnchor":[15,15],"iconSize":[30,30],"iconUrl":"/dp/libs/leaflet/images/photo.png","color":"#ff0000"},"_initHooksCalled":true},"title":"","alt":"","clickable":true,"draggable":false,"keyboard":true,"zIndexOffset":0,"opacity":1,"riseOnHover":false,"riseOffset":250,"gid":"e5bf57b4-7d71-4161-9b4f-c460766e7398"}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[0.21875,0.49609375]},"options":{"icon":{"options":{"className":"","shadowUrl":null,"iconAnchor":[15,15],"iconSize":[30,30],"iconUrl":"/dp/libs/leaflet/images/photo.png","color":"#ff0000"},"_initHooksCalled":true},"title":"","alt":"","clickable":true,"draggable":false,"keyboard":true,"zIndexOffset":0,"opacity":1,"riseOnHover":false,"riseOffset":250,"gid":"0f8696fa-f1e7-4f08-be50-5228eaddf32f"}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[0.3975830078125,0.3734130859375]},"options":{"icon":{"options":{"className":"leaflet-div-label","html":"万科时代广场一期","color":"#ff0000"},"_initHooksCalled":true,"_div":{"_leaflet_pos":{"x":568,"y":193}}},"title":"","alt":"","clickable":true,"draggable":true,"keyboard":true,"zIndexOffset":1000,"opacity":1,"riseOnHover":false,"riseOffset":250,"saved":false}},{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[0.15966796875,0.338623046875],[0.2236328125,0.338134765625],[0.223388671875,0.347412109375],[0.22314453125,0.353759765625],[0.2236328125,0.357666015625],[0.22607421875,0.364501953125],[0.231201171875,0.3740234375],[0.2392578125,0.380126953125],[0.24462890625,0.382568359375],[0.249755859375,0.384033203125],[0.255615234375,0.384521484375],[0.264404296875,0.3837890625],[0.2705078125,0.381591796875],[0.27978515625,0.375],[0.28466796875,0.3662109375],[0.2880859375,0.35693359375],[0.2890625,0.35107421875],[0.28759765625,0.3447265625],[0.2880859375,0.3388671875],[0.35107421875,0.3388671875],[0.35205078125,0.370361328125],[0.365966796875,0.37060546875],[0.375244140625,0.361328125],[0.41552734375,0.36083984375],[0.439697265625,0.3505859375],[0.56591796875,0.21533203125],[0.56591796875,0.2001953125],[0.61474609375,0.199951171875],[0.635498046875,0.218994140625],[0.330078125,0.541015625],[0.2822265625,0.546875],[0.16015625,0.5234375],[0.15966796875,0.338623046875]]]},"options":{"stroke":true,"color":"#ff0000","dashArray":null,"lineCap":null,"lineJoin":null,"weight":4,"opacity":0.5,"fill":true,"fillColor":null,"fillOpacity":0.2,"clickable":true,"smoothFactor":1,"noClip":false,"itemId":"5514f7a571fe65ac066cb091","itemName":"万科时代广场一期","areaLabel":{"text":"万科时代广场一期","id":"5514f7a571fe65ac066cb091","lat":0.3734130859375,"lng":0.3975830078125}}}]},
                  BuildArea: 0,
                  CreatedId: "e2f0e8396443beab00eaa1f7cb6c2cf7ad8a346a",
                  CreatedTime: "2016-03-02",
                  GreenArea: 0,
                  LandUseType: 0,
                  Latitude: "22.7172406798959",
                  Longitude: "114.250833392143",
                  ModefiedId: "d51474c887fe38b89cf6f4eff740309789f93034",
                  ModefiedTime: "2016-06-14",
                  ProjectId: "5513e1c7493fdce42f42d9b1",
                  ProjectNo: "深圳万科时代广场",
                  SellLine: "66.7%",
                  Status: 4,
                  TotalArea: 0
                }
              })
            })

        },
        getWorkingMapDetail:function(imageId){
          return $q(function(resolve){
            resolve({
              data:{
                Files:[
                  {
                    CreateDate: "2016-05-03",
                    CreatedId: "13f93de383e643f7b586493c2b9045bb37888a34",
                    FileName: "2016三馆、龙城合并运营图20160503.jpg",
                    FileSize: 6918748,
                    FileType: null,
                    GroupId: "a13d7f27-f320-40ed-aa43-242075e6c4cf",
                    Id: "2b220029-1a90-4727-b1b7-98ac20c073d7",
                    IsOK: null,
                    PartionID: 0,
                    Project: null,
                    Remark: null,
                    Status: null,
                    Url: "~/upload/2016/05/s_2b220029-1a90-4727-b1b7-98ac20c073d7.jpg"
                  }
                ],
                Group: "a13d7f27-f320-40ed-aa43-242075e6c4cf"
              }
            })
          })
        },
        getWorkingProcess:function(regionId){
          return $http.get($http.url('api/ImageSignApi/GetBuildingDetailed?buildingId='+regionId));
        }
      },
      Measure:{
        /**
         * 获取本人所有实测项目(并非自定义的，而是系统基础项)
         *
         * @param    {string}  areaID     分期
         * */
        query:function(areaID) {
          //return $http.get($http.url('/Api/MeasureInfo/MeasureQuery', {areaID: areaID}));
          return r([{
            AcceptanceItemID:"abc", //模板中的实测项
            AcceptanceItemName:"土建",//实测项名称
            Building:""   //模板
          },{
            AcceptanceItemID:"abc", //模板中的实测项
            AcceptanceItemName:"抹灰",//实测项名称
            Building:""   //模板
          }])
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
          query:function() {
            return r([{
              AcceptanceIndexID:"",
              ParentAcceptanceIndexID:"",
              AcceptanceItemID:"",
              IndexName:"门窗",
              IndexType:"",
              MeasureMethod:"",
              QSKey:"",
              QSCondition:"",
              QSValue:"",
              QSOtherValue:"",
              PassYieldComputeMode:"",
              GroupSign:"",
              Weight:"",
              SinglePassYield:"",
              SummaryPassYield:"",
              IconImage:"",
              IconColor:""
            },{
              AcceptanceIndexID:"",
              ParentAcceptanceIndexID:"",
              AcceptanceItemID:"",
              IndexName:"天花板",
              IndexType:"",
              MeasureMethod:"",
              QSKey:"",
              QSCondition:"",
              QSValue:"",
              QSOtherValue:"",
              PassYieldComputeMode:"",
              GroupSign:"",
              Weight:"",
              SinglePassYield:"",
              SummaryPassYield:"",
              IconImage:"",
              IconColor:""
            }])
          }
        }
      },

      region:{
        query:function(areaID) {
          return $http.get($http.url('http://ggroupem.sxtsoft.com:9191/Api/ProjectInfoApi/GetRegionTreeInfo',
            {AreaID: areaID}));
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
          return $http.db({
          _id:'updateHouseDrawing',
            data:1,
            idField:'regionID'
          }).post('/Api/MeasureInfo/ModifyHouseType',{regionID:regionID,draw:draw});
          /**return post(regionID,draw);**/
        },


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
           * @param {string} measureValueId 唯一ID
           * */
          delete:function(measureValueId) {
            return $http.delete($http.url('/Api/MeasureValueApi/DeleteMeasureValue', {measureValueId: measureValueId}))
          }
        },

        getNumber:function(acceptanceItemID,checkRegionID){
          return $http.get($http.url('/Api/MeasureValueApi/GetMeasureRecordNum',{acceptanceItemID:acceptanceItemID,checkRegionID:checkRegionID}));
        },
        getMeasureCheckResult:function(measureRecordID){
          return $http.get($http.url('/Api/MeasureValueApi/GetMeasureCheckResult',{measureRecordID:measureRecordID}))
        }
        //测量项的点测量数据：



//
//【AcceptanceIndexID: "bda32789505d4adf9457fccd64b69bf2"//指标ID
//AcceptanceItemID: "e66a7435e8274dc0b7c09924ce1ee91c"//测量项ID
//CheckRegionID: "77961e877d4c4f9890dbe6207853d59f"//区域ID
//CheckStatus: 1//验收状态
//CompanyName: null//公司名称
//IndexName: "结构截面尺寸"//指标名称
//MeasureRecordID: "d80f8e047db84b24aadb50ab154bd6a4"//测量记录ID
//MeasureStatus: 2 //测量状态
//MeasureTime: "2016-04-20 11:21:59"//测量时间
//MeasureUserId: "admin" //测量人ID
//MeasureUserName: "体验帐户" //测量人
//ParticipantIDs: null
//MaximumDeviation：//最大偏差值
//Points: 【
//AcceptanceIndexID: "aa2672eedfb94418b18449c3d704f9c7"//指标ID
//CalculatedValue: 1//计算值
//DesignValue: null//设计值
//MeasurPointName: "2"//标点名称
//MeasureRecordID: "d80f8e047db84b24aadb50ab154bd6a4"//测量记录ID
//MeasureStatus: 1//状态
//MeasureValue: 5//测量值
//MeasureValueId: "09c9d723d1ff4dc8aa3d11e632eee67b"
//ParentMeasureValueID: null
//】
//QualifiedRate: null
//】
      },
      sxtHouseService:{
        getZ: function (totalW, totalH, m, w, h) {
          var x;
          var y;
          var z;
          z = Math.sqrt((totalH * totalW) / (h * w * m));
          x = Math.ceil(totalW / (z * w));
          y = Math.ceil(totalH / (z * h));
          z = Math.sqrt((totalH * totalW) / (h * x * y * w));
          //console.log('result', x, y, z);
          return {
            x: x,
            y: y,
            z: z
          }
        }
      }
    }});

  }
})();
