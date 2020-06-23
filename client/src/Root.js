import React from "react";
import { gql } from "apollo-boost";
import { useQuery, useApolloClient } from "@apollo/react-hooks";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import App from "./pages/App";
import Auth from "./components/Auth";
import Profile from "./pages/Profile";
import Header from "./components/Shared/Header";
import Footer from "./components/Shared/Footer";
import Error from "./components/Shared/Error";
import Loading from "./components/Shared/Loading";

export default function Root() {
  // Hook into MUI stylesheet
  const classes = useStyles();

  // Component State
  // Determine identity of current user
  const { loading, error, data } = useQuery(CURRENT_USER);
  // Hook into Apollo client state to allow direct write
  const client = useApolloClient();

  if (loading) return <Loading />;
  else if (error && error.message === "GraphQL error: Signature has expired") {
    // Reauthenticate on auth token expiry
    // TODO: Configure refresh token strategy
    client.writeData({ data: { isLoggedIn: false } });
    return <Auth />;
  } else if (error) return <Error error={error} />;

  return (
    // Client routing logic
    <Router>
      <>
        <main className={classes.main}>
          <Header currentUser={data.me} />
          <Switch>
            <Route exact path="/" component={App} />
            <Route path="/profile/:id" component={Profile} />
          </Switch>
        </main>
        <Footer />
      </>
    </Router>
  );
}

// Queries / Mutations
const CURRENT_USER = gql`
  query {
    me {
      id
      username
    }
  }
`;

// MUI component styling
const useStyles = makeStyles((theme) => ({
  main: {
    // Implements flexbox sticky footer when combined with #root element styling
    flexGrow: 1,
  },
}));
