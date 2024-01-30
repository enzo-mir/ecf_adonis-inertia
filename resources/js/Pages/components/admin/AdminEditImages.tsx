import { FormEvent, useEffect, useRef, useState } from "react";
import overlaystyles from "../../../../css/overlay.module.css";
import { Cross } from "../../../assets/style/cross";
import { ContainerWrapperEditImage } from "../../../assets/style/adminStyle";
import { AiOutlineArrowRight } from "react-icons/ai";
import { motion } from "framer-motion";
import React from "react";
import { MdEditSquare } from "react-icons/md";
import { useForm } from "@inertiajs/inertia-react";
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
  const [validationImage, setValidationImage] = useState<string>("");
  const urlRef = useRef("");
  const { post, data, setData, reset, processing } = useForm({
    image: null,
    title: imageEditionData.title,
    description: imageEditionData.description,
    old_url: imageEditionData.url,
  });
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.removeAttribute("style");
      reset();
    };
  }, []);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValidationImage("");
    const file = event.target.files![0];
    setData({ ...data, image: file });
    const urlChanging = URL.createObjectURL(file);
    urlRef.current = urlChanging;
    if (file.size > 500000) {
      setValidationImage("Limite de taille : 500 Ko");
    }
  }

  function imageSubmition(e: FormEvent) {
    e.preventDefault();
    if (imageEditionData.adding) {
      delete data.old_url;
      post("/image/upload", {
        data,
        forceFormData: true,
        onSuccess: () => {
          displaying(false);
        },
        onError: (err) => {
          setValidationImage(err as unknown as string);
        },
      });
    } else {
      post("/image/update", {
        data: { ...data },
        forceFormData: true,
        onSuccess: () => {
          displaying(false);
        },
        onError: (err) => {
          setValidationImage(err as unknown as string);
        },
      });
    }
  }

  return (
    <div className={overlaystyles.overlay} onClick={() => displaying(false)}>
      <ContainerWrapperEditImage
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        as={motion.section}
        initial={{ y: "-20%", opacity: 0 }}
        animate={{ y: "0", opacity: 1 }}
        exit={{ y: "-20%", opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Cross onClick={() => displaying(false)} />
        {validationImage && <p className="error">{validationImage}</p>}
        {imageEdition.adding ? (
          <label htmlFor="imageAdminChange">
            <div
              className="addImageCase"
              style={{
                background: urlRef.current
                  ? "url(" + urlRef.current + ")"
                  : "black",
              }}
            >
              <MdEditSquare color="#fff" />
            </div>
          </label>
        ) : (
          <div className="updateImage">
            <img src={imageEdition.url} alt="plat du chef" />
            <AiOutlineArrowRight />
            <label htmlFor="imageAdminChange">
              <div
                className="addImageCase"
                style={{
                  background: urlRef.current
                    ? "url(" + urlRef.current + ")"
                    : "black",
                }}
              >
                <MdEditSquare color="#fff" />
              </div>
            </label>
          </div>
        )}

        <form onSubmit={imageSubmition}>
          <input
            type="file"
            id="imageAdminChange"
            name="image"
            onChange={handleChange}
            required={imageEdition.adding ? true : false}
            accept="image/png, image/jpeg, image/jpg, image/svg"
          />
          <p>Titre</p>
          <input
            type="text"
            name="title"
            onChange={(e) => setData({ ...data, title: e.target.value })}
            required
            value={data.title}
          />
          <p>Description</p>
          <input
            type="text"
            name="description"
            onChange={(e) => setData({ ...data, description: e.target.value })}
            required
            value={data.description}
          />
          {
            <button type="submit" disabled={processing}>
              {imageEdition.adding ? "Ajouter" : "Envoyer"}
            </button>
          }
        </form>
      </ContainerWrapperEditImage>
    </div>
  );
};

export default AdminEditImages;
