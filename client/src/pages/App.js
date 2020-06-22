import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import Loading from "../components/Shared/Loading";
import Error from "../components/Shared/Error";
import Search from "../components/Shared/Search";
import TrackList from "../components/Track/TrackList";
import CreateTrack from "../components/Track/CreateTrack";

export default function App() {
  // Hook into MUI stylesheet
  const classes = useStyles();

  // Component state
  const { loading, error, data } = useQuery(GET_TRACKS);
  const [searchResults, setSearchResults] = useState([]);

  if (loading) return <Loading />;
  if (error) return <Error error={error} />;

  const allTracks = data.tracks;

  // Render component
  return (
    <div className={classes.root}>
      <Search setSearchResults={setSearchResults} />
      <TrackList
        tracks={searchResults.length > 0 ? searchResults : allTracks}
      />
      <CreateTrack />
    </div>
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
      createdAt
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

// MUI component styling
const useStyles = makeStyles((theme) => ({
  // root: {
  //   display: "flex",
  //   flexDirection: "column",
  //   justifyContent: "space-evenly",
  // },
}));
