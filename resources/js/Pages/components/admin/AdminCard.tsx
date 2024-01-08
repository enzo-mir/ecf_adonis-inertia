import { useEffect } from "react";
import editBtn from "../../../assets/images/edit_btn.png";
import { cardStore } from "../../../data/store/apiData.store";
import React from "react";

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
    title: string,
    desc: string,
    price: number | null,
    formule: string | null,
    choiceEdit: "starters" | "dishs" | "desserts" | "formula"
  ) {
    setData({
      title,
      desc,
      price,
      formule,
      choiceEdit,
    });
    setDisplay(true);
  }


  return (
    <>
      <h1>Carte du restaurant</h1>
      <h2>Entrées</h2>
      <div className="content">
        <>
          <div className="seul">
            <h2>Seul</h2>
            {starters.map((food, id) => {
              return !food.sharing ? (
                <div key={id}>
                  <h3>{food.name}</h3>
                  <p>{food.description}</p>
                  <p>{food.price}€</p>
                  <button
                    onClick={() =>
                      editableCard(
                        food.name,
                        food.description,
                        food.price,
                        null,
                        "starters"
                      )
                    }
                  >
                    <img src={editBtn} alt="edit btn" />
                  </button>
                </div>
              ) : null;
            })}
          </div>
          <div className="partage">
            <h2>Partager</h2>
            {starters.map((food, id) => {
              return food.sharing ? (
                <div key={id}>
                  <h3>{food.name}</h3>
                  <p>{food.description}</p>
                  <p>{food.price}€</p>
                  <button
                    onClick={() =>
                      editableCard(
                        food.name,
                        food.description,
                        food.price,
                        null,
                        "starters"
                      )
                    }
                  >
                    <img src={editBtn} alt="edit btn" />
                  </button>
                </div>
              ) : null;
            })}
          </div>
        </>
      </div>
      <h2>Plats</h2>
      <div className="content">
        <>
          <div className="seul">
            <h2>Seul</h2>
            {dishs.map((food, id) => {
              return !food.sharing ? (
                <div key={id}>
                  <h3>{food.name}</h3>
                  <p>{food.description}</p>
                  <p>{food.price}€</p>
                  <button
                    onClick={() =>
                      editableCard(
                        food.name,
                        food.description,
                        food.price,
                        null,
                        "dishs"
                      )
                    }
                  >
                    <img src={editBtn} alt="edit btn" />
                  </button>
                </div>
              ) : null;
            })}
          </div>
          <div className="partage">
            <h2>Partager</h2>
            {dishs.map((food, id) => {
              return food.sharing ? (
                <div key={id}>
                  <h3>{food.name}</h3>
                  <p>{food.description}</p>
                  <p>{food.price}€</p>
                  <button
                    onClick={() =>
                      editableCard(
                        food.name,
                        food.description,
                        food.price,
                        null,
                        "dishs"
                      )
                    }
                  >
                    <img src={editBtn} alt="edit btn" />
                  </button>
                </div>
              ) : null;
            })}
          </div>
        </>
      </div>
      <h2>Desserts</h2>
      <div className="content">
        <div>
          {desserts.map((food, id) => {
            return (
              <div key={id} className="dessert">
                <h3>{food.name}</h3>
                <p>{food.description}</p>
                <p>{food.price}€</p>
                <button
                  onClick={() =>
                    editableCard(
                      food.name,
                      food.description,
                      food.price,
                      null,
                      "desserts"
                    )
                  }
                >
                  <img src={editBtn} alt="edit btn" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <h2>Menus</h2>
      <div className="content">
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
                      food.name,
                      food.description,
                      null,
                      food.formula,
                      "formula"
                    )
                  }
                >
                  <img src={editBtn} alt="edit btn" />
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
