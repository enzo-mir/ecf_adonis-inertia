import styled from "styled-components";

export const Cross = styled.button`
  position: relative;
  display: grid;
  place-items: center;
  min-width: 35px;
  min-height: 35px;
  margin-left: calc(100% - 100px);
  background-color: var(--darker-color);
  border-radius: 5px;
  padding: 0.2em;
  isolation: isolate;

  &::after,
  &::before {
    content: "";
    position: absolute;
    background-color: white;
    height: 100%;
    width: 1px;
    left: 50%;
  }
  &::after {
    transform: rotate(45deg);
  }
  &::before {
    transform: rotate(-45deg);
  }
  &:hover {
    cursor: pointer;
    filter: brightness(70%);
  }
`;
