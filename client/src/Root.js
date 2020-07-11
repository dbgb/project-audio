import React from "react";
import { gql } from "apollo-boost";
import { useQuery, useApolloClient } from "@apollo/react-hooks";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import App from "./pages/App";
import Auth from "./components/Auth";
import Profile from "./pages/Profile";
import Uploads from "./pages/Uploads";
import Header from "./components/Shared/Header";
import Footer from "./components/Shared/Footer";
import Error from "./components/Shared/Error";
import Loading from "./components/Shared/Loading";

// Make current user info available to nested children without prop drilling
export const UserContext = React.createContext();

export default function Root() {
  // Hook into MUI stylesheet
  const classes = useStyles();

  // Component State
  const { loading, error, data } = useQuery(CURRENT_USER, {
    // Use cache, but also send network request to ensure up to date data
    fetchPolicy: "cache-and-network",
  });
  // Hook into Apollo client state to allow direct write
  const client = useApolloClient();

  if (loading) return <Loading className={classes.progressIcon} />;
  else if (error && error.message === "GraphQL error: Signature has expired") {
    // Reauthenticate on auth token expiry
    // TODO: Configure refresh token strategy
    client.writeData({ data: { isLoggedIn: false } });
    return <Auth />;
  } else if (error) return <Error error={error} />;

  const currentUser = data.me;

  return (
    // Client routing logic
    <Router>
      <UserContext.Provider value={currentUser}>
        <Container maxWidth="xl" className={classes.container} disableGutters>
          <Header currentUser={currentUser} />
          <Switch>
            <Route exact path="/" component={App} />
            <Route path="/profile/:id" component={Profile} />
            <Route path="/uploads/:id" component={Uploads} />
          </Switch>
        </Container>
        <Footer />
      </UserContext.Provider>
    </Router>
  );
}

// Queries / Mutations
export const CURRENT_USER = gql`
  query {
    me {
      id
      username
      email
      likeSet {
        track {
          id
        }
      }
    }
  }
`;

// MUI component styling
const useStyles = makeStyles((theme) => ({
  container: {
    // Implements flexbox sticky footer when combined with #root element styling
    flex: "1 0 auto",
    background: `linear-gradient(150deg, ${theme.palette.primary.light}, #eee 40%)`,
    overflowX: "hidden",
  },
  progressIcon: {
    margin: `${theme.spacing(2)}px 0`,
  },
}));
