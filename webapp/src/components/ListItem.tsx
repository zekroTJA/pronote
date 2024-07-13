import { Item, Part } from "../models/models";
import { formatDuration, intervalToDuration } from "date-fns";

import Button from "./Button";
import ClockIcon from "../assets/clock.svg?react";
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

function fmtDuration(seconds: number): string {
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 });
  return formatDuration(duration, {
    zero: true,
    format: ["days", "hours", "minutes", "seconds"],
  });
}

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  opacity: 0;
  transition: opacity 0.2s ease;

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

const Expires = styled.div`
  display: flex;
  gap: 0.2em;
  align-items: center;
  font-size: 0.8em;
  opacity: 0.6;

  > svg {
    height: 1.2em;
  }
`;

const UnsavedIndicator = styled.div`
  width: 0.5em;
  height: 0.5em;
  border-radius: 100%;
  background-color: ${(p) => p.theme.text};
  margin-top: 0.3em;
`;

const ListItem: React.FC<Props> = ({ item, onUpdate, onDelete }) => {
  const [_item, setItem] = useState(item ?? ({ title: "" } as Item));
  const [unsaved, setUnsaved] = useState(false);

  const _setItem = (update: Partial<Item>) => {
    const newItem = { ..._item, ...update };
    setUnsaved(
      (newItem.title ?? "") !== (item?.title ?? "") ||
        (newItem.description ?? "") !== (item?.description ?? "")
    );
    setItem(newItem);
  };

  const _onUpdate = async () => {
    if (!_item.title) return;
    if (await onUpdate(_item)) {
      setItem({ title: "" } as Item);
    }
    setUnsaved(false);
  };

  const _onRerank = async () => {
    const part = _item.part === Part.Bottom ? Part.Top : Part.Bottom;
    const newItem = { ..._item, part };
    await onUpdate(newItem);
  };

  return (
    <Container>
      <ContentContainer>
        <Title
          value={_item.title}
          onInput={(e) => _setItem({ title: e.currentTarget.value })}
          onBlur={() => _onUpdate()}
          placeholder={!_item.id ? "Create a new item" : "Title ..."}
        />
        <Description
          value={_item.description}
          rows={_item.description?.split("\n").length ?? 1}
          onInput={(e) => _setItem({ description: e.currentTarget.value })}
          onBlur={() => _onUpdate()}
          placeholder="Description ..."
        />
        {_item.expires_in_seconds && _item.part === Part.Bottom && (
          <Expires>
            <ClockIcon />
            {fmtDuration(_item.expires_in_seconds)}
          </Expires>
        )}
      </ContentContainer>
      {unsaved && <UnsavedIndicator />}
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
