import { useState } from "react";
import Reserv from "./components/Reservation";
import { Wrapper, HeroSection, SectionPlats } from "../assets/style/homeStyle";
import { hourStore } from "../data/store/apiData.store";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import Layout from "./components/Layout";
import { connectStore, userDataStore } from "../data/store/connect.store";

const Home = ({ userData, hours, images }) => {
  const [res, setRes] = useState(false);
  const setHours = hourStore((state) => state.setHours);
  const setUserData = userDataStore((state) => state.setUserData);
  const setConnectedUser = connectStore((state) => state.setConnectedUser);

  setHours(hours);
  if (userData?.user) {
    setUserData(userData);
    setConnectedUser(true);
  }

  const containerVariant = {
    hiddenHeader: { opacity: 0 },
    showHeader: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
    hiddenText: { opacity: 0 },
    showText: {
      opacity: 1,
      transition: {
        staggerChildren: 0.5,
        duration: 1,
      },
    },
  };

  const itemVariant = {
    hiddenHeader: { opacity: "0", x: "-20%" },
    showHeader: { opacity: "1", x: "0" },
    hiddenText: { opacity: "0", y: "-20%" },
    showText: { opacity: "1", y: "0" },
  };

  return (
    <Wrapper>
      <AnimatePresence>{res && <Reserv res={setRes} />}</AnimatePresence>
      <HeroSection>
        <div className="headerPage">
          <img
            src="https://images.unsplash.com/photo-1520209268518-aec60b8bb5ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&q=80"
            alt="restaurant teinté marron conviviale"
            srcSet="https://images.unsplash.com/photo-1520209268518-aec60b8bb5ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80 500w,
            https://images.unsplash.com/photo-1520209268518-aec60b8bb5ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&q=80 700w,
            https://images.unsplash.com/photo-1520209268518-aec60b8bb5ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=900&q=80 900w,
            https://images.unsplash.com/photo-1520209268518-aec60b8bb5ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80 1200w"
          />
          <motion.aside
            variants={containerVariant}
            initial="hiddenHeader"
            animate="showHeader"
          >
            <motion.h1 variants={itemVariant}>Le Quai Antique</motion.h1>
            <motion.h2 variants={itemVariant}>
              Votre restaurant de la savoie
            </motion.h2>
            <motion.button variants={itemVariant}>
              <a href="#contextText">Découvrir</a>
            </motion.button>
          </motion.aside>
        </div>
      </HeroSection>

      <SectionPlats>
        <div className="textContent" id="contextText">
          <p>
            Venez découvrir la Savoie à travers une expérience gastronomique,
            installé à Chambéry, Le Quai Antique saura vous satisfaire tout au
            long de votre repas.
          </p>
          <p>
            Nos plats traditionnels de la Savoie charmeront à coup sûr vos
            papilles gustatives alors qu’attendez-vous ? <br />
            <br />
            Venez à table !
          </p>
        </div>
        <button className="btnReserve" onClick={() => setRes(true)}>
          Réservez une table
        </button>
        {images?.length ? (
          <div className="imagesGalery">
            {images?.map((images, id) => {
              return (
                <div key={id}>
                  <img src={images.url} alt="plat du chef" loading="lazy" />
                  <span>
                    <h1>{images.title}</h1>
                    <p>{images.description}</p>
                  </span>
                </div>
              );
            })}
          </div>
        ) : null}
      </SectionPlats>
    </Wrapper>
  );
};
Home.layout = (page: HTMLElement) => <Layout children={page} />;

export default Home;
