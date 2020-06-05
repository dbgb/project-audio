import React from "react";
import ReactDOM from "react-dom";
import {
  MuiThemeProvider,
  responsiveFontSizes,
  createMuiTheme,
} from "@material-ui/core/styles";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import * as serviceWorker from "./serviceWorker";
import App from "../src/pages/App";
import Auth from "./components/Auth";
import { CssBaseline } from '@material-ui/core';

// Implement global changes to default MUI theme settings
// https://material-ui.com/customization/theming/
let theme = createMuiTheme({
  palette: {
    primary: {
      light: "#d1d9ff",
      main: "#9fa8da",
      dark: "#6f79a8",
      contrastText: "#000",
    },
    secondary: {
      light: "#cfcfcf",
      main: "#9e9e9e",
      dark: "#707070",
      contrastText: "#000",
    },
  },
});
theme = responsiveFontSizes(theme);

// Register GraphQL endpoint with Apollo Client
const client = new ApolloClient({
  uri: process.env.REACT_APP_GQL_ENDPOINT,
});

ReactDOM.render(
  <React.StrictMode>
    {/* Make Apollo client available to component tree via React context */}
    <ApolloProvider client={client}>
      {/* Make mui theme available to to component tree via React context */}
      <MuiThemeProvider theme={theme}>
        {/* Create global css reset */}
        {/* https://material-ui.com/components/css-baseline/ */}
        <CssBaseline />
        {/* Render main app component */}
        <Auth />
      </MuiThemeProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
