/**
 * Created by emma on 2016/6/12.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('pcenterController',pcenterController);

  /**@ngInject*/
  function pcenterController($scope,$mdDialog,$http,xhUtils){
    var vm = this;
    vm.tel=13112345678;
    vm.changeTel = function(tel){
      $mdDialog.show({
        controller:['$scope',function($scope){
            $scope.tel = vm.tel;
            $scope.cancel = function(){
              $mdDialog.hide();
            }
          $scope.submit = function(tel){
            $mdDialog.hide(tel);
            vm.tel = tel;
          }
        }],
        templateUrl: 'app/main/xhsc/center/changeTel.html',
        parent: angular.element(document.body),
        focusOnOpen:false,
        clickOutsideToClose: true
      }

        //$mdDialog.prompt({
        //  title:'手机号码',
        //  placeholder:'电话号码',
        //  ok:'确定',
        //  cancel:'取消'
        //})
      )
    }

    var api='https://open.ys7.com/api/method';
    console.log('md5:',xhUtils.md5('accessToken:f88c4dbb354711c9bf6597a4987dce90,deviceId:123456789,phone:18899998888,userId:ghhc4dbb354711c9bf6597a4987dce90,method:getDevice,time:1404443389,secret:yuc4dbb354sdsdfj77d76lkd86'))

    $http.post(api,getD('token/getAccessToken',{
      phone:'13823315505'
    }));

    function getD(method,params) {
      var t = new Date().getTime();
      return {
        system:{
          ver:1.0,
          sign:signData(t,method,params),
          key:'346249221d154bac9ba686873c2dffec',
          time:t
        },
        method:method,
        params:params,
        id:2356
      }
    }
    function signData(time,method,params) {
      var p = [],v=[];
      p.push({key:'method',value:method});
      p.push({key:'time',value:time});
      p.push({key:'secret',value:'f637ad66df8d77133f43f28ddf9942d7'});
      for(var k in params){
        p.push({key:k,value:params[k]});
      }
      p.sort(function (s1,s2) {
        return s1.key.localeCompare(s2.key);
      });
      p.forEach(function (m) {
        v.push(m.key+':'+m.value);
      });
      return xhUtils.md5(v.join(''));
    }

    vm.logout = function(){
      vm.showmyDialog = true;
    }
  }
})();
