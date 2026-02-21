import { useState } from 'react';
import { Map, Source, Layer, Popup } from 'react-map-gl/maplibre';
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
});

//for linking to Olympic Logo images
const olympicLogoByUrl = {
  "https://www.olympic.org/athens-1896": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Commemorative_album_of_1896_Olympic_Games_-_cover_by_E._Gilli%C3%A9ron.jpg/500px-Commemorative_album_of_1896_Olympic_Games_-_cover_by_E._Gilli%C3%A9ron.jpg",
  "https://www.olympic.org/paris-1900": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/1900_Olympic_Games_Poster_Paris.jpg/330px-1900_Olympic_Games_Poster_Paris.jpg",
  "https://www.olympic.org/st-louis-1904": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/1904summerolympicsposter.jpg/330px-1904summerolympicsposter.jpg",
  "https://www.olympic.org/london-1908": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Olympic_games_1908_London.jpg/330px-Olympic_games_1908_London.jpg",
  "https://www.olympic.org/stockholm-1912": "https://upload.wikimedia.org/wikipedia/en/thumb/b/bd/1912_Summer_Olympics_poster.jpg/330px-1912_Summer_Olympics_poster.jpg",
  "https://www.olympic.org/antwerp-1920": "https://upload.wikimedia.org/wikipedia/commons/7/73/1920_olympics_poster.jpg",
  "https://www.olympic.org/chamonix-1924": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/1924WOlympicPoster.jpg/330px-1924WOlympicPoster.jpg",
  "https://www.olympic.org/paris-1924": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/1924_Summer_Olympics_logo.svg/500px-1924_Summer_Olympics_logo.svg.png",
  "https://www.olympic.org/st-moritz-1928": "https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/1928_Winter_Olympics_poster.jpg/330px-1928_Winter_Olympics_poster.jpg",
  "https://www.olympic.org/amsterdam-1928": "https://upload.wikimedia.org/wikipedia/en/f/f9/1928_Olympics_poster.jpg",
  "https://www.olympic.org/los-angeles-1932": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1932_Summer_Olympics_logo.svg/500px-1932_Summer_Olympics_logo.svg.png",
  "https://www.olympic.org/lake-placid-1932": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/1932_Winter_Olympics_logo.svg/330px-1932_Winter_Olympics_logo.svg.png",
  "https://www.olympic.org/garmisch-partenkirchen-1936": "https://upload.wikimedia.org/wikipedia/en/thumb/b/bf/1936_Winter_Olympics.svg/330px-1936_Winter_Olympics.svg.png",
  "https://www.olympic.org/berlin-1936": "https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/1936_Summer_Olympics_logo.svg/500px-1936_Summer_Olympics_logo.svg.png",
  "https://www.olympic.org/london-1948": "https://upload.wikimedia.org/wikipedia/en/thumb/4/47/1948_Summer_Olympics_logos.svg/330px-1948_Summer_Olympics_logos.svg.png",
  "https://www.olympic.org/st-moritz-1948": "https://upload.wikimedia.org/wikipedia/en/f/fe/1948_Winter_Olympics_logo.png",
  "https://www.olympic.org/helsinki-1952": "https://upload.wikimedia.org/wikipedia/en/thumb/c/cd/1952_Summer_Olympics_logo.svg/330px-1952_Summer_Olympics_logo.svg.png",
  "https://www.olympic.org/oslo-1952": "https://upload.wikimedia.org/wikipedia/en/thumb/6/65/1952_Winter_Olympics.svg/330px-1952_Winter_Olympics.svg.png",
  "https://www.olympic.org/melbourne-stockholm-1956": "https://upload.wikimedia.org/wikipedia/en/thumb/e/e3/1956_Summer_Olympics_logo.svg/330px-1956_Summer_Olympics_logo.svg.png",
  "https://www.olympic.org/cortina-d-ampezzo-1956": "https://upload.wikimedia.org/wikipedia/en/8/8f/1956_Winter_Olympics_logo.png",
  "https://www.olympic.org/squaw-valley-1960": "https://upload.wikimedia.org/wikipedia/en/thumb/6/62/1960_Winter_Olympics_logo.svg/330px-1960_Winter_Olympics_logo.svg.png",
  "https://www.olympic.org/rome-1960": "https://upload.wikimedia.org/wikipedia/en/1/11/1960_Summer_Olympics_logo.png",
  "https://www.olympic.org/innsbruck-1964": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/1964_Winter_Olympics_logo.svg/330px-1964_Winter_Olympics_logo.svg.png",
  "https://www.olympic.org/tokyo-1964": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Tokyo_1964_Summer_Olympics_logo.svg/330px-Tokyo_1964_Summer_Olympics_logo.svg.png",
  "https://www.olympic.org/grenoble-1968": "https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/1968_Winter_Olympics_logo.svg/330px-1968_Winter_Olympics_logo.svg.png",
  "https://www.olympic.org/mexico-1968": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/1968_Mexico_emblem.svg/500px-1968_Mexico_emblem.svg.png",
  "https://www.olympic.org/sapporo-1972": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/1972_Winter_Olympics.svg/250px-1972_Winter_Olympics.svg.png",
  "https://www.olympic.org/munich-1972": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/1972_Summer_Olympics_logo.svg/500px-1972_Summer_Olympics_logo.svg.png",
  "https://www.olympic.org/montreal-1976": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/1976_Summer_Olympics_logo.svg/330px-1976_Summer_Olympics_logo.svg.png",
  "https://www.olympic.org/innsbruck-1976": "https://upload.wikimedia.org/wikipedia/en/thumb/4/44/1976_Winter_Olympics_logo.svg/330px-1976_Winter_Olympics_logo.svg.png",
  "https://www.olympic.org/moscow-1980": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Emblem_of_the_1980_Summer_Olympics.svg/330px-Emblem_of_the_1980_Summer_Olympics.svg.png",
  "https://www.olympic.org/lake-placid-1980": "https://upload.wikimedia.org/wikipedia/en/thumb/9/99/1980_Winter_Olympics_logo.svg/330px-1980_Winter_Olympics_logo.svg.png",
  "https://www.olympic.org/sarajevo-1984": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/1984_Winter_Olympics_logo.svg/330px-1984_Winter_Olympics_logo.svg.png",
  "https://www.olympic.org/los-angeles-1984": "https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/1984_Summer_Olympics_logo.svg/500px-1984_Summer_Olympics_logo.svg.png",
  "https://www.olympic.org/seoul-1988": "https://upload.wikimedia.org/wikipedia/en/thumb/d/d6/1988_Summer_Olympics_logo.svg/330px-1988_Summer_Olympics_logo.svg.png",
  "https://www.olympic.org/calgary-1988": "https://upload.wikimedia.org/wikipedia/en/thumb/6/64/1988_Winter_Olympics_logo.svg/330px-1988_Winter_Olympics_logo.svg.png",
  "https://www.olympic.org/albertville-1992": "https://upload.wikimedia.org/wikipedia/en/thumb/d/d1/1992_Winter_Olympics_logo.svg/330px-1992_Winter_Olympics_logo.svg.png",
  "https://www.olympic.org/barcelona-1992": "https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/1992_Summer_Olympics_logo.svg/500px-1992_Summer_Olympics_logo.svg.png",
  "https://www.olympic.org/lillehammer-1994": "https://upload.wikimedia.org/wikipedia/en/thumb/9/96/1994_Winter_Olympics_logo.svg/330px-1994_Winter_Olympics_logo.svg.png",
  "https://www.olympic.org/atlanta-1996": "https://upload.wikimedia.org/wikipedia/en/thumb/4/4e/1996_Summer_Olympics_logo.svg/250px-1996_Summer_Olympics_logo.svg.png",
  "https://www.olympic.org/nagano-1998": "https://upload.wikimedia.org/wikipedia/en/thumb/f/fc/1998_Winter_Olympics_logo.svg/500px-1998_Winter_Olympics_logo.svg.png",
  "https://www.olympic.org/sydney-2000": "https://upload.wikimedia.org/wikipedia/en/thumb/8/81/2000_Summer_Olympics_logo.svg/330px-2000_Summer_Olympics_logo.svg.png",
  "https://www.olympic.org/salt-lake-city-2002": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/2002_Winter_Olympics_logo.svg/500px-2002_Winter_Olympics_logo.svg.png",
  "https://www.olympic.org/athens-2004": "https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/Athens_2004_logo.svg/330px-Athens_2004_logo.svg.png",
  "https://www.olympic.org/turin-2006": "https://upload.wikimedia.org/wikipedia/en/thumb/0/03/Torino_2006_logo.svg/500px-Torino_2006_logo.svg.png",
  "https://www.olympic.org/beijing-2008": "https://upload.wikimedia.org/wikipedia/en/thumb/8/87/2008_Summer_Olympics_logo.svg/330px-2008_Summer_Olympics_logo.svg.png",
  "https://www.olympic.org/vancouver-2010": "https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/2010_Winter_Olympics_logo.svg/330px-2010_Winter_Olympics_logo.svg.png",
  "https://www.olympic.org/london-2012": "https://upload.wikimedia.org/wikipedia/en/thumb/d/de/2012_Summer_Olympics_logo.svg/330px-2012_Summer_Olympics_logo.svg.png",
  "https://www.olympic.org/sochi-2014": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Sochi_2014_%28Emblem%29.svg/500px-Sochi_2014_%28Emblem%29.svg.png",
  "https://www.olympic.org/rio-2016": "https://upload.wikimedia.org/wikipedia/en/thumb/d/df/2016_Summer_Olympics_logo.svg/330px-2016_Summer_Olympics_logo.svg.png",
  "https://www.olympic.org/pyeongchang-2018": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Pyeongchang_2018_Logo.svg/500px-Pyeongchang_2018_Logo.svg.png",
  "https://www.olympic.org/tokyo-2020": "https://upload.wikimedia.org/wikipedia/en/thumb/1/1d/2020_Summer_Olympics_logo_new.svg/330px-2020_Summer_Olympics_logo_new.svg.png",
  "https://www.olympic.org/beijing-2022": "https://upload.wikimedia.org/wikipedia/en/thumb/5/5e/2022_Winter_Olympics_official_logo-en.svg/330px-2022_Winter_Olympics_official_logo-en.svg.png",
  "https://www.olympic.org/paris-2024": "https://upload.wikimedia.org/wikipedia/en/thumb/d/d1/2024_Summer_Olympics_logo.svg/330px-2024_Summer_Olympics_logo.svg.png",
  "https://www.olympic.org/milano-cortina-2026": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/2026_Winter_Olympics_logo.svg/330px-2026_Winter_Olympics_logo.svg.png",
  "https://www.olympic.org/la-2028": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/LA28Oly_2020-RetroStripe.svg/330px-LA28Oly_2020-RetroStripe.svg.png"
};

function MapDisplay() {

  const [selectedHost, setSelectedHost] = useState(null);

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

const handleMapClick = (event) => {
    const features = event.features;
    if (features.length) {
       const clickedFeature = features[0];
       setSelectedHost(clickedFeature);
  }
}

  return (
    <Map
      initialViewState={{
        longitude: 10.242740,
        latitude: 33.624101,
        zoom: 1.5
      }}
      style={{width: 1200, height: 800}}
      mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
      interactiveLayerIds={['host-layer']}
      onClick={handleMapClick}
    >
       <Source
           id="host-layer"
           type="geojson"
           data={buildGeoJSON(hostData)}
       >
           <Layer {...hostLayerStyle} />
       </Source>

  {selectedHost?.geometry?.coordinates && (
    <Popup
        anchor="bottom"
        longitude={selectedHost.geometry.coordinates[0]}
        latitude={selectedHost.geometry.coordinates[1]}
        onClose={() => setSelectedHost(null)}
    >
        <div>

            <img
              src={olympicLogoByUrl[selectedHost.properties.GamesUrl] || ""}              
              alt="Olympic logo"
              style={{
              width: "220px",
              display: "block",
              margin: "0 auto 8px auto",
              borderRadius: "6px"
          }}
        />
            <h2 className="text-xl text-gray-500 font-semibold mb-2"><span className="text-gray-700">City:</span> {selectedHost.properties.City}</h2>
            <p className="text-sm text-gray-500">Year: {selectedHost.properties.Year}
              {" • "}
              {selectedHost.properties.Type === "summergames" ? "Summer Olympics" : "Winter Olympics"}
            </p>

            <div className="mt-2 space-y-1 text-sm">
              <div><span className="font-medium">Events:</span> {selectedHost.properties.Events}</div>
              <div><span className="font-medium">Athletes:</span> {selectedHost.properties.Athletes}</div>
              <div><span className="font-medium">Countries:</span> {selectedHost.properties.Countries}</div>
            </div>

            <a
              href={selectedHost.properties.GamesUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="rounded-sm border px-3 py-2 text-sm hover:bg-gray-100">
                Official Olympic Page
              </button>
            </a>
        </div>        
    </Popup>
)}

      </Map>
  );
}

export default MapDisplay;