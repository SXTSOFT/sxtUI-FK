/**
 * Created by emma on 2016/4/29.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('glxwSettingController',glxwSettingController);

  /** @ngInject*/
  function glxwSettingController($mdDialog,$rootScope,$scope,utils,$stateParams,remote){
    var vm = this;
    var params={
      AssessmentID:$stateParams.AssessmentID,
      AssessmentTypeID:$stateParams.AssessmentTypeID
    };
    remote.Assessment.query().then(function (result) {
      var item = result.data.find(function (a) {
        return a.AssessmentID==params.AssessmentID;
      });
      vm.items = {
        AssessmentClassifys:[]
      };
      vm.Assessment = item.AssessmentTypes.find(function (t) {
        return t.AssessmentTypeID== params.AssessmentTypeID;
      });
      vm.Assessment.AssessmentClassifys.forEach(function (cls) {
        vm.items.AssessmentClassifys.push({
          AssessmentClassificationName:cls.AssessmentClassificationName
        });
      });
      $scope.$watch('vm.selectedIndex',function () {
        if(typeof vm.selectedIndex!= 'undefined'){
          var k = vm.items.AssessmentClassifys[vm.selectedIndex];
          if(k.AssessmentClassifys==null){
            k.AssessmentClassifys = vm.Assessment.AssessmentClassifys[vm.selectedIndex].AssessmentClassifys;
          }
        }
      })
    }).catch(function () {
      utils.alert('失败：服务器返回错误');
    });

    vm.getW = function (level,t) {
      if(level==1){
        return 25.0/t;
      }
      else{
        return 25.0/t /(100 - vm.getW(level-1,t))*100;
      }
    }

    function getEvels(item,level) {
      if(item.AssessmentClassifys && item.AssessmentClassifys.length){
        var levels = [],max=0;
        item.AssessmentClassifys.forEach(function (item) {
          levels.push(getEvels(item,level));
        });
        //console.log('levels',levels)
        levels.forEach(function (l) {
          if(max<l)
            max = l;
        });
        return max;
      }
      return level+1;
    }

    vm.getDelValue = function (item) {
      //console.log('a')
      var s=0,time=0;
      if(item.regions){
        item.regions.forEach(function (r) {
          if(r.question){
            r.question.forEach(function (q) {
              s+=(q.DeductionScore||0);
              time++;
            });
          }
        });
        if(s >item.Weight)
          s=item.Weight;
      }
      if(item.MaxDeductNumber &&  time>=item.MaxDeductNumber){
        item.Score = 0;
        return item.Weight;
      }
      else if(s!=0) {
        item.Score = item.Weight - s;
        if (item.Score < 0)
          item.Score = 0;
        return s;
      }
      else if(item.done){
        item.Score = item.Weight;
        return 0;
      }
      item.Score = '';
      return ''
    }
  }
})();
