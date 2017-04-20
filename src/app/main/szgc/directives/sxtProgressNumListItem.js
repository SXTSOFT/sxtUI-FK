/**
 * Created by emma on 2016/5/25.
 */
(function () {
    'use strict';
    angular
        .module('app.szgc')
        .directive('sxtProgressNumListItem', sxtNumberListItem);

    /** @ngInject */
    function sxtNumberListItem(utils, $rootScope) {
        return {
            restrict: 'A',
            scope: {
                value: '=ngModel'
            },
            link: function (scope, element, attr, ctrl) {
                scope.$watch(function () {
                    return element.text()
                }, function () {
                    var els = element.find('.point span'), l = els.length;
                    var v = $(els).hasClass('n') ? '' : parseFloat($(els).text().trim());
                    if (v || v == '0') {
                        scope.value.value = v;
                    }
                    else if (i > 1 && i < l) {
                        if (!$(els).parent().hasClass('current')) {
                            $(els).parent().parent().remove();
                        }
                    }
                })
            }
        }
    }
})();
