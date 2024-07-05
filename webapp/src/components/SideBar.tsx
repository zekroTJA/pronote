import styled, { css } from "styled-components";

import AddIcon from "../assets/add.svg?react";
import { Link } from "react-router-dom";
import React from "react";
import { uid } from "react-uid";

export type Entry = {
  title: string;
  link: string;
};

type Props = {
  entries?: Entry[];
  selected?: string;
  onAdd: () => void;
};

const Container = styled.div`
  height: 100%;
  width: 15em;
  background-color: ${(p) => p.theme.background2};
  padding: 0.5em;
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

export const SideBar: React.FC<Props> = ({ entries, selected, onAdd }) => {
  return (
    <Container>
      <HeadingContainer>
        <Heading>Lists</Heading>
        <AddButton onClick={onAdd}>
          <AddIcon />
        </AddButton>
      </HeadingContainer>
      <ItemsContainer>
        {entries?.map((v) => (
          <Item key={uid(v)} to={v.link} selected={selected === v.link}>
            {v.title}
          </Item>
        ))}
      </ItemsContainer>
    </Container>
  );
};
