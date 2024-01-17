import styled from "styled-components";
import hamburgerBtn from "../images/barre-de-menu.png";

const Wrapper = styled.header`
  position: fixed;
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--primary-color);
  transition: all 0.2s ease-out;
  z-index: 50;

  @media screen and (min-width: 700px) {
    @media (pointer: fine) {
      &.display {
        height: 0;
        overflow: hidden;
      }
    }
  }

  & .imgContainer {
    display: grid;
    place-items: center;
    padding: 1rem;
    height: 100%;
    & img {
      height: clamp(40px, 5vh, 100px);
      aspect-ratio: 1/1;
    }
  }

  @media screen and (max-width: 600px) {
    height: auto;
    justify-content: flex-start;
  }
`;
const BtnMenu = styled.span`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: none;
  height: 3vh;
  min-height: 20px;
  aspect-ratio: 1/1;
  background-image: url("${hamburgerBtn}");
  background-size: contain;
  margin-inline: 1em;
  right: 0px;

  &:hover {
    cursor: pointer;
  }

  @media screen and (max-width: 600px) {
    display: block;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 50px;
  width: 100%;
  & a {
    position: relative;
    color: var(--darker-color);
    text-decoration: none;
    text-underline-offset: 8px;
    padding: 1rem;

    &[aria-current="page"] {
      text-decoration: underline;
      font-weight: 600;
    }
  }

  & > button > a {
    text-decoration: none;
    color: white;
  }
  & nav {
    margin-left: auto;
    width: max-content;

    & ul {
      display: flex;
      justify-content: center;
      column-gap: 2vw;
      & li {
        display: grid;
        place-items: center;
        font-size: var(--font-size);
      }
    }
  }

  & #profil {
    height: clamp(50px, 7vh, 70px);
    aspect-ratio: 1/1;
    border-radius: 50%;
    font-size: var(--font-size-bigger);

    &::after {
      display: none;
    }
  }

  & .profil {
    position: relative;
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 2vw;
    padding-inline: 1em;

    & .reservations {
      display: grid;
      place-items: center;
      border-radius: 50%;
      border: 2px solid var(--darker-color);
      color: white;
      font-weight: 600;
      font-size: var(--font-size-little);
      height: clamp(30px, 4vh, 100px);
      aspect-ratio: 1/1;
      z-index: 50;
      background-color: var(--darker-color-a70);
      padding: 0;

      &::after {
        display: none;
      }

      &:hover {
        background-color: var(--darker-color);
      }

      @media screen and (max-width: 600px) {
        width: 30px;
        height: 30px;
      }
    }
  }

  @media screen and (max-width: 600px) {
    top: 0;
    background-color: var(--primary-color);
    position: absolute;
    flex-direction: column;
    padding-block: 0em;
    height: 0vh;
    overflow: hidden;
    transition: all 0.15s ease;

    &.display {
      top: 0;
      transition: all 0.3s ease;
      height: clamp(350px, 40vh, 800px);

      gap: 5vh;
      padding-block: 1em;

      & .profil:has(button) {
        :has(.reservations) {
          flex-direction: column-reverse;
        }
      }
    }

    a,
    button {
      font-size: var(--font-size-reg);
    }

    nav {
      margin: 0;
      ul {
        flex-direction: column;
      }
    }

    .profil {
      margin-inline: auto;
      flex-direction: column;
      row-gap: 3vh;
      padding: 0;
    }
  }
`;

export { Wrapper, BtnMenu, HeaderContainer };
