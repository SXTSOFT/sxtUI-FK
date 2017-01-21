/**
 * Created by emma on 2016/11/15.
 */
(function(){
  'use strict';

  angular
    .module('app.inspection')
    .directive('sxtWtPop',sxtWtPop);

  /**@ngInject*/
  function sxtWtPop(xhUtils,$mdPanel,$state,api,auth,$q,$mdDialog,utils){
    return {
      scope:{
        show:'=',
        record:"="
      },
      templateUrl:'app/main/inspection/directives/sxt-wt-pop.html',
      link:link
    }

    //记录点类型数据(record)
    // {
    //   "id":0
    //   "room_id": 0,
    //   "issues": 0,
    //   "contact_name": "string"Q
    //   "contact_phone": "string",
    //   "caller_name": "string",
    //   "caller_phone": "string",
    //   "reservation_date_begin": "2017-01-19T15:13:43.445Z",
    //   "reservation_date_end": "2017-01-19T15:13:43.445Z",
    //   "description": "string",
    //   "pictures": "string"
    // }



    function link(scope,element,attr,ctrl){

     function getIssues() {
        function wrap(source) {
          if (angular.isArray(source)){
            return source.filter(function (k) {
              var t=k.children.filter(function (n) {
                return n.children.length>0;
              })
              k.children=t
              return t.length>0;
            })
          }
          return source;
        }
        return $q(function (resolve,reject) {
          api.inspection.estate.issues_tree({
            type:'delivery',
            parent_id:'',
            enabled:true,
            page_size:10000,
            page_number:1
          }).then(function (r) {
            var options =wrap( r.data.data);
             resolve(options);
          });
        })
     }

     function findIssues(issue_id,source) {
        //issue_id
       var _issues=[];
       source.forEach(function (k) {
          k.children.forEach(function (n) {
            if (n.children&&n.children.length){
              n.children.forEach(function (m) {
                _issues.push(m);
              });
            }
          });
       });
       return _issues.find(function (k) {
          return k.issue_id==issue_id
       })
     }

     scope.photos=[];
     scope.issues={};

     if (scope.record&&scope.record.id){
       api.inspection.estate.getImgs(scope.record.id).then(function (r) {
         if (r&&r.data){
           scope.photos.push(r.data);
         }
       }).catch(function () {
       })
     }

     getIssues().then(function (source) {
        scope.source=[source];
        if (scope.record&&scope.record.issues){
          scope.issues=findIssues(scope.record.issues,source);
        }
      });

      // {
      //   recordId:""
      //   content:data.url+"",
      //     author:scope.username,
      //   business:{
      //   app_id:"561ccdcad4c623de9bfd86a1"
      // }
      // }

     scope.remove = function ($event,item) {
       api.inspection.estate.deleteImg(item.recordId).then(function () {
         scope.photos.splice(item,1);
       })

      }

      scope.addPhoto = function(){
        if (scope.record&&scope.record.id){
          xhUtils.photo().then(function(img){
            var imgEntity={
              recordId:scope.record.id,
              business:{
                app_id:"561ccdcad4c623de9bfd86a1"
              },
              author:scope.username
            }
            api.inspection.estate.insertImg(imgEntity).then(function () {
              scope.photos.push({
                url:img
              });
            })
          })
        }
      }

      scope.cancel = function(){
        scope.show = false;
        scope.question=scope.publicquestion;
        scope.issues='';
      }

      scope.submit = function () {
        if(scope.photos.length==0){
          utils.alert('照片不能为空,请先拍照');
          return;
        }
        var question = element.find('.question').text()
        var description = scope.description
        var  issues=scope.issues;
        var  room_id=scope.roomid;
        var usernamm =scope.username;
        scope.$emit('submit',{
          question:question,
          description: description
        })

        scope.data= {
          room_id:room_id,
          issues:issues,
          contact_name: usernamm,
          contact_phone: "",
          caller_name: usernamm,
          caller_phone: "",
          reservation_date_begin: new Date(),
          reservation_date_end: new Date(),
          description: description,
          pictures:''
        }
        var arr=[]
        scope.photos.forEach(function (data) {
          scope.savaData={
            content:data.url+"",
            author:scope.username,
            business:{
              app_id:"561ccdcad4c623de9bfd86a1"
            }
          }
          arr.push(api.inspection.estate.insertImg(scope.savaData));
        })
        $q.all(arr).then(function (r) {
          for(var i=0;i<r.length;i++){
            scope.data.pictures+=r[i].data.data.url+",";
          }
          if(scope.data.pictures!='')
            scope.data.pictures=scope.data.pictures.substring(0,scope.data.pictures.length-1);

          api.inspection.estate.insertrepair_tasks(scope.data).then(function (r) {

          });
      })

        scope.show = false
      }

      //当前选择的问题
      scope.chooseQues = function(){
          var position = $mdPanel.newPanelPosition()
            .relativeTo('md-toolbar')
            .addPanelPosition($mdPanel.xPosition.ALIGN_START, $mdPanel.yPosition.BELOW)
            .bottom(0)
            .right(0)

          $mdPanel.open({
            controller: ['$scope','mdPanelRef','api','$timeout',function ($scope,mdPanelRef,api,$timeout) {
              if (angular.isArray(scope.source)){
                $scope.source=scope.source;
              }else {
                  getIssues().then(function (k) {
                    $scope.source=scope.source=[k];
                  })
              }
              $scope.select = function(item,index){
                var ind=0;
                $scope.source.forEach(function (k) {
                  if(ind>=index){
                    k.forEach(function (n) {
                      n.check=false;
                    });
                  }
                  ind++;
                });
                for (var i=$scope.source.length-1;i>=0;i--){
                  if (i>index){
                    $scope.source.splice(i,1)
                  }
                }
                item.check=true;
                $scope.source[index+1]=item.children;
              }
              $scope.check=function (item) {
                item.check=true;
                scope.issues=item;
                mdPanelRef.close();
                mdPanelRef.destroy();
              }
            }],
            templateUrl:'app/main/inspection/component/inspection-cjwt.html',
            hasBackdrop: false,
            position: position,
            trapFocus: true,
            panelClass: 'is-cjwt',
            zIndex: 5000,
            controllerAs:'vm',
            locals:{
              options:scope.options,
            },
            clickOutsideToClose: true,
            escapeToClose: true,
            focusOnOpen: true,
            attachTo:angular.element('body')
          });
      }
    }
  }
})();
