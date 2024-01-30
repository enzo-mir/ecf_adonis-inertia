import { FormEvent, useEffect, useRef, useState } from "react";
import overlaystyles from "../../../../css/overlay.module.css";
import { Cross } from "../../../assets/style/cross";
import { AiOutlineArrowRight } from "react-icons/ai";
import { motion } from "framer-motion";
import React from "react";
import { MdEditSquare } from "react-icons/md";
import { useForm } from "@inertiajs/inertia-react";
import styles from "../../../../css/admin.module.css";

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
  const [validationMessage, setValidationMessage] = useState<string>("");
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
    setValidationMessage("");
    const file = event.target.files![0];
    setData({ ...data, image: file });
    const urlChanging = URL.createObjectURL(file);
    urlRef.current = urlChanging;
    if (file.size > 500000) {
      setValidationMessage("Limite de taille : 500 Ko");
    }
  }

  function imageSubmition(e: FormEvent) {
    e.preventDefault();
    if (!data.image) {
      setValidationMessage("Une image doit être séléctionnée");
    } else {
      if (imageEditionData.adding) {
        delete data.old_url;
        post("/image/upload", {
          data,
          forceFormData: true,
          onSuccess: (e) => {
            displaying(false);
          },
          onError: (err) => {
            setValidationMessage(err as unknown as string);
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
            setValidationMessage(err as unknown as string);
          },
        });
      }
    }
  }

  return (
    <div className={overlaystyles.overlay} onClick={() => displaying(false)}>
      <motion.section
        className={styles.container_edit_image}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        initial={{ y: "-20%", opacity: 0 }}
        animate={{ y: "0", opacity: 1 }}
        exit={{ y: "-20%", opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Cross onClick={() => displaying(false)} />
        {validationMessage && <p className="error">{validationMessage}</p>}
        {imageEditionData.adding ? (
          <label htmlFor="imageAdminChange" tabIndex={0}>
            <div
              className={styles.addImageCase}
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
          <div className={styles.update_image}>
            <img src={imageEditionData.url} alt="plat du chef" />
            <AiOutlineArrowRight />
            <label htmlFor="imageAdminChange">
              <div
                className={styles.addImageCase}
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
              {imageEditionData.adding ? "Ajouter" : "Envoyer"}
            </button>
          }
        </form>
      </motion.section>
    </div>
  );
};

export default AdminEditImages;
