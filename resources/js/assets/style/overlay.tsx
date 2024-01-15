import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  display: grid;
  place-items: center;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: var(--color-blackless);
  z-index: 100;
  & section {
    position: absolute;
    padding-block: 25px;
    width: 1000px;
    max-height: 75%;
    min-height: 50%;
    max-width: 100%;
    z-index: 150;
    background-color: #fff;
    font-size: var(--font-size);
    overflow: auto;
    scroll-behavior: smooth;
  }
`;
