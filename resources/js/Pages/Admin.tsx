import { useState, lazy, Suspense, useEffect } from "react";
const AdminCard = lazy(() => import("./components/admin/AdminCard"));
const HourEditing = lazy(() => import("./components/admin/HourEditing"));
const Layout = lazy(() => import("./components/Layout"));
const CardEdition = lazy(() => import("./components/admin/CardEdition"));
const AdminEditImages = lazy(
  () => import("./components/admin/AdminEditImages")
);
import { BsFillImageFill } from "react-icons/bs";
import { BiSolidTime } from "react-icons/bi";
import { IoFastFood } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { CardDataType, HourDataType, Image } from "../types/dataApiTypes";
import { Head } from "@inertiajs/inertia-react";
import Loading from "./Loading";
import AdminImages from "./components/admin/AdminImages";
import styles from "../../css/admin.module.css";
import { connectStore } from "../data/store/connect.store";
import AdminUser from "./components/admin/AdminUser";

const Admin = ({
  hoursData,
  cardData,
  imagesData,
}: {
  cardData: CardDataType;
  hoursData: HourDataType[];
  imagesData: Image[];
}) => {
  const setAdmin = connectStore((state) => state.setConnectedAdmin);
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
              <BsFillImageFill />
            </button>
          </li>
          <li>
            <button onClick={() => setShowOption("hour")}>
              <span>Heures</span>
              <BiSolidTime />
            </button>
          </li>
          <li>
            <button onClick={() => setShowOption("card")}>
              <span>Carte</span>
              <IoFastFood />
            </button>
          </li>

          <li>
            <button onClick={() => setShowOption("user")}>
              <span>Utilisateur</span>
              <FaUser />
            </button>
          </li>
        </ul>
      </nav>
      <Suspense fallback={<Loading />}>
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

        <AnimatePresence>
          {showOption === "image" ? (
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
          ) : showOption === "hour" ? (
            <motion.article
              className={styles.hours_conbtainer}
              initial={{ x: "-20%" }}
              animate={{ x: "0%" }}
              exit={{ x: "20%" }}
            >
              <HourEditing />
            </motion.article>
          ) : showOption === "card" ? (
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
          ) : (
            <article>
              <AdminUser />
            </article>
          )}
        </AnimatePresence>

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
