import { FormEvent, useState } from "react";
import { Overlay } from "../../assets/style/overlay";
import {
  LogContainer,
  ContentSignIn,
  ContentLogIn,
} from "../../assets/style/logStyle";
import { Cross } from "../../assets/style/cross";
import { connectStore, userDataStore } from "../../data/store/connect.store";
import { LoginDataType, signinType } from "../../types/userManagmentType";
import { motion } from "framer-motion";
import { useForm } from "@inertiajs/inertia-react";
import React from "react";
import { z } from "zod";
import { User } from "../../types/userType.store";

const Log = ({
  displayPage,
  togglePage,
}: {
  displayPage(val: boolean): void;
  togglePage: "login" | "signin";
}) => {
  const [page, setPage] = useState(togglePage);
  const [fromConfirmation, setFormConfirmation] = useState("");
  const { data, setData, post, reset } = useForm();

  const [setConnectedAdmin, setConnectedUser] = connectStore((state) => [
    state.setConnectedAdmin,
    state.setConnectedUser,
  ]);
  const setUserData = userDataStore((state) => state.setUserData);

  const submitSignin = async (e: FormEvent) => {
    e.preventDefault;
    try {
      const signinData = await signinType.parseAsync(data);
      post("/auth/register", {
        data: signinData,
        onSuccess: (success) => {
          setFormConfirmation(success.props.valid as string);
          setTimeout(() => {
            post("/auth/login", {
              data: { email: data.email, password: data.password },
              onSuccess: () => {
                setUserData(success.props.valid as User);
                setConnectedUser(true);
                setFormConfirmation("");
                displayPage(false);
              },
              onError: (err) => {
                setFormConfirmation(err as unknown as string);
                setTimeout(() => {
                  setFormConfirmation("");
                }, 2000);
              },
            });
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
        onSuccess: (success) => {
          setFormConfirmation("Connection ...");
          setTimeout(() => {
            setFormConfirmation("");
            displayPage(false);
            if ((success.props.valid as User).user) {
              setUserData(success.props.valid);
              setConnectedUser(true);
              displayPage(false);
            } else if ((success.props.valid as User).admin) {
              setConnectedAdmin(true);
            }
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
    <Overlay onClick={() => displayPage(false)}>
      <LogContainer
        onClick={(e) => e.stopPropagation()}
        as={motion.section}
        initial={{ y: "-20%", opacity: 0 }}
        animate={{ y: "0", opacity: 1 }}
        exit={{ y: "-20%", opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Cross onClick={() => displayPage(false)} />

        <h1>{page === "signin" ? "Inscrivez-vous" : "Connectez-vous"} </h1>
        {fromConfirmation && <p>{fromConfirmation}</p>}
        <form
          onSubmit={(e) => {
            page === "signin" ? submitSignin(e) : submitLogin(e);
          }}
        >
          {page === "signin" ? (
            <ContentSignIn>
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
                  autoComplete="current-password"
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
                  onChange={(e) => {
                    setData({ ...data, alergy: e.target.value });
                  }}
                  placeholder="Alergies (ex : tomates, carotte)"
                />
              </div>
            </ContentSignIn>
          ) : page === "login" ? (
            <ContentLogIn>
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
                required
                onChange={(e) => {
                  setData({ ...data, password: e.target.value });
                }}
              />
            </ContentLogIn>
          ) : null}
          <div className="ctaLog">
            {page === "signin" ? (
              <button type="submit">Créer un compte</button>
            ) : (
              <button type="submit">Connection</button>
            )}
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
      </LogContainer>
    </Overlay>
  );
};

export default Log;
