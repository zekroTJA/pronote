import { Entry, SideBar } from "../components/SideBar";
import { Outlet, useLocation, useNavigate } from "react-router";

import ListEditModal from "../components/Modals/ListEditModal";
import { ListUpdate } from "../models/models";
import styled from "styled-components";
import useApi from "../hooks/useApi";
import { useEffectAsync } from "../hooks/useEffectAsync";
import { useState } from "react";
import { useStore } from "../services/store";

const Container = styled.div`
  display: flex;
  height: 100%;
`;

const OutletContainer = styled.div`
  overflow-y: auto;
  width: 100%;
  padding: 0 2em;
`;

const Main: React.FC = () => {
  const fetch = useApi();
  const [lists, setLists] = useStore((s) => [s.lists, s.setLists]);
  const [showAddModal, setShowAddModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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
      navigate(`/${res.id}`);
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
      <OutletContainer>
        <Outlet />
      </OutletContainer>
      <ListEditModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={onAddSubmit}
      />
    </Container>
  );
};

export default Main;
