import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import Root from "./Root";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";

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
    // Set auth header, to allow auth checks to be made with each request
    operation.setContext({
      headers: {
        Authorization: authToken ? `JWT ${authToken}` : "",
      },
    });
  },
});

ReactDOM.render(
  // Make Apollo client available to component tree via React context */}
  <ApolloProvider client={client}>
    <Root />
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
