import styled from "styled-components";
import downArrowCalendar from "../images/down-arrow.ico";

const ReservationContainer = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  gap: 30px;
  padding-block: 25px;
  width: clamp(300px, 75vw, 1000px);
  max-height: 80svh;
  max-width: 100%;
  z-index: 150;
  background-color: #fff;
  overflow: auto;
  scroll-behavior: smooth;

  &:has(p.validationReservation) p.validationReservation {
    background: var(--primary-color);
    max-width: 90%;
    padding: 0.25em;
    color: var(--darker-color);
    font-weight: bolder;
    border-radius: 5px;
  }

  & h1 {
    font-size: var(--font-size-bigger);
  }
  & h2 {
    text-align: center;
  }

  & #lunchHours,
  & #dinnerHours {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 25px;
  }

  & #finalCase {
    position: relative;
    display: grid;
    place-items: center;
    grid-template-columns: auto auto;
    gap: 50px;
    & p:hover {
      cursor: pointer;
    }

    &:has(div) button {
      grid-area: 2 / 1 / 3 / 3;
    }

    @media screen and (max-width: 480px) {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
  }

  @media screen and (max-width: 600px) {
    gap: 5vh;
    padding-block: 50px;
    height: 65vh;
    width: 100%;

    & span {
      position: absolute;
      top: 10px;
      right: 10px;
    }
  }
`;

const OptionsReserv = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  place-items: center;
  gap: 5cqh 10vw;

  & label {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    width: clamp(200px, 100%, 250px);
    border-radius: 5px;
    padding-inline-start: 0.5em;
    gap: 0.5em;

    & > svg {
      height: 30px;
    }
    background-color: var(--darker-color);
  }

  & input {
    min-width: 100%;
    height: 30px;
    padding: 0 0 0 0.25em;
    &[type="date"] {
      background-color: var(--darker-color);
      color: #fff;
      border: none;
      min-width: 100%;
      font-size: var(--font-size-little);
      text-align: center;
      padding: 0.2rem;
      &#date {
        &::-webkit-calendar-picker-indicator {
          background: url(${downArrowCalendar});
          background-size: cover;
          width: 20px;
          height: 20px;

          &:hover {
            cursor: pointer;
          }
        }
      }
    }
  }

  @media screen and (max-width: 750px) {
    grid-template-columns: 1fr;

    & > #date {
      min-width: calc(100% + 2em);
    }
  }
`;

const HoursList = styled.ul`
  display: flex;
  column-gap: 2cqw;
  row-gap: 3cqh;
  font-size: var(--font-size-reg);
  justify-content: center;
  flex-wrap: wrap;
  padding-inline: 3em;
  max-width: 100%;

  & button {
    background-color: var(--primary-color);
    color: inherit;
    border-radius: 5px;
    font-size: var(--font-size);
    transition: 0.15s ease;
    min-width: fit-content;
    filter: brightness(100%);
    &::after {
      display: none;
    }

    &:hover,
    &.selected {
      filter: brightness(70%);
    }
  }

  @media screen and (max-width: 600px) {
    padding-inline: 2em;
  }
`;

const AlergyWrapper = styled.div`
  position: relative;
  width: 200px;
  z-index: 500;
  & input {
    width: 100%;
    padding: 0.5em 1em;
    font-size: var(--font-size);
    &::placeholder {
      color: var(--color-blackless);
    }
  }
`;

export { OptionsReserv, ReservationContainer, HoursList, AlergyWrapper };
