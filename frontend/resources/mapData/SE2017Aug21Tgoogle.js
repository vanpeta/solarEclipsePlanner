
var gPrevLat = 0;
var gPrevLng = 0;
var gCurrentMarker = null;

/* Insert Eclipse Besselian Elements below */

//
// Eclipse Elements
//
// First line -
//   (0) Julian date
//   (1) t0
//   (2) tmin
//   (3) tmax
//   (4) dT
// Second line -
//   (5) X0, X1, X2, X3 - X elements
// Third line -
//   (9) Y0, Y1, Y2, Y3 - Y elements
// Fourth line -
//   (13) D0, D1, D2 - D elements
// Fifth line -
//   (16) M0, M1, M2 - mu elements
// Sixth line -
//   (19) L10, L11, L12 - L1 elements
// Seventh line -
//   (22) L20, L21, L22 - L2 elements
// Eighth line -
//   (25) tan f1
//   (26) tan f2
//

var elements = new Array(
//*** #0U - Input Besselian Elements here
2457987.268521,  18.0,  -4.0,   4.0,    68.4,
   -0.12957627,    0.54064089,   -0.00002930,   -0.00000809,
    0.48541746,   -0.14163940,   -0.00009049,    0.00000205,
   11.86696720,   -0.01362158,   -0.00000249,
   89.24544525,   15.00393677,    0.00000149,
    0.54211175,    0.00012407,   -0.00001177,
   -0.00402530,    0.00012346,   -0.00001172,
    0.00462223,    0.00459921
);

/* End Besselian Elements */

var map;
var markers = new Array();
var mouselat, mouselng;

function createMarker(point) {
  var currentLng = point.lng();
  var currentLat = point.lat();
  document.getElementById('hiddenLat').textContent= currentLat;
  document.getElementById('hiddenLng').textContent= currentLng;

  var i;
  var markericon = new GIcon(G_DEFAULT_ICON, "../resources/images/marker.png");
  var marker = new GMarker(point, {icon: markericon, draggable: true});
  gCurrentMarker = marker;
  GEvent.addListener(marker, "mouseover", function() {
    gCurrentMarker = null;
    for (i = 0; i < markers.length; i ++) {
      if (marker == markers[i])
        gCurrentMarker = marker;
    }
    marker.openInfoWindowHtml(loc_circ(marker.getPoint().lat(), marker.getPoint().lng()));
    document.getElementById("locCircShow").disabled = false;
  });
  GEvent.addListener(marker, "dragstart", function() {
    map.closeInfoWindow();
  });
  GEvent.addListener(marker, "dragend", function() {
    marker.openInfoWindowHtml(loc_circ(marker.getPoint().lat(), marker.getPoint().lng()));
    document.getElementById("locCircShow").disabled = false;
  });
  GEvent.addListener(marker, "infowindowclose", function() {
    document.getElementById("locCircShow").disabled = true;
  });
  map.addOverlay(marker);
  marker.openInfoWindowHtml(loc_circ(marker.getPoint().lat(), marker.getPoint().lng()));
  document.getElementById("locCircShow").disabled = false;
  markers[markers.length] = marker;
  return;
}

function clearMarkers() {
  var i;
  for (i = 0; i < markers.length; i ++)
    map.removeOverlay(markers[i]);
  map.closeInfoWindow();
  markers = new Array();
}

function clearMarker() {
  var i;
  for (i = 0; i < markers.length; i ++) {
    if (gCurrentMarker == markers[i]) {
      map.removeOverlay(markers[i]);
      markers.splice(i, 1);
      document.getElementById("distValue").innerHTML = "";
      break;
    }
  }
  map.closeInfoWindow();
}

function wheelZoom(a) {
  if (a.cancelable)
    a.preventDefault();
  if (a.detail || -a.wheelDelta) {
    var latlng = new GLatLng(mouselat,mouselng);
    if ((a.detail || -a.wheelDelta) < 0)
      map.zoomIn(latlng, false, true);
    else if ((a.detail || -a.wheelDelta) > 0)
      map.zoomOut(latlng, true);
  }
  return false;
}

function locCircShow() {
  locCirc = window.open();
  locCirc.location = "../loccirc.html";
  locCirc.name = "loccirc";
  var a = new Array();
  a[0] = "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"";
  a[1] = "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n<html xmlns=\"";
  a[2] = "http://www.w3.org/1999/xhtml\">\n\n<head>\n   <meta http-equiv=\"Content-Language\" ";
  a[3] = "content=\"en-us\" />\n   <meta http-equiv=\"Content-Type\" content=\"text/html; ";
  a[4] = "charset=UTF-8\" />\n   <meta name=\"author\" content=\"F. Espenak\" />\n   ";
  a[5] = "<meta name=\"keywords\" content=\"eclipse, solar\" />\n   <meta name=\"description\" ";
  a[6] = "content=\"This is part of NASA's official eclipse home page. It plots solar eclipse ";
  a[7] = "paths on Google Earth maps.\" />\n   \n   <!--  xxxxx BROWSER TITLE GOES HERE  -->\n   ";
  a[8] = "<title>NASA - Google Map of Solar Eclipse<";
  a[9] = "/title>\n<";
  a[10] = "/head>\n<body id=\"start\">\n";
  a[11] = "<h2>" + document.getElementsByTagName("title").item(0).innerHTML + " - Local Circumstances</h2>";
  a[12] = document.getElementById("mapmarker").innerHTML;
  a[13] = "\n<p>Eclipse predictions courtesy of Fred Espenak, NASA's GSFC.</p>\n";
  a[14] = "\n<p>This page may be saved or printed.</p>\n</body>\n\n</html>";
  var b;
  for (b = 0; b < a.length; b++)
    locCirc.document.write(a[b]);
  // locCirc.document.getElementById("start").appendChild(c);
  // locCirc.document.getElementsByTagName("body").item(0).appendChild(c);
  locCirc.document.close();
}

function onLoad() {
  map = new GMap2(document.getElementById("map"), {draggableCursor: 'crosshair'});
  // Map Controls
  map.addControl(new GLargeMapControl());
  map.addControl(new GMapTypeControl());
  map.addControl(new GScaleControl());
  // map.enableScrollWheelZoom();
  map.enableContinuousZoom();
  GEvent.addDomListener(document.getElementById("map"), "DOMMouseScroll", wheelZoom); // Firefox
  GEvent.addDomListener(document.getElementById("map"), "mousewheel", wheelZoom); // IE

  // Event Listeners
  //
  // Event listeners are registered with =GEvent.addListener=. In this example,
  // we echo the lat/lng of the center of the map after it is dragged or moved
  // by the user.

  GEvent.addListener(map, "moveend", function() {
    var center = map.getCenter();
    var latLngStr = "(" + latitudeToString(center.lat().toFixed(5)) + ", " + longitudeToString(center.lng().toFixed(5)) + ")";
    document.getElementById("mapCenter").innerHTML = latLngStr;
  });

 // Limit the zoom level
 var maxZoomLevel = 13; // Set the maximum zoom level here (integer from 0 to 20 maximum zoom)
 GEvent.addListener(map, "zoomend", function(oldZoom, newZoom) {
   if (newZoom > maxZoomLevel)
   {
     var zoom = 0;
     if (location.search.length > 1)
     {
       var argstr = location.search.substring(1, location.search.length);
       var args = argstr.split("&");
       for (var i = 0; i < args.length; i++)
       {
         if (args[i].substring(0, 5) == "zoom=")
           eval(unescape(args[i]));
       }
       if (zoom != 1)
         zoom = 0;
     }
     if (zoom == 0)
     {
       map.setZoom(maxZoomLevel);
       alert("The maximum zoom level on this map has been reached because of the finite resolution of the eclipse path data.\r\nYou can remove the limitation by appending ?zoom=1 to the URL address and reloading this page. ");
     }
   }
 });

  // Display lat/lng of the cursor under the map
  GEvent.addListener(map, "mousemove", function(point) {
    mouselat = point.lat().toFixed(6);
    mouselng = point.lng().toFixed(6);
    if ((gPrevLat != point.lat()) || (gPrevLng != point.lng())) {
      var latitude  = point.lat();
      var longitude = point.lng();
      if (longitude < -180)
        longitude += 360;
      else if (longitude > 180)
        longitude -= 360;
      var cursor = latitudeToString(latitude.toFixed(5)) + ", " + longitudeToString(longitude.toFixed(5));
      document.getElementById("latlngCursor").innerHTML = "(" + cursor + ")";
      gPrevLat = point.lat();
      gPrevLng = point.lng();
      if (markers.length > 0) {
      var lastpnt = markers[markers.length - 1].getLatLng();
    var kmDist = lastpnt.distanceFrom(point);
      kmDist = kmDist / 1000.0;
      var miDist = kmDist * 0.621371192;
    kmDist = kmDist.toFixed(2) + 'km (' + miDist.toFixed(2) + ' miles)';
    document.getElementById("distValue").innerHTML = kmDist;
    }
    }
  });

//*** #0V map.setCenter(new GLatLng(xx.xxxxxx,xxx.xxxxxx), 2, G_NORMAL_MAP);
     map.setCenter(new GLatLng( 36.966377,-87.670898), 3, G_NORMAL_MAP);

  map.zoomIn();
//  document.getElementById("deltaT").innerHTML = "&Delta;T = " + elements[4] + " s";
  document.getElementById("locCircShow").disabled = true;

  var html = "";
  var gemarkericon = new GIcon(G_DEFAULT_ICON, "../resources/images/gemarker.png");
  var gemarker = new GMarker(map.getCenter(), {icon: gemarkericon, draggable: false});
  GEvent.addListener(gemarker, "mouseover", function() {
    gCurrentMarker = null;
    gemarker.openInfoWindowHtml(loc_circ(gemarker.getPoint().lat(), gemarker.getPoint().lng()));
    document.getElementById("locCircShow").disabled = false;
  });
  GEvent.addListener(gemarker, "infowindowclose", function() {
    document.getElementById("locCircShow").disabled = true;
  });
  map.addOverlay(gemarker);
  GEvent.addListener(map, "click", function(overlay, point) {
    if (point) {
      html = loc_circ(point.lat(), point.lng());
      if (html != "") {
        if (document.getElementById("showmarker").checked) {
           createMarker(point);
//           map.removeOverlay(marker);
        }
        else {
           var marker = new GMarker(point);
           map.addOverlay(marker);
           marker.openInfoWindowHtml(html);
           map.removeOverlay(marker);
        }
      }
    }
  });

//*** Greatest Duration marker ***
  var gdmarkericon = new GIcon(G_DEFAULT_ICON, "./resources/images/gdmarker.png");
  var gdmarker = new GMarker(new GLatLng( 37.576306, -89.110833), {icon: gdmarkericon, draggable: false});
  GEvent.addListener(gdmarker, "mouseover", function() {
    gCurrentMarker = null;
    gdmarker.openInfoWindowHtml(loc_circ(gdmarker.getPoint().lat(), gdmarker.getPoint().lng()));
    document.getElementById("locCircShow").disabled = false;
  });
  GEvent.addListener(gdmarker, "infowindowclose", function() {
    document.getElementById("locCircShow").disabled = true;
  });
  map.addOverlay(gdmarker);

// Insert TRACK.GOO (ex SHADOW.EXE) below here

/*  ++++++++++++++++++++++++++++++++++++++++++++++++++  */
/*  ++++++++++++++++++++++++++++++++++++++++++++++++++  */

//*** #0W - Input Solar Eclipse Path Data Here

// First GD Zone (~0.1s), Solar Eclipse of  2017 Aug 21
var polyline = new GPolyline([

new GLatLng(  38.09284,  -90.38159),
new GLatLng(  37.93992,  -90.00000),
new GLatLng(  37.73671,  -89.50000),
new GLatLng(  37.53027,  -89.00000),
new GLatLng(  37.32061,  -88.50000),
new GLatLng(  37.10775,  -88.00000),
new GLatLng(  37.03759,  -87.83673)],
"#FF00FF", 7, 0.30, {clickable: false});
map.addOverlay(polyline);

// Second GD Zone (~1.0s), Solar Eclipse of  2017 Aug 21
var polyline = new GPolyline([
new GLatLng(  39.17599,  -93.23560),
new GLatLng(  39.09060,  -93.00000),
new GLatLng(  38.90701,  -92.50000),
new GLatLng(  38.72013,  -92.00000),
new GLatLng(  38.52999,  -91.50000),
new GLatLng(  38.33657,  -91.00000),
new GLatLng(  38.13987,  -90.50000),
new GLatLng(  38.09284,  -90.38159)],
// "#FF8000", 8, 0.65, {clickable: false});
// "#9999FF", 8, 0.50, {clickable: false});
"#FF8000", 7, 0.40, {clickable: false});
map.addOverlay(polyline);

// Second GD Zone (~1.0s), Solar Eclipse of  2017 Aug 21
var polyline = new GPolyline([
new GLatLng(  37.03759,  -87.83673),
new GLatLng(  36.89172,  -87.50000),
new GLatLng(  36.67254,  -87.00000),
new GLatLng(  36.45025,  -86.50000),
new GLatLng(  36.22489,  -86.00000),
new GLatLng(  35.99649,  -85.50000),
new GLatLng(  35.85035,  -85.18335)],
// "#FF8000", 8, 0.65, {clickable: false});
"#FF8000", 7, 0.40, {clickable: false});
map.addOverlay(polyline);

// Third GD Zone (~2.0s), Solar Eclipse of  2017 Aug 21
var polyline = new GPolyline([
new GLatLng(  39.80509,  -95.03790),
new GLatLng(  39.79226,  -95.00000),
new GLatLng(  39.62173,  -94.50000),
new GLatLng(  39.44795,  -94.00000),
new GLatLng(  39.27090,  -93.50000),
new GLatLng(  39.17599,  -93.23560)],
//"#FFEE00", 8, 0.65, {clickable: false});
// "#77FF00", 8, 0.50, {clickable: false});
//"#9999FF", 8, 0.50, {clickable: false});
"#00FF00", 7, 0.50, {clickable: false});
map.addOverlay(polyline);

// Third GD Zone (~2.0s), Solar Eclipse of  2017 Aug 21
var polyline = new GPolyline([
new GLatLng(  35.85035,  -85.18335),
new GLatLng(  35.76511,  -85.00000),
new GLatLng(  35.53078,  -84.50000),
new GLatLng(  35.29358,  -84.00000),
new GLatLng(  35.10443,  -83.60547)],
//"#FFEE00", 8, 0.65, {clickable: false});
"#00FF00", 7, 0.50, {clickable: false});
map.addOverlay(polyline);

// Fourth GD Zone (~5.0s), Solar Eclipse of  2017 Aug 21
var polyline = new GPolyline([
new GLatLng(  40.95955,  -98.71796),
new GLatLng(  40.89593,  -98.50000),
new GLatLng(  40.74779,  -98.00000),
new GLatLng(  40.59652,  -97.50000),
new GLatLng(  40.44207,  -97.00000),
new GLatLng(  40.28443,  -96.50000),
new GLatLng(  40.12360,  -96.00000),
new GLatLng(  39.95955,  -95.50000),
new GLatLng(  39.80509,  -95.03790)],
//"#77FF00", 8, 0.65, {clickable: false});
//"#FF8000", 8, 0.50, {clickable: false});
//"#FF8000", 8, 0.50, {clickable: false});
//"#9999FF", 6, 0.40, {clickable: false});
"#00FFFF", 7, 0.50, {clickable: false});
map.addOverlay(polyline);

// Fourth GD Zone (~5.0s), Solar Eclipse of  2017 Aug 21
var polyline = new GPolyline([
new GLatLng(  35.10443,  -83.60547),
new GLatLng(  35.05354,  -83.50000),
new GLatLng(  34.81075,  -83.00000),
new GLatLng(  34.56527,  -82.50000),
new GLatLng(  34.31716,  -82.00000),
new GLatLng(  34.06651,  -81.50000),
new GLatLng(  33.81340,  -81.00000),
new GLatLng(  33.55792,  -80.50000),
new GLatLng(  33.50940,  -80.40546)],
//"#66FF00", 8, 0.65, {clickable: false});
"#00FFFF", 7, 0.50, {clickable: false});
map.addOverlay(polyline);


//*** #0W - Input Solar Eclipse Path Data Here
// First BLUE, Solar Eclipse of  2017 Aug 21 - Northern Limit
var polyline = new GPolyline([
new GLatLng(  39.48021, -171.43365),
new GLatLng(  39.99427, -171.74774),
new GLatLng(  40.04817, -171.50000),
new GLatLng(  40.15696, -171.00000),
new GLatLng(  40.26497, -170.50000),
new GLatLng(  40.37218, -170.00000),
new GLatLng(  40.47860, -169.50000),
new GLatLng(  40.58420, -169.00000),
new GLatLng(  40.68898, -168.50000),
new GLatLng(  40.79293, -168.00000),
new GLatLng(  40.89602, -167.50000),
new GLatLng(  40.99826, -167.00000),
new GLatLng(  41.09962, -166.50000),
new GLatLng(  41.20010, -166.00000),
new GLatLng(  41.29969, -165.50000),
new GLatLng(  41.39838, -165.00000),
new GLatLng(  41.49614, -164.50000),
new GLatLng(  41.59297, -164.00000),
new GLatLng(  41.68885, -163.50000),
new GLatLng(  41.78379, -163.00000),
new GLatLng(  41.87776, -162.50000),
new GLatLng(  41.97075, -162.00000),
new GLatLng(  42.06275, -161.50000),
new GLatLng(  42.15375, -161.00000),
new GLatLng(  42.24373, -160.50000),
new GLatLng(  42.33269, -160.00000),
new GLatLng(  42.42062, -159.50000),
new GLatLng(  42.50750, -159.00000),
new GLatLng(  42.59332, -158.50000),
new GLatLng(  42.67806, -158.00000),
new GLatLng(  42.76172, -157.50000),
new GLatLng(  42.84429, -157.00000),
new GLatLng(  42.92576, -156.50000),
new GLatLng(  43.00610, -156.00000),
new GLatLng(  43.08532, -155.50000),
new GLatLng(  43.16340, -155.00000),
new GLatLng(  43.24032, -154.50000),
new GLatLng(  43.31609, -154.00000),
new GLatLng(  43.39067, -153.50000),
new GLatLng(  43.46407, -153.00000),
new GLatLng(  43.53628, -152.50000),
new GLatLng(  43.60727, -152.00000),
new GLatLng(  43.67704, -151.50000),
new GLatLng(  43.74558, -151.00000),
new GLatLng(  43.81288, -150.50000),
new GLatLng(  43.87892, -150.00000),
new GLatLng(  43.94370, -149.50000),
new GLatLng(  44.00719, -149.00000),
new GLatLng(  44.06940, -148.50000),
new GLatLng(  44.13031, -148.00000),
new GLatLng(  44.18991, -147.50000),
new GLatLng(  44.24818, -147.00000),
new GLatLng(  44.30512, -146.50000),
new GLatLng(  44.36071, -146.00000),
new GLatLng(  44.41495, -145.50000),
new GLatLng(  44.46782, -145.00000),
new GLatLng(  44.51929, -144.50000),
new GLatLng(  44.56939, -144.00000),
new GLatLng(  44.61807, -143.50000),
new GLatLng(  44.66534, -143.00000),
new GLatLng(  44.71119, -142.50000),
new GLatLng(  44.75559, -142.00000),
new GLatLng(  44.79854, -141.50000),
new GLatLng(  44.84003, -141.00000),
new GLatLng(  44.88005, -140.50000),
new GLatLng(  44.91858, -140.00000),
new GLatLng(  44.95561, -139.50000),
new GLatLng(  44.99112, -139.00000),
new GLatLng(  45.02512, -138.50000),
new GLatLng(  45.05758, -138.00000),
new GLatLng(  45.08849, -137.50000),
new GLatLng(  45.11784, -137.00000),
new GLatLng(  45.14562, -136.50000),
new GLatLng(  45.17181, -136.00000),
new GLatLng(  45.19641, -135.50000),
new GLatLng(  45.21939, -135.00000),
new GLatLng(  45.24075, -134.50000),
new GLatLng(  45.26048, -134.00000),
new GLatLng(  45.27855, -133.50000),
new GLatLng(  45.29496, -133.00000),
new GLatLng(  45.30969, -132.50000),
new GLatLng(  45.32273, -132.00000),
new GLatLng(  45.33407, -131.50000),
new GLatLng(  45.34368, -131.00000),
new GLatLng(  45.35157, -130.50000),
new GLatLng(  45.35771, -130.00000),
new GLatLng(  45.36209, -129.50000),
new GLatLng(  45.36469, -129.00000),
new GLatLng(  45.36550, -128.50000),
new GLatLng(  45.36451, -128.00000),
new GLatLng(  45.36169, -127.50000),
new GLatLng(  45.35704, -127.00000),
new GLatLng(  45.35053, -126.50000),
new GLatLng(  45.34216, -126.00000),
new GLatLng(  45.33191, -125.50000),
new GLatLng(  45.31976, -125.00000),
new GLatLng(  45.30569, -124.50000),
new GLatLng(  45.28968, -124.00000),
new GLatLng(  45.27173, -123.50000),
new GLatLng(  45.25182, -123.00000),
new GLatLng(  45.22991, -122.50000),
new GLatLng(  45.20601, -122.00000),
new GLatLng(  45.18008, -121.50000),
new GLatLng(  45.15212, -121.00000),
new GLatLng(  45.12210, -120.50000),
new GLatLng(  45.09000, -120.00000),
new GLatLng(  45.05581, -119.50000),
new GLatLng(  45.01950, -119.00000),
new GLatLng(  44.98107, -118.50000),
new GLatLng(  44.94048, -118.00000),
new GLatLng(  44.89771, -117.50000),
new GLatLng(  44.85276, -117.00000),
new GLatLng(  44.80558, -116.50000),
new GLatLng(  44.75618, -116.00000),
new GLatLng(  44.70451, -115.50000),
new GLatLng(  44.65057, -115.00000),
new GLatLng(  44.59433, -114.50000),
new GLatLng(  44.53576, -114.00000),
new GLatLng(  44.47485, -113.50000),
new GLatLng(  44.41156, -113.00000),
new GLatLng(  44.34589, -112.50000),
new GLatLng(  44.27781, -112.00000),
new GLatLng(  44.20727, -111.50000),
new GLatLng(  44.13429, -111.00000),
new GLatLng(  44.05881, -110.50000),
new GLatLng(  43.98082, -110.00000),
new GLatLng(  43.90030, -109.50000),
new GLatLng(  43.81721, -109.00000),
new GLatLng(  43.73155, -108.50000),
new GLatLng(  43.64326, -108.00000),
new GLatLng(  43.55235, -107.50000),
new GLatLng(  43.45876, -107.00000),
new GLatLng(  43.36250, -106.50000),
new GLatLng(  43.26351, -106.00000),
new GLatLng(  43.16178, -105.50000),
new GLatLng(  43.05729, -105.00000),
new GLatLng(  42.95001, -104.50000),
new GLatLng(  42.83990, -104.00000),
new GLatLng(  42.72695, -103.50000),
new GLatLng(  42.61114, -103.00000),
new GLatLng(  42.49242, -102.50000),
new GLatLng(  42.37078, -102.00000),
new GLatLng(  42.24619, -101.50000),
new GLatLng(  42.11863, -101.00000),
new GLatLng(  41.98806, -100.50000),
new GLatLng(  41.85448, -100.00000),
new GLatLng(  41.71785,  -99.50000),
new GLatLng(  41.57814,  -99.00000),
new GLatLng(  41.43536,  -98.50000),
new GLatLng(  41.28944,  -98.00000),
new GLatLng(  41.14040,  -97.50000),
new GLatLng(  40.98820,  -97.00000),
new GLatLng(  40.83282,  -96.50000),
new GLatLng(  40.67424,  -96.00000),
new GLatLng(  40.51246,  -95.50000),
new GLatLng(  40.34744,  -95.00000),
new GLatLng(  40.17919,  -94.50000),
new GLatLng(  40.00767,  -94.00000),
new GLatLng(  39.83289,  -93.50000),
new GLatLng(  39.65485,  -93.00000),
new GLatLng(  39.47351,  -92.50000),
new GLatLng(  39.28888,  -92.00000),
new GLatLng(  39.10096,  -91.50000),
new GLatLng(  38.90975,  -91.00000),
new GLatLng(  38.71525,  -90.50000),
new GLatLng(  38.51747,  -90.00000),
new GLatLng(  38.31641,  -89.50000),
new GLatLng(  38.11208,  -89.00000),
new GLatLng(  37.90450,  -88.50000),
new GLatLng(  37.69368,  -88.00000),
new GLatLng(  37.47964,  -87.50000),
new GLatLng(  37.26242,  -87.00000),
new GLatLng(  37.04203,  -86.50000),
new GLatLng(  36.81851,  -86.00000),
new GLatLng(  36.59190,  -85.50000),
new GLatLng(  36.36223,  -85.00000),
new GLatLng(  36.12955,  -84.50000),
new GLatLng(  35.89392,  -84.00000),
new GLatLng(  35.65537,  -83.50000),
new GLatLng(  35.41398,  -83.00000),
new GLatLng(  35.16981,  -82.50000),
new GLatLng(  34.92291,  -82.00000),
new GLatLng(  34.67338,  -81.50000),
new GLatLng(  34.42128,  -81.00000),
new GLatLng(  34.16669,  -80.50000),
new GLatLng(  33.90970,  -80.00000),
new GLatLng(  33.65041,  -79.50000),
new GLatLng(  33.38890,  -79.00000),
new GLatLng(  33.12529,  -78.50000),
new GLatLng(  32.85966,  -78.00000),
new GLatLng(  32.59214,  -77.50000),
new GLatLng(  32.32283,  -77.00000),
new GLatLng(  32.05183,  -76.50000),
new GLatLng(  31.77929,  -76.00000),
new GLatLng(  31.50532,  -75.50000),
new GLatLng(  31.23004,  -75.00000),
new GLatLng(  30.95357,  -74.50000),
new GLatLng(  30.67605,  -74.00000),
new GLatLng(  30.39761,  -73.50000),
new GLatLng(  30.11837,  -73.00000),
new GLatLng(  29.83847,  -72.50000),
new GLatLng(  29.55805,  -72.00000),
new GLatLng(  29.27723,  -71.50000),
new GLatLng(  28.99615,  -71.00000),
new GLatLng(  28.71493,  -70.50000),
new GLatLng(  28.43372,  -70.00000),
new GLatLng(  28.15264,  -69.50000),
new GLatLng(  27.87181,  -69.00000),
new GLatLng(  27.59137,  -68.50000),
new GLatLng(  27.31144,  -68.00000),
new GLatLng(  27.03214,  -67.50000),
new GLatLng(  26.75358,  -67.00000),
new GLatLng(  26.47589,  -66.50000),
new GLatLng(  26.19917,  -66.00000),
new GLatLng(  25.92353,  -65.50000),
new GLatLng(  25.64909,  -65.00000),
new GLatLng(  25.37592,  -64.50000),
new GLatLng(  25.10414,  -64.00000),
new GLatLng(  24.83384,  -63.50000),
new GLatLng(  24.56510,  -63.00000),
new GLatLng(  24.29801,  -62.50000),
new GLatLng(  24.03264,  -62.00000),
new GLatLng(  23.76908,  -61.50000),
new GLatLng(  23.50740,  -61.00000),
new GLatLng(  23.24765,  -60.50000),
new GLatLng(  22.98992,  -60.00000),
new GLatLng(  22.73424,  -59.50000),
new GLatLng(  22.48067,  -59.00000),
new GLatLng(  22.22928,  -58.50000),
new GLatLng(  21.98010,  -58.00000),
new GLatLng(  21.73318,  -57.50000),
new GLatLng(  21.48855,  -57.00000),
new GLatLng(  21.24626,  -56.50000),
new GLatLng(  21.00632,  -56.00000),
new GLatLng(  20.76878,  -55.50000),
new GLatLng(  20.53366,  -55.00000),
new GLatLng(  20.30098,  -54.50000),
new GLatLng(  20.07076,  -54.00000),
new GLatLng(  19.84302,  -53.50000),
new GLatLng(  19.61777,  -53.00000),
new GLatLng(  19.39502,  -52.50000),
new GLatLng(  19.17478,  -52.00000),
new GLatLng(  18.95706,  -51.50000),
new GLatLng(  18.74187,  -51.00000),
new GLatLng(  18.52921,  -50.50000),
new GLatLng(  18.31907,  -50.00000),
new GLatLng(  18.11146,  -49.50000),
new GLatLng(  17.90638,  -49.00000),
new GLatLng(  17.70382,  -48.50000),
new GLatLng(  17.50377,  -48.00000),
new GLatLng(  17.30623,  -47.50000),
new GLatLng(  17.11120,  -47.00000),
new GLatLng(  16.91865,  -46.50000),
new GLatLng(  16.72859,  -46.00000),
new GLatLng(  16.54100,  -45.50000),
new GLatLng(  16.35587,  -45.00000),
new GLatLng(  16.17318,  -44.50000),
new GLatLng(  15.99293,  -44.00000),
new GLatLng(  15.81509,  -43.50000),
new GLatLng(  15.63965,  -43.00000),
new GLatLng(  15.46660,  -42.50000),
new GLatLng(  15.29593,  -42.00000),
new GLatLng(  15.12760,  -41.50000),
new GLatLng(  14.96162,  -41.00000),
new GLatLng(  14.79795,  -40.50000),
new GLatLng(  14.63658,  -40.00000),
new GLatLng(  14.47750,  -39.50000),
new GLatLng(  14.32068,  -39.00000),
new GLatLng(  14.16611,  -38.50000),
new GLatLng(  14.01378,  -38.00000),
new GLatLng(  13.86365,  -37.50000),
new GLatLng(  13.71571,  -37.00000),
new GLatLng(  13.56994,  -36.50000),
new GLatLng(  13.42633,  -36.00000),
new GLatLng(  13.28485,  -35.50000),
new GLatLng(  13.14549,  -35.00000),
new GLatLng(  13.00822,  -34.50000),
new GLatLng(  12.87303,  -34.00000),
new GLatLng(  12.73989,  -33.50000),
new GLatLng(  12.60880,  -33.00000),
new GLatLng(  12.47972,  -32.50000),
new GLatLng(  12.35265,  -32.00000),
new GLatLng(  12.22756,  -31.50000),
new GLatLng(  12.10444,  -31.00000),
new GLatLng(  11.98326,  -30.50000),
new GLatLng(  11.86401,  -30.00000),
new GLatLng(  11.74666,  -29.50000),
new GLatLng(  11.63121,  -29.00000),
new GLatLng(  11.51764,  -28.50000),
new GLatLng(  11.40592,  -28.00000),
new GLatLng(  11.29603,  -27.50000),
new GLatLng(  11.25949,  -27.33136),
new GLatLng(  10.78189,  -27.55219)],
"#3300FF", 2, 0.65, {clickable: false});
map.addOverlay(polyline);

// Second BLUE, Solar Eclipse of  2017 Aug 21 - Southern Limit
var polyline = new GPolyline([
new GLatLng(  39.48021, -171.43365),
new GLatLng(  39.57129, -171.00000),
new GLatLng(  39.67529, -170.50000),
new GLatLng(  39.77851, -170.00000),
new GLatLng(  39.88094, -169.50000),
new GLatLng(  39.98257, -169.00000),
new GLatLng(  40.08340, -168.50000),
new GLatLng(  40.18341, -168.00000),
new GLatLng(  40.28259, -167.50000),
new GLatLng(  40.38092, -167.00000),
new GLatLng(  40.47840, -166.50000),
new GLatLng(  40.57501, -166.00000),
new GLatLng(  40.67075, -165.50000),
new GLatLng(  40.76560, -165.00000),
new GLatLng(  40.85954, -164.50000),
new GLatLng(  40.95257, -164.00000),
new GLatLng(  41.04468, -163.50000),
new GLatLng(  41.13585, -163.00000),
new GLatLng(  41.22607, -162.50000),
new GLatLng(  41.31534, -162.00000),
new GLatLng(  41.40363, -161.50000),
new GLatLng(  41.49094, -161.00000),
new GLatLng(  41.57727, -160.50000),
new GLatLng(  41.66257, -160.00000),
new GLatLng(  41.74688, -159.50000),
new GLatLng(  41.83015, -159.00000),
new GLatLng(  41.91237, -158.50000),
new GLatLng(  41.99355, -158.00000),
new GLatLng(  42.07367, -157.50000),
new GLatLng(  42.15270, -157.00000),
new GLatLng(  42.23065, -156.50000),
new GLatLng(  42.30751, -156.00000),
new GLatLng(  42.38326, -155.50000),
new GLatLng(  42.45788, -155.00000),
new GLatLng(  42.53137, -154.50000),
new GLatLng(  42.60372, -154.00000),
new GLatLng(  42.67491, -153.50000),
new GLatLng(  42.74494, -153.00000),
new GLatLng(  42.81378, -152.50000),
new GLatLng(  42.88144, -152.00000),
new GLatLng(  42.94789, -151.50000),
new GLatLng(  43.01313, -151.00000),
new GLatLng(  43.07715, -150.50000),
new GLatLng(  43.13993, -150.00000),
new GLatLng(  43.20146, -149.50000),
new GLatLng(  43.26173, -149.00000),
new GLatLng(  43.32073, -148.50000),
new GLatLng(  43.37844, -148.00000),
new GLatLng(  43.43486, -147.50000),
new GLatLng(  43.48997, -147.00000),
new GLatLng(  43.54377, -146.50000),
new GLatLng(  43.59623, -146.00000),
new GLatLng(  43.64735, -145.50000),
new GLatLng(  43.69712, -145.00000),
new GLatLng(  43.74553, -144.50000),
new GLatLng(  43.79255, -144.00000),
new GLatLng(  43.83817, -143.50000),
new GLatLng(  43.88240, -143.00000),
new GLatLng(  43.92522, -142.50000),
new GLatLng(  43.96661, -142.00000),
new GLatLng(  44.00656, -141.50000),
new GLatLng(  44.04506, -141.00000),
new GLatLng(  44.08209, -140.50000),
new GLatLng(  44.11765, -140.00000),
new GLatLng(  44.15171, -139.50000),
new GLatLng(  44.18428, -139.00000),
new GLatLng(  44.21534, -138.50000),
new GLatLng(  44.24486, -138.00000),
new GLatLng(  44.27285, -137.50000),
new GLatLng(  44.29928, -137.00000),
new GLatLng(  44.32414, -136.50000),
new GLatLng(  44.34743, -136.00000),
new GLatLng(  44.36913, -135.50000),
new GLatLng(  44.38921, -135.00000),
new GLatLng(  44.40768, -134.50000),
new GLatLng(  44.42452, -134.00000),
new GLatLng(  44.43970, -133.50000),
new GLatLng(  44.45323, -133.00000),
new GLatLng(  44.46508, -132.50000),
new GLatLng(  44.47523, -132.00000),
new GLatLng(  44.48369, -131.50000),
new GLatLng(  44.49043, -131.00000),
new GLatLng(  44.49543, -130.50000),
new GLatLng(  44.49868, -130.00000),
new GLatLng(  44.50016, -129.50000),
new GLatLng(  44.49988, -129.00000),
new GLatLng(  44.49778, -128.50000),
new GLatLng(  44.49389, -128.00000),
new GLatLng(  44.48816, -127.50000),
new GLatLng(  44.48059, -127.00000),
new GLatLng(  44.47116, -126.50000),
new GLatLng(  44.45986, -126.00000),
new GLatLng(  44.44666, -125.50000),
new GLatLng(  44.43156, -125.00000),
new GLatLng(  44.41452, -124.50000),
new GLatLng(  44.39555, -124.00000),
new GLatLng(  44.37460, -123.50000),
new GLatLng(  44.35168, -123.00000),
new GLatLng(  44.32676, -122.50000),
new GLatLng(  44.29982, -122.00000),
new GLatLng(  44.27084, -121.50000),
new GLatLng(  44.23981, -121.00000),
new GLatLng(  44.20671, -120.50000),
new GLatLng(  44.17150, -120.00000),
new GLatLng(  44.13420, -119.50000),
new GLatLng(  44.09475, -119.00000),
new GLatLng(  44.05314, -118.50000),
new GLatLng(  44.00937, -118.00000),
new GLatLng(  43.96339, -117.50000),
new GLatLng(  43.91520, -117.00000),
new GLatLng(  43.86476, -116.50000),
new GLatLng(  43.81207, -116.00000),
new GLatLng(  43.75709, -115.50000),
new GLatLng(  43.69981, -115.00000),
new GLatLng(  43.64020, -114.50000),
new GLatLng(  43.57823, -114.00000),
new GLatLng(  43.51389, -113.50000),
new GLatLng(  43.44715, -113.00000),
new GLatLng(  43.37799, -112.50000),
new GLatLng(  43.30639, -112.00000),
new GLatLng(  43.23231, -111.50000),
new GLatLng(  43.15574, -111.00000),
new GLatLng(  43.07664, -110.50000),
new GLatLng(  42.99500, -110.00000),
new GLatLng(  42.91078, -109.50000),
new GLatLng(  42.82397, -109.00000),
new GLatLng(  42.73454, -108.50000),
new GLatLng(  42.64247, -108.00000),
new GLatLng(  42.54772, -107.50000),
new GLatLng(  42.45027, -107.00000),
new GLatLng(  42.35009, -106.50000),
new GLatLng(  42.24717, -106.00000),
new GLatLng(  42.14146, -105.50000),
new GLatLng(  42.03295, -105.00000),
new GLatLng(  41.92161, -104.50000),
new GLatLng(  41.80742, -104.00000),
new GLatLng(  41.69034, -103.50000),
new GLatLng(  41.57036, -103.00000),
new GLatLng(  41.44745, -102.50000),
new GLatLng(  41.32158, -102.00000),
new GLatLng(  41.19273, -101.50000),
new GLatLng(  41.06087, -101.00000),
new GLatLng(  40.92598, -100.50000),
new GLatLng(  40.78804, -100.00000),
new GLatLng(  40.64702,  -99.50000),
new GLatLng(  40.50291,  -99.00000),
new GLatLng(  40.35567,  -98.50000),
new GLatLng(  40.20530,  -98.00000),
new GLatLng(  40.05178,  -97.50000),
new GLatLng(  39.89508,  -97.00000),
new GLatLng(  39.73519,  -96.50000),
new GLatLng(  39.57209,  -96.00000),
new GLatLng(  39.40578,  -95.50000),
new GLatLng(  39.23623,  -95.00000),
new GLatLng(  39.06343,  -94.50000),
new GLatLng(  38.88738,  -94.00000),
new GLatLng(  38.70808,  -93.50000),
new GLatLng(  38.52551,  -93.00000),
new GLatLng(  38.33969,  -92.50000),
new GLatLng(  38.15059,  -92.00000),
new GLatLng(  37.95824,  -91.50000),
new GLatLng(  37.76263,  -91.00000),
new GLatLng(  37.56377,  -90.50000),
new GLatLng(  37.36168,  -90.00000),
new GLatLng(  37.15636,  -89.50000),
new GLatLng(  36.94784,  -89.00000),
new GLatLng(  36.73614,  -88.50000),
new GLatLng(  36.52129,  -88.00000),
new GLatLng(  36.30331,  -87.50000),
new GLatLng(  36.08223,  -87.00000),
new GLatLng(  35.85811,  -86.50000),
new GLatLng(  35.63097,  -86.00000),
new GLatLng(  35.40085,  -85.50000),
new GLatLng(  35.16783,  -85.00000),
new GLatLng(  34.93194,  -84.50000),
new GLatLng(  34.69324,  -84.00000),
new GLatLng(  34.45181,  -83.50000),
new GLatLng(  34.20771,  -83.00000),
new GLatLng(  33.96101,  -82.50000),
new GLatLng(  33.71180,  -82.00000),
new GLatLng(  33.46014,  -81.50000),
new GLatLng(  33.20614,  -81.00000),
new GLatLng(  32.94988,  -80.50000),
new GLatLng(  32.69146,  -80.00000),
new GLatLng(  32.43098,  -79.50000),
new GLatLng(  32.16854,  -79.00000),
new GLatLng(  31.90425,  -78.50000),
new GLatLng(  31.63823,  -78.00000),
new GLatLng(  31.37059,  -77.50000),
new GLatLng(  31.10144,  -77.00000),
new GLatLng(  30.83092,  -76.50000),
new GLatLng(  30.55913,  -76.00000),
new GLatLng(  30.28621,  -75.50000),
new GLatLng(  30.01229,  -75.00000),
new GLatLng(  29.73749,  -74.50000),
new GLatLng(  29.46194,  -74.00000),
new GLatLng(  29.18578,  -73.50000),
new GLatLng(  28.90914,  -73.00000),
new GLatLng(  28.63214,  -72.50000),
new GLatLng(  28.35493,  -72.00000),
new GLatLng(  28.07763,  -71.50000),
new GLatLng(  27.80036,  -71.00000),
new GLatLng(  27.52326,  -70.50000),
new GLatLng(  27.24646,  -70.00000),
new GLatLng(  26.97007,  -69.50000),
new GLatLng(  26.69422,  -69.00000),
new GLatLng(  26.41903,  -68.50000),
new GLatLng(  26.14461,  -68.00000),
new GLatLng(  25.87108,  -67.50000),
new GLatLng(  25.59855,  -67.00000),
new GLatLng(  25.32712,  -66.50000),
new GLatLng(  25.05689,  -66.00000),
new GLatLng(  24.78797,  -65.50000),
new GLatLng(  24.52044,  -65.00000),
new GLatLng(  24.25440,  -64.50000),
new GLatLng(  23.98993,  -64.00000),
new GLatLng(  23.72712,  -63.50000),
new GLatLng(  23.46604,  -63.00000),
new GLatLng(  23.20676,  -62.50000),
new GLatLng(  22.94936,  -62.00000),
new GLatLng(  22.69391,  -61.50000),
new GLatLng(  22.44045,  -61.00000),
new GLatLng(  22.18905,  -60.50000),
new GLatLng(  21.93976,  -60.00000),
new GLatLng(  21.69264,  -59.50000),
new GLatLng(  21.44772,  -59.00000),
new GLatLng(  21.20504,  -58.50000),
new GLatLng(  20.96465,  -58.00000),
new GLatLng(  20.72657,  -57.50000),
new GLatLng(  20.49084,  -57.00000),
new GLatLng(  20.25749,  -56.50000),
new GLatLng(  20.02654,  -56.00000),
new GLatLng(  19.79802,  -55.50000),
new GLatLng(  19.57193,  -55.00000),
new GLatLng(  19.34830,  -54.50000),
new GLatLng(  19.12715,  -54.00000),
new GLatLng(  18.90847,  -53.50000),
new GLatLng(  18.69229,  -53.00000),
new GLatLng(  18.47860,  -52.50000),
new GLatLng(  18.26741,  -52.00000),
new GLatLng(  18.05872,  -51.50000),
new GLatLng(  17.85254,  -51.00000),
new GLatLng(  17.64886,  -50.50000),
new GLatLng(  17.44769,  -50.00000),
new GLatLng(  17.24900,  -49.50000),
new GLatLng(  17.05281,  -49.00000),
new GLatLng(  16.85910,  -48.50000),
new GLatLng(  16.66787,  -48.00000),
new GLatLng(  16.47910,  -47.50000),
new GLatLng(  16.29279,  -47.00000),
new GLatLng(  16.10892,  -46.50000),
new GLatLng(  15.92748,  -46.00000),
new GLatLng(  15.74845,  -45.50000),
new GLatLng(  15.57184,  -45.00000),
new GLatLng(  15.39761,  -44.50000),
new GLatLng(  15.22576,  -44.00000),
new GLatLng(  15.05627,  -43.50000),
new GLatLng(  14.88912,  -43.00000),
new GLatLng(  14.72430,  -42.50000),
new GLatLng(  14.56179,  -42.00000),
new GLatLng(  14.40157,  -41.50000),
new GLatLng(  14.24362,  -41.00000),
new GLatLng(  14.08793,  -40.50000),
new GLatLng(  13.93449,  -40.00000),
new GLatLng(  13.78326,  -39.50000),
new GLatLng(  13.63423,  -39.00000),
new GLatLng(  13.48738,  -38.50000),
new GLatLng(  13.34270,  -38.00000),
new GLatLng(  13.20017,  -37.50000),
new GLatLng(  13.05976,  -37.00000),
new GLatLng(  12.92146,  -36.50000),
new GLatLng(  12.78525,  -36.00000),
new GLatLng(  12.65111,  -35.50000),
new GLatLng(  12.51903,  -35.00000),
new GLatLng(  12.38897,  -34.50000),
new GLatLng(  12.26093,  -34.00000),
new GLatLng(  12.13488,  -33.50000),
new GLatLng(  12.01081,  -33.00000),
new GLatLng(  11.88869,  -32.50000),
new GLatLng(  11.76852,  -32.00000),
new GLatLng(  11.65027,  -31.50000),
new GLatLng(  11.53392,  -31.00000),
new GLatLng(  11.41945,  -30.50000),
new GLatLng(  11.30685,  -30.00000),
new GLatLng(  11.19611,  -29.50000),
new GLatLng(  11.08719,  -29.00000),
new GLatLng(  10.98009,  -28.50000),
new GLatLng(  10.87478,  -28.00000),
new GLatLng(  10.78189,  -27.55219)],
"#3300FF", 2, 0.65, {clickable: false});
map.addOverlay(polyline);

// First RED, Solar Eclipse of  2017 Aug 21 - Central Line
var polyline = new GPolyline([
new GLatLng(  39.73712, -171.58990),
new GLatLng(  39.75632, -171.50000),
new GLatLng(  39.86309, -171.00000),
new GLatLng(  39.96908, -170.50000),
new GLatLng(  40.07430, -170.00000),
new GLatLng(  40.17872, -169.50000),
new GLatLng(  40.28234, -169.00000),
new GLatLng(  40.38515, -168.50000),
new GLatLng(  40.48712, -168.00000),
new GLatLng(  40.58826, -167.50000),
new GLatLng(  40.68855, -167.00000),
new GLatLng(  40.78798, -166.50000),
new GLatLng(  40.88652, -166.00000),
new GLatLng(  40.98419, -165.50000),
new GLatLng(  41.08095, -165.00000),
new GLatLng(  41.17681, -164.50000),
new GLatLng(  41.27174, -164.00000),
new GLatLng(  41.36573, -163.50000),
new GLatLng(  41.45879, -163.00000),
new GLatLng(  41.55090, -162.50000),
new GLatLng(  41.64202, -162.00000),
new GLatLng(  41.73218, -161.50000),
new GLatLng(  41.82134, -161.00000),
new GLatLng(  41.90950, -160.50000),
new GLatLng(  41.99664, -160.00000),
new GLatLng(  42.08275, -159.50000),
new GLatLng(  42.16783, -159.00000),
new GLatLng(  42.25186, -158.50000),
new GLatLng(  42.33483, -158.00000),
new GLatLng(  42.41673, -157.50000),
new GLatLng(  42.49754, -157.00000),
new GLatLng(  42.57725, -156.50000),
new GLatLng(  42.65586, -156.00000),
new GLatLng(  42.73335, -155.50000),
new GLatLng(  42.80970, -155.00000),
new GLatLng(  42.88492, -154.50000),
new GLatLng(  42.95898, -154.00000),
new GLatLng(  43.03188, -153.50000),
new GLatLng(  43.10360, -153.00000),
new GLatLng(  43.17413, -152.50000),
new GLatLng(  43.24346, -152.00000),
new GLatLng(  43.31158, -151.50000),
new GLatLng(  43.37849, -151.00000),
new GLatLng(  43.44415, -150.50000),
new GLatLng(  43.50857, -150.00000),
new GLatLng(  43.57173, -149.50000),
new GLatLng(  43.63363, -149.00000),
new GLatLng(  43.69424, -148.50000),
new GLatLng(  43.75356, -148.00000),
new GLatLng(  43.81158, -147.50000),
new GLatLng(  43.86828, -147.00000),
new GLatLng(  43.92366, -146.50000),
new GLatLng(  43.97770, -146.00000),
new GLatLng(  44.03039, -145.50000),
new GLatLng(  44.08171, -145.00000),
new GLatLng(  44.13167, -144.50000),
new GLatLng(  44.18024, -144.00000),
new GLatLng(  44.22741, -143.50000),
new GLatLng(  44.27317, -143.00000),
new GLatLng(  44.31751, -142.50000),
new GLatLng(  44.36042, -142.00000),
new GLatLng(  44.40188, -141.50000),
new GLatLng(  44.44189, -141.00000),
new GLatLng(  44.48043, -140.50000),
new GLatLng(  44.51748, -140.00000),
new GLatLng(  44.55304, -139.50000),
new GLatLng(  44.58710, -139.00000),
new GLatLng(  44.61963, -138.50000),
new GLatLng(  44.65064, -138.00000),
new GLatLng(  44.68010, -137.50000),
new GLatLng(  44.70801, -137.00000),
new GLatLng(  44.73434, -136.50000),
new GLatLng(  44.75909, -136.00000),
new GLatLng(  44.78225, -135.50000),
new GLatLng(  44.80380, -135.00000),
new GLatLng(  44.82373, -134.50000),
new GLatLng(  44.84202, -134.00000),
new GLatLng(  44.85867, -133.50000),
new GLatLng(  44.87365, -133.00000),
new GLatLng(  44.88695, -132.50000),
new GLatLng(  44.89856, -132.00000),
new GLatLng(  44.90847, -131.50000),
new GLatLng(  44.91666, -131.00000),
new GLatLng(  44.92312, -130.50000),
new GLatLng(  44.92783, -130.00000),
new GLatLng(  44.93077, -129.50000),
new GLatLng(  44.93194, -129.00000),
new GLatLng(  44.93132, -128.50000),
new GLatLng(  44.92889, -128.00000),
new GLatLng(  44.92463, -127.50000),
new GLatLng(  44.91854, -127.00000),
new GLatLng(  44.91058, -126.50000),
new GLatLng(  44.90076, -126.00000),
new GLatLng(  44.88905, -125.50000),
new GLatLng(  44.87543, -125.00000),
new GLatLng(  44.85989, -124.50000),
new GLatLng(  44.84241, -124.00000),
new GLatLng(  44.82299, -123.50000),
new GLatLng(  44.80158, -123.00000),
new GLatLng(  44.77818, -122.50000),
new GLatLng(  44.75277, -122.00000),
new GLatLng(  44.72533, -121.50000),
new GLatLng(  44.69585, -121.00000),
new GLatLng(  44.66430, -120.50000),
new GLatLng(  44.63067, -120.00000),
new GLatLng(  44.59493, -119.50000),
new GLatLng(  44.55707, -119.00000),
new GLatLng(  44.51706, -118.50000),
new GLatLng(  44.47490, -118.00000),
new GLatLng(  44.43053, -117.50000),
new GLatLng(  44.38398, -117.00000),
new GLatLng(  44.33519, -116.50000),
new GLatLng(  44.28415, -116.00000),
new GLatLng(  44.23084, -115.50000),
new GLatLng(  44.17524, -115.00000),
new GLatLng(  44.11732, -114.50000),
new GLatLng(  44.05707, -114.00000),
new GLatLng(  43.99446, -113.50000),
new GLatLng(  43.92946, -113.00000),
new GLatLng(  43.86206, -112.50000),
new GLatLng(  43.79222, -112.00000),
new GLatLng(  43.71994, -111.50000),
new GLatLng(  43.64516, -111.00000),
new GLatLng(  43.56789, -110.50000),
new GLatLng(  43.48809, -110.00000),
new GLatLng(  43.40574, -109.50000),
new GLatLng(  43.32080, -109.00000),
new GLatLng(  43.23327, -108.50000),
new GLatLng(  43.14310, -108.00000),
new GLatLng(  43.05028, -107.50000),
new GLatLng(  42.95477, -107.00000),
new GLatLng(  42.85656, -106.50000),
new GLatLng(  42.75562, -106.00000),
new GLatLng(  42.65191, -105.50000),
new GLatLng(  42.54543, -105.00000),
new GLatLng(  42.43612, -104.50000),
new GLatLng(  42.32399, -104.00000),
new GLatLng(  42.20898, -103.50000),
new GLatLng(  42.09109, -103.00000),
new GLatLng(  41.97029, -102.50000),
new GLatLng(  41.84654, -102.00000),
new GLatLng(  41.71983, -101.50000),
new GLatLng(  41.59013, -101.00000),
new GLatLng(  41.45741, -100.50000),
new GLatLng(  41.32165, -100.00000),
new GLatLng(  41.18284,  -99.50000),
new GLatLng(  41.04094,  -99.00000),
new GLatLng(  40.89593,  -98.50000),
new GLatLng(  40.74779,  -98.00000),
new GLatLng(  40.59652,  -97.50000),
new GLatLng(  40.44207,  -97.00000),
new GLatLng(  40.28443,  -96.50000),
new GLatLng(  40.12360,  -96.00000),
new GLatLng(  39.95955,  -95.50000),
new GLatLng(  39.79226,  -95.00000),
new GLatLng(  39.62173,  -94.50000),
new GLatLng(  39.44795,  -94.00000),
new GLatLng(  39.27090,  -93.50000),
new GLatLng(  39.09060,  -93.00000),
new GLatLng(  38.90701,  -92.50000),
new GLatLng(  38.72013,  -92.00000),
new GLatLng(  38.52999,  -91.50000),
new GLatLng(  38.33657,  -91.00000),
new GLatLng(  38.13987,  -90.50000),
new GLatLng(  37.93992,  -90.00000),
new GLatLng(  37.73671,  -89.50000),
new GLatLng(  37.53027,  -89.00000),
new GLatLng(  37.32061,  -88.50000),
new GLatLng(  37.10775,  -88.00000),
new GLatLng(  36.96638,  -87.67194),
new GLatLng(  36.89172,  -87.50000),
new GLatLng(  36.67254,  -87.00000),
new GLatLng(  36.45025,  -86.50000),
new GLatLng(  36.22489,  -86.00000),
new GLatLng(  35.99649,  -85.50000),
new GLatLng(  35.76511,  -85.00000),
new GLatLng(  35.53078,  -84.50000),
new GLatLng(  35.29358,  -84.00000),
new GLatLng(  35.05354,  -83.50000),
new GLatLng(  34.81075,  -83.00000),
new GLatLng(  34.56527,  -82.50000),
new GLatLng(  34.31716,  -82.00000),
new GLatLng(  34.06651,  -81.50000),
new GLatLng(  33.81340,  -81.00000),
new GLatLng(  33.55792,  -80.50000),
new GLatLng(  33.30016,  -80.00000),
new GLatLng(  33.04021,  -79.50000),
new GLatLng(  32.77817,  -79.00000),
new GLatLng(  32.51416,  -78.50000),
new GLatLng(  32.24827,  -78.00000),
new GLatLng(  31.98062,  -77.50000),
new GLatLng(  31.71132,  -77.00000),
new GLatLng(  31.44049,  -76.50000),
new GLatLng(  31.16825,  -76.00000),
new GLatLng(  30.89474,  -75.50000),
new GLatLng(  30.62006,  -75.00000),
new GLatLng(  30.34436,  -74.50000),
new GLatLng(  30.06776,  -74.00000),
new GLatLng(  29.79038,  -73.50000),
new GLatLng(  29.51238,  -73.00000),
new GLatLng(  29.23386,  -72.50000),
new GLatLng(  28.95497,  -72.00000),
new GLatLng(  28.67584,  -71.50000),
new GLatLng(  28.39661,  -71.00000),
new GLatLng(  28.11739,  -70.50000),
new GLatLng(  27.83832,  -70.00000),
new GLatLng(  27.55953,  -69.50000),
new GLatLng(  27.28113,  -69.00000),
new GLatLng(  27.00326,  -68.50000),
new GLatLng(  26.72604,  -68.00000),
new GLatLng(  26.44957,  -67.50000),
new GLatLng(  26.17398,  -67.00000),
new GLatLng(  25.89938,  -66.50000),
new GLatLng(  25.62587,  -66.00000),
new GLatLng(  25.35355,  -65.50000),
new GLatLng(  25.08253,  -65.00000),
new GLatLng(  24.81289,  -64.50000),
new GLatLng(  24.54474,  -64.00000),
new GLatLng(  24.27816,  -63.50000),
new GLatLng(  24.01323,  -63.00000),
new GLatLng(  23.75003,  -62.50000),
new GLatLng(  23.48863,  -62.00000),
new GLatLng(  23.22911,  -61.50000),
new GLatLng(  22.97153,  -61.00000),
new GLatLng(  22.71594,  -60.50000),
new GLatLng(  22.46243,  -60.00000),
new GLatLng(  22.21102,  -59.50000),
new GLatLng(  21.96178,  -59.00000),
new GLatLng(  21.71475,  -58.50000),
new GLatLng(  21.46996,  -58.00000),
new GLatLng(  21.22747,  -57.50000),
new GLatLng(  20.98730,  -57.00000),
new GLatLng(  20.74949,  -56.50000),
new GLatLng(  20.51406,  -56.00000),
new GLatLng(  20.28104,  -55.50000),
new GLatLng(  20.05046,  -55.00000),
new GLatLng(  19.82232,  -54.50000),
new GLatLng(  19.59665,  -54.00000),
new GLatLng(  19.37346,  -53.50000),
new GLatLng(  19.15276,  -53.00000),
new GLatLng(  18.93456,  -52.50000),
new GLatLng(  18.71887,  -52.00000),
new GLatLng(  18.50569,  -51.50000),
new GLatLng(  18.29503,  -51.00000),
new GLatLng(  18.08688,  -50.50000),
new GLatLng(  17.88125,  -50.00000),
new GLatLng(  17.67813,  -49.50000),
new GLatLng(  17.47752,  -49.00000),
new GLatLng(  17.27941,  -48.50000),
new GLatLng(  17.08380,  -48.00000),
new GLatLng(  16.89067,  -47.50000),
new GLatLng(  16.70002,  -47.00000),
new GLatLng(  16.51184,  -46.50000),
new GLatLng(  16.32612,  -46.00000),
new GLatLng(  16.14284,  -45.50000),
new GLatLng(  15.96200,  -45.00000),
new GLatLng(  15.78357,  -44.50000),
new GLatLng(  15.60754,  -44.00000),
new GLatLng(  15.43391,  -43.50000),
new GLatLng(  15.26264,  -43.00000),
new GLatLng(  15.09374,  -42.50000),
new GLatLng(  14.92717,  -42.00000),
new GLatLng(  14.76293,  -41.50000),
new GLatLng(  14.60099,  -41.00000),
new GLatLng(  14.44134,  -40.50000),
new GLatLng(  14.28396,  -40.00000),
new GLatLng(  14.12883,  -39.50000),
new GLatLng(  13.97593,  -39.00000),
new GLatLng(  13.82525,  -38.50000),
new GLatLng(  13.67677,  -38.00000),
new GLatLng(  13.53047,  -37.50000),
new GLatLng(  13.38632,  -37.00000),
new GLatLng(  13.24431,  -36.50000),
new GLatLng(  13.10442,  -36.00000),
new GLatLng(  12.96664,  -35.50000),
new GLatLng(  12.83094,  -35.00000),
new GLatLng(  12.69730,  -34.50000),
new GLatLng(  12.56570,  -34.00000),
new GLatLng(  12.43614,  -33.50000),
new GLatLng(  12.30858,  -33.00000),
new GLatLng(  12.18301,  -32.50000),
new GLatLng(  12.05941,  -32.00000),
new GLatLng(  11.93776,  -31.50000),
new GLatLng(  11.81804,  -31.00000),
new GLatLng(  11.70024,  -30.50000),
new GLatLng(  11.58434,  -30.00000),
new GLatLng(  11.47031,  -29.50000),
new GLatLng(  11.35815,  -29.00000),
new GLatLng(  11.24783,  -28.50000),
new GLatLng(  11.13934,  -28.00000),
new GLatLng(  11.03265,  -27.50000),
new GLatLng(  11.02052,  -27.44220)],
"#FF0000", 2, 1.00, {clickable: false});
map.addOverlay(polyline);


// YELLOW Solar Eclipse Time Line: 16.8333  1
var polyline = new GPolyline([
new GLatLng( 41.49508, -164.50537),
new GLatLng( 41.41995, -161.40747)],
"#FFFF00", 3, 0.60, {clickable: false});
map.addOverlay(polyline);

// YELLOW Solar Eclipse Time Line: 17.0000  2
var polyline = new GPolyline([
new GLatLng( 44.75150, -142.04675),
new GLatLng( 44.04787, -140.96259)],
"#FFFF00", 3, 0.60, {clickable: false});
map.addOverlay(polyline);

// YELLOW Solar Eclipse Time Line: 17.1667  3
var polyline = new GPolyline([
new GLatLng( 45.35072, -130.55939),
new GLatLng( 44.49923, -129.87073)],
"#FFFF00", 3, 0.60, {clickable: false});
map.addOverlay(polyline);

// YELLOW Solar Eclipse Time Line: 17.3333  4
var polyline = new GPolyline([
new GLatLng( 45.19812, -121.84369),
new GLatLng( 44.26688, -121.43414)],
"#FFFF00", 3, 0.60, {clickable: false});
map.addOverlay(polyline);

// YELLOW Solar Eclipse Time Line: 17.5000  5
var polyline = new GPolyline([
new GLatLng( 44.61150, -114.65057),
new GLatLng( 43.63641, -114.46887)],
"#FFFF00", 3, 0.60, {clickable: false});
map.addOverlay(polyline);

// YELLOW Solar Eclipse Time Line: 17.6667  6
var polyline = new GPolyline([
new GLatLng( 43.72671, -108.47223),
new GLatLng( 42.73146, -108.48297)],
"#FFFF00", 3, 0.60, {clickable: false});
map.addOverlay(polyline);

// YELLOW Solar Eclipse Time Line: 17.8333  7
var polyline = new GPolyline([
new GLatLng( 42.61849, -103.03137),
new GLatLng( 41.62005, -103.20557)],
"#FFFF00", 3, 0.60, {clickable: false});
map.addOverlay(polyline);

// YELLOW Solar Eclipse Time Line: 18.0000  8
var polyline = new GPolyline([
new GLatLng( 41.33312,  -98.14856),
new GLatLng( 40.34409,  -98.46112)],
"#FFFF00", 3, 0.60, {clickable: false});
map.addOverlay(polyline);

// YELLOW Solar Eclipse Time Line: 18.1667  9
var polyline = new GPolyline([
new GLatLng( 39.90087,  -93.69336),
new GLatLng( 38.93076,  -94.12231)],
"#FFFF00", 3, 0.60, {clickable: false});
map.addOverlay(polyline);

// YELLOW Solar Eclipse Time Line: 18.3333 10
var polyline = new GPolyline([
new GLatLng( 38.34167,  -89.56238),
new GLatLng( 37.39772,  -90.08862)],
"#FFFF00", 3, 0.60, {clickable: false});
map.addOverlay(polyline);

// YELLOW Solar Eclipse Time Line: 18.5000 11
var polyline = new GPolyline([
new GLatLng( 36.66806,  -85.66730),
new GLatLng( 35.75589,  -86.27417)],
"#FFFF00", 3, 0.60, {clickable: false});
map.addOverlay(polyline);

// YELLOW Solar Eclipse Time Line: 18.6667 12
var polyline = new GPolyline([
new GLatLng( 34.88657,  -81.92688),
new GLatLng( 34.01069,  -82.60028)],
"#FFFF00", 3, 0.60, {clickable: false});
map.addOverlay(polyline);

// YELLOW Solar Eclipse Time Line: 18.8333 13
var polyline = new GPolyline([
new GLatLng( 32.99832,  -78.26056),
new GLatLng( 32.16258,  -78.98871)],
"#FFFF00", 3, 0.60, {clickable: false});
map.addOverlay(polyline);

// YELLOW Solar Eclipse Time Line: 19.0000 14
var polyline = new GPolyline([
new GLatLng( 30.99862,  -74.58136),
new GLatLng( 30.20671,  -75.35474)],
"#FFFF00", 3, 0.60, {clickable: false});
map.addOverlay(polyline);

// YELLOW Solar Eclipse Time Line: 19.1667 15
var polyline = new GPolyline([
new GLatLng( 28.87565,  -70.78577),
new GLatLng( 28.13161,  -71.59735)],
"#FFFF00", 3, 0.60, {clickable: false});
map.addOverlay(polyline);

// YELLOW Solar Eclipse Time Line: 19.3333 16
var polyline = new GPolyline([
new GLatLng( 26.60702,  -66.73633),
new GLatLng( 25.91600,  -67.58221)],
"#FFFF00", 3, 0.60, {clickable: false});
map.addOverlay(polyline);

// YELLOW Solar Eclipse Time Line: 19.5000 17
var polyline = new GPolyline([
new GLatLng( 24.15191,  -62.22516),
new GLatLng( 23.52154,  -63.10657)],
"#FFFF00", 3, 0.60, {clickable: false});
map.addOverlay(polyline);

// YELLOW Solar Eclipse Time Line: 19.6667 18
var polyline = new GPolyline([
new GLatLng( 21.43017,  -56.87994),
new GLatLng( 20.87354,  -57.80927)],
"#FFFF00", 3, 0.60, {clickable: false});
map.addOverlay(polyline);

// YELLOW Solar Eclipse Time Line: 19.8333 19
var polyline = new GPolyline([
new GLatLng( 18.24721,  -49.82764),
new GLatLng( 17.79364,  -50.85608)],
"#FFFF00", 3, 0.60, {clickable: false});
map.addOverlay(polyline);

// YELLOW Solar Eclipse Time Line: 20.0000 20
var polyline = new GPolyline([
new GLatLng( 13.66000,  -36.80981),
new GLatLng( 13.47746,  -38.46594)],
"#FFFF00", 3, 0.60, {clickable: false});
map.addOverlay(polyline);

// get latlng

}
