import { Link } from "@inertiajs/inertia-react";
import React from "react";
import { useEffect } from "react";
import styled from "styled-components";

const UndefinedRoute = () => {
  useEffect(() => {
    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);

  document.body.style.overflow = "hidden";
  return (
    <Wrapper>
      <h1>Erreur 404 : page introuvable</h1>
      <Link href="/">Revenir à l'accueil</Link>
    </Wrapper>
  );
};
const Wrapper = styled.main`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2em;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: var(--color-blackless);

  & > a {
    background-color: var(--darker-color);
    color: white;
    border-radius: 0.25em;
    text-decoration: none;
    text-underline-offset: 8px;
    padding: 1rem;
  }
  & h1 {
    position: relative;
    padding: 1em;
    display: flex;
    justify-content: center;
    align-items: center;
    background: radial-gradient(
        circle at 100% 50%,
        var(--primary-color) 20%,
        var(--darker-color) 21%,
        var(--darker-color) 34%,
        var(--primary-color) 35%,
        var(--primary-color)
      ),
      radial-gradient(
          circle at 0% 50%,
          var(--primary-color) 20%,
          var(--darker-color) 21%,
          var(--darker-color) 34%,
          var(--primary-color) 35%,
          var(--primary-color)
        )
        10px -30px;
    background-size: 50px 50px;
    -webkit-background-clip: text;
    color: transparent;
    font-size: var(--font-size-h1);
  }
`;
export default UndefinedRoute;
