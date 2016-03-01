/**
 * Created by zhangzhaoyong on 16/1/28.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .config(config)

  /** @ngInject */
  function config(apiProvider){
    var $http = apiProvider.$http,$q = apiProvider.$q;

    apiProvider.register('szgc',{
      ProjectSettings:{
        query:function(args) {
          return $http.get($http.url('/api/ProjectSetting', args));
        }
      },
      ProcedureService:{
        getAll:function(args){
          return $http.get($http.url('/api/PProcedure', args));
        },
        getAppImg:function(regionId,produceId,roleid){
          return $http.get('/api/projects/' + regionId + '/Procedure/' + produceId + '/APPImgs?roleId=' + roleid);
        }
      },
      ProcedureTypeService:{
        getAll:function(args){
          return $http.get($http.url('/api/ProcedureType',args));
        }
      },
      addProcessService:{
        queryByProjectAndProdure2:function(projectid,bathParens){
          return $http.get($http.url('/api/Project/' + projectid + '/baths', bathParens));
        },
        delProcess:function(id){
          return $http.delete('/api/PPBatchRelation/' + id);
        },
        //根据区域树获取验收批数据
        getBatchRelation: function(parems) {
          return $http.get($http.url('/api/BatchRelation/GetBatchRelationAllHistoryList', parems));
        },
        getCheckStepByBatchId: function(batchRelationId, parems) {
          return $http.get($http.url('/api/BatchRelation/' + batchRelationId + '/CheckStep', parems));
        },
        getAll:function(batchId, parems) {
          return $http.get($http.url('/api/BatchSet/' + batchId + '/PPCheckDataList', parems));
        }
      },
      BatchSetService:{
        getAll:function(args){
          return $http.get($http.url('/api/ProcedureBatchSet' , args));
        }
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
        }
      },
      CheckStepService:{
        getAll:function(procedureId,args){
          return $http.get($http.url('/api/procedure/'+procedureId+'/CheckStep' , args));
        }
      },
      ProcProBatchRelationService:{
        getbyid:function(id){
          return $http.get('/api/PPBatchRelation/' + id);
        }
      },
      TargetService:{
        getAll:function(procedureId){
          return $http.get($http.url('/api/PProcedure/' + procedureId + '/EngineeringTarget'));
        }
      },
      ProjectSettingsSevice:{
        query:function(args){
          return $http.get($http.url('/api/ProjectSetting', args));
        }
      },
      FilesService:{
        get: function (id) {
          return $http.get('/api/Files/' + id);
        },
        group: function (group) {
          return $http.get('/api/Files?group=' + group);
        },
        delete: function (id) {
          return $http.delete('/api/Files/' + id);
        },
        update: function (file) {
          return $http.put('/api/Files/' + file.Id, file);
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
        get: function (id) {
          return $http.get('/api/ProjectEx/'+id);
        },
        query: function (status) {
          return $http.get('/api/ProjectEx?status=' + status);
        },
        building: function (projectid) {
          return $http.get('/api/ProjectEx/building?projectid=' + projectid);
        },
        building2: function (projectid) {
          return $http.get('/api/ProjectEx/building2?projectid=' + projectid);
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
