/**
 * Created by emma on 2016/4/29.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .controller('evaluatelistPcController',evaluatelistPcController);

  /** @ngInject*/
  function evaluatelistPcController($mdDialog,$scope,$stateParams,sxt,xhUtils,pack,remote){
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

    var up = pack.sc.up(params.AssessmentID),
      upstzl_item = up.stzl_item.db,
      upstzl_question = up.stzl_question.db,
      upstzl_images = up.stzl_images.db;

    function onQueryBase(item,result) {
      vm.items = {
        AssessmentClassifys:[]
      };
      vm.caches = {
        AssessmentClassifys:[]
      }
      item.AssessmentTypes.forEach(function (t) {
        t.AssessmentClassifys.forEach(function (cls) {
          vm.items.AssessmentClassifys.push({
            AssessmentClassificationName:cls.AssessmentClassificationName
          });
          vm.caches.AssessmentClassifys.push(cls);
        });
      });


      $scope.$watch('vm.selectedIndex',function () {
        if(typeof vm.selectedIndex!= 'undefined'){
          var k = vm.items.AssessmentClassifys[vm.selectedIndex];
          if(k.AssessmentClassifys==null){
            k.AssessmentClassifys = vm.caches.AssessmentClassifys[vm.selectedIndex].AssessmentClassifys;
            //
            upstzl_item.findAll(function (r) {
              return r.RegionID == params.RegionID;
            }).then(function (items) {
              upstzl_question.findAll(function (r) {
                return !!items.rows.find(function (q) {
                  return q.AssessmentResultID==r.AssessmentResultID;
                })
              }).then(function (questions) {
                fillRegion(k,items,questions);
              });
            })

            k.level = getEvels(k,1);
          }
        }
      })

    }

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
                _id:q.AssessmentResultID,
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
        levels.forEach(function (l) {
            if(max<l)
              max = l;
        });
        return max;
      }
      return level+1;
    }

    vm.quesDetail = function(item){
      upstzl_question.findAll(function (q) {
        return q.AssessmentResultID==item.AssessmentResultID
          && q.ProblemID==item.ProblemID;
      }).then(function (r) {
        var images = [];
        upstzl_images.findAll(function (img) {
          return !!r.rows.find(function (r) {
            return r.DeducScoretItemID==img.RelationID;
          })
        }).then(function (imgs) {
          imgs.rows.forEach(function (img) {
            images.push({
              alt:'说明',
              url:img.ImageByte
            });
          });
          xhUtils.playPhoto(images);
        })
      })
    }
  }
})();
