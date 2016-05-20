/**
 * Created by emma on 2016/4/29.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('evaluatelistController',evaluatelistController);

  /** @ngInject*/
  function evaluatelistController($mdDialog,$rootScope,$scope,utils,$stateParams,db,sxt,stzlServices,xhUtils){
    var vm = this;
    var params={
        AssessmentID:$stateParams.AssessmentID,
        RegionID:$stateParams.RegionID,
        RegionName:$stateParams.RegionName
    }
    stzlServices.getAssessment(params,null,function(item){
      if (item){
        item._id=params.AssessmentID;
        item.data_Type="stzl_assessment";
        item.AssessmentClassifyRegions={
          RegionID:params.RegionID,
          RegionName:params.RegionName
        }
        delete item._rev;
        stzlServices.resultWrap(item,function(o){
          o._id = sxt.uuid();
          o.AssessmentResultID= o.id;
          o.regionID=params.RegionID; //区域Id
          o.TotalScore=o.Weight;
          o.data_Type="stzl_item"
          o.isCheck=false;
          o.AssessmentID=params.AssessmentID; //评估项id
          o.question=[]; //扣分记录
          o.image=[];  //图片记录
        });
      }
    }).then(function(item){
      if(item.AssessmentClassifys.length>20)
          item.AssessmentClassifys.length =20;//TODO:
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

    //vm.images = [
    //  {url:'assets/images/etc/plug.png'},
    //  {url:'assets/images/etc/fallout.jpg'},
    //  {url:'assets/images/etc/fallout.jpg'}
    //];
    var deleteFn = function(d,data){
      //vm.images.splice(data,1);
      $scope.$apply();
     // console.log('a',vm.images)
    }
    $rootScope.$on('delete',deleteFn);
    vm.quesDetail = function(question){
      $mdDialog.show({
        controller:function($scope){
          $scope.question= question;
        },
        templateUrl:'app/main/xhsc/ys/evaluateQuesDetail.html',
        parent: angular.element(document.body),
        clickOutsideToClose:true,
        focusOnOpen:false
      })
    }
    vm.check = function(item,ev){
      $mdDialog.show({
        controller: DialogController,
        templateUrl:'app/main/xhsc/ys/evaluateQues.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        focusOnOpen:false
        })

      function DialogController($scope, $mdDialog) {
        $scope.Problems =item.Problems;
        $scope.answer = function(answer,ev) {
          var question = angular.extend({
            _id: sxt.uuid(),
            DeducScoretItemID: this._id,
            AssessmentResultID: item.AssessmentResultID,
            data_Type: "stzl_question",
            AssessmentCheckItemID: item.AssessmentCheckItemID,
            DeductionScore: this.DeductValue
          }, answer)
          item.question.push(question);
          stzlServices.setLastScore(item);
          item.isCheck = true;
          var _db = db('stzl_' + params.AssessmentID);
          _db.addOrUpdate(vm.Assessment).then(function () {
            xhUtils.photo().then(function ($base64Url) {
              console.log($base64Url);
            });
          }, function () {
            utils.alert("数据保存失败!");
          })
        };
      }
    }
  }
})();
