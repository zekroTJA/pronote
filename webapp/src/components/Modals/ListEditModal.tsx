import React, { useEffect, useReducer } from "react";

import Button from "../Button";
import { DurationPicker } from "../DurationPicker";
import Input from "../Input";
import { ListUpdate } from "../../models/models";
import { Modal } from "../Modal";
import TextArea from "../TextArea";
import { styled } from "styled-components";

type Props = {
  show: boolean;
  initialState?: ListUpdate;
  onClose: () => void;
  onSubmit: (v: ListUpdate) => void;
};

type CreateState = {
  name: string;
  description: string;
  timeout_seconds: number;
  error?: string;
};

const stateReducer = (
  state: CreateState,
  [type, payload]:
    | ["set", CreateState]
    | ["set_name", string]
    | ["set_description", string]
    | ["set_timeout", number]
    | ["set_error", string?]
) => {
  switch (type) {
    case "set":
      return payload;
    case "set_name":
      return { ...state, name: payload };
    case "set_description":
      return { ...state, description: payload };
    case "set_timeout":
      return { ...state, timeout_seconds: payload };
    case "set_error":
      return { ...state, error: payload };
    default:
      return state;
  }
};

const BodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1em;
`;

const Label = styled.label`
  display: block;
  text-transform: uppercase;
  opacity: 0.5;
  font-size: 0.9rem;
  margin-bottom: 0.5em;
`;

const StyledModal = styled(Modal)``;

const ErrorText = styled.span`
  color: ${(p) => p.theme.red};
`;

const ListEditModal: React.FC<Props> = ({
  show,
  initialState,
  onSubmit,
  onClose,
}) => {
  const [state, dispatchState] = useReducer(stateReducer, {
    name: "",
    description: "",
    timeout_seconds: 0,
  } as CreateState);

  const onCreate = () => {
    if (!state.name) {
      dispatchState(["set_error", "Name can not be empty!"]);
      return;
    }
    onClose();
    onSubmit({
      name: state.name,
      description: nullify(state.description),
      timeout_seconds: nullify(state.timeout_seconds),
    });
  };

  const reset = () => {
    const s = initialState
      ? {
          name: initialState.name,
          description: initialState.description ?? "",
          timeout_seconds: initialState.timeout_seconds ?? 0,
        }
      : {
          name: "",
          description: "",
          timeout_seconds: 0,
          error: undefined,
        };
    dispatchState(["set", s]);
  };

  useEffect(() => {
    if (!show) return;
    reset();
  }, [show]);

  useEffect(() => {
    if (!initialState) return;
    reset();
  }, [initialState]);

  return (
    <StyledModal
      show={show}
      onClose={onClose}
      heading={initialState ? "Edit List" : "Create new List"}
      body={
        <BodyContainer>
          <div>
            <Label htmlFor="input-name">Name</Label>
            <Input
              id="input-name"
              value={state.name}
              onInput={(e) =>
                dispatchState(["set_name", e.currentTarget.value])
              }
            />
          </div>
          <div>
            <Label htmlFor="input-description">Description</Label>
            <TextArea
              id="input-description"
              value={state.description}
              onInput={(e) =>
                dispatchState(["set_description", e.currentTarget.value])
              }
            />
          </div>
          <div>
            <Label htmlFor="input-timeout">Timeout</Label>
            <DurationPicker
              value={state.timeout_seconds}
              onDurationInput={(v) => dispatchState(["set_timeout", v])}
            />
          </div>
          <div>{state.error && <ErrorText>{state.error}</ErrorText>}</div>
        </BodyContainer>
      }
      controls={[
        <Button variant="gray" onClick={onClose}>
          Cancel
        </Button>,
        <Button onClick={onCreate}>
          {initialState ? "Update" : "Create"}
        </Button>,
      ]}
    />
  );
};

function nullify<T>(v: T): T | undefined {
  if (!v) return undefined;
  return v;
}

export default ListEditModal;
