import React, { useState, Fragment } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import Loading from "../components/Shared/Loading";
import Error from "../components/Shared/Error";
import Search from "../components/Shared/Search";
import TrackList from "../components/Track/TrackList";
import CreateTrack from "../components/Track/CreateTrack";

export default function App() {
  // Component state
  const { loading, error, data } = useQuery(GET_TRACKS);
  const [searchResults, setSearchResults] = useState(null);

  if (loading) return <Loading linear />;
  if (error) return <Error error={error} />;

  const allTracks = data.tracks;

  // Render component
  return (
    <Fragment>
      <Search setSearchResults={setSearchResults} />
      <TrackList
        editable
        tracks={searchResults === null ? allTracks : searchResults}
      />
      <CreateTrack />
    </Fragment>
  );
}

// Queries / Mutations
export const GET_TRACKS = gql`
  query {
    tracks {
      id
      title
      description
      url
      postedBy {
        id
        username
      }
      likes {
        id
      }
    }
  }
`;
