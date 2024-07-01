import { styled } from "styled-components";

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
  border: none;
  padding: 0.8em 1em;
  border-radius: 3px;
  display: flex;
  gap: 0.8em;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s ease;
  justify-content: center;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:enabled:hover {
    transform: translateY(-3px);
  }

  background-color: ${(p) => {
    switch (p.variant ?? "default") {
      case "red":
        return p.theme.red;
      case "green":
        return p.theme.green;
      case "blue":
        return p.theme.blurple;
      case "yellow":
        return p.theme.yellow;
      case "orange":
        return p.theme.orange;
      case "gray":
        return p.theme.background3;
      case "pink":
        return p.theme.pink;
      default:
        return p.theme.accent;
    }
  }};
`;

export default Button;
