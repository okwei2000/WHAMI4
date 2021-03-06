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
        //app.onDeviceReady();
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.log('Device Ready');
        $('#btn-start').on('click', app.startTracking);
        $('#btn-stop').on('click', app.stopTracking);
        $('#btn-stop').attr('disabled', 'disabled');
        StatusBar.overlaysWebView(false);
        StatusBar.backgroundColorByHexString("#000000");
        app.configureBackgroundGeoLocation();
    },
    log: function(message){
        var currentdate = new Date(); 
        var datetime = currentdate.getFullYear() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getDate() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
                
        var m = $('<div>').addClass('alert alert-success').html(datetime+": "+message);
        $('#log').prepend(m);
    },
    startTracking: function(){
		var bgGeo = window.plugins.backgroundGeoLocation;
		bgGeo.start();
        app.log('Tracking Started');
        $('#btn-start').attr('disabled', 'disabled'); 
        $('#btn-stop').removeAttr('disabled');        
    },
    stopTracking: function(){
		var bgGeo = window.plugins.backgroundGeoLocation;
		bgGeo.stop();  
        app.log('Tracking Stopped');
        $('#btn-stop').attr('disabled', 'disabled'); 
        $('#btn-start').removeAttr('disabled');        
    },
    configureBackgroundGeoLocation: function() {
        // Your app must execute AT LEAST ONE call for the current position via standard Cordova geolocation,
        //  in order to prompt the user for Location permission.
        window.navigator.geolocation.getCurrentPosition(function(location) {
            app.log('First Location Request');
        });
        var bgGeo = window.plugins.backgroundGeoLocation;

        /**
        * This callback will be executed every time a geolocation is recorded in the background.
        */
        var callbackFn = function(location) {
            app.log('Location:  ' + location.latitude + ',' + location.longitude);	
            ////
            // IMPORTANT:  You must execute the #finish method here to inform the native plugin that you're finished,
            //  and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
            // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
            //
            bgGeo.finish();   

			$.ajax({
				url: 'http://qdevinc.com/test/requestDump',
                type: "POST",
                dataType: 'json',
                data: JSON.stringify({
                    location:{
                        latitude: location.latitude,
                        longitude: location.longitude
                    }
                }),
                contentType: "application/json; charset=utf-8",                   
				cache: false,			
				success: function( data, textStatus, jqXHR ){
				},
				error: function(jqXHR, textStatus, errorThrown){
				},
				complete: function(){
				}
			})            
        };

        var failureFn = function(error) {
            app.log('BackgroundGeoLocation error');
        }
        
        // BackgroundGeoLocation is highly configurable.
        bgGeo.configure(callbackFn, failureFn, {
            url: 'http://qdevinc.com/test/requestDump', // <-- only required for Android; ios allows javascript callbacks for your http
            params: {                                               // HTTP POST params sent to your server when persisting locations.
            },
            headers: {
            },
            desiredAccuracy: 50,
            stationaryRadius: 20,
            distanceFilter: 30,
            notificationTitle: 'WHAMI Tracking',   // <-- android only, customize the title of the notification
            notificationText: 'Enabled',                // <-- android only, customize the text of the notification
            activityType: "AutomotiveNavigation",       // <-- iOS-only
            debug: true     // <-- enable this hear sounds for background-geolocation life-cycle.
        });
        
        app.log('GeoTracking Configured');
    }
};
