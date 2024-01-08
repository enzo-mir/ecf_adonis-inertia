import styled from "styled-components";
import { Overlay } from "../../assets/style/overlay";
import { FiDelete } from "react-icons/fi";
import { useState } from "react";
import { deleteReservation } from "../../data/deleteReservation";
import { userDataStore } from "../../data/store/connect.store";
import { motion } from "framer-motion";
import React from "react";

const PopReservation = ({ setDisplay }: { setDisplay(val: boolean): void }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = userDataStore((state) => [state.currentReservation, state.setCurrentReservation]);

  return (
    <Overlay onClick={() => setDisplay(false)}>
      <Container
        onClick={(e) => e.stopPropagation()}
        as={motion.table}
        initial={{ y: "-20%", opacity: 0 }}
        animate={{ y: "0", opacity: 1 }}
        exit={{ y: "-20%", opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <caption>Réservation(s) en cours :</caption>
        {errorMessage ? <p>{errorMessage}</p> : null}
        <thead>
          <tr>
            <td>Convives</td>
            <td>Date</td>
            <td>Heure</td>
            <td>Email</td>
            <td>&nbsp;</td>
          </tr>
        </thead>
        <tbody>
          {data.map((reservation, id) => {
            return (
              <tr key={id} className="reservationSettings">
                <td>{reservation.guests}</td>
                <td>{new Date(reservation.date).toLocaleDateString()}</td>
                <td>{reservation.hours}</td>
                <td>
                  {reservation.email.slice(0, 3)}**
                  {reservation.email.slice(reservation.email.indexOf("@"), reservation.email.length)}
                </td>
                <td>
                  <button
                    onClick={() =>
                      deleteReservation(
                        reservation.guests,
                        new Date(reservation.date).toLocaleDateString("fr-CA"),
                        reservation.hours,
                        reservation.email
                      ).then((data) => (data.error ? setErrorMessage(data.error) : (setErrorMessage(""), setData(data.valid))))
                    }
                  >
                    <FiDelete />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Container>
    </Overlay>
  );
};

const Container = styled.table`
  display: flex;
  position: relative;
  width: clamp(500px, 70%, 1000px);
  min-width: fit-content;
  height: 400px;
  overflow-y: auto;
  flex-direction: column;
  gap: 25px;
  padding: 1rem;
  background-color: #fff;
  p {
    text-align: center;
    font-weight: 600;
  }

  caption {
    font-size: var(--font-size-reg);
  }

  tbody {
    display: flex;
    flex-direction: column;
    gap: 2vh;
  }

  tr {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    justify-items: center;
    align-items: center;
    font-size: var(--font-size);
    padding-top: 10px;

    td button {
      display: grid;
      place-items: center;

      svg {
        user-select: none;
        pointer-events: none;
      }
    }
  }
  @media screen and (max-width: 600px) {
    width: 100%;
    padding: 0.5rem;

    tr {
      font-size: var(--font-size-little);
    }

    tr {
      td:not(:last-child) {
        max-width: 100px;
        overflow-x: auto;
      }
    }
  }
`;

export default PopReservation;
