import { FormEvent, useEffect, useState } from "react";
import { connectStore, userDataStore } from "../../data/store/connect.store";
import { Cross } from "../../assets/style/cross";
import { motion } from "framer-motion";
import { updateZodType } from "../../types/userManagmentType";
import { z } from "zod";
import React from "react";
import { useForm } from "@inertiajs/inertia-react";
import { User } from "../../types/userType.store";
import styles from "../../../css/profil.module.css";
import overlayStyles from "../../../css/overlay.module.css";
const ProfilComponent = ({
  setDisplayProfil,
}: {
  setDisplayProfil(vale: boolean): void;
}) => {
  const [userData, setuserData] = userDataStore((state) => [
    state.userData,
    state.setUserData,
  ]);
  const { post, data, setData, reset, processing } = useForm({
    name: userData.user.name,
    email: userData.user.email,
    guests: userData.user.guests,
    password: null,
    alergy: userData.user.alergy,
  });
  const setConnectedUser = connectStore((state) => state.setConnectedUser);

  const [validationMessage, setValidationMessage] = useState<string>("");
  const [editable, setEditable] = useState<boolean>(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.removeAttribute("style");
      setEditable(false);
    };
  }, []);

  async function validationForm(e: FormEvent) {
    e.preventDefault();
    setValidationMessage("");

    var objectComparaison: boolean = true;
    const objectToCompare = { ...data };
    Object.assign(objectToCompare, {
      currentReservation: userData.user.currentReservation,
    });
    function areObjectsEqual() {
      for (const key in objectToCompare) {
        if (Object.prototype.hasOwnProperty.call(objectToCompare, key)) {
          if (
            objectToCompare[key] !==
            { ...userData.user, password: data.password }[key]
          )
            return false;
        }
      }
      return true;
    }
    if (areObjectsEqual()) {
      objectComparaison = false;
    } else {
      objectComparaison = true;
    }

    if (!objectComparaison) {
      setEditable(false);
      reset();
    } else {
      try {
        await updateZodType.parseAsync(data);
        post("/profile/update", {
          data,
          onError: (err) => {
            setValidationMessage(err as unknown as string);
          },
          onSuccess: (success) => {
            setuserData({
              user: { ...userData.user, ...(success.props.valid as User) },
            });
            setEditable(false);
          },
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          setValidationMessage(error.errors[0].message);
        } else {
          setValidationMessage(error.message);
        }
      }
    }
  }

  const EditableCta = () => {
    function logout() {
      post("/profile/logout", {
        onSuccess: () => {
          setValidationMessage("Déconnection ...");
          setTimeout(() => {
            setDisplayProfil(false);
            setConnectedUser(false);
            setuserData({
              user: {
                name: "",
                email: "",
                password: "",
                guests: 0,
                alergy: "",
                currentReservation: [],
              },
            });
            setDisplayProfil(false);
            reset();
          }, 1500);
        },
      });
    }

    function deleteAccount() {
      post("/profile/delete", {
        onSuccess: () => {
          setValidationMessage("Profil effacé !");
          setTimeout(() => {
            setDisplayProfil(false);
            setConnectedUser(false);
            reset();
            setuserData({
              user: {
                name: "",
                email: "",
                password: "",
                guests: 0,
                alergy: "",
                currentReservation: [],
              },
            });
            setDisplayProfil(false);
          }, 1500);
        },
        onError: (err) => {
          setValidationMessage(err as unknown as string);
        },
      });
    }
    return (
      <div className={styles.ctaProfil}>
        {editable ? (
          <button type="submit" disabled={processing}>
            Édition finit
          </button>
        ) : (
          <button
            onMouseDown={() => {
              setEditable(true);
            }}
          >
            Éditer les infos
          </button>
        )}

        <button onMouseDown={logout}>Déconnection</button>
        <button onMouseDown={deleteAccount}>supprimer le compte</button>
      </div>
    );
  };

  return (
    <div
      className={overlayStyles.overlay}
      onClick={() => setDisplayProfil(false)}
    >
      <motion.section
        className={styles.profil_section}
        onClick={(e) => e.stopPropagation()}
        initial={{ y: "-20%", opacity: 0 }}
        animate={{ y: "0", opacity: 1 }}
        exit={{ y: "-20%", opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Cross onClick={() => setDisplayProfil(false)} />
        {validationMessage ? (
          <p className={styles.validationMessage}>{validationMessage}</p>
        ) : null}
        {editable ? (
          <form onSubmit={validationForm}>
            <div className="profilAcount">
              <label htmlFor="name">
                nom :
                <input
                  type="text"
                  name="name"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                />
              </label>
              <label htmlFor="email">
                e-mail :
                <input
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
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
                  value={data.guests}
                  onChange={(e) =>
                    setData({
                      ...data,
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
                  value={data.alergy}
                  onChange={(e) => setData({ ...data, alergy: e.target.value })}
                />
              </label>
            </div>
            <div className={styles.passwordField}>
              <label htmlFor="name">
                Mot de passe :
                <input
                  type="text"
                  name="name"
                  value={data.password || ""}
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                />
              </label>
            </div>
            <EditableCta />
          </form>
        ) : (
          <div>
            <div className="profilAcount">
              <p>
                nom : <strong>{data.name}</strong>
              </p>
              <p>
                e-mail : <strong>{data.email}</strong>
              </p>
            </div>
            <div className="addsOn">
              <p>
                convives (par défaut) : <strong>{data.guests!}</strong>
              </p>
              <p>
                alergies : <strong>{data.alergy || "aucune"}</strong>
              </p>
            </div>
            <EditableCta />
          </div>
        )}
      </motion.section>
    </div>
  );
};
export default ProfilComponent;
