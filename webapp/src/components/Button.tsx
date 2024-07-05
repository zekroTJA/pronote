import { ExecutionContext, styled } from "styled-components";

import Color from "color";

export type ButtonVariant =
  | "default"
  | "red"
  | "green"
  | "blue"
  | "yellow"
  | "orange"
  | "gray"
  | "pink";

type Props = {
  variant?: ButtonVariant;
};

const Button = styled.button<Props>`
  font-size: 1rem;
  font-family: "Roboto", sans-serif;
  color: ${(p) => p.theme.text};
  padding: 0.4em 0.8em;
  border-radius: 3px;
  display: flex;
  gap: 0.8em;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  justify-content: center;
  display: flex;
  align-items: center;
  gap: 0.5em;

  > svg {
    height: 1.2em;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  opacity: 0.7;
  &:hover {
    opacity: 1;
  }

  background-color: ${(p) => variantColor(p).fade(0.8).hexa()};

  border: solid 2px;
  border-color: ${(p) => variantColor(p).hexa()};
`;

function variantColor(p: ExecutionContext & Props) {
  switch (p.variant ?? "default") {
    case "red":
      return new Color(p.theme.red);
    case "green":
      return new Color(p.theme.green);
    case "blue":
      return new Color(p.theme.blurple);
    case "yellow":
      return new Color(p.theme.yellow);
    case "orange":
      return new Color(p.theme.orange);
    case "gray":
      return new Color(p.theme.background3);
    case "pink":
      return new Color(p.theme.pink);
    default:
      return new Color(p.theme.accent);
  }
}

export default Button;
