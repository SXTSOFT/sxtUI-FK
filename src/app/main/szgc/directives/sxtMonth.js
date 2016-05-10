/**
 * Created by jiuyuong on 2016/4/6.
 */
(function(){
  'use strict';
  angular
    .module('app.szgc')
    .directive('sxtMonth',sxtMonth)

  /** @ngInject */
  function sxtMonth() {
    return {
      scope: {
        month: '=sxtMonth'
      },
      link: function (scope, element, attr, ctrl) {
        scope.$watch('month', function () {
          if (!scope.month) return;
          element.html();
          var m = moment(scope.month.m,'YYYY-M-D'),
            mt = m.month(), ye = m.year();
          var html = [];
          //head
          element.addClass('calendar-table');
          //html.push('<div class="calendar-table">');
          html.push('<table class="table-condensed" style="width: 100%;border-bottom:2px solid rgb(101, 101, 101);">');
          html.push('<thead><tr ><th></th><th colspan="5" style="cursor:pointer" data-day="' + m.format('YYYY-MM-1') + '" data-type="2" class="month">');
          html.push(m.format('YYYY年MM月'));
          html.push('</th><th></th></tr>');
          html.push('<tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr></thead>');
          html.push('<tbody>');
          for (var i = 0; i < 6; i++) {
            html.push('<tr>');
            for (var j = 0; j < 7; j++) {

              if (m.day() == j && m.month() == mt) {
                html.push('<td data-day="' + ye + '-' + (mt+1) + '-' + m.date() + '" >');
                html.push('<span data-day="' + ye + '-' + (mt+1) + '-' + m.date() + '" >'+m.date()+'</span>');
                m = m.add(1, 'd');
              }
              else {
                html.push('<td>');
                html.push('&nbsp;');
              }
              html.push('</td>');
            }
            html.push('</tr>');
          }
          html.push('</tbody></table>');
          element.html(html.join(''));
        });
        scope.$watchCollection('month.d', function () {
          if (!scope.month.d) return;
          var m = moment(scope.month.m,'YYYY-M-d'),
            mt = m.month()+1, ye = m.year();
          $('[data-day]',element).removeClass('photo');
          scope.month.d.forEach(function (d) {
            $('[data-day="' + ye + '-' + mt + '-' + d.day + '"]', element).addClass('photo');
          });
        });
      }
    };
  }
})();
