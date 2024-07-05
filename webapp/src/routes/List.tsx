import { formatDuration, intervalToDuration } from "date-fns";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";

import Button from "../components/Button";
import ClockIcon from "../assets/clock.svg?react";
import ListEditModal from "../components/Modals/ListEditModal";
import ListItems from "../components/ListItems";
import { ListUpdate } from "../models/models";
import PencilIcon from "../assets/pencil.svg?react";
import TrashIcon from "../assets/trash.svg?react";
import styled from "styled-components";
import useApi from "../hooks/useApi";
import { useStore } from "../services/store";

const Container = styled.div`
  width: 100%;
  max-width: 40em;
  margin: 0 auto;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 0.5em;
`;

const Heading = styled.h1`
  margin-bottom: 0em;
`;

const Description = styled.small`
  opacity: 0.7;
`;

const Timeout = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5em;
  opacity: 0.7;
`;

const ActionButtonContainer = styled.div`
  display: flex;
  gap: 0.7em;
`;

const ActionButton = styled(Button)`
  font-size: 12px;
`;

function fmtDuration(seconds?: number): string {
  if (!seconds) return "No timeout for list elements.";
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 });
  const timeout = formatDuration(duration);
  return `${timeout}`;
}

const List: React.FC = () => {
  const fetch = useApi();
  const navigate = useNavigate();
  const { listId } = useParams();
  const [lists, setLists] = useStore((s) => [s.lists, s.setLists]);
  const list = useMemo(
    () => lists.find((l) => l.id === listId),
    [lists, listId]
  );
  const [showEditModal, setShowEditModal] = useState(false);

  const onEdit = () => {
    setShowEditModal(true);
  };

  const onDelete = async () => {
    if (!listId) return;

    await fetch((c) => c.delete_list(listId));

    navigate("/");
    const newLists = lists.filter((l) => l.id !== listId);
    setLists(newLists);
  };

  const onEditSubmit = async (v: ListUpdate) => {
    if (!listId) return;
    const res = await fetch((c) => c.update_list(listId, v));
    if (res) {
      const listCopy = [...lists];
      const i = listCopy.findIndex((l) => l.id === listId);
      if (i < 0) return;
      listCopy[i].name = v.name;
      listCopy[i].description = v.description;
      listCopy[i].timeout_seconds = v.timeout_seconds;
      setLists(listCopy);
    }
  };

  return (
    <Container>
      {list && (
        <Header>
          <Heading>{list.name}</Heading>
          {list.description && <Description>{list.description}</Description>}
          <Timeout>
            <ClockIcon height="1em" />
            {fmtDuration(list.timeout_seconds)}
          </Timeout>
          <ActionButtonContainer>
            <ActionButton variant="gray" onClick={onEdit}>
              <PencilIcon />
              <span>Edit</span>
            </ActionButton>
            <ActionButton variant="red" onClick={onDelete}>
              <TrashIcon />
              <span>Delete</span>
            </ActionButton>
          </ActionButtonContainer>
        </Header>
      )}
      {list && <ListItems list={list} />}
      <ListEditModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={onEditSubmit}
        initialState={list}
      />
    </Container>
  );
};

export default List;
