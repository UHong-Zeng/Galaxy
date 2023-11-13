"use client";

import { updateLocationToUser } from "@/lib/actions/userLocation.action";
import React from "react";
import { useGeolocated } from "react-geolocated";

const UpdateLocation = ({userId}: {userId:string}) => {
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
    });

  const handleOnClick = async () => {
    if(coords){
      await updateLocationToUser({
        userId: userId,
        lng: coords.longitude,
        lat: coords.latitude,
      });
    }
  }

  return !isGeolocationAvailable ? (
    <div>Your browser does not support Geolocation</div>
  ) : !isGeolocationEnabled ? (
    <div>Geolocation is not enabled</div>
  ) : coords ? (
    <div>
      <button onClick={handleOnClick}>Refresh</button>
      <table>
        <tbody>
          <tr>
            <td>latitude</td>
            <td>{coords.latitude}</td>
          </tr>
          <tr>
            <td>longitude</td>
            <td>{coords.longitude}</td>
          </tr>
          <tr>
            <td>altitude</td>
            <td>{coords.altitude}</td>
          </tr>
          <tr>
            <td>heading</td>
            <td>{coords.heading}</td>
          </tr>
          <tr>
            <td>speed</td>
            <td>{coords.speed}</td>
          </tr>
        </tbody>
      </table>
    </div>
  ) : (
    <div>Getting the location data&hellip; </div>
  );
};

export default UpdateLocation;
