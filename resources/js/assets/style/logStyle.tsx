import styled from "styled-components";

const LogContainer = styled.section`
  position: absolute;
  display: grid;
  place-items: center;
  grid-template-rows: auto auto 1fr auto;
  gap: 30px;
  padding-block: 25px;
  width: 1000px;
  min-height: 500px;
  max-width: 100%;
  z-index: 150;
  background-color: #fff;

  &:has(> p) {
    grid-template-rows: auto auto auto 30cqh auto;
  }

  & p {
    text-align: center;
  }
  & form {
    height: 100%;
    display: flex;
    flex-direction: column;

    & .ctaLog {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 25px;

      p {
        font-size: var(--font-size-little);
        color: var(--darker-color);
        text-decoration: underline;
        &:hover {
          cursor: pointer;
        }
      }

      @media screen and (max-width: 600px) {
        flex-direction: column;
      }
    }
  }
  & h1 {
    font-size: var(--font-size-bigger);
    text-align: center;
  }
`;

const ContentSignIn = styled.div`
  display: grid;
  place-items: center;
  grid-template-rows: auto auto auto 1fr;
  height: 100%;
  row-gap: 4vh;

  & .adds {
    padding-block: 20px;
  }

  div {
    display: flex;
    column-gap: 3vw;
    width: 80%;
  }
`;
const ContentLogIn = styled.div`
  display: grid;
  justify-items: center;
  align-content: center;
  height: 100%;
  grid-template-rows: auto auto;
  gap: 5vh;
  & input {
    width: 50%;
  }
  & > div {
    display: flex;
    column-gap: 3vw;
    height: 100%;
  }
`;

export { LogContainer, ContentSignIn, ContentLogIn };
