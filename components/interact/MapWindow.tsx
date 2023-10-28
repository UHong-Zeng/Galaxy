"use client";

import { Circle, MapContainer, Marker, Popup, ScaleControl, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L, { LatLng } from "leaflet";

interface MapWindowProps {
  name: string,
  username: string,
}

const center = [52.22977, 21.01178];

const Location = ({name, username}: MapWindowProps) => {
  const map = useMap();
  const [position, setPosition] = useState<LatLng | null>(null)

  useEffect(() => {
    map.locate({
      setView: true
    })
    map.on('locationfound', (event) => {
      setPosition(event.latlng)
    })
  }, [map])

  function customMarkerIcon(color="5C5C7B") {
    const svgTemplate = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="marker">
        <path fill-opacity=".25" d="M16 32s1.427-9.585 3.761-12.025c4.595-4.805 8.685-.99 8.685-.99s4.044 3.964-.526 8.743C25.514 30.245 16 32 16 32z"/>
        <path fill="#${color}" stroke="#fff" d="M15.938 32S6 17.938 6 11.938C6 .125 15.938 0 15.938 0S26 .125 26 11.875C26 18.062 15.938 32 15.938 32zM16 6a4 4 0 100 8 4 4 0 000-8z"/>
      </svg>`;
  
    return new L.DivIcon({
      className: "test",
      html: svgTemplate,
      iconSize: [40, 40],
      iconAnchor: [12, 24],
      popupAnchor: [7, -16],
    });
  }

  console.log([position?.lng, position?.lat])
  return position
    ? (
      <>
        <Circle center={position} weight={2} color={'red'} fillColor={'red'} fillOpacity={0.1} radius={500}></Circle>
        <Marker position={position} icon={customMarkerIcon()}>
          <Popup>Name:{name}<br />User:{username}</Popup>
        </Marker>
      </>
    )
    : null
}

const MapWindow = ({name, username}: MapWindowProps) => {

  return (
    <MapContainer center={[50,50]} zoom={18} style={{ height: '400px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Location name={name} username={username}/>
      <ScaleControl imperial={false} />
    </MapContainer>
  );
};

export default MapWindow;
