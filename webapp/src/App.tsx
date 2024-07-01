import styled, { ThemeProvider, createGlobalStyle } from "styled-components";

import Foo from "./routes/Foo";
import Home from "./routes/Home";
import Login from "./routes/Login";
import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import useStoredTheme from "./hooks/useStoredTheme";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/foo/:id",
    element: <Foo />,
  },
]);

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(p) => p.theme.background};
    color: ${(p) => p.theme.text};
  }

  &::-webkit-scrollbar-track {
    background: ${(p) => p.theme.background};
  }

  &::-webkit-scrollbar-thumb {
    background: ${(p) => p.theme.background3};
  }
`;

const Container = styled.div`
  width: 100%;
  height: 100vh;
`;

const App: React.FC = () => {
  const theme = useStoredTheme();

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <RouterProvider router={router} />
      </Container>
      <GlobalStyle />
    </ThemeProvider>
  );
};

export default App;
