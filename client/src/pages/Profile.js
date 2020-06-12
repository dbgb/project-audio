import React from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import Loading from "../components/Shared/Loading";
import Error from "../components/Shared/Error";

export default function Profile() {
  // Component state
  const { loading, error, data } = useQuery(CURRENT_USER);

  if (loading) return <Loading />;
  else if (error) return <Error error={error} />;

  return (
    <div className="App">
      <div>{`Welcome ${data.me.username}! (id: ${data.me.id})`}</div>
      <div>Email: {data.me.email}</div>
      <div>Date Joined: {data.me.dateJoined}</div>
    </div>
  );
}

// Queries / Mutations
const CURRENT_USER = gql`
  query {
    me {
      id
      username
      email
      dateJoined
    }
  }
`;
