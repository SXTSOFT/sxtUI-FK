(function ()
{
    'use strict';

    config.$inject = ["$translatePartialLoaderProvider"];
    angular
        .module('app.quick-panel', [])
        .config(config);

    /** @ngInject */
    function config($translatePartialLoaderProvider)
    {
        $translatePartialLoaderProvider.addPart('app/quick-panel');
    }
})();

(function ()
{
    'use strict';

    ChatTabController.$inject = ["api", "$timeout"];
    angular
        .module('app.quick-panel')
        .controller('ChatTabController', ChatTabController);

    /** @ngInject */
    function ChatTabController(api, $timeout)
    {
        var vm = this;

        // Data
        vm.chat = {};
        vm.chatActive = false;
        vm.replyMessage = '';

        api.quickPanel.contacts.get({}, function (response)
        {
            vm.contacts = response.data;
        });

        // Methods
        vm.toggleChat = toggleChat;
        vm.reply = reply;

        //////////

        function toggleChat(contact)
        {
            vm.chatActive = !vm.chatActive;

            if ( vm.chatActive )
            {
                vm.replyMessage = '';
                vm.chat.contact = contact;
                scrollToBottomOfChat(0);
            }
        }

        function reply()
        {
            if ( vm.replyMessage === '' )
            {
                return;
            }

            if ( !vm.chat.contact.dialog )
            {
                vm.chat.contact.dialog = [];
            }

            vm.chat.contact.dialog.push({
                who    : 'user',
                message: vm.replyMessage,
                time   : 'Just now'
            });

            vm.replyMessage = '';

            scrollToBottomOfChat(400);
        }

        function scrollToBottomOfChat(speed)
        {
            var chatDialog = angular.element('#chat-dialog');

            $timeout(function ()
            {
                chatDialog.animate({
                    scrollTop: chatDialog[0].scrollHeight
                }, speed);
            }, 0);

        }
    }

})();
/**
 * Created by jiuyuong on 2016/1/21.
 */
(function ()
{
  'use strict';

  config.$inject = ["$stateProvider", "$translatePartialLoaderProvider", "msNavigationServiceProvider"];
  angular
    .module('app.szgc', ['app.core','angular-echarts','angularFileUpload'])
    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
  {
    // State
    $stateProvider
      .state('app.szgc', {
        abstract:true
      })
      .state('app.szgc.home',{
        noBack:true,
        title :'万科数字工程',
        url   :'/',
        views :{
          'content@app':{
            templateUrl : 'app/main/szgc/home/home.html',
            controller:'SzgcHomeController as vm'
          }
        }
      })
      .state('app.szgc.project',{
        //title :'形象进度',
        url   :'/home/jd/{pid}/{pname}',
        views :{
          'content@app':{
            templateUrl : 'app/main/szgc/home/link2.html',
            controller:'SzgcyhydController as vm'
          }
        }
      })
      .state('app.szgc.project.buildinglist',{
        //title :'形象进度',
        url   :'/items/{projectType}/{itemId}/{itemName}',
        views :{
          'content@app':{
            templateUrl : 'app/main/szgc/home/link3.html',
            controller:'SzgcyhydLink3Controller as vm',
            resolve:{
              builds:['$stateParams', 'api','$q',function($stateParams, api,$q){
                return $q(function(resolve){
                  api.szgc.ProjectExService.queryPno($stateParams.pid).then(function (exs) {
                    api.szgc.vanke.buildingsInfo ($stateParams.projectType, $stateParams.itemId).then (function (data) {
                      api.szgc.ProjectExService.building ($stateParams.pid + '>' + $stateParams.itemId).then (function (data2) {
                        var mx = 0;
                        data.data.data.forEach (function (item) {
                          item.floors = item.total_floor;
                          if (mx < item.total_floor)
                            mx = item.floors;
                          var fd = data2.data.Rows.find (function (it) {
                              return it.RegionId == item.building_id;
                            }) || {};
                          item.gx1 = fd.gx1 || 0;
                          item.gx2 = fd.gx2 || 0;
                          item.summary = fd.AreaRemark || '';
                          var sel = exs.data.Rows.find(function (it) { return it.ProjectId == item.building_id; });
                          item.sellLine = parseInt((sel && sel.SellLine) ? (sel.SellLine.indexOf('%') == -1 ? parseInt(sel.SellLine) :
                          parseFloat(sel.SellLine.replace('%', '')) / 100 * item.floors) : -1000);
                          if (isNaN(item.sellLine)) {
                            item.sellLine = -1000;
                          }
                        });
                        resolve ({
                          floorNum: mx,
                          builds: data.data.data
                        });
                      });
                    })
                  });
                })
              }]
            }
          }
        }
      })
      .state('app.szgc.project.buildinglist.building',{
        //title :'形象进度',
        url   :'/building/{buildId}/{buildName}/{floors}',
        views :{
          'content@app':{
            templateUrl : 'app/main/szgc/home/buildingdetail.html',
            controller:'SzgcbuilddetailController as vm',
            resolve:{
              details:['$stateParams','api',function($stateParams,api){
                return api.szgc.ProjectExService.building2($stateParams.pid + '>' + $stateParams.itemId + '>' + $stateParams.buildId).then(function (result) {
                    var pageload = {
                      name: '',
                      datapoints: []
                    }, gx = [
                      //{ x: '主体', id: '953cea5b-b6fb-4eb7-b019-da391f090efd' },
                      { x: '橱柜', id: '1c419fcc-24a9-4e38-9132-ce8076051e6a',color:'rgba(193,35,43,1)' },
                      { x: '油漆', id: 'a3776dab-9d80-4ced-b229-e6bfc51f7988',color:'rgba(181,195,52,1)' },
                      { x: '瓷砖', id: '702d964d-cd97-4217-8038-ce9b62d7584b',color:'rgba(252,206,16,1)' },
                      { x: '墙板', id: '8bfc6626-c5ed-4267-ab8f-cb2294885c25', color:'rgba(193,35,43,1)'},
                      { x: '门窗', id: '51bb20e2-92a2-4c9f-85a9-c4545e710cf0',color:'rgba(181,195,52,1)' }
                      //{ x: '橱柜', id: '1c419fcc-24a9-4e38-9132-ce8076051e6a', color: 'rgba(193,35,43,1)' },
                      //{ x: '油漆', id: 'a3776dab-9d80-4ced-b229-e6bfc51f7988', color: 'rgba(181,195,52,1)' },
                      //{ x: '瓷砖', id: '702d964d-cd97-4217-8038-ce9b62d7584b', color: 'rgba(252,206,16,1)' },
                      //{ x: '墙板', id: '8bfc6626-c5ed-4267-ab8f-cb2294885c25', color: 'rgba(193,35,43,1)' },
                      //{ x: '门窗', id: '51bb20e2-92a2-4c9f-85a9-c4545e710cf0', color: 'rgba(181,195,52,1)' }
                    ]

                    result.data.Rows.forEach(function (r) {
                      var g = gx.find(function (g) { return g.id == r.ProcedureId; });
                      if (g) {
                        g.y = r.gx1;
                      }
                    });

                    //pageload.datapoints = gx;
                    var tempdata = [];
                      tempdata = gx;
                  console.log(gx)
                    tempdata.forEach(function(item){
                      if(!item.y){
                       // pageload.datapoints.push(item);
                        item.color = null;
                      }
                      pageload.datapoints.push(item);
                    })
                    var char = angular.copy(pageload);
                    //char.datapoints.splice(0, 1);
                    return [char];
                  });
              }]
            }
          }
        }
      })
      .state('app.szgc.project.view', {
        title :'查看详细',
        url: '/{bathid}',
        controller: 'viewBathDetailController as vm',
        templateUrl: 'app/main/szgc/report/viewBathDetail-app-go.html'
      })
      .state('app.szgc.yhyd',{
        url   :'/home/yhyd/{pid}/{pname}/{idTree}/{type}/{seq}',
        //url:'/home/yhyd/{regionId}/{regionType}/{roomType}/{procedureId}/{regionName}',
        views :{
          'content@app':{
            templateUrl : 'app/main/szgc/home/link.html',
            controller:'SzgcyhydController as vm'
          }
        }
      })
      .state('app.szgc.yhyd.records',{
        url   :'/records',
        //url:'/home/yhyd/{regionId}/{regionType}/{roomType}/{procedureId}/{regionName}',
        views :{
          'content@app':{
            templateUrl : 'app/main/szgc/home/link_records.html',
            controller:'SzgcyhydRecordsController as vm'
          }
        }
      })
      .state('app.szgc.report', {
        noBack:true,
        title    :'报表',
        url      : '/report',
        views    : {
          'content@app': {
            templateUrl: 'app/main/szgc/report/report.html',
            controller: 'SzgcReportController as vm'
          }
        }
      })
      .state('app.szgc.ybgcResultT1', {
        noBack:true,
        title    :'一户一档',
        url      : '/ybgcResultT1',
        views    : {
          'content@app': {
            controller: 'yhydController as vm',
            templateUrl: 'app/main/szgc/report/yuyd.html'
          }
        }
      })
      .state('app.szgc.report.viewBath', {
        title :'质量总表',
        url: '/viewBath',
        controller: 'viewBathController as vm',
        templateUrl: 'app/main/szgc/report/viewBath-app.html'
      })
      .state('app.szgc.report.ybgcResult', {
        title :'隐蔽工程',
        url: '/viewYbgc',
        controller: 'ybgcController as vm',
        templateUrl: 'app/main/szgc/report/ybgcResult.html'
      })
      .state('app.szgc.project.ybgcResultT', {
        title :'隐蔽工程',
        url: '/viewYbgc',
        controller: 'yhydController as vm',
        templateUrl: 'app/main/szgc/report/yuyd.html'
      })
      .state('app.szgc.report.picView', {
        title :'隐蔽工程详情',
        url: '/picView/{regionId}/{regionType}/{roomType}/{procedureId}/{regionName}',
        controller: 'ybgcyhydController as vm',
        templateUrl: 'app/main/szgc/report/ybgcyhyd.html'
      })
      .state('app.szgc.report.viewBath.view', {
        title :'查看详细',
        url: '/{bathid}',
        controller: 'viewBathDetailController as vm',
        templateUrl: 'app/main/szgc/report/viewBathDetail-app-go.html'
      })

      .state('app.szgc.report.batchCount', {
        title :'项目填报情况统计表',
        url:'/batchCount',
        controller: 'batchCountController as vm',
        templateUrl: 'app/main/szgc/report/batchCount-app.html'
      })
      .state('app.szgc.report.batchRaio', {
        title :'班组验收合格率对比',
        url:'/batchRaio',
        controller: 'batchRaioController as vm',
        templateUrl: 'app/main/szgc/report/batchRaio-app.html',
        resolve: {
          _projects:['api',function(api){
            return api.szgc.vanke.projects({
              page_size: 1000,
              page_number: 1
            })
          }],
          _skills:['api',function(api){
            console.log('api',api)
            return api.szgc.vanke.skills({ page_number: 1, page_size: 10000 });
          }]
        }
      })
      .state('app.szgc.report.allRaio', {
        title:'总承包单位验收合格率',
        url:'/allRaio',
        controller: 'allRaioController as vm',
        templateUrl: 'app/main/szgc/report/allRaio-app.html',
        resolve: {
          _projects:['api',function(api){
            return api.szgc.vanke.projects({
              page_size: 1000,
              page_number: 1
            })
          }]
        }
      })
      .state('app.szgc.report.projectMasterList', {
        title:'项目班组总览表',
        url:'/projectMasterList',
        controller: 'projectMasterListController1 as vm',
        templateUrl: 'app/main/szgc/report/projectMasterList-app.html'
      })
      .state('app.szgc.report.supCheckResult', {
        title:'监理验收符合率统计',
        url:'/supCheckResult',
        controller: 'supCheckResultController as vm',
        templateUrl: 'app/main/szgc/report/supCheckResult-app.html',
        resolve: {
          _projects:['api',function(api){
            return api.szgc.vanke.projects({
              page_size: 1000,
              page_number: 1
            })
          }]
        }
      })
      .state('app.szgc.settings',{
        noBack:true,
        title:'设置',
        url:'/settings',
        views :{
          'content@app':{
            controller:'SzgcSettingsController as vm',
            templateUrl:'app/main/szgc/settings/settings.html',
            resolve:{
              profile:['api',function(api){
                //api.useNetwork(0);
                return api.szgc.vanke.profile().then(function (r) {
                  //api.resolveNetwork();
                  return r;
                });
              }]
            }
          }
        }
      })
      .state('app.szgc.ys',{
        noBack:true,
        title:'验收',
        url:'/ys',
        views :{
          'content@app':{
            controller:'MyProcessController as vm',
            templateUrl:'app/main/szgc/ys/myProcess-app.html'
          }
        }
      })
      .state('app.szgc.ys.add', {
        title:'添加验收',
        url: '/new/{projectid}/{name}/{batchId}/{procedureTypeId}/{procedureId}/{type}/{idTree}/{procedureName}/{nameTree}/{flag}',
        controller: 'AddProcessController as vm',
        templateUrl: 'app/main/szgc/ys/addProcess-app.html'
      })
      .state('app.szgc.ys.addnew', {
        title:'添加验收',
        url: '/newadd/{projectid}/{name}/{batchId}/{procedureTypeId}/{procedureId}/{type}/{idTree}/{procedureName}/{nameTree}/{flag}',
        controller: 'AddProcessNewController as vm',
        templateUrl: 'app/main/szgc/ys/addProcess-appnew.html'
      })
      .state('app.szgc.ys.upload', {
        title:'添加验收',
        url: '/upload/{projectid}/{name}/{type}/{idTree}/{nameTree}',
        controller: 'uploadProcessController as vm',
        templateUrl: 'app/main/szgc/ys/upload.html'
      })


    // Translation
    //$translatePartialLoaderProvider.addPart('app/main/auth');

    // Navigation
    msNavigationServiceProvider.saveItem('szgc', {
      title : '数字工程',
      group : true,
      weight: 1
    });

    msNavigationServiceProvider.saveItem('szgc.home', {
      title    : '首页',
      icon     : 'icon-home',
      state    : 'app.szgc.home',
      weight   : 1
    });

    msNavigationServiceProvider.saveItem('szgc.report', {
      title    : '报表',
      icon     : 'icon-chart-bar',
      state    : 'app.szgc.report',
      weight   : 1
    });

    msNavigationServiceProvider.saveItem('szgc.ys', {
      title    : '验收',
      icon     : 'icon-apps',
      state    : 'app.szgc.ys',
      weight   : 1
    })

    msNavigationServiceProvider.saveItem('setting', {
      title : '系统管理',
      group : true,
      weight: 1
    });

    msNavigationServiceProvider.saveItem('setting.ys', {
      title    : '工序管理',
      icon     : 'icon-tile-four',
      state    : 'app.szgc.home3',
      weight   : 1
    })

    msNavigationServiceProvider.saveItem('setting.ys1', {
      title    : '项目权限',
      icon     : 'icon-account-switch',
      state    : 'app.szgc.home1',
      weight   : 1
    })

    msNavigationServiceProvider.saveItem('setting.ys2', {
      title    : '系统配置',
      icon     : 'icon-cog',
      state    : 'app.szgc.home2',
      weight   : 1
    })
  }
})();

/**
 * Created by jiuyuong on 2016/4/5.
 */
(function(){
  'use strict';

  uploadProcessController.$inject = ["$scope", "$stateParams"];
  angular
    .module('app.szgc')
    .controller('uploadProcessController',uploadProcessController);

  /** @ngInject */
  function uploadProcessController($scope,$stateParams){
    var vm = this;
    $scope.project = {
      files: []
    }
    $scope.project.pid = $stateParams.idTree;
    $scope.project.bid = $stateParams.idTree.split('>')[1];
    $scope.project.gid = $scope.project.bid + '-' + $stateParams.type;

    $scope.$watch('project.oid', function (a, b) {
      if ($scope.project.oid) {
        $scope.project.fid = $scope.project.pid.replace(/\>/g, '-') + '-' + $scope.project.oid;
        $scope.project.sid = 'sub-'+ $scope.project.pid.replace(/\>/g, '-') + '-' + $scope.project.oid;
      }
    });
  }
})();


/**
 * Created by zhangzhaoyong on 16/2/1.
 */
/**
 * Created by zhangzhaoyong on 16/2/1.
 */
(function(){
  'use strict';

  MyProcessController.$inject = ["$scope", "api", "utils", "$state", "$q", "sxt", "xhUtils", "$timeout"];
  angular
    .module('app.szgc')
    .controller('MyProcessController',MyProcessController);

  /** @ngInject */
  function MyProcessController($scope, api, utils, $state,$q,sxt,xhUtils,$timeout){

    var vm = this;
    $scope.is = function(route){
      return $state.is(route);
    }
    $scope.delProcess = function(BatchRelationId) {
      utils.confirm(null, '确认删除验收批吗？',
        function() {
          $scope.delmyProcess(BatchRelationId);
        });
    };

    $scope.delmyProcess = function(BatchRelationId) {
      api.szgc.addProcessService.delProcess(BatchRelationId).then(function(result) {

        if (result.status == 200) {
          $scope.project.filter(true);
          utils.alert('删除成功！')
        }
      });
    };

    $scope.getNetwork = function () {
      return api.getNetwork();
    }


    $scope.isPartner = api.szgc.vanke.isPartner();
    $scope.roleId = api.szgc.vanke.getRoleId();
    $scope.project = {
      isMore: true,
      states: [{
        id: -1,
        color: '',
        title: '全部',
        selected: true,
      }, {
        id: 0,
        color: 'slategrey',
        title: '未验收',
        selected: true,
        c: 0
      }, {
        id: 1,
        color: 'brown',
        title: '初验不合格',
        selected: true,
        c: 0
      }, {
        id: 2,
        color: 'green',
        title: '初验合格',
        selected: true,
        c: 0
      }, {
        id: 3,
        color: 'red',
        title: '复验不合格',
        selected: true,
        c: 0
      }, {
        id: 4,
        color: 'blue',
        title: '复验合格',
        selected: true,
        c: 0
      }],
      onQueryed: function(data) {
        $scope.project.data = data;
        //$scope.project.filter();
      },
      //filterBatch: function (sources) {
      //    console.log('sources', sources);
      //},
      filter: function(reload) {
        vm.loading = true;
        if (!$scope.project.procedureId || !$scope.project.data || !$scope.project.data.items) return;
        if (reload === true || ($scope.project.data && !$scope.project.data.fd)) {
          $scope.project.data.fd = true;
          api.szgc.addProcessService.getBatchRelation({
            procedureId:$scope.project.procedureId,
            regionIdTree: $scope.project.idTree,
            Status: 4
          }).then(function(result) {
            $scope.project.data.total = $scope.project.data.items.length;
            var checkedCount = 0,
              cmpCount = 0;
            var results = [];

            $scope.project.data.items.forEach(function(item2) {
              var item = null; //results.find(function (k) { return k.RegionId == it.RegionId && k.BatchNo == it.BatchNo });
              if (!item) {
                item = utils.copy(item2);
                item.state = 0;
                item.checkedCount = 0;
                item.Remark = item.BatchRelationId = item.MinPassRatio = item.CheckDate = item.CheckWorkerName = item.BatchNo = null;
                results.push(item);
              }

              if (result.data.Rows) {
                result.data.Rows.forEach(function (it) {
                  var qd = item;
                  if (it.RegionId == qd.$id) {
                    if (!qd.BatchNo)
                      qd.BatchNo = it.BatchNo;
                    else if (qd.BatchNo != it.BatchNo) {
                      qd = results.find(function (k) {
                        return k.$id == it.RegionId && k.BatchNo == it.BatchNo
                      });
                      if (!qd) {
                        qd = utils.copy(item2);
                        qd.BatchRelationId = it.BatchRelationId;
                        qd.BatchNo = it.BatchNo;
                        qd.state = 0;
                        qd.Remark = it.Remark;
                        qd.checkedCount = 0;
                        qd.MinPassRatio = qd.CheckDate = qd.CheckWorkerName = null;
                        results.push(qd);
                      }
                    }
                    //if (!it.CheckNo) {

                    //} else if (it.CheckNo == 1) {
                    //    qd.state = it.AllResult ? 2 : 1;
                    //} else {
                    //    qd.state = it.AllResult ? 4 : 3;
                    //}
                    qd.state = it.ECCheckResult;
                    qd.checkedCount = it.JLCount + it.WKCount + it.ZbCount;
                    qd.MinPassRatio0 = it.ZbLast || it.ZbFirst;
                    qd.CheckDate0 = it.ZbDate;
                    qd.BatchRelationId = it.Id;
                    qd.Remark = it.Remark;
                    qd.MinPassRatio = it.JLLast || it.JLFirst;
                    qd.CheckDate = it.JLDate;
                    qd.CheckWorkerName = it.JLUser;
                    qd.ZbCount = it.ZbCount;
                    qd.JLCount = it.JLCount;
                    qd.WKCount = it.WKCount;
                    qd.MinPassRatio1 = it.WKLast;
                    qd.CheckDate1 = it.VKDate;
                    qd.CheckWorkerName1 = it.WKLastUser;
                    qd.ZbChecked = $scope.roleId == 'zb' ? it.ZbChecked : true;
                  }
                });
              }
            });

            results.forEach(function(item) {

              if (item.state != 0)
                checkedCount++;
              if (item.state == 2 || item.state == 4)
                cmpCount++;
            });

            $scope.project.data.checkedCount = checkedCount;
            $scope.project.data.cmpCount = cmpCount;
            $scope.project.data.results = results;
            $scope.project.filter();
          });

            } else if ($scope.project.data.items) {
          //仅通过states过虑
          var rows = [];

          $scope.project.states.forEach(function(item) {
            item.c = 0;
          });
                if ($scope.project.data.results) {
          $scope.project.data.results.forEach(function(item) {
            if ($scope.project.states.find(function(it) {
                if (it.id == item.state || it.id == -1) {
                  it.c++;
                  item.color = it.color;
                  item.stateName = it.title + ((item.state == 1 || item.state == 3) && item.MinPassRatio && item.MinPassRatio >= 80 ? '(偏差)' : '');
                }
                return it.selected && it.id == item.state
              })) {
              rows.push(item);
            }
          });
                }

          $scope.project.rows = rows;
          vm.loading = false;
        }
      }
    };
    $scope.checkState = function(state) {
      if (state.id == -1) {
        if(state.selected){
          state.selected = false;
          $scope.project.states.forEach(function(item) {
            item.selected = false;
          });
        }else{
          state.selected = true;
          $scope.project.states.forEach(function(item) {
            item.selected = true;
          });
        }
      } else {
        state.selected = !state.selected;
        var newArr1 = angular.copy($scope.project.states);
        var newArr = newArr1.splice(1,$scope.project.states.length-1);
        var i=0;
        newArr.forEach(function(item){
          if(!item.selected){
            i--;
          }else{
            i++;
          }
          if(i == newArr.length){
            $scope.project.states[0].selected = true;
          }else{
            $scope.project.states[0].selected = false;
          }

        })

      }
      $scope.project.filter();
    };
    api.szgc.ProcedureTypeService.getAll({startrowIndex:0,maximumRows:100,Status:5}).then(function(result) {
      $scope.project.procedureTypes = result.data.Rows;
    });

    $scope.$watch(function () {
      return vm.searBarHide;
    },function () {
      if(!vm.searBarHide)return;
      if (!$scope.project.pid || !$scope.project.procedureId) {
        utils.alert("必须选择项目和工序！");
        return;
      }else{
        $timeout(function () {
          $scope.project.filter(true);
        },300);

      }
    })
/*    $scope.$watch('project.procedureId', function(a,b) {
      if(a != b){
        if ( !$scope.project.pid) {
          utils.alert("项目不能为空！");
          return;
        }else{
          $scope.project.filter(true);
        }
      }

    });*/

    //以下离线相关
    if(api.getNetwork()==0) {
      api.szgc.vanke.projects().then(function (r) {
        $scope.project.projects = r.data.data;
      });
    }
    var queryOffline = function () {
      return api.szgc.ProjectSettings.offline.query().then(function (result) {
        $scope.project.offlines = result.data;
      });
    }
    queryOffline();
    $scope.hasTasks = function (item) {
      return  $scope.project && $scope.project.tasks && $scope.project.tasks.find(function (t) {
          return t.procedure == $scope.project.procedureId
           && t.projectid == item.$id;
        });
    }
    $scope.requeryTasks = function () {
      api.uploadTask(function (cfg,item) {
        return true
      }).then(function (result) {
        $scope.project.tasks = result.rows;
      });
    }
    $scope.requeryTasks();
    $scope.isOffline = function (item) {
      return !!$scope.project.offlines.find(function (t) {
        return t.Id.indexOf(item.project_item_id)!=-1;
      });
    }
    $scope.download =function ($event,project,item) {
      item.downloading = true;
      var idTree = project.project_id+'>'+item.project_item_id;
      api.download([
        //项目区域
        function (tasks) {
          return api.szgc.vanke.buildings({
            project_id: item.project_id,
            project_item_id: item.project_item_id,
            page_size: 0,
            page_number: 1
          }).then(function (result) {
            result.data.data.forEach(function (build) {
              tasks.push(function () {
                return api.szgc.vanke.floors(build.building_id);
              });
            });
          });
        },//下载户型
        function (tasks,downFile) {
          return $q(function (resolve,reject) {
            api.szgc.vanke.room_types(item.project_item_id).then(function (result) {
              var tk = [];
              result.data.data.forEach(function (type) {
                tk.push(api.szgc.FilesService.group(item.project_item_id+'-'+type.type_id));
                //5类工序
                [1,2,3,4,5,6].forEach(function (m) {
                  tasks.push(function () {
                    return api.szgc.ProjectExService.get(item.project_item_id+'-'+type.type_id+'-'+m)
                  });
                });
              });
              //图纸
              $q.all(tk).then(function (rs) {
                var pics = xhUtils.getMapPic(2);
                rs.forEach(function (r) {
                  if(r.data.Files && r.data.Files.length){
                    var f = r.data.Files[0];
                    //f.Url = f.Url.replace('~/','/');
                    pics.forEach(function (tile) {
                      tasks.push(function () {
                        return downFile('map','tile_'+f.Id+'_'+tile+'.jpg',sxt.app.api+'/api/picMap/load/'+tile+'.png?path='+f.Url.replace('/s_','/')+'&size=256');
                      });
                    })
                  }
                });

                resolve();
              }).catch(reject);
            })
          });
        },
        function (tasks) {
          return api.szgc.ProjectSettingsSevice.query({treeId:idTree,unitType:1,includeChild:true}).then(function (result) {
            var units = [];
            result.data.Rows.forEach(function (s) {
              if(units.indexOf(s.UnitId)==-1){
                units.push(s.UnitId);
                tasks.push(function () {
                  return api.szgc.vanke.teams(s.UnitId);
                })
              }
            })
          });
        },
        function (tasks) {
          return api.szgc.ProjectSettingsSevice.query({treeId:idTree,unitType:2,includeChild:true}).then(function (result) {
            var units = [];
            result.data.Rows.forEach(function (s) {
              if(units.indexOf(s.UnitId)==-1){
                units.push(s.UnitId);
                tasks.push(function () {
                  return api.szgc.vanke.teams(s.UnitId);
                })
              }
            })
          });
        },
        function (tasks) {
          return api.szgc.ProjectSettingsSevice.query({treeId:idTree,unitType:3,includeChild:true}).then(function (result) {
            var units = [];
            result.data.Rows.forEach(function (s) {
              if(units.indexOf(s.UnitId)==-1){
                units.push(s.UnitId);
                tasks.push(function () {
                  return api.szgc.vanke.teams(s.UnitId);
                })
              }
            });
          });
        },
        //验收状态
        function () {
          return api.szgc.addProcessService.getBatchRelation({regionIdTree:idTree});
        },
        //检查项目
/*        function () {
          return api.szgc.CheckStepService.cache(idTree);
        },*/
        //专业
        function () {
          return api.szgc.vanke.skills({page_size:0,page_number:1});
        },
        //工序级别关系
        function () {
          return api.szgc.BatchSetService.getAll({status:4,batchType:255})
        },
        //专业分类关系
        function () {
          return api.szgc.ProcedureTypeService.getAll({startrowIndex:0,maximumRows:100,Status:5});
        },
        //工序验收批设置
        function () {
          return api.szgc.ProcedureBathSettingService.query();
        },
        //工序验收表
        function () {
          return api.szgc.TargetService.getAll()
        }])(function (percent,current,total) {
          item.percent = parseInt(percent *100) +' %';
        item.current = current;
        item.total = total;
      },function () {
        item.downloading = false;
        var offline = {
          Id:idTree,
          name:project.name+'>'+item.name,
          project:project,
          item:item
        };
        api.szgc.ProjectSettings.offline.create(offline).then(function () {
          queryOffline().then(function () {
            var off = $scope.project.offlines.find(function (item) {
              return item.Id == offline.Id;
            });
            utils.alert('下载完成，系统将创建索引。');
            $scope.indexDb(off);
          });

        });

      },function () {
        item.downloading = false;
        utils.alert('下载失败');
      },{timeout:30000});
    };
    $scope.indexDb =function (item) {
      item.indexing = true;
      api.task([function () {
        return api.szgc.TargetService.getAll.db().allDocs();
      },function () {
        return api.szgc.ProjectSettingsSevice.query.db().allDocs();
      },
        function () {
          return api.szgc.addProcessService.getBatchRelation.db().allDocs();//索引
        },function () {
          return api.szgc.CheckStepService.getAll.db().allDocs();
        },
        function () {
          return api.szgc.ProcedureBathSettingService.query.db().allDocs();//索引
        },function () {
          return api.szgc.vanke.teams.db().allDocs();
        }])(function (percent,current,total) {
        item.percent = parseInt(percent *100) +' %';
        item.current = current;
        item.total = total;
      },function () {
        item.indexing = false;
        utils.alert('索引完成');
      },function () {
        item.indexing = false;
      },{
        timeout:300000
      });
    }
    $scope.upload =function () {
      $scope.uploading = true;
      api.upload(function (cfg,item) {
        if(cfg._id=='s_files' && item && item.Url.indexOf('base64')==-1){
          return false;
        }
        return true;
      },function (percent,current,total) {
        $scope.project.percent = parseInt(percent *100) +' %';
        $scope.project.current = current;
        $scope.project.total = total;
      },function () {
        $scope.project.uploaded = 1;
        api.uploadTask(function () {
          return true
        },null);
        utils.alert('上传完成');
        $scope.project.tasks = [];
        $scope.uploading= false;
      },function () {
        $scope.project.uploaded = 0;
        utils.alert('上传失败');
        $scope.uploading =false;
      },{
        uploaded:function (cfg,row,result) {
          cfg.db && cfg.db.delete(row);
        }
      });
    }
    $scope.deleteItem = function ($event,project,item) {

    }
    $scope.loadProject_items= function (project) {
      if(!project.items){
        return api.szgc.vanke.project_items({
          project_id: project .project_id,
          page_size: 0,
          page_number: 1
        }).then(function (result) {
          project.items = result.data.data;
        });
      }
      else{
        project.items = null;
      }
    }
  }
})();

/**
 * Created by emma on 2016/5/25.
 */
/**
 * Created by zhangzhaoyong on 16/2/1.
 */
(function(){
  'use strict';
  AddProcessNewController.$inject = ["$scope", "$filter", "$stateParams", "utils", "$q", "api", "auth", "$state", "sxt"];
  angular
    .module('app.szgc')
    .controller('AddProcessNewController',AddProcessNewController);

  /** @ngInject */
  function AddProcessNewController($scope, $filter, $stateParams, utils,  $q, api,auth,$state,sxt){

    var vm = this;
    vm.keyboard = { show:false};

    var dateFilter = $filter('date');
    $scope.m = {
        isStash: false
    };
    $scope.back = function(){
      history.back();
    }
    $scope.m.CheckDateF = new Date();
    $scope.m.CheckDate = dateFilter($scope.m.CheckDateF, 'yyyy-MM-dd HH:dd:ss');


    var pid = $stateParams.projectid,
      rname = $stateParams.name,
      batchId = $stateParams.batchId,
      procedure = $scope.$parent.project.procedureId || $stateParams.procedureId,
      procedureName = $scope.$parent.project.procedureName || $stateParams.procedureName,
      rt = $scope.$parent.project.type || $stateParams.type,
      idtree = $scope.$parent.project.idTree || $stateParams.idTree,
      nametree = $scope.$parent.project.nameTree || $stateParams.nameTree,
      token = $stateParams.token,
      flag = $stateParams.flag;

    var tid = procedure+idtree+pid,
      tname = nametree+'>'+rname+'-'+procedureName;

    $scope.flag = $stateParams.flag;
    if (!procedure) {
      $state.go('app.szgc.ys');
      return;
    }

    var user=auth.current(),
      initIng = true;
    $scope.isPartner = api.szgc.vanke.isPartner();
    $scope.roleId = api.szgc.vanke.getRoleId();
    $scope.data = {
      pics: [],
      pics2:[],
      isFirst: !batchId || batchId == 'new',
      projectName: nametree,
      procedureName: procedureName,
      projectInfo: nametree + ' - ' + procedureName,
      rName: rname,
      curHistory: {
        BatchNo: 1,
        Count: 1,
        WorkRatio: 100,
        CheckNo: 1,
        ZbChecked:true
      },
      batchs: [],
      curStep: {},
      historys: null,
      groups: null,
      submitUsers: null,
      flag:flag
    };
    if ($scope.data.isFirst) {
        api.szgc.ProcedureBathSettingService.query().then(function (result) {
            $scope.ProcedureBathSettings = result.data.Rows;
        })
    }

    var resetWorkRatio = function () {
      var bs = $scope.data.batchs,
        len = 0,
        sk = 0,
        last = null;
      bs.forEach(function (item) {
        if (item.changed) {
          sk += isNaN(parseFloat(item.WorkRatio)) ? 0 : parseFloat(item.WorkRatio);
        } else {
          len++;
          last = item;
        }
      });
      if (!last)
        last = bs[bs.length - 1];

      var p = parseFloat(((100 - sk) / len).toFixed(2)),
        t = 0,
        k = 0;
      if (p < 0) {
        bs.forEach(function (item) {
          item.changed = false;
        })
        resetWorkRatio();
      } else {
        bs.forEach(function (item) {
          item.BatchNo = (++k);
          if (item != last) {
            item.WorkRatio = item.changed ? item.WorkRatio : p;
            t += item.WorkRatio;
          }
        });
        last.WorkRatio = parseFloat((100 - t).toFixed(2));
      }
    };
    $scope.addBatch = function () {
      $scope.data.batchs.push({
        BatchNo: $scope.data.batchs.length + 1,
        Count: 1,
        WorkRatio: 100
      });
      resetWorkRatio();
    }
    $scope.removeBatch = function (item) {
      var bs = $scope.data.batchs,
        ix = bs.indexOf(item);
      bs.splice(ix, 1);
      resetWorkRatio();
    }
    $scope.changeBatch = function (item) {
      if (item.WorkRatio) {
        var rd = parseFloat(item.WorkRatio);
        if (isNaN(rd) || rd < 0 || rd > 100)
          item.changed = false;
        else {
          item.changed = true;
        }
        resetWorkRatio();
      } else {
        item.changed = true;
        resetWorkRatio();
      }

    }




    if (!$scope.isPartner || $scope.roleId=='zb') {
      $scope.data.submitUsers = [{
        id: user.Id,
        type: api.szgc.vanke.getRoleId(),
        name: user.RealName + '(本人)'
      }];
      $scope.data.curStep.CheckWorker = $scope.data.submitUsers[0].id;
    }

    $q(function (resolve) {
      if (!$scope.data.isFirst) { //如果是进入进入验收批
        api.szgc.ProcProBatchRelationService.getbyid(batchId).then(resolve);
        //console.log('复验')
      } else {
        //行内新增验收批。查询已经录入了的验收批
        api.szgc.addProcessService.getBatchRelation({
          regionIdTree: idtree,
          procedureId: procedure,
          regionId: pid
        }).then(function (result) {
          //如果已经录入了把第一条BatchNo最大的返回取它的BatchNo，把Id制空
          //没有Id才会插入一条数
          var b = result.data.Rows.length ? result.data.Rows[0] : null;

          if (b) {
            b.Id = null;
            b.BatchNo = parseInt(result.data.Rows[0].BatchNo) + 1;//第几次验收批
            b.Remark = '';//描述
            b.Count = 1;//第几次验收
            b.JLCount = 0;
          }
          else
            flag = false;

          resolve({
            data: b
          });
        });

      }
    }).then(function (result) {
      var batch = result.data,

        isB = $scope.data.isB = !!batch;
                if (isB && $scope.roleId == 'jl' && !batch.SupervisorCompanyId) { //如果监理在总包上录入，且总包没有选择监理
                    batch.SupervisorCompanyId = user.Partner;
                }
      var gp = batch? {
        id: batch.GrpId,
        name: batch.GrpName
      }:null;//因为控件的BUG,会把名称清掉,这里保留一份
      if (flag) {
        batch.BatchNo = parseInt(batch.BatchNo);
        $scope.data.curHistory = batch;

      }
      else if (batch && !flag) {

        batch.Count = (batch.Count||0) + 1;
        $scope.data.curHistory = batch;
      }
      $q.all([
        api.szgc.TargetService.getAll(procedure),
        isB&&!flag ? $q(function (resolve) {
          resolve({
            data: {
              Rows: [{
                UnitId: batch.CompanyId,
                UnitName: batch.CompanyName
              }]
            }
          });
        }) : api.szgc.ProjectSettingsSevice.query({
          projectId: idtree,
          unitType: 2
        }),

        isB&&!flag ? $q(function (resolve) {
          resolve({
            data: {
              Rows: [{
                UnitId: batch.ParentCompanyId,
                UnitName: batch.ParentCompanyName
              }]
            }
          });
        }) : api.szgc.ProjectSettingsSevice.query({
          projectId: idtree,
          unitType: 3
        }),
        isB&&!flag ? $q(function (resolve) {
          if ($scope.roleId == 'zb') {
            resolve({
              data: {Rows: []}
            });
          } else {
            resolve({
              data: {
                Rows: [{
                  UnitId: batch.SupervisorCompanyId,
                  UnitName: batch.SupervisorCompanyName
                }]
              }
            });
          }
        }) : api.szgc.vanke.isPartner(1) ? api.szgc.vanke.getPermissin() : api.szgc.ProjectSettingsSevice.query({
          treeId: idtree,
          unitType: 1,
          includeChild: true
                    }),
                    //batchRelationId,roleId,batchNo,historyNo
                    api.szgc.addProcessService.GetBatchsTargetByHistryNo({ batchRelationId: batch ? batch.Id : '', roleId: 'jl', batchNo: batch ? batch.BatchNo : 100, historyNo: 1 }),
                    api.szgc.UserStashService.get(idtree + procedure + (batch ? batch.BatchNo : '1'))
      ]).then(function (results) {

        batch = batch || $scope.data.curHistory;
        var stash = results[5].data;
        stash = stash && stash.SValue ? JSON.parse(stash.SValue) : null;
        if (stash) {
          batch.CompanyId = stash.Batch[0].CompanyId;
          batch.ParentCompanyId = stash.Batch[0].ParentCompanyId;
          batch.GrpId = stash.Batch[0].GrpId;
          batch.SupervisorCompanyId = stash.Batch[0].SupervisorCompanyId;
          $scope.data.curStep.GroupImg = stash.Step.GroupImg;
          $scope.data.curStep.GroupImg2 = stash.Step.GroupImg2;
        }
        if(!$scope.data.curStep.GroupImg2){
          $scope.data.curStep.GroupImg2 = sxt.uuid();
        }
        if(!$scope.data.curStep.GroupImg){
          $scope.data.curStep.GroupImg = sxt.uuid();
        }
        $scope.data.batchs.push(batch);

        var sm0 = [];
        results[1].data.Rows.forEach(function (n) {
          var fd = sm0.find(function (n2) { return n2.UnitId == n.UnitId; });
          if (fd == null) {
            fd = n;
            sm0.push(n);
          }
          fd.groups = fd.groups || [];
          fd.groups.push({
            id: n.GroupId,
            name: n.GroupName
          });
        })

        $scope.data.supervision = sm0;
                    //console.log('$scope.data.supervision',$scope.data.supervision)
        if ($scope.roleId == 'zb') {
          var sup = $scope.data.supervision.find(function (it) {
            return it.UnitId == user.Partner
          });
          if (sup) {
            batch.CompanyId = user.Partner;
          }
        }
        else {
          if (isB && $scope.data.supervision.length && !batch.CompanyId)
            batch.CompanyId = $scope.data.supervision[0].UnitId;
        }
        if (isB && gp) {
          $scope.data.curHistory.GrpId = batch.GrpId;
          $scope.data.groups = [gp];

        }
        var sm1 = [];
        results[2].data.Rows.forEach(function (n) {
          var fd = sm1.find(function (n2) { return n2.UnitId == n.UnitId; });
          if (fd == null) {
            fd = n;
            sm1.push(n);
          }
          fd.groups = fd.groups || [];
          fd.groups.push({
            id: n.GroupId,
            name: n.GroupName
          });
        })
        $scope.data.supervision1 = sm1;
        if (isB && $scope.data.supervision1.length && !batch.ParentCompanyId) {
          batch.ParentCompanyId = $scope.data.supervision1[0].UnitId;
        }
        if ($scope.roleId == 'zb') {
            batch.ParentCompanyId = user.Partner;
        }
        if (api.szgc.vanke.isPartner(1)) {
          batch.Count = ($scope.roleId == 'zb' ? (batch.ZbCount || 0) : (batch.JLCount || 0)) + 1;
          var fd = results[3].data.Rows.find(function(it) {
            return it.UnitId == api.szgc.vanke.getPartner()
          });
          var nn = [];
          if (fd) {
            nn.push(fd);
            if (!batch.SupervisorCompanyId)
              batch.SupervisorCompanyId = fd.UnitId;
            $scope.data.construction = nn;
          }
          else{
            nn = nn.concat(results[3].data.Rows);
            if(nn.length){
              batch.SupervisorCompanyId = nn[0].UnitId;
              $scope.data.construction = nn;
            }
          }
        } else {
          batch.Count = (batch.WKCount || 0) + 1;
          var nn = [];
          results[3].data.Rows.forEach(function (r) {
            if (nn.find(function (r1) { return r1.UnitId == r.UnitId }) == null) {
              nn.push({
                UnitId: r.UnitId,
                UnitName: r.UnitName
              })
            }
          })
          $scope.data.construction = nn;
          if ($scope.data.construction.length && !batch.SupervisorCompanyId)
            batch.SupervisorCompanyId = $scope.data.construction[0].UnitId;
        }

        results[0].data.Rows.forEach(function(item) {
          if (stash) {
            var _stash = stash.CheckData.find(function (it) {
              return it.TargetId == item.Id;
            });
            if (_stash) {
              item.MPCheckValue = _stash.MPCheckValue;
              item.isOK = !!item.MPCheckValue;
              item.CheckNum = _stash.CheckNum;
              item.PassRatio = _stash.PassRatio;
              item.MaxDeviation = _stash.MaxDeviation;
            }
          }
          item.TargetName = RemoveStr(item.TargetName);
          item.checked = false;
          if (results[4].data) {
            if (results[4].data.Rows.length > 0) {
              results[4].data.Rows.forEach(function (hItem) {
                if (hItem.Sort == item.Sort) {
                  item.checked = true;
                }

              });
            } else {
              item.checked = true;
            }
          } else {
            item.checked = true;
          }
          if (item.TargetTypeId == '018C0866-1EFA-457B-9737-7DCEFEA148F6') {
            $scope.targets.zk.push(item);
          } else {
            item.CheckNum = (item.CheckNum == 0) ? "" : item.CheckNum;
            item.PassRatio = (item.PassRatio == 0) ? "" : item.PassRatio;
            $scope.targets.yb.push(item);
          }
          //appConfig.procedureId
          if (procedure =='2814510f-0188-4993-a153-559b40d0b5e8') {
            if ($scope.targets.yb.length == 3 || $scope.targets.yb.length == 6) {
              $scope.targets.yb.push({
                TargetName: '-',
                DeviationLimit: '≥80',
                items: (function () {
                  var ns = [];
                  for (var i = $scope.targets.yb.length - 1; i >= 0; i--) {
                    var n = $scope.targets.yb[i];
                    if (n.TargetName && n.TargetName.substring(0, 1) == '-') break;
                    ns.push(n);
                  };
                  return ns;
                })(),
                checked:false,
                getPassRatio: function () {
                  var sum=0,l=0;
                  this.items.forEach(function (item) {
                                            if (item.checked && item.PassRatio) {
                      sum = utils.math.sum(item.PassRatio, sum);
                      l++;
                    }
                  });
                  if (l == 0) return null;
                  return utils.math.div(sum, l);
                },
                ok: function () {
                  var p = this.getPassRatio();
                  return !p || p >= 80;
                }
              });
            }
            if ($scope.targets.yb.length == 7) {
              $scope.targets.yb.push({
                TargetName: '--',
                DeviationLimit: '≥85',
                checked: false,
                getPassRatio: function () {
                  var sum = 0,l=0;
                  $scope.targets.yb.forEach(function (item) {
                                            if (item.checked && !item.getPassRatio) {
                      sum = utils.math.sum(item.PassRatio, sum);
                      l++;
                    }
                  });
                  if (l == 0) return null;
                  return utils.math.div(sum, l);
                },
                ok: function () {
                  var p = this.getPassRatio();
                  return !p || p >= 85;
                }
              });
            }
          }
        });
        //utils.scrollTop();
        initIng = true;
      });
    });


    $scope.$watch('data.curHistory.SupervisorCompanyId', function() {

      if ($scope.data.curHistory.SupervisorCompanyId) {
        var s1 = api.szgc.vanke.isPartner() ? [] : [$scope.data.submitUsers[0]];
        api.szgc.vanke.employees($scope.data.curHistory.SupervisorCompanyId).then(function(result) {
          result.data.data.forEach(function(item) {
            s1.push({
              type: 'jl',
              id: item.employee_id,
              name: item.name + (item.phone ? '(' + item.phone + ')' : '')
            });
          });
          var fd = s1.find(function(f) {
            return f.id == user.Id
          });
          if (!fd) {
            fd = {
              type: 'jl',
              id: user.Id,
              name: user.RealName + '(本人)'
            };
            s1.push(fd);
          }
          if (fd) {
            if (fd.name.indexOf('(本人)') == -1)
              fd.name += '(本人)';

            $scope.data.curStep.CheckWorker = fd.id;
          }
          $scope.data.submitUsers = s1;

        });
      }
    })
    var resetGroup = function() {
      if (!$scope.data.supervision || !$scope.data.supervision1) return;
      var g = [];

      $scope.data.groups = [];
      $q.all([!$scope.data.isB && $scope.data.curHistory.CompanyId ?  api.szgc.vanke.teams($scope.data.curHistory.CompanyId).then(function (result) {
        var gps = getGroups($scope.data.supervision,'UnitId',$scope.data.curHistory.CompanyId)
          ,gps2=[];
        result.data.data.forEach(function (item) {
          if (!item || !item.skills || !item.skills.length) return;
          if ($stateParams.procedureTypeId) {
            if (item.skills.find(function (sk) { return sk.skill_id == $stateParams.procedureTypeId; }) == null) {
              return;
            };
          }
          if(item.partner_id != $scope.data.curHistory.CompanyId)
            return;
          if(!gps.find(function (g) {
              return g.id == item.team_id;
            })){
            return;
          }
          var ns = [];
          item.managers.forEach(function (it) {
            ns.push(it.name);
          });
          gps2.push({
            id: item.team_id,
            name: item.name + (ns.length ? '(' + ns.join(';') + ')' : '')
          });

        });
        return {data:{data:gps2}};
      })  : $q(function (resolve) {

        resolve({
          data: {
            data: []
          }
        })
      }), !$scope.data.isB && $scope.data.curHistory.ParentCompanyId && $scope.data.curHistory.ParentCompanyId != $scope.data.curHistory.CompanyId ?
        api.szgc.vanke.teams($scope.data.curHistory.ParentCompanyId).then(function (result) {
          var gps = getGroups($scope.data.supervision1,'UnitId',$scope.data.curHistory.ParentCompanyId),
            gps2 = [];
          result.data.data.forEach(function (item) {
            if (!item || !item.skills || !item.skills.length) return;
            if ($stateParams.procedureTypeId) {
              if (item.skills.find(function (sk) { return sk.skill_id == $stateParams.procedureTypeId; }) == null) {
                return;
              };
            }
            if(!(item.partner_id == $scope.data.curHistory.ParentCompanyId || gps.find(function (g) {
                return g.id == item.team_id;
              }))){
              return;
            }


            var ns = [];
            item.managers.forEach(function (it) {
              ns.push(it.name);
            });
            gps2.push({
              id: item.team_id,
              name: item.name + (ns.length ? '(' + ns.join(';') + ')' : '')
            });

          });
          return {data: {data: gps2}};
          ;
        }) : $q(function (resolve) {
        resolve({
          data: {
            data: []
          }
        })
      })]).then(function (results) {
        results[0].data.data.forEach(function (item) {
          g.push({
            id: item.id,
            name:item.name
          })
        });
        results[1].data.data.forEach(function (item) {
          g.push({
            id: item.id,
            name: item.name
          })
        });

        if ($scope.data.isB && $scope.data.groups) {
          g.forEach(function (g1) {
            $scope.data.groups.push(g1);
          })
        }
        else {
          if (g.length) {
            $scope.data.groups = g;
          } else {
            $scope.data.groups = [];
          }
        }


      });
      if ($scope.flag) {
        $q.all([$scope.data.isB && $scope.data.curHistory.CompanyId ? $q(function (resolve) {
          resolve({
            data: {
              data: getGroups($scope.data.supervision,'UnitId',$scope.data.curHistory.CompanyId)
            }
          })
        }) : $q(function (resolve) {
          resolve({
            data: {
              data: []
            }
          })
        }), $scope.data.curHistory.ParentCompanyId && $scope.data.curHistory.ParentCompanyId != $scope.data.curHistory.CompanyId ?  $q(function (resolve) {
          resolve({
            data: {
              data: getGroups($scope.data.supervision1,'UnitId',$scope.data.curHistory.ParentCompanyId)
            }
          })
        }) : $q(function (resolve) {
          resolve({
            data: {
              data: []
            }
          })
        })]).then(function (results) {

          results[0].data.data.forEach(function (item) {

            g.push({
              id: item.id,
              name: item.name
            });
          });
          results[1].data.data.forEach(function (item) {

            g.push({
              id: item.id,
              name: item.name
            })
          });

          if (g.length) {
            $scope.data.groups = g;
          } else {
            $scope.data.groups = []
          }
        })
      }

    }
    $scope.$watch('data.curHistory.ParentCompanyId', resetGroup)
    $scope.$watch('data.curHistory.CompanyId', resetGroup);

    function getGroups(sp,field,v) {
      if(!sp)return [];
      var gp = sp.find(function (s) {
        return s[field] == v;
      });
      return gp?gp.groups:[]
    }
    $scope.targets = {
      zk: [],
      yb: []
    }



    //移除重复
    var RemoveStr = function(str) {
      var strarr = str.split('>');
      var strarr2 = [];
      strarr.forEach(function(item) {
        item = item.replace(/(^\s*)|(\s*$)/g, '');
        if (!strarr2.length || strarr2[strarr2.length - 1] != item) {
          strarr2.push(item);
        }
      });
      return strarr2.join('>');
    };

    //批量保存
    var toSaveTargets = function(step) {
      var savetargets = [];
      $scope.CheckDataValue=[];
      $scope.targets.zk.forEach(function (zkitem) {
        if (zkitem.checked) {
          //遍历获取主控数据
          savetargets.push({
            CheckStepId: step.Id,
            TargetId: zkitem.Id,
            PassText: zkitem.PassText,
            NoPassText: zkitem.NoPassText,
            ProcedureId: procedure,
            MPCheckValue: zkitem.isOK?1:0,
            CheckWorker: step.CheckWorker,
            TargetTypeId: zkitem.TargetTypeId,
            Sort: zkitem.Sort,
            Status: 4,
            RoleId: step.RoleId,
            HistoryNo: step.CheckNo,
            Remark: zkitem.Remark,
            CheckDate: $scope.m.CheckDate
          });
        }
      })
      $scope.CheckDataValue=[];
      //遍历获取一般项目数
      var sort=0;
      $scope.ybAllHasPoints = true;
      $scope.targets.yb.forEach(function (zkitem,index) {
        if (zkitem.checked) {
          var yb={
            Id:'',
            CheckStepId: step.Id,
            TargetId: zkitem.Id,
            CheckNum: zkitem.CheckNum, //检查点?
            PassRatio: zkitem.PassRatio, //合格?
            MaxDeviation: zkitem.MaxDeviation, //最大偏?
            ProcedureId: procedure,
            DeviationLimit: zkitem.DeviationLimit,
            TargetTypeId: zkitem.TargetTypeId,
            Sort: zkitem.Sort,
            Status: 4,
            RoleId: step.RoleId,
            HistoryNo: step.CheckNo,
            Remark: zkitem.Remark,
            CheckDate: $scope.m.CheckDate,
            Tag:sxt.uuid()
          }
          savetargets.push(yb);
          if(!zkitem.points.length){
            $scope.ybAllHasPoints = false;
          }
          zkitem.points.forEach(function(o){
            $scope.CheckDataValue.push({
              Id:'',
              CheckDataId:yb.Tag,
              BathRelationId:"",
              TargetId:yb.TargetId,
              DeviationValue: o.zdpc,
              Value:o.value,
              Sort:++sort,
              Result: o.isOK
            });
          });
        }
      })

      return savetargets;
    }

    $scope.save = function(addForm) {

      var m = /(((20[0-9][0-9]-(0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|(20[0-3][0-9]-(0[2469]|11)-(0[1-9]|[12][0-9]|30))) (20|21|22|23|[0-1][0-9]):[0-5][0-9]:[0-5][0-9])/
      var s = $scope.m.CheckDate;
      if (!m.test(s)) {
        utils.alert('日期格式不对!(yyyy-MM-dd HH:dd:ss)');
        return;
      }

      var isL = true;
      $scope.targets.yb.forEach(function (y) {
        if(isL && y.checked && y.points.length==0 ){
          isL=false;
        }
      });
      if(!isL){
        utils.alert('有已打勾的指标未输入！');
        return;
      }

      if ($scope.data.pics2.length == 0) {
        utils.alert('请上传验收照片');
        return;
      }
      utils.confirm(null, '确认向验收批:' + $scope.data.curHistory.BatchNo + ' 添加新记录吗?').then(function () {
        $scope._save(addForm);
      });

    }


    $scope._save = function (addForm) {
      $scope.isSaveing = true;
      //addForm
      var data = $scope.data,
        step = data.curStep,
        batch = data.curHistory;

      if (!batch.GrpId && $scope.roleId != '3rd') {
        utils.alert('请选择班组', function () {
          $scope.isSaveing = false;
          return;
        });
      }
      step.RoleId = api.szgc.vanke.getRoleId();// data.submitUser.type;
      step.CheckNo = batch.Count;
      step.MainResult = $scope.zkIsOk() ? 1 : 0;
      step.OtherResult = $scope.ybIsOk() ? 1 : 0;
      step.AllResult = $scope.zkIsOk() && $scope.ybIsOk() ? 1 : 0;
      step.MinPassRatio = $scope.targets.yb.length == 0 ? 100 : $scope.ybHGL();
      step.Status = 4;
      if (step.CheckWorkerName) {
        var ix = step.CheckWorkerName.indexOf('(');
        if (ix != -1)
          step.CheckWorkerName = step.CheckWorkerName.substring(0, ix);
      }


      batch.ProcedureId = procedure;
      batch.EngineeringProjectId = idtree.split('>')[0];
      batch.Status = 4;
      batch.RegionId = pid;
      batch.RegionType = rt;
      batch.RegionIdTree = idtree;
      batch.RegionNameTree = nametree;
      //console.log('batch.RegionNameTree', batch.RegionNameTree)
      batch.RegionName = rname;
      //将第一验收批的信息复制到所有验收批
      data.batchs.forEach(function (item) {
        if (item != batch) {
          item.ProcedureId = batch.ProcedureId;
          item.EngineeringProjectId = batch.EngineeringProjectId;
          item.Status = batch.Status;
          item.RegionId = batch.RegionId;
          item.RegionType = batch.RegionType;
          item.RegionIdTree = batch.RegionIdTree;
          item.RegionNameTree = batch.RegionNameTree;
          item.RegionName = batch.RegionName;
          item.SupervisorCompanyId = batch.SupervisorCompanyId;
          item.SupervisorCompanyName = batch.SupervisorCompanyName;
          item.ParentCompanyName = batch.ParentCompanyName;
          item.ParentCompanyId = batch.ParentCompanyId;
          item.CompanyId = batch.CompanyId;
          item.CompanyName = batch.CompanyName;
          item.GrpId = batch.GrpId;
          item.GrpName = batch.GrpName;
        }
      });



      var targets = toSaveTargets(step);

      if(!$scope.ybAllHasPoints){
        utils.alert('已选择的检查项必须录入!');
        $scope.isSaveing = false;
        return;
      }

     /* console.log('CheckData', {
        Id:sxt.uuid(),
        Batch: data.batchs,
        Step: step,
        CheckData: targets,
        CheckDataValue:$scope.CheckDataValue
      });
      return;*/
      api.szgc.addProcessService.postCheckData({
        Id:sxt.uuid(),
        Batch: data.batchs,
        Step: step,
        CheckData: targets,
        CheckDataValue:$scope.CheckDataValue
      }).then(function (result) {
        if(result){
          //api.szgc.ProcedureService.deleteAppImg(step.GroupImg2);
          $scope.isSaveing = false;
          $scope.$parent.project.filter(true);
          api.uploadTask({
            _id:tid,
            procedure:procedure,
            projectid:pid,
            name:tname
          });
          utils.alert('提交完成').then(function () {
            $state.go('app.szgc.ys');
          });
        }else{
          utils.alert('提交失败').then(function () {
            $scope.isSaveing = false;
          });
        }
      });
    }
    $scope.rowIsOk = function(pc, hg, mk) {
      mk = parseInt(mk);
      if (isNaN(mk)) return true;
      pc = pc.replace('mm', '');
      var zf = pc.indexOf('±') != -1;
      var isIn = pc.indexOf(',');
      if (isIn) {
        var ins = pc.split(',');
      }
    }
    $scope.zkIsOk = function(n) {
      //主控项是否全合格
      for (var i = 0, l = $scope.targets.zk.length; i < l; i++) {
        if ($scope.targets.zk[i].checked && !$scope.targets.zk[i].isOK) {
          return false;
        }
      }


      return true;

    }


    $scope.ybIsOk = function() {
      for (var i = 0, l = $scope.targets.yb.length; i < l; i++) {
        var yb = $scope.targets.yb[i];
        if ((yb.ok && !yb.ok()) || (yb.checked && !yb.isOK)) return false;
      }
      return true;
    }
    $scope.ybBlur = function(item) {
      var zdpc = item.MaxDeviation;
      var pattern = /^[0-9]+([.]\d{1,2})?$/;
      if (zdpc) {
        if (!pattern.test(zdpc)) {
          if (!pattern.test(zdpc)) {
            utils.alert('您输入最大偏差值格式不正确!');
            item.MaxDeviation = '';
          }
        }
      }

    }
    $scope.ybIsOkRow = function (item) {
      //if (item.getPassRatio) {
      //    return item.ok();
      //}
      if (!item.checked) {
        item.isOK = true;
        return item.isOK;
      }
      var zdpc = item.MaxDeviation;
      //var pattern = /^[0-9]+([.]\d{1,2})?$/;
      //if (zdpc) {
      //    if (!pattern.test(zdpc)) {
      //        item.isOK = false;
      //        return false;
      //    }
      //}
      zdpc = parseFloat(zdpc);
      var hgl = parseFloat(item.PassRatio),
        pc = item.DeviationLimit,
        op = pc.substring(0, 1);
      if (isNaN(hgl) || isNaN(zdpc)) {
        item.isOK = false;
        return true;
      }
      if (($scope.data.procedureName.indexOf('钢筋保护层') != -1 || item.TargetName.indexOf('保护层厚度') != -1) && hgl < 90) {
        item.isOK = false;
        return false;
      }
      if (hgl < 80) {
        item.isOK = false;
        return false;
      }
      var isIn = pc.match(/(-?[\d.])+/g); //(\.\d{2})?：
      // console.log("isIn", isIn);
      if (isIn && isIn.length > 0) {
        var min = 0,
          max = parseFloat(isIn[0]);

        if (isIn && isIn.length > 1) {
          min = parseFloat(isIn[1]);
          if (max < min) {
            max = min;
            min = parseFloat(isIn[0]);
          }
        }
        if (max < min) {
          var t11 = max;
          max = min;
          min = t11;
        }

        if (op == '±') {
          min = -max;
        } else if (op == '+') {
          min = 0;
        } else if (op == '-') {
          max = -max;
        } else if (op == '≥') {
          min = max;
          max = 10000000;
        } else if (op == '＞') {
          min = utils.math.sum(max, 0.1);
          max = 10000000;
        } else if (op == '≤') {
          min = -10000000;
        } else if (op == '＜') {
          max = utils.math.sub(max, 0.1);
          min = -10000000;
        }
        max = utils.math.mul(max, (item.TargetName.indexOf('>悬挑板')!=-1||item.TargetName.indexOf('>板')!=-1)?2: 1.5);
        if (min > 0)
          min = utils.math.mul(min, 0.5);
        else
          min = utils.math.mul(min, 1.5);
        //console.log(min, max, zdpc)
        if (zdpc < min || zdpc > max) {
          item.isOK = false;
          return false;
        }
        item.isOK = true;
        return item.isOK;
      } else {
        item.isOK = true;
        return item.isOK;
      }
    }
    $scope.ybHGL = function() {
      var hgl;
      for (var i = 0, l = $scope.targets.yb.length; i < l; i++) {
        var ybd = parseFloat($scope.targets.yb[i].PassRatio);
        if (!isNaN(ybd) && (!hgl || hgl > ybd)) hgl = ybd;
      }
      return hgl;
    }
    $scope.ybHGLPJ = function() {
      var hgl = 0,c=0;
      for (var i = 0, l = $scope.targets.yb.length; i < l; i++) {
        var ybd = parseFloat($scope.targets.yb[i].PassRatio);
        if (!isNaN(ybd)) {
          hgl = utils.math.sum(hgl, ybd);
          c++;
        }
      }
      return c == 0 ? '' : utils.math.div(hgl, c).toFixed(2);
    }


  }
})();

/**
 * Created by zhangzhaoyong on 16/2/1.
 */
(function(){
  'use strict';
  AddProcessController.$inject = ["$scope", "$filter", "$stateParams", "utils", "$q", "api", "auth", "$state"];
  angular
    .module('app.szgc')
    .controller('AddProcessController',AddProcessController);

  /** @ngInject */
  function AddProcessController($scope, $filter, $stateParams, utils,  $q, api,auth,$state){


    //给默认时间
    var dateFilter = $filter('date');
    $scope.m = {};
$scope.back = function(){
  history.back();
}
    $scope.m.CheckDateF = new Date();
    $scope.m.CheckDate = dateFilter($scope.m.CheckDateF, 'yyyy-MM-dd HH:dd:ss');


    var pid = $stateParams.projectid,
      rname = $stateParams.name,
      batchId = $stateParams.batchId,
      procedure = $scope.$parent.project.procedureId || $stateParams.procedureId,
      procedureName = $scope.$parent.project.procedureName || $stateParams.procedureName,
      rt = $scope.$parent.project.type || $stateParams.type,
      idtree = $scope.$parent.project.idTree || $stateParams.idTree,
      nametree = $scope.$parent.project.nameTree || $stateParams.nameTree,
      token = $stateParams.token,
      flag = $stateParams.flag;

    console.log('----传参数----', $stateParams);
    $scope.flag = $stateParams.flag;
    if (!procedure) {
      $state.go('app.szgc.ys');
      return;
    }
    $scope.animate = function(){
      $('.ybxm').animate({scrollTop:100})
    }

    var user=auth.current(),
        initIng = true;
    $scope.isPartner = api.szgc.vanke.isPartner();
    $scope.data = {
      pics: [],
      isFirst: !batchId || batchId == 'new',
      projectName: nametree,
      procedureName: procedureName,
      projectInfo: nametree + ' - ' + procedureName,
      rName: rname,
      curHistory: {
        BatchNo: 1,
        Count: 1,
        WorkRatio: 100,
        CheckNo: 1
      },
      batchs: [],
      curStep: {},
      historys: null,
      groups: null,
      submitUsers: null,
      flag:flag
    };

    var resetWorkRatio = function () {
      var bs = $scope.data.batchs,
        len = 0,
        sk = 0,
        last = null;
      bs.forEach(function (item) {
        if (item.changed) {
          sk += isNaN(parseFloat(item.WorkRatio)) ? 0 : parseFloat(item.WorkRatio);
        } else {
          len++;
          last = item;
        }
      });
      if (!last)
        last = bs[bs.length - 1];

      var p = parseFloat(((100 - sk) / len).toFixed(2)),
        t = 0,
        k = 0;
      if (p < 0) {
        bs.forEach(function (item) {
          item.changed = false;
        })
        resetWorkRatio();
      } else {
        bs.forEach(function (item) {
          item.BatchNo = (++k);
          if (item != last) {
            item.WorkRatio = item.changed ? item.WorkRatio : p;
            t += item.WorkRatio;
          }
        });
        last.WorkRatio = parseFloat((100 - t).toFixed(2));
      }
    };
    $scope.addBatch = function () {
      $scope.data.batchs.push({
        BatchNo: $scope.data.batchs.length + 1,
        Count: 1,
        WorkRatio: 100
      });
      resetWorkRatio();
    }
    $scope.removeBatch = function (item) {
      var bs = $scope.data.batchs,
        ix = bs.indexOf(item);
      bs.splice(ix, 1);
      resetWorkRatio();
    }
    $scope.changeBatch = function (item) {
      if (item.WorkRatio) {
        var rd = parseFloat(item.WorkRatio);
        if (isNaN(rd) || rd < 0 || rd > 100)
          item.changed = false;
        else {
          item.changed = true;
        }
        resetWorkRatio();
      } else {
        item.changed = true;
        resetWorkRatio();
      }

    }

    api.szgc.ProcedureService.getAppImg(pid, procedure, api.szgc.vanke.isPartner(1) ? 'partner' : '').then(function (r) {
      if (r.data) {
        $scope.data.curStep.GroupImg2 = r.data.Id;

      }
    });




    if (!$scope.isPartner) {
      $scope.data.submitUsers = [{
        id: user.Id,
        type: api.szgc.vanke.isPartner(1) ? 'jl' : 'eg',
        name: user.RealName + '(本人)'
      }];
      $scope.data.curStep.CheckWorker = $scope.data.submitUsers[0].id;
    }

    $q(function (resolve) {
      if (!$scope.data.isFirst) { //如果是进入进入验收批
        api.szgc.ProcProBatchRelationService.getbyid(batchId).then(resolve);
        //console.log('复验')
      } else {
        //行内新增验收批。查询已经录入了的验收批
        api.szgc.addProcessService.getBatchRelation({
          regionIdTree: idtree,
          procedureId: procedure,
          regionId: pid
        }).then(function (result) {
          //如果已经录入了把第一条BatchNo最大的返回取它的BatchNo，把Id制空
          //没有Id才会插入一条数据
          var b = result.data.Rows.length ? result.data.Rows[0] : null;

          if (b) {
            b.Id = null;
            b.BatchNo = parseInt(result.data.Rows[0].BatchNo) + 1;//第几次验收批
            b.Remark = '';//描述
            b.Count = 1;//第几次验收
          }
          else
            flag = false;

          resolve({
            data: b
          });
        });

      }
    }).then(function (result) {
      var batch = result.data,

        isB = $scope.data.isB = !!batch;
      if (flag) {
        batch.BatchNo = parseInt(batch.BatchNo);
        $scope.data.curHistory = batch;

      }
      else if (batch && !flag) {

        batch.Count = batch.Count + 1;
        $scope.data.curHistory = batch;
      }
      $q.all([
        api.szgc.TargetService.getAll(procedure),
        isB&&!flag ? $q(function (resolve) {
          resolve({
            data: {
              Rows: [{
                UnitId: batch.CompanyId,
                UnitName: batch.CompanyName
              }]
            }
          });
        }) : api.szgc.ProjectSettingsSevice.query({
          projectId: idtree,
          unitType: 2
        }),

        isB&&!flag ? $q(function (resolve) {
          resolve({
            data: {
              Rows: [{
                UnitId: batch.ParentCompanyId,
                UnitName: batch.ParentCompanyName
              }]
            }
          });
        }) : api.szgc.ProjectSettingsSevice.query({
          projectId: idtree,
          unitType: 3
        }),
        isB&&!flag ? $q(function (resolve) {
          resolve({
            data: {
              Rows: [{
                UnitId: batch.SupervisorCompanyId,
                UnitName: batch.SupervisorCompanyName
              }]
            }
          });
        }) : api.szgc.vanke.isPartner(1) ? api.szgc.vanke.getPermissin() : api.szgc.ProjectSettingsSevice.query({
          treeId: idtree,
          unitType: 1,
          includeChild: true
        })
      ]).then(function (results) {

        batch = batch || $scope.data.curHistory;

        $scope.data.batchs.push(batch);

        var sm0 = [];
        results[1].data.Rows.forEach(function (n) {
          if (sm0.find(function (n2) { return n2.UnitId == n.UnitId; }) == null) {
            sm0.push(n);
          }
        })

        $scope.data.supervision = sm0;
        if (isB && $scope.data.supervision.length && !batch.CompanyId)
          batch.CompanyId = $scope.data.supervision[0].UnitId;
        if (isB) {
          $scope.data.curHistory.GrpId = batch.GrpId;
          $scope.data.groups = [{
            id: batch.GrpId,
            name: batch.GrpName
          }];

        }


        var sm1 = [];
        results[2].data.Rows.forEach(function (n) {
          if (sm1.find(function (n2) { return n2.UnitId == n.UnitId; }) == null) {
            sm1.push(n);
          }
        })
        $scope.data.supervision1 = sm1;


        if (isB && $scope.data.supervision1.length && !batch.ParentCompanyId) {
          batch.ParentCompanyId = $scope.data.supervision1[0].UnitId;
        }
        if (api.szgc.vanke.isPartner(1) && !flag) {
          batch.Count = (batch.JLCount || 0) + 1;
          var fd = results[3].data.Rows.find(function(it) {
            return it.UnitId == api.szgc.vanke.getPartner()
          });
          var nn = [];
          if (fd) {
            nn.push(fd);
            if (!batch.SupervisorCompanyId)
              batch.SupervisorCompanyId = fd.UnitId;
            $scope.data.construction = nn;
          }
        } else {
          batch.Count = (batch.WKCount || 0) + 1;
          var nn = [];
          results[3].data.Rows.forEach(function (r) {
            if (nn.find(function (r1) { return r1.UnitId == r.UnitId }) == null) {
              nn.push({
                UnitId: r.UnitId,
                UnitName: r.UnitName
              })
            }
          })
          $scope.data.construction = nn;
          if ($scope.data.construction.length && !batch.SupervisorCompanyId)
            batch.SupervisorCompanyId = $scope.data.construction[0].UnitId;
        }

        results[0].data.Rows.forEach(function(item) {
          item.TargetName = RemoveStr(item.TargetName);
          item.checked = true;

          if (item.TargetTypeId == '018C0866-1EFA-457B-9737-7DCEFEA148F6') {
            $scope.targets.zk.push(item);
          } else {
            item.CheckNum = (item.CheckNum == 0) ? "" : item.CheckNum;
            item.PassRatio = (item.PassRatio == 0) ? "" : item.PassRatio;
            $scope.targets.yb.push(item);
          }
          //appConfig.procedureId
          if (procedure =='2814510f-0188-4993-a153-559b40d0b5e8') {
            if ($scope.targets.yb.length == 3 || $scope.targets.yb.length == 7) {
              $scope.targets.yb.push({
                TargetName: '-',
                DeviationLimit: '≥80',
                items: (function () {
                  var ns = [];
                  for (var i = $scope.targets.yb.length - 1; i >= 0; i--) {
                    var n = $scope.targets.yb[i];
                    if (n.TargetName && n.TargetName.substring(0, 1) == '-') break;
                    ns.push(n)
                  };
                  return ns;
                })(),
                checked:false,
                getPassRatio: function () {
                  var sum=0,l=0;
                  this.items.forEach(function (item) {
                    if (item.PassRatio) {
                      sum = utils.math.sum(item.PassRatio, sum);
                      l++;
                    }
                  });
                  if (l == 0) return null;
                  return utils.math.div(sum, l);
                },
                ok: function () {
                  var p = this.getPassRatio();
                  return !p || p >= 80;
                }
              });
            }
            if ($scope.targets.yb.length == 8) {
              $scope.targets.yb.push({
                TargetName: '--',
                DeviationLimit: '≥85',
                checked: false,
                getPassRatio: function () {
                  var sum = 0,l=0;
                  $scope.targets.yb.forEach(function (item) {
                    if (!item.getPassRatio) {
                      sum = utils.math.sum(item.PassRatio, sum);
                      l++;
                    }
                  });
                  if (l == 0) return null;
                  return utils.math.div(sum, l);
                },
                ok: function () {
                  var p = this.getPassRatio();
                  return !p || p >= 85;
                }
              });
            }
          }
        });
        //utils.scrollTop();
        initIng = true;
      });
    });


    $scope.$watch('data.curHistory.SupervisorCompanyId', function() {

      if ($scope.data.curHistory.SupervisorCompanyId) {
        var s1 = api.szgc.vanke.isPartner() ? [] : [$scope.data.submitUsers[0]];
        api.szgc.vanke.employees($scope.data.curHistory.SupervisorCompanyId).then(function(result) {
          result.data.data.forEach(function(item) {
            s1.push({
              type: 'jl',
              id: item.employee_id,
              name: item.name + (item.phone ? '(' + item.phone + ')' : '')
            });
          });
          var fd = s1.find(function(f) {
            return f.id == user.Id
          });
          if (!fd) {
            fd = {
              type: 'jl',
              id: user.Id,
              name: user.RealName + '(本人)'
            };
            s1.push(fd);
          }
          if (fd) {
            if (fd.name.indexOf('(本人)') == -1)
              fd.name += '(本人)';

            $scope.data.curStep.CheckWorker = fd.id;
          }
          $scope.data.submitUsers = s1;

        });
      }
    })
    var resetGroup = function() {
      //console.log('111')
      var g = [];

      $scope.data.groups = [];
      $q.all([!$scope.data.isB && $scope.data.curHistory.CompanyId ? api.szgc.vanke.teams($scope.data.curHistory.CompanyId) : $q(function(resolve) {

        resolve({
          data: {
            data: []
          }
        })
      }), !$scope.data.isB && $scope.data.curHistory.ParentCompanyId && $scope.data.curHistory.ParentCompanyId != $scope.data.curHistory.CompanyId ? api.szgc.vanke.teams($scope.data.curHistory.ParentCompanyId) : $q(function(resolve) {
        resolve({
          data: {
            data: []
          }
        })
      })]).then(function(results) {
        results[0].data.data.forEach(function(item) {
          if (item && item.skills && item.skills.length&&$stateParams.procedureTypeId) {
            if (item.skills.find(function (sk) { return sk.skill_id == $stateParams.procedureTypeId; }) == null) {
              return;
            }
          }
          var ns = [];
          item.managers.forEach(function(it) {
            ns.push(it.name);
          });
          g.push({
            id: item.team_id,
            name: $scope.data.curHistory.CompanyName + ' - ' + item.name + (ns.length ? '(' + ns.join(';') + ')' : '')
          });
        });
        results[1].data.data.forEach(function(item) {
          if (item && item.skills && item.skills.length&&$stateParams.procedureTypeId) {
            if (item.skills.find(function (sk) { return sk.skill_id == $stateParams.procedureTypeId; }) == null) {
              return;
            }
          }
          var ns = [];
          item.managers.forEach(function(it) {
            ns.push(it.name);
          });
          g.push({
            id: item.team_id,
            name: $scope.data.curHistory.ParentCompanyName + ' - ' + item.name + (ns.length ? '(' + ns.join(';') + ')' : '')
          });
        });
        //console.log('----',$scope.data.groups);
        if (g.length)
          $scope.data.groups = g;

      })

    }
    $scope.$watch('data.curHistory.ParentCompanyId', resetGroup)
    $scope.$watch('data.curHistory.CompanyId', resetGroup);

    $scope.targets = {
      zk: [],
      yb: []
    }
    //ProcedureService.getbyid(procedure).then(function (result) {
    //    $scope.data.procedure = result.data;
    //});




    //移除重复项
    var RemoveStr = function(str) {
      var strarr = str.split('>');
      var strarr2 = [];
      strarr.forEach(function(item) {
        item = item.replace(/(^\s*)|(\s*$)/g, '');
        if (!strarr2.length || strarr2[strarr2.length - 1] != item) {
          strarr2.push(item);
        }
      });
      return strarr2.join('>');
    };

    //批量保存
    var toSaveTargets = function(step) {
      var savetargets = [];
      $scope.targets.zk.forEach(function (zkitem) {
        if (zkitem.checked) {
          //遍历获取主控数据
          savetargets.push({
            CheckStepId: step.Id,
            TargetId: zkitem.Id,
            PassText: zkitem.PassText,
            NoPassText: zkitem.NoPassText,
            ProcedureId: procedure,
            MPCheckValue: zkitem.isOK?1:0,
            CheckWorker: step.CheckWorker,
            TargetTypeId: zkitem.TargetTypeId,
            Sort: zkitem.Sort,
            Status: 4,
            RoleId: step.RoleId,
            HistoryNo: step.CheckNo,
            Remark: zkitem.Remark,
            CheckDate: $scope.m.CheckDate
          });
        }
      })

      //遍历获取一般项目数据
      $scope.targets.yb.forEach(function (zkitem) {
        if (zkitem.checked) {
          savetargets.push({
            CheckStepId: step.Id,
            TargetId: zkitem.Id,
            CheckNum: zkitem.CheckNum, //检查点数
            PassRatio: zkitem.PassRatio, //合格率
            MaxDeviation: zkitem.MaxDeviation, //最大偏差
            ProcedureId: procedure,
            DeviationLimit: zkitem.DeviationLimit,
            TargetTypeId: zkitem.TargetTypeId,
            Sort: zkitem.Sort,
            Status: 4,
            RoleId: step.RoleId,
            HistoryNo: step.CheckNo,
            Remark: zkitem.Remark,
            CheckDate: $scope.m.CheckDate
          });
        }
      })
      return savetargets;
    }
    $scope.save = function(addForm) {

      var m = /(((20[0-9][0-9]-(0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|(20[0-3][0-9]-(0[2469]|11)-(0[1-9]|[12][0-9]|30))) (20|21|22|23|[0-1][0-9]):[0-5][0-9]:[0-5][0-9])/
      var s = $scope.m.CheckDate;
      if(!m.test(s)){
        utils.alert('日期格式不对!(yyyy-MM-dd HH:dd:ss)');
        return;
      }
      if ($scope.data.pics.length == 0) {
        utils.alert('请上传原验收照片');
        return;
      }
      utils.confirm(null, '确认向验收批：' + $scope.data.curHistory.BatchNo + ' 添加新记录吗?').then(function() {
        $scope._save(addForm);
      });

    }


    $scope._save = function (addForm) {


      $scope.isSaveing = true;
      //addForm
      var data = $scope.data,
        step = data.curStep,
        batch = data.curHistory;
      if (!batch.GrpId) {
        utils.alert('请选择班组', function () {
          $scope.isSaveing = false;
        });
        return;
      }
      step.RoleId = data.submitUser.type;
      step.CheckNo = batch.Count;
      step.MainResult = $scope.zkIsOk() ? 1 : 0;
      step.OtherResult = $scope.ybIsOk() ? 1 : 0;
      step.AllResult = $scope.zkIsOk() && $scope.ybIsOk() ? 1 : 0;
      step.MinPassRatio = $scope.targets.yb.length == 0 ? 100 : $scope.ybHGL();
      step.Status = 4;
      if (step.CheckWorkerName) {
        var ix = step.CheckWorkerName.indexOf('(');
        if (ix != -1)
          step.CheckWorkerName = step.CheckWorkerName.substring(0, ix);
      }


      batch.ProcedureId = procedure;
      batch.EngineeringProjectId = idtree.split('>')[0];
      batch.Status = 4;
      batch.RegionId = pid;
      batch.RegionType = rt;
      batch.RegionIdTree = idtree;
      batch.RegionNameTree = nametree;
      //console.log('batch.RegionNameTree', batch.RegionNameTree)
      batch.RegionName = rname;
      //将第一验收批的信息复制到所有验收批
      data.batchs.forEach(function (item) {
        if (item != batch) {
          item.ProcedureId = batch.ProcedureId;
          item.EngineeringProjectId = batch.EngineeringProjectId;
          item.Status = batch.Status;
          item.RegionId = batch.RegionId;
          item.RegionType = batch.RegionType;
          item.RegionIdTree = batch.RegionIdTree;
          item.RegionNameTree = batch.RegionNameTree;
          item.RegionName = batch.RegionName;
          item.SupervisorCompanyId = batch.SupervisorCompanyId;
          item.SupervisorCompanyName = batch.Count.SupervisorCompanyName;
          item.ParentCompanyName = batch.ParentCompanyName;
          item.ParentCompanyId = batch.ParentCompanyId;
          item.CompanyId = batch.CompanyId;
          item.CompanyName = batch.CompanyName;
          item.GrpId = batch.GrpId;
          item.GrpName = batch.GrpName;
        }
      });
      var targets = toSaveTargets(step);

      //console.log('CheckData', targets)
      api.szgc.addProcessService.postCheckData({
        Id:sxt.uuid(),
        Batch: data.batchs,
        Step: step,
        CheckData: targets
      }).then(function (result) {
        api.szgc.ProcedureService.deleteAppImg(step.GroupImg2);
        $scope.isSaveing = false;
        $scope.$parent.project.filter(true);
        utils.alert('提交完成').then(function () {
            $state.go('app.szgc.ys');
        });
      });
    }
    $scope.rowIsOk = function(pc, hg, mk) {
      mk = parseInt(mk);
      if (isNaN(mk)) return true;
      pc = pc.replace('mm', '');
      var zf = pc.indexOf('±') != -1;
      var isIn = pc.indexOf(',');
      if (isIn) {
        var ins = pc.split(',');
      }
    }
    $scope.zkIsOk = function(n) {
      //主控项是否全合格
      for (var i = 0, l = $scope.targets.zk.length; i < l; i++) {
        if ($scope.targets.zk[i].checked && !$scope.targets.zk[i].isOK) {
          return false;
        }
      }


      return true;

    }
    $scope.value = 2;
    $scope.user = 1;
    $scope.addCircle = function(i){

    }
    $scope.ybIsOk = function() {
      for (var i = 0, l = $scope.targets.yb.length; i < l; i++) {
        var yb = $scope.targets.yb[i];
        if ((yb.ok && !yb.ok()) || (yb.checked && !yb.isOK)) return false;
      }
      return true;
    }
    $scope.ybBlur = function(item) {
      var zdpc = item.MaxDeviation;
      var pattern = /^[0-9]+([.]\d{1,2})?$/;
      if (zdpc) {
        if (!pattern.test(zdpc)) {
          if (!pattern.test(zdpc)) {
            utils.alert("您输入最大偏差值格式不正确！");
            item.MaxDeviation = '';
          }
        }
      }

    }
    $scope.ybIsOkRow = function (item) {
      //if (item.getPassRatio) {
      //    return item.ok();
      //}
      if (!item.checked) {
        item.isOK = true;
        return item.isOK;
      }
      var zdpc = item.MaxDeviation;
      //var pattern = /^[0-9]+([.]\d{1,2})?$/;
      //if (zdpc) {
      //    if (!pattern.test(zdpc)) {
      //        item.isOK = false;
      //        return false;
      //    }
      //}
      zdpc = parseFloat(zdpc);
      var hgl = parseFloat(item.PassRatio),
        pc = item.DeviationLimit,
        op = pc.substring(0, 1);
      if (isNaN(hgl) || isNaN(zdpc)) {
        item.isOK = false;
        return true;
      }
      if (hgl < 80) {
        item.isOK = false;
        return false;
      }
      var isIn = pc.match(/(-?[\d.])+/g); //(\.\d{2})?：

      // console.log("isIn", isIn);
      if (isIn && isIn.length > 0) {
        var min = 0,
          max = parseFloat(isIn[0]);

        if (isIn && isIn.length > 1) {
          min = parseFloat(isIn[1]);
          if (max < min) {
            max = min;
            min = parseFloat(isIn[0]);
          }
        }
        if (max < min) {
          var t11 = max;
          max = min;
          min = t11;
        }

        if (op == '±') {
          min = -max;
        } else if (op == '+') {
          min = 0;
        } else if (op == '-') {
          max = -max;
        } else if (op == '≥') {
          min = max;
          max = 10000000;
        } else if (op == '＞') {
          min = utils.math.sum(max, 0.1);
          max = 10000000;
        } else if (op == '≤') {
          min = -10000000;
        } else if (op == '＜') {
          max = utils.math.sub(max, 0.1);
          min = -10000000;
        }
        max = utils.math.mul(max, 1.5);
        if (min > 0)
          min = utils.math.mul(min, 0.5);
        else
          min = utils.math.mul(min, 1.5);
        //console.log(min, max, zdpc)
        if (zdpc < min || zdpc > max) {
          item.isOK = false;
          return false;
        }
        item.isOK = true;
        return item.isOK;
      } else {
        item.isOK = true;
        return item.isOK;
      }
    }
    $scope.ybHGL = function() {
      var hgl;
      for (var i = 0, l = $scope.targets.yb.length; i < l; i++) {
        var ybd = parseFloat($scope.targets.yb[i].PassRatio);
        if (!isNaN(ybd) && (!hgl || hgl > ybd)) hgl = ybd;
      }
      return hgl;
    }
    $scope.ybHGLPJ = function() {
      var hgl = 0,c=0;
      for (var i = 0, l = $scope.targets.yb.length; i < l; i++) {
        var ybd = parseFloat($scope.targets.yb[i].PassRatio);
        if (!isNaN(ybd)) {
          hgl = utils.math.sum(hgl, ybd);
          c++;
        }
      }
      return c == 0 ? '' : utils.math.div(hgl, c);
    }


  }
})();

/**
 * Created by zhangzhaoyong on 16/2/1.
 */
(function(){
  'use strict';

  SzgcSettingsController.$inject = ["profile", "auth", "api", "$scope", "utils", "$rootScope", "appCookie", "$mdDialog"];
  angular
    .module('app.szgc')
    .controller('SzgcSettingsController',SzgcSettingsController);

  /** @ngInject */
  function SzgcSettingsController(profile,auth,api,$scope,utils,$rootScope,appCookie,$mdDialog){

    var vm = this;
    vm.profile = profile.data.data;
    vm.logout = function(){
      api.uploadTask(function (cfg,item) {
        return true
      }).then(function (result) {
        if(result.rows.length){
          utils.confirm('您有'+result.rows.length+'条数据未上传，确定清除所有缓存数据并退出吗？').then(function (result) {
            appCookie.remove('projects');
            vm.trueClear([]);
            //auth.logout();
          })
        }
        else {
          utils.confirm('退出将清除当前人所有缓存数据，确定退出吗?').then(function (result) {
            appCookie.remove('projects');
            vm.trueClear([]);

          });
        }
      });
    }
    //服务器上保存版本信息
    api.szgc.version().then(function (r) {
      vm.serverAppVersion = r.data.verInfo;
    });
    $rootScope.$on('sxt:online', function(event, state){
      vm.networkState = api.getNetwork();
    });
    $rootScope.$on('sxt:offline', function(event, state){
      vm.networkState = api.getNetwork();
    });
    vm.networkState = api.getNetwork();
    $scope.$watch(function () {
      return vm.networkState
    },function () {
      api.setNetwork(vm.networkState);
    });
    vm.trueClear = function (exclude) {
      $mdDialog.show({
          controller: ['$scope','utils','$mdDialog',function ($scope,utils,$mdDialog) {
            api.clearDb(function (persent) {
              $scope.cacheInfo = parseInt(persent * 100) + '%';
            }, function () {
              $scope.cacheInfo = null;
              $mdDialog.hide();
              //utils.alert('清除成功');
            }, function () {
              $scope.cacheInfo = null;
              $mdDialog.cancel();
              utils.alert('清除失败');

            }, {
              exclude: exclude,
              timeout: 3000
            })
          }],
          template: '<md-dialog aria-label="正在清除"  ng-cloak><md-dialog-content> <md-progress-circular md-mode="indeterminate"></md-progress-circular> 正在清除数据，请稍候……({{cacheInfo}})</md-dialog-content></md-dialog>',
          parent: angular.element(document.body),
          clickOutsideToClose:false,
          fullscreen: false
        })
        .then(function(answer) {
          auth.logout();
        }, function() {

        });

      return;

    }
    vm.clearCache = function () {
      api.uploadTask(function (cfg,item) {
        return true
      }).then(function (result) {
        if(result.rows.length){
          utils.confirm('您有'+result.rows.length+'条数据未上传，确定清除所有缓存数据吗？').then(function (result) {
            //console.log('r', result);
            vm.trueClear(['v_profile']);
          })
        }
      else {
          utils.confirm('确定清除所有缓存数据吗?').then(function (result) {
            vm.trueClear(['v_profile']);
          });
        }
      });
    }
  }

})();

/**
 * Created by leshuangshuang on 16/6/4.
 */
(function(){
  'use strcit';

  yhydController.$inject = ["$scope", "api", "$stateParams", "$q", "$timeout", "$mdDialog", "appCookie", "$state"];
  angular
    .module('app.szgc')
    .controller('yhydController',yhydController);

  /** @ngInject*/
  function yhydController($scope,api,$stateParams,$q,$timeout,$mdDialog,appCookie,$state){
    var vm = this,query
    vm.project ={
      onQueryed:function () {
        vm.searBarHide = false;
      }
    }
    if($stateParams.pid) {
      vm.project.idTree = $stateParams.pid;
      appCookie.put('projects', JSON.stringify([{project_id: $stateParams.pid, name: $stateParams.pname}]))
    }
    query = function(){
      if (vm.project.type != '8')return;
      console.log('vm.project',vm.project)
      var params = {
        regionTreeId: vm.project.idTree?vm.project.idTree:"",
        maximumRows:10000,
        startrowIndex:0
      }
      api.szgc.projectMasterListService.getFileReportData(params).then(function(result){
        //console.log('result',result)
        rows = result.data.Rows;
        if (rows.length > 0) {
          var arr, groupid, promises = [];
          rows.forEach(function (e) {
            groupid =e.RegionTreeId;
            arr = groupid.split('-');

            promises.push(api.szgc.vanke.rooms({
              page_number: 1,
              page_size: 1000,
              building_id: arr[4],
              floor: arr[5]
            }).then(function (res) {
              var rooms = res.data.data;
              //console.log('a',res)
              rows.forEach(function (r) {
                arr = r.RegionTreeId.split('-');
                //console.log('arr',arr[6])
                var room = rooms.find(function (o) { return o.room_id == arr[6] });
                angular.extend(r, room);
              });
            }))
          })
          //console.log('pro',promises)
          $q.all(promises).then(function () {
            vm.rows = rows;
            //console.log('rows',vm.rows)
          }, function () {
            vm.rows = rows;
          })

        }
        else {
          vm.rows = [];
        }
      })
    }
    vm.viewItem = function(item){
      $state.go('app.szgc.yhyd',{
        pid:item.regionId,
        pname:item.regionName,
        idTree:item.idTree,
        type:item.type
      });
      return;
      //
      //vm.project.n = n;
      item.n=2;
      $mdDialog.show ({
          locals: {
            project: item
          },
          controller: 'SzgcyhydDlgController as vm',
          templateUrl: 'app/main/szgc/home/SzgcybgcDlg.html',
          parent: angular.element (document.body),
          clickOutsideToClose: true,
          fullscreen: true
        })
        .then (function (answer) {

        }, function () {

        });
    }

    var getNumName = function (str) {
      str = str.replace('十', '10')
        .replace('九', '9')
        .replace('八', '8')
        .replace('七', '7')
        .replace('六', '6')
        .replace('五', '5')
        .replace('四', '4')
        .replace('三', '3')
        .replace('二', '2')
        .replace('一', '1')
        .replace('十一', '11')
        .replace('十二', '12')
        .replace('十三', '13')
        .replace('十四', '14')
        .replace('十五', '15')
        .replace('十六', '16')
        .replace('十七', '17')
        .replace('十八', '18')
        .replace('十九', '19')
        .replace('二十', '20');
      var n = parseInt(/[-]?\d+/.exec(str));
      return n;
    };
    $scope.$watch('vm.project.idTree',function () {
      //console.log('vm.project.type',vm.project.type);
      if(vm.project.type==8){
        vm.search();
      }
    })
    vm.search =function () {
      vm.searBarHide=true;
      if (vm.project.type == '8') {
        vm.project.loading = true;
        var building_id = vm.project.idTree.split('>')[2];
        $q.all([
          api.szgc.vanke.rooms({
            building_id: building_id,
            page_size: 0,
            page_number: 1
          }, false),
          api.szgc.GetFileReportNum.getFileReportData({
            startrowIndex: 0,
            maximumRows: 100000,
            regionTreeId: vm.project.idTree
          }),
          api.szgc.ProcProBatchRelationService.getReport(vm.project.idTree, 8),
          api.szgc.ProcProBatchRelationService.getReport(vm.project.idTree, 32)
        ]).then(function (result) {
          vm.project.loading = false;
          result[0].data.data.sort(function (i1, i2) {
            var f1 = getNumName(i1.floor),
              f2 = getNumName(i2.floor);

            if (i1.floor == i2.floor || (isNaN(f1) && isNaN(f2)) || f1 == f2) {

              var n1 = getNumName(i1.name),
                n2 = getNumName(i2.name);
              if (!isNaN(n1) && !isNaN(n2))
                return n1 - n2;
              else if ((isNaN(n1) && !isNaN(n2)))
                return 1;
              else if ((!isNaN(n1) && isNaN(n2)))
                return -1;
              else
                return i1.name.localeCompare(i2.name);
            }
            else {
              if (!isNaN(f1) && !isNaN(f2))
                return f1 - f2;
              else if ((isNaN(f1) && !isNaN(f2)))
                return 1;
              else if ((!isNaN(f1) && isNaN(f2)))
                return -1;
              else
                return f1.name.localeCompare(f2.name);
            }
          });
          var rows = [];
          result[0].data.data.forEach(function (row) {
            var yb = result[1].data.Rows.find(function (d) {
              return d.RegionTreeId.indexOf(row.room_id) != -1;
            });
            var ys = result[2].data.Rows.find(function (d) {
              return d.RegionIdTree.indexOf('-'+row.floor)!=-1;
            });
            var ys1 = result[3].data.Rows.find(function (d) {
              return d.RegionIdTree.indexOf(row.room_id) != -1;
            });
            row.ybNum = yb ? yb.FileNum : 0;
            row.ysNum = (ys ? ys.YsNum : 0) + (ys1 ? ys1.YsNum : 0);
            row.hg = true;
            row.RegionIdTree = vm.project.idTree+'>'+building_id+'-'+row.floor
            //if (row.ybNum != 0 || row.ysNum != 0) {
            rows.push(row);
            //}
          });
          vm.project.rows = rows;
          vm.project.loading = false;
        });
      }
    }

  }
})();


/**
 * Created by emma on 2016/5/16.
 */
(function(){
  'use strcit';

  ybgcyhydController.$inject = ["$mdDialog", "$stateParams", "api", "appCookie", "utils", "$rootScope"];
  angular
    .module('app.szgc')
    .controller('ybgcyhydController',ybgcyhydController);

  /** @ngInject*/
  function ybgcyhydController($mdDialog,$stateParams,api,appCookie,utils,$rootScope){
    var vm = this;
    vm.project ={};
    vm.data = {
      projectId: $stateParams.regionId,
      projectName:$stateParams.regionName
    };
    vm.project = $stateParams;
    $rootScope.title = vm.data.projectName;
    api.szgc.FilesService.GetPartionId().then(function(r){
      vm.project.partions = r.data.Rows;
    })
    vm.project.n = 2;
    $mdDialog.show ({
        locals: {
          project: vm.project
        },
        controller: 'SzgcyhydDlgController as vm',
        templateUrl: 'app/main/szgc/home/SzgcybgcDlg.html',
        parent: angular.element (document.body),
        clickOutsideToClose: true,
        fullscreen: true
      })
      .then (function (answer) {

      }, function () {

      });
    //appCookie.put('projects',JSON.stringify([{project_id:$stateParams.pid,name:$stateParams.pname}]))
    //vm.playN = function(n){
    //  //console.log('vm',$stateParams)
    //  api.szgc.FilesService.GetPrjFilesByFilter($stateParams.regionId, { imageType: n }).then(function(r){
    //    if(r.data.Rows.length==0){
    //      utils.alert('暂无照片');
    //    }
    //    else {
    //      vm.project.n = n;
    //      $mdDialog.show ({
    //          locals: {
    //            project: vm.project
    //          },
    //          controller: 'SzgcyhydDlgController as vm',
    //          templateUrl: 'app/main/szgc/home/SzgcybgcDlg.html',
    //          parent: angular.element (document.body),
    //          clickOutsideToClose: true,
    //          fullscreen: true
    //        })
    //        .then (function (answer) {
    //
    //        }, function () {
    //
    //        });
    //    }
    //  })
    //}
  }
})();

/**
 * Created by emma on 2016/5/16.
 */
(function(){
  'use strcit';

  ybgcController.$inject = ["$scope", "api", "$stateParams", "$q", "$timeout", "$mdDialog", "appCookie", "$state"];
  angular
    .module('app.szgc')
    .controller('ybgcController',ybgcController);

  /** @ngInject*/
  function ybgcController($scope,api,$stateParams,$q,$timeout,$mdDialog,appCookie,$state){
    var vm = this,query;

    vm.project ={
      onQueryed:function () {
        vm.searBarHide = false;
        //query();
      }
    }
    if($stateParams.pid) {
      vm.project.idTree = $stateParams.pid;
      appCookie.put('projects', JSON.stringify([{project_id: $stateParams.pid, name: $stateParams.pname}]))
    }
    query = function(){
      console.log('vm.project',vm.project)
      var params = {
        regionTreeId: vm.project.idTree?vm.project.idTree:"",
        maximumRows:10000,
        startrowIndex:0
      }
      api.szgc.projectMasterListService.getFileReportData(params).then(function(result){
        //console.log('result',result)
        var rows = result.data.Rows;
        vm.rows = rows;
/*        if (rows.length > 0) {
          var arr, groupid, promises = [];
          rows.forEach(function (e) {
            groupid =e.RegionTreeId;
            arr = groupid.split('-');

            promises.push(api.szgc.vanke.rooms({
              page_number: 1,
              page_size: 1000,
              building_id: arr[4],
              floor: arr[5]
            }).then(function (res) {
              var rooms = res.data.data;
              //console.log('a',res)
              rows.forEach(function (r) {
                arr = r.RegionTreeId.split('-');
                //console.log('arr',arr[6])
                var room = rooms.find(function (o) { return o.room_id == arr[6] });
                angular.extend(r, room);
              });
            }))
          })
          //console.log('pro',promises)
          $q.all(promises).then(function () {
            vm.rows = rows;
            //console.log('rows',vm.rows)
          }, function () {
            vm.rows = rows;
          })

        }
        else {
          vm.rows = [];
        }*/
      })
    }
    $timeout(function(){
      //query();
    },500)
    vm.viewItem = function(item){
      console.log('item',item);
      $state.go('app.szgc.yhyd',{
        pid:item.regionId,
        pname:item.regionName,
        idTree:item.idTree,
        type:item.type,
        seq:2
      });
      return;

      //vm.project.n = n;
      item.n=2;

      $mdDialog.show ({
          locals: {
            project: item
          },
          controller: 'SzgcyhydDlgController as vm',
          templateUrl: 'app/main/szgc/home/SzgcybgcDlg.html',
          parent: angular.element (document.body),
          clickOutsideToClose: true,
          fullscreen: true
        })
        .then (function (answer) {

        }, function () {

        });
    }
    $scope.$watch('vm.project.idTree', function() {
      if (!vm.project.idTree) {
        return;
      }
      query();
    });

  }
})();

/**
 * Created by guowei on 2016/2/2.
 */
(function(){
  'use strict';
  viewBathDetailController.$inject = ["$scope", "api", "$stateParams", "utils", "$q", "$state", "$mdDialog"];
  angular
    .module('app.szgc')
    .controller('viewBathDetailController',viewBathDetailController);
  function viewBathDetailController($scope,api,$stateParams,utils,$q,$state,$mdDialog) {

    $stateParams.bathid = $stateParams.bathid||$stateParams.bathId;
    var vm = this;
    vm.back = function(){
      $state.go('app.szgc.report.viewBath')
    }
    vm.isPartner = api.szgc.vanke.isPartner(1);
    vm.goAdd = function () {
      $state.go('app.szgc.ys.addnew',{
        projectid:$scope.titol.regionId,
        name:$scope.titol.RegionName,
        batchId:$stateParams.bathid,
        //procedureTypeId:project.procedureTypeId,
        procedureId:$scope.titol.ProcedureId,
        //type:project.type,
        idTree:$scope.titol.RegionIdTree,
        procedureName:$scope.titol.ProcedureName,
        nameTree:$scope.titol.RegionNameTree
      });
    }
    var newItem = function(name) {
      return {
        colspan: 1,
        rowspan: 1,
        name: name || '',
        isShow: function() { //是否显示此单元格
          return this.colspan != 0 && this.rowspan != 0;
        }
      }
    }
    //主控项目主要属性
    var newZKItem = function (TargetName, Remark, PassText, NoPassText, Id, MPCheckValue) {
      return {
        MPCheckValue:MPCheckValue,
        TargetName: TargetName,
        Remark: Remark,
        PassText: PassText,
        NoPassText: NoPassText,
        Id: Id,
        children: [],
        add: function (TargetName, Remark, PassText, NoPassText, MPCheckValue) {
          var me = this;
          me.children.push(newZKItem(TargetName, Remark, PassText, NoPassText, MPCheckValue))
        }
      }
    }

    var bingTargets = function(Rows) {
      var targets = {
        zk: [],
        yb: []
      }
      if (Rows.length) {
        Rows.forEach(function (item) {
          if (item.DeviationLimit) {
            //item.DeviationPre = item.DeviationLimit.substring(0, 1);
            //item.DeviationLimit = item.DeviationLimit.substring(1)
          }
          if (item.TargetTypeId == '018C0866-1EFA-457B-9737-7DCEFEA148F6') {
            targets.zk.push(new newZKItem(item.TargetName, item.Remark, item.PassText, item.NoPassText, item.Id,item.MPCheckValue))
          } else {
            targets.yb.push(item);
            if ($scope.data.ProcedureId =='2814510f-0188-4993-a153-559b40d0b5e8') {
              if (targets.yb.length == 3 || targets.yb.length == 7) {
                targets.yb.push({
                  TargetName: '-',
                  DeviationLimit: '≥80',
                  items: (function () {
                    var ns = [];
                    for (var i = targets.yb.length - 1; i >= 0; i--) {
                      var n = targets.yb[i];
                      if (n.TargetName && n.TargetName.substring(0, 1) == '-') break;
                      ns.push(n)
                    };
                    return ns;
                  })(),
                  checked: false,
                  getPassRatio: function () {
                    var sum = 0, l = 0;
                    this.items.forEach(function (item) {
                      if (item.PassRatio) {
                        sum = utils.math.sum(item.PassRatio, sum);
                        l++;
                      }
                    });
                    if (l == 0) return null;
                    return utils.math.div(sum, l);
                  },
                  ok: function () {
                    var p = this.getPassRatio();
                    return !p || p >= 80;
                  }
                });
              }
              if (targets.yb.length == 8) {
                targets.yb.push({
                  TargetName: '--',
                  DeviationLimit: '≥85',
                  checked: false,
                  getPassRatio: function () {
                    var sum = 0, l = 0;
                    targets.yb.forEach(function (item) {
                      if (!item.getPassRatio) {
                        sum = utils.math.sum(item.PassRatio, sum);
                        l++;
                      }
                    });
                    if (l == 0) return null;
                    return utils.math.div(sum, l);
                  },
                  ok: function () {
                    var p = this.getPassRatio();
                    return !p || p >= 85;
                  }
                });
              }
            }
          }
        });
      } else {
        targets.zk.push(new newZKItem());
        targets.yb.push({
          TargetName: ''
        }); //需要名字，为让后面不判断是否为undefinded
      }
      targets.info = (function () { //用于合并单位格计算
        return {
          zyLength: 0,
          zyColLength: 0,
          ybLength: 0,
          ybColLength: 0,
          current: {},
          addzk: function () { //添加一个主控项目
            var me = this;
            me.zyLength++;
            me.additem(targets.zk, me.zyColLength);
          },
          additem: function (arr, len) { //添加一个项目（主控或一般）主要把列（names）和其它项目保持一致
            arr.push({
              names: (function () {
                var names = [];
                while (names.length < len) {
                  names.push(newItem());
                }
                return names;
              })()
            });
          },
          addyb: function () {
            var me = this;
            me.ybLength++;
            me.additem(targets.yb, me.ybColLength);

          },
          addcol: function (arr) {
            arr.forEach(function (item) {
              item.names.push(newItem());
            });
          },
          addybcol: function (iszk) {
            var me = this;
            if (iszk) {
              me.zyColLength++;
              me.addcol(targets.zk);
            } else {
              me.ybColLength++;
              me.addcol(targets.yb);
            }
          },
          cbRow: function (arr) {
            var ix = 0;
            arr.forEach(function (item) {
              for (var i = 0, l = item.names.length; i < l; i++) {
                var n = item.names[i];
                if (n.rowspan != 0) {
                  var rowspan = 1;
                  for (var ii = ix + 1, ll = arr.length; ii < ll; ii++) {
                    var next = arr[ii].names[i];
                    if (next.name != '' && n.name == next.name) {
                      rowspan++;
                      next.rowspan = 0;
                    } else {
                      next.rowspan = 1;
                      break;
                    }

                  }
                  n.rowspan = rowspan;
                }
              }
              ix++;
            });
            arr.forEach(function (item) {
              var p = null,
                colspan = 1;
              item.names.forEach(function (n) {
                if (!p || n.name == '' || p.name != n.name || p.rowspan != n.rowspan) {
                  if (p)
                    p.colspan = colspan;
                  n.colspan = 1;
                  colspan = 1;
                  p = n;

                } else {
                  colspan++;
                  n.colspan = 0;
                }
              })
              p.colspan = colspan;
            });
          },
          zyCount: function () {
            var me = this;
            me.zyLength = targets.zk.length;
            me.ybLength = targets.yb.length;
            me.cbRow(targets.zk);
            me.cbRow(targets.yb);
            return this.zyLength;
          },
          ybCount: function () {
            var me = this;
            me.zyLength = targets.zk.length;
            me.ybLength = targets.yb.length;
            me.cbRow(targets.zk);
            me.cbRow(targets.yb);
            return this.ybLength;
          },
          selected: function (n, iszk) {
            this.current[iszk ? 'zk' : 'yb'] = n;
            if (!iszk)
              targets.yb.forEach(function (it) {
                it.selected = false;
              });
            else
              targets.zk.forEach(function (it) {
                it.selected = false;
              });
            n.selected = true;
          },
          remove: function (iszk) {
            if (!this.current[iszk ? 'zk' : 'yb']) {
              alert('请选择行');
              return;
            }
            if (iszk) {
              if (targets.zk.length == 1) return;
              var ix = targets.zk.indexOf(this.current.zk);
              if (ix != -1) {
                targets.zk.splice(ix, 1);
                if (ix = targets.zk.length - 1)
                  ix = targets.zk.length - 1;
                this.selected(targets.zk[ix], true);

              }
            } else {
              if (targets.yb.length == 1) return;
              var ix = targets.yb.indexOf(this.current.yb);
              if (ix != -1) {
                targets.yb.splice(ix, 1);

                if (ix = targets.yb.length - 1)
                  ix = targets.yb.length - 1;
                this.selected(targets.yb[ix]);
              }
            }
          },
          removecol: function (iszk) {
            if (iszk) {
              var ix = this.zyColSelected;
              if (targets.zk[0].names.length == 1) return;
              this.zyColLength--;
              targets.zk.forEach(function (item) {
                item.names.splice(ix, 1);
              });
            } else {
              var ix = this.ybColSelected;
              if (targets.yb[0].names.length == 1) return;
              this.ybColLength--;
              targets.yb.forEach(function (item) {
                item.names.splice(ix, 1);
              });
            }
          },
          sortUp: function (iszk) {
            if (!this.current[iszk ? 'zk' : 'yb']) {
              alert('请选择行');
              return;
            }
            if (iszk) {
              var ix = targets.zk.indexOf(this.current.zk);
              if (ix != -1) {
                if (ix == 0) return;
                targets.zk[ix] = targets.zk[ix - 1];
                targets.zk[ix - 1] = this.current.zk;
              }
            } else {
              var ix = targets.yb.indexOf(this.current.yb);
              if (ix != -1) {
                if (ix == 0) return;
                targets.yb[ix] = targets.yb[ix - 1];
                targets.yb[ix - 1] = this.current.yb;
              }
            }
          },
          sortDown: function (iszk) {
            if (!this.current[iszk ? 'zk' : 'yb']) {
              alert('请选择行');
              return;
            }
            if (iszk) {
              var ix = targets.zk.indexOf(this.current.zk);
              if (ix != -1) {
                if (ix == targets.zk.length - 1) return;
                targets.zk[ix] = targets.zk[ix + 1];
                targets.zk[ix + 1] = this.current.zk;
              }
            } else {
              ix = targets.yb.indexOf(this.current.yb);
              if (ix != -1) {
                if (ix == targets.yb.length - 1) return;
                targets.yb[ix] = targets.yb[ix + 1];
                targets.yb[ix + 1] = this.current.yb;
              }
            }
          },
          cbCol: function (arr) {
            var maxL = 0;
            arr.forEach(function (item) {
              if (!item.names) {
                item.names = [];
                 var ns = [];
                  ns = (item.TargetName || '').split('>')
                for (var i = 0, l = ns.length; i < l; i++) {
                  item.names.push(newItem(ns[i]));
                }
              }
              if (maxL < item.names.length)
                maxL = item.names.length;

            });
            arr.forEach(function (item) {
              while (maxL > item.names.length)
                item.names.push(newItem());

            });
            return maxL
          },
          init: function () {
            var me = this;
            me.zyColLength = me.cbCol(targets.zk);
            me.ybColLength = me.cbCol(targets.yb);
          }
        }
      })();
      targets.info.init();
      return targets;
    }
    //符合率计算
    var fhl = function (jl, vk) {
      if (jl == vk) return '100';
      //var r = ((1 - accDiv(Math.abs(jl - vk), jl)) * 100).toString();
      var r = ((1 - utils.math.div(Math.abs(jl - vk), jl)) * 100).toString();
      var rs = r.split('.');
      if (rs.length == 2 && rs[1].length > 2) {
        return rs[0] + '.' + rs[1].substring(0, 2);
      }
      return rs.join('.');
    }


    $scope.ybHGL = function (yb) {
      var hgl;
      for (var i = 0, l = yb.length; i < l; i++) {
        var ybd = parseFloat(yb[i].PassRatio);
        if (!isNaN(ybd) && (!hgl || hgl > ybd)) hgl = ybd;
      }
      return hgl;
    }
    $scope.ybHGLPJ = function (yb) {
      var hgl = 0, c = 0;
      for (var i = 0, l = yb.length; i < l; i++) {
        var ybd = parseFloat(yb[i].PassRatio);
        if (!isNaN(ybd)) {
          hgl = utils.math.sum(hgl, ybd);
          c++;
        }
      }
      return  c == 0 ? '' : utils.math.div(hgl, c);
    }
    $scope.zkIsOk = function (zk) {
      //主控项是否全合格
      for (var i = 0, l = zk.length; i < l; i++) {
        if (zk[i].MPCheckValue==0) {
          return false;
        }
      }


      return true;

    }

    $scope.ybIsOk = function (yb) {
      for (var i = 0, l = yb.length; i < l; i++) {
        if ((yb[i].ok && !yb[i].ok()) || (yb[i].PassRatio && yb[i].PassRatio < 80)) return false;
      }
      return true;
    }


    $scope.data = {};
    $scope.titol = {};
    $scope.jlTitol = {};

    $scope.egTitol = {};
    $stateParams.titol = {};
    //验收批数据
    $q.all([
      api.szgc.ProcProBatchRelationService.getbyid($stateParams.bathid),
      api.szgc.addProcessService.getCheckStepByBatchId($stateParams.bathid, {status: 4})
    ]).then(function (rs) {
      var r = rs[0];
      $stateParams.titol = r.data;
      $scope.titol = r.data;
      //截取班组组长名称
      var fishIndex = 0;
      var lastIndex = 0;
      if ($scope.titol.GrpName) {
        fishIndex = $scope.titol.GrpName.indexOf("(");
        lastIndex = $scope.titol.GrpName.indexOf(")");
        if (fishIndex > 0 && lastIndex > 0) {
          $scope.titol.GrpName = $scope.titol.GrpName.substring(fishIndex + 1, lastIndex);
        } else {
          $scope.titol.GrpName = "";
        }
      }
      $scope.data.ProcedureId = r.data.ProcedureId;
      $scope.data.projectInfo = r.data.RegionNameTree + ' - ' + r.data.ProcedureName;

      var cbr = rs[1];

      $scope.jlTitol = {};

      $scope.egTitol = {};
      cbr.data.Rows.forEach(function(item) {
        if (item.RoleId == "jl") {
          $scope.jlTitol = item;
        } else if (item.RoleId == "eg") {
          $scope.egTitol = item;
        }

      });

      api.szgc.addProcessService.getAll($stateParams.bathid, {status: 4}).then(function(result){
        var group = [],
          gk = {},
                        eg,zb;
        result.data.Rows.forEach(function(item) {
          var g = gk[item.CheckStepId];
          if (!g) {
            g = gk[item.CheckStepId] = [];
                            if (item.RoleId == 'eg' || item.RoleId == '3rd') eg = g;
                            else if (item.RoleId == 'zb') zb = g;
            else if (!$scope.data.jl) {
              $scope.data.jl = item.CheckWorker;
              $scope.data.jldate = item.CreatedTime;
            }
            group.push(g);
          }
          g.push(item);
        });

        var jl = [];
        $scope.data.zb = zb && zb[0].CheckWorker;
                    //$scope.data.zbFll = eg && eg[0].CreatedTime;
        $scope.data.vk = eg && eg[0].CheckWorker;
        $scope.data.vkdate = eg && eg[0].CreatedTime;
        group.forEach(function(item) {
          if (item[0].RoleId == 'jl') {
            var i = 0;
            item.forEach(function(it) {
              if (it.TargetTypeId != '018C0866-1EFA-457B-9737-7DCEFEA148F6') {
                // console.log("eg[i].PassRatio", eg);
                if (eg && eg[i]) {
                  it.VKPassRatio = (eg[i].PassRatio == 0) ? '' : eg[i].PassRatio;
                } else {
                  it.VKPassRatio = ''
                }
                if (zb && zb[i]) {
                  it.ZbPassRatio = (zb[i].PassRatio == 0) ? '' : zb[i].PassRatio;
                } else {
                  it.ZbPassRatio = ''
                }

                it.FHL = eg && eg[i] && fhl(it.PassRatio, it.VKPassRatio);
                it.ZBFHL = zb && zb[i] && fhl(it.ZbPassRatio, it.PassRatio);
              }
              ;
              i++;
            });
            jl.push({
              ix: jl.length + 1,
              text: '第' + (jl.length + 1) + '次',
              d: bingTargets(item)
            });
          }
        });
        //console.log('j1',jl)
        jl.forEach(function(item) {
          item.step = cbr.data.Rows.find(function(it) {
            return it.RoleId == 'jl' && it.CheckNo == item.ix;
          });
          item.eg = eg ? cbr.data.Rows.find(function(it) {
                            return it.RoleId != 'jl' && it.CheckNo == eg[0].HistoryNo;
          }) : null;
          if(item.eg && !item.eg.load) {
            item.eg.load = true;
            api.szgc.addProcessService.getAllCheckDataValue(item.eg.Id).then(function (result) {
              item.eg.yb = [];
              eg.forEach(function (yb) {
                if(yb.TargetTypeId != '018C0866-1EFA-457B-9737-7DCEFEA148F6') { //不是主控
                  var jlyb = item.d.yb.find(function (jl) {
                    return jl.TargetId == yb.TargetId;
                  });
                  yb.points = [];
                  jlyb.egPoints = [];
                  item.eg.yb.push(yb);
                  var row = [];
                  result.data.Rows.forEach(function (item) {
                    if (yb.Id == item.CheckDataId) {
                      if (row.length == 20) {
                        yb.points.push(row)
                        jlyb.egPoints.push(row);
                        row = [];
                        row.push(item);
                      } else {
                        row.push(item);
                      }
                    }
                  });
                  if (row.length > 0) {
                    var len = row.length;
                    while (len < 20) {
                      row.push({
                        Value: ""
                      });
                      len++;
                    }
                    jlyb.egPoints.push(row);
                    //yb.points.push(row);
                  }
                }
              });
            })
          }
          item.text += '/共' + jl.length + '次'
        });

        $scope.data.sources = jl;
        $scope.data.selected = jl[jl.length - 1]; //取最后一次的验收数据
        var RemoveStr = function(str) {
          var strarr = str.split('>');
          var strarr2 = [];
          strarr.forEach(function(item) {
            item = item.replace(/(^\s*)|(\s*$)/g, '');
            if (!strarr2.length || strarr2[strarr2.length - 1] != item) {
              strarr2.push(item);
            }
          });
          return strarr2.join('>');
        };
        $scope.data.selected.d.yb.forEach(function (item) {
          item.TargetName = RemoveStr(item.TargetName)
          if (item.CheckNum == 0 && item.MaxDeviation == 0 && item.PassRatio == 0) {
            item.CheckNum = undefined;
            item.MaxDeviation = undefined;
            item.PassRatio = undefined;
          }
        });
      });
      $scope.th=[]
      for (var i=1;i<=20;i++){
        $scope.th.push({
           aglin:"center",
           Value:i
        })
      }
      $scope.$watch('data.selected',function () {
        if ($scope.data.selected && $scope.data.selected.d) {
          var s = $scope.data.selected;
          if (!s.load) {
            s.load = true;
            api.szgc.addProcessService.getAllCheckDataValue(s.step.Id).then(function (result) {
              if (result.data.Rows.length) {
                $scope.isShow = true;
              }
              s.d.yb.forEach(function (yb) {
                var row = [];
                yb.points = [];
                result.data.Rows.forEach(function (item) {
                  if (yb.Id == item.CheckDataId) {
                    if (row.length == 20) {
                      yb.points.push(row)
                      row = [];
                      row.push(item);
                    } else {
                      row.push(item);
                    }

                  }
                })
                if (row.length > 0) {
                  var len = row.length;
                  while (len < 20) {
                    row.push({
                      Value: ""
                    });
                    len++;
                  }
                  yb.points.push(row);
                }
              });
            })
          }
        }
      });
    });
  }
})();

/**
 * Created by zhangzhaoyong on 16/1/28.
 */
(function(){
  'use strict';

  viewBathController.$inject = ["$scope", "api", "$q", "$timeout", "$state", "utils"];
  angular
    .module('app.szgc')
    .controller('viewBathController',viewBathController);

  /** @ngInject */
  function viewBathController($scope,api,$q,$timeout,$state,utils){
    var vm = this;
    vm.is = function(route){
      return $state.is(route);
    }
    vm.ddd = {};
    vm.ddd.grpKey = "";

    vm.project = {
      onQueryed: function(data) {
        if (!vm.project.pid) {
          vm.project.data = data;
          queryTable();
        }
      }
    };
    var pt, ptype;
   // console.log('api',api)
    //质量总表
    vm.WorkGrops = []; //班组
    vm.getProjects = function() {
      api.szgc.vanke.projects({
        page_size: 1000,
        page_number: 1
      }).then(function(result) {
        vm.projects = result.data;
      })
    }
    vm.getProjects();
    // 返回
    vm.goback = function() {
      history.go(-1);
    }
    //专业类型
    //ProcedureTypeService.getAll('?startrowIndex=0&maximumRows=100&Status=4').then(function (result) {
    //    vm.project.procedureTypes = result.data.Rows;
    //});
    //加载工序
    var queryProcedures = function() {
      var t = 1;
      if (vm.project.type) {
        switch (vm.project.type) {
          case 1:
            t = 2;
            break;
          case 2:
            t = 8;
            break;
          case 8:
            t = 32;
            break;
          case 32:
            t = 64;
            break;
        }
      }
      if (pt == t && vm.project.procedureTypeId == ptype) return;
      pt = t;
      ptype = vm.project.procedureTypeId;
      api.szgc.BatchSetService.getAll({status:4,batchType: t}).then(function(result) {
        var data = [];
        //console.log("BatchSetServiceresult", result);
        result.data.Rows.forEach(function(item) {
          //if (vm.project.procedureTypeName != item.ProcedureType)
          //vm.project.ProcedureType = item.ProcedureType;
          if (!vm.project.procedureTypeId || vm.project.procedureTypeId == item.ProcedureTypeId) {
            data.push(item);
          }
        });
        vm.project.procedures = data;
      });
    }

    //施工单位信息
    api.szgc.vanke.partners({
      page_size: 1000,
      page_number: 1,
      type: 'construction'
    }).then(function(result) {
      vm.project.Company = result.data;
    })
    //班组信息
    vm.WorkGrops = [{
      Id: "",
      name: "全部",
      color: "blue",
      selected: false
    }]
    //选择班组
    var checkState = function(wkId) {
      vm.WorkGrops.forEach(function(item) {
        if (item.Id == wkId) {
          item.selected = true;
          item.color = "red";
        } else {
          item.selected = false;
          item.color = "blue";
        }
      })

    };

    api.szgc.ProcedureService.getAll({status:4}).then(function(r) {
      vm.project.produres = r.data;
    });
    //获取资料表数据
    var t1,queryTable = function() {
      vm.norecords = false;
      if(t1)
        $timeout.cancel(t1);
      vm.baths = {};

      t1 = $timeout(function(){
        var batchParems = {
          isGetChilde: 1,
          produreId: vm.project.procedureId,
          workGropId:vm.workGroupkey,// vm.project.workGroupId,
          companyId: vm.project.companyId,
          regionIdTree: vm.project.idTree
        }
         console.log('vm.project',batchParems)
        api.szgc.addProcessService.queryByProjectAndProdure3(vm.project.projectId, batchParems).then(function(result) {
          //cb(result.data);
          if (result.data.Rows.length > 0) {
            result.data.Rows.forEach(function(item) {
              if (item.AccordRatio > 0) {
                item.AccordRatio = item.AccordRatio * 100;
              } else {
                item.AccordRatio = undefined;
              }
            })
          }
          vm.baths = result.data;
          //initWorkGroup();
          //console.log('a',vm.baths.Rows)
          if(vm.baths.Rows.length){
            vm.norecords = false;
          }else {
            vm.norecords = true;
          }
          //截取班组组长名称
          var fishIndex = 0;
          var lastIndex = 0;
          vm.workGroupSources = [];
          vm.baths.Rows.forEach(function(item) {
            fishIndex = 0;
            //var idx =item.JLFirst.split('.');
            //if(idx[1]){
            //  item.JLFirst = Number(item.JLFirst).toFixed(1);
            //}

            if (item.GrpName) {
              item.firstName = item.GrpName.split("(")[0];
              fishIndex = item.GrpName.indexOf("(");
              lastIndex = item.GrpName.indexOf(")");
              if (fishIndex > 0 && lastIndex > 0) {
                item.GrpWokerName = item.GrpName.substring(fishIndex + 1, lastIndex);
              } else {
                item.GrpWokerName = "";
              }
              if (item.firstName&&item.GrpWokerName&&vm.workGroupSources.find(function (t) { return item.firstName == t.firstName; }) == null) {
                vm.workGroupSources.push({
                  id: item.GrpId,
                  name: item.GrpWokerName,
                  firstName:item.firstName,
                  text: item.GrpWokerName,
                  selected: false
                });
              }
            }

          });
      })

        //vm.newBaths= vm.baths.rows.slice(0,100);
        //console.log('vm.new',vm.newBaths)
        //$timeout(function() {
        //  vm.reverse = false;
        //  //vm.toggleSort('JLDate');
        //}, 1000);

      },500);

      //function initWorkGroup() {
      //  var fishIndex = 0;
      //  var lastIndex = 0;
      //  vm.workGroup.sources = [];
      //  vm.baths.Rows.forEach(function (item) {
      //    fishIndex = 0;
      //    if (item.GrpName) {
      //      fishIndex = item.GrpName.indexOf("(");
      //      lastIndex = item.GrpName.indexOf(")");
      //      if (fishIndex > 0 && lastIndex > 0) {
      //        item.GrpWokerName = item.GrpName.substring(fishIndex + 1, lastIndex);
      //      } else {
      //        item.GrpWokerName = "";
      //      }
      //      if (item.GrpWokerName&&vm.workGroup.sources.find(function (t) { return item.GrpWokerName == t.name; }) == null) {
      //        vm.workGroup.sources.push({
      //          id: item.GrpId,
      //          name: item.GrpWokerName,
      //          text: item.GrpWokerName,
      //          selected: false
      //        });
      //      }
      //    }
      //  });
      //}
      //t1 = $timeout(function(){
      //  if (vm.project.pid) {
      //    var batchParems = {
      //      isGetChilde: 1,
      //      produreId: vm.project.procedureId,
      //      workGropId: vm.project.workGroupId,
      //      companyId: vm.project.companyId,
      //      regionIdTree: vm.project.idTree
      //    }
      //    api.szgc.addProcessService.queryByProjectAndProdure3(vm.project.projectId, batchParems).then(function(result) {
      //      //cb(result.data);
      //      if (result.data.Rows.length > 0) {
      //        result.data.Rows.forEach(function(item) {
      //          if (item.AccordRatio > 0) {
      //            item.AccordRatio = item.AccordRatio * 100;
      //          } else {
      //            item.AccordRatio = undefined;
      //          }
      //        })
      //      }
      //      vm.baths = result.data;
      //      console.log('a',vm.baths.Rows)
      //      //console.log(" vm.baths ", result.data,vm.baths.Rows.length);
      //      if(vm.baths.Rows.length){
      //        vm.norecords = false;
      //      }else {
      //        vm.norecords = true;
      //      }
      //      //截取班组组长名称
      //      var fishIndex = 0;
      //      var lastIndex = 0;
      //      vm.baths.Rows.forEach(function(item) {
      //        fishIndex = 0;
      //        //var idx =item.JLFirst.split('.');
      //        //if(idx[1]){
      //        //  item.JLFirst = Number(item.JLFirst).toFixed(1);
      //        //}
      //
      //        if (item.GrpName) {
      //
      //          fishIndex = item.GrpName.indexOf("(");
      //          lastIndex = item.GrpName.indexOf(")");
      //          if (fishIndex > 0 && lastIndex > 0) {
      //            item.GrpWokerName = item.GrpName.substring(fishIndex + 1, lastIndex);
      //          } else {
      //            item.GrpWokerName = "";
      //          }
      //        }
      //
      //      });
      //      $timeout(function() {
      //        vm.reverse = false;
      //        //vm.toggleSort('JLDate');
      //      }, 1000);
      //
      //    });
      //
      //  }
      //  else if (vm.project.data) {
      //    var df = [],
      //      batchParems = {
      //        isGetChilde: 1,
      //        produreId: vm.project.procedureId,
      //        workGropId: vm.project.workGroupId,
      //        companyId: vm.project.companyId,
      //        regionIdTree: vm.project.idTree
      //      }
      //
      //    vm.project.data.items.forEach(function(p) {
      //      batchParems.regionIdTree = p.$id;
      //      df.push(api.szgc.addProcessService.queryByProjectAndProdure2(p.$id, batchParems));
      //    })
      //    $q.all(df).then(function(rs) {
      //      var bs = [];
      //      rs.forEach(function(r) {
      //        r.data.Rows.forEach(function(item) {
      //          if (item.AccordRatio > 0) {
      //            item.AccordRatio = (item.AccordRatio * 100).toFixed(1);
      //          } else {
      //            item.AccordRatio = undefined;
      //          }
      //          bs.push(item);
      //        });
      //      });
      //      vm.baths = {
      //        Rows: bs
      //      };
      //
      //      //截取班组组长名称
      //      var fishIndex = 0;
      //      var lastIndex = 0;
      //
      //      vm.baths.Rows.forEach(function(item) {
      //        // console.log("vm.GrpName", item.GrpName)
      //        if (item.GrpName) {
      //          fishIndex = 0;
      //          fishIndex = item.GrpName.indexOf("(");
      //          lastIndex = item.GrpName.indexOf(")");
      //          if (fishIndex > 0 && lastIndex > 0) {
      //            item.GrpWokerName = item.GrpName.substring(fishIndex + 1, lastIndex);
      //          } else {
      //            item.GrpWokerName = "";
      //          }
      //        }
      //      });
      //      $timeout(function() {
      //        vm.reverse = false;
      //        //vm.toggleSort('JLDate');
      //      }, 1000);
      //    })
      //  }
      //},500);
    }



    //区域改变
    $scope.$watch(function(){
      return vm.searBarHide;
      //return  vm.project.pid;
    }, function() {
      //console.log('sh',vm.searBarHide)
      if(vm.searBarHide)
      queryTable();
    })

    $scope.$watch(function(){
      return  vm.project.procedureId;
    }, function() {
      //queryTable();
    })

    $scope.$watch(function(){
      return  vm.project.companyId;
    }, function() {
      //queryTable();
    })

    //班组改变
    vm.changeWorkGrop = function(workGropId) {
      vm.project.workGroupId = workGropId;
      //queryTable();
      checkState(workGropId);
    }
    //动态加载工序
    //$scope.$watch(function(){
    //  return vm.project.procedureTypeId
    //}, queryProcedures);
    //$scope.$watch(function(){
    //  return vm.project.type;
    //}, queryProcedures);


  }
})();

/**
 * Created by emma on 2016/4/25.
 */
(function(){
  'use strict';

  supCheckResultController.$inject = ["$scope", "_projects", "$filter", "api", "utils"];
  angular
    .module('app.szgc')
    .controller('supCheckResultController',supCheckResultController);

  /** @ngInject */
  function supCheckResultController($scope,_projects,$filter,api,utils) {
    var vm=this;
    vm.m = { countType: 0 };
    vm.projects = _projects.data.data;
    for (var i = 0; i < vm.projects.length; i++) {
      vm.projects[i].selected = false;
    }
    vm.isChecked = false;
    //vm.selected = vm.projects;
    vm.toggle = function (item) {
      console.log('item',item)
      item.selected = !item.selected;
    };
    vm.toggleAll = function() {
      vm.isChecked = !vm.isChecked;
      if(vm.isChecked){
        for (var i = 0; i < vm.projects.length; i++) {
          vm.projects[i].selected = true;
        }
      }else{
        for (var i = 0; i < vm.projects.length; i++) {
          vm.projects[i].selected = false;
        }
      }
    };
    //初始化日期
    var dateFilter = $filter('date');
    vm.m.eDate = new Date();
    var d = new Date()
    d.setDate(d.getDate() - 7);
    vm.m.sDate = d;
    function trim(str) { //删除左右两端的空格
      return str.replace(/(^\s*)|(\s*$)/g, "");
    }


    $scope.$watch('vm.projects.pid', function (a, b) {
      vm.batchData2 = [];
      vm.CheckData = [];

      if ((!vm.m.sDate) || (!vm.m.eDate)) {
        utils.alert("查询时间不能为空！");
        return;
      }
      else if (vm.m.sDate > vm.m.eDate) {
        utils.alert("开始时间不能大于结束时间！");
        return;
      } else {
        GetSupervisorAccordRatio();
        vm.flag = true;

      }



    });

    $scope.$watch('vm.m', function (newValue, oldValue) {
      vm.batchData2 = [];
      vm.CheckData = [];
      if (newValue != oldValue) {
        if ((!vm.m.sDate) || (!vm.m.eDate)) {
          utils.alert("查询时间不能为空！");
          return;
        }
        else if (vm.m.sDate > vm.m.eDate) {
          utils.alert("开始时间不能大于结束时间！");
          return;
        } else {
          GetSupervisorAccordRatio();
          vm.flag = true;
        }
      }

    }, true);

    var GetSupervisorAccordRatio = function () {

      vm.startDateF = dateFilter(vm.m.sDate, 'yyyy-MM-dd');
      vm.endDateF = dateFilter(vm.m.eDate, 'yyyy-MM-dd');
      // console.log('时间', $scope.startDateF, $scope.endDateF)
      var params = {};
      params.startDate = vm.startDateF; //开始时间 格式：2015-01-10 必填
      params.endDate = vm.endDateF; //结束时间 格式：2015-01-10 必填
      params.regionIdTree = vm.projects.idTree ? vm.projects.idTree : '';//区域树ID 必填

      // console.log('params', params)
      vm.GrpName = [];
      vm.MinPassRatio = [];
      api.szgc.projectMasterListService.GetSupervisorAccordRatio(params).then(function (result) {
        console.log('a',result)
        vm.CheckData = result.data.Rows;

        vm.CheckWorkerNameE = [];
        vm.cAccordRatioE = [];
        vm.CheckData.forEach(function (item) {
          item.pAccordRatio = item.pAccordRatio.toFixed(2) * 100;
          item.sAccordRatio = item.sAccordRatio.toFixed(2) * 100;
          item.cAccordRatio = item.cAccordRatio.toFixed(2) * 100;
          vm.CheckWorkerNameE.push(item.CheckWorkerName);
          vm.cAccordRatioE.push(item.cAccordRatio);

        });
        //最大值显示10条数据
        //if ($scope.CheckWorkerNameE.length > 10) {
        //  $scope.cAccordRatioE.length = 10;
        //
        //}


        showReport();

        //图表显示
        //if ($scope.CheckData.length == 0) {
        //  $scope.flag = false;
        //}
        //showEchertGroup.showEchertGroup('main2', $scope.CheckWorkerNameE, $scope.cAccordRatioE, $scope.project.nameTree + "监理人员合格率排名")

        ////console.log('$scope.CheckData2', $scope.CheckData);




      });

      function showReport(){
        var xAxis_data = [];//x轴数据
        (function init() {

          if (vm.CheckData) {
            var Avg_JLLast, Avg_JLFirst;
            for (var i = 0; i < vm.CheckData.length; i++) {
              xAxis_data.push({
                //value: format(vm.reportData[i].ParentCompanyName),
                //textStyle: {
                //  fontSize: 8,
                //  color: '#858585',
                //  align: 'center'
                //}
                x:vm.CheckData[i].CheckWorkerName,
                y:vm.CheckData[i].cAccordRatio,
                color:'#FF7F50'
              });

            }
          }
        })();



        vm.data= {
          config: {
            showXAxis: true,
            showYAxis: true,
            showLegend: false,
            debug: true,
            stack: false,
            yAxis: {
              type: 'value',
              min: 0,
              max: 100
            },
            dataZoom:[
              {
                type: 'slider',
                show: true,
                start: 94,
                end: 100,
                handleSize: 8
              },
              {
                type: 'inside',
                start: 94,
                end: 100
              },
              {
                type: 'slider',
                show: true,
                yAxisIndex: 0,
                filterMode: 'empty',
                width: 12,
                height: '70%',
                handleSize: 8,
                showDataShadow: false,
                left: '93%'
              }
            ],
            series:{
              barMaxWidth: 20,
              barWidth:20,
              barMinHeight: 20
            },
          }
        };
        var pageload = {
          datapoints: xAxis_data
        };
        vm.data.data = [ pageload ];
      }

    }

  }


})();

/**
 * Created by zhangzhaoyong on 16/1/27.
 */
(function ()
{
  'use strict';

  SzgcReportController.$inject = ["$scope", "$state", "api", "utils"];
  angular
    .module('app.szgc')
    .controller('SzgcReportController', SzgcReportController);

  /** @ngInject */
  function SzgcReportController($scope,$state,api,utils)
  {

    var vm = this;
    // Data
    vm.data = {
      name: '报表详细',
      disabled: true,
      selectedIndex: 1
    }
    vm.tabs = [];
    if (!$state.is('app.szgc.report')) {
      vm.tabs.push({
        name: $state.is('app.szgc.report.viewBath')?'质量总表':
            $state.is('app.szgc.report.ybgcResult')?'隐蔽工程照片统计':
            $state.is('app.szgc.report.supCheckResult') ? '监理验收符合率统计' :
            $state.is('app.szgc.report.batchCount') ? '项目填报情况统计表' :
              $state.is('app.szgc.report.batchRaio') ? '班组验收合格率对比' :
              '报表详细'
      });
    }
    $scope.$watch(function(){
      return $state.is('app.szgc.report');
    },function(){
      vm.data.selectedIndex = $state.is('app.szgc.report')?0:1;
    });

    vm.goToReport = function (name, path, $event) {
      if(api.getNetwork()==1){
        utils.alert('离线模式下无法统计')
        return;
      }
      if (vm.tabs.length == 0) {
        vm.tabs.push({
          name: name
        });
      }
      else {
        vm.tabs[0].name = name;
      }
      vm.data.selectedIndex = 1;
      $state.go(path);
    }
    vm.onNavList = function () {
      vm.tabs.length = 0;
      $state.go('app.szgc.report');
      // $scope.tabs.splice($scope.data.selectedIndex-1, 1);
    };
  }
})();

/**
 * Created by guowei on 2016/2/1.
 */
(function(){
  'use strict';
  projectMasterListController1.$inject = ["$scope", "api", "showEcherts"];
  angular
    .module('app.szgc')
    .controller('projectMasterListController1',projectMasterListController1);

  /** @ngInject */
  function  projectMasterListController1($scope,api,showEcherts){
    var vm=this;
    vm.project = {};
    $scope.$watch('vm.project.idTree', function() {
      vm.init();
      GetCountBatchByProject();
      GetBatchDetails();

    });

    //项目总览
    var GetCountBatchByProject = function() {
      var params = {};
      params.regionIdTree = vm.project.idTree ? vm.project.idTree : '0';
      params.roleId = 'jl';
      api.szgc.projectMasterListService.GetCountBatchByProject(params).then(function(result) {
        vm.CountBatchByProject = result.data.Rows;

        vm.CountBatchByProject.forEach(function(item) {
          vm.percent = item.OKCount / (item.OKCount + item.NCount);
          item.percentE = (vm.percent.toFixed(2))*100
        });
      });
    };
    //工序总览
    var GetBatchDetails = function() {
      var params = {};
      params.regionIdTree = vm.project.idTree ? vm.project.idTree : '0';
      params.roleId = 'jl';
      api.szgc.projectMasterListService.GetBatchDetails(params).then(function(result) {
        vm.GetBatchDetails = result.data.Rows;

        vm.GetBatchDetails.forEach(function(item) {
          if (item.CheckResult == '复验合格') {
            item.isColor = 'aColor';
          } else if (item.CheckResult == '初验合格') {
            item.isColor = 'bColor';
          } else if (item.CheckResult == '初验不合格') {
            item.isColor = 'cColor';
          } else if (item.CheckResult == '复验不合格') {
            item.isColor = 'dColor';
          }
        });
      });
    };



    // 返回
    $scope.goback = function() {
      history.go(-1);
    }
    vm.init = function() {
      vm.GrpNameE = []; //项目总览
      vm.NCountE = []; //不合格
      vm.OKCountE = []; //合格
      var params = {};
      params.regionIdTree = vm.project.idTree ? vm.project.idTree : '0';
      params.roleId = 'jl';
      api.szgc.projectMasterListService.GetCountBatchByGroup(params).then(function(result) {
        vm.resultEcharts = result.data.Rows;

        vm.resultEcharts.forEach(function(item) {
          vm.GrpNameE.push(item.GrpName);
          vm.NCountE.push(item.NCount);
          vm.OKCountE.push(item.OKCount);
        });
        //最大值显示20条数据
        if (vm.GrpNameE.length > 20) {
          vm.GrpNameE.length = 20;
          vm.NCountE.length = 20;
          vm.OKCountE.length = 20;
        }
        vm.config = {
          title: vm.project.projectName + '班组施工情况',
          //subtitle: 'Line Chart Subtitle',
          showXAxis: true,
          showYAxis: true,
          showLegend: true,
          stack: false,
        };
        vm.data = [vm.NCountE,vm.OKCountE];
        //引用echarts 显示图形界面。
        //showEcherts.showEchert('main1', vm.project.projectName + '班组施工情况', vm.GrpNameE, vm.NCountE, vm.OKCountE)

      });

    };


  }
})();

/**
 * Created by emma on 2016/4/8.
 */
(function(){
  'use strict';

    batchRaioController.$inject = ["$scope", "_projects", "_skills", "$filter", "api", "utils"];
  angular
    .module('app.szgc')
    .controller('batchRaioController',batchRaioController);

  /** @ngInject */
    function batchRaioController($scope,_projects,_skills,$filter,api,utils) {
      var vm = this;
      vm.m = { countType: 0 };
      vm.projects = _projects.data.data;
      for (var i = 0; i < vm.projects.length; i++) {
        vm.projects[i].selected = false;
      }
      vm.isChecked = false;
      //vm.selected = vm.projects;
      vm.toggle = function (item) {
        console.log('item',item)
        item.selected = !item.selected;
      };
      vm.toggleAll = function() {
        vm.isChecked = !vm.isChecked;
        if(vm.isChecked){
          for (var i = 0; i < vm.projects.length; i++) {
            vm.projects[i].selected = true;
          }
        }else{
          for (var i = 0; i < vm.projects.length; i++) {
            vm.projects[i].selected = false;
          }
        }
      };
      //初始化班组
      vm.skills = _skills.data.data;
      for (var i = 0; i < vm.skills.length; i++) {
        vm.skills[i].selected = false;
      }
      vm.isSkillChecked = false;
      //vm.selected = vm.projects;
      vm.toggleskill = function (item) {
        console.log('item',item)
        item.selected = !item.selected;
      };
      vm.toggleSkillAll = function() {
        vm.isSkillChecked = !vm.isSkillChecked;
        if(vm.isSkillChecked){
          for (var i = 0; i < vm.skills.length; i++) {
            vm.skills[i].selected = true;
          }
        }else{
          for (var i = 0; i < vm.skills.length; i++) {
            vm.skills[i].selected = false;
          }
        }
      };

      //初始化日期
      var dateFilter = $filter('date');
      vm.m.eDate = new Date();
      var d = new Date()
      d.setDate(d.getDate() - 7);
      vm.m.sDate = d;

      $scope.$watch(function(){
        return vm.projects.project_id;
      }, function() {
        vm.batchData2 = [];
        if ((!vm.m.sDate) || (!vm.m.eDate)) {
          utils.alert("查询时间不能为空！");
          return;
        } else {
          //vm.search();
        }
      });

      $scope.$watch('m.eDate', function() {
        vm.batchData2 = [];
        if ((!vm.m.sDate) || (!vm.m.eDate)) {
          utils.alert("查询时间不能为空！");
          return;
        } else {
          //vm.search();
        }

      });
      $scope.$watch('m.sDate', function() {
        vm.batchData2 = [];
        if ((!vm.m.sDate) || (!vm.m.eDate)) {
          return;
        } else {
          //vm.search();
        }

      });
      function trim(str) { //删除左右两端的空格
        return str.replace(/(^\s*)|(\s*$)/g, "");
      }
      vm.postData = function(){
        if (vm.m.sDate && vm.m.eDate && (vm.m.sDate > vm.m.eDate)) {
          utils.alert("查询开始时间不能大于结束时间！");
          vm.searBarHide=false;
          return false;
        }
        api.szgc.grpFitRateService.getGrpFitRateByFiter(post.getPrjs(), post.getSkills(), vm.m.sDate, vm.m.eDate).then(function (_reportData) {
          if (_reportData.data && _reportData.data.Rows && _reportData.data.Rows.length > 0) {
            vm.reportData = _reportData.data.Rows;
            var fitArr = [];
            for (var i = 0; i < vm.reportData.length; i++) {
              vm.reportData[i].rate = vm.reportData[i].Avg_JLLast ? vm.reportData[i].Avg_JLLast : vm.reportData[i].Avg_JLFirst;
              if (vm.reportData[i].rate > 0 && vm.reportData[i].rate <= 100) {
                fitArr.push(vm.reportData[i]);
              }
            }
            vm.reportData = fitArr.sort(function (a, b) {
              return (a.rate - b.rate);
            });
            vm.searBarHide=true;
            showReport();
          } else {
            vm.searBarHide=false;
            utils.alert("查无数据!");
          }
        });
      }
      var post = {
        getPrjs: function () {
          var prjs = null;
          for (var i = 0; i < vm.projects.length; i++) {
            if (vm.projects[i].selected) {
              prjs =trim(prjs ? (prjs + ',' + vm.projects[i].project_id) : vm.projects[i].project_id);
            }
          }
          return prjs;
        },
        getSkills: function () {
          var skills;
          for (var i = 0; i < vm.skills.length; i++) {
            if (vm.skills[i].selected) {
              skills =trim(skills ? (skills + ',' + vm.skills[i].skill_id) : vm.skills[i].skill_id);
            }
          }
          return skills;
        }
      }
      //报表
      function showReport() {
        var xAxis_data = [];//x轴数据
        var fit_value = [];//y轴数据
        //初始化报表x,y轴的数据
        (function init() {

          function format(str_input) {
            var str_tmp = '';
            for (var i = 0; i < str_input.length; i = i + 2) {
             // str_tmp = str_tmp + str_input.substr(i, 2) + '\n';
              str_tmp = str_input.substr(0, 4);
            }
            return str_tmp;
          }
          function getName(str_input){
            var str='';
            if(str_input){
              var istr = str_input.split('(');
              if(istr[1]){
                var istr2=istr[1].split(')');
                return str = istr2[0];
              }else{
                return str = istr[0];
              }

              // console.log('aa',istr2)

            }

          }

          if (vm.reportData) {
            console.log('vm',vm.reportData)
            var Avg_JLLast, Avg_JLFirst;
            for (var i = 0; i < vm.reportData.length; i++) {
              vm.reportData[i].rate = (vm.reportData[i].rate).toFixed(0);
              xAxis_data.push({
                //x:format(vm.reportData[i].GrpName),
                x:getName(vm.reportData[i].GrpName),
                y:vm.reportData[i].rate,
                color:'#B5C334'
                //textStyle: {
                //  fontSize: 8,
                //  color: '#858585',
                //  align: 'center'
                //}
              });
              Avg_JLLast = $.isNumeric(vm.reportData[i].Avg_JLLast) ? vm.reportData[i].Avg_JLLast.toFixed(0) : Avg_JLLast;
              Avg_JLFirst = $.isNumeric(vm.reportData[i].Avg_JLFirst) ? vm.reportData[i].Avg_JLFirst.toFixed(0) : Avg_JLFirst
              fit_value.push(vm.reportData[i].Avg_JLLast ? Avg_JLLast : Avg_JLFirst);
            }
          }
        })();
        //呈现报表
        //var myChart3 = echarts.init(document.getElementById("report"));
        vm.data= {
          config: {
            showXAxis: true,
            showYAxis: true,
            showLegend: false,
            debug: true,
            stack: false,
            yAxis: {
              type: 'value',
              min: 0,
              max: 100
            },
            series:{
              data: fit_value,
              barMaxWidth: 20,
              barMinHeight: 20
            },
          }
        };
        var pageload = {
          datapoints: xAxis_data
        };
        vm.data.data = [ pageload ];
        console.log('dataa',vm.data.data)
        //myChart3.setOption({
        //  title: {
        //    text: '班组验收合格率对比',
        //    subtext: '单位(%)'
        //  },
        //  tooltip: {
        //    trigger: 'axis'
        //  },
        //  toolbox: {
        //    show: false,
        //    feature: {
        //      mark: { show: true },
        //      dataView: { show: true, readOnly: false },
        //      magicType: { show: true, type: ['line', 'bar'] },
        //      restore: { show: true },
        //      saveAsImage: { show: true }
        //    }
        //  },
        //  calculable: true,
        //  xAxis: [{
        //    axisLabel: {
        //      rotate: 0
        //    },
        //    type: 'category',
        //    data: xAxis_data
        //  }
        //  ],
        //  yAxis: [
        //    {
        //      type: 'value',
        //      min: 0,
        //      max: 100
        //    }
        //  ],
        //  series: [
        //    {
        //      name: '合格率',
        //      type: 'bar',
        //      data: fit_value,
        //      barMaxWidth: 20,
        //      barMinHeight: 20,
        //      itemStyle: {
        //        normal: {
        //          label: {
        //            show: true
        //          }
        //        }
        //      }
        //    }
        //  ]
        //});
        //var m = myChart3.getOption();
        //console.log('m',m);
      }
      vm.search = function () {
        if ((!vm.m.sDate) || (!vm.m.eDate)) {
          utils.alert("查询时间不能为空！");
          return;
        } else if (vm.m.sDate > vm.m.eDate) {
          utils.alert("开始时间不能大于结束时间！");
          return;
        }


        var startDate = dateFilter(vm.m.sDate, 'yyyy-MM-dd');
        var endDate = dateFilter(vm.m.eDate, 'yyyy-MM-dd');






      }
    }
})();

/**
 * Created by zhangzhaoyong on 16/1/28.
 */
(function(){
  'use strict';

  batchCountController.$inject = ["$scope", "$filter", "api"];
  angular
    .module('app.szgc')
    .controller('batchCountController',batchCountController);

  /** @ngInject */
  function batchCountController($scope,$filter,api){
    var vm = this;
    vm.m = { countType: 0 };
    vm.projectBatchCount = [];
    var tb = "";
    vm.printBatchCount = function () {
      if (vm.m.countType == 0) {
        $('#export').val($("#dvBatchCount").html());
      } else {
        $('#export').val($("#dvBatchCount2").html());
      }

    }

    var dateFilter = $filter('date');
    vm.project = {};
    vm.m.eDate = new Date();
    var d = new Date()
    d.setDate(d.getDate() - 7);
    vm.m.sDate = d;

    vm.search = function() {
      if ((!vm.m.sDate) || (!vm.m.eDate)) {
        utils.alert("查询时间不能为空！");
        return;
      } else if (vm.m.sDate > vm.m.eDate) {
        utils.alert("开始时间不能大于结束时间！");
        return;
      }

      var startDate = dateFilter(vm.m.sDate, 'yyyy-MM-dd');
      var endDate = dateFilter(vm.m.eDate, 'yyyy-MM-dd');
      vm.batchData2 = [];
      var lastProjectId = "";
      var colp = 0;
      api.szgc.projectMasterListService.GetBatchCount({
          starDate: startDate,
          endDate: endDate,
          projectId: vm.project.pid
        })
        .then(function (r) {
          vm.batchData2 = [];
          vm.projectBatchCount = [];
          //小计字段
          var tjCount = 0;
          var jdCount = 0;
          var zxCount = 0;
          var dayCount = 0;
          //总计字段
          var tjLastCount = 0;
          var jdLastCount = 0;
          var zxLastCount = 0;
          var dayLastCount = 0;
          var jlLastNumberCount = 0;
          var latProjectName = "";
          var i = 0;
          var row = 0;
          //  console.log("r.data", r.data);
          r.data.Rows.forEach(function(item) {
            if (item.projectId == lastProjectId) {
              //同一个项目数据
              tjCount = tjCount + item.tjNumber;
              jdCount = jdCount + item.jdNumber;
              zxCount = zxCount + item.zxNumber;
              dayCount = dayCount + item.dayCountNumber;

              vm.batchData2.push({
                projectName: item.projectName,
                CreatedTime: item.CreatedTime,
                dayCountNumber: item.dayCountNumber,
                jlNumber: item.jlNumber,
                jdNumber: item.jdNumber,
                tjNumber: item.tjNumber,
                zxNumber: item.zxNumber,
                minCunt:item.jlNumberCount,//小计，监理人数
                colp: 0,
                myCol: '#ffffff',
              });
              i += 1;
              row += 1;

            } else {
              //不同项目
              lastProjectId = item.projectId;
              if (i > 0) {
                jlLastNumberCount = jlLastNumberCount + vm.batchData2[vm.batchData2.length - 1].minCunt;
                //存储所有小计数据
                vm.projectBatchCount.push({
                  projectName: vm.batchData2[vm.batchData2.length - 1].projectName,
                  //CreatedTime: "小计",
                  dayCountNumber: dayCount,
                  jlNumber: vm.batchData2[vm.batchData2.length - 1].minCunt,
                  jdNumber: jdCount,
                  tjNumber: tjCount,
                  zxNumber: zxCount,
                  colp: 0,
                  myCol: '#ffffff',
                });
                //加小计数据
                vm.batchData2.push({
                  projectName: "",
                  CreatedTime: "小计",
                  dayCountNumber: dayCount,
                  jlNumber: vm.batchData2[vm.batchData2.length - 1].minCunt,
                  jdNumber: jdCount,
                  tjNumber: tjCount,
                  zxNumber: zxCount,
                  minCunt: item.jlNumberCount,//小计，监理人数
                  colp: 0,
                  myCol: '#efebeb',
                });

                tjCount = 0;
                jdCount = 0;
                zxCount = 0;
                dayCount = 0;
                //计算跨行
                row += 1;
                vm.batchData2[vm.batchData2.length - row].colp = row;
                row = 0;
              }

              tjCount = tjCount + item.tjNumber;
              jdCount = jdCount + item.jdNumber;
              zxCount = zxCount + item.zxNumber;
              dayCount = dayCount + item.dayCountNumber;

              vm.batchData2.push({
                projectName: item.projectName,
                CreatedTime: item.CreatedTime,
                dayCountNumber: item.dayCountNumber,
                jlNumber: item.jlNumber,
                jdNumber: item.jdNumber,
                tjNumber: item.tjNumber,
                zxNumber: item.zxNumber,
                minCunt: item.jlNumberCount,//小计，监理人数
                colp: 0,
                myCol: '#ffffff',
              });
              i += 1;
              row += 1;
            }
            tjLastCount = tjLastCount + item.tjNumber;
            jdLastCount = jdLastCount + item.jdNumber;
            zxLastCount = zxLastCount + item.zxNumber;
            dayLastCount = dayLastCount + item.dayCountNumber;


            //最后一条
            if (r.data.Rows.length == i) {
              jlLastNumberCount = jlLastNumberCount + vm.batchData2[vm.batchData2.length - 1].minCunt;
              //存储所有小计数据
              vm.projectBatchCount.push({
                projectName: vm.batchData2[vm.batchData2.length - 1].projectName,
                //CreatedTime: "小计",
                dayCountNumber: dayCount,
                jlNumber: vm.batchData2[vm.batchData2.length - 1].minCunt,
                jdNumber: jdCount,
                tjNumber: tjCount,
                zxNumber: zxCount,
                colp: 0,
                myCol: '#ffffff',
              });

              vm.batchData2.push({
                projectName: "",
                CreatedTime: "小计",
                dayCountNumber: dayCount,
                jlNumber: vm.batchData2[vm.batchData2.length - 1].minCunt,
                jdNumber: jdCount,
                tjNumber: tjCount,
                zxNumber: zxCount,
                minCunt: item.jlNumberCount,//小计，监理人数
                colp: 0,
                myCol: '#efebeb',
              });
              //计算跨行
              row += 1;
              vm.batchData2[vm.batchData2.length - row].colp = row;
              vm.batchData2.push({
                projectName: "",
                CreatedTime: "总计",
                dayCountNumber: dayLastCount,
                jlNumber: jlLastNumberCount,
                jdNumber: jdLastCount,
                tjNumber: tjLastCount,
                zxNumber: zxLastCount,
                minCunt: item.jlNumberCount,//小计，监理人数
                colp: 1,
                myCol: '#b9b3b3',
              });

              vm.projectBatchCount.push({
                projectName: "总计",
                //  CreatedTime: "总计",
                dayCountNumber: dayLastCount,
                jlNumber: jlLastNumberCount,
                jdNumber: jdLastCount,
                tjNumber: tjLastCount,
                zxNumber: zxLastCount,
                colp: 1,
                myCol: '#b9b3b3',
              });

              tjCount = 0;
              jdCount = 0;
              zxCount = 0;
              dayCount = 0;
            }

          })
        });
    }
    $scope.$watch(function(){
      return vm.project.pid;
    }, function() {
      vm.batchData2 = [];
      if ((!vm.m.sDate) || (!vm.m.eDate)) {
        utils.alert("查询时间不能为空！");
        return;
      } else {
        vm.search();
      }
    });

    $scope.$watch('m.eDate', function() {
      vm.batchData2 = [];
      if ((!vm.m.sDate) || (!vm.m.eDate)) {
        utils.alert("查询时间不能为空！");
        return;
      } else {
        vm.search();
      }

    });
    $scope.$watch('m.sDate', function() {
      vm.batchData2 = [];
      if ((!vm.m.sDate) || (!vm.m.eDate)) {
        return;
      } else {
        vm.search();
      }

    });
    // 返回
    vm.goback = function() {            vm.m = { countType: 0 };
      vm.projectBatchCount = [];
      var tb = "";
      vm.printBatchCount = function () {
        if (vm.m.countType == 0) {
          $('#export').val($("#dvBatchCount").html());
        } else {
          $('#export').val($("#dvBatchCount2").html());
        }

      }

      var dateFilter = $filter('date');
      vm.project = {};
      vm.m.eDate = new Date();
      var d = new Date()
      d.setDate(d.getDate() - 7);
      vm.m.sDate = d;

      vm.search = function() {
        if ((!vm.m.sDate) || (!vm.m.eDate)) {
          utils.alert("查询时间不能为空！");
          return;
        } else if (vm.m.sDate > vm.m.eDate) {
          utils.alert("开始时间不能大于结束时间！");
          return;
        }

        var startDate = dateFilter(vm.m.sDate, 'yyyy-MM-dd');
        var endDate = dateFilter(vm.m.eDate, 'yyyy-MM-dd');

        vm.batchData2 = [];
        var lastProjectId = "";
        var colp = 0;
        api.szgc.projectMasterListService.GetBatchCount({
            starDate: startDate,
            endDate: endDate,
            projectId: vm.project.pid
          })
          .then(function (r) {
            vm.batchData2 = [];
            vm.projectBatchCount = [];
            //小计字段
            var tjCount = 0;
            var jdCount = 0;
            var zxCount = 0;
            var dayCount = 0;
            //总计字段
            var tjLastCount = 0;
            var jdLastCount = 0;
            var zxLastCount = 0;
            var dayLastCount = 0;
            var jlLastNumberCount = 0;

            var latProjectName = "";
            var i = 0;
            var row = 0;
            //  console.log("r.data", r.data);
            r.data.Rows.forEach(function(item) {
              if (item.projectId == lastProjectId) {
                //同一个项目数据
                tjCount = tjCount + item.tjNumber;
                jdCount = jdCount + item.jdNumber;
                zxCount = zxCount + item.zxNumber;
                dayCount = dayCount + item.dayCountNumber;

                vm.batchData2.push({
                  projectName: item.projectName,
                  CreatedTime: item.CreatedTime,
                  dayCountNumber: item.dayCountNumber,
                  jlNumber: item.jlNumber,
                  jdNumber: item.jdNumber,
                  tjNumber: item.tjNumber,
                  zxNumber: item.zxNumber,
                  minCunt:item.jlNumberCount,//小计，监理人数
                  colp: 0,
                  myCol: '#ffffff',
                });
                i += 1;
                row += 1;

              } else {
                //不同项目
                lastProjectId = item.projectId;
                if (i > 0) {
                  jlLastNumberCount = jlLastNumberCount + vm.batchData2[vm.batchData2.length - 1].minCunt;
                  //存储所有小计数据
                  vm.projectBatchCount.push({
                    projectName: vm.batchData2[vm.batchData2.length - 1].projectName,
                    //CreatedTime: "小计",
                    dayCountNumber: dayCount,
                    jlNumber: vm.batchData2[vm.batchData2.length - 1].minCunt,
                    jdNumber: jdCount,
                    tjNumber: tjCount,
                    zxNumber: zxCount,
                    colp: 0,
                    myCol: '#ffffff',
                  });
                  //加小计数据
                  vm.batchData2.push({
                    projectName: "",
                    CreatedTime: "小计",
                    dayCountNumber: dayCount,
                    jlNumber: vm.batchData2[vm.batchData2.length - 1].minCunt,
                    jdNumber: jdCount,
                    tjNumber: tjCount,
                    zxNumber: zxCount,
                    minCunt: item.jlNumberCount,//小计，监理人数
                    colp: 0,
                    myCol: '#efebeb',
                  });

                  tjCount = 0;
                  jdCount = 0;
                  zxCount = 0;
                  dayCount = 0;


                  //计算跨行
                  row += 1;
                  vm.batchData2[vm.batchData2.length - row].colp = row;
                  row = 0;
                }

                tjCount = tjCount + item.tjNumber;
                jdCount = jdCount + item.jdNumber;
                zxCount = zxCount + item.zxNumber;
                dayCount = dayCount + item.dayCountNumber;

                vm.batchData2.push({
                  projectName: item.projectName,
                  CreatedTime: item.CreatedTime,
                  dayCountNumber: item.dayCountNumber,
                  jlNumber: item.jlNumber,
                  jdNumber: item.jdNumber,
                  tjNumber: item.tjNumber,
                  zxNumber: item.zxNumber,
                  minCunt: item.jlNumberCount,//小计，监理人数
                  colp: 0,
                  myCol: '#ffffff',
                });
                i += 1;
                row += 1;
              }
              tjLastCount = tjLastCount + item.tjNumber;
              jdLastCount = jdLastCount + item.jdNumber;
              zxLastCount = zxLastCount + item.zxNumber;
              dayLastCount = dayLastCount + item.dayCountNumber;


              //最后一条
              if (r.data.Rows.length == i) {
                jlLastNumberCount = jlLastNumberCount + vm.batchData2[vm.batchData2.length - 1].minCunt;
                //存储所有小计数据
                vm.projectBatchCount.push({
                  projectName: vm.batchData2[vm.batchData2.length - 1].projectName,
                  //CreatedTime: "小计",
                  dayCountNumber: dayCount,
                  jlNumber: vm.batchData2[vm.batchData2.length - 1].minCunt,
                  jdNumber: jdCount,
                  tjNumber: tjCount,
                  zxNumber: zxCount,
                  colp: 0,
                  myCol: '#ffffff',
                });

                vm.batchData2.push({
                  projectName: "",
                  CreatedTime: "小计",
                  dayCountNumber: dayCount,
                  jlNumber: vm.batchData2[vm.batchData2.length - 1].minCunt,
                  jdNumber: jdCount,
                  tjNumber: tjCount,
                  zxNumber: zxCount,
                  minCunt: item.jlNumberCount,//小计，监理人数
                  colp: 0,
                  myCol: '#efebeb',
                });
                //计算跨行
                row += 1;
                vm.batchData2[vm.batchData2.length - row].colp = row;
                vm.batchData2.push({
                  projectName: "",
                  CreatedTime: "总计",
                  dayCountNumber: dayLastCount,
                  jlNumber: jlLastNumberCount,
                  jdNumber: jdLastCount,
                  tjNumber: tjLastCount,
                  zxNumber: zxLastCount,
                  minCunt: item.jlNumberCount,//小计，监理人数
                  colp: 1,
                  myCol: '#b9b3b3',
                });

                vm.projectBatchCount.push({
                  projectName: "总计",
                  //  CreatedTime: "总计",
                  dayCountNumber: dayLastCount,
                  jlNumber: jlLastNumberCount,
                  jdNumber: jdLastCount,
                  tjNumber: tjLastCount,
                  zxNumber: zxLastCount,
                  colp: 1,
                  myCol: '#b9b3b3',
                });
                tjCount = 0;
                jdCount = 0;
                zxCount = 0;
                dayCount = 0;
              }

            })
          });
      }
      $scope.$watch('project.pid', function() {
        vm.batchData2 = [];
        if ((!vm.m.sDate) || (!vm.m.eDate)) {
          utils.alert("查询时间不能为空！");
          return;
        } else {
          vm.search();
        }

      });
      $scope.$watch('m.eDate', function() {
        vm.batchData2 = [];
        if ((!vm.m.sDate) || (!vm.m.eDate)) {
          utils.alert("查询时间不能为空！");
          return;
        } else {
          vm.search();
        }
      });
      $scope.$watch('m.sDate', function() {
        vm.batchData2 = [];
        if ((!vm.m.sDate) || (!vm.m.eDate)) {
          return;
        } else {
          vm.search();
        }

      });
      // 返回
      vm.goback = function() {
        history.go(-1);
      }
      history.go(-1);
    }
  }
})();

/**
 * Created by emma on 2016/4/8.
 */
(function(){
  'use strict';

  allRaioController.$inject = ["$scope", "_projects", "$filter", "api", "utils"];
  angular
    .module('app.szgc')
    .controller('allRaioController',allRaioController);

  /** @ngInject */
  function allRaioController($scope,_projects,$filter,api,utils){
    var vm=this;
    vm.m = { countType: 0 };
    vm.projects = _projects.data.data;
    for (var i = 0; i < vm.projects.length; i++) {
      vm.projects[i].selected = false;
    }
    vm.isChecked = false;
    //vm.selected = vm.projects;
    vm.toggle = function (item) {
      console.log('item',item)
      item.selected = !item.selected;
    };
    vm.toggleAll = function() {
      vm.isChecked = !vm.isChecked;
      if(vm.isChecked){
        for (var i = 0; i < vm.projects.length; i++) {
          vm.projects[i].selected = true;
        }
      }else{
        for (var i = 0; i < vm.projects.length; i++) {
          vm.projects[i].selected = false;
        }
      }
    };
    //初始化日期
    var dateFilter = $filter('date');
    vm.m.eDate = new Date();
    var d = new Date()
    d.setDate(d.getDate() - 7);
    vm.m.sDate = d;
    function trim(str) { //删除左右两端的空格
      return str.replace(/(^\s*)|(\s*$)/g, "");
    }

    vm.postData = function(){
      if (vm.m.sDate && vm.m.eDate && (vm.m.sDate > vm.m.eDate)) {
        utils.alert("查询开始时间不能大于结束时间！");
        vm.searBarHide=false;
        return false;
      }
      api.szgc.parentCompanyFitRateByFiter.getParentCompanyFitRateByFiter(post.getPrjs(), vm.m.sDate, vm.m.eDate).then(function (_reportData) {
        if (_reportData.data && _reportData.data.Rows && _reportData.data.Rows.length > 0) {
          vm.reportData = _reportData.data.Rows;
          var fitArr = [];
          for (var i = 0; i < vm.reportData.length; i++) {
            vm.reportData[i].rate = vm.reportData[i].Avg_JLLast ? vm.reportData[i].Avg_JLLast : vm.reportData[i].Avg_JLFirst;
            if (vm.reportData[i].rate > 0 && vm.reportData[i].rate <= 100) {
              fitArr.push(vm.reportData[i]);
            }
          }
          vm.reportData = fitArr.sort(function (a, b) {
            return (a.rate - b.rate);
          });
          console.log('report',_reportData)
          vm.searBarHide=true;
          showReport();
        } else {
          vm.searBarHide=false;
          utils.alert("查无数据!");
        }
      });
    }
    var post = {
      getPrjs: function () {
        var prjs = null;
        for (var i = 0; i < vm.projects.length; i++) {
          if (vm.projects[i].selected) {
            prjs =trim(prjs ? (prjs + ',' + vm.projects[i].project_id) : vm.projects[i].project_id);
          }
        }
        return prjs;
      }
    }
    //报表
    function showReport() {
      var xAxis_data = [];//x轴数据
      var fit_value = [];//y轴数据
      //初始化报表x,y轴的数据
      (function init() {

        function format(str_input) {
          var str_tmp = "";
          for (var i = 0; i < str_input.length; i = i + 2) {
             str_tmp+=str_input.substr(i, 2)+"\n";
            //str_tmp = str_input.substr(0, 2);
          }
          return str_tmp;
        }
        function formatter(val){
          return val.split("").join("\n");
        }

        if (vm.reportData) {
          var Avg_JLLast, Avg_JLFirst;
          for (var i = 0; i < vm.reportData.length; i++) {
            vm.reportData[i].rate =(vm.reportData[i].rate).toFixed(0)
            var name=vm.reportData[i].ParentCompanyName;
            xAxis_data.push({
              //value: format(vm.reportData[i].ParentCompanyName),
              //textStyle: {
              //  fontSize: 8,
              //  color: '#858585',
              //  align: 'center'
              //}
              x:name.substr(0,2),
              y:vm.reportData[i].rate,
              color:'#B5C334'
            });
            Avg_JLLast = $.isNumeric(vm.reportData[i].Avg_JLLast) ? vm.reportData[i].Avg_JLLast.toFixed(0) : Avg_JLLast;
            Avg_JLFirst = $.isNumeric(vm.reportData[i].Avg_JLFirst) ? vm.reportData[i].Avg_JLFirst.toFixed(0) : Avg_JLFirst;
            fit_value.push(vm.reportData[i].Avg_JLLast ? Avg_JLLast : Avg_JLFirst);
          }
        }
      })();
      //呈现报表
     //var myChart3 = document.getElementById("report");
      //console.log('data',xAxis_data)
      //$('#report').css('width',xAxis_data.length * 80 +'px');
      vm.data= {
        config: {
          showXAxis: true,
          showYAxis: true,
          showLegend: false,
          debug: true,
          stack: false,
          yAxis: {
            type: 'value',
            min: 0,
            max: 100
          },
          dataZoom:[
            {
              type: 'slider',
              show: true,
              start: 94,
              end: 100,
              handleSize: 8
            },
            {
              type: 'inside',
              start: 94,
              end: 100
            },
            {
              type: 'slider',
              show: true,
              yAxisIndex: 0,
              filterMode: 'empty',
              width: 12,
              height: '70%',
              handleSize: 8,
              showDataShadow: false,
              left: '93%'
            }
          ],
          series:{
            data: fit_value,
            barMaxWidth: 20,
            barMinHeight: 20
          },
        }
      };
      var pageload = {
        datapoints: xAxis_data
      };

      vm.data.data = [ pageload ];
      $(window).resize(function(){

    })
      //myChart3.setOption({
      //  title: {
      //    text: '班组验收合格率对比',
      //    subtext: '单位(%)'
      //  },
      //  tooltip: {
      //    trigger: 'axis'
      //  },
      //  toolbox: {
      //    show: false
      //  },
      //  calculable: true,
      //  xAxis: [
      //    {
      //      type: 'category',
      //      data: xAxis_data
      //    }
      //  ],
      //  yAxis: [{
      //    type: 'value',
      //    min: 0,
      //    max: 100
      //  }
      //  ],
      //  series: [
      //    {
      //      name: '合格率',
      //      type: 'bar',
      //      data: fit_value,
      //      barMaxWidth: 20,
      //      barMinHeight: 20,
      //      itemStyle: {
      //        normal: {
      //          label: {
      //            show: true
      //          }
      //        }
      //      }
      //    }
      //  ]
      //});
      //var m = myChart3.getOption();
      //console.log('m',m);
    }
  }
})();

/**
 * Created by jiuyuong on 2016/4/12.
 */
(function(){
  'use strict';
  xhUtils.$inject = ["$mdDialog", "$q"];
  angular
    .module('app.szgc')
    .factory('xhUtils',xhUtils);
  /** @ngInject */
  function xhUtils($mdDialog,$q){
    var o = {
      findAll:findAll,
      photo:photo,
      when:when,
      playPhoto:playPhoto,
      sort:sort,
      getMapPic:getMapPic
    };
    return o;

    function getNumName(str) {
      str = str.replace('十', '10')
        .replace('九', '9')
        .replace('八', '8')
        .replace('七', '7')
        .replace('六', '6')
        .replace('五', '5')
        .replace('四', '4')
        .replace('三', '3')
        .replace('二', '2')
        .replace('一', '1')
        .replace('十一', '11')
        .replace('十二', '12')
        .replace('十三', '13')
        .replace('十四', '14')
        .replace('十五', '15')
        .replace('十六', '16')
        .replace('十七', '17')
        .replace('十八', '18')
        .replace('十九', '19')
        .replace('二十', '20');
      var n = parseInt(/[-]?\d+/.exec(str));
      return n;
    };
    function sort(fn) {
      return function (s1,s2) {
        var a1 = fn(s1),
          a2 = fn(s2);

        var n1 = getNumName(a1),
          n2 = getNumName(a2);
        if (!isNaN(n1) && !isNaN(n2))
          return n1 - n2;
        else if ((isNaN(n1) && !isNaN(n2)))
          return 1;
        else if ((!isNaN(n1) && isNaN(n2)))
          return -1;
        else
          return a1.localeCompare(a2);
      }
    }

    function findAll(array,fn) {
      var buff=[];
      array.forEach(function (item) {
        if(fn(item)===true)
          buff.push(item);
      });
      return buff;
    }

    function getMapPic(maxZoom){
      var pics = [];
      for(var z=0;z<=maxZoom;z++){
        for(var x= 0,xl = Math.pow(2,z);x<xl;x++){
          for(var y= 0,yl = xl;y<yl;y++){
            pics.push(z+'_'+x+'_'+y)
          }
        }
      }
      return pics;
    }
    function photo($event) {
      return $mdDialog.show({
        targetEvent: $event,
        controller:['$scope', '$mdDialog',function ($scope, $mdDialog) {
          $scope.cancel = function () {
            //$mdDialog.hide('base');
            $mdDialog.cancel();
          }
          $scope.answer = function ($base64Url) {
            $mdDialog.hide($base64Url);
          }
        }],
        fullscreen:true,
        template: '<md-dialog style="width: 100%;max-width: 100%;height: 100%;max-height: 100%;" aria-label="List dialog">' +
        '  <md-dialog-content flex layout="column" style="padding: 0">' +
        '<photo-draw flex layout="column" on-cancel="cancel()" on-answer="answer($base64Url)"></photo-draw>' +
        '  </md-dialog-content>'+
        '</md-dialog>'
      });
    }

    function when(exec,result) {
      return exec().then(function (r) {
        if(result(r)!==false){
          return exec();
        }
        else
          return r;
      })
    }

    function playPhoto(images,options) {
      if(!images || !images.length)return;
      var str = [];
      str.push('<ul>')
      angular.forEach(images, function (data) {
        str.push('<li><img src="' + data.url + '" alt="'+data.alt+'"></li>');
      });
      str.push('</ul>');
      o = $(str.join('')).appendTo('body');

      var viewer = new Viewer(o[0],{
        button:true,
        scalable:false,
        hide:function(){
          viewer.destroy();
          o.remove();
          viewer = o=null;
        },
        build:function(){

        },
        view:function(){
        }
      });
      viewer.show();
      return viewer;
    }
  }
})();

/**
 * Created by jiuyuong on 2016/4/7.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .factory('viewImage',viewImage);

  var CONFIG = {
    CONTAINER: 'js-imageViewer-container',
    IMG_CONTAINER: 'js-imageViewer-base',
    MAG_GLASS: 'js-imageViewer-magGlass',
    IMG: 'js-imageViewer-img',
    CONTROL_ZOOM_IN: 'js-imageViewer-control-zoomIn',
    CONTROL_ZOOM_OUT: 'js-imageViewer-control-zoomOut',
    CONTROL_ZOOM_OUT_IS_DISABLED: 'imageViewer-controls-zoom_isDisabled',
    IMG_SRC_BIG: 'data-imageViewerLg',
    MAG_GLASS_SCALE: 2,
    ZOOM_INCREMENT: 20,
    ZOOM_MAX: 2,
    ZOOM_MIN: 1,
    TRANSITION: 500
  };

  var ImageViewerView = function($element) {
    this.$element = $element;

    this.init();
  };

  ImageViewerView.prototype.init = function() {
    this.isEnabled = false;
    this.isAnimating = false;
    this.$imageViewer = null;
    this.$container = null;
    this.$imgContainer = null;
    this.$magGlass = null;
    this.$img = null;
    this.$controlZoomIn = null;
    this.$controlZoomOut = null;
    this.imgSrcLg = null;
    this.magGlassW = null;
    this.magGlassH = null;
    this.magGlassHalfW = null;
    this.magGlassHalfH = null;
    this.mouseX = null;
    this.mouseY = null;
    this.magGlassX = null;
    this.magGlassY = null;
    this.magGlassBGX = null;
    this.magGlassBGY = null;
    this.magGlassBGW = null;
    this.magGlassBGH = null;
    this.imgContainerX = null;
    this.imgContainerY = null;
    this.imgContainerW = null;
    this.imgContainerH = null;
    this.imgContainerBGX = null;
    this.imgContainerBGY = null;
    this.imgContainerBGW = null;
    this.imgContainerBGH = null;
    this.imgContainerBGRatioW = null;
    this.imgContainerBGRatioH = null;
    this.translateMaxX = null;
    this.translateMaxY = null;
    this.canZoomIn = true;
    this.canZoomOut = false;
    this.$window = $(window);

    return this.setupHandlers()
      .createChildren()
      .layout()
      .enable();
  };

  ImageViewerView.prototype.setupHandlers = function() {
    this.moveMagGlassHandler = $.proxy(this._moveMagGlass, this);
    this.remeasureHandler = $.proxy(this._remeasure, this);
    this.outMouseImgHandler = $.proxy(this._outMouseImg, this);
    this.inMouseImgHandler = $.proxy(this._inMouseImg, this);
    this.zoomInHandler = $.proxy(this._zoomIn, this);
    this.zoomOutHandler = $.proxy(this._zoomOut, this);

    return this;
  };

  ImageViewerView.prototype.createChildren = function() {
    this.$imageViewer = this.$element;
    this.$container = this.$imageViewer.find('.' + CONFIG.CONTAINER);
    this.$imgContainer = this.$imageViewer.find('.' + CONFIG.IMG_CONTAINER);
    this.$img = this.$imageViewer.find('.' + CONFIG.IMG);
    this.$controlZoomIn = this.$imageViewer.find('.' + CONFIG.CONTROL_ZOOM_IN);
    this.$controlZoomOut = this.$imageViewer.find('.' + CONFIG.CONTROL_ZOOM_OUT);
    this.$magGlass = this.$imageViewer.find('.' + CONFIG.MAG_GLASS);
    this.imgSrcLg = this.$img.attr(CONFIG.IMG_SRC_BIG);

    return this;
  };

  ImageViewerView.prototype.layout = function() {
    // Measure container
    this._measureContainer();
    this._measureMagGlass();

    if (!this.isLaidOut) {
      this.$imgContainer.css({
        'background-image' : 'url(' + this.imgSrcLg + ')'
      });

      this.isLaidOut = true;
    }

    this.$imgContainer.css({
      'background-size' : this.imgContainerBGW + 'px, ' + this.imgContainerBGH + 'px',
    });

    // Update style of zoom controls
    if (this.canZoomIn) {
      this.$controlZoomIn
        .removeClass(CONFIG.CONTROL_ZOOM_OUT_IS_DISABLED)
        .removeAttr( 'disabled' );
    } else {
      this.$controlZoomIn
        .addClass(CONFIG.CONTROL_ZOOM_OUT_IS_DISABLED)
        .attr( 'disabled', 'true' );
    }

    if (this.canZoomOut) {
      this.$controlZoomOut
        .removeClass(CONFIG.CONTROL_ZOOM_OUT_IS_DISABLED)
        .removeAttr( 'disabled' );
    } else {
      this.$controlZoomOut
        .addClass(CONFIG.CONTROL_ZOOM_OUT_IS_DISABLED)
        .attr( 'disabled', 'true' );
    }

    // If mouse variables are set, update CSS
    if ( this.magGlassX !== null && this.magGlassBGWStyle !== null ) {
      this.$magGlass.css({
        'top' : this.magGlassY,
        'left' : this.magGlassX,
        'background-image' : 'url(' + this.imgSrcLg + ')',
        'background-position' : this.magGlassBGX + '% ' + this.magGlassBGY + '%',
        'background-size' : this.magGlassBGW + 'px ' + this.magGlassBGH + 'px'
      });
    }

    return this;
  };

  ImageViewerView.prototype.enable = function() {
    if (this.isEnabled) {
      return this;
    }

    this.isEnabled = true;

    this.$imgContainer.on('mousemove', this.moveMagGlassHandler);
    this.$imgContainer.on('mouseenter', this.inMouseImgHandler);
    this.$imgContainer.on('mouseleave', this.outMouseImgHandler);
    this.$controlZoomIn.on('click', this.zoomInHandler);
    this.$controlZoomOut.on('click', this.zoomOutHandler);
    this.$window.on('resize', this.remeasureHandler);

    return this;
  };

  ImageViewerView.prototype._moveMagGlass = function(event) {
    var mouseXPos = null;
    var mouseYPos = null;
    var mouseXPercentage = null;
    var mouseYPercentage = null;

    // Get mouse coordinates relative to viewport
    this.mouseX = event.pageX;
    this.mouseY = event.pageY;

    // Position of mouse relative to container
    mouseXPos = (this.mouseX - this.imgContainerX);
    mouseYPos = (this.mouseY - this.imgContainerY);

    // Position of mouse in container as percentage
    mouseXPercentage = (mouseXPos / this.imgContainerW) * 100;
    mouseYPercentage = (mouseYPos / this.imgContainerH) * 100;

    // Positiion of magnifying glass based on mouse position and magnifying glass offset
    this.magGlassX = mouseXPos - this.magGlassHalfW;
    this.magGlassY = mouseYPos - this.magGlassHalfH;

    // Background image position for magnifying glass
    this.magGlassBGX = ((mouseXPercentage - 50) * this.imgContainerBGRatioW) + 50;
    this.magGlassBGY = ((mouseYPercentage - 50) * this.imgContainerBGRatioH) + 50;

    this.layout();
  };

  ImageViewerView.prototype._measureContainer = function() {
    var magGlassBGRangeW = null;
    var magGlassBGRangeH = null;

    if (!this.isLaidOut) {
      this._measureBackground();
    }

    // Image container's offset from viewport
    this.imgContainerX = this.$imgContainer.offset().left;
    this.imgContainerY = this.$imgContainer.offset().top;

    // Image container's dimensions
    this.imgContainerW = this.$imgContainer.width();
    this.imgContainerH = this.$imgContainer.height();

    // Calculate background image dimensions for magnifying glass
    this.magGlassBGW = (this.magGlassHalfW + this.imgContainerBGW) * CONFIG.MAG_GLASS_SCALE;
    this.magGlassBGH = (this.magGlassHalfH + this.imgContainerBGH) * CONFIG.MAG_GLASS_SCALE;

    // Dimensions for area needed to show full large image in magnifying glass
    // because half of the magnifying glass is hidden when the mouse is on the edge
    magGlassBGRangeW = this.imgContainerBGW + this.magGlassHalfW;
    magGlassBGRangeH = this.imgContainerBGH + this.magGlassHalfH;

    // For when the image is zoomed in: Measure how much the image can be moved around.
    this.translateMaxX = this.imgContainerBGW - this.imgContainerW;
    this.translateMaxY = this.imgContainerBGH - this.imgContainerH;

    // BG range compared to container. Used to calculate how much to move the magnifying glass image
    this.imgContainerBGRatioW = magGlassBGRangeW / (this.imgContainerBGW + this.translateMaxX);
    this.imgContainerBGRatioH = magGlassBGRangeH / (this.imgContainerBGH + this.translateMaxY);

    return this;
  };

  ImageViewerView.prototype._measureBackground = function() {
    // Main container's offset from viewport
    this.imgContainerBGW = this.$container.width();
    this.imgContainerBGH = this.$container.height();

    return this;
  };


  ImageViewerView.prototype._measureMagGlass = function() {
    // Measurements for magnifying glass
    this.magGlassW = this.$magGlass.width();
    this.magGlassH = this.$magGlass.height();
    this.magGlassHalfW = this.magGlassW / 2;
    this.magGlassHalfH = this.magGlassH / 2;

    return this;
  };

  ImageViewerView.prototype._remeasure = function() {
    if (CONFIG.ENABLE_MAG_GLASS) {
      this._measureMagGlass();
    }

    this._measureContainer();
    this._measureBackground();

    this._zoomState(CONFIG.TRANSITION);
  };

  ImageViewerView.prototype._inMouseImg = function() {
    this.$magGlass.show();
    this.layout();
  };

  ImageViewerView.prototype._outMouseImg = function() {
    this.$magGlass.hide();
    this.layout();
  };

  ImageViewerView.prototype._zoomIn = function() {
    this._measureContainer();

    // If the image is already animating, return early
    if (this.isAnimating){
      return;
    }

    this._animationDelay();

    // If the image is ready to zoom in
    if (this.canZoomIn) {

      // Calculate new image width based on increment
      this.imgContainerBGW = this.imgContainerBGW + (this.imgContainerBGW * (CONFIG.ZOOM_INCREMENT / 100));
      this.imgContainerBGH = this.imgContainerBGH + (this.imgContainerBGH * (CONFIG.ZOOM_INCREMENT / 100));

      // Set size values to limits if outside of limits
      this._limitZoom();
    }

    // Finds if the image can zoom more and updates layout
    this._zoomState(CONFIG.TRANSITION);
  };

  ImageViewerView.prototype._zoomOut = function() {
    this._measureContainer();

    // If the image is already animating, return early
    if (this.isAnimating){
      return;
    }

    this._animationDelay();

    // If the image is ready to zoom out
    if (this.canZoomOut) {

      // Calculate new image width based on increment
      this.imgContainerBGW = this.imgContainerBGW - (this.imgContainerBGW * (CONFIG.ZOOM_INCREMENT / 100));
      this.imgContainerBGH = this.imgContainerBGH - (this.imgContainerBGH * (CONFIG.ZOOM_INCREMENT / 100));

      // Set size values to limits if outside of limits
      this._limitZoom();
    }

    // Finds if the image can zoom more and updates layout
    this._zoomState(CONFIG.TRANSITION);
  };

  ImageViewerView.prototype._zoomState = function(delay) {
    var zoomRatio;
    var self = this;

    this.layout();

    // Check dimensions after animation has finished
    setTimeout(function() {

      self._measureContainer();

      zoomRatio = self.imgContainerBGW / self.imgContainerW;

      if (zoomRatio > CONFIG.ZOOM_MIN) {
        self.canZoomOut = true;
      } else {
        self.canZoomOut = false;
      }

      if (zoomRatio < CONFIG.ZOOM_MAX) {
        self.canZoomIn = true;
      } else {
        self.canZoomIn = false;
      }

      self.layout();

    }, delay);

    return this;
  };

  ImageViewerView.prototype._limitZoom = function() {
    // Tests if the new size will be smaller than the min or bigger than the max
    // if so, set the dimensions to those limits
    if (this.imgContainerBGW / this.imgContainerW < CONFIG.ZOOM_MIN) {
      this.imgContainerBGW = (this.imgContainerW * CONFIG.ZOOM_MIN);
      this.imgContainerBGH = (this.imgContainerH * CONFIG.ZOOM_MIN);
    } else if (this.imgContainerBGW / this.imgContainerW >= CONFIG.ZOOM_MAX) {
      this.imgContainerBGW = (this.imgContainerW * CONFIG.ZOOM_MAX);
      this.imgContainerBGH = (this.imgContainerH * CONFIG.ZOOM_MAX);
    }

    return this;
  };

  ImageViewerView.prototype._animationDelay = function() {
    var self = this;

    setTimeout(function() {
      self.isAnimating = false;
    }, CONFIG.TRANSITION);

    this.isAnimating = true;

    return this;
  };

  /** @ngInject */
  function viewImage(){
    var o={
      view:view
    };
    return o;

    function view(src) {
      /*var h = $ (window).height ();
      var dlg = $ ('<div></div>');
      dlg.css ({
        width: '100%',
        position: 'absolute',
        top: 0,
        height: h,
        backgroundColor: '#ffffff',
        overflow: 'hidden',
        zIndex: 100000
      }).appendTo (document.body);
      dlg.html ('<div  class="Viewer" style="width: 100%;height: 100%;bottom: top:0; background: #0a0a0a;"><img src="https://placekitten.com/g/2000/2000"  alt="" ></div>' +
        '<div class="btn" style="position: absolute;z-index:100000;top:10px;right:10px; "><img class="rotate" width="30" src="assets/leaflet/images/rotate2.png"></div>');

      dlg.find('.Viewer img').smartZoom({containerClass:'Viewer'});
      var i = 0;
      dlg.find('.btn .rotate').click(function(e){
        var deg = 90 * (++i);
        var vcss = dlg.find('.Viewer img').css('transform');
        console.log(dlg.find('.Viewer img').css('transform'))
        dlg.find('.Viewer img').rotate( deg );
        if(i>3)i=0;
      })
*/
    }
  }
})();

/**
 * Created by leshuangshuang on 16/4/15.
 */
(function() {
  'use strict';

versionUpdate.$inject = ["$mdDialog", "$cordovaFileTransfer", "$cordovaAppVersion", "$cordovaFileOpener2", "$http"];
  angular
    .module('app.szgc')
    .service('versionUpdate', versionUpdate);

  function versionUpdate($mdDialog, $cordovaFileTransfer, $cordovaAppVersion, $cordovaFileOpener2,$http){

    this.check = function() {



      //服务器上保存版本信息
      $http.get('http://vkde.sxtsoft.com/api/vkapi/Version')
        .then(function (data) {
          var serverAppVersion = data.data.verInfo;//服务器 版本
          console.log("====>>服务器" + serverAppVersion);

         // $cordovaAppVersion.getVersionNumber().then(function (version) {
          //  console.log("version=====本机>>>" + version + "====>>服务器" + serverAppVersion);

          var version='1.6.1'
            if (version != serverAppVersion) {
              //弹出选择框 是否进行更新


              var confirm = $mdDialog.confirm()
                .title('发现新版本')
                .textContent('是否更新新版本')
                .ok('更新!')//Please do it!
                .cancel('暂不更新');//Sounds like a scam
              $mdDialog.show(confirm).then(function () {

                window.location.replace("https://m.vanke.com/pcStore/detailsPhone/vkappcan10102_1");

            //    // $scope.status = 'You decided to get rid of your debt.';//Please do it!点击更新的事件
            //    var url = "https://vkde.sxtsoft.com:4443/apps/android-release.apk";
            //    var targetPath = "file:///mnt/sdcard/Download/android-release.apk";
            //    var trustHosts = true
            //    var options = {};
            //    $cordovaFileTransfer.download(url, targetPath, options, trustHosts).then(function (result) {
            //      $cordovaFileOpener2.open(targetPath, 'application/vnd.android.package-archive'
            //      ).then(function () {
            //      }, function (err) {
            //      });
            //      //$ionicLoading.hide();
            //    }, function (err) {
            //      alert('下载失败');
            //    }, function (progress) {
            //      $timeout(function () {
            //        var downloadProgress = (progress.loaded / progress.total) * 100;
            //        //$ionicLoading.show({
            //        //  template: "已经下载：" + Math.floor(downloadProgress) + "%"
            //        //});
            //        if (downloadProgress > 99) {
            //          //$ionicLoading.hide();
            //        }
            //      })
            //    });
            //
            //  }, function () {
            //    //  $scope.status = 'You decided to keep your debt.';//Sounds like a scam点击暂不更新的事件
            //  });
            //
            //
            //  //$ionicLoading.show({
            //  //  template: "已经下载：0%"
            });

            }
          });
      //  });

    }


}



})();

/**
 * Created by guowei on 2016/2/1.
 */
(function()
  {
    'use strict';
    angular
      .module('app.szgc')
      .service('showEcherts', function() {
        /**
         *echarts的饼图 这个方法有5个参数 :
         *@param {idMsg}     表示要在哪个div显示 的id值
         *@param {projectName}      表示项目名
         *@param {XdataMsg}   表示X轴信息
         *@param {yNCount, yOKCount}   表示y轴不合格合格数据
         */
        var showEchert = function(idMsg, projectName, XdataMsg, yNCount, yOKCount) {


            function ec(ec1) {
              // 基于准备好的dom，初始化echarts图表
              var myChart = ec1.init(document.getElementById(idMsg));
              var zrColor = require('zrender/tool/color');
              var colorList = [
                '#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed',
                '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
                '#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed',
                '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0'
              ];
              var itemStyle = {
                normal: {
                  color: function(params) {
                    if (params.dataIndex < 0) {
                      // for legend
                      return zrColor.lift(
                        colorList[colorList.length - 1], params.seriesIndex * 0.1
                      );
                    } else {
                      // for bar
                      return zrColor.lift(
                        colorList[params.dataIndex], params.seriesIndex * 0.1
                      );
                    }
                  }
                }
              };

              var option = {
                title: {
                  text: projectName + '报表',
                  x: 'center'
                  // subtext: '数据来自国家统计局',
                  //sublink: 'http://data.stats.gov.cn/search/keywordlist2?keyword=%E5%9F%8E%E9%95%87%E5%B1%85%E6%B0%91%E6%B6%88%E8%B4%B9'
                },

                tooltip: {
                  trigger: 'axis',
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  axisPointer: {
                    type: 'shadow',

                  },
                  itemGap: 10, // 主副标题纵向间隔，单位px，默认为10，

                  formatter: function(params) {
                    // for text color

                    /*
                     长字符串中插入换行符
                     str:需要换行的字符串
                     n:换行间隔字符数
                     */
                    function insertEnter(str, n) {
                      var len = str.length;
                      var strTemp = '';
                      if (len > n) {
                        strTemp = str.substring(0, n);
                        str = str.substring(n, len);
                        return strTemp + '<br />' + insertEnter(str, n);
                      } else {
                        return str;
                      }
                    }
                    var color = colorList[params[0].dataIndex];
                    var res = '<div style="color:' + color + '">';
                    res += '<strong>' + insertEnter(params[0].name, 15) + '</strong>'
                    for (var i = 0, l = params.length; i < l; i++) {
                      res += '<br/>' + params[i].seriesName + ' : ' + params[i].value
                    }
                    res += '</div>';
                    return res;
                  }
                },
                //legend: {
                //    x: 'right',
                //    data: ['2010', '2011', '2012', '2013']
                //},
                toolbox: {
                  show: true,
                  orient: 'vertical',
                  y: 'center',
                  feature: {
                    mark: {
                      show: true
                    },
                    dataView: {
                      show: true,
                      readOnly: false
                    },
                    restore: {
                      show: true
                    },
                    saveAsImage: {
                      show: true
                    }
                  }
                },
                calculable: true,

                xAxis: [{

                  type: 'category',
                  //坐标轴文本标签选项,当x轴的数据多余3条的时候字体就旋转20
                  axisLabel: {
                    rotate: XdataMsg.length > 3 ? -20 : 0,
                    show: true,
                    max: 10,
                    // formatter: function(values) {
                    //     //X坐标的显示太长了，格式化一下
                    //     var dataMsgC = values.substring(0,10);
                    //     return values = dataMsgC;
                    // },
                  },
                  data: XdataMsg
                }],

                grid: { // 控制图的大小，调整下面这些值就可以，
                  x: 3,
                  x2: 50,
                  y2: 50, // y2可以控制 X轴跟Zoom控件之间的间隔，避免以为倾斜后造成 label重叠到zoom上
                },

                yAxis: [{
                  type: 'value'
                }],
                series: [

                  {
                    name: '合格',
                    type: 'bar',
                    barWidth: 20,//控制柱子宽度
                    itemStyle: itemStyle,
                    barCategoryGap:40,//
                    data: yOKCount,

                  }, {
                    name: '不合格',
                    type: 'bar',
                    barWidth: 20,//控制柱子宽度
                    barCategoryGap:40,
                    itemStyle: itemStyle,
                    data: yNCount,

                  }

                ]

              };

              // 为echarts对象加载数据
              return myChart.setOption(option);

            };

        }
        return {
          showEchert: showEchert
        }
      });

  }
)();

/**
 * Created by jiuyuong on 2016/3/15.
 */
(function(){
  'use strict';
  angular
    .module('app.szgc')
    .factory('markerCulster',function(){
      (function (window, document, undefined) {/*
       * L.MarkerClusterGroup extends L.FeatureGroup by clustering the markers contained within
       */

        L.MarkerClusterGroup = L.FeatureGroup.extend({

          options: {
            maxClusterRadius: 80, //A cluster will cover at most this many pixels from its center
            iconCreateFunction: null,

            spiderfyOnMaxZoom: true,
            showCoverageOnHover: true,
            zoomToBoundsOnClick: true,
            singleMarkerMode: false,

            disableClusteringAtZoom: null,

            // Setting this to false prevents the removal of any clusters outside of the viewpoint, which
            // is the default behaviour for performance reasons.
            removeOutsideVisibleBounds: true,

            //Whether to animate adding markers after adding the MarkerClusterGroup to the map
            // If you are adding individual markers set to true, if adding bulk markers leave false for massive performance gains.
            animateAddingMarkers: false,

            //Increase to increase the distance away that spiderfied markers appear from the center
            spiderfyDistanceMultiplier: 1,

            // When bulk adding layers, adds markers in chunks. Means addLayers may not add all the layers in the call, others will be loaded during setTimeouts
            chunkedLoading: false,
            chunkInterval: 200, // process markers for a maximum of ~ n milliseconds (then trigger the chunkProgress callback)
            chunkDelay: 50, // at the end of each interval, give n milliseconds back to system/browser
            chunkProgress: null, // progress callback: function(processed, total, elapsed) (e.g. for a progress indicator)

            //Options to pass to the L.Polygon constructor
            polygonOptions: {}
          },

          initialize: function (options) {
            L.Util.setOptions(this, options);
            if (!this.options.iconCreateFunction) {
              this.options.iconCreateFunction = this._defaultIconCreateFunction;
            }

            this._featureGroup = L.featureGroup();
            this._featureGroup.on(L.FeatureGroup.EVENTS, this._propagateEvent, this);

            this._nonPointGroup = L.featureGroup();
            this._nonPointGroup.on(L.FeatureGroup.EVENTS, this._propagateEvent, this);

            this._inZoomAnimation = 0;
            this._needsClustering = [];
            this._needsRemoving = []; //Markers removed while we aren't on the map need to be kept track of
            //The bounds of the currently shown area (from _getExpandedVisibleBounds) Updated on zoom/move
            this._currentShownBounds = null;

            this._queue = [];
          },

          addLayer: function (layer) {

            if (layer instanceof L.LayerGroup) {
              var array = [];
              for (var i in layer._layers) {
                array.push(layer._layers[i]);
              }
              return this.addLayers(array);
            }

            //Don't cluster non point data
            if (!layer.getLatLng) {
              this._nonPointGroup.addLayer(layer);
              return this;
            }

            if (!this._map) {
              this._needsClustering.push(layer);
              return this;
            }

            if (this.hasLayer(layer)) {
              return this;
            }


            //If we have already clustered we'll need to add this one to a cluster

            if (this._unspiderfy) {
              this._unspiderfy();
            }

            this._addLayer(layer, this._maxZoom);

            //Work out what is visible
            var visibleLayer = layer,
              currentZoom = this._map.getZoom();
            if (layer.__parent) {
              while (visibleLayer.__parent._zoom >= currentZoom) {
                visibleLayer = visibleLayer.__parent;
              }
            }

            if (this._currentShownBounds.contains(visibleLayer.getLatLng())) {
              if (this.options.animateAddingMarkers) {
                this._animationAddLayer(layer, visibleLayer);
              } else {
                this._animationAddLayerNonAnimated(layer, visibleLayer);
              }
            }
            return this;
          },

          removeLayer: function (layer) {

            if (layer instanceof L.LayerGroup) {
              var array = [];
              for (var i in layer._layers) {
                array.push(layer._layers[i]);
              }
              return this.removeLayers(array);
            }

            //Non point layers
            if (!layer.getLatLng) {
              this._nonPointGroup.removeLayer(layer);
              return this;
            }

            if (!this._map) {
              if (!this._arraySplice(this._needsClustering, layer) && this.hasLayer(layer)) {
                this._needsRemoving.push(layer);
              }
              return this;
            }

            if (!layer.__parent) {
              return this;
            }

            if (this._unspiderfy) {
              this._unspiderfy();
              this._unspiderfyLayer(layer);
            }

            //Remove the marker from clusters
            this._removeLayer(layer, true);

            if (this._featureGroup.hasLayer(layer)) {
              this._featureGroup.removeLayer(layer);
              if (layer.setOpacity) {
                layer.setOpacity(1);
              }
            }

            return this;
          },

          //Takes an array of markers and adds them in bulk
          addLayers: function (layersArray) {
            var fg = this._featureGroup,
              npg = this._nonPointGroup,
              chunked = this.options.chunkedLoading,
              chunkInterval = this.options.chunkInterval,
              chunkProgress = this.options.chunkProgress,
              newMarkers, i, l, m;

            if (this._map) {
              var offset = 0,
                started = (new Date()).getTime();
              var process = L.bind(function () {
                var start = (new Date()).getTime();
                for (; offset < layersArray.length; offset++) {
                  if (chunked && offset % 200 === 0) {
                    // every couple hundred markers, instrument the time elapsed since processing started:
                    var elapsed = (new Date()).getTime() - start;
                    if (elapsed > chunkInterval) {
                      break; // been working too hard, time to take a break :-)
                    }
                  }

                  m = layersArray[offset];

                  //Not point data, can't be clustered
                  if (!m.getLatLng) {
                    npg.addLayer(m);
                    continue;
                  }

                  if (this.hasLayer(m)) {
                    continue;
                  }

                  this._addLayer(m, this._maxZoom);

                  //If we just made a cluster of size 2 then we need to remove the other marker from the map (if it is) or we never will
                  if (m.__parent) {
                    if (m.__parent.getChildCount() === 2) {
                      var markers = m.__parent.getAllChildMarkers(),
                        otherMarker = markers[0] === m ? markers[1] : markers[0];
                      fg.removeLayer(otherMarker);
                    }
                  }
                }

                if (chunkProgress) {
                  // report progress and time elapsed:
                  chunkProgress(offset, layersArray.length, (new Date()).getTime() - started);
                }

                if (offset === layersArray.length) {
                  //Update the icons of all those visible clusters that were affected
                  this._featureGroup.eachLayer(function (c) {
                    if (c instanceof L.MarkerCluster && c._iconNeedsUpdate) {
                      c._updateIcon();
                    }
                  });

                  this._topClusterLevel._recursivelyAddChildrenToMap(null, this._zoom, this._currentShownBounds);
                } else {
                  setTimeout(process, this.options.chunkDelay);
                }
              }, this);

              process();
            } else {
              newMarkers = [];
              for (i = 0, l = layersArray.length; i < l; i++) {
                m = layersArray[i];

                //Not point data, can't be clustered
                if (!m.getLatLng) {
                  npg.addLayer(m);
                  continue;
                }

                if (this.hasLayer(m)) {
                  continue;
                }

                newMarkers.push(m);
              }
              this._needsClustering = this._needsClustering.concat(newMarkers);
            }
            return this;
          },

          //Takes an array of markers and removes them in bulk
          removeLayers: function (layersArray) {
            var i, l, m,
              fg = this._featureGroup,
              npg = this._nonPointGroup;

            if (!this._map) {
              for (i = 0, l = layersArray.length; i < l; i++) {
                m = layersArray[i];
                this._arraySplice(this._needsClustering, m);
                npg.removeLayer(m);
              }
              return this;
            }

            for (i = 0, l = layersArray.length; i < l; i++) {
              m = layersArray[i];

              if (!m.__parent) {
                npg.removeLayer(m);
                continue;
              }

              this._removeLayer(m, true, true);

              if (fg.hasLayer(m)) {
                fg.removeLayer(m);
                if (m.setOpacity) {
                  m.setOpacity(1);
                }
              }
            }

            //Fix up the clusters and markers on the map
            this._topClusterLevel._recursivelyAddChildrenToMap(null, this._zoom, this._currentShownBounds);

            fg.eachLayer(function (c) {
              if (c instanceof L.MarkerCluster) {
                c._updateIcon();
              }
            });

            return this;
          },

          //Removes all layers from the MarkerClusterGroup
          clearLayers: function () {
            //Need our own special implementation as the LayerGroup one doesn't work for us

            //If we aren't on the map (yet), blow away the markers we know of
            if (!this._map) {
              this._needsClustering = [];
              delete this._gridClusters;
              delete this._gridUnclustered;
            }

            if (this._noanimationUnspiderfy) {
              this._noanimationUnspiderfy();
            }

            //Remove all the visible layers
            this._featureGroup.clearLayers();
            this._nonPointGroup.clearLayers();

            this.eachLayer(function (marker) {
              delete marker.__parent;
            });

            if (this._map) {
              //Reset _topClusterLevel and the DistanceGrids
              this._generateInitialClusters();
            }

            return this;
          },

          //Override FeatureGroup.getBounds as it doesn't work
          getBounds: function () {
            var bounds = new L.LatLngBounds();

            if (this._topClusterLevel) {
              bounds.extend(this._topClusterLevel._bounds);
            }

            for (var i = this._needsClustering.length - 1; i >= 0; i--) {
              bounds.extend(this._needsClustering[i].getLatLng());
            }

            bounds.extend(this._nonPointGroup.getBounds());

            return bounds;
          },

          //Overrides LayerGroup.eachLayer
          eachLayer: function (method, context) {
            var markers = this._needsClustering.slice(),
              i;

            if (this._topClusterLevel) {
              this._topClusterLevel.getAllChildMarkers(markers);
            }

            for (i = markers.length - 1; i >= 0; i--) {
              method.call(context, markers[i]);
            }

            this._nonPointGroup.eachLayer(method, context);
          },

          //Overrides LayerGroup.getLayers
          getLayers: function () {
            var layers = [];
            this.eachLayer(function (l) {
              layers.push(l);
            });
            return layers;
          },

          //Overrides LayerGroup.getLayer, WARNING: Really bad performance
          getLayer: function (id) {
            var result = null;

            this.eachLayer(function (l) {
              if (L.stamp(l) === id) {
                result = l;
              }
            });

            return result;
          },

          //Returns true if the given layer is in this MarkerClusterGroup
          hasLayer: function (layer) {
            if (!layer) {
              return false;
            }

            var i, anArray = this._needsClustering;

            for (i = anArray.length - 1; i >= 0; i--) {
              if (anArray[i] === layer) {
                return true;
              }
            }

            anArray = this._needsRemoving;
            for (i = anArray.length - 1; i >= 0; i--) {
              if (anArray[i] === layer) {
                return false;
              }
            }

            return !!(layer.__parent && layer.__parent._group === this) || this._nonPointGroup.hasLayer(layer);
          },

          //Zoom down to show the given layer (spiderfying if necessary) then calls the callback
          zoomToShowLayer: function (layer, callback) {

            var showMarker = function () {
              if ((layer._icon || layer.__parent._icon) && !this._inZoomAnimation) {
                this._map.off('moveend', showMarker, this);
                this.off('animationend', showMarker, this);

                if (layer._icon) {
                  callback();
                } else if (layer.__parent._icon) {
                  var afterSpiderfy = function () {
                    this.off('spiderfied', afterSpiderfy, this);
                    callback();
                  };

                  this.on('spiderfied', afterSpiderfy, this);
                  layer.__parent.spiderfy();
                }
              }
            };

            if (layer._icon && this._map.getBounds().contains(layer.getLatLng())) {
              //Layer is visible ond on screen, immediate return
              callback();
            } else if (layer.__parent._zoom < this._map.getZoom()) {
              //Layer should be visible at this zoom level. It must not be on screen so just pan over to it
              this._map.on('moveend', showMarker, this);
              this._map.panTo(layer.getLatLng());
            } else {
              var moveStart = function () {
                this._map.off('movestart', moveStart, this);
                moveStart = null;
              };

              this._map.on('movestart', moveStart, this);
              this._map.on('moveend', showMarker, this);
              this.on('animationend', showMarker, this);
              layer.__parent.zoomToBounds();

              if (moveStart) {
                //Never started moving, must already be there, probably need clustering however
                showMarker.call(this);
              }
            }
          },

          //Overrides FeatureGroup.onAdd
          onAdd: function (map) {
            this._map = map;
            var i, l, layer;

            if (!isFinite(this._map.getMaxZoom())) {
              throw "Map has no maxZoom specified";
            }

            this._featureGroup.onAdd(map);
            this._nonPointGroup.onAdd(map);

            if (!this._gridClusters) {
              this._generateInitialClusters();
            }

            for (i = 0, l = this._needsRemoving.length; i < l; i++) {
              layer = this._needsRemoving[i];
              this._removeLayer(layer, true);
            }
            this._needsRemoving = [];

            //Remember the current zoom level and bounds
            this._zoom = this._map.getZoom();
            this._currentShownBounds = this._getExpandedVisibleBounds();

            this._map.on('zoomend', this._zoomEnd, this);
            this._map.on('moveend', this._moveEnd, this);

            if (this._spiderfierOnAdd) { //TODO FIXME: Not sure how to have spiderfier add something on here nicely
              this._spiderfierOnAdd();
            }

            this._bindEvents();

            //Actually add our markers to the map:
            l = this._needsClustering;
            this._needsClustering = [];
            this.addLayers(l);
          },

          //Overrides FeatureGroup.onRemove
          onRemove: function (map) {
            map.off('zoomend', this._zoomEnd, this);
            map.off('moveend', this._moveEnd, this);

            this._unbindEvents();

            //In case we are in a cluster animation
            this._map._mapPane.className = this._map._mapPane.className.replace(' leaflet-cluster-anim', '');

            if (this._spiderfierOnRemove) { //TODO FIXME: Not sure how to have spiderfier add something on here nicely
              this._spiderfierOnRemove();
            }



            //Clean up all the layers we added to the map
            this._hideCoverage();
            this._featureGroup.onRemove(map);
            this._nonPointGroup.onRemove(map);

            this._featureGroup.clearLayers();

            this._map = null;
          },

          getVisibleParent: function (marker) {
            var vMarker = marker;
            while (vMarker && !vMarker._icon) {
              vMarker = vMarker.__parent;
            }
            return vMarker || null;
          },

          //Remove the given object from the given array
          _arraySplice: function (anArray, obj) {
            for (var i = anArray.length - 1; i >= 0; i--) {
              if (anArray[i] === obj) {
                anArray.splice(i, 1);
                return true;
              }
            }
          },

          //Internal function for removing a marker from everything.
          //dontUpdateMap: set to true if you will handle updating the map manually (for bulk functions)
          _removeLayer: function (marker, removeFromDistanceGrid, dontUpdateMap) {
            var gridClusters = this._gridClusters,
              gridUnclustered = this._gridUnclustered,
              fg = this._featureGroup,
              map = this._map;

            //Remove the marker from distance clusters it might be in
            if (removeFromDistanceGrid) {
              for (var z = this._maxZoom; z >= 0; z--) {
                if (!gridUnclustered[z].removeObject(marker, map.project(marker.getLatLng(), z))) {
                  break;
                }
              }
            }

            //Work our way up the clusters removing them as we go if required
            var cluster = marker.__parent,
              markers = cluster._markers,
              otherMarker;

            //Remove the marker from the immediate parents marker list
            this._arraySplice(markers, marker);

            while (cluster) {
              cluster._childCount--;

              if (cluster._zoom < 0) {
                //Top level, do nothing
                break;
              } else if (removeFromDistanceGrid && cluster._childCount <= 1) { //Cluster no longer required
                //We need to push the other marker up to the parent
                otherMarker = cluster._markers[0] === marker ? cluster._markers[1] : cluster._markers[0];

                //Update distance grid
                gridClusters[cluster._zoom].removeObject(cluster, map.project(cluster._cLatLng, cluster._zoom));
                gridUnclustered[cluster._zoom].addObject(otherMarker, map.project(otherMarker.getLatLng(), cluster._zoom));

                //Move otherMarker up to parent
                this._arraySplice(cluster.__parent._childClusters, cluster);
                cluster.__parent._markers.push(otherMarker);
                otherMarker.__parent = cluster.__parent;

                if (cluster._icon) {
                  //Cluster is currently on the map, need to put the marker on the map instead
                  fg.removeLayer(cluster);
                  if (!dontUpdateMap) {
                    fg.addLayer(otherMarker);
                  }
                }
              } else {
                cluster._recalculateBounds();
                if (!dontUpdateMap || !cluster._icon) {
                  cluster._updateIcon();
                }
              }

              cluster = cluster.__parent;
            }

            delete marker.__parent;
          },

          _isOrIsParent: function (el, oel) {
            while (oel) {
              if (el === oel) {
                return true;
              }
              oel = oel.parentNode;
            }
            return false;
          },

          _propagateEvent: function (e) {
            if (e.layer instanceof L.MarkerCluster) {
              //Prevent multiple clustermouseover/off events if the icon is made up of stacked divs (Doesn't work in ie <= 8, no relatedTarget)
              if (e.originalEvent && this._isOrIsParent(e.layer._icon, e.originalEvent.relatedTarget)) {
                return;
              }
              e.type = 'cluster' + e.type;
            }

            this.fire(e.type, e);
          },

          //Default functionality
          _defaultIconCreateFunction: function (cluster) {
            var childCount = cluster.getChildCount();

            var c = ' marker-cluster-';
            if (childCount < 10) {
              c += 'small';
            } else if (childCount < 100) {
              c += 'medium';
            } else {
              c += 'large';
            }

            return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'marker-cluster' + c, iconSize: new L.Point(40, 40) });
          },

          _bindEvents: function () {
            var map = this._map,
              spiderfyOnMaxZoom = this.options.spiderfyOnMaxZoom,
              showCoverageOnHover = this.options.showCoverageOnHover,
              zoomToBoundsOnClick = this.options.zoomToBoundsOnClick;

            //Zoom on cluster click or spiderfy if we are at the lowest level
            if (spiderfyOnMaxZoom || zoomToBoundsOnClick) {
              this.on('clusterclick', this._zoomOrSpiderfy, this);
            }

            //Show convex hull (boundary) polygon on mouse over
            if (showCoverageOnHover) {
              this.on('clustermouseover', this._showCoverage, this);
              this.on('clustermouseout', this._hideCoverage, this);
              map.on('zoomend', this._hideCoverage, this);
            }
          },

          _zoomOrSpiderfy: function (e) {
            var map = this._map;
            if (map.getMaxZoom() === map.getZoom()) {
              if (this.options.spiderfyOnMaxZoom) {
                e.layer.spiderfy();
              }
            } else if (this.options.zoomToBoundsOnClick) {
              e.layer.zoomToBounds();
            }

            // Focus the map again for keyboard users.
            if (e.originalEvent && e.originalEvent.keyCode === 13) {
              map._container.focus();
            }
          },

          _showCoverage: function (e) {
            var map = this._map;
            if (this._inZoomAnimation) {
              return;
            }
            if (this._shownPolygon) {
              map.removeLayer(this._shownPolygon);
            }
            if (e.layer.getChildCount() > 2 && e.layer !== this._spiderfied) {
              this._shownPolygon = new L.Polygon(e.layer.getConvexHull(), this.options.polygonOptions);
              map.addLayer(this._shownPolygon);
            }
          },

          _hideCoverage: function () {
            if (this._shownPolygon) {
              this._map.removeLayer(this._shownPolygon);
              this._shownPolygon = null;
            }
          },

          _unbindEvents: function () {
            var spiderfyOnMaxZoom = this.options.spiderfyOnMaxZoom,
              showCoverageOnHover = this.options.showCoverageOnHover,
              zoomToBoundsOnClick = this.options.zoomToBoundsOnClick,
              map = this._map;

            if (spiderfyOnMaxZoom || zoomToBoundsOnClick) {
              this.off('clusterclick', this._zoomOrSpiderfy, this);
            }
            if (showCoverageOnHover) {
              this.off('clustermouseover', this._showCoverage, this);
              this.off('clustermouseout', this._hideCoverage, this);
              map.off('zoomend', this._hideCoverage, this);
            }
          },

          _zoomEnd: function () {
            if (!this._map) { //May have been removed from the map by a zoomEnd handler
              return;
            }
            this._mergeSplitClusters();

            this._zoom = this._map._zoom;
            this._currentShownBounds = this._getExpandedVisibleBounds();
          },

          _moveEnd: function () {
            if (this._inZoomAnimation) {
              return;
            }

            var newBounds = this._getExpandedVisibleBounds();

            this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds, this._zoom, newBounds);
            this._topClusterLevel._recursivelyAddChildrenToMap(null, this._map._zoom, newBounds);

            this._currentShownBounds = newBounds;
            return;
          },

          _generateInitialClusters: function () {
            var maxZoom = this._map.getMaxZoom(),
              radius = this.options.maxClusterRadius,
              radiusFn = radius;

            //If we just set maxClusterRadius to a single number, we need to create
            //a simple function to return that number. Otherwise, we just have to
            //use the function we've passed in.
            if (typeof radius !== "function") {
              radiusFn = function () { return radius; };
            }

            if (this.options.disableClusteringAtZoom) {
              maxZoom = this.options.disableClusteringAtZoom - 1;
            }
            this._maxZoom = maxZoom;
            this._gridClusters = {};
            this._gridUnclustered = {};

            //Set up DistanceGrids for each zoom
            for (var zoom = maxZoom; zoom >= 0; zoom--) {
              this._gridClusters[zoom] = new L.DistanceGrid(radiusFn(zoom));
              this._gridUnclustered[zoom] = new L.DistanceGrid(radiusFn(zoom));
            }

            this._topClusterLevel = new L.MarkerCluster(this, -1);
          },

          //Zoom: Zoom to start adding at (Pass this._maxZoom to start at the bottom)
          _addLayer: function (layer, zoom) {
            var gridClusters = this._gridClusters,
              gridUnclustered = this._gridUnclustered,
              markerPoint, z;

            if (this.options.singleMarkerMode) {
              layer.options.icon = this.options.iconCreateFunction({
                getChildCount: function () {
                  return 1;
                },
                getAllChildMarkers: function () {
                  return [layer];
                }
              });
            }

            //Find the lowest zoom level to slot this one in
            for (; zoom >= 0; zoom--) {
              markerPoint = this._map.project(layer.getLatLng(), zoom); // calculate pixel position

              //Try find a cluster close by
              var closest = gridClusters[zoom].getNearObject(markerPoint);
              if (closest) {
                closest._addChild(layer);
                layer.__parent = closest;
                return;
              }

              //Try find a marker close by to form a new cluster with
              closest = gridUnclustered[zoom].getNearObject(markerPoint);
              if (closest) {
                var parent = closest.__parent;
                if (parent) {
                  this._removeLayer(closest, false);
                }

                //Create new cluster with these 2 in it

                var newCluster = new L.MarkerCluster(this, zoom, closest, layer);
                gridClusters[zoom].addObject(newCluster, this._map.project(newCluster._cLatLng, zoom));
                closest.__parent = newCluster;
                layer.__parent = newCluster;

                //First create any new intermediate parent clusters that don't exist
                var lastParent = newCluster;
                for (z = zoom - 1; z > parent._zoom; z--) {
                  lastParent = new L.MarkerCluster(this, z, lastParent);
                  gridClusters[z].addObject(lastParent, this._map.project(closest.getLatLng(), z));
                }
                parent._addChild(lastParent);

                //Remove closest from this zoom level and any above that it is in, replace with newCluster
                for (z = zoom; z >= 0; z--) {
                  if (!gridUnclustered[z].removeObject(closest, this._map.project(closest.getLatLng(), z))) {
                    break;
                  }
                }

                return;
              }

              //Didn't manage to cluster in at this zoom, record us as a marker here and continue upwards
              gridUnclustered[zoom].addObject(layer, markerPoint);
            }

            //Didn't get in anything, add us to the top
            this._topClusterLevel._addChild(layer);
            layer.__parent = this._topClusterLevel;
            return;
          },

          //Enqueue code to fire after the marker expand/contract has happened
          _enqueue: function (fn) {
            this._queue.push(fn);
            if (!this._queueTimeout) {
              this._queueTimeout = setTimeout(L.bind(this._processQueue, this), 300);
            }
          },
          _processQueue: function () {
            for (var i = 0; i < this._queue.length; i++) {
              this._queue[i].call(this);
            }
            this._queue.length = 0;
            clearTimeout(this._queueTimeout);
            this._queueTimeout = null;
          },

          //Merge and split any existing clusters that are too big or small
          _mergeSplitClusters: function () {

            //Incase we are starting to split before the animation finished
            this._processQueue();

            if (this._zoom < this._map._zoom && this._currentShownBounds.intersects(this._getExpandedVisibleBounds())) { //Zoom in, split
              this._animationStart();
              //Remove clusters now off screen
              this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds, this._zoom, this._getExpandedVisibleBounds());

              this._animationZoomIn(this._zoom, this._map._zoom);

            } else if (this._zoom > this._map._zoom) { //Zoom out, merge
              this._animationStart();

              this._animationZoomOut(this._zoom, this._map._zoom);
            } else {
              this._moveEnd();
            }
          },

          //Gets the maps visible bounds expanded in each direction by the size of the screen (so the user cannot see an area we do not cover in one pan)
          _getExpandedVisibleBounds: function () {
            if (!this.options.removeOutsideVisibleBounds) {
              return this.getBounds();
            }

            var map = this._map,
              bounds = map.getBounds(),
              sw = bounds._southWest,
              ne = bounds._northEast,
              latDiff = L.Browser.mobile ? 0 : Math.abs(sw.lat - ne.lat),
              lngDiff = L.Browser.mobile ? 0 : Math.abs(sw.lng - ne.lng);

            return new L.LatLngBounds(
              new L.LatLng(sw.lat - latDiff, sw.lng - lngDiff, true),
              new L.LatLng(ne.lat + latDiff, ne.lng + lngDiff, true));
          },

          //Shared animation code
          _animationAddLayerNonAnimated: function (layer, newCluster) {
            if (newCluster === layer) {
              this._featureGroup.addLayer(layer);
            } else if (newCluster._childCount === 2) {
              newCluster._addToMap();

              var markers = newCluster.getAllChildMarkers();
              this._featureGroup.removeLayer(markers[0]);
              this._featureGroup.removeLayer(markers[1]);
            } else {
              newCluster._updateIcon();
            }
          }
        });

        L.MarkerClusterGroup.include(!L.DomUtil.TRANSITION ? {

          //Non Animated versions of everything
          _animationStart: function () {
            //Do nothing...
          },
          _animationZoomIn: function (previousZoomLevel, newZoomLevel) {
            this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds, previousZoomLevel);
            this._topClusterLevel._recursivelyAddChildrenToMap(null, newZoomLevel, this._getExpandedVisibleBounds());

            //We didn't actually animate, but we use this event to mean "clustering animations have finished"
            this.fire('animationend');
          },
          _animationZoomOut: function (previousZoomLevel, newZoomLevel) {
            this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds, previousZoomLevel);
            this._topClusterLevel._recursivelyAddChildrenToMap(null, newZoomLevel, this._getExpandedVisibleBounds());

            //We didn't actually animate, but we use this event to mean "clustering animations have finished"
            this.fire('animationend');
          },
          _animationAddLayer: function (layer, newCluster) {
            this._animationAddLayerNonAnimated(layer, newCluster);
          }
        } : {

          //Animated versions here
          _animationStart: function () {
            this._map._mapPane.className += ' leaflet-cluster-anim';
            this._inZoomAnimation++;
          },
          _animationEnd: function () {
            if (this._map) {
              this._map._mapPane.className = this._map._mapPane.className.replace(' leaflet-cluster-anim', '');
            }
            this._inZoomAnimation--;
            this.fire('animationend');
          },
          _animationZoomIn: function (previousZoomLevel, newZoomLevel) {
            var bounds = this._getExpandedVisibleBounds(),
              fg = this._featureGroup,
              i;

            //Add all children of current clusters to map and remove those clusters from map
            this._topClusterLevel._recursively(bounds, previousZoomLevel, 0, function (c) {
              var startPos = c._latlng,
                markers = c._markers,
                m;

              if (!bounds.contains(startPos)) {
                startPos = null;
              }

              if (c._isSingleParent() && previousZoomLevel + 1 === newZoomLevel) { //Immediately add the new child and remove us
                fg.removeLayer(c);
                c._recursivelyAddChildrenToMap(null, newZoomLevel, bounds);
              } else {
                //Fade out old cluster
                c.setOpacity(0);
                c._recursivelyAddChildrenToMap(startPos, newZoomLevel, bounds);
              }

              //Remove all markers that aren't visible any more
              //TODO: Do we actually need to do this on the higher levels too?
              for (i = markers.length - 1; i >= 0; i--) {
                m = markers[i];
                if (!bounds.contains(m._latlng)) {
                  fg.removeLayer(m);
                }
              }

            });

            this._forceLayout();

            //Update opacities
            this._topClusterLevel._recursivelyBecomeVisible(bounds, newZoomLevel);
            //TODO Maybe? Update markers in _recursivelyBecomeVisible
            fg.eachLayer(function (n) {
              if (!(n instanceof L.MarkerCluster) && n._icon) {
                n.setOpacity(1);
              }
            });

            //update the positions of the just added clusters/markers
            this._topClusterLevel._recursively(bounds, previousZoomLevel, newZoomLevel, function (c) {
              c._recursivelyRestoreChildPositions(newZoomLevel);
            });

            //Remove the old clusters and close the zoom animation
            this._enqueue(function () {
              //update the positions of the just added clusters/markers
              this._topClusterLevel._recursively(bounds, previousZoomLevel, 0, function (c) {
                fg.removeLayer(c);
                c.setOpacity(1);
              });

              this._animationEnd();
            });
          },

          _animationZoomOut: function (previousZoomLevel, newZoomLevel) {
            this._animationZoomOutSingle(this._topClusterLevel, previousZoomLevel - 1, newZoomLevel);

            //Need to add markers for those that weren't on the map before but are now
            this._topClusterLevel._recursivelyAddChildrenToMap(null, newZoomLevel, this._getExpandedVisibleBounds());
            //Remove markers that were on the map before but won't be now
            this._topClusterLevel._recursivelyRemoveChildrenFromMap(this._currentShownBounds, previousZoomLevel, this._getExpandedVisibleBounds());
          },
          _animationZoomOutSingle: function (cluster, previousZoomLevel, newZoomLevel) {
            var bounds = this._getExpandedVisibleBounds();

            //Animate all of the markers in the clusters to move to their cluster center point
            cluster._recursivelyAnimateChildrenInAndAddSelfToMap(bounds, previousZoomLevel + 1, newZoomLevel);

            var me = this;

            //Update the opacity (If we immediately set it they won't animate)
            this._forceLayout();
            cluster._recursivelyBecomeVisible(bounds, newZoomLevel);

            //TODO: Maybe use the transition timing stuff to make this more reliable
            //When the animations are done, tidy up
            this._enqueue(function () {

              //This cluster stopped being a cluster before the timeout fired
              if (cluster._childCount === 1) {
                var m = cluster._markers[0];
                //If we were in a cluster animation at the time then the opacity and position of our child could be wrong now, so fix it
                m.setLatLng(m.getLatLng());
                if (m.setOpacity) {
                  m.setOpacity(1);
                }
              } else {
                cluster._recursively(bounds, newZoomLevel, 0, function (c) {
                  c._recursivelyRemoveChildrenFromMap(bounds, previousZoomLevel + 1);
                });
              }
              me._animationEnd();
            });
          },
          _animationAddLayer: function (layer, newCluster) {
            var me = this,
              fg = this._featureGroup;

            fg.addLayer(layer);
            if (newCluster !== layer) {
              if (newCluster._childCount > 2) { //Was already a cluster

                newCluster._updateIcon();
                this._forceLayout();
                this._animationStart();

                layer._setPos(this._map.latLngToLayerPoint(newCluster.getLatLng()));
                layer.setOpacity(0);

                this._enqueue(function () {
                  fg.removeLayer(layer);
                  layer.setOpacity(1);

                  me._animationEnd();
                });

              } else { //Just became a cluster
                this._forceLayout();

                me._animationStart();
                me._animationZoomOutSingle(newCluster, this._map.getMaxZoom(), this._map.getZoom());
              }
            }
          },

          //Force a browser layout of stuff in the map
          // Should apply the current opacity and location to all elements so we can update them again for an animation
          _forceLayout: function () {
            //In my testing this works, infact offsetWidth of any element seems to work.
            //Could loop all this._layers and do this for each _icon if it stops working

            L.Util.falseFn(document.body.offsetWidth);
          }
        });

        L.markerClusterGroup = function (options) {
          return new L.MarkerClusterGroup(options);
        };


        L.MarkerCluster = L.Marker.extend({
          initialize: function (group, zoom, a, b) {

            L.Marker.prototype.initialize.call(this, a ? (a._cLatLng || a.getLatLng()) : new L.LatLng(0, 0), { icon: this });


            this._group = group;
            this._zoom = zoom;

            this._markers = [];
            this._childClusters = [];
            this._childCount = 0;
            this._iconNeedsUpdate = true;

            this._bounds = new L.LatLngBounds();

            if (a) {
              this._addChild(a);
            }
            if (b) {
              this._addChild(b);
            }
          },

          //Recursively retrieve all child markers of this cluster
          getAllChildMarkers: function (storageArray) {
            storageArray = storageArray || [];

            for (var i = this._childClusters.length - 1; i >= 0; i--) {
              this._childClusters[i].getAllChildMarkers(storageArray);
            }

            for (var j = this._markers.length - 1; j >= 0; j--) {
              storageArray.push(this._markers[j]);
            }

            return storageArray;
          },

          //Returns the count of how many child markers we have
          getChildCount: function () {
            return this._childCount;
          },

          //Zoom to the minimum of showing all of the child markers, or the extents of this cluster
          zoomToBounds: function () {
            var childClusters = this._childClusters.slice(),
              map = this._group._map,
              boundsZoom = map.getBoundsZoom(this._bounds),
              zoom = this._zoom + 1,
              mapZoom = map.getZoom(),
              i;

            //calculate how far we need to zoom down to see all of the markers
            while (childClusters.length > 0 && boundsZoom > zoom) {
              zoom++;
              var newClusters = [];
              for (i = 0; i < childClusters.length; i++) {
                newClusters = newClusters.concat(childClusters[i]._childClusters);
              }
              childClusters = newClusters;
            }

            if (boundsZoom > zoom) {
              this._group._map.setView(this._latlng, zoom);
            } else if (boundsZoom <= mapZoom) { //If fitBounds wouldn't zoom us down, zoom us down instead
              this._group._map.setView(this._latlng, mapZoom + 1);
            } else {
              this._group._map.fitBounds(this._bounds);
            }
          },

          getBounds: function () {
            var bounds = new L.LatLngBounds();
            bounds.extend(this._bounds);
            return bounds;
          },

          _updateIcon: function () {
            this._iconNeedsUpdate = true;
            if (this._icon) {
              this.setIcon(this);
            }
          },

          //Cludge for Icon, we pretend to be an icon for performance
          createIcon: function () {
            if (this._iconNeedsUpdate) {
              this._iconObj = this._group.options.iconCreateFunction(this);
              this._iconNeedsUpdate = false;
            }
            return this._iconObj.createIcon();
          },
          createShadow: function () {
            return this._iconObj.createShadow();
          },


          _addChild: function (new1, isNotificationFromChild) {

            this._iconNeedsUpdate = true;
            this._expandBounds(new1);

            if (new1 instanceof L.MarkerCluster) {
              if (!isNotificationFromChild) {
                this._childClusters.push(new1);
                new1.__parent = this;
              }
              this._childCount += new1._childCount;
            } else {
              if (!isNotificationFromChild) {
                this._markers.push(new1);
              }
              this._childCount++;
            }

            if (this.__parent) {
              this.__parent._addChild(new1, true);
            }
          },

          //Expand our bounds and tell our parent to
          _expandBounds: function (marker) {
            var addedCount,
              addedLatLng = marker._wLatLng || marker._latlng;

            if (marker instanceof L.MarkerCluster) {
              this._bounds.extend(marker._bounds);
              addedCount = marker._childCount;
            } else {
              this._bounds.extend(addedLatLng);
              addedCount = 1;
            }

            if (!this._cLatLng) {
              // when clustering, take position of the first point as the cluster center
              this._cLatLng = marker._cLatLng || addedLatLng;
            }

            // when showing clusters, take weighted average of all points as cluster center
            var totalCount = this._childCount + addedCount;

            //Calculate weighted latlng for display
            if (!this._wLatLng) {
              this._latlng = this._wLatLng = new L.LatLng(addedLatLng.lat, addedLatLng.lng);
            } else {
              this._wLatLng.lat = (addedLatLng.lat * addedCount + this._wLatLng.lat * this._childCount) / totalCount;
              this._wLatLng.lng = (addedLatLng.lng * addedCount + this._wLatLng.lng * this._childCount) / totalCount;
            }
          },

          //Set our markers position as given and add it to the map
          _addToMap: function (startPos) {
            if (startPos) {
              this._backupLatlng = this._latlng;
              this.setLatLng(startPos);
            }
            this._group._featureGroup.addLayer(this);
          },

          _recursivelyAnimateChildrenIn: function (bounds, center, maxZoom) {
            this._recursively(bounds, 0, maxZoom - 1,
              function (c) {
                var markers = c._markers,
                  i, m;
                for (i = markers.length - 1; i >= 0; i--) {
                  m = markers[i];

                  //Only do it if the icon is still on the map
                  if (m._icon) {
                    m._setPos(center);
                    m.setOpacity(0);
                  }
                }
              },
              function (c) {
                var childClusters = c._childClusters,
                  j, cm;
                for (j = childClusters.length - 1; j >= 0; j--) {
                  cm = childClusters[j];
                  if (cm._icon) {
                    cm._setPos(center);
                    cm.setOpacity(0);
                  }
                }
              }
            );
          },

          _recursivelyAnimateChildrenInAndAddSelfToMap: function (bounds, previousZoomLevel, newZoomLevel) {
            this._recursively(bounds, newZoomLevel, 0,
              function (c) {
                c._recursivelyAnimateChildrenIn(bounds, c._group._map.latLngToLayerPoint(c.getLatLng()).round(), previousZoomLevel);

                //TODO: depthToAnimateIn affects _isSingleParent, if there is a multizoom we may/may not be.
                //As a hack we only do a animation free zoom on a single level zoom, if someone does multiple levels then we always animate
                if (c._isSingleParent() && previousZoomLevel - 1 === newZoomLevel) {
                  c.setOpacity(1);
                  c._recursivelyRemoveChildrenFromMap(bounds, previousZoomLevel); //Immediately remove our children as we are replacing them. TODO previousBounds not bounds
                } else {
                  c.setOpacity(0);
                }

                c._addToMap();
              }
            );
          },

          _recursivelyBecomeVisible: function (bounds, zoomLevel) {
            this._recursively(bounds, 0, zoomLevel, null, function (c) {
              c.setOpacity(1);
            });
          },

          _recursivelyAddChildrenToMap: function (startPos, zoomLevel, bounds) {
            this._recursively(bounds, -1, zoomLevel,
              function (c) {
                if (zoomLevel === c._zoom) {
                  return;
                }

                //Add our child markers at startPos (so they can be animated out)
                for (var i = c._markers.length - 1; i >= 0; i--) {
                  var nm = c._markers[i];

                  if (!bounds.contains(nm._latlng)) {
                    continue;
                  }

                  if (startPos) {
                    nm._backupLatlng = nm.getLatLng();

                    nm.setLatLng(startPos);
                    if (nm.setOpacity) {
                      nm.setOpacity(0);
                    }
                  }

                  c._group._featureGroup.addLayer(nm);
                }
              },
              function (c) {
                c._addToMap(startPos);
              }
            );
          },

          _recursivelyRestoreChildPositions: function (zoomLevel) {
            //Fix positions of child markers
            for (var i = this._markers.length - 1; i >= 0; i--) {
              var nm = this._markers[i];
              if (nm._backupLatlng) {
                nm.setLatLng(nm._backupLatlng);
                delete nm._backupLatlng;
              }
            }

            if (zoomLevel - 1 === this._zoom) {
              //Reposition child clusters
              for (var j = this._childClusters.length - 1; j >= 0; j--) {
                this._childClusters[j]._restorePosition();
              }
            } else {
              for (var k = this._childClusters.length - 1; k >= 0; k--) {
                this._childClusters[k]._recursivelyRestoreChildPositions(zoomLevel);
              }
            }
          },

          _restorePosition: function () {
            if (this._backupLatlng) {
              this.setLatLng(this._backupLatlng);
              delete this._backupLatlng;
            }
          },

          //exceptBounds: If set, don't remove any markers/clusters in it
          _recursivelyRemoveChildrenFromMap: function (previousBounds, zoomLevel, exceptBounds) {
            var m, i;
            this._recursively(previousBounds, -1, zoomLevel - 1,
              function (c) {
                //Remove markers at every level
                for (i = c._markers.length - 1; i >= 0; i--) {
                  m = c._markers[i];
                  if (!exceptBounds || !exceptBounds.contains(m._latlng)) {
                    c._group._featureGroup.removeLayer(m);
                    if (m.setOpacity) {
                      m.setOpacity(1);
                    }
                  }
                }
              },
              function (c) {
                //Remove child clusters at just the bottom level
                for (i = c._childClusters.length - 1; i >= 0; i--) {
                  m = c._childClusters[i];
                  if (!exceptBounds || !exceptBounds.contains(m._latlng)) {
                    c._group._featureGroup.removeLayer(m);
                    if (m.setOpacity) {
                      m.setOpacity(1);
                    }
                  }
                }
              }
            );
          },

          //Run the given functions recursively to this and child clusters
          // boundsToApplyTo: a L.LatLngBounds representing the bounds of what clusters to recurse in to
          // zoomLevelToStart: zoom level to start running functions (inclusive)
          // zoomLevelToStop: zoom level to stop running functions (inclusive)
          // runAtEveryLevel: function that takes an L.MarkerCluster as an argument that should be applied on every level
          // runAtBottomLevel: function that takes an L.MarkerCluster as an argument that should be applied at only the bottom level
          _recursively: function (boundsToApplyTo, zoomLevelToStart, zoomLevelToStop, runAtEveryLevel, runAtBottomLevel) {
            var childClusters = this._childClusters,
              zoom = this._zoom,
              i, c;

            if (zoomLevelToStart > zoom) { //Still going down to required depth, just recurse to child clusters
              for (i = childClusters.length - 1; i >= 0; i--) {
                c = childClusters[i];
                if (boundsToApplyTo.intersects(c._bounds)) {
                  c._recursively(boundsToApplyTo, zoomLevelToStart, zoomLevelToStop, runAtEveryLevel, runAtBottomLevel);
                }
              }
            } else { //In required depth

              if (runAtEveryLevel) {
                runAtEveryLevel(this);
              }
              if (runAtBottomLevel && this._zoom === zoomLevelToStop) {
                runAtBottomLevel(this);
              }

              //TODO: This loop is almost the same as above
              if (zoomLevelToStop > zoom) {
                for (i = childClusters.length - 1; i >= 0; i--) {
                  c = childClusters[i];
                  if (boundsToApplyTo.intersects(c._bounds)) {
                    c._recursively(boundsToApplyTo, zoomLevelToStart, zoomLevelToStop, runAtEveryLevel, runAtBottomLevel);
                  }
                }
              }
            }
          },

          _recalculateBounds: function () {
            var markers = this._markers,
              childClusters = this._childClusters,
              i;

            this._bounds = new L.LatLngBounds();
            delete this._wLatLng;

            for (i = markers.length - 1; i >= 0; i--) {
              this._expandBounds(markers[i]);
            }
            for (i = childClusters.length - 1; i >= 0; i--) {
              this._expandBounds(childClusters[i]);
            }
          },


          //Returns true if we are the parent of only one cluster and that cluster is the same as us
          _isSingleParent: function () {
            //Don't need to check this._markers as the rest won't work if there are any
            return this._childClusters.length > 0 && this._childClusters[0]._childCount === this._childCount;
          }
        });



        L.DistanceGrid = function (cellSize) {
          this._cellSize = cellSize;
          this._sqCellSize = cellSize * cellSize;
          this._grid = {};
          this._objectPoint = {};
        };

        L.DistanceGrid.prototype = {

          addObject: function (obj, point) {
            var x = this._getCoord(point.x),
              y = this._getCoord(point.y),
              grid = this._grid,
              row = grid[y] = grid[y] || {},
              cell = row[x] = row[x] || [],
              stamp = L.Util.stamp(obj);

            this._objectPoint[stamp] = point;

            cell.push(obj);
          },

          updateObject: function (obj, point) {
            this.removeObject(obj);
            this.addObject(obj, point);
          },

          //Returns true if the object was found
          removeObject: function (obj, point) {
            var x = this._getCoord(point.x),
              y = this._getCoord(point.y),
              grid = this._grid,
              row = grid[y] = grid[y] || {},
              cell = row[x] = row[x] || [],
              i, len;

            delete this._objectPoint[L.Util.stamp(obj)];

            for (i = 0, len = cell.length; i < len; i++) {
              if (cell[i] === obj) {

                cell.splice(i, 1);

                if (len === 1) {
                  delete row[x];
                }

                return true;
              }
            }

          },

          eachObject: function (fn, context) {
            var i, j, k, len, row, cell, removed,
              grid = this._grid;

            for (i in grid) {
              row = grid[i];

              for (j in row) {
                cell = row[j];

                for (k = 0, len = cell.length; k < len; k++) {
                  removed = fn.call(context, cell[k]);
                  if (removed) {
                    k--;
                    len--;
                  }
                }
              }
            }
          },

          getNearObject: function (point) {
            var x = this._getCoord(point.x),
              y = this._getCoord(point.y),
              i, j, k, row, cell, len, obj, dist,
              objectPoint = this._objectPoint,
              closestDistSq = this._sqCellSize,
              closest = null;

            for (i = y - 1; i <= y + 1; i++) {
              row = this._grid[i];
              if (row) {

                for (j = x - 1; j <= x + 1; j++) {
                  cell = row[j];
                  if (cell) {

                    for (k = 0, len = cell.length; k < len; k++) {
                      obj = cell[k];
                      dist = this._sqDist(objectPoint[L.Util.stamp(obj)], point);
                      if (dist < closestDistSq) {
                        closestDistSq = dist;
                        closest = obj;
                      }
                    }
                  }
                }
              }
            }
            return closest;
          },

          _getCoord: function (x) {
            return Math.floor(x / this._cellSize);
          },

          _sqDist: function (p, p2) {
            var dx = p2.x - p.x,
              dy = p2.y - p.y;
            return dx * dx + dy * dy;
          }
        };


        /* Copyright (c) 2012 the authors listed at the following URL, and/or
         the authors of referenced articles or incorporated external code:
         http://en.literateprograms.org/Quickhull_(Javascript)?action=history&offset=20120410175256

         Permission is hereby granted, free of charge, to any person obtaining
         a copy of this software and associated documentation files (the
         "Software"), to deal in the Software without restriction, including
         without limitation the rights to use, copy, modify, merge, publish,
         distribute, sublicense, and/or sell copies of the Software, and to
         permit persons to whom the Software is furnished to do so, subject to
         the following conditions:

         The above copyright notice and this permission notice shall be
         included in all copies or substantial portions of the Software.

         THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
         EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
         MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
         IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
         CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
         TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
         SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

         Retrieved from: http://en.literateprograms.org/Quickhull_(Javascript)?oldid=18434
         */

        (function () {
          L.QuickHull = {

            /*
             * @param {Object} cpt a point to be measured from the baseline
             * @param {Array} bl the baseline, as represented by a two-element
             *   array of latlng objects.
             * @returns {Number} an approximate distance measure
             */
            getDistant: function (cpt, bl) {
              var vY = bl[1].lat - bl[0].lat,
                vX = bl[0].lng - bl[1].lng;
              return (vX * (cpt.lat - bl[0].lat) + vY * (cpt.lng - bl[0].lng));
            },

            /*
             * @param {Array} baseLine a two-element array of latlng objects
             *   representing the baseline to project from
             * @param {Array} latLngs an array of latlng objects
             * @returns {Object} the maximum point and all new points to stay
             *   in consideration for the hull.
             */
            findMostDistantPointFromBaseLine: function (baseLine, latLngs) {
              var maxD = 0,
                maxPt = null,
                newPoints = [],
                i, pt, d;

              for (i = latLngs.length - 1; i >= 0; i--) {
                pt = latLngs[i];
                d = this.getDistant(pt, baseLine);

                if (d > 0) {
                  newPoints.push(pt);
                } else {
                  continue;
                }

                if (d > maxD) {
                  maxD = d;
                  maxPt = pt;
                }
              }

              return { maxPoint: maxPt, newPoints: newPoints };
            },


            /*
             * Given a baseline, compute the convex hull of latLngs as an array
             * of latLngs.
             *
             * @param {Array} latLngs
             * @returns {Array}
             */
            buildConvexHull: function (baseLine, latLngs) {
              var convexHullBaseLines = [],
                t = this.findMostDistantPointFromBaseLine(baseLine, latLngs);

              if (t.maxPoint) { // if there is still a point "outside" the base line
                convexHullBaseLines =
                  convexHullBaseLines.concat(
                    this.buildConvexHull([baseLine[0], t.maxPoint], t.newPoints)
                  );
                convexHullBaseLines =
                  convexHullBaseLines.concat(
                    this.buildConvexHull([t.maxPoint, baseLine[1]], t.newPoints)
                  );
                return convexHullBaseLines;
              } else {  // if there is no more point "outside" the base line, the current base line is part of the convex hull
                return [baseLine[0]];
              }
            },

            /*
             * Given an array of latlngs, compute a convex hull as an array
             * of latlngs
             *
             * @param {Array} latLngs
             * @returns {Array}
             */
            getConvexHull: function (latLngs) {
              // find first baseline
              var maxLat = false, minLat = false,
                maxPt = null, minPt = null,
                i;

              for (i = latLngs.length - 1; i >= 0; i--) {
                var pt = latLngs[i];
                if (maxLat === false || pt.lat > maxLat) {
                  maxPt = pt;
                  maxLat = pt.lat;
                }
                if (minLat === false || pt.lat < minLat) {
                  minPt = pt;
                  minLat = pt.lat;
                }
              }
              var ch = [].concat(this.buildConvexHull([minPt, maxPt], latLngs),
                this.buildConvexHull([maxPt, minPt], latLngs));
              return ch;
            }
          };
        }());

        L.MarkerCluster.include({
          getConvexHull: function () {
            var childMarkers = this.getAllChildMarkers(),
              points = [],
              p, i;

            for (i = childMarkers.length - 1; i >= 0; i--) {
              p = childMarkers[i].getLatLng();
              points.push(p);
            }

            return L.QuickHull.getConvexHull(points);
          }
        });


        //This code is 100% based on https://github.com/jawj/OverlappingMarkerSpiderfier-Leaflet
        //Huge thanks to jawj for implementing it first to make my job easy :-)

        L.MarkerCluster.include({

          _2PI: Math.PI * 2,
          _circleFootSeparation: 25, //related to circumference of circle
          _circleStartAngle: Math.PI / 6,

          _spiralFootSeparation: 28, //related to size of spiral (experiment!)
          _spiralLengthStart: 11,
          _spiralLengthFactor: 5,

          _circleSpiralSwitchover: 9, //show spiral instead of circle from this marker count upwards.
          // 0 -> always spiral; Infinity -> always circle

          spiderfy: function () {
            if (this._group._spiderfied === this || this._group._inZoomAnimation) {
              return;
            }

            var childMarkers = this.getAllChildMarkers(),
              group = this._group,
              map = group._map,
              center = map.latLngToLayerPoint(this._latlng),
              positions;

            this._group._unspiderfy();
            this._group._spiderfied = this;

            //TODO Maybe: childMarkers order by distance to center

            if (childMarkers.length >= this._circleSpiralSwitchover) {
              positions = this._generatePointsSpiral(childMarkers.length, center);
            } else {
              center.y += 10; //Otherwise circles look wrong
              positions = this._generatePointsCircle(childMarkers.length, center);
            }

            this._animationSpiderfy(childMarkers, positions);
          },

          unspiderfy: function (zoomDetails) {
            /// <param Name="zoomDetails">Argument from zoomanim if being called in a zoom animation or null otherwise</param>
            if (this._group._inZoomAnimation) {
              return;
            }
            this._animationUnspiderfy(zoomDetails);

            this._group._spiderfied = null;
          },

          _generatePointsCircle: function (count, centerPt) {
            var circumference = this._group.options.spiderfyDistanceMultiplier * this._circleFootSeparation * (2 + count),
              legLength = circumference / this._2PI,  //radius from circumference
              angleStep = this._2PI / count,
              res = [],
              i, angle;

            res.length = count;

            for (i = count - 1; i >= 0; i--) {
              angle = this._circleStartAngle + i * angleStep;
              res[i] = new L.Point(centerPt.x + legLength * Math.cos(angle), centerPt.y + legLength * Math.sin(angle))._round();
            }

            return res;
          },

          _generatePointsSpiral: function (count, centerPt) {
            var legLength = this._group.options.spiderfyDistanceMultiplier * this._spiralLengthStart,
              separation = this._group.options.spiderfyDistanceMultiplier * this._spiralFootSeparation,
              lengthFactor = this._group.options.spiderfyDistanceMultiplier * this._spiralLengthFactor,
              angle = 0,
              res = [],
              i;

            res.length = count;

            for (i = count - 1; i >= 0; i--) {
              angle += separation / legLength + i * 0.0005;
              res[i] = new L.Point(centerPt.x + legLength * Math.cos(angle), centerPt.y + legLength * Math.sin(angle))._round();
              legLength += this._2PI * lengthFactor / angle;
            }
            return res;
          },

          _noanimationUnspiderfy: function () {
            var group = this._group,
              map = group._map,
              fg = group._featureGroup,
              childMarkers = this.getAllChildMarkers(),
              m, i;

            this.setOpacity(1);
            for (i = childMarkers.length - 1; i >= 0; i--) {
              m = childMarkers[i];

              fg.removeLayer(m);

              if (m._preSpiderfyLatlng) {
                m.setLatLng(m._preSpiderfyLatlng);
                delete m._preSpiderfyLatlng;
              }
              if (m.setZIndexOffset) {
                m.setZIndexOffset(0);
              }

              if (m._spiderLeg) {
                map.removeLayer(m._spiderLeg);
                delete m._spiderLeg;
              }
            }

            group._spiderfied = null;
          }
        });

        L.MarkerCluster.include(!L.DomUtil.TRANSITION ? {
          //Non Animated versions of everything
          _animationSpiderfy: function (childMarkers, positions) {
            var group = this._group,
              map = group._map,
              fg = group._featureGroup,
              i, m, leg, newPos;

            for (i = childMarkers.length - 1; i >= 0; i--) {
              newPos = map.layerPointToLatLng(positions[i]);
              m = childMarkers[i];

              m._preSpiderfyLatlng = m._latlng;
              m.setLatLng(newPos);
              if (m.setZIndexOffset) {
                m.setZIndexOffset(1000000); //Make these appear on top of EVERYTHING
              }

              fg.addLayer(m);


              leg = new L.Polyline([this._latlng, newPos], { weight: 1.5, color: '#222' });
              map.addLayer(leg);
              m._spiderLeg = leg;
            }
            this.setOpacity(0.3);
            group.fire('spiderfied');
          },

          _animationUnspiderfy: function () {
            this._noanimationUnspiderfy();
          }
        } : {
          //Animated versions here
          SVG_ANIMATION: (function () {
            return document.createElementNS('http://www.w3.org/2000/svg', 'animate').toString().indexOf('SVGAnimate') > -1;
          }()),

          _animationSpiderfy: function (childMarkers, positions) {
            var me = this,
              group = this._group,
              map = group._map,
              fg = group._featureGroup,
              thisLayerPos = map.latLngToLayerPoint(this._latlng),
              i, m, leg, newPos;

            //Add markers to map hidden at our center point
            for (i = childMarkers.length - 1; i >= 0; i--) {
              m = childMarkers[i];

              //If it is a marker, add it now and we'll animate it out
              if (m.setOpacity) {
                m.setZIndexOffset(1000000); //Make these appear on top of EVERYTHING
                m.setOpacity(0);

                fg.addLayer(m);

                m._setPos(thisLayerPos);
              } else {
                //Vectors just get immediately added
                fg.addLayer(m);
              }
            }

            group._forceLayout();
            group._animationStart();

            var initialLegOpacity = L.Path.SVG ? 0 : 0.3,
              xmlns = L.Path.SVG_NS;


            for (i = childMarkers.length - 1; i >= 0; i--) {
              newPos = map.layerPointToLatLng(positions[i]);
              m = childMarkers[i];

              //Move marker to new position
              m._preSpiderfyLatlng = m._latlng;
              m.setLatLng(newPos);

              if (m.setOpacity) {
                m.setOpacity(1);
              }


              //Add Legs.
              leg = new L.Polyline([me._latlng, newPos], { weight: 1.5, color: '#222', opacity: initialLegOpacity });
              map.addLayer(leg);
              m._spiderLeg = leg;

              //Following animations don't work for canvas
              if (!L.Path.SVG || !this.SVG_ANIMATION) {
                continue;
              }

              //How this works:
              //http://stackoverflow.com/questions/5924238/how-do-you-animate-an-svg-path-in-ios
              //http://dev.opera.com/articles/view/advanced-svg-animation-techniques/

              //Animate length
              var length = leg._path.getTotalLength();
              leg._path.setAttribute("stroke-dasharray", length + "," + length);

              var anim = document.createElementNS(xmlns, "animate");
              anim.setAttribute("attributeName", "stroke-dashoffset");
              anim.setAttribute("begin", "indefinite");
              anim.setAttribute("from", length);
              anim.setAttribute("to", 0);
              anim.setAttribute("dur", 0.25);
              leg._path.appendChild(anim);
              anim.beginElement();

              //Animate opacity
              anim = document.createElementNS(xmlns, "animate");
              anim.setAttribute("attributeName", "stroke-opacity");
              anim.setAttribute("attributeName", "stroke-opacity");
              anim.setAttribute("begin", "indefinite");
              anim.setAttribute("from", 0);
              anim.setAttribute("to", 0.5);
              anim.setAttribute("dur", 0.25);
              leg._path.appendChild(anim);
              anim.beginElement();
            }
            me.setOpacity(0.3);

            //Set the opacity of the spiderLegs back to their correct value
            // The animations above override this until they complete.
            // If the initial opacity of the spiderlegs isn't 0 then they appear before the animation starts.
            if (L.Path.SVG) {
              this._group._forceLayout();

              for (i = childMarkers.length - 1; i >= 0; i--) {
                m = childMarkers[i]._spiderLeg;

                m.options.opacity = 0.5;
                m._path.setAttribute('stroke-opacity', 0.5);
              }
            }

            setTimeout(function () {
              group._animationEnd();
              group.fire('spiderfied');
            }, 200);
          },

          _animationUnspiderfy: function (zoomDetails) {
            var group = this._group,
              map = group._map,
              fg = group._featureGroup,
              thisLayerPos = zoomDetails ? map._latLngToNewLayerPoint(this._latlng, zoomDetails.zoom, zoomDetails.center) : map.latLngToLayerPoint(this._latlng),
              childMarkers = this.getAllChildMarkers(),
              svg = L.Path.SVG && this.SVG_ANIMATION,
              m, i, a;

            group._animationStart();

            //Make us visible and bring the child markers back in
            this.setOpacity(1);
            for (i = childMarkers.length - 1; i >= 0; i--) {
              m = childMarkers[i];

              //Marker was added to us after we were spidified
              if (!m._preSpiderfyLatlng) {
                continue;
              }

              //Fix up the location to the real one
              m.setLatLng(m._preSpiderfyLatlng);
              delete m._preSpiderfyLatlng;
              //Hack override the location to be our center
              if (m.setOpacity) {
                m._setPos(thisLayerPos);
                m.setOpacity(0);
              } else {
                fg.removeLayer(m);
              }

              //Animate the spider legs back in
              if (svg) {
                a = m._spiderLeg._path.childNodes[0];
                a.setAttribute('to', a.getAttribute('from'));
                a.setAttribute('from', 0);
                a.beginElement();

                a = m._spiderLeg._path.childNodes[1];
                a.setAttribute('from', 0.5);
                a.setAttribute('to', 0);
                a.setAttribute('stroke-opacity', 0);
                a.beginElement();

                m._spiderLeg._path.setAttribute('stroke-opacity', 0);
              }
            }

            setTimeout(function () {
              //If we have only <= one child left then that marker will be shown on the map so don't remove it!
              var stillThereChildCount = 0;
              for (i = childMarkers.length - 1; i >= 0; i--) {
                m = childMarkers[i];
                if (m._spiderLeg) {
                  stillThereChildCount++;
                }
              }


              for (i = childMarkers.length - 1; i >= 0; i--) {
                m = childMarkers[i];

                if (!m._spiderLeg) { //Has already been unspiderfied
                  continue;
                }


                if (m.setOpacity) {
                  m.setOpacity(1);
                  m.setZIndexOffset(0);
                }

                if (stillThereChildCount > 1) {
                  fg.removeLayer(m);
                }

                map.removeLayer(m._spiderLeg);
                delete m._spiderLeg;
              }
              group._animationEnd();
            }, 200);
          }
        });


        L.MarkerClusterGroup.include({
          //The MarkerCluster currently spiderfied (if any)
          _spiderfied: null,

          _spiderfierOnAdd: function () {
            this._map.on('click', this._unspiderfyWrapper, this);

            if (this._map.options.zoomAnimation) {
              this._map.on('zoomstart', this._unspiderfyZoomStart, this);
            }
            //Browsers without zoomAnimation or a big zoom don't fire zoomstart
            this._map.on('zoomend', this._noanimationUnspiderfy, this);

            if (L.Path.SVG && !L.Browser.touch) {
              this._map._initPathRoot();
              //Needs to happen in the pageload, not after, or animations don't work in webkit
              //  http://stackoverflow.com/questions/8455200/svg-animate-with-dynamically-added-elements
              //Disable on touch browsers as the animation messes up on a touch zoom and isn't very noticable
            }
          },

          _spiderfierOnRemove: function () {
            this._map.off('click', this._unspiderfyWrapper, this);
            this._map.off('zoomstart', this._unspiderfyZoomStart, this);
            this._map.off('zoomanim', this._unspiderfyZoomAnim, this);

            this._unspiderfy(); //Ensure that markers are back where they should be
          },


          //On zoom start we add a zoomanim handler so that we are guaranteed to be last (after markers are animated)
          //This means we can define the animation they do rather than Markers doing an animation to their actual location
          _unspiderfyZoomStart: function () {
            if (!this._map) { //May have been removed from the map by a zoomEnd handler
              return;
            }

            this._map.on('zoomanim', this._unspiderfyZoomAnim, this);
          },
          _unspiderfyZoomAnim: function (zoomDetails) {
            //Wait until the first zoomanim after the user has finished touch-zooming before running the animation
            if (L.DomUtil.hasClass(this._map._mapPane, 'leaflet-touching')) {
              return;
            }

            this._map.off('zoomanim', this._unspiderfyZoomAnim, this);
            this._unspiderfy(zoomDetails);
          },


          _unspiderfyWrapper: function () {
            /// <summary>_unspiderfy but passes no arguments</summary>
            this._unspiderfy();
          },

          _unspiderfy: function (zoomDetails) {
            if (this._spiderfied) {
              this._spiderfied.unspiderfy(zoomDetails);
            }
          },

          _noanimationUnspiderfy: function () {
            if (this._spiderfied) {
              this._spiderfied._noanimationUnspiderfy();
            }
          },

          //If the given layer is currently being spiderfied then we unspiderfy it so it isn't on the map anymore etc
          _unspiderfyLayer: function (layer) {
            if (layer._spiderLeg) {
              this._featureGroup.removeLayer(layer);

              layer.setOpacity(1);
              //Position will be fixed up immediately in _animationUnspiderfy
              layer.setZIndexOffset(0);

              this._map.removeLayer(layer._spiderLeg);
              delete layer._spiderLeg;
            }
          }
        });


      }(window, document));
      return {
        markerClusterGroup:function(options){
          return L.markerClusterGroup(options);
        }
      }
    })
})();

/**
 * Created by jiuyuong on 2016/3/15.
 */
(function(){
  'use strict';
  angular
    .module('app.szgc')
    .factory('appCookie',appCookie);
  /** @ngInject */
  function appCookie(){
    var storage = window.localStorage;
    var $cookies = {
      c:{},
      put:function(name,value){
        this.c[name] = value;
        storage && storage.setItem(name,value);
      },
      remove:function(name){
        delete this.c[name];
        storage && storage.removeItem(name);
      },
      get:function(name){
        var v = this.c[name];
        if(!v && storage)
          v=storage.getItem(name);
        return v;
      }
    };
    return $cookies;
  }
})();


(function(){
  'use strict';
  tileLayer.$inject = ["$cordovaFile", "api"];
  angular
    .module('app.szgc')
    .factory('tileLayer',tileLayer);
  /** @ngInject */
  function tileLayer($cordovaFile,api){
    L.Offline = L.TileLayer.extend({
      _loadTile: function (tile, tilePoint) {
        tile._layer  = this;
        tile.onload  = this._tileOnLoad;
        tile.onerror = this._tileOnError;

        this._adjustTilePoint(tilePoint);
        //console.log(this._url);
        if(api.getNetwork()==1 && typeof cordova !== 'undefined') {
          $cordovaFile.readAsDataURL(cordova.file.dataDirectory+'/map', 'tile_'+this._url.Id +'_' + tilePoint.z + '_' + tilePoint.x + '_' + tilePoint.y + '.jpg').then(function (success) {
            tile.src = success;
          }, function (error) {
            tile.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
            //console.log(error);
          });
        }
        else{
          tile.src = this._url.api+'/api/picMap/load/' + tilePoint.z + '_' + tilePoint.x + '_' + tilePoint.y + '.png?size=256&path='+this._url.Url;
        }
      }
    });

    return {
      tile:function (url) {
        return new L.Offline(url,{attribution: false,noWrap: true,tileSize: 256});
      }
    }
  }
})();

/**
 * Created by zhangzhaoyong on 16/2/3.
 */
(function(){
  'use strict';

  SzgcyhydRecordsController.$inject = ["api", "$scope", "$q", "$stateParams"];
  angular
    .module('app.szgc')
    .controller('SzgcyhydRecordsController', SzgcyhydRecordsController);

  /** @ngInject */
  function SzgcyhydRecordsController(api,$scope,$q,$stateParams)
  {
    var vm = this;
    var projectId = $stateParams.idTree.split('>')[0];
    api.szgc.addProcessService.queryByProjectAndProdure3(projectId,{isGetChilde:1,regionIdTree:$stateParams.idTree}).then(function (result) {
      vm.Rows = result.data.Rows.filter(function (item) {

        return item.RegionType==8||item.RegionId==$stateParams.pid;
      });
      //console.log('vm.Rows',vm.Rows)
    });

  }

})();

/**
 * Created by jiuyuong on 2016/2/25.
 */
(function(){
  'use strict';

  SzgcyhydLink3Controller.$inject = ["$scope", "builds"];
  angular
    .module('app.szgc')
    .controller('SzgcyhydLink3Controller', SzgcyhydLink3Controller);

  /** @ngInject */
  function SzgcyhydLink3Controller ($scope, builds) {
    //$scope.$parent.$parent.data.itemName = $stateParams.itemName;
    //$scope.sxtfloor = [
    //    [50, 50, 10, 10, 15, 1],
    //    [50, 20, 10, 10, 10, 2]
    //];
    var vm = this;
    vm.sellLine = 0.6;
    vm.setFloor = function (current) {
      $scope.$parent.vm.current = current;
    }
    console.log('hm',$scope,vm)
    vm.onHammer = function(){
      console.log('b')
    }
    vm.data = builds;
    //console.log('bulids',builds)
    vm.buildLen = builds.builds.length;

    vm.panzoomConfig = {
      zoomLevels: 10,
      neutralZoomLevel: 4,
      scalePerZoomLevel: 0.5
    };
    vm.model = {};
  }

})();

/**
 * Created by jiuyuong on 2016/4/6.
 */
(function(){
  'use strict';
  SzgcyhydDlgController.$inject = ["project", "$mdDialog"];
  angular
    .module('app.szgc')
    .controller('SzgcyhydDlgController',SzgcyhydDlgController);

  /** @ngInject */
  function SzgcyhydDlgController(project,$mdDialog){
    var vm = this;
    vm.project = project;
    vm.show = false;
    console.log('project',project);

    vm.answer = function () {
      //cb ();
      $mdDialog.cancel ();
      //$state.go ('app.szgc.tzg', {pid: options.pid})
    };
  }
})();

/**
 * Created by zhangzhaoyong on 16/2/3.
 */
(function(){
  'use strict';

  SzgcyhydController.$inject = ["api", "$mdDialog", "$rootScope", "$scope", "utils", "$stateParams", "$state", "viewImage"];
  angular
    .module('app.szgc')
    .controller('SzgcyhydController', SzgcyhydController);

  /** @ngInject */
  function SzgcyhydController(api,$mdDialog,$rootScope,$scope,utils,$stateParams,$state,viewImage)
  {
    //viewImage.view('http://szdp.vanke.com:8088/upload/2016/03/980012f8-e903-4b54-9222-bd53edee391c.jpg')
    var vm = this;
    vm.showImg = function () {
      $rootScope.$emit('sxtImageViewAll',{data:true});
    }
    vm.data = {
      projectId: $stateParams.pid,
      projectName:$stateParams.pname
    };
    //appCookie.put('projects',JSON.stringify([{project_id:$stateParams.pid,name:$stateParams.pname}]))
    //vm.$parent.data.pname = vm.data.projectName;
    $rootScope.title = vm.data.projectName;

    vm.sellLine = 0.6;

    vm.project = {
      item:{
        type:$stateParams.type
      },
      idTree:$stateParams.idTree,
      pid: $stateParams.pid,
      onQueryed: function(data) {
        if (!vm.project.pid) {
          vm.project.data = data;
          //queryTable();
        }
      }
    };
    api.szgc.FilesService.GetPartionId().then(function(r){
      vm.project.partions = r.data.Rows;
    })
    var play = function(){
      api.szgc.FilesService.GetPrjFilesByFilter(vm.project.pid, vm.project.procedureId, vm.project.partion ? vm.project.partion.Id : null).then(function (r) {
        //console.log('r.data.Rows.length',r.data.Rows.length)
        if (r.data.Rows.length == 0) {
          utils.alert('暂无照片');
        }
        else{
          vm.showPlayer = true;
          vm.images = r.data.Rows;
        }
      })
    }
    var whenBack = function(e,data){
      if(vm.showPlayer || vm.searBarHide ){
        data.cancel = true;
        if(vm.showPlayer){
          vm.showPlayer =false;
        }
        else if(vm.searBarHide){
          vm.searBarHide = false;
        }
      }
    }
    $scope.$on('goBack',whenBack);
    $scope.$on('$destroy',function(){
    })
    vm.play = function(index){
      vm.project.procedureId = null;
      vm.project.partion = null;
      play();
    }
    $scope.$watch('vm.project.procedureId',function(){
      if(vm.project.procedureId)
        play();
    });
    $scope.$watch('vm.project.partion',function(){
      if(vm.project.partion)
        play();
    })


    var whenBack = function(e,data){
      if(vm.showPlayer || vm.searBarHide ){
        data.cancel = true;
        if(vm.showPlayer){
          vm.showPlayer =false;
        }
        else if(vm.searBarHide){
          vm.searBarHide = false;
        }
      }
    }
    $scope.$on('goBack',whenBack);
    vm.playN = function(n){
      if(n==3){
        $state.go('app.szgc.yhyd.records',$stateParams);
        return;
      }
      api.szgc.FilesService.GetPrjFilesByFilter(vm.project.pid, { imageType: n }).then(function(r){
        if(r.data.Rows.length==0){
          utils.alert('暂无照片');
        }
        else {
          vm.project.n = n;
          $mdDialog.show ({
              locals: {
                project: vm.project
              },
              controller: 'SzgcyhydDlgController as vm',
              templateUrl: 'app/main/szgc/home/SzgcyhydDlg.html',
              parent: angular.element (document.body),
              clickOutsideToClose: true,
              fullscreen: true
            })
            .then (function (answer) {

            }, function () {

            });
        }
      })

    }

    if($stateParams.seq=='2'){
      vm.playN(2);
    }
    //vm.playN();

  }

})();

/**
 * Created by emma on 2016/2/23.
 */
(function(){
  'use strict';

  SzgcdetailController.$inject = ["$scope", "details", "$stateParams"];
  angular
    .module('app.szgc')
    .controller('SzgcbuilddetailController', SzgcdetailController);

  /** @ngInject */
  function SzgcdetailController($scope,details,$stateParams)
  {

    var vm = this;
    vm.build = {
      name: $stateParams.buildName || $scope.$parent.vm.current.name,
      building_id: $stateParams.buildId || $scope.$parent.vm.current.building_id,
      floors: $stateParams.floors || $scope.$parent.vm.current.floors,
      summary: $stateParams.summary || $scope.$parent.vm.current.summary,
      gx1: $scope.$parent.vm.current.gx1,
      gx2: $scope.$parent.vm.current.gx2
    };
    vm.treeId = $stateParams.pid + '>' + $stateParams.itemId + '>' + $stateParams.buildId;
    vm.sellLine = 0.6;
    vm.data= {
      config: {
        showXAxis: true,
        showYAxis: true,
        showLegend: false,
        width:367,
        debug: true,
        stack: false,
        xAxis:{
          type: 'category'
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 50,
          axisLabel: {
            formatter: function (value, index) {
              return parseInt(value);//非真正解决
            }
          },
          yAxisIndex:0
        },
        series: {
          label: {
            normal: {
              show: true
            }
          }
        }
      },
      data:details
    };



  }

})();

(function ()
{
  'use strict';

  SzgcHomeController.$inject = ["$scope", "auth", "$state", "$rootScope", "appCookie", "$timeout", "versionUpdate", "api"];
  angular
    .module('app.szgc')
    .controller('SzgcHomeController', SzgcHomeController);

  /** @ngInject */
  function SzgcHomeController($scope,auth,$state,$rootScope,appCookie,$timeout,versionUpdate,api)
  {

    api.szgc.vanke.profile();
    var u = navigator.userAgent, app = navigator.appVersion;
    var isAndroid = u.indexOf('Android') > -1 //|| u.indexOf('Linux') > -1; //android终端或者uc浏览器
   // var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    //alert('是否是Android：'+isAndroid);
    //alert('是否是iOS：'+isiOS);

    if(isAndroid)
    {
      versionUpdate.check();

    }

    var vm = this;
    vm.data = {};
    vm.is = function (state) {
      return vm.includes(state);
    }
    vm.markerClick = markerClick;
    vm.querySearch = function(text){
      var k=[];
      if(vm.markers){
        vm.markers.forEach(function(item){
          if(!text || text=='' || item.title.indexOf(text)!=-1 || item.pinyin.indexOf(text)!=-1){
            k.push(item);
          }
        })
      }
      return k;
    }
    vm.changeItem = function(item){
      $timeout(function(){
        $state.go('app.szgc.project',{pid:item.projectId, pname: item.title});
      },200)

    }

    function markerClick($current){
      appCookie.put('projects',JSON.stringify([{project_id:$current.projectId,name:$current.title}]))
      $state.go('app.szgc.project',{pid:$current.projectId, pname: $current.title});
    }
  }
})();

/**
 * Created by abc on 2016/2/23.
 */
(function(){
  'use strict';

  lineController.$inject = ["$scope"];
  angular.module('app.szgc')
    .controller('LineChartController',lineController);

  function lineController($scope){
    $scope.option ={
      tooltip: {
        show: false,
      },
    }
    var pageload = {
      name: '',
      datapoints: [
        { x: '主体', y: 35, },
        { x: '墙体', y: 25 },
        { x: '瓷砖', y: 20 },
        { x: '门窗', y: 15 },
        { x: '油漆', y: 10 }
      ]
    };

    var firstPaint = {
     // name: 'page.firstPaint',
      datapoints: [
        { x: '主体', y: 0 },
        { x: '墙体', y: 0 },
        { x: '瓷砖', y: 0 },
        { x:'门窗', y: 0 },
        { x: '油漆', y: 0 }

      ]
    };


    $scope.config = {
      //title: 'Bar Chart',
      //subtitle: 'Bar Chart Subtitle',

      showXAxis: true,
      showYAxis: true,
      showLegend: true,
      debug: true,
      stack: true,
    };

    $scope.data = [ pageload ];
    $scope.multiple = [pageload, firstPaint ];
  }

})();

/**
 * Created by zhangzhaoyong on 16/1/28.
 */
(function(){
  'use strict';

  toggleMenuDirective.$inject = ["$mdMedia"];
  angular
    .module('app.szgc')
    .directive('toggleMenu',toggleMenuDirective);

  /** @ngInject */
  function toggleMenuDirective($mdMedia) {
    return {
      restrict: 'EA',
      template: '<md-button  class="md-fab menu md-mini" ng-class="{\'menu-left\':!inst}"  ng-click="whenClick()"><md-icon md-font-icon="{{getinst()?\'icon-menu\':\'icon-arrow-up\'}}" ng-class="{\'icon-menu\':!inst,\'icon-menu\':inst}" ></md-icon></md-button>',
      scope: {
        inst: '='
      },
      link: function (scope, element, attrs, ctrl) {
        scope.getinst = function(){
          return scope.inst;
        }
        scope.whenClick = function () {
          scope.inst = !scope.inst;
          if (scope.inst)
          {
            $(element.parents('md-tab-content')[0]).animate({ scrollTop: 0 }, 'slow');

          }
        }
        //if($mdMedia('sm'))
          scope.inst = false;
        //scope.whenClick();
      }
    }
  }
})();

/**
 * Created by jiuyuong on 2016/4/6.
 */
(function(){
  'use strict';
  sxtYear.$inject = ["utils", "api", "sxt", "$q", "$timeout", "$window"];
  angular
    .module('app.szgc')
    .directive('sxtYear',sxtYear);

  /** @ngInject */
  function sxtYear(utils, api, sxt,$q,$timeout,$window) {
    return {
      scope: {
        procedureId: '=',
        partion: '=',
        regionId: '=',
        show: '=',
        regionName: '=',
        imageType: '=',
        roomType:'=',
        yearShow:'='
      },
      template: '<div class="tbb" style="position:absolute;top:50px;line-height: 20px; left:0;width:100%;background:#fff;z-index:1002; height: 25px;"><div class="btn-group" role="group" aria-label="" style="margin: 8px 4px;">\
  <button type="button" class="btn btn-white" ng-click="add(-1)"> <md-icon md-font-icon="icon-chevron-left"></md-icon></button>\
  <button type="button" class="btn btn-white yearlabel" data-day="{{year}}-1-1" data-type="3">{{year}}</button>\
  <button type="button" class="btn btn-white" ng-click="add(1)"><md-icon md-font-icon="icon-chevron-right"></md-icon></button>\
</div> <button type="button"  class="btn btn-white yearlabel allbtn" style="margin: -29px auto;display: block">全部</button><button type="button" ng-show="isLoading" class="btn btn-white"><i class="fa fa-refresh fa-spin"></i></button> </div><div style="overflow: auto;margin-top:34px;" class="clear months monthsscroll"><div ng-repeat="m in months" sxt-month="m" ></div></div>',
      link: function (scope, element, attr, ctrl) {
        var map,curlay;
        element.addClass('sxtcalendar');
        $timeout(function(){
          element.find('.tbb').insertBefore(element);
        },500);
        scope.$watch('year', function () {
          if (!scope.year) return;
          scope.months = [];
          for (var i = 1; i < 13; i++) {
            scope.months.push({ m: scope.year + '-' + i + '-1',d:[] });
          }
        });
        scope.year = moment().year();
        scope.add = function (y) {
          scope.year = scope.year + y;
          scope.query();
        };
        var filter = function () {
          if (!scope.data) return;
          if (scope.data.length == 0) {
            utils.alert('暂无照片');
          }
          else {
            scope.months.forEach(function (m) {
              m.d.splice(0, m.d.length);
            });
            scope.allfilter = [];
            scope.data.forEach(function (file) {
              if (scope.procedureId && (!file.gx || file.gx.indexOf(scope.procedureId) == -1)) return;
              if (scope.partion && scope.partion.Id && file.GroupId.indexOf('-' + scope.partion.Id + '-14') == -1) return;
              scope.allfilter.push(file);
              var date = moment(file.CreateDate,'YYYY-MM-DD');
              if (date.year() == scope.year) {
                var days = scope.months[date.month()].d;
                var day = days.find(function (dy) { return dy.day == date.date(); });
                if (!day) {
                  days.push({
                    day: date.date(),
                    images: [file]
                  });
                } else {
                  day.images.push(file);
                }
              }
            });
          }
          playImage();
          if(scope.yearShow){
            $timeout(function(){
              $('button.yearlabel',element).trigger('click');
              $('button.allbtn').css('display','none')
            },0)
          }
        }
        scope.$watch('procedureId', filter);
        scope.$watch('partion', filter);
        scope.query = function () {
          var query;

          switch (scope.imageType) {
            case 2:
            case 3:
              query = api.szgc.FilesService.GetPrjFilesByFilter(scope.regionId, { imageType: scope.imageType });
              break;
            default:
              query = $q(function (resolve) {
                resolve({
                  data: {
                    Rows: []
                  }
                });
              });
              break;
          }
          if (query) {
            scope.isLoading = true;
            query.then(
              function (r) {
                //r.data.Rows;
                scope.data = r.data.Rows;
                if (scope.imageType==2 && scope.data.length) {
                  var bid = scope.data[0].GroupId.split('-')[1];
                  if (scope.bid != bid) {
                    scope.bid = bid;
                    api.szgc.ProjectExService.queryById(scope.bid).then(function (response) {
                      var layers = null;;
                      response.data.Rows.forEach(function (mp) {
                        if (mp.AreaRemark) {
                          var geo;
                          try{
                            geo = JSON.parse(mp.AreaRemark);
                          } catch (ex) {
                            return;
                          }
                          var a = mp.ProjectId.split('-'),
                            gx = a[a.length - 1],
                            gxs = [];
                          switch (gx) {
                            case '1':
                              gxs = ['a17156db-da3c-4878-b3de-2a03169f094e', '2dfbde19-52be-43b9-b5d1-d03e2f828c9d', '7ceb4043-d1c6-4454-8546-a2bf6630d887'];
                              break;
                            case '2':
                              gxs = ['953cea5b-b6fb-4eb7-b019-da391f090efd', '2dfbde19-52be-43b9-b5d1-d03e2f828c9d', '7ceb4043-d1c6-4454-8546-a2bf6630d887'];
                              break;
                            case '3':
                              gxs = ['8bfc6626-c5ed-4267-ab8f-cb2294885c25', '2dfbde19-52be-43b9-b5d1-d03e2f828c9d', '7ceb4043-d1c6-4454-8546-a2bf6630d887'];
                              break;
                            case '4':
                              gxs = ['2574a27e-cc0b-41be-a513-98465307fe41', '2dfbde19-52be-43b9-b5d1-d03e2f828c9d', '7ceb4043-d1c6-4454-8546-a2bf6630d887'];
                              break;
                            case '5':
                              gxs = ['abd6a825-91aa-4d34-9426-68d96579c0cf', '65f1cad2-30d1-4f16-864c-2440141c13b7']
                              break;
                          }
                          geo.features.forEach(function (f) {
                            f.gx = gxs.join(',');
                            var fd = scope.data.find(function (row) { return row.GroupId.indexOf(f.options.itemId) != -1; });
                            if (fd != null) {
                              fd.partName = f.options.itemName;
                              fd.gx = f.gx;
                            }
                          });
                          if (!layers)
                            layers = geo;
                          else
                            layers.features = layers.features.concat(geo.features);
                        }
                      });

                      scope.geo = layers;
                    });
                    api.szgc.FilesService.group(scope.bid + '-'+scope.roomType).then(function (response) {
                      var file = null;
                      response.data.Files.forEach(function (mp) {
                        file = mp.Url;
                      });
                      scope.file = file;
                    });
                  }
                }
                filter();
                scope.isLoading = false;

                $timeout(function(){;
                  var m = moment();
                  $('[sxt-year],.monthsscroll').height($($window).height()-56).animate({
                    scrollTop:$('td[data-day="' + m.year() + '-' + (m.month()+1) + '-1"]').position().top-100
                  });

                },500)
              })

          }
        }

        scope.$watch('show', function () {
          if (scope.show) {
            scope.query();
          }
        })
        //element.on('click', ' td.photo', function (e) {
        //    console.log('p', e.target);
        //});

        var pdiv, pday,pdayType, playImage = function (div, day,dayType) {
          if (!div && pdiv) {
            if (pday && pday != '') {
              var m = moment(pday,'YYYY-M-D'),
                mt = m.month() + 1,
                ye = m.year();
              $('[data-day]', pdiv).removeClass('photo');
              scope.months[m.month()].d.forEach(function (d) {
                $('[data-day="' + ye + '-' + mt + '-' + d.day + '"]', pdiv).addClass('photo');
              });
            }
          }
          div = div || pdiv; day = day || pday; dayType = dayType || pdayType;
          pdiv = div; pday = day; pdayType = dayType;
          if (!div) return;
          var el = div.find('.content');
          //$(element).on('touchmove',function(e){
          //  console.log('a')
          //  e.preventDefault();
          //  e.stopPropagation();
          //})
          el.css({
            overflow:'auto',
            height:(div.height()-40)
          });
          if (!day && dayType != 4) {
            el.html('暂无照片');
          }
          else {
            var m = moment(day,'YYYY-M-D'), images = [];
            switch (dayType) {
              case '1':
                var fd = scope.months[m.month()].d.find(function (dy) { return dy.day == m.date(); });
                if (fd) images = fd.images;
                break;
              case '2':
                scope.months[m.month()].d.forEach(function (fd) {
                  images = images.concat(fd.images);
                });
                break;
              case '3':
                scope.months.forEach(function (m) {
                  m.d.forEach(function (d) {
                    images = images.concat(d.images);
                  })
                })
                break;
              default:
                images = scope.allfilter;
                break;
            }
            //var days = scope.months[m.month()].d.find(function (dy) { return dy.day == m.date(); });
           // div.find('.img-title').html((dayType == 1 ? m.format("YYYY年MM月DD日") : dayType == 2 ? m.format("YYYY年MM月") : dayType == 3 ? m.format("YYYY年") : '') + (day ? "(" + images.length + "张)" : ""));
            el.empty();
            if (images.length) {
              var str = ['<div>'];
              images.forEach(function (img, i) {
                str.push('<a href="javascript:void(0)" style="float:left;text-align:center;padding:5px;"><img gid="' + img.GroupId + '" style="height:120px" src="' + sxt.app.api + '/api/Files/thumb/120?path=' + img.Url + '" title="' + (img.partName ? '(' + img.partName + ') ' : '') + img.CreateDate + ' ' + (i + 1) + '/' + images.length + '" class="img-thumbnail" /><p>' + (img.partName ? '(' + img.partName + ') ' : '') + img.CreateDate + ' ' + (i + 1) + '/' + images.length + '</p></a>')
              });
              str.push('<div style="clear:both;display: block;"></div></div><div style="clear:both;display: block;"></div>');
              var o = $(str.join('')).appendTo(el);
              o.find('img').click(function (e) {
                viewImage(scope.imageType == 2 ? $(this).attr('gid') : images, $('img', o).index($(e.target)), div, images);
              }).hover(function () {

              }, function () {

              })
            }
            else {
              el.html('暂无照片');
            }
          }
        };

        var viewImage = function (gid, defaultIndex, div, images) {
          (scope.imageType == 3 ? $q(function (resolve) {
            resolve({
              data: {
                Files: gid
              }
            });
          }) : api.szgc.FilesService.group('sub-' + gid)).then(function (r) {

            var imagedata = r.data.Files;
            imagedata.splice(0, 0, images[defaultIndex]);
            var str = [];
            str.push('<div class="piclayer"><div class="rotate" style="position:absolute;right:20px;top:20px;color:#fff;z-index:100000" class="rotate"><span style="margin-right:5px;font-size:16px;display:inline-block;vertical-align:top;">旋转</span><img width="30" src="assets/leaflet/images/rotate2.png"></div>\
        <div class="outermap" style="width:50%;float:left;background:#ddd; "><div class="innermap"></div><p style="text-align:center;font-size:16px;color:#000;">' + scope.regionName + '</p></div><div class="imagesv" style="width:50%;float:right;"><div class="swiper-container"><div class="swiper-wrapper">')
            angular.forEach(imagedata, function (data) {
              str.push('<div class="swiper-slide"><p><img gid="' + data.GroupId + '" src="' + sxt.app.api + data.Url.substring(1).replace('/s_','/') + '"></p>' + (data.CreateDate ? '<div style="position:absolute;top:20px;left:20px; font-size:20px; color:white;text-shadow:2px 2px 3px #ff0000">日期：' + data.CreateDate + (data.partName ? '(' + data.partName + ')' : '') + (data.Remark ? '<div style="font-size:16px">'+data.Remark+'</div>' : '') + '</div>' : '') + '</div>');
            });
            str.push('</div><div class="swiper-button-prev"></div><div class="swiper-button-next"></div><div class="swiper-pagination"></div></div></div></div>');
            var o = $(str.join('')).appendTo('body')
            //$('body').append(o);

            var iWidth = $(window).width();
            var iHeight = $(window).height();

            var iSh = iHeight;//-150;

            $('.swiper-container',o).width('100%');
            $('.swiper-container', o).height(iSh + 'px');

            $('.swiper-slide', o).height(iSh + 'px');
            $('.swiper-slide p', o).height(iSh + 'px');//.css('line-height',iSh+'px');
            if (scope.imageType == 2) {
              if(iWidth<iHeight){
                $('.outermap',o).css({
                  width:'100%',
                  top:0,
                  height:iHeight*0.4,
                  float:'none'
                })
                $('.imagesv',o).css({
                  width:'100%',
                  top:iHeight *0.4,
                  height:iHeight*0.6,
                  float:'none'
                });
                $('.swiper-container',o).width('100%');
                $('.swiper-container', o).height((iSh*0.6) + 'px');

                $('.swiper-slide', o).height((iSh*0.6) + 'px');
                $('.swiper-slide p', o).height((iSh*0.6) + 'px');//.css('line-height',iSh+'px');
                $ ('.innermap', o).height ((iSh*0.4) + 'px');
                $('.rotate',o).css({
                  top:(iSh*0.4)+10
                });
              }
              else {
                $ ('.innermap', o).height ((iSh - 80) + 'px');
              }
              map = L.map($('.innermap', o)[0], {
                crs: L.extend({}, L.CRS, {
                  projection: L.Projection.LonLat,
                  transformation: new L.Transformation(1, 0, 1, 0),
                  scale: function (e) {
                    return 256 * Math.pow(2, e);
                  }
                }),
                center: [.48531902026005, .5],
                zoom: 0,
                minZoom: 0,
                maxZoom: 3,
                scrollWheelZoom: true,
                annotationBar: false,
                attributionControl: false
              });

              //layer = L.tileLayer(sxt.app.api + '/api/file/load?x={x}&y={y}&z={z}', {
              L.tileLayer(sxt.app.api + '/api/picMap/load/{z}_{x}_{y}.png?size=256&path=' + scope.file.replace('/s_', '/'), {
                noWrap: true,
                continuousWorld: false,
                tileSize: 256
              }).addTo(map);
            }
            else {
              $('.outermap', o).remove();
              $('.imagesv').width('100%');
            }
            var preview = new Swiper(o.find('.swiper-container')[0], {
              initialSlide: scope.imageType == 3?defaultIndex:0,
              pagination: '.swiper-pagination',
              paginationClickable: true,
              nextButton: '.swiper-button-next',
              prevButton: '.swiper-button-prev',
              onInit: function (swiper) {
                if (map) {
                  var gid = $('.swiper-container img', o).eq(swiper.activeIndex).attr('gid');
                  if (curlay) {
                    map.removeLayer(curlay);
                  }
                  var geo = scope.geo.features.find(function (f) {
                    return gid.indexOf(f.options.itemId) != -1;
                  });
                  if (geo) {
                    curlay = L.GeoJSON.geometryToLayer(geo, geo.options.pointToLayer, geo.options.coordsToLatLng, geo.options);
                    if (curlay) {
                      map.addLayer(curlay);
                    }
                  }
                }
              },
              onSlideChangeEnd: function (swiper) {
                if (map) {
                  var gid = $('.swiper-container img', o).eq(swiper.activeIndex).attr('gid');
                  if (curlay) {
                    map.removeLayer(curlay);
                  }
                  var geo = scope.geo.features.find(function (f) {
                    return gid.indexOf(f.options.itemId) != -1;
                  });
                  if (geo) {
                    curlay = L.GeoJSON.geometryToLayer(geo, geo.options.pointToLayer, geo.options.coordsToLatLng, geo.options);
                    if (curlay) {
                      map.addLayer(curlay);
                    }
                  }
                }
              }
            });



            o.find('.pic_close button').click(function () {
              //preview.destroy();
              //o.remove();
            })
            var i = 0;
            $(o.find('.rotate')).on('click', function (e) {
              i++;
              var deg = 90 * i;
              $(o.find('.swiper-slide-active img')).css({ '-webkit-transform': 'rotate(' + deg + 'deg)', '-moz-transform': 'rotate(' + deg + 'deg)', '-o-transform': 'rotate(' + deg + 'deg)', '-ms-transform': 'rotate(' + deg + 'deg)', 'transform': 'rotate(' + deg + 'deg)' });
              if (i > 3) {
                i = 0;
              }
              e.preventDefault();
            })
            //$('.picplayer').is(':visible')
            //if ($(o).css('display')) {
            $(o.find('.swiper-container')[0]).not('.rotate').click(function (e) {
              if ($(e.target).hasClass('swiper-button-next') || $(e.target).hasClass('swiper-button-prev')) return;

              preview.destroy();
              o.remove();
              map.remove();
              e.preventDefault();
              preview = o = null;
              $('.piclayer').remove();
            })
            //}
          });
        }
        element.find('button.yearlabel').click(function (e) {
          var iWrapHeight = element.height();
          if(element.find('.year-wrap')) element.find('.year-wrap').remove();
          $(this).blur();
          var div = $('<div style="background:white" class="year-wrap"><div class="btn-toolbar" style="padding:20px 10px" role="toolbar"><div class="btn-group img-title" style="line-height:40px;font-weight:bold; "></div><div class="btn-group pull-right btn-group-xs" role="group"> </div></div><div class="content">正在加载……</div></div>');
          div.appendTo(element);

          div.css({
            position:'relative', //'absolute',
            top: 0,
            left: 0,
            width: 0,
            height: 0
          }).appendTo(element).animate({
            width: element.width(),
            height: iWrapHeight,//element.height(),
            margin: 0
          }, function () {
            $('.months').hide();
            div.find('.btn-toolbar button.btn-close').click(function () {
              div.empty();
              div.animate({
                width: 0,
                height: 0
              }, function () {
                pdiv = pdayType = pday = null;
                div.remove();
              });
            });
            playImage(div, $(e.target).attr('data-day')||'',$(e.target).attr('data-day')? '3':'4');
          });

        });
        element.on('click', ' div.months div.calendar-table', function (e) {
          console.log('a',element.find('.yearlabel'))
          $('.allbtn').css('display','none');
          var self = $(this), n = self.clone(), offset = self.position(), target = e.target;
          var inHeight = $(window).height()- 100;
          //if (!$(target).hasClass('photo')) return;
          $('.months').hide();
          //console.log('ele',self.height(),$('.content>div').height())
          $('table',n).hide();
          n.addClass('hmonth');
          n.css({
            position:'relative', //'absolute',
            left: offset.left,
            width: self.width(),
            height: inHeight//self.height()
          }).appendTo(element).animate({
            width: element.width(),
            height:element.height(),
            left: 0,
            top:element.scrollTop(),
            margin:0
          }, function () {
            var table = $('table',n), div = $('<div style="display:none"><div class="btn-toolbar" style="padding:20px 10px;" role="toolbar"><div class="btn-group img-title" style="line-height:40px;font-weight:bold;"></div><div class="btn-group pull-right btn-group-xs" role="group"> </div></div><div class="content">正在加载……</div></div>');
            div.appendTo(n);
            //table.css({ float: 'left' });

            div.width(n.width()).fadeIn(function () {
              playImage(n, $(target).attr('data-day'), $(target).attr('data-type')||'1');
            });
            div.find('.btn-toolbar button.btn-close').click(function () {
              div.hide();
              $(lement.find('.allbtn')).css('display','block');
              $('.months').show();
              n.animate({
                top: offset.top,
                left: offset.left,
                width: self.width(),
                height: self.height()
              }, function () {
                pdiv = pdayType = pday = null;
                n.remove();
              });
            });
            n.on('click', ' [data-day]', function (e) {
              playImage(div, $(e.target).attr('data-day'), $(e.target).attr('data-type')||'1');
            })

          });
        })
        element.on('click', ' button.btn_closeyear', function (e) {
          //$('.months').show();
          scope.show = false;
          scope.$apply();
        });
      }
    };
  }
})();

/**
 * Created by zhangzhaoyong on 16/1/28.
 */
(function ()
{
  'use strict';

  sxtSelectJdDirective.$inject = ["$rootScope", "$timeout"];
  angular
    .module('app.szgc')
    .directive('sxtSelectJd', sxtSelectJdDirective);

  /** @ngInject */
  function sxtSelectJdDirective($rootScope,$timeout)
  {
    var joinArr = function (arr) {
      var n = [];
      arr.forEach(function (a) {
        n.push(a[0]);
      })
      return n.join('');
    }
    var newSt = function (index, idField, nameField, items, label, selected) {
      var nt = [], letters = [], filters = [];
      letters.push({ $id: '', selected: true, $name: '所有' });
      items.forEach(function (item) {
        var n = typeof item == 'object' ? item : { $id: item, $name: item };
        item.$id = item[idField];
        item.$name = item[nameField];
        item.$letter = joinArr(Pinyin.getPinyinArrayFirst(item.$name));
        item.$lf = item.$letter.substring(0, 1).toUpperCase();
        var fl = item.$lf;
        if (!letters.find(function (f) { return f.$name == fl; }))
          letters.push({ $id: fl, $name: fl, selected: false });
      });
      letters.sort(function (s1, s2) {
        return s1.$id.localeCompare(s2.$id);
      });
      var filter = function (lt) {
        letters.forEach(function (it) {
          it.selected = false;
        });
        lt.selected = true;
        filters.length = 0;
        items.forEach(function (item) {
          if (lt.$id == '' || item.$lf == lt.$id) {
            filters.push(item);
          }
        });
      }
      filter(letters[0]);
      return {
        label: label,
        index: index,
        letters: letters,
        items: items,
        filters: filters,
        filter: filter,
        extend: false,
        more: false,
        selected: selected,
        toggleExtend: function () {
          this.extend = !this.extend;
        },
        toggleMore: function () {
          this.more = !this.more;
        }
      }
    }
    return {
      transclude: true,
      scope: {
        value: '=ngModel',
        valueName: '=',
        idTree: '=',
        nameTree: '=',
        onQuery: '=',
        onChange: '=',
        isMore: '=',
        objectScope:'=',
        cache: '@'
      },
      templateUrl: 'app/main/szgc/directives/sxt-projects-jd-app.html',
      link: function (scope, element, attr, ctrl) {
        scope.selectors = [];
        scope.isMore = true;
        scope.resetUI = function(){
          $('md-list-item',element).css('display','inline');
          $timeout(function(){
            $('md-list-item',element).css('display','flex');
          },100);
        }
        var syncValue = function () {
          if (!scope.selectors.length || !scope.selectors[0].selected) {
            scope.value =
              scope.idTree =
                scope.nameTree = null;
          }
          else {
            var i = 0, c = scope.selectors[i], idTree = [], nameTree = [];
            while (c) {
              if (!c.selected) break;
              idTree.push(c.selected.$id);
              nameTree.push(c.selected.$name);
              scope.value = c.selected.$id;
              scope.valueName = c.selected.$name;
              if(scope.objectScope)
                scope.objectScope.item = c.selected;
              c = scope.selectors[++i];

            }
            scope.idTree = idTree.join('>');
            scope.nameTree = nameTree.join('>');
          }
          scope.onChange && scope.onChange(scope);
          if(!$rootScope.$$phase){
            scope.$apply();
            scope.resetUI();
          }
        }
        if(scope.objectScope){
          scope.objectScope.backJdSelect = function(){
            if(scope.selectors.length){
              scope.item_clear(scope.selectors.length-2);
            }
          }
          scope.objectScope.isJdBack = function(){
            return scope.selectors.length && scope.selectors[0].selected;
          }
        }
        scope.toggleMore = function () {
          scope.isMore = !scope.isMore;
        }
        scope.isShow = function (item) {
          return !item.selected && (scope.isMore || item.index < 2);
        }
        scope.item_clear = function (index) {
          scope.selectors.splice(index + 1, scope.selectors.length);
          scope.selectors[index].selected = null;
          syncValue();
          var q = scope.onQuery(index, newSt, scope.selectors.length > 1 ? scope.selectors[index - 1].selected.$id : null,scope);
          if (q) {
            scope.selectors[index] = {
              label:'正在加载',
              items:[{$name:'正在加载'}],
              loading:true
            };
            q.then(function (result) {
              var next = result;
              scope.selectors[index] = next;
              if(!$rootScope.$$phase){
                scope.$apply();
                scope.resetUI();
              }
            });
          }
        };
        scope.item_selected = function (item, index, noSync) {
          if(!item)return;
          if(index==0){
            $rootScope.title = item.$name;
          }
          var cnt = scope.selectors[index];
          cnt.selected = item;
          var next = scope.selectors[index + 1];
          if (noSync !== false)
            syncValue();

          var q = scope.onQuery(index + 1, newSt, item.$id,scope);
          if (q) {
            scope.selectors[index+1] = {
              label:'正在加载',
              items:[{$name:'正在加载'}],
              loading:true
            };
            q.then(function (result) {
              var next = result;
              scope.selectors[index + 1] = next;

              if (result.selected)
                scope.item_selected(result.selected, scope.selectors.length - 1, false);
              else if (noSync === false)
                syncValue();

              if(!$rootScope.$$phase){
                scope.$apply();
                scope.resetUI();
              }
            });
          }
          else{
            syncValue();
            if(!$rootScope.$$phase){
              scope.$apply();
              scope.resetUI();
            }
          }
        }
        scope.querySearch = function(array, text) {
          var k = [];
          if (array) {
            array.forEach(function (item) {
              if (!text || text == '' || item.$name.indexOf(text) != -1 || item.$letter.indexOf(text) != -1) {
                k.push(item);
              }
            })
          }
          return k;
        }
        scope.onQuery(0, newSt, scope.value,scope).then(function (result) {
          scope.selectors.push(result);
          if (result.selected)
            scope.item_selected(result.selected, scope.selectors.length - 1, false);
          if(!$rootScope.$$phase){
            scope.$apply();
            scope.resetUI();
          }
        });
      }
    }
  }
})();

/**
 * Created by zhangzhaoyong on 16/1/29.
 */
(function () {
  'use strict';

  angular
    .module('app.szgc')
    .directive('sxtSelect', sxtSelectDirective);

  /** @ngInject */
  function sxtSelectDirective(){
    var joinArr = function (arr) {
      var n = [];
      arr.forEach(function (a) {
        n.push(a[0]);
      })
      return n.join('');
    }
    return {
      require:'ngModel',
      scope: {
        value: '=ngModel',
        nameValue: '=',
        objValue:'=',
        sources: '=',
        valueField: '@',
        textField: '@',
        change: '&ngChange',
        disabled: '=ngDisabled'
      },
      template: '\
      <md-select  ng-model="data.selected" >\
      <md-option ng-repeat="item in data.sources" ng-value="item">{{item.text}}</md-option>\
      </md-select>',
      link: function (scope, element, attrs, ngModel) {
        var setIng = false;
        scope.data = {};
        var resetValue = function (value) {
          if(!value)return;
          if (scope.valueField && scope.data.selected && scope.data.selected[scope.valueField] == scope.value) return;

          if (scope.value && scope.data.sources) {

            var fd = scope.data.sources.find(function (item) {
              return item[scope.valueField]==scope.value;
            });
            if (fd != scope.data.selected) {
              setIng = !!value;
              scope.data.selected = fd;
            }
            scope.value = scope.data.selected ? scope.data.selected[scope.valueField] : value || null;
            scope.nameValue = scope.data.selected ? scope.data.selected[scope.textField] : scope.objValue? null:scope.nameValue;
            scope.objValue = scope.data.selected;
          }
          else if (scope.data.selected) {
            setIng = !!value;
            scope.data.selected = null;
            scope.nameValue = null;
            scope.objValue = null;
            if (!value)
              ngModel.$setViewValue();
          }

        }

        scope.$watch('value', function () {
          resetValue(scope.value);
        });

        scope.$watchCollection('sources', function () {
          if (!scope.sources) return;


          if (scope.data.selected) {
            setIng = true;
            scope.data.selected = null;
            scope.data.sources = null;
          }
          scope.data.sources = [];
          scope.sources.forEach(function (item) {
            if (typeof item == 'object') {
              item.text = item[scope.textField];
            }
            else {
              scope.valueField = 'value';
              scope.textField = 'text';
              item = { text: '' + item, value: item };
            }
            item.pinyin = joinArr(Pinyin.getPinyinArrayFirst(item.text));
            scope.data.sources.push(item);
          });

          resetValue(scope.value);

        });
        scope.$watch('data.selected', function () {
          if(!scope.data.selected)return;
          if (!setIng && scope.sources) {
            var value = scope.data.selected ? scope.data.selected[scope.valueField] : null;
            scope.nameValue = scope.data.selected ? scope.data.selected[scope.textField] : null;
            scope.objValue = scope.data.selected;
            ngModel.$setViewValue(value);
          }
          setIng = false;
        });
      }
    }
  }
})();

/**
 * Created by zhangzhaoyong on 16/1/28.
 */
(function ()
{
  'use strict';

  sxtProjectsJdDirective.$inject = ["$timeout", "api", "$q", "appCookie"];
  angular
    .module('app.szgc')
    .directive('sxtProjectsJd', sxtProjectsJdDirective);

  /** @ngInject */
  function sxtProjectsJdDirective($timeout, api,  $q,appCookie)
  {
    var $cookies = appCookie;
    var cookieName = 'projects';
    return {
      transclude: true,
      scope: {
        value: '=ngModel',
        regionType: '=',
        regionName: '=',
        projectId: '=',
        projectName: '=',
        idTree: '=',
        nameTree: '=',
        onQuery: '=',
        onQueryed: '=',
        isMore: '=',
        levels:'@',
        objectScope:'='
      },
      template: '<sxt-select-jd  ng-model="value" is-more="isMore" object-scope="objectScope" value-name="regionName" id-tree="idTree" name-tree="nameTree" on-query="onQueryInner" on-change="onChanged" ><div ng-transclude></div></sxt-select-jd>',
      link: function (scope, element, attr, ctrl) {
        scope.onChanged = function (p) {
          if (!p.selectors.length || !p.selectors[0].selected) {
            scope.regionType =
              scope.regionName =
                scope.projectId =
                  scope.projectName = null;
            $cookies.remove(cookieName)
          }
          else {
            var i = 0, c = p.selectors[i], ck = [];
            while (c) {
              if (!c.selected) break;
              if (i == 0) {
                scope.projectId = c.selected.$id;
                scope.projectName = c.selected.$name;
              }
              switch (i) {
                case 0: scope.regionType = 1; break;
                case 1: scope.regionType = 2; break;
                case 2: scope.regionType = 8; break;
                case 3: scope.regionType = 32; break;
                case 4: scope.regionType = 64; break;
              }
              ck.push(c.selected);
              c = p.selectors[++i];
              //console.log('scope.regionType',scope.regionType)
            }
            $cookies.put(cookieName, JSON.stringify(ck));
          }
          if (p.selectors.length)
            scope.onQueryed && scope.onQueryed(p.selectors[p.selectors.length - 1]);
        }
        var init = true, cookie = $cookies.get(cookieName);
        try {
          cookie = cookie ? JSON.parse(cookie) : null;
        } catch (e) { }
        //console.log('getcookie',cookie);


        scope.onQueryInner = function (index, st, value,innerScope) {
          if (scope.levels && scope.levels <= index) {
            init = false;
            innerScope && scope.onChanged(innerScope);
            return
          };
          switch (index) {
            case 0:

              if (init && cookie && cookie[index]) {
                return $q(function (r) { r(new st(index, 'project_id', 'name', [cookie[index]], '项目', cookie[index])) });
              }
              else {
                init = false;
                innerScope && scope.onChanged(innerScope);
                return api.szgc.vanke.projects({ page_size: 1000, page_number: 1 }).then(function (result) {
                  var s = new st(index, 'project_id', 'name', result.data.data, '项目');
                  scope.onQueryed && scope.onQueryed(s);
                  return s;
                });
              }
              break;
            case 1:
              if (init && cookie && cookie[index]) {
                return $q(function (r) { r(new st(index, 'project_item_id', 'name', [cookie[index]], '分期', cookie[index])) });
              }
              else {
                init = false;
                innerScope && scope.onChanged(innerScope);
                return api.szgc.vanke.project_items({ page_number: 1, page_size: 1000, project_id: value }).then(function (result) {
                  var s = new st(index, 'project_item_id', 'name', result.data.data, '分期');
                  scope.onQueryed && scope.onQueryed(s);
                  return s;
                });
              }
              break;
            case 2:

              if (init && cookie && cookie[index]) {
                return $q(function (r) { r(new st(index, 'building_id', 'name', [cookie[index]], '楼栋', cookie[index])) });
              }
              else {
                init = false;
                innerScope && scope.onChanged(innerScope);
                return api.szgc.vanke.buildings({ page_number: 1, page_size: 10000, project_item_id: value }).then(function (result) {
                  //scope.onQueryed && scope.onQueryed(result.data);
                  var s = new st(index, 'building_id', 'name', result.data.data, '楼栋');
                  scope.onQueryed && scope.onQueryed(s);
                  return s;
                });
              }
              break;
            case 3:

              if (init && cookie && cookie[index]) {
                return $q(function (r) { r(new st(index, 'floor_id', 'name', [cookie[index]], '楼层', cookie[index])) });
              }
              else {
                init = false;
                innerScope && scope.onChanged(innerScope);
                return api.szgc.vanke.floors(value).then(function (result) {
                  scope.onQueryed && scope.onQueryed(result.data);
                  var data = [];
                  result.data.data.forEach(function (item) {
                    if (item == '')
                      return;
                    data.push({ 'floor_id': value + '-' + item, name: item + '层' });
                  });
                  var s = new st(index, 'floor_id', 'name', data, '楼层');
                  scope.onQueryed && scope.onQueryed(s);
                  return s;
                });
              }
              break;
            case 4:
              if (init && cookie && cookie[index]) {
                return $q(function (r) { r(new st(index, 'room_id', 'name', [cookie[index]], '户', cookie[index])) });
              }
              else {
                init = false;
                innerScope && scope.onChanged(innerScope);
                return api.szgc.vanke.rooms({ page_number: 1, page_size: 1000, building_id: value.split('-')[0], floor: value.split('-')[1] }).then(function (result) {
                  result.data.data.forEach(function (r) {
                    if (r.unit) {
                      r.name = r.unit + '-' + r.name;
                    }
                  });
                  var s = new st(index, 'room_id', 'name', result.data.data, '户');
                  scope.onQueryed && scope.onQueryed(s);
                  return s;
                });
              }
              break;
            default:
              init = false;
              innerScope && scope.onChanged(innerScope);
              return scope.onChange ? scope.onQuery(index, st, value) : null;
          }
        }


      }
    }
  }
})();

/**
 * Created by zhangzhaoyong on 16/1/29.
 */
(function(){
  'use strict';

  sxtProcedureTypeDirective.$inject = ["api"];
  angular
    .module('app.szgc')
    .directive('sxtProcedureType',sxtProcedureTypeDirective)

  /** @ngInject */
  function sxtProcedureTypeDirective(api){

    var joinArr = function (arr) {
      var n = [];
      arr.forEach(function (a) {
        n.push(a[0]);
      })
      return n.join('');
    }
    return {
      scope: {
        value: '=ngModel',
        nameValue: '=',
        objValue: '=',
        change: '&ngChange',
        disabled: '=ngDisabled'
      },
      template: '<md-select ng-model="data.selected">\
      <md-option>全部</md-option>\
      <md-optgroup ng-repeat="gn in data.sources" label="{{gn.name}}">\
      <md-option ng-repeat="item in gn.children" ng-value="item" >{{item.name}}</md-option>\
      </md-optgroup>\
      </md-select>',
      link: function (scope, element, attrs) {
        scope.data = {};
        scope.valueField = 'id';
        scope.textField = 'text';
        scope.gp = function (item) {
          return item.gp;
        }
        var resetValue = function () {
          if (scope.valueField && scope.data.selected && scope.data.selected[scope.valueField] == scope.value) return;
          if (scope.value && scope.data.sources) {

            scope.data.selected = scope.data.sources.find(function (item) {
              return item[scope.valueField] == scope.value;
            });
            scope.value = scope.data.selected ? scope.data.selected[scope.valueField] : null;
            scope.nameValue = scope.data.selected ? scope.data.selected.gp + ' > ' + scope.data.selected[scope.textField] : null;
            scope.objValue = scope.data.selected;
          }
          else if (scope.data.selected) {
            scope.data.selected = null;
            scope.nameValue = null;
            scope.objValue = null;
          }
        }
        scope.$watch('value', function () {
          resetValue();
        });
        scope.$watchCollection('sources', function () {
          if (scope.data.selected) {
            scope.data.selected = null;
            scope.data.sources = null;
          }
          if (scope.sources && scope.sources.length) {
            scope.data.sources = [];
            scope.sources.forEach(function (item) {
              if (typeof item == 'object') {
                item.text = item[scope.textField];
              }
              else {
                scope.valueField = 'value';
                scope.textField = 'text';
                item = { text: '' + item, value: item };
              }
              item.pinyin = joinArr(Pinyin.getPinyinArrayFirst(item.text));
              scope.data.sources.push(item);
            });
          }
          else {

          }
          //console.log(scope.data.sources);
          resetValue();
        });
        scope.$watch('data.selected', function () {
          scope.value = scope.data.selected ? scope.data.selected[scope.valueField] : null;
          scope.nameValue = scope.data.selected ? scope.data.selected.gp + ' > ' + scope.data.selected[scope.textField] : null;
          scope.objValue = scope.data.selected;
        });
        api.szgc.vanke.skills({ page_number: 1, page_size: 0 }).then(function (result) {
          var s = [];
          result.data.data.forEach(function (item) {
            var gn = s.find(function(g){return (item.parent ? item.parent.name : '')== g.name;});
            if(!gn){
              gn = {
                name:item.parent ? item.parent.name : '',
                children:[]
              };
              s.push(gn);
            }
            gn.children.push(item);
          });
          scope.sources = s;
        });
      }
    }
  }
})();

/**
 * Created by zhangzhaoyong on 16/2/18.
 */
(function(){
  'use strict';

  sxtProcedure.$inject = ["api"];
  angular
    .module('app.szgc')
    .directive('sxtProcedure',sxtProcedure)
    .directive('sxtProcedureTb',sxtProcedureTb)
    .filter('sxtProcedureS',sxtProcedureS)

  /** @ngInject */
  function sxtProcedure(api){
    return {
      require:'ngModel',
      scope:{
        procedureTypeId: '=',
        regionType:'=',
        value:'=ngModel',
        nameValue:'=',
        inc :'@'
      },
      template:'<div layout="row">' +
      '<md-input-container flex md-no-float class="md-block"><label>可选工序({{Plength}})</label><input  ng-model="nameValue" readonly></md-input-container>'+
        '<md-menu flex="none">\
      <md-button aria-label="Open  menu" class="md-icon-button" ng-click="$mdOpenMenu($event)">\
      <md-icon md-menu-origin  md-font-icon="icon-arrow-down"></md-icon>\
      </md-button>\
      <md-menu-content width="6" >\
     <md-tabs md-border-bottom >\
      <md-tab ng-repeat="g in types|sxtProcedureS">\
      <md-tab-label><span sxt-procedure-tb>{{g.name}}({{g.ps.length}})</span></md-tab-label>\
      <md-tab-body>\
      <md-content>\
      <section ng-repeat="c in g.children|sxtProcedureS">\
      <md-subheader class="md-primary">{{c.name}}({{c.ps.length}})</md-subheader>\
      <md-list style="padding:0;" class="newheight">\
      <md-list-item ng-click="sett(p)" ng-repeat="p in c.ps"  style="padding:0;">\
      {{p.ProcedureName}}\
      </md-list-item>\
      </md-list>\
      </section>\
      </md-content>\
     </md-tab-body>\
      </md-tab>\
      </md-tabs>\
    </md-menu-content>\
    </md-menu>'+
        '</div>',
      link:link
    };

    function link(scope,element,attrs,ctrl){

      scope.sett = function(p){
        scope.procedureTypeId = p.ProcedureTypeId;
        scope.value = p.ProcedureId;
        scope.nameValue = p.ProcedureName;
        ctrl.$setViewValue(scope.value);
      }
      scope.Plength = 0;

      api.szgc.vanke.skills({ page_number: 1, page_size: 0 }).then(function (result) {
        var s = [];
        result.data.data.forEach(function (item) {
          if(!item.parent)return;
          var gn = s.find(function(g){return item.parent.name== g.name});
          if(!gn){
            gn = {
              name:item.parent.name,
              children:[]
            };
            s.push(gn);
          }
          gn.children.push(item);
        });
        scope.types = s;
        resetSources();
      });
      scope.$watch('regionType',function(){
        scope.value = null;
        scope.nameValue = null;
        ctrl.$setViewValue();
        if(!scope.regionType && !scope.inc)return;
        var t = 1,ex=[1],q={
          status:4
        };

        switch (scope.regionType) {
          case 1:
            t = 2;
            ex = ex.concat([2,8,32,64]);
            break;
          case 2:
            t = 8;
            ex = ex.concat([ 8,32,64])
            break;
          case 8:
            t = 32;
            ex = ex.concat([32,64])
            break;
          case 32:
            t = 64;
            ex = ex.concat([64])
            break;
          default:
            ex = ex.concat([2, 8, 32, 64]);
            break;
        }

        if (scope.inc) {
          t = 0;
/*          q.isGetChilde=1;
          q.batchTypeList = ex.join(',');
          //q = '&isGetChilde=1&batchTypeList='+ex.join(',')*/
          ex.forEach(function (t1) {
            t = t | t1;
          })
        }
        q.batchType = t;

        api.szgc.BatchSetService.getAll(q).then(function(result) {
          var data = [];
          result.data.Rows.forEach(function(item) {
              data.push(item);
          });
          scope.procedures = data;
          scope.Plength = scope.procedures.length;
          resetSources();
        });

      });

      function resetSources(){
        if(scope.types && scope.procedures){
          scope.types.forEach(function(g){
            g.ps = [];
            g.children.forEach(function(c){
              c.ps = [];
              scope.procedures.forEach(function(p){
                if(p.ProcedureTypeId == c.skill_id){
                  c.ps.push(p);
                  g.ps.push(p);
                }
              })
            });
          });
        }
      }
    }
  }

  function sxtProcedureTb(){
    return {
      link:function(scope,element,attrs,ctrl){
        element.parent().attr('md-prevent-menu-close','md-prevent-menu-close');
      }
    }
  }

  function sxtProcedureS(){
    return function (s){
      if(!s)return s;
      var n = [];
      s.forEach(function(a){
        if(a.ps && a.ps.length){
          n.push(a)
        }
      });
      return n;
    }
  }
})();

/**
 * Created by zhangzhaoyong on 16/2/16.
 */
(function(){
  'use strict';

  sxtPicMap.$inject = ["$timeout", "sxt"];
  angular
    .module('app.szgc')
    .directive('sxtPicMap',sxtPicMap);

  /** @ngInject */
  function sxtPicMap($timeout,sxt){
    return {
      scope:{
        picUrl:'@'
      },
      link:link
    }

    function link(scope,element,attr,ctrl){

      $timeout(function(){
        console.log('picUrl',scope.picUrl)
        //var crs = ;

        var map = L.map(element[0],{
          crs:L.extend({}, L.CRS, {
            projection    :L.Projection.LonLat,
            transformation:new L.Transformation(1, 0, 1, 0),
            scale         :function(e) {
              return 256 * Math.pow(2, e);
            }
          }),
          center:[.48531902026005, .5],
          zoom:0,
          minZoom:0,
          maxZoom:3,
          scrollWheelZoom:true,
          annotationBar:false,
          attributionControl:false
        }),
          //layer = L.tileLayer(sxt.app.api + '/api/file/load?x={x}&y={y}&z={z}', {
          layer = L.tileLayer('http://vkde.sxtsoft.com/api/picMap/load/{z}_{x}_{y}.png?size=256&path='+scope.picUrl, {
            noWrap:true,
            continuousWorld:false,
            tileSize:256
          });

        layer.addTo(map);

      },1000)
    }
  }
})();

/**
 * Created by emma on 2016/5/25.
 */
(function(){
  'use strict';
  sxtNumberListItem.$inject = ["utils"];
  angular
    .module('app.szgc')
    .directive('sxtNumberListItem',sxtNumberListItem);

  /** @ngInject */
  function sxtNumberListItem(utils){
    function ybIsOkRow (item,value) {

      var zdpc = value;
      //var pattern = /^[0-9]+([.]\d{1,2})?$/;
      //if (zdpc) {
      //    if (!pattern.test(zdpc)) {
      //        item.isOK = false;
      //        return false;
      //    }
      //}
      zdpc = parseFloat(zdpc);
      var hgl = parseFloat(item.PassRatio),
        pc = item.DeviationLimit,
        op = pc.substring(0, 1),
        abs;
      if (isNaN(zdpc)) {
        return ;
      }
      var isIn = pc.match(/(-?[\d.])+/g); //(\.\d{2})?：

      // console.log("isIn", isIn);
      if (isIn && isIn.length > 0) {
        var min = 0,
          max = parseFloat(isIn[0]);

        if (isIn && isIn.length > 1) {
          min = parseFloat(isIn[1]);
          if (max < min) {
            max = min;
            min = parseFloat(isIn[0]);
          }
        }
        if (max < min) {
          var t11 = max;
          max = min;
          min = t11;
        }
        //abs = zdpc<min?max-zdpc:zdpc>max?zdpc-min:zdpc-min;
        abs = zdpc<min?max-zdpc:zdpc>max?zdpc-min:zdpc-min>max-zdpc?zdpc-min:max-zdpc;
        if (op == '±') {
          min = -max;
          abs = Math.abs(zdpc);
        } else if (op == '+') {
          min = 0;
          abs = Math.max( Math.abs(0-zdpc),zdpc);
        } else if (op == '-') {
          max = -max;
          abs = Math.max( Math.abs(0-zdpc),zdpc);
        } else if (op == '≥') {
          min = max;
          max = 10000000;
          abs = zdpc;
        } else if (op == '＞') {
          min = utils.math.sum(max, 0.1);
          max = 10000000;
          abs = zdpc;
        } else if (op == '≤') {
          min = -10000000;
          abs = 0 - zdpc;
        } else if (op == '＜') {
          max = utils.math.sub(max, 0.1);
          min = -10000000;
          abs = 0 - zdpc;
        }
        //if (abs < min || zdpc > max) {
        //  return {
        //    result:false,
        //    zdpc:abs
        //  };
        //}
        var max1 = max,min1=min;
        max1 = utils.math.mul(max, 1.5);
        if (min > 0)
          min1 = utils.math.mul(min, 0.5);
        else
          min1 = utils.math.mul(min, 1.5);
        //console.log(min, max, zdpc)
        if (zdpc < min1 || zdpc > max1) {
          return {
            result:false,
            allResult:false,
            zdpc:zdpc
          };
        }
        if (zdpc < min || zdpc > max) {
          return {
            result:false,
            zdpc:zdpc
          };
        }

        return {
          result:true,
          zdpc:zdpc
        };
      } else {
        return {
          result:true,
          zdpc:zdpc
        };
      }
    }

    return {
      restrict:'A',
      scope:{
        value:'=ngModel'
      },
      link:function(scope,element,attr,ctrl){


        scope.$watch(function(){
          return element.text()
        },function(){
           var  values = [],hgP= 0,maxpc=-10000,zdpc=null,els =element.find('.point span'), i= 0,l=els.length,isAllResult = true;
          els.each(function(){
            ++i;
            var v = $(this).hasClass('n')?'': parseFloat($(this).text().trim());
            if(v|| v=='0') {
              var result = ybIsOkRow(scope.value,v)
              if(result) {
                if(result.allResult===false){
                  isAllResult =false;
                }
                values.push({
                  isOK : result.result,
                  zdpc: result.zdpc,
                  value:v
                });
              }
              if(i==l){
                $(this).parent().parent().parent().append('<div flex="20" class="flex-20"><div class="point" ><span class="n">'+(values.length+1)+'</span></div></div>');
              }
            }
            else if(i>1&&i<l){
              if(!$(this).parent().hasClass('current')){
                $(this).parent().parent().remove();
                //$(this).parent().parent().parent().find('span').eq(l-1).text(l)
              }

            }


          });
          values.forEach(function(v){
            if(maxpc< v.zdpc){
              zdpc = v.value;
              maxpc = v.zdpc;
            }
            if(v.isOK){
              hgP++;
            }
          });

          scope.value.CheckNum = values.length;
          if(scope.value.CheckNum) {
            scope.value.PassRatio = utils.math.mul(utils.math.div(hgP, scope.value.CheckNum),100).toFixed(2);
            scope.value.isOK = isAllResult===false?false:scope.value.PassRatio>=80;
          }
          scope.value.MaxDeviation = (zdpc||zdpc ==0)?zdpc:null;
          scope.value.points = values;
        })
      }
    }
  }
})();

/**
 * Created by emma on 2016/5/25.
 */
(function(){
  'use strict';
  sxtNumberList.$inject = ["$rootScope"];
  angular
    .module('app.szgc')
    .directive('sxtNumberList',sxtNumberList);

  /** @ngInject */
  function sxtNumberList($rootScope){
    return {
      restrict:'A',
      scope:{
        show:'=',
        value:'=ngModel'
      },
      link:function(scope,element,attr,ctrl){
        element.on('click',' div.point',function(e){
          var idx = element.find('div.point').index($(e.target).parent());
          scope.show = true;
          scope.length = $(element).find('div.point').length;
          scope.$apply();
          pontTo(idx);
        });
        var currentPoint = null;
        function pontTo(index){
          if(currentPoint){
              currentPoint.removeClass('current').addClass('done');
          }
          scope.index = index;

          var p = currentPoint = $('div.point',element).eq(index),span = p.find('span');
          if(span.hasClass('n'))
           span.removeClass('n').empty();
          console.log('p', p.hasClass('point'))
          if(!p){
          }
          else{
            if(p.hasClass('point')){
              currentPoint.addClass('current');
              $rootScope.$emit('keyboard:setvalue',currentPoint.text());
              element.animate({
                scrollTop: element.scrollTop()+ p.offset().top - element.height() + p.height() - element.offset().top
              });
            }
          }
        }
        $rootScope.$on('keyboard:next',function(){
          var datas = $('.datas',element),eq=datas.index($(currentPoint.parents('.datas')[0]))+ 1,curdata =datas.index($(currentPoint.parents('.datas')[0])) ;
          var nextItem = datas.eq(eq);
          if(currentPoint.parent().parent().find('.point').length>1){
            if(currentPoint && ((currentPoint.hasClass('current')))&&  !currentPoint.text().trim()){
              currentPoint.parent().remove();
            }
            var ilen= datas.eq(curdata).find('.point').length;
            datas.eq(curdata).find('.point').eq(ilen-1).find('span').text(ilen)
            //console.log(datas.eq(curdata).find('.point'))
          }else{
            if(currentPoint && ((!currentPoint.hasClass('current')))&&  !currentPoint.text().trim()){
              currentPoint.parent().remove();

            }
          }

          if(eq<datas.length){
            pontTo($('div.point',element).index(nextItem.find('div.point').eq(0)));
          }else{
           // currentPoint.removeClass('current');
            scope.show = false;
          }
        });
        $rootScope.$on('keyboard:nextpoint',function(){
          pontTo(scope.index+1);
        });
        $rootScope.$on('keyboard:value',function($event,value){
          currentPoint && currentPoint.find('span').text(value);
        });
      }
    }
  }
})();

/**
 * Created by emma on 2016/5/24.
 */
(function(){
  'use strict';

  sxtNumInput.$inject = ["$timeout", "$rootScope"];
  angular
    .module('app.szgc')
    .directive('sxtNumInput', sxtNumInput);

  /** @Inject */
  function sxtNumInput($timeout,$rootScope){
    return {
      scope:{
        value:'=ngModel',
        show:'=',
        onNext:'&'
      },
      link:link,
      templateUrl:'app/main/szgc/directives/sxtNumInput.html'
    }

    function link(scope,element,attr,ctrl){
      //console.log('a',scope.value)
      $rootScope.$on('keyboard:setvalue',function(e,v){
        scope.value = v;
      })
      scope.ck = function(cmd,$event){

        var str = (scope.value ||'').toString(),
          num = parseFloat(str);
        if(isNaN(num)){
          num = 0;
        }
        switch (cmd) {
          case 'ok':
            scope.value = isNaN(parseFloat(str))?'':parseFloat(str);
            scope.ok && scope.ok();
            return;
          case -1:
            str = str.length > 0 ? str.substring (0, str.length - 1) : str;
            break;
          case 'ac':
            str = '';
            break;
          case '+-':
            str = (-num) + '';
            break;
          case '%':
            break;
          case '.':
            if (str.indexOf ('.') == -1)
              str += '.';
            break;
          case 'close':
            scope.show = false;
            break;
          case 'next':
            scope.value ='';
            $rootScope.$emit('keyboard:next');
            return;
            break;
          case 'nextpoint':
            scope.value ='';
            $rootScope.$emit('keyboard:nextpoint');
            return;
            break;
          case 'del':
                $rootScope.$emit('keyboard:del');
                return;
          break;
          default:
            str += cmd;
            break;
        }
        $rootScope.$emit('keyboard:value',str);
        scope.value = str;
      }
    }
  }


})();

/**
 * Created by emma on 2016/5/24.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .directive('sxtNumber',sxtNumber);

  /** @ngInject*/
  function sxtNumber(){
    return{
      scope:{
        user:'=ngModel'
      },
      link:link,
      template:'<span ng-click="toggleView($event)" style="display: block;"><input style="border:none;background: transparent;text-align: center;width:50px;" ng-model="user"></span><div class="numberpanel"  style="display: none;" ><sxt-num-input ng-model="user"></sxt-num-input></div>'
    }

    function link(scope,ele,attr,ctl){
     // console.log('b',scope)
      scope.$watch('value',function () {

      });
      scope.toggleView = function(e){
        console.log('e',$(e.target).position())
        $('.ybxm').animate({scrollTop:$(e.target).position().top-100});
        $('.ybxm').css('padding-bottom','250px');
        //$(ele).find('input').focus();
        if($('.numberpanel').is(':hidden')){
          $('.numberpanel').css({'position':'fixed','bottom':0,'left':0,width:'100%','height':'250px','display':'block'})
        }

      }

    }
  }
})();

/**
 * Created by jiuyuong on 2016/7/31.
 */
(function () {
  'use strict';
  sxtMskCharts.$inject = ["api", "$window", "$timeout", "$state"];
  angular
    .module('app.szgc')
    .directive('sxtMskCharts',sxtMskCharts);

  /** @ngInject */
  function sxtMskCharts(api,$window,$timeout,$state) {
    return {
      scope: {
        value: '=sxtMskCharts',
        build:'='
      },
      link: function (scope, element) {
        $timeout(function () {
          var myChart = $window.echarts.init(element[0]);
          scope.$watch('value', function () {
            if (!scope.value) return;
            var bid = scope.value.split('>'),
              legend = [
                  { value: 0, label: '未验收', color: 'rgba(225,225,225,1)' },
                  { value: 1, label: '总包已验', color: 'rgba(44,157,251,1)' },
                  { value: 2, label: '监理已验', color: 'rgba(0,195,213,1)' },
                  { value: 3, label: '监理/总包', color: 'rgba(0,120,210,1)' },
                  { value: 4, label: '监理不合格', color: 'rgba(249,98,78,1)' }
              ],
              gx = [
                { value: 1, label: '橱柜', id: '1c419fcc-24a9-4e38-9132-ce8076051e6a', color: 'rgba(193,35,43,1)' },
                { value: 2, label: '油漆', id: 'a3776dab-9d80-4ced-b229-e6bfc51f7988', color: 'rgba(181,195,52,1)' },
                { value: 3, label: '瓷砖', id: '702d964d-cd97-4217-8038-ce9b62d7584b', color: 'rgba(252,206,16,1)' },
                { value: 4, label: '墙板', id: '8bfc6626-c5ed-4267-ab8f-cb2294885c25', color: 'rgba(193,35,43,1)' },
                { value: 5, label: '门窗', id: '51bb20e2-92a2-4c9f-85a9-c4545e710cf0', color: 'rgba(181,195,52,1)' }
              ], getNumName = function (str) {
                str = str.replace('十', '10')
                  .replace('九', '9')
                  .replace('八', '8')
                  .replace('七', '7')
                  .replace('六', '6')
                  .replace('五', '5')
                  .replace('四', '4')
                  .replace('三', '3')
                  .replace('二', '2')
                  .replace('一', '1')
                  .replace('十一', '11')
                  .replace('十二', '12')
                  .replace('十三', '13')
                  .replace('十四', '14')
                  .replace('十五', '15')
                  .replace('十六', '16')
                  .replace('十七', '17')
                  .replace('十八', '18')
                  .replace('十九', '19')
                  .replace('二十', '20');
                var n = parseInt(/[-]?\d+/.exec(str));
                return n;
              }

            api.szgc.vanke.rooms({ building_id: bid[bid.length - 1] }).then(function (r) {
              var floors = [],
                rooms = [];
              r.data.data.sort(function (i1, i2) {
                var n1 = getNumName(i1.floor),
                  n2 = getNumName(i2.floor),
                  r1 = 0;
                if (!isNaN(n1) && !isNaN(n2))
                  r1 = n1 - n2;
                else if ((isNaN(n1) && !isNaN(n2)))
                  r1 = 1;
                else if ((!isNaN(n1) && isNaN(n2)))
                  r1 = -1;
                else
                  r1 = i1.floor.localeCompare(i2.floor);

                if (r1 != 0) return r1;

                n1 = getNumName(i1.name),
                  n2 = getNumName(i2.name);
                if (!isNaN(n1) && !isNaN(n2))
                  return n1 - n2;
                else if ((isNaN(n1) && !isNaN(n2)))
                  return 1;
                else if ((!isNaN(n1) && isNaN(n2)))
                  return -1;
                else
                  return i1.name.localeCompare(i2.name);

              });
              api.szgc.ProjectExService.building3(scope.value).then(function (r2) {
                var floors = [], maxRooms = 0;
                r.data.data.forEach(function (room) {
                  var fd = floors.find(function (f) {
                    return f.floor === room.floor;
                  });
                  if (!fd) {
                    floors.push({
                      edit: false,
                      floor: room.floor,
                      rooms: [room]
                    });
                  }
                  else {
                    fd.rooms.push(room);
                  }
                });
                floors.forEach(function (f) {
                  if (maxRooms < f.rooms.length)
                    maxRooms = f.rooms.length;
                });
                var x = [], y = [], data = [],
                  _x = 1, _y = 0, _z = 0;
                floors.forEach(function (f) {
                  y.push(f.floor + '层');
                  data.push([0, _y, '-']);
                  _x = 1;
                  gx.forEach(function (gx) {
                    for (var i = 0; i < maxRooms; i++) {
                      var room = f.rooms[i];
                      if (room) {
                        var _z = r2.data.Rows.find(function (row) {
                          return row.ProcedureId == gx.id && row.RegionId == room.room_id;
                        });
                        if (_z)
                          data.push([_x, _y, (_z.ECCheckResult == 1 || _z.ECCheckResult == 3) ? 4 :
                            _z.ZbDate && _z.JLDate ? 3:
                              _z.JLDate? 2:
                                _z.ZbDate?1: 0
                            , _z]);
                        else
                          data.push([_x, _y, 0]);
                      }
                      else {
                        data.push([_x, _y, '-']);
                      }
                      if (_y == 0) x.push(gx.label);
                      _x++;
                    }
                    //if (_y == 0) x.push(String(_x));
                    data.push([_x, _y, '-']);
                    _x++;
                  });
                  _y++;
                });

                var option = {
                  title: false,
                  tooltip: {
                    formatter: function (arg, ticket, callback) {
                      $state.go('app.szgc.project.view',{bathid:arg.value[3].Id});
                      /*var g = gx[parseInt(arg.data[0] / (maxRooms + 1))],
                        f = floors[arg.data[1]],
                        room = f.rooms[arg.data[0] % (maxRooms + 1) - 1];
                      return room.name + ' ' + g.label + ' ' + (arg.value[3] ? '(' + arg.value[3].JLDate + ')' + (
                          arg.value[3].ECCheckResult == 1 ? '初验不合格' :
                            arg.value[3].ECCheckResult == 2 ? '初验合格' :
                              arg.value[3].ECCheckResult == 3 ? '复验不合格' :
                                arg.value[3].ECCheckResult == 4 ? '复验合格' :
                                  ''
                        ) : '未验');*/
                    }
                  },
                  animation: false,
                  grid: {
                    height: '85%',
                    y: '5'
                  },
                  xAxis: {
                    type: 'category',
                    data: x,
                    axisLabel: {
                      interval: function (index, value) {
                        return index % (maxRooms + 1) == 1;
                      },
                      show: true
                    },
                    splitArea: {
                      show: false
                    }
                  },
                  dataZoom: [{
                    type: 'inside'
                  }],
                  yAxis: {
                    type: 'category',
                    data: y,
                    min: 0,
                    max: 50,
                    interval: 1,
                    axisLabel: {
                      textStyle: {
                        fontSize: 8
                      }
                    },
                    splitArea: {
                      show: false
                    }
                  },
                  visualMap: {
                    bottom: 0,
                    right: 0,
                    type: 'piecewise',
                    pieces: legend,//gx.concat([{ value: 0, label: '未验', color: 'rgba(225,225,225,1)' }]),
                    show: true,
                    min: 0,
                    max: 5,
                    calculable: false,
                    itemWidth:5,
                    orient: 'horizontal'
                  },
                  series: [{
                    type: 'heatmap',
                    data: data,
                    label: {
                      normal: {
                        show: false,
                        textStyle:{
                          fontSize:5
                        }
                      }
                    },
                    itemStyle: {
                      normal: {
                        borderWidth: 1,
                        borderColor: 'rgba(255, 255, 255, 1)'
                      },
                      emphasis: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 1)'
                      }
                    }
                  }]
                };

                myChart.setOption(option);
                scope.build.loaded = true;
              });
            });

          });
        },10);

      }
    }
  }

})();

/**
 * Created by jiuyuong on 2016/4/6.
 */
(function(){
  'use strict';
  angular
    .module('app.szgc')
    .directive('sxtMonth',sxtMonth)

  /** @ngInject */
  function sxtMonth() {
    return {
      scope: {
        month: '=sxtMonth'
      },
      link: function (scope, element, attr, ctrl) {
        scope.$watch('month', function () {
          if (!scope.month) return;
          element.html();
          var m = moment(scope.month.m,'YYYY-M-D'),
            mt = m.month(), ye = m.year();
          var html = [];
          //head
          element.addClass('calendar-table');
          //html.push('<div class="calendar-table">');
          html.push('<table class="table-condensed" style="width: 100%;border-bottom:2px solid rgb(101, 101, 101);">');
          html.push('<thead><tr ><th></th><th colspan="5" style="cursor:pointer" data-day="' + m.format('YYYY-MM-1') + '" data-type="2" class="month">');
          html.push(m.format('YYYY年MM月'));
          html.push('</th><th></th></tr>');
          html.push('<tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr></thead>');
          html.push('<tbody>');
          for (var i = 0; i < 6; i++) {
            html.push('<tr>');
            for (var j = 0; j < 7; j++) {

              if (m.day() == j && m.month() == mt) {
                html.push('<td data-day="' + ye + '-' + (mt+1) + '-' + m.date() + '" >');
                html.push('<span data-day="' + ye + '-' + (mt+1) + '-' + m.date() + '" >'+m.date()+'</span>');
                m = m.add(1, 'd');
              }
              else {
                html.push('<td>');
                html.push('&nbsp;');
              }
              html.push('</td>');
            }
            html.push('</tr>');
          }
          html.push('</tbody></table>');
          element.html(html.join(''));
        });
        scope.$watchCollection('month.d', function () {
          if (!scope.month.d) return;
          var m = moment(scope.month.m,'YYYY-M-d'),
            mt = m.month()+1, ye = m.year();
          $('[data-day]',element).removeClass('photo');
          scope.month.d.forEach(function (d) {
            $('[data-day="' + ye + '-' + mt + '-' + d.day + '"]', element).addClass('photo');
          });
        });
      }
    };
  }
})();

/**
 * Created by zhangzhaoyong on 16/2/16.
 */
(function(){
  'use strict';

  sxtMapsDirective.$inject = ["$timeout", "api", "markerCulster"];
  angular
    .module('app.szgc')
    .directive('sxtMaps',sxtMapsDirective);

  /** @ngInject */
  function sxtMapsDirective($timeout,api,markerCulster){
    return {
      scope:{
        markers:'=',
        markerClick:'&'
      },
      link:link
    }

    function  link(scope,element,attr,ctrl){



      $timeout(function () {
        var map = L.map(element[0], {
            center: [22.631026, 114.111701],
            zoom: 10,
            attributionControl: false
          }),
          layer = L.tileLayer('http://mt2.google.cn/vt/lyrs=r&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}', {
            subdomains: "1234"
          });

        layer.addTo(map);
        var mks = [];
        api.szgc.ProjectExService.query(4).then(function (result) {
          api.szgc.vanke.projects().then(function (r2) {
            scope.markers = [];
            result.data.Rows.forEach(function (row) {
              if (row.Latitude && row.Longitude && r2.data.data.find(function (a) { return a.project_id == row.ProjectId; }) != null) {
                scope.markers.push({
                  projectId: row.ProjectId,
                  title: row.ProjectNo,
                  lat: row.Latitude,
                  lng: row.Longitude,
                  pinyin: Pinyin.getPinyinArrayFirst(row.ProjectNo).join(''),
                  center: function () {
                    map.setView(new L.latLng([row.Latitude, row.Longitude]),14)
                  }
                })
              }
            });
            var parentGroup = L.markerClusterGroup();
            angular.forEach(scope.markers, function (o, k) {
              var mk = L
                .marker([o.lat, o.lng], L.extend({
                  icon: L.icon({
                    iconUrl: 'assets/leaflet/images/M.png',
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                  })
                }, o))
                .on('click', markerClick);
              mks.push(mk);
              parentGroup.addLayer(mk);

            });
            parentGroup.addTo(map);
          });

        });
        map.on('zoomend', function (e) {
          var zoom = map.getZoom();
          if (zoom < 10) {
            mks.forEach(function (marker) {
              marker.setIcon(L.icon({
                iconUrl: 'assets/leaflet/images/S1.png',
                iconSize: [18, 18],
                iconAnchor: [9, 9]
              }));
            })
          }
          else if (zoom < 11) {
            mks.forEach(function (marker) {
              marker.setIcon(L.icon({
                iconUrl: 'assets/leaflet/images/S.png',
                iconSize: [24, 24],
                iconAnchor: [12, 12]
              }));
            })
          }
          //else if(zoom>=11 && zoom <=12) {
          //  mks.forEach(function (marker) {
          //    marker.setIcon(L.icon({
          //      iconUrl: 'assets/leaflet/images/M.png',
          //      iconSize: [39, 39],
          //      iconAnchor: [20, 20]
          //    }));
          //  })
          //}
          else {
            mks.forEach(function (marker) {
              marker.setIcon(L.icon({
                iconUrl: 'assets/leaflet/images/M.png',
                iconSize: [24, 24],
                iconAnchor: [12, 12]
              }));
            })
          }
        })
        scope.$on('destroy', function () {
          map.remove();
        })
      }, 1000)

      function markerClick(e){
        //console.log('e.target.options',e.target.options)
        scope.markerClick( {$current : e.target.options,pid: e.target.options.projectId, pname: e.target.options.title});

      }

    }
  }


})();

/**
 * Created by jiuyuong on 2016/5/19.
 */
(function () {
  'use strict';
  sxtImagesYbyd.$inject = ["api"];
  angular
    .module('app.szgc')
    .directive('sxtImagesYbyd',sxtImagesYbyd);
  /** @ngInject */
  function sxtImagesYbyd(api) {
    return {
      restrict: 'E',
      scope: {
        regionId: '=',
        regionTree:'=',
        itemId: '=',
        itemName:'='
      },
      template: '<div class="imageEdit" sxt-image-view is-container="true">\
      <div class="edititem" ng-repeat="item in files" uib-tooltip="{{item.Remark}}">\
      <img style="height:150px;margin:0 5px;" date="{{item.CreateDate +\'-\'+itemName}}" osrc="{{item.Url.substring(1).replace(\'s_\',\'\')}}"  ng-src="{{item.Url|fileurl:150}}" class="img-thumbnail" />\
      </div> <div style="padding:20px" ng-if="files.length==0">\
        暂无照片\
      </div>\
      </div>',
      link: function (scope, element, attr, ctrl) {
        scope.$watch("itemId", function () {
          if (scope.regionId && scope.itemId) {
            var regionId = scope.regionTree.replace(/\>/g,'-').replace('sub-','')+'-'+scope.regionId,
              fs;
            api.szgc.FilesService.group( regionId + '-' + scope.itemId).then(function (r) {
              fs = [].concat(r.data.Files);
              api.szgc.FilesService.group('sub-' + regionId + '-' + scope.itemId).then(function (r) {
                fs = fs.concat(r.data.Files);
                scope.files = fs;
              })
            })

          }
        })
      }
    }
  }
})();

/**
 * Created by zhangzhaoyong on 16/2/15.
 */
(function () {
  'use strict';

  sxtImagesDirective.$inject = ["api", "xhUtils", "sxt", "$cordovaCamera", "$window", "$q"];
  angular
    .module('app.szgc')
    .directive('sxtImages', sxtImagesDirective);

  /** @ngInject */
  function sxtImagesDirective(api, xhUtils,sxt,$cordovaCamera,$window,$q){
    return {
      restrict: 'E',
      require: "?ngModel",
      scope: {
        gid: '=ngModel',
        project: '=',
        edit:'@',
        files: '='
      },
      template: '<div  style="color: red;padding-bottom: 0px;padding-left: 10px;padding-top: 0px;" ng-show="imgOK">上传成功!</div><div  style="color: red;" ng-show="imgFail">上传失败!</div> <div class="imageEdit"><div class="edititem"  ng-repeat="item in files" ><img style="height:150px;;margin:0 5px;" ng-src="{{item.Url|fileurl}}" class="img-thumbnail" /><div class="action"><md-button class="md-fab md-mini"  ng-if="edit"  ng-click="remove($event,item)"><md-icon md-font-icon="icon-delete" ></md-icon></md-button></div></div>\
<div  style="float:left;padding:5px;" ng-if="edit"><div class="file-drop-zone" layout="column" layout-align="space-around center" style="height:140px;margin:0 5px;line-height:140px; padding:5px;border-width:1px;" >\
<md-button ng-click ="inputChange(0)" class="md-raised">照片库</md-button>\
<md-button ng-click ="inputChange(1)" class="md-raised">拍照</md-button>\
        </div>\
</div></div>',
      link: function (scope, element, attrs, ngModel) {
        var gid;
        scope.$watch('gid', function () {
          if (gid && gid == scope.gid) return;
          gid = scope.gid;
          scope.files = [];
          scope.remove = function ($event,item) {
            api.szgc.FilesService.delete(item.Id).then(function () {
              scope.files.splice(scope.files.indexOf(item),1);
              api.uploadTask(function (up) {
                return up._id==item.Id;
              },null)
            });
          }
          scope.inputChange = function(s) {
            $cordovaCamera.getPicture({
              quality: 50,
              destinationType: 0,
              sourceType: s,
              allowEdit: false,
              encodingType: 0,
              saveToPhotoAlbum: true,
              correctOrientation: true
            }).then(function (base64) {
              if (base64) {
                compress("data:image/jpeg;base64," + base64, function (newBase64) {
                  var att = {
                    Id: sxt.uuid(),
                    GroupId: scope.gid,
                    Url: newBase64
                  };
                  api.szgc.FilesService.post(att);
                  var d = new Date();
                  api.uploadTask({
                    _id: att.Id,
                    name: '照片 (' + d.getMonth() + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + ')'
                  });
                  scope.files.push(att);
                })
              }
            }, function (err) {
            });
          }

          api.szgc.FilesService.group(scope.gid || '').then(function (result) {
            var data = result.data;
            if (data.Files) {
              data.Files.forEach(function (att) {
                  scope.files.push(att);
              });
            }
          });
        });
      }
    }

    function compress(base64,callback){
      var image = new Image();
      image.onload = function () {
        var srcWidth,
          srcHeight,
          ctx = $window.document.createElement('canvas');
        if(image.width>600 || image.height>600){
          var rd = 600/Math.max(image.width,image.height);
          srcWidth = image.width*rd;
          srcHeight = image.height*rd;
        }
        else{
          srcWidth = image.width;
          srcHeight = image.height;
        }
        ctx.width = srcWidth;
        ctx.height = srcHeight;
        ctx.getContext("2d").drawImage(image, 0, 0,image.width,image.height,0,0,srcWidth,srcHeight);
        callback(ctx.toDataURL('image/jpeg',1));
      };
      image.src = base64;
    }
  }

})();

/**
 * Created by zhangzhaoyong on 16/2/16.
 */
(function(){
  'use strict';

  sxtImageViewDirective.$inject = ["$rootScope", "api", "$q", "utils", "$timeout"];
  angular
    .module('app.szgc')
    .directive('sxtImageView',sxtImageViewDirective);

  var def;
  /** @ngInject */
  function sxtImageViewDirective($rootScope, api, $q,utils,$timeout) {
    return {
      restrict: 'EA',
      link: link,
      scope:{
        isContainer:'='
      }
    }

    function link(scope, element, attr, ctrl) {
      var viewer, o,player;
      player = function (a, e) {
        $timeout(function(){
          def = false;
        },1000);
        if(def)return;
        def=true;
        if (viewer)
          viewer.destroy();
        if (o)
          o.remove();

        $q(function(resolve) {
          if(!e)
            resolve(null);
          else{
            if(e.images){
              resolve(e);
            }
            else {
              var request = [];
              e.groups.forEach (function (g) {
                request.push (api.szgc.FilesService.group (g));
              });
              $q.all (request).then (function (results) {
                resolve (results);
              });
            }
          }
        }).then(function (results) {
          def = false;
          var defaultIndex = 0;
          var imagedata = null;

          if(results) {
            if(results.images){
              imagedata = results.images;
            }
            else {
              imagedata = [];
              results.forEach (function (result) {
                result.data.Files.forEach (function (f) {
                  imagedata.push ({date: f.CreateDate, url: sxt.app.api + f.Url.substring (1)});
                })
              })
            }
          }
          if (!imagedata) {
            imagedata = [];
            $('img', element).each(function (index, el) {
              imagedata.push({url:$(el)[0].src,date:$(el).attr('date')});
            })
            defaultIndex = $('img', element).index($(a.target))
            if (defaultIndex == -1)
              defaultIndex = 0;
          }
          if(imagedata.length==0){
            utils.alert('暂无图片')
            return;
          }
          imagedata.sort(function(s1,s2){
            if(s1.date && s2.date){
              return s2.date.localeCompare(s1.date);
            }
            return 0;
          })
          //console.log('img',img)
          var str = [];
          str.push('<ul>')
          angular.forEach(imagedata, function (data) {
            var arl = data.url;
            str.push('<li><img src="' + arl.replace('/s_','/') + '" alt="' + (data.date?'日期：'+data.date:'') + '"></li>');
          });
          str.push('</ul>');
          o = $(str.join('')).appendTo('body')

          viewer = new Viewer(o[0],{
            button:true,
            scalable:false,
            hide:function(){
              viewer.destroy();
              o.remove();
              viewer = o=null;
              def =false;
            },
            build:function(){

            }
          });
          viewer.show();

        });
        scope.$on('$destroy', function () {
          if (viewer)
            viewer.destroy();
          if (o)
            o.remove();
          viewer = o=null;
          def =false;
        });
      };
      $rootScope.$on('sxtImageView',player);
      if(scope.isContainer) {
        element.on ('click', player);
      }
    }
  }
})();

/**
 * Created by emma on 2016/4/23.
 */
(function(){
  'use strict';
  angular
    .module('app.szgc')
    .directive('sxtFixedRight',sxtFixedRight);
  /** @ngInject */
  function sxtFixedRight(){
    return {
      scope:{
        value:'=sxtFixedRight'
      },
      link:function(scope,element){
        var w = $(window).width(),w1=element.width();
        element.css({
          position:'absolute',
          zIndex:'19',
          left: w-scope.value-20
        })
        var p = $(element.parents('.md-virtual-repeat-scroller')[0]);
        element.parent().css({
          position:'relative'
        })
        p.on('scroll',function(){
          element.css({
            left: p.scrollLeft()+w-scope.value-20
          });
        });
      }
    }
  }
})();

/**
 * Created by jiuyuong on 2016/3/15.
 */
(function(){
  'use strict';
  sxtDplayer.$inject = ["$timeout", "sxt"];
  angular
    .module('app.szgc')
    .directive('sxtDplayer',sxtDplayer);

  /** @ngInject */
  function sxtDplayer($timeout,sxt){
    return {
      restrict:'A',
      scope:{
        images:'=sxtDplayer'
      },
      link:link
    }

    function link(scope,element,attr,ctrl){
      var o;
      scope.$watch('images', function () {
        if (!scope.images) return;
        if (o) element.empty();

        $timeout(function () {
          var str = [];
          str.push('<div class="flip-items" style="display:none"><ul >');
          scope.images.forEach(function (img,i) {
            str.push('<li title="' + (i + 1) + '"><div class="hs"><img src="' + sxt.app.api + img.Url.substring(1) + '" /><p>'+img.CreateDate+'('+(i+1)+'/'+scope.images.length+')</p></div></li>')
          })
          str.push('</ul></div>');
          o = $(str.join('')).appendTo(element);
          var h = element.height();
          o.find('img').height(h-50)
          o.height(h);
          o.flipster({
            start: 0,
            style: 'carousel',
            spacing: -0.5,
            nav: false,
            buttons: true,
            loop: true
          });
        }, 500);
      });
    }
  }
})();

/**
 * Created by emma on 2016/2/25.
 */
(function(){
  'use strict';

  sxtAreaShowDirective.$inject = ["$timeout", "api", "$state", "$rootScope", "utils", "sxt"];
  angular
    .module('app.szgc')
    .directive('sxtAreaShow',sxtAreaShowDirective);

  /** @ngInject */
  function sxtAreaShowDirective($timeout, api, $state,$rootScope,utils,sxt){
    return {
      scope: {
        projectId: '='
      },
      link: function (scope, element, attrs, ctrl) {
        var p = element.position(), h = $(window).height();
        element.height(h - p.top - 150);
        var map,layer,dlg;

        var ran = function () {
          $timeout(function(){
            if (!scope.projectId) return;
            //var crs = ;
            var temp=[];
            if (map && map.projectId == scope.projectId) return;
            if (map) map.remove();
            var showImgs = function(d,data){
             // console.log('load',data)
              if(!data.data) return;
              if(data.data){
                data.data = false;
                var load = false;
              }
              if(load) return;
              if(!load){
                load = true;
                newFn(load);
              }
            }
            var newFn = function(load){
                if(load){
                 // console.log('temp',$rootScope.temp)
                  if($rootScope.temp){
                    $rootScope.$emit('sxtImageView', {
                      groups: $rootScope.temp
                    });
                  }
                  else{
                    if(!dlg){
                      dlg = utils.alert('暂未上传照片').then(function(){dlg=null;})
                    }
                  }
                }
            }

            $rootScope.$on('sxtImageViewAll',showImgs);

            api.szgc.ProjectExService.get(scope.projectId).then(function (result) {
              var project = result.data;
              if (project.AreaImage) {
                api.szgc.FilesService.group(project.AreaImage).then(function (fs) {
                  if (fs.data.Files.length == 0) return;
                  map = L.map(element[0], {
                    crs: L.extend({}, L.CRS, {
                      projection: L.Projection.LonLat,
                      transformation: new L.Transformation(1, 0, 1, 0),
                      scale: function (e) {
                        return 256 * Math.pow(2, e);
                      }
                    }),
                    center: [.48531902026005, .5],
                    zoom: 0,
                    minZoom: 0,
                    maxZoom: 3,
                    scrollWheelZoom: true,
                    annotationBar: false,
                    attributionControl: false
                  }),
                    layer = L.tileLayer(sxt.app.api + '/api/picMap/load/{z}_{x}_{y}.png?size=256&path='+fs.data.Files[0].Url.replace('/s_', '/'), {
                      noWrap:true,
                      continuousWorld:false,
                      tileSize:256
                    });
                  //console.log('picUrl',scope.picUrl)
                  map.projectId = scope.projectId;
                  layer.addTo(map);

                  var apiLayer = L.GeoJSON.api({
                    get: function (cb) {
                      scope.groups =null;
                      if (project.AreaRemark) {
                        try {
                          var d = JSON.parse(project.AreaRemark);
                          cb(d);
                          if (d.features.length) {
                            var g = [];
                            d.features.forEach(function (f) {
                              if (f.options.gid && g.find(function(a){return a ==f.options.gid;})==null) {
                                g.push (f.options.gid);
                              }
                              if(f.options.icon && f.options.icon.options && f.options.icon.options.iconUrl){
                                f.options.icon.options.iconUrl = f.options.icon.options.iconUrl.replace('/dp/libs/','assets/')
                              }
                            });
                            if (g.length) {
                              scope.groups = g;
                            }
                            scope.$watch('scope.groups',function(){
                              //console.log('change',scope.groups)
                              $rootScope.temp = scope.groups;
                            })
                          }
                        }
                        catch (ex) {
                          cb();
                        }
                      }
                      else {
                        cb();
                      }
                    },
                    post: function (data, cb) {
                      project.AreaRemark = JSON.stringify(data);
                      api.szgc.ProjectExService.update(project).then(function () {
                        cb();
                      });
                    },
                    click: function (layer, cb) {
                      if (layer.editing && layer.editing._enabled) return;
                      {
                        if (layer._icon) {
                          if (layer.options.gid) {
                            $rootScope.$emit('sxtImageView', {
                              groups: [layer.options.gid]
                            });
                          }
                          else {
                            utils.alert('此摄像头未上传现场照片')
                          }
                        }
                        else {
                          $state.go('app.szgc.project.buildinglist', { itemId: layer.options.itemId, itemName: layer.options.itemName, projectType: 2 })
                        }
                      }

                    }
                  }).addTo(map);

                });
              };
            });
          },1000);
        }
        scope.$watch('projectId', ran);
        scope.$on('$destroy', function () {
          scope.groups =null;
          //$rootScope.$o
        })
      }
    }
  }
})();

/**
 * Created by jiuyuong on 2016/5/19.
 */
(function () {
  'use strict';

  sxtAreaHousesDirective.$inject = ["sxt", "api", "$timeout", "$q"];
  angular
    .module('app.szgc')
    .directive('sxtAreaHouses',sxtAreaHousesDirective);
  /** @ngInject */
  function sxtAreaHousesDirective (sxt, api,$timeout,$q) {
    return {
      scope: {
        param: '=',
        procedures: '=',
        itemId: '=',
        itemName:'='
      },
      link: function (scope, element, attrs, ctrl) {
        function isMiddleNumber(n1, n2, n, f) {
          if(f){ //修正线难被点到的问题
            if(Math.abs(n1-n2)<0.02){
              if(n1>n2)
              {
                n1+=0.01;
                n2-=0.01;
              }
              else{
                n1-=0.01;
                n2+=0.01;
              }
            }
          }
          return n1 > n2 ?
          n1 >= n && n >= n2 :
          n2 >= n && n >= n1;
        }

        $timeout(function () {
          scope.$watch('param', function () {
            if (!scope.param) return;
            var regionId = scope.param.idTree.replace(/\>/g,'-').replace('sub-', ''),
              bid = regionId.split('-')[1],
              type = scope.param.item.type;

            $q.all([
              api.szgc.FilesService.group(bid + '-' + type),
              api.szgc.FilesService.GetGroupLike(regionId),
              api.szgc.FilesService.GetGroupLike('sub-'+regionId)
            ]).then(function (rs) {
              var r = rs[0];
              var fs = r.data.Files[0];
              if (fs) {
                var map, layer, apiLayer, drawControl, itemId=[];
                if (map)
                  map.remove();

                map = L.map(element[0], {
                  crs: L.extend({}, L.CRS, {
                    projection: L.Projection.LonLat,
                    transformation: new L.Transformation(1, 0, 1, 0),
                    scale: function (e) {
                      return 256 * Math.pow(2, e);
                    }
                  }),
                  center: [.48531902026005, .5],
                  zoom: 0,
                  minZoom: 0,
                  maxZoom: 3,
                  scrollWheelZoom: true,
                  annotationBar: false,
                  zoomControl: false,
                  attributionControl: false
                });

                map.on('click', function (e) {
                  if (e.target.isEdit) return;
                  var p = e.latlng,// this._map.mouseEventToLatLng(e),
                    overLayers = [],
                    eb, isN = false;
                  map.eachLayer(function (layer) {
                    if (layer.editing && !layer.isEdit) {
                      layer.setStyle({
                        color: '#ff0000'
                      })
                      var bounds = layer.getBounds();
                      if (bounds && isMiddleNumber(bounds._southWest.lat, bounds._northEast.lat, p.lat, 1) &&
                        isMiddleNumber(bounds._southWest.lng, bounds._northEast.lng, p.lng, 1)
                      ) {
                        overLayers.push(layer);
                      }
                    }
                  });
                  var colorLayer = overLayers.find(function (l) {
                    return l.options.fillOpacity != 0;
                  });
                  if (!colorLayer) {
                    colorLayer = overLayers.find(function (l) {
                      return l instanceof L.Polygon || layer instanceof L.Rectangle;
                    });
                    if (colorLayer) {
                      var groupLayer = [];
                      map.eachLayer(function (layer) {
                        if (layer.isEdit) {
                          map.removeLayer(layer);
                        }
                        if (layer.editing && !layer.isEdit) {
                          if (layer.options.itemName == colorLayer.options.itemName) {
                            if (layer instanceof L.Rectangle || layer instanceof L.Polygon) {
                              layer.setStyle({
                                color: '#ff0000',
                                stroke: true,
                                opacity: 0.5,
                                dashArray: rs[1].data.Rows.find(function (r) {
                                  return r.GroupId.indexOf(layer.options.itemId) != -1
                                }) || rs[2].data.Rows.find(function (r) {
                                  return r.GroupId.indexOf(layer.options.itemId) != -1
                                }) ? null : '1 1',
                                weight: 1,
                                fillOpacity: 0.2
                              });
                              groupLayer.push(layer);
                            }
                            else {
                              layer.setStyle({
                                color: '#ff0000',
                                stroke: true,
                                dashArray: rs[1].data.Rows.find(function (r) {
                                  return r.GroupId.indexOf(layer.options.itemId) != -1
                                }) || rs[2].data.Rows.find(function (r) {
                                  return r.GroupId.indexOf(layer.options.itemId) != -1
                                }) ? null : '5 2',
                                fillOpacity: 0.2
                              });
                            }
                          }
                          else {
                            layer.setStyle({
                              color: '#ff0000',
                              stroke: false,
                              fillOpacity: 0
                            });
                          }
                        }
                      });
                      var layer = groupLayer.find(function (layer) {
                        return layer.options.p == '1';
                      });
                      var layer2 = groupLayer.find(function (layer) {
                        return layer.options.p == '5';
                      });
                      if (layer) {
                        //console.log('b', layer.getBounds());
                        var b = layer.getBounds(), p1 = new L.latLng(b._southWest.lat - 0.1, b._southWest.lng-0.1);
                        L.marker(p1, {
                          icon: new ST.L.LabelIcon({
                            html: '楼板',
                            color: rs[1].data.Rows.find(function (r) {
                              return r.GroupId.indexOf(layer.options.itemId) != -1
                            }) || rs[2].data.Rows.find(function (r) {
                              return r.GroupId.indexOf(layer.options.itemId) != -1
                            }) ? '#ff0000' : 'silver'
                          }),
                          saved: false,
                          draggable: true,       // Allow label dragging...?
                          zIndexOffset: 1000     // Make appear above other map features
                        }).addTo(map).on('click', function () {
                          layer.setStyle({
                            color: 'green'
                          })
                          scope.itemName = layer.options.t;
                          //scope.itemName = (layer.options.itemName || itemName) + ' - ' + layer.options.t;
                          scope.itemId = layer.options.itemId || '--';
                          scope.$apply();
                          layer2 && layer2.setStyle({
                            color: '#ff0000'
                          })
                        }).isEdit = true;
                      }

                      if (layer2) {
                        var b = layer2.getBounds(), p2 = L.latLng(b._southWest.lat - 0.1, b._southWest.lng + 0.1);
                        L.marker(p2, {
                          icon: new ST.L.LabelIcon({
                            html: '吊顶',
                            color: rs[1].data.Rows.find(function (r) {
                              return r.GroupId.indexOf(layer.options.itemId) != -1
                            }) || rs[2].data.Rows.find(function (r) {
                              return r.GroupId.indexOf(layer.options.itemId) != -1
                            }) ? '#ff0000' : 'silver'
                          }),
                          saved: false,
                          draggable: true,       // Allow label dragging...?
                          zIndexOffset: 1000     // Make appear above other map features
                        }).addTo(map).on('click', function () {
                          layer2.setStyle({
                            color: 'green'
                          })
                          layer && layer.setStyle({
                            color: '#ff0000'
                          })
                          scope.itemName = layer2.options.t;
                          //scope.itemName = (layer2.options.itemName || itemName) + ' - ' + layer2.options.t;
                          scope.itemId = layer2.options.itemId || '--';
                          scope.$apply();

                        }).isEdit = true;
                      }

                    }
                    return;
                  }
                  var line, itemName, curClick;
                  overLayers.forEach(function (layer) {
                    itemName = layer.options.itemName || itemName;
                    var idx = itemId.indexOf(layer.options.itemId);
                    if (itemId.indexOf(layer.options.itemId) == -1) {
                      curClick = layer;
                      itemId.push(layer.options.itemId);
                    }
                    else {

                    }
                  });
                  if (!curClick && overLayers.length) {
                    var curId = itemId.find(function (iid) {
                      return !!overLayers.find(function (o) {
                        return o.options.itemId == iid;
                      });
                    });
                    curClick = overLayers.find(function (o) {
                      return o.options.itemId == curId;
                    })
                    itemId.splice(itemId.indexOf(curId), 1);
                    itemId.push(curClick.options.itemId);
                  }
                  if (curClick) {
                    //itemId = curClick.options.itemId;
                    curClick.setStyle({
                      color: 'green'
                    })
                    scope.itemName = curClick.options.t;
                    //scope.itemName = (curClick.options.itemName || itemName)+' - '+ curClick.options.t;
                    scope.itemId = curClick.options.itemId || '--';
                    scope.$apply();

                    //console.log(curClick.toJSON())
                  }
                });

                layer = L.tileLayer(sxt.app.api + '/api/picMap/load/{z}_{x}_{y}.png?size=256&path=' + fs.Url.replace('/s_', '/'), {
                  noWrap: true,
                  continuousWorld: false,
                  tileSize: 256
                });
                layer.addTo(map);

                var lys = [];
                scope.procedures = ['1', '2', '3', '4', '5'];
                scope.$watchCollection('procedures', function () {

                  lys.forEach(function (l) {
                    l.hide = true;
                  })
                  scope.procedures.forEach(function (m) {
                    var layer = lys.find(function (o) {
                      return o.p == m;
                    });
                    if (!layer) {
                      layer = L.GeoJSON.api({
                        areaLabel: false,
                        edit: false,
                        get: function (cb) {
                          api.szgc.ProjectExService.get(bid + '-' + type + '-' + m).then(function (r) {
                            var project = r.data;
                            if (project && project.AreaRemark) {
                              try {
                                var d = JSON.parse(project.AreaRemark);
                                d.features.forEach(function (g) {
                                  //if (g.geometry.type == 'Polygon') {
                                  g.options.p = m;
                                  switch (m) {
                                    case '1':
                                      g.options.t = '楼板';
                                      break;
                                    case '2':
                                      g.options.t = '墙体';
                                      break;
                                    case '3':
                                      g.options.t = '内墙板';
                                      break;
                                    case '4':
                                      g.options.t = '轻钢龙骨';
                                      break;
                                    case '5':
                                      g.options.t = '吊顶';
                                      break;
                                    case '6':
                                      g.options.t = '砌筑';
                                      break;
                                  }
                                  g.options.stroke = false;
                                  //g.options.opacity = 0;
                                  g.options.fillOpacity = 0;
                                  //}
                                })
                                cb(d);
                              }
                              catch (ex) {
                                cb();
                              }
                            }
                            else {
                              cb();
                            }
                          });

                        },
                        click: function () {

                        }
                      });

                      lys.push(layer)
                    }
                    layer.hide = false;
                  });
                  lys.forEach(function (l) {
                    if (l._map && l.hide) {
                      l._map.removeLayer(l);
                    }
                    else if (!l.hide && !l._map) {
                      l.addTo(map);
                    }
                  })

                });
              }
            })
          })
        },500)

      }
    }
  }

})();

/**
 * Created by jiuyuong on 2016/4/5.
 */
(function(){
  'use strict';
  sxtAreaHouse.$inject = ["$timeout", "$rootScope", "api", "sxt", "$mdDialog", "$http", "tileLayer"];
  angular
    .module('app.szgc')
    .directive('sxtAreaHouse',sxtAreaHouse);

  /** @ngInject */
  function sxtAreaHouse($timeout,$rootScope,api,sxt,$mdDialog,$http,tileLayer){
    return {
      scope: {
        show:'=',
        files: '=',
        gid: '=',
        upload: '@',
        oid: '=',
        oName:'=',
        pid:'='
      },
      link: function (scope, element, attrs, ctrl) {
        var map, layer, apiLayer, drawControl;
        L.drawLocal = {
          draw: {
            toolbar: {
              actions: {
                title: '取消',
                text: '取消'
              },
              undo: {
                title: '撤消最后一个点',
                text: '撤消'
              },
              buttons: {
                polyline: '直线',
                polygon: '封闭区域',
                rectangle: '矩形',
                circle: 'Draw a circle',
                marker: '摄像头位置'
              }
            },
            handlers: {
              circle: {
                tooltip: {
                  start: 'Click and drag to draw circle.'
                },
                radius: 'Radius'
              },
              marker: {
                tooltip: {
                  start: '点击这里放置摄像头'
                }
              },
              polygon: {
                tooltip: {
                  start: '点击开始',
                  cont: '点击继续',
                  end: '点击第一点结束.'
                }
              },
              polyline: {
                error: '<strong>Error:</strong> shape edges cannot cross!',
                tooltip: {
                  start: '点击开始画线',
                  cont: '点击继续画线',
                  end: '点击最后一点结束画线'
                }
              },
              rectangle: {
                tooltip: {
                  start: '点击拖拽画矩形.'
                }
              },
              simpleshape: {
                tooltip: {
                  end: '松开鼠标结束'
                }
              }
            }
          },
          edit: {
            toolbar: {
              actions: {
                save: {
                  title: '保存编辑.',
                  text: '保存'
                },
                cancel: {
                  title: '取消编辑，所有改动将取消',
                  text: '取消'
                }
              },
              buttons: {
                edit: '修改.',
                editDisabled: 'No layers to edit.',
                remove: '删除.',
                removeDisabled: 'No layers to delete.'
              }
            },
            handlers: {
              edit: {
                tooltip: {
                  text: '点击方块改变区域.',
                  subtext: '点击取消退出编辑'
                }
              },
              remove: {
                tooltip: {
                  text: '点击物件删除'
                }
              }
            }
          }
        };
        var isMiddleNumber= function(n1,n2,n, f) {
          if(f){ //修正线难被点到的问题
            if(Math.abs(n1-n2)<0.02){
              if(n1>n2)
              {
                n1+=0.01;
                n2-=0.01;
              }
              else{
                n1-=0.01;
                n2+=0.01;
              }
            }
          }
          return n1 > n2 ?
          n1 >= n && n >= n2 :
          n2 >= n && n >= n1;
        }
        var ran = function () {
          if (!scope.show) return;
          //var crs = ;
          if (map && map.gid == scope.gid) return;
          if (map && scope.files && scope.files[0].Url != map.pic) {
            map.remove ();
            map = null;
          }
          if(apiLayer && map)
            map.removeLayer(apiLayer);

          if (!scope.files || !scope.files.length) return;


          api.szgc.ProjectExService.get (scope.gid).then (function (result) {
            var project = result.data;

            if (map)
              map.remove ();
            map = L.map (element[0], {
              crs: L.extend ({}, L.CRS, {
                projection: L.Projection.LonLat,
                transformation: new L.Transformation (1, 0, 1, 0),
                scale: function (e) {
                  return 256 * Math.pow (2, e);
                }
              }),
              center: [.48531902026005, .5],
              zoom: 0,
              minZoom: 0,
              maxZoom: 2,
              scrollWheelZoom: true,
              annotationBar: false,
              zoomControl: false,
              attributionControl: false
            });
            map.pic = scope.files[0].Url;
            scope.files[0].api = sxt.app.api;
            scope.files[0].Url = scope.files[0].Url.replace ('/s_', '/');
            layer = tileLayer.tile(scope.files[0]);
            //layer = L.tileLayer(sxt.app.api + '/api/file/load?x={x}&y={y}&z={z}', {
/*            layer = L.tileLayer (sxt.app.api + '/api/picMap/load/{z}_{x}_{y}.png?size=256&path=' + scope.files[0].Url.replace ('/s_', '/'), {
              noWrap: true,
              continuousWorld: false,
              tileSize: 256
            });*/
            map.gid = scope.gid;
            layer.addTo (map);


            apiLayer = L.GeoJSON.api ({
              areaLabel: scope.upload != 'true',
              edit: scope.upload != 'true',
              get: function (cb) {
                if (project && project.AreaRemark) {
                  try {
                    var d = JSON.parse (project.AreaRemark);
                    cb (d);
                  }
                  catch (ex) {
                    cb ();
                  }
                }
                else {
                  cb ();
                }
              },
              post: function (data, cb) {

              },
              contextMenu: function (e, cb) {


              },
              click: function (layer, cb) {

/*                scope.oid = layer.options.itemId;
                scope.oName = layer.options.itemName;
                if (!$rootScope.$$phase) {
                  scope.$apply ();
                }*/

              }
            }).addTo (map);
            map.on ('click', function (e) {
              var p = e.latlng,
                eb;
              apiLayer.eachLayer(function (layer) {

                var bounds = layer.getBounds ();
                if (bounds && isMiddleNumber (bounds._southWest.lat, bounds._northEast.lat, p.lat, 1) &&
                  isMiddleNumber (bounds._southWest.lng, bounds._northEast.lng, p.lng, 1)
                ) {
                  eb = layer;
                }
              });

              if(eb){
                scope.oid = eb.options.itemId;
                scope.oName = eb.options.itemName;
                if (!$rootScope.$$phase) {
                  scope.$apply ();
                };
                $mdDialog.show({
                    locals:{
                      options:scope
                    },
                    controller: ["$scope", "$mdDialog", "options", "$cordovaCamera", function($scope, $mdDialog,options,$cordovaCamera) {
                      $scope.project={
                        fid:options.pid.replace(/\>/g, '-') + '-' + options.oid,
                        sid:'sub-'+options.pid.replace(/\>/g, '-') + '-' + options.oid,
                      };
                      console.log('sc',$scope.project)
                      $scope.photo = function ($event) {
                        if ($event) {
                          $event.preventDefault ();
                          $event.stopPropagation ();
                        }
                        $cordovaCamera.getPicture ({
                          quality: 50,
                          destinationType: 0,
                          sourceType: 1,
                          allowEdit: true,
                          encodingType: 0,
                          saveToPhotoAlbum: false,
                          correctOrientation: true
                        }).then (function (imageData) {
                          if (imageData) {
                            //var image = document.createElement ('img');
                            //image.src = "data:image/jpeg;base64," + imageData;
                            //element.append (image);
                            imageData = imageData.replace('data:image/jpeg;base64,','').replace('data:image/png;base64,','')
                            $scope.title = '正在上传图片';
                            $http.post (sxt.app.api+'/api/Files/' + layer.options.pid + '/base64', {Url: imageData}).then (function (result) {
                              $scope.images.push (result.data.Files[0]);
                              $scope.title = null;
                              //utils.alert('上传成功');
                            })
                          }
                        }, function (err) {

                        });
                      }

                      $scope.images = [];
                      $scope.options = options;
                      $scope.hide = function () {
                        $mdDialog.hide ();
                      };

                      $scope.cancel = function () {
                        $mdDialog.cancel ();
                      };

                      $scope.answer = function () {
                        //cb ();
                        $mdDialog.hide ();
                        //$state.go ('app.szgc.tzg', {pid: options.pid})
                      };
                      //$scope.photo ();
                    }],
                    template: '<md-dialog aria-label="添加拍照"  ng-cloak><form><md-toolbar ><div class="md-toolbar-tools"><h2>{{title || \'拍照\'}}</h2></div></md-toolbar>\
               <md-dialog-content>\
                <fieldset>\
                    <legend>总体</legend>\
                    <sxt-images edit="true" ng-model="project.fid" single="true"></sxt-images>\
                 </fieldset>\
                  <fieldset>\
                  <legend>细部</legend>\
                  <sxt-images edit="true" ng-model="project.sid"></sxt-images>\
                  </fieldset>\
               </md-dialog-content>\
                <md-dialog-actions layout="row" style="border-top:solid 2px red">\
              <span flex></span>\
                <md-button  class="md-raised md-primary" ng-click="answer()"  md-autofocus style="margin-right:20px;margin-top: 20px">关闭</md-button>\
                  </md-dialog-actions>\
                  </form>\
                  </md-dialog>',
                    parent: angular.element(document.body),
                    clickOutsideToClose:true,
                    fullscreen: true
                  })
                  .then(function(answer) {

                  }, function() {

                  });
              }
            });
          });
        }
        scope.$watch('show', ran);
        scope.$watchCollection('files', ran);
        scope.$watch('gid', ran);
      }
    }
  }
})();

/**
 * Created by jiuyuong on 2016/5/20.
 */
(function () {
  'use strict';

  sxtAreaHousesDirective.$inject = ["sxt", "api", "$timeout"];
  angular
    .module('app.szgc')
    .directive('sxtAreaHousesN',sxtAreaHousesDirective);
  /** @ngInject */
  function sxtAreaHousesDirective (sxt, api,$timeout) {
    return {
      scope: {
        param: '=',
        procedures: '=',
        itemId: '=',
        itemName:'='
      },
      link: function (scope, element, attrs, ctrl) {
        function isMiddleNumber(n1, n2, n, f) {
          if(f){ //修正线难被点到的问题
            if(Math.abs(n1-n2)<0.02){
              if(n1>n2)
              {
                n1+=0.01;
                n2-=0.01;
              }
              else{
                n1-=0.01;
                n2+=0.01;
              }
            }
          }
          return n1 > n2 ?
          n1 >= n && n >= n2 :
          n2 >= n && n >= n1;
        }

        $timeout(function () {
          scope.$watch('param', function () {
            if (!scope.param) return;
            var regionId = scope.param.idTree.replace(/\>/g,'-').replace('sub-', ''),
              bid = regionId.split('-')[1],
              type = scope.param.item.type;
            api.szgc.FilesService.group(bid + '-' + type).then(function (r) {
              var fs = r.data.Files[0];
              if (fs) {
                var map, layer, apiLayer, drawControl, itemId=[];
                if (map)
                  map.remove();

                map = L.map(element[0], {
                  crs: L.extend({}, L.CRS, {
                    projection: L.Projection.LonLat,
                    transformation: new L.Transformation(1, 0, 1, 0),
                    scale: function (e) {
                      return 256 * Math.pow(2, e);
                    }
                  }),
                  center: [.48531902026005, .5],
                  zoom: 0,
                  minZoom: 0,
                  maxZoom: 3,
                  scrollWheelZoom: true,
                  annotationBar: false,
                  zoomControl: false,
                  attributionControl: false
                });
                map.on('click', function (e) {
                  var p = e.latlng,// this._map.mouseEventToLatLng(e),
                    overLayers = [],
                    eb, isN = false;
                  map.eachLayer(function (layer) {
                    if (layer.editing) {
                      layer.setStyle({
                        color: '#ff0000'
                      })
                      var bounds = layer.getBounds();
                      if (bounds && isMiddleNumber(bounds._southWest.lat, bounds._northEast.lat, p.lat, 1) &&
                        isMiddleNumber(bounds._southWest.lng, bounds._northEast.lng, p.lng, 1)
                      ) {
                        overLayers.push(layer);
                      }
                    }
                  });
                  var line,itemName,curClick;
                  overLayers.forEach(function (layer) {
                    itemName = layer.options.itemName || itemName;
                    var idx = itemId.indexOf(layer.options.itemId);
                    if (itemId.indexOf(layer.options.itemId)==-1) {
                      curClick = layer;
                      itemId.push(layer.options.itemId);
                    }
                  });
                  if (!curClick && overLayers.length) {
                    var curId = itemId.find(function (iid) {
                      return !!overLayers.find(function (o) {
                        return o.options.itemId == iid;
                      });
                    });
                    curClick = overLayers.find(function (o) {
                      return o.options.itemId == curId;
                    })
                    itemId.splice(itemId.indexOf(curId), 1);
                    itemId.push(curClick.options.itemId);
                  }
                  if (curClick) {
                    curClick.setStyle({
                      color: 'green'
                    })
                    scope.itemName = curClick.options.itemName || itemName;
                    scope.itemId = curClick.options.itemId ||'--';
                    scope.$apply();
                  }
                });

                layer = L.tileLayer(sxt.app.api + '/api/picMap/load/{z}_{x}_{y}.png?size=256&path=' + fs.Url.replace('/s_', '/'), {
                  noWrap: true,
                  continuousWorld: false,
                  tileSize: 256
                });
                layer.addTo(map);

                var lys = [];
                scope.procedures = ['1', '2', '3', '4', '5'];
                scope.$watchCollection('procedures', function () {

                  lys.forEach(function (l) {
                    l.hide = true;
                  })
                  scope.procedures.forEach(function (m) {
                    var layer = lys.find(function (o) {
                      return o.p == m;
                    });
                    if (!layer) {
                      layer = L.GeoJSON.api({
                        areaLabel: false,
                        edit: false,
                        get: function (cb) {
                          api.szgc.ProjectExService.get(bid + '-' + type +'-'+ m).then(function (r) {
                            var project = r.data;
                            if (project && project.AreaRemark) {
                              try {
                                var d = JSON.parse(project.AreaRemark);
                                d.features.forEach(function (g) {
                                  if (g.geometry.type == 'Polygon') {
                                    g.options.stroke = false;
                                    g.options.opacity = 0.01;
                                  }
                                })
                                cb(d);
                              }
                              catch (ex) {
                                cb();
                              }
                            }
                            else {
                              cb();
                            }
                          });

                        },
                        click: function () {

                        }
                      });

                      lys.push(layer)
                    }
                    layer.hide = false;
                  });
                  lys.forEach(function (l) {
                    if (l._map && l.hide) {
                      l._map.removeLayer(l);
                    }
                    else if (!l.hide && !l._map) {
                      l.addTo(map);
                    }
                  })

                });
              }
            })
          })
        },500)

      }
    }
  }

})();

(function(){
  photoDraw.$inject = ["$cordovaCamera", "$timeout", "$mdDialog"];
  angular
    .module('app.szgc')
    .directive('photoDraw',photoDraw);

  /** @Inject */
  function photoDraw($cordovaCamera,$timeout,$mdDialog){
    return {
      restrict:'E',
      scope:{
        onCancel:'&',
        onAnswer:'&'
      },
      templateUrl:'app/main/szgc/directives/photoDraw.html',
      link:link

    }
    function  link(scope,element,attr,ctrl){

      scope.color = 'red';
      scope.is = function (color) {
        return scope.color == color ?'1px':'0';
      };
      scope.setColor = function (color) {
        scope.color = color;
      }

      $timeout(function () {
        var canvas, ctx, flag = false,
          prevX = 0,
          currX = 0,
          prevY = 0,
          currY = 0,
          dot_flag = false,
          radio =1,
          parent = $('canvas',element).parent(),
          width =parent.width(),height =parent.height(),
          offset = $('#toptoolbar').height(),
          srcWidth,srcHeight,
          image;

        $('canvas',element).width(width)
          .height(height);
        canvas = $('canvas',element)[0];

        ctx = canvas.getContext("2d");
        ctx.canvas.width = width;
        ctx.canvas.height = height;
        canvas.addEventListener("mousemove", function (e) {
          findxy('move', e)
        }, false);
        canvas.addEventListener("touchmove", function (e) {
          findxy('move', e)
        }, false);
        canvas.addEventListener("mousedown", function (e) {
          findxy('down', e)
        }, false);
        canvas.addEventListener("touchstart", function (e) {
          findxy('down', e)
        }, false);
        canvas.addEventListener("mouseup", function (e) {
          findxy('up', e)
        }, false);
        canvas.addEventListener("touchend", function (e) {
          findxy('up', e)
        }, false);
        canvas.addEventListener("mouseout", function (e) {
          findxy('out', e)
        }, false);



        function draw() {
          //if(Math.abs(prevY/radio-currY/radio)>20)return;
          ctx.beginPath();
          ctx.moveTo(prevX/radio, prevY/radio);
          ctx.lineTo(currX/radio, currY/radio);
          ctx.strokeStyle = scope.color;
          //ctx.strokeStyle = x;
          //ctx.lineWidth = y;
          ctx.stroke();
          ctx.closePath();
        }
        scope.cancel = function () {
          scope.onCancel && scope.onCancel();
        }
        scope.erase = function () {
          if(image){
            ctx.clearRect(0, 0, srcWidth, srcHeight);
            ctx.drawImage(image, 0, 0,image.width,image.height,0,0,srcWidth,srcHeight);
          }
        }
        scope.save =  function () {
          var dataURL = canvas.toDataURL('image/jpeg',1);
          scope.onAnswer && scope.onAnswer({$base64Url:dataURL});
        }

        function findxy(res, e) {
          if(!e.clientX &&(!e.touches || !e.touches[0] ||!e.touches[0].clientX))return;
          if (res == 'down') {
            prevX = currX;
            prevY = currY;
            currX = (e.clientX || e.touches[0].clientX)- canvas.offsetLeft;
            currY = (e.clientY || e.touches[0].clientY) - canvas.offsetTop-offset;
            flag = true;

          }
          if (res == 'up' || res == "out") {
            flag = false;
          }
          if (res == 'move') {
            //console.log('e.touches[0].x,y',e.touches[0].clientX,e.touches[0].clientY)
            if (flag) {
              prevX = currX;
              prevY = currY;
              currX = (e.clientX || e.touches[0].clientX) - canvas.offsetLeft;
              currY = (e.clientY || e.touches[0].clientY) - canvas.offsetTop - offset;
              draw();
            }
          }
        }
        scope.photo = function ($event) {
          if ($event) {
            $event.preventDefault ();
            $event.stopPropagation ();
          }
          $cordovaCamera.getPicture ({
            quality: 50,
            destinationType: 0,
            sourceType: 1,
            allowEdit: false,
            encodingType: 0,
            saveToPhotoAlbum: true,
            correctOrientation: true
          }).then (function (imageData) {
            if (imageData) {
              image = new Image();
              image.onload = function() {
                if(image.width>600 || image.height>600){
                  var rd = 600/Math.max(image.width,image.height);
                  srcWidth = image.width*rd;
                  srcHeight = image.height*rd;
                }
                else{
                  srcWidth = image.width;
                  srcHeight = image.height;
                }
                radio = height/srcHeight;
                width = srcWidth * radio;
                $('canvas',element).width(width);
                ctx.canvas.width = srcWidth;
                ctx.canvas.height = srcHeight;
                ctx.lineWidth =  srcWidth*2/350;
                ctx.drawImage(image, 0, 0,image.width,image.height,0,0,srcWidth,srcHeight);
              }
              image.src = "data:image/jpeg;base64," + imageData;
            }
            else{
              scope.cancel();
            }
          }, function (err) {
            scope.cancel();

          });
        }
        scope.photo();

      },500);
    }
  }
})();

/**
 * Created by emma on 2016/3/1.
 */
(function() {
  'use strict';

  hmDirDirective.$inject = ["$timeout"];
  angular
    .module('app.szgc')
    .directive('hmDir', hmDirDirective);

  /** @ngInject */
  function hmDirDirective($timeout) {
    return {
      restrict: 'AE',
      link: link
    }

    function link(scope, element, attrs, ctrl) {
      //console.log('scope', element[0].children[0])
      var currentScale =1;
      scope.pinch = function(e){
        var scale = getRelativeScale(e.gesture.scale);
        $.Velocity.hook($('#floorlayer'), 'scale', scale);
        e.preventDefault();
        e.stopPropagation();
       //$('#floorlayer').css('zoom',scale);
        //console.log('pinch',e)
      }
      scope.pinchmove = function(e){
        //console.log('pinchevent')
        var scale = getRelativeScale(e.gesture.scale);
       // $('#floorlayer').css('zoom',scale);
        $.Velocity.hook($('#floorlayer'), 'scale', scale);
        e.preventDefault();
        e.stopPropagation();
        //console.log('pinchmove')
        //var scale = $(element).css();
      }
      scope.pinchend = function(e){
        currentScale = getRelativeScale(e.gesture.scale);
        e.preventDefault();
        //console.log('pinchend')
        e.stopPropagation();
      }

      function getRelativeScale(scale) {
        var newscale = scale * currentScale;
        if(newscale <=1){
          newscale =1;
        }
        return newscale;//scale * currentScale;
      }
      var deltax= 0,deltay=0;
      var lastx= 0,lasty=0;
      scope.dragEvent=function(e){
        //var x = e.center.x - 250,
        //  y = e.center.y - 250;
        //e.gesture.deltaX
        //var x= $('#floorlayer').width(),y= $('#floorlayer').height();
        //var mx=$
        deltax=lastx + e.gesture.deltaX;
        deltay=lasty + e.gesture.deltaY;
        //var x1=$(e.gesture.center.clientX),y1=$(e.gesture.center.clientY);
        //var left=e.gesture.center.clientX- e.gesture.deltaX;
        //var top=e.gesture.center.clientY- e.gesture.deltaY;
        $.Velocity.hook($('#floorlayer'), 'translateX', deltax + 'px');
        $.Velocity.hook($('#floorlayer'), 'translateY', deltay + 'px');
        //$('#floorlayer').css({
        //  left:left+'px',
        //  top:top+'px'
        //})
        //console.log('xx',x,y)
        //console.log('x',e,e.gesture.deltaX,deltax)
        e.preventDefault();
        e.stopPropagation();
        //element.children().css({
        //  'left' : x + 'px',
        //  'top' : y + 'px'
        //});
      }

      scope.dragend=function(e){
        lastx = deltax;
        lasty=deltay;// + e.gesture.deltaX;
        //console.log('dragend',deltax)
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }
})();

/**
 * Created by emma on 2016/3/1.
 */

(function () {
  'use strict';

  floorLayerDetailDirective.$inject = ["$timeout"];
  angular
    .module('app.szgc')
    .directive('floorLayerDetail', floorLayerDetailDirective);

  /** @ngInject */
  function floorLayerDetailDirective($timeout) {
    return {
      restrict: 'EA',
      scope: {
        floorData: '=sxtfloor',
        floorNum: '=',
        sellLine: '=',
        single: '@',
        bdetailData: '='
      },
      link: link
    }

    function link(scope, element, attr, ctrl) {
      scope.$watch('bdetailData', function () {
        if (!scope.bdetailData) return;

        var sellLine = scope.floorData.sellLine, gx1 = scope.floorData.gx1, gx2 = scope.floorData.gx2;
        if (gx1 > scope.floorData.floors) gx1 = scope.floorData.floors;
        if (gx2 > scope.floorData.floors) gx2 = scope.floorData.floors;
        //var _floorData = [scope.floorNum, scope.floorData.floors, 20, 10, sellLine, scope.floorData.name]
        var str = [];
        var zIndex = 1, zWholeIndex = 1;
        var iFloorHeight = 0, iWinHeight = 0, itemp = 0, iWwidth = 0;
        var zoom = 0;
        var p = element.position(), h = $(window).height();

        str.push('<div class="floor-layer1"><div class="item" flex>\
          <a>\
          <div class="whole"><ul class="whole-progress">');
        for (var i = Math.max(gx1, gx2) ; i >= 0; i--) {
          if (i == sellLine) {
            str.push('<li class="build-m-presell" style="z-index:' + i + '"></li>')
          }
          else {
            if (gx2 >= i) {
              str.push('<li class="wall-m" style="z-index:' + i + '"></li>')
            }
            else {
              str.push('<li class="build-m" style="z-index:' + i + '"></li>')
            }
          }
        }

        str.push('<li class="build-b"></li></ul><ul class="whole-target">');

        str.push('<li class="wall-t" style="z-index:' + scope.floorData.floors + '"></li>');
        var totalFloors = scope.floorData.floors;
        while (totalFloors--) {
          if (totalFloors == sellLine) {
            str.push('<li class="wall-m-presell" style="z-index:' + totalFloors + '"></li>');
          } else {
            str.push('<li class="wall-m" style="z-index:' + totalFloors + '"></li>');
          }
        }
        str.push('<li class="build-b"></li></ul><div style="position:relative;bottom:0;left:175px;z-index:100;min-width:200%;" class="newlayer">');
        var temparr = [];
        var temparr2 = [];
        angular.forEach(scope.bdetailData[0].datapoints, function (v, k) {
          var find = temparr.find(function (v1) { return v1.y == v.y });
          if (!find) {
            find = {
              y: v.y,
              x: v.x
            };
            temparr.push(find)
          }
          else {
            find.x += ';' + v.x;
          }
        })
        angular.forEach(temparr, function (v, k) {
          if(!v.y)return;
          var iBottom = v.y * 18 + 60;
          str.push('<div style="height:18px;position:absolute;bottom:' + iBottom + 'px;"><span style="height:4px;width:30px;background:#f00;display:block;float:left;margin-top:6px;"></span><span style="display:block;margin-left:35px;border:1px solid #ddd;background:#fff;text-align:left;padding:3px;">' +v.y+'层'+ v.x + '<span><span style="clear:both;"></span></div>');
        })

        str.push('<div style="height:55px;"></div></div></div><p>' + scope.floorData.name + '('+ Math.max(gx1, gx2) +'/' + scope.floorData.floors + '层)<br/>&nbsp;' + scope.floorData.summary +'</p></a></div></div>');
        var o = $(str.join('')).appendTo(element);
        var barchartHeight=$('#barchart').outerHeight();
        itemp = (scope.floorNum - 1) * 18 + 500;
        //根据手机大小来定zoom，最小为0.12
        iWinHeight = $(window).height() - 100-barchartHeight;

        zoom=iWinHeight/itemp;
        // var zoom = iWinHeight / itemp;


        $('.newlayer>div').on('click', function () {
          $(this).css('z-index',101).siblings().css('z-index',100);
        })
        //窗口缩放时自动调整相应参数
        //$(window).resize(function () {
        //  if ($(window).width() > 960) {
        //    zoom = 0.5;
        //    iFloorHeight = ((scope.floorNum - 1) * 18 + 107 + 34) * zoom + 80;
        //    $('.whole').css('zoom', zoom);
        //    $('.floor-layer1').css('height', iFloorHeight + 'px');
        //  }
        //  else if ($(window).width() > 760) {
        //    zoom = 0.5;
        //    iFloorHeight = ((scope.floorNum - 1) * 18 + 107 + 34) * zoom + 50;
        //    $('.whole').css('zoom', zoom);
        //    $('.floor-layer1').css('height', iFloorHeight + 'px');
        //  } else {
        //    zoom = izoom;
        //    $('.whole').css('zoom', zoom);
        //    iFloorHeight = ((scope.floorNum - 1) * 18 + 107 + 34) * zoom + 50;
        //    $('.floor-layer1').css('height', iFloorHeight + 'px');
        //  }
        //})

        iFloorHeight = itemp * zoom ;
        $('.whole', element).css('zoom', '0.24');
        $('.floor-layer1').css({'height': '250px','width': '250px'});

        scope.$on('$destroy', function () {
          o.remove();
          $(element).remove();
        });
      });
    }
  }

})();

/**
 * Created by emma on 2016/2/19.
 */

(function() {
  'use strict';

  floorLayerDirective.$inject = ["$timeout", "api"];
  angular
    .module('app.szgc')
    .directive('floorLayer', floorLayerDirective);

  /** @ngInject */
  function floorLayerDirective($timeout,api){
    return {
      restrict:'EA',
      scope:{
        floorData:'=sxtfloor',
        floorNum: '=',
        sellLine:'=',
        buildLen:'='
      },
      link:link
    }

    function link(scope,element,attr,ctrl){

      //element.click(function(){
        //var floorData=[50,50,20,10,30];
      scope.$watch('floorNum',function(){
        if(!scope.floorNum) return;
      //console.log('floorNum',scope.floorNum)
      var sellLine = scope.floorData.sellLine, gx1 = scope.floorData.gx1, gx2 = scope.floorData.gx2;
      if (gx1 > scope.floorData.floors) gx1 = scope.floorData.floors;
      if (gx2 > scope.floorData.floors) gx2 = scope.floorData.floors;
        var str=[];
        var iFloorHeight= 0,itemp,iWinHeight;
        var zoom=0;

        str.push('<div class="floor-layer"><div class="item" flex>\
          <a>\
          <div class="whole"><ul class="whole-progress">');
      for (var i = Math.max(gx1, gx2) ; i >= 1; i--) {
        if (i == sellLine) {
          str.push('<li class="build-m-presell" style="z-index:' + i + '"></li>')
        }
        else {
          if (gx2 >= i) {
            str.push('<li class="wall-m" style="z-index:' + i + '"></li>')
          }
          else {
            str.push('<li class="build-m" style="z-index:' + i + '"></li>')
          }
        }
      }

        str.push('<li class="build-b"></li></ul><ul class="whole-target">');
        str.push('<li class="wall-t" style="z-index:'+scope.floorData.floors+'"></li>');
      var totalFloors = scope.floorData.floors;
        while((totalFloors--)){
          if(totalFloors == sellLine){
            str.push('<li class="wall-m-presell" style="z-index:'+totalFloors+'"></li>');
          }else{
            str.push('<li class="wall-m" style="z-index:'+totalFloors+'"></li>');
          }

        }
        str.push('<li class="build-b"></li></ul></div><p>'+scope.floorData.name+'('+Math.max(gx1, gx2)+'/'+scope.floorData.floors+'层)<br/>&nbsp;'+scope.floorData.summary+'</p></a></div></div>');
      var o = $(str.join('')).appendTo(element);
      var iWinWidth = $(window).width();

      //itemp=(scope.floorNum)*18+107+34+50;
       itemp=(scope.floorNum)*17+143+50;

      iWinHeight = $(window).height()-130;
      var newobj={},iflayerWidth=0;
      newobj = api.szgc.sxtHouseService.getZ(iWinWidth,iWinHeight,scope.buildLen,500,itemp);
       //zoom = newobj.z;
        zoom = iWinHeight/newobj.y/itemp;
        iflayerWidth = (1/newobj.x)*iWinWidth;
        $('#floorlayer').css('width',100+'%');
        iFloorHeight = itemp*zoom;
        //console.log('heights',itemp,iFloorHeight,iWinHeight,newobj.z,zoom)
        $('.floor-layer').css({'height':iFloorHeight+'px','width':iflayerWidth+'px'});
        var iFh=(iFloorHeight-50)/itemp;
        $('.whole',element).css({'zoom':iFh});
        scope.$on('$destroy',function(){
          o.remove();
          $(element).remove();
        });
      })
    }
  }

})();


/**
 * Created by zhangzhaoyong on 16/1/29.
 */
(function(){
  angular
    .module('app.szgc')
    .filter('propsFilter',propsFilter);
  /** @ngInject */
  function propsFilter(){
    return function(items, props) {
      var out = [];

      if (angular.isArray(items)) {
        items.forEach(function(item) {
          var itemMatches = false;

          var keys = Object.keys(props);
          for (var i = 0; i < keys.length; i++) {
            var prop = keys[i];
            var text = props[prop].toLowerCase();
            if (item[prop] && item[prop].toString().toLowerCase().indexOf(text) !== -1) {
              itemMatches = true;
              break;
            }
          }

          if (itemMatches) {
            out.push(item);
          }
        });
      } else {
        // Let the output be the input untouched
        out = items;
      }

      return out;
    }
  }
})();

/**
 * Created by zhangzhaoyong on 16/1/28.
 */
(function(){
  angular
    .module('app.szgc')
    .filter('filterGrpWokerName',filterGrpWokerName);
  /** @ngInject */
  function filterGrpWokerName(){
    return function(value) {
      var name = "";
      if (value && value.length > 4) {
        name = value.substr(0,4) + '...';
      } else {
        name = value;
      }
      return name;
    };
  }
})();

/**
 * Created by zhangzhaoyong on 16/2/15.
 */
(function(){
  fileurl.$inject = ["sxt"];
  angular
    .module('app.szgc')
    .filter('fileurl',fileurl);
  /** @ngInject */
  function fileurl(sxt){
    return function (value) {
      return value.indexOf('base64')!=-1?value:
      sxt.app.api + (value && value.substring(0, 1) == '~' ? value.substring(1) : value);
    }
  }
})();

/**
 * Created by jiuyuong on 2016/1/21.
 */
(function ()
{
  'use strict';

  config.$inject = ["$stateProvider", "$translatePartialLoaderProvider", "msNavigationServiceProvider", "authProvider"];
  angular
    .module('app.auth', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider,authProvider)
  {
    authProvider.interceptors.push('vankeAuth');

    // State
    $stateProvider
      .state('app.auth', {
        url    : '/auth',
        views    : {
          'main@'                       : {
            templateUrl: 'app/core/layouts/content-only.html',
            controller : 'MainController as vm'
          }
        },
        abstract:true
      })
      .state('app.auth.login', {
        auth     : false,
        url      : '/login',
        views    : {
          'content@app.auth': {
            templateUrl: 'app/main/auth/login/login.html',
            controller: 'LoginController as vm'
          }
        }
      });

    // Translation
    $translatePartialLoaderProvider.addPart('app/main/auth');

    //// Navigation
    //msNavigationServiceProvider.saveItem('auth', {
    //  title : '认证',
    //  group : true,
    //  weight: 1
    //});
    //
    //msNavigationServiceProvider.saveItem('auth.login', {
    //  title    : '登录',
    //  icon     : 'icon-tile-four',
    //  state    : 'app.auth.login',
    //  weight   : 1
    //});
  }
})();

(function ()
{
  'use strict';

  vankeAuth.$inject = ["$http", "$q", "api", "sxt", "appCookie", "$rootScope", "utils"];
  angular
    .module('app.auth')
    .factory('vankeAuth', vankeAuth);

  /** @ngInject */
  function vankeAuth($http,$q,api,sxt,appCookie,$rootScope,utils)
  {
    var service = {
      token   : token,
      profile : profile,
      refresh : refresh
    };
    $rootScope.$on('user:logout',function(){
      appCookie.remove('auth');
    });
    var userInfo = api.db({
      _id:'s_userinfo',
      idField:'Id',
      mode:2,
      filter:function () {
        return true;
      },
      dataType:3
    }).bind(function () {
      return $http.get(sxt.app.api + '/api/Security/Account/UserInfo', {t: new Date().getTime()});
    });
    return service;

    function refresh(s,response) {
      return $q(function (resolve,reject) {
        var authObj = appCookie.get('auth');
        if(authObj) {
          authObj = JSON.parse (authObj);
          s.login(authObj).then(function () {
            resolve();
          }).catch(function () {
            reject(response);
          });
        }
        else{
          reject(response);
        }
      })
    }

    function token(user){
      if(user) {
        user.grant_type = 'password';
        user.scope = 'sxt';
        return $q (function (resolve,reject) {
          $http ({
            method: 'POST',
            url: sxt.app.api + '/auth/connect/token',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': 'Basic ' + btoa ('59EEDFCCB53C451488E067522992853B:9d6ab75f921942e61fb43a9b1fc25c63')
            },
            transformRequest: function (obj) {
              var str = [];
              for (var p in obj)
                str.push (encodeURIComponent (p) + "=" + encodeURIComponent (obj[p]));
              return str.join ("&");
            },
            data: user
          }).then (function (result) {
            if(result) {
              appCookie.put('auth',JSON.stringify(user));
              var token = result.data;
              resolve(token);
            }
            else{
              appCookie.remove('auth');
              reject({})
            }
          },function(){
            appCookie.remove('auth');
            resolve(user);
          });
          //
        });
      }
      else{
        return user;
      }
    }

    function profile(token){
      if(!token || !token.username) {
        return $q (function (resolve, reject) {
          //api.setNetwork(0);
          userInfo().then(function (d) {
            if(!d ||(!d.status && !d.data)){
              $rootScope.$emit('user:needlogin');
            }
            resolve(d && d.data);
            //api.resetNetwork();
          }, function (rejection) {

            utils.alert(rejection.data && rejection.data.Message?rejection.data.Message:'网络错误');
            reject(token);
          });
        });
      }
      else{
        return token;
      }
    }
  }

})();

/**
 * Created by jiuyuong on 2016/1/22.
 */

(function ()
{
    'use strict';

    LoginController.$inject = ["auth", "utils", "appCookie", "versionUpdate"];
    angular
        .module('app.auth')
        .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController(auth,utils,appCookie,versionUpdate)
    {

      var vm = this;
        // Data

        // Methods
      vm.login = function(loginForm){

        if(!vm.form || !vm.form.username || !vm.form.password){
          utils.tips('请输入您的用户名和密码');
        }
        else {
          vm.logining = '正在登录';
          auth.login (vm.form).then (function () {
            //if(vm.show) {
            //  utils.tips ('登录成功');
            //}
            vm.logining = null;
          }, function (reject) {
            utils.tips ('用户名或密码错误');
            vm.logining = null;
            vm.show = true;
          })
        }
      }
      
    }
})();

(function ()
{
    'use strict';

    angular
        .module('app.core',
            [
                'ngAnimate',
                'ngAria',
                'ngCookies',
                'ngMessages',
                'ngResource',
                'ngSanitize',
                'ngMaterial',
                'chart.js',
                'pascalprecht.translate',
                'timer',
                'ui.router',
                'textAngular',
                'ui.sortable',
                'ng-sortable',
                'xeditable',
                'moment-picker'


            ]);
})();

(function ()
{
    'use strict';

    MsWidgetController.$inject = ["$scope", "$element"];
    angular
        .module('app.core')
        .controller('MsWidgetController', MsWidgetController)
        .directive('msWidget', msWidgetDirective)
        .directive('msWidgetFront', msWidgetFrontDirective)
        .directive('msWidgetBack', msWidgetBackDirective);

    /** @ngInject */
    function MsWidgetController($scope, $element)
    {
        var vm = this;

        // Data
        vm.flipped = false;

        // Methods
        vm.flip = flip;

        //////////

        /**
         * Flip the widget
         */
        function flip()
        {
            if ( !isFlippable() )
            {
                return;
            }

            // Toggle flipped status
            vm.flipped = !vm.flipped;

            // Toggle the 'flipped' class
            $element.toggleClass('flipped', vm.flipped);
        }

        /**
         * Check if widget is flippable
         *
         * @returns {boolean}
         */
        function isFlippable()
        {
            return (angular.isDefined($scope.flippable) && $scope.flippable === true);
        }
    }

    /** @ngInject */
    function msWidgetDirective()
    {
        return {
            restrict  : 'E',
            scope     : {
                flippable: '=?'
            },
            controller: 'MsWidgetController',
            transclude: true,
            compile   : function (tElement)
            {
                tElement.addClass('ms-widget');

                return function postLink(scope, iElement, iAttrs, MsWidgetCtrl, transcludeFn)
                {
                    // Custom transclusion
                    transcludeFn(function (clone)
                    {
                        iElement.empty();
                        iElement.append(clone);
                    });

                    //////////
                };
            }
        };
    }

    /** @ngInject */
    function msWidgetFrontDirective()
    {
        return {
            restrict  : 'E',
            require   : '^msWidget',
            transclude: true,
            compile   : function (tElement)
            {
                tElement.addClass('ms-widget-front');

                return function postLink(scope, iElement, iAttrs, MsWidgetCtrl, transcludeFn)
                {
                    // Custom transclusion
                    transcludeFn(function (clone)
                    {
                        iElement.empty();
                        iElement.append(clone);
                    });

                    // Methods
                    scope.flipWidget = MsWidgetCtrl.flip;
                };
            }
        };
    }

    /** @ngInject */
    function msWidgetBackDirective()
    {
        return {
            restrict  : 'E',
            require   : '^msWidget',
            transclude: true,
            compile   : function (tElement)
            {
                tElement.addClass('ms-widget-back');

                return function postLink(scope, iElement, iAttrs, MsWidgetCtrl, transcludeFn)
                {
                    // Custom transclusion
                    transcludeFn(function (clone)
                    {
                        iElement.empty();
                        iElement.append(clone);
                    });

                    // Methods
                    scope.flipWidget = MsWidgetCtrl.flip;
                };
            }
        };
    }

})();
(function ()
{
    'use strict';

    msTimelineItemDirective.$inject = ["$timeout", "$q"];
    angular
        .module('app.core')
        .controller('MsTimelineController', MsTimelineController)
        .directive('msTimeline', msTimelineDirective)
        .directive('msTimelineItem', msTimelineItemDirective);

    /** @ngInject */
    function MsTimelineController()
    {
        var vm = this;

        // Data
        vm.scrollEl = undefined;

        // Methods
        vm.setScrollEl = setScrollEl;
        vm.getScrollEl = getScrollEl;

        //////////

        /**
         * Set scroll element
         *
         * @param scrollEl
         */
        function setScrollEl(scrollEl)
        {
            vm.scrollEl = scrollEl;
        }

        /**
         * Get scroll element
         *
         * @returns {undefined|*}
         */
        function getScrollEl()
        {
            return vm.scrollEl;
        }
    }

    /** @ngInject */
    function msTimelineDirective()
    {
        return {
            scope     : {
                loadMore: '&?msTimelineLoadMore'
            },
            controller: 'MsTimelineController',
            compile   : function (tElement)
            {
                tElement.addClass('ms-timeline');

                return function postLink(scope, iElement, iAttrs, MsTimelineCtrl)
                {
                    // Create an element for triggering the load more action and append it
                    var loadMoreEl = angular.element('<div class="ms-timeline-loader md-accent-bg md-whiteframe-4dp"><span class="spinner animate-rotate"></span></div>');
                    iElement.append(loadMoreEl);

                    // Grab the scrollable element and store it in the controller for general use
                    var scrollEl = angular.element('#content');
                    MsTimelineCtrl.setScrollEl(scrollEl);

                    // Threshold
                    var threshold = 144;

                    // Register onScroll event for the first time
                    registerOnScroll();

                    /**
                     * onScroll Event
                     */
                    function onScroll()
                    {
                        if ( scrollEl.scrollTop() + scrollEl.height() + threshold > loadMoreEl.position().top )
                        {
                            // Show the loader
                            loadMoreEl.addClass('show');

                            // Unregister scroll event to prevent triggering the function over and over again
                            unregisterOnScroll();

                            // Trigger load more event
                            scope.loadMore().then(
                                // Success
                                function ()
                                {
                                    // Hide the loader
                                    loadMoreEl.removeClass('show');

                                    // Register the onScroll event again
                                    registerOnScroll();
                                },

                                // Error
                                function ()
                                {
                                    // Remove the loader completely
                                    loadMoreEl.remove();
                                }
                            );
                        }
                    }

                    /**
                     * onScroll event registerer
                     */
                    function registerOnScroll()
                    {
                        scrollEl.on('scroll', onScroll);
                    }

                    /**
                     * onScroll event unregisterer
                     */
                    function unregisterOnScroll()
                    {
                        scrollEl.off('scroll', onScroll);
                    }

                    // Cleanup
                    scope.$on('$destroy', function ()
                    {
                        unregisterOnScroll();
                    });
                };
            }
        };
    }

    /** @ngInject */
    function msTimelineItemDirective($timeout, $q)
    {
        return {
            scope  : true,
            require: '^msTimeline',
            compile: function (tElement)
            {
                tElement.addClass('ms-timeline-item').addClass('hidden');

                return function postLink(scope, iElement, iAttrs, MsTimelineCtrl)
                {
                    var threshold = 72,
                        itemLoaded = false,
                        itemInViewport = false,
                        scrollEl = MsTimelineCtrl.getScrollEl();

                    //////////

                    init();

                    /**
                     * Initialize
                     */
                    function init()
                    {
                        // Check if the timeline item has ms-card
                        if ( iElement.find('ms-card') )
                        {
                            // If the ms-card template loaded...
                            scope.$on('msCard::cardTemplateLoaded', function (event, args)
                            {
                                var cardEl = angular.element(args[0]);

                                // Test the card to see if there is any image on it
                                testForImage(cardEl).then(function ()
                                {
                                    $timeout(function ()
                                    {
                                        itemLoaded = true;
                                    });
                                });
                            });
                        }
                        else
                        {
                            // Test the element to see if there is any image on it
                            testForImage(iElement).then(function ()
                            {
                                $timeout(function ()
                                {
                                    itemLoaded = true;
                                });
                            });
                        }

                        // Check if the loaded element also in the viewport
                        scrollEl.on('scroll', testForVisibility);

                        // Test for visibility for the first time without waiting for the scroll event
                        testForVisibility();
                    }

                    // Item ready watcher
                    var itemReadyWatcher = scope.$watch(
                        function ()
                        {
                            return itemLoaded && itemInViewport;
                        },
                        function (current, old)
                        {
                            if ( angular.equals(current, old) )
                            {
                                return;
                            }

                            if ( current )
                            {
                                iElement.removeClass('hidden').addClass('animate');

                                // Unbind itemReadyWatcher
                                itemReadyWatcher();
                            }
                        }, true);

                    /**
                     * Test the given element for image
                     *
                     * @param element
                     * @returns promise
                     */
                    function testForImage(element)
                    {
                        var deferred = $q.defer(),
                            imgEl = element.find('img');

                        if ( imgEl.length > 0 )
                        {
                            imgEl.on('load', function ()
                            {
                                deferred.resolve('Image is loaded');
                            });
                        }
                        else
                        {
                            deferred.resolve('No images');
                        }

                        return deferred.promise;
                    }

                    /**
                     * Test the element for visibility
                     */
                    function testForVisibility()
                    {
                        if ( scrollEl.scrollTop() + scrollEl.height() > iElement.position().top + threshold )
                        {
                            $timeout(function ()
                            {
                                itemInViewport = true;
                            });

                            // Unbind the scroll event
                            scrollEl.off('scroll', testForVisibility);
                        }
                    }
                };
            }
        };
    }
})();
(function ()
{
    'use strict';

    msSplashScreenDirective.$inject = ["$animate"];
    angular
        .module('app.core')
        .directive('msSplashScreen', msSplashScreenDirective);

    /** @ngInject */
    function msSplashScreenDirective($animate)
    {
        return {
            restrict: 'E',
            link    : function (scope, iElement)
            {
                var splashScreenRemoveEvent = scope.$on('msSplashScreen::remove', function ()
                {
                    $animate.leave(iElement).then(function ()
                    {
                        // De-register scope event
                        splashScreenRemoveEvent();

                        // Null-ify everything else
                        scope = iElement = null;
                    });
                });
            }
        };
    }
})();

(function ()
{
    'use strict';

    angular
        .module('app.core')
        .directive('msSidenavHelper', msSidenavHelperDirective);

    /** @ngInject */
    function msSidenavHelperDirective()
    {
        return {
            restrict: 'A',
            require : '^mdSidenav',
            link    : function (scope, iElement, iAttrs, MdSidenavCtrl)
            {
                // Watch md-sidenav open & locked open statuses
                // and add class to the ".page-layout" if only
                // the sidenav open and NOT locked open
                scope.$watch(function ()
                {
                    return MdSidenavCtrl.isOpen() && !MdSidenavCtrl.isLockedOpen();
                }, function (current)
                {
                    if ( angular.isUndefined(current) )
                    {
                        return;
                    }

                    iElement.parent().toggleClass('full-height', current);
                    angular.element('html').toggleClass('sidenav-open', current);
                });
            }
        };
    }
})();
(function ()
{
    'use strict';

    msSearchBarDirective.$inject = ["$document"];
    angular
        .module('app.core')
        .directive('msSearchBar', msSearchBarDirective);

    /** @ngInject */
    function msSearchBarDirective($document)
    {
        return {
            restrict   : 'E',
            scope      : true,
            templateUrl: 'app/core/directives/ms-search-bar/ms-search-bar.html',
            compile    : function (tElement)
            {
                // Add class
                tElement.addClass('ms-search-bar');

                return function postLink(scope, iElement)
                {
                    var expanderEl,
                        collapserEl;

                    // Initialize
                    init();

                    function init()
                    {
                        expanderEl = iElement.find('#ms-search-bar-expander');
                        collapserEl = iElement.find('#ms-search-bar-collapser');

                        expanderEl.on('click', expand);
                        collapserEl.on('click', collapse);
                    }

                    /**
                     * Expand
                     */
                    function expand()
                    {
                        iElement.addClass('expanded');

                        // Esc key event
                        $document.on('keyup', escKeyEvent);
                    }

                    /**
                     * Collapse
                     */
                    function collapse()
                    {
                        iElement.removeClass('expanded');
                    }

                    /**
                     * Escape key event
                     *
                     * @param e
                     */
                    function escKeyEvent(e)
                    {
                        if ( e.keyCode === 27 )
                        {
                            collapse();
                            $document.off('keyup', escKeyEvent);
                        }
                    }
                };
            }
        };
    }
})();
(function ()
{
    'use strict';

    msScrollDirective.$inject = ["$timeout", "msScrollConfig", "msUtils", "fuseConfig"];
    angular
        .module('app.core')
        .provider('msScrollConfig', msScrollConfigProvider)
        .directive('msScroll', msScrollDirective);

    /** @ngInject */
    function msScrollConfigProvider()
    {
        // Default configuration
        var defaultConfiguration = {
            wheelSpeed            : 1,
            wheelPropagation      : false,
            swipePropagation      : true,
            minScrollbarLength    : null,
            maxScrollbarLength    : null,
            useBothWheelAxes      : false,
            useKeyboard           : true,
            suppressScrollX       : false,
            suppressScrollY       : false,
            scrollXMarginOffset   : 0,
            scrollYMarginOffset   : 0,
            stopPropagationOnClick: true
        };

        // Methods
        this.config = config;

        //////////

        /**
         * Extend default configuration with the given one
         *
         * @param configuration
         */
        function config(configuration)
        {
            defaultConfiguration = angular.extend({}, defaultConfiguration, configuration);
        }

        /**
         * Service
         */
        this.$get = function ()
        {
            var service = {
                getConfig: getConfig
            };

            return service;

            //////////

            /**
             * Return the config
             */
            function getConfig()
            {
                return defaultConfiguration;
            }
        };
    }

    /** @ngInject */
    function msScrollDirective($timeout, msScrollConfig, msUtils, fuseConfig)
    {
        return {
            restrict: 'AE',
            compile : function (tElement)
            {
                // Do not replace scrollbars if
                // 'disableCustomScrollbars' config enabled
                if ( fuseConfig.getConfig('disableCustomScrollbars') )
                {
                    return;
                }

                // Do not replace scrollbars on mobile devices
                // if 'disableCustomScrollbarsOnMobile' config enabled
                if ( fuseConfig.getConfig('disableCustomScrollbarsOnMobile') && msUtils.isMobile() )
                {
                    return;
                }

                // Add class
                tElement.addClass('ms-scroll');

                return function postLink(scope, iElement, iAttrs)
                {
                    var options = {};

                    // If options supplied, evaluate the given
                    // value. This is because we don't want to
                    // have an isolated scope but still be able
                    // to use scope variables.
                    // We don't want an isolated scope because
                    // we should be able to use this everywhere
                    // especially with other directives
                    if ( iAttrs.msScroll )
                    {
                        options = scope.$eval(iAttrs.msScroll);
                    }

                    // Extend the given config with the ones from provider
                    options = angular.extend({}, msScrollConfig.getConfig(), options);

                    // Initialize the scrollbar
                    $timeout(function ()
                    {
                        PerfectScrollbar.initialize(iElement[0], options);
                    }, 0);

                    // Update the scrollbar on element mouseenter
                    iElement.on('mouseenter', updateScrollbar);

                    // Watch scrollHeight and update
                    // the scrollbar if it changes
                    scope.$watch(function ()
                    {
                        return iElement.prop('scrollHeight');
                    }, function (current, old)
                    {
                        if ( angular.isUndefined(current) || angular.equals(current, old) )
                        {
                            return;
                        }

                        updateScrollbar();
                    });

                    // Watch scrollWidth and update
                    // the scrollbar if it changes
                    scope.$watch(function ()
                    {
                        return iElement.prop('scrollWidth');
                    }, function (current, old)
                    {
                        if ( angular.isUndefined(current) || angular.equals(current, old) )
                        {
                            return;
                        }

                        updateScrollbar();
                    });

                    /**
                     * Update the scrollbar
                     */
                    function updateScrollbar()
                    {
                        PerfectScrollbar.update(iElement[0]);
                    }

                    // Cleanup on destroy
                    scope.$on('$destroy', function ()
                    {
                        iElement.off('mouseenter');
                        PerfectScrollbar.destroy(iElement[0]);
                    });
                };
            }
        };
    }
})();
(function ()
{
    'use strict';

    angular
        .module('app.core')
        .directive('msResponsiveTable', msResponsiveTableDirective);

    /** @ngInject */
    function msResponsiveTableDirective()
    {
        return {
            restrict: 'A',
            link    : function (scope, iElement)
            {
                // Wrap the table
                var wrapper = angular.element('<div class="ms-responsive-table-wrapper"></div>');
                iElement.after(wrapper);
                wrapper.append(iElement);

                //////////
            }
        };
    }
})();
(function ()
{
    'use strict';

    angular
        .module('app.core')
        .directive('msRandomClass', msRandomClassDirective);

    /** @ngInject */
    function msRandomClassDirective()
    {
        return {
            restrict: 'A',
            scope   : {
                msRandomClass: '='
            },
            link    : function (scope, iElement)
            {
                var randomClass = scope.msRandomClass[Math.floor(Math.random() * (scope.msRandomClass.length))];
                iElement.addClass(randomClass);
            }
        };
    }
})();
(function ()
{
    'use strict';

    msNavIsFoldedDirective.$inject = ["$document", "$rootScope", "msNavFoldService"];
    msNavDirective.$inject = ["$rootScope", "$mdComponentRegistry", "msNavFoldService"];
    msNavToggleDirective.$inject = ["$rootScope", "$q", "$animate", "$state"];
    angular
        .module('app.core')
        .factory('msNavFoldService', msNavFoldService)
        .directive('msNavIsFolded', msNavIsFoldedDirective)
        .controller('MsNavController', MsNavController)
        .directive('msNav', msNavDirective)
        .directive('msNavTitle', msNavTitleDirective)
        .directive('msNavButton', msNavButtonDirective)
        .directive('msNavToggle', msNavToggleDirective);

    /** @ngInject */
    function msNavFoldService()
    {
        var foldable = {};

        var service = {
            setFoldable    : setFoldable,
            isNavFoldedOpen: isNavFoldedOpen,
            toggleFold     : toggleFold,
            openFolded     : openFolded,
            closeFolded    : closeFolded
        };

        return service;

        //////////

        /**
         * Set the foldable
         *
         * @param scope
         * @param element
         */
        function setFoldable(scope, element)
        {
            foldable = {
                'scope'  : scope,
                'element': element
            };
        }

        /**
         * Is folded open
         */
        function isNavFoldedOpen()
        {
            return foldable.scope.isNavFoldedOpen();
        }

        /**
         * Toggle fold
         */
        function toggleFold()
        {
            foldable.scope.toggleFold();
        }

        /**
         * Open folded navigation
         */
        function openFolded()
        {
            foldable.scope.openFolded();
        }

        /**
         * Close folded navigation
         */
        function closeFolded()
        {
            foldable.scope.closeFolded();
        }
    }

    /** @ngInject */
    function msNavIsFoldedDirective($document, $rootScope, msNavFoldService)
    {
        return {
            restrict: 'A',
            link    : function (scope, iElement, iAttrs)
            {
                var isFolded = (iAttrs.msNavIsFolded === 'true'),
                    isFoldedOpen = false,
                    body = angular.element($document[0].body),
                    openOverlay = angular.element('<div id="ms-nav-fold-open-overlay"></div>'),
                    closeOverlay = angular.element('<div id="ms-nav-fold-close-overlay"></div>'),
                    sidenavEl = iElement.parent();

                // Initialize the service
                msNavFoldService.setFoldable(scope, iElement, isFolded);

                // Set the fold status for the first time
                if ( isFolded )
                {
                    fold();
                }
                else
                {
                    unfold();
                }

                /**
                 * Is nav folded open
                 */
                function isNavFoldedOpen()
                {
                    return isFoldedOpen;
                }

                /**
                 * Toggle fold
                 */
                function toggleFold()
                {
                    isFolded = !isFolded;

                    if ( isFolded )
                    {
                        fold();
                    }
                    else
                    {
                        unfold();
                    }
                }

                /**
                 * Fold the navigation
                 */
                function fold()
                {
                    // Add classes
                    body.addClass('ms-nav-folded');

                    // Collapse everything and scroll to the top
                    $rootScope.$broadcast('msNav::forceCollapse');
                    iElement.scrollTop(0);

                    // Append the openOverlay to the element
                    sidenavEl.append(openOverlay);

                    // Event listeners
                    openOverlay.on('mouseenter touchstart', function (event)
                    {
                        openFolded(event);
                        isFoldedOpen = true;
                    });
                }

                /**
                 * Open folded navigation
                 */
                function openFolded(event)
                {
                    if ( angular.isDefined(event) )
                    {
                        event.preventDefault();
                    }

                    body.addClass('ms-nav-folded-open');

                    // Update the location
                    $rootScope.$broadcast('msNav::expandMatchingToggles');

                    // Remove open overlay
                    sidenavEl.find(openOverlay).remove();

                    // Append close overlay and bind its events
                    sidenavEl.parent().append(closeOverlay);
                    closeOverlay.on('mouseenter touchstart', function (event)
                    {
                        closeFolded(event);
                        isFoldedOpen = false;
                    });
                }

                /**
                 * Close folded navigation
                 */
                function closeFolded(event)
                {
                    if ( angular.isDefined(event) )
                    {
                        event.preventDefault();
                    }

                    // Collapse everything and scroll to the top
                    $rootScope.$broadcast('msNav::forceCollapse');
                    iElement.scrollTop(0);

                    body.removeClass('ms-nav-folded-open');

                    // Remove close overlay
                    sidenavEl.parent().find(closeOverlay).remove();

                    // Append open overlay and bind its events
                    sidenavEl.append(openOverlay);
                    openOverlay.on('mouseenter touchstart', function (event)
                    {
                        openFolded(event);
                        isFoldedOpen = true;
                    });
                }

                /**
                 * Unfold the navigation
                 */
                function unfold()
                {
                    body.removeClass('ms-nav-folded ms-nav-folded-open');

                    // Update the location
                    $rootScope.$broadcast('msNav::expandMatchingToggles');

                    iElement.off('mouseenter mouseleave');
                }

                // Expose functions to the scope
                scope.toggleFold = toggleFold;
                scope.openFolded = openFolded;
                scope.closeFolded = closeFolded;
                scope.isNavFoldedOpen = isNavFoldedOpen;

                // Cleanup
                scope.$on('$destroy', function ()
                {
                    openOverlay.off('mouseenter touchstart');
                    closeOverlay.off('mouseenter touchstart');
                    iElement.off('mouseenter mouseleave');
                });
            }
        };
    }


    /** @ngInject */
    function MsNavController()
    {
        var vm = this,
            disabled = false,
            toggleItems = [],
            lockedItems = [];

        // Data

        // Methods
        vm.isDisabled = isDisabled;
        vm.enable = enable;
        vm.disable = disable;
        vm.setToggleItem = setToggleItem;
        vm.getLockedItems = getLockedItems;
        vm.setLockedItem = setLockedItem;
        vm.clearLockedItems = clearLockedItems;

        //////////

        /**
         * Is navigation disabled
         *
         * @returns {boolean}
         */
        function isDisabled()
        {
            return disabled;
        }

        /**
         * Disable the navigation
         */
        function disable()
        {
            disabled = true;
        }

        /**
         * Enable the navigation
         */
        function enable()
        {
            disabled = false;
        }

        /**
         * Set toggle item
         *
         * @param element
         * @param scope
         */
        function setToggleItem(element, scope)
        {
            toggleItems.push({
                'element': element,
                'scope'  : scope
            });
        }

        /**
         * Get locked items
         *
         * @returns {Array}
         */
        function getLockedItems()
        {
            return lockedItems;
        }

        /**
         * Set locked item
         *
         * @param element
         * @param scope
         */
        function setLockedItem(element, scope)
        {
            lockedItems.push({
                'element': element,
                'scope'  : scope
            });
        }

        /**
         * Clear locked items list
         */
        function clearLockedItems()
        {
            lockedItems = [];
        }
    }

    /** @ngInject */
    function msNavDirective($rootScope, $mdComponentRegistry, msNavFoldService)
    {
        return {
            restrict  : 'E',
            scope     : {},
            controller: 'MsNavController',
            compile   : function (tElement)
            {
                tElement.addClass('ms-nav');

                return function postLink(scope)
                {
                    // Update toggle status according to the ui-router current state
                    $rootScope.$broadcast('msNav::expandMatchingToggles');

                    // Update toggles on state changes
                    var stateChangeSuccessEvent = $rootScope.$on('$stateChangeSuccess', function ()
                    {
                        $rootScope.$broadcast('msNav::expandMatchingToggles');

                        // Close navigation sidenav on stateChangeSuccess
                        $mdComponentRegistry.when('navigation').then(function (navigation)
                        {
                            navigation.close();

                            if ( msNavFoldService.isNavFoldedOpen() )
                            {
                                msNavFoldService.closeFolded();
                            }
                        });
                    });

                    // Cleanup
                    scope.$on('$destroy', function ()
                    {
                        stateChangeSuccessEvent();
                    })
                };
            }
        };
    }

    /** @ngInject */
    function msNavTitleDirective()
    {
        return {
            restrict: 'A',
            compile : function (tElement)
            {
                tElement.addClass('ms-nav-title');

                return function postLink()
                {

                };
            }
        };
    }

    /** @ngInject */
    function msNavButtonDirective()
    {
        return {
            restrict: 'AE',
            compile : function (tElement)
            {
                tElement.addClass('ms-nav-button');

                return function postLink()
                {

                };
            }
        };
    }

    /** @ngInject */
    function msNavToggleDirective($rootScope, $q, $animate, $state)
    {
        return {
            restrict: 'A',
            require : '^msNav',
            scope   : true,
            compile : function (tElement, tAttrs)
            {
                tElement.addClass('ms-nav-toggle');

                // Add collapsed attr
                if ( angular.isUndefined(tAttrs.collapsed) )
                {
                    tAttrs.collapsed = true;
                }

                tElement.attr('collapsed', tAttrs.collapsed);

                return function postLink(scope, iElement, iAttrs, MsNavCtrl)
                {
                    var classes = {
                        expanded         : 'expanded',
                        expandAnimation  : 'expand-animation',
                        collapseAnimation: 'collapse-animation'
                    };

                    // Store all related states
                    var links = iElement.find('a');
                    var states = [];
                    var regExp = /\(.*\)/g;

                    angular.forEach(links, function (link)
                    {
                        var state = angular.element(link).attr('ui-sref');

                        if ( angular.isUndefined(state) )
                        {
                            return;
                        }

                        // Remove any parameter definition from the state name before storing it
                        state = state.replace(regExp, '');

                        states.push(state);
                    });

                    // Store toggle-able element and its scope in the main nav controller
                    MsNavCtrl.setToggleItem(iElement, scope);

                    // Click handler
                    iElement.children('.ms-nav-button').on('click', toggle);

                    // Toggle function
                    function toggle()
                    {
                        // If navigation is disabled, do nothing...
                        if ( MsNavCtrl.isDisabled() )
                        {
                            return;
                        }

                        // Disable the entire navigation to prevent spamming
                        MsNavCtrl.disable();

                        if ( isCollapsed() )
                        {
                            // Clear the locked items list
                            MsNavCtrl.clearLockedItems();

                            // Emit pushToLockedList event
                            scope.$emit('msNav::pushToLockedList');

                            // Collapse everything but locked items
                            $rootScope.$broadcast('msNav::collapse');

                            // Expand and then...
                            expand().then(function ()
                            {
                                // Enable the entire navigation after animations completed
                                MsNavCtrl.enable();
                            });
                        }
                        else
                        {
                            // Collapse with all children
                            scope.$broadcast('msNav::forceCollapse');
                        }
                    }

                    // Cleanup
                    scope.$on('$destroy', function ()
                    {
                        iElement.children('.ms-nav-button').off('click');
                    });

                    /*---------------------*/
                    /* Scope Events        */
                    /*---------------------*/

                    /**
                     * Collapse everything but locked items
                     */
                    scope.$on('msNav::collapse', function ()
                    {
                        // Only collapse toggles that are not locked
                        var lockedItems = MsNavCtrl.getLockedItems();
                        var locked = false;

                        angular.forEach(lockedItems, function (lockedItem)
                        {
                            if ( angular.equals(lockedItem.scope, scope) )
                            {
                                locked = true;
                            }
                        });

                        if ( locked )
                        {
                            return;
                        }

                        // Collapse and then...
                        collapse().then(function ()
                        {
                            // Enable the entire navigation after animations completed
                            MsNavCtrl.enable();
                        });
                    });

                    /**
                     * Collapse everything
                     */
                    scope.$on('msNav::forceCollapse', function ()
                    {
                        // Collapse and then...
                        collapse().then(function ()
                        {
                            // Enable the entire navigation after animations completed
                            MsNavCtrl.enable();
                        });
                    });

                    /**
                     * Expand toggles that match with the current states
                     */
                    scope.$on('msNav::expandMatchingToggles', function ()
                    {
                        var currentState = $state.current.name;
                        var shouldExpand = false;

                        angular.forEach(states, function (state)
                        {
                            if ( currentState === state )
                            {
                                shouldExpand = true;
                            }
                        });

                        if ( shouldExpand )
                        {
                            expand();
                        }
                        else
                        {
                            collapse();
                        }
                    });

                    /**
                     * Add toggle to the locked list
                     */
                    scope.$on('msNav::pushToLockedList', function ()
                    {
                        // Set expanded item on main nav controller
                        MsNavCtrl.setLockedItem(iElement, scope);
                    });

                    /*---------------------*/
                    /* Internal functions  */
                    /*---------------------*/

                    /**
                     * Is element collapsed
                     *
                     * @returns {bool}
                     */
                    function isCollapsed()
                    {
                        return iElement.attr('collapsed') === 'true';
                    }

                    /**
                     * Is element expanded
                     *
                     * @returns {bool}
                     */
                    function isExpanded()
                    {
                        return !isCollapsed();
                    }

                    /**
                     * Expand the toggle
                     *
                     * @returns $promise
                     */
                    function expand()
                    {
                        // Create a new deferred object
                        var deferred = $q.defer();

                        // If the menu item is already expanded, do nothing..
                        if ( isExpanded() )
                        {
                            // Reject the deferred object
                            deferred.reject({'error': true});

                            // Return the promise
                            return deferred.promise;
                        }

                        // Set element attr
                        iElement.attr('collapsed', false);

                        // Grab the element to expand
                        var elementToExpand = angular.element(iElement.find('ms-nav-toggle-items')[0]);

                        // Move the element out of the dom flow and
                        // make it block so we can get its height
                        elementToExpand.css({
                            'position'  : 'absolute',
                            'visibility': 'hidden',
                            'display'   : 'block',
                            'height'    : 'auto'
                        });

                        // Grab the height
                        var height = elementToExpand[0].offsetHeight;

                        // Reset the style modifications
                        elementToExpand.css({
                            'position'  : '',
                            'visibility': '',
                            'display'   : '',
                            'height'    : ''
                        });

                        // Animate the height
                        scope.$evalAsync(function ()
                        {
                            $animate.animate(elementToExpand,
                                {
                                    'display': 'block',
                                    'height' : '0px'
                                },
                                {
                                    'height': height + 'px'
                                },
                                classes.expandAnimation
                            ).then(
                                function ()
                                {
                                    // Add expanded class
                                    elementToExpand.addClass(classes.expanded);

                                    // Clear the inline styles after animation done
                                    elementToExpand.css({'height': ''});

                                    // Resolve the deferred object
                                    deferred.resolve({'success': true});
                                }
                            );
                        });

                        // Return the promise
                        return deferred.promise;
                    }

                    /**
                     * Collapse the toggle
                     *
                     * @returns $promise
                     */
                    function collapse()
                    {
                        // Create a new deferred object
                        var deferred = $q.defer();

                        // If the menu item is already collapsed, do nothing..
                        if ( isCollapsed() )
                        {
                            // Reject the deferred object
                            deferred.reject({'error': true});

                            // Return the promise
                            return deferred.promise;
                        }

                        // Set element attr
                        iElement.attr('collapsed', true);

                        // Grab the element to collapse
                        var elementToCollapse = angular.element(iElement.find('ms-nav-toggle-items')[0]);

                        // Grab the height
                        var height = elementToCollapse[0].offsetHeight;

                        // Animate the height
                        scope.$evalAsync(function ()
                        {
                            $animate.animate(elementToCollapse,
                                {
                                    'height': height + 'px'
                                },
                                {
                                    'height': '0px'
                                },
                                classes.collapseAnimation
                            ).then(
                                function ()
                                {
                                    // Remove expanded class
                                    elementToCollapse.removeClass(classes.expanded);

                                    // Clear the inline styles after animation done
                                    elementToCollapse.css({
                                        'display': '',
                                        'height' : ''
                                    });

                                    // Resolve the deferred object
                                    deferred.resolve({'success': true});
                                }
                            );
                        });

                        // Return the promise
                        return deferred.promise;
                    }
                };
            }
        };
    }
})();
(function ()
{
    'use strict';

    MsNavigationController.$inject = ["$scope", "msNavigationService"];
    msNavigationDirective.$inject = ["$rootScope", "$timeout", "$mdSidenav", "msNavigationService"];
    MsNavigationNodeController.$inject = ["$scope", "$element", "$rootScope", "$animate", "$state", "msNavigationService"];
    msNavigationHorizontalDirective.$inject = ["msNavigationService"];
    MsNavigationHorizontalNodeController.$inject = ["$scope", "$element", "$rootScope", "$state", "msNavigationService"];
    msNavigationHorizontalItemDirective.$inject = ["$mdMedia"];
    angular
        .module('app.core')
        .provider('msNavigationService', msNavigationServiceProvider)
        .controller('MsNavigationController', MsNavigationController)
        // Vertical
        .directive('msNavigation', msNavigationDirective)
        .controller('MsNavigationNodeController', MsNavigationNodeController)
        .directive('msNavigationNode', msNavigationNodeDirective)
        .directive('msNavigationItem', msNavigationItemDirective)
        //Horizontal
        .directive('msNavigationHorizontal', msNavigationHorizontalDirective)
        .controller('MsNavigationHorizontalNodeController', MsNavigationHorizontalNodeController)
        .directive('msNavigationHorizontalNode', msNavigationHorizontalNodeDirective)
        .directive('msNavigationHorizontalItem', msNavigationHorizontalItemDirective);

    /** @ngInject */
    function msNavigationServiceProvider()
    {
        // Inject $log service
        var $log = angular.injector(['ng']).get('$log');

        // Navigation array
        var navigation = [];

        var service = this;

        // Methods
        service.saveItem = saveItem;
        service.deleteItem = deleteItem;
        service.sortByWeight = sortByWeight;

        //////////

        /**
         * Create or update the navigation item
         *
         * @param path
         * @param item
         */
        function saveItem(path, item)
        {
            if ( !angular.isString(path) )
            {
                $log.error('path must be a string (eg. `dashboard.project`)');
                return;
            }

            var parts = path.split('.');

            // Generate the object id from the parts
            var id = parts[parts.length - 1];

            // Get the parent item from the parts
            var parent = _findOrCreateParent(parts);

            // Decide if we are going to update or create
            var updateItem = false;

            for ( var i = 0; i < parent.length; i++ )
            {
                if ( parent[i]._id === id )
                {
                    updateItem = parent[i];

                    break;
                }
            }

            // Update
            if ( updateItem )
            {
                angular.extend(updateItem, item);

                // Add proper ui-sref
                updateItem.uisref = _getUiSref(updateItem);
            }
            // Create
            else
            {
                // Create an empty children array in the item
                item.children = [];

                // Add the default weight if not provided or if it's not a number
                if ( angular.isUndefined(item.weight) || !angular.isNumber(item.weight) )
                {
                    item.weight = 1;
                }

                // Add the item id
                item._id = id;

                // Add the item path
                item._path = path;

                // Add proper ui-sref
                item.uisref = _getUiSref(item);

                // Push the item into the array
                parent.push(item);
            }
        }

        /**
         * Delete navigation item
         *
         * @param path
         */
        function deleteItem(path)
        {
            if ( !angular.isString(path) )
            {
                $log.error('path must be a string (eg. `dashboard.project`)');
                return;
            }

            // Locate the item by using given path
            var item = navigation,
                parts = path.split('.');

            for ( var p = 0; p < parts.length; p++ )
            {
                var id = parts[p];

                for ( var i = 0; i < item.length; i++ )
                {
                    if ( item[i]._id === id )
                    {
                        // If we have a matching path,
                        // we have found our object:
                        // remove it.
                        if ( item[i]._path === path )
                        {
                            item.splice(i, 1);
                            return true;
                        }

                        // Otherwise grab the children of
                        // the current item and continue
                        item = item[i].children;
                        break;
                    }
                }
            }

            return false;
        }

        /**
         * Sort the navigation items by their weights
         *
         * @param parent
         */
        function sortByWeight(parent)
        {
            // If parent not provided, sort the root items
            if ( !parent )
            {
                parent = navigation;
                parent.sort(_byWeight);
            }

            // Sort the children
            for ( var i = 0; i < parent.length; i++ )
            {
                var children = parent[i].children;

                if ( children.length > 1 )
                {
                    children.sort(_byWeight);
                }

                if ( children.length > 0 )
                {
                    sortByWeight(children);
                }
            }
        }

        /* ----------------- */
        /* Private Functions */
        /* ----------------- */

        /**
         * Find or create parent
         *
         * @param parts
         * @returns {Array|Boolean}
         * @private
         */
        function _findOrCreateParent(parts)
        {
            // Store the main navigation
            var parent = navigation;

            // If it's going to be a root item
            // return the navigation itself
            if ( parts.length === 1 )
            {
                return parent;
            }

            // Remove the last element from the parts as
            // we don't need that to figure out the parent
            parts.pop();

            // Find and return the parent
            for ( var i = 0; i < parts.length; i++ )
            {
                var _id = parts[i],
                    createParent = true;

                for ( var p = 0; p < parent.length; p++ )
                {
                    if ( parent[p]._id === _id )
                    {
                        parent = parent[p].children;
                        createParent = false;

                        break;
                    }
                }

                // If there is no parent found, create one, push
                // it into the current parent and assign it as a
                // new parent
                if ( createParent )
                {
                    var item = {
                        _id     : _id,
                        _path   : parts.join('.'),
                        title   : _id,
                        weight  : 1,
                        children: []
                    };

                    parent.push(item);
                    parent = item.children;
                }
            }

            return parent;
        }

        /**
         * Sort by weight
         *
         * @param x
         * @param y
         * @returns {number}
         * @private
         */
        function _byWeight(x, y)
        {
            return parseInt(x.weight) - parseInt(y.weight);
        }

        /**
         * Setup the ui-sref using state & state parameters
         *
         * @param item
         * @returns {string}
         * @private
         */
        function _getUiSref(item)
        {
            var uisref = '';

            if ( angular.isDefined(item.state) )
            {
                uisref = item.state;

                if ( angular.isDefined(item.stateParams) && angular.isObject(item.stateParams) )
                {
                    uisref = uisref + '(' + angular.toString(item.stateParams) + ')';
                }
            }

            return uisref;
        }

        /* ----------------- */
        /* Service           */
        /* ----------------- */

        this.$get = function ()
        {
            var activeItem = null,
                navigationScope = null,
                folded = null,
                foldedOpen = null;

            var service = {
                saveItem           : saveItem,
                deleteItem         : deleteItem,
                sort               : sortByWeight,
                setActiveItem      : setActiveItem,
                getActiveItem      : getActiveItem,
                getNavigationObject: getNavigationObject,
                setNavigationScope : setNavigationScope,
                setFolded          : setFolded,
                getFolded          : getFolded,
                setFoldedOpen      : setFoldedOpen,
                getFoldedOpen      : getFoldedOpen,
                toggleFolded       : toggleFolded
            };

            return service;

            //////////

            /**
             * Set active item
             *
             * @param node
             * @param scope
             */
            function setActiveItem(node, scope)
            {
                activeItem = {
                    node : node,
                    scope: scope
                };
            }

            /**
             * Return active item
             */
            function getActiveItem()
            {
                return activeItem;
            }

            /**
             * Return navigation object
             *
             * @param root
             * @returns {Array}
             */
            function getNavigationObject(root)
            {
                if ( root )
                {
                    for ( var i = 0; i < navigation.length; i++ )
                    {
                        if ( navigation[i]._id === root )
                        {
                            return [navigation[i]];
                        }
                    }
                }

                return navigation;
            }

            /**
             * Store navigation's scope for later use
             *
             * @param scope
             */
            function setNavigationScope(scope)
            {
                navigationScope = scope;
            }

            /**
             * Set folded status
             *
             * @param status
             */
            function setFolded(status)
            {
                folded = status;
            }

            /**
             * Return folded status
             *
             * @returns {*}
             */
            function getFolded()
            {
                return folded;
            }

            /**
             * Set folded open status
             *
             * @param status
             */
            function setFoldedOpen(status)
            {
                foldedOpen = status;
            }

            /**
             * Return folded open status
             *
             * @returns {*}
             */
            function getFoldedOpen()
            {
                return foldedOpen;
            }


            /**
             * Toggle fold on stored navigation's scope
             */
            function toggleFolded()
            {
                navigationScope.toggleFolded();
            }
        };
    }

    /** @ngInject */
    function MsNavigationController($scope, msNavigationService)
    {
        var vm = this;

        // Data
        if ( $scope.root )
        {
            vm.navigation = msNavigationService.getNavigationObject($scope.root);
        }
        else
        {
            vm.navigation = msNavigationService.getNavigationObject();
        }

        // Methods
        vm.toggleHorizontalMobileMenu = toggleHorizontalMobileMenu;

        //////////

        init();

        /**
         * Initialize
         */
        function init()
        {
            // Sort the navigation before doing anything else
            msNavigationService.sort();
        }

        /**
         * Toggle horizontal mobile menu
         */
        function toggleHorizontalMobileMenu()
        {
            angular.element('body').toggleClass('ms-navigation-horizontal-mobile-menu-active');
        }
    }

    /** @ngInject */
    function msNavigationDirective($rootScope, $timeout, $mdSidenav, msNavigationService)
    {
        return {
            restrict   : 'E',
            scope      : {
                folded: '=',
                root  : '@'
            },
            controller : 'MsNavigationController as vm',
            templateUrl: 'app/core/directives/ms-navigation/templates/vertical.html',
            transclude : true,
            compile    : function (tElement)
            {
                tElement.addClass('ms-navigation');

                return function postLink(scope, iElement)
                {
                    var bodyEl = angular.element('body'),
                        foldExpanderEl = angular.element('<div id="ms-navigation-fold-expander"></div>'),
                        foldCollapserEl = angular.element('<div id="ms-navigation-fold-collapser"></div>'),
                        sidenav = $mdSidenav('navigation');

                    // Store the navigation in the service for public access
                    msNavigationService.setNavigationScope(scope);

                    // Initialize
                    init();

                    /**
                     * Initialize
                     */
                    function init()
                    {
                        // Set the folded status for the first time.
                        // First, we have to check if we have a folded
                        // status available in the service already. This
                        // will prevent navigation to act weird if we already
                        // set the fold status, remove the navigation and
                        // then re-initialize it, which happens if we
                        // change to a view without a navigation and then
                        // come back with history.back() function.

                        // If the service didn't initialize before, set
                        // the folded status from scope, otherwise we
                        // won't touch anything because the folded status
                        // already set in the service...
                        if ( msNavigationService.getFolded() === null )
                        {
                            msNavigationService.setFolded(scope.folded);
                        }

                        if ( msNavigationService.getFolded() )
                        {
                            // Collapse everything.
                            // This must be inside a $timeout because by the
                            // time we call this, the 'msNavigation::collapse'
                            // event listener is not registered yet. $timeout
                            // will ensure that it will be called after it is
                            // registered.
                            $timeout(function ()
                            {
                                $rootScope.$broadcast('msNavigation::collapse');
                            });

                            // Add class to the body
                            bodyEl.addClass('ms-navigation-folded');

                            // Set fold expander
                            setFoldExpander();
                        }
                    }

                    // Sidenav locked open status watcher
                    scope.$watch(function ()
                    {
                        return sidenav.isLockedOpen();
                    }, function (current, old)
                    {
                        if ( angular.isUndefined(current) || angular.equals(current, old) )
                        {
                            return;
                        }

                        var folded = msNavigationService.getFolded();

                        if ( folded )
                        {
                            if ( current )
                            {
                                // Collapse everything
                                $rootScope.$broadcast('msNavigation::collapse');
                            }
                            else
                            {
                                // Expand the active one and its parents
                                var activeItem = msNavigationService.getActiveItem();
                                if ( activeItem )
                                {
                                    activeItem.scope.$emit('msNavigation::stateMatched');
                                }
                            }
                        }
                    });

                    // Folded status watcher
                    scope.$watch('folded', function (current, old)
                    {
                        if ( angular.isUndefined(current) || angular.equals(current, old) )
                        {
                            return;
                        }

                        setFolded(current);
                    });

                    /**
                     * Set folded status
                     *
                     * @param folded
                     */
                    function setFolded(folded)
                    {
                        // Store folded status on the service for global access
                        msNavigationService.setFolded(folded);

                        if ( folded )
                        {
                            // Collapse everything
                            $rootScope.$broadcast('msNavigation::collapse');

                            // Add class to the body
                            bodyEl.addClass('ms-navigation-folded');

                            // Set fold expander
                            setFoldExpander();
                        }
                        else
                        {
                            // Expand the active one and its parents
                            var activeItem = msNavigationService.getActiveItem();
                            if ( activeItem )
                            {
                                activeItem.scope.$emit('msNavigation::stateMatched');
                            }

                            // Remove body class
                            bodyEl.removeClass('ms-navigation-folded ms-navigation-folded-open');

                            // Remove fold collapser
                            removeFoldCollapser();
                        }
                    }

                    /**
                     * Set fold expander
                     */
                    function setFoldExpander()
                    {
                        iElement.parent().append(foldExpanderEl);

                        // Let everything settle for a moment
                        // before registering the event listener
                        $timeout(function ()
                        {
                            foldExpanderEl.on('mouseenter touchstart', onFoldExpanderHover);
                        });
                    }

                    /**
                     * Set fold collapser
                     */
                    function setFoldCollapser()
                    {
                        bodyEl.find('#main').append(foldCollapserEl);
                        foldCollapserEl.on('mouseenter touchstart', onFoldCollapserHover);
                    }

                    /**
                     * Remove fold collapser
                     */
                    function removeFoldCollapser()
                    {
                        foldCollapserEl.remove();
                    }

                    /**
                     * onHover event of foldExpander
                     */
                    function onFoldExpanderHover(event)
                    {
                        if ( event )
                        {
                            event.preventDefault();
                        }

                        // Set folded open status
                        msNavigationService.setFoldedOpen(true);

                        // Expand the active one and its parents
                        var activeItem = msNavigationService.getActiveItem();
                        if ( activeItem )
                        {
                            activeItem.scope.$emit('msNavigation::stateMatched');
                        }

                        // Add class to the body
                        bodyEl.addClass('ms-navigation-folded-open');

                        // Remove the fold opener
                        foldExpanderEl.remove();

                        // Set fold collapser
                        setFoldCollapser();
                    }

                    /**
                     * onHover event of foldCollapser
                     */
                    function onFoldCollapserHover(event)
                    {
                        if ( event )
                        {
                            event.preventDefault();
                        }

                        // Set folded open status
                        msNavigationService.setFoldedOpen(false);

                        // Collapse everything
                        $rootScope.$broadcast('msNavigation::collapse');

                        // Remove body class
                        bodyEl.removeClass('ms-navigation-folded-open');

                        // Remove the fold collapser
                        foldCollapserEl.remove();

                        // Set fold expander
                        setFoldExpander();
                    }

                    /**
                     * Public access for toggling folded status externally
                     */
                    scope.toggleFolded = function ()
                    {
                        var folded = msNavigationService.getFolded();

                        setFolded(!folded);
                    };

                    /**
                     * On $stateChangeStart
                     */
                    scope.$on('$stateChangeStart', function ()
                    {
                        // Close the sidenav
                        sidenav.close();

                        // If navigation is folded open, close it
                        if ( msNavigationService.getFolded() )
                        {
                            onFoldCollapserHover();
                        }
                    });

                    // Cleanup
                    scope.$on('$destroy', function ()
                    {
                        foldCollapserEl.off('mouseenter touchstart');
                        foldExpanderEl.off('mouseenter touchstart');
                    });
                };
            }
        };
    }

    /** @ngInject */
    function MsNavigationNodeController($scope, $element, $rootScope, $animate, $state, msNavigationService)
    {
        var vm = this;

        // Data
        vm.element = $element;
        vm.node = $scope.node;
        vm.hasChildren = undefined;
        vm.collapsed = undefined;
        vm.collapsable = undefined;
        vm.group = undefined;
        vm.animateHeightClass = 'animate-height';

        // Methods
        vm.toggleCollapsed = toggleCollapsed;
        vm.collapse = collapse;
        vm.expand = expand;
        vm.getClass = getClass;

        //////////

        init();

        /**
         * Initialize
         */
        function init()
        {
            // Setup the initial values

            // Has children?
            vm.hasChildren = vm.node.children.length > 0;

            // Is group?
            vm.group = !!(angular.isDefined(vm.node.group) && vm.node.group === true);

            // Is collapsable?
            if ( !vm.hasChildren || vm.group )
            {
                vm.collapsable = false;
            }
            else
            {
                vm.collapsable = !!(angular.isUndefined(vm.node.collapsable) || typeof vm.node.collapsable !== 'boolean' || vm.node.collapsable === true);
            }

            // Is collapsed?
            if ( !vm.collapsable )
            {
                vm.collapsed = false;
            }
            else
            {
                vm.collapsed = !!(angular.isUndefined(vm.node.collapsed) || typeof vm.node.collapsed !== 'boolean' || vm.node.collapsed === true);
            }

            // Expand all parents if we have a matching state or
            // the current state is a child of the node's state
            if ( vm.node.state === $state.current.name || $state.includes(vm.node.state) )
            {
                // If state params are defined, make sure they are
                // equal, otherwise do not set the active item
                if ( angular.isDefined(vm.node.stateParams) && angular.isDefined($state.params) && !angular.equals(vm.node.stateParams, $state.params) )
                {
                    return;
                }

                $scope.$emit('msNavigation::stateMatched');

                // Also store the current active menu item
                msNavigationService.setActiveItem(vm.node, $scope);
            }

            $scope.$on('msNavigation::stateMatched', function ()
            {
                // Expand if the current scope is collapsable and is collapsed
                if ( vm.collapsable && vm.collapsed )
                {
                    $scope.$evalAsync(function ()
                    {
                        vm.collapsed = false;
                    });
                }
            });

            // Listen for collapse event
            $scope.$on('msNavigation::collapse', function (event, path)
            {
                if ( vm.collapsed || !vm.collapsable )
                {
                    return;
                }

                // If there is no path defined, collapse
                if ( angular.isUndefined(path) )
                {
                    vm.collapse();
                }
                // If there is a path defined, do not collapse
                // the items that are inside that path. This will
                // prevent parent items from collapsing
                else
                {
                    var givenPathParts = path.split('.'),
                        activePathParts = [];

                    var activeItem = msNavigationService.getActiveItem();
                    if ( activeItem )
                    {
                        activePathParts = activeItem.node._path.split('.');
                    }

                    // Test for given path
                    if ( givenPathParts.indexOf(vm.node._id) > -1 )
                    {
                        return;
                    }

                    // Test for active path
                    if ( activePathParts.indexOf(vm.node._id) > -1 )
                    {
                        return;
                    }

                    vm.collapse();
                }
            });

            // Listen for $stateChangeSuccess event
            $scope.$on('$stateChangeSuccess', function ()
            {
                if ( vm.node.state === $state.current.name )
                {
                    // If state params are defined, make sure they are
                    // equal, otherwise do not set the active item
                    if ( angular.isDefined(vm.node.stateParams) && angular.isDefined($state.params) && !angular.equals(vm.node.stateParams, $state.params) )
                    {
                        return;
                    }

                    // Update active item on state change
                    msNavigationService.setActiveItem(vm.node, $scope);

                    // Collapse everything except the one we're using
                    $rootScope.$broadcast('msNavigation::collapse', vm.node._path);
                }
            });
        }

        /**
         * Toggle collapsed
         */
        function toggleCollapsed()
        {
            if ( vm.collapsed )
            {
                vm.expand();
            }
            else
            {
                vm.collapse();
            }
        }

        /**
         * Collapse
         */
        function collapse()
        {
            // Grab the element that we are going to collapse
            var collapseEl = vm.element.children('ul');

            // Grab the height
            var height = collapseEl[0].offsetHeight;

            $scope.$evalAsync(function ()
            {
                // Set collapsed status
                vm.collapsed = true;

                // Add collapsing class to the node
                vm.element.addClass('collapsing');

                // Animate the height
                $animate.animate(collapseEl,
                    {
                        'display': 'block',
                        'height' : height + 'px'
                    },
                    {
                        'height': '0px'
                    },
                    vm.animateHeightClass
                ).then(
                    function ()
                    {
                        // Clear the inline styles after animation done
                        collapseEl.css({
                            'display': '',
                            'height' : ''
                        });

                        // Clear collapsing class from the node
                        vm.element.removeClass('collapsing');
                    }
                );

                // Broadcast the collapse event so child items can also be collapsed
                $scope.$broadcast('msNavigation::collapse');
            });
        }

        /**
         * Expand
         */
        function expand()
        {
            // Grab the element that we are going to expand
            var expandEl = vm.element.children('ul');

            // Move the element out of the dom flow and
            // make it block so we can get its height
            expandEl.css({
                'position'  : 'absolute',
                'visibility': 'hidden',
                'display'   : 'block',
                'height'    : 'auto'
            });

            // Grab the height
            var height = expandEl[0].offsetHeight;

            // Reset the style modifications
            expandEl.css({
                'position'  : '',
                'visibility': '',
                'display'   : '',
                'height'    : ''
            });

            $scope.$evalAsync(function ()
            {
                // Set collapsed status
                vm.collapsed = false;

                // Add expanding class to the node
                vm.element.addClass('expanding');

                // Animate the height
                $animate.animate(expandEl,
                    {
                        'display': 'block',
                        'height' : '0px'
                    },
                    {
                        'height': height + 'px'
                    },
                    vm.animateHeightClass
                ).then(
                    function ()
                    {
                        // Clear the inline styles after animation done
                        expandEl.css({
                            'height': ''
                        });

                        // Clear expanding class from the node
                        vm.element.removeClass('expanding');
                    }
                );

                // If item expanded, broadcast the collapse event from rootScope so that the other expanded items
                // can be collapsed. This is necessary for keeping only one parent expanded at any time
                $rootScope.$broadcast('msNavigation::collapse', vm.node._path);
            });
        }

        /**
         * Return the class
         *
         * @returns {*}
         */
        function getClass()
        {
            return vm.node.class;
        }
    }

    /** @ngInject */
    function msNavigationNodeDirective()
    {
        return {
            restrict        : 'A',
            bindToController: {
                node: '=msNavigationNode'
            },
            controller      : 'MsNavigationNodeController as vm',
            compile         : function (tElement)
            {
                tElement.addClass('ms-navigation-node');

                return function postLink(scope, iElement, iAttrs, MsNavigationNodeCtrl)
                {
                    // Add custom classes
                    iElement.addClass(MsNavigationNodeCtrl.getClass());

                    // Add group class if it's a group
                    if ( MsNavigationNodeCtrl.group )
                    {
                        iElement.addClass('group');
                    }
                };
            }
        };
    }

    /** @ngInject */
    function msNavigationItemDirective()
    {
        return {
            restrict: 'A',
            require : '^msNavigationNode',
            compile : function (tElement)
            {
                tElement.addClass('ms-navigation-item');

                return function postLink(scope, iElement, iAttrs, MsNavigationNodeCtrl)
                {
                    // If the item is collapsable...
                    if ( MsNavigationNodeCtrl.collapsable )
                    {
                        iElement.on('click', MsNavigationNodeCtrl.toggleCollapsed);
                    }

                    // Cleanup
                    scope.$on('$destroy', function ()
                    {
                        iElement.off('click');
                    });
                };
            }
        };
    }

    /** @ngInject */
    function msNavigationHorizontalDirective(msNavigationService)
    {
        return {
            restrict   : 'E',
            scope      : {
                root: '@'
            },
            controller : 'MsNavigationController as vm',
            templateUrl: 'app/core/directives/ms-navigation/templates/horizontal.html',
            transclude : true,
            compile    : function (tElement)
            {
                tElement.addClass('ms-navigation-horizontal');

                return function postLink(scope)
                {
                    // Store the navigation in the service for public access
                    msNavigationService.setNavigationScope(scope);
                };
            }
        };
    }

    /** @ngInject */
    function MsNavigationHorizontalNodeController($scope, $element, $rootScope, $state, msNavigationService)
    {
        var vm = this;

        // Data
        vm.element = $element;
        vm.node = $scope.node;
        vm.hasChildren = undefined;
        vm.group = undefined;

        // Methods
        vm.getClass = getClass;

        //////////

        init();

        /**
         * Initialize
         */
        function init()
        {
            // Setup the initial values

            // Is active
            vm.isActive = false;

            // Has children?
            vm.hasChildren = vm.node.children.length > 0;

            // Is group?
            vm.group = !!(angular.isDefined(vm.node.group) && vm.node.group === true);

            // Mark all parents as active if we have a matching state
            // or the current state is a child of the node's state
            if ( vm.node.state === $state.current.name || $state.includes(vm.node.state) )
            {
                // If state params are defined, make sure they are
                // equal, otherwise do not set the active item
                if ( angular.isDefined(vm.node.stateParams) && angular.isDefined($state.params) && !angular.equals(vm.node.stateParams, $state.params) )
                {
                    return;
                }

                $scope.$emit('msNavigation::stateMatched');

                // Also store the current active menu item
                msNavigationService.setActiveItem(vm.node, $scope);
            }

            $scope.$on('msNavigation::stateMatched', function ()
            {
                // Mark as active if has children
                if ( vm.hasChildren )
                {
                    $scope.$evalAsync(function ()
                    {
                        vm.isActive = true;
                    });
                }
            });

            // Listen for clearActive event
            $scope.$on('msNavigation::clearActive', function ()
            {
                if ( !vm.hasChildren )
                {
                    return;
                }

                var activePathParts = [];

                var activeItem = msNavigationService.getActiveItem();
                if ( activeItem )
                {
                    activePathParts = activeItem.node._path.split('.');
                }

                // Test for active path
                if ( activePathParts.indexOf(vm.node._id) > -1 )
                {
                    $scope.$evalAsync(function ()
                    {
                        vm.isActive = true;
                    });
                }
                else
                {
                    $scope.$evalAsync(function ()
                    {
                        vm.isActive = false;
                    });
                }

            });

            // Listen for $stateChangeSuccess event
            $scope.$on('$stateChangeSuccess', function ()
            {
                if ( vm.node.state === $state.current.name )
                {
                    // If state params are defined, make sure they are
                    // equal, otherwise do not set the active item
                    if ( angular.isDefined(vm.node.stateParams) && angular.isDefined($state.params) && !angular.equals(vm.node.stateParams, $state.params) )
                    {
                        return;
                    }

                    // Update active item on state change
                    msNavigationService.setActiveItem(vm.node, $scope);

                    // Clear all active states everything except the one we're using
                    $rootScope.$broadcast('msNavigation::clearActive');
                }
            });
        }

        /**
         * Return the class
         *
         * @returns {*}
         */
        function getClass()
        {
            return vm.node.class;
        }
    }

    /** @ngInject */
    function msNavigationHorizontalNodeDirective()
    {
        return {
            restrict        : 'A',
            bindToController: {
                node: '=msNavigationHorizontalNode'
            },
            controller      : 'MsNavigationHorizontalNodeController as vm',
            compile         : function (tElement)
            {
                tElement.addClass('ms-navigation-horizontal-node');

                return function postLink(scope, iElement, iAttrs, MsNavigationHorizontalNodeCtrl)
                {
                    // Add custom classes
                    iElement.addClass(MsNavigationHorizontalNodeCtrl.getClass());

                    // Add group class if it's a group
                    if ( MsNavigationHorizontalNodeCtrl.group )
                    {
                        iElement.addClass('group');
                    }
                };
            }
        };
    }

    /** @ngInject */
    function msNavigationHorizontalItemDirective($mdMedia)
    {
        return {
            restrict: 'A',
            require : '^msNavigationHorizontalNode',
            compile : function (tElement)
            {
                tElement.addClass('ms-navigation-horizontal-item');

                return function postLink(scope, iElement, iAttrs, MsNavigationHorizontalNodeCtrl)
                {
                    iElement.on('click', onClick);

                    function onClick()
                    {
                        if ( !MsNavigationHorizontalNodeCtrl.hasChildren || $mdMedia('gt-md') )
                        {
                            return;
                        }

                        iElement.toggleClass('expanded');
                    }

                    // Cleanup
                    scope.$on('$destroy', function ()
                    {
                        iElement.off('click');
                    });
                };
            }
        };
    }

})();
(function ()
{
    'use strict';

    angular
        .module('app.core')
        .directive('msCard', msCardDirective);

    /** @ngInject */
    function msCardDirective()
    {
        return {
            restrict: 'E',
            scope   : {
                templatePath: '=template',
                card        : '=ngModel'
            },
            template: '<div class="ms-card-content-wrapper" ng-include="templatePath" onload="cardTemplateLoaded()"></div>',
            compile : function (tElement)
            {
                // Add class
                tElement.addClass('ms-card');

                return function postLink(scope, iElement)
                {
                    // Methods
                    scope.cardTemplateLoaded = cardTemplateLoaded;

                    //////////

                    /**
                     * Emit cardTemplateLoaded event
                     */
                    function cardTemplateLoaded()
                    {
                        scope.$emit('msCard::cardTemplateLoaded', iElement);
                    }
                };
            }
        };
    }
})();
(function ()
{
    'use strict';

    angular
        .module('app.core')
        .controller('MsFormWizardController', MsFormWizardController)
        .directive('msFormWizard', msFormWizardDirective)
        .directive('msFormWizardForm', msFormWizardFormDirective);

    /** @ngInject */
    function MsFormWizardController()
    {
        var vm = this;

        // Data
        vm.forms = [];
        vm.selectedIndex = 0;

        // Methods
        vm.registerForm = registerForm;

        vm.previousStep = previousStep;
        vm.nextStep = nextStep;
        vm.isFirstStep = isFirstStep;
        vm.isLastStep = isLastStep;

        vm.currentStepInvalid = currentStepInvalid;
        vm.formsIncomplete = formsIncomplete;
        vm.resetForm = resetForm;

        //////////

        /**
         * Register form
         *
         * @param form
         */
        function registerForm(form)
        {
            vm.forms.push(form);
        }

        /**
         * Go to previous step
         */
        function previousStep()
        {
            vm.selectedIndex--;
        }

        /**
         * Go to next step
         */
        function nextStep()
        {
            vm.selectedIndex++;
        }

        /**
         * Is first step?
         *
         * @returns {boolean}
         */
        function isFirstStep()
        {
            return vm.selectedIndex === 0;
        }

        /**
         * Is last step?
         *
         * @returns {boolean}
         */
        function isLastStep()
        {
            return vm.selectedIndex === vm.forms.length - 1;
        }

        /**
         * Is current step invalid?
         *
         * @returns {boolean|*}
         */
        function currentStepInvalid()
        {
            return angular.isDefined(vm.forms[vm.selectedIndex]) && vm.forms[vm.selectedIndex].$invalid;
        }

        /**
         * Check if there is any incomplete forms
         *
         * @returns {boolean}
         */
        function formsIncomplete()
        {
            for ( var x = 0; x < vm.forms.length; x++ )
            {
                if ( vm.forms[x].$invalid )
                {
                    return true;
                }
            }

            return false;
        }

        /**
         * Reset form
         */
        function resetForm()
        {
            // Go back to first step
            vm.selectedIndex = 0;

            // Make sure all the forms are back in the $pristine & $untouched status
            for ( var x = 0; x < vm.forms.length; x++ )
            {
                vm.forms[x].$setPristine();
                vm.forms[x].$setUntouched();
            }
        }
    }

    /** @ngInject */
    function msFormWizardDirective()
    {
        return {
            restrict  : 'E',
            scope     : true,
            controller: 'MsFormWizardController as msWizard',
            compile   : function (tElement)
            {
                tElement.addClass('ms-form-wizard');

                return function postLink()
                {

                };
            }
        }

    }

    /** @ngInject */
    function msFormWizardFormDirective()
    {
        return {
            restrict: 'A',
            require : ['form', '^msFormWizard'],
            compile : function (tElement)
            {
                tElement.addClass('ms-form-wizard-form');

                return function postLink(scope, iElement, iAttrs, ctrls)
                {
                    var formCtrl = ctrls[0],
                        MsFormWizardCtrl = ctrls[1];

                    MsFormWizardCtrl.registerForm(formCtrl);
                }
            }
        }
    }

})();
/**
 * Created by zhangzhaoyong on 16/1/28.
 */
(function(){
  config.$inject = ["apiProvider"];
  angular
    .module('app.szgc')
    .config(config)

  /** @ngInject */
  function config(apiProvider){
    var partner = [],zbPartner=[],procedureId = '2814510f-0188-4993-a153-559b40d0b5e8';

    var $http,$q,auth,api;
    angular.injector(['ng']).invoke([
      '$http','$q',function (_$http,_$q)
      {
        $http = _$http;
        $q = _$q;
      }
    ]);

    var permission,p1;
    var getNumName = function (str) {
      str = str.replace('十','10')
        .replace('九', '9')
        .replace('八', '8')
        .replace('七', '7')
        .replace('六', '6')
        .replace('五', '5')
        .replace('四', '4')
        .replace('三', '3')
        .replace('二', '2')
        .replace('一', '1')
        .replace('十一', '11')
        .replace('十二', '12')
        .replace('十三', '13')
        .replace('十四', '14')
        .replace('十五', '15')
        .replace('十六', '16')
        .replace('十七', '17')
        .replace('十八', '18')
        .replace('十九', '19')
        .replace('二十', '20');
      var n = parseInt(/[-]?\d+/.exec(str));
      return n;
    };

    var http = apiProvider.$http;
    apiProvider.register('szgc',{
      vanke:{
        profile:http.db({
          _id:'v_profile',
          idField:'Id',
          dataType:3,
          mode:0,
          raiseError:true,
          filter:function () {
            return true;
          }
        }).bind(function(){
          return get('/common/v1/profile').then(function (result) {
            result.data.Id = result.data.data.employee_id;
            return result;
          });
        },function (result) {
          p1 = null;
          permission = null;
          return result;
        }),
        isPartner:http.custom(function(f){
          var me = this;
          var r = me.getRoleId();
          return r == 'zb' || r == 'jl' || r=='3rd';
          //return (!f && (partner.indexOf(getAuth().current().loginname) != -1)) || getAuth().current().Partner ;
        }),
        getRoleId: http.custom(function () {
          var me = this,u = getAuth().current();
          if (u.Partner_types.indexOf('supervision') != -1) return 'jl';
          if (u.Partner_types.indexOf('construction') != -1) return 'zb';

          if (u.Id == '56779bf59e10dd61507977c8') return '3rd';

          return u.Partner && u.Partner != '' ? 'jl' : 'eg';
        }),
        isZb:http.custom(function(f){
          return (!f && (zbPartner.indexOf(getAuth().current().loginname) != -1));
        }),
        getPartner:http.custom( function () {
          return getAuth().current().Partner;
        }),
        getPermissin:http.custom(function () {
          var me = this;
          return $q(function (resolve) {
            if (permission)
              resolve({ data: permission });
            else
              me.projects().then(function () {
                resolve({ data: permission });
              })
          });
        }),
        _projects: http.db({
          _id:'v__projects',
          idField:'project_id',
          dataType:4
        }).bind(function (arg) {
          arg = angular.extend({
            page_size: 0,
            page_number: 1
          },arg);
          return get(http.url('/common/v1/projects', arg));
        }),
        projects: http.db({
          _id:'v_projects',
          idField:'project_id',
          dataType:4
        }).bind(function (arg) {
          var me = this;
          if (!me.isPartner(1)) {
            return get(http.url('/common/v1/DE/projects', arg));
          }
          else {
            return $q(function (resolve) {
              resolve({status:200});
            })
          }
        },
          function (result,cfg,args) {
          var me = this,arg=args[0],root = me.root;
          if(root.getNetwork()==1){
            return $q(function (resolve,reject) {
              var teamIds = getAuth().current().TeamId.split(',');
              var ps = [];
              for (var i = 0; i < teamIds.length; i++) {
                ps.push(me.root.szgc.ProjectSettingsSevice.query({
                  unitId: getAuth().current().Partner,
                  groupId: teamIds[i]
                }));
              }
              $q.all(ps).then(function (results) {
                var result = results[0];
                for (var ix = 1; ix < results.length; ix++) {
                  results[ix].data.Rows.forEach(function (r) {
                    result.data.Rows.push(r);
                  })
                }
                permission = result.data;
                root.szgc.ProjectSettings.offline.query().then(function (result) {
                  var ps = [];
                  result.data.forEach(function (r) {
                    if (!ps.find(function (p) {
                        return p.project_id == r.project.project_id;
                      })) {
                      ps.push(r.project);
                    }
                  });
                  resolve({data: {data: ps}});
                });
              })
            })
          }
          else {
            //console.log('me',me.root);
            if (!me.isPartner(1))return result;
            return $q(function (resolve, reject) {
              if (p1)
                resolve(p1);
              else {
                var teamIds = getAuth().current().TeamId.split(',');
                var ps = [];
                for (var i = 0; i < teamIds.length; i++) {
                  ps.push(me.root.szgc.ProjectSettingsSevice.query({
                    unitId: getAuth().current().Partner,
                    groupId: teamIds[i]
                  }));
                }
                ;
                $q.all(ps).then(function (results) {
                  var result = results[0];
                  for (var ix = 1; ix < results.length; ix++) {
                    results[ix].data.Rows.forEach(function (r) {
                      result.data.Rows.push(r);
                    })
                  }
                  permission = result.data;
                  me._projects(arg).then(function (result) {
                    var p = permission;
                    if (p) {
                      for (var i = result.data.data.length - 1; i >= 0; i--) {
                        var item = result.data.data[i];
                        var fd = p.Rows.find(function (it) {
                          return it.RegionIdTree.indexOf(item.project_id) != -1
                        });
                        if (!fd) {
                          result.data.data.splice(i, 1);
                        }
                      }
                    }
                    p1 = result;
                    resolve(p1);
                  });
                });
              }
            });
          }
        }),
        _filter:function(regionType){
          var me = this;
          return me.root.szgc.ProjectSettings.getAllSatus(regionType);
        },
        project_items: http.db({
          _id:'v_project_items',
          idField:'project_item_id',
          dataType:4,
          filter:function (item,arg) {
            return item.project.project_id == arg.project_id;
          }
        }).bind(function (arg) {
          var s = this;
          return get(http.url('/common/v1/project_items', arg)).then(function (result) {
            return $q(function (resolve,reject) {
                if (!arg._filter) {
              s._filter(2).then(function (r) {
                var arr = [];
                if (r.status == 200 && r.data.Rows) {
                  arr = r.data.Rows;
                }
                if (arr.length > 0) {
                  for (var i = result.data.data.length - 1; i >= 0; i--) {
                    var item = result.data.data[i],
                      st = arr.find(function (it) { return it.RegionId == item.project_item_id; });
                    switch (item.project_item_id) {
                      case "547fc0e7699731702f9cf308":
                        item.name = '三区商务公寓';
                        break;
                      case "547fc0e7699731702f9cf306":
                        item.name = '三区配套';
                        break;
                    }
                    if (st) {
                      if (!st.IsEnable) {
                        result.data.data.splice(i, 1);
                      }
                    }
                  };
                }
                result.data.data.sort(function (i1, i2) {
                  var n1 = getNumName(i1.name),
                    n2 = getNumName(i2.name);
                  if (!isNaN(n1) && !isNaN(n2))
                    return n1 - n2;
                  else if ((isNaN(n1) && !isNaN(n2)))
                    return 1;
                  else if ((!isNaN(n1) && isNaN(n2)))
                    return -1;
                  else
                    return i1.name.localeCompare(i2.name);
                });
                var p = permission;
                if (s.isPartner(1) && p) {

                  for (var i = result.data.data.length - 1; i >= 0; i--) {
                    var item = result.data.data[i];
                    var fd = p.Rows.find(function (it) {
                      return it.RegionIdTree.indexOf(item.project_item_id) != -1
                    });
                    if (!fd) {
                      result.data.data.splice(i, 1);
                    }
                  }
                }
                for (var i = result.data.data.length - 1; i >= 0; i--) {
                  var item = result.data.data[i];
                  if (item.project_item_id == '5514f7b471fe65ac066cb09b' || item.project_item_id == '5514f7b471fe65ac066cb09c') {
                    // console.log(item)
                    result.data.data.splice(i, 1);
                  }
                }
                resolve(result);
              })
            }
            else {
              result.data.data.sort(function (i1, i2) {
                var n1 = getNumName(i1.name),
                  n2 = getNumName(i2.name);
                if (!isNaN(n1) && !isNaN(n2))
                  return n1 - n2;
                else if ((isNaN(n1) && !isNaN(n2)))
                  return 1;
                else if ((!isNaN(n1) && isNaN(n2)))
                  return -1;
                else
                  return i1.name.localeCompare(i2.name);
              });
              var p = permission;
              if (p) {

                for (var i = result.data.data.length - 1; i >= 0; i--) {
                  var item = result.data.data[i];
                  var fd = p.Rows.find(function (it) {
                    return it.RegionIdTree.indexOf(item.project_item_id) != -1
                  });
                  if (!fd) {
                    result.data.data.splice(i, 1);
                  }
                }
              }
              for (var i = result.data.data.length - 1; i >= 0; i--) {
                var item = result.data.data[i];
                if (item.project_item_id == '5514f7b471fe65ac066cb09b' || item.project_item_id == '5514f7b471fe65ac066cb09c') {
                  // console.log(item)
                  result.data.data.splice(i, 1);
                }
              }
                  resolve(result);
            }
          });
            });
        },function (result,cfg,args) {
          var root = this.root;
          if(root.getNetwork()==1){
            return $q(function (resolve,reject) {
              root.szgc.ProjectSettings.offline.query().then(function (result) {
                var ps = [];
                result.data.forEach(function (r) {
                  if (args[0].project_id == r.project.project_id)
                    ps.push(r.item);
                });
                resolve({data:{data:ps}});
              });
            })
          }
          else{
            return result;
          }
        }),
        buildings: http.db({
          _id:'v_buildings',
          idField:'building_id',
          dataType:4,
          filter:function (item,arg) {
            return item.project_item.project_item_id == arg.project_item_id;
          }
        }).bind(function (arg) {
          return get(http.url('/common/v1/buildings', arg));
        },function (result) {
          result.data.data.sort(function (i1, i2) {
            var n1 = getNumName(i1.name),
              n2 = getNumName(i2.name);
            if (!isNaN(n1) && !isNaN(n2))
              return n1 - n2;
            else if ((isNaN(n1) && !isNaN(n2)))
              return 1;
            else if ((!isNaN(n1) && isNaN(n2)))
              return -1;
            else
              return i1.name.localeCompare(i2.name);
          });
          return result;
        }),
        floors: http.db({
          _id:'v_rooms',
          idField:function (item) {
            return item.building_id
          },
/*          search:function (building_id) {
            return {
              query:building_id,
              fields:['building_id'],
              include_docs:true
            };
          },*/
          dataType:3,
          firstIsId:true
/*          filter:function (item,building_id) {
            return item.building_id==building_id;
          },*/
/*          data:function (item,building_id) {
            item.building_id = building_id;
            return item;
          }*/
        }).bind(function (building_id) {
          return get(http.url('/common/v1/buildings/'+building_id+'/rooms',{page_size:0,page_number:1})).then(function (result) {
            result.data.data.forEach(function (item) {
              item.building_id=building_id;
            })
            return {
              data:{
                building_id:building_id,
                rooms:result.data.data
              }
            };
          });
        },function (result) {
          var floors = [];
          result.data.rooms.forEach(function (room) {
            if(floors.indexOf(room.floor)==-1){
              floors.push(room.floor);
            }
          });
          floors.sort (function (i1, i2) {
            var n1 = getNumName (i1),
              n2 = getNumName (i2);
            if (!isNaN (n1) && !isNaN (n2))
              return n1 - n2;
            else if ((isNaN (n1) && !isNaN (n2)))
              return 1;
            else if ((!isNaN (n1) && isNaN (n2)))
              return -1;
            else
              return i1.localeCompare (i2);
          });
          return {data:{data: floors}};
        }),
        units: http.custom(function (arg) {
          return get(http.url('/common/v1/buildings/' + arg + '/units', arg));
        }),
        _rooms: http.db({
          _id:'v_rooms',
          idField:function (item) {
            return item.building_id
          },
          dataType:3, firstIsId:true//,
/*          filter:function (item,arg,incHide) {
            item.otype = item.type;
            item.type = item.type && item.type.type_id;
            if (incHide !== true) {
              if (item.engineering.status == 'hide') {
                return false;
              }
            }
            return ( !item.building_id || item.building_id==arg.building_id) && item.floor==arg.floor;
          },
          data:function (item,arg,incHide) {
            item.building_id = arg.building_id;
            return item;
          }*/
        })
          .bind(function (building_id,arg,incHide) {
          return get(http.url('/common/v1/buildings/'+arg.building_id+'/rooms', {/*floor:arg.floor, */page_size: 0, page_number: 1})).then(function (result) {
            result.data.data.forEach(function (item) {
              item.building_id=arg.building_id;
            })
            return {
              data:{
                building_id:building_id,
                rooms:result.data.data
              }
            };
          });
        },function (result,cfg,args) {
            var rooms = result.data.rooms.filter(function (item) {
              return (!args[1].floor || item.floor == args[1].floor)
               && (args[2] === true || item.engineering.status != 'hide')
            })
            rooms.sort (function (i1, i2) {
            var n1 = getNumName (i1.name),
              n2 = getNumName (i2.name);
            if (!isNaN (n1) && !isNaN (n2))
              return n1 - n2;
            else if ((isNaN (n1) && !isNaN (n2)))
              return 1;
            else if ((!isNaN (n1) && isNaN (n2)))
              return -1;
            else
              return i1.name.localeCompare (i2.name);
          });
          return {
            data:{
              data:rooms
            }
          };
        }),
        room_types: http.db({
          _id:'v_types',
          idField:'type_id',
          dataType:4,
          filter:function (item,project_item_id) {
            return item.project_item.project_item_id==project_item_id;
          }
        }).bind(function (project_item_id) {
          return get(http.url('/common/v1/types', { project_item_id: project_item_id, page_size: 0, page_number:1}));
        }),
        rooms:function (args) {
          return this.root.szgc.vanke._rooms(args.building_id,args);
        },
        partners: http.custom(function (arg) {
          return get(http.url('/common/v1/partners', arg));
        }),
        skills: http.db({
          _id:'v_skills',
          idField:'skill_id',
          dataType:4
        }).bind(function (arg) {
          return get(http.url('/common/v1/skills', arg));
        }),
        employees: http.db({
          _id:'v_employees',
          dataType:4,
          idField:'employee_id',
          filter:function (item,arg) {
            return item.partner.partner_id==arg;
          }
        }).bind(function (arg) {
          return get(http.url('/common/v1/partners/'+arg+'/employees'));
        }),
        teams: http.db({
          _id:'v_partners',
          idField:'team_id',
          dataType:4,
          filter:function (item,partner_id) {
            return item.partner_id==partner_id;
          },
          data:function (item,partner_id) {
            item.partner_id=partner_id;
            return item;
          }
        }).bind(function (partner_id) {
          return get(http.url('/common/v1/partners/' + partner_id + '/teams',angular.extend({
            page_size: 0,
            page_number: 1
          }))).then(function (result) {
            result.data.data.forEach(function (item) {
              item.partner_id = partner_id;
            })
            return result;
          });
        }),
        buildingsInfo:http.custom(function(type, typeId){
          if(type == 2) {
            return get (http.url ('/common/v1/buildings', {
              project_item_id: typeId,
              page_size: 0,
              page_number: 1
            })).then(function(r) {
              r.data.data.forEach (function (b) {
                b.floors = isNaN (parseInt (b.total_floor)) ? 1 : parseInt (b.total_floor);
              });
              r.data.data.sort (function (i1, i2) {
                var n1 = getNumName (i1.name),
                  n2 = getNumName (i2.name);
                if (!isNaN (n1) && !isNaN (n2))
                  return n1 - n2;
                else if ((isNaN (n1) && !isNaN (n2)))
                  return 1;
                else if ((!isNaN (n1) && isNaN (n2)))
                  return -1;
                else
                  return i1.name.localeCompare (i2.name);
              });
              return r;
            });
          }
          else{
            return get (http.url ('/common/v1/buildings', {
              project_id: typeId,
              page_size: 0,
              page_number: 1
            })).then(function(r){
              r.data.data.forEach(function (b) {
                b.floors = isNaN(parseInt(b.total_floor)) ? 1 : parseInt(b.total_floor);
              });
              r.data.data.sort(function (i1, i2) {
                var n1 = getNumName(i1.name),
                  n2 = getNumName(i2.name);
                if (!isNaN(n1) && !isNaN(n2))
                  return n1 - n2;
                else if ((isNaN(n1) && !isNaN(n2)))
                  return 1;
                else if ((!isNaN(n1) && isNaN(n2)))
                  return -1;
                else
                  return i1.name.localeCompare(i2.name);
              });
              return r.data.data;
            });
          }
        })
      }
    });

    function getAuth(){
      if(!auth)
        auth = apiProvider.get('auth');
      return auth;
    }

    function getApi(){
      if(!api)
        api = apiProvider.get('api');
      return api;
    }

    function tk(method, api, arg) {
      return $q(function (resolve, reject) {
        getAuth().getUser().then(function (user) {
          $http({
            method: method,
            url: 'http://szapi.vanke.com' + api,
            headers: {
              'Authorization': 'Bearer '+user.Token,
              'Corporation-Id': user.CropId
            },
            data: arg
          }).then(function (r) {
            resolve(r);
          }, reject);
        });
      });
    }
    function get(api,arg){
      return tk('get', api, arg);
    }
  }
})();

/**
 * Created by zhangzhaoyong on 16/1/28.
 */
(function(){
  'use strict';

  config.$inject = ["apiProvider"];
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

(function () {'use strict';
/**
 * generate directive link function
 *
 * @param {Service} $http, http service to make ajax requests from angular
 * @param {String} type, chart type
 */
function getLinkFunction($http, theme, util, type) {
    return function (scope, element, attrs) {
        scope.config = scope.config || {};
        var ndWrapper = element.find('div')[0], ndParent = element.parent()[0], parentWidth = ndParent.clientWidth, parentHeight = ndParent.clientHeight,iwindow= $(window).width(), width, height, chart;
        var chartEvent = {};
        function getSizes(config) {
            width = config.width || parseInt(attrs.width) || $(window).width() || 320;
            height = config.height || parseInt(attrs.height) || parentHeight || 240;
            ndWrapper.style.width = width + 'px';
            ndWrapper.style.height = height + 'px';
        }
        function getOptions(data, config, type) {
            // merge default config
            config = angular.extend({
                showXAxis: true,
                showYAxis: true,
                showLegend: true
            }, config);
            var xAxis = angular.extend({
                    orient: 'top',
                    axisLine: { show: false }
                }, angular.isObject(config.xAxis) ? config.xAxis : {});
            var yAxis = angular.extend({
                    type: 'value',
                    orient: 'right',
                    scale: false,
                    axisLine: { show: false },
                    axisLabel: {
                        formatter: function (v) {
                            return util.formatKMBT(v);
                        }
                    }
                }, angular.isObject(config.yAxis) ? config.yAxis : {});
            // basic config
            var options = {
                    title: util.getTitle(data, config, type),
                    tooltip: util.getTooltip(data, config, type),
                    legend: util.getLegend(data, config, type),
                    toolbox: angular.extend({ show: false }, angular.isObject(config.toolbox) ? config.toolbox : {}),
                    xAxis: [ angular.extend(xAxis, util.getAxisTicks(data, config, type)) ],
                    yAxis: [ yAxis ],
                    dataZoom:[
                      {
                        type: 'inside',
                        show:true,
                        start: 50,
                        end: 100
                      }
                    ],
                    series: util.getSeries(data, config, type)
                };
            if (!config.showXAxis) {
                angular.forEach(options.xAxis, function (axis) {
                    axis.axisLine = { show: false };
                    axis.axisLabel = { show: false };
                    axis.axisTick = { show: false };
                });
            }
            if (!config.showYAxis) {
                angular.forEach(options.yAxis, function (axis) {
                    axis.axisLine = { show: false };
                    axis.axisLabel = { show: false };
                    axis.axisTick = { show: false };
                });
            }
            if (!config.showLegend || type === 'gauge' || type === 'map') {
                delete options.legend;
            }
            if (!util.isAxisChart(type)) {
                delete options.xAxis;
                delete options.yAxis;
            }
            if (config.dataZoom) {
                options.dataZoom = angular.extend({
                    show: true,
                    realtime: true,
                    type:'inside'
                }, config.dataZoom);
            }
            if (config.dataRange) {
                options.dataRange = angular.extend({}, config.dataRange);
            }
            if (config.polar) {
                options.polar = config.polar;
            }
            return options;
        }
        var isAjaxInProgress = false;
        var textStyle = {
                color: 'red',
                fontSize: 36,
                fontWeight: 900,
                fontFamily: 'Microsoft Yahei, Arial'
            };
        function setOptions() {
            if (!scope.data || !scope.config) {
                return;
            }
            var options;
            getSizes(scope.config);
            if (!chart) {
               //console.log('aaa')
                chart = echarts.init(ndWrapper, theme.get(scope.config.theme || 'macarons'));
            }
          console.log('aaa',ndWrapper)
            chart = echarts.init(ndWrapper, theme.get(scope.config.theme || 'macarons'));
            if (scope.config.event) {
                if (!Array.isArray(scope.config.event)) {
                    scope.config.event = [scope.config.event];
                }
                if (Array.isArray(scope.config.event)) {
                    scope.config.event.forEach(function (ele) {
                        if (!chartEvent[ele.type]) {
                            chartEvent[ele.type] = true;
                            chart.on(ele.type, function (param) {
                                ele.fn(param);
                            });
                        }
                    });
                }
            }
            // string type for data param is assumed to ajax datarequests
            if (angular.isString(scope.data)) {
                if (isAjaxInProgress) {
                    return;
                }
                isAjaxInProgress = true;
                // show loading
                chart.showLoading({
                    text: scope.config.loading || '\u594B\u529B\u52A0\u8F7D\u4E2D...',
                    textStyle: textStyle
                });
                // fire data request
                $http.get(scope.data).success(function (response) {
                    isAjaxInProgress = false;
                    chart.hideLoading();
                    if (response.data) {
                        options = getOptions(response.data, scope.config, type);
                        if (scope.config.forceClear) {
                            chart.clear();
                        }
                        if (options.series.length) {
                            chart.setOption(options);
                          console.log('value1');
                            chart.resize();
                        } else {
                            chart.showLoading({
                                text: scope.config.errorMsg || '\u6CA1\u6709\u6570\u636E',
                                textStyle: textStyle
                            });
                        }
                    } else {
                        chart.showLoading({
                            text: scope.config.emptyMsg || '\u6570\u636E\u52A0\u8F7D\u5931\u8D25',
                            textStyle: textStyle
                        });
                    }
                }).error(function (response) {
                    isAjaxInProgress = false;
                    chart.showLoading({
                        text: scope.config.emptyMsg || '\u6570\u636E\u52A0\u8F7D\u5931\u8D25',
                        textStyle: textStyle
                    });
                });    // if data is avaliable, render immediately
            } else {
                options = getOptions(scope.data, scope.config, type);
                if (scope.config.forceClear) {
                    chart.clear();
                }
                if (options.series.length) {
                    chart.setOption(options);
                    chart.resize();
                } else {
                    chart.showLoading({
                        text: scope.config.errorMsg || '\u6CA1\u6709\u6570\u636E',
                        textStyle: textStyle
                    });
                }
            }
        }
      $(window).resize(function(){
        scope.config.forceClear = !scope.config.forceClear;
      })
        // update when charts config changes
        scope.$watch(function () {
            return scope.config;
        }, function (value) {
          if (value) {
                setOptions();
            }
        }, true);
        scope.$watch(function () {
            return scope.data;
        }, function (value) {
            if (value) {
                setOptions();
            }
        }, true);
    };
}
/**
 * add directives
 */
var app = angular.module('angular-echarts', ['angular-echarts.theme', 'angular-echarts.util']);
var types = ['line', 'bar', 'area', 'pie', 'donut', 'gauge', 'map', 'radar'];
for (var i = 0, n = types.length; i < n; i++) {
    (function (type) {
        app.directive(type + 'Chart', ['$http', 'theme', 'util', function ($http, theme, util) {
                    return {
                        restrict: 'EA',
                        template: '<div></div>',
                        scope: {
                            config: '=config',
                            data: '=data'
                        },
                        link: getLinkFunction($http, theme, util, type)
                    };
                }]);
    }(types[i]));
}
'use strict';
/**
 * util services
 */
angular.module('angular-echarts.util', []).factory('util', function () {
    function isPieChart(type) {
        return ['pie', 'donut'].indexOf(type) > -1;
    }
    function isMapChart(type) {
        return ['map'].indexOf(type) > -1;
    }
    function isAxisChart(type) {
        return ['line', 'bar', 'area'].indexOf(type) > -1;
    }
    /**
     * get x axis ticks from the 1st serie
     */
    function getAxisTicks(data, config, type) {
        var ticks = [];
        if (data[0]) {
            angular.forEach(data[0].datapoints, function (datapoint) {
                ticks.push(datapoint.x);
            });
        }
        return {
            type: 'category',
            boundaryGap: type === 'bar',
            data: ticks
        };
    }
    /**
     * get series config
     *
     * @param {Array} data serie data
     * @param {Object} config options
     * @param {String} chart type
     */
    function getSeries(data, config, type) {
        var series = [];
        angular.forEach(data, function (serie) {
            // datapoints for line, area, bar chart
            var datapoints = [];
            angular.forEach(serie.datapoints, function (datapoint) {
                datapoints.push(datapoint.y);
            });
            var conf = {
                    type: type || 'line',
                    name: serie.name,
                    data: datapoints
                };
            // area chart is actually line chart with special itemStyle
            if (type === 'area') {
                conf.type = 'line';
                conf.itemStyle = { normal: { areaStyle: { type: 'default' } } };
            }
            // gauge chart need many special config
            if (type === 'gauge') {
                conf = angular.extend(conf, {
                    splitNumber: 10,
                    // 分割段数，默认为5
                    axisLine: {
                        // 坐标轴线
                        lineStyle: {
                            // 属性lineStyle控制线条样式
                            color: [[0.2, '#228b22'], [0.8, '#48b'], [1, '#ff4500']],
                            width: 8
                        }
                    },
                    axisTick: {
                        // 坐标轴小标记
                        splitNumber: 10,
                        // 每份split细分多少段
                        length: 12,
                        // 属性length控制线长
                        lineStyle: {
                            // 属性lineStyle控制线条样式
                            color: 'auto'
                        }
                    },
                    axisLabel: {
                        // 坐标轴文本标签，详见axis.axisLabel
                        textStyle: {
                            // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            color: 'auto'
                        }
                    },
                    splitLine: {
                        // 分隔线
                        show: true,
                        // 默认显示，属性show控制显示与否
                        length: 30,
                        // 属性length控制线长
                        lineStyle: {
                            // 属性lineStyle（详见lineStyle）控制线条样式
                            color: 'auto'
                        }
                    },
                    pointer: { width: 5 },
                    title: {
                        show: true,
                        offsetCenter: [0, '-40%'],
                        // x, y，单位px
                        textStyle: {
                            // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            fontWeight: 'bolder'
                        }
                    },
                    detail: {
                        formatter: '{value}%',
                        textStyle: {
                            // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            color: 'auto',
                            fontWeight: 'bolder'
                        }
                    }
                }, config.gauge || {});
            }
            // datapoints for pie chart and gauges are different
            if (!isAxisChart(type)) {
                conf.data = [];
                angular.forEach(serie.datapoints, function (datapoint) {
                    conf.data.push({
                        value: datapoint.y,
                        name: datapoint.x
                    });
                });
            }else{
              conf.data = [];
              angular.forEach(serie.datapoints, function (datapoint) {
                conf.data.push({
                  color: datapoint.color,
                  value: datapoint.y,
                  name:datapoint.x
                });
              });
              conf = angular.extend(conf, {
                color: '#fff',
                itemStyle: {
                  normal: {
                    label: {
                      show: true,
                      //color: '#fff',
                      position: 'top'
                    },
                    color: function (conf) {
                      if (conf.data != null && conf.data.color != undefined) {
                        return conf.data.color;
                      } else {
                        return 'rgba(0,0,0,0)';
                      }
                    }
                  }
                }
              }, config.bar || {});
            }
            if (isPieChart(type)) {
                // donut charts are actually pie charts
                conf.type = 'pie';
                // pie chart need special radius, center config
                conf.center = config.center || ['40%', '50%'];
                conf.radius = config.radius || '60%';
                // donut chart require special itemStyle
                if (type === 'donut') {
                    conf.radius = config.radius || ['50%', '70%'];
                    conf = angular.extend(conf, {
                        itemStyle: {
                            normal: {
                                label: { show: false },
                                labelLine: { show: false }
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    position: 'center',
                                    textStyle: {
                                        fontSize: '50',
                                        fontWeight: 'bold'
                                    }
                                }
                            }
                        }
                    }, config.donut || {});
                } else if (type === 'pie') {
                    conf = angular.extend(conf, {
                        itemStyle: {
                            normal: {
                                label: {
                                    position: 'inner',
                                    formatter: function (a, b, c, d) {
                                        return (d - 0).toFixed(0) + '%';
                                    }
                                },
                                labelLine: { show: false }
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    formatter: '{b}\n{d}%'
                                }
                            }
                        }
                    }, config.pie || {});
                }
            }
            if (isMapChart(type)) {
                conf.type = 'map';
                conf = angular.extend(conf, {}, config.map || {});
            }
            // if stack set to true
            if (config.stack) {
                conf.stack = 'total';
            }
            if (type === 'radar') {
                conf.data = serie.data;
            }
            series.push(conf);
        });
        return series;
    }
    /**
     * get legends from data series
     */
    function getLegend(data, config, type) {
        var legend = { data: [] };
        if (isPieChart(type)) {
            if (data[0]) {
                angular.forEach(data[0].datapoints, function (datapoint) {
                    legend.data.push(datapoint.x);
                });
            }
            legend.orient = 'verticle';
            legend.x = 'right';
            legend.y = 'center';
        } else {
            angular.forEach(data, function (serie) {
                legend.data.push(serie.name);
            });
            legend.orient = 'horizontal';
        }
        return angular.extend(legend, config.legend || {});
    }
    /**
     * get tooltip config
     */
    function getTooltip(data, config, type) {
        var tooltip = {};
        switch (type) {
        case 'line':
        case 'area':
            tooltip.trigger = 'axis';
            break;
        case 'pie':
        case 'donut':
        case 'bar':
        case 'map':
        case 'gauge':
            tooltip.trigger = 'item';
            break;
        }
        if (type === 'pie') {
            tooltip.formatter = '{a} <br/>{b}: {c} ({d}%)';
        }
        if (type === 'map') {
            tooltip.formatter = '{b}';
        }
        return angular.extend(tooltip, angular.isObject(config.tooltip) ? config.tooltip : {});
    }
    function getTitle(data, config, type) {
        if (angular.isObject(config.title)) {
            return config.title;
        }
        return isPieChart(type) ? null : {
            text: config.title,
            subtext: config.subtitle || '',
            x: 50
        };
    }
    function formatKMBT(y, formatter) {
        if (!formatter) {
            formatter = function (v) {
                return Math.round(v * 100) / 100;
            };
        }
        y = Math.abs(y);
        if (y >= 1000000000000) {
            return formatter(y / 1000000000000) + 'T';
        } else if (y >= 1000000000) {
            return formatter(y / 1000000000) + 'B';
        } else if (y >= 1000000) {
            return formatter(y / 1000000) + 'M';
        } else if (y >= 1000) {
            return formatter(y / 1000) + 'K';
        } else if (y < 1 && y > 0) {
            return formatter(y);
        } else if (y === 0) {
            return '';
        } else {
            return formatter(y);
        }
    }
    return {
        isPieChart: isPieChart,
        isAxisChart: isAxisChart,
        getAxisTicks: getAxisTicks,
        getSeries: getSeries,
        getLegend: getLegend,
        getTooltip: getTooltip,
        getTitle: getTitle,
        formatKMBT: formatKMBT
    };
});
'use strict';
/**
 * theme services
 * posible themes: infographic macarons shine dark blue green red gray default
 */
angular.module('angular-echarts.theme', []).factory('theme', ['infographic', 'macarons', 'shine', 'dark', 'blue', 'green', 'red', function (infographic, macarons, shine, dark, blue, green, red, grey) {
    var themes = {
        infographic: infographic,
        macarons: macarons,
        shine: shine,
        dark: dark,
        blue: blue,
        green: green,
        red: red,
        grey: grey,
    };

    return {
        get: function (name) {
            return themes[name] ? themes[name] : {};
        },
    };

}]);
'use strict';
/**
 * blue theme
 */
angular.module('angular-echarts.theme').factory('blue', function () {
    return {
        // 默认色板
        color: [
                    '#1790cf','#1bb2d8','#99d2dd','#88b0bb',
                    '#1c7099','#038cc4','#75abd0','#afd6dd'
                ],
        // 图表标题
        title: {
            itemGap: 8,
            textStyle: {
                fontWeight: 'normal',
                color: '#1790cf'
            }
        },
        // 值域
        dataRange: { color: ['#1178ad','#72bbd0'] },
        // 工具箱
        toolbox: { color: ['#1790cf','#1790cf','#1790cf','#1790cf'] },
        // 提示框
        tooltip: {
            backgroundColor: 'rgba(0,0,0,0.5)',
            axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: 'line',
                // 默认为直线，可选为：'line' | 'shadow'
                lineStyle: {
                    // 直线指示器样式设置
                    color: '#1790cf',
                    type: 'dashed'
                },
                crossStyle: { color: '#1790cf' },
                shadowStyle: {
                    // 阴影指示器样式设置
                    color: 'rgba(200,200,200,0.3)'
                }
            }
        },
        // 区域缩放控制器
        dataZoom: {
            dataBackgroundColor: '#eee',
            // 数据背景颜色
            fillerColor: 'rgba(144,197,237,0.2)',
            // 填充颜色
            handleColor: '#1790cf',
            width:70,
            type:'inside',
          show:true// 手柄颜色
        },
        grid: { borderWidth: 0 },
        // 类目轴
        categoryAxis: {
            axisLine: {
                // 坐标轴线
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: '#1790cf'
                }
            },
            splitLine: {
                // 分隔线
                lineStyle: {
                    // 属性lineStyle（详见lineStyle）控制线条样式
                    color: ['#eee']
                }
            }
        },
        // 数值型坐标轴默认参数
        valueAxis: {
            axisLine: {
                // 坐标轴线
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: '#1790cf'
                }
            },
            splitArea: {
                show: true,
                areaStyle: { color: ['rgba(250,250,250,0.1)','rgba(200,200,200,0.1)'] }
            },
            splitLine: {
                // 分隔线
                lineStyle: {
                    // 属性lineStyle（详见lineStyle）控制线条样式
                    color: ['#eee']
                }
            }
        },
        timeline: {
            lineStyle: { color: '#1790cf' },
            controlStyle: {
                normal: { color: '#1790cf' },
                emphasis: { color: '#1790cf' }
            }
        },
        // K线图默认参数
        k: {
            itemStyle: {
                normal: {
                    color: '#1bb2d8',
                    // 阳线填充颜色
                    color0: '#99d2dd',
                    // 阴线填充颜色
                    lineStyle: {
                        width: 1,
                        color: '#1c7099',
                        // 阳线边框颜色
                        color0: '#88b0bb'    // 阴线边框颜色
                    }
                }
            }
        },
        map: {
            itemStyle: {
                normal: {
                    areaStyle: { color: '#ddd' },
                    label: { textStyle: { color: '#c12e34' } }
                },
                emphasis: {
                    // 也是选中样式
                    areaStyle: { color: '#99d2dd' },
                    label: { textStyle: { color: '#c12e34' } }
                }
            }
        },
        force: { itemStyle: { normal: { linkStyle: { strokeColor: '#1790cf' } } } },
        chord: {
            padding: 4,
            itemStyle: {
                normal: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                },
                emphasis: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                }
            }
        },
        gauge: {
            startAngle: 225,
            endAngle: -45,
            axisLine: {
                // 坐标轴线
                show: true,
                // 默认显示，属性show控制显示与否
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: [[0.2, '#1bb2d8'],[0.8, '#1790cf'],[1, '#1c7099']],
                    width: 8
                }
            },
            axisTick: {
                // 坐标轴小标记
                splitNumber: 10,
                // 每份split细分多少段
                length: 12,
                // 属性length控制线长
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: 'auto'
                }
            },
            axisLabel: {
                // 坐标轴文本标签，详见axis.axisLabel
                textStyle: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: 'auto'
                }
            },
            splitLine: {
                // 分隔线
                length: 18,
                // 属性length控制线长
                lineStyle: {
                    // 属性lineStyle（详见lineStyle）控制线条样式
                    color: 'auto'
                }
            },
            pointer: {
                length: '90%',
                color: 'auto'
            },
            title: {
                textStyle: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: '#333'
                }
            },
            detail: {
                textStyle: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: 'auto'
                }
            }
        },
        textStyle: { fontFamily: '\u5FAE\u8F6F\u96C5\u9ED1, Arial, Verdana, sans-serif' }
    };
});
'use strict';
/**
 * dark theme
 */
angular.module('angular-echarts.theme').factory('dark', function () {
    return {
        // 全图默认背景
        backgroundColor: '#1b1b1b',
        // 默认色板
        color: [
                    '#FE8463','#9BCA63','#FAD860','#60C0DD','#0084C6',
                    '#D7504B','#C6E579','#26C0C0','#F0805A','#F4E001',
                    '#B5C334'
                ],
        // 图表标题
        title: {
            itemGap: 8,
            textStyle: {
                fontWeight: 'normal',
                color: '#fff'    // 主标题文字颜色
            }
        },
        // 图例
        legend: {
            itemGap: 8,
            textStyle: {
                color: '#ccc'    // 图例文字颜色
            }
        },
        // 值域
        dataRange: {
            itemWidth: 15,
            color: ['#FFF808','#21BCF9'],
            textStyle: {
                color: '#ccc'    // 值域文字颜色
            }
        },
        toolbox: {
            color: ['#fff', '#fff', '#fff', '#fff'],
            effectiveColor: '#FE8463',
            disableColor: '#666',
            itemGap: 8
        },
        // 提示框
        tooltip: {
            backgroundColor: 'rgba(250,250,250,0.8)',
            // 提示背景颜色，默认为透明度为0.7的黑色
            axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: 'line',
                // 默认为直线，可选为：'line' | 'shadow'
                lineStyle: {
                    // 直线指示器样式设置
                    color: '#aaa'
                },
                crossStyle: { color: '#aaa' },
                shadowStyle: {
                    // 阴影指示器样式设置
                    color: 'rgba(200,200,200,0.2)'
                }
            },
            textStyle: { color: '#333' }
        },
        // 区域缩放控制器
        dataZoom: {
            dataBackgroundColor: '#555',
            // 数据背景颜色
            fillerColor: 'rgba(200,200,200,0.2)',
            // 填充颜色
            handleColor: '#eee',    // 手柄颜色
            type:'inside',
            show:true// 手柄颜色
        },
        // 网格
        grid: { borderWidth: 0 },
        // 类目轴
        categoryAxis: {
            axisLine: {
                // 坐标轴线
                show: false
            },
            axisTick: {
                // 坐标轴小标记
                show: false
            },
            axisLabel: {
                // 坐标轴文本标签，详见axis.axisLabel
                textStyle: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: '#ccc'
                }
            },
            splitLine: {
                // 分隔线
                show: false
            }
        },
        // 数值型坐标轴默认参数
        valueAxis: {
            axisLine: {
                // 坐标轴线
                show: false
            },
            axisTick: {
                // 坐标轴小标记
                show: false
            },
            axisLabel: {
                // 坐标轴文本标签，详见axis.axisLabel
                textStyle: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: '#ccc'
                }
            },
            splitLine: {
                // 分隔线
                lineStyle: {
                    // 属性lineStyle（详见lineStyle）控制线条样式
                    color: ['#aaa'],
                    type: 'dashed'
                }
            },
            splitArea: {
                // 分隔区域
                show: false
            }
        },
        polar: {
            name: {
                textStyle: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: '#ccc'
                }
            },
            axisLine: {
                // 坐标轴线
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: '#ddd'
                }
            },
            splitArea: {
                show: true,
                areaStyle: { color: ['rgba(250,250,250,0.2)','rgba(200,200,200,0.2)'] }
            },
            splitLine: { lineStyle: { color: '#ddd' } }
        },
        timeline: {
            label: { textStyle: { color: '#ccc' } },
            lineStyle: { color: '#aaa' },
            controlStyle: {
                normal: { color: '#fff' },
                emphasis: { color: '#FE8463' }
            },
            symbolSize: 3
        },
        // 折线图默认参数
        line: { smooth: true },
        // K线图默认参数
        k: {
            itemStyle: {
                normal: {
                    color: '#FE8463',
                    // 阳线填充颜色
                    color0: '#9BCA63',
                    // 阴线填充颜色
                    lineStyle: {
                        width: 1,
                        color: '#FE8463',
                        // 阳线边框颜色
                        color0: '#9BCA63'    // 阴线边框颜色
                    }
                }
            }
        },
        // 雷达图默认参数
        radar: {
            symbol: 'emptyCircle',
            // 图形类型
            symbolSize: 3    //symbol: null,         // 拐点图形类型
                 //symbolRotate: null,  // 图形旋转控制
        },
        pie: {
            itemStyle: {
                normal: {
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.5)'
                },
                emphasis: {
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 1)'
                }
            }
        },
        map: {
            itemStyle: {
                normal: {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    areaStyle: { color: '#ddd' },
                    label: { textStyle: { color: '#ccc' } }
                },
                emphasis: {
                    // 也是选中样式
                    areaStyle: { color: '#FE8463' },
                    label: { textStyle: { color: 'ccc' } }
                }
            }
        },
        force: { itemStyle: { normal: { linkStyle: { strokeColor: '#fff' } } } },
        chord: {
            padding: 4,
            itemStyle: {
                normal: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(228, 228, 228, 0.2)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(228, 228, 228, 0.2)'
                        }
                    }
                },
                emphasis: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(228, 228, 228, 0.9)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(228, 228, 228, 0.9)'
                        }
                    }
                }
            }
        },
        gauge: {
            startAngle: 225,
            endAngle: -45,
            axisLine: {
                // 坐标轴线
                show: true,
                // 默认显示，属性show控制显示与否
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: [[0.2, '#9BCA63'],[0.8, '#60C0DD'],[1, '#D7504B']],
                    width: 3,
                    shadowColor: '#fff',
                    //默认透明
                    shadowBlur: 10
                }
            },
            axisTick: {
                // 坐标轴小标记
                length: 15,
                // 属性length控制线长
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: 'auto',
                    shadowColor: '#fff',
                    //默认透明
                    shadowBlur: 10
                }
            },
            axisLabel: {
                // 坐标轴小标记
                textStyle: {
                    // 属性lineStyle控制线条样式
                    fontWeight: 'bolder',
                    color: '#fff',
                    shadowColor: '#fff',
                    //默认透明
                    shadowBlur: 10
                }
            },
            splitLine: {
                // 分隔线
                length: 25,
                // 属性length控制线长
                lineStyle: {
                    // 属性lineStyle（详见lineStyle）控制线条样式
                    width: 3,
                    color: '#fff',
                    shadowColor: '#fff',
                    //默认透明
                    shadowBlur: 10
                }
            },
            pointer: {
                // 分隔线
                shadowColor: '#fff',
                //默认透明
                shadowBlur: 5
            },
            title: {
                textStyle: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    fontWeight: 'bolder',
                    fontSize: 20,
                    fontStyle: 'italic',
                    color: '#fff',
                    shadowColor: '#fff',
                    //默认透明
                    shadowBlur: 10
                }
            },
            detail: {
                shadowColor: '#fff',
                //默认透明
                shadowBlur: 5,
                offsetCenter: [0, '50%'],
                // x, y，单位px
                textStyle: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    fontWeight: 'bolder',
                    color: '#fff'
                }
            }
        },
        funnel: {
            itemStyle: {
                normal: {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    borderWidth: 1
                },
                emphasis: {
                    borderColor: 'rgba(255, 255, 255, 1)',
                    borderWidth: 1
                }
            }
        },
        textStyle: { fontFamily: '\u5FAE\u8F6F\u96C5\u9ED1, Arial, Verdana, sans-serif' }
    };
});
'use strict';
/**
 * green theme
 */
angular.module('angular-echarts.theme').factory('green', function () {
    return {
        // 默认色板
        color: [
                    '#408829','#68a54a','#a9cba2','#86b379',
                    '#397b29','#8abb6f','#759c6a','#bfd3b7'
                ],
        // 图表标题
        title: {
            itemGap: 8,
            textStyle: {
                fontWeight: 'normal',
                color: '#408829'
            }
        },
        // 值域
        dataRange: { color: ['#1f610a','#97b58d'] },
        // 工具箱
        toolbox: { color: ['#408829','#408829','#408829','#408829'] },
        // 提示框
        tooltip: {
            backgroundColor: 'rgba(0,0,0,0.5)',
            axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: 'line',
                // 默认为直线，可选为：'line' | 'shadow'
                lineStyle: {
                    // 直线指示器样式设置
                    color: '#408829',
                    type: 'dashed'
                },
                crossStyle: { color: '#408829' },
                shadowStyle: {
                    // 阴影指示器样式设置
                    color: 'rgba(200,200,200,0.3)'
                }
            }
        },
        // 区域缩放控制器
        dataZoom: {
            dataBackgroundColor: '#eee',
            // 数据背景颜色
            fillerColor: 'rgba(64,136,41,0.2)',
            // 填充颜色
            type:'inside',
            show:true,
            handleColor: '#408829'    // 手柄颜色
        },
        grid: { borderWidth: 0 },
        // 类目轴
        categoryAxis: {
            axisLine: {
                // 坐标轴线
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: '#408829'
                }
            },
            splitLine: {
                // 分隔线
                lineStyle: {
                    // 属性lineStyle（详见lineStyle）控制线条样式
                    color: ['#eee']
                }
            }
        },
        // 数值型坐标轴默认参数
        valueAxis: {
            axisLine: {
                // 坐标轴线
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: '#408829'
                }
            },
            splitArea: {
                show: true,
                areaStyle: { color: ['rgba(250,250,250,0.1)','rgba(200,200,200,0.1)'] }
            },
            splitLine: {
                // 分隔线
                lineStyle: {
                    // 属性lineStyle（详见lineStyle）控制线条样式
                    color: ['#eee']
                }
            }
        },
        timeline: {
            lineStyle: { color: '#408829' },
            controlStyle: {
                normal: { color: '#408829' },
                emphasis: { color: '#408829' }
            }
        },
        // K线图默认参数
        k: {
            itemStyle: {
                normal: {
                    color: '#68a54a',
                    // 阳线填充颜色
                    color0: '#a9cba2',
                    // 阴线填充颜色
                    lineStyle: {
                        width: 1,
                        color: '#408829',
                        // 阳线边框颜色
                        color0: '#86b379'    // 阴线边框颜色
                    }
                }
            }
        },
        map: {
            itemStyle: {
                normal: {
                    areaStyle: { color: '#ddd' },
                    label: { textStyle: { color: '#c12e34' } }
                },
                emphasis: {
                    // 也是选中样式
                    areaStyle: { color: '#99d2dd' },
                    label: { textStyle: { color: '#c12e34' } }
                }
            }
        },
        force: { itemStyle: { normal: { linkStyle: { strokeColor: '#408829' } } } },
        chord: {
            padding: 4,
            itemStyle: {
                normal: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                },
                emphasis: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                }
            }
        },
        gauge: {
            startAngle: 225,
            endAngle: -45,
            axisLine: {
                // 坐标轴线
                show: true,
                // 默认显示，属性show控制显示与否
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: [[0.2, '#86b379'],[0.8, '#68a54a'],[1, '#408829']],
                    width: 8
                }
            },
            axisTick: {
                // 坐标轴小标记
                splitNumber: 10,
                // 每份split细分多少段
                length: 12,
                // 属性length控制线长
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: 'auto'
                }
            },
            axisLabel: {
                // 坐标轴文本标签，详见axis.axisLabel
                textStyle: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: 'auto'
                }
            },
            splitLine: {
                // 分隔线
                length: 18,
                // 属性length控制线长
                lineStyle: {
                    // 属性lineStyle（详见lineStyle）控制线条样式
                    color: 'auto'
                }
            },
            pointer: {
                length: '90%',
                color: 'auto'
            },
            title: {
                textStyle: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: '#333'
                }
            },
            detail: {
                textStyle: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: 'auto'
                }
            }
        },
        textStyle: { fontFamily: '\u5FAE\u8F6F\u96C5\u9ED1, Arial, Verdana, sans-serif' }
    };
});
'use strict';
/**
 * infographic theme
 */
angular.module('angular-echarts.theme').factory('infographic', function () {
    return {
        // 默认色板
        color: [
                    '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
                    '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                    '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
                ],
        // 图表标题
        title: {
            itemGap: 8,
            textStyle: {
                fontWeight: 'normal',
                color: '#27727B'    // 主标题文字颜色
            }
        },
        // 图例
        legend: { itemGap: 8 },
        // 值域
        dataRange: {
            x: 'right',
            y: 'center',
            itemWidth: 5,
            itemHeight: 25,
            color: ['#C1232B','#FCCE10']
        },
        toolbox: {
            color: [
                            '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
                            '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                        ],
            effectiveColor: '#ff4500',
            itemGap: 8
        },
        // 提示框
        tooltip: {
            backgroundColor: 'rgba(50,50,50,0.5)',
            // 提示背景颜色，默认为透明度为0.7的黑色
            axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: 'line',
                // 默认为直线，可选为：'line' | 'shadow'
                lineStyle: {
                    // 直线指示器样式设置
                    color: '#27727B',
                    type: 'dashed'
                },
                crossStyle: { color: '#27727B' },
                shadowStyle: {
                    // 阴影指示器样式设置
                    color: 'rgba(200,200,200,0.3)'
                }
            }
        },
        // 区域缩放控制器
        dataZoom: {
            dataBackgroundColor: 'rgba(181,195,52,0.3)',
            // 数据背景颜色
            fillerColor: 'rgba(181,195,52,0.2)',
            // 填充颜色
            type:'inside',
            show:true,
            handleColor: '#27727B'
        },
        // 网格
        grid: { borderWidth: 0 },
        // 类目轴
        categoryAxis: {
            axisLine: {
                // 坐标轴线
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: '#27727B'
                }
            },
            splitLine: {
                // 分隔线
                show: false
            }
        },
        // 数值型坐标轴默认参数
        valueAxis: {
            axisLine: {
                // 坐标轴线
                show: false
            },
            splitArea: { show: false },
            splitLine: {
                // 分隔线
                lineStyle: {
                    // 属性lineStyle（详见lineStyle）控制线条样式
                    color: ['#ccc'],
                    type: 'dashed'
                }
            }
        },
        polar: {
            axisLine: {
                // 坐标轴线
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: '#ddd'
                }
            },
            splitArea: {
                show: true,
                areaStyle: { color: ['rgba(250,250,250,0.2)','rgba(200,200,200,0.2)'] }
            },
            splitLine: { lineStyle: { color: '#ddd' } }
        },
        timeline: {
            lineStyle: { color: '#27727B' },
            controlStyle: {
                normal: { color: '#27727B' },
                emphasis: { color: '#27727B' }
            },
            symbol: 'emptyCircle',
            symbolSize: 3
        },
        // 柱形图默认参数
        bar: {
            itemStyle: {
                normal: { borderRadius: 0 },
                emphasis: { borderRadius: 0 }
            },
          barMaxWidth:20
        },
        // 折线图默认参数
        line: {
            itemStyle: {
                normal: {
                    borderWidth: 2,
                    borderColor: '#fff',
                    lineStyle: { width: 3 }
                },
                emphasis: { borderWidth: 0 }
            },
            symbol: 'circle',
            // 拐点图形类型
            symbolSize: 3.5    // 拐点图形大小
        },
        // K线图默认参数
        k: {
            itemStyle: {
                normal: {
                    color: '#C1232B',
                    // 阳线填充颜色
                    color0: '#B5C334',
                    // 阴线填充颜色
                    lineStyle: {
                        width: 1,
                        color: '#C1232B',
                        // 阳线边框颜色
                        color0: '#B5C334'    // 阴线边框颜色
                    }
                }
            }
        },
        // 散点图默认参数
        scatter: {
            itemdStyle: {
                normal: {
                    borderWidth: 1,
                    borderColor: 'rgba(200,200,200,0.5)'
                },
                emphasis: { borderWidth: 0 }
            },
            symbol: 'star4',
            // 图形类型
            symbolSize: 4    // 图形大小，半宽（半径）参数，当图形为方向或菱形则总宽度为symbolSize * 2
        },
        // 雷达图默认参数
        radar: {
            symbol: 'emptyCircle',
            // 图形类型
            symbolSize: 3    //symbol: null,         // 拐点图形类型
                 //symbolRotate: null,  // 图形旋转控制
        },
        map: {
            itemStyle: {
                normal: {
                    areaStyle: { color: '#ddd' },
                    label: { textStyle: { color: '#C1232B' } }
                },
                emphasis: {
                    // 也是选中样式
                    areaStyle: { color: '#fe994e' },
                    label: { textStyle: { color: 'rgb(100,0,0)' } }
                }
            }
        },
        force: { itemStyle: { normal: { linkStyle: { strokeColor: '#27727B' } } } },
        chord: {
            padding: 4,
            itemStyle: {
                normal: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                },
                emphasis: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                }
            }
        },
        gauge: {
            center: ['50%','80%'],
            radius: '100%',
            startAngle: 180,
            endAngle: 0,
            axisLine: {
                // 坐标轴线
                show: true,
                // 默认显示，属性show控制显示与否
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: [[0.2, '#B5C334'],[0.8, '#27727B'],[1, '#C1232B']],
                    width: '40%'
                }
            },
            axisTick: {
                // 坐标轴小标记
                splitNumber: 2,
                // 每份split细分多少段
                length: 5,
                // 属性length控制线长
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: '#fff'
                }
            },
            axisLabel: {
                // 坐标轴文本标签，详见axis.axisLabel
                textStyle: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: '#fff',
                    fontWeight: 'bolder'
                }
            },
            splitLine: {
                // 分隔线
                length: '5%',
                // 属性length控制线长
                lineStyle: {
                    // 属性lineStyle（详见lineStyle）控制线条样式
                    color: '#fff'
                }
            },
            pointer: {
                width: '40%',
                length: '80%',
                color: '#fff'
            },
            title: {
                offsetCenter: [0, -20],
                // x, y，单位px
                textStyle: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: 'auto',
                    fontSize: 20
                }
            },
            detail: {
                offsetCenter: [0, 0],
                // x, y，单位px
                textStyle: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: 'auto',
                    fontSize: 40
                }
            }
        },
        textStyle: { fontFamily: '\u5FAE\u8F6F\u96C5\u9ED1, Arial, Verdana, sans-serif' }
    };
});
'use strict';
/**
 * macarons theme
 */
angular.module('angular-echarts.theme').factory('macarons', function () {
    return {
        // 默认色板
        color: [
                    '#2ec7c9','#b6a2de','#5ab1ef','#ffb980','#d87a80',
                    '#8d98b3','#e5cf0d','#97b552','#95706d','#dc69aa',
                    '#07a2a4','#9a7fd1','#588dd5','#f5994e','#c05050',
                    '#59678c','#c9ab00','#7eb00a','#6f5553','#c14089'
                ],
        // 图表标题
        title: {
            itemGap: 8,
            textStyle: {
                fontWeight: 'normal',
                color: '#008acd'    // 主标题文字颜色
            }
        },
        // 图例
        legend: { itemGap: 8 },
        // 值域
        dataRange: {
            itemWidth: 15,
            //color:['#1e90ff','#afeeee']
            color: ['#2ec7c9','#b6a2de']
        },
        toolbox: {
            color: ['#1e90ff', '#1e90ff', '#1e90ff', '#1e90ff'],
            effectiveColor: '#ff4500',
            itemGap: 8
        },
        // 提示框
        tooltip: {
            backgroundColor: 'rgba(50,50,50,0.5)',
            // 提示背景颜色，默认为透明度为0.7的黑色
            axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: 'line',
                // 默认为直线，可选为：'line' | 'shadow'
                lineStyle: {
                    // 直线指示器样式设置
                    color: '#008acd',
                    type: 'dashed',
                    width: 1
                },
                crossStyle: {
                    color: '#008acd',
                    width: 1
                },
                shadowStyle: {
                    // 阴影指示器样式设置
                    color: 'rgba(200,200,200,0.2)'
                }
            }
        },
        // 区域缩放控制器
        dataZoom: {
            dataBackgroundColor: '#efefff',
            // 数据背景颜色
            fillerColor: 'rgba(182,162,222,0.2)',
            // 填充颜色
          type:'inside',
          show:true,
            handleColor: '#008acd'    // 手柄颜色
        },
        // 网格
        grid: { borderColor: '#eee' },
        // 类目轴
        categoryAxis: {
            axisLine: {
                // 坐标轴线
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: '#008acd',
                    width: 1
                }
            },
            axisLabel: {
                // label
                skipFirst: true,
                margin: 3,
                textStyle: { color: '#999999' }
            },
            axisTick: {
                // 坐标轴线
                show: false,
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: '#008acd',
                    width: 1
                }
            },
            splitLine: {
                // 分隔线
                lineStyle: {
                    // 属性lineStyle（详见lineStyle）控制线条样式
                    color: ['#eee']
                }
            }
        },
        // 数值型坐标轴默认参数
        valueAxis: {
            axisLine: {
                // 坐标轴线
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: '#008acd',
                    width: 1
                }
            },
            axisLabel: {
                // label
                skipFirst: true,
                margin: 3,
                textStyle: { color: '#999999' }
            },
            axisTick: {
                // 坐标轴线
                show: false,
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: '#008acd',
                    width: 1
                }
            },
            splitArea: {
                show: true,
                areaStyle: { color: ['rgba(250,250,250,0.1)','rgba(200,200,200,0.1)'] }
            },
            splitLine: {
                // 分隔线
                lineStyle: {
                    // 属性lineStyle（详见lineStyle）控制线条样式
                    color: ['#eee']
                }
            }
        },
        polar: {
            axisLine: {
                // 坐标轴线
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: '#ddd'
                }
            },
            splitArea: {
                show: true,
                areaStyle: { color: ['rgba(250,250,250,0.2)','rgba(200,200,200,0.2)'] }
            },
            splitLine: { lineStyle: { color: '#ddd' } }
        },
        timeline: {
            lineStyle: { color: '#008acd' },
            controlStyle: {
                normal: { color: '#008acd' },
                emphasis: { color: '#008acd' }
            },
            symbol: 'emptyCircle',
            symbolSize: 3
        },
        // 柱形图默认参数
        bar: {
          itemStyle: {
            normal: { borderRadius: 0 },
            emphasis: { borderRadius: 0 }
          },
          barMaxWidth:20
        },
        // 折线图默认参数
        line: {
            smooth: false,
            symbol: 'circle',
            // 拐点图形类型
            symbolSize: 3    // 拐点图形大小
        },
        // K线图默认参数
        k: {
            itemStyle: {
                normal: {
                    color: '#d87a80',
                    // 阳线填充颜色
                    color0: '#2ec7c9',
                    // 阴线填充颜色
                    lineStyle: {
                        width: 1,
                        color: '#d87a80',
                        // 阳线边框颜色
                        color0: '#2ec7c9'    // 阴线边框颜色
                    }
                }
            }
        },
        // 散点图默认参数
        scatter: {
            symbol: 'circle',
            // 图形类型
            symbolSize: 4    // 图形大小，半宽（半径）参数，当图形为方向或菱形则总宽度为symbolSize * 2
        },
        // 雷达图默认参数
        radar: {
            symbol: 'emptyCircle',
            // 图形类型
            symbolSize: 3    //symbol: null,         // 拐点图形类型
                 //symbolRotate: null,  // 图形旋转控制
        },
        map: {
            itemStyle: {
                normal: {
                    areaStyle: { color: '#ddd' },
                    label: { textStyle: { color: '#d87a80' } }
                },
                emphasis: {
                    // 也是选中样式
                    areaStyle: { color: '#fe994e' },
                    label: { textStyle: { color: 'rgb(100,0,0)' } }
                }
            }
        },
        force: { itemStyle: { normal: { linkStyle: { strokeColor: '#1e90ff' } } } },
        chord: {
            padding: 4,
            itemStyle: {
                normal: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                },
                emphasis: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                }
            }
        },
        gauge: {
            startAngle: 225,
            endAngle: -45,
            axisLine: {
                // 坐标轴线
                show: true,
                // 默认显示，属性show控制显示与否
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: [[0.2, '#2ec7c9'],[0.8, '#5ab1ef'],[1, '#d87a80']],
                    width: 10
                }
            },
            axisTick: {
                // 坐标轴小标记
                splitNumber: 10,
                // 每份split细分多少段
                length: 15,
                // 属性length控制线长
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: 'auto'
                }
            },
            axisLabel: {
                // 坐标轴文本标签，详见axis.axisLabel
                textStyle: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: 'auto'
                }
            },
            splitLine: {
                // 分隔线
                length: 22,
                // 属性length控制线长
                lineStyle: {
                    // 属性lineStyle（详见lineStyle）控制线条样式
                    color: 'auto'
                }
            },
            pointer: {
                width: 5,
                color: 'auto'
            },
            title: {
                textStyle: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: '#333'
                }
            },
            detail: {
                textStyle: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: 'auto'
                }
            }
        },
        textStyle: { fontFamily: '\u5FAE\u8F6F\u96C5\u9ED1, Arial, Verdana, sans-serif' }
    };
});
'use strict';
/**
 * red theme
 */
angular.module('angular-echarts.theme').factory('red', function () {
    return {
        // 默认色板
        color: [
                    '#d8361b','#f16b4c','#f7b4a9','#d26666',
                    '#99311c','#c42703','#d07e75'
                ],
        // 图表标题
        title: {
            itemGap: 8,
            textStyle: {
                fontWeight: 'normal',
                color: '#d8361b'
            }
        },
        // 值域
        dataRange: { color: ['#bd0707','#ffd2d2'] },
        // 工具箱
        toolbox: { color: ['#d8361b','#d8361b','#d8361b','#d8361b'] },
        // 提示框
        tooltip: {
            backgroundColor: 'rgba(0,0,0,0.5)',
            axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: 'line',
                // 默认为直线，可选为：'line' | 'shadow'
                lineStyle: {
                    // 直线指示器样式设置
                    color: '#d8361b',
                    type: 'dashed'
                },
                crossStyle: { color: '#d8361b' },
                shadowStyle: {
                    // 阴影指示器样式设置
                    color: 'rgba(200,200,200,0.3)'
                }
            }
        },
        // 区域缩放控制器
        dataZoom: {
            dataBackgroundColor: '#eee',
            // 数据背景颜色
            fillerColor: 'rgba(216,54,27,0.2)',
            // 填充颜色
          type:'inside',
          show:true,
            handleColor: '#d8361b'    // 手柄颜色
        },
        grid: { borderWidth: 0 },
        // 类目轴
        categoryAxis: {
            axisLine: {
                // 坐标轴线
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: '#d8361b'
                }
            },
            splitLine: {
                // 分隔线
                lineStyle: {
                    // 属性lineStyle（详见lineStyle）控制线条样式
                    color: ['#eee']
                }
            }
        },
        // 数值型坐标轴默认参数
        valueAxis: {
            axisLine: {
                // 坐标轴线
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: '#d8361b'
                }
            },
            splitArea: {
                show: true,
                areaStyle: { color: ['rgba(250,250,250,0.1)','rgba(200,200,200,0.1)'] }
            },
            splitLine: {
                // 分隔线
                lineStyle: {
                    // 属性lineStyle（详见lineStyle）控制线条样式
                    color: ['#eee']
                }
            }
        },
        timeline: {
            lineStyle: { color: '#d8361b' },
            controlStyle: {
                normal: { color: '#d8361b' },
                emphasis: { color: '#d8361b' }
            }
        },
        // K线图默认参数
        k: {
            itemStyle: {
                normal: {
                    color: '#f16b4c',
                    // 阳线填充颜色
                    color0: '#f7b4a9',
                    // 阴线填充颜色
                    lineStyle: {
                        width: 1,
                        color: '#d8361b',
                        // 阳线边框颜色
                        color0: '#d26666'    // 阴线边框颜色
                    }
                }
            }
        },
        map: {
            itemStyle: {
                normal: {
                    areaStyle: { color: '#ddd' },
                    label: { textStyle: { color: '#c12e34' } }
                },
                emphasis: {
                    // 也是选中样式
                    areaStyle: { color: '#99d2dd' },
                    label: { textStyle: { color: '#c12e34' } }
                }
            }
        },
        force: { itemStyle: { normal: { linkStyle: { strokeColor: '#d8361b' } } } },
        chord: {
            padding: 4,
            itemStyle: {
                normal: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                },
                emphasis: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                }
            }
        },
        gauge: {
            startAngle: 225,
            endAngle: -45,
            axisLine: {
                // 坐标轴线
                show: true,
                // 默认显示，属性show控制显示与否
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: [[0.2, '#f16b4c'],[0.8, '#d8361b'],[1, '#99311c']],
                    width: 8
                }
            },
            axisTick: {
                // 坐标轴小标记
                splitNumber: 10,
                // 每份split细分多少段
                length: 12,
                // 属性length控制线长
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: 'auto'
                }
            },
            axisLabel: {
                // 坐标轴文本标签，详见axis.axisLabel
                textStyle: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: 'auto'
                }
            },
            splitLine: {
                // 分隔线
                length: 18,
                // 属性length控制线长
                lineStyle: {
                    // 属性lineStyle（详见lineStyle）控制线条样式
                    color: 'auto'
                }
            },
            pointer: {
                length: '90%',
                color: 'auto'
            },
            title: {
                textStyle: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: '#333'
                }
            },
            detail: {
                textStyle: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: 'auto'
                }
            }
        },
        textStyle: { fontFamily: '\u5FAE\u8F6F\u96C5\u9ED1, Arial, Verdana, sans-serif' }
    };
});
'use strict';
/**
 * shine theme
 */
angular.module('angular-echarts.theme').factory('shine', function () {
    return {
        // 默认色板
        color: [
                    '#c12e34','#e6b600','#0098d9','#2b821d',
                    '#005eaa','#339ca8','#cda819','#32a487'
                ],
        // 图表标题
        title: {
            itemGap: 8,
            textStyle: { fontWeight: 'normal' }
        },
        // 图例
        legend: { itemGap: 8 },
        // 值域
        dataRange: {
            itemWidth: 15,
            // 值域图形宽度，线性渐变水平布局宽度为该值 * 10
            color: ['#1790cf','#a2d4e6']
        },
        // 工具箱
        toolbox: {
            color: ['#06467c','#00613c','#872d2f','#c47630'],
            itemGap: 8
        },
        // 提示框
        tooltip: { backgroundColor: 'rgba(0,0,0,0.6)' },
        // 区域缩放控制器
        dataZoom: {
            dataBackgroundColor: '#dedede',
            // 数据背景颜色
            fillerColor: 'rgba(154,217,247,0.2)',
            // 填充颜色
          type:'inside',
          show:true,
            handleColor: '#005eaa'    // 手柄颜色
        },
        grid: { borderWidth: 0 },
        // 类目轴
        categoryAxis: {
            axisLine: {
                // 坐标轴线
                show: false
            },
            axisTick: {
                // 坐标轴小标记
                show: false
            }
        },
        // 数值型坐标轴默认参数
        valueAxis: {
            axisLine: {
                // 坐标轴线
                show: false
            },
            axisTick: {
                // 坐标轴小标记
                show: false
            },
            splitArea: {
                // 分隔区域
                show: true,
                // 默认不显示，属性show控制显示与否
                areaStyle: {
                    // 属性areaStyle（详见areaStyle）控制区域样式
                    color: ['rgba(250,250,250,0.2)','rgba(200,200,200,0.2)']
                }
            }
        },
        timeline: {
            lineStyle: { color: '#005eaa' },
            controlStyle: {
                normal: { color: '#005eaa' },
                emphasis: { color: '#005eaa' }
            }
        },
        // K线图默认参数
        k: {
            itemStyle: {
                normal: {
                    color: '#c12e34',
                    // 阳线填充颜色
                    color0: '#2b821d',
                    // 阴线填充颜色
                    lineStyle: {
                        width: 1,
                        color: '#c12e34',
                        // 阳线边框颜色
                        color0: '#2b821d'    // 阴线边框颜色
                    }
                }
            }
        },
        map: {
            itemStyle: {
                normal: {
                    areaStyle: { color: '#ddd' },
                    label: { textStyle: { color: '#c12e34' } }
                },
                emphasis: {
                    // 也是选中样式
                    areaStyle: { color: '#e6b600' },
                    label: { textStyle: { color: '#c12e34' } }
                }
            }
        },
        force: { itemStyle: { normal: { linkStyle: { strokeColor: '#005eaa' } } } },
        chord: {
            padding: 4,
            itemStyle: {
                normal: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                },
                emphasis: {
                    lineStyle: {
                        width: 1,
                        color: 'rgba(128, 128, 128, 0.5)'
                    },
                    chordStyle: {
                        lineStyle: {
                            width: 1,
                            color: 'rgba(128, 128, 128, 0.5)'
                        }
                    }
                }
            }
        },
        gauge: {
            startAngle: 225,
            endAngle: -45,
            axisLine: {
                // 坐标轴线
                show: true,
                // 默认显示，属性show控制显示与否
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: [[0.2, '#2b821d'],[0.8, '#005eaa'],[1, '#c12e34']],
                    width: 5
                }
            },
            axisTick: {
                // 坐标轴小标记
                splitNumber: 10,
                // 每份split细分多少段
                length: 8,
                // 属性length控制线长
                lineStyle: {
                    // 属性lineStyle控制线条样式
                    color: 'auto'
                }
            },
            axisLabel: {
                // 坐标轴文本标签，详见axis.axisLabel
                textStyle: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: 'auto'
                }
            },
            splitLine: {
                // 分隔线
                length: 12,
                // 属性length控制线长
                lineStyle: {
                    // 属性lineStyle（详见lineStyle）控制线条样式
                    color: 'auto'
                }
            },
            pointer: {
                length: '90%',
                width: 3,
                color: 'auto'
            },
            title: {
                textStyle: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: '#333'
                }
            },
            detail: {
                textStyle: {
                    // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: 'auto'
                }
            }
        },
        textStyle: { fontFamily: '\u5FAE\u8F6F\u96C5\u9ED1, Arial, Verdana, sans-serif' }
    };
});})();

/**
 * Created by zhangzhaoyong on 16/1/27.
 */
(function ()
{
  'use strict';

  SzgcController.$inject = ["auth", "$scope"];
  angular
    .module('app.szgc')
    .controller('SzgcController', SzgcController);

  /** @ngInject */
  function SzgcController(auth,$scope)
  {

    var vm = this;
    // Data

  }
})();

(function ()
{
    'use strict';

    config.$inject = ["$stateProvider", "$translatePartialLoaderProvider", "msNavigationServiceProvider", "apiProvider"];
    angular
        .module('app.sample', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider,apiProvider)
    {
      // State
      $stateProvider
          .state('app.sample', {
              url    : '/sample',
              views  : {
                  'content@app': {
                      templateUrl: 'app/main/sample/sample.html',
                      controller : 'SampleController as vm'
                  }
              },
              resolve: {
                  SampleData: ["apiResolver", function (apiResolver)
                  {
                      return apiResolver.resolve('sample@get');
                  }]
              }
          });

      // Translation
      $translatePartialLoaderProvider.addPart('app/main/sample');

      //// Navigation
      //msNavigationServiceProvider.saveItem('fuse', {
      //    title : 'SAMPLE',
      //    group : true,
      //    weight: 1
      //});
      //
      //msNavigationServiceProvider.saveItem('fuse.sample', {
      //    title    : 'Sample',
      //    icon     : 'icon-tile-four',
      //    state    : 'app.sample',
      //    /*stateParams: {
      //        'param1': 'page'
      //     },*/
      //    translate: 'SAMPLE.SAMPLE_NAV',
      //    weight   : 1
      //});

      var $http = apiProvider.$http;
      apiProvider.register('sample',$http.resource('app/data/sample/sample.json'));

    }
})();

(function ()
{
    'use strict';

    SampleController.$inject = ["SampleData"];
    angular
        .module('app.sample')
        .controller('SampleController', SampleController);

    /** @ngInject */
    function SampleController(SampleData)
    {
        var vm = this;
 console.log('SampleController')
        // Data
        vm.helloText = SampleData.data.helloText;

        // Methods

        //////////
    }
})();

(function ()
{
    'use strict';

    angular
        .module('app.core')
        .provider('fuseTheming', fuseThemingProvider);

    /** @ngInject */
    function fuseThemingProvider()
    {
        // Inject Cookies Service
        var $cookies;

        angular.injector(['ngCookies']).invoke([
            '$cookies', function (_$cookies)
            {
                $cookies = _$cookies;
            }
        ]);

        // Inject $log service
        var $log = angular.injector(['ng']).get('$log');

        var registeredPalettes,
            registeredThemes;

        // Methods
        this.setRegisteredPalettes = setRegisteredPalettes;
        this.setRegisteredThemes = setRegisteredThemes;

        //////////

        /**
         * Set registered palettes
         *
         * @param _registeredPalettes
         */
        function setRegisteredPalettes(_registeredPalettes)
        {
            registeredPalettes = _registeredPalettes;
        }

        /**
         * Set registered themes
         *
         * @param _registeredThemes
         */
        function setRegisteredThemes(_registeredThemes)
        {
            registeredThemes = _registeredThemes;
        }

        /**
         * Service
         */
        this.$get = function ()
        {
            var service = {
                getRegisteredPalettes: getRegisteredPalettes,
                getRegisteredThemes  : getRegisteredThemes,
                setActiveTheme       : setActiveTheme,
                setThemesList        : setThemesList,
                themes               : {
                    list  : {},
                    active: {
                        'name' : '',
                        'theme': {}
                    }
                }
            };

            return service;

            //////////

            /**
             * Get registered palettes
             *
             * @returns {*}
             */
            function getRegisteredPalettes()
            {
                return registeredPalettes;
            }

            /**
             * Get registered themes
             *
             * @returns {*}
             */
            function getRegisteredThemes()
            {
                return registeredThemes;
            }

            /**
             * Set active theme
             *
             * @param themeName
             */
            function setActiveTheme(themeName)
            {
                // If theme does not exist, fallback to the default theme
                if ( angular.isUndefined(service.themes.list[themeName]) )
                {
                    // If there is no theme called "default"...
                    if ( angular.isUndefined(service.themes.list.default) )
                    {
                        $log.error('You must have at least one theme named "default"');
                        return;
                    }

                    $log.warn('The theme "' + themeName + '" does not exist! Falling back to the "default" theme.');

                    // Otherwise set theme to default theme
                    service.themes.active.name = 'pink';
                    service.themes.active.theme = service.themes.list.default;
                    $cookies.put('selectedTheme', service.themes.active.name);

                    return;
                }

                service.themes.active.name = themeName;
                service.themes.active.theme = service.themes.list[themeName];
                $cookies.put('selectedTheme', themeName);
            }

            /**
             * Set available themes list
             *
             * @param themeList
             */
            function setThemesList(themeList)
            {
                service.themes.list = themeList;
            }
        };
    }
})();

(function ()
{
    'use strict';

    config.$inject = ["$mdThemingProvider", "fusePalettes", "fuseThemes", "fuseThemingProvider"];
    angular
        .module('app.core')
        .config(config);

    /** @ngInject */
    function config($mdThemingProvider, fusePalettes, fuseThemes, fuseThemingProvider)
    {
        // Inject Cookies Service
        var $cookies;
        angular.injector(['ngCookies']).invoke([
            '$cookies', function (_$cookies)
            {
                $cookies = _$cookies;
            }
        ]);

        // Check if custom theme exist in cookies
        var customTheme = $cookies.getObject('customTheme');
        if ( customTheme )
        {
            fuseThemes['custom'] = customTheme;
        }

        $mdThemingProvider.alwaysWatchTheme(true);

        // Define custom palettes
        angular.forEach(fusePalettes, function (palette)
        {
            $mdThemingProvider.definePalette(palette.name, palette.options);
        });

        // Register custom themes
        angular.forEach(fuseThemes, function (theme, themeName)
        {
            $mdThemingProvider.theme(themeName)
                .primaryPalette(theme.primary.name, theme.primary.hues)
                .accentPalette(theme.accent.name, theme.accent.hues)
                .warnPalette(theme.warn.name, theme.warn.hues)
                .backgroundPalette(theme.background.name, theme.background.hues);
        });

        // Store generated PALETTES and THEMES objects from $mdThemingProvider
        // in our custom provider, so we can inject them into other areas
        fuseThemingProvider.setRegisteredPalettes($mdThemingProvider._PALETTES);
        fuseThemingProvider.setRegisteredThemes($mdThemingProvider._THEMES);
    }

})();
(function ()
{
    'use strict';

    var fuseThemes = {
        'default'  : {
            primary   : {
                name: 'fuse-pale-blue',
                hues: {
                    'default': '700',
                    'hue-1'  : '500',
                    'hue-2'  : '600',
                    'hue-3'  : '400'
                }
            },
            accent    : {
                name: 'light-blue',
                hues: {
                    'default': '600',
                    'hue-1'  : '400',
                    'hue-2'  : '700',
                    'hue-3'  : 'A100'
                }
            },
            warn      : {name: 'red'},
            background: {
                name: 'grey',
                hues: {
                    'default': 'A100',
                    'hue-1'  : '100',
                    'hue-2'  : '50',
                    'hue-3'  : '300'
                }
            }
        },
        'pink': {
            primary   : {
                name: 'blue-grey',
                hues: {
                    'default': '800',
                    'hue-1'  : '600',
                    'hue-2'  : '400',
                    'hue-3'  : 'A100'
                }
            },
            accent    : {
                name: 'pink',
                hues: {
                    'default': '400',
                    'hue-1'  : '300',
                    'hue-2'  : '600',
                    'hue-3'  : 'A100'
                }
            },
            warn      : {name: 'blue'},
            background: {
                name: 'grey',
                hues: {
                    'default': 'A100',
                    'hue-1'  : '100',
                    'hue-2'  : '50',
                    'hue-3'  : '300'
                }
            }
        },
        'teal'     : {
            primary   : {
                name: 'fuse-blue',
                hues: {
                    'default': '900',
                    'hue-1'  : '600',
                    'hue-2'  : '500',
                    'hue-3'  : 'A100'
                }
            },
            accent    : {
                name: 'teal',
                hues: {
                    'default': '500',
                    'hue-1'  : '400',
                    'hue-2'  : '600',
                    'hue-3'  : 'A100'
                }
            },
            warn      : {name: 'deep-orange'},
            background: {
                name: 'grey',
                hues: {
                    'default': 'A100',
                    'hue-1'  : '100',
                    'hue-2'  : '50',
                    'hue-3'  : '300'
                }
            }
        },
      'vanke'     : {
        primary   : {
          name: 'red',
          hues: {
            'default': '900',
            'hue-1'  : '600',
            'hue-2'  : '500',
            'hue-3'  : 'A100'
          }
        },
        accent    : {
          name: 'red',
          hues: {
            'default': '500',
            'hue-1'  : '400',
            'hue-2'  : '600',
            'hue-3'  : 'A100'
          }
        },
        warn      : {name: 'red'},
        background: {
          name: 'grey',
          hues: {
            'default': 'A100',
            'hue-1'  : '100',
            'hue-2'  : '50',
            'hue-3'  : '300'
          }
        }
      }
    };

    angular
        .module('app.core')
        .constant('fuseThemes', fuseThemes);
})();

(function () {
    'use strict';

    var fusePalettes = [
        {
            name: 'fuse-blue',
            options: {
                '50': '#ebf1fa',
                '100': '#c2d4ef',
                '200': '#9ab8e5',
                '300': '#78a0dc',
                '400': '#5688d3',
                '500': '#3470ca',
                '600': '#2e62b1',
                '700': '#275498',
                '800': '#21467e',
                '900': '#1a3865',
                'A100': '#c2d4ef',
                'A200': '#9ab8e5',
                'A400': '#5688d3',
                'A700': '#275498',
                'contrastDefaultColor': 'light',
                'contrastDarkColors': '50 100 200 A100',
                'contrastStrongLightColors': '300 400'
            }
        },
        {
        name: 'fuse-pale-blue',
        options: {
          '50': 'ffebee',
          '100': 'ffcdd2',
          '200': 'ef9a9a',
          '300': 'e57373',
          '400': 'ef5350',
          '500': 'f44336',
          '600': 'e53935',
          '700': 'd32f2f',
          '800': 'c62828',
          '900': 'b71c1c',
          'A100': 'ff8a80',
          'A200': 'ff5252',
          'A400': 'ff1744',
          'A700': 'd50000',
          'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
          // on this palette should be dark or light
          'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
            '200', '300', '400', 'A100'],
          'contrastLightColors': undefined
        }
      },
      {
        name: 'fuse-red',
        options: {
          '50': '#ececee',
          '100': '#c5c6cb',
          '200': '#9ea1a9',
          '300': '#7d818c',
          '400': '#5c616f',
          '500': '#3c4252',
          '600': '#353a48',
          '700': '#2d323e',
          '800': '#262933',
          '900': '#1e2129',
          'A100': '#c5c6cb',
          'A200': '#9ea1a9',
          'A400': '#5c616f',
          'A700': '#2d323e',
          'contrastDefaultColor': 'light',
          'contrastDarkColors': '50 100 200 A100',
          'contrastStrongLightColors': '300 400'
        }
      },
    ];

    angular
        .module('app.core')
        .constant('fusePalettes', fusePalettes);
})();

(function ()
{
    'use strict';

    fuseGeneratorService.$inject = ["$cookies", "$log", "fuseTheming", "msUtils"];
    angular
        .module('app.core')
        .factory('fuseGenerator', fuseGeneratorService);

    /** @ngInject */
    function fuseGeneratorService($cookies, $log, fuseTheming,msUtils)
    {
        // Storage for simplified themes object
        var themes = {};

        var service = {
            generate: generate,
            rgba    : rgba
        };

        return service;

        //////////

        /**
         * Generate less variables for each theme from theme's
         * palette by using material color naming conventions
         */
        function generate()
        {
            var registeredThemes = fuseTheming.getRegisteredThemes();
            var registeredPalettes = fuseTheming.getRegisteredPalettes();

            // First, create a simplified object that stores
            // all registered themes and their colors

            // Iterate through registered themes
            angular.forEach(registeredThemes, function (registeredTheme)
            {
                themes[registeredTheme.name] = {};

                // Iterate through color types (primary, accent, warn & background)
                angular.forEach(registeredTheme.colors, function (colorType, colorTypeName)
                {
                    themes[registeredTheme.name][colorTypeName] = {
                        'name'  : colorType.name,
                        'levels': {
                            'default': {
                                'color'    : rgba(registeredPalettes[colorType.name][colorType.hues.default].value),
                                'contrast1': rgba(registeredPalettes[colorType.name][colorType.hues.default].contrast, 1),
                                'contrast2': rgba(registeredPalettes[colorType.name][colorType.hues.default].contrast, 2),
                                'contrast3': rgba(registeredPalettes[colorType.name][colorType.hues.default].contrast, 3),
                                'contrast4': rgba(registeredPalettes[colorType.name][colorType.hues.default].contrast, 4)
                            },
                            'hue1'   : {
                                'color'    : rgba(registeredPalettes[colorType.name][colorType.hues['hue-1']].value),
                                'contrast1': rgba(registeredPalettes[colorType.name][colorType.hues['hue-1']].contrast, 1),
                                'contrast2': rgba(registeredPalettes[colorType.name][colorType.hues['hue-1']].contrast, 2),
                                'contrast3': rgba(registeredPalettes[colorType.name][colorType.hues['hue-1']].contrast, 3),
                                'contrast4': rgba(registeredPalettes[colorType.name][colorType.hues['hue-1']].contrast, 4)
                            },
                            'hue2'   : {
                                'color'    : rgba(registeredPalettes[colorType.name][colorType.hues['hue-2']].value),
                                'contrast1': rgba(registeredPalettes[colorType.name][colorType.hues['hue-2']].contrast, 1),
                                'contrast2': rgba(registeredPalettes[colorType.name][colorType.hues['hue-2']].contrast, 2),
                                'contrast3': rgba(registeredPalettes[colorType.name][colorType.hues['hue-2']].contrast, 3),
                                'contrast4': rgba(registeredPalettes[colorType.name][colorType.hues['hue-2']].contrast, 4)
                            },
                            'hue3'   : {
                                'color'    : rgba(registeredPalettes[colorType.name][colorType.hues['hue-3']].value),
                                'contrast1': rgba(registeredPalettes[colorType.name][colorType.hues['hue-3']].contrast, 1),
                                'contrast2': rgba(registeredPalettes[colorType.name][colorType.hues['hue-3']].contrast, 2),
                                'contrast3': rgba(registeredPalettes[colorType.name][colorType.hues['hue-3']].contrast, 3),
                                'contrast4': rgba(registeredPalettes[colorType.name][colorType.hues['hue-3']].contrast, 4)
                            }
                        }
                    };
                });
            });

            // Process themes one more time and then store them in the service for external use
            processAndStoreThemes(themes);

            // Iterate through simplified themes
            // object and create style variables
            var styleVars = {};

            // Iterate through registered themes
            angular.forEach(themes, function (theme, themeName)
            {
                styleVars = {};
                styleVars['@themeName'] = themeName;

                // Iterate through color types (primary, accent, warn & background)
                angular.forEach(theme, function (colorTypes, colorTypeName)
                {
                    // Iterate through color levels (default, hue1, hue2 & hue3)
                    angular.forEach(colorTypes.levels, function (colors, colorLevelName)
                    {
                        // Iterate through color name (color, contrast1, contrast2, contrast3 & contrast4)
                        angular.forEach(colors, function (color, colorName)
                        {
                            styleVars['@' + colorTypeName + ucfirst(colorLevelName) + ucfirst(colorName)] = color;
                        });
                    });
                });

                // Render styles
                render(styleVars);
            });
        }

        // ---------------------------
        //  INTERNAL HELPER FUNCTIONS
        // ---------------------------

        /**
         * Process and store themes for global use
         *
         * @param _themes
         */
        function processAndStoreThemes(_themes)
        {
            // Here we will go through every registered theme one more time
            // and try to simplify their objects as much as possible for
            // easier access to their properties.
            var themes = angular.copy(_themes);

            // Iterate through themes
            angular.forEach(themes, function (theme)
            {
                // Iterate through color types (primary, accent, warn & background)
                angular.forEach(theme, function (colorType, colorTypeName)
                {
                    theme[colorTypeName] = colorType.levels;
                    theme[colorTypeName].color = colorType.levels.default.color;
                    theme[colorTypeName].contrast1 = colorType.levels.default.contrast1;
                    theme[colorTypeName].contrast2 = colorType.levels.default.contrast2;
                    theme[colorTypeName].contrast3 = colorType.levels.default.contrast3;
                    theme[colorTypeName].contrast4 = colorType.levels.default.contrast4;
                    delete theme[colorTypeName].default;
                });
            });

            // Store themes and set selected theme for the first time
            fuseTheming.setThemesList(themes);

            // Remember selected theme.
            var selectedTheme = null;// $cookies.get('selectedTheme');

            if ( selectedTheme )
            {
                fuseTheming.setActiveTheme(selectedTheme);
            }
            else
            {
                fuseTheming.setActiveTheme(msUtils.isMobile()? 'vanke':'fuse-red');
            }
        }


        /**
         * Render css files
         *
         * @param styleVars
         */
        function render(styleVars)
        {
            var cssTemplate = '[md-theme="@themeName"] a {\n    color: @accentDefaultColor;\n}\n\n[md-theme="@themeName"] .secondary-text,\n[md-theme="@themeName"] .icon {\n    color: @backgroundDefaultContrast2;\n}\n\n[md-theme="@themeName"] .hint-text,\n[md-theme="@themeName"] .disabled-text {\n    color: @backgroundDefaultContrast3;\n}\n\n[md-theme="@themeName"] .fade-text,\n[md-theme="@themeName"] .divider {\n    color: @backgroundDefaultContrast4;\n}\n\n/* Primary */\n[md-theme="@themeName"] .md-primary-bg {\n    background-color: @primaryDefaultColor;\n    color: @primaryDefaultContrast1;\n}\n\n[md-theme="@themeName"] .md-primary-bg .secondary-text,\n[md-theme="@themeName"] .md-primary-bg .icon {\n    color: @primaryDefaultContrast2;\n}\n\n[md-theme="@themeName"] .md-primary-bg .hint-text,\n[md-theme="@themeName"] .md-primary-bg .disabled-text {\n    color: @primaryDefaultContrast3;\n}\n\n[md-theme="@themeName"] .md-primary-bg .fade-text,\n[md-theme="@themeName"] .md-primary-bg .divider {\n    color: @primaryDefaultContrast4;\n}\n\n/* Primary, Hue-1 */\n[md-theme="@themeName"] .md-primary-bg.md-hue-1 {\n    background-color: @primaryHue1Color;\n    color: @primaryHue1Contrast1;\n}\n\n[md-theme="@themeName"] .md-primary-bg.md-hue-1 .secondary-text,\n[md-theme="@themeName"] .md-primary-bg.md-hue-1 .icon {\n    color: @primaryHue1Contrast2;\n}\n\n[md-theme="@themeName"] .md-primary-bg.md-hue-1 .hint-text,\n[md-theme="@themeName"] .md-primary-bg.md-hue-1 .disabled-text {\n    color: @primaryHue1Contrast3;\n}\n\n[md-theme="@themeName"] .md-primary-bg.md-hue-1 .fade-text,\n[md-theme="@themeName"] .md-primary-bg.md-hue-1 .divider {\n    color: @primaryHue1Contrast4;\n}\n\n/* Primary, Hue-2 */\n[md-theme="@themeName"] .md-primary-bg.md-hue-2 {\n    background-color: @primaryHue2Color;\n    color: @primaryHue2Contrast1;\n}\n\n[md-theme="@themeName"] .md-primary-bg.md-hue-2 .secondary-text,\n[md-theme="@themeName"] .md-primary-bg.md-hue-2 .icon {\n    color: @primaryHue2Contrast2;\n}\n\n[md-theme="@themeName"] .md-primary-bg.md-hue-2 .hint-text,\n[md-theme="@themeName"] .md-primary-bg.md-hue-2 .disabled-text {\n    color: @primaryHue2Contrast3;\n}\n\n[md-theme="@themeName"] .md-primary-bg.md-hue-2 .fade-text,\n[md-theme="@themeName"] .md-primary-bg.md-hue-2 .divider {\n    color: @primaryHue2Contrast4;\n}\n\n/* Primary, Hue-3 */\n[md-theme="@themeName"] .md-primary-bg.md-hue-3 {\n    background-color: @primaryHue3Color;\n    color: @primaryHue3Contrast1;\n}\n\n[md-theme="@themeName"] .md-primary-bg.md-hue-3 .secondary-text,\n[md-theme="@themeName"] .md-primary-bg.md-hue-3 .icon {\n    color: @primaryHue3Contrast1;\n}\n\n[md-theme="@themeName"] .md-primary-bg.md-hue-3 .hint-text,\n[md-theme="@themeName"] .md-primary-bg.md-hue-3 .disabled-text {\n    color: @primaryHue3Contrast3;\n}\n\n[md-theme="@themeName"] .md-primary-bg.md-hue-3 .fade-text,\n[md-theme="@themeName"] .md-primary-bg.md-hue-3 .divider {\n    color: @primaryHue3Contrast4;\n}\n\n/* Primary foreground */\n[md-theme="@themeName"] .md-primary-fg {\n    color: @primaryDefaultColor !important;\n}\n\n/* Primary foreground, Hue-1 */\n[md-theme="@themeName"] .md-primary-fg.md-hue-1 {\n    color: @primaryHue1Color !important;\n}\n\n/* Primary foreground, Hue-2 */\n[md-theme="@themeName"] .md-primary-fg.md-hue-2 {\n    color: @primaryHue2Color !important;\n}\n\n/* Primary foreground, Hue-3 */\n[md-theme="@themeName"] .md-primary-fg.md-hue-3 {\n    color: @primaryHue3Color !important;\n}\n\n\n/* Accent */\n[md-theme="@themeName"] .md-accent-bg {\n    background-color: @accentDefaultColor;\n    color: @accentDefaultContrast1;\n}\n\n[md-theme="@themeName"] .md-accent-bg .secondary-text,\n[md-theme="@themeName"] .md-accent-bg .icon {\n    color: @accentDefaultContrast2;\n}\n\n[md-theme="@themeName"] .md-accent-bg .hint-text,\n[md-theme="@themeName"] .md-accent-bg .disabled-text {\n    color: @accentDefaultContrast3;\n}\n\n[md-theme="@themeName"] .md-accent-bg .fade-text,\n[md-theme="@themeName"] .md-accent-bg .divider {\n    color: @accentDefaultContrast4;\n}\n\n/* Accent, Hue-1 */\n[md-theme="@themeName"] .md-accent-bg.md-hue-1 {\n    background-color: @accentHue1Color;\n    color: @accentHue1Contrast1;\n}\n\n[md-theme="@themeName"] .md-accent-bg.md-hue-1 .secondary-text,\n[md-theme="@themeName"] .md-accent-bg.md-hue-1 .icon {\n    color: @accentHue1Contrast2;\n}\n\n[md-theme="@themeName"] .md-accent-bg.md-hue-1 .hint-text,\n[md-theme="@themeName"] .md-accent-bg.md-hue-1 .disabled-text {\n    color: @accentHue1Contrast3;\n}\n\n[md-theme="@themeName"] .md-accent-bg.md-hue-1 .fade-text,\n[md-theme="@themeName"] .md-accent-bg.md-hue-1 .divider {\n    color: @accentHue1Contrast4;\n}\n\n/* Accent, Hue-2 */\n[md-theme="@themeName"] .md-accent-bg.md-hue-2 {\n    background-color: @accentHue2Color;\n    color: @accentHue2Contrast1;\n}\n\n[md-theme="@themeName"] .md-accent-bg.md-hue-2 .secondary-text,\n[md-theme="@themeName"] .md-accent-bg.md-hue-2 .icon {\n    color: @accentHue2Contrast2;\n}\n\n[md-theme="@themeName"] .md-accent-bg.md-hue-2 .hint-text,\n[md-theme="@themeName"] .md-accent-bg.md-hue-2 .disabled-text {\n    color: @accentHue2Contrast3;\n}\n\n[md-theme="@themeName"] .md-accent-bg.md-hue-2 .fade-text,\n[md-theme="@themeName"] .md-accent-bg.md-hue-2 .divider {\n    color: @accentHue2Contrast4;\n}\n\n/* Accent, Hue-3 */\n[md-theme="@themeName"] .md-accent-bg.md-hue-3 {\n    background-color: @accentHue3Color;\n    color: @accentHue3Contrast1;\n}\n\n[md-theme="@themeName"] .md-accent-bg.md-hue-3 .secondary-text,\n[md-theme="@themeName"] .md-accent-bg.md-hue-3 .icon {\n    color: @accentHue3Contrast1;\n}\n\n[md-theme="@themeName"] .md-accent-bg.md-hue-3 .hint-text,\n[md-theme="@themeName"] .md-accent-bg.md-hue-3 .disabled-text {\n    color: @accentHue3Contrast3;\n}\n\n[md-theme="@themeName"] .md-accent-bg.md-hue-3 .fade-text,\n[md-theme="@themeName"] .md-accent-bg.md-hue-3 .divider {\n    color: @accentHue3Contrast4;\n}\n\n/* Accent foreground */\n[md-theme="@themeName"] .md-accent-fg {\n    color: @accentDefaultColor !important;\n}\n\n/* Accent foreground, Hue-1 */\n[md-theme="@themeName"] .md-accent-fg.md-hue-1 {\n    color: @accentHue1Color !important;\n}\n\n/* Accent foreground, Hue-2 */\n[md-theme="@themeName"] .md-accent-fg.md-hue-2 {\n    color: @accentHue2Color !important;\n}\n\n/* Accent foreground, Hue-3 */\n[md-theme="@themeName"] .md-accent-fg.md-hue-3 {\n    color: @accentHue3Color !important;\n}\n\n\n/* Warn */\n[md-theme="@themeName"] .md-warn-bg {\n    background-color: @warnDefaultColor;\n    color: @warnDefaultContrast1;\n}\n\n[md-theme="@themeName"] .md-warn-bg .secondary-text,\n[md-theme="@themeName"] .md-warn-bg .icon {\n    color: @warnDefaultContrast2;\n}\n\n[md-theme="@themeName"] .md-warn-bg .hint-text,\n[md-theme="@themeName"] .md-warn-bg .disabled-text {\n    color: @warnDefaultContrast3;\n}\n\n[md-theme="@themeName"] .md-warn-bg .fade-text,\n[md-theme="@themeName"] .md-warn-bg .divider {\n    color: @warnDefaultContrast4;\n}\n\n/* Warn, Hue-1 */\n[md-theme="@themeName"] .md-warn-bg.md-hue-1 {\n    background-color: @warnHue1Color;\n    color: @warnHue1Contrast1;\n}\n\n[md-theme="@themeName"] .md-warn-bg.md-hue-1 .secondary-text,\n[md-theme="@themeName"] .md-warn-bg.md-hue-1 .icon {\n    color: @warnHue1Contrast2;\n}\n\n[md-theme="@themeName"] .md-warn-bg.md-hue-1 .hint-text,\n[md-theme="@themeName"] .md-warn-bg.md-hue-1 .disabled-text {\n    color: @warnHue1Contrast3;\n}\n\n[md-theme="@themeName"] .md-warn-bg.md-hue-1 .fade-text,\n[md-theme="@themeName"] .md-warn-bg.md-hue-1 .divider {\n    color: @warnHue1Contrast4;\n}\n\n/* Warn, Hue-2 */\n[md-theme="@themeName"] .md-warn-bg.md-hue-2 {\n    background-color: @warnHue2Color;\n    color: @warnHue2Contrast1;\n}\n\n[md-theme="@themeName"] .md-warn-bg.md-hue-2 .secondary-text,\n[md-theme="@themeName"] .md-warn-bg.md-hue-2 .icon {\n    color: @warnHue2Contrast2;\n}\n\n[md-theme="@themeName"] .md-warn-bg.md-hue-2 .hint-text,\n[md-theme="@themeName"] .md-warn-bg.md-hue-2 .disabled-text {\n    color: @warnHue2Contrast3;\n}\n\n[md-theme="@themeName"] .md-warn-bg.md-hue-2 .fade-text,\n[md-theme="@themeName"] .md-warn-bg.md-hue-2 .divider {\n    color: @warnHue2Contrast4;\n}\n\n/* Warn, Hue-3 */\n[md-theme="@themeName"] .md-warn-bg.md-hue-3 {\n    background-color: @warnHue3Color;\n    color: @warnHue3Contrast1;\n}\n\n[md-theme="@themeName"] .md-warn-bg.md-hue-3 .secondary-text,\n[md-theme="@themeName"] .md-warn-bg.md-hue-3 .icon {\n    color: @warnHue3Contrast1;\n}\n\n[md-theme="@themeName"] .md-warn-bg.md-hue-3 .hint-text,\n[md-theme="@themeName"] .md-warn-bg.md-hue-3 .disabled-text {\n    color: @warnHue3Contrast3;\n}\n\n[md-theme="@themeName"] .md-warn-bg.md-hue-3 .fade-text,\n[md-theme="@themeName"] .md-warn-bg.md-hue-3 .divider {\n    color: @warnHue3Contrast4;\n}\n\n/* Warn foreground */\n[md-theme="@themeName"] .md-warn-fg {\n    color: @warnDefaultColor !important;\n}\n\n/* Warn foreground, Hue-1 */\n[md-theme="@themeName"] .md-warn-fg.md-hue-1 {\n    color: @warnHue1Color !important;\n}\n\n/* Warn foreground, Hue-2 */\n[md-theme="@themeName"] .md-warn-fg.md-hue-2 {\n    color: @warnHue2Color !important;\n}\n\n/* Warn foreground, Hue-3 */\n[md-theme="@themeName"] .md-warn-fg.md-hue-3 {\n    color: @warnHue3Color !important;\n}\n\n/* Background */\n[md-theme="@themeName"] .md-background-bg {\n    background-color: @backgroundDefaultColor;\n    color: @backgroundDefaultContrast1;\n}\n\n[md-theme="@themeName"] .md-background-bg .secondary-text,\n[md-theme="@themeName"] .md-background-bg .icon {\n    color: @backgroundDefaultContrast2;\n}\n\n[md-theme="@themeName"] .md-background-bg .hint-text,\n[md-theme="@themeName"] .md-background-bg .disabled-text {\n    color: @backgroundDefaultContrast3;\n}\n\n[md-theme="@themeName"] .md-background-bg .fade-text,\n[md-theme="@themeName"] .md-background-bg .divider {\n    color: @backgroundDefaultContrast4;\n}\n\n/* Background, Hue-1 */\n[md-theme="@themeName"] .md-background-bg.md-hue-1 {\n    background-color: @backgroundHue1Color;\n    color: @backgroundHue1Contrast1;\n}\n\n[md-theme="@themeName"] .md-background-bg.md-hue-1 .secondary-text,\n[md-theme="@themeName"] .md-background-bg.md-hue-1 .icon {\n    color: @backgroundHue1Contrast2;\n}\n\n[md-theme="@themeName"] .md-background-bg.md-hue-1 .hint-text,\n[md-theme="@themeName"] .md-background-bg.md-hue-1 .disabled-text {\n    color: @backgroundHue1Contrast3;\n}\n\n[md-theme="@themeName"] .md-background-bg.md-hue-1 .fade-text,\n[md-theme="@themeName"] .md-background-bg.md-hue-1 .divider {\n    color: @backgroundHue1Contrast4;\n}\n\n/* Background, Hue-2 */\n[md-theme="@themeName"] .md-background-bg.md-hue-2 {\n    background-color: @backgroundHue2Color;\n    color: @backgroundHue2Contrast1;\n}\n\n[md-theme="@themeName"] .md-background-bg.md-hue-2 .secondary-text,\n[md-theme="@themeName"] .md-background-bg.md-hue-2 .icon {\n    color: @backgroundHue2Contrast2;\n}\n\n[md-theme="@themeName"] .md-background-bg.md-hue-2 .hint-text,\n[md-theme="@themeName"] .md-background-bg.md-hue-2 .disabled-text {\n    color: @backgroundHue2Contrast3;\n}\n\n[md-theme="@themeName"] .md-background-bg.md-hue-2 .fade-text,\n[md-theme="@themeName"] .md-background-bg.md-hue-2 .divider {\n    color: @backgroundHue2Contrast4;\n}\n\n/* Background, Hue-3 */\n[md-theme="@themeName"] .md-background-bg.md-hue-3 {\n    background-color: @backgroundHue3Color;\n    color: @backgroundHue3Contrast1;\n}\n\n[md-theme="@themeName"] .md-background-bg.md-hue-3 .secondary-text,\n[md-theme="@themeName"] .md-background-bg.md-hue-3 .icon {\n    color: @backgroundHue3Contrast1;\n}\n\n[md-theme="@themeName"] .md-background-bg.md-hue-3 .hint-text,\n[md-theme="@themeName"] .md-background-bg.md-hue-3 .disabled-text {\n    color: @backgroundHue3Contrast3;\n}\n\n[md-theme="@themeName"] .md-background-bg.md-hue-3 .fade-text,\n[md-theme="@themeName"] .md-background-bg.md-hue-3 .divider {\n    color: @backgroundHue3Contrast4;\n}\n\n/* Background foreground */\n[md-theme="@themeName"] .md-background-fg {\n    color: @backgroundDefaultColor !important;\n}\n\n/* Background foreground, Hue-1 */\n[md-theme="@themeName"] .md-background-fg.md-hue-1 {\n    color: @backgroundHue1Color !important;\n}\n\n/* Background foreground, Hue-2 */\n[md-theme="@themeName"] .md-background-fg.md-hue-2 {\n    color: @backgroundHue2Color !important;\n}\n\n/* Background foreground, Hue-3 */\n[md-theme="@themeName"] .md-background-fg.md-hue-3 {\n    color: @backgroundHue3Color !important;\n}';

            var regex = new RegExp(Object.keys(styleVars).join('|'), 'gi');
            var css = cssTemplate.replace(regex, function (matched)
            {
                return styleVars[matched];
            });

            var headEl = angular.element('head');
            var styleEl = angular.element('<style type="text/css"></style>');
            styleEl.html(css);
            headEl.append(styleEl);
        }

        /**
         * Convert color array to rgb/rgba
         * Also apply contrasts if needed
         *
         * @param color
         * @param _contrastLevel
         * @returns {string}
         */
        function rgba(color, _contrastLevel)
        {
            var contrastLevel = _contrastLevel || false;

            // Convert 255,255,255,0.XX to 255,255,255
            // According to Google's Material design specs, white primary
            // text must have opacity of 1 and we will fix that here
            // because Angular Material doesn't care about that spec
            if ( color.length === 4 && color[0] === 255 && color[1] === 255 && color[2] === 255 )
            {
                color.splice(3, 4);
            }

            // If contrast level provided, apply it to the current color
            if ( contrastLevel )
            {
                color = applyContrast(color, contrastLevel);
            }

            // Convert color array to color string (rgb/rgba)
            if ( color.length === 3 )
            {
                return 'rgb(' + color.join(',') + ')';
            }
            else if ( color.length === 4 )
            {
                return 'rgba(' + color.join(',') + ')';
            }
            else
            {
                $log.error('Invalid number of arguments supplied in the color array: ' + color.length + '\n' + 'The array must have 3 or 4 colors.');
            }
        }

        /**
         * Apply given contrast level to the given color
         *
         * @param color
         * @param contrastLevel
         */
        function applyContrast(color, contrastLevel)
        {
            var contrastLevels = {
                'white': {
                    '1': '1',
                    '2': '0.7',
                    '3': '0.3',
                    '4': '0.12'
                },
                'black': {
                    '1': '0.87',
                    '2': '0.54',
                    '3': '0.26',
                    '4': '0.12'
                }
            };

            // If white
            if ( color[0] === 255 && color[1] === 255 && color[2] === 255 )
            {
                color[3] = contrastLevels.white[contrastLevel];
            }
            // If black
            else if ( color[0] === 0 && color[1] === 0, color[2] === 0 )
            {
                color[3] = contrastLevels.black[contrastLevel];
            }

            return color;
        }

        /**
         * Uppercase first
         */
        function ucfirst(string)
        {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
    }

})();

(function ()
{
    'use strict';

    MsThemeOptionsController.$inject = ["$cookies", "fuseTheming"];
    angular
        .module('app.core')
        .controller('MsThemeOptionsController', MsThemeOptionsController)
        .directive('msThemeOptions', msThemeOptions);

    /** @ngInject */
    function MsThemeOptionsController($cookies, fuseTheming)
    {
        var vm = this;

        // Data
        vm.themes = fuseTheming.themes;
        vm.layoutMode = 'wide';
        vm.layoutStyle = $cookies.get('layoutStyle') || 'verticalNavigation';

        // Methods
        vm.setActiveTheme = setActiveTheme;
        vm.updateLayoutMode = updateLayoutMode;
        vm.updateLayoutStyle = updateLayoutStyle;

        //////////

        /**
         * Set active theme
         *
         * @param themeName
         */
        function setActiveTheme(themeName)
        {
            // Set active theme
            fuseTheming.setActiveTheme(themeName);
        }

        /**
         * Update layout mode
         */
        function updateLayoutMode()
        {
            var bodyEl = angular.element('body');

            // Update class on body element
            bodyEl.toggleClass('boxed', (vm.layoutMode === 'boxed'));
        }

        /**
         * Update layout style
         */
        function updateLayoutStyle()
        {
            // Update the cookie
            $cookies.put('layoutStyle', vm.layoutStyle);

            // Reload the page to apply the changes
            location.reload();
        }
    }

    /** @ngInject */
    function msThemeOptions()
    {
        return {
            restrict   : 'E',
            scope      : {
                panelOpen: '='
            },
            controller : 'MsThemeOptionsController as vm',
            templateUrl: 'app/core/theme-options/theme-options.html',
            compile    : function (tElement)
            {
                tElement.addClass('ms-theme-options');

                return function postLink(scope, iElement)
                {
                    var bodyEl = angular.element('body'),
                        backdropEl = angular.element('<div class="ms-theme-options-backdrop"></div>');

                    // Panel open status
                    scope.panelOpen = scope.panelOpen || false;

                    /**
                     * Toggle options panel
                     */
                    function toggleOptionsPanel()
                    {
                        if ( scope.panelOpen )
                        {
                            closeOptionsPanel();
                        }
                        else
                        {
                            openOptionsPanel();
                        }
                    }

                    function openOptionsPanel()
                    {
                        // Set panelOpen status
                        scope.panelOpen = true;

                        // Add open class
                        iElement.addClass('open');

                        // Append the backdrop
                        bodyEl.append(backdropEl);

                        // Register the event
                        backdropEl.on('click touch', closeOptionsPanel);
                    }

                    /**
                     * Close options panel
                     */
                    function closeOptionsPanel()
                    {
                        // Set panelOpen status
                        scope.panelOpen = false;

                        // Remove open class
                        iElement.removeClass('open');

                        // De-register the event
                        backdropEl.off('click touch', closeOptionsPanel);

                        // Remove the backdrop
                        backdropEl.remove();
                    }

                    // Expose the toggle function
                    scope.toggleOptionsPanel = toggleOptionsPanel;
                };
            }
        };
    }
})();

/**
 * Created by zhangzhaoyong on 16/1/29.
 */
(function(){
  'use strict';

  utilsFactory.$inject = ["$mdToast", "$mdDialog"];
  angular
    .module('app.core')
    .factory('utils', utilsFactory);


  /** @ngInject */
  function  utilsFactory($mdToast,$mdDialog){
    function accSub(arg2, arg1) {
      var r1, r2, m, n;
      try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
      try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
      m = Math.pow(10, Math.max(r1, r2));
      n = (r1 >= r2) ? r1 : r2;
      return parseFloat(((arg2 * m - arg1 * m) / m).toFixed(n));
    }
    function accAdd(arg2, arg1) {
      var r1, r2, m;
      try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
      try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
      m = Math.pow(10, Math.max(r1, r2));
      return parseFloat((arg1 * m + arg2 * m) / m);
    }
    function accMul(arg2, arg1) {
      var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
      try { m += s1.split(".")[1].length } catch (e) { }
      try { m += s2.split(".")[1].length } catch (e) { }
      return parseFloat(Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m));
    }
    function accDiv(arg1, arg2) {
      var t1 = 0, t2 = 0, r1, r2;
      try { t1 = arg1.toString().split(".")[1].length } catch (e) { }
      try { t2 = arg2.toString().split(".")[1].length } catch (e) { }
      //with (Math) {

        r1 = Number(arg1.toString().replace(".", ""));
        r2 = Number(arg2.toString().replace(".", ""));
        return parseFloat((r1 / r2) * Math.pow(10, t2 - t1));
      //}
    }
    return {
      math: {
        //+
        sum:function(){
          var t=0,arg = arguments,p;
          for(var i=0;i<arg.length;i++){
            p = parseFloat(arg[i]);
            if (!isNaN(p))
              t = accAdd(t, p);
          }
          return t;
        },
        //"/"
        div: function (a, b) {
          return accDiv(a, b);
        },
        //*
        mul: function (a, b) {
          return accMul(a, b);
        },
        //-
        sub: function (a, b) {
          return accSub(a, b);
        }
      },
      tips:tipsMessage,
      alert:alertMessage,
      confirm:confirmMessage,
      error:errorMessage,
      copy:copyFn
    };

    function tipsMessage(message){
      return $mdToast.show(
        $mdToast
          .simple()
          .textContent(message)
          .position({
            bottom:false,
            top:true,
            right:true
          })
          .hideDelay(3000)
      );
    }

    function alertMessage(message,ev){
      return $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('body')))
          .clickOutsideToClose(true)
          .title('温馨提示')
          .textContent(message)
          .ariaLabel('温馨提示')
          .ok('确定')
          .targetEvent(ev)
      );
    }

    function confirmMessage(message,ev,ok,cancel){
      return $mdDialog.show(
        $mdDialog.confirm()
          .title('需要您的确认')
          .textContent(message)
          .ariaLabel('需要您的确认')
          .targetEvent(ev)
          .ok('确定')
          .cancel( '取消')
      );
    }

    function copyFn(a,b,c,d){
      return angular.copy(a,b,c,d)
    }

    function errorMessage(message,errorData){
      return $mdToast.show(
        $mdToast
          .simple()
          .textContent(message+(errorData?errorData:''))
          .position({
            bottom:false,
            top:true,
            right:true
          })
          .hideDelay(3000)
      );
    }
  }
})();

/**
 * Created by jiuyuong on 2016/1/22.
 */
(function(){
  'use strict';
  authToken.$inject = ["$cookies", "$rootScope", "$injector"];
  angular
    .module('app.core')
    .factory('authToken',authToken);
  /** @ngInject */
  function authToken($cookies,$rootScope,$injector){
    var token,tokenInjector,_401,lastTipTime;

    tokenInjector = {
      setToken      : setToken,
      getToken      : getToken,
      request       : onHttpRequest,
      responseError : onHttpResponseError,
      on401         : on401
    };

    return tokenInjector;

    function setToken(tk){
      token = tk && tk.access_token ? (tk.token_type||'Bearer') + ' ' + tk.access_token : null;
      if(token)
        $cookies.put('token',token);
      else
        $cookies.remove('token');
    }

    function getToken(){
      if(!token)
        token = $cookies.get('token');
      return token;
    }

    function onHttpRequest(config){
      var token = getToken();
      if(token && !config.headers['Authorization'])
        config.headers['Authorization'] = token;
      return config;
    }

    function onHttpResponseError(rejection) {
      if (rejection.status == 401 && !rejection.config.isRetry) {
        if (_401) {
          rejection.config.isRetry = true;
          return _401.call(tokenInjector, rejection).then(function () {
            return $injector.get('$http')(rejection.config);
          }).catch(function () {
            $rootScope.$emit('user:needlogin');
          });
        }
        else {
          $rootScope.$emit('user:needlogin');
        }
      }
      else {
        if (rejection && rejection.status != -1) {
          if (!lastTipTime || new Date().getTime() - lastTipTime < 10000) {
            lastTipTime = new Date().getTime();
            $injector.invoke(['utils', function (utils) {
              utils.alert(rejection.data && rejection.data.Message ? rejection.data.Message : '网络错误');
            }]);
          }
        }
      }
    }

    function on401(fn) {
      _401 = fn;
    }

  }
})();

/**
 * Created by jiuyuong on 2016/1/22.
 */
/**
 * Created by jiuyuong on 2016/1/22.
 */
//(function(){
//  'use strict';
//  angular
//    .module('app.core')
//    .factory('sxt',sxtServe);
//  /** @ngInject */
//  function sxtServe($q){
//    var s = window.sxt||{},forEach = angular.forEach;
//    s.invoke = invokeFn;
//    return s;
//
//    function invokeFn(array,name, config){
//      var chain = [];
//      var promise = $q.when (config);
//      forEach (array, function (interceptor) {
//        if (interceptor[name]) {
//          chain.unshift(interceptor[name]);
//        }
//      });
//
//      while (chain.length) {
//        var thenFn = chain.shift ();
//        promise = promise.then(thenFn);
//      }
//      return promise;
//    }
//  }
//})();
(function(){
  'use strict';
  sxtServe.$inject = ["$q"];
  angular
    .module('app.core')
    .factory('sxt',sxtServe);
  /** @ngInject */
  function sxtServe($q){
    var s = window.sxt||{},forEach = angular.forEach;
    s.invoke = invokeFn;
    s.uuid = uuidfn;
    return s;

    function invokeFn(array,name, config){
      var chain = [];
      var promise = $q.when (config);
      forEach (array, function (interceptor) {
        if (interceptor[name]) {
          chain.unshift(interceptor[name]);
        }
      });

      while (chain.length) {
        var thenFn = chain.shift ();
        promise = promise.then(thenFn);
      }
      return promise;
    }

    function uuidfn(){
      var d = new Date().getTime();
      if(window.performance && typeof window.performance.now === "function"){
        d += performance.now();
      }
      var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
      });
      return uuid;
    }
  }
})();

/**
 * Created by jiuyuong on 2016/1/27.
 */

(function ()
{
    'use strict';

    msUtils.$inject = ["$window"];
    angular
        .module('app.core')
        .factory('msUtils', msUtils);

    /** @ngInject */
    function msUtils($window)
    {
        // Private variables
        var mobileDetect = new MobileDetect($window.navigator.userAgent),
            browserInfo = null;

        var service = {
            exists       : exists,
            detectBrowser: detectBrowser,
            guidGenerator: guidGenerator,
            isMobile     : isMobile,
            toggleInArray: toggleInArray
        };

        return service;

        //////////

        /**
         * Check if item exists in a list
         *
         * @param item
         * @param list
         * @returns {boolean}
         */
        function exists(item, list)
        {
            return list.indexOf(item) > -1;
        }

        /**
         * Returns browser information
         * from user agent data
         *
         * Found at http://www.quirksmode.org/js/detect.html
         * but modified and updated to fit for our needs
         */
        function detectBrowser()
        {
            // If we already tested, do not test again
            if ( browserInfo )
            {
                return browserInfo;
            }

            var browserData = [
                {
                    string       : $window.navigator.userAgent,
                    subString    : "Edge",
                    versionSearch: "Edge",
                    identity     : "Edge"
                },
                {
                    string   : $window.navigator.userAgent,
                    subString: "Chrome",
                    identity : "Chrome"
                },
                {
                    string       : $window.navigator.userAgent,
                    subString    : "OmniWeb",
                    versionSearch: "OmniWeb/",
                    identity     : "OmniWeb"
                },
                {
                    string       : $window.navigator.vendor,
                    subString    : "Apple",
                    versionSearch: "Version",
                    identity     : "Safari"
                },
                {
                    prop    : $window.opera,
                    identity: "Opera"
                },
                {
                    string   : $window.navigator.vendor,
                    subString: "iCab",
                    identity : "iCab"
                },
                {
                    string   : $window.navigator.vendor,
                    subString: "KDE",
                    identity : "Konqueror"
                },
                {
                    string   : $window.navigator.userAgent,
                    subString: "Firefox",
                    identity : "Firefox"
                },
                {
                    string   : $window.navigator.vendor,
                    subString: "Camino",
                    identity : "Camino"
                },
                {
                    string   : $window.navigator.userAgent,
                    subString: "Netscape",
                    identity : "Netscape"
                },
                {
                    string       : $window.navigator.userAgent,
                    subString    : "MSIE",
                    identity     : "Explorer",
                    versionSearch: "MSIE"
                },
                {
                    string       : $window.navigator.userAgent,
                    subString    : "Trident/7",
                    identity     : "Explorer",
                    versionSearch: "rv"
                },
                {
                    string       : $window.navigator.userAgent,
                    subString    : "Gecko",
                    identity     : "Mozilla",
                    versionSearch: "rv"
                },
                {
                    string       : $window.navigator.userAgent,
                    subString    : "Mozilla",
                    identity     : "Netscape",
                    versionSearch: "Mozilla"
                }
            ];

            var osData = [
                {
                    string   : $window.navigator.platform,
                    subString: "Win",
                    identity : "Windows"
                },
                {
                    string   : $window.navigator.platform,
                    subString: "Mac",
                    identity : "Mac"
                },
                {
                    string   : $window.navigator.platform,
                    subString: "Linux",
                    identity : "Linux"
                },
                {
                    string   : $window.navigator.platform,
                    subString: "iPhone",
                    identity : "iPhone"
                },
                {
                    string   : $window.navigator.platform,
                    subString: "iPod",
                    identity : "iPod"
                },
                {
                    string   : $window.navigator.platform,
                    subString: "iPad",
                    identity : "iPad"
                },
                {
                    string   : $window.navigator.platform,
                    subString: "Android",
                    identity : "Android"
                }
            ];

            var versionSearchString = '';

            function searchString(data)
            {
                for ( var i = 0; i < data.length; i++ )
                {
                    var dataString = data[i].string;
                    var dataProp = data[i].prop;

                    versionSearchString = data[i].versionSearch || data[i].identity;

                    if ( dataString )
                    {
                        if ( dataString.indexOf(data[i].subString) != -1 )
                        {
                            return data[i].identity;

                        }
                    }
                    else if ( dataProp )
                    {
                        return data[i].identity;
                    }
                }
            }

            function searchVersion(dataString)
            {
                var index = dataString.indexOf(versionSearchString);

                if ( index == -1 )
                {
                    return;
                }

                return parseInt(dataString.substring(index + versionSearchString.length + 1));
            }

            var browser = searchString(browserData) || "unknown-browser";
            var version = searchVersion($window.navigator.userAgent) || searchVersion($window.navigator.appVersion) || "unknown-version";
            var os = searchString(osData) || "unknown-os";

            // Prepare and store the object
            browser = browser.toLowerCase();
            version = browser + '-' + version;
            os = os.toLowerCase();

            browserInfo = {
                browser: browser,
                version: version,
                os     : os
            };

            return browserInfo;
        }

        /**
         * Generates a globally unique id
         *
         * @returns {*}
         */
        function guidGenerator()
        {
            var S4 = function ()
            {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            };
            return (S4() + S4() + S4() + S4() + S4() + S4());
        }

        /**
         * Return if current device is a
         * mobile device or not
         */
        function isMobile()
        {
            return mobileDetect.mobile();
        }

        /**
         * Toggle in array (push or splice)
         *
         * @param item
         * @param array
         */
        function toggleInArray(item, array)
        {
            if ( array.indexOf(item) == -1 )
            {
                array.push(item);
            }
            else
            {
                array.splice(array.indexOf(item), 1);
            }
        }
    }
})();

/**
 * Created by jiuyuong on 2016/1/23.
 */
(function(){
  'use strict';
  localAuth.$inject = ["sxt", "$q"];
  angular
    .module('app.core')
    .factory('localAuth',localAuth);
  /** @ngInject */
  function localAuth(sxt,$q){
    var auth = {
      token:token,
      profile:profile
    };

    return auth;

    function token(user){
      return user;
    }
    function profile(token,user){
      if(!token || !token.RealName){
        if(sxt.connection.isOnline())return token;
        return $q(function(resolve) {
          sxt.cache.getProfile (function (profile) {
            resolve(profile||token);
          },user);
        });
      }
    }
  }
})();

/**
 * Created by jiuyuong on 2016/4/28.
 */
(function(){
  'use strict';

  angular
    .module('app.core')
    .provider('db',pouchDB);
/** @ngInject */
  function pouchDB() {
  $get.$inject = ["$window", "$q"];
  var self = this;
  self.methods = {
    destroy: 'qify',
    put: 'qify',
    post: 'qify',
    get: 'qify',
    remove: 'qify',
    bulkDocs: 'qify',
    bulkGet: 'qify',
    allDocs: 'qify',
    putAttachment: 'qify',
    getAttachment: 'qify',
    removeAttachment: 'qify',
    query: 'qify',
    viewCleanup: 'qify',
    info: 'qify',
    compact: 'qify',
    revsDiff: 'qify',
    search:'qify',
    changes: 'eventEmitter',
    sync: 'eventEmitter',
    replicate: {
      to: 'eventEmitter',
      from: 'eventEmitter'
    },
    add:function () {
      var args = Array.prototype.slice.call(arguments);
      this.create(args);
    },
    addOrUpdate:function(obj){
      var self = this;
      if(obj._id){
        return self.get(obj._id).then(function(doc){
          obj._rev = doc._rev;
          return self.put(obj);
        }).catch(function(){
          return self.put(obj);
        });
      }
    },
    bulkAddOrUpdate:function(arr){
     var self=this;
     return this.findAll().then(function(o){
         var  rows= o.rows,tmp;
         arr.forEach(function(t){
            if (t._id){
              tmp=rows.find(function(e){ return t._id= e._id });
              if (tmp){
                t._rev=tmp._rev
              }
            }
         })
         return self.bulkDocs(arr);
      });
    },
    getOrAdd:function (obj) {
      var self = this;
      if(obj._id){
        return self.get(obj._id).then(function(doc){
          return doc;
        }).catch(function(){
          return self.put(obj).then(function () {
            return obj;
          });
        });
      }
    },
    update:function (obj) {
      var self = this;
      if(obj._id){
        return self.get(obj._id).then(function(doc){
          obj._rev = doc._rev;
          return self.put(obj);
        });
      }
      //this.create(Array.prototype.slice.call(arguments));
    },
    create:function(obj){
      if(!angular.isArray(obj)){
        obj = [obj];
      }
      obj.forEach(function (o) {
        if(!o._id)
          o._id = o.id;
      });
      return this.bulkDocs(obj);
    },
    delete:function (id) {
      var db = this;
      return db.get(id).then(function (doc) {
        return db.remove(doc);
      });
    },
    findAll:function (filter,search,args) {
      var db = this;
      return (search? db.search(search.apply(db,args)):db.allDocs({include_docs:true})).then(function (result) {
        var r = {
          "total_rows":result.total_rows,
          "offset":result.offset,
          "rows":[],
          "_id":result._id,
          "_rev":result._rev
        }
        for(var i=0,l=result.rows.length;i<l;i++){
          if(!filter || filter(result.rows[i].doc)!==false){
            r.rows.push(result.rows[i].doc);
          }
        }
        return r;
      })
    },
    find:function (filter) {
      return this.allDocs({include_docs:true}).then(function (result) {
        for(var i=0,l=result.rows.length;i<l;i++){
          if(!filter || filter(result.rows[i].doc)!==false){
            return result.rows[i].doc;
          }
        }
      })
    }
  };

  self.$get = $get;

  /** @ngInject */
  function $get($window, $q) {
    var pouchDBDecorators = {
      qify: function (fn) {
        return function () {
          return $q.when(fn.apply(this, arguments));
        }
      },
      eventEmitter: function (fn) {
        return function () {
          var deferred = $q.defer();
          var emitter = fn.apply(this, arguments)
            .on('change', function (change) {
              return deferred.notify({
                change: change
              });
            })
            .on('paused', function (paused) {
              return deferred.notify({
                paused: paused
              });
            })
            .on('active', function (active) {
              return deferred.notify({
                active: active
              });
            })
            .on('denied', function (denied) {
              return deferred.notify({
                denied: denied
              });
            })
            .on('complete', function (response) {
              return deferred.resolve(response);
            })
            .on('error', function (error) {
              return deferred.reject(error);
            });
          emitter.$promise = deferred.promise;
          return emitter;
        };
      }
    };

    function wrapMethods(db, methods, parent) {
      for (var method in methods) {
        var wrapFunction = methods[method];


        if(angular.isFunction(wrapFunction)){
          db[method] = wrapFunction;
          continue;
        }

        if (!angular.isString(wrapFunction)) {
          wrapMethods(db, wrapFunction, method);
          continue;
        }

        wrapFunction = pouchDBDecorators[wrapFunction];

        if (!parent) {
          db[method] = wrapFunction(db[method]);
          continue;
        }

        db[parent][method] = wrapFunction(db[parent][method]);
      }
      return db;
    }

    return function pouchDB(name, options) {
      if($window.cordova){
        options = options||{};
        options.adapter = 'websql';
        options.iosDatabaseLocation = 'default';
      }
      var db = new $window.PouchDB(name, options);
      return wrapMethods(db, self.methods);
    };
  };

  function toDoc(doc) {
    if(doc instanceof Error)
      return doc;
    return doc;
  }
  function now() {
    return new Date().toISOString();
  }

  function addTimestamps(object) {
    object.updatedAt = now();
    object.createdAt = object.createdAt || object.updatedAt

    if (object._deleted) {
      object.deletedAt = object.deletedAt || object.updatedAt
    }

    return object
  }
}

})();

(function ()
{
  'use strict';

  angular
    .module('app.core')
    .provider('auth', appAuthProvider)

  /** @ngInject */
  function appAuthProvider()
  {
    // 第三方登录插件
    appAuth.$inject = ["$q", "$injector", "authToken", "$state", "$rootScope", "$location", "sxt"];
    var interceptorFactories = this.interceptors = [];
    var forEach = angular.forEach,loginedUser;
    // 是否转跳的登录
    var autoLoginPath = false;

    this.$get = appAuth;

    appAuth.$injector = ['$q','$injector','authToken','$state','$rootScope','$location','sxt'];

    function appAuth($q,$injector,authToken,$state,$rootScope,$location, sxt){

      var s = {
        isLoggedIn : isLoggedIn,
        token      : token,
        profile    : profile,
        login      : login,
        getUser    : getUser,
        autoLogin  : autoLogin,
        current    : currentUser,
        logout     : logout
      };

      authToken.on401(function (response) {
        var self = this;
        if(!self.lastTry || (new Date().getTime()-self.lastTry)>100000){
          self.lastTry = new Date().getTime();
          autoLoginPath = true;
          return (self.lastRefresh = $q(function (resolve,reject) {
            refresh(s,response).then(function () {
              resolve();
            }).catch(function () {
              autoLoginPath =false;
              reject(response);
            });
          }));
        }
        else return self.lastRefresh || $q(function (resolve,reject) {
          reject(response);
        })
      });
/*    $rootScope.$on('sxt:online', function(event, state){
        refresh(s);
      });*/

      $rootScope.$on('user:needlogin',function(){
        $state.go('app.auth.login');
      });
      var reversedInterceptors = [];

      forEach(interceptorFactories, function(interceptorFactory) {
        reversedInterceptors.unshift($injector.get(interceptorFactory));
      });

      return s;

      //判断用户是否登录
      function isLoggedIn(){
        return !!loginedUser;
      }

      //根据用户凭据获取token
      function token(user) {
        return sxt.invoke(reversedInterceptors, 'token' ,user)
      }

      //根据token获取个人信息调用
      function profile(token) {
        return sxt.invoke(reversedInterceptors, 'profile' ,token)
      }

      function refresh(s) {
        return sxt.invoke(reversedInterceptors, 'refresh' ,s);
      }

      // 根据用户凭据登录系统
      function login(user){
        return $q(function (resovle,reject) {
          token(user).then(function(token){
            authToken.setToken(token);
            getProfile(token,user).then(function (profile) {
              resovle(profile)
            }).catch(reject);
          },function(){
            //$state.go('app.auth.login');
            return reject("用户名或密码错误");

          });
        });
      }

      // 根据用户token登录系统
      function getProfile(token,user){
         return $q(function (resolve,reject) {
           profile(token).then(function(profile){
             if(token == profile)
               profile = null;

             loginedUser = profile;
             if(!loginedUser) {
               //$state.go('app.auth.login');
               reject('获取用户信息错误');
             }
             else {
               profile.username = profile.username||profile.Id;
               profile.token = token;
               profile.user = user;

               $rootScope.$emit ('user:login', profile);
               if(!autoLoginPath){

                 $state.go('app.szgc.home')
                 //$location.path('/');
               }
               resolve();
             }
           });
         });
      }

      // 获取当前用户
      function getUser(){
        return $q(function(resolve){
          if(loginedUser)
            resolve(loginedUser);
          else {
            $rootScope.$on ('user:login', function () {
              resolve (loginedUser);
            });
            getProfile();
          }
        })
      }

      // 自动登录获取，不跳转
      function autoLogin(){
        autoLoginPath = true;
        return getUser().then(function(user){
          autoLoginPath = false;
          return user;
        });
      }

      // 退出登录
      function logout(){
          $rootScope.$emit ('user:logout', loginedUser);
          $state.go('app.auth.login');

      }

      function currentUser(){
        return loginedUser;
      }
    }
  }
}());

﻿(function ()
{
  'use strict';

  angular
    .module('app.core')
    .provider('api', apiProvider)

  /** @ngInject */
  function apiProvider() {
    var api = {},
      provider = this,
      injector,
      cfgs=[],
      pouchdb,
      settingDb,
      uploadDb,
      networkState = 1;


    provider.register = register;
    //provider.getNetwork = getNetwork;
    //provider.setNetwork = function (state) { networkState = state;};
    provider.$http = bindHttp({
      url:url,
      db:bindDb
    });
    provider.$q = function(){
      return provider.$q.$q.apply(provider,toArray(arguments));
    }



    provider.$get = getApi;
    provider.get = getServer;
    provider.setting = setting;

    getApi.$injector = ['$resource','$http','$injector','$q','db','$rootScope','$cordovaNetwork','$window','$cordovaFileTransfer','$timeout','utils'];

    function getServer(name){
      return injector.get(name);
    }

    function getApi($resource,$http,$injector,$q,db,$rootScope,$cordovaNetwork,$window,$cordovaFileTransfer,$timeout,utils){
      injector = $injector;
      provider.$http.$http = $http;
      provider.$q.$q = $q;
      provider.$cordovaFileTransfer = $cordovaFileTransfer;
      provider.$timeout = $timeout;
      provider.$window = $window;
      pouchdb = db;
      resolveApi(api,$resource,$http);
      api.setting = setting;
      api.task = task;
      api.upload = upload;
      api.uploadTask = uploadTask;
      provider.setNetwork = api.setNetwork = function (state) {
        networkState = state;
        if(networkState==0)
          $rootScope.$emit('sxt:online');
        else
          $rootScope.$emit('sxt:offline');
      };
      api.getNetwork = provider.getNetwork = function () {
        return networkState;
      };
      api.resetNetwork = function () {
        var type = $window.navigator && $window.navigator.connection && $cordovaNetwork.getNetwork();
        switch (type) {
          case 'ethernet':
          case 'wifi':
          case '4g':
            networkState = 0;
            break;
          case 'unknown':
          case 'none':
          case '2g':
          case '3g':
          case 'cellular':
            networkState = 1;
            break;
          default:
            networkState = 0;
            break;
        }
        api.setNetwork(networkState);
      };

      api.useNetwork = function (state) {
        var cState,type = $window.navigator && $window.navigator.connection && $cordovaNetwork.getNetwork();
        switch (type) {
          case 'ethernet':
          case 'wifi':
          case '2g':
          case '3g':
          case '4g':
          case 'cellular':
            cState = 0;
            break;
          case 'unknown':
          case 'none':
            cState = 1;
            break;
          default:
            cState = 0;
            break;
        }
        if(state!=0 || cState==0) {
          api.oNetwork = networkState;
          networkState = state;
          api.networkState(networkState);
        }
      };
      api.resolveNetwork = function () {
        api.networkState(api.oNetwork);
      };

      $rootScope.$on('$cordovaNetwork:online', function(event, state){
        api.resetNetwork();
      });
      $rootScope.$on('$cordovaNetwork:offline', function(event, state){
        api.resetNetwork();
      });
      $timeout(function () {
        $rootScope.$emit('$cordovaNetwork:online');
      },100);


      api.db = provider.$http.db;
      api.clearDb = clearDb;
      api.download = download;
      return api;
    }



    function resolveApi(p,$resource,$http){
      if(p!==api)
        p.root = api;
      angular.forEach(p,function(o,k){
        if(k === 'root' || !angular.isObject(o))return;
        if(o.method && o.args){
          if(o.method == 'custom'){
            p[k] = custom(o.args[0],p,o.fn);
          }
          else if(o.method == 'resource'){
            p[k] = $resource(o.args[0]);
          }
        }
        else{
          resolveApi(o,$resource,$http);
        }
      });
    }

    function register(name,apiObj){
      api[name] = angular.extend(api[name]||{},apiObj);
    }

    function cfg(method){
      if(method == 'custom' || method=='resource'){
        return function (){
          return {
            method : method,
            args: toArray(arguments)
          };
        }
      }
      return function () {
        var args = toArray(arguments),
          url = args[0];
        if (url.indexOf('http') == -1)
          args[0] = sxt.app.api + url;
        return provider.$http.$http[method].apply(self, args);
      };
    }


    function custom(fn,scope){
      return function (){
        var args = toArray(arguments);
        return fn.apply(scope,args);
      }
    }

    function encodeUriQuery(val, pctEncodeSpaces) {
      return encodeURIComponent(val).
      replace(/%40/gi, '@').
      replace(/%3A/gi, ':').
      replace(/%24/g, '$').
      replace(/%2C/gi, ',').
      replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
    }

    function params(params) {
      var parts = [];
      angular.forEach(params, function (value, key) {
        if (value === null || angular.isUndefined(value)) return;
        if (!angular.isArray(value)) value = [value];

        angular.forEach(value, function (v) {
          if (angular.isDate(v)) {
            v = moment(v).format('YYYY-MM-DD')
          }
          else if (angular.isObject(v)) {
            v = angular.toJson(v);
          }
          parts.push(encodeUriQuery(key) + '=' + encodeUriQuery(v));
        });
      });
      return parts.join('&');
    }

    function url(path,args) {
      if (!args) return path;
      return path + ((path.indexOf('?') == -1) ? '?' : '&') + params(args);
    }

    /**
     *
     * @param obj
     * @returns {Object}
       */
    function bindHttp(obj) {
      return angular.extend(obj,{
        get:cfg('get'),
        post:cfg('post'),
        delete:cfg('delete'),
        options:cfg('options'),
        head:cfg('head'),
        resource:cfg('resource'),
        custom:cfg('custom')
      });
    }

    function setting(key,value) {
      return provider.$q(function (resolve) {
        if (!settingDb) {
          settingDb = pouchdb('systemstting');
        }
        if(value){
          settingDb.addOrUpdate({
            _id:key,
            value:value
          }).then(function () {
            resolve(value);
          });
        }
        else if(value===null){
          settingDb.delete(key).then(function (result) {
            result(result);
          }).catch(function () {
            resolve(null);
          })
        }
        else{
          settingDb.get(key).then(function (result) {
            resolve(result);
          }).catch(function () {
            resolve(null);
          });
        }
      })
    }
    function upload(filter,progress,complete,fail,options) {
      var tasks = [],
        self =this,
        groups = [];
      appendTasks(tasks,groups,filter,options).then(function (tasks) {
        self.task(tasks)(function (percent,current,total) {
          groups.forEach(function (g) {
            if(current>=g.end)
              g.percent = 1;
            else if(current<=g.start)
              g.percent = 0;
            else {
              g.current = current - g.start;
              g.percent = g.current * 1.0 / g.total;
            }
          });
          progress && progress(percent,current,total);
        },complete,fail,options);
      });
      return groups;
    }
    function appendTasks(tasks,groups,filter,options) {
      return provider.$q.$q(function(resolve,reject) {
        var p=[];
        cfgs.forEach(function (cfg) {
          if (cfg.upload && cfg.fn) {
            if (filter && filter(cfg) === false)return;
            var group = {
              name: cfg.name || '其它-' + cfg._id,
              start: tasks.length,
              cfg:cfg
            };
            groups.push(group);
            p.push(initDb(cfg).findAll(function (item) {
              if (filter)return filter(cfg, item);
              return true;
            }));
          }
        });
        provider.$q.$q.all(p).then(function (rs) {
          var i=0;
          rs.forEach(function (result) {
            var group = groups[i++],cfg = group.cfg;
            result.rows.forEach(function (row) {
              tasks.push(function () {
                return cfg.fn.call(cfg, row).then(function (result) {
                  options.uploaded && options.uploaded(cfg,row,result);
                });
              });
            });
            group.end = tasks.length;
            group.current = 0;
            group.total = group.end - group.start;
          });
          resolve(tasks);
        })
      });
    }
    function download(tasks) {
      var oNetworkState = networkState;
      networkState = 0;
      var t = task(tasks);

      return function (progress,success,fail,options) {
        return t(progress,function () {
          networkState = oNetworkState;
          success && success();
        },function () {
          networkState = oNetworkState;
          fail && fail();
        },options);
      };
    }
    function donwfile(dir,uname,url) {

      return provider.$q.$q(function (resolve) {
        if (provider.$window.cordova) {
          var rootPath = provider.$window.cordova.file.dataDirectory + '/' + dir + '/';
          provider.$cordovaFileTransfer.download(url, rootPath + uname).then(function (r) {
            resolve();
          }).catch(function (err) {
            resolve();
          });
        }
        else {
          resolve();
        }
      })
    }
    function task(tasks) {
      return function start(progress,success,fail,options) {
        run(0,progress,success,fail,options);
      }
      function run(i,progress,success,fail,options) {
        var len = tasks.length,fn = tasks[i];
        if (progress(i * 1.0 / len, i, len) !== false) {
          if (!fn) {
            success && success(tasks);
          }
          else {
            var d = new Date().getTime(),next = function () {
              run(i + 1, progress, success, fail, options);
            };
            fn(tasks,donwfile).then(function () {
              if(d && !next.r) {
                d = 0;
                next.r = true;
                next();
              }
            }).catch(function (err) {
              d = 0;
              fail && fail();
            });
            provider.$timeout(function () {
              if(d && !next.r){
                d = 0;
                next.r = true;
                next();
              }
            },options && options.timeout?options.timeout:3000);
          }
        }
      }
    }
    function uploadTask(itemOrFilter,value) {
      return provider.$q(function (resolve) {
        if (!uploadDb) {
          uploadDb = pouchdb('systemupload');
        }
        if(!angular.isFunction(itemOrFilter)){
          if(networkState==1) {
            uploadDb.addOrUpdate(itemOrFilter).then(function () {
              resolve(itemOrFilter);
            });
          }
          else{
            resolve(itemOrFilter);
          }
        }
        else{
          uploadDb.findAll(itemOrFilter).then(function (result) {
            if(value===null){
              result.rows.forEach(function (row) {
                uploadDb.remove(row);
              });
            }
            resolve(result);
          }).catch(function () {
            resolve(null);
          });
        }
      })
    }

    /**
     * 绑定配置
     * @param cfg
       * @returns {*}
       */
    function bindDb (cfg) {
      if(cfg.methods){
        var o = {},methods = cfg.methods;
        delete cfg.methods;
        for(var k in methods){
          o[k] = bindDb(angular.extend(angular.copy(cfg),methods[k])).bind(methods[k].fn);
        }
        return o;
      }
      else {
        cfgs.push(cfg);
        cfg.bind = function (fn,cb) {
          cfg.fn = fn;
          cfg.mode = cfg.mode || 0;
          var callFn = function () {
            var args = toArray(arguments),
              lodb = initDb(cfg),
              caller = this;
            if(cfg.mode == 1) { //1 离线优先，无离线数据尝试网络；
              var oRaiseError = cfg.raiseError;
              cfg.raiseError = true;
              return userOffline(caller,lodb,args,cb,fn).catch(function () {
                return userNetwork(caller,lodb,args,cb,fn).then(function (r) {
                  cfg.raiseError = oRaiseError;
                  return r;
                });
              });
            }
            else if(cfg.mode == 2){ //2 网络优先，无网络尝试离线数据
              return userNetwork(caller,lodb,args,cb,fn).catch(function () {
                return userOffline(caller,lodb,args,cb,fn);
              })
            }
            else{  //0 有网络只走网络，没网络只走离线；
              if (cfg.local || !cfg.fn || provider.getNetwork() == 1) {
                return userOffline(caller,lodb,args,cb,fn);
              }
              else {
                return userNetwork(caller,lodb,args,cb,fn);
              }
            }
          }
          callFn.cfg = cfg;
          callFn.db = function () {
            return initDb(cfg,toArray(arguments));
          }
          return callFn;
        };
        return cfg;
      }

      function id(d,db,args,cfg,cb) {
        var _id = angular.isFunction(cfg.idField) ? cfg.idField(d) : d[cfg.idField];
        if(_id && db){
          var defer = db.addOrUpdate(cfg.data?cfg.data.apply(cfg,[angular.extend({_id:_id},d)].concat(args)):angular.extend({_id:_id},d));
          if(cb && cb(defer));
        }
        return _id;
      }
      function bindData(result,rows,cfg) {
        switch (cfg.dataType) {
          case 1:
            result.data = rows;
            break;
          case 2:
            result.data = {rows: rows};
            break;
          case 3:
            result.data = rows[0];
            break;
          case 4:
            result.data = {
              data: rows
            };
            break;
          case 5:
            result.data = {
              Rows: rows
            };
            break;
        }
        return result;
      }
      function userOffline(caller,lodb, args,cb, fn) {
        var p2 = provider.$q.$q(function (resolve,reject) {
          if(!cfg._id){
            resolve(bindData({},[],cfg));
          }
          else if(cfg.delete){
            args.forEach(function (d) {
              lodb.delete(id(d,null,args,cfg)||d);
            });
            resolve(args);
          }
          else if(cfg.upload) {
            var updates = [];
            args.forEach(function (d) {
              id(d,lodb,args,cfg,function (defer) {
                updates.push(defer);
              });
            });
            provider.$q.$q.all(updates).then(function () {
              resolve(args);
            });
          }
          else{
            var result = {};
            if(cfg.dataType == 3){
              if((args.length==1 && !cfg.filter)||cfg.firstIsId) {
                lodb.get(args[0]).then(function (r) {
                  if(r || !cfg.raiseError) {
                    result.data = r;
                    resolve(result);
                  }
                  else {
                    reject();
                  }
                }).catch(function (r) {
                  result.data = r;
                  reject(result);
                });
              }
              else{
                lodb.findAll(function (item) {
                  if (cfg.filter)
                    return cfg.filter.apply(cfg, [item].concat(args));
                  return true;
                },cfg.search,args).then(function (r) {
                  result.data = r.rows[0];
                  if (!cfg.raiseError || result.data)
                    resolve(result);
                  else
                    reject(result);
                })
              }
            }
            else {
              lodb.findAll(function (item) {
                if (cfg.filter)
                  return cfg.filter.apply(cfg, [item].concat(args));
                return true;
              },cfg.search,args).then(function (r) {
                if(cfg.raiseError && !r.rows.length){
                  reject(result);
                }
                else {
                  bindData(result, r.rows, cfg);
                  resolve(result);
                }
              });
            }
          }
        });
        return cb? p2.then(function (result) {
          return cb.call(caller,result,cfg,args);
        }):p2;
      }
      function userNetwork(caller,lodb, args,cb, fn) {
        var q = provider.$q.$q(function (resolve,reject) {
          var p = fn && fn.apply(caller,args);
          if(p) {
            p.then(function (result) {
              if(result && ((result.status>=200 && result.status<=299) || result.data)) {
                if (result.data) {
                  var data = result.data;
                  if (cfg.dataType == 1) {
                    data.forEach(function (d) {
                      id(d, lodb, args, cfg);
                    })
                  }
                  else {
                    if (cfg.dataType == 3) {
                      id(data, lodb, args, cfg);
                    }
                    else if (data.rows && angular.isArray(data.rows)) {
                      data.rows.forEach(function (d) {
                        id(d, lodb, args, cfg);
                      })
                    }
                    else if (data.data && angular.isArray(data.data)) {
                      data.data.forEach(function (d) {
                        id(d, lodb, args, cfg);
                      })
                    }
                    else if (data.Rows && angular.isArray(data.Rows)) {
                      data.Rows.forEach(function (d) {
                        id(d, lodb, args, cfg);
                      })
                    }
                  }
                  resolve(result);
                }
                else{
                  resolve(result);
                }
              }
              else {
                reject(result);
              }
            })
              .catch(function (r) {
                reject(r);
              });
          }
          else{
            resolve();
          }
        })
        return q && cb ? q.then(function (result) {
          return cb.call(caller,result,cfg,args);
        }):q;
      }
    }

    function initDb(cfg,args) {
      if(cfg._id && cfg.db) return cfg.db;
      if(cfg._id)
      return (cfg.db = pouchdb(cfg._id));
      else if(cfg.db){
        var id = cfg.db.apply(cfg,args);
        if(id)
          return pouchdb(id);
      }
    }
    function getNetwork() {
      return networkState;
    }
    function toArray(args) {
      return Array.prototype.slice.call(args);
    }

    function clearDb(progress,complete,fail,options) {
      var tasks = [];
       cfgs.forEach(function (cfg) {
         if(options.exclude && options.exclude.indexOf(cfg._id)!=-1)return;
         var db = initDb(cfg);
         if(db) {
           tasks.push(function () {
             return db.destroy().then(function (result) {
               cfg.db = null;
               return result;
             }).catch(function (err) {
               console.log(err)
             });
           })
         }
       });
      return task(tasks)(progress,complete,fail,options);
    }

    // 因为sqlite 获取多条数据慢，每一个表作为一条数据，这里是重写
    function addOrUpdate(cfg) {

    }
    function findAll(cfg) {

    }
  }

})();

(function ()
{
    'use strict';

    apiResolverService.$inject = ["$q", "$log", "api"];
    angular
        .module('app.core')
        .factory('apiResolver', apiResolverService);

    /** @ngInject */
    function apiResolverService($q, $log, api)
    {
        var service = {
            resolve: resolve
        };

        return service;

        //////////
        /**
         * Resolve api
         * @param action
         * @param parameters
         */
        function resolve(action, parameters)
        {
            var actionParts = action.split('@'),
                resource = actionParts[0],
                method = actionParts[1],
                params = parameters || {};

            if ( !resource || !method )
            {
                $log.error('apiResolver.resolve requires correct action parameter (ResourceName@methodName)');
                return false;
            }

            // Create a new deferred object
            var deferred = $q.defer();

            // Get the correct api object from api service
            var apiObject = getApiObject(resource);

            if ( !apiObject )
            {
                $log.error('Resource "' + resource + '" is not defined in the api service!');
                deferred.reject('Resource "' + resource + '" is not defined in the api service!');
            }
            else
            {
                apiObject[method](params,

                    // Success
                    function (response)
                    {
                        deferred.resolve(response);
                    },

                    // Error
                    function (response)
                    {
                        deferred.reject(response);
                    }
                );
            }

            // Return the promise
            return deferred.promise;
        }

        /**
         * Get correct api object
         *
         * @param resource
         * @returns {*}
         */
        function getApiObject(resource)
        {
            // Split the resource in case if we have a dot notated object
            var resourceParts = resource.split('.'),
                apiObject = api;

            // Loop through the resource parts and go all the way through
            // the api object and return the correct one
            for ( var l = 0; l < resourceParts.length; l++ )
            {
                if ( angular.isUndefined(apiObject[resourceParts[l]]) )
                {
                    $log.error('Resource part "' + resourceParts[l] + '" is not defined!');
                    apiObject = false;
                    break;
                }

                apiObject = apiObject[resourceParts[l]];
            }

            if ( !apiObject )
            {
                return false;
            }

            return apiObject;
        }
    }

})();
(function ()
{
    'use strict';

    hljsDirective.$inject = ["$timeout", "$q", "$interpolate"];
    angular
        .module('app.core')
        .directive('hljs', hljsDirective);

    /** @ngInject */
    function hljsDirective($timeout, $q, $interpolate)
    {
        return {
            restrict: 'EA',
            compile : function (tElement, tAttrs)
            {
                var code;
                //No attribute? code is the content
                if ( !tAttrs.code )
                {
                    code = tElement.html();
                    tElement.empty();
                }

                return function (scope, iElement, iAttrs)
                {
                    if ( iAttrs.code )
                    {
                        // Attribute? code is the evaluation
                        code = scope.$eval(iAttrs.code);
                    }
                    var shouldInterpolate = scope.$eval(iAttrs.shouldInterpolate);

                    $q.when(code).then(function (code)
                    {
                        if ( code )
                        {
                            if ( shouldInterpolate )
                            {
                                code = $interpolate(code)(scope);
                            }

                            var contentParent = angular.element(
                                '<pre><code class="highlight" ng-non-bindable></code></pre>'
                            );

                            iElement.append(contentParent);

                            // Defer highlighting 1-frame to prevent GA interference...
                            $timeout(function ()
                            {
                                render(code, contentParent);
                            }, 34, false);
                        }
                    });

                    function render(contents, parent)
                    {
                        var codeElement = parent.find('code');
                        var lines = contents.split('\n');

                        // Remove empty lines
                        lines = lines.filter(function (line)
                        {
                            return line.trim().length;
                        });

                        // Make it so each line starts at 0 whitespace
                        var firstLineWhitespace = lines[0].match(/^\s*/)[0];
                        var startingWhitespaceRegex = new RegExp('^' + firstLineWhitespace);

                        lines = lines.map(function (line)
                        {
                            return line
                                .replace(startingWhitespaceRegex, '')
                                .replace(/\s+$/, '');
                        });

                        var highlightedCode = hljs.highlight(iAttrs.language || iAttrs.lang, lines.join('\n'), true);
                        highlightedCode.value = highlightedCode.value
                            .replace(/=<span class="hljs-value">""<\/span>/gi, '')
                            .replace('<head>', '')
                            .replace('<head/>', '');
                        codeElement.append(highlightedCode.value).addClass('highlight');
                    }
                };
            }
        };
    }
})();
/**
 * Created by jiuyuong on 2016/5/9.
 */
(function () {
  'use strict';
  angular
    .module('app.core')
    .directive('fastClick',fastClick);

  /** @ngInject */
  function fastClick() {
    var fn = function(scope,attr) {
      scope.$apply(function() {
        scope.$eval(attr.fastClick);
      });
    };
    return {
      link:link
    };
    function link(scope,element,attr) {
      element.on('touchstart', function(event) {
        scope._usingTouch = true;
        fn(scope,attr);
      });

      element.on('click',function (event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
      })
      element.on('mousedown', function(event) {
        if(!scope._usingTouch)
          fn(scope,attr);
      });
    }

  }
})();

(function ()
{
    'use strict';

    angular
        .module('app.core')
        .filter('filterByTags', filterByTags)
        .filter('filterSingleByTags', filterSingleByTags);

    /** @ngInject */
    function filterByTags()
    {
        return function (items, tags)
        {
            if ( items.length === 0 || tags.length === 0 )
            {
                return items;
            }

            var filtered = [];

            items.forEach(function (item)
            {
                var match = tags.every(function (tag)
                {
                    var tagExists = false;

                    item.tags.forEach(function (itemTag)
                    {
                        if ( itemTag.name === tag.name )
                        {
                            tagExists = true;
                            return;
                        }
                    });

                    return tagExists;
                });

                if ( match )
                {
                    filtered.push(item);
                }
            });

            return filtered;
        };
    }

    /** @ngInject */
    function filterSingleByTags()
    {
        return function (itemTags, tags)
        {
            if ( itemTags.length === 0 || tags.length === 0 )
            {
                return;
            }

            if ( itemTags.length < tags.length )
            {
                return [];
            }

            var filtered = [];

            var match = tags.every(function (tag)
            {
                var tagExists = false;

                itemTags.forEach(function (itemTag)
                {
                    if ( itemTag.name === tag.name )
                    {
                        tagExists = true;
                        return;
                    }
                });

                return tagExists;
            });

            if ( match )
            {
                filtered.push(itemTags);
            }

            return filtered;
        };
    }

})();
(function ()
{
    'use strict';

    toTrustedFilter.$inject = ["$sce"];
    angular
        .module('app.core')
        .filter('toTrusted', toTrustedFilter)
        .filter('htmlToPlaintext', htmlToPlainTextFilter)
        .filter('nospace', nospaceFilter)
        .filter('humanizeDoc', humanizeDocFilter);

    /** @ngInject */
    function toTrustedFilter($sce)
    {
        return function (value)
        {
            return $sce.trustAsHtml(value);
        };
    }

    /** @ngInject */
    function htmlToPlainTextFilter()
    {
        return function (text)
        {
            return String(text).replace(/<[^>]+>/gm, '');
        };
    }

    /** @ngInject */
    function nospaceFilter()
    {
        return function (value)
        {
            return (!value) ? '' : value.replace(/ /g, '');
        };
    }

    /** @ngInject */
    function humanizeDocFilter()
    {
        return function (doc)
        {
            if ( !doc )
            {
                return;
            }
            if ( doc.type === 'directive' )
            {
                return doc.name.replace(/([A-Z])/g, function ($1)
                {
                    return '-' + $1.toLowerCase();
                });
            }
            return doc.label || doc.name;
        };
    }

})();
(function ()
{
    'use strict';

    fuseConfigProvider.$inject = ["$provide"];
    angular
        .module('app.core')
        .provider('fuseConfig', fuseConfigProvider);

    /** @ngInject */
    function fuseConfigProvider($provide)
    {
        // Default configuration
        var fuseConfiguration = {
            'disableCustomScrollbars'        : false,
            'disableMdInkRippleOnMobile'     : false,
            'disableCustomScrollbarsOnMobile': true
        };

        // Methods
        this.config = config;

        //////////

        /**
         * Extend default configuration with the given one
         *
         * @param configuration
         */
        function config(configuration)
        {
            fuseConfiguration = angular.extend({}, fuseConfiguration, configuration);
        }

        /**
         * Service
         */
        this.$get = function ()
        {
            var service = {
                getConfig: getConfig,
                setConfig: setConfig
            };

            return service;

            //////////

            /**
             * Returns a config value
             */
            function getConfig(configName)
            {
                if ( angular.isUndefined(fuseConfiguration[configName]) )
                {
                    return false;
                }

                return fuseConfiguration[configName];
            }

            /**
             * Creates or updates config object
             *
             * @param configName
             * @param configValue
             */
            function setConfig(configName, configValue)
            {
                fuseConfiguration[configName] = configValue;
            }
        };

        $provide.decorator('$exceptionHandler', extendExceptionHandler);

        extendExceptionHandler.$inject = ['$delegate'];

        function extendExceptionHandler($delegate) {
            return function(exception, cause) {
                $delegate(exception, cause);
                var errorData = {
                  exception: exception,
                  cause: cause
                };
                /**
                 * Could add the error to a service's collection,
                 * add errors to $rootScope, log errors to remote web server,
                 * or log locally. Or throw hard. It is entirely up to you.
                 * throw exception;
                 */
                console.log('error:',exception)
              //alert(exception);
                //utils.error(exception.msg, errorData);
            };
        }
    }

})();

(function ()
{
    'use strict';

    config.$inject = ["$translatePartialLoaderProvider"];
    angular
        .module('app.toolbar', [])
        .config(config);

    /** @ngInject */
    function config($translatePartialLoaderProvider)
    {
        $translatePartialLoaderProvider.addPart('app/toolbar');
    }
})();

(function ()
{
    'use strict';

    ToolbarController.$inject = ["$rootScope", "$mdSidenav", "$translate", "$mdToast", "auth", "$state"];
    angular
        .module('app.toolbar')
        .controller('ToolbarController', ToolbarController);

    /** @ngInject */
    function ToolbarController($rootScope, $mdSidenav, $translate, $mdToast, auth, $state)
    {
        var vm = this;
        vm.is = isRoute;

        auth.getUser().then(function(user){
          console.log('user',user)
          vm.user = user;
        });
        $rootScope.$on('user:logout',function(user){
          vm.user = null;
        });
        // Data
        $rootScope.global = {
            search: ''
        };

        vm.bodyEl = angular.element('body');
        vm.userStatusOptions = [
            {
                'title': '在线',
                'icon' : 'icon-checkbox-marked-circle',
                'color': '#4CAF50'
            },
            {
                'title': '忙碌',
                'icon' : 'icon-clock',
                'color': '#FFC107'
            },
            {
                'title': '请勿打扰',
                'icon' : 'icon-minus-circle',
                'color': '#F44336'
            },
            {
                'title': '隐身',
                'icon' : 'icon-checkbox-blank-circle-outline',
                'color': '#BDBDBD'
            },
            {
                'title': '离线',
                'icon' : 'icon-checkbox-blank-circle-outline',
                'color': '#616161'
            }
        ];
        vm.languages = {
            en: {
                'title'      : 'English',
                'translation': 'TOOLBAR.ENGLISH',
                'code'       : 'en',
                'flag'       : 'us'
            },
            cn: {
                'title'      : '中文',
                'translation': 'TOOLBAR.SPANISH',
                'code'       : 'cn',
                'flag'       : 'cn'
            }
        };

        // Methods
        vm.toggleSidenav = toggleSidenav;
        vm.logout = logout;
        vm.changeLanguage = changeLanguage;
        vm.setUserStatus = setUserStatus;
        vm.toggleHorizontalMobileMenu = toggleHorizontalMobileMenu;

        //////////

        init();

        /**
         * Initialize
         */
        function init()
        {
            // Select the first status as a default
            vm.userStatus = vm.userStatusOptions[0];

            // Get the selected language directly from angular-translate module setting
            vm.selectedLanguage = vm.languages[$translate.preferredLanguage()];
        }

        function isRoute(route){
           return $state.includes(route);
        }

        /**
         * Toggle sidenav
         *
         * @param sidenavId
         */
        function toggleSidenav(sidenavId)
        {
            $mdSidenav(sidenavId).toggle();
        }

        /**
         * Sets User Status
         * @param status
         */
        function setUserStatus(status)
        {
            vm.userStatus = status;
        }

        /**
         * Logout Function
         */
        function logout()
        {
            auth.logout();
        }

        /**
         * Change Language
         */
        function changeLanguage(lang)
        {
            vm.selectedLanguage = lang;

            /**
             * Show temporary message if user selects a language other than English
             *
             * angular-translate module will try to load language specific json files
             * as soon as you change the language. And because we don't have them, there
             * will be a lot of errors in the page potentially breaking couple functions
             * of the template.
             *
             * To prevent that from happening, we added a simple "return;" statement at the
             * end of this if block. If you have all the translation files, remove this if
             * block and the translations should work without any problems.
             */
            //if ( lang.code !== 'en' )
            //{
            //    var message = 'Fuse supports translations through angular-translate module, but currently we do not have any translations other than English language. If you want to help us, send us a message through ThemeForest profile page.';
            //
            //    $mdToast.show({
            //        template : '<md-toast id="language-message" layout="column" layout-align="center start"><div class="md-toast-content">' + message + '</div></md-toast>',
            //        hideDelay: 7000,
            //        position : 'top right',
            //        parent   : '#content'
            //    });
            //
            //    return;
            //}

            // Change the language
            $translate.use(lang.code);
        }

        /**
         * Toggle horizontal mobile menu
         */
        function toggleHorizontalMobileMenu()
        {
            vm.bodyEl.toggleClass('ms-navigation-horizontal-mobile-menu-active');
        }
    }

})();

(function ()
{
    'use strict';

    TopToolbarController.$inject = ["$scope", "$rootScope", "api"];
    angular
        .module('app.toolbar')
        .controller('TopToolbarController', TopToolbarController);

    /** @ngInject */
    function TopToolbarController($scope,$rootScope,api) {
      var vm=this;
      $rootScope.$on('sxt:online', function(event, state){
        vm.networkState = api.getNetwork();
      });
      $rootScope.$on('sxt:offline', function(event, state){
        vm.networkState = api.getNetwork();
      });
      vm.networkState = api.getNetwork();
      vm.setNetwork = function () {
        vm.networkState = vm.networkState==0?1:0;
        api.setNetwork(vm.networkState);
      }

      $scope.goBack = function() {
        var data = {cancel: false};
        $rootScope.$broadcast ('goBack', data);
        if (!data.cancel)
          history.go (-1);
      }
    }

})();

(function ()
{
    'use strict';

    QuickPanelController.$inject = ["api"];
    angular
        .module('app.quick-panel')
        .controller('QuickPanelController', QuickPanelController);

    /** @ngInject */
    function QuickPanelController(api)
    {
        var vm = this;

        // Data
        vm.date = new Date();
        vm.settings = {
            notify: true,
            cloud : false,
            retro : true
        };

        api.quickPanel.activities.get({}, function (response)
        {
            vm.activities = response.data;
        });

        api.quickPanel.events.get({}, function (response)
        {
            vm.events = response.data;
        });

        api.quickPanel.notes.get({}, function (response)
        {
            vm.notes = response.data;
        });

        // Methods

        //////////
    }

})();
(function ()
{
    'use strict';

    /**
     * Main module of the Fuse
     */
    angular
        .module('sxt', [

            // Core
            'app.core',

            'app.navigation',

          // Navigation
          // Toolbar
          'app.toolbar',

            // Quick panel
            //'app.quick-panel',

            // Sample
            'app.sample',

            // auth
            'app.auth',

            'app.szgc',
          'panzoom',
          'hmTouchEvents',
          'ui.tree',
          'ngCordova'
        ]);
})();

(function () {
  'use strict';

  MainController.$inject = ["$scope", "$rootScope"];
  angular
    .module('sxt')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($scope, $rootScope) {
    // Data

    //////////

    // Remove the splash screen
    $scope.$on('$viewContentAnimationEnded', function (event) {
      if (event.targetScope.$id === $scope.$id) {
        $rootScope.$broadcast('msSplashScreen::remove');
      }
    });
  }

  angular.element(document).ready(function () {
    var bootstrap = function () {
      angular.bootstrap(document, ['sxt']);
    }
    if (window.cordova) {
      document.addEventListener('deviceready', bootstrap, false);
    }
    else {
      bootstrap();
    }
  });
})();

(function ()
{
    'use strict';

    angular
        .module('app.navigation', [])
        .config(config);

    /** @ngInject */
    function config()
    {
        
    }

})();
(function ()
{
    'use strict';

    NavigationController.$inject = ["$scope"];
    angular
        .module('app.navigation')
        .controller('NavigationController', NavigationController);

    /** @ngInject */
    function NavigationController($scope)
    {
        var vm = this;

        // Data
        vm.bodyEl = angular.element('body');
        vm.folded = false;
        vm.msScrollOptions = {
            suppressScrollX: true
        };

        // Methods
        vm.toggleMsNavigationFolded = toggleMsNavigationFolded;

        //////////

        /**
         * Toggle folded status
         */
        function toggleMsNavigationFolded()
        {
            vm.folded = !vm.folded;
        }

        // Close the mobile menu on $stateChangeSuccess
        $scope.$on('$stateChangeSuccess', function ()
        {
            vm.bodyEl.removeClass('ms-navigation-horizontal-mobile-menu-active')
        })
    }

})();
(function ()
{
    'use strict';

    runBlock.$inject = ["msUtils", "fuseGenerator", "fuseConfig", "$httpBackend", "$rootScope", "$timeout", "$state", "auth", "$location", "$q"];
    angular
        .module('app.core')
        .run(runBlock);

    /** @ngInject */
    function runBlock(msUtils, fuseGenerator, fuseConfig, $httpBackend, $rootScope, $timeout, $state, auth,$location,$q)
    {
      /**
       * Generate extra classes based on registered themes so we
       * can use same colors with non-angular-material elements
       */
      fuseGenerator.generate();

      /**
       * Disable md-ink-ripple effects on mobile
       * if 'disableMdInkRippleOnMobile' config enabled
       */
      if ( fuseConfig.getConfig('disableMdInkRippleOnMobile') && msUtils.isMobile() )
      {
        var bodyEl = angular.element('body');
        bodyEl.attr('md-no-ink', true);
      }

      /**
       * Put isMobile() to the html as a class
       */
      if ( msUtils.isMobile() )
      {
        angular.element('html').addClass('is-mobile');
      }

      /**
       * Put browser information to the html as a class
       */
      var browserInfo = msUtils.detectBrowser();
      if ( browserInfo )
      {
        var htmlClass = browserInfo.browser + ' ' + browserInfo.version + ' ' + browserInfo.os;
        angular.element('html').addClass(htmlClass);
      }


      $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        //console.log('toState',toState,toParams)
        if (toState.auth !== false && !auth.isLoggedIn()) {
          auth.autoLogin().then(function(){
            if(toState.name.indexOf('login')!=-1)
              $timeout(function(){$location.path('/');},100);
            else
              $state.go(toState.name, toParams);
          });
          event.preventDefault ();
        }
        else{
          $rootScope.noBack = toState.noBack;
          $rootScope.title = toState.title || $rootScope.title;
        }
        //console.log('toState',toState)
      });

    }
})();

(function ()
{
    'use strict';

    config.$inject = ["$ariaProvider", "$logProvider", "msScrollConfigProvider", "$translateProvider", "$provide", "fuseConfigProvider", "$httpProvider"];
    angular
        .module('app.core')
        .config(config);

    /** @ngInject */
    function config($ariaProvider, $logProvider, msScrollConfigProvider, $translateProvider, $provide, fuseConfigProvider, $httpProvider)
    {
      $httpProvider.interceptors.push('authToken');

      // ng-aria configuration
      $ariaProvider.config({
          tabindex: false
      });

      // Enable debug logging
      $logProvider.debugEnabled(true);

      // msScroll configuration
      msScrollConfigProvider.config({
          wheelPropagation: true
      });

      // toastr configuration
      toastr.options.timeOut = 3000;
      toastr.options.positionClass = 'toast-top-right';
      toastr.options.preventDuplicates = true;
      toastr.options.progressBar = true;


      // angular-translate configuration
      $translateProvider.useLoader('$translatePartialLoader', {
          urlTemplate: '{part}/i18n/{lang}.json'
      });
      $translateProvider.preferredLanguage('cn');
      $translateProvider.useSanitizeValueStrategy('sanitize');

      // Text Angular options
      $provide.decorator('taOptions', [
          '$delegate', function (taOptions)
          {
              taOptions.toolbar = [
                  ['bold', 'italics', 'underline', 'ul', 'ol', 'quote']
              ];

              taOptions.classes = {
                  focussed           : 'focussed',
                  toolbar            : 'ta-toolbar',
                  toolbarGroup       : 'ta-group',
                  toolbarButton      : 'md-button',
                  toolbarButtonActive: 'active',
                  disabled           : '',
                  textEditor         : 'form-control',
                  htmlEditor         : 'form-control'
              };

              return taOptions;
          }
      ]);

      // Text Angular tools
      $provide.decorator('taTools', [
          '$delegate', function (taTools)
          {
              taTools.bold.iconclass = 'icon-format-bold';
              taTools.italics.iconclass = 'icon-format-italic';
              taTools.underline.iconclass = 'icon-format-underline';
              taTools.ul.iconclass = 'icon-format-list-bulleted';
              taTools.ol.iconclass = 'icon-format-list-numbers';
              taTools.quote.iconclass = 'icon-format-quote';

              return taTools;
          }
      ]);


        // Fuse theme configurations
        fuseConfigProvider.config({
            'disableCustomScrollbars'        : false,
            'disableCustomScrollbarsOnMobile': true,
            'disableMdInkRippleOnMobile'     : false
        });
    }
})();

(function ()
{
    'use strict';

    runBlock.$inject = ["$rootScope", "$timeout", "$state"];
    angular
        .module('sxt')
        .run(runBlock);

    /** @ngInject */
    function runBlock($rootScope, $timeout, $state)
    {
        // Activate loading indicator
        var stateChangeStartEvent = $rootScope.$on('$stateChangeStart', function ()
        {
            $rootScope.loadingProgress = true;
        });

        // De-activate loading indicator
        var stateChangeSuccessEvent = $rootScope.$on('$stateChangeSuccess', function ()
        {
            $timeout(function ()
            {
                $rootScope.loadingProgress = false;
            });
        });

        // Store state in the root scope for easy access
        $rootScope.state = $state;

        // Cleanup
        $rootScope.$on('$destroy', function ()
        {
            stateChangeStartEvent();
            stateChangeSuccessEvent();
        })


    }
})();

(function ()
{
    'use strict';

    routeConfig.$inject = ["$stateProvider", "$urlRouterProvider"];
    angular
        .module('sxt')
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider)
    {
        //$locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise('/');

        /**
         * Layout Style Switcher
         *
         * This code is here for demonstration purposes.
         * If you don't need to switch between the layout
         * styles like in the demo, you can set one manually by
         * typing the template urls into the `State definitions`
         * area and remove this code
         */
        // Inject $cookies
        var $cookies;

        angular.injector(['ngCookies']).invoke([
            '$cookies', function (_$cookies)
            {
                $cookies = _$cookies;
            }
        ]);
        var mobileDetect = new MobileDetect(window.navigator.userAgent)
        // Get active layout
        var layoutStyle = mobileDetect.mobile()?'contentWithFootbar':'verticalNavigation';// : 'verticalNavigation';

        var layouts = {
            verticalNavigation  : {
                main      : 'app/core/layouts/vertical-navigation.html',
                toolbar   : 'app/toolbar/layouts/vertical-navigation/toolbar.html',
                navigation: 'app/navigation/layouts/vertical-navigation/navigation.html'
            },
            horizontalNavigation: {
                main      : 'app/core/layouts/horizontal-navigation.html',
                toolbar   : 'app/toolbar/layouts/horizontal-navigation/toolbar.html',
                navigation: 'app/navigation/layouts/horizontal-navigation/navigation.html'
            },
            contentOnly         : {
                main      : 'app/core/layouts/content-only.html',
                toolbar   : '',
                navigation: ''
            },
            contentWithToolbar  : {
                main      : 'app/core/layouts/content-with-toolbar.html',
                toolbar   : 'app/toolbar/layouts/content-with-toolbar/toolbar.html',
                navigation: ''
            },
            contentWithFootbar  : {
              main      : 'app/core/layouts/content-with-footbar.html',
              toolbar   : 'app/toolbar/layouts/content-with-footbar/footbar.html',
              navigation: '',
              toptoolbar:'app/toolbar/layouts/content-with-footbar/toptoolbar.html'
            }
        };
        // END - Layout Style Switcher

        // State definitions
        $stateProvider
            .state('app', {
                abstract: true,
                views   : {
                    'main@'         : {
                        templateUrl: layouts[layoutStyle].main,
                        controller : 'MainController as vm'
                    },
                    'toolbar@app'   : {
                        templateUrl: layouts[layoutStyle].toolbar,
                        controller : 'ToolbarController as vm'
                    },
                    'navigation@app': {
                        templateUrl: layouts[layoutStyle].navigation,
                        controller : 'NavigationController as vm'
                    },
                    'toptoolbar@app':{
                      templateUrl: layouts[layoutStyle].toptoolbar,
                      controller : 'TopToolbarController as vm'
                    }
                }
            });
    }

})();

(function ()
{
    'use strict';

    IndexController.$inject = ["fuseTheming"];
    angular
        .module('sxt')
        .controller('IndexController', IndexController);

    /** @ngInject */
    function IndexController(fuseTheming)
    {
        var vm = this;

        // Data
        vm.themes = fuseTheming.themes;

        //////////
    }
})();

(function ()
{
    'use strict';
    angular
      .module('sxt')
      .constant('appConfig',{
        apiUrl:'http://vkde.sxtsoft.com'
      })
})();

(function ()
{
    'use strict';

    config.$inject = ["authProvider", "apiProvider"];
    angular
        .module('sxt')
        .config(config);

    /** @ngInject */
    function config(authProvider,apiProvider)
    {


    }

})();

angular.module("sxt").run(["$templateCache", function($templateCache) {$templateCache.put("app/quick-panel/quick-panel.html","<md-content><md-tabs md-no-pagination=\"\" md-swipe-content=\"\" md-stretch-tabs=\"always\"><md-tab><md-tab-label translate=\"QUICKPANEL.TODAY\">TODAY</md-tab-label><md-tab-body><md-content class=\"today-tab scrollable\" ms-scroll=\"\" ng-include=\"\'app/quick-panel/tabs/today/today-tab.html\'\"></md-content></md-tab-body></md-tab><md-tab><md-tab-label translate=\"QUICKPANEL.CHAT\">CHAT</md-tab-label><md-tab-body><md-content class=\"chat-tab scrollable\" ms-scroll=\"\" ng-include=\"\'app/quick-panel/tabs/chat/chat-tab.html\'\" ng-controller=\"ChatTabController as vm\"></md-content></md-tab-body></md-tab><md-tab><md-tab-label translate=\"QUICKPANEL.ACTIVITY\">ACTIVITY</md-tab-label><md-tab-body><md-content class=\"activity-tab scrollable\" ms-scroll=\"\" ng-include=\"\'app/quick-panel/tabs/activity/activity-tab.html\'\"></md-content></md-tab-body></md-tab></md-tabs></md-content>");
$templateCache.put("app/core/layouts/content-only.html","<div id=\"layout-content-only\" class=\"template-layout\" layout=\"column\" flex=\"\"><md-content id=\"content\" class=\"animate-slide-up md-background md-hue-1\" ui-view=\"content\" flex=\"\" layout=\"column\"></md-content></div>");
$templateCache.put("app/core/layouts/content-with-footbar.html","<div id=\"layout-content-with-footbar\" class=\"template-layout\" layout=\"column\" flex=\"\"><md-toolbar id=\"toptoolbar\" class=\"md-menu-toolbar md-whiteframe-1dp\" ui-view=\"toptoolbar\"></md-toolbar><md-content id=\"content\" class=\"md-background md-hue-1\" layout=\"column\" ui-view=\"content\" flex=\"\"></md-content><md-toolbar id=\"toolbar2\" class=\"md-menu-toolbar md-whiteframe-1dp\" ui-view=\"toolbar\"></md-toolbar></div>");
$templateCache.put("app/core/layouts/content-with-toolbar.html","<div id=\"layout-content-with-toolbar\" class=\"template-layout\" layout=\"column\" flex=\"\"><md-toolbar id=\"toolbar\" class=\"md-menu-toolbar md-whiteframe-1dp\" ui-view=\"toolbar\"></md-toolbar><md-content id=\"content\" class=\"animate-slide-up md-background md-hue-1\" ui-view=\"content\" flex=\"\"></md-content></div>");
$templateCache.put("app/core/layouts/horizontal-navigation.html","<div id=\"layout-horizontal-navigation\" class=\"template-layout\" layout=\"column\" flex=\"\"><md-toolbar id=\"toolbar\" class=\"md-menu-toolbar\" ui-view=\"toolbar\"></md-toolbar><div id=\"horizontal-navigation\" class=\"md-whiteframe-1dp\" ui-view=\"navigation\"></div><div id=\"content-container\" flex=\"\" layout=\"column\"><md-content id=\"content\" class=\"animate-slide-up md-background md-hue-1\" ms-scroll=\"\" ui-view=\"content\" flex=\"\"></md-content></div><md-sidenav id=\"quick-panel\" class=\"md-sidenav-right md-whiteframe-4dp\" md-component-id=\"quick-panel\" ms-scroll=\"\" ui-view=\"quickPanel\"></md-sidenav></div>");
$templateCache.put("app/core/layouts/vertical-navigation.html","<div id=\"layout-vertical-navigation\" class=\"template-layout\" layout=\"row\" flex=\"\"><md-sidenav id=\"vertical-navigation\" class=\"md-primary-bg\" md-is-locked-open=\"$mdMedia(\'gt-sm\')\" md-component-id=\"navigation\" ms-scroll=\"\" ui-view=\"navigation\"></md-sidenav><div id=\"content-container\" flex=\"\" layout=\"column\"><md-toolbar id=\"toolbar\" class=\"md-menu-toolbar md-whiteframe-1dp\" ui-view=\"toolbar\"></md-toolbar><md-content id=\"content\" class=\"animate-slide-up md-background md-hue-1\" ms-scroll=\"\" ui-view=\"content\" layout=\"column\" flex=\"\"></md-content></div><md-sidenav id=\"quick-panel\" class=\"md-sidenav-right md-whiteframe-4dp\" md-component-id=\"quick-panel\" ms-scroll=\"\" ui-view=\"quickPanel\"></md-sidenav></div>");
$templateCache.put("app/core/theme-options/theme-options.html","<div class=\"ms-theme-options-panel\" layout=\"row\" layout-align=\"start start\"><div class=\"ms-theme-options-panel-button md-primary-bg\" ng-click=\"toggleOptionsPanel()\"><md-icon md-font-icon=\"icon-cog\" class=\"white-text\"></md-icon></div><div class=\"ms-theme-options-list\" layout=\"column\"><div class=\"theme-option\"><div class=\"option-title\">Layout Style:</div><md-radio-group layout=\"column\" ng-model=\"vm.layoutStyle\" ng-change=\"vm.updateLayoutStyle()\"><md-radio-button value=\"verticalNavigation\">Vertical Navigation</md-radio-button><md-radio-button value=\"horizontalNavigation\">Horizontal Navigation</md-radio-button><md-radio-button value=\"contentOnly\">Content Only</md-radio-button><md-radio-button value=\"contentWithToolbar\">Content with Toolbar</md-radio-button></md-radio-group></div><md-divider></md-divider><div class=\"theme-option\"><div class=\"option-title\">Layout Mode:</div><md-radio-group layout=\"row\" layout-align=\"start center\" ng-model=\"vm.layoutMode\" ng-change=\"vm.updateLayoutMode()\"><md-radio-button value=\"boxed\">Boxed</md-radio-button><md-radio-button value=\"wide\">Wide</md-radio-button></md-radio-group></div><md-divider></md-divider><div class=\"theme-option\"><div class=\"option-title\">Color Palette:</div><md-menu-item ng-repeat=\"(themeName, theme) in vm.themes.list\" class=\"theme\"><md-button class=\"md-raised theme-button\" aria-label=\"{{themeName}}\" ng-click=\"vm.setActiveTheme(themeName)\" ng-style=\"{\'background-color\': theme.primary.color,\'border-color\': theme.accent.color,\'color\': theme.primary.contrast1}\" ng-class=\"themeName\"><span><md-icon ng-style=\"{\'color\': theme.primary.contrast1}\" md-font-icon=\"icon-palette\"></md-icon><span>{{themeName}}</span></span></md-button></md-menu-item></div></div></div>");
$templateCache.put("app/main/sample/sample.html","<h1>{{vm.helloText}}</h1>");
$templateCache.put("app/core/directives/ms-search-bar/ms-search-bar.html","<div flex=\"\" layout=\"row\" layout-align=\"start center\"><label for=\"ms-search-bar-input\"><md-icon id=\"ms-search-bar-expander\" md-font-icon=\"icon-magnify\" class=\"icon s24\"></md-icon><md-icon id=\"ms-search-bar-collapser\" md-font-icon=\"icon-close\" class=\"icon s24\"></md-icon></label> <input id=\"ms-search-bar-input\" type=\"text\" ng-model=\"global.search\" placeholder=\"Search\" translate=\"\" translate-attr-placeholder=\"TOOLBAR.SEARCH\" flex=\"\"></div>");
$templateCache.put("app/main/auth/login/login.html","<div id=\"login\" flex=\"\" class=\"flex-scrollable login1\" layout=\"column\" ms-scroll=\"\"><div id=\"login-form-wrapper\" flex=\"\" layout=\"column\" layout-align=\"center center\"><div id=\"login-form\"><div class=\"logo\"><span><img src=\"app/main/auth/login/appicon.png\"></span></div><form name=\"loginForm\" novalidate=\"\" ng-submit=\"vm.login(loginForm)\"><div class=\"login-name\"><md-input-container class=\"md-block\" md-no-float=\"\"><md-icon md-svg-src=\"app/main/auth/images/user.svg\"></md-icon><input type=\"text\" name=\"username\" ng-model=\"vm.form.username\" placeholder=\"请输入用户名\" translate=\"\" translate-attr-placeholder=\"LOGIN.USERNAME\" required=\"\"></md-input-container><md-divider></md-divider><md-input-container class=\"md-block\" md-no-float=\"\"><md-icon md-svg-src=\"app/main/auth/images/password.svg\"></md-icon><input type=\"password\" name=\"password\" ng-model=\"vm.form.password\" placeholder=\"请输入密码\" translate=\"\" translate-attr-placeholder=\"LOGIN.PASSWORD\" required=\"\"></md-input-container></div><div layout=\"row\" layout-align=\"center center\"><button class=\"login\">{{vm.logining || \'登录\'}}</button></div></form></div></div></div>");
$templateCache.put("app/main/szgc/directives/photoDraw.html","<md-content flex=\"\" layout=\"column\" class=\"photodraw\"><div flex=\"\" style=\"text-align: center\"><canvas></canvas></div><div flex=\"none\" layout=\"row\" style=\"background:#efefef;border-top:1px solid silver;\" class=\"photo-btn\"><md-button class=\"md-primary md-raise\" ng-click=\"cancel()\">取消</md-button><span flex=\"\"></span><md-button class=\"md-icon-button\" aria-label=\"red\" ng-click=\"setColor(\'red\')\" ng-style=\"{\'border-bottom-width\':is(\'red\')}\" style=\"border-bottom: solid 1px red;\"><md-icon md-font-icon=\"icon-checkbox-blank-circle\" style=\"color: red\"></md-icon></md-button><md-button class=\"md-icon-button\" aria-label=\"blue\" ng-click=\"setColor(\'blue\')\" ng-style=\"{\'border-bottom-width\':is(\'blue\')}\" style=\"border-bottom: solid 1px blue;\"><md-icon md-font-icon=\"icon-checkbox-blank-circle\" style=\"color: blue\"></md-icon></md-button><md-button class=\"md-icon-button\" aria-label=\"black\" ng-click=\"setColor(\'black\')\" ng-style=\"{\'border-bottom-width\':is(\'black\')}\" style=\"border-bottom: solid 1px black;\"><md-icon md-font-icon=\"icon-checkbox-blank-circle\" style=\"color: black\"></md-icon></md-button><span flex=\"\"></span><md-button class=\"md-primary md-raise\" ng-click=\"erase()\">清除</md-button><md-button class=\"md-primary md-raised md-mini\" ng-click=\"save()\" style=\"float: right\">保存</md-button></div></md-content>");
$templateCache.put("app/main/szgc/directives/sxt-projects-jd-app.html","<div><md-list><md-subheader class=\"md-no-sticky\">已选择项</md-subheader><md-list-item ng-repeat=\"st in selectors\" ng-if=\"st.selected\"><p>{{st.label}}：{{st.selected.$name}}</p><md-checkbox class=\"md-secondary\" ng-click=\"item_clear(st.index)\" ng-checked=\"1\"></md-checkbox></md-list-item><md-divider></md-divider></md-list><div ng-repeat=\"st in selectors\" data-title=\"{{st.label}}\" ng-if=\"st.items.length\" ng-show=\"isShow(st)\"><div class=\"md-padding\"><md-input-container class=\"md-block\" ng-disabled=\"st.loading\"><label>{{st.label}}</label><md-select ng-model=\"st.current\" md-on-close=\"st.current && item_selected(st.current, st.index)\"><md-option ng-repeat=\"item in st.filters\" ng-value=\"item\">{{item.$name}}</md-option></md-select></md-input-container></div><md-list></md-list><md-divider></md-divider></div><div ng-transclude=\"\"></div></div>");
$templateCache.put("app/main/szgc/directives/sxtNumInput.html","<div layout=\"row\" layout-wrap=\"\" style=\"border-top:1px solid #d8d8d8\" class=\"input\"><div flex=\"25\"><md-button fast-click=\"ck(7,$event)\">7</md-button></div><div flex=\"25\"><md-button fast-click=\"ck(8,$event)\">8</md-button></div><div flex=\"25\"><md-button fast-click=\"ck(9,$event)\">9</md-button></div><div flex=\"25\"><md-button fast-click=\"ck(\'ac\',$event)\">清零</md-button></div><div flex=\"25\"><md-button fast-click=\"ck(4,$event)\">4</md-button></div><div flex=\"25\"><md-button fast-click=\"ck(5,$event)\">5</md-button></div><div flex=\"25\"><md-button fast-click=\"ck(6,$event)\">6</md-button></div><div flex=\"25\"><md-button fast-click=\"ck(\'+-\',$event)\">+/-</md-button></div><div flex=\"25\"><md-button fast-click=\"ck(1,$event)\">1</md-button></div><div flex=\"25\"><md-button fast-click=\"ck(2,$event)\">2</md-button></div><div flex=\"25\"><md-button fast-click=\"ck(3,$event)\">3</md-button></div><div flex=\"25\"><md-button fast-click=\"ck(-1,$event)\"><md-icon><img src=\"app/main/szgc/images/clear.png\"></md-icon></md-button></div><div flex=\"25\"><md-button fast-click=\"ck(0,$event)\">0</md-button></div><div flex=\"25\"><md-button fast-click=\"ck(\'.\',$event)\">.</md-button></div><div flex=\"50\"><md-button fast-click=\"ck(\'nextpoint\',$event)\" flex=\"\">下一检查点</md-button></div><div flex=\"50\"><md-button fast-click=\"ck(\'next\',$event)\" flex=\"\">下一检查项</md-button></div><div flex=\"50\"><md-button fast-click=\"ck(\'close\',$event)\" flex=\"\"><md-icon><img src=\"app/main/szgc/images/keyboard.png\"></md-icon></md-button></div></div>");
$templateCache.put("app/main/szgc/home/SzgcybgcDlg.html","<md-dialog aria-label=\"添加拍照\" ng-cloak=\"\"><md-toolbar><div class=\"md-toolbar-tools\"><h2 style=\"width: 80%;overflow: hidden;text-overflow: ellipsis;\">{{vm.project.regionName}}</h2><span flex=\"\"></span><md-button class=\"md-fab md-mini md-primary\" ng-click=\"vm.answer()\" aria-label=\"Favorite\"><md-icon md-font-icon=\"icon-close\"></md-icon></md-button></div></md-toolbar><md-dialog-content style=\"padding:0;\" layout=\"column\"><div flex=\"\" sxt-year=\"\" style=\"overflow: auto;position:relative\" year-show=\"true\" layout=\"column\" region-id=\"vm.project.regionId\" show=\"true\" room-type=\"vm.project.roomType\" procedure-id=\"vm.data.procedureId\" image-type=\"vm.project.n\" partion=\"vm.data.partion\" region-name=\"vm.project.regionName\"></div></md-dialog-content></md-dialog>");
$templateCache.put("app/main/szgc/home/SzgcyhydDlg.html","<md-dialog aria-label=\"添加拍照\" ng-cloak=\"\"><md-toolbar><div class=\"md-toolbar-tools\"><h2 style=\"width: 80%;overflow: hidden;text-overflow: ellipsis;\">{{vm.project.item.full_name}}</h2><span flex=\"\"></span><md-button class=\"md-fab md-mini md-primary\" ng-click=\"vm.show=true\" aria-label=\"Favorite\"><md-icon md-font-icon=\"icon-calendar\"></md-icon></md-button><md-button class=\"md-fab md-mini md-primary\" ng-click=\"vm.answer()\" aria-label=\"Favorite\"><md-icon md-font-icon=\"icon-close\"></md-icon></md-button></div></md-toolbar><md-dialog-content style=\"padding:0;\" layout-full=\"\" layout=\"column\"><div flex=\"\" sxt-year=\"\" style=\"overflow: auto;position:relative\" layout=\"column\" show=\"true\" region-id=\"vm.project.pid\" ng-if=\"vm.show\" room-type=\"vm.project.item.type\" procedure-id=\"vm.data.procedureId\" image-type=\"vm.project.n\" partion=\"vm.data.partion\" region-name=\"vm.project.item.full_name\"></div><div layout=\"row\" class=\"newhouse\" layout-xs=\"column\" ng-if=\"!vm.show\"><div flex=\"\" style=\"height: 375px;width: 100%\" sxt-area-houses=\"\" param=\"vm.project\" item-id=\"vm.project.itemId\" item-name=\"vm.project.itemName\"></div><div flex=\"\"><div style=\"padding: 5px 10px;font-weight: bold;\">{{vm.project.itemName}}</div><sxt-images-ybyd item-name=\"vm.project.itemName\" item-id=\"vm.project.itemId\" region-tree=\"vm.project.idTree\" region-id=\"vm.project.pid\"></sxt-images-ybyd></div></div></md-dialog-content></md-dialog>");
$templateCache.put("app/main/szgc/home/buildingdetail.html","<div flex=\"\" layout=\"column\" layout-fill=\"\" layout-gt-xs=\"row\"><div flex=\"60\" sxt-msk-charts=\"vm.treeId\" build=\"vm.build\"></div><div flex=\"40\"><floor-layer-detail sxtfloor=\"vm.build\" single=\"true\" sell-line=\"vm.sellLine\" floor-num=\"vm.build.floors\" bdetail-data=\"vm.data.data\"></floor-layer-detail></div><div style=\"position: absolute;top:150px;left:150px;\" ng-if=\"!vm.build.loaded\"><md-progress-circular md-mode=\"indeterminate\"></md-progress-circular></div></div>");
$templateCache.put("app/main/szgc/home/home.html","<div flex=\"\" layout=\"column\"><div flex=\"\" sxt-maps=\"\" markers=\"vm.markers\" marker-click=\"vm.markerClick($current)\"></div><div style=\"position: absolute;z-index: 10002; top:10px;right:10px;\"><md-autocomplete md-no-cache=\"true\" md-selected-item-change=\"vm.changeItem(item)\" md-item-text=\"item.title\" placeholder=\"项目搜索\" md-min-length=\"0\" md-items=\"item in vm.querySearch(vm.searchText)\" md-search-text=\"vm.searchText\"><md-item-template>{{item.title}}</md-item-template><md-not-found>未找到匹配项</md-not-found></md-autocomplete></div></div>");
$templateCache.put("app/main/szgc/home/link.html","<md-content flex=\"\" layout=\"column\" class=\"gridListyhyd\" ui-view=\"\"><md-grid-list ng-hide=\"vm.showPlayer\" md-cols-xs=\"2\" md-gutter=\"8px\" md-cols-sm=\"3\" md-cols-md=\"3\" md-row-height-gt-md=\"1:1\" md-row-height=\"2:2\"><md-grid-tile ng-disabled=\"true\"><img src=\"assets/images/icon/icon-1.png\"><md-grid-tile-footer><h3>房屋设计图纸</h3></md-grid-tile-footer></md-grid-tile><md-grid-tile ng-disabled=\"true\"><img src=\"assets/images/icon/icon-2.png\"><md-grid-tile-footer><h3>房屋装修图纸</h3></md-grid-tile-footer></md-grid-tile><md-grid-tile ng-click=\"vm.playN(2)\"><img src=\"assets/images/icon/icon-3.png\"><md-grid-tile-footer><h3>隐蔽工程照片</h3></md-grid-tile-footer></md-grid-tile><md-grid-tile ng-click=\"vm.playN(3)\"><img src=\"assets/images/icon/icon-4.png\"><md-grid-tile-footer><h3>质量验收记录</h3></md-grid-tile-footer></md-grid-tile><md-grid-tile ng-disabled=\"true\"><img src=\"assets/images/icon/icon-5.png\"><md-grid-tile-footer><h3>维修改造记录</h3></md-grid-tile-footer></md-grid-tile><md-grid-tile ng-disabled=\"true\"><img src=\"assets/images/icon/icon-6.png\"><md-grid-tile-footer><h3>部品信息</h3></md-grid-tile-footer></md-grid-tile></md-grid-list><div flex=\"\" layout=\"column\" ng-show=\"vm.showPlayer\" class=\"md-padding\"><div flex-auto=\"\" layout=\"row\"><sxt-procedure flex=\"\" ng-model=\"vm.project.procedureId\" name-value=\"vm.project.procedureName\" region-type=\"64\"></sxt-procedure><md-input-container flex=\"\"><label>部位</label><md-select ng-model=\"vm.project.partion\"><md-option ng-repeat=\"item in vm.project.partions\" ng-value=\"item\">{{item.desc}}</md-option></md-select></md-input-container></div><div flex=\"\" sxt-dplayer=\"vm.images\"></div></div></md-content>");
$templateCache.put("app/main/szgc/home/link2.html","<div flex=\"\" layout=\"column\" ui-view=\"\"><md-toolbar id=\"subtoolbar\"><div class=\"md-toolbar-tools\"><md-button aria-label=\"现场实景\" sxt-image-view=\"vm.images\" flex=\"\" ng-click=\"vm.showImg()\">现场实景</md-button><span class=\"hr\"></span><md-button aria-label=\"质量总表\" ui-sref=\"app.szgc.report.viewBath\" style=\"min-width:10px!important;\" flex=\"\">质量总表</md-button><span class=\"hr\"></span><md-button aria-label=\"一户一档\" ui-sref=\"app.szgc.project.ybgcResultT({pid:vm.data.projectId,pname:vm.data.projectName})\" style=\"min-width:10px!important;\" flex=\"\">一户一档</md-button></div></md-toolbar><sxt-area-show flex=\"\" project-id=\"vm.data.projectId\"></sxt-area-show></div>");
$templateCache.put("app/main/szgc/home/link3.html","<div hm-dir=\"\" style=\"width:100%;\"><div id=\"pinch\" hm-drag=\"dragEvent($event)\" hm-dragend=\"dragend($event)\" hm-pinch=\"pinch($event)\" hm-pinchmove=\"pinchmove($event)\" hm-pinchend=\"pinchend($event)\" style=\"position: relative;\"><div id=\"floorlayer\" style=\"margin:10px 0;position:relative;\"><floor-layer style=\"float:left;\" build-len=\"vm.buildLen\" ng-repeat=\"sxtfloor in vm.data.builds\" sxtfloor=\"sxtfloor\" floor-num=\"vm.data.floorNum\" sell-line=\"vm.sellLine\" ng-click=\"vm.setFloor(sxtfloor)\" ui-sref=\"app.szgc.project.buildinglist.building({buildId:sxtfloor.building_id,buildName:sxtfloor.name,floors:sxtfloor.floors})\"></floor-layer><div style=\"clear:both;display:table;\"></div></div></div></div>");
$templateCache.put("app/main/szgc/home/link_records.html","<div style=\"color:#f00;height:40px;line-height: 40px;border-bottom: 1px solid #ddd;width:100%;padding-left:8px;\">左右滑动查看全部数据</div><md-content class=\"md-padding repeat-top\" layout=\"column\" flex=\"\"><md-virtual-repeat-container flex=\"\" id=\"vertical-container\"><div style=\"width:880px;overflow-x: hidden;\"><div><div><div style=\"border-bottom: 1px solid #ccc;padding-left:0;position: relative;\"><span style=\"width:120px;display: inline-block;height:40px;padding-top: 18px;vertical-align: top\">部位</span> <span style=\"width:80px;display: inline-block;height:40px;;padding-top: 18px;vertical-align: top\">工序</span> <span style=\"width:55px;display: inline-block;height:40px;;padding-top: 18px;vertical-align: top;text-align: center;\">班组</span> <span style=\"width:36px;display: inline-block;height:40px;padding-top: 10px;\">监理首验</span> <span style=\"width:36px;display: inline-block;height:40px;padding-top: 10px;\">监理再验</span> <span style=\"width:80px;display: inline-block;height:40px;;padding-top: 18px;vertical-align: top\">监理员</span> <span style=\"width:80px;display: inline-block;height:40px;;padding-top: 18px;vertical-align: top\">查验时间</span> <span style=\"width:80px;display: inline-block;height:40px;;padding-top: 18px;vertical-align: top\">万科抽检</span> <span style=\"width:80px;display: inline-block;height:40px;;padding-top: 18px;vertical-align: top\">符合率</span> <span style=\"width:80px;display: inline-block;height:40px;;padding-top: 18px;vertical-align: top\">检查员</span> <span style=\"width:80px;display: inline-block;height:40px;;padding-top: 18px;vertical-align: top\">查验时间</span></div></div><div md-virtual-repeat=\"item in vm.Rows\" class=\"repeated-item\" flex=\"\"><div style=\"width:880px;height: 40px;\"><div style=\"position: relative;height: 40px;\" ui-sref=\"app.szgc.project.view({bathid:item.Id})\"><span style=\"width:120px;display: inline-block;white-space: nowrap;overflow:hidden;padding-right: 5px;text-overflow:ellipsis;\">{{ item.RegionNameTree}} {{item.RegionName}}</span> <span style=\"width:80px;display: inline-block;white-space: nowrap;overflow:hidden;text-overflow:ellipsis;\">{{item.ProcedureName}}</span> <span style=\"width:55px;display: inline-block;text-align: center;\">{{item.GrpWokerName | filterGrpWokerName}}</span> <span style=\"width:36px;display: inline-block;\">{{item.JLFirst|number:1}}</span> <span style=\"width:36px;display: inline-block;\">{{item.JLLast|number:1}}</span> <span style=\"width:80px;display: inline-block;\">{{item.JLUser}}</span> <span style=\"width:80px;display: inline-block;\">{{item.JLDate}}</span> <span style=\"width:80px;display: inline-block;\">{{item.WKLast}}</span> <span style=\"width:80px;display: inline-block;\">{{item.AccordRatio|number:1}}</span> <span style=\"width:80px;display: inline-block;\">{{item.WKLastUser}}</span> <span style=\"width:80px;display: inline-block;\">{{item.VKDate}}</span></div></div></div></div></div><p ng-if=\"vm.norecords\" style=\"text-align: center;font-size: 1.3rem;margin-top: 10px ;\">暂无数据</p></md-virtual-repeat-container></md-content>");
$templateCache.put("app/main/szgc/home/yhyd.html","<md-content flex=\"\" layout=\"column\" ng-show=\"!vm.searBarHide\" class=\"menu-toggle-list\"><div flex=\"\" style=\"overflow: auto\"><sxt-projects-jd ng-model=\"vm.project.pid\" object-scope=\"vm\" region-type=\"vm.project.type\" region-name=\"vm.project.typeName\" project-id=\"vm.project.projectId\" project-name=\"vm.project.projectName\" id-tree=\"vm.project.idTree\" name-tree=\"vm.project.nameTree\" on-queryed=\"vm.project.onQueryed\" is-more=\"vm.project.isMore\"></sxt-projects-jd><div class=\"md-padding\" layout=\"row\">{{vm.project.type}}<md-button type=\"submit\" flex=\"\" ng-click=\"vm.searBarHide=true\" class=\"md-raised md-primary\">确定</md-button></div></div></md-content><div style=\"position: absolute; top:0px; right:0px;\"><toggle-menu inst=\"vm.searBarHide\"></toggle-menu></div>");
$templateCache.put("app/main/szgc/report/allRaio-app.html","<md-content flex=\"\" layout=\"column\" ng-show=\"!vm.searBarHide\" class=\"menu-toggle-list\"><div flex=\"\" style=\"overflow: auto\"><div layout=\"row\" style=\"background:#fff;font-size:14px;\"><p class=\"md-padding\" style=\"margin-bottom: 0;\">项目</p></div><div class=\"md-padding\"><fieldset class=\"demo-fieldset\"><div layout=\"row\" layout-wrap=\"\" flex=\"\"><div flex-xs=\"\" flex=\"50\"><md-checkbox aria-label=\"全选\" ng-checked=\"vm.isChecked\" ng-click=\"vm.toggleAll()\"><span>全选</span></md-checkbox></div><div class=\"demo-select-all-checkboxes\" flex=\"100\" ng-repeat=\"item in vm.projects\"><md-checkbox ng-checked=\"item.selected\" ng-click=\"vm.toggle(item)\">{{ item.name }}</md-checkbox></div></div></fieldset></div><div layout=\"row\" class=\"newinput\"><div flex=\"50\" style=\"text-align: center\">从<md-datepicker ng-model=\"vm.m.sDate\" class=\"md-block\" md-placeholder=\"开始时间\"></md-datepicker></div><div flex=\"\" style=\"text-align: center\">至<md-datepicker ng-model=\"vm.m.eDate\" class=\"md-block\" md-placeholder=\"截止时间\"></md-datepicker></div></div><div class=\"md-padding\" layout=\"row\"><md-button type=\"submit\" flex=\"\" ng-click=\"vm.postData()\" class=\"md-raised md-primary\">确定</md-button></div></div></md-content><md-content flex=\"\" ng-show=\"vm.searBarHide\"><div layout=\"row\"><div id=\"report\" style=\"height:350px;width:100%;overflow-x: auto;\"><bar-chart config=\"vm.data.config\" data=\"vm.data.data\" style=\"height:350px;width:100%;\"></bar-chart></div></div><div class=\"simple-table-container md-whiteframe-4dp\"><table class=\"simple\" ms-responsive-table=\"\"><thead><tr><th>公司名称</th><th>合格率(%)</th></tr></thead><tfoot><tr><td></td></tr></tfoot><tbody><tr ng-repeat=\"item in vm.reportData\"><td class=\"name\">{{item.ParentCompanyName}}</td><td class=\"position\">{{item.rate}}</td></tr></tbody></table></div></md-content><div style=\"position: absolute; top:0px; right:0px;\"><toggle-menu inst=\"vm.searBarHide\"></toggle-menu></div>");
$templateCache.put("app/main/szgc/report/batchCount-app.html","<md-content flex=\"\" layout=\"column\" ng-show=\"!vm.searBarHide\" class=\"menu-toggle-list\"><div flex=\"\" style=\"overflow: auto\"><sxt-projects-jd ng-model=\"vm.project.pid\" object-scope=\"vm\" levels=\"0\" region-type=\"vm.project.type\" region-name=\"vm.project.typeName\" project-id=\"vm.project.projectId\" project-name=\"vm.project.projectName\" id-tree=\"vm.project.idTree\" name-tree=\"vm.project.nameTree\"><div layout=\"row\" class=\"newinput\"><div flex=\"50\" style=\"text-align: center\">从<md-datepicker ng-model=\"vm.m.sDate\" class=\"md-block\" md-placeholder=\"开始时间\"></md-datepicker></div><div flex=\"\" style=\"text-align: center\">至<md-datepicker ng-model=\"vm.m.eDate\" class=\"md-block\" md-placeholder=\"截止时间\"></md-datepicker></div></div></sxt-projects-jd><div class=\"md-padding\" layout=\"row\"><md-button type=\"submit\" flex=\"\" ng-click=\"vm.searBarHide=true\" class=\"md-raised md-primary\">确定</md-button></div></div></md-content><md-content flex=\"\" id=\"dvBatchCount\" ng-show=\"vm.searBarHide\"><table class=\"table table-border\" contenteditable=\"true\" width=\"100%\"><caption>项目填报统计表</caption><thead><tr><th width=\"30%\">项目名称</th><th width=\"15%\">时间</th><th width=\"18%\">录入人数</th><th width=\"10%\">土建</th><th width=\"10%\">机电</th><th width=\"10%\">装修</th><th width=\"17%\">合计</th></tr></thead><tbody><tr ng-repeat=\"item in vm.batchData2\" style=\"background :{{item.myCol}};border-bottom:1px solid #ddd; padding:8px\"><td rowspan=\"{{item.colp}}\" ng-if=\"item.colp\">{{item.projectName}}</td><td>{{item.CreatedTime}}</td><td>{{item.jlNumber}}</td><td>{{item.tjNumber}}</td><td>{{item.jdNumber}}</td><td>{{item.zxNumber}}</td><td>{{item.dayCountNumber}}</td></tr></tbody></table></md-content><div style=\"position: absolute; top:0px; right:0px;\"><toggle-menu inst=\"vm.searBarHide\"></toggle-menu></div>");
$templateCache.put("app/main/szgc/report/batchRaio-app.html","<md-content flex=\"\" layout=\"column\" ng-show=\"!vm.searBarHide\" class=\"menu-toggle-list\"><div flex=\"\" style=\"overflow: auto\"><div layout=\"row\" style=\"background:#fff;font-size:14px;\"><p class=\"md-padding\" style=\"margin-bottom: 0;\">项目</p></div><div class=\"md-padding\"><fieldset class=\"demo-fieldset\"><div layout=\"row\" layout-wrap=\"\" flex=\"\"><div flex-xs=\"\" flex=\"50\"><md-checkbox aria-label=\"全选\" ng-checked=\"vm.isChecked\" ng-click=\"vm.toggleAll()\"><span>全选</span></md-checkbox></div><div class=\"demo-select-all-checkboxes\" flex=\"100\" ng-repeat=\"item in vm.projects\"><md-checkbox ng-checked=\"item.selected\" ng-click=\"vm.toggle(item)\">{{ item.name }}</md-checkbox></div></div></fieldset></div><div layout=\"row\" class=\"newinput\"><div flex=\"50\" style=\"text-align: center\">从<md-datepicker ng-model=\"vm.m.sDate\" class=\"md-block\" md-placeholder=\"开始时间\"></md-datepicker></div><div flex=\"\" style=\"text-align: center\">至<md-datepicker ng-model=\"vm.m.eDate\" class=\"md-block\" md-placeholder=\"截止时间\"></md-datepicker></div></div><div layout=\"row\" style=\"background:#fff;font-size:14px;\"><p class=\"md-padding\" style=\"margin-bottom: 0;\">班组</p></div><div layout=\"row\" class=\"md-padding\"><div layout=\"row\" layout-wrap=\"\" flex=\"\"><div flex-xs=\"\" flex=\"100\"><md-checkbox aria-label=\"全选\" ng-checked=\"vm.isSkillChecked\" ng-click=\"vm.toggleSkillAll()\"><span>全选</span></md-checkbox></div><div class=\"demo-select-all-checkboxes\" flex=\"33\" ng-repeat=\"item in vm.skills\"><md-checkbox ng-checked=\"item.selected\" ng-click=\"vm.toggleskill(item)\">{{ item.name }}</md-checkbox></div></div></div><div class=\"md-padding\" layout=\"row\"><md-button type=\"submit\" flex=\"\" ng-click=\"vm.postData()\" class=\"md-raised md-primary\">确定</md-button></div></div></md-content><md-content flex=\"\" ng-show=\"vm.searBarHide\"><div layout=\"row\"><div id=\"report\" style=\"height:350px;width:100%\"><bar-chart config=\"vm.data.config\" data=\"vm.data.data\" style=\"height:350px;\"></bar-chart></div></div><div class=\"simple-table-container md-whiteframe-4dp\"><table class=\"simple\" ms-responsive-table=\"\"><thead><tr><th>班组</th><th>合格率(%)</th></tr></thead><tfoot><tr><td></td></tr></tfoot><tbody><tr ng-repeat=\"item in vm.reportData\"><td class=\"name\">{{item.GrpName}}</td><td class=\"position\">{{item.rate}}</td></tr></tbody></table></div></md-content><div style=\"position: absolute; top:0px; right:0px;\"><toggle-menu inst=\"vm.searBarHide\"></toggle-menu></div>");
$templateCache.put("app/main/szgc/report/projectMasterList-app.html","<md-content flex=\"\" layout=\"column\" ng-show=\"!vm.searBarHide\" class=\"menu-toggle-list\"><div flex=\"\" style=\"overflow: auto\"><sxt-projects-jd ng-model=\"vm.project.pid\" object-scope=\"vm\" region-type=\"vm.project.type\" region-name=\"vm.project.typeName\" project-id=\"vm.project.projectId\" project-name=\"vm.project.projectName\" id-tree=\"vm.project.idTree\" name-tree=\"vm.project.nameTree\" on-queryed=\"vm.project.onQueryed\" is-more=\"vm.project.isMore\"></sxt-projects-jd><div class=\"md-padding\" layout=\"row\"><md-button type=\"submit\" flex=\"\" ng-click=\"vm.searBarHide=true\" class=\"md-raised md-primary\">确定</md-button></div></div></md-content><md-content flex=\"\" ng-show=\"vm.searBarHide\"><bar-chart flex=\"\" config=\"vm.config\" data=\"vm.data\"></bar-chart></md-content><div style=\"position: absolute; top:0px; right:0px;\"><toggle-menu inst=\"vm.searBarHide\"></toggle-menu></div>");
$templateCache.put("app/main/szgc/report/report.html","<md-tabs md-border-bottom=\"\" flex=\"\" layout=\"column\" md-selected=\"vm.data.selectedIndex\"><md-tab label=\"报表中心\" md-on-select=\"vm.onNavList()\"><md-tab-content flex=\"\" layout-fill=\"\" layout=\"column\"><md-content flex=\"\"><md-list ng-cloak=\"\"><md-subheader class=\"md-no-sticky\">质量报表</md-subheader><md-list-item ng-click=\"vm.goToReport(\'质量总表\',\'app.szgc.report.viewBath\', $event)\"><img src=\"app/main/szgc/images/i_304g31.png\" class=\"md-avatar\"><p>质量总表</p></md-list-item><md-list-item ng-click=\"vm.goToReport(\'验收表格录入情况统计\',\'app.szgc.report.batchCount\',$event)\"><img src=\"app/main/szgc/images/i_3r631.png\" class=\"md-avatar\"><p>验收表格录入情况统计</p></md-list-item><md-divider></md-divider><md-subheader class=\"md-no-sticky\">监理统计报表</md-subheader><md-list-item ng-click=\"vm.goToReport(\'监理验收符合率统计\',\'app.szgc.report.supCheckResult\', $event)\"><img src=\"app/main/szgc/images/i_3d31.png\" class=\"md-avatar\"><p>监理验收符合率统计</p></md-list-item><md-list-item ng-click=\"vm.goToReport(\'班组验收合格率对比\',\'app.szgc.report.batchRaio\',$event)\"><img src=\"app/main/szgc/images/i_3d31.png\" class=\"md-avatar\"><p>班组验收合格率对比</p></md-list-item><md-list-item ng-click=\"vm.goToReport(\'总承包单位验收合格率\',\'app.szgc.report.allRaio\',$event)\"><img src=\"app/main/szgc/images/i_3d31.png\" class=\"md-avatar\"><p>总承包单位验收合格率</p></md-list-item></md-list></md-content></md-tab-content></md-tab><md-tab ng-repeat=\"tab in vm.tabs\" label=\"{{tab.name}}\"><md-tab-content flex=\"\" layout-fill=\"\" layout=\"column\"><ui-view flex=\"\" layout=\"column\"></ui-view></md-tab-content></md-tab></md-tabs>");
$templateCache.put("app/main/szgc/report/supCheckResult-app.html","<md-content flex=\"\" layout=\"column\" ng-show=\"!vm.searBarHide\" class=\"menu-toggle-list\"><div flex=\"\" style=\"overflow: auto\"><div layout=\"row\" style=\"background:#fff;font-size:14px;\"><p class=\"md-padding\" style=\"margin-bottom: 0;\">项目</p></div><div class=\"md-padding\"><fieldset class=\"demo-fieldset\"><div layout=\"row\" layout-wrap=\"\" flex=\"\"><div flex-xs=\"\" flex=\"50\"><md-checkbox aria-label=\"全选\" ng-checked=\"vm.isChecked\" ng-click=\"vm.toggleAll()\"><span>全选</span></md-checkbox></div><div class=\"demo-select-all-checkboxes\" flex=\"100\" ng-repeat=\"item in vm.projects\"><md-checkbox ng-checked=\"item.selected\" ng-click=\"vm.toggle(item)\">{{ item.name }}</md-checkbox></div></div></fieldset></div><div layout=\"row\" class=\"newinput\"><div flex=\"50\" style=\"text-align: center\">从<md-datepicker ng-model=\"vm.m.sDate\" class=\"md-block\" md-placeholder=\"开始时间\"></md-datepicker></div><div flex=\"\" style=\"text-align: center\">至<md-datepicker ng-model=\"vm.m.eDate\" class=\"md-block\" md-placeholder=\"截止时间\"></md-datepicker></div></div><div class=\"md-padding\" layout=\"row\"><md-button type=\"submit\" flex=\"\" ng-click=\"vm.searBarHide=true\" class=\"md-raised md-primary\">确定</md-button></div></div></md-content><md-content flex=\"\" ng-show=\"vm.searBarHide\"><div layout=\"row\"><div id=\"report\" style=\"height:350px;width:100%;overflow-x: auto;\"><bar-chart config=\"vm.data.config\" data=\"vm.data.data\" style=\"height:350px;width:100%;\"></bar-chart></div></div><div class=\"simple-table-container md-whiteframe-4dp\"><table class=\"simple\" ms-responsive-table=\"\"><thead><tr><th>项目</th><th>项目符合率(%)</th><th>监理单位</th><th>监理单位符合率(%)</th><th>监理人员</th><th>验收人符合率(%)</th></tr></thead><tfoot><tr><td></td></tr></tfoot><tbody><tr ng-repeat=\"item in vm.CheckData\"><td class=\"name\">{{item.ProjectName}}</td><td class=\"position\">{{item.pAccordRatio}}</td><td class=\"position\">{{item.SupervisorCompanyName}}</td><td class=\"position\">{{item.sAccordRatio}}</td><td class=\"position\">{{item.CheckWorkerName}}</td><td class=\"position\">{{item.cAccordRatio}}</td></tr></tbody></table></div></md-content><div style=\"position: absolute; top:0px; right:0px;\"><toggle-menu inst=\"vm.searBarHide\"></toggle-menu></div>");
$templateCache.put("app/main/szgc/report/viewBath-app.html","<md-content flex=\"\" layout=\"column\" ng-show=\"!vm.searBarHide && vm.is(\'app.szgc.report.viewBath\')\" class=\"menu-toggle-list\"><div flex=\"\" style=\"overflow: auto\"><sxt-projects-jd ng-model=\"vm.project.pid\" object-scope=\"vm\" region-type=\"vm.project.type\" region-name=\"vm.project.typeName\" project-id=\"vm.project.projectId\" project-name=\"vm.project.projectName\" id-tree=\"vm.project.idTree\" name-tree=\"vm.project.nameTree\" is-more=\"vm.project.isMore\" on-queryed=\"vm.project.onQueryed\"><md-list><md-subheader>工序</md-subheader><md-list-item><sxt-procedure style=\"width:100%\" inc=\"true\" ng-model=\"vm.project.procedureId\" name-value=\"vm.project.procedureName\" region-type=\"vm.project.type\" class=\"md-block\"></sxt-procedure></md-list-item><md-list-item>班组</md-list-item><md-list-item><sxt-select ng-model=\"vm.workGroupkey\" sources=\"vm.workGroupSources\" text-field=\"name\" value-field=\"id\" style=\"width:100%;\" class=\"mdselect\"></sxt-select></md-list-item></md-list></sxt-projects-jd><div class=\"md-padding\" layout=\"row\"><md-button type=\"submit\" flex=\"\" ng-click=\"vm.searBarHide=true\" class=\"md-raised md-primary\">确定</md-button></div></div></md-content><div style=\"color:#f00;height:40px;line-height: 40px;border-bottom: 1px solid #ddd;width:100%;padding-left:8px;\" ng-show=\"vm.searBarHide && vm.is(\'app.szgc.report.viewBath\')\">左右滑动查看全部数据</div><md-content class=\"md-padding repeat-top\" ng-show=\"vm.searBarHide && vm.is(\'app.szgc.report.viewBath\')\" layout=\"column\" flex=\"\"><md-virtual-repeat-container flex=\"\" id=\"vertical-container\"><div style=\"width:880px;overflow-x: hidden;\"><div><div><div style=\"border-bottom: 1px solid #ccc;padding-left:0;position: relative;\"><span style=\"width:120px;display: inline-block;height:40px;padding-top: 18px;vertical-align: top\">部位</span> <span style=\"width:80px;display: inline-block;height:40px;;padding-top: 18px;vertical-align: top\">工序</span> <span style=\"width:55px;display: inline-block;height:40px;;padding-top: 18px;vertical-align: top;text-align: center;\">班组</span> <span style=\"width:36px;display: inline-block;height:40px;;padding-top: 18px;vertical-align: top;text-align: center;\">总包</span> <span style=\"width:36px;display: inline-block;height:40px;padding-top: 10px;\">监理首验</span> <span style=\"width:36px;display: inline-block;height:40px;padding-top: 10px;\">监理再验</span> <span style=\"width:80px;display: inline-block;height:40px;;padding-top: 18px;vertical-align: top\">监理员</span> <span style=\"width:80px;display: inline-block;height:40px;;padding-top: 18px;vertical-align: top\">查验时间</span> <span style=\"width:120px;display: inline-block;height:40px;;padding-top: 18px;vertical-align: top\">万科、第三方抽检</span> <span style=\"width:80px;display: inline-block;height:40px;;padding-top: 18px;vertical-align: top\">符合率</span> <span style=\"width:80px;display: inline-block;height:40px;;padding-top: 18px;vertical-align: top\">检查员</span> <span style=\"width:80px;display: inline-block;height:40px;;padding-top: 18px;vertical-align: top\">查验时间</span></div></div><div md-virtual-repeat=\"item in vm.baths.Rows\" class=\"repeated-item\" flex=\"\"><div style=\"width:980px;height: 40px;\"><div style=\"position: relative;height: 40px;\" ui-sref=\"app.szgc.report.viewBath.view({bathid:item.Id})\"><span style=\"width:120px;display: inline-block;white-space: nowrap;overflow:hidden;padding-right: 5px;text-overflow:ellipsis;\">{{ item.RegionNameTree}} {{item.RegionName}}</span> <span style=\"width:80px;display: inline-block;white-space: nowrap;overflow:hidden;text-overflow:ellipsis;\">{{item.ProcedureName}}</span> <span style=\"width:55px;display: inline-block;text-align: center;\">{{item.GrpWokerName | filterGrpWokerName}}</span> <span style=\"width:36px;display: inline-block;\">{{(item.ZbLast||item.ZbFirst)|number:1}}</span> <span style=\"width:36px;display: inline-block;\">{{item.JLFirst|number:1}}</span> <span style=\"width:36px;display: inline-block;\">{{item.JLLast|number:1}}</span> <span style=\"width:80px;display: inline-block;\">{{item.JLUser}}</span> <span style=\"width:80px;display: inline-block;\">{{item.JLDate}}</span> <span style=\"width:120px;display: inline-block;\">{{item.WKLast}}</span> <span style=\"width:80px;display: inline-block;\">{{item.AccordRatio|number:1}}</span> <span style=\"width:80px;display: inline-block;\">{{item.WKLastUser}}</span> <span style=\"width:80px;display: inline-block;\">{{item.VKDate}}</span></div></div></div></div></div><p ng-if=\"vm.norecords\" style=\"text-align: center;font-size: 1.3rem;margin-top: 10px ;\">暂无数据</p></md-virtual-repeat-container></md-content><div style=\"position: absolute; top:0px; right:0px;\"><md-button class=\"md-fab md-mini\" ng-show=\"!vm.searBarHide && vm.isJdBack()\" ng-click=\"vm.backJdSelect()\"><md-icon md-font-icon=\"icon-arrow-left\"></md-icon></md-button><toggle-menu inst=\"vm.searBarHide\" ng-show=\"vm.is(\'app.szgc.report.viewBath\')\"></toggle-menu></div><md-content ui-view=\"\" flex=\"\" ng-if=\"!vm.is(\'app.szgc.report.viewBath\')\"></md-content>");
$templateCache.put("app/main/szgc/report/viewBathDetail-app-go.html","<div class=\"panel\" md-padding=\"\"><div class=\"panel-body\"><h2>{{titol.ProcedureName}}验收记录表</h2></div><div class=\"table-responsive vk\" style=\"border: 0px\"><div class=\"row\"><div class=\"col-lg-12 target2\"><table class=\"target\" width=\"100%\" border=\"1\" cellspacing=\"0\" cellpadding=\"4\" style=\"border-collapse: collapse;\"><tr><td width=\"13%\">单位(子单位)工程名称</td><td colspan=\"5\">{{titol.RegionNameTree}}</td></tr><tr><td>分项工程名称</td><td width=\"21%\">{{titol.ProcedureName}}</td><td width=\"20%\">检查日期</td><td>{{jlTitol.CheckDate}}</td><td>万科抽查日期</td><td>{{egTitol.CheckDate}}</td></tr><tr><td>验收部位</td><td>{{titol.RegionName}}</td><td>监理单位检查人</td><td width=\"13%\">{{jlTitol.CheckWorkerName}}</td><td width=\"16%\">万科抽查人</td><td width=\"17%\">{{egTitol.CheckWorkerName}}</td></tr><tr><td>总承包施工单位</td><td>{{titol.ParentCompanyName}}</td><td>施工单位负责人</td><td>{{jlTitol.CompanyName}}</td><td>施工班组负责人</td><td>{{titol.GrpName}}</td></tr></table><table class=\"target target2\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"margin-top: 5px;border-collapse: collapse;width:100%;\"><tr><td style=\"padding:0;\"><table border=\"1\" cellspacing=\"0\" cellpadding=\"4\" style=\"border-collapse: collapse;width:100%;\"><tr><td style=\"width:50%\" rowspan=\"2\" colspan=\"{{data.selected.d.info.zyColLength+2}}\" align=\"center\">施工质量验收规范的规定</td><td style=\"width:50%\" colspan=\"2\" align=\"center\">检查评定记录</td></tr><tr><td colspan=\"2\"><md-select placeholder=\"请选择\" ng-model=\"data.selected\" style=\"margin:3px 0\"><md-option ng-value=\"item\" ng-repeat=\"item in data.sources\">{{item.text}}</md-option></md-select></td></tr><tr ng-repeat=\"n in data.selected.d.zk\"><td rowspan=\"{{data.selected.d.info.zyCount()}}\" ng-if=\"$index==0\" align=\"center\" style=\"width:50px;\"><p>主</p><p>控</p><p>项</p><p>目</p></td><td align=\"center\" style=\"width:40px;\">{{$index+1}}</td><td ng-repeat=\"m in n.names\" ng-click=\"data.selected.d.info.zyColSelected=$index\" ng-if=\"m.rowspan!=0 && m.colspan!=0\" rowspan=\"{{m.rowspan||1}}\" colspan=\"{{m.colspan||1}}\">{{m.name}}</td><td style=\"width:40%\">{{n.Remark}}</td><td class=\"targettd\" style=\"width:150px; text-align:center;\">{{n.MPCheckValue==0?n.NoPassText:n.PassText}}</td></tr></table></td></tr><tr><td style=\"padding:0;\"><table border=\"1\" cellspacing=\"0\" cellpadding=\"4\" style=\"border-collapse: collapse;width:100%;\"><tr><td style=\"width:50px;\">&nbsp;</td><td style=\"width:40px;\">&nbsp;</td><td rowspan=\"2\" colspan=\"{{data.selected.d.info.ybColLength}}\">&nbsp; &nbsp; 项目<div class=\"clearfix\"></div></td><td width=\"91\" rowspan=\"2\" align=\"center\">允许偏差（mm）</td><td align=\"center\">检查点数</td><td align=\"center\">合格率</td><td align=\"center\">最大偏差</td><td colspan=\"2\" align=\"center\">总包自检</td><td colspan=\"2\" align=\"center\">万科、第三方抽验</td><td rowspan=\"2\" align=\"center\">备注</td></tr><tr><td></td><td></td><td colspan=\"3\" align=\"center\"><md-select placeholder=\"请选择\" ng-model=\"data.selected\" style=\"margin:3px 0\"><md-option ng-value=\"item\" ng-repeat=\"item in data.sources\">{{item.text}}</md-option></md-select></td><td>合格率</td><td>符合率</td><td>合格率</td><td>符合率</td></tr><tr ng-repeat=\"n in data.selected.d.yb\"><td rowspan=\"{{data.selected.d.info.ybCount()}}\" ng-if=\"$index==0\" align=\"center\"><p>一</p><p>般</p><p>项</p><p>目</p></td><td ng-class=\"{\'tdselectd\':n.selected}\" align=\"center\">{{$index+1}}</td><td ng-repeat=\"m in n.names\" ng-click=\"data.selected.d.info.ybColSelected=$index\" ng-if=\"m.rowspan!=0 && m.colspan!=0\" rowspan=\"{{m.rowspan||1}}\" colspan=\"{{m.colspan||1}}\">{{m.name}}</td><td style=\"width:150px\" align=\"center\"><span ng-if=\"n.getPassRatio\">平均合格率</span> {{n.DeviationLimit}}</td><td align=\"center\">{{n.CheckNum}}</td><td align=\"center\">{{n.PassRatio}}<span ng-if=\"n.getPassRatio\">{{n.ok()?\'合格\':\'不合格\'}}({{n.getPassRatio()|number:2}})</span></td><td align=\"center\">{{n.MaxDeviation}}</td><td align=\"center\">{{n.ZbPassRatio}}</td><td align=\"center\">{{n.ZBFHL}}</td><td align=\"center\">{{n.VKPassRatio}}</td><td align=\"center\">{{n.FHL}}</td><td align=\"center\"></td></tr><tr ng-if=\"data.selected.d.yb.length\"><td colspan=\"{{data.selected.d.yb[0].names.length+2}}\"></td><td align=\"center\" colspan=\"8\">主控：{{zkIsOk(data.selected.d.zk)?\"合格\":\"不合格\"}} &nbsp;&nbsp; 一般：{{ybIsOk(data.selected.d.yb)?\"合格\":\"不合格\"}}({{ybHGL(data.selected.d.yb)}}) &nbsp;&nbsp; 总体({{ybHGLPJ(data.selected.d.yb)|number:2}}) &nbsp;&nbsp; 结果：{{zkIsOk(data.selected.d.zk)&&ybIsOk(data.selected.d.yb)?\"合格\":\"不合格\"}}</td></tr></table></td></tr></table></div></div></div><div><fieldset><legend style=\"margin-bottom: 10px;\">原验收表扫描件或验收结果列表</legend><div ng-if=\"vm.isShow\" style=\"margin-bottom: 10px;\"><p style=\"font-size:20px;\">监理检查记录</p><div ng-repeat=\"n in data.selected.d.yb\"><h3 style=\"margin-top:10px;\">{{$index+1}}、{{n.TargetName}} 允许偏差（mm） :{{n.DeviationLimit}}</h3><div class=\"circle\"><div><div ng-repeat=\"point in n.points\"><div class=\"point\" ng-class=\"{\'done\':!point.Result}\"><span>{{point.Value}}</span></div></div></div></div></div><p style=\"font-size:20px;\">万科检查记录</p><div ng-repeat=\"n in data.selected.eg.yb\"><h3 style=\"margin-top:10px;\">{{$index+1}}、{{n.TargetName}} 允许偏差（mm） :{{n.DeviationLimit}}</h3><div class=\"circle\"><div><div ng-repeat=\"point in n.points\"><div class=\"point\" ng-class=\"{\'done\':!point.Result}\"><span>{{point.Value}}</span></div></div></div></div></div></div><div sxt-image-view=\"\" is-container=\"true\" ng-if=\"!vm.showData\"><sxt-images ng-model=\"data.selected.step.GroupImg\" project=\"data.projectInfo\"></sxt-images></div></fieldset><fieldset><legend>附件</legend><div sxt-image-view=\"\" is-container=\"true\"><sxt-images ng-model=\"data.selected.step.GroupImg2\" project=\"data.projectInfo\"></sxt-images></div></fieldset></div></div><div style=\"position: fixed; top:93px; right:0px;\"><md-button class=\"md-fab md-mini\" ng-if=\"!vm.isPartner\" ng-click=\"vm.goAdd()\">抽验</md-button></div>");
$templateCache.put("app/main/szgc/report/viewBathDetail-app.html","<div class=\"panel\" md-padding=\"\"><div class=\"panel-body\"><h2>{{titol.ProcedureName}}验收记录表</h2></div><div class=\"table-responsive vk\" style=\"border: 0px\"><div class=\"row\"><div class=\"col-lg-12 target2\"><table class=\"target\" width=\"100%\" border=\"1\" cellspacing=\"0\" cellpadding=\"4\" style=\"border-collapse: collapse;\"><tr><td width=\"13%\">单位(子单位)工程名称</td><td colspan=\"5\">{{titol.RegionNameTree}}</td></tr><tr><td>分项工程名称</td><td width=\"21%\">{{titol.ProcedureName}}</td><td width=\"20%\">检查日期</td><td>{{jlTitol.CheckDate}}</td><td>万科抽查日期</td><td>{{egTitol.CheckDate}}</td></tr><tr><td>验收部位</td><td>{{titol.RegionName}}</td><td>监理单位检查人</td><td width=\"13%\">{{jlTitol.CheckWorkerName}}</td><td width=\"16%\">万科抽查人</td><td width=\"17%\">{{egTitol.CheckWorkerName}}</td></tr><tr><td>总承包施工单位</td><td>{{titol.ParentCompanyName}}</td><td>施工单位负责人</td><td>{{jlTitol.CompanyName}}</td><td>施工班组负责人</td><td>{{titol.GrpName}}</td></tr></table><table class=\"target target2\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"margin-top: 5px;border-collapse: collapse;width:100%;\"><tr><td style=\"padding:0;\"><table border=\"1\" cellspacing=\"0\" cellpadding=\"4\" style=\"border-collapse: collapse;width:100%;\"><tr><td style=\"width:50%\" rowspan=\"2\" colspan=\"{{data.selected.d.info.zyColLength+2}}\" align=\"center\">施工质量验收规范的规定</td><td style=\"width:50%\" colspan=\"2\" align=\"center\">检查评定记录</td></tr><tr><td colspan=\"2\"><md-select placeholder=\"请选择\" ng-model=\"data.selected\" style=\"margin:3px 0\"><md-option ng-value=\"item\" ng-repeat=\"item in data.sources\">{{item.text}}</md-option></md-select></td></tr><tr ng-repeat=\"n in data.selected.d.zk\"><td rowspan=\"{{data.selected.d.info.zyCount()}}\" ng-if=\"$index==0\" align=\"center\" style=\"width:50px;\"><p>主</p><p>控</p><p>项</p><p>目</p></td><td align=\"center\" style=\"width:40px;\">{{$index+1}}</td><td ng-repeat=\"m in n.names\" ng-click=\"data.selected.d.info.zyColSelected=$index\" ng-if=\"m.rowspan!=0 && m.colspan!=0\" rowspan=\"{{m.rowspan||1}}\" colspan=\"{{m.colspan||1}}\">{{m.name}}</td><td style=\"width:40%\">{{n.Remark}}</td><td class=\"targettd\" style=\"width:150px; text-align:center;\">{{n.MPCheckValue==0?n.NoPassText:n.PassText}}</td></tr></table></td></tr><tr><td style=\"padding:0;\"><table border=\"1\" cellspacing=\"0\" cellpadding=\"4\" style=\"border-collapse: collapse;width:100%;\"><tr><td style=\"width:50px;\">&nbsp;</td><td style=\"width:40px;\">&nbsp;</td><td rowspan=\"2\" colspan=\"{{data.selected.d.info.ybColLength}}\">&nbsp; &nbsp; 项目<div class=\"clearfix\"></div></td><td width=\"91\" rowspan=\"2\" align=\"center\">允许偏差（mm）</td><td align=\"center\">检查点数</td><td align=\"center\">合格率</td><td align=\"center\">最大偏差</td><td colspan=\"2\" align=\"center\">总包自检</td><td colspan=\"2\" align=\"center\">万科、第三方抽验</td><td rowspan=\"2\" align=\"center\">备注</td></tr><tr><td></td><td></td><td colspan=\"3\" align=\"center\"><md-select placeholder=\"请选择\" ng-model=\"data.selected\" style=\"margin:3px 0\"><md-option ng-value=\"item\" ng-repeat=\"item in data.sources\">{{item.text}}</md-option></md-select></td><td>合格率</td><td>符合率</td><td>合格率</td><td>符合率</td></tr><tr ng-repeat=\"n in data.selected.d.yb\"><td rowspan=\"{{data.selected.d.info.ybLength}}\" ng-if=\"$index==0\" align=\"center\"><p>一</p><p>般</p><p>项</p><p>目</p></td><td ng-class=\"{\'tdselectd\':n.selected}\" align=\"center\">{{$index+1}}</td><td ng-repeat=\"m in n.names\" ng-click=\"data.selected.d.info.ybColSelected=$index\" ng-if=\"m.rowspan!=0 && m.colspan!=0\" rowspan=\"{{m.rowspan||1}}\" colspan=\"{{m.colspan||1}}\">{{m.name}}</td><td style=\"width:150px\" align=\"center\"><span ng-if=\"n.getPassRatio\">平均合格率</span> {{n.DeviationLimit}}</td><td align=\"center\">{{n.CheckNum}}</td><td align=\"center\">{{n.PassRatio}}<span ng-if=\"n.getPassRatio\">{{n.ok()?\'合格\':\'不合格\'}}({{n.getPassRatio()|number:2}})</span></td><td align=\"center\">{{n.MaxDeviation}}</td><td align=\"center\">{{n.ZbPassRatio}}</td><td align=\"center\">{{n.ZBFHL}}</td><td align=\"center\">{{n.VKPassRatio}}</td><td align=\"center\">{{n.FHL}}</td><td align=\"center\"></td></tr><tr ng-if=\"data.selected.d.yb.length\"><td colspan=\"{{data.selected.d.yb[0].names.length+2}}\"></td><td align=\"center\" colspan=\"8\">主控：{{zkIsOk(data.selected.d.zk)?\"合格\":\"不合格\"}} &nbsp;&nbsp; 一般：{{ybIsOk(data.selected.d.yb)?\"合格\":\"不合格\"}}({{ybHGL(data.selected.d.yb)}}) &nbsp;&nbsp; 总体({{ybHGLPJ(data.selected.d.yb)|number:2}}) &nbsp;&nbsp; 结果：{{zkIsOk(data.selected.d.zk)&&ybIsOk(data.selected.d.yb)?\"合格\":\"不合格\"}}</td></tr></table></td></tr></table></div></div></div><div><fieldset><legend style=\"margin-bottom: 10px;\">原验收表扫描件或验收结果列表</legend><div ng-if=\"vm.isShow\" style=\"margin-bottom: 10px;\"><p style=\"font-size:20px;\">监理检查记录</p><div ng-repeat=\"n in data.selected.d.yb\"><h3 style=\"margin-top:10px;\">{{$index+1}}、{{n.TargetName}} 允许偏差（mm） :{{n.DeviationLimit}}</h3><div class=\"circle\"><div><div ng-repeat=\"point in n.points\"><div class=\"point\" ng-class=\"{\'done\':!point.Result}\"><span>{{point.Value}}</span></div></div></div></div></div><p style=\"font-size:20px;\">万科检查记录</p><div ng-repeat=\"n in data.selected.eg.yb\"><h3 style=\"margin-top:10px;\">{{$index+1}}、{{n.TargetName}} 允许偏差（mm） :{{n.DeviationLimit}}</h3><div class=\"circle\"><div><div ng-repeat=\"point in n.points\"><div class=\"point\" ng-class=\"{\'done\':!point.Result}\"><span>{{point.Value}}</span></div></div></div></div></div></div><div sxt-image-view=\"\" is-container=\"true\" ng-if=\"!vm.showData\"><sxt-images ng-model=\"data.selected.step.GroupImg\" project=\"data.projectInfo\"></sxt-images></div></fieldset><fieldset><legend>附件</legend><div sxt-image-view=\"\" is-container=\"true\"><sxt-images ng-model=\"data.selected.step.GroupImg2\" project=\"data.projectInfo\"></sxt-images></div></fieldset></div></div><div style=\"position: fixed; top:93px; right:0px;\"><md-button class=\"md-fab md-mini\" ng-if=\"!vm.isPartner\" ng-click=\"vm.goAdd()\">抽验</md-button></div>");
$templateCache.put("app/main/szgc/report/ybgcResult.html","<md-content flex=\"\" layout=\"column\" ng-show=\"!vm.searBarHide\" class=\"menu-toggle-list\"><div flex=\"\" style=\"overflow: auto\"><sxt-projects-jd ng-model=\"vm.project.pid\" object-scope=\"vm\" region-type=\"vm.project.type\" region-name=\"vm.project.typeName\" project-id=\"vm.project.projectId\" project-name=\"vm.project.projectName\" id-tree=\"vm.project.idTree\" name-tree=\"vm.project.nameTree\" on-queryed=\"vm.project.onQueryed\"></sxt-projects-jd><div class=\"md-padding\" layout=\"row\"><md-button type=\"submit\" flex=\"\" ng-click=\"vm.searBarHide=true\" class=\"md-raised md-primary\">确定</md-button></div></div></md-content><md-content flex=\"\" ng-show=\"vm.searBarHide\" layout=\"column\" id=\"ybgc\"><md-virtual-repeat-container flex=\"\" id=\"vertical-container\" style=\"height: 800px;\"><div layout=\"row\" style=\"border-bottom: 1px solid #d8d8d8\"><span style=\"white-space: nowrap;overflow: hidden;text-overflow: ellipsis;display: inline-block;text-align: center\" flex=\"\">部位</span> <span style=\"width: 100px;display: inline-block;text-align: center\">拍摄时间</span> <span style=\"width: 100px;display: inline-block;text-align: center\">照片数量</span></div><div md-virtual-repeat=\"item in vm.rows|orderBy:vm.CreateTime:reverse\" class=\"repeated-item\" flex=\"\"><div layout=\"row\" style=\"border-bottom: 1px solid #d8d8d8\" ng-click=\"vm.viewItem({regionId:item.room_id,regionType:32,regionName:item.full_name,roomType:item.type,idTree:item.RegionTreeId,type:item.type})\"><span style=\"white-space: nowrap;overflow: hidden;text-overflow: ellipsis;display: inline-block; padding-left:5px;\" flex=\"\">{{item.full_name.replace(vm.project.projectName,\'\')}}</span> <span style=\"width: 100px;display: inline-block;text-align: center\">{{item.CreateTime}}</span> <span style=\"width: 100px;display: inline-block;text-align: center\">{{item.FileNum}}</span></div></div></md-virtual-repeat-container><div style=\"position: absolute; top:0px; right:0px;\"><toggle-menu inst=\"vm.searBarHide\"></toggle-menu></div></md-content>");
$templateCache.put("app/main/szgc/report/ybgcyhyd.html","");
$templateCache.put("app/main/szgc/report/yuyd.html","<md-content flex=\"\" layout=\"column\" ng-show=\"!vm.searBarHide\" class=\"menu-toggle-list\"><div flex=\"\" style=\"overflow: auto\"><sxt-projects-jd ng-model=\"vm.project.pid\" object-scope=\"vm\" levels=\"3\" region-type=\"vm.project.type\" region-name=\"vm.project.typeName\" project-id=\"vm.project.projectId\" project-name=\"vm.project.projectName\" id-tree=\"vm.project.idTree\" name-tree=\"vm.project.nameTree\" on-queryed=\"vm.project.onQueryed\"></sxt-projects-jd><div class=\"md-padding\" layout=\"row\"><md-button ng-disabled=\"vm.project.type<8\" type=\"submit\" flex=\"\" ng-click=\"vm.search()\" class=\"md-raised md-primary\">确定</md-button></div></div></md-content><md-content flex=\"\" ng-show=\"vm.searBarHide\" layout=\"column\" id=\"ybgc\"><div flex=\"none\" ng-init=\"vm.showSm =false\"><div layout=\"column\" style=\"padding: 5px 10px;border-bottom: 1px solid #d8d8d8;\"><div layout=\"row\"><div flex=\"initial\" class=\"dingw\"><span>当前楼栋：</span><span style=\"color:#0b93d5;\">{{vm.project.typeName}}</span></div><div style=\"position: relative;\" flex=\"none\" class=\"tlsm\"><span ng-click=\"vm.showSm = !vm.showSm\" class=\"span\">图例说明</span><div class=\"tl-wrap\" ng-show=\"vm.showSm\"><div style=\"margin-bottom: 12px;font-size:14px;\">图例说明</div><div style=\"margin-bottom: 12px;\"><span style=\"display:inline-block;width: 20px ;height: 20px; border: none;background-color: #0b93d5;vertical-align: top;margin-right:10px;\"></span> <span style=\"display: inline-block;line-height: 20px;height:20px;vertical-align: top;\">照片数量</span></div><div style=\"margin-bottom: 12px;\"><span style=\"display:inline-block;width: 20px ;height: 20px; border: none;background-color: #0b93d5;opacity: 0.5;vertical-align: top;margin-right:10px;\"></span> <span style=\"display: inline-block;line-height: 20px;height:20px;vertical-align: top;\">验收表数量</span></div><div><span style=\"display:inline-block;width: 20px ;height: 20px; border: none;background-color: orange;vertical-align: top;margin-right:10px;\"></span> <span style=\"display: inline-block;line-height: 20px;height:20px;vertical-align: top;\">不合格</span></div></div></div></div></div></div><md-content flex=\"\" layout=\"column\"><span flex=\"\" ng-if=\"vm.project.rows.length==0 && !vm.project.loading\" style=\"text-align: center;display: block;\">暂无数据</span><md-progress-circular md-mode=\"indeterminate\" ng-if=\"vm.project.loading&&vm.project.rows.length!=0\"></md-progress-circular><md-list layout-padding=\"\" ng-if=\"!vm.project.loading\"><md-list-item><div class=\"yhyd\" layout=\"row\" layout-wrap=\"\"><div layout=\"column\" class=\"btn\" ng-repeat=\"item in vm.project.rows\" ng-class=\"{\'bhg\':!item.hg}\"><button class=\"btnUp\" ng-click=\"vm.viewItem({regionId:item.room_id,regionType:32,regionName:item.full_name,roomType:item.type,idTree:item.RegionIdTree,type:item.type && item.type.type_id})\">{{item.ybNum}}</button> <button class=\"btnDown\" ng-click=\"vm.viewItem({regionId:item.room_id,regionType:32,regionName:item.full_name,roomType:item.type,idTree:item.RegionIdTree,type:item.type && item.type.type_id})\">{{item.ysNum}}</button> <span>{{item.name}}</span></div></div></md-list-item></md-list></md-content></md-content><div style=\"position: absolute; top:0px; right:0px;\"><toggle-menu inst=\"vm.searBarHide\"></toggle-menu></div>");
$templateCache.put("app/main/szgc/settings/settings.html","<md-tabs md-border-bottom=\"\" flex=\"\" md-selected=\"vm.selectedIndex\"><md-tab label=\"系统设置\"><md-tab-content flex=\"\" layout-fill=\"\" layout=\"column\"><md-content flex=\"\"><md-list><md-subheader class=\"md-no-sticky\">个人信息</md-subheader><md-list-item ng-click=\"vm.selectedIndex=1\"><img alt=\"{{user.name}}\" src=\"app/main/szgc/settings/images/uesrinfo-icon@2x.png\" class=\"md-avatar\"><p>{{vm.profile.name}}</p><p class=\"md-secondary md-hue-3\">{{vm.profile.mobile}}</p></md-list-item><md-divider></md-divider><md-subheader class=\"md-no-sticky\">当前</md-subheader><md-list-item><p>版本</p><p class=\"md-secondary md-hue-3\">{{ vm.serverAppVersion}}</p></md-list-item><md-list-item><p>模式({{vm.networkState?\'离线\':\'在线\'}})</p><p class=\"md-secondary md-hue-3\"><md-switch ng-model=\"vm.networkState\" aria-label=\"模式\" ng-true-value=\"0\" ng-false-value=\"1\" class=\"md-warn\"></md-switch></p></md-list-item><md-list-item><p>缓存 <b>{{vm.cacheInfo}}</b></p><md-button class=\"md-secondary md-raised md-primary\" ng-click=\"vm.clearCache()\">清空</md-button></md-list-item><md-divider></md-divider><md-list-item><md-button flex=\"\" class=\"md-raised md-warn\" ng-click=\"vm.logout()\">退出</md-button></md-list-item></md-list></md-content></md-tab-content></md-tab><md-tab label=\"个人信息\"><md-tab-content flex=\"\" layout-fill=\"\" layout=\"column\"><md-content flex=\"\"><md-list><md-subheader class=\"md-no-sticky\">个人信息</md-subheader><md-list-item><p>公司名称</p><p class=\"md-secondary\">{{vm.profile.corporation.name}}</p></md-list-item><md-list-item><p>员工姓名</p><p class=\"md-secondary\">{{vm.profile.name}}</p></md-list-item><md-list-item><p>显示名称</p><p class=\"md-secondary\">{{vm.profile.display_name}}</p></md-list-item><md-list-item><p>邮箱地址</p><p class=\"md-secondary\">{{vm.profile.email}}</p></md-list-item><md-list-item><p>帐号</p><p class=\"md-secondary\">{{vm.profile.loginname}}</p></md-list-item><md-list-item><p>手机号码</p><p class=\"md-secondary\">{{vm.profile.mobile}}</p></md-list-item></md-list></md-content></md-tab-content></md-tab></md-tabs>");
$templateCache.put("app/navigation/layouts/horizontal-navigation/navigation.html","<div layout=\"row\" layout-align=\"start center\"><ms-navigation-horizontal></ms-navigation-horizontal></div>");
$templateCache.put("app/navigation/layouts/vertical-navigation/navigation.html","<md-toolbar class=\"navigation-header md-whiteframe-1dp\" layout=\"row\" layout-align=\"space-between center\"><div class=\"logo\" layout=\"row\" layout-align=\"start center\"><span class=\"logo-image\">V</span> <span class=\"logo-text\">万科数字工程</span></div><md-icon class=\"fold-toggle s18\" md-font-icon=\"icon-backburger\" hide=\"\" show-gt-sm=\"\" ng-click=\"vm.toggleMsNavigationFolded()\"></md-icon></md-toolbar><ms-navigation class=\"scrollable\" folded=\"vm.folded\" ms-scroll=\"vm.msScrollOptions\"></ms-navigation>");
$templateCache.put("app/main/szgc/ys/addProcess-app.html","<md-content class=\"md-padding\"><form name=\"addForm\" class=\"form-horizontal\" ng-submit=\"save(addForm)\"><md-list><md-subheader class=\"md-no-sticky\">项目</md-subheader><md-list-item><p>项目{{data.projectName}} {{data.rName}}</p></md-list-item><md-subheader class=\"md-no-sticky\">工序</md-subheader><md-list-item><p>工序{{data.procedureName}}</p></md-list-item><md-subheader class=\"md-no-sticky\">监理单位</md-subheader><md-list-item layout=\"row\"><sxt-select flex=\"\" name=\"jldw\" ng-disabled=\"!data.isFirst\" required=\"\" ng-model=\"data.curHistory.SupervisorCompanyId\" name-value=\"data.curHistory.SupervisorCompanyName\" sources=\"data.construction\" text-field=\"UnitName\" value-field=\"UnitId\"></sxt-select></md-list-item><md-subheader class=\"md-no-sticky\">验收人</md-subheader><md-list-item layout=\"row\"><sxt-select flex=\"\" name=\"ysr\" required=\"\" ng-model=\"data.curStep.CheckWorker\" obj-value=\"data.submitUser\" name-value=\"data.curStep.CheckWorkerName\" sources=\"data.submitUsers\" text-field=\"name\" value-field=\"id\"></sxt-select></md-list-item><div ng-repeat=\"batch in data.batchs\"><md-subheader class=\"md-no-sticky\">{{$index==0?\'验收批\':\'\'}}</md-subheader><div class=\"col-sm-6 col-lg-7\"><div class=\"input-group\"><span class=\"input-group-addon\">验收批{{batch.BatchNo}}</span> <input type=\"text\" class=\"form-control\" ng-disabled=\"!data.isFirst\" ng-model=\"batch.Remark\" placeholder=\"验收批描述\"> <span class=\"input-group-addon\" ng-if=\"$index==0\">第{{batch.Count}}次验收</span> <span class=\"input-group-btn\" ng-if=\"$index!=0\"><button ng-click=\"removeBatch(batch)\" type=\"button\" class=\"btn btn-white\"><i class=\"fa fa-times\"></i></button></span></div></div></div><md-subheader class=\"md-no-sticky\">总承包</md-subheader><md-list-item layout=\"row\"><sxt-select flex=\"\" required=\"\" name=\"zid\" ng-model=\"data.curHistory.ParentCompanyId\" ng-disabled=\"!data.isFirst\" name-value=\"data.curHistory.ParentCompanyName\" sources=\"data.supervision1\" text-field=\"UnitName\" value-field=\"UnitId\"></sxt-select></md-list-item><md-subheader class=\"md-no-sticky\">专业承包</md-subheader><md-list-item layout=\"row\"><sxt-select flex=\"\" required=\"\" name=\"zid\" ng-model=\"data.curHistory.ParentCompanyId\" ng-disabled=\"!data.isFirst\" name-value=\"data.curHistory.ParentCompanyName\" sources=\"data.supervision\" text-field=\"UnitName\" value-field=\"UnitId\"></sxt-select></md-list-item><md-subheader class=\"md-no-sticky\">施工班组</md-subheader><md-list-item layout=\"row\"><sxt-select flex=\"\" required=\"\" ng-model=\"data.curHistory.GrpId\" ng-disabled=\"!data.isFirst\" name=\"gid\" name-value=\"data.curHistory.GrpName\" sources=\"data.groups\" text-field=\"name\" value-field=\"id\"></sxt-select></md-list-item></md-list><div><div class=\"clearfix\"></div></div><fieldset><legend>验收件</legend><span class=\"fs-display-1 display-block\">原验收表扫描件</span><div><small></small></div><sxt-images ng-model=\"data.curStep.GroupImg\" files=\"data.pics\" project=\"data.projectInfo\" edit=\"true\"></sxt-images><div class=\"clearfix\" style=\"clear:both;display: block;\"></div><span class=\"fs-display-1 display-block\">附件</span><div><small></small></div><sxt-images ng-model=\"data.curStep.GroupImg2\" project=\"data.projectInfo\" edit=\"true\"></sxt-images></fieldset><fieldset><legend>主控项目</legend><md-list><md-list-item ng-repeat=\"n in targets.zk\" ng-click=\"n.checked && (n.isOK=!n.isOK)\"><md-checkbox ng-model=\"n.checked\" ng-click=\"$event.stopPropagation()\"></md-checkbox><div class=\"md-list-item-text\" flex=\"\" ng-class=\"{\'text-disabled\':!n.checked}\" layout=\"column\"><h3>{{$index+1}}、{{n.TargetName}}</h3><p ng-if=\"n.Remark\">{{n.Remark}}</p></div><md-switch ng-disabled=\"!n.checked\" ng-click=\"$event.stopPropagation()\" ng-model=\"n.isOK\"></md-switch></md-list-item></md-list></fieldset><div class=\"h48\"></div><fieldset ng-if=\"targets.yb && targets.yb.length\"><legend>一般项目</legend><div ng-repeat=\"n in targets.yb\" ng-class=\"{\'bgc-red-A100\':!ybIsOkRow(n)}\"><h3 ng-class=\"{\'text-disabled\':!n.checked}\"><md-checkbox ng-model=\"n.checked\" ng-click=\"$event.stopPropagation()\"></md-checkbox>{{$index+1}}、{{n.TargetName}} 允许偏差（mm） :{{n.DeviationLimit}}</h3><md-input-container class=\"md-block\"><label>检查点数</label> <input type=\"number\" ng-disabled=\"!n.checked\" ng-model=\"n.CheckNum\"></md-input-container><md-input-container class=\"md-block\"><label>合格率</label> <input type=\"number\" ng-disabled=\"!n.checked\" step=\"0.01\" max=\"100.0\" ng-model=\"n.PassRatio\"></md-input-container><md-input-container class=\"md-block\"><label>最大偏差</label> <input type=\"number\" ng-disabled=\"!n.checked\" step=\"0.01\" ng-model=\"n.MaxDeviation\"></md-input-container></div></fieldset><div layout=\"row\"><div>主控：{{zkIsOk()?\"合格\":\"不合格\"}};</div><div ng-if=\"targets.yb && targets.yb.length\">一般：{{ybIsOk()?\"合格\":\"不合格\"}}({{ybHGL()}}) 总体({{ybHGLPJ()}});</div><div class=\"col-md-2\">结果：{{zkIsOk()&&ybIsOk()?\"合格\":\"不合格\"}};</div></div><div class=\"md-padding\" layout=\"row\"><md-button type=\"submit\" flex=\"\" ng-disabled=\"isSaveing\" class=\"md-raised md-primary\">{{ isSaveing ?\'正在提交...\':\'提交\'}}</md-button></div></form><div style=\"position:fixed; top:0px; right:20px;\"><md-button class=\"md-fab md-mini\" ng-click=\"back()\"><md-icon md-font-icon=\"icon-arrow-left\"></md-icon></md-button></div></md-content>");
$templateCache.put("app/main/szgc/ys/addProcess-appnew.html","<md-content flex=\"\" sxt-number-list=\"\" show=\"vm.keyboard.show\" class=\"md-padding selector\"><form name=\"addForm\" class=\"form-horizontal addform\" ng-submit=\"save(addForm)\"><md-list><md-subheader class=\"md-no-sticky\">项目</md-subheader><md-list-item><p>项目{{data.projectName}} {{data.rName}}</p></md-list-item><md-subheader class=\"md-no-sticky\">工序</md-subheader><md-list-item><p>{{data.procedureName}}</p></md-list-item><md-subheader ng-hide=\"roleId==\'3rd\'||roleId==\'zb\'\" class=\"md-no-sticky\">监理单位</md-subheader><md-list-item ng-hide=\"roleId==\'3rd\'\" layout=\"row\"><sxt-select flex=\"\" name=\"jldw\" ng-disabled=\"!data.isFirst\" required=\"\" ng-model=\"data.curHistory.SupervisorCompanyId\" name-value=\"data.curHistory.SupervisorCompanyName\" sources=\"data.construction\" text-field=\"UnitName\" value-field=\"UnitId\"></sxt-select></md-list-item><md-subheader class=\"md-no-sticky\">验收人</md-subheader><md-list-item layout=\"row\"><sxt-select flex=\"\" name=\"ysr\" required=\"\" ng-model=\"data.curStep.CheckWorker\" obj-value=\"data.submitUser\" name-value=\"data.curStep.CheckWorkerName\" sources=\"data.submitUsers\" text-field=\"name\" value-field=\"id\"></sxt-select></md-list-item><div ng-hide=\"roleId==\'3rd\'\" ng-repeat=\"batch in data.batchs\"><md-subheader class=\"md-no-sticky\">{{$index==0?\'验收批\':\'\'}}</md-subheader><div class=\"col-sm-6 col-lg-7\"><div class=\"input-group\"><span class=\"input-group-addon\">验收批{{batch.BatchNo}}</span> <input type=\"text\" class=\"form-control\" ng-disabled=\"!data.isFirst\" ng-model=\"batch.Remark\" placeholder=\"验收批描述\"> <span class=\"input-group-addon\" ng-if=\"$index==0\">第{{batch.Count}}次验收</span> <span class=\"input-group-btn\" ng-if=\"$index!=0\"><button ng-click=\"removeBatch(batch)\" type=\"button\" class=\"btn btn-white\"><i class=\"fa fa-times\"></i></button></span></div></div></div><md-subheader ng-hide=\"roleId==\'3rd\'\" class=\"md-no-sticky\">总承包</md-subheader><md-list-item ng-hide=\"roleId==\'3rd\'\" layout=\"row\"><sxt-select flex=\"\" required=\"\" name=\"zid\" ng-model=\"data.curHistory.ParentCompanyId\" ng-disabled=\"!data.isFirst\" name-value=\"data.curHistory.ParentCompanyName\" sources=\"data.supervision1\" text-field=\"UnitName\" value-field=\"UnitId\"></sxt-select></md-list-item><md-subheader ng-hide=\"roleId==\'3rd\'\" class=\"md-no-sticky\">专业承包</md-subheader><md-list-item layout=\"row\"><sxt-select ng-hide=\"roleId==\'3rd\'\" flex=\"\" required=\"\" name=\"zid\" ng-model=\"data.curHistory.CompanyId\" ng-disabled=\"!data.isFirst\" name-value=\"data.curHistory.CompanyName\" sources=\"data.supervision\" text-field=\"UnitName\" value-field=\"UnitId\"></sxt-select></md-list-item><md-subheader ng-hide=\"roleId==\'3rd\'\" class=\"md-no-sticky\">施工班组</md-subheader><md-list-item ng-hide=\"roleId==\'3rd\'\" layout=\"row\"><sxt-select flex=\"\" required=\"\" ng-model=\"data.curHistory.GrpId\" ng-disabled=\"!data.isFirst\" name=\"gid\" name-value=\"data.curHistory.GrpName\" sources=\"data.groups\" text-field=\"name\" value-field=\"id\"></sxt-select></md-list-item><md-subheader ng-show=\"roleId==\'jl\'\" class=\"md-no-sticky\">总包已验</md-subheader><md-list-item ng-show=\"roleId==\'jl\'\" layout=\"row\"><md-checkbox ng-disabled=\"!data.isFirst\" flex=\"none\" ng-model=\"data.curHistory.ZbChecked\" aria-label=\"总包已验\"></md-checkbox><p flex=\"\">如果未选择总包已验，提交后总包将不允许录入验收记录</p></md-list-item></md-list><div><div class=\"clearfix\"></div></div><fieldset><legend>验收件</legend><span class=\"fs-display-1 display-block\">添加验收照片</span><div><small></small></div><sxt-images ng-model=\"data.curStep.GroupImg2\" files=\"data.pics2\" project=\"data.projectInfo\" edit=\"true\"></sxt-images></fieldset><fieldset><legend>主控项目</legend><md-list><md-list-item ng-repeat=\"n in targets.zk\" ng-click=\"n.checked && (n.isOK=!n.isOK)\"><md-checkbox ng-model=\"n.checked\" ng-click=\"$event.stopPropagation()\"></md-checkbox><div class=\"md-list-item-text\" flex=\"\" ng-class=\"{\'text-disabled\':!n.checked}\" layout=\"column\"><h3>{{$index+1}}、{{n.TargetName}}</h3><p ng-if=\"n.Remark\">{{n.Remark}}</p></div><md-switch ng-disabled=\"!n.checked\" ng-click=\"$event.stopPropagation()\" ng-model=\"n.isOK\"></md-switch></md-list-item></md-list></fieldset><div class=\"h48\"></div><fieldset ng-if=\"targets.yb && targets.yb.length\"><legend>一般项目</legend><div ng-repeat=\"n in targets.yb\" ng-class=\"{\'bgc-red-A100\':!ybIsOkRow(n),\'datas\':n.checked}\"><h3 ng-class=\"{\'text-disabled\':!n.checked}\"><md-checkbox ng-model=\"n.checked\" ng-click=\"$event.stopPropagation()\"></md-checkbox>{{$index+1}}、{{n.TargetName}} 允许偏差（mm） :{{n.DeviationLimit}}</h3><md-input-container ng-if=\"false\" class=\"md-block\"><label>检查点数</label> <input type=\"number\" ng-disabled=\"!n.checked\" ng-model=\"n.CheckNum\"></md-input-container><md-input-container ng-if=\"false\" class=\"md-block\"><label>合格率</label> <input ng-disabled=\"!n.checked\" ng-model=\"n.PassRatio\"></md-input-container><md-input-container ng-if=\"false\" class=\"md-block\"><label>最大偏差</label> <input ng-disabled=\"!n.checked\" ng-model=\"n.MaxDeviation\"></md-input-container><div class=\"circles\" ng-if=\"n.checked\" sxt-number-list-item=\"\" ng-model=\"n\"><div layout=\"row\" layout-wrap=\"\"><div flex=\"20\"><div class=\"point\" ng-if=\"n.checked\"><span class=\"n\">1</span></div></div></div></div></div></fieldset><div layout=\"row\"><div>主控：{{zkIsOk()?\"合格\":\"不合格\"}};</div><div ng-if=\"targets.yb && targets.yb.length\">一般：{{ybIsOk()?\"合格\":\"不合格\"}}({{ybHGL()}}) 总体({{ybHGLPJ()}});</div><div class=\"col-md-2\">结果：{{zkIsOk()&&ybIsOk()?\"合格\":\"不合格\"}};</div></div><div class=\"md-padding\" layout=\"row\"><md-button type=\"submit\" flex=\"\" ng-disabled=\"isSaveing\" class=\"md-raised md-primary\">{{ isSaveing ?\'正在提交...\':\'提交\'}}</md-button></div></form></md-content><sxt-num-input flex-auto=\"\" ng-model=\"user\" ng-show=\"vm.keyboard.show\" show=\"vm.keyboard.show\" on-next=\"onNext($point)\"></sxt-num-input><div style=\"position:fixed; top:0px; right:20px;\"><md-button class=\"md-fab md-mini\" ng-click=\"back()\"><md-icon md-font-icon=\"icon-arrow-left\"></md-icon></md-button></div>");
$templateCache.put("app/main/szgc/ys/myProcess-app.html","<md-tabs md-border-bottom=\"\" flex=\"\" layout=\"column\"><md-tab label=\"验收\"><md-tab-content flex=\"\" layout-fill=\"\" layout=\"column\"><md-content flex=\"\" layout=\"column\" ng-hide=\"is(\'app.szgc.ys.addnew\')||is(\'app.szgc.ys.upload\')\"><div ng-show=\"!vm.searBarHide\"><div flex=\"\" style=\"overflow: auto\"><sxt-projects-jd ng-model=\"project.pid\" object-scope=\"project\" region-type=\"project.type\" region-name=\"project.typeName\" project-id=\"project.projectId\" project-name=\"project.projectName\" id-tree=\"project.idTree\" name-tree=\"project.nameTree\" on-queryed=\"project.onQueryed\" is-more=\"project.isMore\"><div class=\"md-padding\" layout=\"row\" ng-show=\"project.type==64\"><md-button type=\"submit\" flex=\"\" ui-sref=\"app.szgc.ys.upload({projectid:project.pid,name:project.typeName,type:project.item.type.type_id||project.item.type,idTree:project.idTree,nameTree:project.nameTree})\" class=\"md-raised md-primary\">隐蔽工程照片</md-button></div><md-list ng-hide=\"project.type==64\"><md-subheader class=\"md-no-sticky\">工序</md-subheader><md-list-item><sxt-procedure style=\"width:100%\" ng-model=\"project.procedureId\" procedure-type-id=\"project.procedureTypeId\" name-value=\"project.procedureName\" region-type=\"project.type\" class=\"md-block\"></sxt-procedure></md-list-item><md-divider></md-divider></md-list></sxt-projects-jd><div class=\"md-padding\" ng-hide=\"project.type==64\" layout=\"row\"><md-button type=\"submit\" flex=\"\" ng-click=\"vm.searBarHide=true\" class=\"md-raised md-primary\">确定</md-button></div></div></div><div ng-show=\"vm.searBarHide\" flex=\"\" layout=\"column\"><md-progress-circular md-mode=\"indeterminate\" ng-show=\"vm.loading\"></md-progress-circular><div><table class=\"simple\" ms-responsive-table=\"\"><thead><tr><th>部位</th><th>状态</th><th>操作</th></tr></thead><tfoot><tr><td></td></tr></tfoot><tbody><tr ng-repeat=\"item in project.rows\"><td class=\"name\">{{item.$name}}</td><td class=\"position\">{{roleId==\'zb\'?item.MinPassRatio0 : item.stateName}}</td><td class=\"office\" ng-if=\"!hasTasks(item)\"><a class=\"btn btn-white btn-xs\" ui-sref=\"app.szgc.ys.addnew({projectid:item.$id,name:item.$name,batchId:item.BatchRelationId,procedureTypeId:project.procedureTypeId,procedureId:project.procedureId,type:project.type,idTree:project.idTree,procedureName:project.procedureName,nameTree:project.nameTree})\" ng-if=\"roleId!=\'3rd\' && item.ZbChecked!==false && isPartner\">{{ (roleId==\'zb\' && !item.ZbCount)||(roleId==\'jl\' && !item.JLCount)?\'录入\': \'复验\'}}</a> <a class=\"btn btn-white btn-xs\" ui-sref=\"app.szgc.ys.addnew({projectid:item.$id,name:item.$name,batchId:item.BatchRelationId,procedureTypeId:project.procedureTypeId,procedureId:project.procedureId,type:project.type,idTree:project.idTree,procedureName:project.procedureName,nameTree:project.nameTree})\" ng-if=\"roleId!=\'3rd\' && !isPartner && item.checkedCount && (!item.MinPassRatio1 || item.MinPassRatio1<80)\">{{ item.CheckDate1?\'复验\': \'抽验\'}}</a> <a class=\"btn btn-white btn-xs\" ui-sref=\"app.szgc.report.viewBath.view({bathid:item.BatchRelationId})\" ng-if=\"roleId!=\'3rd\' && item.ZbChecked!==false && item.checkedCount\" title=\"查看\"></a> <a class=\"btn btn-white btn-xs\" ui-sref=\"app.szgc.ys.addnew({projectid:item.$id,name:item.$name,batchId:\'new\',procedureTypeId:project.procedureTypeId,procedureId:project.procedureId,type:project.type,idTree:project.idTree,procedureName:project.procedureName,nameTree:project.nameTree,flag:true,project_item_id:item.project_item_id})\" ng-if=\"roleId!=\'3rd\' && item.ZbChecked!==false && isPartner && !((roleId==\'zb\' && !item.ZbCount)||(roleId==\'jl\' && !item.JLCount))\">新增验收批</a> <span ng-if=\"item.ZbChecked===false\">已设为未验收</span> <a class=\"btn btn-white btn-xs\" ui-sref=\"app.szgc.ys.addnew({projectid:item.$id,name:item.$name,batchId:item.BatchRelationId?item.BatchRelationId:\'\',procedureId:project.procedureId,type:project.type,idTree:project.idTree,procedureName:project.procedureName,nameTree:project.nameTree,procedureTypeId:project.procedureTypeId})\" ng-if=\"roleId==\'3rd\'\">抽验</a></td><td ng-if=\"hasTasks(item)\">已验未传</td></tr></tbody></table></div></div></md-content><div ng-show=\"is(\'app.szgc.ys\')\" style=\"position: absolute; top:0px; right:0px;z-index:99;\"><md-button class=\"md-fab md-mini\" ng-show=\"!vm.searBarHide && vm.isJdBack()\" ng-click=\"vm.backJdSelect()\"><md-icon md-font-icon=\"icon-arrow-left\"></md-icon></md-button><toggle-menu inst=\"vm.searBarHide\"></toggle-menu></div><ui-view layout=\"column\" flex=\"\" ng-show=\"is(\'app.szgc.ys.addnew\')||is(\'app.szgc.ys.upload\')\"></ui-view></md-tab-content></md-tab><md-tab label=\"离线项目\"><md-tab-content flex=\"\" layout-fill=\"\" layout=\"column\"><md-content flex=\"\" layout=\"column\"><md-list md-cloak=\"\"><md-subheader class=\"md-no-sticky\">已下载</md-subheader><md-list-item ng-repeat=\"project in project.offlines\"><p style=\"padding: 0 14px;\" layout=\"column\"><span>{{ project.name }}</span><b ng-if=\"project.indexing\">正在索引 {{project.percent}} ({{project.current}}/{{project.total}})</b></p><md-divider></md-divider></md-list-item><md-subheader class=\"md-no-sticky\">下载</md-subheader><md-list-item ng-repeat=\"p in project.projects\"><div flex=\"\" layout=\"column\"><md-button ng-click=\"loadProject_items(p)\" style=\"text-align: left\">{{ p.name }}</md-button><div ng-repeat=\"item in p.items\" layout=\"row\" style=\"padding-left: 20px;\"><p flex=\"\" style=\"margin: 0;line-height: 40px;\">{{item.name}} <b ng-if=\"item.downloading\">{{item.percent}} ({{item.current}}/{{item.total}})</b></p><md-button flex=\"none\" class=\"md-icon-button md-primary\" aria-label=\"download\" ng-click=\"download($event, p,item)\"><md-icon md-font-icon=\"{{isOffline(item)?\'icon-reload\':\'icon-download\'}}\"></md-icon></md-button></div></div><md-divider></md-divider></md-list-item></md-list></md-content></md-tab-content></md-tab><md-tab label=\"上传\" md-on-select=\"requeryTasks()\"><md-tab-content flex=\"\" layout-fill=\"\" layout=\"column\"><md-content flex=\"\" layout=\"column\"><md-list md-cloak=\"\"><md-subheader class=\"md-no-sticky\"><md-button class=\"md-secondary md-primary md-raised\" ng-disabled=\"uploading\" ng-click=\"upload()\">{{uploading?\'正在上传...\':\'上传\'}}</md-button><span ng-if=\"uploading\">{{project.percent}} ({{project.current}}/{{project.total}})</span></md-subheader><md-list-item ng-repeat=\"task in project.tasks\"><p>{{ task.name }}</p><md-divider></md-divider></md-list-item></md-list></md-content></md-tab-content></md-tab></md-tabs>");
$templateCache.put("app/main/szgc/ys/updateProcess.html","<section class=\"panel nt\"><form name=\"addForm\" class=\"form-horizontal\" ng-submit=\"save(addForm)\"><div class=\"panel-body\"><div class=\"row\"><div class=\"col-md-12\"><div class=\"form-group\"><label class=\"col-sm-2 col-lg-1 control-label\">项目</label><div class=\"col-sm-10 col-lg-11\"><p class=\"form-control-static\">{{data.projectName}} {{data.rName}}</p></div></div><div class=\"form-group\"><label class=\"col-sm-2 col-lg-1 control-label\">工序</label><div class=\"col-sm-10 col-lg-11\"><p class=\"form-control-static\">{{data.procedureName}}</p></div></div></div></div><div class=\"row\"><div class=\"col-md-6\"><div class=\"form-group\" ng-class=\"{\'has-error\':addForm.jldw.$invalid}\"><label class=\"col-sm-4 col-lg-2 control-label\">监理单位</label><div class=\"col-sm-8 col-lg-10\"><sxt-select name=\"jldw\" ng-disabled=\"!data.isFirst\" required=\"\" ng-model=\"data.curHistory.SupervisorCompanyId\" name-value=\"data.curHistory.SupervisorCompanyName\" sources=\"data.construction\" text-field=\"UnitName\" value-field=\"UnitId\"></sxt-select></div></div></div><div class=\"col-md-6\"><div class=\"form-group\" ng-class=\"{\'has-error\':addForm.ysr.$invalid}\"><label class=\"col-sm-4 col-lg-2 control-label\">验收人</label><div class=\"col-sm-8 col-lg-10\"><sxt-select name=\"ysr\" required=\"\" ng-model=\"data.curStep.CheckWorker\" obj-value=\"data.submitUser\" name-value=\"data.curStep.CheckWorkerName\" sources=\"data.submitUsers\" text-field=\"name\" value-field=\"id\"></sxt-select></div></div></div></div><div class=\"row\" ng-repeat=\"batch in data.batchs\"><div class=\"col-md-12\"><div class=\"form-group\"><label class=\"col-sm-2 col-lg-1 control-label\">{{$index==0?\'验收批\':\'\'}} <button ng-if=\"$index==0 && data.isFirst\" type=\"button\" ng-click=\"addBatch()\" class=\"btn btn-white btn-xs\"><i class=\"fa fa-plus\"></i></button></label><div class=\"col-sm-6 col-lg-7\"><div class=\"input-group\"><span class=\"input-group-addon\">验收批{{batch.BatchNo}}</span> <input type=\"text\" class=\"form-control\" ng-disabled=\"!data.isFirst\" ng-model=\"batch.Remark\" placeholder=\"验收批描述\"> <span class=\"input-group-addon\" ng-if=\"$index==0\">第{{batch.Count}}次验收</span> <span class=\"input-group-btn\" ng-if=\"$index!=0\"><button ng-click=\"removeBatch(batch)\" type=\"button\" class=\"btn btn-white\"><i class=\"fa fa-times\"></i></button></span></div></div><div class=\"col-sm-4 col-lg-4\"><div class=\"input-group\"><span class=\"input-group-addon\" id=\"basic-addon2\">完成占比</span> <input type=\"number\" class=\"form-control\" ng-disabled=\"!data.isFirst\" ng-keyup=\"changeBatch(batch)\" ng-model=\"batch.WorkRatio\" placeholder=\"数字(未填写为100)\"> <span class=\"input-group-addon\" id=\"basic-addon2\">%</span></div></div></div></div></div><div class=\"row\"><div class=\"col-md-4\"><div class=\"form-group\" ng-class=\"{\'has-error\':addForm.zid.$invalid}\"><label class=\"col-sm-6 col-lg-3 control-label\">总承包</label><div class=\"col-sm-6 col-lg-9\"><sxt-select required=\"\" name=\"zid\" ng-model=\"data.curHistory.ParentCompanyId\" ng-disabled=\"!data.isFirst\" name-value=\"data.curHistory.ParentCompanyName\" sources=\"data.supervision1\" text-field=\"UnitName\" value-field=\"UnitId\"></sxt-select></div></div></div><div class=\"col-md-4\"><div class=\"form-group\"><label class=\"col-sm-6 col-lg-3 control-label\">专业承包</label><div class=\"col-sm-6 col-lg-9\"><sxt-select ng-model=\"data.curHistory.CompanyId\" ng-disabled=\"!data.isFirst\" name-value=\"data.curHistory.CompanyName\" sources=\"data.supervision\" text-field=\"UnitName\" value-field=\"UnitId\"></sxt-select></div></div></div><div class=\"col-md-4\"><div class=\"form-group\" ng-class=\"{\'has-error\':addForm.gid.$invalid}\"><label class=\"col-sm-6 col-lg-3 control-label\">施工班组</label><div class=\"col-sm-6 col-lg-9\"><sxt-select required=\"\" ng-model=\"data.curHistory.GrpId\" ng-disabled=\"!data.isFirst\" name=\"gid\" name-value=\"data.curHistory.GrpName\" sources=\"data.groups\" text-field=\"name\" value-field=\"id\"></sxt-select></div></div></div></div></div><div><div class=\"clearfix\"></div></div><div class=\"panel-body\"><fieldset><legend>验收件</legend><span class=\"fs-display-1 display-block\">原验收表扫描件</span><div><small></small></div><sxt-images ng-model=\"data.curStep.GroupImg\" project=\"data.projectInfo\" edit=\"true\"></sxt-images><div class=\"clearfix\"></div><span class=\"fs-display-1 display-block\">附件</span><div><small></small></div><sxt-images ng-model=\"data.curStep.GroupImg2\" project=\"data.projectInfo\" edit=\"true\"></sxt-images></fieldset><fieldset><legend>主控项目</legend><div class=\"row\" ng-repeat=\"n in targets.zk\" lx-ripple=\"grey-200\" ng-click=\"n.isOK=!n.isOK\"><div class=\"col-sm-10\"><p class=\"h24\"><strong>{{$index+1}}、{{n.TargetName}}</strong><br ng-if=\"n.Remark\">{{n.Remark}}</p></div><div class=\"col-sm-2 h48\"><div class=\"switch\"><input type=\"checkbox\" ng-model=\"n.isOK\" id=\"id{{n.Id}}\" class=\"switch__input\"> <label class=\"switch__label\" for=\"id{{n.Id}}\">{{ n.isOK?\' 符合\':\'不符合\' }}</label></div></div></div></fieldset><div class=\"h48\"></div><fieldset><legend>一般项目</legend><div class=\"row hidden-xs\"><div class=\"col-md-4\" flex-item=\"4\"><div class=\"ml++\">项目</div></div><div class=\"col-md-2\">允许偏差（mm）</div><div class=\"col-md-2\">检查点数</div><div class=\"col-md-2\">合格率</div><div class=\"col-md-2\">最大偏差</div></div><div class=\"row\" ng-repeat=\"n in targets.yb\" ng-class=\"{\'bgc-red-A100\':!ybIsOkRow(n)}\"><div class=\"col-md-4\"><div class=\"h48\">{{$index+1}}、{{n.TargetName}}</div></div><div class=\"col-md-2\"><div class=\"h48\"><span class=\"hidden-lg\">允许偏差（mm）：</span> {{n.DeviationLimit}}</div></div><div class=\"col-md-2\"><lx-text-field label=\"检查点数\" fixed-label=\"true\"><input type=\"number\" ng-required=\"zkIsOk(n)\" ng-model=\"n.CheckNum\"></lx-text-field></div><div class=\"col-md-2\"><lx-text-field label=\"合格率\" fixed-label=\"true\"><input type=\"number\" ng-required=\"zkIsOk(n)\" ng-model=\"n.PassRatio\"></lx-text-field></div><div class=\"col-md-2\"><lx-text-field label=\"最大偏差\" fixed-label=\"true\"><input type=\"text\" ng-required=\"zkIsOk(n)\" ng-model=\"n.MaxDeviation\" ng-blur=\"ybBlur(n)\"></lx-text-field></div></div><div class=\"row\" flex-gutter=\"12\"><div class=\"col-md-4\" hide-sm=\"\"><div class=\"p+\"></div></div><div class=\"col-md-2\"><div class=\"p+\"></div></div><div class=\"col-md-2\"><div class=\"h48\">主控：{{zkIsOk()?\"合格\":\"不合格\"}}</div></div><div class=\"col-md-2\"><div class=\"h48\">一般：{{ybIsOk()?\"合格\":\"不合格\"}}({{ybHGL()}})</div></div><div class=\"col-md-2\"><div class=\"h48\">结果：{{zkIsOk()&&ybIsOk()?\"合格\":\"不合格\"}}</div></div></div></fieldset></div><div class=\"form-group\"><div class=\"col-sm-9 col-lg-10 col-sm-offset-2 col-lg-offset-1\"><button type=\"submit\" ng-disabled=\"isSaveing\" class=\"btn btn-white pull-right\">{{ isSaveing ?\'正在提交...\':\'提交\'}}</button></div></div></form></section>");
$templateCache.put("app/main/szgc/ys/upload.html","<md-content flex=\"\" layout=\"column\"><div layout=\"column\" flex=\"none\" class=\"md-padding\"><md-input-container flex=\"\"><label>工序</label><md-select ng-model=\"project.gx1\" md-on-close=\"project.gid2 = project.gid+\'-\'+project.gx1\"><md-option value=\"1\">钢筋混凝土楼板</md-option><md-option value=\"2\">钢筋混凝土墙柱</md-option><md-option value=\"3\">预制内墙板</md-option><md-option value=\"4\">轻钢龙骨隔墙</md-option><md-option value=\"5\">吊顶</md-option><md-option value=\"6\">砌筑</md-option></md-select></md-input-container></div><div flex=\"\" sxt-area-house=\"\" show=\"true\" upload=\"true\" pid=\"project.pid\" oid=\"project.oid\" o-name=\"project.oname\" files=\"project.files\" gid=\"project.gid2\"></div><sxt-images ng-hide=\"1\" ng-model=\"project.gid\" files=\"project.files\"></sxt-images></md-content>");
$templateCache.put("app/quick-panel/tabs/chat/chat-tab.html","<div class=\"main animate-slide-left\" ng-hide=\"vm.chatActive\"><md-list class=\"recent\"><md-subheader class=\"md-no-sticky\"><span translate=\"QUICKPANEL.RECENT\">Recent</span></md-subheader><md-list-item class=\"contact md-3-line\" ng-repeat=\"contact in vm.contacts.recent\" ng-click=\"vm.toggleChat(contact)\"><img ng-src=\"{{contact.avatar}}\" class=\"md-avatar\" alt=\"{{contact.name}}\"><div class=\"status {{contact.status}}\"></div><div ng-if=\"contact.unread\" class=\"md-accent-bg unread-message-count\">{{contact.unread}}</div><div class=\"md-list-item-text\"><h3>{{contact.name}}</h3><p class=\"last-message\">{{contact.lastMessage}}</p></div></md-list-item></md-list><md-divider></md-divider><md-list class=\"all\"><md-subheader class=\"md-no-sticky\"><span translate=\"QUICKPANEL.START_NEW_CHAT\">Start New Chat</span></md-subheader><md-list-item class=\"contact\" ng-repeat=\"contact in vm.contacts.all\" ng-click=\"vm.toggleChat(contact)\"><img ng-src=\"{{contact.avatar}}\" class=\"md-avatar\" alt=\"{{contact.name}}\"><div class=\"status {{contact.status}}\"></div><div class=\"md-list-item-text\"><h3>{{contact.name}}</h3></div></md-list-item></md-list><md-divider></md-divider></div><div class=\"chat animate-slide-right\" ng-show=\"vm.chatActive\" layout=\"column\"><md-toolbar class=\"md-accent\"><div class=\"md-toolbar-tools\" layout=\"row\" layout-align=\"space-between center\"><div layout=\"row\" layout-align=\"start center\"><md-button class=\"md-icon-button\" ng-click=\"vm.toggleChat()\" aria-label=\"Back\" translate=\"\" translate-attr-aria-label=\"QUICKPANEL.BACK\"><md-icon md-font-icon=\"icon-keyboard-backspace\"></md-icon></md-button><h4><span>{{vm.chat.contact.name}}</span></h4></div><div layout=\"row\" layout-align=\"end center\"><md-button class=\"md-icon-button\" aria-label=\"Call\" translate=\"\" translate-attr-aria-label=\"QUICKPANEL.CALL\"><md-icon md-font-icon=\"icon-phone\"></md-icon></md-button><md-button class=\"md-icon-button\" aria-label=\"More\" translate=\"\" translate-attr-aria-label=\"QUICKPANEL.MORE\"><md-icon md-font-icon=\"icon-dots-vertical\"></md-icon></md-button></div></div></md-toolbar><md-content flex=\"\" layout-paddings=\"\" ms-scroll=\"\" id=\"chat-dialog\"><div layout=\"row\" ng-repeat=\"dialog in vm.chat.contact.dialog\" class=\"md-padding message-row\" ng-class=\"dialog.who\"><img ng-if=\"dialog.who ===\'contact\'\" ng-src=\"{{vm.chat.contact.avatar}}\" class=\"avatar\" alt=\"{{vm.chat.contact.name}}\"> <img ng-if=\"dialog.who ===\'user\'\" class=\"avatar\" src=\"assets/images/avatars/profile.jpg\"><div class=\"bubble\" flex=\"\"><div class=\"message\">{{dialog.message}}</div><div class=\"time secondary-text\">{{dialog.time}}</div></div></div></md-content><form ng-submit=\"vm.reply()\" layout=\"row\" class=\"reply\" layout-align=\"start center\"><textarea ng-keyup=\"$event.keyCode == 13 ? vm.reply() : null\" flex=\"\" ng-model=\"vm.replyMessage\" placeholder=\"Type and hit enter to send message\" translate=\"\" translate-attr-placeholder=\"QUICKPANEL.REPLY_PLACEHOLDER\"></textarea><md-button class=\"md-fab md-icon-button\" type=\"submit\" aria-label=\"Send message\" translate=\"\" translate-attr-aria-label=\"QUICKPANEL.SEND_MESSAGE\"><md-icon md-font-icon=\"icon-send\"></md-icon></md-button></form></div>");
$templateCache.put("app/quick-panel/tabs/activity/activity-tab.html","<md-list class=\"friends\"><md-subheader class=\"md-no-sticky\"><span translate=\"QUICKPANEL.FRIENDS\">Friends</span></md-subheader><md-list-item class=\"friend md-3-line\" ng-repeat=\"friend in vm.activities.friends\"><img ng-src=\"{{friend.avatar}}\" class=\"md-avatar\" alt=\"{{friend.name}}\"><div class=\"status {{friend.status}}\"></div><div ng-if=\"contact.unread\" class=\"md-accent-bg unread-message-count\">{{contact.unread}}</div><div class=\"md-list-item-text\"><h3 class=\"message\">{{friend.message}}</h3><p class=\"time\">{{friend.time}}</p></div></md-list-item></md-list><md-divider></md-divider><md-list class=\"servers\"><md-subheader class=\"md-no-sticky\"><span translate=\"QUICKPANEL.APP_SERVERS\">Application Servers</span></md-subheader><md-list-item class=\"server md-3-line\" ng-repeat=\"server in vm.activities.servers\"><md-icon md-font-icon=\"icon-checkbox-blank-circle\" class=\"s16 status\" ng-class=\"server.status\"></md-icon><div class=\"md-list-item-text\"><h3>{{server.location}}</h3><p>{{server.detail}}</p></div></md-list-item></md-list><md-divider></md-divider><md-list class=\"stats\"><md-subheader class=\"md-no-sticky\"><span translate=\"QUICKPANEL.USER_STATS\">User Stats</span></md-subheader><md-list-item class=\"stat md-2-line\" ng-repeat=\"stat in vm.activities.stats\"><div class=\"md-list-item-text\"><span>{{stat.title}} ({{stat.current}} / {{stat.total}})</span><md-progress-linear ng-class=\"stat.status\" md-mode=\"determinate\" value=\"{{stat.percent}}\"></md-progress-linear></div></md-list-item></md-list>");
$templateCache.put("app/quick-panel/tabs/today/today-tab.html","<md-list class=\"date\"><md-subheader class=\"md-no-sticky\"><span translate=\"QUICKPANEL.TODAY\">Today</span></md-subheader><md-list-item class=\"md-display-1 md-2-line\" layout=\"column\" layout-align=\"start start\"><div class=\"secondary-text\"><div>{{vm.date | date:\'EEEE\'}}</div><div layout=\"row\" layout-align=\"start start\"><span>{{vm.date | date:\'d\'}}</span> <span class=\"md-subhead\">th</span> <span>{{vm.date | date:\'MMMM\'}}</span></div></div></md-list-item></md-list><md-divider></md-divider><md-list><md-subheader class=\"md-no-sticky\"><span translate=\"QUICKPANEL.EVENTS\">Events</span></md-subheader><md-list-item class=\"md-2-line\" ng-repeat=\"event in vm.events\" ng-click=\"dummyFunction()\"><div class=\"md-list-item-text\"><h3>{{event.title}}</h3><p>{{event.detail}}</p></div></md-list-item></md-list><md-divider></md-divider><md-list><md-subheader class=\"md-no-sticky\"><span translate=\"QUICKPANEL.NOTES\">Notes</span></md-subheader><md-list-item class=\"md-2-line\" ng-repeat=\"note in vm.notes\" ng-click=\"dummyFunction()\"><div class=\"md-list-item-text\"><h3>{{note.title}}</h3><p>{{note.detail}}</p></div></md-list-item></md-list><md-divider></md-divider><md-list><md-subheader class=\"md-no-sticky\"><span translate=\"QUICKPANEL.QUICK_SETTINGS\">Quick Settings</span></md-subheader><md-list-item><h3 translate=\"QUICKPANEL.NOTIFICATIONS\">Notifications</h3><md-switch class=\"md-secondary\" ng-model=\"vm.settings.notify\" aria-label=\"Notifications\" translate=\"\" translate-attr-aria-label=\"QUICKPANEL.NOTIFICATIONS\"></md-switch></md-list-item><md-list-item><h3 translate=\"QUICKPANEL.CLOUD_SYNC\">Cloud Sync</h3><md-switch class=\"md-secondary\" ng-model=\"vm.settings.cloud\" aria-label=\"Cloud Sync\" translate=\"\" translate-attr-aria-label=\"QUICKPANEL.CLOUD_SYNC\"></md-switch></md-list-item><md-list-item><h3 translate=\"QUICKPANEL.RETRO_THRUSTERS\">Retro Thrusters</h3><md-switch class=\"md-secondary md-warn\" ng-model=\"vm.settings.retro\" aria-label=\"Retro Thrusters\" translate=\"\" translate-attr-aria-label=\"QUICKPANEL.RETRO_THRUSTERS\"></md-switch></md-list-item></md-list>");
$templateCache.put("app/toolbar/layouts/content-with-footbar/footbar.html","<md-list flex=\"\" layout=\"row\"><md-list-item flex=\"\"><md-button ui-sref=\"app.szgc.home\" class=\"md-grid-item-content\" flex=\"\"><md-icon md-svg-src=\"app/toolbar/images/icon_home1.svg\" class=\"icon s32\" ng-class=\"{\'active\':vm.is(\'app.szgc.home\')}\"></md-icon><div class=\"md-grid-text\" style=\"line-height: 20px\" ng-style=\"{\'color\':vm.is(\'app.szgc.home\')?\'#ff0000\':\'rgba(0,0,0,0.54)\'}\">首页</div></md-button></md-list-item><md-list-item flex=\"\"><md-button ui-sref=\"app.szgc.report({id:1,category:2})\" class=\"md-grid-item-content\" flex=\"\"><md-icon md-svg-src=\"app/toolbar/images/icon_report1.svg\" class=\"icon s32\" ng-class=\"{\'active\':vm.is(\'app.szgc.report\')}\"></md-icon><div class=\"md-grid-text\" style=\"line-height: 20px\" ng-style=\"{\'color\':vm.is(\'app.szgc.report\')?\'#ff0000\':\'rgba(0,0,0,0.54)\'}\">报表</div></md-button></md-list-item><md-list-item flex=\"\"><md-button ui-sref=\"app.szgc.ys\" class=\"md-grid-item-content\" flex=\"\"><md-icon md-svg-src=\"app/toolbar/images/icon_check1.svg\" class=\"icon s32\" ng-class=\"{\'active\':vm.is(\'app.szgc.ys\')}\"></md-icon><div class=\"md-grid-text\" style=\"line-height: 20px\" ng-style=\"{\'color\':vm.is(\'app.szgc.ys\')?\'#ff0000\':\'rgba(0,0,0,0.54)\'}\">验收</div></md-button></md-list-item><md-list-item flex=\"\"><md-button ui-sref=\"app.szgc.ybgcResultT1\" class=\"md-grid-item-content\" flex=\"\"><md-icon md-svg-src=\"app/toolbar/images/yd.svg\" class=\"icon s32\" ng-class=\"{\'active\':vm.is(\'app.szgc.ybgcResultT1\')}\"></md-icon><div class=\"md-grid-text\" style=\"line-height: 20px\" ng-style=\"{\'color\':vm.is(\'app.szgc.ybgcResultT1\')?\'#ff0000\':\'rgba(0,0,0,0.54)\'}\">一户一档</div></md-button></md-list-item><md-list-item flex=\"\"><md-button ui-sref=\"app.szgc.settings\" class=\"md-grid-item-content\" flex=\"\"><md-icon md-svg-src=\"app/toolbar/images/icon_setting1.svg\" class=\"icon s32\" ng-class=\"{\'active\':vm.is(\'app.szgc.settings\')}\"></md-icon><div class=\"md-grid-text\" style=\"line-height: 20px\" ng-style=\"{\'color\':vm.is(\'app.szgc.settings\')?\'#ff0000\':\'rgba(0,0,0,0.54)\'}\">设置</div></md-button></md-list-item></md-list>");
$templateCache.put("app/toolbar/layouts/content-with-footbar/toptoolbar.html","<div class=\"md-toolbar-tools\" layout=\"row\"><md-button flex=\"none\" class=\"md-icon-button\" ng-show=\"!$root.noBack\" ng-click=\"goBack();\"><md-icon md-font-icon=\"icon-chevron-left\" style=\"color:white;\"></md-icon></md-button><h2 flex=\"\"><span>{{$root.title || \'万科数字工程\'}}</span></h2><md-button flex=\"none\" class=\"md-icon-button\" aria-label=\"net work\" ng-click=\"vm.setNetwork()\"><md-icon md-svg-icon=\"assets/images/online.svg\" ng-if=\"vm.networkState==0\"></md-icon><md-icon md-svg-icon=\"assets/images/offline.svg\" ng-if=\"vm.networkState==1\"></md-icon></md-button><div flex=\"none\"><md-progress-circular id=\"toolbar-progress\" ng-if=\"$root.loadingProgress\" md-mode=\"indeterminate\" md-diameter=\"40\"></md-progress-circular></div></div>");
$templateCache.put("app/toolbar/layouts/content-width-footbar/footbar.html","<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><title>Title</title></head><body></body></html>");
$templateCache.put("app/toolbar/layouts/content-with-toolbar/toolbar.html","<div layout=\"row\" layout-align=\"space-between center\"><div layout=\"row\" layout-align=\"start center\"><div class=\"logo\" layout=\"row\" layout-align=\"start center\"><span class=\"logo-image\">F</span> <span class=\"logo-text\">FUSE</span></div><md-progress-circular id=\"toolbar-progress\" ng-if=\"$root.loadingProgress\" class=\"md-accent\" md-mode=\"indeterminate\" md-diameter=\"64\"></md-progress-circular></div><div layout=\"row\" layout-align=\"start center\"><div class=\"toolbar-separator\"></div><ms-search-bar></ms-search-bar><div class=\"toolbar-separator\"></div><md-menu-bar id=\"user-menu\"><md-menu md-position-mode=\"left bottom\"><md-button class=\"user-button\" ng-click=\"$mdOpenMenu()\" aria-label=\"User settings\" translate=\"\" translate-attr-aria-label=\"TOOLBAR.USER_SETTINGS\"><div layout=\"row\" layout-align=\"space-between center\"><div class=\"avatar-wrapper\"><img md-menu-align-target=\"\" class=\"avatar\" src=\"assets/images/avatars/profile.jpg\"><md-icon md-font-icon=\"\" ng-class=\"vm.userStatus.icon\" ng-style=\"{\'color\': vm.userStatus.color }\" class=\"icon status s16\"></md-icon></div><span class=\"username\" hide-xs=\"\">John Doe</span><md-icon md-font-icon=\"icon-chevron-down\" class=\"icon s16\" hide-xs=\"\"></md-icon></div></md-button><md-menu-content width=\"3\"><md-menu-item class=\"md-indent\" ui-sref=\"app.pages_profile\"><md-icon md-font-icon=\"icon-account\" class=\"icon\"></md-icon><md-button>My Profile</md-button></md-menu-item><md-menu-item class=\"md-indent\" ui-sref=\"app.mail\"><md-icon md-font-icon=\"icon-email\" class=\"icon\"></md-icon><md-button>Inbox</md-button></md-menu-item><md-menu-item class=\"md-indent\"><md-icon md-font-icon=\"\" ng-class=\"vm.userStatus.icon\" ng-style=\"{\'color\': vm.userStatus.color }\" class=\"icon\"></md-icon><md-menu id=\"user-status-menu\"><md-button ng-click=\"$mdOpenMenu()\" class=\"status\" ng-class=\"vm.userStatus.class\">{{vm.userStatus.title}}</md-button><md-menu-content width=\"2\"><md-menu-item class=\"status md-indent\" ng-class=\"{\'selected\': status === vm.userStatus}\" ng-repeat=\"status in vm.userStatusOptions\"><md-icon md-font-icon=\"{{status.icon}}\" ng-style=\"{\'color\': status.color }\" class=\"icon\"></md-icon><md-button ng-click=\"vm.setUserStatus(status)\">{{status.title}}</md-button></md-menu-item></md-menu-content></md-menu></md-menu-item><md-menu-divider></md-menu-divider><md-menu-item class=\"md-indent\"><md-icon md-font-icon=\"icon-logout\" class=\"icon\"></md-icon><md-button ng-click=\"vm.logout()\">Logout</md-button></md-menu-item></md-menu-content></md-menu></md-menu-bar><div class=\"toolbar-separator\"></div><md-menu id=\"language-menu\" md-offset=\"0 72\" md-position-mode=\"target-right target\"><md-button class=\"language-button\" ng-click=\"$mdOpenMenu()\" aria-label=\"Language\" md-menu-origin=\"\" md-menu-align-target=\"\"><div layout=\"row\" layout-align=\"center center\"><img class=\"flag\" ng-src=\"assets/images/flags/{{vm.selectedLanguage.flag}}.png\"> <span class=\"iso\">{{vm.selectedLanguage.code}}</span></div></md-button><md-menu-content width=\"3\" id=\"language-menu-content\"><md-menu-item ng-repeat=\"(iso, lang) in vm.languages\"><md-button ng-click=\"vm.changeLanguage(lang)\" aria-label=\"{{lang.title}}\" translate=\"\" translate-attr-aria-label=\"{{lang.title}}\"><span layout=\"row\" layout-align=\"start center\"><img class=\"flag\" ng-src=\"assets/images/flags/{{lang.flag}}.png\"> <span translate=\"{{lang.translation}}\">{{lang.title}}</span></span></md-button></md-menu-item></md-menu-content></md-menu><div class=\"toolbar-separator\"></div><md-button id=\"quick-panel-toggle\" class=\"md-icon-button\" ng-click=\"vm.toggleSidenav(\'quick-panel\')\" aria-label=\"Toggle quick panel\" translate=\"\" translate-attr-aria-label=\"TOOLBAR.TOGGLE_QUICK_PANEL\"><md-icon md-font-icon=\"icon-format-list-bulleted\" class=\"icon\"></md-icon></md-button></div></div>");
$templateCache.put("app/toolbar/layouts/horizontal-navigation/toolbar.html","<div layout=\"row\" layout-align=\"space-between center\"><div layout=\"row\" layout-align=\"start center\"><div class=\"navigation-toggle\" hide-gt-sm=\"\"><md-button class=\"md-icon-button\" ng-click=\"vm.toggleHorizontalMobileMenu()\" aria-label=\"Toggle Mobile Navigation\"><md-icon md-font-icon=\"icon-menu\"></md-icon></md-button></div><div class=\"logo\" layout=\"row\" layout-align=\"start center\"><span class=\"logo-image\">F</span> <span class=\"logo-text\">FUSE</span></div><md-progress-circular id=\"toolbar-progress\" ng-if=\"$root.loadingProgress\" class=\"md-accent\" md-mode=\"indeterminate\" md-diameter=\"64\"></md-progress-circular></div><div layout=\"row\" layout-align=\"start center\"><ms-search-bar></ms-search-bar><md-menu-bar id=\"user-menu\"><md-menu md-position-mode=\"left bottom\"><md-button class=\"user-button\" ng-click=\"$mdOpenMenu()\" aria-label=\"User settings\" translate=\"\" translate-attr-aria-label=\"TOOLBAR.USER_SETTINGS\"><div layout=\"row\" layout-align=\"space-between center\"><div class=\"avatar-wrapper\"><img md-menu-align-target=\"\" class=\"avatar\" src=\"assets/images/avatars/profile.jpg\"><md-icon md-font-icon=\"\" ng-class=\"vm.userStatus.icon\" ng-style=\"{\'color\': vm.userStatus.color }\" class=\"icon status s16\"></md-icon></div><span class=\"username\" hide-xs=\"\">John Doe</span><md-icon md-font-icon=\"icon-chevron-down\" class=\"icon s16\" hide-xs=\"\"></md-icon></div></md-button><md-menu-content width=\"3\"><md-menu-item class=\"md-indent\" ui-sref=\"app.pages_profile\"><md-icon md-font-icon=\"icon-account\" class=\"icon\"></md-icon><md-button>My Profile</md-button></md-menu-item><md-menu-item class=\"md-indent\" ui-sref=\"app.mail\"><md-icon md-font-icon=\"icon-email\" class=\"icon\"></md-icon><md-button>Inbox</md-button></md-menu-item><md-menu-item class=\"md-indent\"><md-icon md-font-icon=\"\" ng-class=\"vm.userStatus.icon\" ng-style=\"{\'color\': vm.userStatus.color }\" class=\"icon\"></md-icon><md-menu id=\"user-status-menu\"><md-button ng-click=\"$mdOpenMenu()\" class=\"status\" ng-class=\"vm.userStatus.class\">{{vm.userStatus.title}}</md-button><md-menu-content width=\"2\"><md-menu-item class=\"status md-indent\" ng-class=\"{\'selected\': status === vm.userStatus}\" ng-repeat=\"status in vm.userStatusOptions\"><md-icon md-font-icon=\"{{status.icon}}\" ng-style=\"{\'color\': status.color }\" class=\"icon\"></md-icon><md-button ng-click=\"vm.setUserStatus(status)\">{{status.title}}</md-button></md-menu-item></md-menu-content></md-menu></md-menu-item><md-menu-divider></md-menu-divider><md-menu-item class=\"md-indent\"><md-icon md-font-icon=\"icon-logout\" class=\"icon\"></md-icon><md-button ng-click=\"vm.logout()\">Logout</md-button></md-menu-item></md-menu-content></md-menu></md-menu-bar><md-menu id=\"language-menu\" md-offset=\"0 72\" md-position-mode=\"target-right target\"><md-button class=\"language-button\" ng-click=\"$mdOpenMenu()\" aria-label=\"Language\" md-menu-origin=\"\" md-menu-align-target=\"\"><div layout=\"row\" layout-align=\"center center\"><img class=\"flag\" ng-src=\"assets/images/flags/{{vm.selectedLanguage.flag}}.png\"> <span class=\"iso\">{{vm.selectedLanguage.code}}</span></div></md-button><md-menu-content width=\"3\" id=\"language-menu-content\"><md-menu-item ng-repeat=\"(iso, lang) in vm.languages\"><md-button ng-click=\"vm.changeLanguage(lang)\" aria-label=\"{{lang.title}}\" translate=\"\" translate-attr-aria-label=\"{{lang.title}}\"><span layout=\"row\" layout-align=\"start center\"><img class=\"flag\" ng-src=\"assets/images/flags/{{lang.flag}}.png\"> <span translate=\"{{lang.translation}}\">{{lang.title}}</span></span></md-button></md-menu-item></md-menu-content></md-menu><md-button id=\"quick-panel-toggle\" class=\"md-icon-button\" ng-click=\"vm.toggleSidenav(\'quick-panel\')\" aria-label=\"Toggle quick panel\" translate=\"\" translate-attr-aria-label=\"TOOLBAR.TOGGLE_QUICK_PANEL\"><md-icon md-font-icon=\"icon-format-list-bulleted\" class=\"icon\"></md-icon></md-button></div></div>");
$templateCache.put("app/toolbar/layouts/vertical-navigation/toolbar.html","<div layout=\"row\" layout-align=\"start center\"><div layout=\"row\" layout-align=\"start center\" flex=\"\"><md-button id=\"navigation-toggle\" class=\"md-icon-button\" ng-click=\"vm.toggleSidenav(\'navigation\')\" hide-gt-sm=\"\" aria-label=\"Toggle navigation\" translate=\"\" translate-attr-aria-label=\"TOOLBAR.TOGGLE_NAVIGATION\"><md-icon md-font-icon=\"icon-menu\" class=\"icon\"></md-icon></md-button><ms-search-bar></ms-search-bar><div class=\"toolbar-separator\"></div><md-progress-circular id=\"toolbar-progress\" ng-if=\"$root.loadingProgress\" class=\"md-accent\" md-mode=\"indeterminate\" md-diameter=\"64\"></md-progress-circular></div><div layout=\"row\" layout-align=\"start center\"><md-menu-bar id=\"user-menu\"><md-menu md-position-mode=\"left bottom\"><md-button class=\"user-button\" ng-click=\"$mdOpenMenu()\" aria-label=\"User settings\" translate=\"\" translate-attr-aria-label=\"TOOLBAR.USER_SETTINGS\"><div layout=\"row\" layout-align=\"space-between center\"><div class=\"avatar-wrapper\"><img md-menu-align-target=\"\" class=\"avatar\" src=\"assets/images/avatars/profile.jpg\"><md-icon md-font-icon=\"\" ng-class=\"vm.userStatus.icon\" ng-style=\"{\'color\': vm.userStatus.color }\" class=\"icon status s16\"></md-icon></div><span class=\"username\" hide-xs=\"\">{{vm.user.Username}}</span><md-icon md-font-icon=\"icon-chevron-down\" class=\"icon s16\" hide-xs=\"\"></md-icon></div></md-button><md-menu-content width=\"3\"><md-menu-item class=\"md-indent\" ui-sref=\"app.pages_profile\"><md-icon md-font-icon=\"icon-account\" class=\"icon\"></md-icon><md-button>个人信息</md-button></md-menu-item><md-menu-item class=\"md-indent\" ui-sref=\"app.mail\"><md-icon md-font-icon=\"icon-email\" class=\"icon\"></md-icon><md-button>收件箱</md-button></md-menu-item><md-menu-item class=\"md-indent\"><md-icon md-font-icon=\"\" ng-class=\"vm.userStatus.icon\" ng-style=\"{\'color\': vm.userStatus.color }\" class=\"icon\"></md-icon><md-menu id=\"user-status-menu\"><md-button ng-click=\"$mdOpenMenu()\" class=\"status\" ng-class=\"vm.userStatus.class\">{{vm.userStatus.title}}</md-button><md-menu-content width=\"2\"><md-menu-item class=\"status md-indent\" ng-class=\"{\'selected\': status === vm.userStatus}\" ng-repeat=\"status in vm.userStatusOptions\"><md-icon md-font-icon=\"{{status.icon}}\" ng-style=\"{\'color\': status.color }\" class=\"icon\"></md-icon><md-button ng-click=\"vm.setUserStatus(status)\">{{status.title}}</md-button></md-menu-item></md-menu-content></md-menu></md-menu-item><md-menu-divider></md-menu-divider><md-menu-item class=\"md-indent\"><md-icon md-font-icon=\"icon-logout\" class=\"icon\"></md-icon><md-button ng-click=\"vm.logout()\">退出</md-button></md-menu-item></md-menu-content></md-menu></md-menu-bar></div></div>");
$templateCache.put("app/core/directives/ms-navigation/templates/horizontal.html","<div class=\"navigation-toggle\" hide-gt-sm=\"\"><md-button class=\"md-icon-button\" ng-click=\"vm.toggleHorizontalMobileMenu()\" aria-label=\"Toggle Mobile Navigation\"><md-icon md-font-icon=\"icon-menu\"></md-icon></md-button></div><ul class=\"horizontal\"><li ng-repeat=\"node in vm.navigation\" ms-navigation-horizontal-node=\"node\" ng-class=\"{\'has-children\': vm.hasChildren}\" ng-include=\"\'navigation-horizontal-nested.html\'\"></li></ul><script type=\"text/ng-template\" id=\"navigation-horizontal-nested.html\"><div ms-navigation-horizontal-item layout=\"row\"> <div class=\"ms-navigation-horizontal-button\" ng-if=\"!node.uisref && node.title\" ng-class=\"{\'active md-accent-bg\': vm.isActive}\"> <i class=\"icon s18 {{node.icon}}\" ng-if=\"node.icon\"></i> <span class=\"title\" translate=\"{{node.translate}}\" flex>{{node.title}}</span> <span class=\"badge white-fg\" style=\"background: {{node.badge.color}}\" ng-if=\"node.badge\">{{node.badge.content}}</span> <i class=\"icon-chevron-right s18 arrow\" ng-if=\"vm.hasChildren\"></i> </div> <a class=\"ms-navigation-horizontal-button\" ui-sref=\"{{node.uisref}}\" ui-sref-active=\"active md-accent-bg\" ng-class=\"{\'active md-accent-bg\': vm.isActive}\" ng-if=\"node.uisref && node.title\"> <i class=\"icon s18 {{node.icon}}\" ng-if=\"node.icon\"></i> <span class=\"title\" translate=\"{{node.translate}}\" flex>{{node.title}}</span> <span class=\"badge white-fg\" style=\"background: {{node.badge.color}}\" ng-if=\"node.badge\">{{node.badge.content}}</span> <i class=\"icon-chevron-right s18 arrow\" ng-if=\"vm.hasChildren\"></i> </a> </div> <ul ng-if=\"vm.hasChildren\"> <li ng-repeat=\"node in node.children\" ms-navigation-horizontal-node=\"node\" ng-class=\"{\'has-children\': vm.hasChildren}\" ng-include=\"\'navigation-horizontal-nested.html\'\"></li> </ul></script>");
$templateCache.put("app/core/directives/ms-navigation/templates/vertical.html","<ul><li ng-repeat=\"node in vm.navigation\" ms-navigation-node=\"node\" ng-class=\"{\'collapsed\': vm.collapsed, \'has-children\': vm.hasChildren}\" ng-include=\"\'navigation-nested.html\'\"></li></ul><script type=\"text/ng-template\" id=\"navigation-nested.html\"><div ms-navigation-item layout=\"row\"> <div class=\"ms-navigation-button\" ng-if=\"!node.uisref && node.title\"> <i class=\"icon s16 {{node.icon}}\" ng-if=\"node.icon\"></i> <span class=\"title\" translate=\"{{node.translate}}\" flex>{{node.title}}</span> <span class=\"badge white-fg\" ng-style=\"{\'background\': node.badge.color}\" ng-if=\"node.badge\">{{node.badge.content}}</span> <i class=\"icon-chevron-right s16 arrow\" ng-if=\"vm.collapsable && vm.hasChildren\"></i> </div> <a class=\"ms-navigation-button\" ui-sref=\"{{node.uisref}}\" ui-sref-active=\"active md-accent-bg\" ng-if=\"node.uisref && node.title\"> <i class=\"icon s16 {{node.icon}}\" ng-if=\"node.icon\"></i> <span class=\"title\" translate=\"{{node.translate}}\" flex>{{node.title}}</span> <span class=\"badge white-fg\" ng-style=\"{\'background\': node.badge.color}\" ng-if=\"node.badge\">{{node.badge.content}}</span> <i class=\"icon-chevron-right s16 arrow\" ng-if=\"vm.collapsable && vm.hasChildren\"></i> </a> </div> <ul ng-if=\"vm.hasChildren\"> <li ng-repeat=\"node in node.children\" ms-navigation-node=\"node\" ng-class=\"{\'collapsed\': vm.collapsed, \'has-children\': vm.hasChildren}\" ng-include=\"\'navigation-nested.html\'\"></li> </ul></script>");
$templateCache.put("app/core/directives/ms-card/templates/template-1/template-1.html","<div class=\"template-1\"><div class=\"media\"><img class=\"image\" ng-src=\"{{card.media.image.src}}\" alt=\"{{card.media.image.alt}}\" ng-show=\"card.media.image\"></div><div class=\"content pv-24 ph-16\"><div class=\"title h1\" ng-if=\"card.title\">{{card.title}}</div><div class=\"subtitle secondary-text\" ng-if=\"card.subtitle\">{{card.subtitle}}</div><div class=\"text pt-16\" ng-if=\"card.text\">{{card.text}}</div></div></div>");
$templateCache.put("app/core/directives/ms-card/templates/template-10/template-10.html","<div class=\"template-10 p-16\"><div class=\"pb-16\" layout=\"row\" layout-align=\"space-between center\"><div class=\"info\"><div class=\"title secondary-text\" ng-if=\"card.title\">{{card.title}}</div><div class=\"subtitle h2\" ng-if=\"card.subtitle\">{{card.subtitle}}</div></div><div class=\"media ml-16\"><img class=\"image\" ng-src=\"{{card.media.image.src}}\" alt=\"{{card.media.image.alt}}\" ng-show=\"card.media.image\"></div></div><div class=\"text\">{{card.text}}</div></div>");
$templateCache.put("app/core/directives/ms-card/templates/template-3/template-3.html","<div class=\"template-3 p-16 teal-bg white-fg\" layout=\"row\" layout-align=\"space-between\"><div layout=\"column\" layout-align=\"space-between\"><div class=\"info\"><div class=\"title h1\" ng-if=\"card.title\">{{card.title}}</div><div class=\"subtitle h3 secondary-text\" ng-if=\"card.subtitle\">{{card.subtitle}}</div></div><div class=\"cta\"><md-button class=\"m-0\">{{card.cta}}</md-button></div></div><div class=\"media pl-16\"><img class=\"image\" ng-src=\"{{card.media.image.src}}\" alt=\"{{card.media.image.alt}}\" ng-show=\"card.media.image\"></div></div>");
$templateCache.put("app/core/directives/ms-card/templates/template-2/template-2.html","<div class=\"template-2\"><div class=\"header p-16\" layout=\"row\" layout-align=\"start center\"><div ng-if=\"card.avatar\"><img class=\"avatar mr-16\" ng-src=\"{{card.avatar.src}}\" alt=\"{{card.avatar.alt}}\"></div><div class=\"info\"><div class=\"title\" ng-if=\"card.title\">{{card.title}}</div><div class=\"subtitle secondary-text\" ng-if=\"card.subtitle\">{{card.subtitle}}</div></div></div><div class=\"media\"><img class=\"image\" ng-src=\"{{card.media.image.src}}\" alt=\"{{card.media.image.alt}}\" ng-show=\"card.media.image\"></div><div class=\"text p-16\" ng-if=\"card.text\">{{card.text}}</div></div>");
$templateCache.put("app/core/directives/ms-card/templates/template-4/template-4.html","<div class=\"template-4\"><div class=\"info white-fg ph-16 pv-24\"><div class=\"title h1\" ng-if=\"card.title\">{{card.title}}</div><div class=\"text\" ng-if=\"card.text\">{{card.text}}</div></div><div class=\"media\"><img class=\"image\" ng-src=\"{{card.media.image.src}}\" alt=\"{{card.media.image.alt}}\" ng-show=\"card.media.image\"></div></div>");
$templateCache.put("app/core/directives/ms-card/templates/template-5/template-5.html","<div class=\"template-5 p-16\" layout=\"row\" layout-align=\"space-between start\"><div class=\"info\"><div class=\"title secondary-text\" ng-if=\"card.title\">{{card.title}}</div><div class=\"event h2\" ng-if=\"card.event\">{{card.event}}</div></div><div class=\"media ml-16\"><img class=\"image\" ng-src=\"{{card.media.image.src}}\" alt=\"{{card.media.image.alt}}\" ng-show=\"card.media.image\"></div></div>");
$templateCache.put("app/core/directives/ms-card/templates/template-6/template-6.html","<div class=\"template-6\"><div class=\"content pv-24 ph-16\"><div class=\"subtitle secondary-text\" ng-if=\"card.subtitle\">{{card.subtitle}}</div><div class=\"title h2\" ng-if=\"card.title\">{{card.title}}</div><div class=\"text pt-8\" ng-if=\"card.text\">{{card.text}}</div></div></div>");
$templateCache.put("app/core/directives/ms-card/templates/template-7/template-7.html","<div class=\"template-7\" layout=\"row\" layout-align=\"space-between\"><div class=\"info\" layout=\"column\" layout-align=\"space-between\" layout-fill=\"\" flex=\"\"><div class=\"p-16\"><div class=\"title h1\" ng-if=\"card.title\">{{card.title}}</div><div class=\"subtitle h4 secondary-text\" ng-if=\"card.subtitle\">{{card.subtitle}}</div><div class=\"text h4 pt-8\" ng-if=\"card.text\">{{card.text}}</div></div><div><md-divider></md-divider><div class=\"p-8\" layout=\"row\"><md-icon md-font-icon=\"icon-star-outline\" class=\"mh-5\"></md-icon><md-icon md-font-icon=\"icon-star-outline\" class=\"mh-5\"></md-icon><md-icon md-font-icon=\"icon-star-outline\" class=\"mh-5\"></md-icon><md-icon md-font-icon=\"icon-star-outline\" class=\"mh-5\"></md-icon><md-icon md-font-icon=\"icon-star-outline\" class=\"mh-5\"></md-icon></div></div></div><div class=\"media\"><img class=\"image\" ng-src=\"{{card.media.image.src}}\" alt=\"{{card.media.image.alt}}\" ng-show=\"card.media.image\"></div></div>");
$templateCache.put("app/core/directives/ms-card/templates/template-8/template-8.html","<div class=\"template-8\"><div class=\"media\"><img class=\"image\" ng-src=\"{{card.media.image.src}}\" alt=\"{{card.media.image.alt}}\" ng-show=\"card.media.image\"></div><div class=\"content pv-24 ph-16\"><div class=\"title h1\" ng-if=\"card.title\">{{card.title}}</div><div class=\"subtitle secondary-text\" ng-if=\"card.subtitle\">{{card.subtitle}}</div><div class=\"buttons pt-16\"><md-button class=\"m-0\">{{card.button1}}</md-button><md-button class=\"m-0 md-accent\">{{card.button2}}</md-button></div><div class=\"text pt-16\" ng-if=\"card.text\">{{card.text}}</div></div></div>");
$templateCache.put("app/core/directives/ms-card/templates/template-9/template-9.html","<div class=\"template-9\"><div class=\"header p-16\" layout=\"row\" layout-align=\"start center\"><div ng-if=\"card.avatar\"><img class=\"avatar mr-16\" ng-src=\"{{card.avatar.src}}\" alt=\"{{card.avatar.alt}}\"></div><div class=\"info\"><div class=\"title\" ng-if=\"card.title\">{{card.title}}</div><div class=\"subtitle secondary-text\" ng-if=\"card.subtitle\">{{card.subtitle}}</div></div></div><div class=\"text ph-16 pb-16\" ng-if=\"card.text\">{{card.text}}</div><div class=\"media\"><img class=\"image\" ng-src=\"{{card.media.image.src}}\" alt=\"{{card.media.image.alt}}\" ng-show=\"card.media.image\"></div><div class=\"buttons m-8\"><md-button class=\"md-icon-button mr-16\" aria-label=\"Favorite\"><md-icon md-font-icon=\"icon-heart-outline\" class=\"s24\"></md-icon></md-button><md-button class=\"md-icon-button\" aria-label=\"Share\"><md-icon md-font-icon=\"icon-share\" class=\"s24\"></md-icon></md-button></div></div>");}]);