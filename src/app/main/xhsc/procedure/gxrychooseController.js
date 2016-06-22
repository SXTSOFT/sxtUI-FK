/**
 * Created by emma on 2016/6/12.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('gxrychooseController',gxrychooseController);

  /**@ngInject*/
  function gxrychooseController($scope){
    var vm = this;
    vm.persons = [{
      unit:'甲方',
      users:[{
        name:'张三',
        id:1
      },{
        name:'李四',
        id:2
      },{
        name:'王五',
        id:3
      },{
        name:'王五',
        id:10
      },{
        name:'王五',
        id:11
      },{
        name:'王五',
        id:12
      },{
        name:'王五',
        id:13
      },{
        name:'王五',
        id:14
      },{
        name:'王五',
        id:15
      },{
        name:'王五',
        id:16
      },{
        name:'王五',
        id:17
      },{
        name:'王五',
        id:18
      },{
        name:'王五',
        id:19
      },{
        name:'王五',
        id:20
      }]
    },{
      unit:'监理',
      users:[{
        name:'张三',
        id:4
      },{
        name:'李四',
        id:5
      },{
        name:'王五',
        id:6
      }]
    },{
      unit:'施工单位',
      users:[{
        name:'张三',
        id:7
      },{
        name:'李四',
        id:8
      },{
        name:'王五',
        id:9
      }]
    }]

    vm.persons.forEach(function(p){
      p.users.forEach(function(u){
        u.checked = false;
      })
    })
    vm.choosed = [];
    if($scope.$parent.vm.responsers){
      $scope.$parent.vm.responsers.forEach(function(_t){
        console.log('-t',_t)
        vm.persons.forEach(function(t){
          var f = t.users.find(function(u){
            return u.id === _t.id;
          })
          console.log('f',f)
          if(f){
            //console.log(f)
            f.checked = true;
            vm.choosed.push(f)
          }
        })

      })

    }

    vm.choosery = function(it){
      //vm.rylevels = null;
      vm.current = it;
      console.log(it)
      vm.persons.forEach(function(t){
        t.checked = false;
        t.users.forEach(function(_t){
         // _t.checked = false;
        })
      })
      it.checked = true;
      //vm.rylevels= it.users;
    }
    vm.choose = function(user){
      user.checked = !user.checked;
      if(user.checked){
        vm.choosed.push(user);
      }else{
        vm.choosed.forEach(function(t){
          if(t.id ==  user.id){
            var idx = vm.choosed.indexOf(user);
            console.log('idx',idx)
            if(idx !=-1){
              vm.choosed.splice(idx,1);
            }
            console.log('vnm',vm.choosed)
          }
        })
      }
    }
    vm.rydel = function(item){
      vm.choosed.forEach(function(t){
        if(t.id ==  item.id){
          t.checked = false;
          var idx = vm.choosed.indexOf(item);
          console.log('idx',idx)
          if(idx !=-1){
            vm.choosed.splice(idx,1);
          }
          console.log('vnm',vm.choosed)
        }
      })
    }
    vm.choosery(vm.persons[0])

    //console.log($scope.$parent.vm.responsers)
    vm.userSubmit = function(user){
      history.go(-1);
      $scope.$parent.vm.responsers = user;
      //console.log($scope.$parent)
    }
  }
})();
