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
 * Created by jiuyuong on 2016/3/30.
 */
(function(){
  'use strict';

  config.$inject = ["$stateProvider", "$translatePartialLoaderProvider", "msNavigationServiceProvider"];
  angular
    .module('app.xhsc', ['app.core','ngCordova'])
    .config(config);

  /** @ngInject */
  function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
  {
    // State
    $stateProvider
      .state('app.xhsc', {
        abstract:true
      })
      .state('app.xhsc.home',{
        noBack:true,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        title :'工程管理',
        url   :'/',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/home/home.html',
            controller:'HomeController as vm'
          }
        }
      })
      .state('app.xhsc.ch2',{
        noBack:true,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        title :'实测实量',
        url   :'/choose',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/ys/ch2.html',
            controller:'ChooseController as vm'
          }
        }
      })
      //.state('app.xhsc.choose',{
      //  noBack:true,
      //  sendBt:false,
      //  rightArrow:false,
      //  leftArrow:false,
      //  title :'实测实量',
      //  url   :'/choose',
      //  views :{
      //    'content@app':{
      //      templateUrl : 'app/main/xhsc/ys/choose.html',
      //      controller:'ChooseController as vm'
      //    }
      //  }
      //})
      .state('app.xhsc.chooseHouse',{
        noBack:true,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        title :'抹灰工程',
        url   :'/chooseHouse/{id}/{areaId}/{pname}',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/ys/chooseHouse.html',
            controller:'ChooseHouseController as vm'
          }
        }
      })
      .state('app.xhsc.download',{
        noBack:true,
        sendBt:false,
        refreshBtn:true,
        rightArrow:false,
        leftArrow:false,
        title :'现场评估',
        url   :'/download',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/ys/download.html',
            controller:'downloadController as vm'
          }
        }
      })
      .state('app.xhsc.xcpk',{
        noBack:true,
        sendBt:false,
        refreshBtn:false,
        rightArrow:false,
        leftArrow:false,
        title :'现场评估',
        url   :'/xcpk',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/ys/ddetail.html',
            controller:'downdetailController as vm'
          }
        }
      })
      .state('app.xhsc.evaluate',{
        noBack:true,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        title :'评估',
        url   :'/evaluate',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/ys/evaluate.html',
            controller:'evaluateController as vm'
          }
        }
      })
      .state('app.xhsc.evaluatelist',{
        noBack:true,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        url   :'/list',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/ys/evaluatelist.html',
            controller:'evaluatelistController as vm'
          }
        }
      })
      .state('app.xhsc.check',{
        noBack:true,
        sendBt:false,
        rightArrow:true,
        leftArrow:true,
        url   :'/check',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/ys/checkHouse.html',
            controller:'checkHouseController as vm'
          }
        }
      })
      .state('app.xhsc.sc',{
        noBack:false,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        title :'实测',
        url   :'/sc/{areaId}/{acceptanceItemID}/{regionId}/{regionType}/{name}/{pname}',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/ys/sc.html',
            controller:'scController as vm'
          }
        }
      })
      .state('app.xhsc.sc2',{
        noBack:true,
        sendBt:true,
        rightArrow:false,
        leftArrow:false,
        title :'实测',
        url   :'/sc2/{areaId}/{acceptanceItemID}/{regionId}/{regionType}/{name}/{pname}',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/ys/sc2.html',
            controller:'sc2Controller as vm'
          }
        }
      })
      .state('app.xhsc.scv',{
        noBack:false,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        title :'实测查看',
        url   :'/scv/{areaId}/{acceptanceItemID}/{regionId}/{regionType}/{name}/{pname}',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/ys/scv.html',
            controller:'scController as vm'
          }
        }
      })
      .state('app.xhsc.scd',{
        noBack:false,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        title :'实测结果',
        url   :'/scd/{areaId}/{acceptanceItemID}/{regionId}/{regionType}/{name}/{pname}',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/ys/scd.html',
            controller:'scdController as vm'
          }
        }
      })
      .state('app.xhsc.demo',{
        noBack:false,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        title :'DEMO',
        url   :'/demo',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/home/demo.html',
            controller:'DemoController as vm'
          }
        }
      })
      .state('app.xhsc.offline',{
        noBack:true,
        sendBt:false,
        rightArrow:false,
        leftArrow:false,
        title :'lx',
        url   :'/offline',
        views :{
          'content@app':{
            templateUrl : 'app/main/xhsc/offline/manage.html',
            controller:'offlineController as vm'
          }
        }
      })


    // Navigation
    msNavigationServiceProvider.saveItem('xhsc', {
      // title : '数字工程',
      group : true,
      weight: 1
    });

    msNavigationServiceProvider.saveItem('xhsc.home', {
      title    : '首页',
      icon     : 'icon-home',
      state    : 'app.xhsc.home',
      weight   : 1
    });

  }
})();

/**
 * Created by jiuyuong on 2016/4/12.
 */
(function(){
  'use strict';

  scdController.$inject = ["$scope", "remote", "xhUtils", "$stateParams", "utils", "$mdDialog", "$state", "$rootScope"];
  angular
    .module('app.xhsc')
    .controller('scdController',scdController)
  /** @ngInject */
  function scdController($scope,remote,xhUtils,$stateParams,utils,$mdDialog,$state,$rootScope) {
    var vm = this;
    vm.info = {
      name: $stateParams.name,
      areaId:$stateParams.areaId,
      acceptanceItemID: $stateParams.acceptanceItemID,
      regionId: $stateParams.regionId,
      regionType: $stateParams.regionType,
      aItem:{
        MeasureItemName:$stateParams.pname,
        AcceptanceItemID:$stateParams.acceptanceItemID
      }
    };
    $rootScope.title = vm.info.aItem.MeasureItemName;
    remote.ProjectQuality.getNumber(vm.info.acceptanceItemID,vm.info.regionId).then(function(result){
      vm.info.Numbers = result.data;
      vm.info.t = result.data[0].MeasureRecordID;
    });

    $scope.$watch('vm.info.t',function(){
      if(vm.info.t){
        remote.ProjectQuality.getMeasureCheckResult(vm.info.t).then(function(rs){
          console.log('rs',rs);
          vm.alItem = rs.data;
          vm.person = rs.data[0].MeasureUserName;
          vm.time = rs.data[0].MeasureTime;
          vm.rowslength = rs.data.length;
          var cols=[];
          var l=0;
          rs.data.forEach(function(item){
            //console.log('rs',item);
            if(item.ResultStatus == 1){
              item.passText = "验收合格"
            }else if(item.ResultStatus == 2){
              item.passText = "验收不合格"
            }
            item.cols = item.Points.length;
            if(item.cols>l)l=item.cols;
          })

          rs.data.forEach(function(item){
              while(item.Points.length<l){
                item.Points.push({});
              }
          })
          vm.cols =l;
          if((vm.cols +5)%4 != 0){
            vm.twoCols = Math.floor((vm.cols +5)/4) +1;
            vm.oneCols =(vm.cols +5) -2*vm.twoCols;
          }else{
            vm.twoCols = (vm.cols +5)/4;
            vm.oneCols = 2*vm.twoCols;
          }
        })
      }
    })
  }
})();

/**
 * Created by jiuyuong on 2016/4/12.
 */
(function(){
  'use strict';

  scController.$inject = ["$scope", "remote", "xhUtils", "$stateParams", "utils", "$mdDialog", "$state", "$rootScope"];
  angular
    .module('app.xhsc')
    .controller('scController',scController)
  /** @ngInject */
  function scController($scope,remote,xhUtils,$stateParams,utils,$mdDialog,$state,$rootScope) {
    var vm = this;
    vm.info = {
      name: $stateParams.name,
      areaId:$stateParams.areaId,
      acceptanceItemID: $stateParams.acceptanceItemID,
      //regionId: $stateParams.regionId,
      //regionType: $stateParams.regionType,
      aItem:{
        MeasureItemName:$stateParams.pname,
        AcceptanceItemID:$stateParams.acceptanceItemID
      }
    };
    $rootScope.title = vm.info.aItem.MeasureItemName;
    vm.setRegionId = function(regionId,regionType){
      switch (regionType) {
        case '8':
          remote.Project.getFloorDrawing(regionId).then(function (r) {
            if(r.data.length) {
              vm.info.imageUrl = r.data[0].DrawingImageUrl;
              vm.info.regionId = regionId;
              vm.info.regionType = regionType;
            }
            else{
              utils.alert('未找到图纸');
            }
          });
          break;
        case '16':
          remote.Project.getHouseDrawing(regionId).then(function (r) {
            if(r.data.length) {
              vm.info.imageUrl = r.data[0].DrawingImageUrl;
              vm.info.regionId = regionId;
              vm.info.regionType = regionType;
            }
            else{
              utils.alert('未找到图纸');
            }
          });
          break;
      }
    }

    vm.nextRegion = function(prev){
      xhUtils.getRegion(vm.info.areaId,function(r){
        var find = r.find(vm.info.regionId);
        if(find){
          var next = prev?find.prev():find.next();
          if(next) {
            vm.info.name = next.FullName;
            //vm.info.regionId = next.RegionID;
            vm.setRegionId(next.RegionID,vm.info.regionType);
          }
          else{
            utils.alert('未找到'+(prev?'上':'下')+'一位置');
          }
        }
      });
    };
    //console.log('acceptanceItemID',vm.info.acceptanceItemID )
    remote.Measure.MeasureIndex.query (vm.info.acceptanceItemID).then (function (r) {
      var m=[];
      r.data.forEach(function(item){
        if(item.IndexName=='结构立面垂直度'|| item.IndexName=='结构表面平整度') {
          var fd = m.find(function (k) {
            return k.IndexName == '结构立面';
          });
          if (!fd) {
            fd = {
              AcceptanceIndexID: 'a',
              IndexName: '结构立面',
              cds: []
            }
            m.push(fd);
          }
          if(item.IndexName=='结构立面垂直度')
            item.IndexName='垂直度';
          if(item.IndexName=='结构表面平整度')
            item.IndexName='平整度';


          fd.cds.push(item);
        }
        else if(item.IndexName=='立面垂直度'|| item.IndexName=='表面平整度') {
          var fd = m.find(function (k) {
            return k.IndexName == '立面/表面';
          });
          if (!fd) {
            fd = {
              AcceptanceIndexID: 'a',
              IndexName: '立面/表面',
              cds: []
            }
            m.push(fd);
          }
          if (item.IndexName == '立面垂直度')
            item.IndexName = '立面';
          if (item.IndexName == '表面平整度')
            item.IndexName = '表面';
          fd.cds.push(item);
        }
        else if(item.IndexName=='阴阳角方正度度'|| item.IndexName=='阴阳角直线度度') {
          var fd = m.find(function (k) {
            return k.IndexName == '阴阳角';
          });
          if (!fd) {
            fd = {
              AcceptanceIndexID: 'a',
              IndexName: '阴阳角',
              cds: []
            }
            m.push(fd);
          }
          fd.cds.push(item);
        }
        else{
          m.push(item);
        }
      });
      vm.MeasureIndexes = m;
    });
    vm.submit = function(){
      if(vm.project){
        var items=[];
        for(var k in vm.project._featureGroups){
          var p = vm.project._featureGroups[k],
            o = p.layer.options;
          if(!items.find(function(t){return t.regionId== o.regionId})){
            items.push({
              regionId: o.regionId,
              regionName: o.regionName
            })
          }
        }
        $mdDialog.show({
            fullscreen:true,
            controller: ["$scope", "$mdDialog", "items", function($scope,$mdDialog,items){
              items.forEach(function(item){
                item.checked = true;
              })
              $scope.items = items;
              $scope.answer = function() {
                var vs=[];
                items.forEach(function(item){
                  if(item.checked){
                    vs.push({
                      AcceptanceItemID:vm.info.acceptanceItemID,
                      CheckRegionID:item.regionId,
                      RegionType:vm.info.regionType
                    })
                  }
                });
                if(vs.length) {
                  remote.ProjectQuality.MeasurePoint.submit(vs).then(function(r){
                    $mdDialog.hide();
                  });
                }
                else{
                  $mdDialog.hide();
                }

              };
              $scope.cancel = function() {
                $mdDialog.cancel();
              };
            }],
            locals:{
              items:items
            },
            template: '<md-dialog>\
            <md-toolbar>\
            <div class="md-toolbar-tools">\
          <h2>请选择提交项目</h2>\
          <span flex></span>\
          </div>\
          </md-toolbar>\
          <md-dialog-content style="min-width:320px;max-height:410px; ">\
          <md-list>\
          <md-list-item ng-repeat="topping in items">\
          <p> {{ topping.regionName }} </p>\
          <md-checkbox class="md-secondary" ng-model="topping.checked"></md-checkbox>\
          </md-list-item>\
          </md-list>\
          </md-dialog-content>\
            <md-dialog-actions layout="row">\
            <md-button ng-click="cancel()">取消</md-button>\
          <span flex></span>\
            <md-button ng-click="answer()" style="margin-right:20px;" >\
            提交\
          </md-button>\
          </md-dialog-actions>\
          </md-dialog>'
          })
          .then(function() {
            $state.go('app.xhsc.choose')
          }, function() {

          });
      }
    }
    vm.setRegionId($stateParams.regionId,$stateParams.regionType);
  }
})();

/**
 * Created by jiuyuong on 2016-5-3.
 */
(function(){
  'use strict';

  sc2Controller.$inject = ["$scope", "remote", "xhUtils", "$stateParams", "utils", "$mdDialog", "$state", "$rootScope"];
  angular
    .module('app.xhsc')
    .controller('sc2Controller',sc2Controller)
  /** @ngInject */
  function sc2Controller($scope,remote,xhUtils,$stateParams,utils,$mdDialog,$state,$rootScope) {
    DialogController.$inject = ["$scope", "$mdDialog"];
    var vm = this;
    vm.info = {
      name: $stateParams.name,
      areaId:$stateParams.areaId,
      acceptanceItemID: $stateParams.acceptanceItemID,
      //regionId: $stateParams.regionId,
      //regionType: $stateParams.regionType,
      aItem:{
        MeasureItemName:$stateParams.pname,
        AcceptanceItemID:$stateParams.acceptanceItemID
      }
    };
    remote.Measure.MeasureIndex.query (vm.info.acceptanceItemID).then (function (r) {
      var m=[];
      r.data.forEach(function(item) {
        if(item.Children && item.Children.length){
          item.Children.forEach(function (item2) {
            m.push(item2);
          })
        }
        else {
          m.push(item);
        }
      });
      vm.MeasureIndexes = m;
      vm.MeasureIndexes.forEach(function(t){
        t.checked = false;
      })
      vm.scChoose();
    });

    vm.scChoose = function(){
      $mdDialog.show({
          controller: DialogController,
          templateUrl: 'app/main/xhsc/ys/scChoose.html',
          parent: angular.element(document.body),
          clickOutsideToClose:true
        })
        .then(function(answer) {
          var scStr=[];
          answer.forEach(function(t){
            if(t.checked ==  true){
              scStr.push(t);
            }
          })
          vm.info.MeasureIndexes = scStr;
         });
    }

    vm.setRegionId = function(regionId,regionType){
      switch (regionType) {
        case '8':
          remote.Project.getFloorDrawing(regionId).then(function (r) {
            if(r.data.length) {
              vm.info.imageUrl = r.data[0].DrawingImageUrl;
              vm.info.regionId = regionId;
              vm.info.regionType = regionType;
            }
            else{
              utils.alert('未找到图纸');
            }
          });
          break;
        case '16':
          remote.Project.getHouseDrawing(regionId).then(function (r) {
            if(r.data.length) {
              vm.info.imageUrl = r.data[0].DrawingImageUrl;
              vm.info.regionId = regionId;
              vm.info.regionType = regionType;
            }
            else{
              utils.alert('未找到图纸');
            }
          });
          break;
      }
    }

    vm.nextRegion = function(prev){
      xhUtils.getRegion(vm.info.areaId,function(r){
        var find = r.find(vm.info.regionId);
        if(find){
          var next = prev?find.prev():find.next();
          if(next) {
            vm.info.name = next.FullName;
            //vm.info.regionId = next.RegionID;
            vm.setRegionId(next.RegionID,vm.info.regionType);
          }
          else{
            utils.alert('未找到'+(prev?'上':'下')+'一位置');
          }
        }
      });
    };
    vm.setRegionId($stateParams.regionId,$stateParams.regionType);

    function DialogController($scope, $mdDialog) {
      //console.log('sc',vm.MeasureIndexes);
      $scope.checkSc = function(sc){
        vm.MeasureIndexes.forEach(function (it) {
          it.checked =false;
        })
        sc.checked = true;
        $scope.answer([sc]);
      };
      $scope.scList = vm.MeasureIndexes;
      $scope.hide = function () {
        $mdDialog.hide();
      };
      $scope.cancel = function () {
        $mdDialog.cancel();
      };
      $scope.answer = function (answer) {
        $mdDialog.hide(answer);
      };
    }
  }
})();

/**
 * Created by emma on 2016/4/29.
 */
(function(){
  'use strict';

  evaluatelistController.$inject = ["$mdDialog"];
  angular
    .module('app.xhsc')
    .controller('evaluatelistController',evaluatelistController);

  /** @ngInject*/
  function evaluatelistController($mdDialog){
    DialogController.$inject = ["$scope", "$mdDialog"];
    var vm = this;
    vm.images = [
      {url:'assets/images/etc/plug.png'},
      {url:'assets/images/etc/fallout.jpg'},
      {url:'assets/images/etc/plug.png'}
    ]
    vm.getRecord = function(ev){
    $mdDialog.show({
        controller: DialogController,
        templateUrl: 'app/main/xhsc/ys/evaluateRecord.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true
      })
      .then(function(answer) {
        if(answer){
          vm.input = answer;
        }
        console.log('answer',answer)
      });
    }
    vm.showDialog = function(ev){
      $mdDialog.show({
          controller: DialogController,
          templateUrl: 'app/main/xhsc/ys/evaluateinput.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
          //fullscreen: useFullScreen
        })
        .then(function(answer) {
          vm.evaluateNote = answer;
        });
    }
    function DialogController($scope, $mdDialog) {
      $scope.evaluateNote = vm.evaluateNote;
      $scope.hide = function() {
        $mdDialog.hide();
      };
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
      $scope.answer = function(answer) {
        $mdDialog.hide(answer);
      };
    }
  }
})();

/**
 * Created by emma on 2016/4/28.
 */
(function(){
  'use strcit';

  evaluateController.$inject = ["$mdDialog", "$timeout"];
  angular
    .module('app.xhsc')
    .controller('evaluateController',evaluateController);

  /** @ngInject*/
  function evaluateController($mdDialog,$timeout){
    var vm = this;

    vm.showECs = function(ev) {
      //var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && vm.customFullscreen;
     // console.log('ev',parent)
      DialogController.$inject = ["$scope", "$mdDialog"];
      $mdDialog.show({
          controller: DialogController,
          templateUrl: 'app/main/xhsc/ys/evaluateChoose.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
          //fullscreen: useFullScreen
        })
        .then(function(answer) {

        });
      function DialogController($scope, $mdDialog) {
        $scope.hide = function() {
          $mdDialog.hide();
        };
        $scope.cancel = function() {
          $mdDialog.cancel();
        };
        $scope.answer = function(answer) {
          $mdDialog.hide(answer);
        };
      }
     // $timeout(function(){$('.md-scroll-mask').addClass('addlayer');},100);
      //$scope.$watch(function() {
      //  return $mdMedia('xs') || $mdMedia('sm');
      //}, function(wantsFullScreen) {
      //  $scope.customFullscreen = (wantsFullScreen === true);
      //});
    };
  }
})();

/**
 * Created by emma on 2016/5/5.
 */
(function(){
  'use strict';

  downloadController.$inject = ["$mdDialog", "db", "remote", "localPack", "xhUtils", "$rootScope", "$scope"];
  angular
    .module('app.xhsc')
    .controller('downloadController',downloadController);

  /** @ngInject*/
  function downloadController($mdDialog,db,remote,localPack,xhUtils,$rootScope,$scope){
    var vm = this;
    var pk = db('xcpk');
    pk.get('xcpk').then(function (result) {
      vm.data = result.rows;
      queryOnline();
    }).catch(function (err) {
      vm.data = [];
      queryOnline();
    });
    vm.download = function (item) {
      item.progress = 0;
      var pack =localPack.pack({
        _id:item.AssessmentID,
        name:item.AssessmentSubject,
        tasks:[
          {
            _id:'GetMeasureItemInfoByAreaID',
            name:'获取分期下所有指标',
            url:'/Api/MeasureInfo/GetMeasureItemInfoByAreaID?areaID='+item.AreaID
          },
          {
            _id:'GetRegionTreeInfo',
            name:'获取区域信息',
            url:'/Api/ProjectInfoApi/GetRegionTreeInfo?AreaID='+item.AreaID,
            type:'ExRegion',
            item:angular.copy(item)
          }
        ]
      })
      item.pack = pack;
      $rootScope.$on('pack'+item.AssessmentID,function (e,d) {
        console.log(arguments);
        var p  =pack.getProgress();
        item.progress = parseInt(p.progress*100);
        console.log('getProgress',  item.progress);

      })
    }
    function queryOnline() {
      vm.onlines = [];
      vm.offlines = [];
      vm.data.forEach(function (m) {
        if(m.completed){
          vm.offlines.push(m);
        }
        else{
          vm.onlines.push(m);
        }
      })
      remote.Assessment.query().then(function (result) {
        var n={
          _id:'xcpk',
          rows:[]
        }
        result.data.forEach(function (m) {
          var fd = vm.data.find(function (a) {
            return a.AssessmentID==m.AssessmentID;
          });
          if(fd){
            n.rows.push(fd);
          }
          else{
            n.rows.push(m);
            vm.onlines.push(m);
          }
        })
        pk.addOrUpdate(n);
        //vm.onlines = result.data;
      }).catch(function () {

      });
    }
    vm.showECs = function(ev) {
      //var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && vm.customFullscreen;
      // console.log('ev',parent)
      DialogController.$inject = ["$scope", "$mdDialog"];
      $mdDialog.show({
          controller: DialogController,
          templateUrl: 'app/main/xhsc/ys/evaluateChoose.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
          //fullscreen: useFullScreen
        })
        .then(function(answer) {

        });
      function DialogController($scope, $mdDialog) {
        $scope.hide = function() {
          $mdDialog.hide();
        };
        $scope.cancel = function() {
          $mdDialog.cancel();
        };
        $scope.answer = function(answer) {
          $mdDialog.hide(answer);
        };
      }
    };

  }
})();

/**
 * Created by emma on 2016/5/5.
 */
(function(){
  'use strict';

  downdetailController.$inject = ["db", "remote"];
  angular
    .module('app.xhsc')
    .controller('downdetailController',downdetailController);

  /** @ngInject*/
  function downdetailController(db,remote){
    var vm = this;
    var pk = db('xcpk');
    pk.get('xcpk').then(function (result) {
      vm.offlines = result.rows;
      queryOnline();
    }).catch(function (err) {
      vm.offlines = [];
      queryOnline();
    });
    function queryOnline() {
      remote.Assessment.query().then(function (result) {
        pk.addOrUpdate({_id:'xcpk',rows:result.data});
        vm.onlines = result.data;
      }).catch(function () {
        
      });
    }


  }
})();

/**
 * Created by jiuyuong on 2016/3/30.
 */
(function(){
  'use strict';

  checkHouseController.$inject = ["$scope"];
  angular
    .module('app.xhsc')
    .controller('checkHouseController',checkHouseController);

  /** @ngInject */
  function checkHouseController($scope){
    var vm=this;
    var rs = {
      data:[
        {
          MeasureUserName:'aa',
          MeasureTime:2022-22-22,
          IndexName:'abc',
          Points:[
            {
              MeasureValue:1
            }
          ]
        },
        {
          MeasureUserName:'ab',
          MeasureTime:2022-22-22,
          IndexName:'abc',
          Points:[
            {
              MeasureValue:1
            },
            {
              MeasureValue:2
            },
            {
              MeasureValue:2
            }
          ]
        },
        {
          MeasureUserName:'ac',
          MeasureTime:2022-22-22,
          IndexName:'abc',
          Points:[
            {
              MeasureValue:5
            }
          ]
        }
      ]
    }
    vm.alItem = rs.data;
    vm.person = rs.data[0].MeasureUserName;
    vm.time = rs.data[0].MeasureTime;
    vm.rowslength = rs.data.length;
    var cols=[];
    var l=0;
    rs.data.forEach(function(item){
     // console.log('rs',item);
      item.cols = item.Points.length;
      if(item.cols>l)l=item.cols;

    })

    rs.data.forEach(function(item){
      while(item.Points.length<l){
        item.Points.push({});
      }
    })
    vm.cols =l;
    if((vm.cols +5)%4 != 0){
      vm.twoCols = Math.floor((vm.cols +5)/4) +1;
      vm.oneCols =(vm.cols +5) -2*vm.twoCols;
    }else{
      vm.twoCols = (vm.cols +5)/4;
      vm.oneCols = 2*vm.twoCols;
    }

  }
})();

/**
 * Created by jiuyuong on 2016/3/30.
 */
(function(){
  'use strict';

  ChooseHouseController.$inject = ["$scope", "xhUtils", "remote", "$rootScope", "$stateParams", "$state"];
  angular
    .module('app.xhsc')
    .controller('ChooseHouseController',ChooseHouseController);

  /** @ngInject */
  function ChooseHouseController($scope,xhUtils,remote,$rootScope,$stateParams,$state){
    var vm=this;
    vm.areaId = $stateParams.areaId;
    vm.pname = $stateParams.pname;
    $rootScope.title = vm.pname;
    vm.search = function(){
      vm.showSearch = true;
    }
    vm.hideSearch = function(){
      vm.showSearch = false;
    }
    vm.open = function(id) {
      vm.current = id;
      //vm.floors = null;
      vm.Region.forEach(function (item) {
        item.showArr = false;
        item.actived = false;
        if (id.RegionName == item.RegionName) {
         // vm.floors = item.Children;
          id.showArr = true;
          item.actived = true;
        }
      })
    }
    vm.tabStatus = -1;
    vm.myFilter = function(num){
      vm.tabStatus = num;
      //console.log('floor',vm.floors)
    }
    vm.changeStat = function(item,items){

      if(!vm.muti){
        $state.go(item.status==2?'app.xhsc.scd':'app.xhsc.sc',{
          areaId:vm.areaId,
          acceptanceItemID:item.AcceptanceItemID,
          regionId:item.RegionID,
          regionType:item.RegionType,
          name:item.FullName,
          pname:vm.pname
        })
/*        $state.go('app.xhsc.scd',{
          areaId:vm.areaId,
          acceptanceItemID:item.AcceptanceItemID,
          regionId:item.RegionID,
          regionType:item.RegionType,
          name:item.FullName,
          pname:vm.pname
        })*/
      }
      else{
        item.selected=!item.selected;
      }

  }
    vm.loadCircle = true;
    xhUtils.getRegion( vm.areaId, function(data){
     // console.log('r',data)
     vm.Region = data.Children;
      remote.MeasureCheckBatch.getStatus($stateParams.id,$stateParams.areaId,1).then(function(result){
       //console.log('r',result)
        data.each(function(item){
          var find = result.data.find(function(r){return r.RegionID==item.RegionID;});
          if(find){
            item.AcceptanceItemID = find.AcceptanceItemID;
            item.status = find.Status;
          }
          else{
            item.status = -1;
          }
        })
        vm.loadCircle = false;
      })
      if(vm.Region.length) {
        vm.open(vm.Region[0]);
      }
    })

    vm.goMeasure = function(){
      //console.log('none')
    }

  }

})();

/**
 * Created by jiuyuong on 2016/3/30.
 */
(function(){
  'use strict';

  ChooseController.$inject = ["$scope", "$timeout", "db", "$rootScope", "xhUtils"];
  angular
    .module('app.xhsc')
    .controller('ChooseController',ChooseController);

  /** @ngInject */
  function ChooseController($scope,$timeout,db,$rootScope,xhUtils){
    var vm=this;
    function toggleRightEvent(){
      //$mdSidenav('right')
      //  .toggle();
    }
    var area = db('db_');
    area.addOrUpdate({
      _id:'1233',
      name:''
    });
/*    var store = new Store('area', { remote: 'http://localhost:5984/areas',ajax:{
      withCredentials:false
    } })
    store.sync();
    store.findAll().then(function(r){
      console.log('r',r)
    })
    store.*/
/*    remote.Project.Area.query().then(function(result){
      vm.Areas = result.data;
      vm.selectedArea = vm.Areas[0];

    })*/
    $scope.$watch('vm.selectedArea',function(){
      if(vm.selectedArea) {
        xhUtils.getProcedure(vm.selectedArea.AreaID, function (result) {
          vm.xhMeasure = result;
        });
      }
    })

    vm.close = function () {
      //$mdSidenav('right').close()
      //  .then(function () {
      //    //$log.debug("close RIGHT is done");
      //  });
    };
    function areaSelectEvent(event,data){
      vm.areaId = data.AreaName;
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
                'pascalprecht.translate',
                'timer',
                'ui.router',
                'ui.sortable',
                'ng-sortable',
                'moment-picker'
            ]);
})();

/**
 * Created by leshuangshuang on 16/4/1.
 */
(function(){
  'use strict';
  angular
    .module('app.core')
    .factory('xhscService',xhscService);
  /** @ngInject */
  function xhscService(){
    return {
      //
      qualified:qualified
    };
   //单个测量点的
    function qualified(items){
       items.qualified>=80 && items.zdpc<items.yxpc;
       return items.qualified


    }
    //多个测量点的

  }
})();

/**
 * Created by emma on 2016/3/31.
 */
(function(){
  angular
    .module('app.xhsc')
    .service('mapPopupSerivce',mapPopupSerivce);

  /** @Inject */
  function mapPopupSerivce(){
    var popups = {};
    this.set = function(id,element){
      popups[id] = element;
    }
    this.get = function(id){
     return popups[id];
    }
    this.remove = function(id){
      delete popups[id];
    }
  }
})();

/**
 * Created by jiuyuong on 2016/4/12.
 */
(function(){
  'use strict';
  xhUtils.$inject = ["remote", "$rootScope", "$q"];
  angular
    .module('app.xhsc')
    .factory('xhUtils',xhUtils);
  /** @ngInject */
  function xhUtils(remote,$rootScope,$q){
    var _areaId, cP,region;
    var o = {
      getProcedure:getProcedure,
      getRegion:getRegion,
      getMapPic:getMapPic,
      findAll:findAll,
      findRegion:findRegion
    };
    return o;

    function appendTree(container,ids, idx, item){
      var id = ids[idx];
      if(!id){
        container.push(item);
        return;
      }
      for(var i= 0,l=container.length;i<l;i++){
        if(container[i].$id == id){
          return appendTree(container[i].children,ids, idx+1, item);
        }
      }
      container.push({
        $id:id,
        $name:item.SpecialtyName.split(';')[idx],
        children:[]
      });
      return appendTree(container[container.length-1].children,ids, idx+1, item);
    }
    function getProcedure(areaId,cb){
     if(!areaId && cP)return cb(angular.copy(cP));
      _areaId = areaId;
      remote.Measure.query(areaId).then(function(result){

        var s = [];
        result.data.forEach(function (item) {
          var ids = item.SpecialtyID.split(';');
          appendTree(s,ids,0,item);
        });
        s.forEach(function(g){
          g.ps = [];
          g.children.forEach(function(c){

            if(!c.children){
              g.ps.push(c);
            }
            else {
              c.ps = [];
              c.children.forEach(function (p) {
                c.ps.push(p);
                g.ps.push(p);
              })
            }
          });
        });
        console.log('r',s)
        cP = s;
        cb(cP);
      });
    }

    function getRegion(areaId,cb){
      if(!areaId || areaId==_areaId &&region ) {
        cb(region);
        return;
      }
      _areaId = areaId;
      remote.Project.Area.queryRegion(_areaId).then(function(result){
        region = result.data;

        region.find = find;
        region.each = each;
        //栋
        region.Children && region.Children.forEach(function(d){
          d.$parent = region;
          d.find = find;
          d.next = next;
          d.prev = prev;
          d.each = each;
          d.Children && d.Children.forEach(function(l){
            l.$parent = d;
            l.find = find;
            l.next = next;
            l.prev = prev;
            l.each = each;

            l.Children && l.Children.forEach(function(r){
              r.$parent = l;
              r.find = find;
              r.next = next;
              r.prev = prev;
              r.each = each;
            })
          })
        });
        cb(angular.copy(region));
      })
      function each(fn){
        fn(this);
        this.Children && this.Children.forEach(function(item){
          item.each(fn);
        })
      }
      function find(id){
        if(this.RegionID==id ||(typeof id==='function' && id(this)===true))
          return this;

        if(this.Children){
          var fd;
          this.Children.forEach(function(c){
            if(!fd){
              fd = c.find(id);
            }
          });
          if(fd)
            return fd;
        }
      }
      function next(){
        if(this.$parent) {
          var ix = this.$parent.Children.indexOf(this);
          var next = this.$parent.Children[ix + 1];
          if (next)
            return next;
          var p = this.$parent.next && this.$parent.next();
          if(p&& p.Children){
            return p.Children[0];
          }
        }
      }
      function prev(){
        if(this.$parent) {
          var ix = this.$parent.Children.indexOf(this);
          var next = this.$parent.Children[ix - 1];
          if (next)
            return next;
          var p = this.$parent.prev &&  this.$parent.prev();
          if(p && p.Children){
            return p.Children[p.Children.length-1];
          }
        }
      }
    }
    function getMapPic(maxZoom){
      //console.log('m',maxZoom,Math.pow(2,maxZoom))
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

    function findAll(array,fn) {
      var buff=[];
      array.forEach(function (item) {
        if(fn(item)===true)
          buff.push(item);
      });
      return buff;
    }

    function findRegion(regions,id) {
      if(!regions)return null;
      var fd = regions.find(function (r) {
        var len = r.RegionID.length;
        return id.substring(0,len)==r.RegionID;
      });
      if(!fd)return null;
      if(fd.RegionID!=id)
        return findRegion(fd.Children,id);
      else
        return fd;
    }
  }
})();

/**
 * Created by jiuyuong on 2016/4/11.
 */
(function(){
  'use strict';

  remote.$inject = ["api"];
  angular
    .module('app.xhsc')
    .factory('remote',remote);
  /** @ngInject */
  function remote(api){
    return api.xhsc;
  }
})();

/**
 * Created by emma on 2016/4/14.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .filter('myFilter',myFilter);

  function myFilter(){
    return function(items,status) {
      var output = [];
      if (!items)return output;
      if (status == -1) {
        items.forEach(function(item){
          if( item.find(function (it) {
              return it.status != -1;
            })){
            output.push(item);
          }
        })
        return output;
      }
      //console.log('a',args)
      items.forEach(function (item) {
        if (
          item.find(function (it) {
            return it.status == status
          })
        ) {
          output.push(item)
        }
      })
      return output;
    }
  }


})();

/**
 * Created by jiuyuong on 2016/5/5.
 */
(function () {
  'use strict';
  localPack.$inject = ["db", "$http", "$rootScope", "$cordovaFileTransfer", "sxt", "xhUtils", "$timeout"];
  angular
    .module('app.xhsc')
    .factory('localPack', localPack);
  /** @ngInject */
  function localPack(db,$http,$rootScope,$cordovaFileTransfer,sxt,xhUtils,$timeout) {

    function Pack(config) {
      var self = this,
        pack = db('pack'+config._id);
      self.pack = pack;
      if(!self.config) {
        pack.getOrAdd(config).then(function (config) {
          self.config = config;
          self.down();
        });
      }
    }
    Pack.prototype.down = function () {
      var self = this;
      if(self.isDown)return;
      self.isDown = true;
      self.downTask();
    }
    Pack.prototype.downTask = function () {
      var self = this;
      var task = self.config.tasks.find(function (t) {
        return !t.completed && (!t.try || t.try<3);
      });
      if(!task){
        self.isDown = false;
        self.stoped = true;
        return;
      }
      if(task){
        task.try = (task.try||0)+1;
/*        $rootScope.$emit('pack'+self.config._id,{
          name:'begin',
          task:task,
          config:this.config
        });*/
        if(task.type=='ExRegion'){
          task.callback = function (data,config,cb) {
            var gx=[],areas=[];//计算要需要的指标和图纸
            this.item.MeasureItems.forEach(function (m) {
              if(m.AssessmentAreas.length==0)return;

/*              if(!gx.find(function (it) {
                  return it.MeasureItemID==m.MeasureItemID
                })){
                gx.push({
                  MeasureItemID:m.MeasureItemID,
                  MeasureItemName:m.MeasureItemName,
                  TemplateID:m.TemplateID,
                  TemplateName:m.TemplateName
                });
              };*/

              m.AssessmentAreas.forEach(function (a) {
                if(!areas.find(function (it) {
                    return it.RegionID==a.AreaID
                  })){
                  var am = xhUtils.findRegion([data],a.AreaID);
                  //临时测试要去掉
                  am.DrawingImageUrl='/fs/UploadFiles/Framework/a744a033f5eeec56549c440de2ddfbae.jpg';
                  if(am && am.DrawingImageUrl && !areas.find(function (a) {
                      return a.DrawingImageUrl==am.DrawingImageUrl
                    })) {
                    areas.push({
                      RegionID: am.RegionID,
                      RegionName:am.RegionName,
                      DrawingID:am.DrawingID,
                      DrawingImageUrl:am.DrawingImageUrl,
                      RegionType:am.RegionType
                    });
                  };
                }
              });
            });


/*            gx.forEach(function (g) {
              config.task.push({
                _id:'gx_'+g.MeasureItemID,
                url:sxt.app.api+'/Api/MeasureInfo/GetMeasureItemInfoByAreaID?areaID='+
              })
            });*/
            areas.forEach(function (area) {
              var pics = xhUtils.getMapPic(area.RegionType==8?4:3);
              pics.forEach(function (u) {
                config.tasks.push({
                  _id:area.RegionID+'_p_'+u,
                  type:'file',
                  //url:sxt.app.api+'/Api/Picture/Tile/'+u+'?path='+area.DrawingImageUrl
                  url:'http://ggem.sxtsoft.com:9191/Api/Picture/Tile/'+u+'?path='+area.DrawingImageUrl+'&name=/'+area.DrawingID+u+'.png'
                });
              })
            });
            $rootScope.$emit('pack'+self.config._id,{
              name:'taskchanged',
              task:task,
              config:self.config
            });
            cb();
          }
        }
        if(task.type == 'file') {
          try {
            var rootPath = cordova.file.dataDirectory+ self._id+'/',
              names = task.url.split('/'),
              name = names[names.length - 1];
            task.local = rootPath + '/' + name;
            $cordovaFileTransfer.download(task.url, task.local)
              .then(function (result) {
                task.completed = true;
                $rootScope.$emit('pack' + self.config._id, {
                  name: 'complete',
                  task: task,
                  config: self.config
                });
                self.downTask();
              }, function (err) {
                task.err = err;
                self.downTask();
              }, function (progress) {

              });
          }catch (ex){
            $rootScope.$emit('pack'+self.config._id,{
              name:'error',
              task:task,
              config:self.config
            });
          }
        }
        else{
          (task.api?task.api():$http.get(sxt.app.api + task.url)).then(function (result) {
            if(task.db){
              var taskDb = db(task.db);
              taskDb.addOrUpdate(result.data).then(function (r) {
                console.log('r',r);
                $rootScope.$emit('pack'+self.config._id,{
                  name:'complete',
                  task:task,
                  config:self.config
                });
                task.completed = true;
                if(task.callback && task.callback(result.data,self.config,function () {
                    self.downTask();
                  }));
                else
                  self.downTask();

              }).catch(function () {
                self.downTask();
              })

            }
            else{

              self.pack.addOrUpdate({_id:task._id,data:result.data}).then(function () {
                task.completed = true;
                $rootScope.$emit('pack'+self.config._id,{
                  name:'complete',
                  task:task,
                  config:self.config
                });
                if(task.callback && task.callback(result.data,self.config,function () {
                    self.downTask();
                  }));
                else
                  self.downTask();
              }).catch(function () {
                self.downTask();
              })
            }
          })
        }
      }
    }
    Pack.prototype.getProgress = function () {
      var completed = 0, total = this.config.tasks.length;
      this.config.tasks.forEach(function (task) {
        if (task.completed)
          completed++;
      });
      return {
        completed: completed,
        total: total,
        progress: completed / total
      }
    }

    var o ={
      packages:{},
      pack:pack
    };
    return o;
    function pack(config) {
      var pack = this.packages[config._id] = this.packages[config._id] || new Pack(config);
      return pack;
    }

  }
})();

/**
 * Created by lss on 2016/5/3.
 */

/**
 * Created by lss on 2016/5/3.
 */
(function(){
  'use strict';

  offlineController.$inject = ["$scope", "remote", "xhUtils", "$stateParams", "utils", "$mdDialog", "$state", "$rootScope", "db"];
  angular
    .module('app.xhsc')
    .controller('offlineController',offlineController)
  /** @ngInject */
  function offlineController($scope,remote,xhUtils,$stateParams,utils,$mdDialog,$state,$rootScope,db) {
    var vm = this;
    var areID="0000700000";
    var r = db("db_"+areID,{auto_compaction:true});
    vm.download= function(){
      r.deleteAll().then(function(data){
        //加载区域项
        remote.region.query(areID).then(function(result){
          var retVal = result.data;
          if (!angular.isArray(retVal)){
            retVal=[retVal];
          }
          retVal.forEach(function(o){
            o.id="region_"+o.RegionID;
            o.tate="加载中...";
          })
          $scope.regions=retVal;
          r.create(retVal).then(function(data){
            retVal.forEach(function(o){
              o.tate="完成";
            });
          });
        })
        //加载实测项
        remote.Measure.query(areID).then(function(result){
          var retVal = result.data;
          if (!angular.isArray(retVal)){
            retVal=[retVal];
          }
          retVal.forEach(function(o){
            o.id="accItem_"+o.AcceptanceItemID;
            o.state="加载中...";
          });
          $scope.AcceptanceItems=retVal;
          r.create(retVal).then(function(data){
            retVal.forEach(function(o){
              o.state="完成";
            });
          });
        })
        //加载指标项
        remote.Measure.MeasureIndex.query().then(function(result){
          var retVal = result.data;
          if (!angular.isArray(retVal)){
            retVal=[retVal];
          }
          retVal.forEach(function(o){
            o.id="accIndex_"+o.AcceptanceIndexID;
            o.state="加载中...";
          })
          $scope.AcceptanceIndexs=retVal;
          r.create(retVal).then(function(data){
            retVal.forEach(function(o){
              o.state="完成";
            })
          });
        })
      });
    }
  }
})();

/**
 * Created by emma on 2016/3/31.
 */
(function(){
  homeMap.$inject = ["$timeout", "mapPopupSerivce"];
  angular
    .module('app.xhsc')
    .directive('homeMap',homeMap);

  /** @Inject */
  function homeMap($timeout,mapPopupSerivce){
    return {
      link:link
    }

    function  link(scope,element,attr,ctrl){
      $timeout(function(){

        var options = {
          onUpdate:function(layer,isNew){
            if(isNew && layer instanceof L.Stamp){
              var i=0;
              this.eachLayer(function(layer){
                if(layer instanceof L.Stamp){
                  i++;
                }
              });
              layer.updateValue({
                seq:i
              });
            }
            console.log('update',layer.toGeoJSON());
          }
        },project = new L.SXT.Project(element[0],{
          map:{
            map:{}
          },
          tileLayers:{
            base: {
              url: 'http://vkde.sxtsoft.com/upload/hx_tile_{z}_{x}_{y}.png'
            }
          },
          featureGroups:{
            sc:{
              options:options,
              toolbar:{
                group:{
                  //areaGroup:false
                }
              }
            }
          }
        });
        project._map.openPopup(mapPopupSerivce.get('p3').el[0],[0.3,0.2],{
          maxWidth:300
        })
        //var draggable = new L.Draggable("<div>aaaaa</div>");
        //draggable.enable();
      },2000);
    }
  }
})();

/**
 * Created by jiuyuong on 2016/3/30.
 */
(function ()
{
  'use strict';

  HomeController.$inject = ["$scope", "auth", "$state", "$rootScope", "$timeout"];
  angular
    .module('app.xhsc')
    .controller('HomeController', HomeController);

  /** @ngInject */
  function HomeController($scope,auth,$state,$rootScope,$timeout)
  {

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
        $state.go('app.xhsc.choose',{pid:item.projectId, pname: item.title});
      },200)

    }

    function markerClick($current){
    //  appCookie.put('projects',JSON.stringify([{project_id:$current.projectId,name:$current.title}]))
      $state.go('app.xhsc.choose',{pid:$current.projectId, pname:'天津星河时代'});
    }
  }
})();

/**
 * Created by jiuyuong on 2016/4/3.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('DemoController',DemoController);

  /** @ngInject */
  function DemoController(){

  }

})();

/**
 * Created by jiuyuong on 2016/4/12.
 */
(function(){
  sxtStamp.$inject = ["mapPopupSerivce"];
  angular
    .module('app.xhsc')
    .directive('sxtStamp',sxtStamp);

  /** @Inject */
  function sxtStamp(mapPopupSerivce){
    return {
      restrict:'E',
      scope:{
      },
      templateUrl:'app/main/xhsc/directive/sxtStamp.html',
      link:link
    }
    function  link(scope,element,attr,ctrl){
      scope.removeLayer = function(){
        var layer = scope.context.layer;
        layer._fg.removeLayer(layer);
      }
      scope.cancelEdit = function(){
        var layer = scope.context.layer;
        layer.editing && layer.editing.disable();
      }

      mapPopupSerivce.set('Stamp',{
        el:element,
        scope:scope
      });
      scope.$on('$destroy',function(){
        mapPopupSerivce.remove('Stamp');
      })
    }
  }
})();

/**
 * Created by jiuyuong on 2016/4/13.
 */
(function(){
  'use strict';
  sxtScPopup.$inject = ["mapPopupSerivce", "$timeout", "sxt", "xhUtils"];
  angular
    .module('app.xhsc')
    .directive('sxtScPopup',sxtScPopup);
  /** @ngInject */
  function sxtScPopup(mapPopupSerivce,$timeout,sxt,xhUtils){
    return {
      restrict:'E',
      scope:{
        readonly:'='
      },
      templateUrl:'app/main/xhsc/directive/sxtScPopup.html',
      link:link
    }

    function link(scope,element,attr,ctrl){
      scope.ct ={
      };
      //实测值
      scope.$watch('value',function(){
        console.log('value',scope.value);
        //console.log('scope',scope)
        /**
         * 添加测试值
         * @param {Array} values 测试值
         *        {
           *          ParentMeasurePointID:'',//所在测量组ID，如果没有为null
           *          MeasurePointID:'',
           *          AcceptanceIndexID:''
           *          MeasureValue:''//测量值
           *          DesignValue:''//设计值
           *          CalculatedValue:''//计算值
           *          Remark:'',//备注
           *          ExtendedField1:'',//扩展字段1
           *          ExtendedField2:'',//扩展字段2
           *          ExtendedField3:''//扩展字段3
           *        }
         * */
      });
      //指标
      scope.$watch('MeasureIndex',function(){
        console.log('MeasureIndex',scope.MeasureIndex);
        /**
	       * {
              AcceptanceIndexID:'',
              AcceptanceItemID:'',
              ParentAcceptanceIndexID:'',
              IndexName:'指标名称{0}',//指标名称
        **
               * Single：各自测量，SelectMaterial：选择材质测量）
               *
          IndexType:'Single',
          *
           * 1 原位
           * 2 非原位
           *
            MeasureMethod:'1',//实测方法
          *
           * 1 测量值
           * 2 与设计值对比
           * 3 测量组对比
           * 4 区域测量点对比
           * 5 上下楼层对比
            PassYieldComputeMode:'1',//计算合格率方式
          *
           * 合并标识
           * 0：不合并
           * 1：合并
           *
            GroupSign:1,//合并标识
            Weight:9.1,//权重
            SinglePassYield:true,//各自合格率
            SummaryPassYield:true,//汇总合格率
            children:array({
            AcceptanceIndexID:'',
            AcceptanceItemID:'',
            ParentAcceptanceIndexID:'',
            IndexName:'',//指标名称
            IndexType:'Single',
            MeasureMethod:'',//实测方法
            PassYieldComputeMode:'',//计算合格率方式
            GroupSign:1,//合并标识
            Weight:9.1,//权重
            SinglePassYield:true,//各自合格率
            SummaryPassYield:true//汇总合格率
          })
        }
         */

      });
      scope.updateValue = function() {
        var context = scope.context;

        if (!context.featureGroup.options.onUpdateData || context.featureGroup.options.onUpdateData (context,scope.data.updates,scope) !== false) {
          scope.cancelEdit ();
        }
      };
      scope.apply = function() {
        var context = scope.context,p = context.layer.getValue();
        var singleEdit=[],mutiEdit=[],floorEdit=[],sjzEdit=[],materEidt=[],group;
        scope.data.updates = [];
        scope.data.measureIndexes.forEach(function(m){
          var o={
            m:m,
            v:scope.data.values.find(function(o){
              return o.MeasurePointID == p.$id
              && o.AcceptanceIndexID == m.AcceptanceIndexID
            })
          };
          scope.data.updates.push(o);
          if(m.IndexType == 'SelectMaterial'){

          }else if(context.layer instanceof L.LineGroup || context.layer instanceof L.AreaGroup){
            //o.v.children = [];
            group = o;
            o.v.children = xhUtils.findAll(scope.data.values, function (v) {
              return v.ParentMeasureValueID == o.v._id;
            });
          }
          else {
            switch (m.QSKey) {
              case '1':
              case '3':
              case '4':
                mutiEdit.push(o);
                break;
              case '2':
                sjzEdit.push(o);
                break;
              case '5':
                floorEdit.push(o)
                break;
            }

          }
        });
        if (mutiEdit.length == 1) {
          singleEdit = mutiEdit;
          mutiEdit = [];
        }
        scope.edit ={
          singleEdit:singleEdit,
          mutiEdit:mutiEdit,
          floorEdit:floorEdit,
          sjzEdit:sjzEdit,
          materEidt:materEidt,
          group:group
        }
        if(scope.PointType=='LineGroup' || scope.PointType=='AreaGroup') {
          var ps = [];
          context.featureGroup.eachLayer(function (layer) {
            if (layer._value && layer._value.$groupId == scope.value.$id) {
              ps.push(layer._value);
            }
            scope.values = ps;
          });
        }
        $timeout(function(){scope.ct.show && scope.ct.show();},300);
        scope.$apply();
      };
      scope.distinct = function(array){
        if(!array || !array.forEach)return;
        var min=100000,max=-100000;
        array.forEach(function(item){
          if(item.MeasureValue) {
            if (item.MeasureValue < min)
              min = item.MeasureValue;
            if (item.MeasureValue > max)
              max = item.MeasureValue;
          }
          else {
            if (item < min)
              min = item;
            if (item > max)
              max = item;
          }
        })
        return max-min;
      }
      scope.distinct2 = function(){
        scope.distinct(Array.prototype.splice.call(arguments));
      }
      scope.removeLayer = function(){
        var layer = scope.context.layer;
        layer._fg.removeLayer(layer);
      };
      scope.cancelEdit = function(){
        var layer = scope.context.layer;
        layer.editing && layer.editing.disable();
      };
      mapPopupSerivce.set('mapPopup',{
        el:element,
        scope:scope
      });
      scope.$on('$destroy',function(){
        mapPopupSerivce.remove('mapPopup');
      })
    }
  }
})();

/**
 * Created by jiuyuong on 2016/4/13.
 */
(function(){
  'use strict';
  sxtScMapPopup.$inject = ["mapPopupSerivce", "$timeout"];
  angular
    .module('app.xhsc')
    .directive('sxtScMapPopup',sxtScMapPopup);
  /** @ngInject */
  function sxtScMapPopup(mapPopupSerivce,$timeout){
    return {
      restrict:'E',
      scope:{
        readonly:'='
      },
      templateUrl:'app/main/xhsc/directive/sxtScMapPopup.html',
      link:link
    }

    function link(scope,element,attr,ctrl){
      scope.ct ={
      };
      //实测值
      scope.$watch('value',function(){
        console.log('value',scope.value);
        //console.log('scope',scope)
        /**
         * 添加测试值
         * @param {Array} values 测试值
         *        {
           *          ParentMeasurePointID:'',//所在测量组ID，如果没有为null
           *          MeasurePointID:'',
           *          AcceptanceIndexID:''
           *          MeasureValue:''//测量值
           *          DesignValue:''//设计值
           *          CalculatedValue:''//计算值
           *          Remark:'',//备注
           *          ExtendedField1:'',//扩展字段1
           *          ExtendedField2:'',//扩展字段2
           *          ExtendedField3:''//扩展字段3
           *        }
         * */
      });
      //指标
      scope.$watch('MeasureIndex',function(){
        console.log('MeasureIndex',scope.MeasureIndex);
        /**
	       * {
              AcceptanceIndexID:'',
              AcceptanceItemID:'',
              ParentAcceptanceIndexID:'',
              IndexName:'指标名称{0}',//指标名称
        **
               * Single：各自测量，SelectMaterial：选择材质测量）
               *
          IndexType:'Single',
          *
           * 1 原位
           * 2 非原位
           *
            MeasureMethod:'1',//实测方法
          *
           * 1 测量值
           * 2 与设计值对比
           * 3 测量组对比
           * 4 区域测量点对比
           * 5 上下楼层对比
            PassYieldComputeMode:'1',//计算合格率方式
          *
           * 合并标识
           * 0：不合并
           * 1：合并
           *
            GroupSign:1,//合并标识
            Weight:9.1,//权重
            SinglePassYield:true,//各自合格率
            SummaryPassYield:true,//汇总合格率
            children:array({
            AcceptanceIndexID:'',
            AcceptanceItemID:'',
            ParentAcceptanceIndexID:'',
            IndexName:'',//指标名称
            IndexType:'Single',
            MeasureMethod:'',//实测方法
            PassYieldComputeMode:'',//计算合格率方式
            GroupSign:1,//合并标识
            Weight:9.1,//权重
            SinglePassYield:true,//各自合格率
            SummaryPassYield:true//汇总合格率
          })
        }
         */

      });
      scope.updateValue = function() {
        var context = scope.context;

        if (!context.featureGroup.options.onUpdateData || context.featureGroup.options.onUpdateData (context) !== false) {
          scope.cancelEdit ();
        }
      };
      scope.apply = function() {
        var context = scope.context;
        scope.PointType = context.layer.toGeoJSON().geometry.type;

        //console.log('PointType',scope.PointType )
        scope.MeasureIndex = context.featureGroup.options.properties;
        scope.value = context.layer.getValue();
        scope.values=null;
        if(scope.PointType=='LineGroup' || scope.PointType=='AreaGroup') {
          var ps = [];
          context.featureGroup.eachLayer(function (layer) {
            if (layer._value && layer._value.$groupId == scope.value.$id) {
              ps.push(layer._value);
            }
            scope.values = ps;
          });
        }
        $timeout(function(){scope.ct.show && scope.ct.show();},300);
        scope.$apply();
      };
      scope.distinct = function(array){
        if(!array || !array.forEach)return;
        var min=100000,max=-100000;
        array.forEach(function(item){
          if(item.MeasureValue) {
            if (item.MeasureValue < min)
              min = item.MeasureValue;
            if (item.MeasureValue > max)
              max = item.MeasureValue;
          }
          else {
            if (item < min)
              min = item;
            if (item > max)
              max = item;
          }
        })
        return max-min;
      }
      scope.distinct2 = function(){
        scope.distinct(Array.prototype.splice.call(arguments));
      }
      scope.removeLayer = function(){
        var layer = scope.context.layer;
        layer._fg.removeLayer(layer);
      };
      scope.cancelEdit = function(){
        var layer = scope.context.layer;
        layer.editing && layer.editing.disable();
      };
      mapPopupSerivce.set('mapPopup',{
        el:element,
        scope:scope
      });
      scope.$on('$destroy',function(){
        mapPopupSerivce.remove('mapPopup');
      })
    }
  }
})();

/**
 * Created by jiuyuong on 2016/4/12.
 */
(function(){
  'use strict';
  sxtScMap.$inject = ["$timeout", "mapPopupSerivce", "remote", "$q", "sxt", "xhUtils"];
  angular
    .module('app.xhsc')
    .directive('sxtScMap',sxtScMap);
  /** @ngInject */
  function sxtScMap($timeout,mapPopupSerivce,remote,$q,sxt,xhUtils){

    return {
      scope:{
        areaId:'=',
        acceptanceItem:'=',
        measureIndexes:'=',
        currentIndex:'=',
        imageUrl:'=',
        regionId:'=',
        regionName:'=',
        tips:'=',
        project:'=',
        regionType:'=',
        readonly:'='
      },
      link:link
    }
    function link(scope,element,attr,ctrl){
      var remoteS = {
        buff:[],
        buff2:[],
        uploading:false,
        t:null,
        t1:null,
        t2:null,
        replaceData:function(data){
          var self = this;
          for(var i= 0,l=self.buff.length;i<l;i++) {
            if (self.buff[i].properties.$id == data.properties.$id) {
              self.buff[i] = data;
              return true;
            }
          }
          return false;
        },
        update:function(data){
          var self = this;
          if(!self.replaceData(data))
            self.buff.push(data);

          if(!self.t){
            self.t = $timeout(function(){
              self.t = null;
              var updates = self.buff;
              self.buff=[];
              self.tips('正在保存测量点……');
              remote.ProjectQuality.MeasurePoint.create(updates).then(function(r){
                if(r.data.ErrorCode==0) {
                  self.tips('已保存测量点。');
                }
                else{
                  self.tips(r.data.ErrorMessage);
                }
              })
            },500);
          }
        },
        replaceData2:function(data){
          var self = this;
          for(var i= 0,l=self.buff2.length;i<l;i++) {
            if (self.buff2[i].$id == data.$id) {
              self.buff2[i] = data;
              return true;
            }
          }
          return false;
        },
        updateData:function(data){
          var self = this;
          if(!self.replaceData2(data))
            self.buff2.push(data);

          if(!self.t2){
            self.t2 = $timeout(function(){
              self.t2 = null;
              var updates = self.buff2;
              self.buff2=[];
              self.tips('正在保存测量值……');
              //data.ParentMeasurePointID = data.$groupId;

              remote.ProjectQuality.MeasureValue.create(updates).then(function(r){
                if(r.data.ErrorCode==0) {
                  self.tips('已保存测量值。');
                }
                else{
                  self.tips(r.data.ErrorMessage);
                }
              });
            },500);
          }

          //remoteS.updateData
         // console.log('update value',data);
        },
        delete:function(data){
          var self = this;
          self.tips('正在删除测量点……');
          remote.ProjectQuality.MeasureValue.delete(data.properties.MeasureValueId).then(function(){
            self.tips('已删除测量点。');
          });
          //console.log('delete layer',data);
        },
        tips:function(tp){
          scope.tips = tp;
          if(this.t1)
            $timeout.cancel(this.t1);
          this.t1=$timeout(function(){
            scope.tips = '';
          },1500)
        }
      }
      var points={},
        options = {
        onLoad:function(){
          var layer = this;
          if(layer.loaded)return;
          layer.loaded = true;
          var defer = points[scope.acceptanceItem+scope.regionId],
            defer2 = points[scope.acceptanceItem+scope.regionId+'2'];
          if(!defer)
            defer = points[scope.acceptanceItem+scope.regionId] =
              remote.ProjectQuality.MeasurePoint.query(scope.acceptanceItem,scope.regionId,scope.regionType,0);
          if(!defer2)
            defer2 = points[scope.acceptanceItem+scope.regionId+'2'] =
              remote.ProjectQuality.MeasureValue.query(scope.acceptanceItem,scope.regionId,scope.regionType,0);
          remoteS.tips('正在加载点数据……');
          $q.all([defer,defer2]).then(function(rs){
            var ps = [];
            rs[1].data.forEach(function(value){
              rs[0].data.forEach(function(f){
               // console.log('a',f.properties.$id,value.MeasurePointID,f.properties.$id==value.MeasurePointID)
                if(f.properties.$id==value.MeasurePointID && (value.AcceptanceIndexID==scope.measureIndexes[scope.currentIndex].AcceptanceIndexID|| (scope.measureIndexes[scope.currentIndex].cds&&scope.measureIndexes[scope.currentIndex].cds.find(function(a){
                    return a.AcceptanceIndexID==f.properties.AcceptanceItemID;
                  })))){
                  value.seq = value.MeasurPointName||value.seq;


                  if(f.geometry.type =='Stamp' && !value.color) {
                    options.setColor(value);
                    f.options && (f.options.color = value.color);
                  }
                  angular.extend(f.properties,value);
                  if(scope.measureIndexes[scope.currentIndex].cds) {
                    var prevP = ps.find(function (f1) {
                      return f1.properties.$id == f.properties.$id;
                    });
                    if (prevP) {
                      prevP.cds[value.AcceptanceIndexID]=value
                    }
                    else {
                      f.cds = {};
                      f.cds[value.AcceptanceIndexID]=value;
                      ps.push(f);
                    }
                  }
                  else{
                    ps.push(f);
                  }
                }
              });
            });

            remoteS.tips('加载完毕');

              var idx = scope.measureIndexes.find(function(m){return m.AcceptanceIndexID==layer.options.acceptanceIndexID;});
              if(idx && idx.QSKey=='5'){
                remoteS.tips('正在加载上层数据……');
                xhUtils.getRegion(scope.areaId,function(r){
                  var find = r.find(scope.regionId);
                  if(find) {
                    var ix = find.$parent.Children.indexOf(find);
                    var prev = find.$parent.prev();
                    if (prev)
                      prev = prev.Children[ix];
                    if(prev) {
                      $q.all([remote.ProjectQuality.MeasurePoint.query(scope.acceptanceItem, prev.RegionID, scope.regionType, 0),
                          remote.ProjectQuality.MeasureValue.query(scope.acceptanceItem, prev.RegionID, scope.regionType, 0)])
                        .then(function (rs) {
                          //var ps2 = [];
                          rs[1].data.forEach(function(value){
                            rs[0].data.forEach(function(f){
                              if(f.properties.$id==value.MeasurePointID && value.AcceptanceIndexID==scope.measureIndexes[scope.currentIndex].AcceptanceIndexID) {
                                value.seq = value.MeasurPointName || value.seq;
                                value.CheckRegionID = prev.RegionID;
                                value.MeasurePointID = f.properties.MeasurePointID;
                                var to = ps.find(function (p) {
                                  return p.properties.$id == f.properties.$id;
                                })
                                if (to) {
                                  to.properties.Prev = value;
                                }
                                else {
                                  angular.extend(f.properties, {
                                    CheckRegionID:scope.regionId,
                                    RegionType:scope.regionType,
                                    MeasureValueId:sxt.uuid(),
                                    Prev: value
                                  });
                                  ps.push(f);
                                }
                              }
                              remoteS.tips('加载上层完毕');
                              layer.addData(ps);
                            });
                          });
                        });
                    }
                  }
                });
              }
            else{
              layer.addData(ps);
            }
          });

        },
        onUpdateData:function(context){
          var value = context.layer.getValue();
          if(value.cds){
            for(var k in value.cds){
              this.onUpdateD(angular.extend({},value,{
                $id:value.cds[k].$id||sxt.uuid(),
                AcceptanceIndexID:k,
                MeasureValueId:value.cds[k].MeasureValueId||sxt.uuid(),
                MeasureValue:value.cds[k].MeasureValue,
                MeasurePointID:value.MeasurePointID
              }));
              value.MeasureValue = value.cds[k].MeasureValue;
            }
          }
          else {
            this.onUpdateD(value);
          }
          if(value.Prev &&(( !value.Prev.CalculatedValue && value.CalculatedValue)||value.Prev.NeedUpload)){
            value.Prev.NeedUpload = true;
            value.Prev.CalculatedValue = value.CalculatedValue;
            value.Prev.AcceptanceItemID = value.AcceptanceItemID;
            value.Prev.MeasurPointName = value.MeasurPointName;
            value.Prev.MeasurPointType = value.MeasurPointType;
            value.Prev.RegionType = value.RegionType;
            remoteS.updateData(value.Prev);
          }
          this.setColor(value);
          context.layer.updateValue && context.layer.updateValue(scope.value);
        },
        onUpdateD:function(value){
          value.AcceptanceItemID = scope.acceptanceItem;
          value.CheckRegionID = scope.regionId;
          value.AcceptanceIndexID = value.AcceptanceIndexID || scope.measureIndexes[scope.currentIndex].AcceptanceIndexID;
          value.RegionType = scope.regionType;
          value.MeasureValueId = value.MeasureValueId||sxt.uuid();
          //value.ParentMeasureValueID = value.$groupId;
          value.MeasurePointID = value.MeasurePointID|| value.$id;
          value.MeasurPointName = value.seq;
          value.MeasurPointType = 0;
          remoteS.updateData(value);
        },
        setColor:function(v){
          if(!v || ((!v.MeasureValue) && v.MeasureValue!==0)) {
            v.color = '#9E9E9E';
          }
          else if(v.MeasureStatus==1){
            v.color = '#4CAF50';
          }
          else if(v.MeasureStatus==2){
            v.color = '#FFEB3B';
          }
          else if(v.MeasureStatus==3){
            v.color = '#F44336';
          }
          else if((v.MeasureValue||v.MeasureValue===0)){
            v.color = '#4CAF50';
          }
        },
        onPopup:function(e){
          if(e.layer instanceof L.Stamp
          || e.layer instanceof L.AreaGroup
          || e.layer instanceof L.LineGroup)
          var edit = mapPopupSerivce.get('mapPopup');
          if(edit) {
            //e.layer._value.seq =
            edit.scope.context = e;
            edit.scope.readonly = scope.readonly;
            edit.scope.apply && edit.scope.apply();
            return edit.el[0];
          }
        },
        onUpdate:function(layer,isNew,isGroup){
          var v = layer.getValue();
          this.setColor(v);
          layer.updateValue && layer.updateValue(v);
          remoteS.update(layer.toGeoJSON());
          if(isNew || isGroup){
            if(isGroup) {
              v.ParentMeasureValueID = isGroup === true ? null : isGroup.getValue().MeasureValueId;
            }
            this.onUpdateD(v);
          }
        },
        onDelete:function(layer){
          remoteS.delete(layer.toGeoJSON());
        }
      },project,tile;
      var install = function(){
        if(!scope.measureIndexes || !scope.regionId)return;
        if(!project){
          project = scope.project = new L.SXT.Project (element[0], {
            map: {
              map: {}
            }
          });
        }
        if(tile)
          project._map.removeLayer(tile);
        tile = L.tileLayer(sxt.app.api+'/Api/Picture/Tile/{z}_{x}_{y}?path=/fs/UploadFiles/Framework/'+ scope.imageUrl, {attribution: false,noWrap: true});
        project._map.addLayer(tile);

        var featureGroups= {};
        scope.measureIndexes.forEach(function(m){
          var id = scope.regionId+m.AcceptanceIndexID;
          if(project._featureGroups[id])return;
          var g = featureGroups[id] = angular.copy(m);
          g.options = angular.copy(options);
          g.options.regionId = scope.regionId;
          g.options.acceptanceIndexID = m.AcceptanceIndexID;
          g.options.regionName = scope.regionName;
          g.toolbar = {
            draw:{},
            group:{
              lineGroup: m.QSKey=='3',
              areaGroup:m.QSKey=='4'
            }
          };
          if(scope.readonly==true){
            g.toolbar.draw =false;
            g.toolbar.group =false;
          }
        });

        project.registerGroups(featureGroups);
        project.swipeFeature(scope.regionId+scope.measureIndexes[scope.currentIndex].AcceptanceIndexID);
      }
      $timeout(function() {
        scope.$watchCollection('measureIndexes', function () {
          install();
        });
        scope.$watch('regionId',function(){
          install();
        });
        scope.$watch('currentIndex',function(){
          if(project){
            project.swipeFeature(scope.regionId+scope.measureIndexes[scope.currentIndex].AcceptanceIndexID);
          }
        })
      },500);

    }
  }
})();

/**
 * Created by jiuyuong on 2016/3/30.
 */
(function(){
  'use strict';

  sxtSc.$inject = ["$timeout", "mapPopupSerivce", "db", "$q", "sxt", "xhUtils"];
  angular
    .module('app.xhsc')
    .directive('sxtSc', sxtSc);

  /** @Inject */
  function sxtSc($timeout,mapPopupSerivce,db,$q,sxt,xhUtils){

    return {
      scope:{
        areaId:'=',
        acceptanceItem:'=',
        measureIndexes:'=',
        imageUrl:'=',
        regionId:'=',
        regionName:'=',
        tips:'=',
        project:'=',
        regionType:'=',
        readonly:'='
      },
      link:link
    }
    function link(scope,element,attr,ctrl){
      var map,tile,fg,toolbar,data = db('db_00001_sc'),points = db('db_00001_point');
      var install = function(){
        if(!scope.imageUrl || !scope.regionId || !scope.measureIndexes || !scope.measureIndexes.length)return;
        if(!map){
          map = L.map(element[0],{
            crs: L.SXT.SXTCRS,
            center: [.3, .2],
            zoom: 2,
            minZoom: 0,
            maxZoom: 3,
            scrollWheelZoom: true,
            annotationBar: false,
            attributionControl: false
          });
        }
        if(!tile || tile.regionId!=scope.regionId) {
          if(tile)
            map.removeLayer(tile);
          tile = L.tileLayer(sxt.app.api+'/Api/Picture/Tile/{z}_{x}_{y}?path=/fs/UploadFiles/Framework/'+ scope.imageUrl, {attribution: false,noWrap: true});
          tile.regionId = scope.regionId;
        }

        if(fg)
          map.removeLayer(fg);


        if(toolbar)
          map.removeControl(toolbar);


        map.addLayer(tile);

        fg = new L.SvFeatureGroup({
          onLoad:function(){
            var layer = this;
            if(layer.loaded)return;
            layer.loaded = true;
            data.findAll(function(o){
              return o.CheckRegionID==scope.regionId
               && o.AcceptanceItemID==scope.acceptanceItem
               && !!scope.measureIndexes.find(function(m){
                  return m.AcceptanceIndexID == o.AcceptanceIndexID;
                });
            }).then(function(r){
              fg.data = r.rows;
              points.findAll(function(o){
                return r.rows.find(function(i){
                  return i.MeasurePointID == o._id;
                })!=null;
              }).then(function(p){
                //fg.addLayer(p);
                p.rows.forEach(function(geo){
                  layer.addData(geo.geometry);
                })
              })
            });
          },
          onUpdate:function(layer,isNew,group){
            var point = layer.toGeoJSON();
            point = {
              _id:point.properties.$id,
              geometry:point
            };
            points.addOrUpdate(point);
            if(isNew){
              scope.measureIndexes.forEach(function (m) {
                var v = {
                  _id:sxt.uuid(),
                  MeasurePointID:point._id,
                  CheckRegionID:scope.regionId,
                  RegionType:scope.regionType,
                  AcceptanceItemID:scope.acceptanceItem,
                  AcceptanceIndexID:m.AcceptanceIndexID
                };
                data.addOrUpdate(v);
                fg.data.push(v);
              })
            }
            if(group){
              var groupId = group.getValue().$id,//添加或移出的groupId
                measureIndexs = xhUtils.findAll(scope.measureIndexes,function (m) {
                  return m.QSKey=='3'||m.QSKey=='4';
                }),//需要组或区测量的指标
                values = xhUtils.findAll(fg.data,function (d) {
                  return d.MeasurePointID == point._id && !!measureIndexs.find(function (m) {
                      return m.AcceptanceIndexID==d.AcceptanceIndexID;
                    });
                });//相关操作记录值
              if(!point.geometry.properties.$groupId){//清除groupId
                values.forEach(function (v) {
                  v.ParentMeasureValueID = null;
                  data.addOrUpdate(v);
                })
              }
              else{//添加或更改groupId
                values.forEach(function (v) {
                  var parent = fg.data.find(function (m) {
                    return m.AcceptanceIndexID == v.AcceptanceIndexID && m.MeasurePointID==groupId;
                  });
                  v.ParentMeasureValueID = parent._id;
                  data.addOrUpdate(v);
                })
              }
            }
          },
          onUpdateData:function(context,updates,scope){
            updates.forEach(function(m){
              data.addOrUpdate(m.v);
            });
            console.log('onUpdate',context,updates);
          },
          onDelete:function (layer) {
            var id = layer.getValue().$id,
              values = xhUtils.findAll(fg.data,function (d) {
              return d.MeasurePointID == id && !!scope.measureIndexes.find(function (m) {
                  return m.AcceptanceIndexID==d.AcceptanceIndexID;
                });
            });
            points.delete(id);
            values.forEach(function (v) {
              data.delete(v._id);
            })
          },
          onPopup:function(e){
            if(e.layer instanceof L.Stamp
              || e.layer instanceof L.AreaGroup
              || e.layer instanceof L.LineGroup)
              var edit = mapPopupSerivce.get('mapPopup');
            if(edit) {
              //e.fg._value.seq =
              edit.scope.context = e;
              edit.scope.data = {
                measureIndexes:scope.measureIndexes,
                regionId:scope.regionId,
                regionType:scope.regionType,
                acceptanceItem:scope.acceptanceItem,
                values:fg.data
              };
              edit.scope.readonly = scope.readonly;
              edit.scope.apply && edit.scope.apply();
              return edit.el[0];
            }
          }
        }).addTo(map);
        toolbar = new L.Control.Draw({
          featureGroup:fg,
          group:{
            lineGroup: !!scope.measureIndexes.find(function (m) {
              return m.QSKey=='3'
            }),
            areaGroup:!!scope.measureIndexes.find(function (m) {
              return m.QSKey=='4'
            })
          }
        }).addTo(map);

      };
      $timeout(function(){
        scope.$watchCollection('measureIndexes',function(){
          install();
        });
        scope.$watch('regionId',function(){
          install();
        });
      },500);
    }
  }


})();

/**
 * Created by jiuyuong on 2016/4/12.
 */
(function(){
  'use strict';

  sxtProcedureDown.$inject = ["xhUtils"];
  angular
    .module('app.xhsc')
    .directive('sxtProcedureDown',sxtProcedureDown)
    .directive('sxtProcedureTb',sxtProcedureTb)
    .filter('sxtProcedureS',sxtProcedureS);
  /** @ngInject */
  function sxtProcedureDown(xhUtils){
    return {
      scope:{
        obj:'=ngModel',
        value:'=',
        areaId:'=',
        regionType:'='
      },
      template:'<md-menu flex="none">' +
      '<md-button aria-label="展开工序" ng-click="$mdOpenMenu($event)">' +
      '<md-icon md-menu-origin  md-font-icon="icon-menu"></md-icon> {{value.MeasureItemName}}' +
      '</md-button>' +
      '<md-menu-content width="6" >' +
      '<md-tabs md-border-bottom >' +
      '<md-tab ng-repeat="g in types|sxtProcedureS">' +
      '<md-tab-label><span sxt-procedure-tb>{{g.$name}}({{g.ps.length}})</span></md-tab-label>' +
      '<md-tab-body>' +
      '<md-content>' +
      '<section ng-if="g.children && g.children.length" ng-repeat="c in g.children|sxtProcedureS">' +
      '<md-subheader class="md-primary">{{c.$name}}({{c.ps.length}})</md-subheader>\
      <md-list layout-padding>\
      <md-list-item ng-click="sett(p)" ng-repeat="p in c.ps">\
      {{p.MeasureItemName}}\
      </md-list-item>\
      </md-list>\
      </section>\
       <md-list   layout-padding>\
      <md-list-item ng-click="sett(p)" ng-repeat="p in g.ps">\
      {{p.MeasureItemName}}\
      </md-list-item>\
      </md-list>\
      </md-content>\
     </md-tab-body>\
      </md-tab>\
      </md-tabs>\
    </md-menu-content>\
    </md-menu>',
      link:link
    }

    function link(scope,element,attrs,ctrl){
      scope.$watch('areaId',function(){
        if(scope.areaId){
          xhUtils.getProcedure(scope.areaId,function(data){
            scope.types = data;
          });
        }
      })
      scope.$watch('value',function(){
      });

      scope.sett = function(p){
        scope.value = p;
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
 * Created by jiuyuong on 2016/4/3.
 */
(function(){
  'use strict';

  sxtNumInput.$inject = ["$timeout"];
  angular
    .module('app.xhsc')
    .directive('sxtNumInput', sxtNumInput);

  /** @Inject */
  function sxtNumInput($timeout){
    return {
      scope:{
        value:'=ngModel',
        ok:'&',
        sliderStep:'=ngStep'
      },
      link:link,
      templateUrl:'app/main/xhsc/directive/sxtNumInput.html'
    }

    function link(scope,element,attr,ctrl){

      scope.cancel = function($event){
        $event.stopPropagation();
        $event.preventDefault();
      }
      scope.ck = function(cmd,$event){

        $event && scope.cancel($event);
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
          default:
            str += cmd;
            break;
        }
        scope.value = str;

      }
      scope.$watch('value',function(){
       // scope.value2 =  isNaN(parseFloat(scope.value))?0:parseFloat(scope.value);
       // scope.step = 0.1;
      })
    }
  }


})();

/**
 * Created by jiuyuong on 2016/4/3.
 */
(function(){
  'use strict';

  sxtNumDowndown.$inject = ["$timeout"];
  angular
    .module('app.xhsc')
    .directive('sxtNumDowndown', sxtNumDowndown);

  /** @Inject */
  function sxtNumDowndown($timeout){
    return {
      scope:{
        value:'=ngModel',
        ct:'='
      },
      link:link,
      template:'<div class="sxtnumdowndown" style="position:relative"><span ng-click="toggleView()" style="display: block;">&nbsp;{{value}}</span><div class="numberpanel"  style="position: absolute;left:-56px;top:30px;width:auto;z-index:10005;display:none;" ><sxt-num-input ng-model="value" ok="ok()"></sxt-num-input></div></div>'
    }

    function link(scope,element,attr,ctrl){
      //ng-show="isView"
     $('.numberpanel').css('display','none');
      if(typeof(scope.ct)=="object") {
        if(scope.ct == undefined) return;
        scope.ct.show = function () {
          //console.log('ele',$(element).parent().parent().parent())
          if ($(element).parent().parent().hasClass('addPanel')) {
            if($(element).parent().parent().parent().hasClass('stamp')){
              for(var i=0;i<$(element).parent().parent().parent().find('.addPanel').length;i++){
                $(element).parent().parent().parent().find('.addPanel').eq(i).find('.numberpanel').css('display', 'none');
              }
              $(element).parent().parent().parent().find('.addPanel').eq(0).find('.numberpanel').css('display', 'block');

            }else{
               $(element).parent().parent().eq(0).find('.numberpanel').css('display', 'block');
               $(element).find('.numberpanel').css('display', 'block');
            }

          } else if ($(element).parent().hasClass('addPanel')) {
            $(element).parent().eq(0).find('.numberpanel').css('display', 'block');
          } else {
            $('.numberpanel').css('display', 'block');
            //$(element).find('.numberpanel').css('display', 'block');
          }
        };
      };
      scope.toggleView = function(){
        //console.log('a',$(element).parent().siblings().find('.numberpanel').length)
        if($(element).parent().siblings().find('.numberpanel').length){
          $('.addPanel .numberpanel').css('display','none');
          $(element).parent().siblings().find('.numberpanel').css('display','none');
          $(element).parent().parent().siblings().find('.numberpanel').css('display','none');
        }else{
          $(element).parent().parent().siblings().find('.numberpanel').css('display','none');
          $('table .numberpanel').css('display','none');
        }
        if($(element).find('.numberpanel').is(':hidden')){
          $(element).find('.numberpanel').css('display','block');
          var width = $('.sxt-num-input').width()-$(element).parent().width();
          $(element).find('.numberpanel').css('left',-width/2+'px');
          //scope.isView = true;
        }else{
          $(element).find('.numberpanel').css('display','none');
          //$('.numberpanel').css('display','none');
        }
      }
      scope.ok = function(){
        //$(element).find('.numberpanel').css('display','none');
        $('.numberpanel').css('display','none');
      }
      var docClick = function(e){
        var target = $(e.target);
        if(target.closest(".sxtnumdowndown").length == 0){
          //$(element).find('.numberpanel').css('display','none');
          $('.numberpanel').css('display','none');
        }
      }
      $(document).bind("click",docClick);

      scope.$on('$destroy',function(){
        $('.numberpanel').css('display','none');
        $(document).unbind("click",docClick);
      })
    }
  }


})();

/**
 * Created by leshuangshuang on 16/4/18.
 */
(function(){
  'use strict';

  sxtMapsDirective.$inject = ["$timeout"];
  angular
    .module('app.xhsc')
    .directive('sxtMaps',sxtMapsDirective);

  /** @ngInject */
  function sxtMapsDirective($timeout){
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
            center: [39.193092,117.106007],
            zoom: 14,
            attributionControl: false
          }),
          layer = L.tileLayer('http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
            subdomains: "1234"
          });

        layer.addTo(map);
        var mks = [];

          scope.markers = [];


              scope.markers.push({
                projectId:'1234567',
                title: '天津星河时代',
                lat: '39.193092',
                lng: '117.106007',
                pinyin:'tjxhsd'
              })


          angular.forEach(scope.markers, function (o, k) {
            mks.push(L
              .marker([o.lat, o.lng], L.extend({
                icon: L.icon({
                  iconUrl: 'libs/leaflet/images/L.png',
                  iconSize: [70, 70],
                  iconAnchor: [35, 35]
                })
              }, o))
              .on('click', markerClick)
              .addTo(map));
          })

        map.on('zoomend', function (e) {
          var zoom = map.getZoom();

          if(zoom <=12) {
            mks.forEach(function (marker) {
              marker.setIcon(L.icon({
                iconUrl: 'libs/leaflet/images/M.png',
                iconSize: [27, 37],
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
 * Created by jiuyuong on 2016/4/12.
 */
(function(){
  sxtLineGroup.$inject = ["mapPopupSerivce"];
  angular
    .module('app.xhsc')
    .directive('sxtLineGroup',sxtLineGroup);

  /** @Inject */
  function sxtLineGroup(mapPopupSerivce){
    return {
      restrict:'E',
      scope:{
      },
      templateUrl:'app/main/xhsc/directive/sxtLineGroup.html',
      link:link
    }
    function  link(scope,element,attr,ctrl){
      scope.removeLayer = function(){
        var layer = scope.context.layer;
        layer._fg.removeLayer(layer);
      }
      scope.cancelEdit = function(){
        var layer = scope.context.layer;
        layer.editing && layer.editing.disable();
      }

      mapPopupSerivce.set('LineGroup',{
        el:element,
        scope:scope
      });
      scope.$on('$destroy',function(){
        mapPopupSerivce.remove('LineGroup');
      })
    }
  }
})();

/**
 * Created by emma on 2016/5/4.
 */
(function(){
  'use strict';
  angular
    .module('app.xhsc')
    .directive('sxtImages',sxtImagesDirective);

  /** @ngInject */
  function sxtImagesDirective(){
    return {
      restrict:'ECMA',
      scope:{
        sxtImages:'='
      },
      link:link
    }

    function link(scope,element,attr,ctrl){
      //
      var player,defaultIndex,viewer,o;
      var imagedata = scope.sxtImages;
      player = function(a,e){
        console.log('element',scope)
        defaultIndex = $('.img img').index($(a.target))
        if (defaultIndex == -1)
          defaultIndex = 0;
        var str = [];
        str.push('<ul>')
        angular.forEach(imagedata, function (data) {
          var arl = data.url;
          str.push('<li><img src="' + arl + '"></li>');
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
          },
          build:function(){

          },
          view:function(){

          }
        });
       viewer.show();
        viewer.view(defaultIndex);
        var str1 = [];
        str1.push('<li class="viewer-delete">删除</li>');
        $(str1.join('')).appendTo('.viewer-toolbar');
        $('.viewer-delete').on('click',function(){
          var nowIndex = viewer.index;
          //imagedata = imagedata.splice(nowIndex,1);
          console.log('de',imagedata.splice(nowIndex,1))
        })

      }
      element.on ('click', player);
    }
  }
})();

/**
 * Created by zhangzhaoyong on 16/2/16.
 */
(function(){
  'use strict';

  sxtImageViewDirective.$inject = ["$rootScope", "api", "$q", "utils"];
  angular
    .module('app.xhsc')
    .directive('sxtImageView',sxtImageViewDirective);

  /** @ngInject */
  function sxtImageViewDirective($rootScope, api, $q,utils) {
    return {
      restrict: 'EA',
      link: link,
      scope:{
        isContainer:'='
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
              request.push(api.szgc.FilesService.group(g));
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
                imagedata.push ({date: f.CreateDate, url: sxt.app.api + f.Url.substring (1)});
              })
            })
          };
          if (!imagedata) {
            imagedata = [];
            $('img', element).each(function (index, el) {
              console.log('el',element)
              imagedata.push({url:$(el)[0].src});
            })
            defaultIndex = $('img', element).index($(a.target))
            if (defaultIndex == -1)
              defaultIndex = 0;
          }
          if(imagedata.length==0){
            utils.alert('暂无图片')
            return;
          }
          console.log('img',imagedata)
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
          $('.piclayer').remove();
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
 * Created by emma on 2016/3/31.
 */
(function(){
  mapPopup.$inject = ["mapPopupSerivce"];
  angular
    .module('app.xhsc')
    .directive('mapPopup',mapPopup);

  /** @Inject */
  function mapPopup(mapPopupSerivce){
    return {
      restrict:'A',
      scope:{
        popup:'@mapPopup'
      },
      link:link
    }
    function  link(scope,element,attr,ctrl){
      mapPopupSerivce.set(scope.popup,{
        el:element,
        scope:scope
      });
      scope.$on('$destroy',function(){
        mapPopupSerivce.remove(scope.popup);
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
       // vm.form = {id: 1, RealName: "v-zhangqy03", Token: "429ad0b0d7ab966180cc4718324c50ddf176d099", Username: "v-zhangqy03"}
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
 * Created by jiuyuong on 2016/4/11.
 */
(function(){
  'use strict';

  config.$inject = ["apiProvider"];
  angular
    .module('app.xhsc')
    .config(config);

  /** @ngInject */
  function config(apiProvider){
    var $http = apiProvider.$http,
      $q = apiProvider.$q;
  var r = function(data){
  return $q(function(resolve){
    resolve({
      data:data
    })
  });
}
  apiProvider.register('xhsc',{
    Assessment:{
      query:function () {
        return $http.get($http.url('/Api/ProjectInfoApi/GetAssessmentProject'))
      },
      queryRegion:function (areaID) {
        return $http.get($http.url('/Api/ProjectInfoApi/GetRegionTreeInfo',{AreaID:areaID}));
      }
    },
	    /**
       * 实测实量项
       */
      Measure:{
        /**
         * 获取本人所有实测项目(并非自定义的，而是系统基础项)
         *
         * @param    {string}  areaID     分期
         * */
        query:function(areaID) {
          //return $http.get($http.url('/Api/MeasureInfo/MeasureQuery', {areaID: areaID}));
          return r([{
            AcceptanceItemID:"abc", //模板中的实测项
            AcceptanceItemName:"土建",//实测项名称
            Building:""   //模板
          },{
            AcceptanceItemID:"abc", //模板中的实测项
            AcceptanceItemName:"抹灰",//实测项名称
            Building:""   //模板
          }])
          /*return query (array ({
           AcceptanceItemID: 'string1',
           MeasureItemName: '测量项{0}',
           SpecialtyID: 'id1;id2',
           SpecialtyName: '专业类型;专业类型',
           /!**
           * 1 、项目
           * 2、 区域
           * 4、 楼项
           * 8、 楼层
           * 16、 房间
           * *!/
           RegionType: 1 | 2 | 4 | 8 | 16
           }
           ))*/
        },
        MeasureIndex:{
          /**
           * 获取实测项所有指标
           *
           * @param  {string} acceptanceItemID 实测项ID
           * */
          query:function() {
            return r([{
              AcceptanceIndexID:"",
              ParentAcceptanceIndexID:"",
              AcceptanceItemID:"",
              IndexName:"门窗",
              IndexType:"",
              MeasureMethod:"",
              QSKey:"",
              QSCondition:"",
              QSValue:"",
              QSOtherValue:"",
              PassYieldComputeMode:"",
              GroupSign:"",
              Weight:"",
              SinglePassYield:"",
              SummaryPassYield:"",
              IconImage:"",
              IconColor:""
            },{
              AcceptanceIndexID:"",
              ParentAcceptanceIndexID:"",
              AcceptanceItemID:"",
              IndexName:"天花板",
              IndexType:"",
              MeasureMethod:"",
              QSKey:"",
              QSCondition:"",
              QSValue:"",
              QSOtherValue:"",
              PassYieldComputeMode:"",
              GroupSign:"",
              Weight:"",
              SinglePassYield:"",
              SummaryPassYield:"",
              IconImage:"",
              IconColor:""
            }])
          }
        }
      },

      region:{
        query:function(areaID) {
          return $http.get($http.url('http://ggroupem.sxtsoft.com:9191/Api/ProjectInfoApi/GetRegionTreeInfo',
            {AreaID: areaID}));
          //return $http.get($http.url('/Api/MeasureInfo/MeasureQuery', {areaID: areaID}));
          //return r([{
          //  RegionID:"yq",
          //  RegionName:"天津三栋",
          //  RegionType:"",
          //  HouseTypeID:"",
          //  HouseTypeName:"",
          //  DrawingID:"",
          //  DrawingName:"",
          //  DrawingImageUrl:"",
          //  Children:[
          //    {
          //      RegionID:"ld",
          //      RegionName:"",
          //      ParentID:"",
          //      RegionType:"",
          //      HouseTypeID:"",
          //      HouseTypeName:"",
          //      DrawingID:"",
          //      DrawingName:"",
          //      DrawingImageUrl:"",
          //      Children:[
          //        {
          //          RegionID:"lc",
          //          RegionName:"",
          //          ParentID:"",
          //          RegionType:"",
          //          HouseTypeID:"",
          //          HouseTypeName:"",
          //          DrawingID:"",
          //          DrawingName:"",
          //          DrawingImageUrl:"",
          //          Children:[
          //            {
          //              RegionID:"room",
          //              RegionName:"",
          //              ParentID:"",
          //              RegionType:"",
          //              HouseTypeID:"",
          //              HouseTypeName:"",
          //              DrawingID:"",
          //              DrawingName:"",
          //              DrawingImageUrl:""
          //            }
          //          ]
          //        }
          //      ]
          //    },
          //    {
          //      RegionID:"ld",
          //      RegionName:"",
          //      ParentID:"",
          //      RegionType:"",
          //      HouseTypeID:"",
          //      HouseTypeName:"",
          //      DrawingID:"",
          //      DrawingName:"",
          //      DrawingImageUrl:"",
          //      Children:[
          //        {
          //          RegionID:"lc",
          //          RegionName:"",
          //          ParentID:"",
          //          RegionType:"",
          //          HouseTypeID:"",
          //          HouseTypeName:"",
          //          DrawingID:"",
          //          DrawingName:"",
          //          DrawingImageUrl:"",
          //          Children:[
          //            {
          //              RegionID:"room",
          //              RegionName:"",
          //              ParentID:"",
          //              RegionType:"",
          //              HouseTypeID:"",
          //              HouseTypeName:"",
          //              DrawingID:"",
          //              DrawingName:"",
          //              DrawingImageUrl:""
          //            }
          //          ]
          //        }
          //      ]
          //    }
          //  ]
          //})
          /*return query (array ({
           AcceptanceItemID: 'string1',
           MeasureItemName: '测量项{0}',
           SpecialtyID: 'id1;id2',
           SpecialtyName: '专业类型;专业类型',
           /!**
           * 1 、项目
           * 2、 区域
           * 4、 楼项
           * 8、 楼层
           * 16、 房间
           * *!/
           RegionType: 1 | 2 | 4 | 8 | 16
           }
           ))*/
        }

      },
      /**
       * 项目
       * */
      Project:{
        query:function(){
          return $http.get($http.url('/Api/ProjectInfoApi/GetProjectList'));
        },
        /**
         * 分期
         * */
        Area:{
          /**
           * 获取本人所有相关分期
           * */
          query:function(){
            return $http.get($http.url('/Api/ProjectInfoApi/GetProjectAreaList'));
          },
          /**
           * 获取分期所楼栋、层、房间数据
           * @param    {string}  areaID     分期ID
           * */
          queryRegion:function(areaID){
            return $http.get($http.url('/api/ProjectInfoApi/GetRegionTreeByRegionID',{AreaID:areaID}));
          }
        },

        /**
         * 获取<tt>regionID</tt>户型图
         * @param {string} regionID the区域ID
         * @returns {object}
         * */
        getHouseDrawing:function(regionID){
          return $http.get($http.url('/Api/MeasurePointApi/GetHouseDrawing',{regionID:regionID}));
        },
        /**
         * 获取楼层图
         * @param {string} regionID　区域ID
         * @returns {object}
         * */
        getFloorDrawing:function(regionID){
          return $http.get($http.url('/Api/MeasurePointApi/getFloorDrawing',{regionID:regionID}));
        },
        /**
         * 更新户型图
         * @param {string} regionID 户型ID
         * @param {object} draw 户型描述
         *        {
         *          DrawingID:'',//使用图片
         *          Geometry:'' //几何信息
         *        }
         * @returns {*}
         * **/
        updateHouseDrawing:function(regionID,draw){
          return $http.post('/Api/MeasureInfo/ModifyHouseType',{regionID:regionID,draw:draw});
          /**return post(regionID,draw);**/
        }
      },

      /**
       * 验收状态
       * */
      MeasureCheckBatch:{
        /**
         * @param    {string}  acceptanceItemID     实测项ID/工序ID
         * @param    {string}  areaID  分期ID
         * @param    {int}     acceptanceItemIDType  返回状态类型（目前仅为1）
         *           1   --实测项
         *           2   --工序
         *           3   --整改
         * */
        getStatus:function(acceptanceItemID, areaID, acceptanceItemIDType) {
          return $http.get($http.url('/Api/MeasureInfo/getStatus', {
            acceptanceItemID: acceptanceItemID,
            areaID: areaID,
            acceptanceItemIDType: acceptanceItemIDType
          }));

          /** return query(array({
            RegionID:'string{0}',
            RegionType:1,
            AcceptanceItemID:'acceptanceItemID{0}',//自定义后的实测项目ID
            /**
             * 0：未验收
             * 1：进行中
             * 2：已验收
             *
            Status:Math.floor(Math.random()*2)
          }))
           }**/
        }
      },

	    /**
       * 质量管理
       */
      ProjectQuality:{
		    /**
         * 检查点
         *
         */
        MeasurePoint:{
          /**
           * 更新或添加测量标注点
           * @param {Array} points
           *        [{
           *        type:'Feature',//固定为Feature
           *        geometry:{
           *          type:'stamp' // 固定为stamp
           *          coordinates:[0.21,0.20003] //图形位置信息
           *        }，
           *        options:{       //几何图形配置项，属性不固定，不同的geometry.type不尽相同
           *          color:'red'
           *        },
           *        properties:{
           *          $id:'guid', //唯一ID
           *          $groupId:'guid' //所在属组（可以不用，但请保存为UI使用）
           *        }
           *      }]
           * **/
          create:function(points){
            return $http.post('/Api/MeasurePointApi/CreatePoint', points)
            /**return post(points);**/
          },
          /**
           * 删除点
           *
           * @param {string} measurePointID 唯一ID
           * */
          delete:function(measurePointID) {
            return $http.delete($http.url('/Api/MeasurePointApi/DeletePoint', {measurePointID: measurePointID}))
          },

          /**
           * 获取点
           * @param {string} acceptanceItemID 实测项Id
           * @param {string} checkRegionID 区域ID
           * @param {int} flags 0或空时为返回当前层，-1返回上一层同户型
           *
           * @returns {object}
           *          {
           *            type:'FeatureCollection',固定为FeatureCollection
           *            features:[{
           *              type:'Feature',//固定为Feature
           *              geometry:{
           *                type:'lineGroup' // lineGroup 测量组 或　areaGroup　区域组 或　stamp　测量点，以后会更多类型
           *                coordinates:[] //图形位置信息
           *              }，
           *              options:{       //几何图形配置项，属性不固定，不同的geometry.type不尽相同
           *                color:'red'
           *              },
           *              properties:{
           *                $id:'guid', //唯一ID
           *                $groupId:'guid' //所在属组（可以不用，但请保存为UI使用）
           *               }
           *            }]
           *          }
           *
           * */
          query:function(acceptanceItemID,checkRegionID,regionType,flags){
            return $http.get($http.url('/Api/MeasurePointApi/GetMeasurePoint', {acceptanceItemID: acceptanceItemID,checkRegionID:checkRegionID,regionType:regionType,flags:flags}))

           /** return get({
              type: 'FeatureCollection',//固定为FeatureCollection
              features: [{
                type: 'Feature',//固定为Feature
                geometry: {
                  type: 'lineGroup', // lineGroup 测量组 或　areaGroup　区域组 或　stamp　测量点，以后会更多类型
                  coordinates: [] //图形位置信息
                },
                options: {       //几何图形配置项，属性不固定，不同的geometry.type不尽相同
                  color: 'red'
                },
                properties:{
                  $id:'guid', //唯一ID
                  $groupId:'guid' //所在属组（可以不用，但请保存为UI使用）
                }
              }]
            });**/
          },

          submit:function(values){
            return $http.post('/Api/MeasurePointApi/MeasureSubmit',values)
          }
        },
		    /***
         * 检查值
         */
        MeasureValue: {
          /**
           * 添加或更新测试值
           * @param {Array} values 测试值
           *        [{
           *          AcceptanceItemID:"",//实测项ID 必填
           *          CheckRegionID:'',//测量区域Id 必填
           *          RegionType:'',//区域类型 必填
           *          ParentMeasurePointID:'',//所在测量组ID，如果没有为null，对应$groupId
           *          MeasurePointID:'',//测量点ID
           *          AcceptanceIndexID:'',//指标ID
           *          MeasureValue:''//测量值
           *          DesignValue:''//设计值
           *          CalculatedValue:''//计算值
           *          Remark:'',//备注
           *          ExtendedField1:'',//扩展字段1
           *          ExtendedField2:'',//扩展字段2
           *          ExtendedField3:''//扩展字段3
           *        }]
           * */
          create: function (values) {
            return $http.post('/Api/MeasureValueApi/CreateMeasureValue', values);
          },

          /**
           * 获取检查点值
           * @param {string} acceptanceItemID 实测项Id
           * @param {string} checkRegionID 区域ID
           * */
          query: function (acceptanceItemID, checkRegionID, flags) {
            return $http.get($http.url('/Api/MeasureValueApi/GetMeasureValues', {
              acceptanceItemID: acceptanceItemID,
              checkRegionID: checkRegionID
            }));
        },
          /**
           * 删除点
           *
           * @param {string} measureValueId 唯一ID
           * */
          delete:function(measureValueId) {
            return $http.delete($http.url('/Api/MeasureValueApi/DeleteMeasureValue', {measureValueId: measureValueId}))
          }
        },

        getNumber:function(acceptanceItemID,checkRegionID){
          return $http.get($http.url('/Api/MeasureValueApi/GetMeasureRecordNum',{acceptanceItemID:acceptanceItemID,checkRegionID:checkRegionID}));
        },
        getMeasureCheckResult:function(measureRecordID){
          return $http.get($http.url('/Api/MeasureValueApi/GetMeasureCheckResult',{measureRecordID:measureRecordID}))
        }
        //测量项的点测量数据：



//
//【AcceptanceIndexID: "bda32789505d4adf9457fccd64b69bf2"//指标ID
//AcceptanceItemID: "e66a7435e8274dc0b7c09924ce1ee91c"//测量项ID
//CheckRegionID: "77961e877d4c4f9890dbe6207853d59f"//区域ID
//CheckStatus: 1//验收状态
//CompanyName: null//公司名称
//IndexName: "结构截面尺寸"//指标名称
//MeasureRecordID: "d80f8e047db84b24aadb50ab154bd6a4"//测量记录ID
//MeasureStatus: 2 //测量状态
//MeasureTime: "2016-04-20 11:21:59"//测量时间
//MeasureUserId: "admin" //测量人ID
//MeasureUserName: "体验帐户" //测量人
//ParticipantIDs: null
//MaximumDeviation：//最大偏差值
//Points: 【
//AcceptanceIndexID: "aa2672eedfb94418b18449c3d704f9c7"//指标ID
//CalculatedValue: 1//计算值
//DesignValue: null//设计值
//MeasurPointName: "2"//标点名称
//MeasureRecordID: "d80f8e047db84b24aadb50ab154bd6a4"//测量记录ID
//MeasureStatus: 1//状态
//MeasureValue: 5//测量值
//MeasureValueId: "09c9d723d1ff4dc8aa3d11e632eee67b"
//ParentMeasureValueID: null
//】
//QualifiedRate: null
//】
      }
    });

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
      //'vanke'     : {
      //  primary   : {
      //    name: 'blue-1',
      //    hues: {
      //      'default': '500',
      //      'hue-1'  : '500',
      //      'hue-2'  : '500',
      //      'hue-3'  : '500'
      //    }
      //  },
      //  accent    : {
      //    name: 'blue-1',
      //    hues: {
      //      'default': '500',
      //      'hue-1'  : '500',
      //      'hue-2'  : '500',
      //      'hue-3'  : '500'
      //    }
      //  },
      //  warn      : {name: 'blue-1'},
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
    .provider('db',pouchDB)
/** @ngInject */
  function pouchDB() {
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
      db.get(id).then(function (doc) {
        return db.remove(doc);
      });
    },
    findAll:function (filter) {
      return this.allDocs({include_docs:true}).then(function (result) {
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
    }
  };

  self.$get = ["$window", "$q", function ($window, $q) {
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
      var db = new $window.PouchDB(name, options);
      return wrapMethods(db, self.methods);
    };
  }];

  function toDoc(doc) {
    if(doc instanceof Error)
      return doc;
    return doc;
  }
  function now() {
    return new Date().toISOString();
  }

  function addTimestamps(object) {
    object.updatedAt = now()
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
    var forEach = angular.forEach,loginedUser={};
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

                $state.go('app.xhsc.home')
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
      $rootScope.toggle = false;
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
      $rootScope.toLeft = function(){
          $rootScope.$emit('leftEvent');
        }
      $rootScope.toRight = function(){
          $rootScope.$emit('rightEvent');
        }
      $rootScope.toggleRight = function(){
          $rootScope.$emit('toggleRightEvent');
      }
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

      //remote.Project.Area.query().then(function(result){
      //  vm.Areas = result.data.rows;
      //  vm.selectedArea = vm.Areas[0];
      //})
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

    TopToolbarController.$inject = ["$scope", "remote", "$rootScope"];
    angular
        .module('app.toolbar')
        .controller('TopToolbarController', TopToolbarController);

    /** @ngInject */
    function TopToolbarController($scope,remote,$rootScope) {
      var vm=this;
      $scope.goBack = function(){
        history.go(-1);//返回
      }
/*      remote.Project.Area.query().then(function(result){
        vm.Areas = result.data;
        vm.selectedArea = vm.Areas[0];
      })*/

      vm.change = function(){
        $rootScope.$emit('areaSelect',vm.selectedArea)
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

            // auth
            'app.auth',

            'app.xhsc'
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
          $rootScope.sendBt = toState.sendBt;
          $rootScope.subtitle = toState.subtitle;
          $rootScope.leftArrow = toState.leftArrow;
          $rootScope.rightArrow = toState.rightArrow;
          $rootScope.refreshBtn = toState.refreshBtn;
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
      /*$provide.decorator('taOptions', [
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
      ]);*/

      // Text Angular tools
      /*$provide.decorator('taTools', [
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
      ]);*/


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
$templateCache.put("app/core/layouts/content-with-footbar.html","<div id=\"layout-content-with-footbar\" class=\"template-layout\" layout=\"column\" flex=\"\"><md-toolbar id=\"toptoolbar\" class=\"md-menu-toolbar md-whiteframe-1dp\" ui-view=\"toptoolbar\"></md-toolbar><md-content id=\"content\" class=\"md-background md-hue-1\" layout=\"column\" ui-view=\"content\" flex=\"\"></md-content><md-toolbar id=\"toolbar2\" class=\"md-menu-toolbar md-whiteframe-1dp\" ui-view=\"toolbar\"></md-toolbar></div>");
$templateCache.put("app/core/layouts/content-with-toolbar.html","<div id=\"layout-content-with-toolbar\" class=\"template-layout\" layout=\"column\" flex=\"\"><md-toolbar id=\"toolbar\" class=\"md-menu-toolbar md-whiteframe-1dp\" ui-view=\"toolbar\"></md-toolbar><md-content id=\"content\" class=\"animate-slide-up md-background md-hue-1\" ui-view=\"content\" flex=\"\"></md-content></div>");
$templateCache.put("app/core/layouts/horizontal-navigation.html","<div id=\"layout-horizontal-navigation\" class=\"template-layout\" layout=\"column\" flex=\"\"><md-toolbar id=\"toolbar\" class=\"md-menu-toolbar\" ui-view=\"toolbar\"></md-toolbar><div id=\"horizontal-navigation\" class=\"md-whiteframe-1dp\" ui-view=\"navigation\"></div><div id=\"content-container\" flex=\"\" layout=\"column\"><md-content id=\"content\" class=\"animate-slide-up md-background md-hue-1\" ms-scroll=\"\" ui-view=\"content\" flex=\"\"></md-content></div><md-sidenav id=\"quick-panel\" class=\"md-sidenav-right md-whiteframe-4dp\" md-component-id=\"quick-panel\" ms-scroll=\"\" ui-view=\"quickPanel\"></md-sidenav></div>");
$templateCache.put("app/core/layouts/vertical-navigation.html","<div id=\"layout-vertical-navigation\" class=\"template-layout\" layout=\"row\" flex=\"\"><md-sidenav id=\"vertical-navigation\" class=\"md-primary-bg\" md-is-locked-open=\"$mdMedia(\'gt-sm\')\" md-component-id=\"navigation\" ms-scroll=\"\" ui-view=\"navigation\" style=\"background-color: #f5f5f7\"></md-sidenav><div id=\"content-container\" flex=\"\" layout=\"column\"><md-toolbar id=\"toolbar\" class=\"md-menu-toolbar md-whiteframe-1dp\" ui-view=\"toolbar\"></md-toolbar><md-content id=\"content\" class=\"animate-slide-up md-background md-hue-1\" ms-scroll=\"\" ui-view=\"content\" layout=\"column\" flex=\"\"></md-content></div><md-sidenav id=\"quick-panel\" class=\"md-sidenav-right md-whiteframe-4dp\" md-component-id=\"quick-panel\" ms-scroll=\"\" ui-view=\"quickPanel\"></md-sidenav></div>");
$templateCache.put("app/core/theme-options/theme-options.html","<div class=\"ms-theme-options-panel\" layout=\"row\" layout-align=\"start start\"><div class=\"ms-theme-options-panel-button md-primary-bg\" ng-click=\"toggleOptionsPanel()\"><md-icon md-font-icon=\"icon-cog\" class=\"white-text\"></md-icon></div><div class=\"ms-theme-options-list\" layout=\"column\"><div class=\"theme-option\"><div class=\"option-title\">Layout Style:</div><md-radio-group layout=\"column\" ng-model=\"vm.layoutStyle\" ng-change=\"vm.updateLayoutStyle()\"><md-radio-button value=\"verticalNavigation\">Vertical Navigation</md-radio-button><md-radio-button value=\"horizontalNavigation\">Horizontal Navigation</md-radio-button><md-radio-button value=\"contentOnly\">Content Only</md-radio-button><md-radio-button value=\"contentWithToolbar\">Content with Toolbar</md-radio-button></md-radio-group></div><md-divider></md-divider><div class=\"theme-option\"><div class=\"option-title\">Layout Mode:</div><md-radio-group layout=\"row\" layout-align=\"start center\" ng-model=\"vm.layoutMode\" ng-change=\"vm.updateLayoutMode()\"><md-radio-button value=\"boxed\">Boxed</md-radio-button><md-radio-button value=\"wide\">Wide</md-radio-button></md-radio-group></div><md-divider></md-divider><div class=\"theme-option\"><div class=\"option-title\">Color Palette:</div><md-menu-item ng-repeat=\"(themeName, theme) in vm.themes.list\" class=\"theme\"><md-button class=\"md-raised theme-button\" aria-label=\"{{themeName}}\" ng-click=\"vm.setActiveTheme(themeName)\" ng-style=\"{\'background-color\': theme.primary.color,\'border-color\': theme.accent.color,\'color\': theme.primary.contrast1}\" ng-class=\"themeName\"><span><md-icon ng-style=\"{\'color\': theme.primary.contrast1}\" md-font-icon=\"icon-palette\"></md-icon><span>{{themeName}}</span></span></md-button></md-menu-item></div></div></div>");
$templateCache.put("app/main/sample/sample.html","<h1>{{vm.helloText}}</h1>");
$templateCache.put("app/core/directives/ms-search-bar/ms-search-bar.html","<div flex=\"\" layout=\"row\" layout-align=\"start center\"><label for=\"ms-search-bar-input\"><md-icon id=\"ms-search-bar-expander\" md-font-icon=\"icon-magnify\" class=\"icon s24\"></md-icon><md-icon id=\"ms-search-bar-collapser\" md-font-icon=\"icon-close\" class=\"icon s24\"></md-icon></label> <input id=\"ms-search-bar-input\" type=\"text\" ng-model=\"global.search\" placeholder=\"Search\" translate=\"\" translate-attr-placeholder=\"TOOLBAR.SEARCH\" flex=\"\"></div>");
$templateCache.put("app/main/auth/login/login.html","<md-content class=\"login\" layout=\"column\"><div id=\"login\"><div id=\"login-form-wrapper\" layout=\"column\" layout-align=\"center center\" layout-align-xs=\"center start\"><div id=\"login-form\" style=\"padding:40px 60px;background: rgba(255,255,255,.95);border-radius:8px;box-shadow: 0 0 8px #ccc;width: 50%;position: absolute;top:50%;left: 50%;transform: translate(-50%,-50%);\"><div class=\"logo1\"><span><img src=\"app/main/xhsc/images/logo.png\"></span></div><form name=\"loginForm\" novalidate=\"\" ng-submit=\"vm.login(loginForm)\"><div class=\"login-name\"><md-input-container class=\"md-block\" md-no-float=\"\"><md-icon md-svg-src=\"app/main/auth/images/user.svg\"></md-icon><input type=\"text\" name=\"username\" ng-model=\"vm.form.username\" placeholder=\"请输入用户名\" required=\"\"></md-input-container><md-divider></md-divider><md-input-container class=\"md-block\" md-no-float=\"\"><md-icon md-svg-src=\"app/main/auth/images/password.svg\"></md-icon><input type=\"password\" name=\"password\" ng-model=\"vm.form.password\" placeholder=\"请输入密码\" required=\"\"></md-input-container></div><md-checkbox>记住用户名</md-checkbox><div layout=\"row\" layout-align=\"center center\"><md-button type=\"submit\" flex=\"\" class=\"md-raised md-warn\" aria-label=\"登录\" translate=\"LOGIN.LOG_IN\" translate-attr-aria-label=\"LOGIN.LOG_IN\">登录</md-button></div></form></div></div></div></md-content>");
$templateCache.put("app/navigation/layouts/horizontal-navigation/navigation.html","<div layout=\"row\" layout-align=\"start center\"><ms-navigation-horizontal></ms-navigation-horizontal></div>");
$templateCache.put("app/navigation/layouts/vertical-navigation/navigation.html","<md-toolbar class=\"navigation-header md-whiteframe-1dp\" layout=\"row\" layout-align=\"space-between center\"><div class=\"logo\" layout=\"row\" layout-align=\"start center\"><span class=\"logo-image\"><img src=\"libs/leaflet/images/L.png\"></span> <span class=\"logo-text\">工程大数据</span></div><md-icon class=\"fold-toggle s18\" md-font-icon=\"icon-backburger\" hide=\"\" show-gt-sm=\"\" ng-click=\"vm.toggleMsNavigationFolded()\"></md-icon></md-toolbar><ms-navigation class=\"scrollable\" folded=\"vm.folded\" ms-scroll=\"vm.msScrollOptions\"></ms-navigation>");
$templateCache.put("app/main/xhsc/directive/sxtLineGroup.html","<div layout-padding=\"\"><div class=\"mappopup\"><div layout=\"row\"><sxt-num-downdown ng-model=\"vm.bass\" show-number-panel=\"showNumberPanel\"></sxt-num-downdown></div></div><div layout-gt-sm=\"row\" class=\"takeph\"><span style=\"color:#fff;min-width:70px;display: inline-block;vertical-align: top;height:30px;line-height: 26px;padding: 2px;\">拍照</span><md-icon style=\"margin:0 0 0 10px;\"><img src=\"app/main/xhsc/images/camera.png\" width=\"35\"></md-icon></div><div layout=\"row\"><md-button class=\"md-mini\" flex=\"\" ng-click=\"removeLayer()\"><span>删除</span></md-button><md-button class=\"md-mini\" flex=\"\" ng-click=\"cancelEdit()\"><span>取消</span></md-button><span flex=\"\"></span><md-button class=\"md-mini\" flex=\"\" ng-click=\"updateValue()\"><span>确定</span></md-button></div></div>");
$templateCache.put("app/main/xhsc/directive/sxtNumInput.html","<div class=\"sxt-num-input\" layout=\"column\"><div layout=\"column\" class=\"newkeyboard\"><div flex=\"\" layout=\"row\"><div flex=\"25\"><md-button class=\"md-raised\" ng-dblclick=\"cancel($event)\" ng-click=\"ck(7,$event)\">7</md-button></div><div flex=\"25\"><md-button class=\"md-raised\" ng-dblclick=\"cancel($event)\" ng-click=\"ck(8,$event)\">8</md-button></div><div flex=\"25\"><md-button class=\"md-raised\" ng-dblclick=\"cancel($event)\" ng-click=\"ck(9,$event)\">9</md-button></div><div flex=\"25\"><md-button class=\"md-raised\" ng-dblclick=\"cancel($event)\" ng-click=\"ck(\'ac\',$event)\">AC</md-button></div></div><div flex=\"\" layout=\"row\"><div flex=\"25\"><md-button class=\"md-raised\" ng-dblclick=\"cancel($event)\" ng-click=\"ck(4,$event)\">4</md-button></div><div flex=\"25\"><md-button class=\"md-raised\" ng-dblclick=\"cancel($event)\" ng-click=\"ck(5,$event)\">5</md-button></div><div flex=\"25\"><md-button class=\"md-raised\" ng-dblclick=\"cancel($event)\" ng-click=\"ck(6,$event)\">6</md-button></div><div flex=\"25\"><md-button class=\"md-raised\" ng-dblclick=\"cancel($event)\" ng-click=\"ck(\'+-\',$event)\">+/-</md-button></div></div><div flex=\"\" layout=\"row\"><div flex=\"25\"><md-button class=\"md-raised\" ng-dblclick=\"cancel($event)\" ng-click=\"ck(1,$event)\">1</md-button></div><div flex=\"25\"><md-button class=\"md-raised\" ng-dblclick=\"cancel($event)\" ng-click=\"ck(2,$event)\">2</md-button></div><div flex=\"25\"><md-button class=\"md-raised\" ng-dblclick=\"cancel($event)\" ng-click=\"ck(3,$event)\">3</md-button></div><div flex=\"25\"><md-button class=\"md-raised\" ng-dblclick=\"cancel($event)\" ng-click=\"ck(-1,$event)\">←</md-button></div></div><div flex=\"\" layout=\"row\"><div flex=\"25\"><md-button class=\"md-raised\" ng-dblclick=\"cancel($event)\" ng-click=\"ck(0,$event)\">0</md-button></div><div flex=\"25\"><md-button class=\"md-raised\" ng-dblclick=\"cancel($event)\" ng-click=\"ck(\'.\',$event)\">.</md-button></div><div flex=\"50\" style=\"margin:5px 5px;\"><md-button class=\"md-raised\" ng-dblclick=\"cancel($event)\" ng-click=\"ck(\'ok\',$event)\" style=\"width:100%;margin:0\">确定</md-button></div></div></div></div>");
$templateCache.put("app/main/xhsc/directive/sxtScMapPopup.html","<div class=\"md-padding\" style=\"width: 300px;\"><div class=\"mappopup\"><div layout=\"row\" ng-if=\"PointType==\'Stamp\'\"><span flex=\"none\" style=\"color:#fff;display: inline-block;width:90px;text-align:right;vertical-align: top;margin-top:0;height:30px;line-height: 26px;padding: 2px;margin-bottom:20px;\">点序号：</span><md-input-container flex=\"\"><input ng-model=\"value.seq\"></md-input-container></div><div class=\"stamp\"><div layout=\"row\" ng-repeat=\"idx in MeasureIndex.cds\" class=\"addPanel\"><span flex=\"none\" style=\"color:#fff;width:90px;text-align:right;display: inline-block;vertical-align: top;margin-top:0;height:30px;line-height: 26px;padding: 2px;margin-bottom:20px;\">{{idx.IndexName}}：</span> <span flex=\"\" style=\"position: relative;display: inline-block;height:30px;line-height: 30px;border-bottom: 1px solid #555;\"><sxt-num-downdown ct=\"ct\" ng-model=\"value.cds[idx.AcceptanceIndexID].MeasureValue\"></sxt-num-downdown></span></div></div><div layout=\"row\" ng-if=\"(MeasureIndex.QSKey==\'1\'||MeasureIndex.QSKey==\'5\') && (!MeasureIndex.children||!MeasureIndex.children.length)\"><span flex=\"none\" style=\"color:#fff;width:90px;text-align:right;display: inline-block;vertical-align: top;margin-top:0;height:30px;line-height: 26px;padding: 2px;margin-bottom:20px;\">实测值：</span> <span flex=\"\" style=\"position: relative;display: inline-block;height:30px;line-height: 30px;border-bottom: 1px solid #555;\"><sxt-num-downdown ct=\"ct\" ng-model=\"value.MeasureValue\"></sxt-num-downdown></span></div><div ng-if=\"MeasureIndex.QSKey==\'5\'\" layout=\"row\"><span style=\"color:#fff;min-width:90px; text-align: center; display: inline-block;vertical-align: top;margin-top:0;height:30px;line-height: 26px;padding: 2px;margin-bottom:20px;\">楼下值:</span> <span style=\"position: relative;width:100%;display: inline-block;height:30px;border-bottom: 1px solid #555;line-height: 30px;\">{{value.Prev && value.Prev.MeasureValue}}</span></div><div ng-if=\"MeasureIndex.QSKey==\'5\'\" layout=\"row\"><span style=\"color:#fff;min-width:90px; text-align: center; display: inline-block;vertical-align: top;margin-top:0;height:30px;line-height: 26px;padding: 2px;margin-bottom:20px;\">对比值:</span> <span style=\"position: relative;width:100%;display: inline-block;height:30px;border-bottom: 1px solid #555;line-height: 30px;\">{{value.CalculatedValue = (value.Prev?value.MeasureValue - value.Prev.MeasureValue:null) }}</span></div><table ng-if=\"MeasureIndex.QSKey==\'2\'\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"margin-bottom:15px;width:100%\"><thead><tr><th style=\"width:80px; text-align: center;\">实测值</th><th ng-repeat=\"item in MeasureIndex.children\">{{item.IndexName}}</th></tr></thead><tbody><tr><td style=\"width:80px; text-align: center;\">实测值</td><td ng-repeat=\"item in MeasureIndex.children\"><sxt-num-downdown ng-model=\"value[item.AcceptanceIndexID].MeasureValue\"></sxt-num-downdown></td></tr><tr><td style=\"width:80px; text-align: center;\">设计值</td><td ng-repeat=\"item in MeasureIndex.children\"><sxt-num-downdown ng-model=\"value[item.AcceptanceIndexID].DesignValue\"></sxt-num-downdown></td></tr><tr><td style=\"width:80px; text-align: center;\">结果</td><td ng-repeat=\"item in MeasureIndex.children\"><span>{{value[item.AcceptanceIndexID].MeasureValue-value[item.AcceptanceIndexID].DesignValue}}</span></td></tr></tbody></table><div layout=\"row\" ng-if=\"(MeasureIndex.QSKey==\'3\' || MeasureIndex.QSKey==\'4\') && PointType==\'Stamp\'\" class=\"addPanel nostamp\"><span style=\"text-align:right;color:#fff;min-width:90px;display: inline-block;vertical-align: top;margin-top:0;height:30px;line-height: 26px;padding: 2px;margin-bottom:20px;\">实测值：</span> <span style=\"position: relative;width:100%;display: inline-block;height:30px;line-height:30px;border-bottom: 1px solid #555;\"><sxt-num-downdown ct=\"ct\" ng-model=\"value.MeasureValue\"></sxt-num-downdown></span></div><div ng-if=\"(MeasureIndex.QSKey==\'3\' || MeasureIndex.QSKey==\'4\') && PointType!=\'Stamp\'\" class=\"stamp\"><div layout=\"row\"><span style=\"color:#fff;min-width:90px;text-align: right; display: inline-block;vertical-align: top;margin-top:0;height:30px;line-height: 26px;padding: 2px;margin-bottom:20px;\">组名称：</span><md-input-container><input ng-model=\"value.Remark\"></md-input-container></div><div ng-if=\"MeasureIndex.QSKey==\'3\'\" layout=\"row\" ng-repeat=\"item in values\" class=\"addPanel\"><span style=\"color:#fff;min-width:90px; text-align: right;display: inline-block;vertical-align: top;margin-top:0;height:30px;line-height: 26px;padding: 2px;margin-bottom:20px;padding-right:15px\">{{item.seq}}</span> <span style=\"position: relative;width:100%;display: inline-block;height:30px;border-bottom: 1px solid #555;line-height: 30px;\"><sxt-num-downdown ng-model=\"item.MeasureValue\" ct=\"ct\"></sxt-num-downdown></span></div><div ng-if=\"MeasureIndex.QSKey==\'3\'\" layout=\"row\"><span style=\"color:#fff;min-width:90px; text-align: right; display: inline-block;vertical-align: top;margin-top:0;height:30px;line-height: 26px;padding: 2px;margin-bottom:20px;\">差异：</span> <span style=\"position: relative;width:100%;display: inline-block;height:30px;border-bottom: 1px solid #555;line-height: 30px;\">{{distinct(values)}}</span></div><div ng-if=\"MeasureIndex.QSKey==\'4\'\" layout=\"row\"><span style=\"color:#fff;min-width:90px; text-align: center; display: inline-block;vertical-align: top;margin-top:0;height:30px;line-height: 26px;padding: 2px;margin-bottom:20px;\">包含实测点:</span> <span style=\"position: relative;width:100%;display: inline-block;height:30px;border-bottom: 1px solid #555;line-height: 30px;\"><span ng-repeat=\"item in values\">{{item.seq}},</span></span></div></div><div ng-if=\"MeasureIndex.IndexType==\'SelectMaterial\' && MeasureIndex.children.length\"><div layout=\"row\"><span style=\"color:#fff;min-width:90px;display: inline-block;vertical-align: top;margin-top:0;height:30px;line-height: 26px;padding: 2px;\">选择类型</span><md-input-container flex=\"\"><md-select ng-model=\"value.AcceptanceIndexID\"><md-option ng-repeat=\"item in MeasureIndex.children\" value=\"{{item.AcceptanceIndexID}}\">{{item.IndexName}}</md-option></md-select></md-input-container></div><div layout=\"row\" style=\"margin-top:20px;\" class=\"addPanel\"><span style=\"color:#fff;min-width:90px;display: inline-block;vertical-align: top;margin-top:0;height:30px;line-height: 26px;padding: 2px;margin-bottom:20px;\">实测值:</span> <span style=\"position: relative;width:100%;display: inline-block;height:30px;line-height:30px;border-bottom: 1px solid #555;\"><sxt-num-downdown ng-model=\"value.MeasureValue\"></sxt-num-downdown></span></div></div></div><div class=\"leaflet-draw-subbuttom sure\"><ul layout=\"row\"><li ng-if=\"!readonly\"><a class=\"\" href=\"javascript:void(0)\" ng-click=\"removeLayer()\">删除</a></li><li flex=\"\"></li><li><a class=\"\" href=\"javascript:void(0)\" ng-click=\"cancelEdit()\">取消</a></li><li ng-if=\"!readonly\"><a class=\"\" href=\"javascript:void(0)\" ng-click=\"updateValue()\">确定</a></li></ul></div></div>");
$templateCache.put("app/main/xhsc/directive/sxtScPopup.html","<div class=\"md-padding\" style=\"width: 300px;\"><div class=\"mappopup\"><div layout=\"row\" ng-repeat=\"item in edit.singleEdit\"><span flex=\"none\" style=\"color:#fff;min-width:90px;text-align:right;display: inline-block;vertical-align: top;margin-top:0;height:30px;line-height: 26px;padding: 2px;margin-bottom:20px;\">实测值：</span> <span flex=\"\" style=\"position: relative;display: inline-block;height:30px;line-height: 30px;border-bottom: 1px solid #555;\"><sxt-num-downdown ct=\"ct\" ng-model=\"item.v.MeasureValue\"></sxt-num-downdown></span></div><div class=\"stamp\"><div layout=\"row\" ng-repeat=\"item in edit.mutiEdit\" class=\"addPanel\"><span flex=\"none\" style=\"color:#fff;min-width:90px;text-align:right;display: inline-block;vertical-align: top;margin-top:0;height:30px;line-height: 26px;padding: 2px;margin-bottom:20px;\">{{item.m.IndexName}}：</span> <span flex=\"\" style=\"position: relative;display: inline-block;height:30px;line-height: 30px;border-bottom: 1px solid #555;\"><sxt-num-downdown ct=\"ct\" ng-model=\"item.v.MeasureValue\"></sxt-num-downdown></span></div></div><div ng-repeat=\"item in edit.floorEdit\"><div layout=\"row\"><span flex=\"none\" style=\"color:#fff;width:90px;text-align:right;display: inline-block;vertical-align: top;margin-top:0;height:30px;line-height: 26px;padding: 2px;margin-bottom:20px;\">实测值：</span> <span flex=\"\" style=\"position: relative;display: inline-block;height:30px;line-height: 30px;border-bottom: 1px solid #555;\"><sxt-num-downdown ct=\"ct\" ng-model=\"item.v.MeasureValue\"></sxt-num-downdown></span></div><div layout=\"row\"><span style=\"color:#fff;min-width:90px; text-align: center; display: inline-block;vertical-align: top;margin-top:0;height:30px;line-height: 26px;padding: 2px;margin-bottom:20px;\">楼下值:</span> <span style=\"position: relative;width:100%;display: inline-block;height:30px;border-bottom: 1px solid #555;line-height: 30px;\">{{item.v.DesignValue}}</span></div><div layout=\"row\"><span style=\"color:#fff;min-width:90px; text-align: center; display: inline-block;vertical-align: top;margin-top:0;height:30px;line-height: 26px;padding: 2px;margin-bottom:20px;\">对比值:</span> <span style=\"position: relative;width:100%;display: inline-block;height:30px;border-bottom: 1px solid #555;line-height: 30px;\">{{item.v.CalculatedValue = (item.v.DesignValue?item.v.MeasureValue - item.v.DesignValue:null) }}</span></div></div><table ng-if=\"edit.sjzEdit.length\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"margin-bottom:15px;width:100%\"><thead><tr><th style=\"width:80px; text-align: center;\">实测值</th><th ng-repeat=\"item in edit.sjzEdit\">{{item.m.IndexName}}</th></tr></thead><tbody><tr><td style=\"width:80px; text-align: center;\">实测值</td><td ng-repeat=\"item in edit.sjzEdit\"><sxt-num-downdown ng-model=\"item.v.MeasureValue\"></sxt-num-downdown></td></tr><tr><td style=\"width:80px; text-align: center;\">设计值</td><td ng-repeat=\"item in edit.sjzEdit\"><sxt-num-downdown ng-model=\"item.v.DesignValue\"></sxt-num-downdown></td></tr><tr><td style=\"width:80px; text-align: center;\">结果</td><td ng-repeat=\"item in edit.sjzEdit\"><span>{{item.v.CalculatedValue = (item.v.DesignValue?item.v.MeasureValue - item.v.DesignValue:null) }}</span></td></tr></tbody></table><div ng-if=\"edit.group\" class=\"stamp\"><div layout=\"row\"><span style=\"color:#fff;min-width:90px;text-align: right; display: inline-block;vertical-align: top;margin-top:0;height:30px;line-height: 26px;padding: 2px;margin-bottom:20px;\">组名称：</span><md-input-container><input ng-model=\"edit.group.v.Remark\"></md-input-container></div><div layout=\"row\"><span style=\"color:#fff;min-width:90px; text-align: center; display: inline-block;vertical-align: top;margin-top:0;height:30px;line-height: 26px;padding: 2px;margin-bottom:20px;\">包含实测值:</span> <span style=\"position: relative;width:100%;display: inline-block;height:30px;border-bottom: 1px solid #555;line-height: 30px;\"><span ng-repeat=\"item in edit.group.v.children\">{{item.MeasureValue}},</span></span></div><div layout=\"row\"><span style=\"color:#fff;min-width:90px; text-align: right; display: inline-block;vertical-align: top;margin-top:0;height:30px;line-height: 26px;padding: 2px;margin-bottom:20px;\">差异：</span> <span style=\"position: relative;width:100%;display: inline-block;height:30px;border-bottom: 1px solid #555;line-height: 30px;\">{{distinct(edit.group.v.children)}}</span></div></div></div><div class=\"leaflet-draw-subbuttom sure\"><ul layout=\"row\"><li ng-if=\"!readonly\"><a class=\"\" href=\"javascript:void(0)\" ng-click=\"removeLayer()\">删除</a></li><li flex=\"\"></li><li><a class=\"\" href=\"javascript:void(0)\" ng-click=\"cancelEdit()\">取消</a></li><li ng-if=\"!readonly\"><a class=\"\" href=\"javascript:void(0)\" ng-click=\"updateValue()\">确定</a></li></ul></div></div>");
$templateCache.put("app/main/xhsc/directive/sxtStamp.html","<div class=\"mappopup\"><div style=\"width:300px\"><div layout=\"row\"><sxt-num-downdown ng-model=\"vm.bass\"></sxt-num-downdown></div></div><div layout-gt-sm=\"row\" class=\"takeph\"><span style=\"color:#fff;min-width:70px;display: inline-block;vertical-align: top;height:30px;line-height: 26px;padding: 2px;\">拍照</span><md-icon style=\"margin:0 0 0 10px;\"><img src=\"app/main/xhsc/images/camera.png\" width=\"35\"></md-icon></div><div class=\"leaflet-draw-subbuttom\"><ul layout=\"row\"><li><a class=\"\" href=\"javascript:void(0)\" ng-click=\"removeLayer()\">删除</a></li><li flex=\"\"></li><li><a class=\"\" href=\"javascript:void(0)\" ng-click=\"cancelEdit()\">取消</a></li><li><a class=\"\" href=\"javascript:void(0)\" ng-click=\"updateValue()\">确定</a></li></ul></div></div>");
$templateCache.put("app/main/xhsc/home/demo.html","DEMO<div>{{vm.num}}</div><sxt-num-input ng-model=\"vm.num\"></sxt-num-input>");
$templateCache.put("app/main/xhsc/home/home.html","<div flex=\"\" layout=\"column\"><div flex=\"\" sxt-maps=\"\" markers=\"vm.markers\" marker-click=\"vm.markerClick($current)\"></div><div style=\"position: absolute;z-index: 10002; top:10px;right:10px;\"><md-autocomplete md-no-cache=\"true\" md-selected-item-change=\"vm.changeItem(item)\" md-item-text=\"item.title\" placeholder=\"项目搜索\" md-min-length=\"0\" md-items=\"item in vm.querySearch(vm.searchText)\" md-search-text=\"vm.searchText\"><md-item-template>{{item.title}}</md-item-template><md-not-found>未找到匹配项</md-not-found></md-autocomplete></div></div>");
$templateCache.put("app/main/xhsc/offline/manage.html","<div ng-cloak=\"\" layout=\"column\" flex=\"\" layout-fill=\"\"><md-content><md-toolbar md-scroll-shrink=\"\"><div class=\"md-toolbar-tools\"><h3><span>离线数据管理</span></h3><span flex=\"\"></span><md-button class=\"md-raised\" ng-click=\"vm.download()\">下载</md-button></div></md-toolbar><md-list><md-subheader class=\"md-no-sticky\">区域信息</md-subheader><md-list-item class=\"secondary-button-padding\" ng-repeat=\"region in regions\"><p>{{region.RegionName}}</p><md-button class=\"md-secondary\">{{region.tate}}</md-button></md-list-item><md-divider></md-divider><md-subheader class=\"md-no-sticky\">实测实量项</md-subheader><md-list-item class=\"secondary-button-padding\" ng-repeat=\"item in AcceptanceItems\"><p>{{item.AcceptanceItemName}}</p><md-button class=\"md-secondary\">{{item.state}}</md-button></md-list-item><md-divider></md-divider><md-subheader class=\"md-no-sticky\">实测指标项</md-subheader><md-list-item class=\"secondary-button-padding\" ng-repeat=\"index in AcceptanceIndexs\"><p>{{index.IndexName}}</p><md-button class=\"md-secondary\">{{index.state}}</md-button></md-list-item><md-divider></md-divider><md-subheader class=\"md-no-sticky\">图纸</md-subheader><md-list-item class=\"secondary-button-padding\" ng-if=\"false\"><p>实测指标项</p><md-button class=\"md-secondary\">More Info</md-button></md-list-item><md-divider></md-divider></md-list></md-content></div>");
$templateCache.put("app/main/xhsc/ys/ch2.html","<md-content class=\"floor-list md-hue-1\"><div class=\"right engineer\"><div layout=\"column\"><div style=\"border-bottom: 1px solid #d8d8d8;\"><h2 class=\"md-title\" style=\"color:#e93030;font-size:16px;margin:16px;\">土建 > 土建</h2></div><md-list><md-list-item><md-button><p>1层</p></md-button></md-list-item><md-list-item><md-button><p>1层</p></md-button></md-list-item><md-list-item><md-button><p>1层</p></md-button></md-list-item></md-list></div><div layout=\"column\"><div style=\"border-bottom: 1px solid #d8d8d8;\"><h2 class=\"md-title\" style=\"color:#e93030;font-size:16px;margin:16px;\">土建 > 土建</h2></div><md-list><md-list-item><md-button><p>1层</p></md-button></md-list-item><md-list-item><md-button><p>101</p></md-button></md-list-item><md-list-item><md-button><p>201</p></md-button></md-list-item></md-list></div></div></md-content>");
$templateCache.put("app/main/xhsc/ys/checkHouse.html","<md-content class=\"subheader\" style=\"position:relative;\"><div style=\"width: 100%;\" layout=\"column\"><div style=\"position: fixed;top:44px;background: #fff;height:40px;left:8px;right:8px;z-index:10;padding-top: 5px;\"><table cellspacing=\"0\" cellpadding=\"0\" border=\"0\" width=\"100%\" class=\"zdytable\" style=\"table-layout: fixed;margin-bottom: 0;\"><thead><tr><th colspan=\"4\" width=\"204\">检测内容</th><th>评判标准</th><th>扣分标准</th><th width=\"50\">权重</th><th width=\"50\">扣分</th><th width=\"50\">得分</th></tr></thead></table></div><div style=\"position: relative;padding:0 8px;\"><div style=\"margin-top:40px;\"></div><div><md-subheader class=\"md-primary\">标题一</md-subheader><table cellspacing=\"0\" cellpadding=\"0\" border=\"0\" width=\"100%\" class=\"zdytable\" style=\"table-layout: fixed;margin-bottom: 0;\"><tbody><tr><td rowspan=\"6\" class=\"procedurename\" width=\"28\"><p>钢筋工程</p></td><td rowspan=\"6\" class=\"procedurename\" width=\"28\"><p>钢筋工程</p></td><td rowspan=\"3\" class=\"procedurename\" width=\"28\"><p>钢筋工程</p></td><td width=\"120\">钢筋工程</td><td>检查人</td><td>检查人</td><td width=\"50\">检查人</td><td width=\"50\">检查人</td><td width=\"50\">检查人</td></tr><tr><td width=\"120\">钢筋工程</td><td>检查人</td><td>检查人</td><td width=\"50\">检查人</td><td width=\"50\">检查人</td><td width=\"50\">检查人</td></tr><tr><td width=\"120\">钢筋工程</td><td>检查人</td><td>检查人</td><td width=\"50\">检查人</td><td width=\"50\">检查人</td><td width=\"50\">检查人</td></tr><tr><td rowspan=\"3\" class=\"procedurename\" width=\"28\"><p>钢筋工程</p></td><td width=\"120\">钢筋工程</td><td>检查人</td><td>检查人</td><td width=\"50\">检查人</td><td width=\"50\">检查人</td><td width=\"50\">检查人</td></tr><tr><td width=\"120\">钢筋工程</td><td>检查人</td><td>检查人</td><td width=\"50\">检查人</td><td width=\"50\">检查人</td><td width=\"50\">检查人</td></tr><tr><td width=\"120\">钢筋工程</td><td>检查人</td><td>检查人</td><td width=\"50\">检查人</td><td width=\"50\">检查人</td><td width=\"50\">检查人</td></tr></tbody></table></div><div><md-subheader class=\"md-primary\">标题二</md-subheader><table cellspacing=\"0\" cellpadding=\"0\" border=\"0\" width=\"100%\" class=\"zdytable\"><tbody><tr><td>检查人</td><td>检查人</td></tr><tr><td>检查人</td><td>检查人</td></tr><tr><td>检查人</td><td>检查人</td></tr><tr><td>检查人</td><td>检查人</td></tr><tr><td>检查人</td><td>检查人</td></tr><tr><td>检查人</td><td>检查人</td></tr></tbody></table></div></div></div><table cellspacing=\"0\" cellpadding=\"0\" border=\"0\" width=\"100%\" class=\"zdytable\"><tr><td colspan=\"{{vm.cols + 5}}\" style=\"text-align: center;\" class=\"head\">abc</td></tr><tr><td colspan=\"{{vm.oneCols}}\">项目名称:{{vm.info.name}}</td><td colspan=\"{{vm.twoCols}}\">检查人:{{vm.person}}</td><td colspan=\"{{vm.twoCols}}\">检查日期:{{vm.time}}</td></tr><tr><td>内容</td><td style=\"width:100px;text-align: center;\">位置</td><td align=\"center\">结果</td><td align=\"center\">最大偏差</td><td align=\"center\">合格率</td><td ng-repeat=\"i in vm.alItem[0].Points\">{{$index+1}}</td></tr><tr ng-repeat=\"item in vm.alItem\"><td rowspan=\"{{vm.alItem.length}}\" colspan=\"1\" class=\"procedurename\" ng-if=\"$index==0\"><p>工程</p></td><td>{{item.IndexName}}</td><td>结果</td><td>结果</td><td>结果</td><td ng-repeat=\"point in item.Points\">{{point.MeasureValue}}</td></tr></table><table cellspacing=\"0\" cellpadding=\"0\" border=\"0\" width=\"100%\" class=\"zdytable\"><tr><td colspan=\"26\" style=\"text-align: center;\" class=\"head\">实测工序名称</td></tr><tr><td colspan=\"6\">项目名称:</td><td colspan=\"8\">检查房号:</td><td colspan=\"6\">检查人:</td><td colspan=\"6\">检查日期:</td></tr><tr><td>内容</td><td colspan=\"2\" style=\"width:100px;\">位置</td><td>结果</td><td>最大偏差</td><td>合格率</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td><td>16</td><td>17</td><td>18</td><td>19</td><td>20</td></tr><tr><td rowspan=\"9\" colspan=\"1\" class=\"procedurename\"><p>砼工程</p></td><td colspan=\"2\">结构立面垂直度≤8mm</td><td></td><td></td><td></td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td><td>16</td><td>17</td><td>18</td><td>19</td><td>20</td></tr><tr><td colspan=\"2\">结构表面平整度≤8mm</td><td></td><td></td><td></td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td><td>16</td><td>17</td><td>18</td><td>19</td><td>20</td></tr><tr><td colspan=\"2\">结构截面尺寸+8,-5mm</td><td></td><td></td><td></td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td><td>16</td><td>17</td><td>18</td><td>19</td><td>20</td></tr><tr><td colspan=\"1\" rowspan=\"2\">顶棚表面水平度≤10mm</td><td>客餐厅</td><td rowspan=\"2\"></td><td rowspan=\"2\"></td><td rowspan=\"2\"></td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td><td>16</td><td>17</td><td>18</td><td>19</td><td>20</td></tr><tr><td>餐厅</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td><td>16</td><td>17</td><td>18</td><td>19</td><td>20</td></tr><tr><td rowspan=\"2\">楼板厚度+8,-5mm</td><td>设计值</td><td rowspan=\"2\"></td><td rowspan=\"2\"></td><td rowspan=\"2\"></td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td><td>16</td><td>17</td><td>18</td><td>19</td><td>20</td></tr><tr><td>测量值</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td><td>16</td><td>17</td><td>18</td><td>19</td><td>20</td></tr><tr><td colspan=\"2\">建筑物周边方正度≤10mm</td><td></td><td></td><td></td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td><td>16</td><td>17</td><td>18</td><td>19</td><td>20</td></tr><tr><td colspan=\"2\">水电管线压槽深度≤15mm</td><td></td><td></td><td></td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td><td>16</td><td>17</td><td>18</td><td>19</td><td>20</td></tr></table><table cellspacing=\"0\" cellpadding=\"0\" border=\"0\" width=\"100%\" class=\"zdytable\"><tr><td colspan=\"26\" style=\"text-align: center;\" class=\"head\">实测工序名称</td></tr><tr><td colspan=\"6\">项目名称:</td><td colspan=\"8\">检查房号:</td><td colspan=\"6\">检查人:</td><td colspan=\"6\">检查日期:</td></tr><tr><td>内容</td><td colspan=\"2\" style=\"width:100px;\">位置</td><td>结果</td><td>最大偏差</td><td>合格率</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td><td>16</td><td>17</td><td>18</td><td>19</td><td>20</td></tr><tr><td rowspan=\"3\" colspan=\"1\" class=\"procedurename\"><p>水泥砂浆地面</p></td><td colspan=\"2\"></td><td>结果</td><td>最大偏差</td><td>合格率</td><td colspan=\"9\">表面平整度≤4mm</td><td>合格率</td><td colspan=\"10\">水平度≤10mm</td></tr><tr><td colspan=\"2\">主卧室</td><td rowspan=\"2\"></td><td rowspan=\"2\"></td><td rowspan=\"2\"></td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td rowspan=\"2\"></td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td><td>16</td><td>17</td><td>18</td><td>19</td><td>20</td></tr><tr><td colspan=\"2\">主卧室</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td><td>16</td><td>17</td><td>18</td><td>19</td><td>20</td></tr></table></md-content>");
$templateCache.put("app/main/xhsc/ys/choose.html","<div layout=\"column\" ng-cloak=\"\"><md-content class=\"main-padding md-hue-1\" layout=\"column\"><div class=\"selectArea\" style=\"position: fixed;z-index: 10;top:44px;left:0;width:100%;padding:10px 16px 0 16px;background:rgb(245,245,245);margin-bottom:10px;\"><md-select ng-model=\"vm.selectedArea\" style=\"margin-bottom: 0\"><md-option ng-value=\"area\" ng-repeat=\"area in vm.Areas\">{{area.ProjectName}}{{area.AreaName}}</md-option></md-select></div><div style=\"margin-top: 60px;\"></div><md-list class=\"procedure-list\" ng-repeat=\"procdure in vm.xhMeasure\"><h2 class=\"md-title\" style=\"color:#e93030;font-size:16px;margin:16px 0;\">{{procdure.$name}}<span ng-if=\"procdure.children[0].$name\">></span> {{procdure.children[0].$name}}</h2><md-list-item class=\"veggie-option\" layout=\"row\" layout-wrap=\"\" ui-sref=\"app.xhsc.chooseHouse({id:subpro.AcceptanceItemID,areaId:vm.selectedArea.AreaID,pname:subpro.MeasureItemName})\" ng-repeat=\"subpro in procdure.ps\"><div class=\"md-item-text\"><p class=\"md-primary\">{{subpro.MeasureItemName}}</p></div></md-list-item></md-list></md-content></div>");
$templateCache.put("app/main/xhsc/ys/chooseHouse.html","<div flex=\"\" layout=\"row\" style=\"max-height:48px;height:48px;position: absolute;top:0;width:100%;\"><md-list flex=\"\" layout=\"row\" style=\"background:#fff;padding:0;\" class=\"filter\"><md-list-item flex=\"25\" ng-class=\"{\'active\':vm.tabStatus == -1}\" ng-click=\"vm.myFilter(\'-1\')\"><span>全部</span></md-list-item><md-list-item flex=\"25\" ng-class=\"{\'active\':vm.tabStatus == 0}\" ng-click=\"vm.myFilter(\'0\')\"><span class=\"yet\"><i></i>未测量</span></md-list-item><md-list-item flex=\"25\" ng-class=\"{\'active\':vm.tabStatus == 1}\" ng-click=\"vm.myFilter(\'1\')\"><span class=\"ing\"><i></i>测量中</span></md-list-item><md-list-item flex=\"25\" ng-class=\"{\'active\':vm.tabStatus == 2}\" ng-click=\"vm.myFilter(\'2\')\"><span class=\"done\"><i></i>已测量</span></md-list-item></md-list></div><md-content layout=\"row\" flex=\"\" class=\"floor-list\" style=\"border-top:1px solid #d8d8d8;margin-top:48px;\" ng-show=\"vm.loadCircle\"><div style=\"text-align: right;width:100%;position: relative;\"><div style=\"position: absolute;right:60px;\"><md-progress-circular class=\"md-accent md-hue-1\" md-diameter=\"70\"></md-progress-circular></div></div></md-content><md-content layout=\"row\" flex=\"\" class=\"floor-list\" style=\"border-top:1px solid #d8d8d8;margin-top:48px;\" ng-show=\"!vm.loadCircle\"><div flex=\"40\" layout=\"column\" style=\"border-right:1px solid #d8d8d8;background: #fff;\"><md-content style=\"background: #fff;;padding-bottom:44px;\"><md-list ng-cloak=\"\" class=\"md-padding\"><md-divider></md-divider><md-list-item ng-repeat=\"item in vm.Region| myFilter:vm.tabStatus\" ng-click=\"vm.open(item)\" ng-class=\"{\'active\':item.actived}\"><p ng-class=\"{\'ing\':item.status==1,\'done\':item.status==2,\'yet\':item.status==0}\">{{item.RegionName }}</p><md-icon class=\"md-secondary go\" ng-click=\"vm.goMeasure()\" md-font-icon=\"icon-pencil\"></md-icon><md-icon class=\"md-secondary\" ng-show=\"item.showArr\" md-font-icon=\"icon-chevron-right\"></md-icon><md-divider></md-divider></md-list-item></md-list></md-content></div><div flex=\"60\" layout=\"column\" class=\"right\"><md-content style=\"background: #fff;;padding-bottom:44px;\"><div class=\"search\"><div class=\"search_bar\" ng-click=\"vm.search()\"><i ng-if=\"!vm.showSearch && !vm.number\" class=\"searchicon\"></i> <input type=\"text\" class=\"inputtext\" ng-model=\"vm.number\" ng-blur=\"vm.hideSearch()\" placeholder=\"搜索\"></div></div><div ng-repeat=\"floor in vm.current.Children |filter:vm.number|myFilter:vm.tabStatus\" layout=\"column\"><h3><div class=\"header\"><div class=\"margin\" ng-class=\"{\'ing\':floor.status==1,\'done\':floor.status==2,\'yet\':floor.status==0}\"><md-button ng-click=\"vm.changeStat(floor,vm.floors)\"><p>{{floor.RegionName}}</p><i ng-if=\"vm.muti\" style=\"position: absolute;right:5px;top:6px;\" class=\"myselect\" ng-class=\"{\'selected\':floor.selected}\"></i></md-button></div></div></h3><md-list><md-list-item ng-repeat=\"room in floor.Children | filter:vm.number|myFilter:vm.tabStatus\"><md-button ng-click=\"vm.changeStat(room,floor.Children)\" ng-class=\"{\'ing\':room.status==1,\'done\':room.status==2,\'yet\':room.status==0}\"><p>{{ room.RegionName}}</p><i style=\"position: absolute;right:5px;top:6px;\" ng-if=\"vm.muti\" class=\"myselect\" ng-class=\"{\'selected\':room.selected}\"></i></md-button></md-list-item></md-list></div></md-content></div></md-content><div class=\"inner-footerbar\" ng-if=\"vm.muti\"><md-toolbar><md-list flex=\"\" layout=\"row\" style=\"background:#fff;padding:0;\"><md-list-item flex=\"\" style=\"border-right:1px solid #d8d8d8;\"><md-button style=\"color:#000;\">取消选择</md-button></md-list-item><md-list-item flex=\"\"><md-button style=\"color:#000;\">确定</md-button></md-list-item></md-list></md-toolbar></div>");
$templateCache.put("app/main/xhsc/ys/ddetail.html","<div layout=\"column\" class=\"ddetail\"><div class=\"detailTop\"><div class=\"dTopl\" flex=\"\"><h3>星河智慧一期现场评估</h3><p>2016年 第一季度</p></div><div class=\"dTopr\"><a><md-progress-circular md-mode=\"determinate\" value=\"80\" md-diameter=\"30\"></md-progress-circular><md-icon></md-icon></a></div></div><md-list class=\"detaillist\"><md-list-item><p class=\"alread\"><span>图片文件</span>(245/245 files)</p></md-list-item><md-list-item><p class=\"downing\"><span>图片文件</span>(245/245 files)</p></md-list-item><md-list-item><p class=\"not\"><span>图片文件</span>(245/245 files)</p></md-list-item></md-list></div>");
$templateCache.put("app/main/xhsc/ys/download.html","<md-content class=\"download\"><div layout=\"column\"><md-subheader>已下载列表</md-subheader><md-list><md-list-item ng-repeat=\"item in vm.offlines\"><img src=\"app/main/xhsc/images/icon-downed.png\" class=\"md-avatar\"><div class=\"md-list-item-text\" layout=\"column\"><h3>{{item.AssessmentSubject}}</h3></div><div class=\"md-secondary md-hue-3\"><md-button ng-click=\"vm.showECs($event)\" class=\"md-raised md-primary\">开始评估</md-button><span style=\"display:inline-block;width:120px;text-align: center;\"><md-button ng-click=\"vm.upload()\" class=\"md-raised upload-btn\">上传</md-button></span></div></md-list-item></md-list><md-subheader>未下载列表</md-subheader><md-list><md-list-item ng-repeat=\"item in vm.onlines\"><img src=\"app/main/xhsc/images/icon-down.png\" class=\"md-avatar\"><div class=\"md-list-item-text\" layout=\"column\"><h3>{{item.AssessmentSubject}}</h3></div><div class=\"md-secondary md-hue-3\"><span style=\"display:inline-block;width:120px;text-align: center;\"><md-button ng-if=\"!item.pack.isDown\" class=\"md-raised upload-btn\" ng-click=\"vm.download(item)\">下载</md-button><a ng-if=\"item.pack.isDown\" style=\"position: relative;display: inline-block;\" ng-click=\"vm.cancel()\"><md-progress-circular md-mode=\"determinate\" value=\"{{item.progress}}\" md-diameter=\"30\"></md-progress-circular><md-icon style=\"width:10px;height:10px;background: #0185f1;position: absolute;left:10px;top:10px;\"></md-icon></a><md-button ng-if=\"item.pack.isDown\" style=\"display: inline-block;vertical-align: middle;padding:5px;color:#0185f1;min-width:40px;\" ui-sref=\"app.xhsc.ddetail\">详情</md-button></span></div></md-list-item></md-list></div></md-content>");
$templateCache.put("app/main/xhsc/ys/evaluate.html","<md-content layout=\"row\" style=\"background: #fff;\" flex=\"\"><md-list class=\"evaluate\" style=\"padding:32px 16px;\"><md-list-item class=\"evaluate-item\" ng-click=\"vm.showECs($event)\"><div class=\"evaluate-itemwrap\"><div class=\"left\"><p>2015年<br>第一季度</p></div><div class=\"md-list-item-text compact\"><p>星河某某第一期现场评估</p></div></div></md-list-item><md-list-item class=\"evaluate-item\" ng-click=\"vm.showECs($event)\"><div class=\"evaluate-itemwrap\"><div class=\"left\"><p>2015年<br>第一季度</p></div><div class=\"md-list-item-text compact\"><p>星河某某第一期现场评估</p></div></div></md-list-item><md-list-item class=\"evaluate-item\" ng-click=\"vm.showECs($event)\"><div class=\"evaluate-itemwrap\"><div class=\"left\"><p>2015年<br>第一季度</p></div><div class=\"md-list-item-text compact\"><p>星河某某第一期现场评估</p></div></div></md-list-item><md-list-item class=\"evaluate-item\" ng-click=\"vm.showECs($event)\"><div class=\"evaluate-itemwrap\"><div class=\"left\"><p>2015年<br>第一季度</p></div><div class=\"md-list-item-text compact\"><p>星河某某第一期现场评估</p></div></div></md-list-item></md-list><div layout=\"row\" style=\"width: 100%;display: none;\"><div style=\"position: absolute;left: 50%;top:50%;transform: translate(-50%,-50%)\"><img src=\"app/main/xhsc/images/bg.png\"><p style=\"font-size: 14px;text-align: center;margin-top: 16px;\">当前无评估任务</p></div></div></md-content>");
$templateCache.put("app/main/xhsc/ys/evaluateChoose.html","<md-dialog aria-label=\"1\" ng-cloak=\"\" style=\"background:transparent;box-shadow: none;max-width:100%;width:100%;\"><md-dialog-actions><md-list flex=\"\" layout=\"row\"><md-list-item flex=\"\"><md-button md-autofocus=\"\"><img ng-src=\"app/main/xhsc/images/measure.png\"></md-button></md-list-item><md-list-item flex=\"\"><md-button ui-sref=\"app.xhsc.evaluatelist\" ng-click=\"hide()\"><img ng-src=\"app/main/xhsc/images/quality.png\"></md-button></md-list-item><md-list-item flex=\"\"><md-button><img ng-src=\"app/main/xhsc/images/manage.png\"></md-button></md-list-item><md-list-item flex=\"\"><md-button><img ng-src=\"app/main/xhsc/images/culture.png\"></md-button></md-list-item></md-list></md-dialog-actions></md-dialog>");
$templateCache.put("app/main/xhsc/ys/evaluateRecord.html","<md-dialog aria-label=\"Mango (Fruit)\" ng-cloak=\"\" style=\"background:transparent;box-shadow: none;max-width:100%;width:100%;\" class=\"typeNumber\"><md-dialog-actions><md-list flex=\"\" layout=\"row\" layout-wrap=\"\" layout-fill=\"\"><md-list-item flex=\"\" flex-sm=\"30\" md-autofocus=\"\"><md-button ng-click=\"answer(0.5)\"><span>0.5</span></md-button></md-list-item><md-list-item flex=\"\" flex-sm=\"30\"><md-button ng-click=\"answer(1)\"><span>1</span></md-button></md-list-item><md-list-item flex=\"\" flex-sm=\"30\"><md-button ng-click=\"answer(1.5)\"><span>1.5</span></md-button></md-list-item><md-list-item flex=\"\" flex-sm=\"30\"><md-button ng-click=\"answer(2)\"><span>2</span></md-button></md-list-item><md-list-item flex=\"\" flex-sm=\"30\"><md-button ng-click=\"answer(0.5)\"><span>2.5</span></md-button></md-list-item><md-list-item flex=\"\" flex-sm=\"30\"><md-button ng-click=\"answer(0.5)\"><span>3</span></md-button></md-list-item></md-list></md-dialog-actions></md-dialog>");
$templateCache.put("app/main/xhsc/ys/evaluateinput.html","<md-dialog aria-label=\"Mango (Fruit)\" ng-cloak=\"\" style=\"background:#fff;box-shadow: none;max-width:100%;width:100%;\"><md-dialog-content><md-input-container class=\"md-block\"><input ng-model=\"evaluateNote\" autofocus=\"\"></md-input-container></md-dialog-content><md-dialog-actions><md-button ng-click=\"answer(evaluateNote)\">确定</md-button></md-dialog-actions></md-dialog>");
$templateCache.put("app/main/xhsc/ys/evaluatelist.html","<md-content class=\"subheader\"><div style=\"position: fixed;top: 44px;left: 0;width: 100%;background: #fff;z-index: 45;\"><md-tabs md-dynamic-height=\"\" flex=\"\"><md-tab label=\"总包\"></md-tab><md-tab label=\"精装修\"></md-tab><md-tab label=\"门窗、栏杆\"></md-tab><md-tab label=\"防火门、入户门\"></md-tab><md-tab label=\"精装修\"></md-tab><md-tab label=\"门窗、栏杆\"></md-tab><md-tab label=\"防火门、入户门\"></md-tab><md-tab label=\"防火门、入户门\"></md-tab><md-tab label=\"精装修\"></md-tab><md-tab label=\"门窗、栏杆\"></md-tab><md-tab label=\"防火门、入户门\"></md-tab></md-tabs></div><div style=\"width: 100%;\" layout=\"column\"><div style=\"position: fixed;top:92px;background: #f4f6f6;height:40px;left:0;right:0;z-index:10;padding-top: 0;\"><table cellspacing=\"0\" cellpadding=\"0\" border=\"0\" width=\"100%\" class=\"zdytable fixtable\" style=\"table-layout: fixed;margin-bottom: 0;\"><thead><tr><th colspan=\"4\" width=\"204\" align=\"center\">检测内容</th><th>评判标准</th><th>扣分标准</th><th width=\"50\" align=\"center\">权重</th><th width=\"50\" align=\"center\">扣分</th><th width=\"50\" align=\"center\">得分</th></tr></thead></table></div><div style=\"position: relative;padding:0;\"><div style=\"margin-top:88px;\"></div><div><md-subheader class=\"md-primary\"><span>标题一</span> <span>扣分</span> <span>扣分</span> <span>扣分</span></md-subheader><table cellspacing=\"0\" cellpadding=\"0\" border=\"0\" width=\"100%\" class=\"zdytable\" style=\"table-layout: fixed;margin-bottom: 0;\"><tbody><tr><td rowspan=\"8\" class=\"procedurename\" width=\"28\"><p>钢筋工程</p></td><td rowspan=\"8\" class=\"procedurename\" width=\"28\"><p>钢筋工程</p></td><td rowspan=\"5\" class=\"procedurename\" width=\"28\"><p>钢筋工程</p></td><td width=\"120\" rowspan=\"3\">钢筋工程</td><td>检查人</td><td>检查人</td><td width=\"50\" align=\"center\">2</td><td width=\"50\" class=\"lr\" align=\"center\"><span ng-click=\"vm.getRecord($event)\" ng-if=\"!vm.input\">录入</span> <span ng-click=\"vm.getRecord($event)\" ng-if=\"vm.input\">{{vm.input}}</span></td><td width=\"50\" align=\"center\">2</td></tr><tr><td colspan=\"5\" class=\"lr\"><img ng-src=\"app/main/xhsc/images/text.png\" style=\"margin-right:12px;margin-top:5px;\"><span>备注：<i style=\"font-style: normal;color:#333;font-size:12px;margin-right:5px;\">{{vm.evaluateNote}}</i></span><md-icon style=\"padding-top:8px;width:30px;height:30px;\" ng-click=\"vm.showDialog($event)\"><img ng-src=\"app/main/xhsc/images/write.png\"></md-icon></td></tr><tr><td colspan=\"5\" class=\"lr\"><img ng-src=\"app/main/xhsc/images/pic.png\" style=\"margin-right:12px;margin-top:4px;\">照片：<ul class=\"img\" style=\"display: inline-block;\" sxt-images=\"vm.images\" ng-repeat=\"img in vm.images\"><li><img ng-src=\"{{img.url}}\"></li></ul><md-icon style=\"width:30px;height:30px;\"><img src=\"assets/images/etc/plug.png\"></md-icon></td></tr><tr><td width=\"120\">钢筋工程</td><td>检查人</td><td>检查人</td><td width=\"50\">检查人</td><td width=\"50\">检查人</td><td width=\"50\">检查人</td></tr><tr><td width=\"120\">钢筋工程</td><td>检查人</td><td>检查人</td><td width=\"50\">检查人</td><td width=\"50\">检查人</td><td width=\"50\">检查人</td></tr><tr><td rowspan=\"3\" class=\"procedurename\" width=\"28\"><p>钢筋工程</p></td><td width=\"120\">钢筋工程</td><td>检查人</td><td>检查人</td><td width=\"50\">检查人</td><td width=\"50\">检查人</td><td width=\"50\">检查人</td></tr><tr><td width=\"120\">钢筋工程</td><td>检查人</td><td>检查人</td><td width=\"50\">检查人</td><td width=\"50\">检查人</td><td width=\"50\">检查人</td></tr><tr><td width=\"120\">钢筋工程</td><td>检查人</td><td>检查人</td><td width=\"50\">检查人</td><td width=\"50\">检查人</td><td width=\"50\">检查人</td></tr></tbody></table></div><div><md-subheader class=\"md-primary\">标题二</md-subheader><table cellspacing=\"0\" cellpadding=\"0\" border=\"0\" width=\"100%\" class=\"zdytable\"><tbody><tr><td>检查人</td><td>检查人</td></tr><tr><td>检查人</td><td>检查人</td></tr><tr><td>检查人</td><td>检查人</td></tr><tr><td>检查人</td><td>检查人</td></tr><tr><td>检查人</td><td>检查人</td></tr><tr><td>检查人</td><td>检查人</td></tr><tr><td>检查人</td><td>检查人</td></tr><tr><td>检查人</td><td>检查人</td></tr></tbody></table></div></div></div></md-content>");
$templateCache.put("app/main/xhsc/ys/login.html","<md-content class=\"login\" layout=\"column\"><div id=\"login\"><div id=\"login-form-wrapper\" layout=\"column\" layout-align=\"center center\" layout-align-xs=\"center start\"><div id=\"login-form\" style=\"padding:40px 60px;background: rgba(255,255,255,.95);border-radius:8px;box-shadow: 0 0 8px #ccc;width: 50%;position: absolute;top:50%;left: 50%;transform: translate(-50%,-50%);\"><div class=\"logo1\"><span><img src=\"app/main/xhsc/images/logo.png\"></span></div><form name=\"loginForm\" novalidate=\"\" ng-submit=\"vm.login(loginForm)\"><div class=\"login-name\"><md-input-container class=\"md-block\" md-no-float=\"\"><md-icon md-svg-src=\"app/main/auth/images/user.svg\"></md-icon><input type=\"text\" name=\"username\" ng-model=\"vm.form.username\" placeholder=\"请输入用户名\" required=\"\"></md-input-container><md-divider></md-divider><md-input-container class=\"md-block\" md-no-float=\"\"><md-icon md-svg-src=\"app/main/auth/images/password.svg\"></md-icon><input type=\"password\" name=\"password\" ng-model=\"vm.form.password\" placeholder=\"请输入密码\" required=\"\"></md-input-container></div><md-checkbox>记住用户名</md-checkbox><div layout=\"row\" layout-align=\"center center\"><md-button type=\"submit\" flex=\"\" class=\"md-raised md-warn\" aria-label=\"登录\" translate=\"LOGIN.LOG_IN\" translate-attr-aria-label=\"LOGIN.LOG_IN\">登录</md-button></div></form></div></div></div></md-content>");
$templateCache.put("app/main/xhsc/ys/sc.html","<div layout=\"row\" class=\"scTop\"><div flex=\"none\" class=\"scleft\"><md-button class=\"md-fab md-mini\" style=\"line-height: 24px\" ng-click=\"vm.nextRegion(true)\" aria-label=\"\"><md-icon md-font-icon=\"icon-chevron-left\"></md-icon></md-button><span>{{ vm.info.name}}</span><md-button class=\"md-fab md-mini\" style=\"line-height: 24px\" ng-click=\"vm.nextRegion()\" aria-label=\"\"><md-icon md-font-icon=\"icon-chevron-right\"></md-icon></md-button></div><md-button class=\"md-link md-primary md-mini\" ng-click=\"vm.submit()\">提交</md-button><div flex=\"\" class=\"scright\"><span>{{vm.info.tips}}</span></div></div><div flex=\"none\" layout=\"row\" style=\"border-bottom: 1px solid rgba(0, 0, 0, 0.117647)\"><md-tabs md-dynamic-height=\"\" flex=\"\" md-selected=\"vm.selectedIndex\"><md-tab ng-repeat=\"m in vm.MeasureIndexes\" label=\"{{m.IndexName}}\"></md-tab></md-tabs></div><sxt-sc-map flex=\"\" area-id=\"vm.info.areaId\" project=\"vm.project\" image-url=\"vm.info.imageUrl\" region-id=\"vm.info.regionId\" region-type=\"vm.info.regionType\" acceptance-item=\"vm.info.acceptanceItemID\" region-name=\"vm.info.name\" tips=\"vm.info.tips\" measure-indexes=\"vm.MeasureIndexes\" current-index=\"vm.selectedIndex\"></sxt-sc-map><div style=\"display: none\"><sxt-sc-map-popup></sxt-sc-map-popup></div>");
$templateCache.put("app/main/xhsc/ys/sc2.html","<div layout=\"row\" class=\"scTop\"><div flex=\"\" class=\"scleft\"><span>当前测量项：</span><span ng-repeat=\"sc in vm.info.MeasureIndexes\" style=\"color:#f00;\">{{sc.IndexName}},</span><md-button ng-click=\"vm.scChoose()\"><img src=\"app/main/xhsc/images/pop.jpg\" style=\"vertical-align: middle;\"></md-button></div><div flex=\"none\" class=\"scright\"><md-button class=\"md-fab\" style=\"line-height: 24px;width:36px;height:36px;\" ng-click=\"vm.nextRegion(true)\" aria-label=\"\"><md-icon md-font-icon=\"icon-chevron-left\"></md-icon></md-button><span style=\"font-size:16px;display: inline-block;vertical-align: middle;\">{{ vm.info.name}}</span><md-button class=\"md-fab\" style=\"line-height: 24px;width:36px;height:36px;\" ng-click=\"vm.nextRegion()\" aria-label=\"\"><md-icon md-font-icon=\"icon-chevron-right\"></md-icon></md-button></div></div><div flex=\"none\" layout=\"row\" style=\"border-bottom: 1px solid rgba(0, 0, 0, 0.117647);display: none;\"><md-tabs md-dynamic-height=\"\" flex=\"\" md-selected=\"vm.selectedIndex\"><md-tab ng-repeat=\"m in vm.MeasureIndexes\" label=\"{{m.IndexName}}\"></md-tab></md-tabs></div><sxt-sc flex=\"\" area-id=\"vm.info.areaId\" project=\"vm.project\" image-url=\"vm.info.imageUrl\" region-id=\"vm.info.regionId\" region-type=\"vm.info.regionType\" acceptance-item=\"vm.info.acceptanceItemID\" region-name=\"vm.info.name\" measure-indexes=\"vm.info.MeasureIndexes\"></sxt-sc><div style=\"display: none\"><sxt-sc-popup></sxt-sc-popup></div>");
$templateCache.put("app/main/xhsc/ys/scChoose.html","<md-dialog aria-label=\"Mango (Fruit)\" class=\"scchoose\"><md-toolbar><div class=\"md-toolbar-tools\"><h2>请选择测量项</h2><span flex=\"\"></span><md-button class=\"md-icon-button\" ng-click=\"answer(scList)\">确定</md-button></div></md-toolbar><md-dialog-content><md-list><md-list-item ng-repeat=\"sc in scList\" ng-click=\"checkSc(sc)\"><p>{{sc.IndexName}}</p><md-switch class=\"md-secondary\" ng-model=\"sc.checked\"></md-switch></md-list-item></md-list></md-dialog-content></md-dialog>");
$templateCache.put("app/main/xhsc/ys/scd.html","<md-content layout-padding=\"\"><div layout=\"row\" layout-align=\"left center\"><span>第</span><md-select ng-model=\"vm.info.t\" style=\"margin:5px 0 10px 0;\"><md-option ng-repeat=\"t in vm.info.Numbers\" value=\"{{t.MeasureRecordID}}\">{{t.Number}}</md-option></md-select><span>次</span></div><table cellspacing=\"0\" cellpadding=\"0\" border=\"0\" width=\"100%\" class=\"zdytable\"><tr><td colspan=\"{{vm.cols + 5}}\" style=\"text-align: center;\" class=\"head\">{{vm.info.aItem.MeasureItemName}}</td></tr><tr><td colspan=\"{{vm.oneCols}}\">项目名称:{{vm.info.name}}</td><td colspan=\"{{vm.twoCols}}\">检查人:{{vm.person}}</td><td colspan=\"{{vm.twoCols}}\">检查日期:{{vm.time}}</td></tr><tr><td align=\"center\">内容</td><td style=\"width:120px;text-align: center;\">位置</td><td align=\"center\">结果</td><td align=\"center\">最大偏差</td><td align=\"center\">合格率</td><td ng-repeat=\"i in vm.alItem[0].Points\" align=\"center\">{{$index+1}}</td></tr><tr ng-repeat=\"item in vm.alItem\"><td rowspan=\"{{vm.alItem.length}}\" colspan=\"1\" class=\"procedurename\" ng-if=\"$index==0\"><p>{{vm.info.aItem.MeasureItemName}}</p></td><td>{{item.IndexName}}</td><td align=\"center\" class=\"normal\" ng-class=\"{\'redColor\':item.ResultStatus == 2}\">{{item.passText}}</td><td align=\"center\">{{item.MaximumDeviation}}</td><td align=\"center\">{{item.QualifiedRate}}</td><td ng-repeat=\"point in item.Points\" align=\"center\">{{point.MeasureValue}}</td></tr></table></md-content>");
$templateCache.put("app/main/xhsc/ys/scv.html","<div layout=\"row\" class=\"scTop\"><div flex=\"none\" class=\"scleft\"><md-button class=\"md-fab md-mini\" style=\"line-height: 24px\" ng-click=\"vm.nextRegion(true)\" aria-label=\"\"><md-icon md-font-icon=\"icon-chevron-left\"></md-icon></md-button><span>{{ vm.info.name}}</span><md-button class=\"md-fab md-mini\" style=\"line-height: 24px\" ng-click=\"vm.nextRegion()\" aria-label=\"\"><md-icon md-font-icon=\"icon-chevron-right\"></md-icon></md-button></div><div flex=\"\" class=\"scright\"><span>{{vm.info.tips}}</span></div></div><div flex=\"none\" layout=\"row\" style=\"border-bottom: 1px solid rgba(0, 0, 0, 0.117647)\"><md-tabs md-dynamic-height=\"\" flex=\"\" md-selected=\"vm.selectedIndex\"><md-tab ng-repeat=\"m in vm.MeasureIndexes\" label=\"{{m.IndexName}}\"></md-tab></md-tabs></div><sxt-sc-map flex=\"\" project=\"vm.project\" readonly=\"true\" region-id=\"vm.info.regionId\" region-type=\"vm.info.regionType\" acceptance-item=\"vm.info.acceptanceItemID\" region-name=\"vm.info.name\" tips=\"vm.info.tips\" measure-indexes=\"vm.MeasureIndexes\" current-index=\"vm.selectedIndex\"></sxt-sc-map><div style=\"display: none\"><sxt-sc-map-popup readonly=\"true\"></sxt-sc-map-popup></div>");
$templateCache.put("app/quick-panel/tabs/activity/activity-tab.html","<md-list class=\"friends\"><md-subheader class=\"md-no-sticky\"><span translate=\"QUICKPANEL.FRIENDS\">Friends</span></md-subheader><md-list-item class=\"friend md-3-line\" ng-repeat=\"friend in vm.activities.friends\"><img ng-src=\"{{friend.avatar}}\" class=\"md-avatar\" alt=\"{{friend.name}}\"><div class=\"status {{friend.status}}\"></div><div ng-if=\"contact.unread\" class=\"md-accent-bg unread-message-count\">{{contact.unread}}</div><div class=\"md-list-item-text\"><h3 class=\"message\">{{friend.message}}</h3><p class=\"time\">{{friend.time}}</p></div></md-list-item></md-list><md-divider></md-divider><md-list class=\"servers\"><md-subheader class=\"md-no-sticky\"><span translate=\"QUICKPANEL.APP_SERVERS\">Application Servers</span></md-subheader><md-list-item class=\"server md-3-line\" ng-repeat=\"server in vm.activities.servers\"><md-icon md-font-icon=\"icon-checkbox-blank-circle\" class=\"s16 status\" ng-class=\"server.status\"></md-icon><div class=\"md-list-item-text\"><h3>{{server.location}}</h3><p>{{server.detail}}</p></div></md-list-item></md-list><md-divider></md-divider><md-list class=\"stats\"><md-subheader class=\"md-no-sticky\"><span translate=\"QUICKPANEL.USER_STATS\">User Stats</span></md-subheader><md-list-item class=\"stat md-2-line\" ng-repeat=\"stat in vm.activities.stats\"><div class=\"md-list-item-text\"><span>{{stat.title}} ({{stat.current}} / {{stat.total}})</span><md-progress-linear ng-class=\"stat.status\" md-mode=\"determinate\" value=\"{{stat.percent}}\"></md-progress-linear></div></md-list-item></md-list>");
$templateCache.put("app/quick-panel/tabs/today/today-tab.html","<md-list class=\"date\"><md-subheader class=\"md-no-sticky\"><span translate=\"QUICKPANEL.TODAY\">Today</span></md-subheader><md-list-item class=\"md-display-1 md-2-line\" layout=\"column\" layout-align=\"start start\"><div class=\"secondary-text\"><div>{{vm.date | date:\'EEEE\'}}</div><div layout=\"row\" layout-align=\"start start\"><span>{{vm.date | date:\'d\'}}</span> <span class=\"md-subhead\">th</span> <span>{{vm.date | date:\'MMMM\'}}</span></div></div></md-list-item></md-list><md-divider></md-divider><md-list><md-subheader class=\"md-no-sticky\"><span translate=\"QUICKPANEL.EVENTS\">Events</span></md-subheader><md-list-item class=\"md-2-line\" ng-repeat=\"event in vm.events\" ng-click=\"dummyFunction()\"><div class=\"md-list-item-text\"><h3>{{event.title}}</h3><p>{{event.detail}}</p></div></md-list-item></md-list><md-divider></md-divider><md-list><md-subheader class=\"md-no-sticky\"><span translate=\"QUICKPANEL.NOTES\">Notes</span></md-subheader><md-list-item class=\"md-2-line\" ng-repeat=\"note in vm.notes\" ng-click=\"dummyFunction()\"><div class=\"md-list-item-text\"><h3>{{note.title}}</h3><p>{{note.detail}}</p></div></md-list-item></md-list><md-divider></md-divider><md-list><md-subheader class=\"md-no-sticky\"><span translate=\"QUICKPANEL.QUICK_SETTINGS\">Quick Settings</span></md-subheader><md-list-item><h3 translate=\"QUICKPANEL.NOTIFICATIONS\">Notifications</h3><md-switch class=\"md-secondary\" ng-model=\"vm.settings.notify\" aria-label=\"Notifications\" translate=\"\" translate-attr-aria-label=\"QUICKPANEL.NOTIFICATIONS\"></md-switch></md-list-item><md-list-item><h3 translate=\"QUICKPANEL.CLOUD_SYNC\">Cloud Sync</h3><md-switch class=\"md-secondary\" ng-model=\"vm.settings.cloud\" aria-label=\"Cloud Sync\" translate=\"\" translate-attr-aria-label=\"QUICKPANEL.CLOUD_SYNC\"></md-switch></md-list-item><md-list-item><h3 translate=\"QUICKPANEL.RETRO_THRUSTERS\">Retro Thrusters</h3><md-switch class=\"md-secondary md-warn\" ng-model=\"vm.settings.retro\" aria-label=\"Retro Thrusters\" translate=\"\" translate-attr-aria-label=\"QUICKPANEL.RETRO_THRUSTERS\"></md-switch></md-list-item></md-list>");
$templateCache.put("app/quick-panel/tabs/chat/chat-tab.html","<div class=\"main animate-slide-left\" ng-hide=\"vm.chatActive\"><md-list class=\"recent\"><md-subheader class=\"md-no-sticky\"><span translate=\"QUICKPANEL.RECENT\">Recent</span></md-subheader><md-list-item class=\"contact md-3-line\" ng-repeat=\"contact in vm.contacts.recent\" ng-click=\"vm.toggleChat(contact)\"><img ng-src=\"{{contact.avatar}}\" class=\"md-avatar\" alt=\"{{contact.name}}\"><div class=\"status {{contact.status}}\"></div><div ng-if=\"contact.unread\" class=\"md-accent-bg unread-message-count\">{{contact.unread}}</div><div class=\"md-list-item-text\"><h3>{{contact.name}}</h3><p class=\"last-message\">{{contact.lastMessage}}</p></div></md-list-item></md-list><md-divider></md-divider><md-list class=\"all\"><md-subheader class=\"md-no-sticky\"><span translate=\"QUICKPANEL.START_NEW_CHAT\">Start New Chat</span></md-subheader><md-list-item class=\"contact\" ng-repeat=\"contact in vm.contacts.all\" ng-click=\"vm.toggleChat(contact)\"><img ng-src=\"{{contact.avatar}}\" class=\"md-avatar\" alt=\"{{contact.name}}\"><div class=\"status {{contact.status}}\"></div><div class=\"md-list-item-text\"><h3>{{contact.name}}</h3></div></md-list-item></md-list><md-divider></md-divider></div><div class=\"chat animate-slide-right\" ng-show=\"vm.chatActive\" layout=\"column\"><md-toolbar class=\"md-accent\"><div class=\"md-toolbar-tools\" layout=\"row\" layout-align=\"space-between center\"><div layout=\"row\" layout-align=\"start center\"><md-button class=\"md-icon-button\" ng-click=\"vm.toggleChat()\" aria-label=\"Back\" translate=\"\" translate-attr-aria-label=\"QUICKPANEL.BACK\"><md-icon md-font-icon=\"icon-keyboard-backspace\"></md-icon></md-button><h4><span>{{vm.chat.contact.name}}</span></h4></div><div layout=\"row\" layout-align=\"end center\"><md-button class=\"md-icon-button\" aria-label=\"Call\" translate=\"\" translate-attr-aria-label=\"QUICKPANEL.CALL\"><md-icon md-font-icon=\"icon-phone\"></md-icon></md-button><md-button class=\"md-icon-button\" aria-label=\"More\" translate=\"\" translate-attr-aria-label=\"QUICKPANEL.MORE\"><md-icon md-font-icon=\"icon-dots-vertical\"></md-icon></md-button></div></div></md-toolbar><md-content flex=\"\" layout-paddings=\"\" ms-scroll=\"\" id=\"chat-dialog\"><div layout=\"row\" ng-repeat=\"dialog in vm.chat.contact.dialog\" class=\"md-padding message-row\" ng-class=\"dialog.who\"><img ng-if=\"dialog.who ===\'contact\'\" ng-src=\"{{vm.chat.contact.avatar}}\" class=\"avatar\" alt=\"{{vm.chat.contact.name}}\"> <img ng-if=\"dialog.who ===\'user\'\" class=\"avatar\" src=\"assets/images/avatars/profile.jpg\"><div class=\"bubble\" flex=\"\"><div class=\"message\">{{dialog.message}}</div><div class=\"time secondary-text\">{{dialog.time}}</div></div></div></md-content><form ng-submit=\"vm.reply()\" layout=\"row\" class=\"reply\" layout-align=\"start center\"><textarea ng-keyup=\"$event.keyCode == 13 ? vm.reply() : null\" flex=\"\" ng-model=\"vm.replyMessage\" placeholder=\"Type and hit enter to send message\" translate=\"\" translate-attr-placeholder=\"QUICKPANEL.REPLY_PLACEHOLDER\"></textarea><md-button class=\"md-fab md-icon-button\" type=\"submit\" aria-label=\"Send message\" translate=\"\" translate-attr-aria-label=\"QUICKPANEL.SEND_MESSAGE\"><md-icon md-font-icon=\"icon-send\"></md-icon></md-button></form></div>");
$templateCache.put("app/toolbar/layouts/content-with-footbar/footbar.html","<md-list flex=\"\" layout=\"row\"><span flex=\"25\"></span><md-list-item flex=\"\"><md-button ui-sref=\"app.xhsc.home\"><md-icon md-svg-src=\"app/toolbar/images/xhhome.svg\" class=\"icon s32\" ng-class=\"{\'active\':vm.is(\'app.xhsc.home\')}\"></md-icon><div class=\"md-grid-text\" style=\"line-height: 20px\" ng-style=\"{\'color\':vm.is(\'app.xhsc.home\')?\'#e93030\':\'rgba(0,0,0,0.54)\'}\">首页</div></md-button></md-list-item><md-list-item flex=\"\"><md-button ui-sref=\"app.xhsc.ch2\" class=\"ys\"><md-icon md-svg-src=\"app/toolbar/images/xhmeasure.svg\" class=\"icon s32\" ng-class=\"{\'active\':vm.is(\'app.xhsc.ch2\')}\"></md-icon><div class=\"md-grid-text\" style=\"line-height: 20px\" ng-style=\"{\'color\':vm.is(\'app.xhsc.ch2\')?\'#e93030\':\'rgba(0,0,0,0.54)\'}\">实测实量</div></md-button></md-list-item><md-list-item flex=\"\"><md-button ui-sref=\"app.xhsc.download\"><md-icon md-svg-src=\"app/toolbar/images/xhproc.svg\" class=\"icon s32\" ng-class=\"{\'active\':vm.is(\'app.xhsc.download\')}\"></md-icon><div class=\"md-grid-text\" style=\"line-height: 20px\" ng-style=\"{\'color\':vm.is(\'app.xhsc.download\')?\'#e93030\':\'rgba(0,0,0,0.54)\'}\">工序验收</div></md-button></md-list-item><md-list-item flex=\"\"><md-button ui-sref=\"app.xhsc.zg\"><md-icon md-svg-src=\"app/toolbar/images/xhchange.svg\" class=\"icon s32\" ng-class=\"{\'active\':vm.is(\'app.xhsc.zg\')}\"></md-icon><div class=\"md-grid-text\" style=\"line-height: 20px\" ng-style=\"{\'color\':vm.is(\'app.xhsc.zg\')?\'#e93030\':\'rgba(0,0,0,0.54)\'}\">整改</div></md-button></md-list-item><span flex=\"25\"></span></md-list>");
$templateCache.put("app/toolbar/layouts/content-with-footbar/toptoolbar.html","<div class=\"md-toolbar-tools\" style=\"padding: 0\"><md-button ng-click=\"goBack();\" style=\"color:white;\">返回</md-button><h2><md-icon class=\"arrows icon s32\" ng-show=\"$root.leftArrow===true\" md-font-icon=\"icon-chevron-left\" style=\"color:#fff;\" ng-click=\"toLeft()\"></md-icon><span ng-class=\"{\'subtitle\':$root.leftArrow===true}\">{{$root.subtitle||$root.title || \'工程大数据\'}}</span><md-icon class=\"arrows icon s32\" ng-show=\"$root.rightArrow===true\" md-font-icon=\"icon-chevron-right\" style=\"color:#fff;\" ng-click=\"toRight()\"></md-icon></h2><div style=\"position: absolute;top:5px;right:3px;font-size:14px;\" ng-show=\"$root.sendBt===true\"><md-button class=\"md-link md-mini\" ng-click=\"submit()\">提交</md-button></div><div style=\"position: absolute;top:5px;right:0;font-size:14px;\" ng-show=\"$root.refreshBtn===true\"><md-button class=\"md-link md-mini\" ng-click=\"submit()\"><md-icon><img src=\"app/main/xhsc/images/refresh.png\"></md-icon></md-button></div><div style=\"position: absolute;top:5px;right:3px;font-size:14px;\"><md-progress-circular id=\"toolbar-progress\" ng-if=\"$root.loadingProgress\" md-mode=\"indeterminate\" md-diameter=\"40\"></md-progress-circular></div></div>");
$templateCache.put("app/toolbar/layouts/content-with-toolbar/toolbar.html","<div layout=\"row\" layout-align=\"space-between center\"><div layout=\"row\" layout-align=\"start center\"><div class=\"logo\" layout=\"row\" layout-align=\"start center\"><span class=\"logo-image\">F</span> <span class=\"logo-text\">FUSE</span></div><md-progress-circular id=\"toolbar-progress\" ng-if=\"$root.loadingProgress\" class=\"md-accent\" md-mode=\"indeterminate\" md-diameter=\"64\"></md-progress-circular></div><div layout=\"row\" layout-align=\"start center\"><div class=\"toolbar-separator\"></div><ms-search-bar></ms-search-bar><div class=\"toolbar-separator\"></div><md-menu-bar id=\"user-menu\"><md-menu md-position-mode=\"left bottom\"><md-button class=\"user-button\" ng-click=\"$mdOpenMenu()\" aria-label=\"User settings\" translate=\"\" translate-attr-aria-label=\"TOOLBAR.USER_SETTINGS\"><div layout=\"row\" layout-align=\"space-between center\"><div class=\"avatar-wrapper\"><img md-menu-align-target=\"\" class=\"avatar\" src=\"assets/images/avatars/profile.jpg\"><md-icon md-font-icon=\"\" ng-class=\"vm.userStatus.icon\" ng-style=\"{\'color\': vm.userStatus.color }\" class=\"icon status s16\"></md-icon></div><span class=\"username\" hide-xs=\"\">John Doe</span><md-icon md-font-icon=\"icon-chevron-down\" class=\"icon s16\" hide-xs=\"\"></md-icon></div></md-button><md-menu-content width=\"3\"><md-menu-item class=\"md-indent\" ui-sref=\"app.pages_profile\"><md-icon md-font-icon=\"icon-account\" class=\"icon\"></md-icon><md-button>My Profile</md-button></md-menu-item><md-menu-item class=\"md-indent\" ui-sref=\"app.mail\"><md-icon md-font-icon=\"icon-email\" class=\"icon\"></md-icon><md-button>Inbox</md-button></md-menu-item><md-menu-item class=\"md-indent\"><md-icon md-font-icon=\"\" ng-class=\"vm.userStatus.icon\" ng-style=\"{\'color\': vm.userStatus.color }\" class=\"icon\"></md-icon><md-menu id=\"user-status-menu\"><md-button ng-click=\"$mdOpenMenu()\" class=\"status\" ng-class=\"vm.userStatus.class\">{{vm.userStatus.title}}</md-button><md-menu-content width=\"2\"><md-menu-item class=\"status md-indent\" ng-class=\"{\'selected\': status === vm.userStatus}\" ng-repeat=\"status in vm.userStatusOptions\"><md-icon md-font-icon=\"{{status.icon}}\" ng-style=\"{\'color\': status.color }\" class=\"icon\"></md-icon><md-button ng-click=\"vm.setUserStatus(status)\">{{status.title}}</md-button></md-menu-item></md-menu-content></md-menu></md-menu-item><md-menu-divider></md-menu-divider><md-menu-item class=\"md-indent\"><md-icon md-font-icon=\"icon-logout\" class=\"icon\"></md-icon><md-button ng-click=\"vm.logout()\">Logout</md-button></md-menu-item></md-menu-content></md-menu></md-menu-bar><div class=\"toolbar-separator\"></div><md-menu id=\"language-menu\" md-offset=\"0 72\" md-position-mode=\"target-right target\"><md-button class=\"language-button\" ng-click=\"$mdOpenMenu()\" aria-label=\"Language\" md-menu-origin=\"\" md-menu-align-target=\"\"><div layout=\"row\" layout-align=\"center center\"><img class=\"flag\" ng-src=\"assets/images/flags/{{vm.selectedLanguage.flag}}.png\"> <span class=\"iso\">{{vm.selectedLanguage.code}}</span></div></md-button><md-menu-content width=\"3\" id=\"language-menu-content\"><md-menu-item ng-repeat=\"(iso, lang) in vm.languages\"><md-button ng-click=\"vm.changeLanguage(lang)\" aria-label=\"{{lang.title}}\" translate=\"\" translate-attr-aria-label=\"{{lang.title}}\"><span layout=\"row\" layout-align=\"start center\"><img class=\"flag\" ng-src=\"assets/images/flags/{{lang.flag}}.png\"> <span translate=\"{{lang.translation}}\">{{lang.title}}</span></span></md-button></md-menu-item></md-menu-content></md-menu><div class=\"toolbar-separator\"></div><md-button id=\"quick-panel-toggle\" class=\"md-icon-button\" ng-click=\"vm.toggleSidenav(\'quick-panel\')\" aria-label=\"Toggle quick panel\" translate=\"\" translate-attr-aria-label=\"TOOLBAR.TOGGLE_QUICK_PANEL\"><md-icon md-font-icon=\"icon-format-list-bulleted\" class=\"icon\"></md-icon></md-button></div></div>");
$templateCache.put("app/toolbar/layouts/horizontal-navigation/toolbar.html","<div layout=\"row\" layout-align=\"space-between center\"><div layout=\"row\" layout-align=\"start center\"><div class=\"navigation-toggle\" hide-gt-sm=\"\"><md-button class=\"md-icon-button\" ng-click=\"vm.toggleHorizontalMobileMenu()\" aria-label=\"Toggle Mobile Navigation\"><md-icon md-font-icon=\"icon-menu\"></md-icon></md-button></div><div class=\"logo\" layout=\"row\" layout-align=\"start center\"><span class=\"logo-image\">F</span> <span class=\"logo-text\">FUSE</span></div><md-progress-circular id=\"toolbar-progress\" ng-if=\"$root.loadingProgress\" class=\"md-accent\" md-mode=\"indeterminate\" md-diameter=\"64\"></md-progress-circular></div><div layout=\"row\" layout-align=\"start center\"><ms-search-bar></ms-search-bar><md-menu-bar id=\"user-menu\"><md-menu md-position-mode=\"left bottom\"><md-button class=\"user-button\" ng-click=\"$mdOpenMenu()\" aria-label=\"User settings\" translate=\"\" translate-attr-aria-label=\"TOOLBAR.USER_SETTINGS\"><div layout=\"row\" layout-align=\"space-between center\"><div class=\"avatar-wrapper\"><img md-menu-align-target=\"\" class=\"avatar\" src=\"assets/images/avatars/profile.jpg\"><md-icon md-font-icon=\"\" ng-class=\"vm.userStatus.icon\" ng-style=\"{\'color\': vm.userStatus.color }\" class=\"icon status s16\"></md-icon></div><span class=\"username\" hide-xs=\"\">John Doe</span><md-icon md-font-icon=\"icon-chevron-down\" class=\"icon s16\" hide-xs=\"\"></md-icon></div></md-button><md-menu-content width=\"3\"><md-menu-item class=\"md-indent\" ui-sref=\"app.pages_profile\"><md-icon md-font-icon=\"icon-account\" class=\"icon\"></md-icon><md-button>My Profile</md-button></md-menu-item><md-menu-item class=\"md-indent\" ui-sref=\"app.mail\"><md-icon md-font-icon=\"icon-email\" class=\"icon\"></md-icon><md-button>Inbox</md-button></md-menu-item><md-menu-item class=\"md-indent\"><md-icon md-font-icon=\"\" ng-class=\"vm.userStatus.icon\" ng-style=\"{\'color\': vm.userStatus.color }\" class=\"icon\"></md-icon><md-menu id=\"user-status-menu\"><md-button ng-click=\"$mdOpenMenu()\" class=\"status\" ng-class=\"vm.userStatus.class\">{{vm.userStatus.title}}</md-button><md-menu-content width=\"2\"><md-menu-item class=\"status md-indent\" ng-class=\"{\'selected\': status === vm.userStatus}\" ng-repeat=\"status in vm.userStatusOptions\"><md-icon md-font-icon=\"{{status.icon}}\" ng-style=\"{\'color\': status.color }\" class=\"icon\"></md-icon><md-button ng-click=\"vm.setUserStatus(status)\">{{status.title}}</md-button></md-menu-item></md-menu-content></md-menu></md-menu-item><md-menu-divider></md-menu-divider><md-menu-item class=\"md-indent\"><md-icon md-font-icon=\"icon-logout\" class=\"icon\"></md-icon><md-button ng-click=\"vm.logout()\">Logout</md-button></md-menu-item></md-menu-content></md-menu></md-menu-bar><md-menu id=\"language-menu\" md-offset=\"0 72\" md-position-mode=\"target-right target\"><md-button class=\"language-button\" ng-click=\"$mdOpenMenu()\" aria-label=\"Language\" md-menu-origin=\"\" md-menu-align-target=\"\"><div layout=\"row\" layout-align=\"center center\"><img class=\"flag\" ng-src=\"assets/images/flags/{{vm.selectedLanguage.flag}}.png\"> <span class=\"iso\">{{vm.selectedLanguage.code}}</span></div></md-button><md-menu-content width=\"3\" id=\"language-menu-content\"><md-menu-item ng-repeat=\"(iso, lang) in vm.languages\"><md-button ng-click=\"vm.changeLanguage(lang)\" aria-label=\"{{lang.title}}\" translate=\"\" translate-attr-aria-label=\"{{lang.title}}\"><span layout=\"row\" layout-align=\"start center\"><img class=\"flag\" ng-src=\"assets/images/flags/{{lang.flag}}.png\"> <span translate=\"{{lang.translation}}\">{{lang.title}}</span></span></md-button></md-menu-item></md-menu-content></md-menu><md-button id=\"quick-panel-toggle\" class=\"md-icon-button\" ng-click=\"vm.toggleSidenav(\'quick-panel\')\" aria-label=\"Toggle quick panel\" translate=\"\" translate-attr-aria-label=\"TOOLBAR.TOGGLE_QUICK_PANEL\"><md-icon md-font-icon=\"icon-format-list-bulleted\" class=\"icon\"></md-icon></md-button></div></div>");
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