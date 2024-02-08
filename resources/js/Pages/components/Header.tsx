import React, { Suspense, useEffect, useState } from "react";
import icon from "../../assets/images/icon.svg";
import { connectStore, userDataStore } from "../../data/store/connect.store";
import { AnimatePresence } from "framer-motion";
import { Link, useForm } from "@inertiajs/inertia-react";
import overlayStyles from "../../../css/overlay.module.css";
const Reserv = React.lazy(() => import("./Reservation"));
const PopReservation = React.lazy(() => import("./PopReservation"));
const ProfilComponent = React.lazy(() => import("./ProfilComponent"));
import styles from "../../../css/header.module.css";
const Log = React.lazy(() => import("./Log"));

const Header = () => {
  const [logPage, setLogPage] = useState(false);
  const [profilPage, setProfilPage] = useState(false);
  const [res, setRes] = useState(false);
  const [togglePage, setTogglePage] = useState<"login" | "signin">("signin");
  const [displayModalReservation, setDisplayModalReservation] = useState(false);
  const [displayHeader, setDisplayHeader] = useState(false);
  const connectedUser = connectStore((state) => state.connectedUser);
  const [isAdmin, setIsAdmin] = connectStore((state) => [
    state.connectedAdmin,
    state.setConnectedAdmin,
  ]);
  const { post } = useForm();
  const [userData, setuserData] = userDataStore((state) => [
    state.userData,
    state.setUserData,
  ]);
  useEffect(() => {
    window.scrollTo(0, 0);
    setDisplayHeader(false);
  }, [location.pathname]);
  let prevScroll = window.scrollY;

  document.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;
    if (window.innerWidth >= 600) {
      if (prevScroll > currentScroll) {
        setDisplayHeader(false);
      } else {
        setDisplayHeader(true);
      }
      prevScroll = currentScroll;
    }
  });

  document.addEventListener("mousedown", (e: MouseEvent): void => {
    const obj = document.querySelector("header");
    if (obj) {
      if (!obj.contains(e.target as Node)) {
        setDisplayHeader(false);
      }
    }
  });

  const NavMenu = () => {
    return isAdmin ? (
      <div className={styles.header_container}>
        <button
          onClick={() => {
            post("/profile/logout", {
              onSuccess: () => {
                setIsAdmin(false);
              },
            });
          }}
        >
          Déconnection
        </button>
        <Link href="/admin">Administration</Link>
      </div>
    ) : (
      <div className={styles.header_container}>
        <nav>
          <ul>
            <li>
              <Link href="/carte">Carte</Link>
            </li>
            <li>
              <button className="btnReserve" onClick={() => setRes(true)}>
                Réserver
              </button>
            </li>
          </ul>
        </nav>
        <div className={styles.profil}>
          {!connectedUser ? (
            <button
              onClick={() => {
                setLogPage(true);
                setTogglePage("signin");
              }}
            >
              S'identifier
            </button>
          ) : (
            <>
              <button
                className="reservations"
                onClick={() => setDisplayModalReservation(true)}
              >
                {userData.currentReservation.length}
              </button>
              <button
                className={styles.profil_btn}
                onClick={() => setProfilPage(true)}
              >
                {userData ? userData.name.charAt(0) : null}
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Suspense fallback={<div className={overlayStyles.overlay} />}>
        <AnimatePresence>
          {logPage ? (
            <Log displayPage={setLogPage} togglePage={togglePage} />
          ) : null}
        </AnimatePresence>
        <AnimatePresence>
          {profilPage ? (
            <ProfilComponent setDisplayProfil={setProfilPage} />
          ) : null}
        </AnimatePresence>
        <AnimatePresence>
          {res ? <Reserv res={setRes} /> : null}
        </AnimatePresence>
        <AnimatePresence>
          {displayModalReservation && (
            <PopReservation setDisplay={setDisplayModalReservation} />
          )}
        </AnimatePresence>
      </Suspense>

      <header
        className={styles.header}
        data-visible={displayHeader ? "true" : "false"}
      >
        <div className={styles.imgContainer}>
          <Link href="/">
            <img src={icon} alt="Icon du site" />
          </Link>
        </div>
        <NavMenu />
        <button
          className={styles.btn_menu}
          onClick={() =>
            setDisplayHeader(displayHeader === true ? false : true)
          }
        />
      </header>
    </>
  );
};

export default Header;
