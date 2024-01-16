import { Suspense, useEffect, useState } from "react";
import React from "react";
const Reserv = React.lazy(() => import("./components/Reservation"));
const Layout = React.lazy(() => import("./components/Layout"));
import { Wrapper, HeroSection, SectionPlats } from "../assets/style/homeStyle";
import { hourStore } from "../data/store/apiData.store";
import { AnimatePresence, motion } from "framer-motion";
import { connectStore, userDataStore } from "../data/store/connect.store";
import { Head } from "@inertiajs/inertia-react";
import { Overlay } from "../assets/style/overlay";

const Home = ({ userData, hours, images }) => {
  const [res, setRes] = useState(false);
  const setHours = hourStore((state) => state.setHours);
  const setUserData = userDataStore((state) => state.setUserData);
  const [setConnectedUser, setConnectedAdmin] = connectStore((state) => [
    state.setConnectedUser,
    state.setConnectedAdmin,
  ]);

  useEffect(() => {
    setHours(hours);

    if (userData?.user) {
      setUserData(userData);
      setConnectedUser(true);
    }

    if (userData?.admin) {
      setConnectedAdmin(true);
    }
  }, [userData, hours]);

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
    <main className="w-full min-h-svh flex flex-col items-center gap-[20vh]">
      <Head title="Accueil - Le Quai Antique" />
      <AnimatePresence>
        {res && (
          <Suspense fallback={<Overlay />}>
            <Reserv res={setRes} />
          </Suspense>
        )}
      </AnimatePresence>
      <section className="w-full h-svh flex justify-center items-center bg-[var(--primary-color)]">
        <div className="grid grid-cols-1 grid-rows-[70%,1fr] place-items-center bg-[var(--primary-color)] h-full lg:grid-cols-2 lg:grid-rows-1">
          <img
            className="h-full object-cover select-none brightness-75"
            src="https://images.unsplash.com/photo-1520209268518-aec60b8bb5ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&q=80"
            alt="restaurant teinté marron conviviale"
            srcSet="https://images.unsplash.com/photo-1520209268518-aec60b8bb5ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80 500w,
            https://images.unsplash.com/photo-1520209268518-aec60b8bb5ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&q=80 700w,
            https://images.unsplash.com/photo-1520209268518-aec60b8bb5ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=900&q=80 900w,
            https://images.unsplash.com/photo-1520209268518-aec60b8bb5ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80 1200w"
          />
          <motion.aside
            className="flex flex-col justify-center items-center gap-5 w-full h-full bg-[var(--primary-color)]"
            variants={containerVariant}
            initial="hiddenHeader"
            animate="showHeader"
          >
            <motion.h1 variants={itemVariant} className="w-fit text-xl">
              Le Quai Antique
            </motion.h1>
            <motion.h2 variants={itemVariant} className="w-fit text-lg">
              Votre restaurant de la savoie
            </motion.h2>
            <motion.button variants={itemVariant} className="text-white">
              <a href="#contextText">Découvrir</a>
            </motion.button>
          </motion.aside>
        </div>
      </section>

      <section className="flex flex-col items-center gap-y-[10vh] w-[80vw] min-w-[300px] max-w-[1400px]">
        <div
          className="scroll-mt-[150px] w-fit flex flex-col justify-center items-center gap-[5vw] text-white text-base md:flex-row"
          id="contextText"
        >
          <p className="bg-[var(--primary-color)] text-black w-3/4 leading-[150%] p-4 min-h-full max-h-[200px] rounded-md md:w-1/3 md:h-[200px]">
            Venez découvrir la Savoie à travers une expérience gastronomique,
            installé à Chambéry, Le Quai Antique saura vous satisfaire tout au
            long de votre repas.
          </p>
          <p className="bg-[var(--darker-color)] w-3/4 leading-[150%] p-4 min-h-full max-h-[200px] rounded-md md:w-1/3 md:h-[200px]">
            Nos plats traditionnels de la Savoie charmeront à coup sûr vos
            papilles gustatives alors qu’attendez-vous ? <br />
            <br />
            Venez à table !
          </p>
        </div>
        <button onClick={() => setRes(true)}>Réservez une table</button>
        {images?.length ? (
          <div className="grid w-full grid-flow-col auto-cols-[minmax(150px,_230px)] place-items-center justify-center mb-auto gap-6">
            {images?.map((images, id) => {
              return (
                <div
                  key={id}
                  className="relative text-center group max-[600px]:w-full max-[600px]:grid-cols-1"
                >
                  <img
                    src={images.url}
                    alt="plat du chef"
                    loading="lazy"
                    className="md:group-hover:brightness-75 md:brightness-100 brightness-75  aspect-square object-cover rounded-md transition-all"
                  />
                  <span className="md:group-hover:font-bold md:text-transparent md:group-hover:text-white absolute flex flex-col gap-6 left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] text-white transition-all font-sm w-[90%]">
                    <h1>{images.title}</h1>
                    <p>{images.description}</p>
                  </span>
                </div>
              );
            })}
          </div>
        ) : null}
      </section>
    </main>
  );
};
Home.layout = (page: HTMLElement) => <Layout children={page} />;

export default Home;
