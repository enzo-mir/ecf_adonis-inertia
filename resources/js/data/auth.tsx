import { useEffect } from "react";
import { connectStore, userDataStore } from "./store/connect.store";
import React from "react";

export default function Auth() {
  const [setConnectedUser, setConnectedAdmin] = connectStore((state) => [
    state.setConnectedUser,
    state.setConnectedAdmin,
  ]);
  const setUserData = userDataStore((state) => state.setUserData);
  const setCurrentReservation = userDataStore(
    (state) => state.setCurrentReservation
  );

  useEffect(() => {
    fetch("/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.isLogged) {
          if (data.type === "user") {
            setConnectedUser(true);
            setCurrentReservation(data.currentReservation || []);
            setUserData(data.userdata);
          }
          if (data.type === "admin") {
            setConnectedAdmin(true);
          }
        } else {
          setConnectedAdmin(false);
          setConnectedUser(false);
        }
      });
  }, [setConnectedAdmin, setConnectedUser, setCurrentReservation, setUserData]);

  return <></>;
}
