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
        url: '',
        templateUrl: 'app/main/xhsc/xxjd/xxjdmain.html',
        controller: 'xxjdmainController as vm'
      })
      .state('app.xhsc.xxjd.xxjdbuildings', {
        noBack: true,
        sendBt: false,
        rightArrow: false,
        leftArrow: false,
        title: '工序验收',
        url: '/xxjdbuildings',
        templateUrl: 'app/main/xhsc/xxjd/xxjdbuildings.html',
        controller: 'xxjdbuildingsController as vm',
        resolve:{
          builds:['$q',function($q){
            return $q(function(resolve){
              resolve({
                floorNum:44,
                builds:[{
                  area: "",
                  building_id: "55fa5c4beb5548bc2631085d",
                  engineering: {
                    status: "completed"
                  },
                  floors: 40,
                  gx1: 20,
                  gx2: 0,
                  name: "3栋商业",
                  project: {
                    project_id: "52ba76053cf7fbe61100001b",
                    title: "深圳留仙洞项目"
                  },
                  project_item: {
                    project_item_id: "54f90e297e162d0416cdb7a9",
                    title: "留仙洞一期（3＃）"
                  },
                  sellLine: 0.6,
                  summary: "",
                  total_floor: 40,
                }]
              })
            })
          }]
        }
      })


  }
})();
