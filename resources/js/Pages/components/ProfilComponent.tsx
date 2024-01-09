import { useEffect, useState } from "react";
import { Overlay } from "../../assets/style/overlay";
import { ContainerSettings } from "../../assets/style/profilComponentsStyle";
import logout from "../../data/logout";
import deleteAccount from "../../data/deleteAccount";
import { connectStore, userDataStore } from "../../data/store/connect.store";
import { Cross } from "../../assets/style/cross";
import { motion } from "framer-motion";
import {
  UpdatedFormDataType,
  updateZodType,
} from "../../types/userManagmentType";
import { z } from "zod";
import updateProfil from "../../data/updateProfil";
import React from "react";

const ProfilComponent = ({
  setDisplayProfil,
}: {
  setDisplayProfil(vale: boolean): void;
}) => {
  const [editable, setEditable] = useState<boolean>(false);
  const [userData, setuserData] = userDataStore((state) => [
    state.userData,
    state.setUserData,
  ]);
  const setConnectedUser = connectStore((state) => state.setConnectedUser);

  const [inputInfo, setInputInfo] = useState<UpdatedFormDataType>({
    name: userData.user.name,
    email: userData.user.email,
    guests: userData.user.guests!,
    password: null,
    alergy: userData.user.alergy,
    oldEmail: userData.user.email,
  });

  const [validationMessage, setValidationMessage] = useState<string>("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.removeAttribute("style");
    };
  }, []);

  function validationForm() {
    try {
      const zodScheama = updateZodType.parse(inputInfo);
      if (zodScheama) {
        setValidationMessage("");
        updateProfil(inputInfo).then((data) =>
          data.error
            ? setValidationMessage(data.error)
            : (setuserData(data.data),
              setValidationMessage(data.valid),
              setEditable(!editable),
              setTimeout(() => {
                setValidationMessage("");
              }, 1000))
        );
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationMessage(error.errors[0].message);
      }
    }
  }
  function deletingAcc() {
    deleteAccount(inputInfo.email)
      .then((response) => response.json())
      .then((data) => {
        data.success
          ? (setDisplayProfil(false),
            setConnectedUser(false),
            setuserData({
              user: {
                name: "",
                email: "",
                password: "",
                guests: 0,
                alergy: "",
              },
            }))
          : data.error
          ? setValidationMessage(data.error)
          : null;
      });
  }

  return (
    <Overlay onClick={() => setDisplayProfil(false)}>
      <ContainerSettings
        onClick={(e) => e.stopPropagation()}
        as={motion.div}
        initial={{ y: "-20%", opacity: 0 }}
        animate={{ y: "0", opacity: 1 }}
        exit={{ y: "-20%", opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Cross onClick={() => setDisplayProfil(false)} />
        {validationMessage ? (
          <p className="error">{validationMessage}</p>
        ) : null}
        {editable ? (
          <>
            <div className="profilAcount">
              <label htmlFor="name">
                nom :
                <input
                  type="text"
                  name="name"
                  value={inputInfo.name}
                  onChange={(e) =>
                    setInputInfo({ ...inputInfo, name: e.target.value })
                  }
                />
              </label>
              <label htmlFor="email">
                e-mail
                <input
                  type="email"
                  name="email"
                  value={inputInfo.email}
                  onChange={(e) =>
                    setInputInfo({ ...inputInfo, email: e.target.value })
                  }
                />
              </label>
            </div>
            <div className="addsOn">
              <label htmlFor="guests">
                Convives (par défaut) :
                <input
                  type="number"
                  min={1}
                  name="guests"
                  value={inputInfo.guests}
                  onChange={(e) =>
                    setInputInfo({
                      ...inputInfo,
                      guests: parseInt(e.target.value),
                    })
                  }
                />
              </label>
              <label htmlFor="alergy">
                Alergies :
                <input
                  type="text"
                  name="alergy"
                  value={inputInfo.alergy}
                  onChange={(e) =>
                    setInputInfo({ ...inputInfo, alergy: e.target.value })
                  }
                />
              </label>
            </div>
            <div className="passwordField">
              <label htmlFor="name">
                Mot de passe :
                <input
                  type="text"
                  name="name"
                  value={inputInfo.password || ""}
                  onChange={(e) =>
                    setInputInfo({ ...inputInfo, password: e.target.value })
                  }
                />
              </label>
            </div>
          </>
        ) : (
          <>
            <div className="profilAcount">
              <p>
                nom : <strong>{inputInfo.name}</strong>
              </p>
              <p>
                e-mail : <strong>{inputInfo.email}</strong>
              </p>
            </div>
            <div className="addsOn">
              <p>
                convives (par défaut) : <strong>{inputInfo.guests!}</strong>
              </p>
              <p>
                alergies : <strong>{inputInfo.alergy || "aucune"}</strong>
              </p>
            </div>
            ;
          </>
        )}

        <div className="cta">
          {!editable ? (
            <button
              onClick={() => {
                setEditable(true);
              }}
            >
              Éditer les infos
            </button>
          ) : (
            <button onClick={validationForm}>Édition finit</button>
          )}
          <button
            onClick={() => {
              logout();
              setDisplayProfil(false);
              setConnectedUser(false);
              setuserData({
                user: {
                  id: 0,
                  name: "",
                  email: "",
                  password: "",
                  guests: 0,
                  alergy: "",
                },
              });
            }}
          >
            Déconnection
          </button>
          <button onClick={deletingAcc}>supprimer le compte</button>
        </div>
      </ContainerSettings>
    </Overlay>
  );
};
export default ProfilComponent;
