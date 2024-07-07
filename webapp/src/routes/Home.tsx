import { Link, useNavigate } from "react-router-dom";

import AddIcon from "../assets/add.svg?react";
import Button from "../components/Button";
import ListEditModal from "../components/Modals/ListEditModal";
import { ListUpdate } from "../models/models";
import { styled } from "styled-components";
import useApi from "../hooks/useApi";
import { useState } from "react";
import { useStore } from "../services/store";

const Container = styled.div`
  padding-top: 1em;
  display: flex;
  flex-direction: column;
  gap: 1em;
`;

const Header = styled.h1`
  margin: 1em 0 0 0;
`;

const SectionHeader = styled.h2`
  margin-bottom: 0.6em;
  opacity: 0.6;
  font-size: 1.2em;
  text-transform: uppercase;
  font-weight: lighter;
`;

const ListsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1em;
`;

const ListItem = styled(Link)<{ idx: number }>`
  background-color: ${(p) => p.theme.background2};
  padding: 1em;
  border-radius: 12px;
  cursor: pointer;
  color: ${(p) => p.theme.text};
  text-decoration: none;

  > h2 {
    margin: 0;
    font-size: 1em;
    text-transform: uppercase;
    font-weight: light;
  }

  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.01);
  }

  @keyframes animate-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  opacity: 0;
  animation: animate-in 1s ease-out;
  animation-delay: ${(p) => p.idx * 0.1}s;
  animation-fill-mode: forwards;
`;

const Home: React.FC = () => {
  const fetch = useApi();
  const [lists, setLists] = useStore((s) => [s.lists, s.setLists]);
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();

  const onAddSubmit = async (v: ListUpdate) => {
    const res = await fetch((c) => c.add_list(v));
    if (res) {
      setLists([...(lists ?? []), res]);
      navigate(`/${res.id}`);
    }
  };

  const listElements = lists?.map((l, idx) => (
    <ListItem to={`/${l.id}`} idx={idx}>
      <h2>{l.name}</h2>
      <span>{l.description}</span>
    </ListItem>
  ));

  return (
    <>
      <Container>
        <section>
          <Header>Welcome! 👋</Header>
        </section>

        <section>
          <SectionHeader>Start managing your ideas</SectionHeader>
          <Button onClick={() => setShowAddModal(true)}>
            <AddIcon />
            Create a new list
          </Button>
        </section>

        {lists.length > 0 && (
          <section>
            <SectionHeader>Jump right back in</SectionHeader>
            <ListsContainer>{listElements}</ListsContainer>
          </section>
        )}
      </Container>
      <ListEditModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={onAddSubmit}
      />
    </>
  );
};

export default Home;
