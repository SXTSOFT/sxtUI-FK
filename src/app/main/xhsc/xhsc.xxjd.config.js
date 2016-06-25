/**
 * Created by jiuyuong on 2016/6/22.
 */
/**
 * Created by jiuyuong on 2016/3/30.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
  {
    // State
    $stateProvider
      .state('app.xhsc.xxjd',{
        url:'/xxjd',
        abstract:true,
        views:{
          'content@app':{
            template:'<ui-view flex layout="column"></ui-view>'
          }
        }
      })
      .state('app.xhsc.xxjd.xxjdmain', {
        noBack: true,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        title: '工序验收',
        url: '/{projectId}/{projectName}',
        templateUrl: 'app/main/xhsc/xxjd/xxjdmain.html',
        controller: 'xxjdmainController as vm'
      })
      .state('app.xhsc.xxjd.xxjdbuildings', {
        noBack: true,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        title: '项目名称',
        url: '/xxjdbuildings/{projectId}/{projectName}',
        templateUrl: 'app/main/xhsc/xxjd/xxjdbuildings.html',
        controller: 'xxjdbuildingsController as vm',
        resolve:{
          builds:['$q',function($q){
            return $q(function(resolve){
              resolve({
                builds:[{"buildingId":"0000100002","floors":6,"gx1":4,"name":"留仙洞2栋","project":{"projectId":"00001","projectName":"深圳留仙洞项目"},"projectItem":{"projectItemId":"0000100002","proectItemName":"留仙洞2期"},"sellLine":0.6,"summary":""},
                  {"buildingId":"0000100002","floors":12,"gx1":8,"name":"留仙洞2栋","project":{"projectId":"00001","projectName":"深圳留仙洞项目"},"projectItem":{"projectItemId":"0000100002","proectItemName":"留仙洞2期"},"sellLine":0.6,"summary":""},
                  {"buildingId":"0000100002","floors":18,"gx1":12,"name":"留仙洞2栋","project":{"projectId":"00001","projectName":"深圳留仙洞项目"},"projectItem":{"projectItemId":"0000100002","proectItemName":"留仙洞2期"},"sellLine":0.6,"summary":""},
                  {"buildingId":"0000100002","floors":24,"gx1":16,"name":"留仙洞2栋","project":{"projectId":"00001","projectName":"深圳留仙洞项目"},"projectItem":{"projectItemId":"0000100002","proectItemName":"留仙洞2期"},"sellLine":0.6,"summary":""},
                  {"buildingId":"0000100002","floors":30,"gx1":20,"name":"留仙洞2栋","project":{"projectId":"00001","projectName":"深圳留仙洞项目"},"projectItem":{"projectItemId":"0000100002","proectItemName":"留仙洞2期"},"sellLine":0.6,"summary":""},
                  {"buildingId":"0000100002","floors":36,"gx1":24,"name":"留仙洞2栋","project":{"projectId":"00001","projectName":"深圳留仙洞项目"},"projectItem":{"projectItemId":"0000100002","proectItemName":"留仙洞2期"},"sellLine":0.6,"summary":""},
                  {"buildingId":"0000100002","floors":42,"gx1":28,"name":"留仙洞2栋","project":{"projectId":"00001","projectName":"深圳留仙洞项目"},"projectItem":{"projectItemId":"0000100002","proectItemName":"留仙洞2期"},"sellLine":0.6,"summary":""},
                  {"buildingId":"0000100002","floors":48,"gx1":32,"name":"留仙洞2栋","project":{"projectId":"00001","projectName":"深圳留仙洞项目"},"projectItem":{"projectItemId":"0000100002","proectItemName":"留仙洞2期"},"sellLine":0.6,"summary":""},
                  {"buildingId":"0000100002","floors":54,"gx1":36,"name":"留仙洞2栋","project":{"projectId":"00001","projectName":"深圳留仙洞项目"},"projectItem":{"projectItemId":"0000100002","proectItemName":"留仙洞2期"},"sellLine":0.6,"summary":""},
                  {"buildingId":"0000100002","floors":60,"gx1":40,"name":"留仙洞2栋","project":{"projectId":"00001","projectName":"深圳留仙洞项目"},"projectItem":{"projectItemId":"0000100002","proectItemName":"留仙洞2期"},"sellLine":0.6,"summary":""}]
              })
            })
          }]
        }
      })
      .state('app.xhsc.xxjd.xxjdbuilding', {
        noBack: true,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        title: '项目名称',
        url: '/xxjdbuilding/{name}/{id}',
        templateUrl: 'app/main/xhsc/xxjd/xxjdbuilding.html',
        controller: 'xxjdbuildingController as vm',
        resolve:{
          details:['remote',function(remote){
            return remote.Assessment.EngineeringProcess.getWorkingProcess().then(function(result){
                var pageload = {
                  name: '',
                  datapoints: []
                }, gx = [
                  { x: '橱柜', id: '1c419fcc-24a9-4e38-9132-ce8076051e6a',color:'rgba(193,35,43,1)' },
                  { x: '油漆', id: 'a3776dab-9d80-4ced-b229-e6bfc51f7988',color:'rgba(181,195,52,1)' },
                  { x: '瓷砖', id: '702d964d-cd97-4217-8038-ce9b62d7584b',color:'rgba(252,206,16,1)' },
                  { x: '墙板', id: '8bfc6626-c5ed-4267-ab8f-cb2294885c25', color:'rgba(193,35,43,1)'},
                  { x: '门窗', id: '51bb20e2-92a2-4c9f-85a9-c4545e710cf0',color:'rgba(181,195,52,1)' }
                ]

                result.data.Rows.forEach(function (r) {
                  var g = gx.find(function (g) { return g.id == r.ProcedureId; });
                  if (g) {
                    g.y = r.gx1;
                  }
                  console.log('g',g)
                });
                var tempdata = [];
                tempdata = gx;

                tempdata.forEach(function(item){
                  if(!item.y){
                    // pageload.datapoints.push(item);
                    item.color = null;
                  }
                  pageload.datapoints.push(item);
                })
                var char = angular.copy(pageload);
                //char.datapoints.splice(0, 1);
              console.log('char',char)
                return [char];
            })
          }]
        }
      })

  }
})();
