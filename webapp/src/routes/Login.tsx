import { APIServiceInstance } from "../services/api";
import Banner from "../assets/banner.svg?react";
import Button from "../components/Button";
import styled from "styled-components";

const apiServiceInstance = APIServiceInstance;

const LOGIN_REDIRECT = import.meta.env.VITE_LOGIN_REDIRECT ?? "/";

const Container = styled.div`
  width: 100%;
  padding: 1em;
`;

const LoginContainer = styled.div`
  width: 100%;
  max-width: 14em;
  display: flex;
  flex-direction: column;
  gap: 1.5em;

  margin: 6em auto 0 auto;

  > ${Button} {
    width: 100%;
  }
`;

const Login: React.FC = () => {
  const onLoginClick = () => {
    apiServiceInstance.redirectLogin(LOGIN_REDIRECT);
  };

  return (
    <Container>
      <LoginContainer>
        <Banner />
        <Button onClick={onLoginClick}>Login with OAuth 2</Button>
      </LoginContainer>
    </Container>
  );
};

export default Login;
