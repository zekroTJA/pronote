import { useParams } from "react-router";

const List: React.FC = () => {
  const { listId } = useParams();

  return <>{listId}</>;
};

export default List;
