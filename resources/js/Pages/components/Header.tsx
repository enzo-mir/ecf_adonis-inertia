import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import icon from "../../assets/images/icon.svg";
import Log from "./Log";
import {
  Wrapper,
  HeaderContainer,
  BtnMenu,
} from "../../assets/style/headerStyle";
import ProfilComponent from "./ProfilComponent";
import Reserv from "./Reservation";
import logout from "../../data/logout";
import PopReservation from "./PopReservation";
import { connectStore, userDataStore } from "../../data/store/connect.store";
import { query } from "../../data/fetchAllData";
import { AnimatePresence } from "framer-motion";
import { hourStore } from "../../data/store/apiData.store";
import React from "react";

const Header = () => {
  const [logPage, setLogPage] = useState(false);
  const [profilPage, setProfilPage] = useState(false);
  const [res, setRes] = useState(false);
  const [togglePage, setTogglePage] = useState<"login" | "signin">("signin");
  const [displayModalReservation, setDisplayModalReservation] = useState(false);
  const [displayHeader, setDisplayHeader] = useState(false);
  const navigate = useNavigate();
  const connectedUser = connectStore((state) => state.connectedUser);
  const [isAdmin, setIsAdmin] = connectStore((state) => [
    state.connectedAdmin,
    state.setConnectedAdmin,
  ]);
  const [userData, userReservation] = userDataStore((state) => [
    state.userData,
    state.currentReservation,
  ]);
  const setHours = hourStore((state) => state.setHours);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/carte")
      query().then((data) => setHours(data.hours));
  }, [setHours, location.pathname]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  let prevScroll = window.scrollY;

  document.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;
    if (prevScroll > currentScroll) {
      setDisplayHeader(false);
    } else {
      setDisplayHeader(true);
    }
    prevScroll = currentScroll;
  });

  document.addEventListener("mousedown", (e: MouseEvent): void => {
    const obj = document.querySelector("header");
    if (obj) {
      const dropDownContent = obj.children[1];
      if (!obj.contains(e.target as Node)) {
        dropDownContent.classList.remove("display");
      }
    }
  });

  const NavMenu = () => {
    return isAdmin ? (
      <HeaderContainer>
        <button
          onClick={async () => {
            await logout().then(() => {
              setIsAdmin(false), navigate("/");
            });
          }}
        >
          Déconnection
        </button>
        <button
          onClick={() => {
            navigate("/admin");
          }}
        >
          Administration
        </button>
      </HeaderContainer>
    ) : (
      <HeaderContainer>
        <nav>
          <ul>
            <li>
              <NavLink to="/carte">Carte</NavLink>
            </li>
            <li>
              <button className="btnReserve" onClick={() => setRes(true)}>
                Réserver
              </button>
            </li>
          </ul>
        </nav>
        <div className="profil">
          {!connectedUser ? (
            <>
              <button
                className="signIn"
                onClick={() => {
                  setTogglePage("signin");
                  setLogPage(true);
                }}
              >
                Inscription
              </button>
              <button
                className="logIn"
                onClick={() => {
                  setLogPage(true);
                  setTogglePage("login");
                }}
              >
                Connexion
              </button>
            </>
          ) : (
            <>
              <button
                className="reservations"
                onClick={() => setDisplayModalReservation(true)}
              >
                {userReservation.length}
              </button>
              <button id="profil" onClick={() => setProfilPage(true)}>
                {userData ? userData.name.charAt(0) : null}
              </button>
            </>
          )}
        </div>
      </HeaderContainer>
    );
  };

  return (
    <>
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
      <AnimatePresence>{res ? <Reserv res={setRes} /> : null}</AnimatePresence>
      <AnimatePresence>
        {displayModalReservation ? (
          <PopReservation setDisplay={setDisplayModalReservation} />
        ) : null}
      </AnimatePresence>

      <Wrapper className={displayHeader ? "display" : ""}>
        <div className="imgContainer">
          <Link to="/">
            <img src={icon} alt="Icon du site" />
          </Link>
        </div>
        <NavMenu />
        <BtnMenu
          onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
            (e.target as Node).parentNode!.children[1].classList.toggle(
              "display"
            )
          }
        />
      </Wrapper>
    </>
  );
};

export default Header;
