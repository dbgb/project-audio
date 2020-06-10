import React from "react";
import {
  MuiThemeProvider,
  responsiveFontSizes,
  createMuiTheme,
} from "@material-ui/core/styles";
import { deepPurple, grey } from "@material-ui/core/colors";
import { CssBaseline } from "@material-ui/core";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Auth from "./components/Auth";
import App from "./pages/App";
import Profile from "./pages/Profile";
import Header from "./components/Shared/Header";

export default function Root() {
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

  const { loading, error, data: isLoggedIn } = useQuery(IS_LOGGED_IN_QUERY);
  const { loading: userLoading, error: userError, data: userData } = useQuery(
    CURRENT_USER_QUERY
  );

  if (userLoading) return "Loading...";
  else if (userError) return `Error! ${userError.message}`;

  return (
    // Make mui theme available to to component tree via React context
    <MuiThemeProvider theme={theme}>
      {/* Create global css reset */}
      {/* https://material-ui.com/components/css-baseline/ */}
      <CssBaseline />
      {/* Client routing logic */}

      <BrowserRouter>
        <>
          <Header currentUser={userData.me} />
          <Switch>
            <Route exact path="/" component={isLoggedIn ? App : Auth} />
            <Route path="/profile/:id" component={Profile} />
          </Switch>
        </>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

// Queries
// Determine if user is logged in
const IS_LOGGED_IN_QUERY = gql`
  query {
    isLoggedIn @client
  }
`;

// Determine identity of current user
const CURRENT_USER_QUERY = gql`
  query {
    me {
      id
      username
    }
  }
`;
