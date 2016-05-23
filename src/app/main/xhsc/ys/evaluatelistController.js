/**
 * Created by emma on 2016/4/29.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('evaluatelistController',evaluatelistController);

  /** @ngInject*/
  function evaluatelistController($mdDialog,$rootScope,$scope,utils,$stateParams,db,sxt,stzlServices,xhUtils,pack){
    var vm = this;
    var params={
        AssessmentID:$stateParams.AssessmentID,
        RegionID:$stateParams.RegionID,
        RegionName:$stateParams.RegionName,
        AssessmentTypeID:$stateParams.AssessmentTypeID
    };
    var up = pack.sc.up(params.AssessmentID),
      upstzl_item = up.stzl_item.db,
      upstzl_question = up.stzl_question.db,
      upstzl_images = up.stzl_images.db;


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

            //
            upstzl_item.findAll(function (r) {
              return r.RegionID == params.RegionID;
            }).then(function (items) {
              upstzl_question.findAll(function (r) {
                return !!items.rows.find(function (q) {
                  return q.AssessmentRegionItemResultID==r.AssessmentRegionItemResultID;
                })
              }).then(function (questions) {
                fillRegion(k,items,questions);
              });
            })

            k.level = getEvels(k,1);
          }
        }
      })

    });

    function fillRegion(k,items,question) {
      if(k.AssessmentItems){
        k.AssessmentItems.forEach(function (item) {
          var q = items.rows.find(function (p) {
            return p.RegionID == params.RegionID
             && p.AssessmentCheckItemID==item.AssessmentCheckItemID
          });
          if(!q) {
            item.regions = [
              {
                _id: sxt.uuid(),
                RegionName: params.RegionName,
                RegionID: params.RegionID,
                question: []
              }
            ];
          }
          else{
            var qs = [];
            question.rows.forEach(function (item2) {
              var q = qs.find(function (q) {
                return q.ProblemID==item2.ProblemID
                && q.AssessmentCheckItemID == item2.AssessmentCheckItemID
                && q.RegionID == item2.RegionID;
              });
              if(!q && item2.AssessmentCheckItemID==item.AssessmentCheckItemID){
                qs.push(item2)
              }
              else if(q){
                q.DeductionScore+=item2.DeductionScore;
              }
            });
            item.regions = [
              {
                _id:q.AssessmentRegionItemResultID,
                RegionName: params.RegionName,
                RegionID: params.RegionID,
                question:qs
              }
            ]
          }
        });
      }
      if(k.AssessmentClassifys){
        k.AssessmentClassifys.forEach(function (c) {
          fillRegion(c,items,question);
        })
      }
    }




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
    vm.fit = function(item,it){
      it.done =true;
     //console.log(vm.getDelValue(item));
      //item.delValue = item.Weight - item.Score;
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
    $rootScope.$on('delete',deleteFn);
    vm.quesDetail = function(item,it,items){
      $mdDialog.show({
        controller:function($scope){
          $scope.item = item;
          upstzl_question.findAll(function (q) {
            return q.AssessmentRegionItemResultID==item.AssessmentRegionItemResultID
            && q.ProblemID==item.ProblemID;
          }).then(function (r) {
            $scope.items = r.rows;
            $scope.images = [];
            upstzl_images.findAll(function (img) {
              return !!r.rows.find(function (r) {
                return r.DeducScoretItemID==img.RelationID;
              })
            }).then(function (imgs) {
              imgs.rows.forEach(function (img) {
                var f = r.rows.find(function (r1) {
                  return r1.DeducScoretItemID==img.RelationID;
                });
                f.images = f.images||[];
                f.images.push(img);
                $scope.images.push(img);
              });
            })
          })

          //console.log(question)
          $scope.delete = function(d){
            upstzl_question.findAll(function(it){
              return it.RegionID == d.RegionID
              && it.AssessmentRegionItemResultID== d.AssessmentRegionItemResultID
              && it.ProblemID== d.ProblemID
            }).then(function(r){
              r.rows.forEach(function(item){
                upstzl_question.delete(item);
              });
              var idx = items.indexOf(item);
              items.splice(idx,1);
            })

            //if($scope.question.length <=0){
              $mdDialog.hide()
           // }
          }
          $scope.cancel = function(){
            $mdDialog.hide()
          }
          $scope.addPhoto = function(q){
            xhUtils.photo().then(function (image) {
              if(image){
                upstzl_images.addOrUpdate({
                  _id:sxt.uuid(),
                  ImageID: sxt.uuid(),
                  RelationID: item.DeducScoretItemID,
                  ImageUrl: "",
                  ImageByte: image
                });
              }
            })
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
            if(!item.regions){
              item.regions = [];
            }
            var rn = item.regions.find(function (r) {
              return r.RegionID == params.RegionID;
            });
            upstzl_item.addOrUpdate({
              _id:rn._id,
              AssessmentRegionItemResultID:rn._id,
              AssessmentID:params.AssessmentID,
              Score:0,
              RegionID:rn.RegionID,
              AssessmentCheckItemID:item.AssessmentCheckItemID,
              CreateTime:new Date()
            });

            var question = rn.question.find(function (p) {
              return p.ProblemID==answer.ProblemID;
            });
            var _id=sxt.uuid();
            var dedu = {
              _id:_id,
              DeducScoretItemID:_id,
              AssessmentRegionItemResultID:rn._id,
              RegionID:rn.RegionID,
              AssessmentCheckItemID:item.AssessmentCheckItemID,
              ProblemDescription:answer.ProblemDescription,
              ProblemID:answer.ProblemID,
              DeductionScore:answer.DeductValue,
              CreateTime:new Date(),
              hasPic:false
            };

            if(!question){
              question = angular.extend({},dedu);
              rn.question.push(question);
            }
            else{
              question.DeductionScore+=answer.DeductValue;
            }


            upstzl_question.addOrUpdate(dedu);

            //rn.question.push(question);
            xhUtils.photo().then(function ($base64Url) {
              if($base64Url) {
                var _id=sxt.uuid();
                upstzl_images.addOrUpdate({
                  _id:_id,
                  ImageID: sxt.uuid(),
                  RelationID: dedu.DeducScoretItemID,
                  ImageName:_id+".jpg",
                  ImageUrl: "",
                  ImageByte: $base64Url
                }).then(function () {
                  question.hasPic = true;
                  dedu.hasPic = true;
                  upstzl_question.addOrUpdate(dedu);

                }, function () {
                  utils.alert("数据保存失败!");
                });
              }
            });

            item.isCheck = true;
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
