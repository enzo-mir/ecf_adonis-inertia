import React from "react";
import styled from "styled-components";

const Loading = () => {
  return (
    <Wrapper>
      <div id="loader">
        <svg xmlns="http://www.w3.org/2000/svg" width="150px" height="150px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
          <circle cx="50" cy="50" r="41" stroke="#906527" strokeWidth="2" fill="none"></circle>
          <path d="M11 50 Q30.5 37 50 50 Q69.5 63 89 50 A39 39 0 0 1 11 50" fill="#ffebcc">
            <animate
              attributeName="d"
              repeatCount="indefinite"
              dur="1.5873015873015872s"
              calcMode="spline"
              keyTimes="0;0.5;1"
              values="M11 50 Q30.5 37 50 50 Q69.5 63 89 50 A39 39 0 0 1 11 50;M11 50 Q30.5 63 50 50 Q69.5 37 89 50 A39 39 0 0 1 11 50;M11 50 Q30.5 37 50 50 Q69.5 63 89 50 A39 39 0 0 1 11 50"
              keySplines="0.5 0 0.5 1;0.5 0 0.5 1"
            ></animate>
          </path>
        </svg>
        <p>Chargement ...</p>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  width: 100%;
  height: 100vh;
  background-color: #fff;
  display: grid;
  place-items: center;
  text-align: center;

  & p {
    font-size: var(--font-size-bigger);
  }

  & #loader {
    svg {
      animation: loading 1s ease-in-out infinite;
      @media screen and (max-width: 600px) {
        width: 100px;
        height: 100px;
      }
    }
  }

  @keyframes loading {
    0% {
      scale: 1;
    }
    50% {
      scale: 1.1;
    }
    100% {
      scale: 1;
    }
  }
`;

export default Loading;
