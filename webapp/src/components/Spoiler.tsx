import { PropsWithChildren, useState } from "react";

import ArrowIcon from "../assets/arrow.svg?react";
import { PropsWithStyle } from "./props";
import { styled } from "styled-components";

type Props = PropsWithChildren &
  PropsWithStyle & {
    header: string;
  };

type Show = {
  show: boolean;
};

const Header = styled.div<Show>`
  display: flex;
  align-items: center;
  gap: 0.4em;
  opacity: 0.6;
  margin-bottom: 1em;
  cursor: pointer;

  > svg {
    height: 1.3em;
    min-width: 1.3em;
    transform: rotate(${(p) => (p.show ? "0deg" : "-90deg")});
    transition: all 0.25s ease;
  }
`;

const Container = styled.div<Show>`
  display: ${(p) => (p.show ? "block" : "none")};
`;

const Spoiler: React.FC<Props> = ({ header, children, ...props }) => {
  const [show, setShow] = useState(false);

  return (
    <div {...props}>
      <Header show={show} onClick={() => setShow(!show)}>
        <ArrowIcon />
        <span>{header}</span>
      </Header>
      <Container show={show}>{children}</Container>
    </div>
  );
};

export default Spoiler;
