import styled from "styled-components";
import editBtn from "../images/edit_btn.png";
const EditCardContainer = styled.div`
  position: absolute;
  display: grid;
  place-items: center;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr;
  padding-block: 50px;
  width: 1000px;
  min-height: 60vh;
  max-width: 100%;
  z-index: 150;
  background-color: #fff;

  & > div:first-child {
    grid-area: 1 / 1 / 2 / 3;
  }
  & div {
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: column;
    padding-inline: 1em;
    height: 100%;
  }
  & button {
    grid-area: 3 / 1 / 4 / 3;
    width: fit-content;
  }
  & p.errorTxt {
    color: var(--error-txt);
    font-size: var(--font-size);
    font-weight: bold;
  }
`;
const HoursContainer = styled.article`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 50px;
  font-size: var(--font-size);

  .format {
    transition: 0.5s ease-in;
    color: var(--error-txt);
    font-size: var(--font-size-reg);
  }

  & table {
    display: grid;
    border-collapse: separate;
    gap: 3vh;
    & thead {
      background-color: var(--darker-color);
      border-radius: 10px;
      color: #fff;
      tr {
        text-align: center;
        & td {
          padding: 1em 2em;
        }
      }
    }

    & tbody {
      display: grid;
      gap: 3vh;
      & tr {
        width: 100%;
        display: grid;
        grid-template-columns: 15% 1fr 1fr;
        gap: 20px;
        align-items: center;
        text-align: center;
        & input {
          border: 1px solid var(--darker-color-a30);
          padding: 0.7em;
          font-size: var(--font-size-little);
          border-radius: 10px;
        }
        & td:nth-child(n + 2):hover {
          cursor: pointer;
        }
      }
    }
  }

  .ctaEdit {
    display: flex;
    justify-content: center;
    align-items: center;
    & button {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1em;
    }
  }
`;
const ImgWrapper = styled.article`
  position: relative;
  display: grid;
  place-items: center;
  grid-template-rows: auto 1fr;
  gap: 50px;
  width: 90%;
  padding-inline: 1rem;

  .imgGalery {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    max-width: fit-content;
    gap: 50px;
    text-align: center;

    & div {
      font-size: var(--font-size-reg);
      display: flex;
      border-radius: 10px;
      width: 100%;

      & p {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: var(--font-size);
        width: 100%;
        padding-inline: 2em;
      }
      & img {
        width: clamp(150px, 13vw, 200px);
        aspect-ratio: 1/1;
        object-fit: cover;
        border-radius: 10px;
      }

      & aside {
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-direction: column;
      }
      @media screen and (max-width: 500px) {
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 20px;
        & aside {
          gap: 20px;
        }
      }
    }
  }
`;
const CardContainer = styled.article`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 50px;
  font-size: var(--font-size);
  width: 100%;
  text-align: center;

  & h2 {
    font-size: var(--font-size-bigger);
  }

  & .content {
    display: flex;
    gap: 50px;

    & > div {
      display: grid;
      grid-template-rows: repeat(auto-fit, 1fr);
      gap: 20px;
      & > div {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 10px;
        padding: 1em;
        & h3 {
          grid-area: 1 / 1 / 2 / 2;
        }
        & p:nth-child(2) {
          grid-area: 2 / 1 / 3 / 2;
          color: var(--darker-color);
        }
        & p:nth-child(3) {
          grid-area: 1 / 2 / 3 / 3;
        }
      }
    }
  }
`;

const Wrapper = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: clamp(20px, 10vh, 100px);
  padding-block: 150px;
  text-align: center;
  overflow-x: hidden;

  & > nav > ul {
    display: flex;
    gap: 20px;

    & li > button {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: 0.5em;
      gap: 20px;
      width: clamp(100px, 10vw, 200px);
    }
  }

  & h1 {
    font-size: var(--font-size-h1);
  }

  & h2 {
    font-size: var(--font-size-reg);
  }
`;

const ContainerWrapperEditImage = styled.div`
  position: absolute;
  display: grid;
  grid-template-rows: auto 1fr 1fr;
  place-items: center;
  padding-block: 50px;
  max-width: 1000px;
  min-height: 60vh;
  width: 100%;
  z-index: 150;
  background-color: #fff;
  font-size: var(--font-size);

  & p.error {
    color: var(--error-txt);
    font-weight: bold;
  }

  &:has(> img) {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }
  & label {
    position: relative;
    z-index: -1;

    .addImageCase {
      width: clamp(150px, 13vw, 200px);
      aspect-ratio: 1/1;
      border-radius: 10px;
      transition: 0.15s ease-out;
      background-size: cover !important;
      background-position: center !important;
      background-repeat: no-repeat !important;
    }

    &::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: url(${editBtn});
      background-repeat: no-repeat;
      width: 30px;
      height: 30px;
      opacity: 0;
      transition: 0.15s ease-out;
      z-index: 1;
    }
    @media (pointer: coarse) {
      &:not(:hover),
      &:hover {
        cursor: pointer;
        & img {
          filter: brightness(50%);
        }

        &::after {
          opacity: 1;
        }
      }
    }
    &:hover {
      cursor: pointer;
      & img {
        filter: brightness(50%);
      }

      &::after {
        opacity: 1;
      }
    }
  }

  & img {
    width: clamp(150px, 13vw, 200px);
    aspect-ratio: 1/1;
    object-fit: cover;
    border-radius: 10px;
    transition: 0.15s ease-out;
  }
  & form {
    display: grid;
    place-items: center;
    flex-basis: 70%;
    gap: 15px;
    grid-template-columns: repeat(2, 1fr);
    & button {
      grid-area: 3 / 2 / 4 / 3;
    }
    & input {
      font-size: var(--font-size);
      width: 75%;
      &[type="file"] {
        display: none;
      }
    }

    @media screen and (max-width: 600px) {
      display: flex;
      flex-direction: column;
    }
  }
`;

export {
  EditCardContainer,
  HoursContainer,
  ImgWrapper,
  CardContainer,
  Wrapper,
  ContainerWrapperEditImage,
};
