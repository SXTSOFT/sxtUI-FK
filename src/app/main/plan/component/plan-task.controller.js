/**
 * Created by emma on 2016/8/22.
 */
(function(angular,undefined){
  'use strict';

  angular
    .module('app.plan')
    .component('planTask',{
      templateUrl:'app/main/plan/component/plan-task.html',
      controller:planTask,
      controllerAs:'vm'
    });

  /** @ngInject */
  function planTask($scope,template,$mdSidenav,$stateParams,api,$state,$mdDialog,$mdSelect,$q,utils,$timeout){
    var vm = this,
      temp,task,
      id = $state.params["id"];

/*    if(id!='add'){
      api.plan.TaskLibrary.getItem(id).then(function (r) {
        vm.data = r.data;
      })
    }*/
    //保存任务左边的基础信息
    vm.ClickSaveleft = function(data){
      if(id=='add'){
        api.plan.TaskLibrary.create(data).then(function (r) {
          $state.go('app.plan.task.list');
        });

      }else{
        api.plan.TaskLibrary.update(data).then(function (r) {
          //$state.go('app.plan.task.list');
          if(r.status == 200){
            utils.alert('保存成功！');
          }
        });
      }

    }
    //工序
    api.plan.procedure.query().then(function(r){
      vm.procedures = r.data;
    })
    api.plan.MeasureInfo.query().then(function(r){
      vm.measureInfo = r.data
    })
    vm.selectSpecialtyLow=function(item,parent){
      parent.WPAcceptanceList=item.WPAcceptanceList;
    }

    vm.selectedGx = [];
    vm.choosego = function(item){
      vm.gxNames = item.AcceptanceItemName;
      vm.data.CloseRelatedObjectId = item.AcceptanceItemID;
      $mdSidenav('gx_nav').close();
    }

    vm.selectProcedure = function(){
      $mdSidenav('gx_nav').open();
    }
    vm.isNew = $stateParams.id=='add';

    vm.createTask = function(){
      if(vm.isNew) {
        api.plan.TaskLibrary.create(vm.data).then(function (r) {
          $state.go('app.plan.task.detail',{id: r.data.TaskLibraryId});
        });
      }
      else{
        api.plan.TaskLibrary.update(vm.data.TaskLibraryId,vm.data).then(function (r) {

        })
      }
    }

    if(!vm.isNew){
      api.plan.TaskLibrary.getTaskFlow($stateParams.id).then(function (r) {
        task = vm.data = r.data;
      })
    }
    else{
      task = vm.data = {
        Level:0
      }
    }

    vm.toggleRight = function () {
      return $mdSidenav('right')
        .open();
    }
    vm.closeRight = function () {
      return $mdSidenav('right')
        .close();
    }
    vm.relationTypes = [{
      name:'关联实测项',
      type:'PQMeasure'
    },{
      name:'关联工序',
      type:'Inspection'
    }]
    vm.onLoadTemplate = function () {

      if(!task) {
        task = {
          taskId: 0,
          Name: vm.data&&vm.data.name||'楼栋模板',
          Master: [],
          Branch: []
        }
      }
      if(task.Master.length===0) {
        vm.toggleRight();
      }
      if(temp)return;
      temp = new template({
        onClick:function (e) {
          vm.current = e.data;
          vm.toggleRight();
          vm.saveNotice7=[];
          //vm.saveNoticeStarted = [];
          //vm.saveNoticeEarlyWarning=[];
          vm.saveNoticeClosed=[];
          $timeout(function(){
            vm.getUsers();
            vm.getNextTasks();
            vm.categoryChanged = false;
          },300)

        }
      });
      temp.load(task);

    }
    api.plan.UserGroup.query().then(function(r){
      vm.nextUserGroups = r.data.Items;
    })
    vm.getUsers = function(){
      var promise=[
        api.plan.TaskFlow.getRoleByFlowId(vm.current.TaskFlowId)
        //api.plan.UserGroup.query()
      ]
      if(!vm.nextUserGroups) return;
     // $q.all(promise).then(function(res){
        api.plan.TaskFlow.getRoleByFlowId(vm.current.TaskFlowId).then(function(res){
        //var users = res[0].data.Items;
        //vm.nextUserGroups = res[1].data.Items;
        var users = res.data.Items;
        if(!users&&users.length) return;
        users.forEach(function(r){
          var f = vm.nextUserGroups.find(function(_r){
            return _r.GroupID == r.RoleId;
          })
          if(f){
            f['selected'+ r.NotificationType] = true;
          }
        })
        users.forEach(function(r){
          switch (r.NotificationType){
            //case 1:
            //  vm.saveNoticeStarted.push(r.RoleId);
            //  break;
            //case 2:
            //  vm.saveNoticeEarlyWarning.push(r.RoleId);
            //  break;
            case 1:
              break;
            case 2:
              break;
            case 4:
              break;
            case 7:
              vm.saveNotice7.push(r.RoleId);
              break;
            case 8:
              vm.saveNoticeClosed.push(r.RoleId);
              break;
            default:
              break;
          }
        })
      })
    }
    vm.save = function () {
      var data={
        "Id": vm.current.TaskFlowId,
        "Name": vm.current.Name,
        "IsFloor": vm.current.IsFloor,
        "IsRequired":vm.current.IsRequired
      }
      api.plan.TaskFlow.updateTaskById(data).then(function () {
        temp && temp.edit(vm.current);
        vm.closeRight();
      })
    }
    vm.nextSave = function () {
      var next = angular.extend({
        TaskLibraryId:task.TaskLibraryId,
        IsFloor:false,
        Type:vm.current?vm.current.line:0,
        ParentId:vm.current?vm.current.TaskFlowId:0
      },vm.next);
      vm.next = {};
      api.plan.TaskFlow.post(
        next
      ).then(function (r) {
        next.TaskFlowId = r.data.TaskFlowId;
        next.TaskLibraryId = task.TaskLibraryId;
        //next.categoryId = new Date().getTime();
        temp && temp.add(next,vm.current);
        vm.closeRight();
      });

    }
    vm.nextBranch = function () {
      var next = angular.extend({
        TaskLibraryId:task.TaskLibraryId,
        IsFloor:false,
        Type:vm.data.Branch.length+1,//vm.current?vm.current.line+1:0,
        ParentId:vm.current?vm.current.TaskFlowId:0
      },vm.branch);
      vm.branch = {};
      api.plan.TaskFlow.post(
        next
      ).then(function (r) {
        next.TaskFlowId = r.data.TaskFlowId;
        next.TaskLibraryId = task.TaskLibraryId;
        //next.categoryId = new Date().getTime();
        temp && temp.add(next,vm.current,true);
        vm.closeRight();
      });

    }
    vm.remove = function () {
      utils.confirm('确认删除',null).then(function(){
        api.plan.TaskFlow.deleteFlow(vm.current.TaskFlowId).then(function () {
          temp && temp.remove(vm.current);
          vm.closeRight();
          //$state.go('app.plan.task.list');
        })
      })
    }
    $scope.$watch('vm.selectedCategory',function(){
      if(!vm.cselectedCategory){
        vm.cselectedCategory = vm.selectedCategory;
      }
      if(vm.selectedCategory&&vm.selectedCategory!=vm.cselectedCategory){
        vm.categoryChanged = true;
      }else if(vm.selectedCategory){
        vm.categoryChanged = false;
        vm.getNextTasks();
      }
    })
    vm.getNextTasks = function () {
      vm.saveTasks =[];
      vm.nextTasks=[];
      var promises = [
        api.plan.TaskLibrary.GetList({Level:task.Level+1}),
        api.plan.TaskFlow.getSubTasks(vm.current.TaskFlowId)
      ];
      $q.all(promises).then(function(res){
        vm.nextTasks = res[0].data.Items;
        vm.selectedTasks =  res[1].data.Items;
        vm.nextTasks.forEach(function(r){
          var f = res[1].data.Items&&res[1].data.Items.find(function(_r){
            return _r.TaskLibraryId == r.TaskLibraryId;
          })
          if(f&&!vm.categoryChanged){
              vm.cselectedCategory = r.Type;
              vm.selectedCategory = r.Type;
              r.selected = true;
          }
        })
      })
      //api.plan.TaskLibrary.GetList({
      //  Level:task.Level+1
      //}).then(function (r) {
      //  vm.nextTasks = r.data.Items;
      //})
    }

    vm.addSubTask = function (ev) {
      $mdSelect.destroy();
      $mdDialog.show({
        controller: 'planTaskMiniController',
        templateUrl: 'app/main/plan/component/plan-task-mini.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        fullscreen: false,
        locals:{
          parentTask:task,
          selected:vm.selectedCategory&&vm.selectedCategory
        }
      })
        .then(function (newTask) {
          if(!angular.isArray(vm.saveTasks)){
            vm.saveTasks=[];
          }
          vm.saveTasks.push(newTask.TaskLibraryId);
          var tasks = [];
          vm.saveTasks && vm.saveTasks.forEach(function (tid) {
            tasks.push({
              TaskFlowId:vm.current.TaskFlowId,
              TaskLibraryId:tid
            });
          })
          api.plan.TaskFlow.resetTaskFlow(vm.current.TaskFlowId,tasks).then(function(r){
            if(r.status == 200 || r.data){
              vm.getNextTasks();
            }
          })

        }, function () {

        });
    }
    vm.saveSubTasks = function () {
      var tasks = [];
      vm.saveTasks && vm.saveTasks.forEach(function (tid) {
        tasks.push({
          TaskFlowId:vm.current.TaskFlowId,
          TaskLibraryId:tid
        });
      })
      api.plan.TaskFlow.resetTaskFlow(vm.current.TaskFlowId,tasks).then(function(r){

      })
      //console.log('vm.saveTasks',vm.saveTasks)
    }
    //vm.getUseGroups = function () {
    //  api.plan.UserGroup.query().then(function (r) {
    //    vm.nextUserGroups = r.data.Items;
    //  })
    //}
    //vm.getUseGroups();
    vm.stop = function(ev){
      ev.stopPropagation();
    }
    vm.addRole = function (ev) {
      $mdSelect.destroy();
        var confirm = $mdDialog.prompt()
          .title('添加新的角色')
          .textContent('请输入角色名字')
          .placeholder('角色名字')
          .ariaLabel('角色名字')
          .initialValue('')
          .ok('添加')
          .cancel('取消');
        $mdDialog.show(confirm).then(function(result) {
          api.plan.UserGroup.create({
            "GroupName": result,
            "SystemID": "plan",
            "Description": result
          }).then(function(r){
            utils.alert('添加成功',null).then(function(){

            })
            //$mdDialog.show(
            //  $mdDialog.alert()
            //    .title('添加成功')
            //)
          })
        }, function() {

        });
    }
    vm.saveUserGroup = function (type) {
      var users ={
        roleIds:[]
      };
      var datas = vm['saveNotice'+type];
      //console.log(datas)
      datas&&datas.forEach(function(r){
        users.roleIds.push(r)
      })
      api.plan.TaskFlow.resetTaskFlowRolesByType(vm.current.TaskFlowId,type,users.roleIds).then(function(r){
      })
    }
  }
})(angular,undefined);
