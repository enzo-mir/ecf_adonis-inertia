import styled from "styled-components";
import { Overlay } from "../../assets/style/overlay";
import { FiDelete } from "react-icons/fi";
import { useState } from "react";
import { deleteReservation } from "../../data/deleteReservation";
import { userDataStore } from "../../data/store/connect.store";
import { motion } from "framer-motion";
import React from "react";
import { useForm } from "@inertiajs/inertia-react";
import { currentReservationType } from "../../types/userType.store";

const PopReservation = ({ setDisplay }: { setDisplay(val: boolean): void }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [userData, setUserData] = userDataStore((state) => [
    state.userData,
    state.setUserData,
  ]);
  const { post, processing, data, setData, reset } = useForm({
    guests: 0,
    date: "",
    hours: "",
    email: "",
  });
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
          {userData.user.currentReservation.map((reservation, id) => {
            return (
              <tr key={id} className="reservationSettings">
                <td>{reservation.guests}</td>
                <td>{new Date(reservation.date).toLocaleDateString()}</td>
                <td>{reservation.hours}</td>
                <td>
                  {reservation.email.slice(0, 3)}**
                  {reservation.email.slice(
                    reservation.email.indexOf("@"),
                    reservation.email.length
                  )}
                </td>
                <td>
                  {data.date === reservation.date ? (
                    <div className="deleteOption">
                      <p>êtes-vous sûr ?</p>
                      <button
                        onClick={() => {
                          post("/reservation/delete", {
                            data,
                            onError: (err) => {
                              setErrorMessage(err as unknown as string);
                            },
                            onSuccess: (success) => {
                              setErrorMessage(""),
                                setUserData({
                                  user: {
                                    ...userData.user,
                                    currentReservation: success.props
                                      .valid as currentReservationType[],
                                  },
                                });
                            },
                          });
                        }}
                      >
                        Oui
                      </button>
                      <button
                        onClick={() => {
                          reset();
                        }}
                      >
                        Non
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setData({
                          guests: reservation.guests,
                          date: reservation.date,
                          hours: reservation.hours,
                          email: reservation.email,
                        });
                      }}
                    >
                      <FiDelete />
                    </button>
                  )}
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

    td {
      & div.deleteOption {
        display: grid;
        grid-template-rows: repeat(2, auto);
        grid-template-columns: repeat(2, 1fr);
        gap: 0.25em;
        font-size: 0.75em;
        flex-wrap: wrap;

        & > p {
          grid-area: 1 / 1 / 2 / 3;
        }
      }
      & button {
        display: grid;
        place-items: center;
        font-size: 0.75em;

        svg {
          user-select: none;
          pointer-events: none;
        }
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
