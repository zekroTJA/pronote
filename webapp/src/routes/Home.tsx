import { Entry, SideBar } from "../components/SideBar";
import { List, ListUpdate } from "../models/models";
import { useEffect, useState } from "react";

import ListModal from "../components/Modals/AddListModal";
import styled from "styled-components";
import useApi from "../hooks/useApi";

const Container = styled.div`
  display: flex;
  gap: 1em;
  height: 100%;
`;

const Home: React.FC = () => {
  const fetch = useApi();

  const [lists, setLists] = useState<List[] | undefined>(undefined);

  useEffect(() => {
    fetch((c) => c.lists()).then((v) => setLists(v?.items));
  }, []);

  const [showAddModal, setShowAddModal] = useState(false);

  const onAdd = () => {
    setShowAddModal(!showAddModal);
  };

  const onAddSubmit = async (v: ListUpdate) => {
    const res = await fetch((c) => c.add_list(v));
    if (res) {
      setLists([...(lists ?? []), res]);
    }
  };

  const entries = lists?.map(
    (l) =>
      ({
        title: l.name,
        link: `/${l.id}`,
      } as Entry)
  );

  return (
    <Container>
      <SideBar entries={entries} onAdd={onAdd} />
      <ListModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={onAddSubmit}
      />
    </Container>
  );
};

export default Home;
