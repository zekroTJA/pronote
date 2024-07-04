import styled, { ThemeProvider, createGlobalStyle } from "styled-components";

import Home from "./routes/Home";
import List from "./routes/List";
import Login from "./routes/Login";
import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import useStoredTheme from "./hooks/useStoredTheme";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      {
        path: "/:listId",
        element: <List />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(p) => p.theme.background};
    color: ${(p) => p.theme.text};
    margin: 0;
    padding: 0;
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
