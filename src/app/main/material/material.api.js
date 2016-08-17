/**
 * Created by leshuangshuang on 16/8/5.
 */
(function(){
  'use strict';

  angular
    .module('app.material')
    .config(config)
  /** @anInject */
  function config(apiProvider){
    var $http = apiProvider.$http,
      $q = apiProvider.$q;

    apiProvider.register('material',{
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
          _id:'Ms_ProcedureType',
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
          _id:'Ms_bathlist',
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
          _id:'Ms_checkData',
          idField:'Id',
          upload:true
        }).bind(function (data) {
          return $http.post($http.url('/api/PPBatchRelation/CheckData'), data);
        }),
        getAllCheckDataValue:function(batchId, parems){
          return $http.get($http.url('/api/BatchSet/' + batchId + '/checkDataValues',parems));
        },
        GetBatchsTargetByHistryNo:$http.db({
          _id:'Ms_batchs_status',
          idField:'Id',
          dataType:5,
          filter:function (item,parems) {
            return item.BatchRelationId==parems.BatchRelationId;
          }
        }).bind(function (parems) {
          return $http.get($http.url('/api/PPCheckData/GetBatchsTargetByHistryNo', parems));
        }),
        GetBatchsTargetByHistry:$http.db({
          _id:'Ms_batchs_status',
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
          _id:'Ms_batchsetting',
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
          _id:'Ms_ProcedureBatchSet',
          idField:function (item) {
            return item.BatchType+'-'+item.ProcedureId
          },
          dataType:5,
          filter:function (item,args) {
            return (item.BatchType|args.batchType)==item.BatchType;
          }
        }).bind(function(args){
          return $http.get($http.url('/api/MLProcedureBatchSet' , args));
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
      CheckStepService:{
        getAll:$http.db({
          _id:'Ms_checkstep',
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
          _id:'Ms_checkstep',
          dataType:3,
          filter:function (item,id) {
            return item.BatchRelationId==id;
          }
        }).bind(function(id){
          return $http.get('/api/PPBatchRelation/' + id);
        },function (result) {
          if(result.data.BatchRelationId){
          }
          return result;
        }),
        getReport: function (regionTreeId) {
          return $http.post('/api/PPBatchRelation/GetRelationReportData', { regionTreeId: regionTreeId })
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
      }
    })
  }
})();

