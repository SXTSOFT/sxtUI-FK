/**
 * Created by zhangzhaoyong on 16/2/3.
 */
(function(){
  'use strict';

  angular
    .module('app.szgc')
    .controller('SzgcyhydController', SzgcyhydController);

  /** @ngInject */
  function SzgcyhydController(api,$stateParams,$rootScope)
  {

    var vm = this;
    vm.link = 'http://vkde.sxtsoft.com/yhyd/';
    vm.picUrl = '/upload/floor-img.jpg';
    vm.images=[
      'http://szdp.vanke.com:8088/upload/2015/12/s_f43c8cb8-9360-4612-b6dd-9272d07a296d.jpg',
      'http://szdp.vanke.com:8088/upload/2015/12/s_f43c8cb8-9360-4612-b6dd-9272d07a296d.jpg',
      'http://szdp.vanke.com:8088/upload/2016/01/324503ea-3d4c-4cc4-934a-fe162bfa73a5.png',
      'http://szdp.vanke.com:8088/upload/2016/01/b2ec1d61-995a-4c21-a138-e135d1837a83.png'
    ];
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
    console.log('here',$stateParams)
    vm.sellLine = 0.6;
    api.szgc.vanke.buildingsInfo(1,1).then(function(data){
      var mx = 0;
      data.forEach(function (item) {
        if (mx < item.floors)
          mx = item.floors;
        item.gx1 = 20;
        item.gx2 = 10;
        item.summary = '';
      })
      vm.floorNum = mx;
      vm.sxtfloor = data;
    });
    //获取floorData的一些数据－－flayerData
    //vm.sxtfloor = flData.flData;
    //[
    //  {"data":[50,20,10,5,5]},
    //  {"data":[50,30,10,5,10]},
    //  {"data":[50,40,20,15,5]},
    //  {"data":[50,40,10,5,25]}
    //]
    //vm.sxflData = ;
    //vm.sxflData =[
    //    [50,50,20,10,10,1],//总高度，当前栋最高楼层，第二道工序楼层，第一道工序楼层，起售楼层，栋数
    //      [50,35,20,10,20,2],
    //      [50,40,20,10,30,3],
    //      [50,40,20,10,30,4]
    //  ];
  //  ;//builds;

  }

})();
