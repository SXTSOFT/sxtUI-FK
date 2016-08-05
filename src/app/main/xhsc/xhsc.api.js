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
    profile:$http.db({
      _id:'s_userinfo',
      idField:'UserId',
      mode:2,
      filter:function () {
        return true;
      },
      dataType:3
    }).bind(function () {
      return $http.get(sxt.app.api + '/api/Security/profile', {t: new Date().getTime()});
    }),
    offline:$http.db({
      _id:'s_offline',
      idField:'Id',
      methods:{
        query:{
          dataType:1,
          filter:function (item,prjectId) {
            return !prjectId || prjectId==item.Id;
          }
        },
        create:{
          upload:true
        },
        delete:{
          delete:true
        }
      }
    }),
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
        idField: 'ProjectId',
        dataType: 3
      }).bind(function (projectId) {
        return $http.get($http.url('/Api/WPAcceptanceApi/GetGxDrawingRelation', {projectId: projectId})).then(function(result){
          return {
            data:{
              ProjectId:projectId,
              Relations:result.data
            }
          }
        });
      },function(result){
        return {
          data:result.data.Relations
        }
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
        mode:1,
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
      }),
      getInspectionList:$http.db({
        _id:'Inspection',
        idField:'InspectionId',
        dataType:1,
        filter:function (item,inspectionId) {
          return item.InspectionId==inspectionId;
        }
      }).bind(function(inspectionId){
        return $http.get($http.url('/api/InspectionApi/GetInspectionInfoByInspection',{inspectionId:inspectionId}));
      }),
      insertInspectionList:$http.db({
        _id:'Inspection',
        idField:'InspectionId',
        upload:true
      }).bind(),
      GetRegionTreeInfo:function(ProjectID){
        return $http.get($http.url('/Api/ProjectInfoApi/GetRegionTreeInfo',{areaID:ProjectID}))
      },
      GetMeasureItemInfoByAreaID:function(ProjectID){
        return $http.get($http.url('/Api/MeasureInfo/GetMeasureItemInfo',{areaID:ProjectID}))
      }
    },
    Procedure:{
      queryProcedure:$http.db({
          _id: 'AcceptanceInfo',
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
            dataType:1,
            filter:function (item,inspectionId,acceptanceItemId,areaId) {
              return true;
            },
            fn:function (inspectionId,acceptanceItemId,areaId) {
              return $http.get($http.url('/api/InspectionCheckpointApi/GetMeasurePoint',{inspectionId:inspectionId,areaId:areaId,acceptanceItemId:acceptanceItemId}));
            }
          },
          create:{
            upload:true,
            fn:function (point) {
              return $http.post('/Api/MeasurePointApi/CreatePoint',[point]);
            }
          },
          delete:{
            delete:true,
            fn:function(measurePointID) {
              return $http.post($http.url('/Api/MeasurePointApi/DeletePoint', measurePointID))
            }
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
            },
            fn:function (acceptanceItemId,areaId,inspectionId) {
              return $http.get($http.url('/Api/InspectionCheckpointApi/ByAreaIdAndAcceptanceItemId',{areaId:areaId,acceptanceItemId:acceptanceItemId,inspectionId:inspectionId}));
            }
          },
          create:{
            name:'检查记录',
            upload:true,
            dataType:3,
            fn:function (InspectionCheckpoint) {
              return $http.post('/Api/InspectionCheckpointApi/Insert',InspectionCheckpoint);
            }
          },
          delete:{
            delete:true,
            fn:function (CheckpointID) {
              $http.post('/Api/InspectionCheckpointApi/Delete',{CheckpointID:CheckpointID});
            }
          }
        }
      }),
      InspectionProblemRecord:{
        query:$http.db({
          _id:'InspectionProblemRecord',
          idField:'ProblemRecordID',
          dataType:1,
          filter:function (item,CheckpointID) {
            return item.CheckpointID==CheckpointID;
          }
        }).bind(function (checkpointId) {
          return $http.get($http.url('/api/InspectionProblemRecordApi/ByCheckpointId',{checkpointId:checkpointId}))
        }),
        create:$http.db({
          name:'问题记录',
          _id:'InspectionProblemRecord',
          idField:'ProblemRecordID',
          upload:true
        }).bind(function (InspectionProblemRecord) {
          return $http.post('/Api/InspectionProblemRecordApi/Insert',InspectionProblemRecord);
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
          dataType:1,
          filter:function (item,ProblemRecordID) {
            return item.ProblemRecordID==ProblemRecordID;
          }
        }).bind(function (problemRecordId) {
          return $http.get($http.url('/Api/InspectionProblemRecordFileApi/GetProblemRecordFile',{problemRecordId:problemRecordId}))
        }),
        create:$http.db({
          name:'照片',
          _id:'InspectionProblemRecordFile',
          idField:'ProblemRecordFileID',

          upload:true
        }).bind(function (InspectionProblemRecordFile) {
          return $http.post('/Api/InspectionProblemRecordFileApi/Insert',InspectionProblemRecordFile);
        }),
        delete:$http.db({
          _id:'InspectionProblemRecordFile',
          idField:'ProblemRecordFileID',
          delete:true
        }).bind()
      },
      InspectionIndexJoinApi:{
        create:$http.db({
          _id:'InspectionIndexJoinApi',
          idField:'ProblemID',
          upload:true,
          //filter:function(item,InspectionID,ProblemID,AreaID){
          //  return item.InspectionID == InspectionID && item.ProblemID == ProblemID && item.AreaID ==AreaID
          //}
        }).bind(function(params){
          return $http.post('/api/InspectionIndexJoinApi/Insert',params);
        }),
        query:$http.db({
          _id:'InspectionIndexJoinApi',
          idField:'ProblemID',
          dataType:1,
          filter:function(item,InspectionID){
            return item.InspectionID == InspectionID
          }
        }).bind(function(InspectionID){
          return $http.get($http.url('/api/InspectionIndexJoinApi/GetList',{inspectionID:InspectionID}));
        })
      },
      getRegionStatus:$http.db({
          _id:'project_status',
          idField:function (item) {
            return item.Sign + item.AcceptanceItemID+item.AreaId;
          },
          dataType:1,
          filter:function (item,projectId,Sign) {
            return item.projectId==projectId && item.Sign==Sign
          }
        }).bind(function(projectId,Sign) {
        return $http.get($http.url('/Api/InspectionApi/GetUserInspectionInfo', {
          projectId: projectId,
          Sign:!Sign? "":Sign
        })).then(function (r) {
          r.data.forEach(function (row) {
            row.projectId = projectId;
            row.Sign = Sign;
          });
          return r;
        });
      }),
      postInspection:$http.db({
        _id:'InspectionApi',
        upload:true,
        idField:'InspectionID'
      }).bind(function(params){
        return $http.post($http.url('/Api/InspectionApi/insert'),params )
      },function (r,cfg,args) {
        if(!r.data){
          r = r[0];
          return this.root.xhsc.Project.insertInspectionList({
            "InspectionId":r.InspectionID,
            "ProjectID":r.AreaList[0].AreaID.substring(0,5),
            "Percentage":100.0,
            "Describe":"",
            "AcceptanceItemID":r.AcceptanceItemID,
            "Status":1,
            "Sign":r.Sign,
            "Children":r.AreaList
          }).then(function () {
            return {
              data:{
                ErrorCode:0,
                Data:r
              }
            }
          });
        }
        return r;
      }),
      getInspections:$http.db({
        _id:'InspectionInfoList',
        idField:'InspectionId',
        dataType:1,
        filter:function (item,status) {
          return item.status|status==status;
        }
      }).bind(function(status){
        return $http.get($http.url('/api/InspectionApi/GetInspectionInfoList',{status:status}))
      }),
      getZGlistbyProjectId: function (projectID) {
        return $http.get($http.url('/api/InspectionRectificationApi/List',{projectId:projectID}))
      },
      getZGById:$http.db({
        _id:'zgById',
        idField:'RectificationID',
        dataType:1,
        filter:function(item,rectificationID){
          return item.RectificationID == rectificationID;
        }
      }).bind(function(rectificationID){
        return $http.get($http.url('/api/InspectionRectificationApi/GetById',{rectificationID:rectificationID})).then(function(result){
          result.data = [result.data];
          return result;
        });
      }),
      getZGReginQues:$http.db({
        _id:'InspectionCheckpoint',
        idField:'CheckpointID',
        dataType:1,
        filter:function(item,areaId,rectificationID){
          if(areaId){
            return item.AreaID==areaId && item.RectificationID==rectificationID;
          }else{
            return item.RectificationID==rectificationID;
          }

        }
      }).bind(function(areaId,rectificationID){
        return $http.get($http.url('/api/InspectionRectificationApi/ByAreaIdAndAcceptanceItemId',{areaId:areaId,rectificationID:rectificationID}))
      }),
      getZGReginQuesPoint:$http.db({
        _id:'InspectionPoint',
        idField:'MeasurePointID',
        dataType:1,
        filter:function () {
          return true;
        }
      }).bind(function(areaId,rectificationID){
        return $http.get($http.url('/api/InspectionRectificationApi/GetPointByAreaIdAndAcceptanceItemId',{areaId:areaId,rectificationID:rectificationID}))
      }),
      getZGlist:$http.db({
        _id:'tblEMBDInspectionRectification',
        idField:'RectificationID',
        dataType:1
      }).bind(function(status){
        return $http.get($http.url('/api/InspectionRectificationApi/GetByStatus',{status:status}));
      }),
      getRectification:$http.db({
        _id:'ByRectificationId',
        idField:'rectificationId',
        dataType:1,
        filter:function (item,rectificationId) {
          return item.rectificationId==rectificationId;
        }
      }).bind(function(rectificationId){
        return $http.get($http.url('/api/InspectionApi/ByRectificationId',{rectificationId:rectificationId})).then(function(r){
          if (r.data){
            r.data.rectificationId=rectificationId;
          }
          return {
            data:[r.data]
          };
        })
      },function (r) {
        return {data: r.data[0]};
      }),
      createZGReceipt:$http.db({
        _id:'createZGReceipt',
        idField:'InspectionID',
        upload:true
      }).bind(function(data){
        return $http.post($http.url('/api/InspectionRectificationApi/Insert'),data);
      }),
      InspectionRectificationUpdateStatus:$http.db({
        _id:'IRUpdateStatus',
        idField:'RectificationId',
        upload:true
      }).bind(function(data){
        return $http.post($http.url('/api/InspectionRectificationApi/UpdateStatus'),data);
      }),
      updataZjPoint:$http.db({
        _id:'updataZjPoint',
        idField:'CheckpointID',
        upload:true
      }).bind(function(data){
        return $http.post($http.url('/api/InspectionCheckpointApi/UpdateStatus'),data)
      }),
      getInspectionInfoBySign:$http.db({
        _id:'Inspection_8',
        idField:'InspectionId',
        dataType:1,
        fitler:function () {
          return true;
        }
      }).bind(function(sign){
        return $http.get($http.url('/Api/InspectionApi/BySign',{sign:sign}))
      }),
      insertJlfy:$http.db({
        _id:'ReviewInsert',
        idField:'RectificationId',
        upload:true
      }).bind(function(data){
        return $http.post($http.url('/api/InspectionRectificationApi/ReviewInsert'),data)
      }),
      //根据当前登陆人获取权限
      authorityByUserId:$http.db({
        _id:'ProjectPermissions',
        idField:'ProjectID',
        dataType:1,
      }).bind(function(){
        return $http.get($http.url('/Api/ProjectInfoApi/GetProjectPermissions'));
      }),
      //根据项目ID获取项目人员权限
      GetPermissionsByProjectId:function(ProjectId){
        return $http.get($http.url('/Api/ProjectInfoApi/GetPermissionsByProjectId',{projectId:ProjectId}));
      },
      getZgReport:function(InspetionID){
        return $http.get($http.url('/api/InspectionApi/GetInspectionReport',{inspectionID:InspetionID}));
      }
    },
    Assessment:{

      getUserMeasureValue:$http.db({
        db:function (projectId,recordType,relationId,db) {
          return db;
        },
        idField:function (item) {
          return item.AcceptanceIndexID+item.MeasurePointID
        },
        dataType:1
      }).bind(function (projectId,recordType,relationId,db,sxt) {
        return $http.get($http.url('/api/MeasureInfo/GetUserMeasureValue',{projectId:projectId,recordType:recordType,relationId:relationId})).then(function (r) {
          r.data.forEach(function (item) {
            if(!item.MeasureValueId) {
              item.MeasureValueId = sxt.uuid();
            }
          });
          return r;
        });
      }),
      getUserMeasurePoint:$http.db({
        db:function (projectId,recordType,db) {
          return db;
        },
        idField:'$id',
        dataType:1
      }).bind(function (projectId,recordType,db) {
        return $http.get($http.url('/api/MeasureInfo/GetUserMeasurePoint',{projectId:projectId,recordType:recordType})).then(function (r) {
          r.data.forEach(function (item) {
            item.$id = item.MeasurePointID;
            item.geometry = JSON.parse(item.Geometry);
          });
          return r;
        });
      }),
      queryRegions:function (arg) {
        return $http.get($http.url('/Api/AssessmentApi/GetAssessmentSectionExtractRegion',arg))
      },
      GetMeasureIndexMeasureInfo:function (regionId,itemId) {
        return $http.get($http.url('/Api/MeasureValueApi/GetMeasureIndexMeasureInfo',{RegionID:regionId,acceptanceIndexID:itemId}));
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
    },
    message: {


          messageList: function ( startIndex,maximunRows,checked) {
            return $http.get($http.url('/api/Message',{maximunRows:maximunRows,startIndex:startIndex,checked:checked}))
          },

         deleteAllMessage:function () {
          return $http.post('/api/Message/clear');
         },


      }
  }




  );



  }
})();
