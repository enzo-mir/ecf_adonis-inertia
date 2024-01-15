import styled from "styled-components";

const LogContainer = styled.section`
  display: grid;
  place-items: center;
  grid-template-rows: auto auto 1fr auto;
  gap: 30px;

  &:has(> p.validationMessage) {
    grid-template-rows: auto auto auto 1fr auto;
  }

  & p {
    text-align: center;
    &.validationMessage {
      background: var(--primary-color);
      padding: 0.25em;
      color: var(--darker-color);
      font-weight: bolder;
      border-radius: 5px;
    }
  }
  & form {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

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
    font-weight: bolder;
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
