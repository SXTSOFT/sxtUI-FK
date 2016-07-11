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
      })()
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
            var base64='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4VsWRXhpZgAATU0AKgAAAAgACAEPAAIAAAAIAAAAbgEQAAIAAAAIAAAAdgEaAAUAAAABAAAAfgEbAAUAAAABAAAAhgEoAAMAAAABAAIAAAITAAMAAAABAAEAAIdpAAQAAAABAAAAjoglAAQAAAABAAABjgAAAdBYaWFvbWkAAE1pVHdvAAAAAAAASAAAAAEAAABIAAAAAQANgpoABQAAAAEAAAEwiCcAAwAAAAEBlAAAkAAABwAAAAQwMjIwkAMAAgAAABQAAAE4kAQAAgAAABQAAAFMkQEABwAAAAQBAgMAkgIABQAAAAEAAAFgkgoABQAAAAEAAAFooAAABwAAAAQwMTAwoAEAAwAAAAEAAQAAoAIABAAAAAEAAARAoAMABAAAAAEAAAeAoAUABAAAAAEAAAFwAAAAAAAACncAAYagMjAxNDowMzozMSAxMjo0OTo1MwAyMDAyOjEyOjA4IDEyOjAwOjAwAAADDUAAAYagAAABJQAAAGQAAgABAAIAAAAEUjk4AAACAAcAAAAEMDEwMAAAAAAAAgAHAAUAAAADAAABrAAdAAIAAAALAAABxAAAAAAAAAAEAAAAAQAAADEAAAABAAAANQAAAAEyMDE0OjAzOjMxAAAABgEDAAMAAAABAAYAAAEaAAUAAAABAAACHgEbAAUAAAABAAACJgEoAAMAAAABAAIAAAIBAAQAAAABAAACLgICAAQAAAABAABY4AAAAAAAAABIAAAAAQAAAEgAAAAB/9j/2wCEACgcHiMeGSgjISMtKygwPGRBPDc3PHtYXUlkkYCZlo+AjIqgtObDoKrarYqMyP/L2u71////m8H////6/+b9//gBKy0tPDU8dkFBdviljKX4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+P/AABEIBQAC0AMBIgACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/AH0UUUDFooooEFFFFABRRRQAUUUUAFFFFABRRRQAUUUUwCiiikAUUtFMBKKKWkAlFFLTASiiigAooopAFFFFMAooo6UAJRS0lABRRRSAKKKKAA0lLSUAFFHeigAooooAKKKKACiiigAooooAKKKKAGsuaiIINT0hANAEPalAp+wUoUAUAMCkmpAOKWigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAGtTac3Sm0AFLSUUDClpKKAFooooEFFFFABRRS0AFJS0UAJRS0UASUUUUDAUUUUCCiiigAoopaACkoooAKKKWgApKKWgBKKWigBKWiimAUlLRQAUlLRSASiiimAUUUUAFGKKKQBRRRTAMUUUUAJS0UUAJRRRSAKKWkoAKDRRQAlFHeigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKO1FFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUdqKKAEPSmU80ygAooo70DClpKWgAooooEFFFFABS0lLQAUUd6KACkpaDQBJRRRQAUtJS0AFFFFABRRRQAUlLRQAlLRRQAUUUUAFGKKKACiiigAoo7UUAFFFFABQaKKYCUUtJSAKKKKACiiigAooooAKKKKACiiigApKKKACilpKAENFKaSgAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiijvQAUUUUAFFFFABRRRQAUUUUAIabT6YetACUUUUDClpKKAFooooAKKKKBC0lFFAC0UUUAFFFFAElFFLQAlFLRQAUUUUAFHWiigAooooAKKKKACiiigAooooAKKKKACijFFABRRRQAUUUUAFFFFABRRRQAlFLSUAFFLSUAFFLSUAFFFFABRRRQAlLRRQAlIaWigBKWkooAKKKKACiiigAooooAKKKKACiiigAooooAKKBRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABTDT6a1ADaKKKBhRRRQAtFJS0CCiiigApaT6UUAFLR9KKACiig0ASUUUtABRRQKACiiigAooooAKKKKACiiigAooooAKKKKACiiigBaSlpKACiiigAooooAKKKKACiiigAooooASloooASlopKACiiigAooooAKKKKAEopaQ0AJRSmkoAKKKKACiiigAooooAKKKKACiiigBaSiigBaSiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACmtS0HpQAyiiigAoopaBiUtFFAgooooAWkpaKACikpaACijvRQBLRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUtJRQAUUUtACUUUUAHSiiloASiiigAooooAKKKKACiiigApKWigAooooASilooASiiigAooooASlopKACkp1IaAEooooAKKKKACiiigAooooAKKWkoAKKKKACiiigAooooAKKKKAFpKKKACiiigAooooAKKKOtABRRRQAUUUUAJQelLSGkAyilNJTGAooooAWikpaBBRRRQAUtJS0AFFFFABRRRQBLRRQKACiiigAoopaAEpaKKAEoopaAEooooAKKWigBKKKKAFpKWigApKWigAooooASiiloASiiigAooooAKKKKACiiigAooooAKSlooAKSlpKACiiigAooooASjtS0UAJSUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUtJRQAUUUtACUUUUAFFFLQAlFFFABRRRQAUUUUAFFFFABSUtFABRRRQAw9aSlbrSUhhRRRTAKWiikIKKKKYBS0lFAC0UUUAFFFFAEtFFFABS0lFABS0lLQAUCiigAooooASlopKACloooASilooAKKKKACiiigAooooAKSlooASiiigAooooAKKKKACiiigAooooAKKKKACkpaKAEooooAKKKKAEpaKKAENFLTaACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAGtTac1NpAFFFFAwpaSigQtFFFMBc0UlLQAUUnWloAKKKKAJaKKKACiiigBaKKKACiiigBKWiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAEoopaAEopaSgAopaSgAooooAKKKKACiiigApKWkoAKKKKACiiigApKKKAEopaSgAooooAKKKKACiiigAooooAKWkooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigApKWkoAQ9KbTz0plABRRRSAKWkooAKWiimAUtJS0AFFFFABRRRQBLRRS0AFJRS0AFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFACUUtFACUUtFACUUUUAFFFFABRRRQAlFFFABRRRQAUUUlABSUpooASilpKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACkpaKAEplSUw9aAEooooGFFFFIQtHaiimAUUUUAFLRRQAUUUUAS0UUtABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFHegAooooAKSiigAooooAKKKKAEopaSgAooooAKSlooAKSlpKAEpaKSgAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKY3Wn0w0AJRRRQAUUUUDFopKWgQUUUUAFLRRQAUUGkoAmpaSloAKKKKACiiigAooooAKKKKACilooASlpKWgAoopKACilooAKKKSgBaSlpKACilpKAFpKKKACiiigAooooAKKKKACiiigAoopKACiiigAooooAKKKSgAooooAKKKKAEooooASilNJQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUlLSUALTWpaRulADaKKKACiiikAtFJS9aYBRRR0oAWiiigAoooNAEtLSUtABRRRQAUUUUAFFFFABRRRQAUtFJQAtFJS0AFFFFABRRRQAUUUUAFJS0UAJRS0lAC0lLSUAFFLSUAFFFFABRRRQAUUUUAFFFFACUUtJQAUUUUAFFFFABRRSUAFFFFABRRRQAhpKdSUAJRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABSUUUAFBoooAZRRRQAUUUUAFLSUUALRRQKACl7UlGeKAFpKWkoAnooooAKKKKACilpKACloooAKSlooAKKKKACiiimAUUUUAFFFFABRRRSAKKKKAEpaKKACiiigBKWiigApKKKACiiigAooooAKKKKACiiigApKWkoAKKKKACiiigBKKWkoAKKKKACkNLSUAJRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFJS0AFFFFABRSUtABSUUUALSUUUAFFFFADDRSnrSUAFFFFABRRRQAtFFFABR2oooAKWko70AT0UUUAFFLSUALSUtFABRRRQAUUUUAFFFFABRRRTAKKKKACiiigAooopAFFFFABRRRQAUUUUAFFFFABRRRQAlFLSUALSUUUAFFFFABRRRQAUUUUAJRRRQAUUUUAFJS0lABRRRQAlFLSUAFJS0lABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFJS0UAJRRRQA1qSnN0plAC0UUUAFFFFAC0UUlAC0UUUAFFFFAE9FFFAC0UlLQAUUUUAFFFFABRRRQAUUUUAFFFFMAooooAKKKKQBRRRTAKKKKACiiikAUUUUAFFFFABRRRQAUUUUAFFFFACUUUUAFFFFABRRRQAlFLSUAFFFFABRRRQAlFFFABSUtFACUUUGgBKKKKACiiigAooooAKKKKACiiigAooooGFFFFAgooooAKKKKAEpaKKAEpaKKACikooAKKKKAEbpTKeelMoAWkpaSgBaKKKACigUtABR2oooAKKKKAJ6KKKAFooooAKKKKACiiigAooooAKKKKACiiloASilooAKKKSgAooopgFFFFABRRRSAKKKKACiiigAooooAKKKKACiiigApKWigBKKKKACiiigAooooASiiigAooooASiiigAooooASilooASkpaSgAooooAKKKKACiiigAooooAKKKKACiiigAoopKAFooooAKSlooAKKKSgAooooAKKKKAEplSUw9aACkoooAWikpaACloooAKKBRQAdKKKKAJ6KKKAFooooAKKKKACiiigAooooAKWkpaACiiigAooooAKKKKYBRRSUAFFFLQAlFFFABRRS0AJRRRSAKKKKACiiigAooooAKKKKAEopaSgAooooAKKKKAEooooAKKKKACkpaKAEooooAKSlooASkp1NoAKKKKACiiigYUUUUAFFFFABRRRQIKKKKACiiigAopKWgBKKKKACiiigAooooAKKKKACmHrTqRqAG0UUUAFLSUtABS0lFAC0UlLQAUUUUAT0tJS0AFFFFABRRRQAUUUUALRRRQAUUUUAFFFFMAooooAKKKKACiiigAooooASlopKACloooAKSlpKQBRS0lABRRRQAUUUUAFFFFABSUtJQAUUtJQAUUUUAFJS0UAJRRRQAUUUUAJRRRQAUUUUAJQaWkoASiiigYUUUUAFFFFABRRRQAlFFLQAUUUUAJRRRQIKKKKACiiigAooooAKKKKACiikoAKRqdTT0oAbRRRQAUUUUALRRRQAUtJRQAtFFJQBYpaSloAKKKKACiiigApaKSgBaKKKACiiigAooopgFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRSASilpKACiiigAooooAKKKKAEopaSgAooooAKKKKACkpaSgAooooASiiigAooooGFJS0lAAaSlpKACiiigAoopKAFooooASiiigApaSigAooooAKKKKBBRRRQAUUUUAFFFBoAKKKSgApDS0GgBlFFFABRRRQAtFJS0AFFFFAC0lFFAFmiiigAooooAKKKKAFooooAKKKKACiiigAooopgFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRSAKKKKAEopaSgAooooAKKKKACkpaSgAooooAKKKKACkpaSgAooooGFJS0UCEooooGFJS0UAJSUtFACUUUUAJRS0lABS0lFABRRRQAUUUUAFFFFABRRRQIKKKKACiiigAooooASlpKKACilpDQAw0lKetFABRRRQAUtJS0AFFFFABRRRQBZooooAKKKKACloooAKKKKACiiigAooopgFFFFABRRS0AJRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFIBKKKKACiiigAooooASilpKACiiigAooooASiiigYUlLRQIKSiigAooooGJRS0lACGig0UAFJRRQAUUUUAFFFFABRRRQAUUUUAFFFFAgooooAKKSloASlpKKBhRRRQIKKKKAGtTac1NoAKKKKAFpaSigBaKKKACiiigCzRRRQAtJRS0AFFFFABRRRQAUUUUwCiiigAooooAKWkpaAEoopaAEooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKQBSUtFACUUUUAFFFFABSUtJQAUUUUAFFFFACUUtJQMKKKKBBSUtJQAUUUUDCkoooAKSlpDQAlFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFJRQAUUUUALSUUUCCiiigAooooARulMp56UygAooooAKWkpaAClpKKAFooooAs0UUUALRRRQAUUUUAFFFFABRRRTAKKKKACiiigAoopaACiiigBKKWigBKKKKACiiigAooooAKKKKACiiigAooooAKKKKQBSUtJQAUUUUAFFFFABSUtFACUUUUAFFFFAwpKWkoAKKKKACkpaSgQUUUUDEopaSgAoopKACkpaSgAooooAKKKKACikpaACikooAKKKKACiiigAooooAKKKKACiikoELRRSUDCmU+mHrQAlLSUUALS0lFAhaKKKACiiigC1RRRQAtFFFABRRRQAUUUUAFFFFMAooooAWiikoAWiikoAWkpaKACkpaKAEopaKAEopaSgAopaSgAooooAKKKKACiiigAooooAKKKKQCUUUUAFFFFABRRRQAlFFFABRRRQMKKKSgAooooEFFFFACUUtJQMKSlpKACiiigBKSnU2gAooooAKSlpKACiiigAooooAKKKKACiiigAooooAKKSloAKSlooAKSiigApjdafTGoASiiigApaSloEFLSUtABRRRQBaoopaACiiigAooooAKKKKYBRRRQAUtFFABSUtFABRRRQAUUUUAFFFFABSUtFACUUUUAFFFLQAlFLRQAlFLSUAFFFFABRRRQAUUUUAFJS0lIAooooAKKKKACkoooAKKKKACkpaKBiUUtJQIKKKKACkpaSgYUlLSUAFFFFACUGiigBKSlpKACiiigAooooAKKKKACkLAUjHAqvnJoAm81acHDdKr9qbjB4NAFuikU5HNLQAUUUUAFFFFABRRSUALTWp1NPSgBtFFFABRSUtAC0UUUAFLSUUAW6WkpaBBRRRQAUUUUAFLSUUwClpKWgAooooAKSlooAKKKKACiiigAooooAKKKKACiiigAoopKAFooooAKSlpKACiiigAooooAKKKKACkoooAKKKKQBRSUmaAHUhoyKTIzigBRRRSUALRRRQAUlFFABRRRQAUlLSUAFJS0UAJRRRQMSilpDQAhpKWkoAKKKKACiiigAopKKAAjIqExEdDU1FAEOw0qxepqWigAooooAKKKKACiiigApKWkoAKQ9KWg0AR0UUUALRSUtABS0lLQAUUUUAW6WkpaBBRRRQAUUUUwClpKKACilooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKSlooASiiigAooozQAlLSE0Zx1oAKSjIpjyKO9AD80E1CZVx96o2uEA+9mgCwSKF56VSe7UdBmomunPTikBpnimGWNfvMKyjNIern86ZuNAGv50Z6Gk89RWTuNLuoA1hMh70olQ/xVk7zTvNbFAGqHB6U4GskTyDoaf8AaX70AadFZouj3WpBdj0NAF6kqot0pNSLcoe9AE9FNDg9MUuaAFpDR1oNACUUUUDEpKWg0AJRRSUAFFFFABRRRQAUUUUAFFFFABRRRQAUUlFABRRRQAUUUUAFFFJQAw0Up60lABRRRQAtLTaWgApaKKALlFFFAgooooAKKKKYBS0UUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAlFLRQAlITihjgVXkmAyWPSgCVnC8k1C9woHNVJbgk8DmoCWY5JpAWXus+tQmYmojSUAPLk96aTmkooAKKKKACiikoAWiiigAooooAXNGaKKADNLSUtABRkilooAcszKMCpkuG7tVajNAGikgPWpQwx1rLWRlPBqdLk/xUAXutGKijlVhxUmaACiiigYlJSmkoAKKKKACiiigAooooAKKSigAooooAKKKKACiiigAooooAKSiigBrUlK9NoAWiiigBaKSloAKKKKALtFFFAgooooAKKKWgBKWiimAlLRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUmaACmscc5oLCopmGzigCGe4PTpVN3yc0+fvVfNIB3ekJptGaAFNJRRQAUUUlAC0UlFAC0UlLQAUUUUAFFFFABS0lLQAUUuaKADmiiigBKKWkoAKWkozQA5WIPBqxFcEcMaq0tAGkjhqeKzUkKnrVqKfcOTQBYNJRuzSUDFopKKAClpKKACiiigAooooAKKKKACiiigAopKKACiiigAooooAa3Sm089KZQAUUUUALRRRQAtFJRQBeooooEFFFFABS0lFAC0UlLTAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACjFFJQAtJRQTQAUUmT2xTf94mgBxJ7Co2k28tUc0iqOCaqGXuTn60AXDMG6AVFJJgYFVHlB6U3zDSAeWLAgmq5pxbmmk0AJRRRQAUUUUAFFFFABRRRQAUUUUAFFLSUALRSUUALRRRQAUtFJmgBaXNJmigAooooAKSiloASloooAM04Ng8U2igC3FKCOetWQciswEircMmRigCxRTQaWgYtFFJQAtFFFABRSUtABRSUUALSUUUAFFFFABRRRQAUUUUAIaZT6ZQAUUlLQAUtJRQAtFFFAF6iiigQUUUUAFFFFMApaKSgBaKKKACiiigAooooAKKKKACiiigAooooAKKKKACkpaKAEopTUMsgUZoAezBRknA9aoz3eciP8zUM87OcE1BmkA5nLck0wmjNJQAuaSiigApKDRQAUUUUAFFFLQAlFLRQAUlLSUDCiiloASilpKBC0lFFAC0UlFAC0UUUAFGaKWgBOaWikoAWikpaADFGKKKACjNFFABmnKcGm0UAXIZcjBqcVnoxU8Vbjk3CgCWikzS0DCiiigAooooAKKKKACiiigAoopKAFpKKKAFpKKKACmHrTqRqAG0UUUALRRRQAUtJS0AXqKKKBBRRRQAUUUUwFpKKWgAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKQ0ANZsDJNZl1PvfC9BVm7mwpVTWaTk0gDrSUUUAFFJRQAUUUUAFFFFABRRSgUAJSgUuKXFIYmKMU7FGKAsNxRin4pCKB2G0lOxRigQ2ilooASilooAbRS4opiCiiigAozRRQAUUUUAFLQKKACiijNABRRRQAUUlFACg1LG+DUNKDQBoLzTqrRPgVYBzQMWilpKAFopKKAFopKKQBRRRTAKKKKACiiigAopKWgBKRqWkPSgBtFFJQAtLSUUALRRRQBfopKWgQUUUUAFFFFMBaKSloAKKSigBaKSloAKKSloAKKKKACiiigAooooAKSlooAaTUcj4WnsfeqdyxHegCrO2WxUJNK3vTaQBRRRQAlFFFABRRRQAUUUtAABTgKAKeBSGhuKULUgWnhaRViICnBak208LQOxDtpCtWNtNK0AV9tJtqcrTSMUCsQ7aTbU2KNuaAsQ4oxUpSkxTFYixSVLikZaAsR0Yp2KSgQ3FGKdRigBKMUYpaYCYpKWigQUUUYoAKKMUlAC0lLmkoAKKKKAJI22mrqkEAis8GrML8c0AWaKQGigYtFFFIAooooAKKSigBaKSimAUUUUAFFFFABSHpRRQAyiiigBaKSloAKKKKAL9LSUtAgooopgFFFFABRRRQAtJRS0AJRRRQAUtFJQAtFJS0AFFFFABRRRQAUlLSE0AMYYGSQBWfcSDJx0q1O+AazZGLHJoAYTk0lFFIApKKKAFpKWkoAKKWigBKcBSYp4pDFUVKq0iCplFIpIAtOApQKdikMbinijFKBQMQ0mKfijFAEWKTbUpFJigCPaaaBU1JQBCwpu2piKbimIhK0mKmxSbaAsQEYpCKnK1EVxQFhmKTFSYpMUxWGUlPIpMUCsNxRTsUmKBCUYpaKYCUhFOpKAG0UpFJQAUUUUCCnqcUylBoAuRvmpAaqxnnFWQaBjqKSlpAFFFFABRRRQAUUUlMBaKSigBaSiigAooooAYaKU9aSgApaSigBaKKKAL9LSUtMQUUUUAFFFFABRRRQAUUUUCCiiigYUtFFACUtJS0AFFFFABRRRQAGmNwOKcaY/pQBRuCQOeapGrl2x+7VKkAUlLRQAlLRRQAGkpaKACilooABT1FNAqVBSKRKi1KBTVFSAVJQYpRSiigYU4CkFOoAQUuKKWgBuKMU6igBu2k20/FGKAIytNK1NimlaAIcUm2pitNxQBERTSuamIpuKYELLTCKsFaYRQIhxRinkUmKAsR4oxTiKMUxDMUUtFArDcUU7FJigBtIaeRTSKBDaSnEU2gBaKSlpgPRsGraNmqQPNWIW4xQIsUUUUDCiiikAtJRRQAUUUUAFFFFMAopKKACiiigBDSUppKACiiloAKKKKANCikpaYgooooAKKKKACiiigAooooEFFFFAwpaSigApaKKACiikoAWiiigAqKTPapaY7BVJxQBl3J5x6VWNT3JJfJ61BSASiiloAKKSloAKUCkpw4oADSUUooGOUVMgqJanUVLKRKKeKaop4pFBSiiloAKWkpaQC0UlKKBi0UUUxBS0UUAGKQinUYoAYRTStS4pMUAQkUhFSkUhFAEWKaRUpFNIpgQkU0ipSKbigCIikxUhWk20BYiIoxTytJigVhtBFOxS44oCxHimkVNjNNZaBWISKbUxSoytMTQ2kpxFNoELUkbYIqOlB5piLynIyKdVeFuoqegYtFJRQAtFJUcme1ICTIozUNKqnOaAJaKKKACiiimAUUUlAAaSlpKACloFFABS0lLg0AXqWkpaBBRRRTAKKKKACiiigQUUUUAFFFFABRRRQAUUUUALRSUUAFLRRQAVHIRg56VJUUo3LjtQMyZjukJqI1NPtDEL0qGkAlFLSUAFKKSlFAC0GikoAKeBTRTxSGPSp1qJRiplpMpEgp4poFOpFC0UUUgFooooAWgUUtAwpaKKYBS0lLQIKWkpRQAUlLRQAhppFPpDTAjxSEU/FJQMjIphFTYpuKQEWKTFS4ppFAEZFMIqfFN20ARgUYqQCjFAiMDBpXXinMORT8ZFAFcCmstWNtNK0AU2GKYasSJUFUiGhtLRQKYiWM/MKtA1TQ4NW16UAOooopAFFFFABRSUUALRSUUALRSUUAFFFFMAp+1aZUgHFABgUcUoWl20CE4oJpdooxQBaopKWgAooopgFFFFABRRRQIKKKKACiiigAooooAKKKKAClpKKAFooooAKilJCnjNS1HL900DMiblzUVTzEDIUVBSAKSlooASloFFAC9qSigUAKKkUUwVIopDRKtSrUaCplpFoeKWkpaQxaKSloAWlpKWkAUtJS0ALRSUtMBaKBRQAUtFFABRRRTAKSlpKAEpKdSUDG4pMU+kxSAZiginYpMUANxTcVJikxQAwClxTsUYoAjIp2KcRRigBmKQin4pKBETLkVTdcGr5FVbhcYpoT2KxoFKaSqMxwq1G2RVUdKsRdKQyaikooAWikooAKKKKACiiigAooooAKKKKYBUiZ21FU0X3cUALg0uDTqKAG4oxTqDQBNRRRQIWiiimAUUUUAFFFFAgooooAKKKKACiiigAooooAKKKKAClopKAFpjjIp9NYUAZVyvzZxVatK5j4zWew5pDG0lLRQAUUlLQAUCilFIY4VItRipUFDGiValFMUVIKkodS0lFAxaWkooAdRSUUALS0lKKAFpaSloABS0UUwFooooAWiikoAKKKKACkpaKAEpKdSUDExSU6kpAJikp1JQAmKKWigBKSlooAbSU6m0CGmoJhkVYNRSDIoAomm0402rMxy1Zjqug5q2BxQ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euapcYFKoOSQelNMDVVh1FOzWfHMyhQec9KsLcIepxg81VybFoUpUKBk1EJUP8QpxPPBzQA/FJnBoB4pKYDuv1pj+tKP1oYZB9aAKw4cHtmrg6VTkx5T8ciprWUSRD1HWkBJJgxkGocYA96nPWo8ZX6UARmmHmnE000wIpPu1T71cm5WqdSxoWiilpDCmmnU00gEpRSUooAUUtIKWmMSloooEFJS0lAC0UUlAC0UUUAJS0UUAFFFFABRRRQAUUUUAXqaaWkrIgY/3TVVqtP9w1VNNDQ2ilpKooWikpaACko60tMApKWkNAxRS0gooELRRRQAlAoooAKKKKACiiigApKWigAooooAKKKSgYUUUCgBaKWkoAKKKKBBSGlooGNopSKSgBKKWikAlLRRQAUUUUAFFFFABRmijFMApaSigQ4MRg56UocgEetMooGTLMQwJHbFOE+EUcgg81BRQBb+1YLbWOO1PS8bOGANUaPpRcVjVW5jbB5FS71I4Oc1jBmGOacspByOtUpCsaL8t14IxVeNzFJkdOhpn2klcHk561JKwlTeh57incLGgCCMimjvVezm3IVPUVYA5NAiBuGIpvepZBzUZ9aYEMvSqZq5L0qoetSxoKKB0paQwpppxpppAFApKWgYtFFFAhaKSimAtFJSigApKWigAooooASlopKAFooooAKKKKACiiigC4aQ8UtIayII5PuGq1WZPuGq1NDQUGiiqKEooooAUUUClpgFJS0lAwooooELRRRQAUlLSd6ACilpKACilpKACiiigAooooAKSiigYUCilFAC0lLSUAFFFFAhaKKSgANJS0GgYlFFLQAhFJTqQigBKWkpRQAUYpaKAEooNFAC4pMUtFADaWloxQA2ilxRigBKWjFFABRRRigQUqsRSUUATQTeXKGPTvWpGwYgg8EVi9KmgnaJs9e1NMLGpKAMCoGGDUiyrIFweccimyCqJK7jNVGHJq43TFVZB81JlIYKdTe9OqQDtTaXtTaAFpaQUtABRRRQAUUUUxhRRRQIKWkooAWkpaSgBaKSigBaSiloAKKKKACig0UAXe1MNOpjGsiBr/dNVqmkPy1DVIpBRRRTGJRS0mKAAU6m0opjFpKKKAEpaSloELRRSUAFBooNABRRRQAUUUUAFFFFABRRRQAlFFFAwFOpBS0AJRRRQIKKKKAFoopKAFpKWigBtApTSUDFooooAQikp1IRQAoopKUUAFJilooASlFFJQA6kxRS0AJRRRQAtJS0UAJRRS0AJikpaWgQ2jFLRmgY+KUoc960FkEiA9DjkVl1LFIVOe46U0yWi3J0zVSWrW4OuarSDmmwRFSg8UlAqRi0006mmgBaWkFLQAUUUUAFFFFMAooooAKWkooAKKKKACiiigBaQ0UUAFFFFAC0UUUAWz0qJm9KkY4FQE1mSNc9BTaVutNqikFFFFABRRRQMSlFIaKYDqSiigBKWjvQKBC0lLRQAlBoooABRSUtAC0lFFABRQaKACkoooAKWkpRQMKWikJoAWkoFFABRRRQIWkpaSgBaKKKBiUlOpDQAlKKSigBwopBS0ANIopxptACilpop1ABSUtFADaWiigBaSiloASlopKAFpKM0tABRRRQAUmKWigBKOlLRQIkjfac0yR9xpucU7GVp3AAh2huxoYYAIpYj1Q96OmVNIBtIetAo70ALRRRQAUUUUAFFFFMAooooAKKKKACiiikAUUUUwCiiigApaSigBaKKKALDnioe1SSHtUTHjFZkobSUUVRQUUlFAC0UUlAxaSiimAopaaKWgANAoooEFFLSUAFFFFABRR3ooAKKKKACiiigAooooAMUtFFAxKQUUtABRRRQAUUUUALRRRQIKKKKACiiigY00UppKAClpKWgBaMUUUANopxpKAFopKWgBKKWigBtLRSUAOopBS5oASilpDQAUtJQDQA6kozRQAUlLRQIQ05DxikpPegAJw2R2qR/mAYVEOc0+JsZU96AG98jpS0HhiKM0AFFFFABRRRQAUUUUwCiiloASgUtFACUUvekoAKKKKACiiigAooo7UALSUtFAD3PNRmnNTTUAJSUtFMBKKWigYUlFGaACikpRTASnUUlAC0UUUCFpKKKACiiigApRSGigAooooAKKKWgBKWkooAKDRSGgAFLRRQAUUUtAxKKKKAFooooASiigUALSUtFABTadSGgBKKKKAFFLTaUUALRRRQAlFLSUALRSUtACUUtJQAlLQaSgBc0tJRQAtJS0UAJRS0lABS0UUAFJRRQAL96hhzSGn9QDQAwClHWnU00ALRQOlFAgzRRRQAUUUUwAUUUUAFFFFIBaSiimAUUUUgCiiimAUUUUAFFFFAATSGg0VICUtJRQMKKKKACkNLSd6AFApcUUUwCkNLRQAgpaSloAKKKKBBRRRQAGgUUUAFFFFABRRRQAUUUUAFJSmkFAxaKKKACiiigAooooAKKKWgBKKKKAFpKKKBC0hpaSgYlFFFABRRRQAtLSCloAKKKKAEpaKSgBaSiloAKSlpKACiiigApaSloAKQ0UUAApaaOtLQAUtJS0AIaF7ig0IcNQA4UlPNNPB4oAaOKWkIoFAC0UUUAFFFFMQUUUUDCiiigQUUGkoAWiiigAoopKAFooooAKKKKAEpKDRUjCiiloASiiigAoFBoFMBaKKKACiiigANIKWk70ALRRRQAUUUUCCiiigAooooAKKKKACiiigBDQKDQKBhmiigUALRRRQAUUUUAFFFLQAlFFFAhaSlpKACiiloGIaSlooASiiigApaSigB1FIKWgAooooAKKKKACkpTSUAFFFFABS0lLQAlFFFACGl60GkFADqKSloAShfvCloX71AD6aw7040HkUAMFN707vSHnpQAtBpBS0AFFFFABRRRTAKKKKAFpKKKQCUtFJQIWiiigAooooAKKKKAG0UUUhhRRRQAUUUUABooNApgLRRRQAUUUUAFBoooASlpKKAFoopKAFooooEFFFFABRRRQAUUUGgY2lFJS0AFJS0lAC0tIKWgAooooAWkpaSgAooooAKKWkoEFFFFAwooooAKSlpKACiiigBaKSloAWikpaACiiigQUlLSUDCiiigBaDRSGgAooooAKTvS0hoAdRSZpRQAUJ96ikBw1ACt6UIe1KRmhRigBG60DpQeTRQAnSiigUALRRRQAUUUUAFFFFABRRRQIKKKKBiUtJS0AJS9qSloEFBpKKAEooopDCiiigAooopgBooNFAC0UlLQAUUUUAFFJRQAUUUUAFFFFABS0lLQAUUUUAFFFFABSGlpKAEpRSUopAFJS0GmAlOFNpaAFooooEFFFFAwooooAKKKKAClpKKAFopKKACiiigBKKKKACiiigBaWm0tAC0UlFABRRRQAUtJRQAtJS0lABRRS0AFIaKKAEFLSUooAWkxS5pKAFBIoJoooAKSiigAoNFHagBaKQcUtABRRSUALRSUtABRRRQIKKKKACkpaSgAooooGFBoooEf/Z/9sAQwAFAwQEBAMFBAQEBQUFBgcMCAcHBwcPCwsJDBEPEhIRDxERExYcFxMUGhURERghGBodHR8fHxMX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'
            $scope.answer(base64);
            $mdDialog.cancel();
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
