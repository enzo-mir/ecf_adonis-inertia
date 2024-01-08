import styled from "styled-components";
export const ContainerSettings = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  gap: 30px;
  padding-block: 25px;
  width: 1000px;
  min-height: 60%;
  max-width: 100%;
  z-index: 150;
  background-color: #fff;
  font-size: var(--font-size);

  & label {
    width: fit-content;
    display: grid;
  }

  & > div {
    &.passwordField {
      grid-template-columns: 1fr;
    }
    display: grid;
    width: 80%;
    grid-template-columns: 1fr 1fr;
    justify-content: space-between;
    place-items: center;

    & strong {
      font-weight: 600;
    }
    @media screen and (max-width: 600px) {
      justify-content: center;
      &:has(label) {
        grid-template-columns: 50%;
      }
      grid-template-columns: 80%;
      row-gap: 5vh;

      &.passwordField {
        grid-template-columns: 50%;
      }

      & > label {
        width: 100%;

        & > input {
          width: 100%;
        }
      }
    }
  }

  & > div.cta {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 50px;
  }

  & input {
    padding-inline: 0;
    width: clamp(200px, 15cqw, 400px);
  }

  .error {
    background-color: var(--primary-color);
    padding: 1rem;
    border-radius: 5px;
    text-align: center;
  }

  @media screen and (max-width: 600px) {
    justify-content: space-around;
  }
`;
