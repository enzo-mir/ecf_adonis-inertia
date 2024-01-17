import React, { Suspense, useEffect, useState } from "react";
import icon from "../../assets/images/icon.svg";
import {
  Wrapper,
  HeaderContainer,
  BtnMenu,
} from "../../assets/style/headerStyle";
import { connectStore, userDataStore } from "../../data/store/connect.store";
import { AnimatePresence } from "framer-motion";
import { Link, useForm } from "@inertiajs/inertia-react";
import Loading from "../Loading";
import { Overlay } from "../../assets/style/overlay";
const Reserv = React.lazy(() => import("./Reservation"));
const PopReservation = React.lazy(() => import("./PopReservation"));
const ProfilComponent = React.lazy(() => import("./ProfilComponent"));
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
          onClick={() => {
            post("/profile/logout", {
              onSuccess: () => {
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
                setIsAdmin(false);
              },
            });
          }}
        >
          Déconnection
        </button>
        <Link href="/admin">Administration</Link>
      </HeaderContainer>
    ) : (
      <HeaderContainer>
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
        <div className="profil">
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
                {userData.user.currentReservation.length}
              </button>
              <button id="profil" onClick={() => setProfilPage(true)}>
                {userData ? userData.user.name.charAt(0) : null}
              </button>
            </>
          )}
        </div>
      </HeaderContainer>
    );
  };

  return (
    <>
      <Suspense fallback={<Overlay />}>
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

      <Wrapper className={displayHeader ? "display" : ""}>
        <div className="imgContainer">
          <Link href="/">
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
