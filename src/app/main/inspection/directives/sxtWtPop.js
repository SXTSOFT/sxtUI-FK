/**
 * Created by emma on 2016/11/15.
 */
(function () {
  'use strict';

  angular
    .module('app.inspection')
    .directive('sxtWtPop', sxtWtPop);

  /**@ngInject*/
  function sxtWtPop(xhUtils, $mdPanel, $state, api, auth, $q, $mdDialog, utils,sxt,inspectionServe) {
    return {
      scope: {
        show: '=',
        marker: "=",
        userId:"="
      },
      templateUrl: 'app/main/inspection/directives/sxt-wt-pop.html',
      link: link
    }

    function link(scope, element, attr, ctrl) {
      scope.photos=[];

      //获取所有问题
      function getIssues() {
        function wrap(source) {
          if (angular.isArray(source)) {
            return source.filter(function (k) {
              var t = k.children.filter(function (n) {
                return n.children.length > 0;
              })
              k.children = t
              return t.length > 0;
            })
          }
          return source;
        }

        return $q(function (resolve, reject) {
          api.inspection.estate.issues_tree({
            type: 'delivery',
            parent_id: '',
            enabled: true,
            page_size: 10000,
            page_number: 1
          }).then(function (r) {
            var options = wrap(r.data.data);
            scope.issues = options;
            resolve(options);
          });
        })
      }

      //根据问题Id找到指定的问题
      function findIssues(issue_id) {
        function get(source) {
          var _issues = [];

          source.forEach(function (k) {
            k.children.forEach(function (n) {
              if (n.children && n.children.length) {
                n.children.forEach(function (m) {
                  _issues.push(m);
                });
              }
            });
          });
          var res = _issues.find(function (k) {
            return k.issue_id == issue_id
          });
          return res
        }

        return $q(function (resolve, reject) {
          if (scope.issues) {
            var res = get(scope.issues);
            resolve(res);
          } else {
            getIssues().then(function (r) {
              var res = get(r);
              resolve(res);
            }).catch(function () {
              reject();
            })
          }
        })
      }

      scope.$watch("marker", function () {
        if (scope.marker && scope.marker.tag) {
          scope.photos=[];
          scope.current_iss=null;
          var record = scope.marker.tag;
          scope.description=record.description;
          if (record.pictures) {
            var task=[]
            var imgs = record.pictures.split(",");
            imgs.forEach(function (m) {
              task.push(api.inspection.estate.getImg(m));
            })
            $q.all(task).then(function (res) {
              if (angular.isArray(res)){
                res.forEach(function (n) {
                    if (n&&n.data){
                      scope.photos=scope.photos.concat(n.data);
                    }
                })
              }
            });
          }
          if (record.issues) {
            findIssues(record.issues).then(function (r) {
              scope.current_iss = r;
            });
          }
        }
      })

      var markerImgOption= inspectionServe.markerImgOption

      scope.remove = function ($event, item) {
        api.inspection.estate.removeImg(item.id).then(function () {
          var  index=scope.photos.indexOf(item);
          scope.photos.splice(index, 1);
          markerImgOption.remove(item.id,scope.marker);
        })
      }

      scope.addPhoto = function () {
        if (scope.marker&&scope.marker.tag){
          var record = scope.marker.tag;
          xhUtils.photo().then(function (base64) {
            var img={
              id:sxt.uuid(),
              markid:scope.marker.tag.id,
              business: {
                app_id: "561ccdcad4c623de9bfd86a1"
              },
              author: scope.userId,
              content:base64
            }
            api.inspection.estate.postImg(img).then(function () {
              scope.photos.push(img);
              markerImgOption.add(img.id,scope.marker);
            })
          });
        }
      }

      //当前选择的问题
      scope.chooseQues = function () {
        var position = $mdPanel.newPanelPosition()
          .relativeTo('md-toolbar')
          .addPanelPosition($mdPanel.xPosition.ALIGN_START, $mdPanel.yPosition.BELOW)
          .bottom(0)
          .right(0)

        $mdPanel.open({
          controller: ['$scope', 'mdPanelRef', 'api', '$timeout', function ($scope, mdPanelRef, api, $timeout) {
            if (angular.isArray(scope.issues)) {
              $scope.source = [scope.issues];
            } else {
              getIssues().then(function (k) {
                scope.issues = k
                $scope.source = [k];
              })
            }
            $scope.select = function (item, index) {
              var ind = 0;
              $scope.source.forEach(function (k) {
                if (ind >= index) {
                  k.forEach(function (n) {
                    n.check = false;
                  });
                }
                ind++;
              });
              for (var i = $scope.source.length - 1; i >= 0; i--) {
                if (i > index) {
                  $scope.source.splice(i, 1)
                }
              }
              item.check = true;
              $scope.source[index + 1] = item.children;
            }
            $scope.check = function (item) {
              item.check = true;
              scope.current_iss = item;
              if (scope.marker && scope.marker.tag) {
                scope.marker.tag.issues = item.issue_id
                api.inspection.estate.postRepair_tasks_off(scope.marker.tag).then(function () {
                  $("span",scope.marker.el).html(item.abbrname)
                });
              }
              mdPanelRef.close();
              mdPanelRef.destroy();
            }
          }],
          templateUrl: 'app/main/inspection/component/inspection-cjwt.html',
          hasBackdrop: false,
          position: position,
          trapFocus: true,
          panelClass: 'is-cjwt',
          zIndex: 5000,
          controllerAs: 'vm',
          locals: {
            options: scope.options,
          },
          clickOutsideToClose: true,
          escapeToClose: true,
          focusOnOpen: true,
          attachTo: angular.element('body')
        });
      }
    }
  }
})();
