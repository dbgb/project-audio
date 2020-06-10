import React from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

export default function Profile() {
  // Component state
  const { loading: meLoading, error: meError, data: meData } = useQuery(
    ME_QUERY
  );

  if (meLoading) return <p>Loading...</p>;
  if (meError) return <p>{meError}</p>;

  return <div className="App">{JSON.stringify(meData)}</div>;
}

// Queries
const ME_QUERY = gql`
  {
    me {
      id
      username
      email
      dateJoined
    }
  }
`;
