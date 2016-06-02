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
    vm.RegionName = $stateParams.RegionName;
    var params={
      AssessmentID:$stateParams.AssessmentID,
      RegionID:$stateParams.RegionID,
      RegionName:$stateParams.RegionName,
      AssessmentTypeID:$stateParams.AssessmentTypeID
    };
    remote.Assessment.query().then(function (m) {
      remote.Assessment.queryResult(params.AssessmentID).then(function (r) {
        var ass = m.data.find(function (item) {
          return item.AssessmentID == params.AssessmentID
        });
        if(ass){
          onQueryBase(ass,r.data);
        }
      })

    });

    vm.summaryReport={
        projectName:'2016年一季度银河谷',
        Sections:[{
          SectionID:"1",
          SectionName:"2016年一季度银河谷一标"
        },{
          SectionID:"2",
          SectionName:"2016年一季度银河谷二标"
        },{
          SectionID:"3",
          SectionName:"2016年一季度银河谷三标"
        }],
        unit:[{ //单位
            project:[{ //项目得分
              SectionID:"1",
              score:"50"
            }, {
              SectionID:"2",
              score:"50"
            }, {
              SectionID:"3",
              score:"50"
            }]},{
            Supervision:[{ //监理得分
              SectionID:"1",
              score:"50"
            }, {
              SectionID:"2",
              score:"50"
            },{
              SectionID:"3",
              score:"50%"
            }]},{
            manager:[{ //总包得分
               SectionID:"1",
               score:"50"
             },{
               SectionID:"2",
               score:"50"
            },{
               SectionID:"3",
               score:"50"
           }]}],
           category:[{ //类别，需要给出大的类别
             root:"实测实量",
             detail:[{
                 ID:"1",
                 name:"总包",
                 parentId:"",
                 Sections:[{
                   SectionID:1,
                   score:"50%"
                 },{
                   SectionID:2,
                   score:"50%"
                 },{
                   SectionID:3,
                   score:"50%"
                 }]
               },{
               ID:"",
               name:"1.1.1混凝土结构工",
               Sections:[{
                 SectionID:1,
                 score:"50%"
               },{
                 SectionID:2,
                 score:"50%"
               },{
                 SectionID:3,
                 score:"50%"
               }]
             },{
               ID:"",
               name:"1）砼结构垂直度",
               Sections:[{
                 SectionID:1,
                 score:"50%"
               },{
                 SectionID:2,
                 score:"50%"
               },{
                 SectionID:3,
                 score:"50%"
               }]
             },{
               ID:"",
               name:"3）截面尺寸",
               Sections:[{
                 SectionID:1,
                 score:"50%"
               },{
                 SectionID:2,
                 score:"50%"
               },{
                 SectionID:3,
                 score:"50%"
               }]
             }]},{
             root:"观感质量",
             detail:[{
               ID:"1",
               name:"2.1土建",
               parentId:"",
               Sections:[{
                 SectionID:1,
                 score:"50"
               },{
                 SectionID:2,
                 score:"50"
               },{
                 SectionID:3,
                 score:"50"
               }]
             },{
               ID:"",
               name:"1）钢筋工程",
               Sections:[{
                 SectionID:1,
                 score:"50%"
               },{
                 SectionID:2,
                 score:"50%"
               },{
                 SectionID:3,
                 score:"50%"
               }]
             },{
               ID:"",
               name:"2）混凝土工程",
               Sections:[{
                 SectionID:1,
                 score:"50%"
               },{
                 SectionID:2,
                 score:"50%"
               },{
                 SectionID:3,
                 score:"50%"
               }]
             },{
               ID:"",
               name:"3）砌筑工程",
               Sections:[{
                 SectionID:1,
                 score:"50"
               },{
                 SectionID:2,
                 score:"50"
               },{
                 SectionID:3,
                 score:"50"
               }]
             }]}]
    }
    console.log( vm.summaryReport);
    remote.Assessment.queryResutTotal(params.AssessmentID).then(function (r) {
      vm.totals = r.data;
    });


    function onQueryBase(item,result) {
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
            var x=result.find(function(t){ return t.AssessmentCheckItemID== o.AssessmentItems[i].AssessmentCheckItemID})
            if (x){
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
      fillRegion(vm.caches,result);
      $scope.$watch('vm.selectedIndex',function () {
        if(vm.selectedIndex){
          var k = vm.items.AssessmentClassifys[vm.selectedIndex-1];
          if(k.AssessmentClassifys==null){
            var assessmentClassifys= vm.caches.AssessmentClassifys[vm.selectedIndex-1].AssessmentClassifys;
            assessmentClassifys.forEach(function(t){
               setshow(t);
            });
            k.AssessmentClassifys =assessmentClassifys;
            k.level = getEvels(k,1);
          }
        }
      })
    }

    function fillRegion(k,result) {
      if(k.AssessmentItems){
        k.AssessmentItems.forEach(function (item) {
          var resultItem = result.find(function (r) {
            return r.AssessmentCheckItemID == item.AssessmentCheckItemID;
          });
          if(resultItem){
            item.TotalScore = resultItem.TotalScore;
            item.ModifyScore = resultItem.ModifyScore;

            if(!item.ModifyScore && item.ModifyScore!==0)
              item.ModifyScore = item.TotalScore;

            var len=item.Problems.length;
            item.DelScore =  (item.ModifyScore===0 ||  item.ModifyScore)?item.Weight-item.ModifyScore:'';
            item.regions = resultItem.AssessmentRegionItemResults;
          }
        });
      }
      if(k.AssessmentClassifys){
        k.AssessmentClassifys.forEach(function (c) {
          fillRegion(c,result);
        })
      }
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
    vm.changeScore = function (item,$event) {
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
              AssessmentID:params.AssessmentID,
              AssessmentCheckItemID:item.AssessmentCheckItemID,
              ModifyScore:item.Weight -r
            }).then(function () {
              item.DelScore = r;
              item.ModifyScore = item.Weight - item.DelScore;
            }).catch(function () {
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
