import React from "react";
import { graphql } from "react-apollo";
import { ToastContainer } from "react-toastify";
import { IS_LOGGED_IN } from "./AppQueries";
import AppPresenter from "./AppPresenter";
import { ThemeProvider } from "src/typed-component";
import theme from "../../theme";
import "react-toastify/dist/ReactToastify.min.css";

const AppContainer = ({ data }: { data?: any }) => (
  <React.Fragment>
    <ThemeProvider theme={theme}>
      <AppPresenter isLoggedIn={data.auth.isLoggedIn} />
    </ThemeProvider>
    <ToastContainer draggable={true} position={"bottom-center"} />
  </React.Fragment>
);

export default graphql(IS_LOGGED_IN)(AppContainer);
