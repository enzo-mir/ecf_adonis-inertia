import { ChangeEvent, Suspense, useEffect, useState } from "react";
import { Cross } from "../../assets/style/cross";
import { useRef } from "react";
import { connectStore, userDataStore } from "../../data/store/connect.store";
import { hourStore } from "../../data/store/apiData.store";
import { motion } from "framer-motion";
import React from "react";
import { useForm } from "@inertiajs/inertia-react";
import { reservationScheama } from "../../types/reservationData.scheama";
import { User, currentReservationType } from "../../types/userType.store";
import styles from "../../../css/reservation.module.css";
import overlayStyles from "../../../css/overlay.module.css";

export default function Reserv({
  res: displayReservation,
}: {
  res(val: boolean): void;
}) {
  const [userData, setUserData] = userDataStore((state) => [
    state.userData as User,
    state.setUserData,
  ]);
  const connected = connectStore((state) => state.connectedUser);
  const hours = hourStore((state) => state.hours);
  const { data, setData, processing, post } = useForm({
    name: connected ? userData?.name : "",
    email: connected ? userData?.email : "",
    guests: connected ? userData?.guests : 1,
    alergy: connected ? userData?.alergy : "",
    date: new Date().toLocaleDateString("fr-CA"),
    hourTargeted: null,
    timeTargeted: null,
  });

  const [resError, setResError] = useState("");
  const [showAllergy, setShowAllergy] = useState(
    userData?.alergy ? true : false
  );
  const [DTable, setDTable] = useState<Array<string> | string>([]);
  const [LTable, setLTable] = useState<Array<string> | string>([]);
  const reservContainerRef = useRef<HTMLElement | null>(null);
  const lunchTable: Array<string> = [];
  const dinnerTable: Array<string> = [];

  useEffect(() => {
    handleChangeDate(null);
    return () => {
      document.body.removeAttribute("style");
    };
  }, []);

  document.body.style.overflow = "hidden";

  function handleChangeDate(e: ChangeEvent | null) {
    let hourFetchLunch: string = "";
    let hourFetchDinner: string = "";
    let dateDay: string = new Date(data.date).toLocaleDateString("fr-FR", {
      weekday: "long",
    });
    let fullDate: string = new Date(data.date).toLocaleDateString("fr-CA");

    if (e) {
      dateDay = new Date(
        (e!.target as HTMLInputElement).value
      ).toLocaleDateString("fr-FR", {
        weekday: "long",
      });
      fullDate = new Date(
        (e!.target as HTMLInputElement).value
      ).toLocaleDateString("fr-CA");
    }

    setData({ ...data, date: fullDate });

    hours.forEach((elem) => {
      if (Object.values(elem)[1] === dateDay) {
        hourFetchLunch = elem.lunch;
        hourFetchDinner = elem.dinner;
        if (elem.lunch.indexOf("-") === -1) {
          setLTable("Fermer");
        }
        if (elem.dinner.indexOf("-") === -1) {
          setDTable("Fermer");
        }
      }
    });

    convertDataToHourTable(hourFetchLunch, lunchTable);
    convertDataToHourTable(hourFetchDinner, dinnerTable);

    function convertDataToHourTable(hourSlice: string, table: Array<string>) {
      if (hourSlice.indexOf("-") !== -1) {
        const splitingLunch = hourSlice.split(" - ");
        const splitHourLunch = splitingLunch[0].split("h");
        const splitMinuteLunch = splitingLunch[1].split("h");
        const startHourLunch = parseInt(splitHourLunch[0]);
        const endHourLunch = parseInt(splitMinuteLunch[0]);
        const startDecimalLunch = parseInt(splitHourLunch[1]) / 60;
        const endDecimalLunch = parseInt(splitMinuteLunch[1]) / 60;
        const fullStartLunch = isNaN(startDecimalLunch)
          ? startHourLunch
          : startHourLunch + startDecimalLunch;
        const fullEndLunch = isNaN(endDecimalLunch)
          ? endHourLunch
          : endHourLunch + endDecimalLunch;

        /* => tableau de données qui retrace les heures et leurs plages d'horaires avec décallage
           de 15 min (60 * 0.25) jusqu'à 30 min (60 * 0.5) avant la fin de la plage horaire */

        for (let i = fullStartLunch; i <= fullEndLunch - 0.5; i += 0.25) {
          table.push(i.toString());
        }
        /* Conversion des heures décimales en heures traditionnelles ex => 6,25 -> 6h15 */
        const tableToSet: Array<string> = [];

        table.map((elem: string) => {
          if (elem.indexOf(".") !== -1) {
            tableToSet.push(
              parseInt(elem.slice(3)) / 100 === 0.05
                ? elem.slice(0, elem.indexOf(".")) +
                    "h" +
                    (parseInt(elem.slice(3)) * 6).toString()
                : elem.slice(0, elem.indexOf(".")) +
                    "h" +
                    (parseInt(elem.slice(3)) * 0.6).toString()
            );
          } else {
            tableToSet.push(elem + "h");
          }
        });

        switch (table) {
          case dinnerTable:
            setDTable(tableToSet);
            break;
          case lunchTable:
            setLTable(tableToSet);
            break;
        }
      }
    }
  }

  function unselectHours() {
    document.onmouseup = (e) => {
      const obj: HTMLElement = document.querySelector(
        "button[data-selected='true']"
      );
      if (obj !== null) {
        if (
          obj !== e.target &&
          document.getElementById("submitRes") !== e.target
        ) {
          obj.dataset.selected = "false";
          setData({ ...data, hourTargeted: null });
        }
      }
    };
  }

  function selectHours(e: React.MouseEvent<HTMLButtonElement>) {
    setData({
      ...data,
      hourTargeted: (e.target as HTMLElement).innerHTML,
      timeTargeted: (e.target as HTMLElement).getAttribute("data-time")!,
    });

    unselectHours();
    const oldTarget: HTMLElement = document.querySelector(
      "button[data-selected='true']"
    );
    if (oldTarget) oldTarget.dataset.selected = "false";
    (e.target as HTMLElement).dataset.selected = "true";
  }

  async function submitReservation() {
    reservContainerRef.current?.scrollTo(0, 0);
    setResError("");
    try {
      const dataValidate = reservationScheama.parse(data);
      post("/reservation/add", {
        data: dataValidate,
        onError: (err) => {
          setResError(err as unknown as string);
        },
        onSuccess: (success) => {
          setResError("Table réservée !");
          displayReservation(false);
        },
      });
    } catch (error) {
      setResError(JSON.parse(error.message)[0].message);
    }
  }

  return (
    <div
      className={overlayStyles.overlay}
      onClick={() => displayReservation(false)}
    >
      <motion.section
        className={styles.reservation_section}
        onClick={(e) => e.stopPropagation()}
        initial={{ y: "-20%", opacity: 0 }}
        animate={{ y: "0", opacity: 1 }}
        exit={{ y: "-20%", opacity: 0 }}
        transition={{ duration: 0.5 }}
        ref={reservContainerRef}
      >
        <Cross onClick={() => displayReservation(false)} />
        <h1>Réservez votre table</h1>
        {resError ? <p className="validationReservation">{resError}</p> : null}
        <div className={styles.option_reservation}>
          <label htmlFor="persons">
            <svg
              stroke="currentColor"
              fill="none"
              stroke-width="2"
              viewBox="0 0 24 24"
              stroke-linecap="round"
              stroke-linejoin="round"
              color="#fff"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
              style={{ color: "rgb(255, 255, 255)" }}
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M5 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
              <path d="M3 21v-2a4 4 0 0 1 4 -4h4c.96 0 1.84 .338 2.53 .901"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              <path d="M16 19h6"></path>
              <path d="M19 16v6"></path>
            </svg>
            <input
              type="number"
              id="persons"
              placeholder="convives par défaut (1-9)"
              max="9"
              min="1"
              value={data.guests}
              onChange={(e) =>
                setData({ ...data, guests: parseInt(e.target.value) })
              }
              maxLength={1}
              required
            />
          </label>
          <label htmlFor="date">
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 24 24"
              color="#fff"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
              style={{ color: "rgb(255, 255, 255)" }}
            >
              <path fill="none" d="M0 0h24v24H0V0z"></path>
              <path d="M7 11h2v2H7v-2zm14-5v14c0 1.1-.9 2-2 2H5a2 2 0 01-2-2l.01-14c0-1.1.88-2 1.99-2h1V2h2v2h8V2h2v2h1c1.1 0 2 .9 2 2zM5 8h14V6H5v2zm14 12V10H5v10h14zm-4-7h2v-2h-2v2zm-4 0h2v-2h-2v2z"></path>
            </svg>
            <input
              type="date"
              className={styles.date_calendar}
              onChange={(e: ChangeEvent) => handleChangeDate(e)}
              min={new Date().toLocaleDateString("fr-CA")}
              value={data.date}
              required
            />
          </label>
          <label htmlFor="email">
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 24 24"
              color="#fff"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
              style={{ color: "rgb(255, 255, 255)" }}
            >
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10h5v-2h-5c-4.34 0-8-3.66-8-8s3.66-8 8-8 8 3.66 8 8v1.43c0 .79-.71 1.57-1.5 1.57s-1.5-.78-1.5-1.57V12c0-2.76-2.24-5-5-5s-5 2.24-5 5 2.24 5 5 5c1.38 0 2.64-.56 3.54-1.47.65.89 1.77 1.47 2.96 1.47 1.97 0 3.5-1.6 3.5-3.57V12c0-5.52-4.48-10-10-10zm0 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"></path>
            </svg>
            <input
              type="email"
              id="email"
              required
              placeholder="Entrez votre e-mail"
              value={userData?.email || data.email}
              onChange={(e) =>
                userData?.email || setData({ ...data, email: e.target.value })
              }
              disabled={userData?.email ? true : false}
            />
          </label>
          <label htmlFor="name">
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 512 512"
              color="#fff"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
              style={{ color: "rgb(255, 255, 255)" }}
            >
              <path d="M256 288c79.5 0 144-64.5 144-144S335.5 0 256 0 112 64.5 112 144s64.5 144 144 144zm128 32h-55.1c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16H128C57.3 320 0 377.3 0 448v16c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48v-16c0-70.7-57.3-128-128-128z"></path>
            </svg>
            <input
              type="text"
              id="name"
              required
              placeholder="Entrez votre nom"
              value={userData?.name || data.name}
              onChange={(e) =>
                userData?.name || setData({ ...data, name: e.target.value })
              }
              disabled={userData?.name ? true : false}
            />
          </label>
        </div>
        <div className={styles.lunch_hours}>
          <h2>MIDI</h2>
          <div>
            <ul className={styles.hours_list}>
              {typeof LTable === "object" ? (
                LTable.map((lunch, id) => {
                  return (
                    <button
                      key={id}
                      onClick={selectHours}
                      tabIndex={id}
                      data-time="lunch"
                    >
                      {lunch}
                    </button>
                  );
                })
              ) : (
                <p>{LTable}</p>
              )}
            </ul>
          </div>
        </div>
        <div className={styles.dinner_hours}>
          <h2>SOIR</h2>
          <div>
            <ul className={styles.hours_list}>
              {typeof DTable === "object" ? (
                DTable.map((dinner, id) => {
                  return (
                    <button
                      key={id}
                      onClick={selectHours}
                      tabIndex={id}
                      data-time="dinner"
                    >
                      {dinner}
                    </button>
                  );
                })
              ) : (
                <p>{DTable}</p>
              )}
            </ul>
          </div>
        </div>
        <div className={styles.final_case}>
          <p
            onClick={() => {
              setShowAllergy(!showAllergy);
            }}
          >
            Allergie(s) ?
          </p>
          {showAllergy && (
            <div className={styles.alergy_container}>
              <input
                type="texte"
                placeholder="Entrez vos allergies"
                value={data.alergy}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setData({ ...data, alergy: e.target.value })
                }
              />
            </div>
          )}
          <button
            id="submitRes"
            type="submit"
            onClick={submitReservation}
            disabled={processing}
          >
            Réservez la table
          </button>
        </div>
      </motion.section>
    </div>
  );
}
