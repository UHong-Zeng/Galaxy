"use client";

import React, { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./map.css";
import { updatePosition } from "@/lib/actions/user.actions";

const Map = ({userId}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng] = useState(120.2388992);
  const [lat] = useState(22.986752);
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
    new maplibregl.Marker({ color: "#FF0000" })
      .setLngLat([120.2388992, 22.986752])
      .addTo(map.current);

    let geolocate = new maplibregl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });


    // get Currency
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
    };
    const successCallback = (position) => {
      const updateNewPosition = async() => {
        await updatePosition(userId, position.coords.longitude, position.coords.latitude);
      }
      console.log(position);
      updateNewPosition()
    };
    
    const errorCallback = (error) => {
      console.log(error);
    };
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
    const watchDog = navigator.geolocation.watchPosition(successCallback, errorCallback);
  }, [API_KEY, lng, lat, zoom]);

  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
    </div>
  );
};

export default Map;
