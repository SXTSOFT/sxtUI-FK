/**
 * Created by jiuyuong on 2016/4/6.
 */
(function(){
  'use strict';
  angular
    .module('app.szgc')
    .directive('sxtYear',sxtYear);

  /** @ngInject */
  function sxtYear(utils, api, sxt,$q,$timeout,$window) {
    return {
      scope: {
        procedureId: '=',
        partion: '=',
        regionId: '=',
        show: '=',
        regionName: '=',
        imageType: '=',
        roomType:'=',
        yearShow:'='
      },
      template: '<div class="tbb" style="position:absolute;top:50px;line-height: 20px; left:0;width:100%;background:#fff;z-index:1002; height: 25px;"><div class="btn-group" role="group" aria-label="" style="margin: 8px 4px;">\
  <button type="button" class="btn btn-white" ng-click="add(-1)"> <md-icon md-font-icon="icon-chevron-left"></md-icon></button>\
  <button type="button" class="btn btn-white yearlabel" data-day="{{year}}-1-1" data-type="3">{{year}}</button>\
  <button type="button" class="btn btn-white" ng-click="add(1)"><md-icon md-font-icon="icon-chevron-right"></md-icon></button>\
</div> <button type="button"  class="btn btn-white yearlabel allbtn" style="margin: -43px auto;display: block">全部</button><button type="button" ng-show="isLoading" class="btn btn-white"><i class="fa fa-refresh fa-spin"></i></button> </div><div style="overflow: auto;margin-top:34px;" class="clear months monthsscroll"><div ng-repeat="m in months" sxt-month="m" ></div></div>',
      link: function (scope, element, attr, ctrl) {
        var map,curlay;
        element.addClass('sxtcalendar');
        $timeout(function(){
          element.find('.tbb').insertBefore(element);
        },500);
        scope.$watch('year', function () {
          if (!scope.year) return;
          scope.months = [];
          for (var i = 1; i < 13; i++) {
            scope.months.push({ m: scope.year + '-' + i + '-1',d:[] });
          }
        });
        scope.year = moment().year();
        scope.add = function (y) {
          scope.year = scope.year + y;
          scope.query();
        };
        var filter = function () {
          if (!scope.data) return;
          if (scope.data.length == 0) {
            utils.alert('暂无照片');
          }
          else {
            scope.months.forEach(function (m) {
              m.d.splice(0, m.d.length);
            });
            scope.allfilter = [];
            scope.data.forEach(function (file) {
              if (scope.procedureId && (!file.gx || file.gx.indexOf(scope.procedureId) == -1)) return;
              if (scope.partion && scope.partion.Id && file.GroupId.indexOf('-' + scope.partion.Id + '-14') == -1) return;
              scope.allfilter.push(file);
              var date = moment(file.CreateDate,'YYYY-MM-DD');
              if (date.year() == scope.year) {
                var days = scope.months[date.month()].d;
                var day = days.find(function (dy) { return dy.day == date.date(); });
                if (!day) {
                  days.push({
                    day: date.date(),
                    images: [file]
                  });
                } else {
                  day.images.push(file);
                }
              }
            });
          }
          playImage();
          if(scope.yearShow){
            $timeout(function(){
              $('button.yearlabel',element).trigger('click');
              $('button.allbtn').css('display','none')
            },0)
          }
        }
        scope.$watch('procedureId', filter);
        scope.$watch('partion', filter);
        scope.query = function () {
          var query;

          switch (scope.imageType) {
            case 2:
            case 3:
              query = api.szgc.FilesService.GetPrjFilesByFilter(scope.regionId, { imageType: scope.imageType });
              break;
            default:
              query = $q(function (resolve) {
                resolve({
                  data: {
                    Rows: []
                  }
                });
              });
              break;
          }
          if (query) {
            scope.isLoading = true;
            query.then(
              function (r) {
                //r.data.Rows;
                scope.data = r.data.Rows;
                if (scope.imageType==2 && scope.data.length) {
                  var bid = scope.data[0].GroupId.split('-')[1];
                  if (scope.bid != bid) {
                    scope.bid = bid;
                    api.szgc.ProjectExService.queryById(scope.bid).then(function (response) {
                      var layers = null;;
                      response.data.Rows.forEach(function (mp) {
                        if (mp.AreaRemark) {
                          var geo;
                          try{
                            geo = JSON.parse(mp.AreaRemark);
                          } catch (ex) {
                            return;
                          }
                          var a = mp.ProjectId.split('-'),
                            gx = a[a.length - 1],
                            gxs = [];
                          switch (gx) {
                            case '1':
                              gxs = ['a17156db-da3c-4878-b3de-2a03169f094e', '2dfbde19-52be-43b9-b5d1-d03e2f828c9d', '7ceb4043-d1c6-4454-8546-a2bf6630d887'];
                              break;
                            case '2':
                              gxs = ['953cea5b-b6fb-4eb7-b019-da391f090efd', '2dfbde19-52be-43b9-b5d1-d03e2f828c9d', '7ceb4043-d1c6-4454-8546-a2bf6630d887'];
                              break;
                            case '3':
                              gxs = ['8bfc6626-c5ed-4267-ab8f-cb2294885c25', '2dfbde19-52be-43b9-b5d1-d03e2f828c9d', '7ceb4043-d1c6-4454-8546-a2bf6630d887'];
                              break;
                            case '4':
                              gxs = ['2574a27e-cc0b-41be-a513-98465307fe41', '2dfbde19-52be-43b9-b5d1-d03e2f828c9d', '7ceb4043-d1c6-4454-8546-a2bf6630d887'];
                              break;
                            case '5':
                              gxs = ['abd6a825-91aa-4d34-9426-68d96579c0cf', '65f1cad2-30d1-4f16-864c-2440141c13b7']
                              break;
                          }
                          geo.features.forEach(function (f) {
                            f.gx = gxs.join(',');
                            var fd = scope.data.find(function (row) { return row.GroupId.indexOf(f.options.itemId) != -1; });
                            if (fd != null) {
                              fd.partName = f.options.itemName;
                              fd.gx = f.gx;
                            }
                          });
                          if (!layers)
                            layers = geo;
                          else
                            layers.features = layers.features.concat(geo.features);
                        }
                      });

                      scope.geo = layers;
                    });
                    api.szgc.FilesService.group(scope.bid + '-'+scope.roomType).then(function (response) {
                      var file = null;
                      response.data.Files.forEach(function (mp) {
                        file = mp.Url;
                      });
                      scope.file = file;
                    });
                  }
                }
                filter();
                scope.isLoading = false;

                $timeout(function(){;
                  var m = moment();
                  $('[sxt-year]').height($($window).height()-56).animate({
                    scrollTop:$('td[data-day="' + m.year() + '-' + (m.month()+1) + '-1"]').position().top-100
                  });

                },500)
              })

          }
        }

        scope.$watch('show', function () {
          if (scope.show) {
            scope.query();
          }
        })
        //element.on('click', ' td.photo', function (e) {
        //    console.log('p', e.target);
        //});

        var pdiv, pday,pdayType, playImage = function (div, day,dayType) {
          if (!div && pdiv) {
            if (pday && pday != '') {
              var m = moment(pday,'YYYY-M-D'),
                mt = m.month() + 1,
                ye = m.year();
              $('[data-day]', pdiv).removeClass('photo');
              scope.months[m.month()].d.forEach(function (d) {
                $('[data-day="' + ye + '-' + mt + '-' + d.day + '"]', pdiv).addClass('photo');
              });
            }
          }
          div = div || pdiv; day = day || pday; dayType = dayType || pdayType;
          pdiv = div; pday = day; pdayType = dayType;
          if (!div) return;
          var el = div.find('.content');
          //$(element).on('touchmove',function(e){
          //  console.log('a')
          //  e.preventDefault();
          //  e.stopPropagation();
          //})
          el.css({
            overflow:'auto',
            height:(div.height()-40)
          });
          if (!day && dayType != 4) {
            el.html('暂无照片');
          }
          else {
            var m = moment(day,'YYYY-M-D'), images = [];
            switch (dayType) {
              case '1':
                var fd = scope.months[m.month()].d.find(function (dy) { return dy.day == m.date(); });
                if (fd) images = fd.images;
                break;
              case '2':
                scope.months[m.month()].d.forEach(function (fd) {
                  images = images.concat(fd.images);
                });
                break;
              case '3':
                scope.months.forEach(function (m) {
                  m.d.forEach(function (d) {
                    images = images.concat(d.images);
                  })
                })
                break;
              default:
                images = scope.allfilter;
                break;
            }
            //var days = scope.months[m.month()].d.find(function (dy) { return dy.day == m.date(); });
           // div.find('.img-title').html((dayType == 1 ? m.format("YYYY年MM月DD日") : dayType == 2 ? m.format("YYYY年MM月") : dayType == 3 ? m.format("YYYY年") : '') + (day ? "(" + images.length + "张)" : ""));
            el.empty();
            if (images.length) {
              var str = ['<div>'];
              images.forEach(function (img, i) {
                str.push('<a href="javascript:void(0)" style="float:left;text-align:center;padding:5px;"><img gid="' + img.GroupId + '" style="height:120px" src="' + sxt.app.api + '/api/Files/thumb/120?path=' + img.Url + '" title="' + (img.partName ? '(' + img.partName + ') ' : '') + img.CreateDate + ' ' + (i + 1) + '/' + images.length + '" class="img-thumbnail" /><p>' + (img.partName ? '(' + img.partName + ') ' : '') + img.CreateDate + ' ' + (i + 1) + '/' + images.length + '</p></a>')
              });
              str.push('<div style="clear:both;display: block;"></div></div><div style="clear:both;display: block;"></div>');
              var o = $(str.join('')).appendTo(el);
              o.find('img').click(function (e) {
                viewImage(scope.imageType == 2 ? $(this).attr('gid') : images, $('img', o).index($(e.target)), div, images);
              }).hover(function () {

              }, function () {

              })
            }
            else {
              el.html('暂无照片');
            }
          }
        };

        var viewImage = function (gid, defaultIndex, div, images) {
          (scope.imageType == 3 ? $q(function (resolve) {
            resolve({
              data: {
                Files: gid
              }
            });
          }) : api.szgc.FilesService.group('sub-' + gid)).then(function (r) {

            var imagedata = r.data.Files;
            imagedata.splice(0, 0, images[defaultIndex]);
            var str = [];
            str.push('<div class="piclayer"><div class="rotate" style="position:absolute;right:20px;top:20px;color:#fff;z-index:100000" class="rotate"><span style="margin-right:5px;font-size:16px;display:inline-block;vertical-align:top;">旋转</span><img width="30" src="assets/leaflet/images/rotate2.png"></div>\
        <div class="outermap" style="width:50%;float:left;background:#ddd; "><div class="innermap"></div><p style="text-align:center;font-size:16px;color:#000;">' + scope.regionName + '</p></div><div class="imagesv" style="width:50%;float:right;"><div class="swiper-container"><div class="swiper-wrapper">')
            angular.forEach(imagedata, function (data) {
              str.push('<div class="swiper-slide"><p><img gid="' + data.GroupId + '" src="' + sxt.app.api + data.Url.substring(1).replace('/s_','/') + '"></p>' + (data.CreateDate ? '<div style="position:absolute;top:20px;left:20px; font-size:20px; color:white;text-shadow:2px 2px 3px #ff0000">日期：' + data.CreateDate + (data.partName ? '(' + data.partName + ')' : '') + (data.Remark ? '<div style="font-size:16px">'+data.Remark+'</div>' : '') + '</div>' : '') + '</div>');
            });
            str.push('</div><div class="swiper-button-prev"></div><div class="swiper-button-next"></div><div class="swiper-pagination"></div></div></div></div>');
            var o = $(str.join('')).appendTo('body')
            //$('body').append(o);

            var iWidth = $(window).width();
            var iHeight = $(window).height();

            var iSh = iHeight;//-150;

            $('.swiper-container',o).width('100%');
            $('.swiper-container', o).height(iSh + 'px');

            $('.swiper-slide', o).height(iSh + 'px');
            $('.swiper-slide p', o).height(iSh + 'px');//.css('line-height',iSh+'px');
            if (scope.imageType == 2) {
              if(iWidth<iHeight){
                $('.outermap',o).css({
                  width:'100%',
                  top:0,
                  height:iHeight*0.4,
                  float:'none'
                })
                $('.imagesv',o).css({
                  width:'100%',
                  top:iHeight *0.4,
                  height:iHeight*0.6,
                  float:'none'
                });
                $('.swiper-container',o).width('100%');
                $('.swiper-container', o).height((iSh*0.6) + 'px');

                $('.swiper-slide', o).height((iSh*0.6) + 'px');
                $('.swiper-slide p', o).height((iSh*0.6) + 'px');//.css('line-height',iSh+'px');
                $ ('.innermap', o).height ((iSh*0.4) + 'px');
                $('.rotate',o).css({
                  top:(iSh*0.4)+10
                });
              }
              else {
                $ ('.innermap', o).height ((iSh - 80) + 'px');
              }
              map = L.map($('.innermap', o)[0], {
                crs: L.extend({}, L.CRS, {
                  projection: L.Projection.LonLat,
                  transformation: new L.Transformation(1, 0, 1, 0),
                  scale: function (e) {
                    return 256 * Math.pow(2, e);
                  }
                }),
                center: [.48531902026005, .5],
                zoom: 0,
                minZoom: 0,
                maxZoom: 3,
                scrollWheelZoom: true,
                annotationBar: false,
                attributionControl: false
              });

              //layer = L.tileLayer(sxt.app.api + '/api/file/load?x={x}&y={y}&z={z}', {
              L.tileLayer(sxt.app.api + '/api/picMap/load/{z}_{x}_{y}.png?size=256&path=' + scope.file.replace('/s_', '/'), {
                noWrap: true,
                continuousWorld: false,
                tileSize: 256
              }).addTo(map);
            }
            else {
              $('.outermap', o).remove();
              $('.imagesv').width('100%');
            }
            var preview = new Swiper(o.find('.swiper-container')[0], {
              initialSlide: scope.imageType == 3?defaultIndex:0,
              pagination: '.swiper-pagination',
              paginationClickable: true,
              nextButton: '.swiper-button-next',
              prevButton: '.swiper-button-prev',
              onInit: function (swiper) {
                if (map) {
                  var gid = $('.swiper-container img', o).eq(swiper.activeIndex).attr('gid');
                  if (curlay) {
                    map.removeLayer(curlay);
                  }
                  var geo = scope.geo.features.find(function (f) {
                    return gid.indexOf(f.options.itemId) != -1;
                  });
                  if (geo) {
                    curlay = L.GeoJSON.geometryToLayer(geo, geo.options.pointToLayer, geo.options.coordsToLatLng, geo.options);
                    if (curlay) {
                      map.addLayer(curlay);
                    }
                  }
                }
              },
              onSlideChangeEnd: function (swiper) {
                if (map) {
                  var gid = $('.swiper-container img', o).eq(swiper.activeIndex).attr('gid');
                  if (curlay) {
                    map.removeLayer(curlay);
                  }
                  var geo = scope.geo.features.find(function (f) {
                    return gid.indexOf(f.options.itemId) != -1;
                  });
                  if (geo) {
                    curlay = L.GeoJSON.geometryToLayer(geo, geo.options.pointToLayer, geo.options.coordsToLatLng, geo.options);
                    if (curlay) {
                      map.addLayer(curlay);
                    }
                  }
                }
              }
            });



            o.find('.pic_close button').click(function () {
              //preview.destroy();
              //o.remove();
            })
            var i = 0;
            $(o.find('.rotate')).on('click', function (e) {
              i++;
              var deg = 90 * i;
              $(o.find('.swiper-slide-active img')).css({ '-webkit-transform': 'rotate(' + deg + 'deg)', '-moz-transform': 'rotate(' + deg + 'deg)', '-o-transform': 'rotate(' + deg + 'deg)', '-ms-transform': 'rotate(' + deg + 'deg)', 'transform': 'rotate(' + deg + 'deg)' });
              if (i > 3) {
                i = 0;
              }
              e.preventDefault();
            })
            //$('.picplayer').is(':visible')
            //if ($(o).css('display')) {
            $(o.find('.swiper-container')[0]).not('.rotate').click(function (e) {
              if ($(e.target).hasClass('swiper-button-next') || $(e.target).hasClass('swiper-button-prev')) return;

              preview.destroy();
              o.remove();
              map.remove();
              e.preventDefault();
              preview = o = null;
              $('.piclayer').remove();
            })
            //}
          });
        }
        element.find('button.yearlabel').click(function (e) {
          var iWrapHeight = element.height();
          if(element.find('.year-wrap')) element.find('.year-wrap').remove();
          $(this).blur();
          var div = $('<div style="background:white" class="year-wrap"><div class="btn-toolbar" style="padding:20px 10px" role="toolbar"><div class="btn-group img-title" style="line-height:40px;font-weight:bold; "></div><div class="btn-group pull-right btn-group-xs" role="group"> </div></div><div class="content">正在加载……</div></div>');
          div.appendTo(element);

          div.css({
            position:'relative', //'absolute',
            top: 0,
            left: 0,
            width: 0,
            height: 0
          }).appendTo(element).animate({
            width: element.width(),
            height: iWrapHeight,//element.height(),
            margin: 0
          }, function () {
            $('.months').hide();
            div.find('.btn-toolbar button.btn-close').click(function () {
              div.empty();
              div.animate({
                width: 0,
                height: 0
              }, function () {
                pdiv = pdayType = pday = null;
                div.remove();
              });
            });
            playImage(div, $(e.target).attr('data-day')||'',$(e.target).attr('data-day')? '3':'4');
          });

        });
        element.on('click', ' div.months div.calendar-table', function (e) {
          console.log('a',element.find('.yearlabel'))
          $('.allbtn').css('display','none');
          var self = $(this), n = self.clone(), offset = self.position(), target = e.target;
          var inHeight = $(window).height()- 100;
          //if (!$(target).hasClass('photo')) return;
          $('.months').hide();
          //console.log('ele',self.height(),$('.content>div').height())
          $('table',n).hide();
          n.addClass('hmonth');
          n.css({
            position:'relative', //'absolute',
            left: offset.left,
            width: self.width(),
            height: inHeight//self.height()
          }).appendTo(element).animate({
            width: element.width(),
            height:element.height(),
            left: 0,
            top:element.scrollTop(),
            margin:0
          }, function () {
            var table = $('table',n), div = $('<div style="display:none"><div class="btn-toolbar" style="padding:20px 10px;" role="toolbar"><div class="btn-group img-title" style="line-height:40px;font-weight:bold;"></div><div class="btn-group pull-right btn-group-xs" role="group"> </div></div><div class="content">正在加载……</div></div>');
            div.appendTo(n);
            //table.css({ float: 'left' });

            div.width(n.width()).fadeIn(function () {
              playImage(n, $(target).attr('data-day'), $(target).attr('data-type')||'1');
            });
            div.find('.btn-toolbar button.btn-close').click(function () {
              div.hide();
              $(lement.find('.allbtn')).css('display','block');
              $('.months').show();
              n.animate({
                top: offset.top,
                left: offset.left,
                width: self.width(),
                height: self.height()
              }, function () {
                pdiv = pdayType = pday = null;
                n.remove();
              });
            });
            n.on('click', ' [data-day]', function (e) {
              playImage(div, $(e.target).attr('data-day'), $(e.target).attr('data-type')||'1');
            })

          });
        })
        element.on('click', ' button.btn_closeyear', function (e) {
          //$('.months').show();
          scope.show = false;
          scope.$apply();
        });
      }
    };
  }
})();
