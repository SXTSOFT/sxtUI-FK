/**
 * Created by emma on 2016/6/12.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('gxrychooseController',gxrychooseController);

  /**@ngInject*/
  function gxrychooseController($scope,$stateParams,remote){
    var vm = this;
    //console.log('a',$stateParams)
    remote.Project.queryAllBulidings($stateParams.projectId).then(function (result) {
    })
    remote.Procedure.GetPermissionsByProjectId($stateParams.projectId).then(function(res){
      console.log('a',res)
      var personzbList = [],personjlList=[],persongcList=[];
      res.data.forEach(function(p){
        if(p.MemberType == 0){
          personzbList.push(p)
        }else if(p.MemberType == 2){
          personjlList.push(p);
        }else if(p.MemberType == 4){
          persongcList.push(p);
        }
      })
      vm.persons = [{
        type:0,
        unit:'总包',
        users:personzbList
      },{
        type:2,
        unit:'监理',
        users:personjlList
      },{
        type:4,
        unit:'项目部',
        users:persongcList
      }];
      vm.persons.forEach(function(p){
        p.users.forEach(function(u){
          u.checked = false;
        })
      })
      setUser();
      //console.log('all',vm.allpersons)
    })

    function setUser(){
      vm.choosed = [];
      if($scope.$parent.vm.responsers){
        $scope.$parent.vm.responsers.forEach(function(_t){
          console.log('-t',_t)
          vm.persons && vm.persons.forEach(function(t){
            var f = t.users.find(function(u){
              return u.SupervisionHeadID === _t.SupervisionHeadID;
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
      vm.choosery(vm.persons[0])
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
          if(t.SupervisionHeadID ==  user.SupervisionHeadID){
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
        if(t.SupervisionHeadID ==  item.SupervisionHeadID){
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
    $scope.$watch('vm.persons',function(){

    })


    //console.log($scope.$parent.vm.responsers)
    vm.userSubmit = function(user){
      history.go(-1);
      $scope.$parent.vm.responsers = user;
      //console.log($scope.$parent)
    }
  }
})();
