/**
 * Created by jiuyuong on 2016/4/12.
 */
(function(){
  'use strict';
  angular
    .module('app.xhsc')
    .factory('xhUtils',xhUtils);
  /** @ngInject */
  function xhUtils($mdDialog,$q){
    var _areaId, cP,region;
    var o = {
      getMapPic:getMapPic,
      findAll:findAll,
      findRegion:findRegion,
      wrapRegion:wrapRegion,
      photo:photo,
      when:when,
      playPhoto:playPhoto,
      sort:sort,
      md5:(function () {
        /*
         * Configurable variables. You may need to tweak these to be compatible with
         * the server-side, but the defaults work in most cases.
         */
        var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
        var b64pad  = ""; /* base-64 pad character. "=" for strict RFC compliance   */
        var chrsz   = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode      */

        /*
         * These are the functions you'll usually want to call
         * They take string arguments and return either hex or base-64 encoded strings
         */
        function hex_md5(s){ return binl2hex(core_md5(str2binl(s), s.length * chrsz));}
        function b64_md5(s){ return binl2b64(core_md5(str2binl(s), s.length * chrsz));}
        function str_md5(s){ return binl2str(core_md5(str2binl(s), s.length * chrsz));}
        function hex_hmac_md5(key, data) { return binl2hex(core_hmac_md5(key, data)); }
        function b64_hmac_md5(key, data) { return binl2b64(core_hmac_md5(key, data)); }
        function str_hmac_md5(key, data) { return binl2str(core_hmac_md5(key, data)); }

        /*
         * Perform a simple self-test to see if the VM is working
         */
        function md5_vm_test()
        {
          return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
        }

        /*
         * Calculate the MD5 of an array of little-endian words, and a bit length
         */
        function core_md5(x, len)
        {
          /* append padding */
          x[len >> 5] |= 0x80 << ((len) % 32);
          x[(((len + 64) >>> 9) << 4) + 14] = len;

          var a =  1732584193;
          var b = -271733879;
          var c = -1732584194;
          var d =  271733878;

          for(var i = 0; i < x.length; i += 16)
          {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;

            a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
            d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
            c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);
            b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
            a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
            d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);
            c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
            b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
            a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
            d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
            c = md5_ff(c, d, a, b, x[i+10], 17, -42063);
            b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
            a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);
            d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);
            c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
            b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);

            a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
            d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
            c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);
            b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
            a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
            d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);
            c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);
            b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
            a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
            d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
            c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
            b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);
            a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
            d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
            c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);
            b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

            a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
            d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
            c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);
            b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);
            a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
            d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);
            c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
            b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
            a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);
            d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
            c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
            b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);
            a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
            d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);
            c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);
            b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

            a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
            d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);
            c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
            b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
            a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);
            d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
            c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);
            b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
            a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
            d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);
            c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
            b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);
            a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
            d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
            c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);
            b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

            a = safe_add(a, olda);
            b = safe_add(b, oldb);
            c = safe_add(c, oldc);
            d = safe_add(d, oldd);
          }
          return Array(a, b, c, d);

        }

        /*
         * These functions implement the four basic operations the algorithm uses.
         */
        function md5_cmn(q, a, b, x, s, t)
        {
          return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);
        }
        function md5_ff(a, b, c, d, x, s, t)
        {
          return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
        }
        function md5_gg(a, b, c, d, x, s, t)
        {
          return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
        }
        function md5_hh(a, b, c, d, x, s, t)
        {
          return md5_cmn(b ^ c ^ d, a, b, x, s, t);
        }
        function md5_ii(a, b, c, d, x, s, t)
        {
          return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
        }

        /*
         * Calculate the HMAC-MD5, of a key and some data
         */
        function core_hmac_md5(key, data)
        {
          var bkey = str2binl(key);
          if(bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);

          var ipad = Array(16), opad = Array(16);
          for(var i = 0; i < 16; i++)
          {
            ipad[i] = bkey[i] ^ 0x36363636;
            opad[i] = bkey[i] ^ 0x5C5C5C5C;
          }

          var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
          return core_md5(opad.concat(hash), 512 + 128);
        }

        /*
         * Add integers, wrapping at 2^32. This uses 16-bit operations internally
         * to work around bugs in some JS interpreters.
         */
        function safe_add(x, y)
        {
          var lsw = (x & 0xFFFF) + (y & 0xFFFF);
          var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
          return (msw << 16) | (lsw & 0xFFFF);
        }

        /*
         * Bitwise rotate a 32-bit number to the left.
         */
        function bit_rol(num, cnt)
        {
          return (num << cnt) | (num >>> (32 - cnt));
        }

        /*
         * Convert a string to an array of little-endian words
         * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
         */
        function str2binl(str)
        {
          var bin = Array();
          var mask = (1 << chrsz) - 1;
          for(var i = 0; i < str.length * chrsz; i += chrsz)
            bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);
          return bin;
        }

        /*
         * Convert an array of little-endian words to a string
         */
        function binl2str(bin)
        {
          var str = "";
          var mask = (1 << chrsz) - 1;
          for(var i = 0; i < bin.length * 32; i += chrsz)
            str += String.fromCharCode((bin[i>>5] >>> (i % 32)) & mask);
          return str;
        }

        /*
         * Convert an array of little-endian words to a hex string.
         */
        function binl2hex(binarray)
        {
          var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
          var str = "";
          for(var i = 0; i < binarray.length * 4; i++)
          {
            str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +
              hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);
          }
          return str;
        }

        /*
         * Convert an array of little-endian words to a base-64 string
         */
        function binl2b64(binarray)
        {
          var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
          var str = "";
          for(var i = 0; i < binarray.length * 4; i += 3)
          {
            var triplet = (((binarray[i   >> 2] >> 8 * ( i   %4)) & 0xFF) << 16)
              | (((binarray[i+1 >> 2] >> 8 * ((i+1)%4)) & 0xFF) << 8 )
              |  ((binarray[i+2 >> 2] >> 8 * ((i+2)%4)) & 0xFF);
            for(var j = 0; j < 4; j++)
            {
              if(i * 8 + j * 6 > binarray.length * 32) str += b64pad;
              else str += tab.charAt((triplet >> 6*(3-j)) & 0x3F);
            }
          }
          return str;
        }

        return hex_md5;
      })(),
      zgDays:function () {
        return [{
          value:6,
          time:'6小时'
        },{
          value:12,
          time:'12小时'
        },{
          value:24,
          time:'1天'
        },{
          value:24*2,
          time:'2天'
        },{
          value:24*3,
          time:'3天'
        },{
          value:24*4,
          time:'4天'
        },{
          value:24*5,
          time:'5天'
        },{
          value:24*6,
          time:'6天'
        },{
          value:24*7,
          time:'7天'
        },{
          value:24*15,
          time:'15天'
        }]
      },
      openLinks:function (mapList) {
        return $mdDialog.show({
          controller:['$scope', '$mdDialog',function ($scope, $mdDialog) {
            $scope.mapList = mapList;
            $scope.cancel = function () {
              $mdDialog.cancel();
            }
            $scope.answer = function () {
              if($scope.sMap)
                $scope.sMap=false;
              else
                $mdDialog.cancel();
            }
            $scope.showMap = function (item) {
              $scope.sMap = true;
              $scope.imageId = item.DrawingID;
              $scope.mapName = item.DrawingName
            }
          }],
          fullscreen:true,
          template: '<md-dialog style="width: 100%;max-width: 100%;height: 100%;max-height: 100%;" aria-label="List dialog">' +
          '<md-toolbar>'+
          '<div class="md-toolbar-tools"><h2 style="font-size:16px">{{sMap?mapName:\'图纸列表\'}}</h2><span flex></span><md-button class="md-icon-button" ng-click="answer()"> <md-icon md-font-icon="icon-close" aria-label="Close dialog"></md-icon> </md-button> </div>'+
          '</md-toolbar>' +
          '<md-dialog-content flex layout="column" style="padding: 0">' +
          '<md-list ng-show="!sMap"><md-list-item ng-repeat="item in mapList" ng-click="showMap(item)">{{item.DrawingName}}</md-list-item></md-list>' +
          '<div flex ng-show="sMap" sxt-show-map="imageId"></div>'+
          '</md-dialog-content></md-dialog>'
        });
      }
    };
    return o;

    function getNumName(str) {
      str = str.replace('十', '10')
        .replace('九', '9')
        .replace('八', '8')
        .replace('七', '7')
        .replace('六', '6')
        .replace('五', '5')
        .replace('四', '4')
        .replace('三', '3')
        .replace('二', '2')
        .replace('一', '1')
        .replace('十一', '11')
        .replace('十二', '12')
        .replace('十三', '13')
        .replace('十四', '14')
        .replace('十五', '15')
        .replace('十六', '16')
        .replace('十七', '17')
        .replace('十八', '18')
        .replace('十九', '19')
        .replace('二十', '20');
      var n = parseInt(/[-]?\d+/.exec(str));
      return n;
    };
    function sort(fn) {
      return function (s1,s2) {
        var a1 = fn(s1),
          a2 = fn(s2);

        var n1 = getNumName(a1),
          n2 = getNumName(a2);
        if (!isNaN(n1) && !isNaN(n2))
          return n1 - n2;
        else if ((isNaN(n1) && !isNaN(n2)))
          return 1;
        else if ((!isNaN(n1) && isNaN(n2)))
          return -1;
        else
          return a1.localeCompare(a2);
      }
    }

    function wrapRegion(target){
        region = target;
        region.find = find;
        region.each = each;
        region.fullName = region.RegionName;
        //栋
        region.Children && region.Children.forEach(function(d){
          d.$parent = region;
          d.fullName = region.fullName+d.RegionName;
          d.find = find;
          d.next = next;
          d.prev = prev;
          d.each = each;
          d.Children && d.Children.forEach(function(l){
            l.$parent = d;
            l.fullName = d.fullName+l.RegionName;
            l.find = find;
            l.next = next;
            l.prev = prev;
            l.each = each;

            l.Children && l.Children.forEach(function(r){
              r.$parent = l;
              r.fullName = l.fullName+r.RegionName;
              r.find = find;
              r.next = next;
              r.prev = prev;
              r.each = each;
            })
          })});
        function each(fn){
          fn(this);
          this.Children && this.Children.forEach(function(item){
            item.each(fn);
          })
        }
        function find(id){
          if(this.RegionID==id ||(typeof id==='function' && id(this)===true))
            return this;

          if(this.Children){
            var fd;
            this.Children.forEach(function(c){
              if(!fd){
                fd = c.find(id);
              }
            });
            if(fd)
              return fd;
          }
        }
        function next(){
          if(this.$parent) {
            var ix = this.$parent.Children.indexOf(this);
            var next = this.$parent.Children[ix + 1];
            if (next)
              return next;
            var p = this.$parent.next && this.$parent.next();
            if(p&& p.Children){
              return p.Children[0];
            }
          }
        }
        function prev(){
          if(this.$parent) {
            var ix = this.$parent.Children.indexOf(this);
            var next = this.$parent.Children[ix - 1];
            if (next)
              return next;
            var p = this.$parent.prev &&  this.$parent.prev();
            if(p && p.Children){
              return p.Children[p.Children.length-1];
            }
          }
        }
        return region;
    }

    function getMapPic(maxZoom){
      //console.log('m',maxZoom,Math.pow(2,maxZoom))
      var pics = [];
      for(var z=0;z<=maxZoom;z++){
        for(var x= 0,xl = Math.pow(2,z);x<xl;x++){
          for(var y= 0,yl = xl;y<yl;y++){
            pics.push(z+'_'+x+'_'+y)
          }
        }
      }
      return pics;
    }

    function findAll(array,fn) {
      var buff=[];
      array.forEach(function (item) {
        if(fn(item)===true)
          buff.push(item);
      });
      return buff;
    }

    function findRegion(regions,id,appendName) {
      if(!regions)return null;
      if(!angular.isArray(regions)){
        regions=[regions];
      }
      var fd = regions.find(function (r) {
        var len = r.RegionID.length;
        return id.substring(0,len)==r.RegionID;
      });
      if(!fd)return null;
      if(fd.RegionID!=id)
        return findRegion(fd.Children,id,(appendName||'')+fd.RegionName);
      else {
        fd.fullName = (appendName||'')+fd.RegionName;
        return fd;
      }
    }

    function  upRegion(regions,current){
      if(this.$parent) {
        var ix = this.$parent.Children.indexOf(this);
        var next = this.$parent.Children[ix - 1];
        if (next)
          return next;
        var p = this.$parent.prev &&  this.$parent.prev();
        if(p && p.Children){
          return p.Children[p.Children.length-1];
        }
      }
    }

    function photo($event) {
      return $mdDialog.show({
        targetEvent: $event,
        controller:['$scope', '$mdDialog',function ($scope, $mdDialog) {
          $scope.cancel = function () {
            //$mdDialog.cancel();
            var url = 'data:image/png;base64,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'
            $scope.answer(url)
          }
          $scope.answer = function ($base64Url) {
            $mdDialog.hide($base64Url);
          }
        }],
        fullscreen:true,
        template: '<md-dialog style="width: 100%;max-width: 100%;height: 100%;max-height: 100%;" aria-label="List dialog">' +
        '  <md-dialog-content flex layout="column" style="padding: 0">' +
        '<photo-draw flex layout="column" on-cancel="cancel()" on-answer="answer($base64Url)"></photo-draw>' +
        '  </md-dialog-content>'+
        '</md-dialog>'
      });
    }

    function when(exec,result) {
      return exec().then(function (r) {
        if(result(r)!==false){
          return exec();
        }
        else
          return r;
      })
    }

    function playPhoto(images,options) {
      if(!images || !images.length)return;
      var str = [];
      str.push('<ul>')
      angular.forEach(images, function (data) {
        str.push('<li><img src="' + data.url + '" alt="'+data.alt+'"></li>');
      });
      str.push('</ul>');
      o = $(str.join('')).appendTo('body');

      var viewer = new Viewer(o[0],{
        button:true,
        scalable:false,
        hide:function(){
          viewer.destroy();
          o.remove();
          viewer = o=null;
        },
        build:function(){

        },
        view:function(){
        }
      });
      viewer.show();
      return viewer;
    }
  }
})();
