/**
 * Created by jiuyuong on 2016/6/22.
 */
(function () {
  angular
    .module('app.xhsc')
    .directive('sxtMapCheck',sxtMapCheck);
  /** @ngInject */
  function sxtMapCheck($timeout,remote) {
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
      var install =function () {
        console.log('scope',scope);
        var map = new L.SXT.Project(element[0],{
           map:{
             zoomControl:false
           }
        }),
          fg = new L.SvFeatureGroup({
          onLoad: function () {

          },
          onUpdate: function (layer, isNew, group) {

          },
          onPopupClose: function (e) {

          },
          onUpdateData: function (context, updates, editScope) {

          },
          onDelete: function (layer) {

          },
          onPopup: function (e) {
          }
        }).addTo(map._map);
        $timeout(function () {
          remote.Project.getDrawingRelations(scope.projectId).then(function (result) {
            var imgId = result.data.find(function (item) {
              return item.AcceptanceItemID==scope.procedure && item.FloorID==scope.regionId;
            });
            if(imgId) {
              remote.Project.getDrawing(imgId.DrawingID).then(function (result) {
                map.loadSvgXml(result.data.DrawingContent, {
                  filterLine: function (line) {
                    line.attrs.stroke = 'black';
                    line.options = line.options || {};
                    //line.options.color = 'black';

                    line.attrs['stroke-width'] = line.attrs['stroke-width'] * 6;
                  },
                  filterText: function (text) {
                    //return false;
                  }
                });
                map.center();
              })
            }
          });

        },0);
        map._map.removeControl(map._map.zoomControl);
      }
      $timeout(function () {
        scope.$watch('item',function () {
          //console.log('item',scope.item);
        })
        scope.$watch('regionId', function () {
          if(scope.regionId && scope.procedure)
            install();
        });
      }, 500);
    }
  }
})();
