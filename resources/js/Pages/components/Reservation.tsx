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
import { TbUsersPlus } from "react-icons/tb";
import { MdOutlineDateRange } from "react-icons/md";
import { MdAlternateEmail } from "react-icons/md";
import { FaUserAlt } from "react-icons/fa";
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
    name: connected ? userData?.user.name : "",
    email: connected ? userData?.user.email : "",
    guests: connected ? userData?.user.guests : 1,
    alergy: connected ? userData?.user.alergy : "",
    date: new Date().toLocaleDateString("fr-CA"),
    hourTargeted: null,
    timeTargeted: null,
  });

  const [resError, setResError] = useState("");
  const [showAllergy, setShowAllergy] = useState(
    userData?.user.alergy ? true : false
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
          if (success.props.valid) {
            setUserData({
              user: {
                ...userData.user,
                currentReservation: success.props
                  .valid as currentReservationType[],
              },
            });
          }
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
            <TbUsersPlus color="#fff" />
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
            <MdOutlineDateRange color="#fff" />
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
            <MdAlternateEmail color="#fff" />
            <input
              type="email"
              id="email"
              required
              placeholder="Entrez votre e-mail"
              value={userData.user?.email || data.email}
              onChange={(e) =>
                userData.user?.email ||
                setData({ ...data, email: e.target.value })
              }
              disabled={userData.user?.email ? true : false}
            />
          </label>
          <label htmlFor="name">
            <FaUserAlt color="#fff" />
            <input
              type="text"
              id="name"
              required
              placeholder="Entrez votre nom"
              value={userData.user?.name || data.name}
              onChange={(e) =>
                userData.user?.name ||
                setData({ ...data, name: e.target.value })
              }
              disabled={userData.user?.name ? true : false}
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
