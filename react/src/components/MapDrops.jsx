import { useUser } from "../contexts/UserContext";
import { useDrops } from "../contexts/DropContext";
import ProximityMarker from "./ProximityMarker";
import { LayerGroup, LayersControl, useMap } from "react-leaflet";
import L from 'leaflet'
import { useEffect, useState } from "react";
import MarkerClusterGroup from "react-leaflet-cluster";

export default function MapDrops() {
  const { drops } = useDrops();
  const { profile } = useUser();
  const [selectedBase, setSelectedBase] = useState("All Drops");
  const [overlays, setOverlays] = useState(['My Drops', 'Undiscovered Drops', 'Discovered Drops'])
  const map = useMap();

  const filters = {
    "Undiscovered": (d) => !d.viewedBy.includes(profile._id) && d.creatorInfo._id !== profile._id,
    "Discovered": (d) => d.viewedBy.includes(profile._id),
    "My Drops": (d) => d.creatorInfo._id === profile._id,
    "All Drops": (d) => d,
  };

  const customCluster = (cluster) => {
    const groupIcon = L.divIcon({
      className: "custom-marker-cluster",
      html: `<span class="clusterCount">${cluster.getChildCount()}</span><span class="clusterImage"></span>`,
    });
    return groupIcon;
  };

  const handleBaseChange = (e) => {
    setSelectedBase(e.name);
  };
  const handleOverlayAdd = ({name}) => {
    setOverlays(ov => [...ov, name])
  }
  const handleOverlayRemove = ({name})=>{
    setOverlays(ov => ov.filter(layer => layer != name))
  }

  useEffect(()=>{
    map.addEventListener('baselayerchange', handleBaseChange)
    map.addEventListener('overlayadd', handleOverlayAdd)
    map.addEventListener('overlayremove', handleOverlayRemove)

    return ()=>{
        map.removeEventListener('baselayerchange', handleBaseChange)
        map.removeEventListener('overlayadd', handleOverlayAdd)
        map.removeEventListener('overlayremove', handleOverlayRemove)
    }
  }, [])

  return (
    <>
      <LayersControl position="topleft">
        <LayersControl.BaseLayer name="All Drops" checked={true}>
          <MarkerClusterGroup
            chunkedLoading
            iconCreateFunction={customCluster}
            spiderLegPolylineOptions={{
              weight: 1,
              color: "#aaaaff",
              opacity: 0.3,
            }}
            spiderfyOnMaxZoom={true}
            spiderfyDistanceMultiplier={3}
          >
            {drops.map((drop) => (
              <ProximityMarker key={drop._id} drop={drop} />
            ))}
          </MarkerClusterGroup>
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Filter Drops">
          <LayerGroup>
            {<MarkerClusterGroup
            chunkedLoading
            iconCreateFunction={customCluster}
            spiderLegPolylineOptions={{
              weight: 1,
              color: "#aaaaff",
              opacity: 0.3,
            }}
            spiderfyOnMaxZoom={true}
            spiderfyDistanceMultiplier={3}
          >
                {overlays.includes("My Drops") && drops.filter(filters["My Drops"]).map((drop) => (
                  <ProximityMarker key={drop._id} drop={drop} />
                ))}
                {overlays.includes("Discovered Drops") && drops.filter(filters["Discovered"]).map((drop) => (
                  <ProximityMarker key={drop._id} drop={drop} />
                ))}
                {overlays.includes("Undiscovered Drops") && drops.filter(filters["Undiscovered"]).map((drop) => (
                  <ProximityMarker key={drop._id} drop={drop} />
                ))}
                </MarkerClusterGroup>}
          </LayerGroup>
        </LayersControl.BaseLayer>
        {selectedBase === "Filter Drops" && (
          <>
            <LayersControl.Overlay name="My Drops" checked={overlays.includes('My Drops')} >
              <LayerGroup>
              
              </LayerGroup>
            </LayersControl.Overlay>
            <LayersControl.Overlay name="Discovered Drops" checked={overlays.includes('Discovered Drops')}>
              <LayerGroup>
              </LayerGroup>
            </LayersControl.Overlay>
            <LayersControl.Overlay name="Undiscovered Drops" checked={overlays.includes('Undiscovered Drops')}>
              <LayerGroup>
              </LayerGroup>
            </LayersControl.Overlay>
          </>
        )}
      </LayersControl>
    </>
  );
}
