import React, { useState, lazy, Suspense } from "react";
const AdminCard = lazy(() => import("./components/admin/AdminCard"));
const HourEditing = lazy(() => import("./components/admin/HourEditing"));
const Layout = lazy(() => import("./components/Layout"));
const CardEdition = lazy(() => import("./components/admin/CardEdition"));
const AdminEditImages = lazy(
  () => import("./components/admin/AdminEditImages")
);
import { AnimatePresence, motion } from "framer-motion";
import { CardDataType, HourDataType, Image } from "../types/dataApiTypes";
import { Head } from "@inertiajs/inertia-react";
import AdminImages from "./components/admin/AdminImages";
import styles from "../../css/admin.module.css";
import AdminUser from "./components/admin/AdminUser";
import { usersInformationType } from "../types/userType.store";
interface adminProps {
  cardData: CardDataType;
  hoursData: HourDataType[];
  imagesData: Image[];
  usersInformation: Array<usersInformationType>;
}
const Admin = ({
  hoursData,
  cardData,
  imagesData,
  usersInformation,
}: adminProps) => {
  const [displayEditImage, setDisplayEditImage] = useState(false);
  const [imageEdition, setImageEdition] = useState<{
    title: string;
    description: string;
    url: string;
    adding: boolean;
  }>({
    title: "",
    description: "",
    url: "",
    adding: false,
  });

  const [displayCardEdition, setDisplayCardEdition] = useState<boolean>(false);
  const [dataCardEdit, setDataCardEdit] = useState({
    id: 0,
    title: "",
    desc: "",
    price: 0,
    formula: "",
    choiceEdit: "",
  });

  const [showOption, setShowOption] = useState<string>("image");

  return (
    <main className={styles.main_wrapper}>
      <Head title="Administration - Le Quai Antique" />
      <nav>
        <ul>
          <li>
            <button onClick={() => setShowOption("image")}>
              <span>Image</span>
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 16 16"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M.002 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-12a2 2 0 0 1-2-2V3zm1 9v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12zm5-6.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0z"></path>
              </svg>
            </button>
          </li>
          <li>
            <button onClick={() => setShowOption("hour")}>
              <span>Heures</span>
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 24 24"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12.25 2c-5.514 0-10 4.486-10 10s4.486 10 10 10 10-4.486 10-10-4.486-10-10-10zM18 13h-6.75V6h2v5H18v2z"></path>
              </svg>
            </button>
          </li>
          <li>
            <button onClick={() => setShowOption("card")}>
              <span>Carte</span>
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 512 512"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M368 128h.09m111.46-32h-91.06l8.92-35.66 38.32-13.05c8.15-2.77 13-11.43 10.65-19.71a16 16 0 00-20.54-10.73l-47 16a16 16 0 00-10.36 11.27L355.51 96H224.45c-8.61 0-16 6.62-16.43 15.23A16 16 0 00224 128h2.75l1 8.66A8.3 8.3 0 00236 144c39 0 73.66 10.9 100.12 31.52A121.9 121.9 0 01371 218.07a123.4 123.4 0 0110.12 29.51 7.83 7.83 0 003.29 4.88 72 72 0 0126.38 86.43 7.92 7.92 0 00-.15 5.53A96 96 0 01416 376c0 22.34-7.6 43.63-21.4 59.95a80.12 80.12 0 01-28.78 21.67 8 8 0 00-4.21 4.37 108.19 108.19 0 01-17.37 29.86 2.5 2.5 0 001.9 4.11h49.21a48.22 48.22 0 0047.85-44.14L477.4 128h2.6a16 16 0 0016-16.77c-.42-8.61-7.84-15.23-16.45-15.23z"></path>
                <path d="M108.69 320a23.87 23.87 0 0117 7l15.51 15.51a4 4 0 005.66 0L162.34 327a23.87 23.87 0 0117-7h196.58a8 8 0 008.08-7.92V312a40.07 40.07 0 00-32-39.2c-.82-29.69-13-54.54-35.51-72C295.67 184.56 267.85 176 236 176h-72c-68.22 0-114.43 38.77-116 96.8A40.07 40.07 0 0016 312a8 8 0 008 8zm77.25 32a8 8 0 00-5.66 2.34l-22.14 22.15a20 20 0 01-28.28 0l-22.14-22.15a8 8 0 00-5.66-2.34h-69.4a15.93 15.93 0 00-15.76 13.17A65.22 65.22 0 0016 376c0 30.59 21.13 55.51 47.26 56 2.43 15.12 8.31 28.78 17.16 39.47C93.51 487.28 112.54 496 134 496h132c21.46 0 40.49-8.72 53.58-24.55 8.85-10.69 14.73-24.35 17.16-39.47 26.13-.47 47.26-25.39 47.26-56a65.22 65.22 0 00-.9-10.83A15.93 15.93 0 00367.34 352z"></path>
              </svg>
            </button>
          </li>

          <li>
            <button onClick={() => setShowOption("user")}>
              <span>Utilisateur</span>
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 448 512"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path>
              </svg>
            </button>
          </li>
        </ul>
      </nav>
      <Suspense fallback={<></>}>
        <AnimatePresence>
          {displayEditImage ? (
            <AdminEditImages
              imageEditionData={imageEdition}
              displaying={setDisplayEditImage}
            />
          ) : null}
          {displayCardEdition ? (
            <CardEdition
              cardData={dataCardEdit}
              setDisplayEditCard={setDisplayCardEdition}
            />
          ) : null}
        </AnimatePresence>

        {showOption === "image" ? (
          <AnimatePresence>
            <motion.article
              className={styles.images_wrapper}
              initial={{ x: "-20%" }}
              animate={{ x: "0%" }}
              exit={{ x: "20%" }}
            >
              <AdminImages
                setDisplayModal={setDisplayEditImage}
                setImageData={setImageEdition}
              />
            </motion.article>
          </AnimatePresence>
        ) : showOption === "hour" ? (
          <AnimatePresence>
            <motion.article
              className={styles.hours_conbtainer}
              initial={{ x: "-20%" }}
              animate={{ x: "0%" }}
              exit={{ x: "20%" }}
            >
              <HourEditing />
            </motion.article>
          </AnimatePresence>
        ) : showOption === "card" ? (
          <AnimatePresence>
            <motion.article
              className={styles.card_container}
              initial={{ x: "-20%" }}
              animate={{ x: "0%" }}
              exit={{ x: "20%" }}
            >
              <AdminCard
                setDisplay={setDisplayCardEdition}
                setData={setDataCardEdit}
                display={displayCardEdition}
              />
            </motion.article>
          </AnimatePresence>
        ) : (
          <article className={styles.card_container}>
            <AdminUser usersInfo={usersInformation} />
          </article>
        )}

        <article>
          <h1>
            Nombre de convives maximum du restaurant <br />
            35 personnes
          </h1>
        </article>
      </Suspense>
    </main>
  );
};
Admin.layout = (page: HTMLElement) => <Layout children={page} />;

export default Admin;
