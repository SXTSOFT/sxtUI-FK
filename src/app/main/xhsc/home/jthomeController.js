/**
 * Created by shaoshunliu on 2017/4/25.
 */
/**
 * Created by jiuyuong on 2016/3/30.
 */
(function ()
{
  'use strict';

  angular
    .module('app.xhsc')
    .controller('jthomeController', jthomeController);

  /** @ngInject */
  function jthomeController($scope,$state,$rootScope,$timeout,remote, utils,api,delopy,$mdDialog)
  {
    var vm = this;
    $rootScope.hz=true;
    delopy.update(function (self,r0,version,isIntall) {
      if (isIntall)
        return utils.confirm('发现新版本：' + r0 + '，是否更新？')
      else {
        return utils.confirm('版本已经更新完毕，是否重新启动?')
      }
    });

    api.setNetwork(0).then(function(){

    })

    vm.go=function (item) {
      $state.go("app.xhsc.prjhome",{
        companyId:item.ID,
        companyName:item.Name
      })
    }


    function projects(callback) {
      remote.Project.getMap().then(function (data) {
          vm.projects=data.data?data.data:[];
          if (callback){
            callback(vm.project)
          }
      });
    }



    function load() {
      remote.progress.getCompanyData().then(function (r) {
        vm.data=r.data?r.data:[];
        var query=jslinq(vm.data);
        if (query.count()){


          var me=query.where(function (t) {
            return t.Measure;
          });
          vm.Measure=(me.sum(function (k) {
            return k.Measure;
          })/me.count())


          vm.Inspection=(query.where(function (t) {
            return  t.Inspection;
          }).sum(function (k) {
            return k.Inspection;
          })/vm.data.length)


          vm.Security=(query.where(function (t) {
            return t.Security;
          }).sum(function (k) {
            return k.Security;
          })/vm.data.length)


          me=query.where(function (t) {
            return t.Assessment;
          });
          vm.Assessment=(me.sum(function (k) {
            return k.Assessment;
          })/me.count());

          // me.toList().forEach(function (t) {
          //   t.Assessment=parseFloat(t.Assessment.toFixed(2));
          // });
        }else {
          vm.Measure=vm.Inspection=vm.Security=vm.Assessment=0;
        }
      })
      projects();
    }

    load();

    function query(controller) {
      $mdDialog.show({
        controller: ['$scope',  '$mdDialog', controller],
        template: '<md-dialog aria-label="查询" ng-cloak style="width: 100%;height:100%;max-width: 100%;max-height: 100%" layout="column">' +
                    '<md-toolbar class="md-hue-2" layout="row"  style="height: 44px;background-color: #e93030" layout-align="center center">'+
                      '<span flex></span>'+
                      '<h3>项目列表</h3>'+
                      '<span flex style="text-align: right"><md-button style="margin-right: -1%" ng-click="cancel()">取消</md-button></span>'+
                    '</md-toolbar>'+
                      '<md-dialog-content flex style="padding: 26px 0px" layout="column">' +
                        '<div style="position:fixed;top:44px;width: 100%;z-index:999;background-color: #ffffff;left: 0px;height: 40px">'+
                          '<md-input-container ng-model="queryText" md-no-float class="md-block" style="height: 44px;margin-top: 8px">'+
                            '<input ng-model="queryText" style="padding-bottom: 8px;padding-left: 12px" type="text" placeholder="首字母查询"/>'+
                          '</md-input-container>'+
                        '</div>'+
                        '<md-list>' +
                            '<md-list-item ng-repeat="item in projects|cnFilter:{ProjectName:queryText}" ng-click="ok(item)">' +
                                '{{item.ProjectName}}'+
                                '<md-divider></md-divider>'+
                            '</md-list-item>'+
                        '</md-list>'+
                     '</md-dialog-content>' +
                  '</md-dialog>',
        parent: angular.element(document.body),
        clickOutsideToClose: true,
        fullscreen: false
      })
    }



    var event= $rootScope.$on("search",function () {
      query(function ($scope,$mdDialog) {
        $scope.ok=function (item) {
          $mdDialog.hide();
          $state.go('app.progress',{projectId:item.ProjectID, projectName: item.ProjectName});
        }
        $scope.cancel=function () {
          $mdDialog.cancel();
        }
        $scope.projects=vm.projects;
        if (!vm.projects){
          projects(function (data) {
            $scope.projects=data;
          })
        }
        $scope.queryText="";
      })
    })

   var event1= $rootScope.$on("goMap",function () {
      $state.go("app.xhsc.home");
    })

    $scope.$on("$destroy", function() {
      $rootScope.hz=false;
      event();
      event1();
    });
  }
})();
