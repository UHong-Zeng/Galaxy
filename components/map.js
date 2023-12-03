"use client";

import React, { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./map.css";
import { getLocationFromUsers } from "@/lib/actions/userLocation.action";

const Map = ({ userId }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng] = useState(120.2388992);
  const [lat] = useState(22.9834752);
  const [zoom] = useState(14);
  const [API_KEY] = useState("RqBiuK3vwqHCAXRC99jE");

  useEffect(() => {
    if (map.current) return; // stops map from intializing more than once

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/cadastre-satellite/style.json?key=${API_KEY}`,
      center: [lng, lat],
      zoom: zoom,
    });

    map.current.addControl(new maplibregl.NavigationControl(), "top-right");
    map.current.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      })
    );
    
    setTimeout(async () => {
      const result = await getLocationFromUsers(userId);
      console.log(result);
      if (result) {
        result.map((info) => {
          new maplibregl.Marker({ color: "#0000FF" })
            .setLngLat([info.longitude, info.latitude])
            .addTo(map.current);
        });
      }
    }, 500);

    new maplibregl.Marker({ color: "#FF0000" })
      .setLngLat([139.7525, 35.6846])
      .addTo(map.current);
  }, [API_KEY, lng, lat, zoom]);

  return (
    <div>
      <div className="map-wrap">
        <div ref={mapContainer} className="map" />
      </div>
    </div>
  );
};

export default Map;
