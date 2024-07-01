import { APIServiceInstance } from "../services/api";
import Button from "../components/Button";

const apiServiceInstance = APIServiceInstance;

const Login: React.FC = () => {
  const onLoginClick = () => {
    apiServiceInstance.redirectLogin("/");
  };

  return (
    <>
      <Button onClick={onLoginClick}>Login</Button>
    </>
  );
};

export default Login;
