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
            item.TotalScore=0;
          }else {
            var  score=item.Weight;
            item.question.forEach(function(o){
              if (angular.isNumber(o.DeductValue)){
                score= score-o.DeductValue;
                if (score<0){
                  score=0;
                }
              }
            });
            item.TotalScore=score;
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
      _db.get(params.AssessmentID).then(function(r){
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


    function _convertItem(o){
       return {
         _id:o._id,
         AssessmentResultID:o._id,
         RegionID: o.regionID,
         AssessmentID: o.AssessmentID,
         AssessmentCheckItemID: o.AssessmentCheckItemID,
         TotalScore: o.TotalScore,
       }
    }

    function _convertQuestion(o){
      return{
        _id:o._id,
        DeducScoretItemID: o.DeducScoretItemID,
        AssessmentResultID: o.AssessmentResultID,
        ProblemID: o.ProblemID,
        DeductionScore: o.DeductValue
      }
    }

    function  preUpLoad(params){
      var q= $q.defer();
      var _db= db('stzl_'+params.AssessmentID);
      _db.get(params.AssessmentID).then(function(assment){
        var  items=[],images=[],questions=[];
        var  r_=getAllAssessItem(assment);
        var tmp_question,tmp_img;
        r_.forEach(function(r){
          items.push(_convertItem(r));
          tmp_question= r.question;
          if (angular.isArray(tmp_question)){
            tmp_question.forEach(function(t){
              questions.push(_convertQuestion(t));
              tmp_img= t.images;
              if (angular.isArray(tmp_img)){
                tmp_img.forEach(function(s){
                  images.push(s);
                })
              }
            })
          }
        });
        var _db_item=db('Pack'+params.AssessmentID+  'stzl_item');
        _db_item.bulkAddOrUpdate(items).then(function(r){
           var _db_question=db('Pack'+params.AssessmentID+ 'stzl_question');
          _db_question.bulkAddOrUpdate(questions).then(function(t){
            var _db_image=db('Pack'+params.AssessmentID+ 'stzl_images');
            _db_image.bulkAddOrUpdate(images).then(function(m){
               q.resolve(true);
            })
          })
        })

      }).catch(function(r){
          q.resolve(false);
      })
      return q.promise;
    }

    return  {
      resultWrap:resultWrap ,
      setLastScore:setLastScore,
      getAllAssessItem:getAllAssessItem,
      getRegionAssessItem:getRegionAssessItem,
      groupAssessItem:groupAssessItem,
      getAssessment:getAssessment,
      preUpLoad:preUpLoad
    }
  }
})();
