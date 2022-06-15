var jsdom = require('jsdom')
const { JSDOM } = jsdom

const { document } = (new JSDOM()).window



let map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'),{
        zoom: 2,
        center: LatLng(2.8,-187.3),
        mapTypeId: "terrain"
    })
    
}


const script = document.createElement('script')


script.src = "http://95.216.162.109:443/getRoutesCoords"

document.getElementsByTagName("head")[0].appendChild(script)

const egfeed_callback = function ( results ){
     for( let i=0; i< results.features.length; i++){
         const coords = results.features[i].geometry.coordinates
         const latLng = new google.maps.LatLng(coords[1], coords[0])

         new google.mas.Marker({
             position: latLng,
             map: map
         })
     }
}

  
  window.initMap = initMap;
  window.eqfeed_callback = eqfeed_callback;
  