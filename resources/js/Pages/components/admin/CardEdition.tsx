import { Overlay } from "../../../assets/style/overlay";
import { EditCardContainer } from "../../../assets/style/adminStyle";
import { Cross } from "../../../assets/style/cross";
import postUpdateCard from "../../../data/postUpdateCard";
import { cardStore } from "../../../data/store/apiData.store";
import { useState } from "react";
import { motion } from "framer-motion";
import React from "react";

const CardEdition = ({
  titleCarteEdition,
  descCarteEdition,
  priceCarteEdition,
  formuleCarteEdition,
  setDisplayEditCard,
  choiceEdit,
}: {
  titleCarteEdition: string;
  descCarteEdition: string | null;
  priceCarteEdition: number | null;
  formuleCarteEdition: string | null;
  setDisplayEditCard(val: boolean): void;
  choiceEdit: string;
}) => {
  const setCardStore = cardStore((state) => state.setCardStore);
  const [errorEditingCard, setErrorEditingCard] = useState<string>("");

  const [cardInfo, setCardInfo] = useState({
    title: titleCarteEdition as string,
    desc: descCarteEdition as string,
    price: priceCarteEdition as number,
    formula: formuleCarteEdition as string,
  });
  function submitEdition() {
    if (!errorEditingCard) {
      postUpdateCard(
        titleCarteEdition,
        descCarteEdition,
        cardInfo,
        choiceEdit
      ).then((data) =>
        data.error
          ? setErrorEditingCard(data.error)
          : (setCardStore(data), setDisplayEditCard(false))
      );
    }
  }

  return (
    <Overlay
      onClick={() => {
        setDisplayEditCard(false);
        setErrorEditingCard("");
      }}
    >
      <EditCardContainer
        onClick={(e) => e.stopPropagation()}
        className="cardEditionCont"
        as={motion.div}
        initial={{ y: "-20%", opacity: 0 }}
        animate={{ y: "0", opacity: 1 }}
        exit={{ y: "-20%", opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <Cross
            style={{ position: "absolute" }}
            onClick={() => {
              setDisplayEditCard(false);
              setErrorEditingCard("");
            }}
          />
          <h1>Édition de la carte</h1>
          {errorEditingCard && <p className="errorTxt">{errorEditingCard}</p>}
        </div>
        <div>
          <p>titre : {cardInfo.title}</p>
          {formuleCarteEdition == null ? (
            <>
              <p>description : {cardInfo.desc}</p>
              <p>prix : {cardInfo.price}€</p>
            </>
          ) : (
            <p>
              formule : {cardInfo.formula}
              <br />
              <sub>(Séparer les formules par des virgules)</sub>
            </p>
          )}
        </div>
        <div>
          <input
            type="text"
            defaultValue={titleCarteEdition}
            value={cardInfo.title}
            onChange={(e) => {
              setCardInfo({ ...cardInfo, title: e.target.value });
              !e.target.value
                ? setErrorEditingCard("Erreur : Champ(s) non-remplis")
                : setErrorEditingCard("");
            }}
          />
          {formuleCarteEdition == null ? (
            <>
              <input
                type="text"
                defaultValue={descCarteEdition!}
                value={cardInfo.desc}
                onChange={(e) => {
                  setCardInfo({ ...cardInfo, desc: e.target.value });
                  !e.target.value
                    ? setErrorEditingCard("Erreur : Champ(s) non-remplis")
                    : setErrorEditingCard("");
                }}
              />
              <input
                type="number"
                min="0"
                maxLength={5}
                defaultValue={priceCarteEdition!}
                value={cardInfo.price}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setCardInfo({ ...cardInfo, price: parseInt(e.target.value) });
                  !e.target.value
                    ? setErrorEditingCard("Erreur : Champ(s) non-remplis")
                    : setErrorEditingCard("");
                }}
              />
            </>
          ) : (
            <input
              type="text"
              defaultValue={formuleCarteEdition}
              value={cardInfo.formula}
              onChange={(e) => {
                setCardInfo({ ...cardInfo, formula: e.target.value });
                !e.target.value
                  ? setErrorEditingCard("Erreur : Champ(s) non-remplis")
                  : setErrorEditingCard("");
              }}
            />
          )}
        </div>
        <button onClick={submitEdition}>Fin de l&lsquo;édition</button>
      </EditCardContainer>
    </Overlay>
  );
};

export default CardEdition;
