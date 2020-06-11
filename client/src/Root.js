import React from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import App from "./pages/App";
import Profile from "./pages/Profile";
import Header from "./components/Shared/Header";

export default function Root() {
  // Fetch user data
  const { loading, error, data } = useQuery(CURRENT_USER_QUERY);

  if (loading) return "Loading...";
  else if (error) return `Error! ${error.message}`;

  return (
    // Client routing logic
    <BrowserRouter>
      <>
        <Header currentUser={data.me} />
        <Switch>
          <Route exact path="/" component={App} />
          <Route path="/profile/:id" component={Profile} />
        </Switch>
      </>
    </BrowserRouter>
  );
}

// Determine identity of current user
const CURRENT_USER_QUERY = gql`
  query {
    me {
      id
      username
    }
  }
`;
