import { Item, List, Part } from "../models/models";
import React, { useState } from "react";

import ListItem from "./ListItem";
import { styled } from "styled-components";
import useApi from "../hooks/useApi";
import { useEffectAsync } from "../hooks/useEffectAsync";

type Props = {
  list: List;
};

const Container = styled.div`
  width: 100%;
`;

const ItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5em;
`;

const PartHeading = styled.h2``;

const ListItems: React.FC<Props> = ({ list }) => {
  const fetch = useApi();

  const [items, setItems] = useState<Item[] | undefined>(undefined);

  useEffectAsync(async () => {
    let res = await fetch((c) => c.items(list.id));
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

    let res = await fetch((c) =>
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

  return (
    <Container>
      <PartHeading>Promoted</PartHeading>
      <ItemsContainer>{items && topPartItems}</ItemsContainer>
      <PartHeading>Stack</PartHeading>
      <ItemsContainer>
        {items && bottomPartItems}
        <ListItem onUpdate={createItem} onDelete={deleteItem} />
      </ItemsContainer>
    </Container>
  );
};

export default ListItems;
