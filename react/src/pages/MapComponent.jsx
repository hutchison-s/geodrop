import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { useSearchParams } from "react-router-dom";
import { useGeoLoc } from "../contexts/GeoLocationContext.jsx";
import "../styles/map.css";
import "leaflet/dist/leaflet.css";
import { useMode } from "../contexts/LightContext.jsx";
import MapDrops from "../components/MapDrops.jsx";
import { icons } from "../assets/icons.jsx";
import MapController from "../components/MapController.jsx";
import { useEffect } from "react";
import { useState } from "react";
import { Popup } from "react-leaflet";
import SEO from "../components/SEO.jsx";

export default function MapComponent() {
  const { position } = useGeoLoc();
  const { mode, isDark } = useMode();
  const [params, setParams] = useSearchParams();
  const [destination, setDestination] = useState(undefined);

  useEffect(() => {
    console.log(params);
    if (params.has("lat") && params.has("lng")) {
      setDestination((d) => {
        return {
          ...d,
          lat: parseFloat(params.get("lat")),
          lng: parseFloat(params.get("lng")),
        };
      });
    }
  }, []);

  const clearParams = () => {
    setParams("");
    setDestination(undefined);
  };

  return (
    <>
    <SEO title='Explore GeoDrop Map' desc='Discover GeoDrops near you by browsing an interactive and filterable map.' canon='explore'/>
      <section className={isDark ? 'darkMode' : ''} style={{width: '100%', height: '100%'}}>
        <MapContainer center={position} zoom={16} maxZoom={18} minZoom={6}>
          <MapController panTo={destination} clearParams={clearParams}>
            <TileLayer
            minZoom={4}
            maxZoom={18}
              url={`https://cartodb-basemaps-{s}.global.ssl.fastly.net/${mode}_all/{z}/{x}/{y}.png`}
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
            />
            <Marker
              icon={isDark ? icons.youDark : icons.youLight}
              position={position}
              zIndexOffset={100}
              showCoverageOnHover={false}
            >
              <Popup>
                <p>Latitude: {position.lat}</p>
                <p>Longitude: {position.lng}</p>
              </Popup>
            </Marker>
            <MapDrops />
          </MapController>
        </MapContainer>
      </section>
    </>
  );
}
