import { useState } from "react";
import Reserv from "./components/Reservation";
import {
  CarteContainer,
  MenuContainer,
  LunchSection,
  PlatSection,
  DessertSection,
  MenuSection,
} from "../assets/style/cardStyle";
import { cardStore } from "../data/store/apiData.store";
import {
  dessertType,
  entreeType,
  menuType,
  platType,
} from "../types/dataApiTypes";
import React from "react";

export default function Card() {
  const [res, setRes] = useState(false);
  const cardData = cardStore((state) => state.cardStore);

  const entree = cardData.starters;
  const plat = cardData.dishs;
  const dessert = cardData.desserts;
  const menu = cardData.menus;

  function mapingSimilarityFood(
    food: entreeType | platType | dessertType | menuType,
    title: string
  ) {
    return food === entree || food === plat ? (
      <>
        <h2>{title}</h2>
        <div className="noshare">
          {food.map((element) => {
            return !element.sharing ? (
              <div key={element.id}>
                <div>
                  <p>{element.name}</p>
                  <p className="desc">{element.description}</p>
                </div>
                <p>{element.price}€</p>
              </div>
            ) : null;
          })}
        </div>
        <div className="share">
          <h2>à partager (ou pas . . .)</h2>
          {food.map((element, id: number) => {
            return element.sharing ? (
              <div key={id}>
                <div>
                  <p>{element.name}</p>
                  <p className="desc">{element.description}</p>
                </div>
                <p>{element.price}€</p>
              </div>
            ) : null;
          })}
        </div>
      </>
    ) : food === dessert ? (
      <>
        <h2>{title}</h2>
        {food.map((element) => {
          return (
            <div key={element.id}>
              <div>
                <p>{element.name}</p>
                <p className="desc">{element.description}</p>
              </div>
              <p>{element.price}€</p>
            </div>
          );
        })}
      </>
    ) : (
      <>
        <h2>{title}</h2>
        {(food as menuType).map((element) => {
          return (
            <div key={element.id}>
              <p>{element.name}</p>
              <article>
                <p>Formules : </p>
                <aside>
                  {element.formula
                    .split(",")
                    .map((formule: string, index: number) => {
                      return <div key={index}>{formule}</div>;
                    })}
                </aside>
              </article>
            </div>
          );
        })}
      </>
    );
  }

  return (
    <>
      {res ? <Reserv res={setRes} /> : null}
      <CarteContainer>
        <h1>La carte</h1>
        <MenuContainer>
          <LunchSection>
            {mapingSimilarityFood(entree, "les entrées")}
          </LunchSection>
          <PlatSection>{mapingSimilarityFood(plat, "les plats")}</PlatSection>
          <DessertSection>
            {mapingSimilarityFood(dessert, "les desserts")}
          </DessertSection>
          <MenuSection>{mapingSimilarityFood(menu, "les menus")}</MenuSection>
        </MenuContainer>
      </CarteContainer>
    </>
  );
}
