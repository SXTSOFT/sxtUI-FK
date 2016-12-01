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
    vm.data = {};
    vm.data.Id = $stateParams.id;
    vm.data.nodeList = [];

    function load() {
      api.material.materialScience.GetMaterialTreeList().then(function (q) {
        if (q.data) {
          vm.data.nodeList = q.data;
        }
      });
    }

    load();

    vm.batchAdd = function(node,ev) {
      var data = {};
      var confirm = $mdDialog.prompt()
        .title('批量添加材料库')
        // .textContent('Bowser is a common name.')
        .placeholder('材料库名称')
        .ariaLabel('材料库名称')
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
    }

    vm.btnEdit = function (node,flag,ev) {
        if(node){
          switch (node.level){
            case 1 : {
              vm.showPrompt(node,flag,ev);
              break;
            }
            case 2: {
              $state.go('app.material.add',{id:node.id});
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

      var confirm = $mdDialog.prompt()
        .title(title)
        // .textContent('Bowser is a common name.')
        .placeholder('材料库名称')
        .ariaLabel('材料库')
        .initialValue(flag ? node.title : '')
        .targetEvent(ev)
        .ok('提交')
        .cancel('取消');

     $mdDialog.show(confirm).then(function(result) {
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
      }, function() {
        console.log('Cancel Add Material !')
      });
    }

  }
})(angular, undefined);
