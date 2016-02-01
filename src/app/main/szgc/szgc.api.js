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

    var $http = apiProvider.$http;
    apiProvider.register('szgc',{
      ProjectSettings:{
        query:function(args) {
          return $http.get($http.url('/api/ProjectSetting', args));
        }
      },
      ProcedureService:{
        getAll:function(args){
          return $http.get($http.url('/api/PProcedure', args));
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
        }
      },
      CheckStepService:{
        getAll:function(procedureId,args){
          return $http.get($http.url('/api/procedure/'+procedureId+'/CheckStep' , args));
        }
      }
    })
  }
})();
