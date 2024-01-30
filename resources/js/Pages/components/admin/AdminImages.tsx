import React from "react";
import { imageStore } from "../../../data/store/apiData.store";
import { Image } from "../../../types/dataApiTypes";
import styles from "../../../../css/admin.module.css";
const AdminImages = ({
  setDisplayModal,
  setImageData,
}: {
  setDisplayModal: (val: boolean) => void;
  setImageData: (val: {
    title: string;
    description: string;
    url: string;
    adding: boolean;
  }) => void;
}) => {
  const [setImages, image] = imageStore((state) => [
    state.setImages,
    state.images,
  ]);
  function imageAdd() {
    setImageData({
      title: "",
      description: "",
      url: "",
      adding: true,
    });
    setDisplayModal(true);
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
  function imageEdit(
    event: React.MouseEvent,
    title?: string,
    description?: string
  ) {
    const parentElement: ParentNode = (event.target as Node).parentNode!
      .parentNode!;
    const imageTargeted: HTMLImageElement = parentElement.querySelector("img")!;
    setImageData({
      adding: false,
      url: imageTargeted.getAttribute("src")!,
      title: title || "",
      description: description || "",
    });
    setDisplayModal(true);
  }
  return (
    <>
      <h1>Galerie d&#39;images</h1>
      <div className={styles.images_galery}>
        {image?.map((images, id) => {
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
                  onClick={(e: React.MouseEvent) =>
                    imageEdit(e, images.title, images.description)
                  }
                >
                  Éditer
                </button>
                <button onClick={() => deleteImage(images)}>Supprimer</button>
              </aside>
            </div>
          );
        })}
        <button onClick={imageAdd}>Ajouter +</button>
      </div>
    </>
  );
};

export default AdminImages;
