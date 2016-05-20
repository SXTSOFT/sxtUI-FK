/**
 * Created by emma on 2016/4/29.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('evaluatelistController',evaluatelistController);

  /** @ngInject*/
  function evaluatelistController($mdDialog,$rootScope,$scope,utils,$stateParams,db,sxt,stzlServices){
    var vm = this;
    var params={
        AssessmentID:$stateParams.AssessmentID,
        RegionID:$stateParams.RegionID,
        RegionName:$stateParams.RegionName
    }
    stzlServices.getAssessment(params,null,function(item){
      if (item){
        item._id=params.AssessmentID+"_"+params.RegionID;
        item.data_Type="stzl_assessment";
        item.AssessmentClassifyRegions={
          RegionID:params.RegionID,
          RegionName:params.RegionName
        }
        delete item._rev;
        stzlServices.resultWrap(item,function(o){
          o._id = sxt.uuid();
          o.Assessment_uuid= item._id;
          o.data_Type="stzl_item"
          o.isCheck=false;
          o.lastScore=o.Weight; //最终得分
          o.regionID=params.RegionID; //区域Id
          o.AssessmentID=params.AssessmentID; //评估项id
          o.question=[]; //扣分记录
          o.image=[];  //图片记录
        });
      }
    }).then(function(item){
      vm.Assessment=item;
      vm.levels = getEvels(item,0);
    })
    vm.getWidth = function (level) {
      if(level==1){
        return 25.0/vm.levels;
      }
      else{
        return 25.0/vm.levels /(1 - vm.getWith(level-1));
      }
    }

    function getEvels(item,level) {
      item.level = level+1;
      if(item.AssessmentClassifys && item.AssessmentClassifys.length){
        var levels = [],max=0;
        item.AssessmentClassifys.forEach(function (item) {
          levels.push(getEvels(item,level));
        });
        levels.forEach(function (l) {
            if(max<l)
              max = l;
        });
        return max;
      }
      return level+1;
    }

    vm.images = [
      {url:'assets/images/etc/plug.png'},
      {url:'assets/images/etc/fallout.jpg'},
      {url:'assets/images/etc/fallout.jpg'}
    ];
    var deleteFn = function(d,data){
      //vm.images.splice(data,1);
      $scope.$apply();
     // console.log('a',vm.images)
    }
    $rootScope.$on('delete',deleteFn);
    vm.check = function(item,ev){
      $mdDialog.show({
          controller: DialogController,
          templateUrl:'app/main/xhsc/ys/evaluateQues.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
        })

      function DialogController($scope, $mdDialog) {
        $scope.Problems =item.Problems;
        $scope.answer = function(answer,ev) {
          item.question.push(angular.extend({
            _id : sxt.uuid(),
            data_Type:"stzl_question",
            createTime:new Date().toDateString(),
            AssessmentCheckItem_uuid:item._id,
            AssessmentCheckItemID:item.AssessmentCheckItemID
          },answer));
          stzlServices.setLastScore(item);
          item.isCheck=true;
          var _db= db('stzl_'+params.AssessmentID);
          _db.addOrUpdate(vm.Assessment).then(function(){
            utils.confirm('前往拍照或返回',ev,'拍照','').then(function(){
            },function(r){
            })
          },function(){
            utils.alert("数据保存失败!");
          })
          };
      }
    }
  }
})();
