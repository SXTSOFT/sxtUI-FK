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
            $mdDialog.hide('iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjI3MTY1RDFBM0U3NDExRTZBODZDOEI0MjBGMUI2NEQwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjI3MTY1RDFCM0U3NDExRTZBODZDOEI0MjBGMUI2NEQwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MjcxNjVEMTgzRTc0MTFFNkE4NkM4QjQyMEYxQjY0RDAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MjcxNjVEMTkzRTc0MTFFNkE4NkM4QjQyMEYxQjY0RDAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6ZQSDLAAAH5klEQVR42sxa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');
            //$mdDialog.cancel();
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
