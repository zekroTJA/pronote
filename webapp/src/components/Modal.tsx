import React from "react";
import { styled } from "styled-components";

type Props = {
  show: boolean;
  heading?: string | JSX.Element;
  body?: string | JSX.Element;
  footer?: JSX.Element;
  onClose?: () => void;
};

const Container = styled.div<{ show: boolean }>`
  position: fixed;
  display: flex;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  backdrop-filter: blur(${(p) => (p.show ? "30px" : "0")});
  pointer-events: ${(p) => (p.show ? "all" : "none")};
  opacity: ${(p) => (p.show ? 1 : 0)};

  transition: all 0.25s ease;
`;

const InnerContainer = styled.div`
  width: fit-content;
  height: fit-content;
  padding: 1em;
  border-radius: 12px;
  background-color: ${(p) => p.theme.background2};
  box-shadow: 0 0 30px 5px rgba(0 0 0 / 20%);
  margin: 7em auto 0 auto;
`;

const Heading = styled.div``;

const Body = styled.div``;

const Footer = styled.div``;

export const Modal: React.FC<Props> = ({
  show,
  heading,
  body,
  footer,
  onClose,
}) => {
  const onContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).id !== "container") return;
    onClose?.call(this);
  };

  return (
    <Container id="container" show={show} onClick={onContainerClick}>
      <InnerContainer>
        {heading ?? <Heading>{heading}</Heading>}
        {body ?? <Body>{body}</Body>}
        {footer ?? <Footer>{footer}</Footer>}
      </InnerContainer>
    </Container>
  );
};
