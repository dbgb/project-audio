import React, { Fragment } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { useParams } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Loading from "../components/Shared/Loading";
import Error from "../components/Shared/Error";
import TrackList from "../components/Track/TrackList";

/**
 * Determine a registered user from url params, then display their uploaded
 * tracks
 */
export default function Uploads() {
  // Hook into MUI stylesheet
  const classes = useStyles();

  // Access user id from url params
  const { id } = useParams();

  const { loading, error, data } = useQuery(USER_INFO, {
    variables: { id: id },
    // Use cache, but also send network request to ensure up to date data
    fetchPolicy: "cache-and-network",
  });

  if (loading) return <Loading linear />;
  else if (error) {
    return <Error error={error} />;
  }

  const userTracks = data.user.trackSet;

  // Render component
  return (
    <Fragment>
      <div className={classes.root}>
        <div className={classes.container}>
          <Typography className={classes.title} variant="h5">
            {/* The capital A is intentional - it renders as a triangle with the assigned font */}
            uploAds
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
const USER_INFO = gql`
  query($id: Int!) {
    user(id: $id) {
      id
      username
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
    textAlign: "center",
    fontFamily: "'Major Mono Display', monospace, sans-serif",
  },
  emptyMessage: {
    textAlign: "center",
    position: "relative",
    top: "60px",
    [theme.breakpoints.down("xs")]: {
      top: "35px",
    },
  },
}));
