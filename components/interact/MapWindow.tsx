"use client";

import { Circle, MapContainer, Marker, Popup, ScaleControl, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { LatLng } from "leaflet";

const center = [52.22977, 21.01178];

const Location = () => {
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

  console.log([position?.lng, position?.lat])
  return position
    ? (
      <>
        <Circle center={position} weight={2} color={'red'} fillColor={'red'} fillOpacity={0.1} radius={500}></Circle>
        <Marker position={position}>
          <Popup>You are here</Popup>
        </Marker>
      </>
    )
    : null
}


const MapWindow = () => {

  return (
    <MapContainer center={[50,50]} zoom={18} style={{ height: '400px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Location />
      <ScaleControl imperial={false} />
    </MapContainer>
  );
};

export default MapWindow;
