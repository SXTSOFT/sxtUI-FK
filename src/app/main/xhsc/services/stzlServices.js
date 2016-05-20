/**
 * Created by lss on 2016/5/19.
 */
(function(){
  'use strict';

  angular
    .module('app.xhsc')
    .factory('stzlServices',stzlServices);
  /** @ngInject */
  function stzlServices(db,$q){
    function  resultWrap(assessment,callback){
      function  wrap(target){
          if (target.AssessmentItems&&angular.isArray(target.AssessmentItems)){
            target.AssessmentItems.forEach(function(o){
              callback(o);
            })
          }
          if(target.AssessmentClassifys&&angular.isArray(target.AssessmentClassifys)){
            target.AssessmentClassifys.forEach(function(o){
              wrap(o);
            })
          }
      }
      var assessmentClassifys= assessment.AssessmentClassifys;
      if (assessmentClassifys&&angular.isArray(assessmentClassifys)){
        assessmentClassifys.forEach(function(o){
          wrap(o);
        })
      }
    }

    function setLastScore(item){
      if(angular.isArray(item.question)){
          if (item.question.length>2){
            item.lastScore=0;
          }else {
            var  score=item.Weight;
            item.question.forEach(function(o){
              if (angular.isNumber(o.DeductValue)){
                score= score-o.DeductValue;
              }
            });
            item.lastScore=score;
          }
      }
    }
    function  getAllAssessItem(assessment){
      var  arr=[];
      resultWrap(assessment,function(o){
        arr.push(o);
      })
      return arr;
    }
    function  getRegionAssessItem(assessment,regionID){
        var  arr=[];
        var r=getAllAssessItem(assessment);
        r.forEach(function(e){
           if (e.regionID==regionID&&!arr.find(function(t){return t.regionID== e.regionID})){
             arr.push(e);
           }
        })
       return arr;
    }
    function  groupAssessItem(db){
      var regionIdArr=[];
      var result={};
      var r=getAllAssessItem(assessment);
      r.forEach(function(e){
        if (!regionIdArr.find(function(t){
            return t== e.regionID;
        })){
          regionIdArr.push(e.regionID);
        }
        regionIdArr.forEach(function(o){
          result[o]=[];
          r.forEach(function(e){
            if (o==e.regionID &&!result[o].find(function(t){return t== e.regionID})){
              result[o].push(e);
            }
          });
        });
        return result;
      })
    }

    function getAssessment(params,call1,call2){
     var q= $q.defer()
      var _db= db('stzl_'+params.AssessmentID);
      _db.get(params.AssessmentID+"_"+params.RegionID).then(function(r){
        if (angular.isFunction(call1)){
          call1(r);
        }
        q.resolve(r);
      }).catch(function(){
        var pk = db('xcpk');
        pk.get('xcpk').then(function (pk) {
          var item = pk.rows.find(function (it) {
            return it.AssessmentID == params.AssessmentID;
          });
          if (angular.isFunction(call2)){
            call2(item)
          }
          q.resolve(item);
        });
      })
      return q.promise;
    }

    function upload(){
      this.queue=[];
    }

    upload.prototype.pushTask=function(task){
        var self=this;
        this.queue.push(task);
    }

    upload.prototype.trigger=function(){
        if (queue.length>0&&!queue.find(function(o){ return o.complete })){

        }
    }

    return  {
      resultWrap:resultWrap ,
      setLastScore:setLastScore,
      getAllAssessItem:getAllAssessItem,
      getRegionAssessItem:getRegionAssessItem,
      groupAssessItem:groupAssessItem,
      getAssessment:getAssessment,
      upload:upload
    }
  }
})();
