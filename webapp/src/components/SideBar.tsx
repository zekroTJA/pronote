import React, { useState } from "react";
import styled, { css } from "styled-components";

import AddIcon from "../assets/add.svg?react";
import Banner from "../assets/banner.svg?react";
import { Link } from "react-router-dom";
import UpIcon from "../assets/up.svg?react";
import { uid } from "react-uid";

const SIDEBAR_WIDTH = 15;

export type Entry = {
  title: string;
  link: string;
};

type Props = {
  entries?: Entry[];
  selected?: string;
  onAdd: () => void;
};

const Container = styled.div<{ shown: boolean }>`
  height: 100%;
  width: ${SIDEBAR_WIDTH}em;
  background-color: ${(p) => p.theme.background2};
  padding: 0.5em;
  z-index: 1;
  transition: left 0.2s ease;

  @media screen and (max-width: 40em) {
    left: ${(p) => (p.shown ? 0 : -SIDEBAR_WIDTH)}em;
    position: absolute;
    box-shadow: 0 0 ${(p) => (p.shown ? "2em" : 0)} 0 rgba(0 0 0 / 0.3);
  }
`;

const HeadingContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Heading = styled.h1`
  margin: 0;
  text-transform: uppercase;
  font-size: 1rem;
  opacity: 0.4;
  font-weight: lighter;
  margin-left: 0.3em;
  margin-bottom: 0.7em;
  align-items: center;
`;

const AddButton = styled.button`
  height: 2em;
  width: 2em;
  padding: 0;
  margin: 0;
  border: none;
  color: ${(p) => p.theme.text};
  background-color: transparent;
  cursor: pointer;
  opacity: 0.3;
  border-radius: 5px;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(p) => p.theme.background3};
    opacity: 0.7;
  }
`;

const ItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5em;
`;

const Item = styled(Link)<{ selected: boolean }>`
  padding: 0.1em 0.3em;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  color: ${(p) => p.theme.text};

  transition: all 0.2s ease;

  ${(p) =>
    p.selected &&
    css`
      background-color: ${(p) => p.theme.background3};
    `}

  &:hover {
    background-color: ${(p) => p.theme.background3};
  }
`;

const StyledBanner = styled(Banner)`
  height: fit-content;
  padding: 0.2em 1em;
`;

const ShowButton = styled(UpIcon)<{ shown: boolean }>`
  display: none;

  width: 1.5em;
  height: 1.5em;
  position: absolute;
  left: ${(p) => (p.shown ? SIDEBAR_WIDTH + 0.5 : 0.5)}em;
  top: 0.5em;
  background-color: ${(p) => p.theme.background2};
  border-radius: 8px;
  padding: 0.2em;
  cursor: pointer;
  opacity: 0.7;
  transform: rotate(${(p) => (p.shown ? "-90deg" : "90deg")});
  transition: all 0.2s ease;

  &:hover {
    opacity: 1;
  }

  @media screen and (max-width: 40em) {
    display: block;
  }
`;

export const SideBar: React.FC<Props> = ({ entries, selected, onAdd }) => {
  const [shown, setShown] = useState(true);

  return (
    <>
      <ShowButton onClick={() => setShown(!shown)} shown={shown} />
      <Container shown={shown}>
        <Link to="/">
          <StyledBanner />
        </Link>
        <HeadingContainer>
          <Heading>Lists</Heading>
          <AddButton onClick={onAdd}>
            <AddIcon />
          </AddButton>
        </HeadingContainer>
        <ItemsContainer>
          {entries?.map((v) => (
            <Item
              key={uid(v)}
              to={v.link}
              selected={selected === v.link}
              onClick={() => setShown(false)}
            >
              {v.title}
            </Item>
          ))}
        </ItemsContainer>
      </Container>
    </>
  );
};
