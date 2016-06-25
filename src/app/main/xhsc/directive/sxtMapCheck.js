/**
 * Created by jiuyuong on 2016/6/22.
 */
(function () {
  angular
    .module('app.xhsc')
    .directive('sxtMapCheck',sxtMapCheck);
  /** @ngInject */
  function sxtMapCheck($timeout,remote,mapPopupSerivce) {
    return {
      scope:{
        item:'=sxtMapCheck',
        projectId:'=',
        procedure:'=',
        regionId:'='
      },
      link:link
    };

    function link(scope,element,attr,ctrl) {
      var map,fg,stamp;
      var install =function () {
        if (!map) {
          map = new L.SXT.Project(element[0], {
            map: {
              zoomControl: false
            }
          });
          map._map.removeControl(map._map.zoomControl);
          fg = new L.SvFeatureGroup({
            onLoad: function () {

            },
            onUpdate: function (layer, isNew, group) {
              layer.setValue({
                seq:scope.item.ProblemSortName
              });
            },
            onPopupClose: function (e) {

            },
            onUpdateData: function (context, updates, editScope) {

            },
            onDelete: function (layer) {

            },
            onPopup: function (e) {
              if(e.layer instanceof L.Stamp)
                var edit = mapPopupSerivce.get('mapCheckMapPopup');
              if(edit) {
                if(e.layer instanceof L.Stamp) {
                  $timeout(function () {
                    var center = fg._map.getCenter();
                    fg._map.setView([center.lat,e.layer._latlng.lng]);
                  },300);
                };
                edit.scope.context = e;
                edit.scope.data = {

                };
                edit.scope.readonly = scope.readonly;
                edit.scope.apply && edit.scope.apply();
                return edit.el[0];
              }
            }
          }).addTo(map._map),
          stamp = new L.Draw.Stamp(map._map);
          map._map.on('draw:created',function (e) {
            if(this._map){
              this.addLayer(e.layer);
            }
          },fg);
          $timeout(function () {
            remote.Project.getDrawingRelations(scope.projectId).then(function (result) {
              var imgId = result.data.find(function (item) {
                return item.AcceptanceItemID == scope.procedure && item.FloorID == scope.regionId;
              });
              if (imgId) {
                remote.Project.getDrawing(imgId.DrawingID).then(function (result) {
                  map.loadSvgXml(result.data.DrawingContent, {
                    filterLine: function (line) {
                      line.attrs.stroke = 'black';
                      line.options = line.options || {};
                      line.attrs['stroke-width'] = line.attrs['stroke-width'] * 6;
                    },
                    filterText: function (text) {
                    }
                  });
                  map.center();
                  map._map.setZoom(1);
                })
              }
            });
          }, 0);
        }
      };
      $timeout(function () {
        scope.$watch('regionId', function () {
          if(scope.regionId && scope.procedure)
            install();
        });
        scope.$watch('item',function () {
          if(stamp) {
            if (scope.item) {
              stamp.enable();
            }
            else {
              stamp.disable();
            }
          }
        })
      }, 500);
    }
  }
})();
