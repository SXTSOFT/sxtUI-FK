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
        RegionName:$stateParams.RegionName,
        AssessmentTypeID:$stateParams.AssessmentTypeID
    }
    //vm.AssessmentTypeID = '7d179e8804a54819aad34b7a9398880d'
    vm.RegionName = $stateParams.RegionName;
    db('xcpk').get('xcpk').then(function (list) {

      var item = list.rows.find(function (it) {
        return it.AssessmentID == params.AssessmentID;
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
            console.log(k)
            k.level = getEvels(k,1);
          }
        }
      })

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
        console.log('levels',levels)
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
    vm.fit = function(item){
      item.done =true;
      item.TotalScore = item.Weight;
      item.delValue = item.Weight - item.TotalScore;
    }
    $rootScope.$on('delete',deleteFn);
    vm.quesDetail = function(question,q,item){
      $mdDialog.show({
        controller:function($scope){
          $scope.question= q;
          console.log(question)
          $scope.delete = function(d){
            var idx = question.indexOf(d)

            question.splice(idx,1);
            stzlServices.setaddScore(item)
            //if($scope.question.length <=0){
              $mdDialog.hide()
           // }
          }
          $scope.addPhoto = function(q){

          }
        },
        templateUrl:'app/main/xhsc/ys/evaluateQuesDetail.html',
        parent: angular.element(document.body),
        clickOutsideToClose:true,
        focusOnOpen:false
      })
    }
    vm.check = function(item,ev){
      $mdDialog.show({
        controller: ['$scope','$mdDialog',function ($scope, $mdDialog) {
          $scope.Problems =item.Problems;
          $scope.answer = function(answer,ev) {
            var id=sxt.uuid();
            var question = angular.extend({
              _id:id,
              DeducScoretItemID: id,
              AssessmentResultID: item.AssessmentResultID,
              data_Type: "stzl_question",
              AssessmentCheckItemID: item.AssessmentCheckItemID,
              DeductionScore: this.DeductValue,
              images:[]
            }, answer);
            if(!item.regions){
              item.regions = [];
            }
            var rn = item.regions.find(function (r) {
              return r.RegionId == params.RegionId;
            })
            if(!item.question)
              item.question=[];

            item.question.push(question);
            xhUtils.photo().then(function ($base64Url) {
              question.images.push({
                ImageID:sxt.uuid(),
                RelationID:question._id,
                ImageUrl:"",
                ImageByte:$base64Url
              });
              _db.addOrUpdate(vm.Assessment).then(function () {
              }, function () {
                utils.alert("数据保存失败!");
              });
            },function(r){
              //question.images.push({
              //  ImageID:sxt.uuid(),
              //  RelationID:question._id,
              //  ImageUrl:"app/main/xhsc/images/text.png",
              //  ImageByte:""
              //});
              _db.addOrUpdate(vm.Assessment).then(function (r) {
              }, function (r) {
                utils.alert("数据保存失败!");
              });
            });
            // console.log(stzlServices)
            stzlServices.setLastScore(item);
            item.isCheck = true;
            var _db = db('stzl_' + params.AssessmentID);
            _db.addOrUpdate(vm.Assessment).then(function () {

            }, function (r) {
              utils.alert("数据保存失败!");
            })
          };
        }],
        templateUrl:'app/main/xhsc/ys/evaluateQues.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        focusOnOpen:false
        })
    }
  }
})();
