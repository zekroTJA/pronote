import Button from "../Button";
import { Modal } from "../Modal";
import { styled } from "styled-components";

type Props = {
  show: boolean;
  onClose: () => void;
};

const Container = styled.div`
  max-width: 32em;
  line-height: 1.5em;
  display: flex;
  flex-direction: column;
  gap: 1.5em;
`;

const BugReportModal: React.FC<Props> = ({ show, onClose }) => {
  return (
    <Modal
      show={show}
      onClose={onClose}
      heading={"Report a bug or an issue"}
      body={
        <Container>
          <span>
            If you found a bug or an issue with the application or if you want
            to suggest an idea, feel free to{" "}
            <a
              href="https://github.com/zekroTJA/pronote/issues/new"
              target="_blank"
            >
              create an issue on GitHub
            </a>
            .
          </span>
          <span>
            If you don't have a GitHub account, feel free to send me your
            feedback via an{" "}
            <a href="mailto:contact@zekro.de?subject=Pronote Issue Report">
              e-mail
            </a>
            .
          </span>
        </Container>
      }
      controls={[
        <Button variant="gray" onClick={onClose}>
          Close
        </Button>,
      ]}
    />
  );
};

export default BugReportModal;
