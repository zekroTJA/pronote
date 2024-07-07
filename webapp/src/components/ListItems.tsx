import { Item, List, Part } from "../models/models";
import React, { useState } from "react";

import BulbIcon from "../assets/bulb.svg?react";
import ListItem from "./ListItem";
import Spoiler from "./Spoiler";
import { styled } from "styled-components";
import useApi from "../hooks/useApi";
import { useEffectAsync } from "../hooks/useEffectAsync";

type Props = {
  list: List;
};

const Container = styled.div`
  width: 100%;
  margin: 1em 0;
`;

const ItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5em;
`;

const PartHeading = styled.h2``;

const AddHeading = styled.span`
  text-transform: uppercase;
  font-size: 0.8em;
  opacity: 0.6;
  margin-top: 1em;
`;

const Hint = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8em;
  opacity: 0.6;
  font-size: 0.9em;

  > svg {
    height: 1.4em;
    min-width: 1.4em;
  }
`;

const StyledSpoiler = styled(Spoiler)`
  margin-top: 2em;
`;

const ListItems: React.FC<Props> = ({ list }) => {
  const fetch = useApi();

  const [items, setItems] = useState<Item[] | undefined>(undefined);

  useEffectAsync(async () => {
    const res = await fetch((c) => c.items(list.id));
    if (res) {
      setItems(res.items);
    }
  }, [list]);

  const updateItem = async (item: Item) => {
    if (!items) return false;

    await fetch((c) => c.update_items(list.id, item.id, item));

    const itemsCopy = [...items];
    const i = items.findIndex((i) => i.id === item.id);
    if (i < 0) return false;
    itemsCopy[i].title = item.title;
    itemsCopy[i].description = item.description;
    itemsCopy[i].part = item.part;
    setItems(itemsCopy);

    return false;
  };

  const deleteItem = async (item: Item) => {
    if (!items) return;

    await fetch((c) => c.delete_items(list.id, item.id));

    const newItems = items.filter((i) => i.id !== item.id);
    setItems(newItems);
  };

  const createItem = async (item: Item) => {
    if (!items) return false;

    const res = await fetch((c) =>
      c.add_items(list.id, { ...item, part: Part.Bottom })
    );

    if (res) {
      setItems([...items, res]);
    }

    return true;
  };

  const topPartItems = items
    ?.filter((i) => i.part === Part.Top)
    .map((i) => (
      <ListItem item={i} onUpdate={updateItem} onDelete={deleteItem} />
    ));

  const bottomPartItems = items
    ?.filter((i) => i.part === Part.Bottom)
    .map((i) => (
      <ListItem item={i} onUpdate={updateItem} onDelete={deleteItem} />
    ));

  const expiredItems = items
    ?.filter((i) => i.part === Part.Expired)
    .map((i) => (
      <ListItem item={i} onUpdate={updateItem} onDelete={deleteItem} />
    ));

  return (
    <Container>
      <PartHeading>Promoted</PartHeading>
      <ItemsContainer>
        {((topPartItems?.length ?? 0 > 0) && topPartItems) || (
          <Hint>
            <BulbIcon />
            Promoted items will be placed here and will never expire. This is
            the place where your most important notes and ideas live.
          </Hint>
        )}
      </ItemsContainer>
      <PartHeading>Stack</PartHeading>
      <ItemsContainer>
        {((bottomPartItems?.length ?? 0) > 0 && bottomPartItems) || (
          <Hint>
            <BulbIcon />
            Here, newly added notes and ideas will be placed. When the list has
            an expire time, they will be removed when the time has passed
            without editing. Promote them when you want to persist them!
          </Hint>
        )}
        <AddHeading>Add a new item</AddHeading>
        <ListItem onUpdate={createItem} onDelete={deleteItem} />
      </ItemsContainer>
      <StyledSpoiler header="Expired items">
        <ItemsContainer>
          {((expiredItems?.length ?? 0) > 0 && expiredItems) || (
            <Hint>
              <BulbIcon />
              Expired items will never be deleted and are tucked away safely
              here!
            </Hint>
          )}
        </ItemsContainer>
      </StyledSpoiler>
    </Container>
  );
};

export default ListItems;
