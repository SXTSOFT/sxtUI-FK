/**
 * Created by jiuyuong on 2016/9/26.
 */
(function (angular, undefined) {
  'use strict';

  angular
    .module('app.plan')
    .config(config);

  /** @ngInject */
  function config(apiProvider) {
    var $http = apiProvider.$http,
      $q = apiProvider.$q;
    apiProvider.register('plan',{
      /** /api/TaskTemplates 模板 **/
      TaskTemplates:{
        GetList:function(param){
          return $http.get($http.url('/api/TaskTemplates',{Skip:param.Skip,Limit:param.Limit}));
        },
        Create:function (param) {
          return $http.post('/api/TaskTemplates', param)
        },
        getItem:function(id){
          return $http.get($http.url('/api/TaskTemplates/'+id));
        },
        update:function(param){
          return $http.put('/api/TaskTemplates/'+param.Id,param);
        },
        delete:function(id){
          return $http.delete('/api/TaskTemplates/'+id);
        }
      },
      TaskFlow:{
        post:function(param){
          return $http.post($http.url('/api/TaskLibrarys/'+param.TaskLibraryId+'/TaskFlows'),param)
        },
        getTaskFlow:function(param){
          return $http.get($http.url('/api/TaskLibrarys/',{Type:param.type,Level:param.level,Skip:param.Skip,Limit:param.Limit}))
        },
        postTaskFlow:function(param){
          return $http.post('/api/TaskLibrarys', param)
        },
        //getFlowById:function(taskFlowId){
        //  return $http.get($http.url('/api/TaskLibrarys/'+taskFlowId))
        //},
        updateFlowById:function(taskFlowId){
          return $http.put($http.url('/api/TaskLibrarys/'+taskFlowId))
        },
        //getFlowTree:function(taskFlowId){
        //  return $http.get($http.url('/api/TaskLibrarys/'+taskFlowId+'/Tree'))
        //},
        deleteFlow:function (id) {
          return $http.delete('/api/TaskFlows/'+id)
        },
        resetTaskFlowRoles:function(id,data){
          return $http.post($http.url('/api/TaskFlows/'+id+'/TaskFlowRoles/Reset'),data)
        },
        resetTaskFlowRolesByType:function(id,type,data){
          return $http.post($http.url('/api/TaskFlows/'+id+'/TaskFlowRoles/Reset/'+type),data)
        },
        getRoleByFlowId:function(id){
          return $http.get($http.url('/api/TaskFlows/'+id+'/TaskFlowRoles'))
        },
        resetTaskFlow:function(id,data){
          return $http.post($http.url('/api/TaskFlows/'+id+'/TaskLibrarys/Reset'),data)
        },
        getSubTasks:function(id){
          return $http.get($http.url('/api/TaskFlows/'+id+'/TaskLibrarys'))
        },
        updateTaskById:function(data){
          return $http.put($http.url('/api/TaskFlows/'+data.Id),data)
        }
      },
      BuildPlan:{
        getList:function(param){
          return $http.get($http.url('/api/BuildingPlans',{Skip:param.Skip,Limit:param.Limit}))
        },
        post:function(params){
          return $http.post($http.url('/api/BuildingPlans'),params)
        },
        update:function (id,params) {
          return $http.put($http.url('/api/BuildingPlans/'+id),params)
        },
        getBuildPlanRoleUsers:function(id){
          return $http.get($http.url('/api/BuildingPlans/'+id+'/BuildingPlanRoleUsers'))
        },
        getBuildPlanFlowTree:function(id){
          return $http.get($http.url('/api/BuildingPlans/'+id+'/FlowTree'))
        },
        flowTasksReset:function (id,items) {
          return $http.post('/api/BuildingPlans/'+id+'/BuildingPlanFlowTasks/Reset',items)
        },
        getBuildingPlanRoles:function (id) {
          return $http.get('/api/BuildingPlans/'+id+'/BuildingPlanRoles')
        },
        getBuildingPlanRoleUsers:function(id){
          return $http.get('/api/BuildingPlans/'+id+'/BuildingPlanRoleUsers')
        },
        buildingRolesReset:function (id,items) {
          return $http.post('/api/BuildingPlans/'+id+'/BuildingPlanRoleUsers/Reset',items)
        },
        generate:function (id) {
          return $http.post('/api/BuildingPlans/'+id+'/Generate',{id:id});
        },
        deleteBuildPlan:function(id){
          return $http.delete('/api/BuildingPlans/'+id);
        }
      },
      /** /api/TaskLibrary 任务 **/
      TaskLibrary:{
        create:function (taskLibrary) {
          return $http.post('/api/TaskLibrarys',taskLibrary);
        },
        update:function (taskLibrary) {
          var item= angular.extend(taskLibrary,{Id:taskLibrary.TaskLibraryId});

          return $http.put('/api/TaskLibrarys/'+taskLibrary.TaskLibraryId,item);
        },
        delete:function(id){
          return $http.delete($http.url('/api/TaskLibrarys/'+id))
        },
        GetList:function(param){
          return $http.get($http.url('/api/TaskLibrarys',param));
        },
        getItem:function(id){
          return $http.get($http.url('/api/TaskLibrarys/'+id));
        },
        /**
         *
         * @param taskId 任务ID
         * @returns {object}
         */
        getTaskFlow:function (taskId) {
          return $http.get($http.url('/api/TaskLibrarys/'+taskId+'/Tree'));
        }
      },
      compensate:{
        createBc:function (values) {
          return $http.post('/api/Compensates', values);
        },
        getList:function(param){
          return $http.get($http.url('/api/Compensates',{Skip:param.Skip,Limit:param.Limit}));
        },
        getCompensate:function(id){
          return $http.get($http.url('/api/Compensates/'+id));
        },
        putCompensate:function(data){
          return $http.put('/api/Compensates/'+data.CompensateId,data);
        },
        delete:function(id){
          return $http.delete('/api/Compensates/'+id);
        },
        getBaseRegion:function(){
          return $http.get($http.url('/api/SysDataDictionarys?ddicType=SXT.EMBD.Base.Region'));
        },
        postAreaReset:function (param) {
          return $http.post('/api/Compensates/' + param.id + '/Area/Reset', param.areaIds);
        }
      },
      UserGroup:{
        create:function (data) {
          return $http.post('/api/UserGroup',data);
        },
        query:function (param) {
          return $http.get($http.url('/api/UserGroup',param))
        },
        //reset:function(param){
        //  return $http.post($http.url('/api/TaskFlowRoles/Reset'),param)
        //}
      },
      TaskFlowRole:{
        queryByFlowId:function (flowId) {
          return $http.get('/api/TaskFlowRoles/'+flowId);
        }
      },
      /**  /api/SysDataDictionary 获取集字典 **/
      SysDataDictionary:{
        Get:function(ddicType){
          var param = {Skip:0,Limit:100,ddicType:ddicType};
          return $http.get($http.url('/api/SysDataDictionarys',param));
        }
      },
      Task:{
        query:function (query) {
          return $http.get($http.url('/api/Task',query));
        },
        Categories:{
          query:function () {
            return $q(function (resolve,reject) {
              resolve({
                data:[
                  {
                    name:'商业',
                    children:[
                      {
                        name:'多层办公楼、酒店'
                      },
                      {
                        name:'高层办公楼、酒店'
                      },{
                        name:'商场'
                      }
                    ]
                  },
                  {name:'住宅',children:[
                    {name:'别墅'},
                    {name:'多层'},
                    {name:'小高层'},
                    {name:'高层'},
                    {name:'超高层'}
                  ]},
                  {name:'关键节点',children:[
                    {name:'基坑支护'},
                    {name:'桩基础'},
                    {name:'土方'},
                    {name:'基础结构'},
                    {name:'屋面结构'},
                    {name:'内外饰面与落架'},
                    {name:'公装/室外'}
                  ]},
                  {
                    name:'其它'
                  }
                ]
              })
            })
          }
        }
      },
      users:{
        query:function(){
          return $http.get($http.url('/api/User'));
        }
      }

    });
  }
})(angular,undefined);
