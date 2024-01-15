import { useState, MouseEvent, useEffect } from "react";
import AdminEditImages from "./components/admin/AdminEditImages";
import {
  HoursContainer,
  ImgWrapper,
  CardContainer,
  Wrapper,
} from "../assets/style/adminStyle";
import { cardStore, hourStore, imageStore } from "../data/store/apiData.store";
import AdminCard from "./components/admin/AdminCard";
import HourEditing from "./components/admin/HourEditing";
import { BsFillImageFill } from "react-icons/bs";
import { BiSolidTime } from "react-icons/bi";
import { IoFastFood } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";
import CardEdition from "./components/admin/CardEdition";
import React from "react";
import Layout from "./components/Layout";
import { CardDataType, HourDataType, Image } from "../types/dataApiTypes";
import { connectStore } from "../data/store/connect.store";
import { Head } from "@inertiajs/inertia-react";

const Admin = ({
  hoursData,
  cardData,
  imagesData,
}: {
  cardData: CardDataType;
  hoursData: HourDataType[];
  imagesData: Image[];
}) => {
  const [displayEditImage, setDisplayEditImage] = useState(false);
  const setCardData = cardStore((state) => state.setCardStore);
  const setHoursData = hourStore((state) => state.setHours);
  const [setImages, images] = imageStore((state) => [
    state.setImages,
    state.images,
  ]);
  const [setConnectedAdmin] = connectStore((state) => [
    state.setConnectedAdmin,
  ]);

  useEffect(() => {
    setCardData(cardData);
    setHoursData(hoursData);
    setImages(imagesData);
    setConnectedAdmin(true);
  }, [cardData, hoursData, imagesData]);

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

  function imageEdit(
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
    title?: string,
    description?: string
  ) {
    const parentElement: ParentNode = (event.target as Node).parentNode!
      .parentNode!;
    const imageTargeted: HTMLImageElement = parentElement.querySelector("img")!;
    setImageEdition({
      adding: false,
      url: imageTargeted.getAttribute("src")!,
      title: title || "",
      description: description || "",
    });
    setDisplayEditImage(true);
  }
  async function deleteImage(images: Image) {
    const response = fetch("/image/delete", {
      method: "post",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Connection: "keep-alive",
        Accept: "*",
      },
      body: JSON.stringify({
        url: images.url,
      }),
    });

    if ((await response).ok) {
      response
        .then((r) => r.json())
        .then((data) => {
          setImages(data.images);
        });
    }
  }

  function imageAdd() {
    setImageEdition({
      title: "",
      description: "",
      url: "",
      adding: true,
    });
    setDisplayEditImage(true);
  }

  return (
    <Wrapper>
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
        </ul>
      </nav>
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
          <ImgWrapper
            as={motion.article}
            initial={{ x: "-20%" }}
            animate={{ x: "0%" }}
            exit={{ x: "20%" }}
          >
            <h1>Galerie d&#39;images</h1>
            <div className="imgGalery">
              {images?.map((images, id) => {
                return (
                  <div key={id}>
                    <img src={images.url} alt="plats du chef" />
                    <p>
                      Titre : {images.title}
                      <br />
                      <br />
                      Description : {images.description}
                    </p>
                    <aside>
                      <button
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                          imageEdit(e, images.title, images.description)
                        }
                      >
                        Éditer
                      </button>
                      <button onClick={() => deleteImage(images)}>
                        Supprimer
                      </button>
                    </aside>
                  </div>
                );
              })}
              <button onClick={imageAdd}>Ajouter +</button>
            </div>
          </ImgWrapper>
        ) : showOption === "hour" ? (
          <HoursContainer
            as={motion.article}
            initial={{ x: "-20%" }}
            animate={{ x: "0%" }}
            exit={{ x: "20%" }}
          >
            <HourEditing />
          </HoursContainer>
        ) : (
          <CardContainer
            as={motion.article}
            initial={{ x: "-20%" }}
            animate={{ x: "0%" }}
            exit={{ x: "20%" }}
          >
            <AdminCard
              setDisplay={setDisplayCardEdition}
              setData={setDataCardEdit}
              display={displayCardEdition}
            />
          </CardContainer>
        )}
      </AnimatePresence>

      <article>
        <h1>
          Nombre de convives maximum du restaurant <br />
          35 personnes
        </h1>
      </article>
    </Wrapper>
  );
};
Admin.layout = (page: HTMLElement) => <Layout children={page} />;

export default Admin;
