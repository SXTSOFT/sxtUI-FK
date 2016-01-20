/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    appDir:function(){
      return cordova.file.dataDirectory+'app';
    },
    getUrl:function(url){
      return encodeURI('http://10.245.9.151:3000/'+url);
    },
    download:function(url,win,fail){
      var versionTransFer = new FileTransfer();
      versionTransFer.download(app.getUrl(url),app.appDir()+'/'+url,win,fail,false,{
        headers:{
          "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
        }
      });
    },
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);

      try {
        app.download('version.json', function (entry) {
          entry.file(function(file){
            var reader = new FileReader();
            reader.onloadend = function (ev) {
              var version =  JSON.parse(ev.target.result);

              alert(ev.target.result);

            };
            reader.readAsText(file, "UTF-8");
          },function(error){
            alert(error.code);
          })
        }, function (error) {
          alert('error:'+JSON.stringify(error));
        });
        console.log('Received Event: ' + id);
      }catch(ex){
        alert(JSON.stringify(ex));
      }
    }
};
