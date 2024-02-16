import { useEffect } from "react";
import { cardStore } from "../../../data/store/apiData.store";
import React from "react";
import styles from "../../../../css/admin.module.css";

const AdminCard = ({
  display,
  setDisplay,
  setData,
}: {
  display: boolean;
  setDisplay(val: boolean): void;
  setData(val: object): void;
}) => {
  const { dishs, starters, desserts, menus } = cardStore(
    (state) => state.cardStore
  );

  useEffect(() => {
    display
      ? (document.body.style.overflow = "hidden")
      : document.body.removeAttribute("style");
  }, [display]);

  function editableCard(
    id: number,
    title: string,
    desc: string,
    price: number | null,
    formula: string | null,
    choiceEdit: "starters" | "dishs" | "desserts" | "formula"
  ) {
    setData({
      id,
      title,
      desc,
      price,
      formula,
      choiceEdit,
    });
    setDisplay(true);
  }

  return (
    <>
      <h1>Carte du restaurant</h1>
      <h2>Entrées</h2>
      <div className={styles.content_card}>
        <>
          <div className="seul">
            <h2>Seul</h2>
            {starters.map((food) => {
              return !food.sharing ? (
                <div key={food.id}>
                  <h3>{food.name}</h3>
                  <p>{food.description}</p>
                  <p>{food.price}€</p>
                  <button
                    onClick={() =>
                      editableCard(
                        food.id,
                        food.name,
                        food.description,
                        food.price,
                        null,
                        "starters"
                      )
                    }
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
                  </button>
                </div>
              ) : null;
            })}
          </div>
          <div className="partage">
            <h2>Partager</h2>
            {starters.map((food) => {
              return food.sharing ? (
                <div key={food.id}>
                  <h3>{food.name}</h3>
                  <p>{food.description}</p>
                  <p>{food.price}€</p>
                  <button
                    onClick={() =>
                      editableCard(
                        food.id,
                        food.name,
                        food.description,
                        food.price,
                        null,
                        "starters"
                      )
                    }
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
                  </button>
                </div>
              ) : null;
            })}
          </div>
        </>
      </div>
      <h2>Plats</h2>
      <div className={styles.content_card}>
        <>
          <div className="seul">
            <h2>Seul</h2>
            {dishs.map((food) => {
              return !food.sharing ? (
                <div key={food.id}>
                  <h3>{food.name}</h3>
                  <p>{food.description}</p>
                  <p>{food.price}€</p>
                  <button
                    onClick={() =>
                      editableCard(
                        food.id,
                        food.name,
                        food.description,
                        food.price,
                        null,
                        "dishs"
                      )
                    }
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
                  </button>
                </div>
              ) : null;
            })}
          </div>
          <div className="partage">
            <h2>Partager</h2>
            {dishs.map((food) => {
              return food.sharing ? (
                <div key={food.id}>
                  <h3>{food.name}</h3>
                  <p>{food.description}</p>
                  <p>{food.price}€</p>
                  <button
                    onClick={() =>
                      editableCard(
                        food.id,
                        food.name,
                        food.description,
                        food.price,
                        null,
                        "dishs"
                      )
                    }
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
                  </button>
                </div>
              ) : null;
            })}
          </div>
        </>
      </div>
      <h2>Desserts</h2>
      <div className={styles.content_card}>
        <div>
          {desserts.map((food) => {
            return (
              <div key={food.id} className="dessert">
                <h3>{food.name}</h3>
                <p>{food.description}</p>
                <p>{food.price}€</p>
                <button
                  onClick={() =>
                    editableCard(
                      food.id,
                      food.name,
                      food.description,
                      food.price,
                      null,
                      "desserts"
                    )
                  }
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
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <h2>Menus</h2>
      <div className={styles.content_card}>
        <div>
          {menus.map((food, id) => {
            return (
              <div key={id} className="menu">
                <h3>{food.name}</h3>
                <p>{food.description}</p>
                <p>{food.formula}</p>
                <button
                  onClick={() =>
                    editableCard(
                      food.id,
                      food.name,
                      food.description,
                      null,
                      food.formula,
                      "formula"
                    )
                  }
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
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default AdminCard;
