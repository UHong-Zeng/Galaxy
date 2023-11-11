"use client";
import { useGeolocated } from "react-geolocated";
import { useEffect } from "react";
import { fetchUsersPosition, updatePosition } from "@/lib/actions/user.actions";
const UpdateUserPosition = ({ userId }: { userId: string }) => {
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
    });
  // console.log(coords);
  const update = async (
    userId: string,
    position: { lng: number; lat: number }
  ) => {
    await updatePosition(userId, position);
    // const test = await fetchUsersPosition(userId);
    // console.log("Test: ", test.map((user) => user.location.coordinates));
  };
  useEffect(() => {
    if (coords) {
      update(userId, { lng: coords.longitude, lat: coords.latitude });
    }
  }, [coords]);

  return !isGeolocationAvailable ? (
    <div>Your browser does not support Geolocation</div>
  ) : !isGeolocationEnabled ? (
    <div>Geolocation is not enabled</div>
  ) : coords ? (
    <table className="">
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
  ) : (
    <div>Getting the location data&hellip; </div>
  );
};

export default UpdateUserPosition;
