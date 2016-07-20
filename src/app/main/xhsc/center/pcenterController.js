/**
 * Created by emma on 2016/6/12.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('pcenterController',pcenterController);

  /**@ngInject*/
  function pcenterController($scope,$mdDialog,sxt,auth){
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

    sxt.plugin.playYs7(['at.9bqcatcc9fufzpdcak6g3lyo0nlrt1vx-1sbphy33b4-08io12i-mvctkmsal','de7e39a6802a41b49a037518cffa684d'])
/*    ys7.post('cameraList',{pageSize:200,pageStart:0}).then(function (result) {
      ys7.getToken().then(function (token) {
        sxt.plugin.playYs7([token,])
      });
      console.log(result);
    });*/
/*

    var id= 123455,api='https://open.ys7.com/api/method',key='346249221d154bac9ba686873c2dffec';
    getD('token/getAccessToken',{
      phone:'13823315505'
    }).then(function(result){
      var token = result.data.result.data.accessToken,
        userid = result.data.result.data.userId;
      getD('cameraList',{accessToken:token,pageSize:200,pageStart:0}).then(function(result){
        console.log(result);
      })
    });

    function getD(method,params) {
      return $http({
        method: 'POST',
        url: 'https://open.ys7.com/api/time/get',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        transformRequest: function (obj) {
          var str = [];
          for (var p in obj)
            str.push (encodeURIComponent (p) + "=" + encodeURIComponent (obj[p]));
          return str.join ("&");
        },
        data: {
          id:id,
          appKey:key
        }
      }).then(function(result){
        var t = result.data.result.data.serverTime;
        return $http.post(api,{
          system:{
            ver:1.0,
            sign:signData(t,method,params),
            key:key,
            time:t
          },
          method:method,
          params:params,
          id:id
        });
      });
    }

    function signData(time,method,params) {
      var p = [], v = [];

      for (var k in params) {
        p.push({key: k, value: params[k]});
      }
      p.sort(function (s1, s2) {
        return s1.key.localeCompare(s2.key);
      });
      p.push({key: 'method', value: method});
      p.push({key: 'time', value: time});
      p.push({key: 'secret', value: 'f637ad66df8d77133f43f28ddf9942d7'});
      p.forEach(function (m) {
        v.push(m.key + ':' + m.value);
      });
      return xhUtils.md5(v.join(','));
    }

*/

    vm.logout = function(){
      auth.logout();
    }
  }
})();
