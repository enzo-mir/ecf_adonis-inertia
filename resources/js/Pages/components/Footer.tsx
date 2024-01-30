import { useState } from "react";
import { Link } from "@inertiajs/inertia-react";
import Reserv from "./Reservation";
import { hourStore } from "../../data/store/apiData.store";
import { AnimatePresence } from "framer-motion";
import React from "react";
import styles from "../../../css/footer.module.css";

const Footer = () => {
  const hoursStore = hourStore((state) => state.hours);
  const [res, setRes] = useState(false);

  return (
    <footer className={styles.footer}>
      <AnimatePresence>{res ? <Reserv res={setRes} /> : null}</AnimatePresence>
      <table className={styles.hours}>
        <thead>
          <tr>
            <th>Horaires d&#39;ouvertures</th>
          </tr>
        </thead>
        <tbody>
          {hoursStore?.map((elem, id) => {
            return (
              <tr key={id}>
                <td>{elem.day}</td>
                <td>{elem.lunch}</td>
                <td>{elem.dinner}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <nav>
        <ul>
          <li>
            <Link href="/">Accueil</Link>
          </li>
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
      <p>Tous droits réservés</p>
    </footer>
  );
};

export default Footer;
