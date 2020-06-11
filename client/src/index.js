import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import {
  MuiThemeProvider,
  responsiveFontSizes,
  createMuiTheme,
} from "@material-ui/core/styles";
import { deepPurple, grey } from "@material-ui/core/colors";
import { CssBaseline } from "@material-ui/core";
import ApolloClient, { gql } from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { Query } from "@apollo/react-components";

import Root from "./Root";
import Auth from "./components/Auth";

// Implement global changes to default MUI theme settings
// https://material-ui.com/customization/theming/
let theme = createMuiTheme({
  palette: {
    primary: {
      light: deepPurple[300],
      main: deepPurple[500],
      dark: deepPurple[700],
    },
    secondary: {
      light: grey[500],
      main: grey[700],
      dark: grey[900],
    },
  },
});
theme = responsiveFontSizes(theme);

// Apollo boost client config
const client = new ApolloClient({
  // Register GraphQL endpoint
  uri: process.env.REACT_APP_GQL_ENDPOINT,
  clientState: {
    defaults: {
      // Truth test for presence of authentication token
      isLoggedIn: !!localStorage.getItem("authToken"),
    },
  },
  request: (operation) => {
    // Get JWT from local storage, if it exists
    const authToken = localStorage.getItem("authToken");
    // Set auth header, to allow auth checks to be made with each backend request
    operation.setContext({
      headers: {
        Authorization: authToken ? `JWT ${authToken}` : "",
      },
    });
  },
});

// Query Apollo state to determine if user is logged in
const IS_LOGGED_IN_QUERY = gql`
  query {
    isLoggedIn @client
  }
`;

ReactDOM.render(
  // Make Apollo client available to component tree via React context
  <ApolloProvider client={client}>
    {/* Make mui theme available to to component tree via React context */}
    <MuiThemeProvider theme={theme}>
      {/* Create global css reset */}
      {/* https://material-ui.com/components/css-baseline/ */}
      <CssBaseline />
      {/* Send user to main app, or auth if not logged in */}
      <Query query={IS_LOGGED_IN_QUERY}>
        {({ data }) => (data.isLoggedIn ? <Root /> : <Auth />)}
      </Query>
    </MuiThemeProvider>
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
