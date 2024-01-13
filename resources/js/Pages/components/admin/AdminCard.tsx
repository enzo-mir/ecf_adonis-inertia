import { useEffect } from "react";
import { cardStore } from "../../../data/store/apiData.store";
import React from "react";
import { MdEditSquare } from "react-icons/md";

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
      <div className="content">
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
                    <MdEditSquare color="#fff" />
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
                    <MdEditSquare color="#fff" />
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
                    <MdEditSquare color="#fff" />
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
                    <MdEditSquare color="#fff" />
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
                  <MdEditSquare color="#fff" />
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
                      food.id,
                      food.name,
                      food.description,
                      null,
                      food.formula,
                      "formula"
                    )
                  }
                >
                  <MdEditSquare color="#fff" />
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
