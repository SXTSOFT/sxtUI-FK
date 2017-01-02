/**
 * Created by HuangQingFeng on 2016/11/29.
 */
(function (angular, undefined) {
  'use strict';

  angular
    .module('app.material')
    .component('materialLibrary', {
      templateUrl: 'app/main/material/component/material-library.html',
      controller: materialLibrary,
      controllerAs: 'vm'
    });

  function materialLibrary($scope, api, utils, $state, $stateParams,$mdDialog) {
    var vm = this;
    $scope.data = {};
    vm.cid = $stateParams.cid || 0;

    function load() {
      api.material.materialScience.GetMaterialTreeList(vm.cid).then(function (q) {
        if (q.data) {
          $scope.data.nodeList = q.data;
        }
      });
    }
      load();

    vm.batchAdd = function(node,ev) {
      var data = {};
      var confirm = $mdDialog.prompt()
        .title('批量添加材料')
        // .textContent('Bowser is a common name.')
        .placeholder('材料名称')
        .ariaLabel('材料名称')
        // .initialValue('Buddy')
        .targetEvent(ev)
        .ok('提交')
        .cancel('关闭');

      $mdDialog.show(confirm).then(function(result) {
        if (result){
          data.MaterialClassId = node.id;
          data.MaterialName = result;
          api.material.materialScience.Create(data).then(function () {
            vm.batchAdd(node,null);
          });
        }else {
          load();
        }
      }, function() {
        load();
        console.log('Cancel Batch Add Material !')
      });
    }

    vm.addMaterial = function (node) {
      $state.go('app.material.add');
    }

    vm.toggleClick = function (node, scope,fn) {
      scope.toggle(scope);
      if(!node.nodes){
        api.material.materialScience.GetMaterialListByTypeId(node.id).then(function(r){
          node.nodes = r.data;
        });
      }
    }

    vm.btnEdit = function (node,flag,ev) {
        if(node){
          switch (node.level){
            case 1 : {
              vm.showPrompt(node,flag,ev);
              break;
            }
            case 2: {
              $state.go('app.material.add',{id:node.id,cid:vm.cid});
              break;
            }
          }
        }
    }

    vm.btnRemove = function(node){
      if (node){
        switch (node.level){
          case 1:{
            utils.confirm('确认删除此材料库').then(function () {
              api.material.type.delete(node.id).then(function () {
                utils.alert("删除成功", null, function () {
                  load();
                });
              })
            });
            break;
          }
          case 2:{
            utils.confirm('确认删除此材料信息').then(function () {
              api.material.materialScience.delete(node.id).then(function () {
                utils.alert("删除成功", null, function () {
                  load();
                });
              })
            });
            break;
          }
        }
      }
    }

    vm.showPrompt = function(node,flag,ev) {
      var data = node ? node : {};
      var title = flag ? '编辑材料库': '新增材料库';

      $mdDialog.show({
        controller: ['$scope','utils','$mdDialog',function ($scope,utils,$mdDialog) {
          $scope.materialName = flag ? node.title : '';

          $scope.submit = function (result) {
            if(result){
              data.CategoryName = result;
              if(flag){
                data.Id = node.id;
                api.material.type.update(data).then(function () {
                  utils.alert("提交成功", null, function () {
                    load();
                  });
                });
              }else{
                api.material.type.create(data).then(function () {
                  utils.alert("提交成功", null, function () {
                    load();
                  });
                });
              }
            }

            $mdDialog.hide();
          }

          $scope.close = function () {
            $mdDialog.hide();
          }
        }],
        template: '<md-dialog aria-label="'+title+'">'
        +'<md-subheader class="md-no-sticky" style="background-color:#78909C;color: black;">'+title+'<small></small></md-subheader>'
        + '<md-dialog-content style="padding: 30px 20px 13px 20px;">'
          +'<md-input-container class="md-block">'
          +'<input ng-model="materialName" type="text" placeholder="材料库名称">'
          +'</md-input-container>'
        +'<div layout="row" flex>'
        +'<md-button class="md-primary md-raised" type="submit" flex="50" ng-click="submit(materialName)">保存</md-button>'
        +'<md-button class="md-primary md-raised" flex="50" ng-click="close()">取消</md-button>'
        +'</div>'
        + '</md-dialog-content>'
        + '</md-dialog>',
        parent: angular.element(document.body),
        clickOutsideToClose:false,
        fullscreen: false,
        targetEvent:ev
      });
    }

    vm.alertPromat = function (node,ev) {
      $mdDialog.show({
        controller: ['$scope','utils','$mdDialog',function ($scope,utils,$mdDialog) {
          $scope.submit = function (content) {
            if (content) {
              var arrs = [];
              var _words = [];
              var json = {};
              var words = content.replace(new RegExp('\n','g'),'|').split('|');
              //清除换行空值
              words = words.filter(function (t) {
                return  t != undefined && t != null && t.replace(/(^\s*)|(\s*$)/g, "") != ''
              });
              //清除重复数据
              for(var i = 0; i < words.length; i++){
                var val = words[i].replace(/(^\s*)|(\s*$)/g, '')
                if(!json[val]){
                  _words.push(val);
                  json[val] = 1;
                }
              }

              _words.forEach(function (r) {
                if(r){
                  arrs.push({
                    'MaterialClassId':node.id,
                    'MaterialName':r
                  });
                }
              });

              api.material.materialScience.batchCreate(arrs).then(function () {
                utils.alert("提交成功",null,function () {
                  load();
                });
              });
            }

            $mdDialog.hide();
          }

          $scope.close = function () {
            $mdDialog.hide();
          }
        }],
        template: '<md-dialog aria-label="新增材料">'
        +'<md-subheader class="md-no-sticky" style="background-color:#78909C;color: black;">批量新增材料<small>（Enter 键换行多个添加）</small></md-subheader>'
        + '<md-dialog-content style="padding: 20px 20px 13px 20px;">'
        + '<textarea ng-model="materialName" cols="30" rows="5" style="border: 2px solid lightgrey;padding: 5px 10px;"></textarea>'
        +'<div layout="row" flex style="padding-top:10px;">'
        +'<md-button class="md-primary md-raised" type="submit" flex="50" ng-click="submit(materialName)">保存</md-button>'
        +'<md-button class="md-primary md-raised" flex="50" ng-click="close()">取消</md-button>'
        +'</div>'
        + '</md-dialog-content>'
        + '</md-dialog>',
        parent: angular.element(document.body),
        clickOutsideToClose:false,
        fullscreen: false,
        targetEvent:ev
      });
    }

  }
})(angular, undefined);
