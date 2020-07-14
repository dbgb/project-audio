import React, { Fragment } from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useParams } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import Loading from "../components/Shared/Loading";
import Error from "../components/Shared/Error";
import UserCard from "../components/Shared/UserCard";
import TrackList from "../components/Track/TrackList";

/**
 * Determine a registered user from url params, then display their profile
 */
export default function Profile() {
  const classes = useStyles();

  // Access user id from url params
  const { id } = useParams();

  const { loading, error, data } = useQuery(USER_FROM_ID, {
    variables: { id: id },
  });

  if (loading) return <Loading linear />;
  else if (error) return <Error error={error} />;

  const userInfo = data.user;

  return (
    <Fragment>
      {/* Display user details */}
      <UserCard userID={id} {...userInfo} />
      {/* Display user favourites */}
      <Typography className={classes.title} variant="h5">
        {/* The capital A is intentional - it renders as a triangle with the assigned font */}
        fAvourites
      </Typography>
      {data.user.likeSet.length < 1 && (
        <Typography className={classes.emptyMessage}>
          No favourites yet!
        </Typography>
      )}
      <TrackList tracks={userInfo.likeSet.map(({ track }) => track)} />
      {/* Display user uploads */}
      <Typography className={classes.title} variant="h5">
        {/* The capital A is intentional - it renders as a triangle with the assigned font */}
        uploAds
      </Typography>
      {data.user.trackSet.length < 1 && (
        <Typography className={classes.emptyMessage}>
          Nothing uploaded yet!
        </Typography>
      )}
      <TrackList tracks={data.user.trackSet} />
    </Fragment>
  );
}

const USER_FROM_ID = gql`
  query($id: Int!) {
    user(id: $id) {
      id
      username
      email
      dateJoined
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
      likeSet {
        track {
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
  }
`;

const useStyles = makeStyles((theme) => ({
  title: {
    marginBottom: theme.spacing(1),
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
