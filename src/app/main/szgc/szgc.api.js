/**
 * Created by zhangzhaoyong on 16/1/28.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .config(config)
  /** @anInject */
  function config(apiProvider){
    var $http = apiProvider.$http,
      $q = apiProvider.$q;

    apiProvider.register('szgc',{
      version:$http.db({
        _id:'s_version',
        idField:'Id',
        dataType:3,
        filter:function () {
          return true
        }
      }).bind(function () {
        return $http.get('http://vkde.sxtsoft.com/api/vkapi/Version').then(function (r) {
          r.data.Id = 'version';
          return r;
        })
      }),
      ProjectSettings:{
        offline:$http.db({
          _id:'s_offline',
          idField:'Id',
          methods:{
            query:{
              dataType:1
            },
            create:{
              upload:true
            },
            delete:{
              delete:true
            }
          }
        }),
        getAllSatus:function (regionType) {
          return $http.get($http.url('/api/tblRegionState', { regionType: regionType }));
        },
        query:function(args) {
          return $http.get($http.url('/api/ProjectSetting', args));
        }
      },
      ProcedureService:{
        getAll:function(args){
          return $http.get($http.url('/api/PProcedure', args));
        },
        getAppImg:$http.db({
          dataType: 3
        }).bind(function(regionId,produceId,roleid){
          return $http.get('/api/projects/' + regionId + '/Procedure/' + produceId + '/APPImgs?roleId=' + roleid);
        }),
        deleteAppImg: function (id) {
          return $http.delete('/api/APPImgs/' + id);
        }
      },
      ProcedureTypeService:{
        getAll:$http.db({
          _id:'s_ProcedureType',
          idField:'Id',
          dataType:5,
          filter:function (item,args) {
            return item.BatchType==args.batchType;
          }
        }).bind(function(args){
          return $http.get($http.url('/api/ProcedureType',args));
        })
      },
      addProcessService:{
        queryByProjectAndProdure2:function(projectid,bathParens){
          return $http.get($http.url('/api/Project/' + projectid + '/baths', bathParens));
        },
        queryByProjectAndProdure3: function (projectid, bathParens) {
          return $http.get($http.url('/api/Project/' + projectid + '/baths1', bathParens));
        },
        delProcess:function(id){
          return $http.delete($http.url('/api/PPBatchRelation/' + id));
        },
        //根据区域树获取验收批数据
        getBatchRelation: $http.db({
          _id:'s_bathlist',
          idField:'Id',
          dataType:5,
          filter:function (item,param) {
            return item.RegionIdTree==param.regionIdTree
            && item.ProcedureId==param.procedureId && (!param.regionId || param.regionId==param.RegionId)
          }
        }).bind(function(parems) {
          return $http.get($http.url('/api/BatchRelation/GetBatchRelationAllHistoryList', parems));
        }),
        getCheckStepByBatchId: $http.db({
          dataType:5
        }).bind(function(batchRelationId, parems) {
          return $http.get($http.url('/api/BatchRelation/' + batchRelationId + '/CheckStep', parems));
        }),
        getAll:function(batchId, parems) {
          return $http.get($http.url('/api/BatchSet/' + batchId + '/PPCheckDataList', parems));
        },
        postCheckData: $http.db({
          _id:'s_checkData',
          idField:'Id',
          upload:true
        }).bind(function (data) {
          return $http.post($http.url('/api/PPBatchRelation/CheckData'), data);
        }),
        getAllCheckDataValue:function(batchId, parems){
          return $http.get($http.url('/api/BatchSet/' + batchId + '/checkDataValues',parems));
        },
        GetBatchsTargetByHistryNo:$http.db({
          _id:'s_batchs_status',
          idField:'Id',
          dataType:5,
          filter:function (item,parems) {
            return item.BatchRelationId==parems.BatchRelationId;
          }
        }).bind(function (parems) {
          return $http.get($http.url('/api/PPCheckData/GetBatchsTargetByHistryNo', parems));
        }),
        GetBatchsTargetByHistry:$http.db({
          _id:'s_batchs_status',
          idField:'Id',
          dataType:5
        }).bind(function (projectId) {
          return $http.get($http.url('/api/PPCheckData/GetBatchsTargetByHistry',{projectId:projectId}));
        })
      },
      UserStashService:{
        get: $http.db({
          dataType: 3
        }).bind(function (key) {
          return $http.get('/api/UserStash?sKey=' + encodeURIComponent(key));
        }),
        create: function (key, value) {
          return $http.post('/api/UserStash', {
            SKey: key,
            SValue: value
          })
        },
        delete: function (key) {
          return $http.delete('/api/UserStash?sKey=' + encodeURIComponent(key));
        }
      },
      ProcedureBathSettingService:{
        create: function (setting) {
          return $http.post('/api/ProcedureBathSetting', setting);
        },
        delete: function (id) {
          return $http.delete('/api/ProcedureBathSetting/' + id);
        },
        query: $http.db({
          _id:'s_batchsetting',
          idField:'Id',
          dataType:5
        }).bind(function () {
          return $http.get('/api/ProcedureBathSetting');
        }),
        get: function (id) {
          return $http.get('/api/ProcedureBathSetting/' + id);
        }
      },
      BatchSetService:{
        getAll:$http.db({
          _id:'s_ProcedureBatchSet',
          idField:function (item) {
            return item.BatchType+'-'+item.ProcedureId
          },
          dataType:5,
          filter:function (item,args) {
            return (item.BatchType|args.batchType)==item.BatchType;
          }
        }).bind(function(args){
          return $http.get($http.url('/api/ProcedureBatchSet' , args));
        },function (result) {
          var n = {
            data:{
              Rows:[]
            }
          };
          result.data.Rows.forEach(function (p) {
            if(!n.data.Rows.find(function (p1) {
                return p1.ProcedureId==p.ProcedureId;
              })){
              n.data.Rows.push(p);
            }
          });
          return n;
        })
      },
      projectMasterListService:{
        //统计工序填报情况(监理)
        GetBatchCount:function(args){
          return $http.get($http.url('/api/Report/GetBatchCount' , args));
        },
        // 3.统计项目的合格工序，不合格工序情况(项目总览)
        GetCountBatchByProject:function (args){
          return $http.get($http.url('/api/Report/GetCountBatchByProject' , args));
        },
        //1.统计班组工序情况(班组)
        GetCountBatchByGroup:function(args){
          return $http.get($http.url('/api/Report/GetCountBatchByGroup' , args));
        },
        // 2.统计验收批情况表(工序总览)
        GetBatchDetails:function(args) {
          return $http.get($http.url('/api/Report/GetBatchDetails' , args));
        },
        //监理验收符合率表
        GetSupervisorAccordRatio:function(args){
          return $http.get($http.url('/api/Report/GetSupervisorAccordRatio', args));
        },
        getFileReportData: function (args) {
          return $http.post('/api/Files/GetFileReportData', args);
        }
      },
      CheckStepService:{
        getAll:$http.db({
          _id:'s_checkstep',
          idField:'Id',
          dataType:5,
          filter:function (item,procedureId,args) {
            return item.ProcedureId == procedureId
            && item.RegionIdTree==args.regionIdTree
          }
        }).bind(function(procedureId,args){
          return $http.get($http.url('/api/procedure/'+procedureId+'/CheckStep' , args));
        }),
        cache:$http.db({
          _id:'s_checkstep',
          idField:'Id',
          dataType:5
        }).bind(function (projectId) {
          return $http.get($http.url('/api/procedure/CheckStep',{regionIdTree:projectId}));
        })
      },
      ProcProBatchRelationService:{
        getbyid: $http.db({
          _id:'s_bathlist',
          dataType:3,
          idField:'Id'
        }).bind(function(id){
          return $http.get('/api/PPBatchRelation/' + id);
        },function (result) {
          return result;
        }),
        getReport: function (regionTreeId,regionType) {
          return $http.get($http.url('/api/PPBatchRelation/GetRelationReportData',  { regionTreeId: regionTreeId,regionType:regionType }))
        }
      },
      TargetService:{
        getAll:$http.db({
          _id:'s_pTarget',
          idField:'Id',
          dataType:5,
          filter:function (item,procedureId) {
            return item.ProcedureId==procedureId;
          }
        }).bind(function(procedureId){
          if(procedureId)
            return $http.get($http.url('/api/PProcedure/' + procedureId + '/EngineeringTarget'));
          else
            return $http.get($http.url('/api/PProcedure/EngineeringTarget/All'));
        })
      },
      ProjectSettingsSevice:{
        query:$http.db({
          _id:'s_projectSttting',
          idField:function (item) {
            if(item.Id)return item.Id;
            return item.UnitId+item.RegionIdTree;
          },
          dataType:5,
          filter:function (item,args) {
            if(args.projectId){
              return args.projectId.indexOf(item.RegionIdTree)!=-1 &&
                args.unitType==item.UnitType;
            }
            else
              return item.UnitId==args.unitId;
          }
        }).bind(function(args){
          return $http.get($http.url('/api/ProjectSetting', args));
        })
      },
      FilesService:{
        get: function (id) {
          return $http.get('/api/Files/' + id);
        },
        group:$http.db({
          _id:'s_files',
          idField:'Id',
          dataType:5,
          filter:function (item,group) {
            return item.GroupId==group;
          }
        }).bind(function (group) {
          return $http.get('/api/Files?group=' + group).then(function (result) {
            result.data.Rows = result.data.Files;
            return result;
          });
        },function (result,cfg,args) {
          return {
            data: {
              Group: args[0],
              Files: result.data.Rows
            }
          };
        }),
        GetGroupLike: function (preGroup) {
          return $http.get($http.url('/api/Files/GetGroupLike', { preGroup: preGroup }));
        },
        post:$http.db({
          _id:'s_files',
          idField:'Id',
          upload:true
        }).bind(function (file) {
          return $http.post('/api/Files/base64',file);
        }),
        delete: $http.db({
          _id:'s_files',
          idField:'Id',
          delete:true
        }).bind(function (id) {
          return $http.delete('/api/Files/' + id);
        }),
        update: function (file) {
          return $http.put('/api/Files/' + file.Id, file);
        },
        GetPrjFilesByFilter: function (regionId, args) {
          return $http.get($http.url('/api/Files/' + regionId+'/GetPrjFilesByFilter', args));
        },
        GetPartionId: function () {
          return $q.$q(function (resolve) {
            resolve({ data: { Rows: [{ Id: 1, desc: '卫生间' }, { Id: 2, desc: '厨房' }, { Id: 4, desc: '主卧' }, { Id: 8, desc: '次卧' }, { Id: 16, desc: '儿童房' }, { Id: 32, desc: '卫生间1' }, { Id: 64, desc: '卫生间2' }] }});
          });
        }
      },
      ReportService:{
        getBuilds:function(projectId){
          var builds=[];
          var api = this.root;
          api.szgc.vanke.project_items({project_id:projectId,page_size:0,page_number:1}).then(function(result){
            var buff=[];
            result.data.data.forEach(function(fq){
             // buff.push(api.szgc.vanke.buildings())
            })
          })
          //console.log('q',apiProvider.$q)
          return $q.$q(function(resolve){
            resolve([
              [50,50,20,10,10,1],//总高度，当前栋最高楼层，第二道工序楼层，第一道工序楼层，起售楼层，栋数
              [50,35,20,10,20,2],
              [50,40,20,10,30,3],
              [50,40,20,10,30,4]
            ]);
          })
        },
        getBuild:function(id){
          return $q.$q(function(resolve){
            resolve({
              'title':'二期工程',
              'data':[50,50,20,10,10,1],
              'start':'2010-10-10',
              'end':'2010-11-11',
              'sale':'2011-01-01'
            });
          })
        }
      },
      ProjectExService:{
        update: function (data) {
          return $http.put('/api/ProjectEx/' + data.ProjectId, data);
        },
        get: $http.db({
          _id:'s_projectEx',
          idField:'ProjectId',
          dataType:3
        }).bind(function (id) {
          return $http.get('/api/ProjectEx/'+id);
        }),
        query:  $http.db({
          _id:'s_projectEx',
          idField:'ProjectId',
          dataType:5
        }).bind(function (status) {
          return $http.get('/api/ProjectEx?status=' + status);
        }),
        queryPno: function (pno) {
          return $http.get('/api/ProjectEx?pno=' + pno);
        },
        building: function (projectid) {
          return $http.get('/api/ProjectEx/building?projectid=' + projectid);
        },
        building2: function (projectid) {
          return $http.get('/api/ProjectEx/building2?projectid=' + projectid);
        },
        building3: function (projectid) {
          return $http.get('/api/ProjectEx/building3?projectid=' + projectid);
        },
        queryById:function(projectId){
          return $http.get('/api/ProjectEx?projectId=' + projectId);
        }
      },
      grpFitRateService:{
        getGrpFitRateByFiter: function (prjIds, skillIds, fromDate, toDate) {
          return $http.post("/api/Report/GetGrpFitRateByFiter", { SkillIds: skillIds, FromDate: fromDate, ToDate: toDate, PrjIds: prjIds });
        }
      },
      parentCompanyFitRateByFiter:{
        getParentCompanyFitRateByFiter: function (prjIds, fromDate, toDate) {
          return $http.post("/api/Report/GetParentCompanyFitRateByFiter", { PrjIds: prjIds,FromDate: fromDate, ToDate: toDate });
        }
      },

      GetFileReportNum:{
        getFileReportData: function (params) {
          return $http.post('/api/Files/GetFileReportData', params);
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
    })
  }
})();
