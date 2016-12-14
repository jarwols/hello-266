var lat = null;
var lng = null;
var serial;
var inData;
var lastTapSeconds = 0;
var bpm = 0;
var beats = [];
var average = 0;
var final;
var count = 0;
var portName = '/dev/cu.usbmodem1411';

function preload(){
  hello = loadSound('audio/hello.m4a');
  born = loadSound('audio/born.m4a');
  candles = loadSound('audio/candles.m4a');
  cs = loadSound('audio/CS.m4a');
  foodie = loadSound('audio/foodie.m4a');
  fun_fact = loadSound('audio/fun_fact.m4a');
  riding = loadSound('audio/riding.m4a');
  first = true; 
  second = false;
  third = false;
  clickedX = 0;
  clickedY = 0;
}

function BPM() {
  var tapSeconds = new Date().getTime();
  bpm = ((1 / ((tapSeconds - lastTapSeconds) / 1000)) * 60);
  if(bpm > 150) bpm = 150;
  console.log(Math.floor(bpm));
  $("#bpm").text(Math.floor(bpm) + " BPM");
  var bpmLoc = $("#bpm").position;
  fill(colorAlpha('#fff', 0.4));
  stroke('#000');
  ellipse(1700, 92, bpm/1.5, bpm/1.5);
  lastTapSeconds = tapSeconds;
  beats.push(Math.floor(bpm));
  average *= count;
  average += Math.floor(bpm);
  count++;
  average /= count;

  if(beats.length >= 10) {
      // if(average < 70) {
      //   location.reload();
      // }
      console.log("Average " + average);
  }
};

function setup() {
  amplitude = new p5.Amplitude();
  createCanvas(window.innerWidth, window.innerHeight);
  addLocations();
  serial = new p5.SerialPort(); // make a new instance of the serialport library
  serial.on('list', printList);  // set a callback function for the serialport list event
  serial.on('connected', serverConnected); // callback for connecting to the server
  serial.on('open', portOpen);        // callback for the port opening
  serial.on('data', serialEvent);     // callback for when new data arrives
  serial.on('error', serialError);    // callback for errors
  serial.on('close', portClose);      // callback for the port closing
  var options = { baudrate: 115200 }; 
  serial.open(portName); // open a serial port
}

function serverConnected() {
  console.log('connected to server.');
}
 
function portOpen() {
  console.log('the serial port opened.')
}

function serialEvent() {
  inData = Number(serial.read());
  console.log(inData); 
}

function addLocations() {
  $.each(lastPlaces[0].segments, function(index, value) {
    console.log(value.place.name);
    console.log(value.place.location.lat + " " + value.place.location.lon);
    $("#locations").append("<div><h2 class='location'>" + value.place.name + "</h2><h3 class=location'>Arrival Time: " + value.startTime.substring(9) + " Departure Time: " + value.endTime.substring(9) + "</h3><h4 class='location'>Lat: " + value.place.location.lat + " Lng: " + value.place.location.lon + "</h4></div>");
  })
}

var lastPlaces = [
  {
    "date": "20161017",
    "segments": [
      {
        "type": "place",
        "startTime": "20161016T213709-0700",
        "endTime": "20161017T100900-0700",
        "place": {
          "id": 369362870,
          "name": "Home",
          "type": "home",
          "location": {
            "lat": 37.48944343186284,
            "lon": -122.2316222434193
          }
        },
        "lastUpdate": "20161017T181309Z"
      },
      {
        "type": "place",
        "startTime": "20161017T101119-0700",
        "endTime": "20161017T101918-0700",
        "place": {
          "id": 371343904,
          "name": "Redwood City Caltrain Station",
          "type": "unknown",
          "location": {
            "lat": 37.486222,
            "lon": -122.2322
          }
        },
        "lastUpdate": "20161017T181309Z"
      },
      {
        "type": "place",
        "startTime": "20161017T103514-0700",
        "endTime": "20161017T113127-0700",
        "place": {
          "id": 371053357,
          "name": "Stanford Art Gallery",
          "type": "unknown",
          "location": {
            "lat": 37.428,
            "lon": -122.16745
          }
        },
        "lastUpdate": "20161017T184357Z"
      },
      {
        "type": "place",
        "startTime": "20161017T113741-0700",
        "endTime": "20161017T115840-0700",
        "place": {
          "id": 369300986,
          "name": "Sigma Nu",
          "type": "facebook",
          "facebookPlaceId": "147437265281001",
          "location": {
            "lat": 37.422303271429,
            "lon": -122.16840076857
          }
        },
        "lastUpdate": "20161017T185842Z"
      },
      {
        "type": "place",
        "startTime": "20161017T124741-0700",
        "endTime": "",
        "place": {
          "id": 369300986,
          "name": "Stanford Art Gallery",
          "type": "facebook",
          "facebookPlaceId": "147437265281001",
          "location": {
            "lat": 37.428,
            "lon": -122.16745
          }
        },
        "lastUpdate": "20161017T185842Z"
      }
    ],
    "lastUpdate": "20161017T185842Z"
  }
];

function serialError(err) {
  console.log('Something went wrong with the serial port. ' + err);
}
 
function portClose() {
  console.log('The serial port closed.');
}

// get the list of ports:
function printList(portList) {
 // portList is an array of serial port names
 for (var i = 0; i < portList.length; i++) {
 // Display the list the console:
 console.log(i + " " + portList[i]);
 }
}

function colorAlpha(aColor, alpha) {
  var c = color(aColor);
  return color('rgba(' +  [red(c), green(c), blue(c), alpha].join(',') + ')');
}

function draw() {
  fill(255);
  var level = amplitude.getLevel();
  var size = map(level, 0, 1, 0, 5000);
  if(first) {
	// stroke(colorAlpha('#000', 0.1));
  noStroke();
	fill(colorAlpha('#FF2600', 0.1));
    // filter(BLUR,1);
  	ellipse(width/2, height/2, size, size);
  }

  var distance = dist(mouseX, mouseY, (width/2 + size), (height/2 + size));

  if(!first) {
	stroke(colorAlpha('#000', 0.1));
	fill(colorAlpha('#FF2600', 0.1));
    ellipse(clickedX, clickedY, size, size);
  }

  if(second && !first) {
	stroke(colorAlpha('#000', 0.1));
	fill(colorAlpha('#FF2600', 0.1));
    ellipse(clickedX, clickedY, size, size);
  }
}

function getRandomInRange(from, to, fixed) {
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
}

function breakdown() {
	lat = getRandomInRange(-180, 180, 3);
	lng = getRandomInRange(-180, 180, 3);
	x = getRandomInRange(0, window.innerWidth, 1);
  y = getRandomInRange(0, window.innerHeight, 1);
  var level = amplitude.getLevel();
	var size = map(level, 0, 1, 0, 5000);
	mapp.setZoom(5);
	mapp.setCenter({lat: lat, lng: lng, alt: 0, zoom: 10});
	var colors = ['#FF69B4', '#00CCFF', '#2ecc71', '#f1c40f', '#e74c3c'];
	var color = colors[Math.floor(Math.random() * colors.length)];
    fill(color);
    stroke(color);
    ellipse(x, y, size, size);
    setTimeout(function() {
    	fun_fact.play();
    	setTimeout(function() {
    		breakdown();
    	}, 1000);
    	setTimeout(function() {
    		breakdown();
    	}, 2000);
    	setTimeout(function() {
    		breakdown();
    	}, 3000);
    }, 5000); 
}

function mouseClicked(){
  // if(second && !first) {
  // 	breakdown(); 
  // }	
  // if(!first) {
  //   assignSecondKey();
  // }
  // if(first) {
  //   assignFirstKey(false);
  // }
}

// setTimeout(function() {
//   assignFirstKey(true);
// }, 8000);

// setTimeout(function() {
//   assignSecondKey(true);
// }, 16000);

// setTimeout(function() {
//   breakdown();
// }, 26000);

function assignFirstKey(state) {
  if(state) {
    clickedX = (window.innerWidth)/2;
    clickedY = (window.innerHeight)/2;
  } else {
    clickedX = mouseX;
    clickedY = mouseY;
  }
  first = false;
  // hello.play();
  born.play();  
  navigator.geolocation.getCurrentPosition(function(position) {
    var locationMarker = null;
    if (locationMarker){
      return;
    }

    lat = position.coords["latitude"];
    lng = position.coords["longitude"];

    console.log(lat, lng);

	// map_marker = new google.maps.Marker({position: {lat: lat, lng: lng}, map: mapp});
	mapp.setCenter({lat: lat, lng: lng, alt: 0});

  });
}

$(document).keypress(function(e){
 if (key ==='H' || key ==='L') { // if the user presses H or L
  serial.write(key);              // send it out the serial port
 }
});

function assignSecondKey(state) {
  if(state) {
    clickedX = (window.innerWidth)/2;
    clickedY = (window.innerHeight)/2;
  } else {
    clickedX = mouseX;
    clickedY = mouseY;
  }
  second = true;
  // hello.play();
  // born.play();  
  riding.play();

  lat = 37.759298;
  lng = -122.427074;

  mapp.setCenter({lat: lat, lng: lng, alt: 0});
}

// sets your location as default
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    var locationMarker = null;
    if (locationMarker){
      return;
    }

    lat = 51.574688;
    lng = -0.167862;

   console.log(lat, lng);

   mapp = new google.maps.Map(document.getElementById('map-canvas'), {
  zoom: 13,
  center: {lat: lat, lng : lng, alt: 0},
  styles: [
    {
        "featureType": "all",
        "elementType": "all",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType":"landscape.natural",
        "elementType":"all",
        "stylers":[
            {
                "visibility": "on"
            },
            {
                "color":"#212121"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#0f0"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels",
        "stylers": [
            {
                "weight": 0.1
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#0f0f0f"
            },
            {
                "weight": 0.87
            }
        ]
    }
]           
	});

	// map_marker = new google.maps.Marker({position: {lat: lat, lng: lng}, map: mapp});
	// map_marker.setMap(mapp);

  },
  function(error) {
    console.log("Error: ", error);
  },
  {
    enableHighAccuracy: true
  }
  );
}

function pubs() {
  console.log("pubbing");
}