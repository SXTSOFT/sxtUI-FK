(function () {
    'use strict';

    var fusePalettes = [
        {
            name: 'fuse-blue',
            options: {
                '50': '#ebf1fa',
                '100': '#c2d4ef',
                '200': '#9ab8e5',
                '300': '#78a0dc',
                '400': '#5688d3',
                '500': '#3470ca',
                '600': '#2e62b1',
                '700': '#275498',
                '800': '#21467e',
                '900': '#1a3865',
                'A100': '#c2d4ef',
                'A200': '#9ab8e5',
                'A400': '#5688d3',
                'A700': '#275498',
                'contrastDefaultColor': 'light',
                'contrastDarkColors': '50 100 200 A100',
                'contrastStrongLightColors': '300 400'
            }
        },
        {
        name: 'fuse-pale-blue',
        options: {
          '50': 'ffebee',
          '100': 'ffcdd2',
          '200': 'ef9a9a',
          '300': 'e57373',
          '400': 'ef5350',
          '500': 'f44336',
          '600': 'e53935',
          '700': 'd32f2f',
          '800': 'c62828',
          '900': 'b71c1c',
          'A100': 'ff8a80',
          'A200': 'ff5252',
          'A400': 'ff1744',
          'A700': 'd50000',
          'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
          // on this palette should be dark or light
          'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
            '200', '300', '400', 'A100'],
          'contrastLightColors': undefined
        }
      },
      {
        name: 'fuse-red',
        options: {
          '50': '#ececee',
          '100': '#c5c6cb',
          '200': '#9ea1a9',
          '300': '#7d818c',
          '400': '#5c616f',
          '500': '#3c4252',
          '600': '#353a48',
          '700': '#2d323e',
          '800': '#262933',
          '900': '#1e2129',
          'A100': '#c5c6cb',
          'A200': '#9ea1a9',
          'A400': '#5c616f',
          'A700': '#2d323e',
          'contrastDefaultColor': 'light',
          'contrastDarkColors': '50 100 200 A100',
          'contrastStrongLightColors': '300 400'
        }
      },
    ];

    angular
        .module('app.core')
        .constant('fusePalettes', fusePalettes);
})();
