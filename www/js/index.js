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
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.log('Device Ready');
        app.receivedEvent('deviceready');
        
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        app.configureBackgroundGeoLocation();
    },    
    log: function(message){
        var m = $('<div>').addClass('alert alert-success').html(message);
        $('#log').prepend(m);
    },
    
    configureBackgroundGeoLocation: function() {
        // Your app must execute AT LEAST ONE call for the current position via standard Cordova geolocation,
        //  in order to prompt the user for Location permission.
        window.navigator.geolocation.getCurrentPosition(function(location) {
            app.log('Location from Phonegap');
        });
        var bgGeo = window.plugins.backgroundGeoLocation;
        /**
        * This would be your own callback for Ajax-requests after POSTing background geolocation to your server.
        */
        var yourAjaxCallback = function(response) {
            ////
            // IMPORTANT:  You must execute the #finish method here to inform the native plugin that you're finished,
            //  and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
            // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
            //
            bgGeo.finish();
            //document.getElementById('app').innerHTML += "yourAjaxCallback is called <br>";
        };

        /**
        * This callback will be executed every time a geolocation is recorded in the background.
        */
        var callbackFn = function(location) {
            console.log('[js] BackgroundGeoLocation callback:  ' + location.latitudue + ',' + location.longitude);			
			var manualTickitUrl = 'http://dev.tickittaskit.com/flippadoo/mobile/tickitService/111234567/tickits';
			$.ajax({
				url: manualTickitUrl,
				type: "POST",
				dataType: 'json',
				cache: false,
				contentType: "application/json; charset=utf-8",
				processData: false,
				data: {                                         
					emailId: "kevin.wei@qdevinc.com",
					tickitType: "11",
					tickitStatus: "1",
					ip: "1.1.1.1",
					recipient: "chris@abc.com",
					subject: "WHAMI2 AUTO GPS",
					msgBody: ""+(new Date()).toLocaleString(),
					location: {
						longitude: location.latitudue,
						latitude: location.longitude
					}
				},
				success: function( data, textStatus, jqXHR ){
					//alert('registration id = '+e.regid);
				},
				error: function(jqXHR, textStatus, errorThrown){
				},
				complete: function(){
				}
			});
			yourAjaxCallback.call(this);
        };

        var failureFn = function(error) {
            console.log('BackgroundGeoLocation error');
        }
        
        // BackgroundGeoLocation is highly configurable.
        bgGeo.configure(callbackFn, failureFn, {
            url: 'http://dev.tickittaskit.com/flippadoo/mobile/tickitService/111234567/tickits', // <-- only required for Android; ios allows javascript callbacks for your http
            params: {                                               // HTTP POST params sent to your server when persisting locations.
				emailId: "kevin.wei@qdevinc.com",
				tickitType: "11",
				tickitStatus: "1",
				ip: "1.1.1.1",
				recipient: "chris@abc.com",
				subject: "WHAMI2 AUTO GPS",
				msgBody: "Created Automatically from Android"
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
        
        bgGeo.start();
    }
};
