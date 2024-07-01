import { useParams } from "react-router";

const Foo: React.FC = () => {
  const { id } = useParams();

  return (
    <>
      <p>Hello foo {id}!</p>
    </>
  );
};

export default Foo;
