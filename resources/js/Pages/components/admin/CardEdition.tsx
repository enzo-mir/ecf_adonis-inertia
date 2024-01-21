import { Overlay } from "../../../assets/style/overlay";
import { EditCardContainer } from "../../../assets/style/adminStyle";
import { Cross } from "../../../assets/style/cross";
import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import React from "react";
import { useForm } from "@inertiajs/inertia-react";

const CardEdition = ({
  cardData,
  setDisplayEditCard,
}: {
  cardData: {
    id: number;
    title: string;
    desc: string | null;
    price: number | null;
    formula: string | null;
    choiceEdit: string;
  };
  setDisplayEditCard(val: boolean): void;
}) => {
  const [errorEditingCard, setErrorEditingCard] = useState<string>("");

  const { post, data, setData, processing } = useForm({
    id: cardData.id,
    title: cardData.title,
    desc: cardData.desc,
    price: cardData.price,
    formula: cardData.formula,
    choice_edit: cardData.choiceEdit,
  });
  function submitEdition(e: FormEvent) {
    e.preventDefault();
    if (!errorEditingCard) {
      post("/card/update", {
        data,
        onSuccess: () => {
          setDisplayEditCard(false);
        },
        onError: (err) => {
          setErrorEditingCard(err as unknown as string);
        },
      });
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
        onClick={(e : React.MouseEvent) => e.stopPropagation()}
        as={motion.section}
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
          {errorEditingCard ? (
            <p className="errorTxt">{errorEditingCard}</p>
          ) : null}
        </div>
        <form onSubmit={submitEdition}>
          <label htmlFor="titleCard">
            <p>Titre : {data.title}</p>
            <input
              type="text"
              defaultValue={cardData.title}
              id="titleCard"
              value={data.title}
              onChange={(e) => {
                setData({ ...data, title: e.target.value });
                !e.target.value
                  ? setErrorEditingCard("Erreur : Champ(s) non-remplis")
                  : setErrorEditingCard("");
              }}
            />
          </label>
          {cardData.formula == null ? (
            <>
              <label htmlFor="descCard">
                <p>Description : {data.desc}</p>
                <input
                  type="text"
                  id="descCard"
                  defaultValue={cardData.desc!}
                  value={data.desc}
                  onChange={(e) => {
                    setData({ ...data, desc: e.target.value });
                    !e.target.value
                      ? setErrorEditingCard("Erreur : Champ(s) non-remplis")
                      : setErrorEditingCard("");
                  }}
                />
              </label>
              <label htmlFor="priceCard">
                <p>prix : {data.price}€</p>
                <input
                  type="number"
                  id="priceCard"
                  min="0"
                  maxLength={5}
                  defaultValue={cardData.price}
                  value={data.price}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setData({ ...data, price: parseInt(e.target.value) });
                    !e.target.value
                      ? setErrorEditingCard("Erreur : Champ(s) non-remplis")
                      : setErrorEditingCard("");
                  }}
                />
              </label>
            </>
          ) : (
            <label htmlFor="formulaCard">
              <p>
                formule : {data.formula}
                <br />
                <sub>(Séparer les formules par des virgules)</sub>
              </p>
              <input
                type="text"
                id="formulaCard"
                defaultValue={cardData.formula}
                value={data.formula}
                onChange={(e) => {
                  setData({ ...data, formula: e.target.value });
                  !e.target.value
                    ? setErrorEditingCard("Erreur : Champ(s) non-remplis")
                    : setErrorEditingCard("");
                }}
              />
            </label>
          )}
          <button type="submit" disabled={processing}>
            Fin de l&lsquo;édition
          </button>
        </form>
      </EditCardContainer>
    </Overlay>
  );
};

export default CardEdition;
