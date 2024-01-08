import { useEffect, useState } from "react";
import { Overlay } from "../../../assets/style/overlay";
import { Cross } from "../../../assets/style/cross";
import { ContainerWrapperEditImage } from "../../../assets/style/adminStyle";
import { AiOutlineArrowRight } from "react-icons/ai";
import { motion } from "framer-motion";
import React from "react";

const AdminEditImages = ({
  imageEditionData,
  displaying,
}: {
  imageEditionData: {
    title: string;
    description: string;
    url: string;
    adding: boolean;
  };
  displaying(val: boolean): void;
}) => {
  const [imageEdition, setImageEdition] = useState(imageEditionData);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    return () => {
      document.body.removeAttribute("style");
    };
  }, []);
  console.log(imageEdition.adding);

  document.body.style.overflow = "hidden";

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files![0];
    const urlChanging = URL.createObjectURL(file);
    setImageEdition({ ...imageEdition, url: urlChanging });
    setError("");
    if (file.size > 500000) {
      setError("Limite de taille : 500 Ko");
    }
  }
  function submitEvent(e: React.FormEvent<HTMLFormElement>) {
    if (error) e.preventDefault();
  }
  return (
    <Overlay onClick={() => displaying(false)}>
      <ContainerWrapperEditImage
        onClick={(e) => e.stopPropagation()}
        as={motion.div}
        initial={{ y: "-20%", opacity: 0 }}
        animate={{ y: "0", opacity: 1 }}
        exit={{ y: "-20%", opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {error && <p className="error">{error}</p>}
        <Cross onClick={() => displaying(false)} />
        {imageEdition.adding ? (
          <label htmlFor="imageAdminChange">
            <div
              className="addImageCase"
              style={{
                background: imageEdition.url
                  ? "url(" + imageEdition.url + ")"
                  : "black",
              }}
            ></div>
          </label>
        ) : (
          <>
            <img src={imageEdition.url} alt="plat du chef" />
            <AiOutlineArrowRight />
            <label htmlFor="imageAdminChange">
              <div
                className="addImageCase"
                style={{
                  background: imageEdition.url
                    ? "url(" + imageEdition.url + ")"
                    : "black",
                }}
              ></div>
            </label>
          </>
        )}

        <form
          action={
            imageEdition.adding ? "/adminImageAdded" : "/adminImageUpdated"
          }
          method="post"
          encType="multipart/form-data"
          onSubmit={submitEvent}
        >
          {!imageEdition.adding ? (
            <input type="hidden" name="oldUrl" value={imageEditionData.url} />
          ) : null}
          <input
            type="file"
            id="imageAdminChange"
            name="image"
            onChange={(e) => {
              handleChange(e);
            }}
            required={imageEdition.adding ? true : false}
            accept="image/png, image/jpeg, image/jpg"
          />
          <p>Titre</p>
          <input
            type="text"
            name="title"
            onChange={(e) => {
              setImageEdition({
                ...imageEdition,
                title: e.target.value,
              });
            }}
            required
            value={imageEdition.title}
          />
          <p>Description</p>
          <input
            type="text"
            name="description"
            onChange={(e) => {
              setImageEdition({
                ...imageEdition,
                description: e.target.value,
              });
            }}
            required
            value={imageEdition.description}
          />
          {
            <button type="submit">
              {imageEdition.adding ? "Ajouter" : "Envoyer"}
            </button>
          }
        </form>
      </ContainerWrapperEditImage>
    </Overlay>
  );
};

export default AdminEditImages;
