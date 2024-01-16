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
      <div className="flex justify-center items-center gap-[50px] w-full">
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
        <Link href="/admin" className="text-[var(--darker-color)]">
          Administration
        </Link>
      </div>
    ) : (
      <div className="flex justify-center items-center gap-[50px] w-full">
        <nav className="ml-auto w-max">
          <ul className="flex justify-center gap-x-[2vw]">
            <li className="grid place-items-center text-base">
              <Link href="/carte" className="text-[var(--darker-color)]">
                Carte
              </Link>
            </li>
            <li>
              <button className="btnReserve" onClick={() => setRes(true)}>
                Réserver
              </button>
            </li>
          </ul>
        </nav>
        <div className="relative ml-auto flex items-center justify-center gap-x-[2vw] px-4">
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
                className="max-[600px]:w-[30px] max-[600px]:h-[30px] hover:bg-[var(--darker-color)] grid place-items-center rounded-full border-solid border-[var(--darker-color)] border-2 text-white font-semibold text-sm h-[clamp(30px,4vh,100px)] aspect-square z-50 bg-[var(--darker-color-a70)] p-0"
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
      </div>
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

      <header
        className={`fixed top-0 w-full h-full flex justify-center items-center bg-[var(--primary-color)] transition-all z-50 ${
          displayHeader
            ? "max-[600px]:transition-all max-[600px]:h-[40vh] max-[600px]:max-h-[800px] max-[600px]:min-h-[350px] max-[600px]:gap-[5vh] max-[600px]:pb-4"
            : "max-[600px]:h-auto max-[600px]:justify-start"
        }`}
      >
        <div className="grid place-items-center p-4 h-full">
          <Link href="/">
            <img
              src={icon}
              alt="Icon du site"
              className="h-[5vh] min-h-[40px] max-h-[100px] aspect-square"
            />
          </Link>
        </div>
        <NavMenu />
        <span
          className={`max-[600px]:block cursor-pointer absolute top-1/2 translate-y-[-50%] hidden h-[3vh] min-h-[20px] aspect-square bg-[var(--burger-icon)] transition-all z-50`}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
            (e.target as Node).parentNode!.children[1].classList.toggle(
              "display"
            )
          }
        />
      </header>
    </>
  );
};

export default Header;
