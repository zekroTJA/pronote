import { PropsWithStyle } from "./props";
import React from "react";
import { styled } from "styled-components";

type Props = ShowProps &
  PropsWithStyle & {
    heading?: string | JSX.Element;
    body?: string | JSX.Element;
    controls?: JSX.Element[];
    onClose?: () => void;
  };

type ShowProps = {
  show: boolean;
};

const Container = styled.div<ShowProps>`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100vw;
  height: 100vh;
  backdrop-filter: blur(${(p) => (p.show ? "10px" : "0")});
  background-color: ${(p) => (p.show ? "rgba(0 0 0 / 50%)" : "transparent")};
  pointer-events: ${(p) => (p.show ? "all" : "none")};
  opacity: ${(p) => (p.show ? 1 : 0)};

  transition: all 0.2s ease;
`;

const InnerContainer = styled.div<ShowProps>`
  width: fit-content;
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: 1em;
  border-radius: 12px;
  background-color: ${(p) => p.theme.background2};
  box-shadow: 0 0 30px 5px rgba(0 0 0 / 20%);
  margin: 7em auto 0 auto;
  transform: scale(${(p) => (p.show ? 1 : 0.95)});
  padding: 1em;

  transition: all 0.2s ease;
`;

const Title = styled.h1`
  font-size: 1em;
  font-weight: light;
  opacity: 0.7;
  text-transform: uppercase;
  margin: 0;
`;

const Controls = styled.div`
  display: flex;
  gap: 1em;
  justify-content: end;
  margin-top: 1em;
`;

export const Modal: React.FC<Props> = ({
  show,
  heading,
  body,
  controls,
  onClose,
  ...props
}) => {
  const onContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).id !== "container") return;
    onClose?.call(this);
  };

  return (
    <Container id="container" show={show} onClick={onContainerClick}>
      <InnerContainer show={show} {...props}>
        {heading && (
          <div>
            {typeof heading === "string" ? <Title>{heading}</Title> : heading}
          </div>
        )}
        {body && <div>{body}</div>}
        {controls && <Controls>{controls}</Controls>}
      </InnerContainer>
    </Container>
  );
};
