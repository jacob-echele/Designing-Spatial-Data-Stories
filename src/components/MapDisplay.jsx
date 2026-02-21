import * as React from 'react';
import { Map, Source, Layer } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { hostData } from '../data/host_cities'

// from ChatGPT to fix my GeoJSON formatting issues - I had the coordinates in the properties instead of the geometry, which is what MapLibre expects. This function converts the tabular data into proper GeoJSON format with Point geometries. I then use this function to create a new GeoJSON object that I can pass to the Source component in MapDisplay.jsx.
// Convert tabular coordinates into real GeoJSON geometry
const buildGeoJSON = (data) => ({
  type: "FeatureCollection",
  features: data.features.map(f => ({
    type: "Feature",
    properties: f.properties,
    geometry: {
      type: "Point",
      coordinates: [
        f.properties.Longitude,
        f.properties.Latitude
      ]
    }
  }))
})

function MapDisplay() {

  const hostLayerStyle = {
    id: 'host-layer',
    type: 'circle',
    source: 'host-data',
    paint: {
      'circle-radius': 6,

    //color based on summer/winter games
    'circle-color': [
      'match',
      ['get', 'Type'],
      'summergames', '#D4AF37',  //gold
      'wintergames', '#007cbf',  //blue
      '#999999'                 //fallback if neither matches
    ],

    'circle-stroke-width': 2,
    'circle-stroke-color': '#ffffff'
  }
};

  return (
    <Map
      initialViewState={{
        longitude: 10.242740,
        latitude: 33.624101,
        zoom: 1.5
      }}
      style={{width: 1200, height: 800}}
      mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
    >
       <Source
           id="host-data"
           type="geojson"
           data={buildGeoJSON(hostData)}
       >
           <Layer {...hostLayerStyle} />
       </Source>
      </Map>
  );
}

export default MapDisplay;