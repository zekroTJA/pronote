import { Entry, SideBar } from "../components/SideBar";
import { useEffect, useState } from "react";

import { List } from "../models/models";
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

  const onAdd = () => {};

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
    </Container>
  );
};

export default Home;
