import React from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import moment from "moment";
import Loading from "../components/Shared/Loading";
import Error from "../components/Shared/Error";

export default function Profile() {
  // Component state
  const { loading, error, data } = useQuery(CURRENT_USER);

  if (loading) return <Loading />;
  else if (error) return <Error error={error} />;

  // Display date in human readable format, localized to user computer timezone
  let dateJoined = moment(data.me.dateJoined).format("MMMM Do YYYY, h:mm:ss a");

  return (
    <div className="App">
      <div>{`Welcome ${data.me.username}! (id: ${data.me.id})`}</div>
      <div>Email: {data.me.email}</div>
      <div>Date Joined: {dateJoined}</div>
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
