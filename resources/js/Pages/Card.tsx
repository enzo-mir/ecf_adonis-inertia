import { useEffect, useState } from "react";
import Reserv from "./components/Reservation";
import {
  CarteContainer,
  MenuContainer,
  LunchSection,
  PlatSection,
  DessertSection,
  MenuSection,
} from "../assets/style/cardStyle";
import {
  CardDataType,
  HourDataType,
  dessertType,
  entreeType,
  menuType,
  platType,
} from "../types/dataApiTypes";
import React from "react";
import Layout from "./components/Layout";
import { hourStore } from "../data/store/apiData.store";
import { connectStore, userDataStore } from "../data/store/connect.store";
import { User } from "../types/userType.store";

const Card = ({
  cardData,
  hours,
  userData,
}: {
  cardData: CardDataType;
  hours: Array<HourDataType>;
  userData: User;
}) => {
  const setHours = hourStore((state) => state.setHours);
  setHours(hours);
  const [res, setRes] = useState(false);
  const { starters, dishs, desserts, menus } = cardData;

  const setUserData = userDataStore((state) => state.setUserData);
  const [setConnectedUser, setConnectedAdmin] = connectStore((state) => [
    state.setConnectedUser,
    state.setConnectedAdmin,
  ]);
  useEffect(() => {
    setHours(hours);

    if (userData?.user) {
      setUserData(userData);
      setConnectedUser(true);
    }

    if (userData?.admin) {
      setConnectedAdmin(true);
    }
  }, [userData, hours]);

  function mapingSimilarityFood(
    food: entreeType | platType | dessertType | menuType,
    title: string
  ) {
    return food === starters || food === dishs ? (
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
    ) : food === desserts ? (
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
      {cardData ? (
        <CarteContainer>
          <h1>La carte</h1>
          <MenuContainer>
            <LunchSection>
              {mapingSimilarityFood(starters, "les entrées")}
            </LunchSection>
            <PlatSection>
              {mapingSimilarityFood(dishs, "les plats")}
            </PlatSection>
            <DessertSection>
              {mapingSimilarityFood(desserts, "les desserts")}
            </DessertSection>
            <MenuSection>
              {mapingSimilarityFood(menus, "les menus")}
            </MenuSection>
          </MenuContainer>
        </CarteContainer>
      ) : null}
    </>
  );
};

Card.layout = (page: HTMLElement) => <Layout children={page} />;
export default Card;
