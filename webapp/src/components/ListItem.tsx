import { Item, Part } from "../models/models";

import Button from "./Button";
import DownIcon from "../assets/down.svg?react";
import TrashIcon from "../assets/trash.svg?react";
import UpIcon from "../assets/up.svg?react";
import { styled } from "styled-components";
import { useState } from "react";

type Props = {
  item?: Item;
  onUpdate: (v: Item) => Promise<boolean>;
  onDelete: (v: Item) => void;
};

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  opacity: 0;

  > ${Button} {
    padding: 0.2em 0.4em;
    font-size: 0.7em;
  }
`;

const Container = styled.div`
  display: flex;
  gap: 0.5em;

  padding: 0.5em;
  border-radius: 8px;
  background-color: ${(p) => p.theme.background2};

  &:hover ${ControlsContainer} {
    opacity: 1;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  width: 100%;
`;

const Title = styled.input`
  width: 100%;
  background-color: transparent;
  color: ${(p) => p.theme.text};
  border: none;
  font-size: 1em;
  outline: none;
`;

const Description = styled.textarea`
  min-width: 100%;
  max-width: 100%;
  background-color: transparent;
  color: ${(p) => p.theme.text};
  border: none;
  font-size: 0.8em;
  font-family: inherit;
  opacity: 0.8;
  outline: none;
`;

const ListItem: React.FC<Props> = ({ item, onUpdate, onDelete }) => {
  const [_item, setItem] = useState(item ?? ({ title: "" } as Item));

  const _onUpdate = async () => {
    if (!_item.title) return;
    if (await onUpdate(_item)) {
      setItem({ title: "" } as Item);
    }
  };

  const _onRerank = async () => {
    const part = _item.part === Part.Top ? Part.Bottom : Part.Top;
    const newItem = { ..._item, part };
    await onUpdate(newItem);
    setItem(newItem);
  };

  return (
    <Container>
      <ContentContainer>
        <Title
          value={_item.title}
          onInput={(e) => setItem({ ..._item, title: e.currentTarget.value })}
          onBlur={() => _onUpdate()}
          placeholder={!_item.id ? "Create a new item" : "Title ..."}
        />

        <Description
          value={_item.description}
          rows={_item.description?.split("\n").length ?? 1}
          onInput={(e) =>
            setItem({ ..._item, description: e.currentTarget.value })
          }
          onBlur={() => _onUpdate()}
          placeholder="Description ..."
        />
      </ContentContainer>
      {item?.id && (
        <ControlsContainer>
          <Button variant="pink" onClick={_onRerank}>
            {_item.part === Part.Top ? <DownIcon /> : <UpIcon />}
          </Button>
          <Button variant="red" onClick={() => onDelete(_item)}>
            <TrashIcon />
          </Button>
        </ControlsContainer>
      )}
    </Container>
  );
};

export default ListItem;
