import { FormEvent, useState } from "react";
import { Cross } from "../../assets/style/cross";
import { LoginDataType, signinType } from "../../types/userManagmentType";
import { motion } from "framer-motion";
import { useForm } from "@inertiajs/inertia-react";
import React from "react";
import { z } from "zod";
import styles from "../../../css/logs.module.css";
import overlayStyles from "../../../css/overlay.module.css";

const Log = ({
  displayPage,
  togglePage,
}: {
  displayPage(val: boolean): void;
  togglePage: "login" | "signin";
}) => {
  const [page, setPage] = useState(togglePage);
  const [fromConfirmation, setFormConfirmation] = useState("");
  const { data, setData, post, reset, processing } = useForm();

  const submitSignin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const signinData = await signinType.parseAsync({
        ...data,
        alergy: data.alergy || "",
      });

      post("/auth/register", {
        data: signinData,
        onSuccess: () => {
          setFormConfirmation("Connection ...");
          setTimeout(() => {
            setFormConfirmation("");
            displayPage(false);
          }, 1000);
        },
        onError: (err) => {
          setFormConfirmation(err as unknown as string);
          setTimeout(() => {
            setFormConfirmation("");
          }, 2000);
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setFormConfirmation(error.errors[0].message);
      } else {
        setFormConfirmation(error.message);
      }
    }
  };

  const submitLogin = (e: FormEvent) => {
    e.preventDefault();
    try {
      const loginData = LoginDataType.parse(data);

      post("/auth/login", {
        data: loginData,
        onSuccess: () => {
          setFormConfirmation("Connection ...");
          setTimeout(() => {
            setFormConfirmation("");
            displayPage(false);
          }, 1500);
        },
        onError: (err) => {
          setFormConfirmation(err as unknown as string);
          setTimeout(() => {
            setFormConfirmation("");
          }, 2000);
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setFormConfirmation(error.errors[0].message);
      } else {
        setFormConfirmation(error.message);
      }
    }
  };

  return (
    <div className={overlayStyles.overlay} onClick={() => displayPage(false)}>
      <motion.section
        className={styles.log_section}
        onClick={(e) => e.stopPropagation()}
        initial={{ y: "-20%", opacity: 0 }}
        animate={{ y: "0", opacity: 1 }}
        exit={{ y: "-20%", opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Cross onClick={() => displayPage(false)} />

        <h1>{page === "signin" ? "Inscrivez-vous" : "Connectez-vous"} </h1>
        {fromConfirmation && (
          <p className="validationMessage">{fromConfirmation}</p>
        )}
        <form
          className={styles.form}
          onSubmit={(e) => {
            page === "signin" ? submitSignin(e) : submitLogin(e);
          }}
        >
          {page === "signin" ? (
            <div className={styles.signin}>
              <div className="profil">
                <input
                  type="text"
                  placeholder="Nom"
                  autoComplete="family-name"
                  required
                  autoFocus
                  onChange={(e) => {
                    setData({ ...data, name: e.target.value });
                  }}
                />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="Adresse e-mail"
                  onChange={(e) => {
                    setData({ ...data, email: e.target.value });
                  }}
                />
              </div>
              <div className="password">
                <input
                  type="password"
                  placeholder="Mot de passe"
                  autoComplete="new-password"
                  required
                  onChange={(e) => {
                    setData({ ...data, password: e.target.value });
                  }}
                />
                <input
                  type="password"
                  autoComplete="password"
                  required
                  placeholder="Confirmation mot de passe"
                  onChange={(e) => {
                    setData({ ...data, confirmPassword: e.target.value });
                  }}
                />
              </div>
              <div className="adds">
                <input
                  type="number"
                  placeholder="Convives par défaut (1-9)"
                  required
                  onChange={(e) => {
                    setData({ ...data, guests: parseInt(e.target.value) });
                  }}
                />
                <input
                  type="text"
                  defaultValue={""}
                  onChange={(e) => {
                    setData({
                      ...data,
                      alergy: e.target.value,
                    });
                  }}
                  placeholder="Alergies (ex : tomates, carotte)"
                />
              </div>
            </div>
          ) : page === "login" ? (
            <div className={styles.login}>
              <input
                type="text"
                placeholder="Adresse e-mail"
                autoComplete="email"
                required
                autoFocus
                onChange={(e) => {
                  setData({ ...data, email: e.target.value });
                }}
              />
              <input
                type="password"
                placeholder="Mot de passe"
                autoComplete="password"
                required
                onChange={(e) => {
                  setData({ ...data, password: e.target.value });
                }}
              />
            </div>
          ) : null}
          <div className={styles.ctaLog}>
            <button type="submit" disabled={processing}>
              {page === "signin" ? "Créer un compte" : "Connection"}
            </button>
            <p
              onClick={() => {
                setPage(page === "signin" ? "login" : "signin");
                setFormConfirmation("");
                reset();
              }}
            >
              {page === "signin"
                ? "vous avez déjà un compte ? connectez-vous"
                : "vous n'avez pas encore de compte ? créez un compte"}
            </p>
          </div>
        </form>
      </motion.section>
    </div>
  );
};

export default Log;
