import { FormEvent, useState } from "react";
import { Overlay } from "../../assets/style/overlay";
import {
  LogContainer,
  ContentSignIn,
  ContentLogIn,
} from "../../assets/style/logStyle";
import postCreateAccount from "../../data/postCreateAccount";
import postConnection from "../../data/postConnection";
import { Cross } from "../../assets/style/cross";
import { useNavigate } from "react-router-dom";
import { connectStore } from "../../data/store/connect.store";
import { FormDataSignin, signinType } from "../../types/userManagmentType";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";

const Log = ({
  displayPage,
  togglePage,
}: {
  displayPage(val: boolean): void;
  togglePage: "login" | "signin";
}) => {
  const [page, setPage] = useState(togglePage);
  const [fromConfirmation, setFormConfirmation] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormDataSignin>({ resolver: zodResolver(signinType) });

  const setConnectedAdmin = connectStore((state) => state.setConnectedAdmin);
  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [loginConfirmation, setLoginConfirmation] = useState("");
  type responseType = { error?: string; valid?: string };

  const submitSignin = async (signinData: FormDataSignin) => {
    try {
      const response = await postCreateAccount(signinData);
      const responseData: responseType = await response.json();

      if (!response.ok) {
        setFormConfirmation(responseData.error!);
        setTimeout(() => {
          setFormConfirmation("");
        }, 2000);
      } else {
        setFormConfirmation(responseData.valid!);
        setTimeout(() => {
          return submitLogin(signinData.email, signinData.password, null);
        }, 1000);
      }
    } catch (error) {
      throw new Error(error as string);
    }
  };

  const submitLogin = async (
    email: string,
    password: string,
    e: FormEvent | null
  ) => {
    e!.preventDefault();
    try {
      const response: responseType = await postConnection(
        email || loginEmail,
        password || loginPassword
      );

      if (response.error) {
        setLoginConfirmation(response.error!);
      } else {
        if (response.valid == "user") {
          navigate(0);
        } else {
          setConnectedAdmin(true);
          displayPage(false);
          navigate("/admin");
        }
        setLoginConfirmation("");
      }
    } catch (error) {
      throw new Error(error as string);
    }
  };
  function ErrorhandleFormSignin() {
    if (errors) {
      for (const key in errors) {
        if (Object.prototype.hasOwnProperty.call(errors, key)) {
          const element = errors[key as keyof typeof errors];
          return <p>{element!.message}</p>;
        }
      }
    } else {
      return null;
    }
  }

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
        <ErrorhandleFormSignin />
        {page === "login" && loginConfirmation ? (
          <p>{loginConfirmation}</p>
        ) : null}

        <form
          onSubmit={
            page === "signin"
              ? handleSubmit(submitSignin)
              : (e) => submitLogin(loginEmail, loginPassword, e)
          }
        >
          {page === "signin" ? (
            <ContentSignIn>
              <div className="profil">
                <input
                  type="text"
                  placeholder="Nom"
                  autoComplete="family-name"
                  autoFocus
                  {...register("name", { required: true })}
                  required
                />
                <input
                  type="email"
                  required
                  placeholder="Adresse e-mail"
                  {...register("email", { required: true })}
                  onChange={(e) => setValue("email", e.target.value)}
                />
              </div>
              <div className="password">
                <input
                  type="password"
                  placeholder="Mot de passe"
                  autoComplete="current-password"
                  required
                  {...register("password", { required: true })}
                  onChange={(e) => setValue("password", e.target.value)}
                />
                <input
                  type="password"
                  autoComplete="password"
                  required
                  placeholder="Confirmation mot de passe"
                  {...register("confirmPassword", { required: true })}
                />
              </div>
              <div className="adds">
                <input
                  type="number"
                  placeholder="Convives par défaut (1-9)"
                  required
                  {...register("guests", {
                    required: true,
                    valueAsNumber: true,
                  })}
                  onChange={(e) => setValue("guests", parseInt(e.target.value))}
                />
                <input
                  type="text"
                  {...register("alergy", { required: true })}
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setLoginEmail(e.target.value);
                }}
              />
              <input
                type="password"
                placeholder="Mot de passe"
                required
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setLoginPassword(e.target.value);
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
                setLoginConfirmation("");
                setLoginEmail("");
                setLoginPassword("");
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
