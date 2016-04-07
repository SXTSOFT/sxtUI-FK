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
        title :'金茂质量平台',
        url   :'/',
        views :{
          'content@app':{
            templateUrl : 'app/main/szgc/home/home.html',
            controller:'SzgcHomeController as vm'
          }
        }
      })
      .state('app.szgc.area',{
        noBack:true,
        title :'划区',
        url   :'/edit/{pid}/{pname}',
        views :{
          'content@app':{
            templateUrl : 'app/main/szgc/home/area.html',
            controller:'SzgcAreaController as vm'
          }
        }
      })
      .state('app.szgc.xc',{
        noBack:true,
        title :'验收',
        url   :'/xc/{pid}/{pname}',
        views :{
          'content@app':{
            templateUrl : 'app/main/szgc/home/xc.html',
            controller:'SzgcXCController as vm'
          }
        }
      })
      .state('app.szgc.view',{
        noBack:true,
        title :'验收',
        url   :'/zg/view/{pid}',
        views :{
          'content@app':{
            templateUrl : 'app/main/szgc/home/view.html',
            controller:'SzgcXCController as vm'
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
                  api.szgc.vanke.buildingsInfo($stateParams.projectType, $stateParams.itemId).then(function (data) {
                    api.szgc.ProjectExService.building($stateParams.pid + '>' + $stateParams.itemId).then(function (data2) {
                      var mx = 0;
                      data.forEach(function (item) {
                        if (mx < item.floors)
                          mx = item.floors;
                        var fd = data2.data.Rows.find(function (it) { return it.RegionId == item.building_id; }) || {};
                        item.gx1 = fd.gx1||0;
                        item.gx2 = fd.gx2 || 0;
                        item.summary = fd.AreaRemark || '';
                      });
                      resolve({
                        floorNum:mx,
                        builds:data
                      });
                    });
                  })
                })
              }]
            }
          }
        }
      })
      .state('app.szgc.project.buildinglist.building',{
        //title :'形象进度',
        url   :'/building/{buildId}/{buildName}/{floors}/{floorNum}',
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
                      { x: '墙体', id: 'f95cd41c-f47d-4fdc-a0ff-c138450ea279' },
                      { x: '瓷砖', id: '702d964d-cd97-4217-8038-ce9b62d7584b' },
                      { x: '门窗', id: '51bb20e2-92a2-4c9f-85a9-c4545e710cf0' },
                      { x: '油漆', id: '00000000-0000-0000-0000-000000000000' },
                      { x: '橱柜', id: '1c419fcc-24a9-4e38-9132-ce8076051e6a' }
                    ]

                    result.data.Rows.forEach(function (r) {
                      var g = gx.find(function (g) { return g.id == r.ProcedureId; });
                      if (g) {
                        g.y = r.gx1;
                      }
                    });
                    pageload.datapoints = gx;
                    var char = angular.copy(pageload);
                    //char.datapoints.splice(0, 1);
                    return [char];
                  });
              }]
            }
          }
        }
      })
      .state('app.szgc.yhyd',{
        title :'一户一档',
        url   :'/home/yhyd',
        views :{
          'content@app':{
            templateUrl : 'app/main/szgc/home/link.html',
            controller:'SzgcyhydController as vm'
          }
        }
      })
      .state('app.szgc.choose', {
        noBack:true,
        title    :'选择',
        url      : '/choose',
        views    : {
          'content@app': {
            templateUrl: 'app/main/szgc/report/choose.html',
            controller: 'SzgcChooseController as vm'
          }
        }
      })
      .state('app.szgc.tzg', {
        noBack:true,
        title    :'发送整改通知',
        url      : '/zg/send/{pid}/{summary}/{user}',
        views    : {
          'content@app': {
            templateUrl: 'app/main/szgc/report/send.html',
            controller: 'SzgcZgController as vm'
          }
        }
      })

      .state('app.szgc.zg', {
        title    :'整改',
        url      : '/zg',
        views    : {
          'content@app': {
            templateUrl: 'app/main/szgc/report/zgdetail.html',
            controller: 'SzgcZgController as vm'
          }
        }
      })
      .state('app.szgc.zgdetail', {
        title    :'整改详情',
        url      : '/zgdetail/{pid}/{summary}/{user}',
        views    : {
          'content@app': {
            templateUrl: 'app/main/szgc/report/zgdetail1.html',
            controller: 'SzgcZgController as vm'
          }
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
                return api.szgc.vanke.profile();
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
        url: '/new/{projectid}/{name}/{batchId}/{procedureId}/{type}/{idTree}/{procedureName}/{nameTree}/{flag}',
        controller: 'AddProcessController as vm',
        templateUrl: 'app/main/szgc/ys/addProcess-app.html'
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
      title    : '绘制部位',
      icon     : 'icon-pen',
      state    : 'app.szgc.area',
      weight   : 1
    });


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

    //msNavigationServiceProvider.saveItem('szgc.send', {
    //  title    : '查看整改',
    //  icon     : 'icon-account-switch',
    //  state    : 'app.szgc.report',
    //  weight   : 1
    //})
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

  MyProcessController.$inject = ["$scope", "api", "utils", "$state"];
  angular
    .module('app.szgc')
    .controller('MyProcessController',MyProcessController);

  /** @ngInject */
  function MyProcessController($scope, api, utils, $state){

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




    $scope.isPartner = api.szgc.vanke.isPartner();
    $scope.project = {
      isMore: true,
      states: [{
        id: -1,
        color: '',
        title: '全部'
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
        $scope.project.filter();
      },
      //filterBatch: function (sources) {
      //    console.log('sources', sources);
      //},
      filter: function(reload) {
        if (!$scope.project.procedureId || !$scope.project.data || !$scope.project.data.items) return;
        if (reload === true || ($scope.project.data && !$scope.project.data.fd)) {
          $scope.project.data.fd = true;
          api.szgc.CheckStepService.getAll($scope.project.procedureId, {
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

              result.data.Rows.forEach(function(it) {
                var qd = item;
                if (it.RegionId == qd.$id) {
                  if (!qd.BatchNo)
                    qd.BatchNo = it.BatchNo;
                  else if (qd.BatchNo != it.BatchNo) {
                    qd = results.find(function(k) {
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
                  if (!it.CheckNo) {

                  } else if (it.CheckNo == 1) {
                    qd.state = it.AllResult ? 2 : 1;
                  } else {
                    qd.state = it.AllResult ? 4 : 3;
                  }


                  if (it.CheckNo)
                    qd.checkedCount++;
                  if (it.RoleId == 'jl') {
                    qd.BatchRelationId = it.BatchRelationId;
                    qd.Remark = it.Remark;
                    qd.MinPassRatio = it.MinPassRatio;
                    qd.CheckDate = it.CheckDate;
                    qd.CheckWorkerName = it.CheckWorkerName;
                  } else if (it.CheckWorkerName) {
                    qd.MinPassRatio1 = it.MinPassRatio;
                    qd.CheckDate1 = it.CheckDate;
                    qd.CheckWorkerName1 = it.CheckWorkerName;
                  }
                }
              });

              //item.


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
          $scope.project.data.results.forEach(function(item) {
            if ($scope.project.states.find(function(it) {
                if (it.id == item.state || it.id == -1) {
                  it.c++;
                  item.color = it.color;
                  item.stateName = it.title;
                }
                return it.selected && it.id == item.state
              })) {
              rows.push(item);
            }
          });
          $scope.project.rows = rows;
        }
      }
    };
    $scope.checkState = function(state) {
      if (state.id == -1) {
        $scope.project.states.forEach(function(item) {
          item.selected = true;
        });
        state.selected = false;
      } else {
        state.selected = !state.selected;
      }
      $scope.project.filter();
    };
    api.szgc.ProcedureTypeService.getAll({startrowIndex:0,maximumRows:100,Status:5}).then(function(result) {
      $scope.project.procedureTypes = result.data.Rows;
    });
    var pt, ptype;
    var queryProcedures = function() {
      var t = 1;
      if ($scope.project.type) {
        switch ($scope.project.type) {
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
      if (pt == t && $scope.project.procedureTypeId == ptype) return;
      pt = t;
      ptype = $scope.project.procedureTypeId;
      api.szgc.BatchSetService.getAll({status:4,batchType: t}).then(function(result) {
        var data = [];
        result.data.Rows.forEach(function(item) {
          //if ($scope.project.procedureTypeName != item.ProcedureType)
          //$scope.project.ProcedureType = item.ProcedureType;
          if (!$scope.project.procedureTypeId || $scope.project.procedureTypeId == item.ProcedureTypeId) {
            data.push(item);
          }
        });
        $scope.project.procedures = data;
      });
    }

    //$scope.$watch('project.type', queryProcedures);
    //$scope.$watch('project.procedureTypeId', queryProcedures);
    $scope.$watch('project.procedureId', function(a,b) {
      if(a != b){
        if ( !$scope.project.pid) {
          utils.alert("项目不能为空！");
          return;
        }else{
          $scope.project.filter(true);
        }
      }

    });
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

        $scope.data.supervision = results[1].data.Rows;
        if (isB && $scope.data.supervision.length && !batch.CompanyId)
          batch.CompanyId = $scope.data.supervision[0].UnitId;
        if (isB) {
          $scope.data.curHistory.GrpId = batch.GrpId;
          $scope.data.groups = [{
            id: batch.GrpId,
            name: batch.GrpName
          }];

        }

        console.log('$scope.data.curHistory', $scope.data.curHistory);

        $scope.data.supervision1 = results[2].data.Rows;

        console.log('----results---',results);
        console.log('---- 监理1$scope.data.supervision1---',$scope.data.supervision1);

        if (isB && $scope.data.supervision1.length && !batch.ParentCompanyId) {
          batch.ParentCompanyId = $scope.data.supervision1[0].UnitId;
        }
        if (api.szgc.vanke.isPartner(1) && !flag) {
          batch.Count = (batch.JLCount || 0) + 1;
          var fd = results[3].data.Rows.find(function(it) {
            return it.UnitId = api.szgc.vanke.getPartner()
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
        utils.alert('请上传原验收表扫描件');
        return;
      }
      utils.confirm(null, '确认向验收批：' + $scope.data.curHistory.BatchNo + ' 添加新记录吗?',
        function() {
          $scope._save(addForm);
        })
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

      //console.log('CheckData', targets)
      api.szgc.addProcessService.postCheckData({
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

  SzgcSettingsController.$inject = ["profile"];
  angular
    .module('app.szgc')
    .controller('SzgcSettingsController',SzgcSettingsController);

  /** @ngInject */
  function SzgcSettingsController(profile){

    var vm = this;
    vm.profile = profile.data.data;
    console.log('profile',profile);
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
 * Created by guowei on 2016/2/2.
 */
(function(){
  'use strict';
  viewBathDetailController.$inject = ["$scope", "api", "$stateParams", "utils", "$q", "$state"];
  angular
    .module('app.szgc')
    .controller('viewBathDetailController',viewBathDetailController);
  function viewBathDetailController($scope,api,$stateParams,utils,$q,$state) {

    var vm = this;
    vm.back = function(){
      $state.go('app.szgc.report.viewBath')
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
      var r = ((1 - utils.math.div((jl - vk), jl)) * 100).toString();
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
      // console.log('123',$scope.jlTitol)
      ///api/BatchSet/{batchId}/PPCheckData
      api.szgc.addProcessService.getAll($stateParams.bathid, {
        status: 4
      }).then(function(result) {

        var group = [],
          gk = {},
          eg;
        result.data.Rows.forEach(function(item) {
          var g = gk[item.CheckStepId];
          if (!g) {
            g = gk[item.CheckStepId] = [];
            if (item.RoleId != 'jl') eg = g;
            else if (!$scope.data.jl) {
              $scope.data.jl = item.CheckWorker;
              $scope.data.jldate = item.CreatedTime;
            }
            group.push(g);
          }
          g.push(item);
        });

        var jl = [];
        $scope.data.vk = eg && eg[0].CheckWorker;
        $scope.data.vkdate = eg && eg[0].CreatedTime;
        group.forEach(function(item) {
          if (item[0].RoleId == 'jl') {
            var i = 0;
            item.forEach(function(it) {
              if (it.TargetTypeId != '018C0866-1EFA-457B-9737-7DCEFEA148F6') {
                it.VKPassRatio = eg && eg[0].PassRatio;
                it.FHL = eg && fhl(it.PassRatio, it.VKPassRatio);
              };
              i++;
            });
            jl.push({
              ix: jl.length + 1,
              text: '第' + (jl.length + 1) + '次',
              d: bingTargets(item)
            });
          }
        });
        jl.forEach(function(item) {
          item.step = cbr.data.Rows.find(function(it) {
            return it.RoleId == 'jl' && it.CheckNo == item.ix;
          });
          item.eg = eg ? cbr.data.Rows.find(function(it) {
            return it.RoleId != 'jl' && it.CheckNo == eg[0].HistoryNo;
          }) : null;
          item.text += '/共' + jl.length + '次'
        });

        $scope.data.sources = jl;
        $scope.data.selected = jl[jl.length - 1]; //取最后一次的验收数据

        $scope.data.selected.d.yb.forEach(function (item) {
          if (item.CheckNum == 0 && item.MaxDeviation == 0 && item.PassRatio == 0) {
            item.CheckNum = undefined;
            item.MaxDeviation = undefined;
            item.PassRatio = undefined;
          }
        });
        // console.log('$scope.data.selected', $scope.data.selected.d.yb)
        //$scope.targets = bingTargets(group[0]);
      });
    });



  }
})();

/**
 * Created by zhangzhaoyong on 16/1/28.
 */
(function(){
  'use strict';

  viewBathController.$inject = ["$scope", "api", "$q", "$timeout", "$state"];
  angular
    .module('app.szgc')
    .controller('viewBathController',viewBathController);

  /** @ngInject */
  function viewBathController($scope,api,$q,$timeout,$state){
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
         // queryTable();
        }
      }
    };
    var pt, ptype;
    console.log('api',api)
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
        console.log("BatchSetServiceresult", result);
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
      if(t1)
        $timeout.cancel(t1);
      t1 = $timeout(function(){


      vm.baths = {};
      console.log(vm.project)
      if (vm.project.pid) {
        var batchParems = {
          isGetChilde: 1,
          produreId: vm.project.procedureId,
          workGropId: vm.project.workGroupId,
          companyId: vm.project.companyId,
          regionIdTree: vm.project.idTree
        }

        api.szgc.addProcessService.queryByProjectAndProdure2(vm.project.projectId, batchParems).then(function(result) {
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
          console.log(" vm.baths ", result.data);
          //截取班组组长名称
          var fishIndex = 0;
          var lastIndex = 0;
          vm.baths.Rows.forEach(function(item) {
            fishIndex = 0;
            if (item.GrpName) {

              fishIndex = item.GrpName.indexOf("(");
              lastIndex = item.GrpName.indexOf(")");
              if (fishIndex > 0 && lastIndex > 0) {
                item.GrpWokerName = item.GrpName.substring(fishIndex + 1, lastIndex);
              } else {
                item.GrpWokerName = "";
              }
            }

          });
          $timeout(function() {
            vm.reverse = false;
            //vm.toggleSort('JLDate');
          }, 1000);

        });

      }
      else if (vm.project.data) {
        var df = [],
          batchParems = {
            isGetChilde: 1,
            produreId: vm.project.procedureId,
            workGropId: vm.project.workGroupId,
            companyId: vm.project.companyId,
            regionIdTree: vm.project.idTree
          }

        vm.project.data.items.forEach(function(p) {
          batchParems.regionIdTree = p.$id;
          df.push(api.szgc.addProcessService.queryByProjectAndProdure2(p.$id, batchParems));
        })
        $q.all(df).then(function(rs) {
          var bs = [];
          rs.forEach(function(r) {
            r.data.Rows.forEach(function(item) {
              if (item.AccordRatio > 0) {
                item.AccordRatio = item.AccordRatio * 100;
              } else {
                item.AccordRatio = undefined;
              }
              bs.push(item);
            });
          });
          vm.baths = {
            Rows: bs
          };

          //截取班组组长名称
          var fishIndex = 0;
          var lastIndex = 0;
          vm.baths.Rows.forEach(function(item) {
            // console.log("vm.GrpName", item.GrpName)
            if (item.GrpName) {
              fishIndex = 0;
              fishIndex = item.GrpName.indexOf("(");
              lastIndex = item.GrpName.indexOf(")");
              if (fishIndex > 0 && lastIndex > 0) {
                item.GrpWokerName = item.GrpName.substring(fishIndex + 1, lastIndex);
              } else {
                item.GrpWokerName = "";
              }
            }
          });
          $timeout(function() {
            vm.reverse = false;
            //vm.toggleSort('JLDate');
          }, 1000);
        })
      }
      },500);
    }
    //区域改变
    $scope.$watch(function(){
      return vm.searBarHide;
      //return  vm.project.pid;
    }, function() {
      console.log('sh',vm.searBarHide)
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
 * Created by zhangzhaoyong on 16/1/27.
 */
(function ()
{
  'use strict';

  SzgcReportController.$inject = ["$scope", "$state"];
  angular
    .module('app.szgc')
    .controller('SzgcReportController', SzgcReportController);

  /** @ngInject */
  function SzgcReportController($scope,$state)
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
          $state.is('app.szgc.report.projectMasterList') ? '项目班组总览表' :
            $state.is('app.szgc.report.batchCount') ? '项目填报情况统计表' :
              '报表详细'
      });
    }
    console.log('scope',vm)
    $scope.$watch(function(){
      return $state.is('app.szgc.report');
    },function(){
      vm.data.selectedIndex = $state.is('app.szgc.report')?0:1;
    });

    vm.goToReport = function (name, path, $event) {
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
 * Created by emma on 2016/3/5.
 */
(function(){
  'use strict';

  SzgcZgController.$inject = ["$stateParams", "utils", "$http", "$scope", "$rootScope"];
  angular
  .module('app.szgc')
    .controller('SzgcZgController',SzgcZgController);

  /** @ngInject */
  function  SzgcZgController($stateParams,utils,$http,$scope,$rootScope){
    $rootScope.pid = $stateParams.pid;
    $scope.$watch('summary',function(){
      $rootScope.summary = $scope.summary;
    })
    if($stateParams.pid){
      $scope.p = $stateParams;
      $http.get('http://vkde.sxtsoft.com/api/Files?group='+$stateParams.pid).then(function(result){
        $scope.images = result.data.Files;
      })
    }
    else{
      $http.get ('http://vkde.sxtsoft.com/api/ProjectEx/'+utils.id).then (function (result) {
        var project = result.data;
        if (project.AreaRemark) {
          try {
            var d = JSON.parse(project.AreaRemark);
            var zg = [];
            d.features.forEach(function(f){
              if(f.geometry.type=='Point'){
                zg.push(f.options)
              }
            })
            zg.sort(function(a,b){
              return (b.date ||'').localeCompare(a.date||'');
            });
            $scope.zg = zg;
          }
          catch (ex) {

          }
        }
      });
    }
  }
})();

/**
 * Created by emma on 2016/3/5.
 */
(function(){
  'use strict';

  SzgcChooseController.$inject = ["msUtils", "$state"];
  angular
    .module('app.szgc')
    .controller('SzgcChooseController',SzgcChooseController);

  /** @ngInject */
  function  SzgcChooseController(msUtils,$state){
    var vm=this;
    vm.project1 = '亚奥';
    vm.project=['亚奥','公园里'];
    vm.fenqi1='金茂悦一期';
    vm.fenqi=['金茂悦一期','金茂悦二期'];
    vm.buildings1 = '14栋';
    vm.buildings=['14栋','15栋'];
    vm.floors1 = '15层';
    vm.floors=['15层','16层'];
    vm.rooms1 ='03';
    vm.rooms=['03','04'];
    vm.change = function(){
      msUtils.isMobile()?
        $state.go('app.szgc.xc',{pid:'1', pname: '2'}):
        $state.go('app.szgc.area',{pid:'1', pname: '2'});
    };

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
 * Created by zhangzhaoyong on 16/2/3.
 */
(function(){
  'use strict';

  SzgcyhydController.$inject = ["$scope", "api", "$stateParams", "$rootScope", "$cookies", "$timeout"];
  angular
    .module('app.szgc')
    .controller('SzgcyhydController', SzgcyhydController);

  /** @ngInject */
  function SzgcyhydController($scope,api,$stateParams,$rootScope,$cookies,$timeout)
  {

    var vm = this;

    vm.back = function(){
      history.back();
    }
    vm.showImg = function () {
      $rootScope.$emit('sxtImageViewAll');
    }
    vm.data = {
      projectId: $stateParams.pid,
      projectName:$stateParams.pname
    };
    //vm.$parent.data.pname = vm.data.projectName;
    $rootScope.title = vm.data.projectName;

    vm.sellLine = 0.6;
    vm.setProject=function(){
      $cookies.put('projects', JSON.stringify([{
        project_id: vm.data.projectId,
        name: vm.data.projectName
      }]));
    }

    vm.project = {
      onQueryed: function(data) {
        if (!vm.project.pid) {
          vm.project.data = data;
          //queryTable();
        }
      }
    };

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
    }
    vm.sellLine = 0.6;
    vm.data= {
      config: {
        showXAxis: true,
        showYAxis: true,
        showLegend: true,
        debug: true,
        stack: true,
        yAxis: {
          type: 'value',
          min: 0,
          name:'楼层',
          interval: 10,
          max: vm.build.floors,
          axisLabel: {
            formatter: function (value, index) {
              return parseInt(value);//非真正解决
            }
          }
        }
      },
      data:details
    };



  }

})();

/**
 * Created by jiuyuong on 2016/3/4.
 */
(function ()
{
  'use strict';

  SzgcXCController.$inject = ["$scope", "$stateParams"];
  angular
    .module('app.szgc')
    .controller('SzgcXCController', SzgcXCController);

  /** @ngInject */
  function SzgcXCController($scope,$stateParams)
  {
    $scope.pid = $stateParams.pid;
  }
})();

(function ()
{
  'use strict';

  SzgcHomeController.$inject = ["$scope", "auth", "$state", "$rootScope"];
  angular
    .module('app.szgc')
    .controller('SzgcHomeController', SzgcHomeController);

  /** @ngInject */
  function SzgcHomeController($scope,auth,$state,$rootScope)
  {

    var vm = this;
    vm.data = {};
    vm.is = function (state) {
      return vm.includes(state);
    }
    vm.markerClick = markerClick;

    function markerClick($current){
      $state.go('app.szgc.choose');
      //msUtils.isMobile()?
      //  $state.go('app.szgc.xc',{pid:$current.projectId, pname: $current.title}):
      //  $state.go('app.szgc.area',{pid:$current.projectId, pname: $current.title});
     // $scope.$parent.vm.params =1;
    }
  }
})();

/**
 * Created by jiuyuong on 2016/3/4.
 */
(function ()
{
  'use strict';

  angular
    .module('app.szgc')
    .controller('SzgcAreaController', SzgcAreaController);

  /** @ngInject */
  function SzgcAreaController()
  {

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
      return 'http://vkde.sxtsoft.com' + (value && value.substring(0, 1) == '~' ? value.substring(1) : value);
    }
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
        if ($mdMedia('sm'))
          scope.inst = true;
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

  angular
    .module('app.szgc')
    .directive('sxtSelectJd', sxtSelectJdDirective);

  /** @ngInject */
  function sxtSelectJdDirective()
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
      letters.push({ $id: '', selected: true, $name: '所有' })
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
              c = scope.selectors[++i];
            }
            scope.idTree = idTree.join('>');
            scope.nameTree = nameTree.join('>');
          }

          scope.onChange && scope.onChange(scope);
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
          var q = scope.onQuery(index, newSt, scope.selectors.length > 1 ? scope.selectors[index - 1].selected.$id : null);
          if (q) {
            q.then(function (result) {
              var next = result;
              scope.selectors[index] = next;
            });
          }
        };
        scope.item_selected = function (item, index, noSync) {
          var cnt = scope.selectors[index];
          cnt.selected = item;
          var next = scope.selectors[index + 1];
          if (noSync !== false)
            syncValue();
          var q = scope.onQuery(index + 1, newSt, item.$id);
          if (q) {
            q.then(function (result) {
              var next = result;
              scope.selectors[index + 1] = next;
              if (result.selected){
                scope.item_selected(result.selected, scope.selectors.length - 1, false);
              }
              else if (noSync === false){
                syncValue();
              }

            });
          }
        }
        scope.onQuery(0, newSt, scope.value).then(function (result) {
          scope.selectors.push(result);
          if (result.selected)
            scope.item_selected(result.selected, scope.selectors.length - 1, false);
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
            scope.nameValue = scope.data.selected ? scope.data.selected[scope.textField] : null;
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

          resetValue();

        });
        scope.$watch('data.selected', function () {
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

  sxtProjectsJdDirective.$inject = ["$timeout", "api", "$q", "$cookies"];
  angular
    .module('app.szgc')
    .directive('sxtProjectsJd', sxtProjectsJdDirective);

  /** @ngInject */
  function sxtProjectsJdDirective($timeout, api,  $q,$cookies)
  {
    //var $cookies = {
    //  c:{},
    //  put:function(name,value){
    //    this.c[name] = value;
    //  },
    //  remove:function(name){
    //    delete this.c[name];
    //  },
    //  get:function(name){
    //    return this.c[name];
    //  }
    //};

    var cookieName = 'projects';
    //console.log('getcookie',$cookies.get('projects'));
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
        console.log('getcookie',cookie);
        scope.onQueryInner = function (index, st, value) {
          switch (index) {
            case 0:
              if (init && cookie && cookie[index]) {
                return $q(function (r) { r(new st(index, 'project_id', 'name', [cookie[index]], '项目', cookie[index])) });
              }
              else {
                init = false;
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
                return api.szgc.vanke.project_items({ page_number: 1, page_size: 10, project_id: value }).then(function (result) {
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
                return api.szgc.vanke.buildings({ page_number: 1, page_size: 10, project_item_id: value }).then(function (result) {
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
                return api.szgc.vanke.rooms({ page_number: 1, page_size: 1000, building_id: value.split('-')[0], floor: value.split('-')[1] }).then(function (result) {
                  //scope.onQueryed && scope.onQueryed(result.data);
                  var s = new st(index, 'room_id', 'name', result.data.data, '户');
                  scope.onQueryed && scope.onQueryed(s);
                  return s;
                });
              }
              break;
            default:
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
        regionType:'=',
        value:'=ngModel',
        nameValue:'='
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
      <md-list layout-padding>\
      <md-list-item ng-click="sett(p)" ng-repeat="p in c.ps">\
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
        if(!scope.regionType)return;
        var t = 1;

          switch (scope.regionType) {
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

        api.szgc.BatchSetService.getAll({status:4,batchType: t}).then(function(result) {
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
        //console.log('picUrl',scope.picUrl)
        //var crs = ;

        var map = L.map(element[0],{
          crs:L.extend({}, L.CRS, {
            projection    :L.Projection.LonLat,
            transformation:new L.Transformation(1, 0, 1, 0),
            scale         :function(e) {
              return 512 * Math.pow(2, e);
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
          layer = L.tileLayer(appConfig.apiUrl + '/api/picMap/load/{z}_{x}_{y}.png?path=' + fs.data.Files[0].Url.replace('/s_', '/'), {
            noWrap:true,
            continuousWorld:false,
            tileSize:512
          });

        layer.addTo(map);

      },1000)
    }
  }
})();

/**
 * Created by jiuyuong on 2016/3/4.
 */
(function(){
  'use strict';

  sxtPhoto.$inject = ["$timeout", "$http", "$cordovaCamera", "utils"];
  angular
    .module('app.szgc')
    .directive('sxtPhoto',sxtPhoto);

  /** @ngInject */
  function sxtPhoto($timeout,$http,$cordovaCamera,utils) {
    return {
      scope: {
        gid:'=sxtPhoto'
      },
      link: link
    }

    function link(scope, element, attr, ctrl) {
      var options = {
        quality: 100,
        destinationType: 0,
        allowEdit: true,
        saveToPhotoAlbum: false,
        correctOrientation:true
      };

      var getP = function() {
        $cordovaCamera.getPicture (options).then (function (imageData) {
          imageData = 'data:image/jpg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAA8AAD/4QMZaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjJFRkI5MjkxRTFEMzExRTVBN0E3OTRGM0VEMzc1OUJCIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjJFRkI5MjkwRTFEMzExRTVBN0E3OTRGM0VEMzc1OUJCIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgV2luZG93cyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJGMUE1NjhDMjlERDdBMTQyNzA5RUYzNUM2RjJCRTdCOCIgc3RSZWY6ZG9jdW1lbnRJRD0iRjFBNTY4QzI5REQ3QTE0MjcwOUVGMzVDNkYyQkU3QjgiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAOQWRvYmUAZMAAAAAB/9sAhAAGBAQEBQQGBQUGCQYFBgkLCAYGCAsMCgoLCgoMEAwMDAwMDBAM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'
          if(imageData) {
            var image = document.createElement ('img');
            image.src = "data:image/jpeg;base64," + imageData;
            element.append (image);
            $http.post('http://vkde.sxtsoft.com/api/Files/'+scope.gid+'/base64',{Url:imageData}).then(function(){
              utils.alert('上传成功');
            })
          }
        }, function (err) {

        });
      }
      getP();
      element.on('click',function(){
        getP();
      })
      //element.append('<video id="video" width="100%" height="100%"></video>');
      //var video = document.getElementById("video"),
      //  videoObj = { "video": true },
      //  errBack = function(error) {
      //    console.log("Video capture error: ", error.code);
      //  };

      // 设置video监听器
      //if(navigator.getUserMedia) { // Standard
      //  navigator.getUserMedia(videoObj, function(stream) {
      //    video.src = stream;
      //    video.play();
      //  }, errBack);
      //} else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
      //  navigator.webkitGetUserMedia(videoObj, function(stream){
      //    video.src = window.webkitURL.createObjectURL(stream);
      //    video.play();
      //  }, errBack);
      //}
      scope.$on('$destroy',function(){
        //element.remove();
      })
    }
  }
})();

/**
 * Created by zhangzhaoyong on 16/2/16.
 */
(function(){
  'use strict';

  sxtMapsDirective.$inject = ["$timeout", "api"];
  angular
    .module('app.szgc')
    .directive('sxtMaps',sxtMapsDirective);

  /** @ngInject */
  function sxtMapsDirective($timeout,api){
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
            center: [39.904983,116.427287],
            zoom: 10,
            attributionControl: false
          }),
          layer = L.tileLayer('http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
            subdomains: "1234"
          });

        layer.addTo(map);
        var mks = [];
        api.szgc.ProjectExService.query(4).then(function (result) {
          scope.markers = [];

          result.data.Rows.forEach(function (row) {
            //console.log('makers2', row)
            if (row.Latitude && row.Longitude) {
              scope.markers.push({
                projectId: row.ProjectId,
                title: row.ProjectNo,
                lat: row.Latitude,
                lng: row.Longitude
              })
            }
          });

          angular.forEach(scope.markers, function (o, k) {
            mks.push(L
              .marker([o.lat, o.lng], L.extend({
                icon: L.icon({
                  iconUrl: 'libs/leaflet/images/M.png',
                  iconSize: [24, 24],
                  iconAnchor: [12, 12]
                })
              }, o))
              .on('click', markerClick)
              .addTo(map));
          })
        });
        map.on('zoomend', function (e) {
          var zoom = map.getZoom();
          if (zoom < 10) {
            mks.forEach(function (marker) {
              marker.setIcon(L.icon({
                iconUrl: 'libs/leaflet/images/S1.png',
                iconSize: [18, 18],
                iconAnchor: [9, 9]
              }));
            })
          }
          else if (zoom < 11) {
            mks.forEach(function (marker) {
              marker.setIcon(L.icon({
                iconUrl: 'libs/leaflet/images/S.png',
                iconSize: [24, 24],
                iconAnchor: [12, 12]
              }));
            })
          }
          else if(zoom>=11 && zoom <=12) {
            mks.forEach(function (marker) {
              marker.setIcon(L.icon({
                iconUrl: 'libs/leaflet/images/M.png',
                iconSize: [39, 39],
                iconAnchor: [20, 20]
              }));
            })
          }
          else {
            mks.forEach(function (marker) {
              marker.setIcon(L.icon({
                iconUrl: 'libs/leaflet/images/L.png',
                iconSize: [70, 70],
                iconAnchor: [35, 35]
              }));
            })
          }
        })
        scope.$on('destroy', function () {
          map.remove();
        })
      }, 500)

      function markerClick(e){
        //console.log('e.target.options',e.target.options)
        scope.markerClick( {$current : e.target.options,pid: e.target.options.projectId, pname: e.target.options.title});

      }

    }
  }


})();

/**
 * Created by zhangzhaoyong on 16/2/15.
 */
(function () {
  'use strict';

  sxtImagesDirective.$inject = ["$http"];
  angular
    .module('app.szgc')
    .directive('sxtImages', sxtImagesDirective);

  /** @ngInject */
  function sxtImagesDirective($http){
    return {
      restrict: 'A',
      require: "?ngModel",
      scope: {
        gid: '=sxtImages'
      },
      controller: ["$scope", function ($scope) {


        $scope.remove = function ($event, file) {
          $scope.imgOK = false;
          $event.preventDefault();
          file.remove();
        }
      }],
      template: '<div  style="color: red;padding-bottom: 0px;padding-left: 10px;padding-top: 0px;" ng-show="imgOK">上传成功!</div><div  style="color: red;" ng-show="imgFail">上传失败!</div> <div class="imageEdit"><div class="edititem" ng-repeat="item in uploader.queue" uib-tooltip="{{item.file.Remark}}"><div ng-if="!item.isSuccess" class="proc" >{{item.progress}}%</div><img style="height:150px;;margin:0 5px;" ng-click="editPic(item.file)" ng-src="{{item.file.Url|fileurl}}" class="img-thumbnail" /><div class="action"><a class="btn btn-white btn-xs" ng-if="edit" ng-click="remove($event,item)"><i class="fa fa-times"></i></a></div></div>\
<div  style="float:left;padding:5px;" ng-if="edit"><div class="file-drop-zone" style="height:140px;margin:0 5px;line-height:140px; padding:5px;" >\
            \
        </div>\
</div></div>',
      link: function (scope, element, attrs, ngModel) {
        var gid;
        scope.$watch('gid', function () {
          if (gid && gid == scope.gid) return;

          scope.inputChange = function(){
            scope.imgOK = false;
            scope.imgFail = false;
          }


        });
      }
    }
  }

})();

/**
 * Created by zhangzhaoyong on 16/2/16.
 */
(function(){
  'use strict';

  sxtImageViewDirective.$inject = ["$rootScope", "$http", "$q"];
  angular
    .module('app.szgc')
    .directive('sxtImageView',sxtImageViewDirective);

  /** @ngInject */
  function sxtImageViewDirective($rootScope, $http, $q) {
    return {
      restrict: 'EA',
      link: link,
      scope:{
        isContainer:'@'
      }
    }

    function link(scope, element, attr, ctrl) {
      var preview, o,def,player;
      player = function (a, e) {
        if(def)return;
        def=true;
        if (preview)
          preview.destroy();
        if (o)
          o.remove();
        $q(function(resolve) {
          if(!e)
            resolve(null);
          else{
            var request = [];
            e.groups.forEach(function (g) {
              request.push($http.get('http://vkde.sxtsoft.com/api/Files?group='+g));
            });
            $q.all(request).then(function(results){
              resolve(results);
            });
          }
        }).then(function (results) {
          def = false;
          var defaultIndex = 0;
          var imagedata = null;
          if(results) {
            imagedata = [];
            results.forEach (function (result) {
              result.data.Files.forEach (function (f) {
                imagedata.push ({date: f.CreateDate, url: 'http://vkde.sxtsoft.com' + f.Url.substring (1)});
              })
            })
          };
          if (!imagedata) {
            imagedata = [];
            $('img', element).each(function (index, el) {
              imagedata.push({url:$(el)[0].src});
            })
            defaultIndex = $('img', element).index($(a.target))
            if (defaultIndex == -1)
              defaultIndex = 0;
          }
          //console.log('img',img)
          var str = [];
          str.push('<div class="piclayer">\
        <div class="swiper-container"><div class="swiper-wrapper">')
          angular.forEach(imagedata, function (data) {
            var arl = data.url;
            str.push('<div class="swiper-slide"><p><img src="' + arl + '"></p><div style="position:absolute;top:20px;left:20px; font-size:20px; color:white;text-shadow:2px 2px 3px #ff0000">' + (data.date?'日期：'+data.date:'') + '</div></div>');
          });
          str.push('</div><div class="swiper-pagination"></div></div></div>');
          o = $(str.join('')).appendTo('body')
          //$('body').append(o);

          var iWidth = $(window).width();
          var iHeight = $(window).height();

          var iSh = iHeight;//-150;

          $('.swiper-container').width(iWidth + 'px');
          $('.swiper-container').height(iSh + 'px');
          $('.swiper-slide').height(iSh + 'px');
          $('.swiper-slide p').height(iSh + 'px');//.css('line-height',iSh+'px');

          preview = new Swiper(o.find('.swiper-container')[0], {
            initialSlide: defaultIndex,
            pagination: '.swiper-pagination',
            paginationClickable: true
          });//'.swiper-container'
          o.find('.pic_close button').click(function () {
            //preview.destroy();
            //o.remove();
          })

          //$('.picplayer').is(':visible')
          if ($(o).css('display')) {
            $(o.find('.swiper-container')[0]).click(function (e) {
              preview.destroy();
              $('.piclayer').remove();
              o.remove();
              e.preventDefault();
              preview = o = null;
            })
          }

        });
        scope.$on('$destroy', function () {
          o.remove();
          preview.destroy();
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
 * Created by jiuyuong on 2016/3/4.
 */

/**
 * Created by zhangzhaoyong on 16/2/16.
 */
(function(){
  'use strict';

  sxtAreaXc.$inject = ["$timeout", "$http", "$state"];
  angular
    .module('app.szgc')
    .directive('sxtAreaXc',sxtAreaXc);

  /** @ngInject */
  function sxtAreaXc($timeout,$http,$state){
    return {
      scope:{

      },
      link:link
    }

    function  link(scope,element,attr,ctrl){
      $timeout(function(){
        var map = L.map('map',{
            crs: L.extend({}, L.CRS, {
              projection: L.Projection.LonLat,
              transformation: new L.Transformation(1, 0, 1, 0),
              scale: function (e) {
                return 512 * Math.pow(2, e);
              }
            }),
            center: [.48531902026005, .5],
            zoom: 0,
            minZoom: 0,
            maxZoom: 3,
            scrollWheelZoom: true,
            annotationBar: false,
            attributionControl: false
          }
        );
        L.tileLayer(
          'http://vkde.sxtsoft.com/api/picMap/load/{z}_{x}_{y}.png?path=/upload/hx.jpg',
          //'http://vkde.sxtsoft.com/upload/hx_tile_{z}_{x}_{y}.png',
          {
            attribution: false
          }).addTo(map);
        var drawnItems = new L.FeatureGroup();
        map.addLayer(drawnItems);

        var apiLayer = L.GeoJSON.api({
          get: function (cb) {

          },
          post: function (data, cb) {
            console.log('data',data);
          },
          click: function (layer, cb) {
            if (layer.editing && layer.editing._enabled) return;
            {
              if (layer._icon) {
              }
              else {
              }
            }

          },
          onAdd:function(layer){

          }
        }).addTo(map);


        var photoMaker = L.Icon.extend({
          options: {
            shadowUrl: null,
            iconAnchor: [15, 15],
            iconSize: [30, 30],
            iconUrl: 'images/photo.png'
          }
        });
        var drawControl = new L.Control.Draw({
          draw: {
            polygon: {
              allowIntersection: false,
              drawError: {
                color: '#b00b00',
                timeout: 1000
              },
              shapeOptions: {
                color: '#ff0000'
              },
              showArea: false
            },
            rectangle: false,
            polyline: false,
            circle: false,
            marker: {
              icon: new photoMaker()
            }
          },
          edit: {
            edit: true,
            remove: true,
            featureGroup: apiLayer
          }
        });
        map.addControl(drawControl);
      },500)
    }
  }


})();


/**
 * Created by zhangzhaoyong on 16/2/16.
 */
(function(){
  'use strict';

  sxtAreaView.$inject = ["$timeout", "$http", "$state", "utils", "msUtils", "$mdDialog"];
  angular
    .module('app.szgc')
    .directive('sxtAreaView',sxtAreaView);

  /** @ngInject */
  function sxtAreaView($timeout,$http,$state,utils,msUtils,$mdDialog){
    return {
      scope:{
        pid:'@'
      },
      link:link
    }

    function  link(scope,element,attr,ctrl){

      $timeout(function() {
        $http.get ('http://vkde.sxtsoft.com/api/ProjectEx/'+utils.id).then (function (result) {
          var project = result.data || {ProjectId:utils.id};

          var map = L.map (element[0], {
              crs: L.extend ({}, L.CRS, {
                projection: L.Projection.LonLat,
                transformation: new L.Transformation (1, 0, 1, 0),
                scale: function (e) {
                  return 512 * Math.pow (2, e);
                }
              }),
             center: [.23531902026005, .18],
             zoom: 1,
              minZoom: 0,
              maxZoom: 3,
              scrollWheelZoom: true,
              annotationBar: false,
              attributionControl: false
            }
          );
          L.tileLayer (
            //'http://vkde.sxtsoft.com/api/picMap/load/{z}_{x}_{y}.png?path=/upload/hx.jpg',
            'http://vkde.sxtsoft.com/upload/hx_tile_{z}_{x}_{y}.png',
            {
              attribution: false
            }).addTo (map);
          var drawnItems = new L.FeatureGroup ();
          map.addLayer (drawnItems);

          var apiLayer = L.GeoJSON.api ({
            get: function (cb) {
              if (project.AreaRemark) {
                try {
                  var d = JSON.parse(project.AreaRemark),zg=[];
                  d.features.forEach(function(f,i){
                    if(f.geometry.type!='Point' || f.options.pid==scope.pid){
                      if(f.geometry.type != '')f.options.fill=false;
                      zg.push(f)
                    }
                  });
                  d.features = zg;
                  console.log(d);
                  cb(d);
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

            },
            click: function (layer, cb) {
              if (layer.editing && layer.editing._enabled) return;
              {
                if (layer._icon) {
                  scope.$emit('sxtImageView',{groups:[layer.options.pid]})
                }
                else {
                }
              }

            }
          }).addTo (map);


          var photoMaker = L.Icon.extend ({
            options: {
              shadowUrl: null,
              iconAnchor: [15, 15],
              iconSize: [30, 30],
              iconUrl: 'assets/leaflet/css/images/photo.png'
            }
          });
          var drawControl = new L.Control.Draw ({
            draw: {
              polygon: {
                allowIntersection: false,
                drawError: {
                  color: '#b00b00',
                  timeout: 1000
                },
                shapeOptions: {
                  color: '#ff0000'
                },
                showArea: false
              },
              rectangle: true,
              polyline: false,
              circle: false,
              marker: {
                icon: new photoMaker ()
              }
            },
            edit: {
              edit: true,
              remove: true,
              featureGroup: apiLayer
            }
          });
          //map.addControl (drawControl);
        });
      }, 500);
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
        var map,layer;
        var ran = function () {
          $timeout(function(){


            if (!scope.projectId) return;
            //var crs = ;
            if (map && map.projectId == scope.projectId) return;
            if (map) map.remove();
            var showImgs = function(){
              if(scope.groups){
                $rootScope.$emit('sxtImageView', {
                  groups: scope.groups
                });
              }
            }
            $rootScope.$on('sxtImageViewAll',showImgs)
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
                        return 512 * Math.pow(2, e);
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
                    layer = L.tileLayer(sxt.app.api + '/api/picMap/load/{z}_{x}_{y}.png?path='+fs.data.Files[0].Url.replace('/s_', '/'), {
                      noWrap:true,
                      continuousWorld:false,
                      tileSize:512
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
                              if (f.options.gid)
                                g.push(f.options.gid);
                            });
                            if (g.length) {
                              scope.groups = g;
                            }
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
 * Created by zhangzhaoyong on 16/2/16.
 */
(function(){
  'use strict';

  sxtAreaEdit.$inject = ["$timeout", "$http", "$state", "utils", "msUtils", "$mdDialog", "auth"];
  angular
    .module('app.szgc')
    .directive('sxtAreaEdit',sxtAreaEdit);

  /** @ngInject */
  function sxtAreaEdit($timeout,$http,$state,utils,msUtils,$mdDialog,auth){
    return {
      scope:{

      },
      link:link
    }

    function  link(scope,element,attr,ctrl){

      $timeout(function() {
        $http.get ('http://vkde.sxtsoft.com/api/ProjectEx/'+utils.id).then (function (result) {
          var project = result.data || {ProjectId:utils.id};

          var map = L.map (element[0], {
              crs: L.extend ({}, L.CRS, {
                projection: L.Projection.LonLat,
                transformation: new L.Transformation (1, 0, 1, 0),
                scale: function (e) {
                  return 512 * Math.pow (2, e);
                }
              }),
              center: [.23531902026005, .18],
              zoom: 1,
              minZoom: 0,
              maxZoom: 3,
              scrollWheelZoom: true,
              annotationBar: false,
              attributionControl: false
            }
          );
          L.tileLayer (
            //'http://vkde.sxtsoft.com/api/picMap/load/{z}_{x}_{y}.png?path=/upload/hx.jpg',
            'http://vkde.sxtsoft.com/upload/hx_tile_{z}_{x}_{y}.png',
            {
              attribution: false
            }).addTo (map);
          var drawnItems = new L.FeatureGroup ();
          map.addLayer (drawnItems);

          var cmenu,apiLayer = L.GeoJSON.api ({
            get: function (cb) {
              if (project.AreaRemark) {
                try {
                  var d = JSON.parse(project.AreaRemark);
                  cb(d);
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
              $http.put('http://vkde.sxtsoft.com/api/ProjectEx/'+project.ProjectId,project).then(function () {
                cb();
              });
            },
            click: function (layer, cb) {
              if (layer.editing && layer.editing._enabled) return;
              {
                if (layer._icon && msUtils.isMobile()) {
                  $state.go('app.szgc.zgdetail',{pid:layer.options.pid});
                }
                else {
                }
              }

            },
            contextMenu:function(e,cb){
              var layer = e.layer;
              if(layer instanceof L.Polygon || layer instanceof L.Rectangle) {
                if(cmenu!=null){
                  cmenu.hide();
                  cmenu = null;
                }
                var fn = function(data){
                  var p = layer.getBounds().getCenter();
                  var marker = layer.mk || (layer.mk = L.marker(p, {
                      icon: new ST.L.LabelIcon({
                        html: data.text,
                        color: layer.options.color
                      }),
                      saved:false,
                      draggable: true,       // Allow label dragging...?
                      zIndexOffset: 1000     // Make appear above other map features
                    }).on('dragend',function(e){
                      var p = this.getLatLng();
                      layer.options.areaLabel.lat = p.lat;
                      layer.options.areaLabel.lng = p.lng;
                      cb();
                    }).addTo(layer._map));
                  marker.options.icon.setText(data.text);
                  layer.options.areaLabel = data;
                  layer.options.areaLabel.lat = p.lat;
                  layer.options.areaLabel.lng = p.lng;
                  cb();
                }
                cmenu = new ST.L.ContextMenu (e, {
                  contextmenuWidth: 150,
                  actions: [
                    {
                      text: '客厅',
                      callback: function () {
                        fn({
                          text: '客厅',
                          id:1
                        })
                      }
                    },
                    {
                      text: '主卧室',
                      callback: function () {
                        fn({
                          text: '主卧室',
                          id:2
                        })
                      }
                    },
                    {
                      text: '次卧室',
                      callback: function () {
                        fn({
                          text: '次卧室',
                          id:3
                        })
                      }
                    },
                    {
                      text: '厨房',
                      callback: function () {
                        fn({
                          text: '厨房',
                          id:4
                        })
                      }
                    },
                    {
                      text: '主卫',
                      callback: function () {
                        fn({
                          text: '主卫',
                          id:5
                        })
                      }
                    },
                    {
                      text: '卫生间',
                      callback: function () {
                        fn({
                          text: '卫生间',
                          id:6
                        })
                      }
                    },
                    {
                      text: '餐厅',
                      callback: function () {
                        fn({
                          text: '餐厅',
                          id:7
                        })
                      }
                    }
                  ]
                });
                cmenu.show ();
              }
            },
            onAdd: function (layer,cb) {
              if(layer.options.icon){
                layer.options.pid = msUtils.guidGenerator();
                layer.options.date = moment().format('YYYY-MM-DD HH:mm');
                layer.options.user = auth.current().Username;

                $mdDialog.show({
                  locals:{
                    options:layer.options
                  },
                  controller: ["$scope", "$mdDialog", "options", "$cordovaCamera", function($scope, $mdDialog,options,$cordovaCamera) {
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
                          $http.post ('http://vkde.sxtsoft.com/api/Files/' + layer.options.pid + '/base64', {Url: imageData}).then (function (result) {
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
                      cb ();
                      $mdDialog.hide ();
                      $state.go ('app.szgc.tzg', {pid: options.pid})
                    };
                    $scope.photo ();
                  }],
                    template: '<md-dialog aria-label="拍照"  ng-cloak><form><md-toolbar style="background:#1f6db4"><div class="md-toolbar-tools"><h2>{{title || \'拍照\'}}</h2></div></md-toolbar>\
                  <md-dialog-content><div class="md-dialog-content" >\
                <img width="120" class="cimages" ng-repeat="img in images" ng-src="{{img.Url|fileurl}}" /></div></md-dialog-content>\
                <md-dialog-actions layout="row" style="border-top:solid 2px #1f6db4">\
                  <md-button  class="md-raised" ng-click="cancel()" >取消</md-button>\
                <span flex></span>\
                <md-button  class="md-raised" ng-click="photo($event)" >\
                    添加 \
                  </md-button>\
                <md-button  class="md-raised" ng-click="answer()"  md-autofocus style="margin-right:20px;">发送整改通知</md-button>\
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
                return false;
              }
            }
          }).addTo (map);


          var photoMaker = L.Icon.extend ({
            options: {
              shadowUrl: null,
              iconAnchor: [15, 15],
              iconSize: [30, 30],
              iconUrl: 'assets/leaflet/css/images/photo.png'
            }
          });
          var drawControl = new L.Control.Draw ({
            draw: {
              polygon: {
                allowIntersection: false,
                drawError: {
                  color: '#b00b00',
                  timeout: 1000
                },
                shapeOptions: {
                  color: '#ff0000'
                },
                showArea: false
              },
              rectangle: true,
              polyline: false,
              circle: false,
              marker: {
                icon: new photoMaker ()
              }
            },
            edit: {
              edit: true,
              remove: true,
              featureGroup: apiLayer
            }
          });
          map.addControl (drawControl);
        });
      }, 500);
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
       //$('#floorlayer').css('zoom',scale);
        //console.log('pinch',e)
      }
      scope.pinchmove = function(e){
        //console.log('pinchevent')
        var scale = getRelativeScale(e.gesture.scale);
       // $('#floorlayer').css('zoom',scale);
        $.Velocity.hook($('#floorlayer'), 'scale', scale);
        e.preventDefault();

        //console.log('pinchmove')
        //var scale = $(element).css();
      }
      scope.pinchend = function(e){
        currentScale = getRelativeScale(e.gesture.scale);
        e.preventDefault();
        //console.log('pinchend')
      }

      function getRelativeScale(scale) {
        var nowScale=scale * currentScale;;
        if(nowScale <1){
          nowScale =1;
        }
        //return scale * currentScale;
        return nowScale;
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

        var sellLine = parseInt(scope.sellLine * scope.floorData.floors), gx1 = scope.floorData.gx1, gx2 = scope.floorData.gx2;
        if (gx1 > scope.floorData.floors) gx1 = scope.floorData.floors;
        if (gx2 > scope.floorData.floors) gx2 = scope.floorData.floors;
        //var _floorData = [scope.floorNum, scope.floorData.floors, 20, 10, sellLine, scope.floorData.name]
        var str = [];
        var zIndex = 1, zWholeIndex = 1;
        var iFloorHeight = 0, iWinHeight = 0, itemp = 0, iWwidth = 0;
        var zoom = 0;
        var p = element.position(), h = $(window).height();
        var summary = scope.floorData.summary;
        if(summary== undefined || summary == ''){
          summary = '';
        }

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

        str.push('<div style="height:55px;"></div></div></div><p>' + scope.floorData.name + '(' + scope.floorData.floors + '层)<br/>&nbsp;' + summary +'</p></a></div></div>');
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
        //$('.floor-layer').css({'height':iFloorHeight+'px','width':iflayerWidth+'px'});
        iFloorHeight = itemp * zoom ;
        var iFh=(iFloorHeight-50)/itemp;
        $('.whole',element).css({'zoom':iFh});

       // $('.whole', element).css('zoom', zoom);
        $('.floor-layer1').css({'height': iFloorHeight + 'px','width': '70%'});

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
      var sellLine = parseInt(scope.sellLine * scope.floorData.floors), gx1 = scope.floorData.gx1, gx2 = scope.floorData.gx2;
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
        str.push('<li class="build-b"></li></ul></div><p>'+scope.floorData.name+'('+scope.floorData.floors+'层)<br/>&nbsp;'+scope.floorData.summary+'</p></a></div></div>');
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

  vankeAuth.$inject = ["$http", "$q", "appConfig", "$state"];
  angular
    .module('app.auth')
    .factory('vankeAuth', vankeAuth);

  /** @ngInject */
  function vankeAuth($http,$q,appConfig,$state)
  {
    var service = {
      token   : token,
      profile : profile
    };

    return service;

    function token(user){
      return $q(function(resolve,reject){
        user ? resolve(user):reject('');
      })
    }

    function profile(token){
      return $q(function(resolve,reject){
        token?resolve({
          id:1,
          RealName:token.username,
          Token:'429ad0b0d7ab966180cc4718324c50ddf176d099',
          Username:token.username,
          Partner:''
        }):$state.go('app.auth.login');
      })
    }
  }

})();

/**
 * Created by jiuyuong on 2016/1/22.
 */

(function ()
{
    'use strict';

    LoginController.$inject = ["auth", "utils"];
    angular
        .module('app.auth')
        .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController(auth,utils)
    {

      var vm = this;
        // Data

        // Methods
      vm.login = function(loginForm){
        console.log('login',vm.form)
        auth.login(vm.form).then(function(){
          utils.tips('登录成功');
        },function(reject){
          utils.tips('用户名或密码错误')
        })
      }
        //////////
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
    var partner = [
      'xugt','v-zhangqy03'
    ],procedureId = '2814510f-0188-4993-a153-559b40d0b5e8';

    var $http,$q,auth,api;
    angular.injector(['ng']).invoke([
      '$http','$q',function (_$http,_$q)
      {
        $http = _$http;
        $q = _$q;
      }
    ]);

    var permission,p1;

    var http = apiProvider.$http;
    apiProvider.register('szgc',{
      vanke:{
        profile:http.custom(function(){
          return get('/common/v1/profile');
        }),
        isPartner:http.custom(function(f){
          return (!f && (partner.indexOf(getAuth().current().loginname) != -1)) || getAuth().current().Partner ;
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
        _projects: http.custom(function (arg) {
          return get(http.url('/common/v1/projects', arg));
        }),
        projects: http.custom(function (arg) {
          var me = this;
          if (!me.isPartner(1)) {
            return get(http.url('/common/v1/DE/projects', arg));
          }
          else {
            return $q(function (resolve, reject) {
              if (p1)
                resolve(p1);
              else {
                console.log('me',me)
                me.root.szgc.ProjectSettings.query({ unitId: getAuth().current().Partner }).then(function (result) {
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
        project_items: http.custom(function (arg) {
          return get(http.url('/common/v1/project_items', arg)).then(function (result) {
            var p = permission;
            if (p) {
              if (p.Rows.find(function (it) {
                  return it.RegionIdTree.substring(it.RegionIdTree.length - arg.project_id) == arg.project_id
                })) {

              }
              else {
                for (var i = result.data.data.length - 1; i >= 0; i--) {
                  var item = result.data.data[i];
                  var fd = p.Rows.find(function (it) {
                    return it.RegionIdTree.indexOf(item.project_item_id) != -1
                  });
                  if (!fd) {
                    console.log(item)
                    result.data.data.splice(i, 1);
                  }
                }
              }
            }
            return result;
          });
          return result;
        }),
        buildings: http.custom(function (arg) {
          return get(http.url('/common/v1/buildings', arg)).then(function (result) {
            result.data.data.sort(function (i1, i2) {
              return i1.name.localeCompare(i2.name);
            });
            return result;
          })
        }),
        floors: http.custom(function (build_id) {
          return get(http.url('/common/v1/buildings/' + build_id + '/floors'));
        }),
        units: http.custom(function (arg) {
          return get(http.url('/common/v1/buildings/' + arg + '/units', arg));
        }),
        rooms: http.custom(function (arg) {
          return get(http.url('/common/v1/rooms', arg));
        }),
        partners: http.custom(function (arg) {
          return get(http.url('/common/v1/partners', arg));
        }),
        skills: http.custom(function (arg) {
          return get(http.url('/common/v1/skills', arg));
        }),
        employees: http.custom(function (arg) {
          return get(http.url('/common/v1/partners/'+arg+'/employees'));
        }),
        teams: http.custom(function (arg) {
          return get(http.url('/common/v1/partners/' + arg + '/teams'));
        }),
        buildingsInfo:http.custom(function(type, typeId){
          var s = this;
          return $q(function (resolve,reject) {
            if (type == 2) {
              s.buildings({
                page_number: 1,
                page_size: 10000,
                project_item_id: typeId
              }).then(function (b1) {
                var bd = [],bs=[];
                b1.data.data.forEach(function (b) {
                  bs.push(s.floors(b.building_id));
                  bd.push(b);
                });
                $q.all(bs).then(function (b1) {
                  var i = 0;
                  b1.forEach(function (r) {
                    bd[i++].floors = r.data.data.length;
                  });
                  resolve(bd);
                })
              })
            }
            else{
              alert('接口未实现');reject('接口未实现');
            }
          });
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
        },
        getbyid:function (id) {
          return $http.get('/api/PProcedure/' + id);
        },
        update:function (id, data) {
          return $http.put('/api/PProcedure/' + id, data);
        },
        create:function (data) {
          return $http.post('/api/PProcedure', data);
        },
        destroy:function (data) {
          return $http.delete('/api/PProcedure/' + data.Id);
        },
        upfile:function (data) {
          return $http.put('/api/PProcedure/File' + data);
        },
        updateSatus:function (id,status) {
          return $http.put('/api/PProcedure/UpdateStatusByProcedureId?id=' + id + "&status=" + status);
        },
        FilesCount:function(groupId){
          return $http.get('/api/Procedure/FilesCount?groupId=' + groupId);
        },
        deleteAppImg: function(id) {
          return $http.delete('/api/APPImgs/' + id);
        }

    //return {
    //  getAll: getAll,
    //  getbyid: getbyid,
    //  update: update,
    //  create: create,
    //  destroy: destroy,
    //  upfile: upfile,
    //  updateSatus: updateSatus,
    //  FilesCount:FilesCount,
    //  getAppImg: function (regionId, produceId, roleid) {
    //    return $http.get('/api/projects/' + regionId + '/Procedure/' + produceId + '/APPImgs?roleId=' + roleid);
    //  },
    //
    //}
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
          return $q(function(resolve){
            resolve({data:{"$id":"1","Rows":[
              {
              "ProjectId":"52327c423543e88827000009",
              "ProjectNo":"亚奥金茂悦",
              "Longitude":"116.435002",
              "Latitude":"40.025485"
            },{
                "ProjectId":"52327c423543e88827000008",
                "ProjectNo":"金茂公寓",
                "Longitude":"116.454919",
                "Latitude":"39.913023"
              }],"Total":7}})
          })
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

/**
 * Created by zhangzhaoyong on 16/1/27.
 */
(function ()
{
  'use strict';

  SzgcController.$inject = ["auth"];
  angular
    .module('app.szgc')
    .controller('SzgcController', SzgcController);

  /** @ngInject */
  function SzgcController(auth)
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
          name: 'blue-1',
          hues: {
            'default': '500',
            'hue-1'  : '500',
            'hue-2'  : '500',
            'hue-3'  : '500'
          }
        },
        accent    : {
          name: 'blue-1',
          hues: {
            'default': '500',
            'hue-1'  : '500',
            'hue-2'  : '500',
            'hue-3'  : '500'
          }
        },
        warn      : {name: 'blue-1'},
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
      //'vanke'     : {
      //  primary   : {
      //    name: 'red',
      //    hues: {
      //      'default': '900',
      //      'hue-1'  : '600',
      //      'hue-2'  : '500',
      //      'hue-3'  : 'A100'
      //    }
      //  },
      //  accent    : {
      //    name: 'red',
      //    hues: {
      //      'default': '500',
      //      'hue-1'  : '400',
      //      'hue-2'  : '600',
      //      'hue-3'  : 'A100'
      //    }
      //  },
      //  warn      : {name: 'red'},
      //  background: {
      //    name: 'grey',
      //    hues: {
      //      'default': 'A100',
      //      'hue-1'  : '100',
      //      'hue-2'  : '50',
      //      'hue-3'  : '300'
      //    }
      //  }
      //}
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
      {
        name:'blue-1',
        options:{
          '50': '#ececee',
          '100': '#c5c6cb',
          '200': '#9ea1a9',
          '300': '#7d818c',
          '400': '#5c616f',
          '500':'#1f6db4',
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
      }
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
                fuseTheming.setActiveTheme('vanke');
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

    return {
      id:'52327c423debf68027000006',
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

    function alertMessage(message,ev,fn){
      return $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('body')))
          .clickOutsideToClose(true)
          .title('温馨提示')
          .textContent(message)
          .ariaLabel('温馨提示')
          .ok('确定')
          .targetEvent(ev)
      ).then(function(){
        fn && fn();
      })
    }

    function confirmMessage(message,ev,ok,cancel){
      return $mdDialog.show(
        $mdDialog.confirm()
          .title('需要您的确认')
          .textContent(message)
          .ariaLabel('需要您的确认')
          .targetEvent(ev)
          .ok(ok || '确定')
          .cancel(cancel || '取消')
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
  authToken.$inject = ["$cookies", "$rootScope"];
  angular
    .module('app.core')
    .factory('authToken',authToken);
  /** @ngInject */
  function authToken($cookies,$rootScope){
    var token,tokenInjector;

    tokenInjector = {
      setToken      : setToken,
      getToken      : getToken,
      request       : onHttpRequest,
      responseError : onHttpResponseError
    };

    return tokenInjector;

    function setToken(tk){
      token = tk && tk.token_type && tk.access_token ? tk.token_type + ' ' + tk.access_token : null;
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

    function onHttpResponseError(rejection){
      if(rejection.status == 401){
        $rootScope.$emit ('user:needlogin');
        //$rootScope.$emit('')
        //document.location = '#/auth/login'
        //$state.go('')
        //setToken(null);
      }
    }

  }
})();

/**
 * Created by jiuyuong on 2016/1/22.
 */
/**
 * Created by jiuyuong on 2016/1/22.
 */
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
    var forEach = angular.forEach,loginedUser = null;
    // 是否转跳的登录
    var autoLoginPath = false;

    this.$get = appAuth;

    appAuth.$injector = ['$q','$injector','authToken','$state','$rootScope','$location','sxt'];

    function appAuth($q,$injector,authToken,$state,$rootScope,$location, sxt){

      $rootScope.$on('user:needlogin',function(){
        $state.go('app.auth.login');
      });
      var reversedInterceptors = [];

      forEach(interceptorFactories, function(interceptorFactory) {
        reversedInterceptors.unshift($injector.get(interceptorFactory));
      });

      return {
        isLoggedIn : isLoggedIn,
        token      : token,
        profile    : profile,
        login      : login,
        getUser    : getUser,
        autoLogin  : autoLogin,
        current    : currentUser,
        logout     : logout
      };

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

      // 根据用户凭据登录系统
      function login(user){
        return token(user).then(function(token){
          authToken.setToken(token);
          getProfile(token,user);
        },function(){
          //$state.go('app.auth.login');
          return $q.reject("用户名或密码错误");

        });
      }

      // 根据用户token登录系统
      function getProfile(token,user){
         profile(token).then(function(profile){
           if(token == profile)
            profile = null;

           loginedUser = profile;
          if(!loginedUser) {
            //$state.go('app.auth.login');
          }
          else {
            profile.username = profile.username||profile.Id;
            profile.token = token;
            profile.user = user;
            sxt.cache.setProfile(profile,function(){
              console.log('save sql',profile);
              $rootScope.$emit ('user:login', profile);
              if(!autoLoginPath){

                $state.go('app.szgc.home')
                //$location.path('/');
              }
            })

          }
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
        sxt.cache.removeProfile(loginedUser, function(){
          $rootScope.$emit ('user:logout', loginedUser);
          $state.go('app.auth.login');
        });
      }

      function currentUser(){
        return loginedUser;
      }
    }
  }
}());

(function ()
{
  'use strict';

  angular
    .module('app.core')
    .provider('api', apiProvider)

  /** @ngInject */
  function apiProvider() {
    var api = {},provider = this,injector;
    provider.register = register;
    provider.$http = {
      url:url,
      get:cfg('get'),
      post:cfg('post'),
      delete:cfg('delete'),
      options:cfg('options'),
      head:cfg('head'),
      resource:cfg('resource'),
      custom:cfg('custom')
    };
    provider.$q = function(){
      return provider.$q.$q.apply(provider,Array.prototype.slice.call(arguments));
    }



    provider.$get = getApi;
    provider.get = getServer;

    getApi.$injector = ['$resource','$http','$injector','$q'];

    function getServer(name){
      return injector.get(name);
    }

    function getApi($resource,$http,$injector,$q){
      injector = $injector;
      provider.$http.$http = $http;
      provider.$q.$q = $q;
      resolveApi(api,$resource,$http);
      return api;
    }

    function resolveApi(p,$resource,$http){
      if(p!==api)
        p.root = api;
      angular.forEach(p,function(o,k){
        if(k === 'root' || !angular.isObject(o))return;
        if(o.method && o.args){
          if(o.method == 'custom'){
            p[k] = custom(o.args[0],p);
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
            args: Array.prototype.slice.call(arguments)
          };
        }
      }
      return function () {
        var args = Array.prototype.slice.call(arguments),
          url = args[0];
        if(url.indexOf('http')==-1)
          args[0] = sxt.app.api+url;
        return provider.$http.$http[method].apply(this,args);
      };
    }


    function custom(fn,scope){
      return function (){
        return fn.apply(scope,Array.prototype.slice.call(arguments));
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

    TopToolbarController.$inject = ["$scope"];
    angular
        .module('app.toolbar')
        .controller('TopToolbarController', TopToolbarController);

    /** @ngInject */
    function TopToolbarController($scope) {
      $scope.goBack = function(){
        history.go(-1);//返回
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

    /**
     * Main module of the Fuse
     */
    angular
        .module('sxt', [

            // Core
            'app.core',

            // Navigation
            'app.navigation',

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
          'ngCordova'
        ]);
})();

(function ()
{
    'use strict';

    MainController.$inject = ["$scope", "$rootScope"];
    angular
        .module('sxt')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController($scope, $rootScope)
    {
        // Data

        //////////

        // Remove the splash screen
        $scope.$on('$viewContentAnimationEnded', function (event)
        {
            if ( event.targetScope.$id === $scope.$id )
            {
                $rootScope.$broadcast('msSplashScreen::remove');
            }
        });
    }
      angular.element(document).ready(function () {

      angular.bootstrap(document, ['sxt']);
    });
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

    IndexController.$inject = ["fuseTheming", "$state", "$scope", "$rootScope", "utils", "$http"];
    angular
        .module('sxt')
        .controller('IndexController', IndexController);

    /** @ngInject */
    function IndexController(fuseTheming,$state,$scope,$rootScope,utils,$http)
    {
        var vm = this;

        // Data
        vm.themes = fuseTheming.themes;
      $rootScope.showgz = function(){
        return $state.is('app.szgc.tzg');
      };
      $rootScope.send = function($event){
        utils.alert('发送成功',$event,function(){
          $http.get ('http://vkde.sxtsoft.com/api/ProjectEx/'+utils.id).then (function (result) {
            var project = result.data;
            if (project.AreaRemark) {
              try {
                var d = JSON.parse(project.AreaRemark),zg=[];
                d.features.forEach(function(f,i){
                  if(f.options.pid== $rootScope.pid){
                    f.options.summary = $rootScope.summary;
                  }
                });

                project.AreaRemark = JSON.stringify(d);
                $http.put('http://vkde.sxtsoft.com/api/ProjectEx/'+project.ProjectId,project).then(function () {
                  history.back();
                });
              }
              catch (ex) {
                history.back();
              }
            }
            else{
              history.back();
            }
          });

        })
      }
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
$templateCache.put("app/core/layouts/content-only.html","<div id=\"layout-content-only\" class=\"template-layout\" layout=\"column\" flex=\"\"><md-content id=\"content\" class=\"animate-slide-up md-background md-hue-1\" ui-view=\"content\" flex=\"\"></md-content></div>");
$templateCache.put("app/core/layouts/content-with-footbar.html","<div id=\"layout-content-with-footbar\" class=\"template-layout\" layout=\"column\" flex=\"\"><md-toolbar id=\"toptoolbar\" class=\"md-menu-toolbar md-whiteframe-1dp\" ui-view=\"toptoolbar\"></md-toolbar><md-content id=\"content\" class=\"animate-slide-left md-background md-hue-1\" layout=\"column\" ui-view=\"content\" flex=\"\"></md-content><md-toolbar id=\"toolbar2\" class=\"md-menu-toolbar md-whiteframe-1dp\" ui-view=\"toolbar\"></md-toolbar></div>");
$templateCache.put("app/core/layouts/content-with-toolbar.html","<div id=\"layout-content-with-toolbar\" class=\"template-layout\" layout=\"column\" flex=\"\"><md-toolbar id=\"toolbar\" class=\"md-menu-toolbar md-whiteframe-1dp\" ui-view=\"toolbar\"></md-toolbar><md-content id=\"content\" class=\"animate-slide-up md-background md-hue-1\" ui-view=\"content\" flex=\"\"></md-content></div>");
$templateCache.put("app/core/layouts/horizontal-navigation.html","<div id=\"layout-horizontal-navigation\" class=\"template-layout\" layout=\"column\" flex=\"\"><md-toolbar id=\"toolbar\" class=\"md-menu-toolbar\" ui-view=\"toolbar\"></md-toolbar><div id=\"horizontal-navigation\" class=\"md-whiteframe-1dp\" ui-view=\"navigation\"></div><div id=\"content-container\" flex=\"\" layout=\"column\"><md-content id=\"content\" class=\"animate-slide-up md-background md-hue-1\" ms-scroll=\"\" ui-view=\"content\" flex=\"\"></md-content></div><md-sidenav id=\"quick-panel\" class=\"md-sidenav-right md-whiteframe-4dp\" md-component-id=\"quick-panel\" ms-scroll=\"\" ui-view=\"quickPanel\"></md-sidenav></div>");
$templateCache.put("app/core/layouts/vertical-navigation.html","<div id=\"layout-vertical-navigation\" class=\"template-layout\" layout=\"row\" flex=\"\"><md-sidenav id=\"vertical-navigation\" class=\"md-primary-bg\" md-is-locked-open=\"$mdMedia(\'gt-sm\')\" md-component-id=\"navigation\" ms-scroll=\"\" ui-view=\"navigation\"></md-sidenav><div id=\"content-container\" flex=\"\" layout=\"column\"><md-toolbar id=\"toolbar\" class=\"md-menu-toolbar md-whiteframe-1dp\" ui-view=\"toolbar\"></md-toolbar><md-content id=\"content\" class=\"animate-slide-up md-background md-hue-1\" ms-scroll=\"\" ui-view=\"content\" layout=\"column\" flex=\"\"></md-content></div><md-sidenav id=\"quick-panel\" class=\"md-sidenav-right md-whiteframe-4dp\" md-component-id=\"quick-panel\" ms-scroll=\"\" ui-view=\"quickPanel\"></md-sidenav></div>");
$templateCache.put("app/core/theme-options/theme-options.html","<div class=\"ms-theme-options-panel\" layout=\"row\" layout-align=\"start start\"><div class=\"ms-theme-options-panel-button md-primary-bg\" ng-click=\"toggleOptionsPanel()\"><md-icon md-font-icon=\"icon-cog\" class=\"white-text\"></md-icon></div><div class=\"ms-theme-options-list\" layout=\"column\"><div class=\"theme-option\"><div class=\"option-title\">Layout Style:</div><md-radio-group layout=\"column\" ng-model=\"vm.layoutStyle\" ng-change=\"vm.updateLayoutStyle()\"><md-radio-button value=\"verticalNavigation\">Vertical Navigation</md-radio-button><md-radio-button value=\"horizontalNavigation\">Horizontal Navigation</md-radio-button><md-radio-button value=\"contentOnly\">Content Only</md-radio-button><md-radio-button value=\"contentWithToolbar\">Content with Toolbar</md-radio-button></md-radio-group></div><md-divider></md-divider><div class=\"theme-option\"><div class=\"option-title\">Layout Mode:</div><md-radio-group layout=\"row\" layout-align=\"start center\" ng-model=\"vm.layoutMode\" ng-change=\"vm.updateLayoutMode()\"><md-radio-button value=\"boxed\">Boxed</md-radio-button><md-radio-button value=\"wide\">Wide</md-radio-button></md-radio-group></div><md-divider></md-divider><div class=\"theme-option\"><div class=\"option-title\">Color Palette:</div><md-menu-item ng-repeat=\"(themeName, theme) in vm.themes.list\" class=\"theme\"><md-button class=\"md-raised theme-button\" aria-label=\"{{themeName}}\" ng-click=\"vm.setActiveTheme(themeName)\" ng-style=\"{\'background-color\': theme.primary.color,\'border-color\': theme.accent.color,\'color\': theme.primary.contrast1}\" ng-class=\"themeName\"><span><md-icon ng-style=\"{\'color\': theme.primary.contrast1}\" md-font-icon=\"icon-palette\"></md-icon><span>{{themeName}}</span></span></md-button></md-menu-item></div></div></div>");
$templateCache.put("app/main/sample/sample.html","<h1>{{vm.helloText}}</h1>");
$templateCache.put("app/core/directives/ms-search-bar/ms-search-bar.html","<div flex=\"\" layout=\"row\" layout-align=\"start center\"><label for=\"ms-search-bar-input\"><md-icon id=\"ms-search-bar-expander\" md-font-icon=\"icon-magnify\" class=\"icon s24\"></md-icon><md-icon id=\"ms-search-bar-collapser\" md-font-icon=\"icon-close\" class=\"icon s24\"></md-icon></label> <input id=\"ms-search-bar-input\" type=\"text\" ng-model=\"global.search\" placeholder=\"Search\" translate=\"\" translate-attr-placeholder=\"TOOLBAR.SEARCH\" flex=\"\"></div>");
$templateCache.put("app/main/auth/login/login.html","<div id=\"login\" class=\"flex-scrollable login1\" layout=\"column\" ms-scroll=\"\"><div id=\"login-form-wrapper\" layout=\"column\" layout-align=\"center center\" layout-align-xs=\"center start\"><div id=\"login-form\"><div class=\"logo\"><span><img src=\"libs/leaflet/images/L.png\"></span></div><form name=\"loginForm\" novalidate=\"\" ng-submit=\"vm.login(loginForm)\"><div class=\"login-name\"><md-input-container class=\"md-block\" md-no-float=\"\"><md-icon md-svg-src=\"app/main/auth/images/user.svg\"></md-icon><input type=\"text\" name=\"username\" ng-model=\"vm.form.username\" placeholder=\"请输入用户名\" translate=\"\" translate-attr-placeholder=\"LOGIN.USERNAME\" required=\"\"></md-input-container><md-divider></md-divider><md-input-container class=\"md-block\" md-no-float=\"\"><md-icon md-svg-src=\"app/main/auth/images/password.svg\"></md-icon><input type=\"password\" name=\"password\" ng-model=\"vm.form.password\" placeholder=\"请输入密码\" translate=\"\" translate-attr-placeholder=\"LOGIN.PASSWORD\" required=\"\"></md-input-container></div><div layout=\"row\" layout-align=\"center center\"><md-button type=\"submit\" flex=\"90\" class=\"md-raised md-warn\" aria-label=\"登录\" translate=\"LOGIN.LOG_IN\" translate-attr-aria-label=\"LOGIN.LOG_IN\">登录</md-button></div></form></div></div></div>");
$templateCache.put("app/main/szgc/directives/sxt-projects-jd-app.html","<div><md-list><md-subheader class=\"md-no-sticky\">已选择项</md-subheader><md-list-item ng-repeat=\"st in selectors\" ng-if=\"st.selected\"><p>{{st.label}}：{{st.selected.$name}}</p><md-checkbox class=\"md-secondary\" ng-click=\"item_clear(st.index)\" ng-checked=\"1\"></md-checkbox></md-list-item><md-divider></md-divider></md-list><div ng-repeat=\"st in selectors\" data-title=\"{{st.label}}\" ng-if=\"st.items.length\" class=\"J_selectorLine s-brand\" ng-show=\"isShow(st)\"><div class=\"md-padding\"><md-input-container class=\"md-block\"><label>{{st.label}}</label><md-select ng-model=\"st.current\" md-on-close=\"st.current && item_selected(st.current, st.index)\"><md-option ng-repeat=\"item in st.filters\" ng-value=\"item\">{{item.$name}}</md-option></md-select></md-input-container></div><md-list><md-subheader class=\"md-no-sticky\"><div layout=\"row\"><div flex=\"none\" class=\"stlabel\">{{st.label}}</div><div flex=\"\"><md-button class=\"md-fab md-mini\" ng-class=\"{\'md-primary\':lt.selected}\" ng-repeat=\"lt in st.letters\" ng-click=\"st.filter(lt)\">{{lt.$name}}</md-button></div></div></md-subheader></md-list><md-divider></md-divider></div><div ng-transclude=\"\"></div></div>");
$templateCache.put("app/main/szgc/home/area.html","<div flex=\"\" layout=\"column\"><div flex=\"\" sxt-area-edit=\"\"></div></div>");
$templateCache.put("app/main/szgc/home/buildingdetail.html","<div flex=\"\" layout=\"column\" layout-fill=\"\"><div flex=\"none\" id=\"barchart\"><bar-chart config=\"vm.data.config\" data=\"vm.data.data\" style=\"height:500px;\"></bar-chart></div><div flex=\"\"><floor-layer-detail sxtfloor=\"vm.build\" single=\"true\" sell-line=\"vm.sellLine\" floor-num=\"vm.build.floorNum\" bdetail-data=\"vm.data.data\"></floor-layer-detail></div></div>");
$templateCache.put("app/main/szgc/home/home.html","<div flex=\"\" layout=\"column\"><div flex=\"\" sxt-maps=\"\" markers=\"vm.markers\" marker-click=\"vm.markerClick($current)\"></div></div>");
$templateCache.put("app/main/szgc/home/link.html","<md-content flex=\"\" layout=\"column\" ng-show=\"!vm.searBarHide\" class=\"menu-toggle-list\"><div flex=\"\" style=\"overflow: auto\"><sxt-projects-jd ng-model=\"vm.project.pid\" object-scope=\"vm\" levels=\"0\" region-type=\"vm.project.type\" region-name=\"vm.project.typeName\" project-id=\"vm.project.projectId\" project-name=\"vm.project.projectName\" id-tree=\"vm.project.idTree\" name-tree=\"vm.project.nameTree\"></sxt-projects-jd><div class=\"md-padding\" layout=\"row\"><md-button type=\"submit\" flex=\"\" ng-click=\"vm.searBarHide=true\" class=\"md-raised md-primary\">确定</md-button></div></div></md-content><md-content flex=\"\" layout=\"column\" ng-show=\"vm.searBarHide\"><iframe flex=\"\" ng-src=\"http://vkde.sxtsoft.com/yhyd/\"></iframe></md-content>");
$templateCache.put("app/main/szgc/home/link2.html","<div flex=\"\" layout=\"column\"><md-toolbar id=\"subtoolbar\"><div class=\"md-toolbar-tools\"><md-button aria-label=\"现场实景\" sxt-image-view=\"vm.images\" flex=\"\" ng-click=\"vm.showImg()\">现场实景</md-button><span class=\"hr\"></span><md-button aria-label=\"质量总表\" ui-sref=\"app.szgc.report.viewBath\" style=\"min-width:10px!important;\" flex=\"\" ng-click=\"vm.setProject()\">质量总表</md-button><span class=\"hr\"></span><md-button aria-label=\"一户一档\" ui-sref=\"app.szgc.yhyd\" style=\"min-width:10px!important;\" flex=\"\" ng-click=\"vm.setProject()\">一户一档</md-button></div></md-toolbar><sxt-area-show flex=\"\" project-id=\"vm.data.projectId\"></sxt-area-show></div>");
$templateCache.put("app/main/szgc/home/link3.html","<div hm-dir=\"\" style=\"width:100%;\"><div id=\"pinch\" hm-drag=\"dragEvent($event)\" hm-dragend=\"dragend($event)\" hm-pinch=\"pinch($event)\" hm-pinchmove=\"pinchmove($event)\" hm-pinchend=\"pinchend($event)\" style=\"position: relative;\"><div id=\"floorlayer\" style=\"margin:10px 0;position:relative;\"><floor-layer style=\"float:left;\" build-len=\"vm.buildLen\" ng-repeat=\"sxtfloor in vm.data.builds\" sxtfloor=\"sxtfloor\" floor-num=\"vm.data.floorNum\" sell-line=\"vm.sellLine\" ng-click=\"vm.setFloor(sxtfloor)\" ui-sref=\"app.szgc.project.buildinglist.building({buildId:sxtfloor.building_id,buildName:sxtfloor.name,floors:sxtfloor.floors,floorNum:vm.data.floorNum})\"></floor-layer><div style=\"clear:both;display:table;\"></div></div></div></div>");
$templateCache.put("app/main/szgc/home/view.html","<div flex=\"\" layout=\"column\" sxt-image-view=\"\"><div flex=\"\" sxt-area-view=\"\" pid=\"{{pid}}\"></div></div>");
$templateCache.put("app/main/szgc/home/xc.html","<div flex=\"\" layout=\"column\"><div flex=\"\" sxt-area-edit=\"\"></div></div>");
$templateCache.put("app/main/szgc/home/yhyd.html","<md-content flex=\"\" layout=\"column\" ng-show=\"!vm.searBarHide\" class=\"menu-toggle-list\"><div flex=\"\" style=\"overflow: auto\"><sxt-projects-jd ng-model=\"vm.project.pid\" object-scope=\"vm\" region-type=\"vm.project.type\" region-name=\"vm.project.typeName\" project-id=\"vm.project.projectId\" project-name=\"vm.project.projectName\" id-tree=\"vm.project.idTree\" name-tree=\"vm.project.nameTree\" on-queryed=\"vm.project.onQueryed\" is-more=\"vm.project.isMore\"></sxt-projects-jd><div class=\"md-padding\" layout=\"row\"><md-button type=\"submit\" flex=\"\" ng-click=\"vm.searBarHide=true\" class=\"md-raised md-primary\">确定</md-button></div></div></md-content><div style=\"position: absolute; top:0px; right:0px;\"><toggle-menu inst=\"vm.searBarHide\"></toggle-menu></div>");
$templateCache.put("app/main/szgc/report/batchCount-app.html","<md-content flex=\"\" layout=\"column\" ng-show=\"!vm.searBarHide\" class=\"menu-toggle-list\"><div flex=\"\" style=\"overflow: auto\"><sxt-projects-jd ng-model=\"vm.project.pid\" object-scope=\"vm\" levels=\"0\" region-type=\"vm.project.type\" region-name=\"vm.project.typeName\" project-id=\"vm.project.projectId\" project-name=\"vm.project.projectName\" id-tree=\"vm.project.idTree\" name-tree=\"vm.project.nameTree\">从<md-datepicker ng-model=\"vm.m.sDate\" class=\"md-block\" md-placeholder=\"开始时间\"></md-datepicker>至<md-datepicker ng-model=\"vm.m.eDate\" class=\"md-block\" md-placeholder=\"截止时间\"></md-datepicker></sxt-projects-jd><div class=\"md-padding\" layout=\"row\"><md-button type=\"submit\" flex=\"\" ng-click=\"vm.searBarHide=true\" class=\"md-raised md-primary\">确定</md-button></div></div></md-content><md-content flex=\"\" id=\"dvBatchCount\" ng-show=\"vm.searBarHide\"><table class=\"table table-border\" contenteditable=\"true\" width=\"100%\"><caption>项目填报统计表</caption><thead><tr><th width=\"30%\">项目名称</th><th width=\"15%\">时间</th><th width=\"18%\">录入人数</th><th width=\"10%\">土建</th><th width=\"10%\">机电</th><th width=\"10%\">装修</th><th width=\"17%\">合计</th></tr></thead><tbody><tr ng-repeat=\"item in vm.batchData2\" style=\"background :{{item.myCol}};border-bottom:1px solid #ddd; padding:8px\"><td rowspan=\"{{item.colp}}\" ng-if=\"item.colp\">{{item.projectName}}</td><td>{{item.CreatedTime}}</td><td>{{item.jlNumber}}</td><td>{{item.tjNumber}}</td><td>{{item.jdNumber}}</td><td>{{item.zxNumber}}</td><td>{{item.dayCountNumber}}</td></tr></tbody></table></md-content><div style=\"position: absolute; top:0px; right:0px;\"><toggle-menu inst=\"vm.searBarHide\"></toggle-menu></div>");
$templateCache.put("app/main/szgc/report/choose.html","<div id=\"choose\"><md-content layout-padding=\"\"><div><md-input-container class=\"md-block\"><label>项目</label><md-select ng-model=\"vm.project1\"><md-option ng-repeat=\"project in vm.project\" value=\"{{project}}\">{{project}}</md-option></md-select></md-input-container></div><div><md-input-container class=\"md-block\"><label>分期</label><md-select ng-model=\"vm.fenqi1\"><md-option ng-repeat=\"fenqi in vm.fenqi\" value=\"{{fenqi}}\">{{fenqi}}</md-option></md-select></md-input-container></div><div><md-input-container class=\"md-block\"><label>楼栋</label><md-select ng-model=\"vm.buildings1\"><md-option ng-repeat=\"building in vm.buildings\" value=\"{{building}}\">{{building}}</md-option></md-select></md-input-container></div><div><md-input-container class=\"md-block\"><label>楼层</label><md-select ng-model=\"vm.floors1\"><md-option ng-repeat=\"floor in vm.floors\" value=\"{{floor}}\">{{floor}}</md-option></md-select></md-input-container></div><div><md-input-container class=\"md-block\"><label>户</label><md-select ng-model=\"vm.rooms1\"><md-option ng-repeat=\"room in vm.rooms\" value=\"{{room}}\">{{room}}</md-option></md-select></md-input-container></div></md-content><div layout=\"row\"><md-button type=\"submit\" flex=\"\" ng-click=\"vm.change()\" class=\"md-raised md-primary\">确定</md-button></div></div>");
$templateCache.put("app/main/szgc/report/projectMasterList-app.html","<md-content flex=\"\" layout=\"column\" ng-show=\"!vm.searBarHide\" class=\"menu-toggle-list\"><div flex=\"\" style=\"overflow: auto\"><sxt-projects-jd ng-model=\"vm.project.pid\" object-scope=\"vm\" region-type=\"vm.project.type\" region-name=\"vm.project.typeName\" project-id=\"vm.project.projectId\" project-name=\"vm.project.projectName\" id-tree=\"vm.project.idTree\" name-tree=\"vm.project.nameTree\" on-queryed=\"vm.project.onQueryed\" is-more=\"vm.project.isMore\"></sxt-projects-jd><div class=\"md-padding\" layout=\"row\"><md-button type=\"submit\" flex=\"\" ng-click=\"vm.searBarHide=true\" class=\"md-raised md-primary\">确定</md-button></div></div></md-content><md-content flex=\"\" ng-show=\"vm.searBarHide\"><bar-chart flex=\"\" config=\"vm.config\" data=\"vm.data\"></bar-chart></md-content><div style=\"position: absolute; top:0px; right:0px;\"><toggle-menu inst=\"vm.searBarHide\"></toggle-menu></div>");
$templateCache.put("app/main/szgc/report/report.html","<md-tabs md-border-bottom=\"\" flex=\"\" layout=\"column\" md-selected=\"vm.data.selectedIndex\"><md-tab label=\"报表中心\" md-on-select=\"vm.onNavList()\"><md-tab-content flex=\"\" layout-fill=\"\" layout=\"column\"><md-content flex=\"\"><md-list ng-cloak=\"\"><md-subheader class=\"md-no-sticky\">质量报表</md-subheader><md-list-item ng-click=\"vm.goToReport(\'质量总表\',\'app.szgc.report.viewBath\', $event)\"><img src=\"app/main/szgc/images/i_304g31.png\" class=\"md-avatar\"><p>质量总表</p></md-list-item><md-list-item ng-click=\"vm.goToReport(\'项目班组总览表\',\'app.szgc.report.projectMasterList\', $event)\"><img src=\"app/main/szgc/images/i_3r631.png\" class=\"md-avatar\"><p>项目班组总览表</p></md-list-item><md-divider></md-divider><md-subheader class=\"md-no-sticky\">监理统计报表</md-subheader><md-list-item ng-click=\"vm.goToReport(\'项目填报情况统计表\',\'app.szgc.report.batchCount\',$event)\"><img src=\"app/main/szgc/images/i_3d31.png\" class=\"md-avatar\"><p>项目填报情况统计表</p></md-list-item></md-list></md-content></md-tab-content></md-tab><md-tab ng-repeat=\"tab in vm.tabs\" label=\"{{tab.name}}\"><md-tab-content flex=\"\" layout-fill=\"\" layout=\"column\"><ui-view flex=\"\" layout=\"column\"></ui-view></md-tab-content></md-tab></md-tabs>");
$templateCache.put("app/main/szgc/report/send.html","<div id=\"send\"><div class=\"md-toolbar-tools bg mb10 iconred\" style=\"height:50px;line-height: 50px;\"><md-icon md-svg-src=\"app/toolbar/images/sc.svg\" style=\"color:#1f6db4 !important;margin:0 10px 0 0;\" class=\"icon s32\"></md-icon><span>色差</span><md-icon md-font-icon=\"icon-chevron-right\" style=\"color:#d6d5da;margin-right: 10px;\" class=\"icon s32\"></md-icon></div><md-list layout=\"row\" class=\"bg mb10 iconblue\" style=\"height:80px;padding: 0;\"><md-list-item flex=\"\"><md-button class=\"md-grid-item-content\" flex=\"\"><md-icon md-svg-src=\"app/toolbar/images/move.svg\" class=\"icon s32\" ng-class=\"{\'active\':vm.is(\'app.szgc.home\')}\"></md-icon><div class=\"md-grid-text\" style=\"line-height: 20px\" ng-style=\"{\'color\':vm.is(\'app.szgc.home\')?\'#d6d5da\':\'rgba(0,0,0,0.54)\'}\">移动</div></md-button></md-list-item><md-list-item flex=\"\"><md-button class=\"md-grid-item-content\" flex=\"\"><md-icon md-svg-src=\"app/toolbar/images/top.svg\" class=\"icon s32\" \"=\"\"></md-icon><div class=\"md-grid-text\" style=\"line-height: 20px\">推送置顶</div></md-button></md-list-item><md-list-item flex=\"\"><md-button class=\"md-grid-item-content\" flex=\"\"><md-icon md-svg-src=\"app/toolbar/images/copy.svg\" class=\"icon s32\" ng-class=\"{\'active\':vm.is(\'app.szgc.ys\')}\"></md-icon><div class=\"md-grid-text\" style=\"line-height: 20px\" ng-style=\"{\'color\':vm.is(\'app.szgc.ys\')?\'#d6d5da\':\'rgba(0,0,0,0.54)\'}\">复制</div></md-button></md-list-item></md-list><md-list style=\"padding: 0;\" class=\"bg mb10\"><md-divider></md-divider><md-list-item flex=\"\"><md-button class=\"md-grid-item-content\" flex=\"\" style=\"color:#000;text-align:left;\"><p>状态</p><p class=\"md-secondary\">待整改<md-icon md-font-icon=\"icon-chevron-right\" style=\"color:#d6d5da;margin-right: 10px;\" class=\"icon s32\"></md-icon></p></md-button></md-list-item><md-divider></md-divider><md-list-item flex=\"\"><md-button class=\"md-grid-item-content\" flex=\"\" style=\"color:#000;text-align:left;\"><p>房号</p><p class=\"md-secondary\">1802房<md-icon md-font-icon=\"icon-chevron-right\" style=\"color:#d6d5da;margin-right: 10px;\" class=\"icon s32\"></md-icon></p></md-button></md-list-item><md-divider></md-divider><md-list-item flex=\"\"><md-button class=\"md-grid-item-content\" flex=\"\" style=\"color:#000;text-align:left;\"><p>责任单位</p><p class=\"md-secondary\">中建三局<md-icon md-font-icon=\"icon-chevron-right\" style=\"color:#d6d5da;margin-right: 10px;\" class=\"icon s32\"></md-icon></p></md-button></md-list-item><md-divider></md-divider><md-list-item flex=\"\"><md-button class=\"md-grid-item-content\" flex=\"\" style=\"color:#000;text-align:left;\"><p>抄送单位</p><p class=\"md-secondary\">金建监理<md-icon md-font-icon=\"icon-chevron-right\" style=\"color:#d6d5da;margin-right: 10px;\" class=\"icon s32\"></md-icon></p></md-button></md-list-item><md-divider></md-divider></md-list><div class=\"md-toolbar-tools bg mb10\" style=\"border-bottom:1px solid #d6d5da;margin-top:10px;border-top:1px solid #d6d5da;padding:10px;\"><textarea placeholder=\"整改说明\" ng-model=\"summary\" style=\"width:100%;min-height:30px;border:none;font-size:12px;\">与色板存在差异</textarea></div><div class=\"md-toolbar-tools\" style=\"background:#fff;border-top:1px solid #d6d5da;border-bottom:1px solid #d6d5da;height:50px;line-height: 50px;margin-top:10px;margin-bottom: 10px;;\"><span>添加照片</span><md-icon md-font-icon=\"icon-chevron-right\" style=\"color:#d6d5da;margin-right: 10px;\" class=\"icon s32\"></md-icon></div><md-list style=\"padding: 0;\" class=\"note bg mb10\"><md-divider></md-divider><md-list-item flex=\"\"><md-button class=\"md-grid-item-content\" flex=\"\" style=\"color:#000;text-align:left;\"><p><md-icon md-svg-src=\"app/toolbar/images/note.svg\" class=\"icon s32\" ng-class=\"{\'active\':vm.is(\'app.szgc.report\')}\"></md-icon>注释</p><p class=\"md-secondary\"><md-icon md-font-icon=\"icon-chevron-right\" style=\"color:#d6d5da;margin-right: 10px;\" class=\"icon s32\"></md-icon></p></md-button></md-list-item><md-divider></md-divider><md-list-item flex=\"\"><md-button class=\"md-grid-item-content\" flex=\"\" style=\"text-align:left;\"><p><md-icon md-svg-src=\"app/toolbar/images/history.svg\" class=\"icon s32\" ng-class=\"{\'active\':vm.is(\'app.szgc.report\')}\"></md-icon>历史纪录</p><p class=\"md-secondary\"><md-icon md-font-icon=\"icon-chevron-right\" style=\"color:#d6d5da;margin-right: 10px;\" class=\"icon s32\"></md-icon></p></md-button></md-list-item><md-divider></md-divider></md-list><div class=\"md-toolbar-tools bg note iconred\" style=\"border-bottom:1px solid #d6d5da;border-top:1px solid #d6d5da;height:50px;line-height: 50px;margin-top:10px;text-align:center;\"><h2 style=\"width:100%;color:#f00\"><md-icon md-svg-src=\"app/toolbar/images/del.svg\" md-font-icon=\"icon-chevron-right\" class=\"icon s32\"></md-icon>删除</h2></div></div>");
$templateCache.put("app/main/szgc/report/viewBath-app.html","<md-content flex=\"\" layout=\"column\" ng-show=\"!vm.searBarHide && vm.is(\'app.szgc.report.viewBath\')\" class=\"menu-toggle-list\"><div flex=\"\" style=\"overflow: auto\"><sxt-projects-jd ng-model=\"vm.project.pid\" object-scope=\"vm\" region-type=\"vm.project.type\" region-name=\"vm.project.typeName\" project-id=\"vm.project.projectId\" project-name=\"vm.project.projectName\" id-tree=\"vm.project.idTree\" name-tree=\"vm.project.nameTree\" is-more=\"vm.project.isMore\" on-queryed=\"vm.project.onQueryed\"><md-list><md-subheader>工序</md-subheader><md-list-item><sxt-procedure style=\"width:100%\" ng-model=\"vm.project.procedureId\" name-value=\"vm.project.procedureName\" region-type=\"vm.project.type\" class=\"md-block\"></sxt-procedure></md-list-item><md-list-item>班组</md-list-item><md-list-item><md-input-container style=\"width:100%\" class=\"md-block\" md-no-float=\"\"><label>班组</label> <input ng-model=\"vm.ddd.grpKey\"></md-input-container></md-list-item></md-list></sxt-projects-jd><div class=\"md-padding\" layout=\"row\"><md-button type=\"submit\" flex=\"\" ng-click=\"vm.searBarHide=true\" class=\"md-raised md-primary\">确定</md-button></div></div></md-content><md-content flex=\"\" class=\"md-padding\" ng-show=\"vm.searBarHide && vm.is(\'app.szgc.report.viewBath\')\" layout=\"column\"><md-virtual-repeat-container id=\"vertical-container\" flex=\"\"><md-card md-virtual-repeat=\"item in vm.baths.Rows | filter:{GrpName : ddd.grpKey}\" flex=\"\"><md-card-title><md-card-title-text><span class=\"md-headline\">{{ item.RegionNameTree}} {{item.RegionName}}</span><p>{{item.ProcedureName}}</p></md-card-title-text></md-card-title><md-card-content><md-list><md-list-item class=\"secondary-button-padding\"><p>班组</p><p class=\"md-secondary\">{{item.GrpWokerName | filterGrpWokerName}}</p></md-list-item><md-list-item class=\"secondary-button-padding\"><p>班组首验(%)</p><p class=\"md-secondary\">{{item.JLFirst}}</p></md-list-item><md-list-item class=\"secondary-button-padding\"><p>班组再验(%)</p><p class=\"md-secondary\">{{item.JLLast}}</p></md-list-item><md-list-item class=\"secondary-button-padding\"><p>监理员</p><p class=\"md-secondary\">{{item.JLUser}}</p></md-list-item><md-list-item class=\"secondary-button-padding\"><p>查验时间</p><p class=\"md-secondary\">{{item.JLDate}}</p></md-list-item><md-list-item class=\"secondary-button-padding\"><p>万科抽检(%)</p><p class=\"md-secondary\">{{item.WKLast}}</p></md-list-item><md-list-item class=\"secondary-button-padding\"><p>符合率(%)</p><p class=\"md-secondary\">{{item.AccordRatio}}</p></md-list-item><md-list-item class=\"secondary-button-padding\"><p>检查员</p><p class=\"md-secondary\">{{item.WKLastUser}}</p></md-list-item><md-list-item class=\"secondary-button-padding\"><p>查验时间</p><p class=\"md-secondary\">{{item.VKDate}}</p></md-list-item></md-list></md-card-content><md-card-actions layout=\"row\" layout-align=\"end center\"><md-button class=\"md-raised\" ui-sref=\"app.szgc.report.viewBath.view({bathid:item.Id})\">查看</md-button></md-card-actions></md-card></md-virtual-repeat-container></md-content><div style=\"position: absolute; top:0px; right:0px;\"><md-button class=\"md-fab md-mini\" ng-show=\"!vm.searBarHide && vm.isJdBack()\" ng-click=\"vm.backJdSelect()\"><md-icon md-font-icon=\"icon-arrow-left\"></md-icon></md-button><toggle-menu inst=\"vm.searBarHide\" ng-show=\"vm.is(\'app.szgc.report.viewBath\')\"></toggle-menu></div><md-content ui-view=\"\" flex=\"\" ng-if=\"!vm.is(\'app.szgc.report.viewBath\')\"></md-content>");
$templateCache.put("app/main/szgc/report/viewBathDetail-app.html","<div class=\"panel\" style=\"border-top-width:0;\"><div class=\"panel-body\"><h2>{{titol.ProcedureName}}验收记录表</h2></div><div class=\"table-responsive\"><div class=\"row\"><div class=\"col-lg-12 target2\"><table class=\"target\" width=\"100%\" border=\"1\" cellspacing=\"0\" cellpadding=\"4\" style=\"border-collapse: collapse;\"><tr><td width=\"13%\">单位(子单位)工程名称</td><td colspan=\"5\">{{titol.RegionNameTree}}</td></tr><tr><td>分项工程名称</td><td width=\"21%\">{{titol.ProcedureName}}</td><td width=\"20%\">检查日期</td><td>{{jlTitol.CheckDate}}</td><td>万科抽查日期</td><td>{{egTitol.CheckDate}}</td></tr><tr><td>验收部位</td><td>{{titol.RegionName}}</td><td>监理单位检查人</td><td width=\"13%\">{{jlTitol.CheckWorkerName}}</td><td width=\"16%\">万科抽查人</td><td width=\"17%\">{{egTitol.CheckWorkerName}}</td></tr><tr><td>总承包施工单位</td><td>{{titol.ParentCompanyName}}</td><td>施工单位负责人</td><td>{{jlTitol.CompanyName}}</td><td>施工班组负责人</td><td>{{titol.GrpName}}</td></tr></table><table class=\"target target2\" border=\"1\" cellspacing=\"0\" cellpadding=\"0\" style=\"border-collapse: collapse;width:100%;\"><tr><td style=\"padding:0;\"><table border=\"1\" cellspacing=\"0\" cellpadding=\"4\" style=\"border-collapse: collapse;width:100%;\"><tr><td style=\"width:50%\" rowspan=\"2\" colspan=\"{{data.selected.d.info.zyColLength+2}}\" align=\"center\">施工质量验收规范的规定</td><td style=\"width:50%\" colspan=\"2\" align=\"center\">检查评定记录</td></tr><tr><td colspan=\"2\"><ui-select ng-model=\"data.selected\" theme=\"bootstrap\" class=\"form-control\"><ui-select-match placeholder=\"请选择\">{{$select.selected.text}}</ui-select-match><ui-select-choices repeat=\"item in data.sources | propsFilter:{text: $select.search}\">{{item.text}}</ui-select-choices></ui-select></td></tr><tr ng-repeat=\"n in data.selected.d.zk\"><td rowspan=\"{{data.selected.d.info.zyCount()}}\" ng-if=\"$index==0\" align=\"center\" style=\"width:50px;\"><p>主</p><p>控</p><p>项</p><p>目</p></td><td align=\"center\" style=\"width:40px;\">{{$index+1}}</td><td ng-repeat=\"m in n.names\" ng-click=\"data.selected.d.info.zyColSelected=$index\" ng-if=\"m.rowspan!=0 && m.colspan!=0\" rowspan=\"{{m.rowspan||1}}\" colspan=\"{{m.colspan||1}}\">{{m.name}}</td><td style=\"width:40%\">{{n.Remark}}</td><td class=\"targettd\" style=\"width:150px; text-align:center;\">{{n.MPCheckValue==0?n.NoPassText:n.PassText}}</td></tr></table></td></tr><tr><td style=\"padding:0;\"><table border=\"1\" cellspacing=\"0\" cellpadding=\"4\" style=\"border-collapse: collapse;width:100%;\"><tr><td style=\"width:50px;\">&nbsp;</td><td style=\"width:40px;\">&nbsp;</td><td rowspan=\"2\" colspan=\"{{data.selected.d.info.ybColLength}}\">&nbsp; &nbsp; 项目<div class=\"clearfix\"></div></td><td width=\"91\" rowspan=\"2\" align=\"center\">允许偏差（mm）</td><td align=\"center\">检查点数</td><td align=\"center\">合格率</td><td align=\"center\">最大偏差</td><td rowspan=\"2\" align=\"center\">万科抽验</td><td rowspan=\"2\" align=\"center\">抽验符合率</td><td rowspan=\"2\" align=\"center\">备注</td></tr><tr><td></td><td></td><td colspan=\"3\" align=\"center\"><ui-select ng-model=\"data.selected\" theme=\"bootstrap\" class=\"form-control\"><ui-select-match placeholder=\"请选择\">{{$select.selected.text}}</ui-select-match><ui-select-choices repeat=\"item in data.sources | propsFilter:{text: $select.search}\">{{item.text}}</ui-select-choices></ui-select></td></tr><tr ng-repeat=\"n in data.selected.d.yb\"><td rowspan=\"{{data.selected.d.info.ybLength}}\" ng-if=\"$index==0\" align=\"center\"><p>一</p><p>般</p><p>项</p><p>目</p></td><td ng-class=\"{\'tdselectd\':n.selected}\" align=\"center\">{{$index+1}}</td><td ng-repeat=\"m in n.names\" ng-click=\"data.selected.d.info.ybColSelected=$index\" ng-if=\"m.rowspan!=0 && m.colspan!=0\" rowspan=\"{{m.rowspan||1}}\" colspan=\"{{m.colspan||1}}\">{{m.name}}</td><td style=\"width:150px\" align=\"center\"><span ng-if=\"n.getPassRatio\">平均合格率</span> {{n.DeviationLimit}}</td><td align=\"center\">{{n.CheckNum}}</td><td align=\"center\">{{n.PassRatio}}<span ng-if=\"n.getPassRatio\">{{n.ok()?\'合格\':\'不合格\'}}({{n.getPassRatio()|number:2}})</span></td><td align=\"center\">{{n.MaxDeviation}}</td><td align=\"center\">{{n.VKPassRatio}}</td><td align=\"center\">{{n.FHL}}</td><td align=\"center\"></td></tr><tr ng-if=\"data.selected.d.yb.length\"><td colspan=\"{{data.selected.d.yb[0].names.length+2}}\"></td><td style=\"width:150px\" align=\"center\"></td><td align=\"center\">主控：{{zkIsOk(data.selected.d.zk)?\"合格\":\"不合格\"}}</td><td align=\"center\">一般：{{ybIsOk(data.selected.d.yb)?\"合格\":\"不合格\"}}({{ybHGL(data.selected.d.yb)}}) 总体({{ybHGLPJ(data.selected.d.yb)|number:2}})</td><td align=\"center\">结果：{{zkIsOk(data.selected.d.zk)&&ybIsOk(data.selected.d.yb)?\"合格\":\"不合格\"}}</td><td align=\"center\"></td><td align=\"center\"></td><td align=\"center\"></td></tr></table></td></tr></table></div></div></div><div img-fancy=\"\"><fieldset sxt-image-view=\"\" is-container=\"true\"><legend>原验收表扫描件</legend><sxt-images ng-model=\"data.selected.step.GroupImg\" project=\"data.projectInfo\"></sxt-images></fieldset><fieldset sxt-image-view=\"\" is-container=\"true\"><legend>附件</legend><sxt-images ng-model=\"data.selected.step.GroupImg2\" project=\"data.projectInfo\"></sxt-images></fieldset></div></div>");
$templateCache.put("app/main/szgc/report/zgdetail.html","<md-list class=\"bg mb10\"><div ng-repeat=\"z in zg\"><md-list-item ui-sref=\"app.szgc.zgdetail({pid:z.pid,summary:z.summary,user:z.user})\"><div class=\"md-list-item-text\"><h3>亚奥 金茂悦一期>14栋>1802</h3><h4>提交时间：{{z.date}} &nbsp; 提交人：{{z.user}}</h4><p>整改原因：{{z.summary}}</p></div></md-list-item><md-divider></md-divider></div></md-list>");
$templateCache.put("app/main/szgc/report/zgdetail1.html","<div id=\"detail1\"><md-content flex=\"\" style=\"padding: 0 20px;\"><md-list><md-list-item><div flex=\"30\"><p>部位：</p></div><div flex=\"\" class=\"md-list-item-text\"><p>客厅</p></div></md-list-item><md-list-item><div flex=\"30\"><p>检查项：</p></div><div flex=\"\" class=\"md-list-item-text\"><p>检查项</p></div></md-list-item><md-list-item><div flex=\"30\"><p>问题：</p></div><div flex=\"\" class=\"md-list-item-text\"><p>{{p.summary}}</p></div></md-list-item><md-list-item><div flex=\"30\"><p>描述：</p></div><div flex=\"\" class=\"md-list-item-text\"><p>{{summary}}</p></div></md-list-item><md-divider></md-divider><md-list-item><div flex=\"30\"><p>照片：</p></div><div flex=\"\" class=\"md-list-item-text\"><p sxt-image-view=\"\" is-container=\"true\"><img width=\"100\" class=\"cimages\" ng-repeat=\"img in images\" ng-src=\"{{img.Url|fileurl}}\"></p></div></md-list-item><md-divider></md-divider><md-list-item><div flex=\"30\"><p>责任单位：</p></div><div flex=\"\" class=\"md-list-item-text\"><p>中建三局</p></div></md-list-item><md-list-item><div flex=\"30\"><p>抄送单位：</p></div><div flex=\"\" class=\"md-list-item-text\"><p>金建监理</p></div></md-list-item><md-list-item><div flex=\"30\"><p>注释：</p></div><div flex=\"\" class=\"md-list-item-text\"><p>注释文字</p></div></md-list-item></md-list></md-content><div style=\"background:#1f6db4;color:#fff;margin-top:10px;width:100%;text-align: center;padding-top:5px;\"><md-button ui-sref=\"app.szgc.view({pid:p.pid})\" flex=\"\">查看标注</md-button></div></div>");
$templateCache.put("app/main/szgc/settings/settings.html","<md-tabs md-border-bottom=\"\" flex=\"\" md-selected=\"vm.selectedIndex\"><md-tab label=\"系统设置\"><md-tab-content flex=\"\" layout-fill=\"\" layout=\"column\"><md-content flex=\"\"><md-list><md-subheader class=\"md-no-sticky\">个人信息</md-subheader><md-list-item ng-click=\"vm.selectedIndex=1\"><img alt=\"{{user.name}}\" src=\"app/main/szgc/settings/images/uesrinfo-icon@2x.png\" class=\"md-avatar\"><p>{{vm.profile.name}}</p><p class=\"md-secondary md-hue-3\">{{vm.profile.mobile}}</p></md-list-item><md-divider></md-divider><md-subheader class=\"md-no-sticky\">当前版本</md-subheader><md-list-item><p>版本</p><p class=\"md-secondary md-hue-3\">1.2.18</p></md-list-item><md-divider></md-divider><md-list-item><md-button flex=\"\" class=\"md-raised md-warn\" ui-sref=\"app.auth.login\">退出</md-button></md-list-item></md-list></md-content></md-tab-content></md-tab><md-tab label=\"个人信息\"><md-tab-content flex=\"\" layout-fill=\"\" layout=\"column\"><md-content flex=\"\"><md-list><md-subheader class=\"md-no-sticky\">个人信息</md-subheader><md-list-item><p>公司名称</p><p class=\"md-secondary\">{{vm.profile.corporation.name}}</p></md-list-item><md-list-item><p>员工姓名</p><p class=\"md-secondary\">{{vm.profile.name}}</p></md-list-item><md-list-item><p>显示名称</p><p class=\"md-secondary\">{{vm.profile.display_name}}</p></md-list-item><md-list-item><p>邮箱地址</p><p class=\"md-secondary\">{{vm.profile.email}}</p></md-list-item><md-list-item><p>帐号</p><p class=\"md-secondary\">{{vm.profile.loginname}}</p></md-list-item><md-list-item><p>手机号码</p><p class=\"md-secondary\">{{vm.profile.mobile}}</p></md-list-item></md-list></md-content></md-tab-content></md-tab></md-tabs>");
$templateCache.put("app/main/szgc/ys/addProcess-app.html","<md-content class=\"md-padding\"><form name=\"addForm\" class=\"form-horizontal\" ng-submit=\"save(addForm)\"><md-list><md-subheader class=\"md-no-sticky\">项目</md-subheader><md-list-item><p>项目{{data.projectName}} {{data.rName}}</p></md-list-item><md-subheader class=\"md-no-sticky\">工序</md-subheader><md-list-item><p>工序{{data.procedureName}}</p></md-list-item><md-subheader class=\"md-no-sticky\">监理单位</md-subheader><md-list-item layout=\"row\"><sxt-select flex=\"\" name=\"jldw\" ng-disabled=\"!data.isFirst\" required=\"\" ng-model=\"data.curHistory.SupervisorCompanyId\" name-value=\"data.curHistory.SupervisorCompanyName\" sources=\"data.construction\" text-field=\"UnitName\" value-field=\"UnitId\"></sxt-select></md-list-item><md-subheader class=\"md-no-sticky\">验收人</md-subheader><md-list-item layout=\"row\"><sxt-select flex=\"\" name=\"ysr\" required=\"\" ng-model=\"data.curStep.CheckWorker\" obj-value=\"data.submitUser\" name-value=\"data.curStep.CheckWorkerName\" sources=\"data.submitUsers\" text-field=\"name\" value-field=\"id\"></sxt-select></md-list-item><div ng-repeat=\"batch in data.batchs\"><md-subheader class=\"md-no-sticky\">{{$index==0?\'验收批\':\'\'}}</md-subheader><div class=\"col-sm-6 col-lg-7\"><div class=\"input-group\"><span class=\"input-group-addon\">验收批{{batch.BatchNo}}</span> <input type=\"text\" class=\"form-control\" ng-disabled=\"!data.isFirst\" ng-model=\"batch.Remark\" placeholder=\"验收批描述\"> <span class=\"input-group-addon\" ng-if=\"$index==0\">第{{batch.Count}}次验收</span> <span class=\"input-group-btn\" ng-if=\"$index!=0\"><button ng-click=\"removeBatch(batch)\" type=\"button\" class=\"btn btn-white\"><i class=\"fa fa-times\"></i></button></span></div></div></div><md-subheader class=\"md-no-sticky\">总承包</md-subheader><md-list-item layout=\"row\"><sxt-select flex=\"\" required=\"\" name=\"zid\" ng-model=\"data.curHistory.ParentCompanyId\" ng-disabled=\"!data.isFirst\" name-value=\"data.curHistory.ParentCompanyName\" sources=\"data.supervision1\" text-field=\"UnitName\" value-field=\"UnitId\"></sxt-select></md-list-item><md-subheader class=\"md-no-sticky\">专业承包</md-subheader><md-list-item layout=\"row\"><sxt-select flex=\"\" required=\"\" name=\"zid\" ng-model=\"data.curHistory.ParentCompanyId\" ng-disabled=\"!data.isFirst\" name-value=\"data.curHistory.ParentCompanyName\" sources=\"data.supervision1\" text-field=\"UnitName\" value-field=\"UnitId\"></sxt-select></md-list-item><md-subheader class=\"md-no-sticky\">施工班组</md-subheader><md-list-item layout=\"row\"><sxt-select flex=\"\" required=\"\" ng-model=\"data.curHistory.GrpId\" ng-disabled=\"!data.isFirst\" name=\"gid\" name-value=\"data.curHistory.GrpName\" sources=\"data.groups\" text-field=\"name\" value-field=\"id\"></sxt-select></md-list-item></md-list><div><div class=\"clearfix\"></div></div><fieldset><legend>验收件</legend><span class=\"fs-display-1 display-block\">原验收表扫描件</span><div><small></small></div><sxt-images ng-model=\"data.curStep.GroupImg\" files=\"data.pics\" project=\"data.projectInfo\" edit=\"true\"></sxt-images><div class=\"clearfix\"></div><span class=\"fs-display-1 display-block\">附件</span><div><small></small></div><sxt-images ng-model=\"data.curStep.GroupImg2\" project=\"data.projectInfo\" edit=\"true\"></sxt-images></fieldset><fieldset><legend>主控项目</legend><md-list><md-list-item ng-repeat=\"n in targets.zk\" ng-click=\"n.checked && (n.isOK=!n.isOK)\"><md-checkbox ng-model=\"n.checked\" ng-click=\"$event.stopPropagation()\"></md-checkbox><div class=\"md-list-item-text\" flex=\"\" ng-class=\"{\'text-disabled\':!n.checked}\" layout=\"column\"><h3>{{$index+1}}、{{n.TargetName}}</h3><p ng-if=\"n.Remark\">{{n.Remark}}</p></div><md-switch ng-disabled=\"!n.checked\" ng-click=\"$event.stopPropagation()\" ng-model=\"n.isOK\"></md-switch></md-list-item></md-list></fieldset><div class=\"h48\"></div><fieldset ng-if=\"targets.yb && targets.yb.length\"><legend>一般项目</legend><div ng-repeat=\"n in targets.yb\" ng-class=\"{\'bgc-red-A100\':!ybIsOkRow(n)}\"><h3 ng-class=\"{\'text-disabled\':!n.checked}\"><md-checkbox ng-model=\"n.checked\" ng-click=\"$event.stopPropagation()\"></md-checkbox>{{$index+1}}、{{n.TargetName}} 允许偏差（mm） :{{n.DeviationLimit}}</h3><md-input-container class=\"md-block\"><label>检查点数</label> <input type=\"number\" ng-disabled=\"!n.checked\" ng-model=\"n.CheckNum\"></md-input-container><md-input-container class=\"md-block\"><label>合格率</label> <input type=\"number\" ng-disabled=\"!n.checked\" step=\"0.01\" ng-model=\"n.PassRatio\"></md-input-container><md-input-container class=\"md-block\"><label>最大偏差</label> <input type=\"number\" ng-disabled=\"!n.checked\" step=\"0.01\" ng-model=\"n.MaxDeviation\"></md-input-container></div></fieldset><div layout=\"row\"><div>主控：{{zkIsOk()?\"合格\":\"不合格\"}};</div><div ng-if=\"targets.yb && targets.yb.length\">一般：{{ybIsOk()?\"合格\":\"不合格\"}}({{ybHGL()}}) 总体({{ybHGLPJ()}});</div><div class=\"col-md-2\">结果：{{zkIsOk()&&ybIsOk()?\"合格\":\"不合格\"}};</div></div><div class=\"md-padding\" layout=\"row\"><md-button type=\"submit\" flex=\"\" ng-disabled=\"isSaveing\" class=\"md-raised md-primary\">{{ isSaveing ?\'正在提交...\':\'提交\'}}</md-button></div></form><div style=\"position:fixed; top:0px; right:20px;\"><md-button class=\"md-fab md-mini\" ng-click=\"back()\"><md-icon md-font-icon=\"icon-arrow-left\"></md-icon></md-button></div></md-content>");
$templateCache.put("app/main/szgc/ys/myProcess-app.html","<md-tabs md-border-bottom=\"\" flex=\"\" layout=\"column\"><md-tab label=\"验收\"><md-tab-content flex=\"\" layout-full=\"\" fayout=\"column\"><md-content flex=\"\" ng-hide=\"is(\'app.szgc.ys.add\')\"><div class=\"menu-toggle-list\" ng-show=\"!vm.searBarHide\"><sxt-projects-jd ng-model=\"project.pid\" object-scope=\"vm\" region-type=\"project.type\" region-name=\"project.typeName\" project-id=\"project.projectId\" project-name=\"project.projectName\" id-tree=\"project.idTree\" name-tree=\"project.nameTree\" on-queryed=\"project.onQueryed\" is-more=\"project.isMore\"><md-list><md-subheader class=\"md-no-sticky\">工序</md-subheader><md-list-item><sxt-procedure style=\"width:100%\" ng-model=\"project.procedureId\" name-value=\"project.procedureName\" region-type=\"project.type\" class=\"md-block\"></sxt-procedure></md-list-item><md-divider></md-divider><md-subheader class=\"md-no-sticky\">验收状态</md-subheader><md-list-item ng-repeat=\"state in project.states\"><p>{{state.title}}({{state.c}})</p><md-checkbox class=\"md-secondary\" ng-click=\"checkState(state)\" ng-checked=\"state.selected\"></md-checkbox></md-list-item></md-list></sxt-projects-jd><div class=\"md-padding\" layout=\"row\"><md-button type=\"submit\" flex=\"\" ng-click=\"vm.searBarHide=true\" class=\"md-raised md-primary\">确定</md-button></div></div><div class=\"table-responsive\" ng-show=\"vm.searBarHide\"><table class=\"table table-striped datagrid m-b-small\"><thead><tr><th colspan=\"{{isPartner?9:12}}\">项目总数：{{project.data.results.length}}；已检查：{{project.data.checkedCount}}；已完成：{{project.data.cmpCount}}；未合格：{{project.data.checkedCount-project.data.cmpCount}}；未检查：{{project.data.total-project.data.checkedCount}}</th></tr><tr><th>部位</th><th>验收批</th><th>工序</th><th style=\"width: 50px;padding-left: 0px;padding-right: 0px;\">已验</th><th style=\"width: 90px;padding-left: 0px;padding-right: 0px;\">验收结果</th><th style=\"width: 65px;padding-left: 0px;padding-right: 0px;\">合格率(%)</th><th style=\"width: 80px;padding-left: 0px;padding-right: 0px;\">验收人</th><th style=\"width: 100px;padding-left: 0px;padding-right: 0px;\">最后检查</th><th ng-if=\"!isPartner\">万科</th><th ng-if=\"!isPartner\" style=\"width: 80px;padding-left: 0px;padding-right: 0px;\">抽查人</th><th ng-if=\"!isPartner\" style=\"width: 100px;padding-left: 0px;padding-right: 0px;\">抽查时间</th><th style=\"padding-left: 0px;padding-right: 0px;\" class=\"text-center\">操作</th></tr></thead><tbody><tr ng-repeat=\"item in project.rows\"><td>{{item.$name}}</td><td>{{item.BatchNo}}<span ng-if=\"item.Remark\">、{{item.Remark}}</span></td><td>{{project.procedureName}}</td><td>{{item.checkedCount==0?\'否\':item.checkedCount+\'次\'}}</td><td style=\"color:{{item.color}};\">{{item.stateName}}</td><td>{{item.MinPassRatio}}</td><td>{{item.CheckWorkerName}}</td><td>{{item.CheckDate}}</td><td ng-if=\"!isPartner\">{{item.MinPassRatio1}}</td><td ng-if=\"!isPartner\">{{item.CheckWorkerName1}}</td><td ng-if=\"!isPartner\">{{item.CheckDate1}}</td><td class=\"text-center\"><a class=\"btn btn-white btn-xs\" ng-if=\"isPartner\" ui-sref=\"app.szgc.ys.add({projectid:item.$id,name:item.$name,batchId:item.BatchRelationId,procedureId:project.procedureId,type:project.type,idTree:project.idTree,procedureName:project.procedureName,nameTree:project.nameTree})\">{{ item.checkedCount==0?\'录入\': \'复验\'}}</a> <a class=\"btn btn-white btn-xs\" ng-if=\"!isPartner && item.checkedCount && (!item.MinPassRatio1 || item.MinPassRatio1<80)\" ui-sref=\"app.szgc.ys.add({projectid:item.$id,name:item.$name,batchId:item.BatchRelationId,procedureId:project.procedureId,type:project.type,idTree:project.idTree,procedureName:project.procedureName,nameTree:project.nameTree})\">{{ item.CheckDate1?\'复验\': \'抽验\'}}</a> <a class=\"btn btn-white btn-xs\" ng-if=\"!isPartner && item.checkedCount && item.MinPassRatio1 && item.MinPassRatio1>=80\" ui-sref=\"app.szgc.report.viewBath.view({bathid:item.BatchRelationId})\" title=\"查看\"></a> <a class=\"btn btn-white btn-xs\" ng-if=\"isPartner\" ng-show=\"item.checkedCount\" ui-sref=\"app.szgc.ys.add({projectid:item.$id,name:item.$name,batchId:\'new\',procedureId:project.procedureId,type:project.type,idTree:project.idTree,procedureName:project.procedureName,nameTree:project.nameTree,flag:true,project_item_id:item.project_item_id})\">新增验收批</a></td></tr></tbody></table></div></md-content><div ng-show=\"is(\'app.szgc.ys\')\" style=\"position: absolute; top:0px; right:0px;z-index:99;\"><md-button class=\"md-fab md-mini\" ng-show=\"!vm.searBarHide && vm.isJdBack()\" ng-click=\"vm.backJdSelect()\"><md-icon md-font-icon=\"icon-arrow-left\"></md-icon></md-button><toggle-menu inst=\"vm.searBarHide\"></toggle-menu></div><ui-view flex=\"\" ng-show=\"is(\'app.szgc.ys.add\')\"></ui-view></md-tab-content></md-tab></md-tabs>");
$templateCache.put("app/main/szgc/ys/updateProcess.html","<section class=\"panel nt\"><form name=\"addForm\" class=\"form-horizontal\" ng-submit=\"save(addForm)\"><div class=\"panel-body\"><div class=\"row\"><div class=\"col-md-12\"><div class=\"form-group\"><label class=\"col-sm-2 col-lg-1 control-label\">项目</label><div class=\"col-sm-10 col-lg-11\"><p class=\"form-control-static\">{{data.projectName}} {{data.rName}}</p></div></div><div class=\"form-group\"><label class=\"col-sm-2 col-lg-1 control-label\">工序</label><div class=\"col-sm-10 col-lg-11\"><p class=\"form-control-static\">{{data.procedureName}}</p></div></div></div></div><div class=\"row\"><div class=\"col-md-6\"><div class=\"form-group\" ng-class=\"{\'has-error\':addForm.jldw.$invalid}\"><label class=\"col-sm-4 col-lg-2 control-label\">监理单位</label><div class=\"col-sm-8 col-lg-10\"><sxt-select name=\"jldw\" ng-disabled=\"!data.isFirst\" required=\"\" ng-model=\"data.curHistory.SupervisorCompanyId\" name-value=\"data.curHistory.SupervisorCompanyName\" sources=\"data.construction\" text-field=\"UnitName\" value-field=\"UnitId\"></sxt-select></div></div></div><div class=\"col-md-6\"><div class=\"form-group\" ng-class=\"{\'has-error\':addForm.ysr.$invalid}\"><label class=\"col-sm-4 col-lg-2 control-label\">验收人</label><div class=\"col-sm-8 col-lg-10\"><sxt-select name=\"ysr\" required=\"\" ng-model=\"data.curStep.CheckWorker\" obj-value=\"data.submitUser\" name-value=\"data.curStep.CheckWorkerName\" sources=\"data.submitUsers\" text-field=\"name\" value-field=\"id\"></sxt-select></div></div></div></div><div class=\"row\" ng-repeat=\"batch in data.batchs\"><div class=\"col-md-12\"><div class=\"form-group\"><label class=\"col-sm-2 col-lg-1 control-label\">{{$index==0?\'验收批\':\'\'}} <button ng-if=\"$index==0 && data.isFirst\" type=\"button\" ng-click=\"addBatch()\" class=\"btn btn-white btn-xs\"><i class=\"fa fa-plus\"></i></button></label><div class=\"col-sm-6 col-lg-7\"><div class=\"input-group\"><span class=\"input-group-addon\">验收批{{batch.BatchNo}}</span> <input type=\"text\" class=\"form-control\" ng-disabled=\"!data.isFirst\" ng-model=\"batch.Remark\" placeholder=\"验收批描述\"> <span class=\"input-group-addon\" ng-if=\"$index==0\">第{{batch.Count}}次验收</span> <span class=\"input-group-btn\" ng-if=\"$index!=0\"><button ng-click=\"removeBatch(batch)\" type=\"button\" class=\"btn btn-white\"><i class=\"fa fa-times\"></i></button></span></div></div><div class=\"col-sm-4 col-lg-4\"><div class=\"input-group\"><span class=\"input-group-addon\" id=\"basic-addon2\">完成占比</span> <input type=\"number\" class=\"form-control\" ng-disabled=\"!data.isFirst\" ng-keyup=\"changeBatch(batch)\" ng-model=\"batch.WorkRatio\" placeholder=\"数字(未填写为100)\"> <span class=\"input-group-addon\" id=\"basic-addon2\">%</span></div></div></div></div></div><div class=\"row\"><div class=\"col-md-4\"><div class=\"form-group\" ng-class=\"{\'has-error\':addForm.zid.$invalid}\"><label class=\"col-sm-6 col-lg-3 control-label\">总承包</label><div class=\"col-sm-6 col-lg-9\"><sxt-select required=\"\" name=\"zid\" ng-model=\"data.curHistory.ParentCompanyId\" ng-disabled=\"!data.isFirst\" name-value=\"data.curHistory.ParentCompanyName\" sources=\"data.supervision1\" text-field=\"UnitName\" value-field=\"UnitId\"></sxt-select></div></div></div><div class=\"col-md-4\"><div class=\"form-group\"><label class=\"col-sm-6 col-lg-3 control-label\">专业承包</label><div class=\"col-sm-6 col-lg-9\"><sxt-select ng-model=\"data.curHistory.CompanyId\" ng-disabled=\"!data.isFirst\" name-value=\"data.curHistory.CompanyName\" sources=\"data.supervision\" text-field=\"UnitName\" value-field=\"UnitId\"></sxt-select></div></div></div><div class=\"col-md-4\"><div class=\"form-group\" ng-class=\"{\'has-error\':addForm.gid.$invalid}\"><label class=\"col-sm-6 col-lg-3 control-label\">施工班组</label><div class=\"col-sm-6 col-lg-9\"><sxt-select required=\"\" ng-model=\"data.curHistory.GrpId\" ng-disabled=\"!data.isFirst\" name=\"gid\" name-value=\"data.curHistory.GrpName\" sources=\"data.groups\" text-field=\"name\" value-field=\"id\"></sxt-select></div></div></div></div></div><div><div class=\"clearfix\"></div></div><div class=\"panel-body\"><fieldset><legend>验收件</legend><span class=\"fs-display-1 display-block\">原验收表扫描件</span><div><small></small></div><sxt-images ng-model=\"data.curStep.GroupImg\" project=\"data.projectInfo\" edit=\"true\"></sxt-images><div class=\"clearfix\"></div><span class=\"fs-display-1 display-block\">附件</span><div><small></small></div><sxt-images ng-model=\"data.curStep.GroupImg2\" project=\"data.projectInfo\" edit=\"true\"></sxt-images></fieldset><fieldset><legend>主控项目</legend><div class=\"row\" ng-repeat=\"n in targets.zk\" lx-ripple=\"grey-200\" ng-click=\"n.isOK=!n.isOK\"><div class=\"col-sm-10\"><p class=\"h24\"><strong>{{$index+1}}、{{n.TargetName}}</strong><br ng-if=\"n.Remark\">{{n.Remark}}</p></div><div class=\"col-sm-2 h48\"><div class=\"switch\"><input type=\"checkbox\" ng-model=\"n.isOK\" id=\"id{{n.Id}}\" class=\"switch__input\"> <label class=\"switch__label\" for=\"id{{n.Id}}\">{{ n.isOK?\' 符合\':\'不符合\' }}</label></div></div></div></fieldset><div class=\"h48\"></div><fieldset><legend>一般项目</legend><div class=\"row hidden-xs\"><div class=\"col-md-4\" flex-item=\"4\"><div class=\"ml++\">项目</div></div><div class=\"col-md-2\">允许偏差（mm）</div><div class=\"col-md-2\">检查点数</div><div class=\"col-md-2\">合格率</div><div class=\"col-md-2\">最大偏差</div></div><div class=\"row\" ng-repeat=\"n in targets.yb\" ng-class=\"{\'bgc-red-A100\':!ybIsOkRow(n)}\"><div class=\"col-md-4\"><div class=\"h48\">{{$index+1}}、{{n.TargetName}}</div></div><div class=\"col-md-2\"><div class=\"h48\"><span class=\"hidden-lg\">允许偏差（mm）：</span> {{n.DeviationLimit}}</div></div><div class=\"col-md-2\"><lx-text-field label=\"检查点数\" fixed-label=\"true\"><input type=\"number\" ng-required=\"zkIsOk(n)\" ng-model=\"n.CheckNum\"></lx-text-field></div><div class=\"col-md-2\"><lx-text-field label=\"合格率\" fixed-label=\"true\"><input type=\"number\" ng-required=\"zkIsOk(n)\" ng-model=\"n.PassRatio\"></lx-text-field></div><div class=\"col-md-2\"><lx-text-field label=\"最大偏差\" fixed-label=\"true\"><input type=\"text\" ng-required=\"zkIsOk(n)\" ng-model=\"n.MaxDeviation\" ng-blur=\"ybBlur(n)\"></lx-text-field></div></div><div class=\"row\" flex-gutter=\"12\"><div class=\"col-md-4\" hide-sm=\"\"><div class=\"p+\"></div></div><div class=\"col-md-2\"><div class=\"p+\"></div></div><div class=\"col-md-2\"><div class=\"h48\">主控：{{zkIsOk()?\"合格\":\"不合格\"}}</div></div><div class=\"col-md-2\"><div class=\"h48\">一般：{{ybIsOk()?\"合格\":\"不合格\"}}({{ybHGL()}})</div></div><div class=\"col-md-2\"><div class=\"h48\">结果：{{zkIsOk()&&ybIsOk()?\"合格\":\"不合格\"}}</div></div></div></fieldset></div><div class=\"form-group\"><div class=\"col-sm-9 col-lg-10 col-sm-offset-2 col-lg-offset-1\"><button type=\"submit\" ng-disabled=\"isSaveing\" class=\"btn btn-white pull-right\">{{ isSaveing ?\'正在提交...\':\'提交\'}}</button></div></div></form></section>");
$templateCache.put("app/navigation/layouts/horizontal-navigation/navigation.html","<div layout=\"row\" layout-align=\"start center\"><ms-navigation-horizontal></ms-navigation-horizontal></div>");
$templateCache.put("app/navigation/layouts/vertical-navigation/navigation.html","<md-toolbar class=\"navigation-header md-whiteframe-1dp\" layout=\"row\" layout-align=\"space-between center\"><div class=\"logo\" layout=\"row\" layout-align=\"start center\"><span class=\"logo-image\"><img src=\"libs/leaflet/images/L.png\"></span> <span class=\"logo-text\">金茂质量平台</span></div><md-icon class=\"fold-toggle s18\" md-font-icon=\"icon-backburger\" hide=\"\" show-gt-sm=\"\" ng-click=\"vm.toggleMsNavigationFolded()\"></md-icon></md-toolbar><ms-navigation class=\"scrollable\" folded=\"vm.folded\" ms-scroll=\"vm.msScrollOptions\"></ms-navigation>");
$templateCache.put("app/quick-panel/tabs/activity/activity-tab.html","<md-list class=\"friends\"><md-subheader class=\"md-no-sticky\"><span translate=\"QUICKPANEL.FRIENDS\">Friends</span></md-subheader><md-list-item class=\"friend md-3-line\" ng-repeat=\"friend in vm.activities.friends\"><img ng-src=\"{{friend.avatar}}\" class=\"md-avatar\" alt=\"{{friend.name}}\"><div class=\"status {{friend.status}}\"></div><div ng-if=\"contact.unread\" class=\"md-accent-bg unread-message-count\">{{contact.unread}}</div><div class=\"md-list-item-text\"><h3 class=\"message\">{{friend.message}}</h3><p class=\"time\">{{friend.time}}</p></div></md-list-item></md-list><md-divider></md-divider><md-list class=\"servers\"><md-subheader class=\"md-no-sticky\"><span translate=\"QUICKPANEL.APP_SERVERS\">Application Servers</span></md-subheader><md-list-item class=\"server md-3-line\" ng-repeat=\"server in vm.activities.servers\"><md-icon md-font-icon=\"icon-checkbox-blank-circle\" class=\"s16 status\" ng-class=\"server.status\"></md-icon><div class=\"md-list-item-text\"><h3>{{server.location}}</h3><p>{{server.detail}}</p></div></md-list-item></md-list><md-divider></md-divider><md-list class=\"stats\"><md-subheader class=\"md-no-sticky\"><span translate=\"QUICKPANEL.USER_STATS\">User Stats</span></md-subheader><md-list-item class=\"stat md-2-line\" ng-repeat=\"stat in vm.activities.stats\"><div class=\"md-list-item-text\"><span>{{stat.title}} ({{stat.current}} / {{stat.total}})</span><md-progress-linear ng-class=\"stat.status\" md-mode=\"determinate\" value=\"{{stat.percent}}\"></md-progress-linear></div></md-list-item></md-list>");
$templateCache.put("app/quick-panel/tabs/chat/chat-tab.html","<div class=\"main animate-slide-left\" ng-hide=\"vm.chatActive\"><md-list class=\"recent\"><md-subheader class=\"md-no-sticky\"><span translate=\"QUICKPANEL.RECENT\">Recent</span></md-subheader><md-list-item class=\"contact md-3-line\" ng-repeat=\"contact in vm.contacts.recent\" ng-click=\"vm.toggleChat(contact)\"><img ng-src=\"{{contact.avatar}}\" class=\"md-avatar\" alt=\"{{contact.name}}\"><div class=\"status {{contact.status}}\"></div><div ng-if=\"contact.unread\" class=\"md-accent-bg unread-message-count\">{{contact.unread}}</div><div class=\"md-list-item-text\"><h3>{{contact.name}}</h3><p class=\"last-message\">{{contact.lastMessage}}</p></div></md-list-item></md-list><md-divider></md-divider><md-list class=\"all\"><md-subheader class=\"md-no-sticky\"><span translate=\"QUICKPANEL.START_NEW_CHAT\">Start New Chat</span></md-subheader><md-list-item class=\"contact\" ng-repeat=\"contact in vm.contacts.all\" ng-click=\"vm.toggleChat(contact)\"><img ng-src=\"{{contact.avatar}}\" class=\"md-avatar\" alt=\"{{contact.name}}\"><div class=\"status {{contact.status}}\"></div><div class=\"md-list-item-text\"><h3>{{contact.name}}</h3></div></md-list-item></md-list><md-divider></md-divider></div><div class=\"chat animate-slide-right\" ng-show=\"vm.chatActive\" layout=\"column\"><md-toolbar class=\"md-accent\"><div class=\"md-toolbar-tools\" layout=\"row\" layout-align=\"space-between center\"><div layout=\"row\" layout-align=\"start center\"><md-button class=\"md-icon-button\" ng-click=\"vm.toggleChat()\" aria-label=\"Back\" translate=\"\" translate-attr-aria-label=\"QUICKPANEL.BACK\"><md-icon md-font-icon=\"icon-keyboard-backspace\"></md-icon></md-button><h4><span>{{vm.chat.contact.name}}</span></h4></div><div layout=\"row\" layout-align=\"end center\"><md-button class=\"md-icon-button\" aria-label=\"Call\" translate=\"\" translate-attr-aria-label=\"QUICKPANEL.CALL\"><md-icon md-font-icon=\"icon-phone\"></md-icon></md-button><md-button class=\"md-icon-button\" aria-label=\"More\" translate=\"\" translate-attr-aria-label=\"QUICKPANEL.MORE\"><md-icon md-font-icon=\"icon-dots-vertical\"></md-icon></md-button></div></div></md-toolbar><md-content flex=\"\" layout-paddings=\"\" ms-scroll=\"\" id=\"chat-dialog\"><div layout=\"row\" ng-repeat=\"dialog in vm.chat.contact.dialog\" class=\"md-padding message-row\" ng-class=\"dialog.who\"><img ng-if=\"dialog.who ===\'contact\'\" ng-src=\"{{vm.chat.contact.avatar}}\" class=\"avatar\" alt=\"{{vm.chat.contact.name}}\"> <img ng-if=\"dialog.who ===\'user\'\" class=\"avatar\" src=\"assets/images/avatars/profile.jpg\"><div class=\"bubble\" flex=\"\"><div class=\"message\">{{dialog.message}}</div><div class=\"time secondary-text\">{{dialog.time}}</div></div></div></md-content><form ng-submit=\"vm.reply()\" layout=\"row\" class=\"reply\" layout-align=\"start center\"><textarea ng-keyup=\"$event.keyCode == 13 ? vm.reply() : null\" flex=\"\" ng-model=\"vm.replyMessage\" placeholder=\"Type and hit enter to send message\" translate=\"\" translate-attr-placeholder=\"QUICKPANEL.REPLY_PLACEHOLDER\"></textarea><md-button class=\"md-fab md-icon-button\" type=\"submit\" aria-label=\"Send message\" translate=\"\" translate-attr-aria-label=\"QUICKPANEL.SEND_MESSAGE\"><md-icon md-font-icon=\"icon-send\"></md-icon></md-button></form></div>");
$templateCache.put("app/quick-panel/tabs/today/today-tab.html","<md-list class=\"date\"><md-subheader class=\"md-no-sticky\"><span translate=\"QUICKPANEL.TODAY\">Today</span></md-subheader><md-list-item class=\"md-display-1 md-2-line\" layout=\"column\" layout-align=\"start start\"><div class=\"secondary-text\"><div>{{vm.date | date:\'EEEE\'}}</div><div layout=\"row\" layout-align=\"start start\"><span>{{vm.date | date:\'d\'}}</span> <span class=\"md-subhead\">th</span> <span>{{vm.date | date:\'MMMM\'}}</span></div></div></md-list-item></md-list><md-divider></md-divider><md-list><md-subheader class=\"md-no-sticky\"><span translate=\"QUICKPANEL.EVENTS\">Events</span></md-subheader><md-list-item class=\"md-2-line\" ng-repeat=\"event in vm.events\" ng-click=\"dummyFunction()\"><div class=\"md-list-item-text\"><h3>{{event.title}}</h3><p>{{event.detail}}</p></div></md-list-item></md-list><md-divider></md-divider><md-list><md-subheader class=\"md-no-sticky\"><span translate=\"QUICKPANEL.NOTES\">Notes</span></md-subheader><md-list-item class=\"md-2-line\" ng-repeat=\"note in vm.notes\" ng-click=\"dummyFunction()\"><div class=\"md-list-item-text\"><h3>{{note.title}}</h3><p>{{note.detail}}</p></div></md-list-item></md-list><md-divider></md-divider><md-list><md-subheader class=\"md-no-sticky\"><span translate=\"QUICKPANEL.QUICK_SETTINGS\">Quick Settings</span></md-subheader><md-list-item><h3 translate=\"QUICKPANEL.NOTIFICATIONS\">Notifications</h3><md-switch class=\"md-secondary\" ng-model=\"vm.settings.notify\" aria-label=\"Notifications\" translate=\"\" translate-attr-aria-label=\"QUICKPANEL.NOTIFICATIONS\"></md-switch></md-list-item><md-list-item><h3 translate=\"QUICKPANEL.CLOUD_SYNC\">Cloud Sync</h3><md-switch class=\"md-secondary\" ng-model=\"vm.settings.cloud\" aria-label=\"Cloud Sync\" translate=\"\" translate-attr-aria-label=\"QUICKPANEL.CLOUD_SYNC\"></md-switch></md-list-item><md-list-item><h3 translate=\"QUICKPANEL.RETRO_THRUSTERS\">Retro Thrusters</h3><md-switch class=\"md-secondary md-warn\" ng-model=\"vm.settings.retro\" aria-label=\"Retro Thrusters\" translate=\"\" translate-attr-aria-label=\"QUICKPANEL.RETRO_THRUSTERS\"></md-switch></md-list-item></md-list>");
$templateCache.put("app/toolbar/layouts/content-width-footbar/footbar.html","<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><title>Title</title></head><body></body></html>");
$templateCache.put("app/toolbar/layouts/content-with-footbar/footbar.html","<md-list flex=\"\" layout=\"row\"><md-list-item flex=\"\"><md-button ui-sref=\"app.szgc.home\" class=\"md-grid-item-content\" flex=\"\"><md-icon md-svg-src=\"app/toolbar/images/home1.svg\" class=\"icon s32\" ng-class=\"{\'active\':vm.is(\'app.szgc.home\')}\"></md-icon><div class=\"md-grid-text\" style=\"line-height: 20px\" ng-style=\"{\'color\':vm.is(\'app.szgc.home\')?\'#1f6db4\':\'rgba(0,0,0,0.54)\'}\">首页</div></md-button></md-list-item><md-list-item flex=\"\"><md-button ui-sref=\"app.szgc.choose\" class=\"md-grid-item-content ys\" flex=\"\"><md-icon md-svg-src=\"app/toolbar/images/yf2.svg\" class=\"icon s32\" ng-class=\"{\'active\':vm.is(\'app.szgc.choose\')}\"></md-icon><div class=\"md-grid-text\" style=\"line-height: 20px\" ng-style=\"{\'color\':vm.is(\'app.szgc.choose\')?\'#1f6db4\':\'rgba(0,0,0,0.54)\'}\">验收</div></md-button></md-list-item><md-list-item flex=\"\"><md-button ui-sref=\"app.szgc.zg\" class=\"md-grid-item-content\" flex=\"\"><md-icon md-svg-src=\"app/toolbar/images/zg1.svg\" class=\"icon s32\" ng-class=\"{\'active\':vm.is(\'app.szgc.zg\')}\"></md-icon><div class=\"md-grid-text\" style=\"line-height: 20px\" ng-style=\"{\'color\':vm.is(\'app.szgc.zg\')?\'#1f6db4\':\'rgba(0,0,0,0.54)\'}\">整改</div></md-button></md-list-item><md-list-item flex=\"\"><md-button ui-sref=\"app.szgc.settings\" class=\"md-grid-item-content\" flex=\"\"><md-icon md-svg-src=\"app/toolbar/images/me1.svg\" class=\"icon s32\" ng-class=\"{\'active\':vm.is(\'app.szgc.settings\')}\"></md-icon><div class=\"md-grid-text\" style=\"line-height: 20px\" ng-style=\"{\'color\':vm.is(\'app.szgc.settings\')?\'#1f6db4\':\'rgba(0,0,0,0.54)\'}\">我</div></md-button></md-list-item></md-list>");
$templateCache.put("app/toolbar/layouts/content-with-footbar/toptoolbar.html","<div class=\"md-toolbar-tools\"><md-icon md-font-icon=\"icon-chevron-left\" style=\"color:white;\" ng-click=\"goBack();\" class=\"icon s32\"></md-icon><h2><span>{{$root.title || \'金茂质量平台\'}}</span></h2><md-button style=\"color:white;position: absolute;top:0px;right:5px;\" ng-click=\"send($event)\" ng-show=\"showgz()\">发送</md-button><div style=\"position: absolute;top:5px;right:5px;\"><md-progress-circular id=\"toolbar-progress\" ng-if=\"$root.loadingProgress\" md-mode=\"indeterminate\" md-diameter=\"40\"></md-progress-circular></div></div>");
$templateCache.put("app/toolbar/layouts/horizontal-navigation/toolbar.html","<div layout=\"row\" layout-align=\"space-between center\"><div layout=\"row\" layout-align=\"start center\"><div class=\"navigation-toggle\" hide-gt-sm=\"\"><md-button class=\"md-icon-button\" ng-click=\"vm.toggleHorizontalMobileMenu()\" aria-label=\"Toggle Mobile Navigation\"><md-icon md-font-icon=\"icon-menu\"></md-icon></md-button></div><div class=\"logo\" layout=\"row\" layout-align=\"start center\"><span class=\"logo-image\">F</span> <span class=\"logo-text\">FUSE</span></div><md-progress-circular id=\"toolbar-progress\" ng-if=\"$root.loadingProgress\" class=\"md-accent\" md-mode=\"indeterminate\" md-diameter=\"64\"></md-progress-circular></div><div layout=\"row\" layout-align=\"start center\"><ms-search-bar></ms-search-bar><md-menu-bar id=\"user-menu\"><md-menu md-position-mode=\"left bottom\"><md-button class=\"user-button\" ng-click=\"$mdOpenMenu()\" aria-label=\"User settings\" translate=\"\" translate-attr-aria-label=\"TOOLBAR.USER_SETTINGS\"><div layout=\"row\" layout-align=\"space-between center\"><div class=\"avatar-wrapper\"><img md-menu-align-target=\"\" class=\"avatar\" src=\"assets/images/avatars/profile.jpg\"><md-icon md-font-icon=\"\" ng-class=\"vm.userStatus.icon\" ng-style=\"{\'color\': vm.userStatus.color }\" class=\"icon status s16\"></md-icon></div><span class=\"username\" hide-xs=\"\">John Doe</span><md-icon md-font-icon=\"icon-chevron-down\" class=\"icon s16\" hide-xs=\"\"></md-icon></div></md-button><md-menu-content width=\"3\"><md-menu-item class=\"md-indent\" ui-sref=\"app.pages_profile\"><md-icon md-font-icon=\"icon-account\" class=\"icon\"></md-icon><md-button>My Profile</md-button></md-menu-item><md-menu-item class=\"md-indent\" ui-sref=\"app.mail\"><md-icon md-font-icon=\"icon-email\" class=\"icon\"></md-icon><md-button>Inbox</md-button></md-menu-item><md-menu-item class=\"md-indent\"><md-icon md-font-icon=\"\" ng-class=\"vm.userStatus.icon\" ng-style=\"{\'color\': vm.userStatus.color }\" class=\"icon\"></md-icon><md-menu id=\"user-status-menu\"><md-button ng-click=\"$mdOpenMenu()\" class=\"status\" ng-class=\"vm.userStatus.class\">{{vm.userStatus.title}}</md-button><md-menu-content width=\"2\"><md-menu-item class=\"status md-indent\" ng-class=\"{\'selected\': status === vm.userStatus}\" ng-repeat=\"status in vm.userStatusOptions\"><md-icon md-font-icon=\"{{status.icon}}\" ng-style=\"{\'color\': status.color }\" class=\"icon\"></md-icon><md-button ng-click=\"vm.setUserStatus(status)\">{{status.title}}</md-button></md-menu-item></md-menu-content></md-menu></md-menu-item><md-menu-divider></md-menu-divider><md-menu-item class=\"md-indent\"><md-icon md-font-icon=\"icon-logout\" class=\"icon\"></md-icon><md-button ng-click=\"vm.logout()\">Logout</md-button></md-menu-item></md-menu-content></md-menu></md-menu-bar><md-menu id=\"language-menu\" md-offset=\"0 72\" md-position-mode=\"target-right target\"><md-button class=\"language-button\" ng-click=\"$mdOpenMenu()\" aria-label=\"Language\" md-menu-origin=\"\" md-menu-align-target=\"\"><div layout=\"row\" layout-align=\"center center\"><img class=\"flag\" ng-src=\"assets/images/flags/{{vm.selectedLanguage.flag}}.png\"> <span class=\"iso\">{{vm.selectedLanguage.code}}</span></div></md-button><md-menu-content width=\"3\" id=\"language-menu-content\"><md-menu-item ng-repeat=\"(iso, lang) in vm.languages\"><md-button ng-click=\"vm.changeLanguage(lang)\" aria-label=\"{{lang.title}}\" translate=\"\" translate-attr-aria-label=\"{{lang.title}}\"><span layout=\"row\" layout-align=\"start center\"><img class=\"flag\" ng-src=\"assets/images/flags/{{lang.flag}}.png\"> <span translate=\"{{lang.translation}}\">{{lang.title}}</span></span></md-button></md-menu-item></md-menu-content></md-menu><md-button id=\"quick-panel-toggle\" class=\"md-icon-button\" ng-click=\"vm.toggleSidenav(\'quick-panel\')\" aria-label=\"Toggle quick panel\" translate=\"\" translate-attr-aria-label=\"TOOLBAR.TOGGLE_QUICK_PANEL\"><md-icon md-font-icon=\"icon-format-list-bulleted\" class=\"icon\"></md-icon></md-button></div></div>");
$templateCache.put("app/toolbar/layouts/content-with-toolbar/toolbar.html","<div layout=\"row\" layout-align=\"space-between center\"><div layout=\"row\" layout-align=\"start center\"><div class=\"logo\" layout=\"row\" layout-align=\"start center\"><span class=\"logo-image\">F</span> <span class=\"logo-text\">FUSE</span></div><md-progress-circular id=\"toolbar-progress\" ng-if=\"$root.loadingProgress\" class=\"md-accent\" md-mode=\"indeterminate\" md-diameter=\"64\"></md-progress-circular></div><div layout=\"row\" layout-align=\"start center\"><div class=\"toolbar-separator\"></div><ms-search-bar></ms-search-bar><div class=\"toolbar-separator\"></div><md-menu-bar id=\"user-menu\"><md-menu md-position-mode=\"left bottom\"><md-button class=\"user-button\" ng-click=\"$mdOpenMenu()\" aria-label=\"User settings\" translate=\"\" translate-attr-aria-label=\"TOOLBAR.USER_SETTINGS\"><div layout=\"row\" layout-align=\"space-between center\"><div class=\"avatar-wrapper\"><img md-menu-align-target=\"\" class=\"avatar\" src=\"assets/images/avatars/profile.jpg\"><md-icon md-font-icon=\"\" ng-class=\"vm.userStatus.icon\" ng-style=\"{\'color\': vm.userStatus.color }\" class=\"icon status s16\"></md-icon></div><span class=\"username\" hide-xs=\"\">John Doe</span><md-icon md-font-icon=\"icon-chevron-down\" class=\"icon s16\" hide-xs=\"\"></md-icon></div></md-button><md-menu-content width=\"3\"><md-menu-item class=\"md-indent\" ui-sref=\"app.pages_profile\"><md-icon md-font-icon=\"icon-account\" class=\"icon\"></md-icon><md-button>My Profile</md-button></md-menu-item><md-menu-item class=\"md-indent\" ui-sref=\"app.mail\"><md-icon md-font-icon=\"icon-email\" class=\"icon\"></md-icon><md-button>Inbox</md-button></md-menu-item><md-menu-item class=\"md-indent\"><md-icon md-font-icon=\"\" ng-class=\"vm.userStatus.icon\" ng-style=\"{\'color\': vm.userStatus.color }\" class=\"icon\"></md-icon><md-menu id=\"user-status-menu\"><md-button ng-click=\"$mdOpenMenu()\" class=\"status\" ng-class=\"vm.userStatus.class\">{{vm.userStatus.title}}</md-button><md-menu-content width=\"2\"><md-menu-item class=\"status md-indent\" ng-class=\"{\'selected\': status === vm.userStatus}\" ng-repeat=\"status in vm.userStatusOptions\"><md-icon md-font-icon=\"{{status.icon}}\" ng-style=\"{\'color\': status.color }\" class=\"icon\"></md-icon><md-button ng-click=\"vm.setUserStatus(status)\">{{status.title}}</md-button></md-menu-item></md-menu-content></md-menu></md-menu-item><md-menu-divider></md-menu-divider><md-menu-item class=\"md-indent\"><md-icon md-font-icon=\"icon-logout\" class=\"icon\"></md-icon><md-button ng-click=\"vm.logout()\">Logout</md-button></md-menu-item></md-menu-content></md-menu></md-menu-bar><div class=\"toolbar-separator\"></div><md-menu id=\"language-menu\" md-offset=\"0 72\" md-position-mode=\"target-right target\"><md-button class=\"language-button\" ng-click=\"$mdOpenMenu()\" aria-label=\"Language\" md-menu-origin=\"\" md-menu-align-target=\"\"><div layout=\"row\" layout-align=\"center center\"><img class=\"flag\" ng-src=\"assets/images/flags/{{vm.selectedLanguage.flag}}.png\"> <span class=\"iso\">{{vm.selectedLanguage.code}}</span></div></md-button><md-menu-content width=\"3\" id=\"language-menu-content\"><md-menu-item ng-repeat=\"(iso, lang) in vm.languages\"><md-button ng-click=\"vm.changeLanguage(lang)\" aria-label=\"{{lang.title}}\" translate=\"\" translate-attr-aria-label=\"{{lang.title}}\"><span layout=\"row\" layout-align=\"start center\"><img class=\"flag\" ng-src=\"assets/images/flags/{{lang.flag}}.png\"> <span translate=\"{{lang.translation}}\">{{lang.title}}</span></span></md-button></md-menu-item></md-menu-content></md-menu><div class=\"toolbar-separator\"></div><md-button id=\"quick-panel-toggle\" class=\"md-icon-button\" ng-click=\"vm.toggleSidenav(\'quick-panel\')\" aria-label=\"Toggle quick panel\" translate=\"\" translate-attr-aria-label=\"TOOLBAR.TOGGLE_QUICK_PANEL\"><md-icon md-font-icon=\"icon-format-list-bulleted\" class=\"icon\"></md-icon></md-button></div></div>");
$templateCache.put("app/toolbar/layouts/vertical-navigation/toolbar.html","<div layout=\"row\" layout-align=\"start center\"><div layout=\"row\" layout-align=\"start center\" flex=\"\"><md-button id=\"navigation-toggle\" class=\"md-icon-button\" ng-click=\"vm.toggleSidenav(\'navigation\')\" hide-gt-sm=\"\" aria-label=\"Toggle navigation\" translate=\"\" translate-attr-aria-label=\"TOOLBAR.TOGGLE_NAVIGATION\"><md-icon md-font-icon=\"icon-menu\" class=\"icon\"></md-icon></md-button><ms-search-bar></ms-search-bar><div class=\"toolbar-separator\"></div><md-progress-circular id=\"toolbar-progress\" ng-if=\"$root.loadingProgress\" class=\"md-accent\" md-mode=\"indeterminate\" md-diameter=\"64\"></md-progress-circular></div><div layout=\"row\" layout-align=\"start center\"><md-menu-bar id=\"user-menu\"><md-menu md-position-mode=\"left bottom\"><md-button class=\"user-button\" ng-click=\"$mdOpenMenu()\" aria-label=\"User settings\" translate=\"\" translate-attr-aria-label=\"TOOLBAR.USER_SETTINGS\"><div layout=\"row\" layout-align=\"space-between center\"><div class=\"avatar-wrapper\"><img md-menu-align-target=\"\" class=\"avatar\" src=\"assets/images/avatars/profile.jpg\"><md-icon md-font-icon=\"\" ng-class=\"vm.userStatus.icon\" ng-style=\"{\'color\': vm.userStatus.color }\" class=\"icon status s16\"></md-icon></div><span class=\"username\" hide-xs=\"\">{{vm.user.Username}}</span><md-icon md-font-icon=\"icon-chevron-down\" class=\"icon s16\" hide-xs=\"\"></md-icon></div></md-button><md-menu-content width=\"3\"><md-menu-item class=\"md-indent\" ui-sref=\"app.pages_profile\"><md-icon md-font-icon=\"icon-account\" class=\"icon\"></md-icon><md-button>个人信息</md-button></md-menu-item><md-menu-item class=\"md-indent\" ui-sref=\"app.mail\"><md-icon md-font-icon=\"icon-email\" class=\"icon\"></md-icon><md-button>收件箱</md-button></md-menu-item><md-menu-item class=\"md-indent\"><md-icon md-font-icon=\"\" ng-class=\"vm.userStatus.icon\" ng-style=\"{\'color\': vm.userStatus.color }\" class=\"icon\"></md-icon><md-menu id=\"user-status-menu\"><md-button ng-click=\"$mdOpenMenu()\" class=\"status\" ng-class=\"vm.userStatus.class\">{{vm.userStatus.title}}</md-button><md-menu-content width=\"2\"><md-menu-item class=\"status md-indent\" ng-class=\"{\'selected\': status === vm.userStatus}\" ng-repeat=\"status in vm.userStatusOptions\"><md-icon md-font-icon=\"{{status.icon}}\" ng-style=\"{\'color\': status.color }\" class=\"icon\"></md-icon><md-button ng-click=\"vm.setUserStatus(status)\">{{status.title}}</md-button></md-menu-item></md-menu-content></md-menu></md-menu-item><md-menu-divider></md-menu-divider><md-menu-item class=\"md-indent\"><md-icon md-font-icon=\"icon-logout\" class=\"icon\"></md-icon><md-button ng-click=\"vm.logout()\">退出</md-button></md-menu-item></md-menu-content></md-menu></md-menu-bar></div></div>");
$templateCache.put("app/core/directives/ms-navigation/templates/horizontal.html","<div class=\"navigation-toggle\" hide-gt-sm=\"\"><md-button class=\"md-icon-button\" ng-click=\"vm.toggleHorizontalMobileMenu()\" aria-label=\"Toggle Mobile Navigation\"><md-icon md-font-icon=\"icon-menu\"></md-icon></md-button></div><ul class=\"horizontal\"><li ng-repeat=\"node in vm.navigation\" ms-navigation-horizontal-node=\"node\" ng-class=\"{\'has-children\': vm.hasChildren}\" ng-include=\"\'navigation-horizontal-nested.html\'\"></li></ul><script type=\"text/ng-template\" id=\"navigation-horizontal-nested.html\"><div ms-navigation-horizontal-item layout=\"row\"> <div class=\"ms-navigation-horizontal-button\" ng-if=\"!node.uisref && node.title\" ng-class=\"{\'active md-accent-bg\': vm.isActive}\"> <i class=\"icon s18 {{node.icon}}\" ng-if=\"node.icon\"></i> <span class=\"title\" translate=\"{{node.translate}}\" flex>{{node.title}}</span> <span class=\"badge white-fg\" style=\"background: {{node.badge.color}}\" ng-if=\"node.badge\">{{node.badge.content}}</span> <i class=\"icon-chevron-right s18 arrow\" ng-if=\"vm.hasChildren\"></i> </div> <a class=\"ms-navigation-horizontal-button\" ui-sref=\"{{node.uisref}}\" ui-sref-active=\"active md-accent-bg\" ng-class=\"{\'active md-accent-bg\': vm.isActive}\" ng-if=\"node.uisref && node.title\"> <i class=\"icon s18 {{node.icon}}\" ng-if=\"node.icon\"></i> <span class=\"title\" translate=\"{{node.translate}}\" flex>{{node.title}}</span> <span class=\"badge white-fg\" style=\"background: {{node.badge.color}}\" ng-if=\"node.badge\">{{node.badge.content}}</span> <i class=\"icon-chevron-right s18 arrow\" ng-if=\"vm.hasChildren\"></i> </a> </div> <ul ng-if=\"vm.hasChildren\"> <li ng-repeat=\"node in node.children\" ms-navigation-horizontal-node=\"node\" ng-class=\"{\'has-children\': vm.hasChildren}\" ng-include=\"\'navigation-horizontal-nested.html\'\"></li> </ul></script>");
$templateCache.put("app/core/directives/ms-navigation/templates/vertical.html","<ul><li ng-repeat=\"node in vm.navigation\" ms-navigation-node=\"node\" ng-class=\"{\'collapsed\': vm.collapsed, \'has-children\': vm.hasChildren}\" ng-include=\"\'navigation-nested.html\'\"></li></ul><script type=\"text/ng-template\" id=\"navigation-nested.html\"><div ms-navigation-item layout=\"row\"> <div class=\"ms-navigation-button\" ng-if=\"!node.uisref && node.title\"> <i class=\"icon s16 {{node.icon}}\" ng-if=\"node.icon\"></i> <span class=\"title\" translate=\"{{node.translate}}\" flex>{{node.title}}</span> <span class=\"badge white-fg\" ng-style=\"{\'background\': node.badge.color}\" ng-if=\"node.badge\">{{node.badge.content}}</span> <i class=\"icon-chevron-right s16 arrow\" ng-if=\"vm.collapsable && vm.hasChildren\"></i> </div> <a class=\"ms-navigation-button\" ui-sref=\"{{node.uisref}}\" ui-sref-active=\"active md-accent-bg\" ng-if=\"node.uisref && node.title\"> <i class=\"icon s16 {{node.icon}}\" ng-if=\"node.icon\"></i> <span class=\"title\" translate=\"{{node.translate}}\" flex>{{node.title}}</span> <span class=\"badge white-fg\" ng-style=\"{\'background\': node.badge.color}\" ng-if=\"node.badge\">{{node.badge.content}}</span> <i class=\"icon-chevron-right s16 arrow\" ng-if=\"vm.collapsable && vm.hasChildren\"></i> </a> </div> <ul ng-if=\"vm.hasChildren\"> <li ng-repeat=\"node in node.children\" ms-navigation-node=\"node\" ng-class=\"{\'collapsed\': vm.collapsed, \'has-children\': vm.hasChildren}\" ng-include=\"\'navigation-nested.html\'\"></li> </ul></script>");
$templateCache.put("app/core/directives/ms-card/templates/template-1/template-1.html","<div class=\"template-1\"><div class=\"media\"><img class=\"image\" ng-src=\"{{card.media.image.src}}\" alt=\"{{card.media.image.alt}}\" ng-show=\"card.media.image\"></div><div class=\"content pv-24 ph-16\"><div class=\"title h1\" ng-if=\"card.title\">{{card.title}}</div><div class=\"subtitle secondary-text\" ng-if=\"card.subtitle\">{{card.subtitle}}</div><div class=\"text pt-16\" ng-if=\"card.text\">{{card.text}}</div></div></div>");
$templateCache.put("app/core/directives/ms-card/templates/template-10/template-10.html","<div class=\"template-10 p-16\"><div class=\"pb-16\" layout=\"row\" layout-align=\"space-between center\"><div class=\"info\"><div class=\"title secondary-text\" ng-if=\"card.title\">{{card.title}}</div><div class=\"subtitle h2\" ng-if=\"card.subtitle\">{{card.subtitle}}</div></div><div class=\"media ml-16\"><img class=\"image\" ng-src=\"{{card.media.image.src}}\" alt=\"{{card.media.image.alt}}\" ng-show=\"card.media.image\"></div></div><div class=\"text\">{{card.text}}</div></div>");
$templateCache.put("app/core/directives/ms-card/templates/template-2/template-2.html","<div class=\"template-2\"><div class=\"header p-16\" layout=\"row\" layout-align=\"start center\"><div ng-if=\"card.avatar\"><img class=\"avatar mr-16\" ng-src=\"{{card.avatar.src}}\" alt=\"{{card.avatar.alt}}\"></div><div class=\"info\"><div class=\"title\" ng-if=\"card.title\">{{card.title}}</div><div class=\"subtitle secondary-text\" ng-if=\"card.subtitle\">{{card.subtitle}}</div></div></div><div class=\"media\"><img class=\"image\" ng-src=\"{{card.media.image.src}}\" alt=\"{{card.media.image.alt}}\" ng-show=\"card.media.image\"></div><div class=\"text p-16\" ng-if=\"card.text\">{{card.text}}</div></div>");
$templateCache.put("app/core/directives/ms-card/templates/template-3/template-3.html","<div class=\"template-3 p-16 teal-bg white-fg\" layout=\"row\" layout-align=\"space-between\"><div layout=\"column\" layout-align=\"space-between\"><div class=\"info\"><div class=\"title h1\" ng-if=\"card.title\">{{card.title}}</div><div class=\"subtitle h3 secondary-text\" ng-if=\"card.subtitle\">{{card.subtitle}}</div></div><div class=\"cta\"><md-button class=\"m-0\">{{card.cta}}</md-button></div></div><div class=\"media pl-16\"><img class=\"image\" ng-src=\"{{card.media.image.src}}\" alt=\"{{card.media.image.alt}}\" ng-show=\"card.media.image\"></div></div>");
$templateCache.put("app/core/directives/ms-card/templates/template-4/template-4.html","<div class=\"template-4\"><div class=\"info white-fg ph-16 pv-24\"><div class=\"title h1\" ng-if=\"card.title\">{{card.title}}</div><div class=\"text\" ng-if=\"card.text\">{{card.text}}</div></div><div class=\"media\"><img class=\"image\" ng-src=\"{{card.media.image.src}}\" alt=\"{{card.media.image.alt}}\" ng-show=\"card.media.image\"></div></div>");
$templateCache.put("app/core/directives/ms-card/templates/template-5/template-5.html","<div class=\"template-5 p-16\" layout=\"row\" layout-align=\"space-between start\"><div class=\"info\"><div class=\"title secondary-text\" ng-if=\"card.title\">{{card.title}}</div><div class=\"event h2\" ng-if=\"card.event\">{{card.event}}</div></div><div class=\"media ml-16\"><img class=\"image\" ng-src=\"{{card.media.image.src}}\" alt=\"{{card.media.image.alt}}\" ng-show=\"card.media.image\"></div></div>");
$templateCache.put("app/core/directives/ms-card/templates/template-6/template-6.html","<div class=\"template-6\"><div class=\"content pv-24 ph-16\"><div class=\"subtitle secondary-text\" ng-if=\"card.subtitle\">{{card.subtitle}}</div><div class=\"title h2\" ng-if=\"card.title\">{{card.title}}</div><div class=\"text pt-8\" ng-if=\"card.text\">{{card.text}}</div></div></div>");
$templateCache.put("app/core/directives/ms-card/templates/template-7/template-7.html","<div class=\"template-7\" layout=\"row\" layout-align=\"space-between\"><div class=\"info\" layout=\"column\" layout-align=\"space-between\" layout-fill=\"\" flex=\"\"><div class=\"p-16\"><div class=\"title h1\" ng-if=\"card.title\">{{card.title}}</div><div class=\"subtitle h4 secondary-text\" ng-if=\"card.subtitle\">{{card.subtitle}}</div><div class=\"text h4 pt-8\" ng-if=\"card.text\">{{card.text}}</div></div><div><md-divider></md-divider><div class=\"p-8\" layout=\"row\"><md-icon md-font-icon=\"icon-star-outline\" class=\"mh-5\"></md-icon><md-icon md-font-icon=\"icon-star-outline\" class=\"mh-5\"></md-icon><md-icon md-font-icon=\"icon-star-outline\" class=\"mh-5\"></md-icon><md-icon md-font-icon=\"icon-star-outline\" class=\"mh-5\"></md-icon><md-icon md-font-icon=\"icon-star-outline\" class=\"mh-5\"></md-icon></div></div></div><div class=\"media\"><img class=\"image\" ng-src=\"{{card.media.image.src}}\" alt=\"{{card.media.image.alt}}\" ng-show=\"card.media.image\"></div></div>");
$templateCache.put("app/core/directives/ms-card/templates/template-8/template-8.html","<div class=\"template-8\"><div class=\"media\"><img class=\"image\" ng-src=\"{{card.media.image.src}}\" alt=\"{{card.media.image.alt}}\" ng-show=\"card.media.image\"></div><div class=\"content pv-24 ph-16\"><div class=\"title h1\" ng-if=\"card.title\">{{card.title}}</div><div class=\"subtitle secondary-text\" ng-if=\"card.subtitle\">{{card.subtitle}}</div><div class=\"buttons pt-16\"><md-button class=\"m-0\">{{card.button1}}</md-button><md-button class=\"m-0 md-accent\">{{card.button2}}</md-button></div><div class=\"text pt-16\" ng-if=\"card.text\">{{card.text}}</div></div></div>");
$templateCache.put("app/core/directives/ms-card/templates/template-9/template-9.html","<div class=\"template-9\"><div class=\"header p-16\" layout=\"row\" layout-align=\"start center\"><div ng-if=\"card.avatar\"><img class=\"avatar mr-16\" ng-src=\"{{card.avatar.src}}\" alt=\"{{card.avatar.alt}}\"></div><div class=\"info\"><div class=\"title\" ng-if=\"card.title\">{{card.title}}</div><div class=\"subtitle secondary-text\" ng-if=\"card.subtitle\">{{card.subtitle}}</div></div></div><div class=\"text ph-16 pb-16\" ng-if=\"card.text\">{{card.text}}</div><div class=\"media\"><img class=\"image\" ng-src=\"{{card.media.image.src}}\" alt=\"{{card.media.image.alt}}\" ng-show=\"card.media.image\"></div><div class=\"buttons m-8\"><md-button class=\"md-icon-button mr-16\" aria-label=\"Favorite\"><md-icon md-font-icon=\"icon-heart-outline\" class=\"s24\"></md-icon></md-button><md-button class=\"md-icon-button\" aria-label=\"Share\"><md-icon md-font-icon=\"icon-share\" class=\"s24\"></md-icon></md-button></div></div>");}]);