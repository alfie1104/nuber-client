import React from "react";
import { graphql } from "react-apollo";
import reset from "styled-reset";
import { IS_LOGGED_IN } from "./AppQueries";
import AppPresenter from "./AppPresenter";
import { createGlobalStyle, ThemeProvider } from "src/typed-component";
import theme from "../../theme";

const GlobalStyle = createGlobalStyle`
${reset}
`;

const AppContainer = ({ data }: { data?: any }) => (
  <ThemeProvider theme={theme}>
    <>
      <GlobalStyle />
      <AppPresenter isLoggedIn={data.auth.isLoggedIn} />
    </>
  </ThemeProvider>
);

export default graphql(IS_LOGGED_IN)(AppContainer);
