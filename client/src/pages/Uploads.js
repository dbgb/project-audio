import React, { Fragment } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Loading from "../components/Shared/Loading";
import Error from "../components/Shared/Error";
import TrackList from "../components/Track/TrackList";
import { CURRENT_USER } from "../Root";

export default function Uploads() {
  // Hook into MUI stylesheet
  const classes = useStyles();

  // Component state
  const { loading: userLoading, error: userError, data: userData } = useQuery(
    CURRENT_USER
  );
  const {
    loading: tracksLoading,
    error: tracksError,
    data: tracksData,
  } = useQuery(USER_TRACKS, { variables: { id: userData.me.id } });

  if (userLoading || tracksLoading) return <Loading />;
  if (userError || tracksError) {
    let error = userError ? userError : tracksError;
    return <Error error={error} />;
  }

  const userTracks = tracksData.user.trackSet;

  // Render component
  return (
    <Fragment>
      <div className={classes.root}>
        <div className={classes.container}>
          <Typography className={classes.title} variant="h5">
            {userData.me.username}'s Uploads
          </Typography>
          {userTracks.length < 1 && (
            <Typography className={classes.emptyMessage}>
              Nothing uploaded yet!
            </Typography>
          )}
        </div>
      </div>
      <TrackList tracks={userTracks} />
    </Fragment>
  );
}

// Queries / Mutations
const USER_TRACKS = gql`
  query($id: Int!) {
    user(id: $id) {
      trackSet {
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
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: theme.spacing(1),
  },
  container: {
    flexBasis: "768px",
    margin: theme.spacing(1),
  },
  title: {
    padding: theme.spacing(0.5),
  },
  emptyMessage: {
    position: "relative",
    top: "70px",
    textAlign: "center",
  },
}));
