/**
 * Created by shaoshunliu on 2016/12/20.
 */
/**
 * Created by emma on 2016/8/4.
 */
(function () {
  'use strict';

  angular
    .module('app.pcReport_sl')
    .directive('sxtReportView', sxtReportView);

  /**@ngInject*/
  function sxtReportView($timeout, remote, mapPopupSerivce, sxt, utils, $q, $window, xhUtils) {
    return {
      scope: {
        regionId: '=',
        inspectionId: '=',
        ponits: '=',
        type: "=",
        disableInspect: '=',
        disableDrag: '=',
        ct: '=',
        loaded: "="
      },
      link: link
    };

    function link(scope, element, attr, ctrl) {
      scope.ct && (scope.ct.loading = true);
      var map, fg;
      var install = function () {
        if (!map) {
          map = new $window.L.glProject(element[0], {
            map: {
              zoomControl: false
            }
          });
          fg = $window.mapboxgl.Plan({
            disableInspect: true,
            disableDrag: true,
            onChangeMode: function (mode, op, cb) {
              if (mode && !op) {
                scope.item = {
                  ProblemID: null,
                  ProblemSortName: '✔',//'',
                  ProblemDescription: ''
                };
              }
              cb();
            },
            onLoad: function (cb) {
              if (angular.isArray(scope.ponits)) {
                var fs = [];
                scope.ponits.forEach(function (p) {
                  if (p.Geometry) {
                    p.geometry = $window.JSON.parse(p.Geometry);
                  } else {
                    p.geometry = p.geometry;
                  }
                  if (!p.geometry) return;
                  // c.ProblemDescription = c.IndexPointID ? c.ProblemDescription : '合格';
                  p.geometry.properties.seq = p.ProblemSortName;
                  if (p.geometry.geometry.type == 'Stamp')
                    p.geometry.geometry.type = 'Point';
                  function convert(status) {
                    switch (status) {
                      case 8:
                      case 4:
                        return 1;
                      case 16:
                        return 8;
                    }
                    return status;
                  }
                  p.geometry.properties.Status = convert(p.Status);
                  // if (!p.IndexPointID) {
                  //   p.geometry.properties.Status = 2;
                  // } else {
                  //   p.geometry.properties.Status = 1;
                  // }

                  fs.push(p.geometry);
                });
              }
              scope.item = null;
              fg.addData(fs, false);
              cb();
            },
            onUpdate: function (layer, isNew, group, cb) {

            },
            onPopup: function (layer, cb) {
            }
          });
          $timeout(function () {
            var imgId;
            switch (scope.type) {
              case "house":
                remote.safe.getDrawingRelate("house", scope.regionId.substr(0, scope.regionId.length - 5)).then(function (r) {
                  imgId = r.data.Relations.find(function (item) {
                    return item.Type == -3 && item.RegionId == scope.regionId;
                  });
                  if (!imgId) {
                    imgId = r.data.Relations.find(function (item) {
                      return item.Type == 7 && item.RegionId == scope.regionId.substr(0, scope.regionId.length - 5)
                    });
                  }
                  callback(imgId);
                });

                break;
              case "week":
                remote.safe.getDrawingRelate("WeekInspects", scope.regionId).then(function (r) {
                  imgId = r.data.Relations.find(function (item) {
                    return item.Type == 7 && item.RegionId == scope.regionId;
                  });
                  if (!imgId) {
                    imgId = r.data.Relations.find(function (item) {
                      return item.Type == 13 && item.RegionId == scope.regionId;
                    });
                  }
                  callback(imgId);
                });

                break;
              case "cycle":
                remote.safe.getDrawingRelate("cycle", scope.regionId).then(function (r) {
                  imgId = r.data.Relations.find(function (item) {
                    return item.Type == 7 && item.RegionId == scope.regionId;
                  });
                  callback(imgId);
                });
                break
            }


            function callback(imgId) {
              if (imgId) {
                remote.Project.getDrawing(imgId.DrawingID).then(function (result2) {
                  if (!result2.data.DrawingContent) {
                    return;
                  }
                  scope.loaded = true;
                  map.loadSvgXml(result2.data.DrawingContent);
                  map.map.addControl(fg);
                }).catch(function () {
                })
              }
              else {
                scope.loaded = true;
                return;
              }
            }

          }, 300);
        }
      };
      $timeout(function () {
        scope.$watch('regionId', function () {
          if (scope.regionId) {
            if (map) {
              map.remove();
              map = null;
            }
            install();
          }
        });
        scope.$watch('item', function () {
          if (fg) {
            if (scope.item) {
              fg.changeMode('inspect', scope.item);
            }
            else {
              fg.changeMode();
            }
          }
        })
      }, 500);
      scope.$on('destroy', function () {
        if (map) {
          map.remove();
          map = null;
        }
      })
    }
  }
})();
