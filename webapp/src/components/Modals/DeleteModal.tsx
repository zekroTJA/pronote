import Button from "../Button";
import { Modal } from "../Modal";

type Props = {
  show: boolean;
  elementName: string | JSX.Element;
  onClose: () => void;
  onSubmit: () => void;
};

const DeleteModal: React.FC<Props> = ({
  show,
  elementName,
  onClose,
  onSubmit,
}) => {
  const _onSubmit = () => {
    onClose();
    onSubmit();
  };

  return (
    <Modal
      show={show}
      onClose={onClose}
      heading={"Delete"}
      body={<>Do you really want to delete {elementName}?</>}
      controls={[
        <Button variant="gray" onClick={onClose}>
          Close
        </Button>,
        <Button variant="red" onClick={_onSubmit}>
          Delete
        </Button>,
      ]}
    />
  );
};

export default DeleteModal;
