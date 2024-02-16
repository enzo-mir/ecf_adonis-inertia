import { FormEvent, useEffect, useRef, useState } from "react";
import overlaystyles from "../../../../css/overlay.module.css";
import { Cross } from "../../../assets/style/cross";
import { motion } from "framer-motion";
import React from "react";
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
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 24 24"
                color="#fff"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
                style={{ color: "rgb(255, 255, 255)" }}
              >
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path d="M7 17V9.93L13.93 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-8.93L14.07 17H7z"></path>
                <path d="M9 15h4.24l7.2-7.2-4.24-4.24-7.2 7.2zM22.91 2.49L21.5 1.08c-.78-.78-2.05-.78-2.83 0l-1.06 1.06 4.24 4.24 1.06-1.06c.79-.78.79-2.05 0-2.83z"></path>
              </svg>
            </div>
          </label>
        ) : (
          <div className={styles.update_image}>
            <img src={imageEditionData.url} alt="plat du chef" />
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 1024 1024"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 0 0 0-48.4z"></path>
            </svg>
            <label htmlFor="imageAdminChange">
              <div
                className={styles.addImageCase}
                style={{
                  background: urlRef.current
                    ? "url(" + urlRef.current + ")"
                    : "black",
                }}
              >
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 24 24"
                  color="#fff"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ color: "rgb(255, 255, 255)" }}
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path d="M7 17V9.93L13.93 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-8.93L14.07 17H7z"></path>
                  <path d="M9 15h4.24l7.2-7.2-4.24-4.24-7.2 7.2zM22.91 2.49L21.5 1.08c-.78-.78-2.05-.78-2.83 0l-1.06 1.06 4.24 4.24 1.06-1.06c.79-.78.79-2.05 0-2.83z"></path>
                </svg>
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
