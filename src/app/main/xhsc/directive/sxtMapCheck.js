/**
 * Created by jiuyuong on 2016/6/22.
 */
(function () {
  angular
    .module('app.xhsc')
    .directive('sxtMapCheck',sxtMapCheck);
  /** @ngInject */
  function sxtMapCheck() {
    return {
      link:link
    };

    function link(scope,element,attr,ctrl) {
      var install =function () {
        var map = new L.SXT.Project(element[0]),
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
/*          map.loadSvgXml(fd.DrawingContent, {
            filterLine: function (line) {
              line.attrs.stroke = 'black';
              line.options = line.options||{};
              //line.options.color = 'black';

              line.attrs['stroke-width'] = line.attrs['stroke-width']*6;
            },
            filterText: function (text) {
              //return false;
            }
          });
          map.center();
          scope.tooltip = '';*/
        },0);
        
      }
      $timeout(function () {
        scope.$watchCollection('measureIndexes', function () {
          install();
        });
        scope.$watch('regionId', function () {
          install();
        });
      }, 500);
    }
  }
})();
