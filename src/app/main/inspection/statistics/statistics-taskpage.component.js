/**
 * Created by emma on 2016/11/15.
 */
(function(){
  'use strict';

  angular
    .module('app.inspection')
    .component('statisticsTaskpage',{
      templateUrl:'app/main/inspection/statistics/statistics-taskpage.html',
      controller:statisticsTaskpageController,
      controllerAs:'vm'
    });

  /**@ngInject*/
  function statisticsTaskpageController(utils,$scope){
    var vm = this;
    vm.showPopup=false;
    vm.notclose=30;
    vm.alreadyclosed=20;
    vm.complete=10;
    vm.labels=[];
    vm.series=[];
    vm.count=[
      {title:'未开始',value:20,percentage:'50%',color:'red'},
      {title:'已开始',value:20,percentage:'33%',color:'red'},
      {title:'已完成',value:10,percentage:'17%',color:'red'}
    ];

    vm.count.forEach(
     function (data) {
       vm.labels.push(data.title  +data.percentage);
       vm.series.push(data.value);
     }
    )
    vm.pieChart = {
      data             : {
        labels: vm.labels,
        series:vm.series
      },
      options          : {
        labelInterpolationFnc: function (value)
        {
          return value[0];
        }
      },
      responsiveOptions: [
        ['screen and (min-width: 240px)', {
          chartPadding         : 0,
          labelOffset          : 0,
          labelDirection       : 'explode',
          labelInterpolationFnc: function (value)
          {
            return value;
          }
        }],
        ['screen and (min-width: 100px)', {
          labelOffset : 40,
          chartPadding: 30
        }]
      ]

    };

    vm.data=[
      {title:'深圳留仙洞一期B#1201餐厅',state:'未认领',type:'notclose'},
      {title:'深圳留仙洞二期B#1201餐厅',state:'未认领',type:'notclose'},
      {title:'深圳留仙洞三期B#1201餐厅',state:'黄明',type:'alreadyclosed'},
      {title:'深圳留仙洞四期B#1201餐厅',state:'严小康',type:'alreadyclosed'},
      {title:'深圳留仙洞五期B#1201餐厅',state:'严小康',type:'complete'},
      {title:'深圳留仙洞六期B#1201餐厅',state:'黄明',type:'complete'},
      {title:'深圳留仙洞一期B#1201餐厅',state:'未认领',type:'notclose'},
      {title:'深圳留仙洞二期B#1201餐厅',state:'未认领',type:'notclose'},
      {title:'深圳留仙洞三期B#1201餐厅',state:'黄明',type:'alreadyclosed'},
      {title:'深圳留仙洞四期B#1201餐厅',state:'严小康',type:'alreadyclosed'},
      {title:'深圳留仙洞五期B#1201餐厅',state:'严小康',type:'complete'},
      {title:'深圳留仙洞六期B#1201餐厅',state:'黄明',type:'complete'},
      {title:'深圳留仙洞一期B#1201餐厅',state:'未认领',type:'notclose'},
      {title:'深圳留仙洞二期B#1201餐厅',state:'未认领',type:'notclose'},
      {title:'深圳留仙洞三期B#1201餐厅',state:'黄明',type:'alreadyclosed'},
      {title:'深圳留仙洞四期B#1201餐厅',state:'严小康',type:'alreadyclosed'},
      {title:'深圳留仙洞五期B#1201餐厅',state:'严小康',type:'complete'},
      {title:'深圳留仙洞六期B#1201餐厅',state:'黄明',type:'complete'},
      {title:'深圳留仙洞一期B#1201餐厅',state:'未认领',type:'notclose'},
      {title:'深圳留仙洞二期B#1201餐厅',state:'未认领',type:'notclose'},
      {title:'深圳留仙洞三期B#1201餐厅',state:'黄明',type:'alreadyclosed'},
      {title:'深圳留仙洞四期B#1201餐厅',state:'严小康',type:'alreadyclosed'},
      {title:'深圳留仙洞五期B#1201餐厅',state:'严小康',type:'complete'},
      {title:'深圳留仙洞六期B#1201餐厅',state:'黄明',type:'complete'},
      {title:'深圳留仙洞一期B#1201餐厅',state:'未认领',type:'notclose'},
      {title:'深圳留仙洞二期B#1201餐厅',state:'未认领',type:'notclose'},
      {title:'深圳留仙洞三期B#1201餐厅',state:'黄明',type:'alreadyclosed'},
      {title:'深圳留仙洞四期B#1201餐厅',state:'严小康',type:'alreadyclosed'},
      {title:'深圳留仙洞五期B#1201餐厅',state:'严小康',type:'complete'},
      {title:'深圳留仙洞六期B#1201餐厅',state:'黄明',type:'complete'},
      {title:'深圳留仙洞一期B#1201餐厅',state:'未认领',type:'notclose'},
      {title:'深圳留仙洞二期B#1201餐厅',state:'未认领',type:'notclose'},
      {title:'深圳留仙洞三期B#1201餐厅',state:'黄明',type:'alreadyclosed'},
      {title:'深圳留仙洞四期B#1201餐厅',state:'严小康',type:'alreadyclosed'},
      {title:'深圳留仙洞五期B#1201餐厅',state:'严小康',type:'complete'},
      {title:'深圳留仙洞六期B#1201餐厅',state:'黄明',type:'complete'},
      {title:'深圳留仙洞一期B#1201餐厅',state:'未认领',type:'notclose'},
      {title:'深圳留仙洞二期B#1201餐厅',state:'未认领',type:'notclose'},
      {title:'深圳留仙洞三期B#1201餐厅',state:'黄明',type:'alreadyclosed'},
      {title:'深圳留仙洞四期B#1201餐厅',state:'严小康',type:'alreadyclosed'},
      {title:'深圳留仙洞五期B#1201餐厅',state:'严小康',type:'complete'},
      {title:'深圳留仙洞六期B#1201餐厅',state:'黄明',type:'complete'},
      {title:'深圳留仙洞一期B#1201餐厅',state:'未认领',type:'notclose'},
      {title:'深圳留仙洞二期B#1201餐厅',state:'未认领',type:'notclose'},
      {title:'深圳留仙洞三期B#1201餐厅',state:'黄明',type:'alreadyclosed'},
      {title:'深圳留仙洞四期B#1201餐厅',state:'严小康',type:'alreadyclosed'},
      {title:'深圳留仙洞五期B#1201餐厅',state:'严小康',type:'complete'},
      {title:'深圳留仙洞六期B#1201餐厅',state:'黄明',type:'complete'},
      {title:'深圳留仙洞一期B#1201餐厅',state:'未认领',type:'notclose'},
      {title:'深圳留仙洞二期B#1201餐厅',state:'未认领',type:'notclose'},
      {title:'深圳留仙洞三期B#1201餐厅',state:'黄明',type:'alreadyclosed'},
      {title:'深圳留仙洞四期B#1201餐厅',state:'严小康',type:'alreadyclosed'},
      {title:'深圳留仙洞五期B#1201餐厅',state:'严小康',type:'complete'},
      {title:'深圳留仙洞六期B#1201餐厅',state:'黄明',type:'complete'},
      {title:'深圳留仙洞一期B#1201餐厅',state:'未认领',type:'notclose'},
      {title:'深圳留仙洞二期B#1201餐厅',state:'未认领',type:'notclose'},
      {title:'深圳留仙洞三期B#1201餐厅',state:'黄明',type:'alreadyclosed'},
      {title:'深圳留仙洞四期B#1201餐厅',state:'严小康',type:'alreadyclosed'},
      {title:'深圳留仙洞五期B#1201餐厅',state:'严小康',type:'complete'},
      {title:'深圳留仙洞六期B#1201餐厅',state:'黄明',type:'complete'},
      {title:'深圳留仙洞一期B#1201餐厅',state:'未认领',type:'notclose'},
      {title:'深圳留仙洞二期B#1201餐厅',state:'未认领',type:'notclose'},
      {title:'深圳留仙洞三期B#1201餐厅',state:'黄明',type:'alreadyclosed'},
      {title:'深圳留仙洞四期B#1201餐厅',state:'严小康',type:'alreadyclosed'},
      {title:'深圳留仙洞五期B#1201餐厅',state:'严小康',type:'complete'},
      {title:'深圳留仙洞六期B#1201餐厅',state:'黄明',type:'complete'},{title:'深圳留仙洞一期B#1201餐厅',state:'未认领',type:'notclose'},
      {title:'深圳留仙洞二期B#1201餐厅',state:'未认领',type:'notclose'},
      {title:'深圳留仙洞三期B#1201餐厅',state:'黄明',type:'alreadyclosed'},
      {title:'深圳留仙洞四期B#1201餐厅',state:'严小康',type:'alreadyclosed'},
      {title:'深圳留仙洞五期B#1201餐厅',state:'严小康',type:'complete'},
      {title:'深圳留仙洞六期B#1201餐厅',state:'黄明',type:'complete'},
      {title:'深圳留仙洞一期B#1201餐厅',state:'未认领',type:'notclose'},
      {title:'深圳留仙洞二期B#1201餐厅',state:'未认领',type:'notclose'},
      {title:'深圳留仙洞三期B#1201餐厅',state:'黄明',type:'alreadyclosed'},
      {title:'深圳留仙洞四期B#1201餐厅',state:'严小康',type:'alreadyclosed'},
      {title:'深圳留仙洞五期B#1201餐厅',state:'严小康',type:'complete'},
      {title:'深圳留仙洞六期B#1201餐厅',state:'黄明',type:'complete'},
      {title:'深圳留仙洞一期B#1201餐厅',state:'未认领',type:'notclose'},
      {title:'深圳留仙洞二期B#1201餐厅',state:'未认领',type:'notclose'},
      {title:'深圳留仙洞三期B#1201餐厅',state:'黄明',type:'alreadyclosed'},
      {title:'深圳留仙洞四期B#1201餐厅',state:'严小康',type:'alreadyclosed'},
      {title:'深圳留仙洞五期B#1201餐厅',state:'严小康',type:'complete'},
      {title:'深圳留仙洞六期B#1201餐厅',state:'黄明',type:'complete'},
      {title:'深圳留仙洞一期B#1201餐厅',state:'未认领',type:'notclose'},
      {title:'深圳留仙洞二期B#1201餐厅',state:'未认领',type:'notclose'},
      {title:'深圳留仙洞三期B#1201餐厅',state:'黄明',type:'alreadyclosed'},
      {title:'深圳留仙洞四期B#1201餐厅',state:'严小康',type:'alreadyclosed'},
      {title:'深圳留仙洞五期B#1201餐厅',state:'严小康',type:'complete'},
      {title:'深圳留仙洞六期B#1201餐厅',state:'黄明',type:'complete'},
      {title:'深圳留仙洞一期B#1201餐厅',state:'未认领',type:'notclose'},
      {title:'深圳留仙洞二期B#1201餐厅',state:'未认领',type:'notclose'},
      {title:'深圳留仙洞三期B#1201餐厅',state:'黄明',type:'alreadyclosed'},
      {title:'深圳留仙洞四期B#1201餐厅',state:'严小康',type:'alreadyclosed'},
      {title:'深圳留仙洞五期B#1201餐厅',state:'严小康',type:'complete'},
      {title:'深圳留仙洞六期B#1201餐厅',state:'黄明',type:'complete'},
      {title:'深圳留仙洞一期B#1201餐厅',state:'未认领',type:'notclose'},
      {title:'深圳留仙洞二期B#1201餐厅',state:'未认领',type:'notclose'},
      {title:'深圳留仙洞三期B#1201餐厅',state:'黄明',type:'alreadyclosed'},
      {title:'深圳留仙洞四期B#1201餐厅',state:'严小康',type:'alreadyclosed'},
      {title:'深圳留仙洞五期B#1201餐厅',state:'严小康',type:'complete'},
      {title:'深圳留仙洞六期B#1201餐厅',state:'黄明',type:'complete'}


    ];

    vm.tab=(function (type) {
      vm.data.type=type;
    })
    utils.onCmd($scope,['statistics'],function(cmd,e){
      vm.showPopup=true;
    })
    vm.tab('notclose');
  }

})();
