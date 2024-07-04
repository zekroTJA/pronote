import { Entry, SideBar } from "../components/SideBar";

import ListModal from "../components/Modals/AddListModal";
import { ListUpdate } from "../models/models";
import { Outlet } from "react-router";
import styled from "styled-components";
import useApi from "../hooks/useApi";
import { useEffectAsync } from "../hooks/useEffectAsync";
import { useState } from "react";
import { useStore } from "../services/store";

const Container = styled.div`
  display: flex;
  gap: 1em;
  height: 100%;
`;

const Home: React.FC = () => {
  const fetch = useApi();
  const [lists, setLists] = useStore((s) => [s.lists, s.setLists]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffectAsync(async () => {
    const res = await fetch((c) => c.lists());
    if (res) {
      setLists(res.items);
    }
  }, []);

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
      <Outlet />
      <ListModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={onAddSubmit}
      />
    </Container>
  );
};

export default Home;
