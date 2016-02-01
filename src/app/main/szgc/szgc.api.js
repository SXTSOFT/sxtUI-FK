/**
 * Created by zhangzhaoyong on 16/1/28.
 */
(function(){
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


      }
    })
  }
})();
