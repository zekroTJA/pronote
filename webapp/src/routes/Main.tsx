import { Entry, SideBar } from "../components/SideBar";
import { Outlet, useLocation } from "react-router";

import ListEditModal from "../components/Modals/ListEditModal";
import { ListUpdate } from "../models/models";
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

const Main: React.FC = () => {
  const fetch = useApi();
  const [lists, setLists] = useStore((s) => [s.lists, s.setLists]);
  const [showAddModal, setShowAddModal] = useState(false);
  const location = useLocation();

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
      <SideBar entries={entries} onAdd={onAdd} selected={location.pathname} />
      <Outlet />
      <ListEditModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={onAddSubmit}
      />
    </Container>
  );
};

export default Main;
