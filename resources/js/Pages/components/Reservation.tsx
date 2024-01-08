import { ChangeEvent, useEffect, useState } from "react";
import postReservation from "../../data/postReservation";
import { Overlay } from "../../assets/style/overlay";
import {
  OptionsReserv,
  ReservationContainer,
  HoursList,
  AlergyWrapper,
} from "../../assets/style/reserveStyle";
import { Cross } from "../../assets/style/cross";
import { useRef } from "react";
import { userDataStore } from "../../data/store/connect.store";
import { hourStore } from "../../data/store/apiData.store";
import { motion } from "framer-motion";
import React from "react";

export default function Reserv({
  res: displayReservation,
}: {
  res(val: boolean): void;
}) {
  const [userInfoStored, setReservationData] = userDataStore((state) => [
    state.userData,
    state.setCurrentReservation,
  ]);
  const hours = hourStore((state) => state.hours);
  const [date, setDate] = useState(new Date().toLocaleDateString("Fr-ca"));
  const [guests, setGuests] = useState(userInfoStored?.guests || 1);
  const [email, setEmail] = useState(userInfoStored?.email || "");
  const [name, setName] = useState(userInfoStored?.name || "");
  const [resError, setResError] = useState("");
  const [alergy, setAlergy] = useState(userInfoStored?.alergy || "");
  const [showAllergy, setShowAllergy] = useState(
    userInfoStored?.alergy ? true : false
  );
  const [DTable, setDTable] = useState<Array<string> | string>([]);
  const [LTable, setLTable] = useState<Array<string> | string>([]);
  const reservationTimeTarget = useRef({
    hour: null as string | null,
    time: "" as string,
  });
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
    let dateDay: string = new Date(date).toLocaleDateString("fr-FR", {
      weekday: "long",
    });
    let fullDate: string = new Date(date).toLocaleDateString("fr-CA");

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

    setDate(fullDate);

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
      const obj = document.querySelector(".selected");
      if (obj !== null) {
        if (
          obj !== e.target &&
          document.getElementById("submitRes") !== e.target
        ) {
          obj.classList.remove("selected");
          reservationTimeTarget.current.hour = null;
        }
      }
    };
  }

  function selectHours(e: React.MouseEvent<HTMLButtonElement>) {
    reservationTimeTarget.current.hour = (e.target as HTMLElement).innerHTML;
    reservationTimeTarget.current.time = (e.target as HTMLElement).getAttribute(
      "data-time"
    )!;

    unselectHours();
    const oldTarget = document.querySelector(".selected");
    if (oldTarget) oldTarget.removeAttribute("class");
    (e.target as HTMLElement).classList.add("selected");
  }

  function submitReservation() {
    reservContainerRef.current?.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

    if (guests > 0 && guests < 10) {
      if (
        date !== null &&
        new Date(date).getTime() > new Date().getTime() - 86400000
      ) {
        if (email) {
          if (name) {
            if (reservationTimeTarget.current.hour !== null) {
              setResError("");
              postReservation(
                guests,
                date,
                email,
                name,
                reservationTimeTarget.current.hour,
                alergy || "",
                reservationTimeTarget.current.time
              ).then((data) => {
                data.error
                  ? setResError(data.error)
                  : (setReservationData(data.valid), displayReservation(false));
              });
            } else setResError("Choisissez une heure de réservation");
          } else setResError("Veuillez renseignez un nom de réservation");
        } else setResError("Veuillez renseignez votre adresse e-mail");
      } else setResError("Choisissez une date de réservation valide");
    } else setResError("Le nombre de convives doit être compris entre 1 et 9");
  }

  return (
    <Overlay onClick={() => displayReservation(false)}>
      <ReservationContainer
        onClick={(e) => e.stopPropagation()}
        as={motion.section}
        initial={{ y: "-20%", opacity: 0 }}
        animate={{ y: "0", opacity: 1 }}
        exit={{ y: "-20%", opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Cross onClick={() => displayReservation(false)} />
        <h1>Réservez votre table</h1>
        {resError ? <p>{resError}</p> : null}
        <OptionsReserv>
          <span></span>
          <input
            type="number"
            id="persons"
            placeholder="convives par défaut (1-9)"
            max="9"
            min="1"
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
            maxLength={2}
          />
          <input
            type="date"
            id="date"
            onChange={(e: ChangeEvent) => handleChangeDate(e)}
            min={new Date().toLocaleDateString("fr-CA")}
            value={date}
          />
          <input
            type="email"
            id="email"
            required
            placeholder="Entrez votre e-mail"
            value={userInfoStored?.email || email}
            onChange={(e) => userInfoStored?.email || setEmail(e.target.value)}
            disabled={userInfoStored?.email ? true : false}
          />
          <input
            type="text"
            id="name"
            required
            placeholder="Entrez votre nom"
            value={userInfoStored?.name || name}
            onChange={(e) => userInfoStored?.name || setName(e.target.value)}
            disabled={userInfoStored?.name ? true : false}
          />
        </OptionsReserv>
        <div id="lunchHours">
          <h2>MIDI</h2>
          <div className="hours">
            <HoursList>
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
            </HoursList>
          </div>
        </div>
        <div id="dinnerHours">
          <h2>SOIR</h2>
          <div className="hours">
            <HoursList>
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
            </HoursList>
          </div>
        </div>
        <div id="finalCase">
          <p
            onClick={() => {
              setShowAllergy(!showAllergy);
              setAlergy(alergy);
            }}
          >
            Allergie(s) ?
          </p>
          {showAllergy && (
            <AlergyWrapper>
              <input
                type="texte"
                placeholder="Entrez vos allergies"
                value={alergy}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setAlergy(e.target.value)
                }
              />
            </AlergyWrapper>
          )}
          <button id="submitRes" type="submit" onClick={submitReservation}>
            Réservez la table
          </button>
        </div>
      </ReservationContainer>
    </Overlay>
  );
}
