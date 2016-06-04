/**
 * Created by emma on 2016/4/29.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('evaluatelistPcController',evaluatelistPcController);

  /** @ngInject*/
  function evaluatelistPcController($scope,$stateParams,xhUtils,remote,$mdDialog,utils){
    var vm = this;
    var params={
      year:$stateParams.year,
      projectID:$stateParams.projectID,
      quarter:$stateParams.quarter
    }
    remote.Assessment.queryReport(params.year,params.quarter,params.projectID).then(function(r){
       onQueryBase(r.data);
    });
    remote.Assessment.queryTotalReport(params.year,params.quarter,params.projectID).then(function(t){
        vm.toTalReport= t.data;
        setRoleScore();
    });
    function setRoleScore(){
      vm.prjScores=[];
      vm.jlScores=[];
      vm.zbScores=[];
      vm.toTalReport.Sections.forEach(function(r){
        vm.prjScores.push(findRole(4, r.SectionID));
        vm.prjScores.avg=avg(vm.prjScores);
        vm.jlScores.push(findRole(2, r.SectionID));
        vm.jlScores.avg=avg(vm.jlScores);
        vm.zbScores.push(findRole(1, r.SectionID));
        vm.zbScores.avg=avg(vm.zbScores);
        vm.toTalReport.AssessmentTypes.forEach(function(k){
          SetTypeScore(k, r.SectionID);
        });
      });
    }
    function SetTypeScore(assessmentCategory,sectionID){
        var sections=assessmentCategory.CategorySections;
        if (angular.isArray(sections)){
            var  z=[];
            if (angular.isArray(assessmentCategory.sectionScore)){
              z=assessmentCategory.sectionScore;
            }
            var  t=sections.find(function(t){
               return t.SectionID==sectionID;
            });
            if (!t){
              z.push({
                SectionID:sectionID
              });
            }else {
              z.push(t);
            }
            assessmentCategory.sectionScore=z;
        }
        if (angular.isArray(assessmentCategory.AssessmentCategorys)){
          assessmentCategory.AssessmentCategorys.forEach(function(k){
            SetTypeScore(k,sectionID);
          });
        }
    }

    function avg(arr){
      var  score;
      if (angular.isArray(arr)){
        arr.forEach(function(t){
            if (angular.isNumber(t.Score)){
              score=score?score+t.Score:t.Score;
            }
        });
      }
      if (angular.isNumber(score)){
        return (score/arr.length).toFixed(2);
      }
      return "";
    }
    function findRole(roleType,sectionID){
        var role= vm.toTalReport.AssessmentRoles.find(function(t){
            return t.RoleType==roleType;
        });
        if (role){
            return role.SectionScores.find(function(t){
               return t.SectionID==sectionID;
            })
        }
        return {};
    }

    function onQueryBase(item) {
      //管理行为界面控制开关
      vm.showfitObj=false;
      vm.sections=item.Assessments;
      vm.items = {
        AssessmentClassifys:[]
      };
      vm.caches = {
        AssessmentClassifys:[]
      }

      function  setshow(o){
        o.show=false;
        if(angular.isArray(o.AssessmentItems)&& o.AssessmentItems.length>0){
          for(var i=0;i<o.AssessmentItems.length;i++){
            var x= o.AssessmentItems[i].AssessmentItemResults;
            if (angular.isArray(x)&& x.length>0){
              o.AssessmentItems[i].show=o.show=true;
            }
          }
        }else {
          if (angular.isArray(o.AssessmentClassifys)&& o.AssessmentClassifys.length>0){
              for (var i=0;i<o.AssessmentClassifys.length;i++){
                if (setshow(o.AssessmentClassifys[i])){
                  o.show=true;
                }
              }
          }
        }
        return o.show;
      }

      function  gl_setshow(o){
        o.show=false;
        if(angular.isArray(o.AssessmentItems)&& o.AssessmentItems.length>0){
          for(var i=0;i<o.AssessmentItems.length;i++){
             o.AssessmentItems[i].show=o.show=true;
          }
        }else {
          if (angular.isArray(o.AssessmentClassifys)&& o.AssessmentClassifys.length>0){
            for (var i=0;i<o.AssessmentClassifys.length;i++){
              if (setshow(o.AssessmentClassifys[i])){
                o.show=true;
              }
            }
          }
        }
        return o.show;
      }

      item.AssessmentTypes.forEach(function (t) {
          t.AssessmentClassifys.forEach(function (cls) {
            vm.items.AssessmentClassifys.push({
              AssessmentClassificationName:cls.AssessmentClassificationName,
              show:true
            });
            cls.show=true;
            vm.caches.AssessmentClassifys.push(cls);
          });
      });
      fillRegion(vm.caches,item.Assessments);
      $scope.$watch('vm.selectedIndex',function () {
        if(vm.selectedIndex){
          var k = vm.items.AssessmentClassifys[vm.selectedIndex-1];
          var assessmentClassifys= vm.caches.AssessmentClassifys[vm.selectedIndex-1].AssessmentClassifys;
          if (k.AssessmentClassificationName.indexOf("管理行为")>-1){
            vm.showfitObj=true;
            assessmentClassifys.forEach(function(t){
              gl_setshow(t);
            });
          }else {
            vm.showfitObj=false;
            assessmentClassifys.forEach(function(t){
              setshow(t);
            });
          }
          k.AssessmentClassifys =assessmentClassifys;
          k.level = getEvels(k,1);
        }
      })
    }

    function fillRegion(k,sections) {
      if(k.AssessmentItems){
        k.AssessmentItems.forEach(function (item) {
          item.scoreList=[];
          var resultItem = item.AssessmentItemResults;
          var itemResult,tmp,sectionScore;
          sections.forEach(function(t){
            sectionScore={
              sectionID: t.SectionID,
              ModifyScore:"",
              DelScore:""
            }
            if (angular.isArray(resultItem)&&resultItem.length>0){
              itemResult=resultItem.find(function(k){
                return k.SectionID== t.SectionID;
              });
              if (itemResult){
                tmp=itemResult.ModifyScore;
                if (!tmp&&tmp!==0){
                  tmp=itemResult.TotalScore;
                }
                sectionScore.ModifyScore=tmp;
                tmp=(itemResult.ModifyScore===0 ||  itemResult.ModifyScore)?item.Weight-itemResult.ModifyScore:0;
                sectionScore.DelScore=tmp;
              }
            }else {
              sectionScore.ModifyScore= item.Weight
              sectionScore.DelScore=0;
            }
            item.scoreList.push(sectionScore);
          });
          //Assessments.first

          //item.TotalScore = resultItem.TotalScore;
          //item.ModifyScore = resultItem.ModifyScore;
          //
          //if(!item.ModifyScore && item.ModifyScore!==0)
          //  item.ModifyScore = item.TotalScore;
          //
          //var len=item.Problems.length;
          //item.DelScore =  (item.ModifyScore===0 ||  item.ModifyScore)?item.Weight-item.ModifyScore:'';
          //item.regions = resultItem.AssessmentRegionItemResults;

        });
      }
      if(k.AssessmentClassifys){
        k.AssessmentClassifys.forEach(function (c) {
          fillRegion(c,sections);
        })
      }
    }
    vm.bindSectionScore=function(item,sectionID,field){
        var scoreList=item.scoreList;
        var score;
        if (angular.isArray(scoreList)&&scoreList.length>0){
          score= scoreList.find(function(t){
            return t.sectionID==sectionID;
          });
          if (score){
            return score[field];
          }
        }
        return "";
    }

    vm.getSectionName=function(sectionID){
        var section=vm.sections.find(function(o){
            return o.SectionID==sectionID;
        });
        return section?section.SectionName:"";
    }
    vm.getW = function (level,t) {
      if(level==1){
        return 10.0/t;
      }
      else{
        return 10.0/t /(100 - vm.getW(level-1,t))*100;
      }
    }

    function getEvels(item,level) {
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

    vm.quesDetail = function(item,ev) {
      var images=[];
      item.Images.forEach(function (img) {
        images.push({
          url:sxt.app.api+img.ImageUrl,
          alt:item.ProblemDescription
        });
      })
      if(images.length)
      {
        xhUtils.playPhoto(images);
      }
     else
      {
        $mdDialog.show({
          controller: ['$scope','$mdDialog',function ($scope, $mdDialog) {
            $scope.ProblemDescription=item.ProblemDescription;

            $scope.cancel = function(){
              $mdDialog.hide()
            }
          }],
          templateUrl:'app/main/xhsc/ys/pcQuestion.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          focusOnOpen:false
        })
      }

    }

    vm.deleteScoreItem = function (q) {
      console.log('q',q)
    }
    vm.changeScore = function (item,k,$event) {
      $mdDialog.show($mdDialog.prompt({
        title:'修改分值',
        textContent:'请输入新值，作为最终此项目的扣分值。０分为不扣分',
        placeholder:item.DelScore,
        ok:'确定',
        cancel:'取消',
        targetEvent:$event
      })).then(function (result) {
        if(result){
          var r = parseInt(result);
          if(!isNaN(result)){
            if(item.Weight<result || result<0){
              utils.alert('输入的值应该介于0 与 '+item.Weight + ' 之间');
              return;
            }
            remote.Assessment.modifyScore({
              AssessmentID:k.AssessmentID,
              AssessmentCheckItemID:item.AssessmentCheckItemID,
              ModifyScore:item.Weight -r,
              Description:"abc"

            }).then(function (z) {
              if (z.data.ErrorCode==0){
                var obj= item.scoreList.find(function(v){
                  return v.sectionID== k.SectionID;
                });
                obj.DelScore = r;
              obj.ModifyScore = item.Weight - obj.DelScore;
              }else {
                utils.alert('失败：'+ z.data.ErrorMessage);
              }
            }).catch(function (z) {
              utils.alert('失败：服务器返回错误');
            })
          }
          else{
            utils.alert('应该输入半角数字');
          }
        }
        console.log(result);
      })
    }
  }
})();
